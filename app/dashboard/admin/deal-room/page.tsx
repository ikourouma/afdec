"use client";

import React, { useEffect, useState } from "react";
import { 
  Briefcase, 
  Building2, 
  Globe2, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Search, 
  Filter, 
  Clock, 
  Eye, 
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDealRoomPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("fund_applications")
      .select("*")
      .order("submitted_at", { ascending: false });
    
    if (!error && data) setApplications(data);
    setIsLoading(false);
  }

  async function updateStatus(id: string, newStatus: string) {
    const { error } = await supabase
      .from("fund_applications")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", id);
    
    if (!error) {
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
      if (selectedApp?.id === id) setSelectedApp({ ...selectedApp, status: newStatus });
    }
  }

  const filteredApps = applications.filter(app => 
    app.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.reference_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: applications.length,
    requested: applications.reduce((sum, app) => sum + (app.requested_amount_usd || 0), 0),
    pending: applications.filter(a => a.status === 'submitted' || a.status === 'under_review').length
  };

  return (
    <div className="p-8 md:p-12 max-w-[1600px] mx-auto min-h-screen font-sans bg-zinc-50">
      
      {/* ── Executive Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-100 border border-blue-200 rounded-sm mb-4">
            <Briefcase className="w-4 h-4 text-blue-600" />
            <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">SME Grant Pipeline</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-zinc-900 tracking-tight">Impact Deal Room</h1>
          <p className="text-zinc-500 font-medium mt-2 max-w-2xl">
            Managing the procurement lifecycle of the Diaspora Impact Fund. Review, audit, and approve bilateral SME grant applications with institutional oversight.
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-4 lg:w-[600px]">
           <div className="p-4 bg-white border border-zinc-200 rounded-sm shadow-sm">
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Total Pipeline</div>
              <div className="text-xl font-black text-zinc-900">{stats.total}</div>
           </div>
           <div className="p-4 bg-white border border-zinc-200 rounded-sm shadow-sm">
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Total Requested</div>
              <div className="text-xl font-black text-blue-600">${stats.requested.toLocaleString()}</div>
           </div>
           <div className="p-4 bg-white border border-zinc-200 rounded-sm shadow-sm">
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Action Needed</div>
              <div className="text-xl font-black text-amber-600">{stats.pending}</div>
           </div>
        </div>
      </div>

      {/* ── Table Controls ── */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search by business name or reference number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-zinc-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium"
          />
        </div>
        <button className="px-6 py-3 bg-white border border-zinc-200 rounded-sm text-sm font-bold text-zinc-700 hover:bg-zinc-50 flex items-center">
          <Filter className="w-4 h-4 mr-2" /> Filter By Status
        </button>
      </div>

      {/* ── Application Pipeline Table ── */}
      <div className="bg-white border border-zinc-200 rounded-sm overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-black text-zinc-500 uppercase tracking-[0.15em]">
                <th className="px-6 py-5">Reference</th>
                <th className="px-6 py-5">Business / Organization</th>
                <th className="px-6 py-5">Requested Amount</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Submission Date</th>
                <th className="px-6 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-zinc-400 font-medium">Synchronizing with Sovereign Data Vault...</td>
                </tr>
              ) : filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-zinc-400 font-medium">No applications found in the current pipeline.</td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-zinc-50/80 transition-colors group">
                    <td className="px-6 py-4 font-mono text-[11px] font-bold text-zinc-500">{app.reference_number}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-zinc-900">{app.business_name}</div>
                      <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{app.sector} · {app.country}</div>
                    </td>
                    <td className="px-6 py-4 font-black text-zinc-900 text-sm">
                      ${(app.requested_amount_usd || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        app.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        app.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-100' :
                        app.status === 'shortlisted' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                        'bg-amber-50 text-amber-700 border-amber-100'
                      }`}>
                        {app.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-zinc-400">
                      {new Date(app.submitted_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                         onClick={() => setSelectedApp(app)}
                         className="inline-flex items-center px-4 py-2 bg-zinc-950 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-blue-600 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5 mr-2" /> Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Application Detail Drawer (Low-Tech Management) ── */}
      <AnimatePresence>
        {selectedApp && (
          <>
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setSelectedApp(null)}
               className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-[200]" 
            />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white shadow-2xl z-[210] flex flex-col"
            >
               {/* Drawer Header */}
               <div className="p-8 border-b border-zinc-100 bg-zinc-50 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-blue-600 text-white rounded-sm flex items-center justify-center font-bold text-lg">
                        {selectedApp.business_name.substring(0, 2).toUpperCase()}
                     </div>
                     <div>
                        <h2 className="text-xl font-black text-zinc-900 leading-tight">{selectedApp.business_name}</h2>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">ID: {selectedApp.reference_number}</span>
                     </div>
                  </div>
                  <button onClick={() => setSelectedApp(null)} className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors">
                     <XCircle className="w-6 h-6" />
                  </button>
               </div>

               {/* Drawer Content */}
               <div className="flex-1 overflow-y-auto p-10 space-y-12">
                  
                  {/* Strategic Overview */}
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-1">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Procurement Status</label>
                        <div className="flex items-center space-x-2 text-amber-600 font-black text-sm uppercase">
                           <Clock className="w-4 h-4" />
                           <span>{selectedApp.status.replace(/_/g, " ")}</span>
                        </div>
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Contact Node</label>
                        <div className="text-zinc-900 font-bold text-sm">{selectedApp.contact_email}</div>
                     </div>
                  </div>

                  {/* Project Summary */}
                  <div className="space-y-6">
                     <div className="p-6 bg-zinc-50 border border-zinc-200 rounded-sm">
                        <h4 className="text-[11px] font-black text-blue-600 uppercase tracking-widest mb-4">Grant Proposal</h4>
                        <h3 className="text-lg font-black text-zinc-900 mb-3">{selectedApp.project_title}</h3>
                        <p className="text-zinc-600 text-sm leading-relaxed">{selectedApp.project_description}</p>
                     </div>

                     <div className="grid grid-cols-3 gap-6">
                        <div className="p-4 border border-zinc-100 rounded-sm text-center">
                           <div className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Request</div>
                           <div className="text-lg font-black text-zinc-900">${selectedApp.requested_amount_usd.toLocaleString()}</div>
                        </div>
                        <div className="p-4 border border-zinc-100 rounded-sm text-center">
                           <div className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Impact (Est)</div>
                           <div className="text-lg font-black text-zinc-900">{selectedApp.years_in_operation}+ Yrs</div>
                        </div>
                        <div className="p-4 border border-zinc-100 rounded-sm text-center">
                           <div className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Personnel</div>
                           <div className="text-lg font-black text-zinc-900">{selectedApp.employee_count} Staff</div>
                        </div>
                     </div>
                  </div>

                  {/* ── Document Vault (Verification) ── */}
                  <div className="space-y-4">
                     <div className="flex items-center space-x-2 mb-4">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <h3 className="font-black text-zinc-900 uppercase text-xs tracking-widest">Verification Documents</h3>
                     </div>
                     <div className="grid grid-cols-1 gap-3">
                        {[
                          { label: "Business Plan (MANDATORY)", url: selectedApp.business_plan_url },
                          { label: "Registration Artifact (MANDATORY)", url: selectedApp.registration_doc_url },
                          { label: "Financial Records (MANDATORY)", url: selectedApp.financial_statements_url }
                        ].map((doc) => (
                          <div key={doc.label} className="p-4 border border-zinc-200 rounded-sm flex items-center justify-between hover:border-blue-300 transition-colors group bg-zinc-50/50">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-zinc-100 rounded-sm flex items-center justify-center text-zinc-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                   <FileText className="w-4 h-4" />
                                </div>
                                <span className="text-[11px] font-bold text-zinc-600 group-hover:text-zinc-900 transition-colors">{doc.label}</span>
                             </div>
                             {doc.url ? (
                               <a href={doc.url} target="_blank" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-800 transition-colors md:block hidden">
                                 Download Artifact →
                               </a>
                             ) : (
                               <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">Not Uploaded</span>
                             )}
                          </div>
                        ))}
                     </div>
                  </div>

               </div>

               {/* Institutional Action Terminal */}
               <div className="p-8 border-t border-zinc-200 bg-zinc-50/50 space-y-4">
                  <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-4">Command Actions</div>
                  <div className="flex flex-wrap gap-3">
                     <button 
                       onClick={() => updateStatus(selectedApp.id, 'under_review')}
                       className={`px-5 py-2.5 rounded-sm text-[11px] font-black uppercase tracking-widest transition-all ${selectedApp.status === 'under_review' ? 'bg-amber-600 text-white shadow-lg' : 'bg-white border border-zinc-300 text-zinc-600 hover:border-amber-400'}`}
                     >
                       <Clock className="w-3.5 h-3.5 inline-block mr-2" /> Under Review
                     </button>
                     <button 
                       onClick={() => updateStatus(selectedApp.id, 'shortlisted')}
                       className={`px-5 py-2.5 rounded-sm text-[11px] font-black uppercase tracking-widest transition-all ${selectedApp.status === 'shortlisted' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white border border-zinc-300 text-zinc-600 hover:border-blue-400'}`}
                     >
                       <ShieldCheck className="w-3.5 h-3.5 inline-block mr-2" /> Shortlist
                     </button>
                     <button 
                       onClick={() => updateStatus(selectedApp.id, 'approved')}
                       className={`px-5 py-2.5 rounded-sm text-[11px] font-black uppercase tracking-widest transition-all ${selectedApp.status === 'approved' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white border border-zinc-300 text-zinc-600 hover:border-emerald-400'}`}
                     >
                       <CheckCircle2 className="w-3.5 h-3.5 inline-block mr-2" /> Approve
                     </button>
                     <button 
                       onClick={() => updateStatus(selectedApp.id, 'rejected')}
                       className={`px-5 py-2.5 rounded-sm text-[11px] font-black uppercase tracking-widest transition-all ${selectedApp.status === 'rejected' ? 'bg-red-600 text-white shadow-lg' : 'bg-white border border-zinc-300 text-zinc-600 hover:border-red-400'}`}
                     >
                       <XCircle className="w-3.5 h-3.5 inline-block mr-2" /> Reject
                     </button>
                  </div>
                  <p className="text-[9px] font-bold text-zinc-400 flex items-center pt-4">
                    <ShieldCheck className="w-3 h-3 mr-1.5 text-emerald-500" /> All status changes are recorded in the institutional audit trail for compliance verification.
                  </p>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
