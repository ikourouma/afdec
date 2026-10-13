"use client";

import React, { useState, useEffect } from "react";
import { Briefcase, Plus, Edit3, Trash2, X, Save, MapPin, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function CareersAdminPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [form, setForm] = useState<any>({
    title: "", department: "", location: "", type: "Full-Time",
    description: "", requirements: "", is_active: true
  });

  const fetchData = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from('job_postings')
      .select('*')
      .order('created_at', { ascending: false });
    setJobs(data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.id) {
      await supabase.from('job_postings').update(form).eq('id', form.id);
    } else {
      await supabase.from('job_postings').insert([form]);
    }
    setIsFormOpen(false);
    setForm({ title: "", department: "", location: "", type: "Full-Time", description: "", requirements: "", is_active: true });
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this job posting?")) {
      await supabase.from('job_postings').delete().eq('id', id);
      fetchData();
    }
  };

  const openForm = (job?: any) => {
    setForm(job || { title: "", department: "", location: "", type: "Full-Time", description: "", requirements: "", is_active: true });
    setIsFormOpen(true);
  };

  return (
    <div className="p-8 md:p-12 max-w-[1600px] mx-auto min-h-screen relative">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Careers & Talent</h1>
          <p className="text-zinc-500 font-medium mt-1">Manage job postings and talent pipeline for the organization.</p>
        </div>
        <button
          onClick={() => openForm()}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-sm font-bold text-white rounded-sm transition-colors shadow-md"
        >
          <Plus className="w-4 h-4 mr-2" />
          Post New Position
        </button>
      </div>

      <div className="bg-white border border-zinc-200 rounded-md shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-zinc-700 font-bold text-sm">
            <Briefcase className="w-4 h-4" />
            <span>Active Job Postings</span>
          </div>
          <div className="text-xs font-bold text-zinc-500">
            {jobs.filter(j => j.is_active).length} Active / {jobs.length} Total
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-xs font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-200">
                <th className="px-6 py-4">Position</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Location / Type</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {isLoading ? (
                <tr><td colSpan={5} className="p-8 text-center text-zinc-500 font-bold tracking-widest uppercase text-xs animate-pulse">Loading positions...</td></tr>
              ) : jobs.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-zinc-500 font-bold">No job postings yet. Click "Post New Position" to create one.</td></tr>
              ) : jobs.map((job) => (
                <tr key={job.id} className="hover:bg-zinc-50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-zinc-900">{job.title}</p>
                    <p className="text-xs text-zinc-500 mt-1 truncate max-w-xs">{job.description?.substring(0, 80)}...</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-zinc-700 font-medium">{job.department || "General"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center text-xs text-zinc-600">
                        <MapPin className="w-3 h-3 mr-1 text-zinc-400" /> {job.location || "Remote"}
                      </div>
                      <div className="flex items-center text-xs text-zinc-500">
                        <Clock className="w-3 h-3 mr-1 text-zinc-400" /> {job.type}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-widest rounded-full ${
                      job.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-500'
                    }`}>
                      {job.is_active ? 'Active' : 'Closed'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button onClick={() => openForm(job)} className="p-2 text-zinc-400 hover:text-blue-600 transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(job.id)} className="p-2 text-zinc-400 hover:text-red-600 transition-colors">
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
              <h2 className="text-lg font-black text-zinc-900">{form.id ? "Edit Position" : "Post New Position"}</h2>
              <button onClick={() => setIsFormOpen(false)} className="text-zinc-500 hover:text-zinc-900"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Job Title</label>
                <input type="text" required className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Department</label>
                  <input type="text" className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={form.department} onChange={e => setForm({...form, department: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Location</label>
                  <input type="text" className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Raleigh, NC or Remote" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Employment Type</label>
                <select className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Volunteer">Volunteer</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Job Description</label>
                <textarea rows={5} required className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Requirements (one per line)</label>
                <textarea rows={4} className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none" value={form.requirements} onChange={e => setForm({...form, requirements: e.target.value})} />
              </div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500 border-zinc-300 w-4 h-4" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} />
                <span className="text-sm font-bold text-zinc-700">Position is Active</span>
              </label>
              <div className="pt-6 border-t border-zinc-200">
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-sm flex items-center justify-center transition-colors shadow-lg">
                  <Save className="w-5 h-5 mr-2" /> Save Position
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
