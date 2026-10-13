"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, CalendarDays, Clock, MoreVertical, Globe, Megaphone, X, Save, Edit3, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ImageField } from "@/components/admin/asset-picker";

export default function BriefingsManagerPage() {
  const [activeTab, setActiveTab] = useState<"briefings" | "alerts">("briefings");
  const [briefings, setBriefings] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isAlertFormOpen, setIsAlertFormOpen] = useState(false);
  const [alertForm, setAlertForm] = useState<any>({
    message: "",
    link_text: "",
    link_url: "",
    priority_level: "standard",
    audience: "all",
    is_active: true,
  });

  const [isBriefingFormOpen, setIsBriefingFormOpen] = useState(false);
  const [briefingForm, setBriefingForm] = useState<any>({
    title: "",
    excerpt: "",
    full_content: "",
    image_url: "",
    status: "inactive",
    category: "general"
  });

  const fetchData = async () => {
    setIsLoading(true);
    // Fetch Live Briefings
    const { data: dbBriefings } = await supabase
      .from('news_briefings')
      .select('*')
      .order('created_at', { ascending: false });
      
    // Fetch Live Alerts
    const { data: dbAlerts } = await supabase
      .from('global_alerts')
      .select('*')
      .order('created_at', { ascending: false });

    setBriefings(dbBriefings || []);
    setAlerts(dbAlerts || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAlertSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (alertForm.id) {
      await supabase.from('global_alerts').update(alertForm).eq('id', alertForm.id);
    } else {
      await supabase.from('global_alerts').insert([alertForm]);
    }
    setIsAlertFormOpen(false);
    setAlertForm({ message: "", link_text: "", link_url: "", priority_level: "standard", audience: "all", is_active: true });
    fetchData();
  };

  const handleAlertDelete = async (id: string) => {
    if (window.confirm("Delete this alert?")) {
      await supabase.from('global_alerts').delete().eq('id', id);
      fetchData();
    }
  };

  const handleBriefingSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (briefingForm.id) {
      await supabase.from('news_briefings').update(briefingForm).eq('id', briefingForm.id);
    } else {
      await supabase.from('news_briefings').insert([briefingForm]);
    }
    setIsBriefingFormOpen(false);
    setBriefingForm({ title: "", excerpt: "", full_content: "", status: "inactive", category: "general" });
    fetchData();
  };

  const handleBriefingDelete = async (id: string) => {
    if (window.confirm("Delete this briefing?")) {
      await supabase.from('news_briefings').delete().eq('id', id);
      fetchData();
    }
  };

  return (
    <div className="p-8 md:p-12 max-w-[1600px] mx-auto min-h-screen relative">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Intelligence & Alerts Engine</h1>
          <p className="text-zinc-500 font-medium mt-1">Govern the temporal execution of Market Briefings and Global Flash Alerts.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => { setAlertForm({ message: "", link_text: "", link_url: "", priority_level: "standard", audience: "all", is_active: true }); setIsAlertFormOpen(true); }}
            className="flex items-center justify-center px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-sm font-bold text-white rounded-sm transition-colors shadow-md"
          >
            <Megaphone className="w-4 h-4 mr-2" />
            Issue Global Alert
          </button>
          <button 
            onClick={() => { setBriefingForm({ title: "", excerpt: "", full_content: "", status: "inactive", category: "general" }); setIsBriefingFormOpen(true); }}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-sm font-bold text-white rounded-sm transition-colors shadow-md"
          >
            <Plus className="w-4 h-4 mr-2" />
            Compose Briefing
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-6 border-b border-zinc-200 mb-8">
        <button 
          onClick={() => setActiveTab("briefings")}
          className={`pb-3 text-sm font-bold tracking-wide transition-colors relative ${activeTab === 'briefings' ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
        >
          Market Briefings Database
          {activeTab === 'briefings' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full" />}
        </button>
        <button 
          onClick={() => setActiveTab("alerts")}
          className={`pb-3 text-sm font-bold tracking-wide transition-colors relative ${activeTab === 'alerts' ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
        >
          Temporal Flash Alerts
          {activeTab === 'alerts' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full" />}
        </button>
      </div>

      {/* Primary Data Workspace */}
      <div className="bg-white border border-zinc-200 rounded-md shadow-sm">
        
        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50 rounded-t-md flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                type="text" 
                placeholder={activeTab === 'briefings' ? "Search intelligence reports..." : "Search alerts..."}
                className="pl-9 pr-4 py-2 w-64 border border-zinc-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:border-transparent focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="flex items-center px-3 py-2 border border-zinc-300 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded-sm transition-colors">
              <Filter className="w-3.5 h-3.5 mr-1" />
              Status: All
            </button>
          </div>
        </div>

        {/* Dynamic Table Output */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-xs font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-200">
                <th className="px-6 py-4 w-1/2">
                  {activeTab === 'briefings' ? 'Intelligence Title' : 'Alert Broadcast Message'}
                </th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">
                  {activeTab === 'briefings' ? 'Publication Date' : 'Temporal Logic'}
                </th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            
            {activeTab === 'briefings' ? (
              <tbody className="divide-y divide-zinc-100 text-sm">
                {isLoading ? (
                   <tr><td colSpan={4} className="p-8 text-center text-zinc-500 font-bold tracking-widest uppercase text-xs animate-pulse">Syncing Telemetry from Supabase...</td></tr>
                ) : briefings.length === 0 ? (
                   <tr><td colSpan={4} className="p-8 text-center text-zinc-500 font-bold">No Active Briefings. Click "Compose" to instantiate.</td></tr>
                ) : briefings.map((briefing) => (
                  <tr key={briefing.id} className="hover:bg-zinc-50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors cursor-pointer">{briefing.title}</p>
                      <div className="flex items-center text-xs text-zinc-500 mt-1 truncate max-w-sm">
                        <Globe className="w-3 h-3 mr-1 shrink-0" /> ID: {briefing.id}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-widest rounded-full ${
                        briefing.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 
                        briefing.status === 'inactive' ? 'bg-amber-100 text-amber-700' : 
                        'bg-zinc-100 text-zinc-500'
                      }`}>
                        {briefing.status || 'inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-zinc-700 font-medium whitespace-nowrap">
                        <CalendarDays className="w-4 h-4 mr-2 text-zinc-400" />
                        {briefing.valid_from ? new Date(briefing.valid_from).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button onClick={() => { setBriefingForm(briefing); setIsBriefingFormOpen(true); }} className="p-2 text-zinc-400 hover:text-blue-600 transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleBriefingDelete(briefing.id)} className="p-2 text-zinc-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody className="divide-y divide-zinc-100 text-sm">
                {isLoading ? (
                   <tr><td colSpan={4} className="p-8 text-center text-zinc-500 font-bold tracking-widest uppercase text-xs animate-pulse">Syncing Telemetry from Supabase...</td></tr>
                ) : alerts.length === 0 ? (
                   <tr><td colSpan={4} className="p-8 text-center text-zinc-500 font-bold">No Active Alerts Executing.</td></tr>
                ) : alerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-zinc-50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-zinc-900 mb-1">{alert.message}</p>
                      <div className="flex items-center text-xs font-semibold text-blue-600">
                         {alert.link_text} — {alert.link_url}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-widest rounded-full ${
                        alert.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {alert.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-zinc-600">
                      <div className="font-medium">{alert.valid_from ? new Date(alert.valid_from).toLocaleDateString() : 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button onClick={() => { setAlertForm(alert); setIsAlertFormOpen(true); }} className="p-2 text-zinc-400 hover:text-blue-600 transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleAlertDelete(alert.id)} className="p-2 text-zinc-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>

      {/* Slide-over Form: Alert */}
      {isAlertFormOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" onClick={() => setIsAlertFormOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl border-l border-zinc-200 overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50">
              <h2 className="text-lg font-black text-zinc-900">{alertForm.id ? "Edit Alert" : "Issue Global Alert"}</h2>
              <button onClick={() => setIsAlertFormOpen(false)} className="text-zinc-500 hover:text-zinc-900"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAlertSave} className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Message</label>
                <textarea 
                  required
                  rows={3}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={alertForm.message}
                  onChange={e => setAlertForm({...alertForm, message: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Link Text</label>
                  <input 
                    type="text"
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={alertForm.link_text}
                    onChange={e => setAlertForm({...alertForm, link_text: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Link URL</label>
                  <input 
                    type="text"
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={alertForm.link_url}
                    onChange={e => setAlertForm({...alertForm, link_url: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="alert-audience" className="block text-xs font-bold text-zinc-600 uppercase mb-2">Who sees this banner</label>
                <select id="alert-audience" className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm" value={alertForm.audience || "all"} onChange={e => setAlertForm({...alertForm, audience: e.target.value})}>
                  <option value="all">Everyone (public)</option>
                  <option value="members">Signed-in members &amp; council only</option>
                </select>
              </div>
              <div>
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    className="rounded text-blue-600 focus:ring-blue-500 border-zinc-300"
                    checked={alertForm.is_active}
                    onChange={e => setAlertForm({...alertForm, is_active: e.target.checked})}
                  />
                  <span className="text-sm font-bold text-zinc-700">Set Active immediately</span>
                </label>
              </div>
              <div className="pt-4 border-t border-zinc-200">
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-sm flex items-center justify-center transition-colors">
                  <Save className="w-4 h-4 mr-2" /> Save Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Slide-over Form: Briefing */}
      {isBriefingFormOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" onClick={() => setIsBriefingFormOpen(false)} />
          <div className="relative w-full max-w-xl bg-white h-full shadow-2xl border-l border-zinc-200 overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50">
              <h2 className="text-lg font-black text-zinc-900">{briefingForm.id ? "Edit Briefing" : "Compose Briefing"}</h2>
              <button onClick={() => setIsBriefingFormOpen(false)} className="text-zinc-500 hover:text-zinc-900"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleBriefingSave} className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Title</label>
                <input 
                  type="text" required
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={briefingForm.title}
                  onChange={e => setBriefingForm({...briefingForm, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Excerpt</label>
                <textarea 
                  rows={2} required
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={briefingForm.excerpt}
                  onChange={e => setBriefingForm({...briefingForm, excerpt: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Full Content (Markdown/HTML)</label>
                <textarea 
                  rows={6}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                  value={briefingForm.full_content}
                  onChange={e => setBriefingForm({...briefingForm, full_content: e.target.value})}
                />
              </div>
              <ImageField label="Hero image" folder="news" value={briefingForm.image_url || ""} onChange={(url) => setBriefingForm({...briefingForm, image_url: url})} />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Status</label>
                  <select 
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={briefingForm.status}
                    onChange={e => setBriefingForm({...briefingForm, status: e.target.value})}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Category</label>
                  <input 
                    type="text"
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={briefingForm.category}
                    onChange={e => setBriefingForm({...briefingForm, category: e.target.value})}
                  />
                </div>
              </div>
              <div className="pt-4 border-t border-zinc-200">
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-sm flex items-center justify-center transition-colors">
                  <Save className="w-4 h-4 mr-2" /> Save Briefing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
