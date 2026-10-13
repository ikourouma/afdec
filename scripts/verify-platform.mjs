// Read-mostly end-to-end verification of roles, RLS and the tiered data model.
//
// It needs NO demo passwords: it creates throw-away test users with random
// passwords (verify-<role>-<id>@example.invalid), signs in as each one, runs the
// checks, then deletes every test user and test row it created.
//
// Run (PowerShell), with your own keys in the shell - never in the repo:
//   $env:SUPABASE_URL="https://<project>.supabase.co"
//   $env:SUPABASE_ANON_KEY="<anon key>"
//   $env:SUPABASE_SERVICE_ROLE_KEY="<service role key>"
//   node scripts/verify-platform.mjs
//
// Exit code 0 = all checks passed, 1 = at least one failure.

import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "node:crypto";

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !anonKey || !serviceKey) {
  console.error("Set SUPABASE_URL, SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY first.");
  process.exit(1);
}

const opts = { auth: { autoRefreshToken: false, persistSession: false } };
const mk = (key) => createClient(url, key, opts);
const admin = mk(serviceKey);
const anon = mk(anonKey);

const run = randomBytes(4).toString("hex");
const results = [];
const check = (group, name, ok, detail = "") => results.push({ group, name, ok: !!ok, detail: String(detail) });
const denied = (res) => !!res.error || !res.data || (Array.isArray(res.data) && res.data.length === 0);
const msg = (e) => (e ? `${e.code || ""} ${e.message}`.trim() : "");

const created = { users: [], newsletter: [], registry: [] };

// ---------------------------------------------------------------- anonymous
async function anonymousChecks() {
  const G = "anonymous";

  const teaser = await anon.from("v_country_teaser").select("*").limit(50);
  check(G, "v_country_teaser readable", !teaser.error && (teaser.data?.length ?? 0) > 0,
    teaser.error ? msg(teaser.error) : `${teaser.data?.length} rows`);
  const numericCols = new Set();
  for (const row of teaser.data ?? []) for (const [k, v] of Object.entries(row)) if (typeof v === "number") numericCols.add(k);
  check(G, "v_country_teaser exposes no numeric columns", numericCols.size === 0, [...numericCols].join(", "));

  const stats = await anon.from("v_diaspora_stats").select("*").limit(1);
  check(G, "v_diaspora_stats readable (aggregate only)", !stats.error && stats.data?.length === 1, msg(stats.error));

  for (const t of ["country_profiles", "country_indicators", "newsletter_subscribers", "deal_room_documents",
    "deal_room_access_requests", "deal_room_activity", "diaspora_registry", "audit_log", "sponsorships", "business_entities"]) {
    const r = await anon.from(t).select("*").limit(1);
    check(G, `${t} hidden from anonymous`, denied(r), r.error ? `denied: ${msg(r.error)}` : `${r.data?.length ?? 0} rows`);
  }

  const nEmail = `verify-news-${run}@example.invalid`;
  const n = await anon.from("newsletter_subscribers").insert({ email: nEmail, is_active: true });
  check(G, "anonymous newsletter signup allowed", !n.error, msg(n.error));
  if (!n.error) created.newsletter.push(nEmail);

  const reg = (email, extra) => ({
    full_name: "Verify Test", email, country_of_origin: "Ghana", residence_city: "Raleigh",
    residence_state: "NC", residence_country: "USA", profession: "Tester", education_level: "Other",
    family_size: 1, ...extra,
  });
  const rEmail = `verify-reg-${run}@example.invalid`;
  const withConsent = await anon.from("diaspora_registry")
    .insert(reg(rEmail, { consent_at: new Date().toISOString(), consent_version: "verify" }));
  check(G, "diaspora registry insert WITH consent allowed", !withConsent.error, msg(withConsent.error));
  if (!withConsent.error) created.registry.push(rEmail);

  const noConsentEmail = `verify-noconsent-${run}@example.invalid`;
  const noConsent = await anon.from("diaspora_registry").insert(reg(noConsentEmail, {}));
  check(G, "diaspora registry insert WITHOUT consent rejected", !!noConsent.error, noConsent.error ? msg(noConsent.error) : "insert succeeded");
  if (!noConsent.error) created.registry.push(noConsentEmail);

  const dup = await anon.from("diaspora_registry")
    .insert(reg(rEmail, { consent_at: new Date().toISOString(), consent_version: "verify" }));
  check(G, "duplicate registry email rejected (unique index)", dup.error?.code === "23505", dup.error ? msg(dup.error) : "duplicate accepted");
}

