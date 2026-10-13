"use client";

import React, { useState, useEffect } from "react";
import { Building2, Plus, Edit3, Trash2, X, Save, Search, Globe, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function BusinessesAdminPage() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [form, setForm] = useState<any>({
    name: "", sector: "", location: "", website: "",
    description: "", status: "active", contact_email: ""
  });

  const fetchData = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from('businesses')
      .select('*')
      .order('created_at', { ascending: false });
    setBusinesses(data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.id) {
      await supabase.from('businesses').update(form).eq('id', form.id);
    } else {
      await supabase.from('businesses').insert([form]);
    }
    setIsFormOpen(false);
    setForm({ name: "", sector: "", location: "", website: "", description: "", status: "active", contact_email: "" });
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Remove this business entity?")) {
      await supabase.from('businesses').delete().eq('id', id);
      fetchData();
    }
  };

  const openForm = (biz?: any) => {
    setForm(biz || { name: "", sector: "", location: "", website: "", description: "", status: "active", contact_email: "" });
    setIsFormOpen(true);
  };

  return (
    <div className="p-8 md:p-12 max-w-[1600px] mx-auto min-h-screen relative">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Enterprise Entities</h1>
          <p className="text-zinc-500 font-medium mt-1">Directory of registered businesses, SMEs, and corporate partners.</p>
        </div>
        <button
          onClick={() => openForm()}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-sm font-bold text-white rounded-sm transition-colors shadow-md"
        >
          <Plus className="w-4 h-4 mr-2" />
          Register Business
        </button>
      </div>

      <div className="bg-white border border-zinc-200 rounded-md shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-zinc-700 font-bold text-sm">
            <Building2 className="w-4 h-4" />
            <span>Corporate Network</span>
          </div>
          <div className="text-xs font-bold text-zinc-500">{businesses.length} Entities</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-xs font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-200">
                <th className="px-6 py-4">Business</th>
                <th className="px-6 py-4">Sector</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {isLoading ? (
                <tr><td colSpan={5} className="p-8 text-center text-zinc-500 font-bold tracking-widest uppercase text-xs animate-pulse">Loading entities...</td></tr>
              ) : businesses.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-zinc-500 font-bold">No business entities registered yet.</td></tr>
              ) : businesses.map((biz) => (
                <tr key={biz.id} className="hover:bg-zinc-50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-zinc-900">{biz.name}</p>
                    <p className="text-xs text-zinc-500 mt-1">{biz.contact_email}</p>
                    {biz.website && (
                      <div className="flex items-center text-xs text-blue-600 mt-1">
                        <Globe className="w-3 h-3 mr-1" /> {biz.website}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-zinc-700 font-medium">{biz.sector || "General"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-zinc-600">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400 mr-1" />
                      {biz.location || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-widest rounded-full ${
                      biz.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                      biz.status === 'verified' ? 'bg-blue-100 text-blue-700' :
                      'bg-zinc-100 text-zinc-500'
                    }`}>
                      {biz.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button onClick={() => openForm(biz)} className="p-2 text-zinc-400 hover:text-blue-600 transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(biz.id)} className="p-2 text-zinc-400 hover:text-red-600 transition-colors">
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
              <h2 className="text-lg font-black text-zinc-900">{form.id ? "Edit Business" : "Register Business"}</h2>
              <button onClick={() => setIsFormOpen(false)} className="text-zinc-500 hover:text-zinc-900"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Business Name</label>
                <input type="text" required className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Sector</label>
                  <input type="text" className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={form.sector} onChange={e => setForm({...form, sector: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Location</label>
                  <input type="text" className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Website</label>
                  <input type="url" className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={form.website} onChange={e => setForm({...form, website: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Contact Email</label>
                  <input type="email" className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={form.contact_email} onChange={e => setForm({...form, contact_email: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Description</label>
                <textarea rows={4} className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Status</label>
                <select className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                  <option value="active">Active</option>
                  <option value="verified">Verified</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="pt-6 border-t border-zinc-200">
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-sm flex items-center justify-center transition-colors shadow-lg">
                  <Save className="w-5 h-5 mr-2" /> Save Business
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
