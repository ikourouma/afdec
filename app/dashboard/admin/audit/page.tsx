"use client";

import React, { useEffect, useMemo, useState } from "react";
import { RefreshCw, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Entry {
  id: string;
  actor_email: string | null;
  action: string;
  target_type: string | null;
  target_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

export default function AuditLogPage() {
  const [rows, setRows] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [action, setAction] = useState("all");

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("audit_log").select("*").order("created_at", { ascending: false }).limit(500);
    setRows((data as Entry[]) ?? []);
    setLoading(false);
  }
  useEffect(() => {
    void load();
  }, []);

  const actions = useMemo(() => Array.from(new Set(rows.map((r) => r.action))).sort(), [rows]);
  const visible = rows.filter(
    (r) => (action === "all" || r.action === action) && (!q || JSON.stringify(r).toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="p-8 md:p-12 max-w-[1400px] mx-auto min-h-screen">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Audit Log</h1>
          <p className="text-zinc-600 font-medium mt-1">Immutable record of role changes, suspensions, access grants and Deal Room decisions. Last 500 events.</p>
        </div>
        <button onClick={load} className="inline-flex items-center px-4 py-2 border border-zinc-300 bg-white hover:bg-zinc-50 text-sm font-bold text-zinc-800 rounded-sm">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input aria-label="Search audit log" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="pl-9 pr-3 py-2 w-72 border border-zinc-300 rounded-sm text-sm text-zinc-900" />
        </div>
        <select aria-label="Filter by action" value={action} onChange={(e) => setAction(e.target.value)} className="border border-zinc-300 rounded-sm text-sm py-2 px-3 text-zinc-900">
          <option value="all">All actions</option>
          {actions.map((a) => <option key={a}>{a}</option>)}
        </select>
      </div>
      <div className="bg-white border border-zinc-200 rounded-md overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead><tr className="text-xs font-bold text-zinc-600 uppercase tracking-wider border-b border-zinc-200"><th className="px-5 py-3">When</th><th className="px-5 py-3">Actor</th><th className="px-5 py-3">Action</th><th className="px-5 py-3">Target</th><th className="px-5 py-3">Details</th></tr></thead>
          <tbody className="divide-y divide-zinc-100">
            {!loading && visible.length === 0 && <tr><td colSpan={5} className="px-5 py-8 text-zinc-600">No events.</td></tr>}
            {visible.map((r) => (
              <tr key={r.id} className="align-top">
                <td className="px-5 py-2 text-zinc-700 whitespace-nowrap">{new Date(r.created_at).toLocaleString()}</td>
                <td className="px-5 py-2 text-zinc-900">{r.actor_email || "system"}</td>
                <td className="px-5 py-2 font-bold text-zinc-800">{r.action}</td>
                <td className="px-5 py-2 text-zinc-700">{r.target_type}{r.target_id ? ` · ${r.target_id.slice(0, 8)}` : ""}</td>
                <td className="px-5 py-2 text-xs text-zinc-700 font-mono break-all max-w-md">{r.details ? JSON.stringify(r.details) : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
