"use client";

import React, { useEffect, useState } from "react";
import { Mail, Download, Search, RefreshCcw, ShieldCheck, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function NewsletterDashboard() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadSubscribers();
  }, []);

  async function loadSubscribers() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });
        
      if (error) {
        console.error("Error loading subscribers:", error);
        setSubscribers([]);
      } else {
        setSubscribers(data || []);
      }
    } catch (err) {
      console.error("Error loading subscribers:", err);
      setSubscribers([]);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredSubs = subscribers.filter(sub => 
    sub.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Email,Source,Subscribed At,Status\n"
      + filteredSubs.map(s => `${s.email},${s.source},${new Date(s.subscribed_at).toLocaleDateString()},${s.is_active ? 'Active' : 'Unsubscribed'}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "afdec_newsletter_subscribers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto space-y-8 bg-zinc-50 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-sm mb-4">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Communications Control</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-zinc-900 tracking-tight">Newsletter Captures</h1>
          <p className="text-zinc-500 mt-2 font-medium">Manage subscriber lists across the sovereign platform.</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button onClick={loadSubscribers} className="p-3 bg-white border border-zinc-200 text-zinc-500 hover:text-blue-600 hover:border-blue-200 rounded-sm shadow-sm transition-all">
            <RefreshCcw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={exportCSV} className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-widest rounded-sm shadow-lg transition-all">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </button>
        </div>
      </div>

      {/* Controls & Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3 bg-white p-2 border border-zinc-200 rounded-sm shadow-sm flex items-center">
          <Search className="w-5 h-5 text-zinc-400 ml-3 mr-2" />
          <input 
            type="text" 
            placeholder="Search verified emails..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow bg-transparent border-none outline-none text-sm text-zinc-900 font-medium py-2 px-2"
          />
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-sm shadow-sm p-4 flex flex-col justify-center items-center">
          <span className="text-2xl font-black text-white">{filteredSubs.length}</span>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total Captures</span>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-zinc-200 rounded-sm shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-zinc-500 font-medium italic">Synchronizing with registry...</div>
        ) : filteredSubs.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 font-medium">No active captures found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200">
                  <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Subscriber Email</th>
                  <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Source</th>
                  <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Capture Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredSubs.map((sub, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50/50 transition-colors group">
                    <td className="px-6 py-4 flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-zinc-300" />
                      <span className="text-sm font-bold text-zinc-900">{sub.email}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-zinc-100 text-zinc-600 text-[10px] font-bold uppercase tracking-widest rounded-sm border border-zinc-200">
                        {sub.source || 'direct'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {sub.is_active ? (
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-widest rounded-sm border border-emerald-100">Active</span>
                      ) : (
                        <span className="px-2.5 py-1 bg-red-50 text-red-700 text-[10px] font-bold uppercase tracking-widest rounded-sm border border-red-100">Unsubscribed</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500 font-medium">
                      {new Date(sub.subscribed_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
