// Creates the platform accounts in Supabase Auth and assigns their role.
// NO secrets live in this file. Run locally:
//
//   $env:SUPABASE_URL="https://<project>.supabase.co"
//   $env:SUPABASE_SERVICE_ROLE_KEY="<service role key>"
//   node scripts/provision-accounts.mjs
//
// Each NEW account gets a random password that is printed once. Existing accounts are left
// untouched (only their role is re-asserted). Rotate/reset passwords from the Supabase dashboard.
import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "node:crypto";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY first.");
  process.exit(1);
}

const ACCOUNTS = [
  { email: "admin@afdecnc.org", role: "super_admin", first: "AfDEC", last: "Super Admin" },
  { email: "admin@afronovation.com", role: "super_admin", first: "Afronovation", last: "Admin (backup)" },
  { email: "afdecadmin@afronovation.com", role: "super_admin", first: "AfDEC", last: "Admin (backup)" },
  { email: "investor@afdecnc.org", role: "investor", first: "AfDEC", last: "Investor" },
  { email: "member@afdecnc.org", role: "member", first: "AfDEC", last: "Member" },
];

const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
const { data: list, error: listErr } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
if (listErr) throw listErr;

for (const a of ACCOUNTS) {
  let user = list.users.find((u) => u.email?.toLowerCase() === a.email.toLowerCase());
  let note = "exists";
  if (!user) {
    const password = randomBytes(15).toString("base64url");
    const { data, error } = await supabase.auth.admin.createUser({
      email: a.email,
      password,
      email_confirm: true,
      user_metadata: { first_name: a.first, last_name: a.last },
    });
    if (error) {
      console.error(`FAILED ${a.email}: ${error.message}`);
      continue;
    }
    user = data.user;
    note = `created — temporary password: ${password}`;
  }
  const { error: pErr } = await supabase
    .from("profiles")
    .upsert({ id: user.id, email: a.email, role: a.role, first_name: a.first, last_name: a.last, status: "active" }, { onConflict: "id" });
  console.log(`${a.email} -> ${a.role} (${note})${pErr ? ` | profile error: ${pErr.message}` : ""}`);
}