// ---------------------------------------------------------------- personas
// expected helper results: [is_super_admin, is_admin, is_staff, is_registered, has_member_access, has_deal_room_access]
const PERSONAS = {
  super_admin: [true, true, true, true, true, true],
  admin: [false, true, true, true, true, true],
  staff: [false, false, true, true, true, false],
  investor: [false, false, false, true, true, false],
  member: [false, false, false, true, true, false],
  registered: [false, false, false, true, false, false],
};
const HELPERS = ["is_super_admin", "is_admin", "is_staff", "is_registered", "has_member_access", "has_deal_room_access"];

async function makePersona(role) {
  const email = `verify-${role}-${run}@example.invalid`;
  const password = randomBytes(18).toString("base64url");
  const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
  if (error) throw new Error(`createUser ${role}: ${error.message}`);
  created.users.push(data.user.id);
  const { error: pErr } = await admin.from("profiles").upsert(
    { id: data.user.id, email, role, first_name: "Verify", last_name: role, status: "active" }, { onConflict: "id" });
  if (pErr) throw new Error(`profile ${role}: ${pErr.message}`);
  const client = mk(anonKey);
  const { error: sErr } = await client.auth.signInWithPassword({ email, password });
  if (sErr) throw new Error(`sign-in ${role}: ${sErr.message}`);
  return { role, id: data.user.id, email, client };
}

