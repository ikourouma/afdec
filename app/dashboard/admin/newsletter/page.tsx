"use client";

import React, { useState, useEffect } from "react";
import { Mail, Search, Trash2, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function NewsletterAdminPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false });
    setSubscribers(data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleStatus = async (sub: any) => {
    await supabase.from('newsletter_subscribers').update({ is_active: !sub.is_active }).eq('id', sub.id);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Permanently delete this subscriber?")) {
      await supabase.from('newsletter_subscribers').delete().eq('id', id);
      fetchData();
    }
  };

  return (
    <div className="p-8 md:p-12 max-w-[1600px] mx-auto min-h-screen relative">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Newsletter Audiences</h1>
          <p className="text-zinc-500 font-medium mt-1">Manage institutional and public newsletter subscribers.</p>
        </div>
        <div className="flex items-center space-x-3 bg-zinc-100 p-1.5 rounded-sm">
          <div className="px-4 py-2 bg-white rounded shadow-sm text-sm font-bold text-zinc-800">
            Total Active: {subscribers.filter(s => s.is_active).length}
          </div>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-md shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-zinc-700 font-bold text-sm">
            <Mail className="w-4 h-4" />
            <span>Subscriber Database</span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-xs font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-200">
                <th className="px-6 py-4">Email Address</th>
                <th className="px-6 py-4">Source / Origin</th>
                <th className="px-6 py-4">Subscribed On</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {isLoading ? (
                 <tr><td colSpan={5} className="p-8 text-center text-zinc-500 font-bold tracking-widest uppercase text-xs animate-pulse">Syncing Database...</td></tr>
              ) : subscribers.length === 0 ? (
                 <tr><td colSpan={5} className="p-8 text-center text-zinc-500 font-bold">No subscribers found.</td></tr>
              ) : subscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-zinc-50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-zinc-900">{sub.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-zinc-500 font-mono bg-zinc-100 px-2 py-1 rounded">{sub.source || 'terminal'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-zinc-700 font-medium whitespace-nowrap">
                      {new Date(sub.subscribed_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => toggleStatus(sub)}
                      className={`inline-flex items-center space-x-1 px-2.5 py-1 text-[10px] uppercase font-bold tracking-widest rounded-full transition-colors ${
                      sub.is_active ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                    }`}>
                      {sub.is_active ? <><CheckCircle className="w-3 h-3"/><span>Active</span></> : <><XCircle className="w-3 h-3"/><span>Unsubscribed</span></>}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button onClick={() => handleDelete(sub.id)} className="p-2 text-zinc-400 hover:text-red-600 transition-colors">
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
