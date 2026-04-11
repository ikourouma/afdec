"use client";

import React, { useEffect, useState } from "react";
import { 
  MessageSquare, 
  ShieldCheck, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  Building2, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  User,
  Tags
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

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
  inquiry_type?: string;
};

export default function AdminConciergePage() {
  const [intakes, setIntakes] = useState<Intake[]>([]);
  const [selectedIntake, setSelectedIntake] = useState<Intake | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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
        ...(leads || []).map(l => ({ ...l, type: 'lead' as const })),
        ...(interests || []).map(i => {
           const names = i.full_name.split(' ');
           return {
             ...i,
             type: 'interest' as const,
             first_name: names[0],
             last_name: names.slice(1).join(' '),
             source: 'fund_interest',
             industry: i.contribution_type || 'Philanthropy'
           };
        })
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setIntakes(combined);
      if (combined.length > 0) setSelectedIntake(combined[0]);
    } catch (err) {
      console.error("Failed to sync concierge data:", err);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateStatus(id: string, type: 'lead' | 'interest', newStatus: string) {
    const table = type === 'lead' ? 'lead_intakes' : 'fund_interests';
    const { error } = await supabase
      .from(table)
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    if (!error) {
      setIntakes(prev => prev.map(i => i.id === id ? { ...i, status: newStatus } : i));
      if (selectedIntake?.id === id) setSelectedIntake({ ...selectedIntake, status: newStatus });
    }
  }

  const filtered = intakes.filter(i => 
    `${i.first_name} ${i.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.organization?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-zinc-50 font-sans overflow-hidden">
      
      {/* ── Threads Sidebar (Inbox View) ── */}
      <div className="w-1/3 bg-white border-r border-zinc-200 flex flex-col min-w-[360px]">
        <div className="p-6 border-b border-zinc-200 bg-zinc-50/50">
          <div className="flex items-center justify-between mb-4">
             <div>
                <h1 className="text-xl font-extrabold text-zinc-900 tracking-tight">Concierge Command</h1>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Global Intake Terminal</p>
             </div>
             <div className="w-8 h-8 bg-blue-100 rounded-sm flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-blue-600" />
             </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search leads & interests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-zinc-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-zinc-100">
          {isLoading ? (
             <div className="p-12 text-center text-zinc-400 font-medium italic text-sm">Syncing with Intercontinental nodes...</div>
          ) : filtered.length === 0 ? (
             <div className="p-12 text-center text-zinc-400 font-medium text-sm">No transmissions found.</div>
          ) : (
            filtered.map((item) => (
              <div 
                key={item.id} 
                onClick={() => setSelectedIntake(item)}
                className={`p-5 cursor-pointer transition-all border-l-4 ${selectedIntake?.id === item.id ? 'bg-blue-50/80 border-l-blue-600 shadow-inner' : 'hover:bg-zinc-50 border-l-transparent'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="font-bold text-sm text-zinc-900 truncate pr-4">{item.first_name} {item.last_name}</div>
                  <span className="text-[9px] uppercase font-black text-zinc-400 tracking-wider whitespace-nowrap">{new Date(item.created_at).toLocaleDateString()}</span>
                </div>
                <div className="text-[11px] font-semibold text-zinc-500 truncate mb-3">{item.organization || "Private Individual"}</div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm ${item.type === 'lead' ? 'bg-zinc-900 text-white' : 'bg-emerald-100 text-emerald-700'}`}>
                        {item.type}
                     </span>
                     {item.status === 'new' && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${selectedIntake?.id === item.id ? 'translate-x-1 text-blue-500' : 'text-zinc-300'}`} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Detail Panel (Operation Control) ── */}
      <div className="flex-1 flex flex-col bg-zinc-50">
        {selectedIntake ? (
          <div className="flex-1 flex flex-col">
            
            {/* Lead Header */}
            <div className="h-24 px-10 border-b border-zinc-200 bg-white flex items-center justify-between shadow-sm z-10 shrink-0">
              <div className="flex items-center space-x-5">
                <div className="w-14 h-14 bg-zinc-950 text-white flex items-center justify-center rounded-sm font-black text-xl shadow-lg ring-4 ring-zinc-50">
                  {selectedIntake.first_name[0]}{selectedIntake.last_name[0] || ""}
                </div>
                <div>
                  <h2 className="text-xl font-black text-zinc-900 leading-tight">{selectedIntake.first_name} {selectedIntake.last_name}</h2>
                  <div className="flex items-center text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mt-1">
                    <ShieldCheck className={`w-3.5 h-3.5 mr-1.5 ${selectedIntake.status === 'converted' ? 'text-emerald-500' : 'text-zinc-300'}`} />
                    Transmission Mode: {selectedIntake.source.replace(/_/g, " ")}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                 <a href={`mailto:${selectedIntake.email}`} className="px-5 py-2.5 bg-zinc-950 text-white text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-blue-600 transition-all flex items-center shadow-md">
                    <Mail className="w-3.5 h-3.5 mr-2" /> Direct Transmission
                 </a>
              </div>
            </div>

            {/* Lead Intelligence Board */}
            <div className="flex-1 overflow-y-auto p-12 space-y-12 bg-[#fafafa]">
               
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Entity Metadata */}
                  <div className="space-y-6">
                     <div className="p-8 bg-white border border-zinc-200 rounded-sm shadow-sm space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                           <Tags className="w-4 h-4 text-blue-500" />
                           <h3 className="text-xs font-black text-zinc-900 uppercase tracking-widest">Metadata Repository</h3>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-y-6">
                           <div>
                              <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-1">Entity / Org</label>
                              <div className="text-sm font-bold text-zinc-900 flex items-center">
                                 <Building2 className="w-3.5 h-3.5 text-zinc-400 mr-2" />
                                 {selectedIntake.organization || "Not Specified"}
                              </div>
                           </div>
                           <div>
                              <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-1">Sector / Interest</label>
                              <div className="text-sm font-bold text-zinc-900">{selectedIntake.industry}</div>
                           </div>
                           <div>
                              <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-1">Email Node</label>
                              <div className="text-sm font-bold text-blue-600">{selectedIntake.email}</div>
                           </div>
                           <div>
                              <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-1">Intake Timestamp</label>
                              <div className="text-sm font-bold text-zinc-500">{new Date(selectedIntake.created_at).toLocaleString()}</div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Status Control Terminal */}
                  <div className="space-y-6">
                     <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-sm shadow-xl space-y-8">
                        <div>
                           <div className="text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Command Actions</div>
                           <p className="text-zinc-500 text-xs font-medium leading-relaxed mb-8">Update the institutional status of this intake to synchronize with the Board's CRM tracking protocols.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-3">
                           {[
                             { id: 'new', label: 'Mark as Unread / New', icon: AlertCircle, color: 'border-blue-500/30 text-blue-400 hover:bg-blue-500/10' },
                             { id: 'contacted', label: 'Signal Contact Established', icon: MessageSquare, color: 'border-amber-500/30 text-amber-500 hover:bg-amber-500/10' },
                             { id: 'converted', label: 'Ratify as Converted Partner', icon: CheckCircle2, color: 'border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10' }
                           ].map((action) => (
                             <button 
                                key={action.id}
                                onClick={() => updateStatus(selectedIntake.id, selectedIntake.type, action.id)}
                                className={`flex items-center justify-between p-4 border rounded-sm transition-all group ${selectedIntake.status === action.id ? 'bg-white/10 ring-1 ring-white/20' : action.color}`}
                             >
                                <div className="flex items-center gap-3">
                                   <action.icon className="w-4 h-4" />
                                   <span className="text-xs font-black uppercase tracking-widest">{action.label}</span>
                                </div>
                                {selectedIntake.status === action.id && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                             </button>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>

               {/* Raw Intake Payload */}
               {(selectedIntake as any).raw_data || (selectedIntake as any).message ? (
                 <div className="space-y-6 pb-20">
                    <h3 className="text-xs font-black text-zinc-400 uppercase tracking-[0.3em]">Communication Payload</h3>
                    <div className="p-10 bg-white border border-zinc-200 rounded-sm italic text-zinc-600 leading-[1.8] text-lg shadow-sm font-medium">
                       "{(selectedIntake as any).message || JSON.stringify((selectedIntake as any).raw_data, null, 2)}"
                    </div>
                 </div>
               ) : null}

            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 bg-white shadow-inner">
            <div className="w-20 h-20 bg-zinc-50 border border-zinc-100 rounded-full flex items-center justify-center mb-6">
               <MessageSquare className="w-10 h-10 text-zinc-200" />
            </div>
            <h3 className="text-lg font-black text-zinc-400 uppercase tracking-widest">Select Transmission</h3>
            <p className="text-sm font-medium text-zinc-400 max-w-sm text-center mt-3">Engage with intercontinental data intakes to advance the AfDEC strategic mandate.</p>
          </div>
        )}
      </div>
    </div>
  );
}
