"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FileText, ArrowRight, ShieldCheck, Download, Search, Globe2, Calendar } from "lucide-react";
import { TopNav } from "@/components/ui/top-nav";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { FlashBanner } from "@/components/ui/flash-banner";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const mockBriefings = [
  {
    id: 1,
    title: "AfDEC Announces $50M Transatlantic Ag-Tech Fund",
    date: "October 12, 2026",
    category: "Press Release",
    excerpt: "The Council today finalized the deployment of a $50 million sovereign-backed fund to accelerate advanced agricultural technology transfers between North Carolina and the East African tech corridor.",
    image: "https://images.unsplash.com/photo-1595804595822-1d48c8b45942?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "North Carolina Megasite Selected for Continent-Level Battery Manufacturing",
    date: "September 28, 2026",
    category: "Press Release",
    excerpt: "A major African EV conglomerate has partnered with AfDEC to establish a Tier 1 lithium processing and battery manufacturing hub in central North Carolina, creating 3,000 projected high-yield jobs.",
    image: "https://images.unsplash.com/photo-1565893322194-e840003b0cbe?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "AfDEC Hosted Sovereign Delegation Secures Fintech Corridor",
    date: "September 04, 2026",
    category: "Press Release",
    excerpt: "Following a three-day summit in Raleigh, trade ministers from four West African nations signed the Fintech Corridor Agreement, drastically reducing cross-border banking friction for diaspora-led enterprises.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Q4 Continental Infrastructure Forecast",
    date: "November 14, 2026",
    category: "Macro Intelligence",
    excerpt: "Analysis of the $1.2B direct investment inflows targeting the West African agritech and logistics corridors, heavily anchored by North Carolina 501(c)(4) deployment strategies.",
    image: "https://images.unsplash.com/photo-1590487988256-9ed24133863e?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 5,
    title: "Sovereign Debt Repositioning Strategies",
    date: "October 22, 2026",
    category: "Policy Framework",
    excerpt: "Examining the impact of the latest bilateral tariff adjustments and their effect on US-Africa enterprise scalability through Q2 2027.",
    image: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?q=80&w=1000&auto=format&fit=crop"
  }
];

export default function MarketBriefingsPage() {
  const headerRef = useRef(null);
  const gridRef = useRef(null);

  useGSAP(() => {
    gsap.from(headerRef.current, { y: 30, opacity: 0, duration: 1, ease: "power3.out" });
    gsap.fromTo(".briefing-card",
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: { trigger: gridRef.current, start: "top 85%" }
      }
    );
  }, { scope: undefined });

  return (
    <div className="min-h-screen bg-zinc-950 font-sans selection:bg-blue-500/30">
      
      {/* Global Navigation Shell */}
      <div className="sticky top-0 z-[100] w-full flex flex-col">
        <TopNav />
        <FlashBanner />
        <Header />
      </div>
      <Breadcrumb />

      <main>
        {/* Cinematic Multi-Layer Hero (matching /why-nc) */}
        <section className="relative bg-zinc-950 border-b border-zinc-800/50 overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.45]"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1504711434969-e33886168d6c?q=80&w=2670&auto=format&fit=crop')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 opacity-[0.035] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.5'%3E%3Cpath d='M0 30h60M30 0v60'/%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: "60px 60px" }} />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/88 to-zinc-950/25" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-zinc-950 to-transparent" />

          <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-24 md:py-32 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8" ref={headerRef}>
            <div className="max-w-3xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-zinc-800/80 border border-zinc-700/50 mb-6 rounded-full backdrop-blur-md">
                <Globe2 className="w-4 h-4 text-emerald-400" />
                <span className="text-[11px] font-bold tracking-[0.2em] text-zinc-400 uppercase">Open Intelligence</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] max-w-4xl mb-6">
                AfDEC Market Briefings
              </h1>
              <p className="text-lg md:text-xl text-zinc-400 font-medium leading-relaxed max-w-2xl">
                Decisive macroeconomic analysis, institutional policy shifts, and direct infrastructure telemetry curated by the Board of Directors.
              </p>
            </div>

            {/* Search Terminal */}
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
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
        </section>

        {/* Structural Layout: Grid + Tactical Sidebar */}
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-16 flex flex-col lg:flex-row gap-12">
          
          {/* Main Briefing Grid */}
          <div className="lg:w-2/3" ref={gridRef}>
            <div className="flex items-center justify-between mb-8 border-b border-zinc-800 pb-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">Recent Archives</h2>
              <div className="text-sm font-bold text-blue-500 cursor-pointer hidden sm:block">View Data Room Policies</div>
            </div>

            <div className="space-y-8">
              {mockBriefings.map((brief) => (
                <Link key={brief.id} href={`/news/${brief.id}`} className="briefing-card group block overflow-hidden bg-zinc-900/60 border border-zinc-800 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 rounded-lg cursor-pointer">
                  <div className="flex flex-col sm:flex-row sm:h-[220px]">
                    {/* Thumbnail */}
                    <div className="sm:w-1/3 h-48 sm:h-full relative overflow-hidden shrink-0">
                      <img src={brief.image} alt={brief.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-black/80 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest rounded-sm">
                          {brief.category}
                        </span>
                      </div>
                    </div>

                    {/* Content Payload */}
                    <div className="p-6 sm:p-8 flex-1 flex flex-col justify-center overflow-hidden">
                      <div className="flex items-center text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">
                        <Calendar className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                        {brief.date}
                      </div>
                      <h3 className="text-lg md:text-xl font-extrabold text-white tracking-tight mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                        {brief.title}
                      </h3>
                      <p className="text-zinc-400 text-sm leading-relaxed font-medium line-clamp-2">
                        {brief.excerpt}
                      </p>
                      
                      <div className="flex items-center text-sm font-black text-blue-500 uppercase tracking-widest mt-auto">
                        Read Full Briefing <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Pagination Standard */}
            <div className="mt-12 flex justify-center space-x-2">
              <button className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white font-bold rounded-sm">1</button>
              <button className="w-10 h-10 flex items-center justify-center border border-zinc-700 text-zinc-400 hover:bg-zinc-800 font-bold rounded-sm transition-colors">2</button>
              <button className="w-10 h-10 flex items-center justify-center border border-zinc-700 text-zinc-400 hover:bg-zinc-800 font-bold rounded-sm transition-colors">3</button>
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
                Access Member Portal
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* PDF Downloads */}
            <div className="bg-zinc-900/60 border border-zinc-800 p-8 rounded-lg">
              <h3 className="font-extrabold text-white mb-6 text-lg tracking-tight flex items-center">
                <Download className="w-5 h-5 text-blue-500 mr-2" />
                Raw Data Vault
              </h3>
              
              <ul className="space-y-4">
                {[
                  { name: "2026 Fiscal Impact Report", size: "4.2 MB", ext: "PDF" },
                  { name: "West Africa Energy Grid Metrics", size: "1.1 MB", ext: "XLSX" },
                  { name: "Demographic Shift Projections", size: "8.9 MB", ext: "PDF" },
                ].map((file, i) => (
                  <li key={i} className="flex flex-col group cursor-pointer border border-zinc-800 p-4 rounded-sm hover:border-blue-500/50 transition-colors bg-zinc-900/40 hover:bg-zinc-800/40">
                    <span className="text-sm font-bold text-zinc-300 group-hover:text-blue-400 transition-colors truncate">{file.name}</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-600 mt-2">.{file.ext} FORMAT · {file.size}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

      </main>

      <div className="mt-24">
        <Footer />
      </div>
    </div>
  );
}
