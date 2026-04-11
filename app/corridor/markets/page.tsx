"use client";

import React from "react";
import { TopNav } from "@/components/ui/top-nav";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Globe2, TrendingUp, BarChart3, ShieldCheck, ArrowRight, Building2 } from "lucide-react";
import Link from "next/link";

export default function MarketAccessPage() {
  const REGIONS = [
    { name: "West Africa", growth: "+5.8%", projects: 12, hub: "Accra, Ghana" },
    { name: "East Africa", growth: "+6.1%", projects: 8, hub: "Nairobi, Kenya" },
    { name: "Southern Africa", growth: "+4.4%", projects: 5, hub: "Johannesburg, SA" },
    { name: "North Africa", growth: "+3.9%", projects: 4, hub: "Cairo, Egypt" }
  ];

  return (
    <main className="min-h-screen bg-zinc-950 font-sans selection:bg-blue-500/30">
      <div className="sticky top-0 z-[100] w-full flex flex-col">
        <TopNav />
        <Header />
      </div>
      <Breadcrumb />

      {/* ── Market Access Hero ── */}
      <section className="pt-32 pb-24 border-b border-zinc-800/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-overlay pointer-events-none" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=2670&auto=format&fit=crop')" }} />
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-900/40 border border-blue-900/30 mb-8 rounded-full">
              <Globe2 className="w-3 h-3 text-blue-400" />
              <span className="text-[10px] font-bold tracking-[0.2em] text-blue-400 uppercase">Trade Intelligence</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[0.95] mb-8">
              Market Access<br />by Region.
            </h1>
            <p className="text-lg text-zinc-400 font-medium leading-relaxed mb-12">
              Analyzing sovereign data and AfCFTA integration layers to provide North Carolina enterprise partners with frictionless market entry trajectories across the African continent.
            </p>
            <div className="flex flex-wrap gap-4">
               <Link href="/insights/data-terminal" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest rounded-sm transition-all shadow-lg">
                  Access Intelligence Terminal
               </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Regional Telemetry ── */}
      <section className="bg-zinc-950 py-24 border-b border-zinc-800/30">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {REGIONS.map((region) => (
                <div key={region.name} className="p-8 bg-zinc-900/20 border border-zinc-800 hover:border-blue-500/30 transition-all group">
                   <div className="flex justify-between items-start mb-8">
                      <h3 className="text-white font-bold text-lg">{region.name}</h3>
                      <TrendingUp className="w-5 h-5 text-emerald-500" />
                   </div>
                   <div className="space-y-6">
                      <div>
                         <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">GDP Growth (Avg)</div>
                         <div className="text-2xl font-black text-white">{region.growth}</div>
                      </div>
                      <div>
                         <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Active AfDEC Projects</div>
                         <div className="text-2xl font-black text-blue-500">{region.projects}</div>
                      </div>
                      <div className="pt-6 border-t border-zinc-900">
                         <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Primary Trade Hub</div>
                         <div className="text-sm font-bold text-zinc-300">{region.hub}</div>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* ── Bilateral Barriers & Clearance ── */}
      <section className="bg-[#080808] py-24">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
             <div>
                <h2 className="text-3xl font-black text-white mb-6">Frictionless Compliance Architecture</h2>
                <p className="text-zinc-500 text-[15px] leading-relaxed mb-8">
                   AfDEC bridges the historical gap between US regulatory standards and African diverse market regulations. Our market access protocol reduces the risk profile of transatlantic expansion by 60%.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   <div className="flex items-start space-x-4">
                      <ShieldCheck className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
                      <div>
                         <h4 className="text-white font-bold text-sm mb-1">Regulatory Mapping</h4>
                         <p className="text-xs text-zinc-600">Aligning NC-based contracts with sovereign civil laws.</p>
                      </div>
                   </div>
                   <div className="flex items-start space-x-4">
                      <BarChart3 className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
                      <div>
                         <h4 className="text-white font-bold text-sm mb-1">Duty-Free Routing</h4>
                         <p className="text-xs text-zinc-600">Maximizing AfCFTA and AGOA tariff benefits.</p>
                      </div>
                   </div>
                </div>
             </div>
             
             <div className="relative aspect-video rounded-sm overflow-hidden border border-zinc-800 shadow-2xl">
                <img src="https://images.unsplash.com/photo-1554224155-1677a28a1908?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-700" />
                <div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay" />
                <div className="absolute inset-0 flex items-center justify-center p-12 text-center">
                   <div>
                      <Building2 className="w-16 h-16 text-blue-500/30 mx-auto mb-6" />
                      <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tighter">Ready for Expansion?</h3>
                      <Link href="/corridor/expansion" className="inline-flex items-center text-xs font-black text-white uppercase tracking-[0.3em] border-b border-blue-500 pb-1 hover:text-blue-400 transition-colors">
                        Register Enterprise <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
