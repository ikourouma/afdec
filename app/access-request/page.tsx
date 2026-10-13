"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Lock, ShieldCheck, CheckCircle2, Clock, ArrowRight } from "lucide-react";
import { SiteShell } from "@/components/ui/site-shell";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

type ReqStatus = "pending" | "approved" | "rejected" | null;

function safeNext(next: string | null) {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/africa-intelligence";
}

function AccessRequestInner() {
  const params = useSearchParams();
  const country = params.get("country");
  const next = safeNext(params.get("next"));
  const { user, profile, loading, isSignedIn, hasMemberAccess } = useAuth();

  const [status, setStatus] = useState<ReqStatus>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", organization: "", message: "" });

  const approved = hasMemberAccess || profile?.is_partner_approved;

  useEffect(() => {
    if (!user) return;
    supabase
      .from("partner_map_requests")
      .select("status")
      .eq("user_id", user.id)
      .order("requested_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => setStatus((data?.status as ReqStatus) ?? null));
  }, [user]);

  async function requestAsMember() {
    if (!user) return;
    setBusy(true);
    setError(null);
    const { error: err } = await supabase.from("partner_map_requests").insert({ user_id: user.id });
    setBusy(false);
    if (err && err.code !== "23505") return setError("We could not submit your request. Please try again.");
    setStatus("pending");
  }

  async function requestAsGuest(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: err } = await supabase.from("lead_intakes").insert({
      source: "contact_form",
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      organization: form.organization,
      raw_data: { type: "terminal_access", country, message: form.message },
    });
    setBusy(false);
    if (err) return setError("We could not submit your request. Please try again.");
    setDone(true);
  }

  const input =
    "w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-400 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-blue-500";
  const label = "block text-xs font-bold uppercase tracking-widest text-zinc-300 mb-2";

  return (
    <section className="bg-zinc-950 py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-800/80 border border-zinc-700 rounded-full mb-6">
          <Lock className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-xs font-bold tracking-[0.2em] text-zinc-300 uppercase">Partner Intelligence Access</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">Request access to the full country brief</h1>
        <p className="text-zinc-300 text-lg leading-relaxed mb-10">
          Country briefs, sector intelligence, risk &amp; mitigation analysis and reports are available to registered AfDEC partners.
          {country ? <> You asked for <strong className="text-white">{country}</strong>.</> : null}
        </p>

        {loading ? (
          <p className="text-zinc-300">Checking your account…</p>
        ) : approved ? (
          <div className="border border-emerald-500/30 bg-emerald-500/5 p-8 rounded-sm">
            <ShieldCheck className="w-8 h-8 text-emerald-400 mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">You already have access</h2>
            <Link href={country ? `/africa-intelligence/${encodeURIComponent(country)}` : next} className="inline-flex items-center gap-2 mt-4 bg-white text-zinc-950 font-bold px-6 py-3 rounded-sm">
              Open the terminal <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : isSignedIn ? (
          <div className="border border-zinc-700 bg-zinc-900/60 p-8 rounded-sm">
            {status === "pending" ? (
              <div>
                <Clock className="w-8 h-8 text-amber-400 mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Request under review</h2>
                <p className="text-zinc-300">The AfDEC team will notify <strong className="text-white">{user?.email}</strong> once your access is approved.</p>
              </div>
            ) : status === "rejected" ? (
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Request not approved</h2>
                <p className="text-zinc-300">Please <Link href="/contact" className="underline text-blue-300">contact the team</Link> if you believe this is an error.</p>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Signed in as {user?.email}</h2>
                <p className="text-zinc-300 mb-6">Submit a partner access request. Approval is reviewed by AfDEC staff.</p>
                <button onClick={requestAsMember} disabled={busy} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-bold uppercase tracking-widest text-sm px-8 py-4 rounded-sm">
                  {busy ? "Submitting…" : "Request partner access"}
                </button>
              </div>
            )}
            {error && <p role="alert" className="text-red-300 mt-4 text-sm">{error}</p>}
          </div>
        ) : done ? (
          <div className="border border-emerald-500/30 bg-emerald-500/5 p-8 rounded-sm">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Request received</h2>
            <p className="text-zinc-300">Thank you. The AfDEC team will contact you at <strong className="text-white">{form.email}</strong>. You can also create a free account to speed up review.</p>
            <Link href={`/auth?redirect=${encodeURIComponent(next)}`} className="inline-block mt-4 underline text-blue-300">Create an account or sign in</Link>
          </div>
        ) : (
          <form onSubmit={requestAsGuest} className="border border-zinc-700 bg-zinc-900/60 p-8 rounded-sm space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="ar-first" className={label}>First name</label>
                <input id="ar-first" required className={input} value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
              </div>
              <div>
                <label htmlFor="ar-last" className={label}>Last name</label>
                <input id="ar-last" required className={input} value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
              </div>
            </div>
            <div>
              <label htmlFor="ar-email" className={label}>Work email</label>
              <input id="ar-email" type="email" required className={input} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label htmlFor="ar-org" className={label}>Organization</label>
              <input id="ar-org" required className={input} value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} />
            </div>
            <div>
              <label htmlFor="ar-msg" className={label}>What do you need access for?</label>
              <textarea id="ar-msg" rows={4} className={input} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </div>
            {error && <p role="alert" className="text-red-300 text-sm">{error}</p>}
            <div className="flex flex-col sm:flex-row gap-3">
              <button type="submit" disabled={busy} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-bold uppercase tracking-widest text-sm px-8 py-4 rounded-sm">
                {busy ? "Submitting…" : "Submit request"}
              </button>
              <Link href={`/auth?redirect=${encodeURIComponent(`/access-request${country ? `?country=${encodeURIComponent(country)}` : ""}`)}`} className="text-center border border-zinc-600 hover:border-zinc-400 text-white font-bold uppercase tracking-widest text-sm px-8 py-4 rounded-sm">
                I have an account
              </Link>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

export default function AccessRequestPage() {
  return (
    <SiteShell>
      <Suspense fallback={<div className="py-32 text-center text-zinc-300">Loading…</div>}>
        <AccessRequestInner />
      </Suspense>
    </SiteShell>
  );
}
