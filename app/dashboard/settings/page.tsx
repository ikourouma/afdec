"use client";

import React, { useEffect, useState } from "react";
import { SiteShell } from "@/components/ui/site-shell";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { ROLE_LABEL, homeForRole } from "@/lib/roles";
import Link from "next/link";

export default function AccountSettingsPage() {
  const { user, profile, role, loading, isSignedIn, refresh, signOut } = useAuth();
  const [form, setForm] = useState({ first_name: "", last_name: "", organization: "" });
  const [pw, setPw] = useState({ next: "", confirm: "" });
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (profile) setForm({ first_name: profile.first_name || "", last_name: profile.last_name || "", organization: profile.organization || "" });
  }, [profile]);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    const { error } = await supabase.from("profiles").update(form).eq("id", user.id);
    setBusy(false);
    if (error) return setMsg({ kind: "err", text: "Could not save your profile." });
    await refresh();
    setMsg({ kind: "ok", text: "Profile updated." });
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (pw.next.length < 12) return setMsg({ kind: "err", text: "Use at least 12 characters." });
    if (pw.next !== pw.confirm) return setMsg({ kind: "err", text: "Passwords do not match." });
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw.next });
    setBusy(false);
    if (error) return setMsg({ kind: "err", text: error.message });
    setPw({ next: "", confirm: "" });
    setMsg({ kind: "ok", text: "Password changed." });
  }

  const input = "w-full bg-zinc-900 border border-zinc-700 text-white rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-blue-500";
  const label = "block text-xs font-bold uppercase tracking-widest text-zinc-300 mb-2";

  return (
    <SiteShell>
      <section className="py-16 md:py-24">
        <div className="max-w-2xl mx-auto px-6">
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Account settings</h1>
          {loading ? (
            <p className="text-zinc-300">Loading…</p>
          ) : !isSignedIn ? (
            <p className="text-zinc-300">Please <Link href="/auth?redirect=/dashboard/settings" className="underline text-blue-300">sign in</Link>.</p>
          ) : (
            <>
              <p className="text-zinc-300 mb-8">
                {user?.email} · <span className="text-white font-bold">{role ? ROLE_LABEL[role] : ""}</span> ·{" "}
                <Link href={homeForRole(role ?? "registered") === "/" ? "/dashboard/member" : homeForRole(role ?? "registered")} className="underline text-blue-300">Back to dashboard</Link>
              </p>
              {msg && (
                <p role="status" className={`mb-6 text-sm p-3 border rounded-sm ${msg.kind === "ok" ? "border-emerald-500/40 text-emerald-300" : "border-red-500/40 text-red-300"}`}>{msg.text}</p>
              )}
              <form onSubmit={saveProfile} className="border border-zinc-700 bg-zinc-900/60 p-6 rounded-sm space-y-5 mb-8">
                <h2 className="text-lg font-bold text-white">Profile</h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div><label htmlFor="s-first" className={label}>First name</label><input id="s-first" className={input} value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} /></div>
                  <div><label htmlFor="s-last" className={label}>Last name</label><input id="s-last" className={input} value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} /></div>
                </div>
                <div><label htmlFor="s-org" className={label}>Organization</label><input id="s-org" className={input} value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} /></div>
                <button disabled={busy} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-bold uppercase tracking-widest text-sm px-6 py-3 rounded-sm">Save profile</button>
              </form>
              <form onSubmit={changePassword} className="border border-zinc-700 bg-zinc-900/60 p-6 rounded-sm space-y-5 mb-8">
                <h2 className="text-lg font-bold text-white">Change password</h2>
                <div><label htmlFor="s-pw" className={label}>New password</label><input id="s-pw" type="password" autoComplete="new-password" className={input} value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} /></div>
                <div><label htmlFor="s-pw2" className={label}>Confirm new password</label><input id="s-pw2" type="password" autoComplete="new-password" className={input} value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} /></div>
                <button disabled={busy} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-bold uppercase tracking-widest text-sm px-6 py-3 rounded-sm">Update password</button>
              </form>
              <button onClick={async () => { await signOut(); window.location.href = "/auth"; }} className="border border-zinc-600 hover:border-zinc-400 text-white font-bold uppercase tracking-widest text-sm px-6 py-3 rounded-sm">Sign out</button>
            </>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
