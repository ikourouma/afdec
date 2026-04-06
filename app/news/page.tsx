"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { FileText, ArrowRight, ShieldCheck, Download, Search, Globe2, Calendar } from "lucide-react";
import { TopNav } from "@/components/ui/top-nav";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import Link from "next/link";

const mockBriefings = [
  {
    id: 1,
    title: "Q4 Continental Infrastructure Forecast",
    date: "November 14, 2026",
    category: "Macro Intelligence",
    excerpt: "Analysis of the $1.2B direct investment inflows targeting the West African agritech and logistics corridors, heavily anchored by North Carolina 501(c)(4) deployment strategies.",
    image: "https://images.unsplash.com/photo-1590487988256-9ed24133863e?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Sovereign Debt Repositioning Strategies",
    date: "October 22, 2026",
    category: "Policy Framework",
    excerpt: "Examining the impact of the latest bilateral tariff adjustments and their effect on US-Africa enterprise scalability through Q2 2027.",
    image: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Diaspora Demographic Integration Report",
    date: "September 08, 2026",
    category: "Social Capital",
    excerpt: "Tracking the accelerating integration of first-generation diaspora leaders into the North Carolinian executive infrastructure.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop"
  }
];

export default function MarketBriefingsPage() {
  const headerRef = useRef(null);
  const gridRef = useRef(null);

  useGSAP(() => {
    gsap.from(headerRef.current, { y: 30, opacity: 0, duration: 1, ease: "power3.out" });
    gsap.from(".briefing-card", {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power2.out",
      scrollTrigger: { trigger: gridRef.current, start: "top 80%" }
    });
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 font-sans selection:bg-blue-500/30">
      
      {/* Global Navigation Shell */}
      <div className="sticky top-0 z-50 shadow-sm">
        <TopNav />
        <Header />
      </div>

      <main>
        {/* Dynamic Dark Sovereign Header */}
        <div className="bg-zinc-950 pt-24 pb-32 px-6 lg:px-12 border-b border-zinc-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[#002f6c] bg-opacity-[0.03] pattern-grid-lg"></div>
          
          <div className="max-w-[1600px] mx-auto relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8" ref={headerRef}>
            <div className="max-w-3xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-sm mb-6">
                <Globe2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Open Intelligence</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
                AfDEC Market Briefings
              </h1>
              <p className="text-lg md:text-xl text-zinc-400 font-medium leading-relaxed max-w-2xl">
                Decisive macroeconomic analysis, institutional policy shifts, and direct infrastructure telemetry curated by the Board of Directors.
              </p>
            </div>

            {/* Sub-Search / Filter Terminal */}
            <div className="w-full md:w-80 bg-zinc-900 p-1 rounded-sm border border-zinc-800 flex items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="text" 
                  placeholder="Search intelligence..." 
                  className="w-full pl-9 pr-4 py-3 bg-transparent text-white text-sm focus:outline-none placeholder:text-zinc-600"
                />
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-sm transition-colors">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Structural Layout: Grid + Tactical Sidebar */}
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-16 flex flex-col lg:flex-row gap-12">
          
          {/* Main Briefing Grid */}
          <div className="lg:w-2/3" ref={gridRef}>
            <div className="flex items-center justify-between mb-8 border-b border-zinc-200 pb-4">
              <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Recent Archives</h2>
              <div className="text-sm font-bold text-blue-600 cursor-pointer hidden sm:block">View Data Room Policies</div>
            </div>

            <div className="space-y-8">
              {mockBriefings.map((brief, i) => (
                <div key={brief.id} className="briefing-card group flex flex-col sm:flex-row overflow-hidden bg-white border border-zinc-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 rounded-lg cursor-pointer">
                  
                  {/* Thumbnail */}
                  <div className="sm:w-1/3 h-48 sm:h-auto relative overflow-hidden shrink-0">
                    <img src={brief.image} alt={brief.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                    <div className="absolute top-4 left-4">
                       <span className="px-3 py-1 bg-black/80 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest rounded-sm">
                         {brief.category}
                       </span>
                    </div>
                  </div>

                  {/* Content Payload */}
                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-center">
                    <div className="flex items-center text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">
                      <Calendar className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                      {brief.date}
                    </div>
                    <h3 className="text-xl md:text-2xl font-extrabold text-zinc-900 tracking-tight mb-3 group-hover:text-blue-700 transition-colors">
                      {brief.title}
                    </h3>
                    <p className="text-zinc-600 text-sm leading-relaxed mb-6 font-medium line-clamp-2">
                      {brief.excerpt}
                    </p>
                    
                    <div className="flex items-center text-sm font-black text-blue-600 uppercase tracking-widest mt-auto">
                      Read Full Briefing <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination Standard */}
            <div className="mt-12 flex justify-center space-x-2">
              <button className="w-10 h-10 flex items-center justify-center bg-zinc-900 text-white font-bold rounded-sm">1</button>
              <button className="w-10 h-10 flex items-center justify-center border border-zinc-300 text-zinc-600 hover:bg-zinc-100 font-bold rounded-sm transition-colors">2</button>
              <button className="w-10 h-10 flex items-center justify-center border border-zinc-300 text-zinc-600 hover:bg-zinc-100 font-bold rounded-sm transition-colors">3</button>
            </div>
          </div>

          {/* Institutional Sidebar */}
          <div className="lg:w-1/3 space-y-8">
            
            {/* Partner Portal Callout */}
            <div className="bg-[#002f6c] p-8 rounded-lg text-white relative overflow-hidden shadow-xl">
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 block"></div>
              
              <ShieldCheck className="w-10 h-10 text-blue-300 mb-6 relative z-10" />
              <h3 className="text-2xl font-black tracking-tight mb-4 relative z-10 leading-tight">Require Deep Institutional Analytics?</h3>
              <p className="text-blue-100 text-sm mb-8 leading-relaxed font-medium relative z-10">
                Sovereign partners and registered 501(c)(4) entities can access deeply restricted data-sets, including embargoed physical infrastructure RFPs, via the highly-secure Partner Portal.
              </p>
              
              <Link href="/auth" className="inline-flex items-center justify-center w-full bg-white hover:bg-zinc-100 text-[#002f6c] px-6 py-4 rounded-sm font-black text-sm uppercase tracking-widest transition-colors shadow-lg relative z-10 group">
                Enter Universal Gateway
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* PDF Downloads */}
            <div className="bg-white border border-zinc-200 p-8 rounded-lg shadow-sm">
              <h3 className="font-extrabold text-zinc-900 mb-6 text-lg tracking-tight flex items-center">
                <Download className="w-5 h-5 text-blue-600 mr-2" />
                Raw Data Vault
              </h3>
              
              <ul className="space-y-4">
                {[
                  { name: "2026 Fiscal Impact Report", size: "4.2 MB", ext: "PDF" },
                  { name: "West Africa Energy Grid Metrics", size: "1.1 MB", ext: "XLSX" },
                  { name: "Demographic Shift Projections", size: "8.9 MB", ext: "PDF" },
                ].map((file, i) => (
                  <li key={i} className="flex flex-col group cursor-pointer border border-zinc-100 p-4 rounded-sm hover:border-blue-200 transition-colors bg-zinc-50 hover:bg-blue-50/30">
                    <span className="text-sm font-bold text-zinc-800 group-hover:text-blue-700 transition-colors truncate">{file.name}</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 mt-2">.{file.ext} FORMAT · {file.size}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
