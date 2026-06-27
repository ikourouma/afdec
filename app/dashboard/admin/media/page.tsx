"use client";

import React, { useEffect, useState } from "react";
import { FileText, Plus, Search, RefreshCcw, ShieldCheck, Trash2, Edit3, Image as ImageIcon, XCircle, Save, ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

export default function MediaDashboard() {
  const [releases, setReleases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentRelease, setCurrentRelease] = useState<any | null>(null);

  useEffect(() => {
    loadReleases();
  }, []);

  async function loadReleases() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('press_releases')
      .select('*')
      .order('date', { ascending: false });
      
    if (error) {
      console.error("Error loading releases:", error);
      setReleases([]);
    } else {
      setReleases(data || []);
    }
    setIsLoading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      title: formData.get("title"),
      source: formData.get("source"),
      url: formData.get("url"),
      date: formData.get("date"),
      is_active: true
    };

    if (currentRelease?.id) {
      await supabase.from("press_releases").update(data).eq("id", currentRelease.id);
    } else {
      await supabase.from("press_releases").insert([data]);
    }

    setIsEditing(false);
    setCurrentRelease(null);
    loadReleases();
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this press release?")) {
      await supabase.from("press_releases").delete().eq("id", id);
      loadReleases();
    }
  }

  const filteredReleases = releases.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.source.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto space-y-8 bg-zinc-50 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-sm mb-4">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Public Relations</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-zinc-900 tracking-tight">Media & Press Desk</h1>
          <p className="text-zinc-500 mt-2 font-medium">Manage platform press releases and media coverage tracking.</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button onClick={loadReleases} className="p-3 bg-white border border-zinc-200 text-zinc-500 hover:text-blue-600 hover:border-blue-200 rounded-sm shadow-sm transition-all">
            <RefreshCcw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={() => { setCurrentRelease(null); setIsEditing(true); }}
            className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-widest rounded-sm shadow-lg transition-all"
          >
            <Plus className="w-4 h-4 mr-2" /> New Release
          </button>
        </div>
      </div>

      {/* Controls & Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3 bg-white p-2 border border-zinc-200 rounded-sm shadow-sm flex items-center">
          <Search className="w-5 h-5 text-zinc-400 ml-3 mr-2" />
          <input 
            type="text" 
            placeholder="Search publications and titles..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow bg-transparent border-none outline-none text-sm text-zinc-900 font-medium py-2 px-2"
          />
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-sm shadow-sm p-4 flex flex-col justify-center items-center">
          <span className="text-2xl font-black text-white">{filteredReleases.length}</span>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Active Links</span>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-zinc-200 rounded-sm shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-zinc-500 font-medium italic">Synchronizing...</div>
        ) : filteredReleases.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 font-medium">No press releases logged.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200">
                  <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Publication Date</th>
                  <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Title & Source</th>
                  <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Link</th>
                  <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredReleases.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-zinc-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-zinc-100 text-zinc-600 text-[10px] font-bold uppercase tracking-widest rounded-sm border border-zinc-200">
                        {item.date}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-zinc-900 mb-0.5">{item.title}</p>
                      <p className="text-xs text-zinc-500 font-medium">{item.source}</p>
                    </td>
                    <td className="px-6 py-4">
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors flex items-center text-xs font-bold uppercase tracking-widest">
                        <ExternalLink className="w-3.5 h-3.5 mr-1" /> View Link
                      </a>
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end space-x-2">
                       <button onClick={() => { setCurrentRelease(item); setIsEditing(true); }} className="p-2 text-zinc-400 hover:text-blue-600 transition-colors">
                         <Edit3 className="w-4 h-4" />
                       </button>
                       <button onClick={() => handleDelete(item.id)} className="p-2 text-zinc-400 hover:text-red-600 transition-colors">
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <>
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-[200]" 
               onClick={() => setIsEditing(false)}
            />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-white shadow-2xl z-[210] flex flex-col"
            >
               <div className="p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
                  <h2 className="text-xl font-black text-zinc-900 tracking-tight">
                    {currentRelease ? "Modify Press Release" : "Log New Press Release"}
                  </h2>
                  <button onClick={() => setIsEditing(false)} className="text-zinc-400 hover:text-zinc-900">
                    <XCircle className="w-6 h-6" />
                  </button>
               </div>

               <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-10 space-y-8">
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">Release Title</label>
                     <input 
                        name="title" 
                        defaultValue={currentRelease?.title} 
                        required
                        placeholder="AfDEC Announces $500M Partnership..."
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-bold text-zinc-900"
                     />
                  </div>
                  
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">Publisher / Source</label>
                     <input 
                        name="source" 
                        defaultValue={currentRelease?.source} 
                        required
                        placeholder="Wall Street Journal"
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-bold text-zinc-900"
                     />
                  </div>

                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">Publication Date</label>
                     <input 
                        name="date" 
                        type="date"
                        defaultValue={currentRelease?.date} 
                        required
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-sm outline-none text-sm font-bold text-zinc-900"
                     />
                  </div>

                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">Target URL</label>
                     <input 
                        name="url" 
                        type="url"
                        defaultValue={currentRelease?.url} 
                        required
                        placeholder="https://..."
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-bold text-zinc-900"
                     />
                  </div>

                  <div className="pt-6 border-t border-zinc-100 flex justify-end">
                     <button type="submit" className="px-6 py-3 bg-zinc-900 hover:bg-black text-white text-xs font-black uppercase tracking-widest rounded-sm shadow-lg flex items-center transition-all">
                       <Save className="w-4 h-4 mr-2" /> {currentRelease ? "Commit Changes" : "Publish to Registry"}
                     </button>
                  </div>
               </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
