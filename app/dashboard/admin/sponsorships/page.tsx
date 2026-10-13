"use client";

import React, { useState, useEffect } from "react";
import { BadgeDollarSign, Plus, Edit3, Trash2, X, Save, DollarSign } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ImageField } from "@/components/admin/asset-picker";

export default function SponsorshipsAdminPage() {
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<any>({
    company_name: "", contact_name: "", contact_email: "", tier: "gold",
    amount: 0, status: "active", start_date: "", end_date: "", notes: ""
  });

  const fetchData = async () => {
    setIsLoading(true);
    const { data, error: err } = await supabase
      .from('sponsorships')
      .select('*')
      .order('created_at', { ascending: false });
    if (err) setError(err.message);
    setSponsors(data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const { id, created_at, ...rest } = form;
    const payload = { ...rest, start_date: rest.start_date || null, end_date: rest.end_date || null, amount: Number(rest.amount) || 0 };
    const { error: err } = id
      ? await supabase.from('sponsorships').update(payload).eq('id', id)
      : await supabase.from('sponsorships').insert([payload]);
    if (err) { setError(err.message); return; }
    setError(null);
    setIsFormOpen(false);
    setForm({ company_name: "", contact_name: "", contact_email: "", tier: "gold", amount: 0, status: "active", start_date: "", end_date: "", notes: "" });
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this sponsorship record?")) {
      const { error: err } = await supabase.from('sponsorships').delete().eq('id', id);
      if (err) setError(err.message);
      fetchData();
    }
  };

  const openForm = (s?: any) => {
    setForm(s || { company_name: "", contact_name: "", contact_email: "", tier: "gold", amount: 0, status: "active", start_date: "", end_date: "", notes: "" });
    setIsFormOpen(true);
  };

  const tierColors: Record<string, string> = {
    platinum: 'bg-violet-100 text-violet-700',
    gold: 'bg-amber-100 text-amber-700',
    silver: 'bg-zinc-100 text-zinc-600',
    bronze: 'bg-orange-100 text-orange-700',
  };

  return (
    <div className="p-8 md:p-12 max-w-[1600px] mx-auto min-h-screen relative">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Sponsorship Management</h1>
          <p className="text-zinc-500 font-medium mt-1">Track corporate sponsors, advertising partnerships, and sponsorship tiers.</p>
        </div>
        <button
          onClick={() => openForm()}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-sm font-bold text-white rounded-sm transition-colors shadow-md"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Sponsor
        </button>
      </div>

      {error && <p role="alert" className="mb-4 p-3 border border-red-300 bg-red-50 text-red-800 text-sm rounded-sm">{error}</p>}
      <div className="bg-white border border-zinc-200 rounded-md shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-zinc-700 font-bold text-sm">
            <BadgeDollarSign className="w-4 h-4" />
            <span>Sponsors & Advertising Partners</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-xs font-bold text-zinc-600 uppercase tracking-wider border-b border-zinc-200">
                <th className="px-6 py-4">Company / Contact</th>
                <th className="px-6 py-4">Tier</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {isLoading ? (
                <tr><td colSpan={6} className="p-8 text-center text-zinc-500 font-bold tracking-widest uppercase text-xs animate-pulse">Loading sponsors...</td></tr>
              ) : sponsors.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-zinc-500 font-bold">No sponsorships yet. Click "Add Sponsor" to create one.</td></tr>
              ) : sponsors.map((s) => (
                <tr key={s.id} className="hover:bg-zinc-50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-zinc-900">{s.company_name}</p>
                    <p className="text-xs text-zinc-500">{s.contact_name} · {s.contact_email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-widest rounded-full ${tierColors[s.tier] || tierColors.silver}`}>
                      {s.tier}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-zinc-900 font-bold">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-500 mr-1" />
                      {s.amount ? new Intl.NumberFormat('en-US').format(s.amount) : '0'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-zinc-600">
                    {s.start_date ? new Date(s.start_date).toLocaleDateString() : 'N/A'} — {s.end_date ? new Date(s.end_date).toLocaleDateString() : 'Ongoing'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-widest rounded-full ${
                      s.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-500'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button aria-label={`Edit ${s.company_name}`} onClick={() => openForm(s)} className="p-2 text-zinc-400 hover:text-blue-600 transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button aria-label={`Delete ${s.company_name}`} onClick={() => handleDelete(s.id)} className="p-2 text-zinc-400 hover:text-red-600 transition-colors">
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

      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" onClick={() => setIsFormOpen(false)} />
          <div className="relative w-full max-w-xl bg-white h-full shadow-2xl border-l border-zinc-200 overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50 sticky top-0 z-10">
              <h2 className="text-lg font-black text-zinc-900">{form.id ? "Edit Sponsor" : "Add Sponsor"}</h2>
              <button aria-label="Close" onClick={() => setIsFormOpen(false)} className="text-zinc-500 hover:text-zinc-900"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Company Name</label>
                <input type="text" required className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={form.company_name} onChange={e => setForm({...form, company_name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Contact Name</label>
                  <input type="text" className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={form.contact_name} onChange={e => setForm({...form, contact_name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Contact Email</label>
                  <input type="email" className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={form.contact_email} onChange={e => setForm({...form, contact_email: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Sponsorship Tier</label>
                  <select className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={form.tier} onChange={e => setForm({...form, tier: e.target.value})}>
                    <option value="platinum">Platinum</option>
                    <option value="gold">Gold</option>
                    <option value="silver">Silver</option>
                    <option value="bronze">Bronze</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Amount ($)</label>
                  <input type="number" className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={form.amount} onChange={e => setForm({...form, amount: parseFloat(e.target.value) || 0})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Start Date</label>
                  <input type="date" className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={form.start_date} onChange={e => setForm({...form, start_date: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">End Date</label>
                  <input type="date" className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={form.end_date} onChange={e => setForm({...form, end_date: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Website</label>
                <input type="url" placeholder="https://" className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={form.website || ""} onChange={e => setForm({...form, website: e.target.value})} />
              </div>
              <ImageField label="Logo" folder="partners" value={form.logo_url || ""} onChange={(url) => setForm({...form, logo_url: url})} />
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Notes</label>
                <textarea rows={3} className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
              </div>
              <div className="pt-6 border-t border-zinc-200">
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-sm flex items-center justify-center transition-colors shadow-lg">
                  <Save className="w-5 h-5 mr-2" /> Save Sponsorship
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
