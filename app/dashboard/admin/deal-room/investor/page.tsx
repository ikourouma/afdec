"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { FileText, Trash2, Upload, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

type Tab = "requests" | "documents" | "activity";

interface Request {
  id: string;
  user_id: string;
  full_name: string | null;
  organization: string;
  investor_type: string | null;
  purpose: string | null;
  indicative_range: string | null;
  status: string;
  review_note: string | null;
  created_at: string;
}
interface Doc {
  id: string;
  title: string;
  description: string | null;
  category: string;
  file_path: string | null;
  file_name: string | null;
  size_bytes: number | null;
  version: string | null;
  is_active: boolean;
  created_at: string;
}
interface Act { id: string; user_id: string; document_id: string | null; action: string; created_at: string; who?: string; doc?: string }

const CATEGORIES = ["overview", "financials", "structure", "legal", "impact", "other"];
const MAX = 50 * 1024 * 1024;

export default function InvestorDealRoomAdmin() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("requests");
  const [requests, setRequests] = useState<Request[]>([]);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [acts, setActs] = useState<Act[]>([]);
  const [note, setNote] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ title: "", description: "", category: "overview", version: "1.0" });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const [r, d, a] = await Promise.all([
      supabase.from("deal_room_access_requests").select("*").order("created_at", { ascending: false }),
      supabase.from("deal_room_documents").select("*").order("sort_order").order("created_at", { ascending: false }),
      supabase.from("deal_room_activity").select("*").order("created_at", { ascending: false }).limit(200),
    ]);
    setRequests((r.data as Request[]) ?? []);
    const documents = (d.data as Doc[]) ?? [];
    setDocs(documents);
    const activity = (a.data as Act[]) ?? [];
    const uids = Array.from(new Set(activity.map((x) => x.user_id)));
    if (uids.length) {
      const { data: profs } = await supabase.from("profiles").select("id, email, first_name, last_name").in("id", uids);
      const m = new Map((profs ?? []).map((p) => [p.id, p]));
      activity.forEach((x) => {
        const p = m.get(x.user_id);
        x.who = p ? `${`${p.first_name || ""} ${p.last_name || ""}`.trim() || p.email} (${p.email})` : x.user_id;
        x.doc = documents.find((doc) => doc.id === x.document_id)?.title;
      });
    }
    setActs(activity);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function review(r: Request, approve: boolean) {
    setBusy(true);
    const { error } = await supabase.rpc("admin_review_deal_room_request", { request_id: r.id, approve, note: note[r.id] || null });
    setBusy(false);
    if (!error) {
      setMsg({ kind: "ok", text: approve ? "Approved. The investor must now accept the NDA." : "Request declined." });
      void load();
    }
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!form.title.trim()) return setMsg({ kind: "err", text: "Enter a title first." });
    if (file.size > MAX) return setMsg({ kind: "err", text: "File exceeds 50 MB." });
    setBusy(true);
    setMsg(null);
    const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
    const path = `docs/${Date.now()}-${safe}`;
    const { error: upErr } = await supabase.storage.from("deal-room").upload(path, file, { contentType: file.type });
    if (upErr) {
      setBusy(false);
      return;
    }
    const { error } = await supabase.from("deal_room_documents").insert({
      ...form,
      file_path: path,
      file_name: file.name,
      mime_type: file.type,
      size_bytes: file.size,
      uploaded_by: user?.id,
    });
    setBusy(false);
    if (error) {
      await supabase.storage.from("deal-room").remove([path]);
      return;
    }
    setForm({ title: "", description: "", category: "overview", version: "1.0" });
    setMsg({ kind: "ok", text: "Document uploaded to the private bucket." });
    void load();
  }

  async function toggle(d: Doc) {
    await supabase.from("deal_room_documents").update({ is_active: !d.is_active }).eq("id", d.id);
    void load();
  }

  async function remove(d: Doc) {
    if (!confirm(`Delete "${d.title}" permanently?`)) return;
    if (d.file_path) await supabase.storage.from("deal-room").remove([d.file_path]);
    await supabase.from("deal_room_documents").delete().eq("id", d.id);
    void load();
  }

  const input = "w-full bg-white border border-zinc-300 text-zinc-900 text-sm rounded-sm p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const lbl = "block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1";
  const tabBtn = (t: Tab, label: string) => (
    <button onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-bold border-b-2 ${tab === t ? "border-blue-600 text-blue-700" : "border-transparent text-zinc-600 hover:text-zinc-900"}`}>{label}</button>
  );

  return (
    <div className="p-8 md:p-12 max-w-[1400px] mx-auto min-h-screen">
      <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Investor Deal Room</h1>
      <p className="text-zinc-600 font-medium mt-1 mb-6">Gated access for the $15M raise: review requests, publish confidential documents, and audit who opened what.</p>
      {msg && <p role="status" className={`mb-6 p-3 text-sm border rounded-sm ${msg.kind === "ok" ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-red-300 bg-red-50 text-red-800"}`}>{msg.text}</p>}
      <div className="flex border-b border-zinc-200 mb-6">
        {tabBtn("requests", `Requests (${requests.filter((r) => r.status === "pending").length} pending)`)}
        {tabBtn("documents", `Documents (${docs.length})`)}
        {tabBtn("activity", "Activity log")}
      </div>

      {tab === "requests" && (
        <div className="space-y-4">
          {requests.length === 0 && <p className="text-zinc-600">No requests yet.</p>}
          {requests.map((r) => (
            <div key={r.id} className="bg-white border border-zinc-200 rounded-md p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-zinc-900">{r.full_name} — {r.organization}</p>
                  <p className="text-sm text-zinc-700">{r.investor_type} · {r.indicative_range || "range not stated"} · {new Date(r.created_at).toLocaleDateString()}</p>
                  {r.purpose && <p className="text-sm text-zinc-700 mt-2">{r.purpose}</p>}
                </div>
                <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-800">{r.status}</span>
              </div>
              {r.status === "pending" && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <input aria-label="Review note" placeholder="Note (optional, shown on decline)" value={note[r.id] || ""} onChange={(e) => setNote({ ...note, [r.id]: e.target.value })} className={`${input} max-w-sm`} />
                  <button disabled={busy} onClick={() => review(r, true)} className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold rounded-sm">Approve</button>
                  <button disabled={busy} onClick={() => review(r, false)} className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-sm font-bold rounded-sm">Decline</button>
                </div>
              )}
              {r.review_note && r.status !== "pending" && <p className="text-xs text-zinc-600 mt-2">Note: {r.review_note}</p>}
            </div>
          ))}
        </div>
      )}

      {tab === "documents" && (
        <div className="grid lg:grid-cols-[360px_1fr] gap-6">
          <div className="bg-white border border-zinc-200 rounded-md p-5 space-y-3 h-fit">
            <h2 className="font-extrabold text-zinc-900">Add document</h2>
            <div><label htmlFor="dd-title" className={lbl}>Title</label><input id="dd-title" className={input} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div><label htmlFor="dd-desc" className={lbl}>Description</label><input id="dd-desc" className={input} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label htmlFor="dd-cat" className={lbl}>Category</label><select id="dd-cat" className={input} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></div>
              <div><label htmlFor="dd-ver" className={lbl}>Version</label><input id="dd-ver" className={input} value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })} /></div>
            </div>
            <button disabled={busy} onClick={() => fileRef.current?.click()} className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-bold rounded-sm"><Upload className="w-4 h-4" /> {busy ? "Uploading…" : "Choose file & upload"}</button>
            <input ref={fileRef} type="file" hidden onChange={onFile} />
            <p className="text-xs text-zinc-600">Stored in a private bucket. Investors receive 60-second signed links; every access is logged.</p>
          </div>
          <div className="space-y-3">
            {docs.length === 0 && <p className="text-zinc-600">No documents uploaded.</p>}
            {docs.map((d) => (
              <div key={d.id} className="bg-white border border-zinc-200 rounded-md p-4 flex items-center gap-4">
                <FileText className="w-6 h-6 text-blue-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-zinc-900">{d.title} <span className="text-zinc-600 font-normal text-sm">v{d.version} · {d.category}</span></p>
                  <p className="text-xs text-zinc-600 truncate">{d.file_name}{d.description ? ` — ${d.description}` : ""}</p>
                </div>
                <button aria-label={d.is_active ? "Hide document" : "Show document"} onClick={() => toggle(d)} className="p-2 text-zinc-700 hover:bg-zinc-100 rounded-sm">{d.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}</button>
                <button aria-label="Delete document" onClick={() => remove(d)} className="p-2 text-red-700 hover:bg-red-50 rounded-sm"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "activity" && (
        <div className="bg-white border border-zinc-200 rounded-md overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead><tr className="text-xs font-bold text-zinc-600 uppercase tracking-wider border-b border-zinc-200"><th className="px-5 py-3">When</th><th className="px-5 py-3">Who</th><th className="px-5 py-3">Action</th><th className="px-5 py-3">Document</th></tr></thead>
            <tbody className="divide-y divide-zinc-100">
              {acts.length === 0 && <tr><td colSpan={4} className="px-5 py-6 text-zinc-600">No activity yet.</td></tr>}
              {acts.map((a) => (
                <tr key={a.id}><td className="px-5 py-2 text-zinc-700">{new Date(a.created_at).toLocaleString()}</td><td className="px-5 py-2 text-zinc-900">{a.who}</td><td className="px-5 py-2 font-bold text-zinc-800">{a.action.replace("_", " ")}</td><td className="px-5 py-2 text-zinc-700">{a.doc || "—"}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
