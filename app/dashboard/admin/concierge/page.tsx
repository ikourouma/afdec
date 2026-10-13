"use client";

import React, { useEffect, useState } from "react";
import { MessageSquare, Search, Mail, Building2, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Intake = {
  id: string;
  source: string;
  first_name: string;
  last_name: string;
  email: string;
  organization: string;
  industry: string;
  status: string;
  created_at: string;
  type: 'lead' | 'interest';
  message?: string;
};

export default function AdminConciergePage() {
  const [intakes, setIntakes] = useState<Intake[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchIntakes();
  }, []);

  async function fetchIntakes() {
    setIsLoading(true);
    try {
      const [{ data: leads }, { data: interests }] = await Promise.all([
        supabase.from('lead_intakes').select('*').order('created_at', { ascending: false }),
        supabase.from('fund_interests').select('*').order('created_at', { ascending: false })
      ]);

      const combined: Intake[] = [
        ...(leads || []).map((l: any) => ({ ...l, type: 'lead' as const })),
        ...(interests || []).map((i: any) => {
           const names = (i.full_name || '').split(' ');
           return {
             ...i,
             type: 'interest' as const,
             first_name: names[0] || '',
             last_name: names.slice(1).join(' '),
             source: 'fund_interest',
             industry: i.contribution_type || 'Philanthropy'
           };
        })
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setIntakes(combined);
    } catch (err) {
      console.error("Failed to sync concierge data:", err);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateStatus(id: string, type: 'lead' | 'interest', newStatus: string) {
    const table = type === 'lead' ? 'lead_intakes' : 'fund_interests';
    await supabase.from(table).update({ status: newStatus }).eq('id', id);
    setIntakes(prev => prev.map(i => i.id === id ? { ...i, status: newStatus } : i));
  }

  const filtered = intakes.filter(i => {
    const matchesSearch = `${i.first_name} ${i.last_name} ${i.email} ${i.organization}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || i.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700',
    contacted: 'bg-amber-100 text-amber-700',
    converted: 'bg-emerald-100 text-emerald-700',
  };

  return (
    <div className="p-8 md:p-12 max-w-[1600px] mx-auto min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Concierge Inbox</h1>
          <p className="text-zinc-500 font-medium mt-1">Manage lead intakes and fund interest submissions.</p>
        </div>
        <div className="flex items-center space-x-2 bg-zinc-100 p-1.5 rounded-sm">
          <div className="px-3 py-1.5 bg-white rounded shadow-sm text-xs font-bold text-zinc-800">
            {intakes.filter(i => i.status === 'new' || !i.status).length} New
          </div>
          <div className="px-3 py-1.5 bg-white rounded shadow-sm text-xs font-bold text-zinc-800">
            {intakes.length} Total
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-zinc-200 rounded-md shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-zinc-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            {['all', 'new', 'contacted', 'converted'].map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 text-xs font-bold rounded-sm transition-colors ${
                  filterStatus === s ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-xs font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-200">
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Organization</th>
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {isLoading ? (
                <tr><td colSpan={6} className="p-8 text-center text-zinc-500 font-bold tracking-widest uppercase text-xs animate-pulse">Loading inbox...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-zinc-500 font-bold">No submissions found.</td></tr>
              ) : filtered.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-zinc-900">{item.first_name} {item.last_name}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{item.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-zinc-700 font-medium">
                      <Building2 className="w-3.5 h-3.5 text-zinc-400 mr-2" />
                      {item.organization || "Individual"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                      item.type === 'lead' ? 'bg-zinc-200 text-zinc-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {item.type === 'lead' ? 'Lead' : 'Fund Interest'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-600 whitespace-nowrap">
                    <div className="flex items-center">
                      <Clock className="w-3.5 h-3.5 text-zinc-400 mr-1.5" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-widest rounded-full ${statusColors[item.status] || 'bg-blue-100 text-blue-700'}`}>
                      {item.status || 'new'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <a href={`mailto:${item.email}`} className="p-2 text-zinc-400 hover:text-blue-600 transition-colors" title="Email">
                        <Mail className="w-4 h-4" />
                      </a>
                      <button onClick={() => updateStatus(item.id, item.type, 'contacted')} className="p-2 text-zinc-400 hover:text-amber-600 transition-colors" title="Mark Contacted">
                        <AlertCircle className="w-4 h-4" />
                      </button>
                      <button onClick={() => updateStatus(item.id, item.type, 'converted')} className="p-2 text-zinc-400 hover:text-emerald-600 transition-colors" title="Mark Converted">
                        <CheckCircle2 className="w-4 h-4" />
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
