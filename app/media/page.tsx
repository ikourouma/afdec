"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { TopNav } from "@/components/ui/top-nav";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Newsletter } from "@/components/ui/newsletter";
import { FlashBanner } from "@/components/ui/flash-banner";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { 
  Megaphone, 
  Newspaper, 
  Tv, 
  Radio, 
  ArrowRight, 
  ArrowUpRight,
  MonitorPlay,
  Presentation
} from "lucide-react";

const newsItems = [
  {
    id: 1,
    title: "AfDEC Facilitates $250M Infrastructure EPC for West African Logistics Hub",
    date: "OCT 12, 2026",
    category: "Infrastructure",
    excerpt: "The agreement marks a pivotal moment in the bi-national trade narrative, connecting North Carolina's EPC excellence to West African development markets.",
    image: "https://images.unsplash.com/photo-1554469384-e58fac16e23a", // Logistics skyline
    accent: "text-blue-500 bg-blue-500/5",
    icon: Newspaper
  },
  {
    id: 2,
    title: "Sovereign Market: AfDEC Digital Portal Records 200% Growth in Registrations",
    date: "OCT 08, 2026",
    category: "Technology",
    excerpt: "Institutional entities from 15 African nations and 24 NC counties are now fully onboarded into the Sovereign Digital Corridor.",
    image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0", // Tech graph
    accent: "text-emerald-500 bg-emerald-500/5",
    icon: Megaphone
  },
  {
    id: 3,
    title: "Global Diaspora Summit: AfDEC Executive Secretariat Outlines Q4 Mandates",
    date: "SEP 29, 2026",
    category: "Engagement",
    excerpt: "The Summit brought together board members and council leaders to harmonize policy advocacy across North Carolina and the African Union.",
    image: "https://images.unsplash.com/photo-1528605248644-14dd04cb11c7", // Diversity event
    accent: "text-amber-500 bg-amber-500/5",
    icon: Presentation
  }
];

