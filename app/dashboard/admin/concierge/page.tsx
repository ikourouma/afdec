"use client";

import React, { useState } from "react";
import { MessageSquare, ShieldCheck, Search, Filter, Paperclip, Send, Clock, Building2, AlertCircle } from "lucide-react";

export default function AdminConciergePage() {
  const [activeThread, setActiveThread] = useState<number | null>(1);

  const threads = [
    {
      id: 1,
      org: "Apex Agricultural Dev",
      contact: "sarah@apexagri.com",
      status: "priority",
      subject: "Clearance Request: Mega-Site Zoning (Lagos)",
      lastMessage: "We have uploaded the preliminary environmental impact reports.",
      time: "10 mins ago"
    },
    {
      id: 2,
      org: "Nigerian Logistics Hub",
      contact: "ops@nlh-trade.ng",
      status: "open",
      subject: "Awaiting SLA Counter-Signatures",
      lastMessage: "Can the Board confirm receipt of the updated Q3 deployment metrics?",
      time: "2 hours ago"
    },
    {
      id: 3,
      org: "State Department Liaison",
      contact: "policy@state.gov",
      status: "archived",
      subject: "Embargo Update Briefing",
      lastMessage: "File confirmed. Briefing uploaded to the Sovereign Databoard.",
      time: "1 day ago"
    }
  ];

  return (
    <div className="flex h-screen bg-zinc-50 font-sans">
      
      {/* Threads Sidebar */}
      <div className="w-1/3 bg-white border-r border-zinc-200 flex flex-col min-w-[320px]">
        <div className="p-6 border-b border-zinc-200 bg-zinc-50">
          <h1 className="text-xl font-extrabold text-zinc-900 tracking-tight">Communications Control</h1>
          <p className="text-xs font-semibold text-zinc-500 mt-1 uppercase tracking-widest">Encrypted Comm-Link Panel</p>
          
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search active transmissions..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-zinc-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:border-transparent focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {threads.map((thread) => (
            <div 
              key={thread.id} 
              onClick={() => setActiveThread(thread.id)}
              className={`p-4 border-b border-zinc-100 cursor-pointer transition-colors ${activeThread === thread.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-zinc-50 border-l-4 border-l-transparent'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-sm text-zinc-900 truncate">{thread.org}</span>
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider whitespace-nowrap ml-2">{thread.time}</span>
              </div>
              <div className="text-xs font-semibold text-zinc-600 truncate mb-2">{thread.subject}</div>
              
              <div className="flex items-center justify-between">
                <p className="text-xs text-zinc-500 truncate pr-4">{thread.lastMessage}</p>
                {thread.status === 'priority' && <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Thread Workspace */}
      <div className="flex-1 flex flex-col bg-zinc-50">
        {activeThread ? (
          <>
            {/* Thread Header */}
            <div className="h-20 px-8 border-b border-zinc-200 bg-white flex items-center justify-between shadow-sm z-10">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 flex items-center justify-center rounded-sm font-bold text-lg">
                  AP
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-zinc-900">Apex Agricultural Dev</h2>
                  <div className="flex items-center text-xs font-semibold text-zinc-500 uppercase tracking-widest mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 mr-1.5" />
                    Verified Enterprise · sarah@apexagri.com
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-white border border-zinc-300 rounded-sm text-sm font-bold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-sm">
                  Request KYC Docs
                </button>
                <button className="px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded-sm text-sm font-bold hover:bg-red-100 transition-colors">
                  Close Thread
                </button>
              </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              
              {/* Partner Message */}
              <div className="flex flex-col items-start max-w-2xl">
                <div className="flex items-center space-x-2 mb-1.5 px-1">
                  <span className="text-xs font-bold text-zinc-700">Sarah Jenkins</span>
                  <span className="text-[10px] text-zinc-400 font-semibold uppercase">10:42 AM</span>
                </div>
                <div className="bg-white border border-zinc-200 p-4 rounded-sm rounded-tl-none shadow-sm text-sm text-zinc-700 leading-relaxed">
                  <p>Command Board,</p>
                  <p className="mt-2 text-zinc-600">As requested during the Q3 review, we have prepared the updated environmental layout for the Lagos agricultural hub. Please review the attached PDF before we proceed with the government filing.</p>
                  
                  <div className="mt-4 flex items-center border border-zinc-200 rounded-sm p-3 bg-zinc-50 cursor-pointer hover:bg-zinc-100 transition-colors w-72">
                    <FileText className="w-8 h-8 text-red-500 mr-3" />
                    <div>
                      <p className="text-sm font-bold text-zinc-900">environmental_impact_v2.pdf</p>
                      <p className="text-xs text-zinc-500 uppercase font-semibold">4.2 MB · Encrypted</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Admin Input Terminal */}
            <div className="p-6 bg-white border-t border-zinc-200">
              <div className="border border-zinc-300 rounded-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all overflow-hidden bg-zinc-50">
                <textarea 
                  rows={4}
                  placeholder="Transmit securely to Apex Agricultural Dev..."
                  className="w-full bg-transparent p-4 text-sm resize-none focus:outline-none"
                />
                <div className="px-4 py-3 border-t border-zinc-200 bg-white flex items-center justify-between">
                  <div className="flex space-x-2">
                    <button className="p-2 text-zinc-400 hover:text-blue-600 transition-colors rounded-sm hover:bg-blue-50">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-zinc-400 hover:text-emerald-600 transition-colors rounded-sm hover:bg-emerald-50">
                      <ShieldCheck className="w-5 h-5" />
                    </button>
                  </div>
                  <button className="flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-sm transition-colors shadow-md">
                    Execute Transmission
                    <Send className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
              <p className="text-center text-[10px] uppercase font-bold text-zinc-400 mt-3 tracking-widest flex items-center justify-center">
                <Lock className="w-3 h-3 mr-1.5" /> End-to-End Encrypted via AfDEC Terminal
              </p>
            </div>

          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-400">
            <MessageSquare className="w-16 h-16 mb-4 opacity-50 text-zinc-300" />
            <h3 className="text-lg font-bold text-zinc-500">No Active Comm-Link Selected</h3>
            <p className="text-sm font-medium text-zinc-400 max-w-sm text-center mt-2">Select a transmission from the left panel to engage securely with Enterprise Partners or State Liaisons.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Inline fallback for the FileText and Lock icons if not destructured above
import { FileText, Lock } from "lucide-react";
