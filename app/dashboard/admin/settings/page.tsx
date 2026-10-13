"use client";

import React, { useState, useEffect } from "react";
import { Save, Shield, Globe } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

const FIELDS: { key: string; label: string; placeholder: string; type?: string }[] = [
  { key: "contact_email", label: "Public contact email", placeholder: "info@afdecnc.org", type: "email" },
  { key: "contact_phone", label: "Public phone", placeholder: "+1 …" },
  { key: "office_address", label: "Office address", placeholder: "Street, City, NC" },
  { key: "lead_notification_email", label: "Internal email for new leads", placeholder: "team@afdecnc.org", type: "email" },
  { key: "linkedin_url", label: "LinkedIn URL", placeholder: "https://linkedin.com/company/…", type: "url" },
  { key: "x_url", label: "X / Twitter URL", placeholder: "https://x.com/…", type: "url" },
  { key: "facebook_url", label: "Facebook URL", placeholder: "https://facebook.com/…", type: "url" },
];

export default function AdminSettingsPage() {
  const { user, isAdmin } = useAuth();
  const [values, setValues] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("key, value")
      .then(({ data }) => {
        const v: Record<string, string> = {};
        (data ?? []).forEach((r) => {
          v[r.key] = typeof r.value === "string" ? r.value : (r.value as { text?: string })?.text ?? "";
        });
        setValues(v);
        setIsLoading(false);
      });
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const rows = FIELDS.map((f) => ({ key: f.key, value: { text: values[f.key] || "" }, updated_by: user?.id, updated_at: new Date().toISOString() }));
    const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
    setMsg(error ? { kind: "err", text: "Could not save settings." } : { kind: "ok", text: "Settings saved." });
  }

  const input = "w-full bg-white border border-zinc-300 rounded-sm px-4 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="p-8 md:p-12 max-w-4xl mx-auto min-h-screen">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Admin Settings</h1>
        <p className="text-zinc-600 font-medium mt-1">Organisation details used across the site, and your account security.</p>
      </div>

      {msg && <p role="status" className={`mb-6 p-3 text-sm border rounded-sm ${msg.kind === "ok" ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-red-300 bg-red-50 text-red-800"}`}>{msg.text}</p>}

      {isLoading ? (
        <div className="p-12 text-center text-zinc-600 animate-pulse">Loading settings…</div>
      ) : (
        <div className="space-y-8">
          <form onSubmit={save} className="bg-white border border-zinc-200 rounded-md shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50 flex items-center space-x-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-zinc-900">Organisation</h2>
            </div>
            <div className="p-6 space-y-5">
              {FIELDS.map((f) => (
                <div key={f.key}>
                  <label htmlFor={`st-${f.key}`} className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2">{f.label}</label>
                  <input id={`st-${f.key}`} type={f.type || "text"} placeholder={f.placeholder} disabled={!isAdmin} value={values[f.key] || ""} onChange={(e) => setValues({ ...values, [f.key]: e.target.value })} className={input} />
                </div>
              ))}
              <button disabled={!isAdmin} className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-bold rounded-sm">
                <Save className="w-4 h-4" /> Save settings
              </button>
            </div>
          </form>

          <div className="bg-white border border-zinc-200 rounded-md shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50 flex items-center space-x-2">
              <Shield className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-zinc-900">Account &amp; security</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label htmlFor="st-email" className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2">Signed in as</label>
                <input id="st-email" readOnly value={user?.email || ""} className="w-full bg-zinc-50 border border-zinc-200 rounded-sm px-4 py-2.5 text-sm text-zinc-800" />
              </div>
              <button
                onClick={async () => {
                  const { error } = await supabase.auth.resetPasswordForEmail(user?.email || "", { redirectTo: `${window.location.origin}/auth/reset` });
                  setMsg(error ? { kind: "err", text: error.message } : { kind: "ok", text: "Password reset email sent." });
                }}
                className="px-4 py-2 bg-zinc-100 border border-zinc-300 text-sm font-semibold text-zinc-800 hover:bg-zinc-200 rounded-sm"
              >
                Send password reset email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