async function personaChecks() {
  const people = {};
  for (const role of Object.keys(PERSONAS)) people[role] = await makePersona(role);

  for (const [role, expected] of Object.entries(PERSONAS)) {
    const p = people[role];
    const G = role;

    const prof = await p.client.from("profiles").select("role,status").eq("id", p.id).single();
    check(G, "profiles.role matches", prof.data?.role === role, prof.error ? msg(prof.error) : `got ${prof.data?.role}`);

    for (let i = 0; i < HELPERS.length; i++) {
      const r = await p.client.rpc(HELPERS[i]);
      check(G, `${HELPERS[i]}() = ${expected[i]}`, !r.error && r.data === expected[i], r.error ? msg(r.error) : `got ${r.data}`);
    }

    const cp = await p.client.from("country_profiles").select("country_code").limit(1);
    check(G, "country_profiles readable (registered and above)", !cp.error && (cp.data?.length ?? 0) > 0,
      cp.error ? msg(cp.error) : `${cp.data?.length} rows`);

    const docs = await p.client.from("deal_room_documents").select("id").limit(1);
    const mayRead = PERSONAS[role][5];
    if (!mayRead) check(G, "deal room documents denied (not approved / no NDA)", denied(docs), docs.error ? msg(docs.error) : `${docs.data?.length} rows`);
    else check(G, "deal room documents query allowed", !docs.error, msg(docs.error));

    const audit = await p.client.from("audit_log").select("id").limit(1);
    if (["super_admin", "admin"].includes(role)) check(G, "audit_log readable", !audit.error, msg(audit.error));
    else check(G, "audit_log hidden", denied(audit), audit.error ? msg(audit.error) : `${audit.data?.length} rows`);

    if (!["super_admin", "admin"].includes(role)) {
      const esc = await p.client.from("profiles").update({ role: "super_admin" }).eq("id", p.id);
      const after = await admin.from("profiles").select("role").eq("id", p.id).single();
      check(G, "cannot self-escalate role via direct UPDATE", after.data?.role === role,
        `role now ${after.data?.role}${esc.error ? ` (${msg(esc.error)})` : ""}`);
    }
  }

  // --- role-change RPC rules
  const staffTry = await people.staff.client.rpc("admin_set_user_role", { target: people.member.id, new_role: "investor", justification: "verify" });
  check("rpc", "staff cannot call admin_set_user_role", !!staffTry.error, staffTry.error ? msg(staffTry.error) : "call succeeded");

  const adminGrant = await people.admin.client.rpc("admin_set_user_role", { target: people.member.id, new_role: "super_admin", justification: "verify" });
  check("rpc", "admin cannot grant super_admin", !!adminGrant.error, adminGrant.error ? msg(adminGrant.error) : "call succeeded");

  const adminOnSuper = await people.admin.client.rpc("admin_set_user_role", { target: people.super_admin.id, new_role: "member", justification: "verify" });
  check("rpc", "admin cannot demote a super_admin", !!adminOnSuper.error, adminOnSuper.error ? msg(adminOnSuper.error) : "call succeeded");

  const adminOk = await people.admin.client.rpc("admin_set_user_role", { target: people.registered.id, new_role: "staff", justification: "verify" });
  check("rpc", "admin can grant staff", !adminOk.error && adminOk.data === true, msg(adminOk.error));
  const saOk = await people.super_admin.client.rpc("admin_set_user_role", { target: people.registered.id, new_role: "registered", justification: "verify revert" });
  check("rpc", "super_admin can change roles", !saOk.error && saOk.data === true, msg(saOk.error));

  const audit = await admin.from("audit_log").select("id").eq("action", "role_change").eq("target_id", people.registered.id);
  check("rpc", "role changes are written to audit_log", (audit.data?.length ?? 0) >= 2, audit.error ? msg(audit.error) : `${audit.data?.length} entries`);

  // --- deal room: request -> approve -> NDA -> access
  const inv = people.investor;
  const ndaEarly = await inv.client.rpc("accept_deal_room_nda");
  check("deal room", "NDA cannot be accepted before approval", !!ndaEarly.error, ndaEarly.error ? msg(ndaEarly.error) : "accepted");

  const reqIns = await inv.client.from("deal_room_access_requests")
    .insert({ user_id: inv.id, full_name: "Verify Investor", organization: "Verify Capital", purpose: "verification run" })
    .select("id").single();
  check("deal room", "investor can file an access request", !reqIns.error && !!reqIns.data?.id, msg(reqIns.error));

  const stillNo = await inv.client.rpc("has_deal_room_access");
  check("deal room", "request alone grants no access", stillNo.data === false, `got ${stillNo.data}`);

  const selfApprove = await inv.client.rpc("admin_review_deal_room_request", { request_id: reqIns.data?.id, approve: true });
  check("deal room", "investor cannot approve own request", !!selfApprove.error, selfApprove.error ? msg(selfApprove.error) : "approved");

  const approve = await people.admin.client.rpc("admin_review_deal_room_request", { request_id: reqIns.data?.id, approve: true, note: "verify" });
  check("deal room", "admin can approve request", !approve.error && approve.data === true, msg(approve.error));

  const approvedNoNda = await inv.client.rpc("has_deal_room_access");
  check("deal room", "approved but NDA not accepted = no access", approvedNoNda.data === false, `got ${approvedNoNda.data}`);

  const nda = await inv.client.rpc("accept_deal_room_nda");
  check("deal room", "approved investor can accept NDA", !nda.error && nda.data === true, msg(nda.error));

  const nowYes = await inv.client.rpc("has_deal_room_access");
  check("deal room", "approved + NDA = access granted", nowYes.data === true, `got ${nowYes.data}`);

  const memberStill = await people.member.client.rpc("has_deal_room_access");
  check("deal room", "other users unaffected", memberStill.data === false, `got ${memberStill.data}`);
}

// ---------------------------------------------------------------- cleanup
async function cleanup() {
  for (const e of created.newsletter) await admin.from("newsletter_subscribers").delete().eq("email", e);
  for (const e of created.registry) await admin.from("diaspora_registry").delete().eq("email", e);
  for (const id of created.users) {
    await admin.from("deal_room_access_requests").delete().eq("user_id", id);
    await admin.from("deal_room_activity").delete().eq("user_id", id);
    await admin.from("profiles").delete().eq("id", id);
    await admin.auth.admin.deleteUser(id);
  }
}

// ---------------------------------------------------------------- main
try {
  await anonymousChecks();
  await personaChecks();
} catch (e) {
  check("harness", "unexpected error", false, e.message);
} finally {
  try { await cleanup(); } catch (e) { console.error("cleanup problem:", e.message); }
}

const pad = (s, n) => (s.length > n ? s.slice(0, n - 1) + "~" : s.padEnd(n));
console.log(`\n${pad("GROUP", 12)} ${pad("CHECK", 62)} ${pad("RESULT", 6)} DETAIL`);
for (const r of results) console.log(`${pad(r.group, 12)} ${pad(r.name, 62)} ${pad(r.ok ? "PASS" : "FAIL", 6)} ${r.ok ? "" : r.detail}`);
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} passed, ${failed.length} failed.`);
process.exit(failed.length ? 1 : 0);
