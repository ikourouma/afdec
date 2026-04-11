"use client";

import React from "react";
import { TopNav } from "@/components/ui/top-nav";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Truck, Ship, Plane, FileCheck, ShieldAlert, ArrowRight, Anchor, Warehouse } from "lucide-react";
import Link from "next/link";

export default function ExportTradePage() {
  const LOGISTICS_PARTNERS = [
    { icon: Anchor, label: "Port of Wilmington, NC", status: "Active Hub" },
    { icon: Warehouse, label: "Lagos Free Zone", status: "Sovereign Node" },
    { icon: Plane, label: "CLT Global Logistics", status: "Air Corridor" },
    { icon: Ship, label: "Strategic Maritime", status: "Transatlantic" }
  ];

  return (
    <main className="min-h-screen bg-zinc-950 font-sans selection:bg-blue-500/30">
      <div className="sticky top-0 z-[100] w-full flex flex-col">
        <TopNav />
        <Header />
      </div>
      <Breadcrumb />

      {/* ── Export Hero ── */}
      <section className="pt-32 pb-24 border-b border-zinc-800/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(30,58,138,0.1)_0,transparent_50%)]" />
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-950/40 border border-amber-900/30 mb-8 rounded-full">
              <Truck className="w-3 h-3 text-amber-500" />
              <span className="text-[10px] font-bold tracking-[0.2em] text-amber-500 uppercase">Logistics Mandate</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[0.95] mb-8">
              Export & Trade<br />Assistance Hub.
            </h1>
            <p className="text-lg text-zinc-400 font-medium leading-relaxed mb-12">
              Facilitating the secure movement of goods and capital between North Carolina and African markets through certified supply chain corridors and export compliance management.
            </p>
          </div>
        </div>
      </section>

      {/* ── Logistics Network ── */}
      <section className="bg-[#080808] py-24 border-b border-zinc-800/30">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
           <div className="mb-16">
              <h2 className="text-2xl font-black text-white mb-2">Bilateral Logistics Network</h2>
              <p className="text-zinc-600 text-xs font-bold uppercase tracking-[0.3em]">Verified Transatlantic Nodes</p>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {LOGISTICS_PARTNERS.map((partner) => {
                const Icon = partner.icon;
                return (
                  <div key={partner.label} className="p-8 bg-zinc-900/20 border border-zinc-800 rounded-sm hover:border-amber-500/30 transition-all group">
                     <Icon className="w-8 h-8 text-amber-500/40 group-hover:text-amber-500 transition-colors mb-6" />
                     <h3 className="text-zinc-200 font-bold text-sm mb-1">{partner.label}</h3>
                     <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{partner.status}</p>
                  </div>
                );
              })}
           </div>
        </div>
      </section>

      {/* ── Compliance & File Desk ── */}
      <section className="bg-zinc-950 py-24">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
             <div>
                <div className="flex items-center space-x-3 mb-6">
                   <FileCheck className="w-7 h-7 text-emerald-500" />
                   <h2 className="text-3xl font-black text-white tracking-tight">Export Desk Assistance</h2>
                </div>
                <p className="text-zinc-400 leading-relaxed mb-10">
                   AfDEC provides direct consultative support for North Carolina SMEs navigating export licensing, AGOA (African Growth and Opportunity Act) certification, and sovereign custom protocols.
                </p>
                <div className="space-y-6">
                   <div className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-sm hover:border-zinc-700 transition-all">
                      <h4 className="text-white font-bold mb-2">Harmonized Tariff (HTS) Classification</h4>
                      <p className="text-xs text-zinc-500">Determining precise duty-free eligibility across AfCFTA regions.</p>
                   </div>
                   <div className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-sm hover:border-zinc-700 transition-all">
                      <h4 className="text-white font-bold mb-2">Export Compliance Audit</h4>
                      <p className="text-xs text-zinc-500">Risk-mitigation frameworks for high-value machinery and tech exports.</p>
                   </div>
                </div>
             </div>

             <div className="bg-amber-900/5 border border-amber-900/20 p-12 rounded-sm">
                <ShieldAlert className="w-12 h-12 text-amber-500/40 mb-8" />
                <h3 className="text-2xl font-black text-white mb-4">Urgent Supply Chain Advisory</h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-10">
                   Navigating congestion at West African ports or requiring expedited air freight for critical infrastructure components? Our Deal Team provides 24/7 logistics intervention.
                </p>
                <Link href="/contact?inquiry=logistics_emergency" className="inline-flex items-center text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] border border-amber-900/40 px-6 py-3 rounded-sm hover:bg-amber-900/20 transition-all">
                   Contact Logistics Command <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
             </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
