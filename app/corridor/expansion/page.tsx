"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TopNav } from "@/components/ui/top-nav";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { FlashBanner } from "@/components/ui/flash-banner";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Newsletter } from "@/components/ui/newsletter";
import { SideNav, type NavSection } from "@/components/ui/side-nav";
import { MapTeaser } from "@/components/sections/africa-map-teaser";
import { 
  ArrowRight, Globe, ShieldCheck, Zap, TrendingUp, 
  BarChart, Users, Link as LinkIcon, FileText, Landmark 
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const SECTIONS: NavSection[] = [
  { id: "overview", label: "Program Overview" },
  { id: "roadmap", label: "Operational Roadmap" },
  { id: "intelligence", label: "Market Intelligence" },
  { id: "apply", label: "Initiate Expansion" },
];

const ROADMAP_STEPS = [
  {
    step: "01",
    title: "Directive & Intake",
    description: "Submit your institutional profile for vetting by the AfDEC Institutional Deal Team. We assess sector alignment and operational readiness.",
    icon: ShieldCheck,
  },
  {
    step: "02",
    title: "Market Mapping",
    description: "Deep-layer analysis via the Africa Intelligence Terminal to identify the highest-yielding regional entry points for your specific service.",
    icon: Globe,
  },
  {
    step: "03",
    title: "Strategic Matchmaking",
    description: "Bilateral introductions to vetted local partners, regional coordinators, and government procurement officers within the target corridor.",
    icon: Users,
  },
  {
    step: "04",
    title: "Regulatory Clearing",
    description: "Comprehensive support for export documentation, bilateral legal frameworks, and compliance with AGOA/AfCFTA protocols.",
    icon: FileText,
  },
  {
    step: "05",
    title: "Capital Mobilization",
    description: "Direct connection to project finance resources, including DFC capital, EXIM insurance, and the AfDEC Diaspora Impact Fund.",
    icon: Landmark,
  }
];

export default function ExpansionPage() {
  const heroRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(heroRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" });
    gsap.fromTo(".roadmap-card",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power2.out",
        scrollTrigger: { trigger: "#section-roadmap", start: "top 80%" } }
    );
  }, {});

  return (
    <div className="min-h-screen bg-zinc-950 font-sans selection:bg-blue-500/30">
      <div className="sticky top-0 z-[100] w-full flex flex-col">
        <TopNav />
        <FlashBanner />
        <Header />
      </div>
      <Breadcrumb />
      <SideNav sections={SECTIONS} accentColor="blue" />

      {/* ── Cinematic Hero ── */}
      <section id="section-overview" className="relative bg-zinc-950 border-b border-zinc-800/50 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2670&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/90 to-zinc-950/20" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-zinc-950 to-transparent" />

        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-28 md:py-36 relative z-10" ref={heroRef}>
          <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-blue-800 bg-blue-900/30 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8">
            Institutional Growth
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] max-w-4xl mb-6">
            Enterprise Expansion Support
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 font-medium leading-relaxed max-w-2xl mb-10">
            AfDEC removes the operational barriers between North Carolina enterprises and the 1.4 billion person African market through a single, sovereign-grade expansion program.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={() => document.getElementById('section-apply')?.scrollIntoView({ behavior: 'smooth' })} className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm uppercase tracking-widest rounded-sm transition-all shadow-lg group">
              Start Your Expansion <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* ── Institutional Roadmap ── */}
      <section id="section-roadmap" className="bg-[#080808] py-24 border-b border-zinc-800/30">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="mb-20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-px bg-blue-500" />
              <span className="text-[11px] font-bold tracking-[0.2em] text-blue-400 uppercase">The Protocol</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white">Institutional Roadmap</h2>
            <p className="text-zinc-500 mt-4 max-w-2xl text-[15px]">
              Managed by the <strong>AfDEC Institutional Deal Team</strong>, our 5-phase execution model ensures your expansion is built on data, compliance, and capital security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8 relative">
            {/* Horizontal Line Connector (Hidden on mobile) */}
            <div className="hidden lg:block absolute top-[44px] left-10 right-10 h-px bg-zinc-800 z-0" />
            
            {ROADMAP_STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="roadmap-card relative group">
                  <div className="flex flex-col items-center lg:items-start">
                    <div className="w-12 h-12 rounded-full bg-zinc-950 border-2 border-zinc-800 flex items-center justify-center text-sm font-black text-zinc-500 mb-8 relative z-10 group-hover:border-blue-500/50 group-hover:text-blue-400 transition-all duration-500">
                      {s.step}
                    </div>
                    <div className="p-6 bg-zinc-900/30 border border-zinc-900 hover:border-zinc-800 rounded-xl transition-all h-full">
                      <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center mb-6">
                        <Icon className="w-5 h-5 text-blue-400" />
                      </div>
                      <h3 className="text-white font-bold text-lg mb-3">{s.title}</h3>
                      <p className="text-zinc-500 text-[13px] leading-relaxed">{s.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Intelligence Layer ── */}
      <section id="section-intelligence" className="py-12">
         <MapTeaser 
           heading="Expansion Intelligence Map"
           subtext="Every expansion mission is backed by the Africa Intelligence Terminal. Access sector-specific opportunity mapping for your target region."
           accentColor="blue"
         />
      </section>

      {/* ── Intake Form CTA ── */}
      <section id="section-apply" className="bg-zinc-950 py-24 pb-40 border-t border-zinc-800/30">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 text-center">
          <div className="max-w-2xl mx-auto">
            <Landmark className="w-12 h-12 text-blue-500 mx-auto mb-8 opacity-50" />
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">Direct Expansion Intake</h2>
            <p className="text-zinc-500 text-lg mb-12 leading-relaxed">
              Submit your institution's profile to the AfDEC Deal Team for enrollment in the 2026-2027 Expansion Mandate.
            </p>
            <div className="p-8 md:p-12 bg-zinc-900/40 border border-zinc-800 rounded-2xl text-left">
               <h4 className="text-white font-bold mb-6">Institutional Profile Submission</h4>
               <p className="text-zinc-500 text-sm mb-10">
                 Upon submission, an AfDEC Senior Advisor will contact your leadership team within 48 hours for a preliminary directive briefing.
               </p>
               <Link href="/contact" className="w-full inline-flex items-center justify-center px-8 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm uppercase tracking-widest rounded-sm transition-all shadow-xl group">
                 Open Expansion Inquiry <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
               </Link>
            </div>
          </div>
        </div>
      </section>

      <Newsletter />
      <Footer />
    </div>
  );
}
