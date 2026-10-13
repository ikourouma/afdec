"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { KeyRound, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const [ready, setReady] = useState(false);
  const [checked, setChecked] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // The recovery link signs the user in temporarily; wait for that session.
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
      setChecked(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    if (password.length < 8) {
      setIsError(true);
      setMessage("Use at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setIsError(true);
      setMessage("Passwords do not match.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      setIsError(true);
      setMessage(error.message);
      return;
    }
    await supabase.auth.signOut();
    window.location.assign("/auth?reset=done");
  }

  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="w-full max-w-[420px]">
        <Link href="/auth" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-300 hover:text-white mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to sign in
        </Link>
        <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">Set a new password</h1>

        {!checked ? (
          <p className="text-zinc-300">Checking your reset link...</p>
        ) : !ready ? (
          <p className="text-zinc-300">
            This reset link is invalid or has expired.{" "}
            <Link href="/auth" className="text-blue-400 underline">Request a new one</Link>.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            {message && (
              <div role="alert" className={`p-4 border text-sm font-semibold rounded-sm ${isError ? "bg-red-950/30 border-red-900/50 text-red-300" : "bg-emerald-950/30 border-emerald-900/50 text-emerald-300"}`}>
                {message}
              </div>
            )}
            <div>
              <label htmlFor="new-password" className="block text-xs font-bold text-zinc-300 uppercase tracking-widest mb-2">New password</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input id="new-password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8}
                  className="w-full bg-zinc-900/50 border border-zinc-800 text-white pl-12 pr-4 py-3.5 focus:outline-none focus:border-blue-500 rounded-sm" />
              </div>
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-xs font-bold text-zinc-300 uppercase tracking-widest mb-2">Confirm password</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input id="confirm-password" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={8}
                  className="w-full bg-zinc-900/50 border border-zinc-800 text-white pl-12 pr-4 py-3.5 focus:outline-none focus:border-blue-500 rounded-sm" />
              </div>
            </div>
            <button type="submit" disabled={busy}
              className="w-full bg-white hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-400 text-zinc-950 font-bold py-4 px-6 transition-colors rounded-sm">
              {busy ? "Saving..." : "Update password"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
