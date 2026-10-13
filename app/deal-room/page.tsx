"use client";

import React, { useCallback, useEffect, useState } from "react";
import { FileText, Lock, ShieldCheck, Download, Clock, Eye } from "lucide-react";
import { SiteShell } from "@/components/ui/site-shell";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

interface Doc {
  id: string;
  title: string;
  description: string | null;
  category: string;
  file_path: string | null;
  file_name: string | null;
  size_bytes: number | null;
  version: string | null;
}

type Req = { status: "pending" | "approved" | "rejected"; review_note: string | null } | null;

const NDA_TEXT = [
  "All materials in this Deal Room are confidential and provided solely so that you can evaluate a potential participation in an AfDEC-sponsored initiative.",
  "You will not copy, forward, publish or disclose the materials, or their contents, to any third party without the prior written consent of AfDEC.",
  "Every document view and download is recorded against your account. Access may be suspended or revoked at any time.",
  "These materials are not an offer to sell or a solicitation of an offer to buy any security. Figures are indicative and subject to due diligence.",
];

function formatSize(n: number | null) {
  if (!n) return "";
  return n > 1_048_576 ? `${(n / 1_048_576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`;
}

export default function DealRoomPage() {
  const { user, profile, loading, isSignedIn, isAdmin, refresh } = useAuth();
  const [req, setReq] = useState<Req>(null);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [agree, setAgree] = useState(false);
  const [form, setForm] = useState({ full_name: "", organization: "", investor_type: "", indicative_range: "", purpose: "" });

  const approved = isAdmin || !!profile?.deal_room_approved;
  const ndaDone = isAdmin || !!profile?.nda_accepted_at;
  const open = approved && ndaDone;

  const loadRequest = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("deal_room_access_requests")
      .select("status, review_note")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    setReq((data as Req) ?? null);
  }, [user]);

  useEffect(() => {
    void loadRequest();
  }, [loadRequest]);

  useEffect(() => {
    if (!open || !user) return;
    supabase
      .from("deal_room_documents")
      .select("id, title, description, category, file_path, file_name, size_bytes, version")
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data }) => setDocs((data as Doc[]) ?? []));
    void supabase.from("deal_room_activity").insert({ user_id: user.id, action: "open_room" });
  }, [open, user]);

  async function submitRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    setErr(null);
    const { error } = await supabase.from("deal_room_access_requests").insert({ user_id: user.id, ...form });
    setBusy(false);
    if (error && error.code !== "23505") return setErr("Could not submit your request. Please try again.");
    await loadRequest();
  }

  async function acceptNda() {
    setBusy(true);
    setErr(null);
    const { error } = await supabase.rpc("accept_deal_room_nda");
    setBusy(false);
    if (error) return setErr(error.message);
    await refresh();
  }

  async function openDoc(d: Doc, action: "view" | "download") {
    if (!d.file_path || !user) return;
    const { data, error } = await supabase.storage.from("deal-room").createSignedUrl(d.file_path, 60, action === "download" ? { download: d.file_name || true } : undefined);
    if (error || !data?.signedUrl) return setErr("This document is temporarily unavailable.");
    void supabase.from("deal_room_activity").insert({ user_id: user.id, document_id: d.id, action });
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  const input = "w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-400 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-blue-500";
  const label = "block text-xs font-bold uppercase tracking-widest text-zinc-300 mb-2";
  const btn = "bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-bold uppercase tracking-widest text-sm px-8 py-4 rounded-sm";

  return (
    <SiteShell>
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-800/80 border border-zinc-700 rounded-full mb-6">
            <Lock className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs font-bold tracking-[0.2em] text-zinc-300 uppercase">Confidential · Approved investors only</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">Investor Deal Room</h1>
          <p className="text-zinc-300 text-lg leading-relaxed mb-10">
            Offering documents, financial models and structure papers for AfDEC initiatives. Access is granted after review and a signed confidentiality undertaking.
          </p>
          {err && <p role="alert" className="mb-6 border border-red-500/40 text-red-300 p-3 text-sm rounded-sm">{err}</p>}

          {loading ? (
            <p className="text-zinc-300">Loading…</p>
          ) : !isSignedIn ? null : open ? (
            <div>
              <div className="flex items-center gap-2 text-emerald-300 text-sm mb-6"><ShieldCheck className="w-4 h-4" /> Access active. Views and downloads are logged to your account.</div>
              {docs.length === 0 ? (
                <p className="text-zinc-300 border border-zinc-700 p-6 rounded-sm">No documents have been published yet.</p>
              ) : (
                <ul className="space-y-3">
                  {docs.map((d) => (
                    <li key={d.id} className="border border-zinc-700 bg-zinc-900/60 p-5 rounded-sm flex flex-col sm:flex-row sm:items-center gap-4">
                      <FileText className="w-6 h-6 text-blue-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-bold">{d.title} <span className="text-zinc-400 font-normal text-sm">v{d.version}</span></p>
                        <p className="text-zinc-300 text-sm">{d.description}</p>
                        <p className="text-zinc-400 text-xs uppercase tracking-widest mt-1">{d.category} {d.size_bytes ? `· ${formatSize(d.size_bytes)}` : ""}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => openDoc(d, "view")} className="inline-flex items-center gap-2 border border-zinc-600 hover:border-zinc-400 text-white text-sm font-bold px-4 py-2 rounded-sm"><Eye className="w-4 h-4" /> View</button>
                        <button onClick={() => openDoc(d, "download")} className="inline-flex items-center gap-2 bg-white text-zinc-950 text-sm font-bold px-4 py-2 rounded-sm"><Download className="w-4 h-4" /> Download</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : approved ? (
            <div className="border border-zinc-700 bg-zinc-900/60 p-8 rounded-sm">
              <h2 className="text-xl font-bold text-white mb-4">Confidentiality undertaking</h2>
              <ul className="list-disc pl-5 space-y-2 text-zinc-300 mb-6">{NDA_TEXT.map((t) => <li key={t}>{t}</li>)}</ul>
              <label className="flex items-start gap-3 text-zinc-200 mb-6 cursor-pointer">
                <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 w-4 h-4" />
                <span>I have read and agree to the confidentiality undertaking on behalf of myself and {profile?.organization || "my organization"}.</span>
              </label>
              <button disabled={!agree || busy} onClick={acceptNda} className={btn}>{busy ? "Recording…" : "Accept and enter"}</button>
            </div>
          ) : req?.status === "pending" ? (
            <div className="border border-zinc-700 bg-zinc-900/60 p-8 rounded-sm">
              <Clock className="w-8 h-8 text-amber-400 mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Request under review</h2>
              <p className="text-zinc-300">The AfDEC team will notify {user?.email} once a decision is made.</p>
            </div>
          ) : (
            <form onSubmit={submitRequest} className="border border-zinc-700 bg-zinc-900/60 p-8 rounded-sm space-y-5">
              <h2 className="text-xl font-bold text-white">{req?.status === "rejected" ? "Previous request was not approved — submit a new one" : "Request Deal Room access"}</h2>
              {req?.status === "rejected" && req.review_note && <p className="text-zinc-300 text-sm">Note: {req.review_note}</p>}
              <div className="grid sm:grid-cols-2 gap-5">
                <div><label htmlFor="dr-name" className={label}>Full name</label><input id="dr-name" required className={input} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
                <div><label htmlFor="dr-org" className={label}>Organization</label><input id="dr-org" required className={input} value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} /></div>
                <div>
                  <label htmlFor="dr-type" className={label}>Investor type</label>
                  <select id="dr-type" required className={input} value={form.investor_type} onChange={(e) => setForm({ ...form, investor_type: e.target.value })}>
                    <option value="">Select…</option>
                    <option>Development finance institution</option>
                    <option>Family office</option>
                    <option>Corporate</option>
                    <option>Foundation</option>
                    <option>Individual / accredited</option>
                  </select>
                </div>
                <div><label htmlFor="dr-range" className={label}>Indicative range</label><input id="dr-range" placeholder="e.g. $250k–$1M" className={input} value={form.indicative_range} onChange={(e) => setForm({ ...form, indicative_range: e.target.value })} /></div>
              </div>
              <div><label htmlFor="dr-purpose" className={label}>Purpose</label><textarea id="dr-purpose" rows={3} className={input} value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} /></div>
              <button disabled={busy} className={btn}>{busy ? "Submitting…" : "Submit request"}</button>
            </form>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