export default function MediaPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(".news-card", 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: "power3.out" }
    );
  }, { scope: containerRef });

  return (
    <main ref={containerRef} className="min-h-screen bg-zinc-950 font-sans selection:bg-blue-500/30 selection:text-blue-200">
      <div className="sticky top-0 z-[100] w-full flex flex-col">
        <TopNav />
        <FlashBanner />
        <Header />
      </div>
      <Breadcrumb />

      {/* ── Hero: Media & Intelligence ── */}
      <section className="relative bg-[#080808] border-b border-zinc-800/50 overflow-hidden">
        {/* Layer 1: Media Dynamic Depth */}
        <div
          className="absolute inset-0 opacity-[0.2]"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1492619334760-22730bf1832d?q=80&w=2070&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        
        {/* Layer 2: Broadcast Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h1v100H0zM0 0h100v1H0z' fill='white'/%3E%3C/svg%3E")`, backgroundSize: "100px 100px" }} />

        {/* Layer 3: Cinematic Reveal Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/88 to-zinc-950/10" />
        
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-24 md:py-32 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-zinc-800/80 border border-zinc-700/50 mb-6 rounded-full backdrop-blur-md">
            <Megaphone className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-[11px] font-bold tracking-[0.2em] text-zinc-400 uppercase">Press & Intelligence</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] max-w-4xl">
            Sovereign Intelligence:<br/>The Global Briefing
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 mt-8 max-w-2xl leading-relaxed font-medium">
            Stay aligned with the official narrative of bi-national development. Access institutional press releases, market data, and executive briefings from our global media desk.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      </section>

      {/* ── Featured Intelligence (High-Tier) ── */}
      <section className="bg-zinc-950 py-24 md:py-32 border-b border-zinc-900 overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            {/* Featured Image Canvas */}
            <div className="w-full lg:w-1/2 relative group rounded-lg overflow-hidden border border-zinc-800 flex shrink-0 h-[400px]">
              <img 
                src="https://images.unsplash.com/photo-1541872703-74c5e443d1f5?q=80&w=2038&auto=format&fit=crop" 
                alt="AfDEC Conference" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 p-6 bg-zinc-900/60 backdrop-blur-md border border-zinc-700/50 rounded-sm">
                <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2 flex items-center">
                  <MonitorPlay className="w-3.5 h-3.5 mr-2" />
                  Live Event: Executive Secretariat 2026 Review
                </div>
                <h3 className="text-xl font-bold text-white leading-tight">Bi-National Policy Alignment for Infrastructure EPC</h3>
              </div>
            </div>
            
            {/* Featured Narrative */}
            <div className="w-full lg:w-1/2">
              <span className="text-[11px] font-bold tracking-[0.3em] text-zinc-600 uppercase">Featured Intelligence</span>
              <h2 className="text-3xl md:text-5xl font-black text-white mt-4 tracking-tight leading-tight">Outlining the Global Sovereign Mandate</h2>
              <p className="text-zinc-400 mt-8 text-lg leading-relaxed font-medium">
                Our Executive Secretariat has successfully coordinated with the N.C. Department of Commerce and the African Continental Free Trade Area (AfCFTA) secretariats to harmonize trade policy mandates.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <button className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-[12px] font-bold tracking-widest uppercase transition-all rounded-sm">Read Full Statement</button>
                <button className="flex items-center px-6 py-3 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white text-[12px] font-bold tracking-widest uppercase transition-all rounded-sm">Press Kit Access</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Intelligence Feed ── */}
      <section className="bg-[#080808] py-24 md:py-32">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16 md:mb-24">
            <span className="text-[11px] font-bold tracking-[0.25em] text-zinc-600 uppercase underline decoration-blue-500 underline-offset-8">Press & Intelligence Feed</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mt-8 tracking-tight">Institutional Briefing Archives</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsItems.map((item) => (
              <div key={item.id} className="news-card group flex flex-col bg-zinc-900/30 border border-zinc-800 hover:border-zinc-700 rounded-lg overflow-hidden transition-all duration-300">
                <div className="relative h-64 overflow-hidden border-b border-zinc-800">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-zinc-950/20 group-hover:bg-zinc-950/0 transition-all duration-500" />
                  <div className="absolute top-4 left-4 flex items-center space-x-2">
                    <div className="px-3 py-1 bg-zinc-900/80 backdrop-blur-md border border-zinc-700 text-[10px] font-black text-blue-400 uppercase tracking-widest rounded-full">{item.category}</div>
                  </div>
                </div>
                
                <div className="p-10 flex flex-col flex-grow">
                  <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4 flex items-center">
                    <item.icon className="w-3.5 h-3.5 mr-2 text-zinc-500" />
                    Archive ID: {item.date}
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4 leading-tight leading-tight block group-hover:text-blue-500 transition-colors">
                    <Link href="#">{item.title}</Link>
                  </h3>
                  <p className="text-[14px] text-zinc-500 leading-relaxed mb-10 flex-grow">
                    {item.excerpt}
                  </p>
                  
                  <Link href="#" className="flex items-center space-x-2 text-[11px] font-black tracking-widest uppercase text-white group-hover:text-blue-500 transition-colors">
                    <span>Full Transmission</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <button className="px-10 py-5 bg-zinc-900 hover:bg-black text-white text-[12px] font-black tracking-widest uppercase rounded-sm border border-zinc-800 transition-all">Load Full Archivist Feed</button>
          </div>
        </div>
      </section>

      {/* ── Partner Media Desk ── */}
      <section className="bg-zinc-950 py-24 mb-10 border-t border-zinc-900">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-[11px] font-black tracking-[0.2em] text-blue-500 uppercase">Bi-National Media Desk</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mt-4 tracking-tight leading-tight">High-Scale Media Partnerships & Institutional Press Kits</h2>
            <p className="text-zinc-500 mt-8 text-lg leading-relaxed">
              AfDEC provides the bi-national press kits, market data visuals, and executive statements for global media partners. We manage the official narrative of binational development.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="p-8 bg-zinc-900/40 border border-zinc-800 rounded-lg group transition-all hover:border-blue-500/50">
              <Tv className="w-8 h-8 text-blue-500 mb-6" />
              <h4 className="text-white font-bold mb-2">Video Archive</h4>
              <p className="text-xs text-zinc-600">4K Broadcast Institutional Assets</p>
            </div>
            <div className="p-8 bg-zinc-900/40 border border-zinc-800 rounded-lg group transition-all hover:border-blue-500/50">
              <Radio className="w-8 h-8 text-emerald-500 mb-6" />
              <h4 className="text-white font-bold mb-2">Press Statements</h4>
              <p className="text-xs text-zinc-600">Verified Bi-national Releases</p>
            </div>
          </div>
        </div>
      </section>

      <Newsletter />
      <Footer />
    </main>
  );
}
