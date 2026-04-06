"use client";

import React, { useState } from "react";
import { Briefcase, Building2, Globe2, ArrowRight, ShieldCheck, TrendingUp, Network, Zap } from "lucide-react";

export default function InfrastructureDealRoomPage() {
  const [activePipeline, setActivePipeline] = useState<"energy" | "logistics" | "agritech">("energy");

  return (
    <div className="p-8 md:p-12 max-w-[1600px] mx-auto min-h-screen font-sans">
      
      {/* Strategic Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-100 border border-amber-200 rounded-sm mb-4">
            <Briefcase className="w-4 h-4 text-amber-600 truncate" />
            <span className="text-xs font-black text-amber-700 uppercase tracking-widest shrink-0">Tier-1 Institutional Asset</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-zinc-900 tracking-tight">Infrastructure Deal Room</h1>
          <p className="text-zinc-500 font-medium mt-2 max-w-2xl leading-relaxed">
            The active transaction pipeline for sovereign-grade megasites. Connect verified African government RFPs directly to North Carolina enterprise capital.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center justify-center px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-sm font-bold text-white uppercase tracking-widest rounded-sm transition-colors shadow-lg">
            <ShieldCheck className="w-4 h-4 mr-2" />
            Issue Deal Mandate
          </button>
        </div>
      </div>

      {/* Sector Filters */}
      <div className="flex space-x-4 mb-8">
        <button 
          onClick={() => setActivePipeline("energy")}
           className={`flex items-center px-6 py-4 border rounded-sm font-bold text-sm transition-all shadow-sm flex-1 justify-center ${activePipeline === 'energy' ? 'bg-white border-blue-600 text-blue-700 ring-1 ring-blue-600' : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:bg-white'}`}
        >
          <Zap className={`w-5 h-5 mr-3 ${activePipeline === 'energy' ? 'text-blue-600' : 'text-zinc-400'}`} />
          Energy Corridors
        </button>
        <button 
           onClick={() => setActivePipeline("logistics")}
           className={`flex items-center px-6 py-4 border rounded-sm font-bold text-sm transition-all shadow-sm flex-1 justify-center ${activePipeline === 'logistics' ? 'bg-white border-blue-600 text-blue-700 ring-1 ring-blue-600' : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:bg-white'}`}
        >
          <Network className={`w-5 h-5 mr-3 ${activePipeline === 'logistics' ? 'text-blue-600' : 'text-zinc-400'}`} />
          Deep Water Logistics
        </button>
        <button 
           onClick={() => setActivePipeline("agritech")}
           className={`flex items-center px-6 py-4 border rounded-sm font-bold text-sm transition-all shadow-sm flex-1 justify-center ${activePipeline === 'agritech' ? 'bg-white border-blue-600 text-blue-700 ring-1 ring-blue-600' : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:bg-white'}`}
        >
          <Globe2 className={`w-5 h-5 mr-3 ${activePipeline === 'agritech' ? 'text-blue-600' : 'text-zinc-400'}`} />
          Sovereign Agritech
        </button>
      </div>

      {/* Deal Pipeline Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Deal Card */}
        <div className="col-span-2 bg-white border border-zinc-200 rounded-md shadow-sm overflow-hidden flex flex-col relative group">
           <div className="absolute top-0 right-0 p-4 shrink-0">
             <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-sm border border-emerald-200">
               Funding Open
             </span>
           </div>
           
           <div className="h-48 bg-zinc-900 relative">
             <img src="https://images.unsplash.com/photo-1513828583688-c52646db42da?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover opacity-60 mix-blend-overlay" />
             <div className="absolute inset-x-6 bottom-6">
                <h2 className="text-3xl font-black text-white tracking-tight mb-2">Lagos Solar Array Expansion</h2>
                <div className="flex items-center text-sm font-bold text-zinc-300 uppercase tracking-widest">
                  <Globe2 className="w-4 h-4 mr-2" />
                  Federal Republic of Nigeria
                </div>
             </div>
           </div>

           <div className="p-8 flex-1 flex flex-col justify-between border-b border-zinc-100">
              <div>
                <p className="text-zinc-600 font-medium leading-relaxed max-w-xl mb-8">
                  The Ministry of Power has issued an expedited RFP for a 400MW solar grid installation targeting the industrial outskirts of Lagos. AfDEC has secured bilateral fast-track processing for North Carolina enterprise partners.
                </p>

                <div className="grid grid-cols-2 gap-6 p-6 bg-zinc-50 border border-zinc-200 rounded-sm">
                  <div>
                    <h4 className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1">Capital Mandate</h4>
                    <span className="text-2xl font-black text-zinc-900 tracking-tight">$420,000,000</span>
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1">Guaranteed Sovereign Yield</h4>
                    <span className="text-2xl font-black text-emerald-600 tracking-tight flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" /> 8.4% APY
                    </span>
                  </div>
                </div>
              </div>
           </div>

           <div className="bg-zinc-50 px-8 py-5 flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500">14 Enterprise Partners actively in Due-Diligence.</span>
              <button className="flex items-center text-sm font-black text-blue-600 uppercase tracking-widest hover:text-blue-800 transition-colors">
                 Access Physical Documentation <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
           </div>
        </div>

        {/* Global Pipeline Map */}
        <div className="bg-zinc-950 rounded-md shadow-sm border border-zinc-900 overflow-hidden relative flex flex-col">
           <div className="p-6 bg-zinc-900 border-b border-zinc-800 z-10 flexitems-center justify-between">
             <div>
               <h3 className="font-bold text-white text-lg tracking-tight">Active Databoard</h3>
               <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Live Capital Movement</p>
             </div>
           </div>
           
           <div className="flex-1 relative bg-[#011428] flex items-center justify-center p-8">
              {/* Mapbox / Data Viz placeholder */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15)_0,transparent_100%)]"></div>
              <div className="text-center relative z-10">
                <ShieldCheck className="w-16 h-16 text-blue-500/50 mx-auto mb-4" />
                <h4 className="text-white font-bold tracking-tight mb-2">Sovereign Map Engine</h4>
                <p className="text-xs font-semibold text-blue-200/50 max-w-[200px] leading-relaxed mx-auto">
                  WebGL 3D Earth visualization displaying real-time funding trajectories from NC routing to West African mega-sites.
                </p>
              </div>
           </div>

           <div className="p-6 border-t border-zinc-800 bg-zinc-900">
             <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-widest rounded-sm transition-colors shadow-sm cursor-pointer">
               Initialize Data Visualization
             </button>
           </div>
        </div>

      </div>
    </div>
  );
}
