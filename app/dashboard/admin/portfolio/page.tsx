"use client";

import React, { useState, useEffect } from "react";
import { FolderKanban, Plus, Edit3, Trash2, X, Save, Search, DollarSign } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ImageField } from "@/components/admin/asset-picker";

export default function PortfolioAdminPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const [form, setForm] = useState<any>({
    slug: "", title: "", type: "impact_capital", status: "active",
    description: "", full_content: "", funding_goal: 0, funding_raised: 0,
    hero_image_url: "", location: ""
  });

  const fetchData = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from('impact_projects')
      .select('*')
      .order('created_at', { ascending: false });
    setProjects(data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.id) {
      await supabase.from('impact_projects').update(form).eq('id', form.id);
    } else {
      await supabase.from('impact_projects').insert([form]);
    }
    setIsFormOpen(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Permanently delete this project?")) {
      await supabase.from('impact_projects').delete().eq('id', id);
      fetchData();
    }
  };

  const openForm = (project?: any) => {
    if (project) {
      setForm(project);
    } else {
      setForm({
        slug: "", title: "", type: "impact_capital", status: "active",
        description: "", full_content: "", funding_goal: 0, funding_raised: 0,
        hero_image_url: "", location: ""
      });
    }
    setIsFormOpen(true);
  };

  const formatCurrency = (val: number) => {
    if (!val) return "$0";
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="p-8 md:p-12 max-w-[1600px] mx-auto min-h-screen relative">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Development Portfolio</h1>
          <p className="text-zinc-500 font-medium mt-1">Manage active infrastructure projects and enterprise mandates.</p>
        </div>
        <button 
          onClick={() => openForm()}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-sm font-bold text-white rounded-sm transition-colors shadow-md"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Project
        </button>
      </div>

      <div className="bg-white border border-zinc-200 rounded-md shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-zinc-700 font-bold text-sm">
            <FolderKanban className="w-4 h-4" />
            <span>Project Pipeline</span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-xs font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-200">
                <th className="px-6 py-4">Project Details</th>
                <th className="px-6 py-4">Status / Type</th>
                <th className="px-6 py-4">Funding Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {isLoading ? (
                 <tr><td colSpan={4} className="p-8 text-center text-zinc-500 font-bold tracking-widest uppercase text-xs animate-pulse">Syncing Portfolio...</td></tr>
              ) : projects.length === 0 ? (
                 <tr><td colSpan={4} className="p-8 text-center text-zinc-500 font-bold">No active projects found.</td></tr>
              ) : projects.map((project) => (
                <tr key={project.id} className="hover:bg-zinc-50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-zinc-900 mb-1">{project.title}</p>
                    <p className="text-xs text-zinc-500 mb-1">Slug: {project.slug}</p>
                    <p className="text-xs text-zinc-400 truncate max-w-xs">{project.location}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      <span className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-widest rounded-full self-start ${
                        project.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 
                        project.status === 'hidden' ? 'bg-zinc-200 text-zinc-600' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {project.status}
                      </span>
                      <span className="text-xs font-bold text-zinc-500 uppercase">{project.type.replace('_', ' ')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {project.funding_goal > 0 ? (
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center text-xs font-bold text-emerald-600">
                           Raised: {formatCurrency(project.funding_raised)}
                        </div>
                        <div className="flex items-center text-xs font-medium text-zinc-500">
                           Goal: {formatCurrency(project.funding_goal)}
                        </div>
                        <div className="w-full bg-zinc-200 rounded-full h-1.5 mt-1">
                           <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, (project.funding_raised / project.funding_goal) * 100)}%` }}></div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-zinc-400 italic">No Funding Goal Set</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button onClick={() => openForm(project)} className="p-2 text-zinc-400 hover:text-blue-600 transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(project.id)} className="p-2 text-zinc-400 hover:text-red-600 transition-colors">
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
          <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl border-l border-zinc-200 overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50 sticky top-0 z-10">
              <h2 className="text-lg font-black text-zinc-900">{form.id ? "Edit Project" : "Create Project"}</h2>
              <button onClick={() => setIsFormOpen(false)} className="text-zinc-500 hover:text-zinc-900"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-6">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Project Title</label>
                  <input type="text" required className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">URL Slug</label>
                  <input type="text" required className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Project Type</label>
                  <select className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                    <option value="impact_capital">Impact Capital</option>
                    <option value="flagship_initiative">Flagship Initiative</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Status</label>
                  <select className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                    <option value="active">Active</option>
                    <option value="hidden">Hidden</option>
                    <option value="archived">Archived</option>
                    <option value="funding_closed">Funding Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Brief Description</label>
                <textarea rows={2} required className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Full Content (Markdown)</label>
                <textarea rows={5} className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none" value={form.full_content} onChange={e => setForm({...form, full_content: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <ImageField label="Hero image" folder="general" value={form.hero_image_url} onChange={(url) => setForm({...form, hero_image_url: url})} />
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Location</label>
                  <input type="text" className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. North Carolina" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-emerald-50 p-4 border border-emerald-100 rounded">
                <div>
                  <label className="block text-xs font-bold text-emerald-800 uppercase mb-2 flex items-center"><DollarSign className="w-3 h-3 mr-1"/> Funding Goal</label>
                  <input type="number" className="w-full bg-white border border-emerald-200 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" value={form.funding_goal} onChange={e => setForm({...form, funding_goal: parseFloat(e.target.value) || 0})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-emerald-800 uppercase mb-2 flex items-center"><DollarSign className="w-3 h-3 mr-1"/> Funding Raised</label>
                  <input type="number" className="w-full bg-white border border-emerald-200 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" value={form.funding_raised} onChange={e => setForm({...form, funding_raised: parseFloat(e.target.value) || 0})} />
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-200">
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-sm flex items-center justify-center transition-colors shadow-lg">
                  <Save className="w-5 h-5 mr-2" /> Save Project Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
