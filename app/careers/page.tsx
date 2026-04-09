"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TopNav } from "@/components/ui/top-nav";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Newsletter } from "@/components/ui/newsletter";
import { FlashBanner } from "@/components/ui/flash-banner";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { 
  Users, 
  MapPin, 
  Briefcase, 
  Handshake, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  Globe2, 
  Building2,
  Lock
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const jobOpenings = [
  {
    id: 1,
    title: "Regional Director, Strategic EPC",
    location: "Accra, Ghana / Charlotte, NC",
    type: "Executive Secretariat",
    description: "Lead the bi-national coordination of infrastructure mandates and EPC projects across West African trade corridors and NC commercial hubs.",
    tag: "High Priority",
    accent: "border-blue-500/20 bg-blue-500/5",
    icon: Building2
  },
  {
    id: 2,
    title: "Global Supply Chain Strategist",
    location: "Raleigh, NC / Distributed",
    type: "Digital Corridor Operations",
    description: "Design the logic for the AfDEC Digital Corridor, optimizing the movement of capital and essential goods between African ports and US logistics hubs.",
    tag: "New Role",
    accent: "border-emerald-500/20 bg-emerald-500/5",
    icon: Globe2
  },
  {
    id: 3,
    title: "Sovereign Market Analyst",
    location: "Remote / African Union Corridors",
    type: "Trade Intelligence",
    description: "Analyze market telemetry and policy shifts across high-growth African economies to provide decisive intelligence to institutional partners.",
    tag: "Active Search",
    accent: "border-amber-500/20 bg-amber-500/5",
    icon: TrendingUp
  }
];

export default function CareersPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(".job-card", 
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

      {/* ── Hero: Human Capital & Global Mandates ── */}
      <section className="relative bg-[#080808] border-b border-zinc-800/50 overflow-hidden">
        {/* Layer 1: Professional Depth */}
        <div
          className="absolute inset-0 opacity-[0.25]"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1521737703345-bc54d61a9d41?q=80&w=2670&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        
        {/* Layer 2: Institutional Connections Pattern */}
        <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.6'%3E%3Cpath d='M0 60h120M60 0v120'/%3E%3Cpath d='M30 0l30 30L30 60 0 30zM90 0l30 30L90 60 60 30zM30 60l30 30L30 120 0 90zM90 60l30 30L90 120 60 90z'/%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: "120px 120px" }} />

        {/* Layer 3: Cinematic Reveal Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/90 to-zinc-950/20" />
        
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-24 md:py-32 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-zinc-800/80 border border-zinc-700/50 mb-6 rounded-full backdrop-blur-md">
            <Users className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-[11px] font-bold tracking-[0.2em] text-zinc-400 uppercase">Human Capital & Global Mandates</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] max-w-5xl">
            Mobilizing Global Talent for Sovereign Development
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 mt-8 max-w-2xl leading-relaxed font-medium">
            AfDEC connects world-class directors and strategic leaders from the African Diaspora with North Carolina&apos;s industrial and corporate ecosystem. Join us in building a binational bridge of prosperity.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      </section>

      {/* ── Working at AfDEC ── */}
      <section className="bg-zinc-950 py-24 md:py-32 border-b border-zinc-900">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
          <div>
            <span className="text-[11px] font-black tracking-[0.2em] text-zinc-600 uppercase underline decoration-blue-500 underline-offset-8 decoration-2">The AfDEC Culture</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mt-10 tracking-tight leading-tight">Institutional Stability + Rapid Innovation</h2>
            <p className="text-zinc-500 mt-8 text-lg font-medium leading-relaxed">
              Our team operates with the discipline of a sovereign agency and the speed of a global logistics hub. We attract individuals who want to build the bi-national infrastructure of the 21st century.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-zinc-900 flex items-center justify-center shrink-0 border border-zinc-800 rounded-sm">
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-2">High Trust Mandates</h4>
                  <p className="text-xs text-zinc-600 leading-relaxed">Every team member oversees a critical part of the binational corridor pipeline.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-zinc-900 flex items-center justify-center shrink-0 border border-zinc-800 rounded-sm">
                  <Handshake className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-2">Executive Access</h4>
                  <p className="text-xs text-zinc-600 leading-relaxed">Regular briefings and coordination with global board members and ministerial partners.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative group rounded-lg overflow-hidden border border-zinc-800 shadow-2xl h-[500px]">
             <img 
               src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop" 
               alt="Team meeting" 
               className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
             <div className="absolute bottom-8 left-8 p-6 bg-zinc-900/80 backdrop-blur-md border border-zinc-700/50 rounded-sm">
                <h3 className="text-white font-bold">Session Briefing, Charlotte HQ</h3>
             </div>
          </div>
        </div>
      </section>

      {/* ── Active Opportunities ── */}
      <section className="bg-[#080808] py-24 md:py-32">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16 md:mb-24">
            <span className="text-[11px] font-black tracking-[0.25em] text-zinc-600 uppercase">Executive & Technical Opportunities</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mt-8 tracking-tight">Active Recruitment Briefings</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobOpenings.map((job) => (
              <div key={job.id} className={`job-card group relative border p-10 rounded-sm transition-all duration-300 flex flex-col hover:border-zinc-500 overflow-hidden ${job.accent}`}>
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-6 h-6 text-blue-500 -rotate-45" />
                </div>
                <div className="mb-8 flex items-center justify-between">
                  <div className="px-3 py-1 bg-zinc-950 border border-zinc-800 rounded-full text-[10px] font-black text-blue-500 uppercase tracking-widest">{job.tag}</div>
                </div>
                
                <h3 className="text-2xl font-black text-white mb-2 leading-tight block group-hover:text-blue-500 transition-colors">
                  {job.title}
                </h3>
                <div className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest mb-6 flex items-center">
                   <MapPin className="w-3.5 h-3.5 mr-2 text-zinc-700 shrink-0" />
                   {job.location}
                </div>
                
                <p className="text-[14px] text-zinc-500 leading-relaxed mb-10 flex-grow">
                  {job.description}
                </p>
                
                <div className="pt-6 border-t border-zinc-800/50 flex flex-col gap-4">
                  <div className="flex items-center text-xs text-zinc-600">
                    <Briefcase className="w-3.5 h-3.5 mr-2 text-zinc-700" />
                    {job.type}
                  </div>
                  <button className="w-full py-4 text-white text-[12px] font-black tracking-widest uppercase rounded-sm bg-zinc-900 border border-zinc-800 group-hover:bg-blue-600 group-hover:border-blue-500 transition-all flex items-center justify-center space-x-2">
                    <span>Submit Executive Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-20">
            <div className="text-center mb-16">
              <span className="text-[11px] font-bold tracking-[0.3em] text-blue-500 uppercase">Executive Recruitment Infrastructure</span>
              <h2 className="text-3xl md:text-5xl font-black text-white mt-4 tracking-tight leading-tight">The Bi-National Job Fairs 2026</h2>
              <p className="text-zinc-500 mt-6 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
                AfDEC bridges the talent gap by promoting African expertise directly to the North Carolina corporate sector. All registries are managed via the Secretariat ATS.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Fair 1: RDU Industrial Hub Expo */}
              <div className="group bg-zinc-900/40 border border-zinc-800 p-10 rounded-sm hover:border-blue-500/50 transition-all duration-300">
                <div className="w-12 h-12 bg-blue-600/10 rounded-sm flex items-center justify-center mb-10 border border-blue-600/20">
                  <Building2 className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-black text-white mb-4 tracking-tight group-hover:text-blue-400 transition-colors">RDU Industrial Hub Expo</h3>
                <p className="text-sm text-zinc-500 leading-relaxed mb-8">
                  Focus: Manufacturing, EPC, and Infrastructure Logistics. Connecting NC commercial titans with bi-national technical leadership.
                </p>
                <div className="pt-6 border-t border-zinc-800 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Partner: NC Commerce</span>
                  <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">MARCH 2026</div>
                </div>
              </div>

              {/* Fair 2: Accra Tech & EPC Summit */}
              <div className="group bg-zinc-900/40 border border-zinc-800 p-10 rounded-sm hover:border-emerald-500/50 transition-all duration-300">
                <div className="w-12 h-12 bg-emerald-600/10 rounded-sm flex items-center justify-center mb-10 border border-emerald-600/20">
                  <Globe2 className="w-6 h-6 text-emerald-500" />
                </div>
                <h3 className="text-xl font-black text-white mb-4 tracking-tight group-hover:text-emerald-400 transition-colors">Accra Tech & EPC Summit</h3>
                <p className="text-sm text-zinc-500 leading-relaxed mb-8">
                  Focus: Fintech, Digital Corridors, and Sovereign Markets. Integrated recruitment sessions for regional directors.
                </p>
                <div className="pt-6 border-t border-zinc-800 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Partner: West Africa Board</span>
                  <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">JUNE 2026</div>
                </div>
              </div>

              {/* Fair 3: Charlotte Sovereign Finance Fair */}
              <div className="group bg-zinc-900/40 border border-zinc-800 p-10 rounded-sm hover:border-amber-500/50 transition-all duration-300">
                <div className="w-12 h-12 bg-amber-600/10 rounded-sm flex items-center justify-center mb-10 border border-amber-600/20">
                  <Users className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="text-xl font-black text-white mb-4 tracking-tight group-hover:text-amber-400 transition-colors">Charlotte Finance Fair</h3>
                <p className="text-sm text-zinc-500 leading-relaxed mb-8">
                  Focus: Capital Markets, Private Equity, and Sovereign Debt. Direct channel for diaspora-led financial leadership.
                </p>
                <div className="pt-6 border-t border-zinc-800 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">AfDEC Direct</span>
                  <div className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">SEPT 2026</div>
                </div>
              </div>
            </div>

            <div className="mt-16 text-center">
               <button className="px-10 py-5 bg-white text-zinc-950 text-[13px] font-black tracking-widest uppercase hover:bg-zinc-200 transition-all rounded-sm shadow-xl">
                  Register for Fair Sessions
               </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Executive Placements Portal — NC Bridge ── */}
      <section className="bg-zinc-950 py-24 mb-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h1v100H0zM0 0h100v1H0z' fill='white'/%3E%3C/svg%3E")`, backgroundSize: "100px 100px" }} />
        
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="bg-zinc-900/40 border-2 border-zinc-800 border-dashed rounded-lg p-10 md:p-20 text-center relative z-10">
            <Lock className="w-10 h-10 text-zinc-600 mx-auto mb-8" />
            <h2 className="text-2xl md:text-4xl font-black text-white mb-6 tracking-tight">Executive Placements Portal</h2>
            <p className="text-zinc-500 max-w-2xl mx-auto mb-10 text-lg">Are you an NC corporation searching for the Continent&apos;s most elite technical and strategic leadership? Access our verified talent registry managed by the Secretariat Committee.</p>
            <button className="text-blue-500 font-bold border-b border-blue-500 pb-1 hover:text-blue-400 hover:border-blue-400 transition-all">Engage the Talent Committee →</button>
          </div>
        </div>
      </section>

      <div className="relative">
        <Newsletter />
        <Footer />
      </div>
    </main>
  );
}
