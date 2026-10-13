"use client";

import React, { useState, useEffect } from "react";
import { Handshake, Search, CheckCircle, XCircle, Trash2, Mail, Building2, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

interface MapReq { id: string; user_id: string; status: string; requested_at: string; name?: string; email?: string; organization?: string; deal_room_approved?: boolean }

function TerminalAccessQueue() {
  const { isAdmin, user } = useAuth();
  const [items, setItems] = useState<MapReq[]>([]);
  const [leads, setLeads] = useState<any[]>([]);

  const load = async () => {
    const { data } = await supabase.from("partner_map_requests").select("id, user_id, status, requested_at").order("requested_at", { ascending: false }).limit(100);
    const reqs = (data as MapReq[]) ?? [];
    const ids = reqs.map((r) => r.user_id);
    if (ids.length) {
      const { data: profs } = await supabase.from("profiles").select("id, first_name, last_name, email, organization, deal_room_approved").in("id", ids);
      const m = new Map((profs ?? []).map((p) => [p.id, p]));
      reqs.forEach((r) => {
        const p = m.get(r.user_id);
        if (p) { r.name = `${p.first_name || ""} ${p.last_name || ""}`.trim(); r.email = p.email; r.organization = p.organization; r.deal_room_approved = p.deal_room_approved; }
      });
    }
    setItems(reqs);
    const { data: l } = await supabase.from("lead_intakes").select("id, first_name, last_name, email, organization, raw_data, status, created_at").contains("raw_data", { type: "terminal_access" }).order("created_at", { ascending: false }).limit(50);
    setLeads(l ?? []);
  };
  useEffect(() => { load(); }, []);

  const decide = async (r: MapReq, approve: boolean) => {
    if (approve) {
      const { error } = await supabase.rpc("admin_set_user_access", { target: r.user_id, partner_approved: true, deal_room: !!r.deal_room_approved });
      if (error) return;
    }
    await supabase.from("partner_map_requests").update({ status: approve ? "approved" : "rejected", reviewed_at: new Date().toISOString(), reviewed_by: user?.id }).eq("id", r.id);
    load();
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-md shadow-sm overflow-hidden mb-10">
      <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50 text-zinc-800 font-bold text-sm">Intelligence terminal access requests (registered users)</div>
      <table className="w-full text-left text-sm">
        <thead><tr className="text-xs font-bold text-zinc-600 uppercase tracking-wider border-b border-zinc-200"><th className="px-6 py-3">User</th><th className="px-6 py-3">Organization</th><th className="px-6 py-3">Requested</th><th className="px-6 py-3">Status</th><th className="px-6 py-3 text-right">Decision</th></tr></thead>
        <tbody className="divide-y divide-zinc-100">
          {items.length === 0 && <tr><td colSpan={5} className="px-6 py-6 text-zinc-600">No requests.</td></tr>}
          {items.map((r) => (
            <tr key={r.id}>
              <td className="px-6 py-3"><p className="font-bold text-zinc-900">{r.name || "—"}</p><p className="text-xs text-zinc-600">{r.email}</p></td>
              <td className="px-6 py-3 text-zinc-800">{r.organization || "—"}</td>
              <td className="px-6 py-3 text-zinc-700">{new Date(r.requested_at).toLocaleDateString()}</td>
              <td className="px-6 py-3 text-xs font-bold uppercase text-zinc-800">{r.status}</td>
              <td className="px-6 py-3 text-right">
                {isAdmin && r.status === "pending" ? (
                  <span className="inline-flex gap-2">
                    <button onClick={() => decide(r, true)} className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-sm">Approve</button>
                    <button onClick={() => decide(r, false)} className="px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-sm">Reject</button>
                  </span>
                ) : <span className="text-xs text-zinc-600">{r.status === "pending" ? "Admin decision required" : "—"}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {leads.length > 0 && (
        <div className="border-t border-zinc-200 p-6">
          <p className="text-sm font-bold text-zinc-800 mb-3">Requests from visitors without an account (follow up by email)</p>
          <ul className="space-y-2 text-sm">
            {leads.map((l) => (
              <li key={l.id} className="text-zinc-800"><strong>{l.first_name} {l.last_name}</strong> · {l.email} · {l.organization} {l.raw_data?.country ? `· ${l.raw_data.country}` : ""} <span className="text-zinc-600">— {new Date(l.created_at).toLocaleDateString()}</span></li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function PartnerRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from('partner_requests')
      .select('*')
      .order('created_at', { ascending: false });
    setRequests(data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('partner_requests').update({ status }).eq('id', id);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this partner request?")) {
      await supabase.from('partner_requests').delete().eq('id', id);
      fetchData();
    }
  };

  return (
    <div className="p-8 md:p-12 max-w-[1600px] mx-auto min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Partner Requests</h1>
          <p className="text-zinc-500 font-medium mt-1">Review and verify incoming institutional and enterprise partnership applications.</p>
        </div>
        <div className="flex items-center space-x-3 bg-zinc-100 p-1.5 rounded-sm">
          <div className="px-4 py-2 bg-white rounded shadow-sm text-sm font-bold text-zinc-800">
            Pending: {requests.filter(r => r.status === 'pending' || !r.status).length}
          </div>
        </div>
      </div>

      <TerminalAccessQueue />

      <div className="bg-white border border-zinc-200 rounded-md shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-zinc-700 font-bold text-sm">
            <Handshake className="w-4 h-4" />
            <span>Partnership Applications</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-xs font-bold text-zinc-600 uppercase tracking-wider border-b border-zinc-200">
                <th className="px-6 py-4">Applicant Details</th>
                <th className="px-6 py-4">Organization</th>
                <th className="px-6 py-4">Submitted</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {isLoading ? (
                <tr><td colSpan={5} className="p-8 text-center text-zinc-500 font-bold tracking-widest uppercase text-xs animate-pulse">Loading requests...</td></tr>
              ) : requests.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-zinc-500 font-bold">No partner requests found.</td></tr>
              ) : requests.map((req) => (
                <tr key={req.id} className="hover:bg-zinc-50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-zinc-900">{req.full_name || req.contact_name || 'N/A'}</p>
                    <p className="text-xs text-zinc-500 flex items-center mt-1"><Mail className="w-3 h-3 mr-1" /> {req.email || req.contact_email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-zinc-700 font-medium">
                      <Building2 className="w-4 h-4 text-zinc-400 mr-2" />
                      {req.organization || req.company_name || "Individual"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-zinc-600 whitespace-nowrap">
                      <Clock className="w-3.5 h-3.5 text-zinc-400 mr-2" />
                      {new Date(req.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-widest rounded-full ${
                      req.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                      req.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {req.status || 'pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <button aria-label="Approve" onClick={() => updateStatus(req.id, 'approved')} className="p-2 text-zinc-400 hover:text-emerald-600 transition-colors" title="Approve">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button aria-label="Reject" onClick={() => updateStatus(req.id, 'rejected')} className="p-2 text-zinc-400 hover:text-red-600 transition-colors" title="Reject">
                        <XCircle className="w-4 h-4" />
                      </button>
                      <button aria-label="Delete" onClick={() => handleDelete(req.id)} className="p-2 text-zinc-400 hover:text-red-600 transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
