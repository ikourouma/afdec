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
import { SectionNav, type NavSection } from "@/components/ui/section-nav";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { 
  Building2, Globe, Users, Briefcase, Zap, 
  ArrowRight, ShieldCheck, Landmark, Play, CheckCircle
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const PAGE_SECTIONS: NavSection[] = [
  { id: "overview", label: "Strategic Imperative" },
  { id: "blueprint", label: "The Blueprint" },
  { id: "financials", label: "Sustainability" },
  { id: "capital", label: "Capital Structure" },
  { id: "pillars", label: "Strategic Pillars" },
  { id: "invest", label: "Invest" },
];

export default function AfricaCenterPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    // Cinematic Reveal
    gsap.fromTo(".reveal-hero", 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out", delay: 0.2 }
    );
    
    // Scroll Triggers
    const sections = gsap.utils.toArray('.reveal-section');
    sections.forEach((section: any) => {
      gsap.fromTo(section,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
          }
        }
      );
    });
  }, { scope: containerRef });

  return (
    <main ref={containerRef} className="min-h-screen bg-zinc-950 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      <div className="sticky top-0 z-[100] w-full flex flex-col" data-nav-id="main-nav">
        <TopNav />
        <Header />
      </div>
      <Breadcrumb />
      <SectionNav sections={PAGE_SECTIONS} accentColor="amber" />

      {/* ── SECTION 1: CINEMATIC HERO ── */}
      <section id="overview" className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden border-b border-zinc-900">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-zinc-950/70 mix-blend-multiply z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=2670&auto=format&fit=crop" 
            alt="Modern Architecture" 
            className="w-full h-full object-cover scale-105"
          />
        </div>

        <div className="relative z-20 max-w-[1600px] mx-auto px-6 lg:px-12 w-full pt-32 pb-20">
          <div className="max-w-4xl">
            <div className="reveal-hero inline-flex items-center gap-2 px-3 py-1 bg-zinc-900/60 backdrop-blur-md border border-zinc-800/50 mb-6 rounded-full">
              <Building2 className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[10px] font-black tracking-[0.2em] text-zinc-300 uppercase">AfDEC Flagship Infrastructure Initiative</span>
            </div>
            
            <h1 className="reveal-hero text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[0.9] mb-8">
              The NC Africa<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Center.</span>
            </h1>
            
            <p className="reveal-hero text-xl md:text-2xl text-zinc-300 font-medium leading-relaxed max-w-3xl mb-10">
              North Carolina's First Sovereign Gateway for Transatlantic Commerce, Innovation & Community Development.
            </p>

            <div className="reveal-hero flex flex-wrap items-center gap-4 mb-12">
              <div className="px-4 py-2 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-sm flex items-center gap-3">
                <Landmark className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">$15M Capital Initiative · Wake County, NC</span>
              </div>
              <div className="px-4 py-2 bg-amber-950/30 backdrop-blur-md border border-amber-900/50 rounded-sm flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Capital Campaign Active — 2026</span>
              </div>
            </div>

            <div className="reveal-hero flex flex-col sm:flex-row gap-4">
              <Link href="/diaspora-impact-fund" className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-sm font-bold tracking-widest uppercase px-8 py-4 rounded-sm transition-all shadow-[0_0_30px_-5px_rgba(245,158,11,0.4)]">
                <span>Invest in the Vision</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact?topic=naming-rights" className="inline-flex items-center justify-center gap-2 bg-zinc-900/80 hover:bg-zinc-800 backdrop-blur-md border border-zinc-700 text-white text-sm font-bold tracking-widest uppercase px-8 py-4 rounded-sm transition-all">
                <span>Bid for Naming Rights</span>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Stat Bar */}
        <div className="relative z-20 border-t border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-6">
            <div className="flex flex-wrap items-center justify-between gap-6 md:gap-12">
              {[
                { label: "Target Cap Raise", value: "$15M" },
                { label: "Facility Size", value: "35,000 Sq Ft" },
                { label: "Structural Levels", value: "2 Strategic Floors" },
                { label: "Target NOI Break-Even", value: "Month 14" },
              ].map((stat, i) => (
                <div key={i} className="reveal-hero flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-1">{stat.label}</span>
                  <span className="text-xl md:text-2xl font-black text-white tracking-tight">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: STRATEGIC IMPERATIVE ── */}
      <section className="py-24 bg-zinc-950 border-b border-zinc-900 relative overflow-hidden">
        <div className="absolute -right-96 top-0 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 reveal-section">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-[1.1] mb-8">
              "The Western Hemisphere Anchor for the African Union's Sixth Region — The Diaspora."
            </h2>
            <div className="w-12 h-1 bg-amber-500 mx-auto" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5 text-zinc-500" />
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">The Gap</span>
              </div>
              <h3 className="text-2xl font-bold text-white leading-snug">North Carolina lacks a centralized institutional gateway for African economic development.</h3>
              <p className="text-zinc-400 leading-relaxed text-[15px]">
                Despite housing one of the nation's fastest-growing African diaspora populations and maintaining a powerhouse economy, NC enterprises operate without a dedicated, sovereign-grade facility to orchestrate transatlantic trade, host bilateral summits, or incubate cross-border startups. The diaspora's institutional capital remains fragmented.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 mb-2">
                <Globe className="w-5 h-5 text-amber-500" />
                <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">The Opportunity</span>
              </div>
              <h3 className="text-2xl font-bold text-white leading-snug">A $15M physical infrastructure capturing a share of Africa's $180B digital economy.</h3>
              <p className="text-zinc-400 leading-relaxed text-[15px]">
                The Africa Center bridges this gap. By centralizing AfCFTA navigation, enterprise incubation, and sovereign relations under one roof in the Research Triangle corridor, we create a gravity well for transatlantic capital—positioning NC as the premier US entry point for African enterprise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: THE BLUEPRINT ── */}
      <section id="blueprint" className="py-24 bg-[#080808] border-b border-zinc-900">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="mb-16 reveal-section">
            <span className="text-[11px] font-bold tracking-[0.2em] text-blue-500 uppercase">Facility Architecture</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-4 tracking-tight">The Blueprint</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 reveal-section">
            {/* Floor 1 */}
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-10 relative overflow-hidden group hover:border-zinc-700 transition-colors">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] group-hover:bg-blue-500/10 transition-colors" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-blue-950/50 border border-blue-900/50 rounded-lg flex items-center justify-center mb-6">
                  <Building2 className="w-6 h-6 text-blue-400" />
                </div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-zinc-800/80 border border-zinc-700 rounded-sm mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                  <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Floor 1 · 17,500 Sq Ft</span>
                </div>
                <h3 className="text-3xl font-black text-white mb-3 tracking-tight">The Public Face</h3>
                <p className="text-zinc-400 leading-relaxed mb-8">Designed for scale, diplomacy, and cultural preservation. The ground floor serves as the premier hosting facility for bilateral summits and community gathering.</p>
                
                <ul className="space-y-4">
                  {[
                    "6th Region Amphitheater (Summit & Event Hall)",
                    "\"Homecoming\" Diaspora Heritage Archive",
                    "Public Exhibition & Art Gallery",
                    "Diplomatic Reception Lounge"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-500 shrink-0" />
                      <span className="text-zinc-300 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Floor 2 */}
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-10 relative overflow-hidden group hover:border-zinc-700 transition-colors">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] group-hover:bg-emerald-500/10 transition-colors" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-emerald-950/50 border border-emerald-900/50 rounded-lg flex items-center justify-center mb-6">
                  <Briefcase className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-zinc-800/80 border border-zinc-700 rounded-sm mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                  <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Floor 2 · 17,500 Sq Ft</span>
                </div>
                <h3 className="text-3xl font-black text-white mb-3 tracking-tight">The Business Engine</h3>
                <p className="text-zinc-400 leading-relaxed mb-8">A highly secured, enterprise-grade operations center driving daily economic impact, startup incubation, and policy formulation.</p>
                
                <ul className="space-y-4">
                  {[
                    "Transatlantic B2B Trade Desk (AfCFTA Navigation)",
                    "Startup \"Soft-Landing\" Incubator (40 desks)",
                    "Pan-African Policy & Research Lab",
                    "AfDEC Sovereign Command Center"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                      <span className="text-zinc-300 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: FINANCIAL SUSTAINABILITY ── */}
      <section id="financials" className="py-24 bg-zinc-950 border-b border-zinc-900">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="mb-16 reveal-section flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <span className="text-[11px] font-bold tracking-[0.2em] text-amber-500 uppercase">Operational Economics</span>
              <h2 className="text-4xl md:text-5xl font-black text-white mt-4 tracking-tight">Financial Sustainability</h2>
              <p className="text-zinc-400 mt-6 text-lg">The Africa Center is modeled as a self-sustaining asset. By layering premium enterprise services, facility leasing, and corporate sponsorships, we achieve net-positive operating income by Month 14.</p>
            </div>
            <div className="px-5 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-sm inline-flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-bold text-emerald-400">Operational Self-Sustainability by Month 14</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 reveal-section">
            {[
              { year: "Year 1", gross: "$585K", noi: "$165K", phase: "Launch & Lease-Up Phase" },
              { year: "Year 2", gross: "$910K", noi: "$445K", phase: "Stabilized Operations" },
              { year: "Year 3", gross: "$1.175M", noi: "$665K", phase: "Peak Capacity" },
            ].map((proj) => (
              <div key={proj.year} className="bg-zinc-900/40 border border-zinc-800 rounded-sm p-8 text-center">
                <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-6">{proj.year} Projection</div>
                <div className="text-4xl font-black text-white mb-2">{proj.gross}</div>
                <div className="text-sm text-zinc-400 font-medium mb-6">Gross Revenue</div>
                <div className="w-12 h-px bg-zinc-800 mx-auto mb-6" />
                <div className="text-2xl font-bold text-emerald-400 mb-1">{proj.noi}</div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider font-bold mb-4">Net Operating Income</div>
                <div className="inline-block px-3 py-1 bg-zinc-800 rounded text-[10px] font-medium text-zinc-300">{proj.phase}</div>
              </div>
            ))}
          </div>

          <div className="bg-zinc-900/20 border border-zinc-800 rounded-lg overflow-hidden reveal-section">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-900 text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-800">
                    <th className="px-6 py-5">Revenue Stream</th>
                    <th className="px-6 py-5 text-right">Year 1</th>
                    <th className="px-6 py-5 text-right">Year 2</th>
                    <th className="px-6 py-5 text-right">Year 3</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50 text-sm font-medium">
                  <tr className="hover:bg-zinc-800/20 transition-colors">
                    <td className="px-6 py-4 text-zinc-300">Private Office Leases</td>
                    <td className="px-6 py-4 text-right text-zinc-400">$96K</td>
                    <td className="px-6 py-4 text-right text-zinc-400">$144K</td>
                    <td className="px-6 py-4 text-right text-zinc-400">$160K</td>
                  </tr>
                  <tr className="hover:bg-zinc-800/20 transition-colors">
                    <td className="px-6 py-4 text-zinc-300">Startup Desk Memberships</td>
                    <td className="px-6 py-4 text-right text-zinc-400">$57.6K</td>
                    <td className="px-6 py-4 text-right text-zinc-400">$108K</td>
                    <td className="px-6 py-4 text-right text-zinc-400">$129.6K</td>
                  </tr>
                  <tr className="hover:bg-zinc-800/20 transition-colors">
                    <td className="px-6 py-4 text-zinc-300">Corporate Partner Sponsorships</td>
                    <td className="px-6 py-4 text-right text-zinc-400">$150K</td>
                    <td className="px-6 py-4 text-right text-zinc-400">$250K</td>
                    <td className="px-6 py-4 text-right text-zinc-400">$350K</td>
                  </tr>
                  <tr className="hover:bg-zinc-800/20 transition-colors">
                    <td className="px-6 py-4 text-zinc-300">Trade Desk Consulting</td>
                    <td className="px-6 py-4 text-right text-zinc-400">$120K</td>
                    <td className="px-6 py-4 text-right text-zinc-400">$210K</td>
                    <td className="px-6 py-4 text-right text-zinc-400">$290K</td>
                  </tr>
                  <tr className="hover:bg-zinc-800/20 transition-colors">
                    <td className="px-6 py-4 text-zinc-300">Event Hall Allocations</td>
                    <td className="px-6 py-4 text-right text-zinc-400">$161.4K</td>
                    <td className="px-6 py-4 text-right text-zinc-400">$198K</td>
                    <td className="px-6 py-4 text-right text-zinc-400">$245.4K</td>
                  </tr>
                  <tr className="bg-zinc-900/50 border-t-2 border-zinc-800">
                    <td className="px-6 py-5 text-white font-bold">TOTAL GROSS REVENUE</td>
                    <td className="px-6 py-5 text-right text-white font-bold">$585K</td>
                    <td className="px-6 py-5 text-right text-white font-bold">$910K</td>
                    <td className="px-6 py-5 text-right text-white font-bold">$1.175M</td>
                  </tr>
                  <tr className="bg-zinc-950">
                    <td className="px-6 py-4 text-red-400 font-medium">Estimated OPEX</td>
                    <td className="px-6 py-4 text-right text-red-400">($420K)</td>
                    <td className="px-6 py-4 text-right text-red-400">($465K)</td>
                    <td className="px-6 py-4 text-right text-red-400">($510K)</td>
                  </tr>
                  <tr className="bg-emerald-950/20 border-t border-emerald-900/30">
                    <td className="px-6 py-5 text-emerald-400 font-black">NET OPERATING INCOME</td>
                    <td className="px-6 py-5 text-right text-emerald-400 font-black">$165K</td>
                    <td className="px-6 py-5 text-right text-emerald-400 font-black">$445K</td>
                    <td className="px-6 py-5 text-right text-emerald-400 font-black">$665K</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: CAPITAL STRUCTURE ── */}
      <section id="capital" className="py-24 bg-[#080808] border-b border-zinc-900">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 text-center reveal-section">
          <span className="text-[11px] font-bold tracking-[0.2em] text-zinc-500 uppercase">Funding Model</span>
          <h2 className="text-3xl md:text-5xl font-black text-white mt-4 mb-16 tracking-tight">$15M Capital Structure</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { pct: "32%", amount: "$4.8M", label: "Public Appropriations", sub: "NC General Assembly + Wake County Grants", color: "border-t-blue-500" },
              { pct: "28%", amount: "$4.2M", label: "Corporate Pre-Leases", sub: "RTP Anchor Tenant Commitments", color: "border-t-emerald-500" },
              { pct: "20%", amount: "$3.0M", label: "Naming Endowments", sub: "Philanthropic & Institutional Naming Rights", color: "border-t-amber-500" },
              { pct: "20%", amount: "$3.0M", label: "Land & Contingency", sub: "Municipal Land Appropriation & Reserves", color: "border-t-purple-500" },
            ].map((cap, i) => (
              <div key={i} className={`bg-zinc-900/40 border border-zinc-800 border-t-2 ${cap.color} rounded-sm p-8 text-left`}>
                <div className="text-3xl font-black text-white mb-1">{cap.pct}</div>
                <div className="text-xl font-bold text-zinc-400 mb-4">{cap.amount}</div>
                <h4 className="text-sm font-bold text-white mb-2">{cap.label}</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">{cap.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 6: STRATEGIC PILLARS ── */}
      <section id="pillars" className="py-24 bg-zinc-950 border-b border-zinc-900">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="mb-16 reveal-section">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Four Strategic Pillars</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 reveal-section">
            {[
              { icon: Globe, title: "Commercial Trade", desc: "Housing the Transatlantic Trade Desk, providing direct AfCFTA navigation, customs advisory, and trade finance matching for bilateral commerce." },
              { icon: Zap, title: "Innovation Hub", desc: "A Startup Soft-Landing Suite offering 40 dedicated desks for African tech companies entering the US market, and NC companies expanding to Africa." },
              { icon: Users, title: "Policy & Research", desc: "The Pan-African Policy Lab, operating in partnership with NC HBCUs and research institutions to draft institutional-grade bilateral policy." },
              { icon: Building2, title: "Conventions & Events", desc: "The 6th Region Amphitheater serving as the primary hosting ground for visiting African heads of state, trade delegations, and cultural summits." }
            ].map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <div key={i} className="bg-zinc-900/20 border border-zinc-800 p-8 rounded-sm hover:bg-zinc-900/40 transition-colors">
                  <div className="w-10 h-10 rounded bg-zinc-800 flex items-center justify-center mb-6">
                    <Icon className="w-5 h-5 text-zinc-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{pillar.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 7: COMPETITIVE DIFFERENTIATION ── */}
      <section className="py-24 bg-[#080808] border-b border-zinc-900">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 reveal-section">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6 tracking-tight">Institutional Differentiation</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">Why The Africa Center represents a paradigm shift in diaspora infrastructure compared to legacy models.</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-zinc-900">
                  <th className="p-6 text-sm font-bold text-zinc-400 border border-zinc-800">Focus Area</th>
                  <th className="p-6 text-sm font-bold text-zinc-400 border border-zinc-800">Academic Centers</th>
                  <th className="p-6 text-sm font-bold text-zinc-400 border border-zinc-800">Black Chambers</th>
                  <th className="p-6 text-sm font-bold text-zinc-400 border border-zinc-800">Cultural Havens</th>
                  <th className="p-6 text-sm font-black text-amber-500 bg-amber-950/20 border border-amber-900/50 shadow-[inset_0_2px_0_rgba(245,158,11,0.5)]">The Africa Center (AfDEC)</th>
                </tr>
              </thead>
              <tbody className="bg-zinc-950">
                <tr>
                  <td className="p-6 border border-zinc-800 font-bold text-white">Target Audience</td>
                  <td className="p-6 border border-zinc-800 text-zinc-400 text-sm">Students & Scholars</td>
                  <td className="p-6 border border-zinc-800 text-zinc-400 text-sm">Local Micro-businesses</td>
                  <td className="p-6 border border-zinc-800 text-zinc-400 text-sm">Community Members</td>
                  <td className="p-6 border border-amber-900/30 text-amber-100 font-medium text-sm bg-amber-950/10">Sovereign Funds, Enterprise SMEs, Investors</td>
                </tr>
                <tr>
                  <td className="p-6 border border-zinc-800 font-bold text-white">Primary Output</td>
                  <td className="p-6 border border-zinc-800 text-zinc-400 text-sm">Research Papers</td>
                  <td className="p-6 border border-zinc-800 text-zinc-400 text-sm">Local Networking</td>
                  <td className="p-6 border border-zinc-800 text-zinc-400 text-sm">Festivals & Arts</td>
                  <td className="p-6 border border-amber-900/30 text-amber-100 font-medium text-sm bg-amber-950/10">Trade Corridors, Policy Briefs, FDI Pipelines</td>
                </tr>
                <tr>
                  <td className="p-6 border border-zinc-800 font-bold text-white">The Gap</td>
                  <td className="p-6 border border-zinc-800 text-zinc-500 text-sm italic">Lacks commercial execution</td>
                  <td className="p-6 border border-zinc-800 text-zinc-500 text-sm italic">Lacks international scope</td>
                  <td className="p-6 border border-zinc-800 text-zinc-500 text-sm italic">Lacks institutional capital</td>
                  <td className="p-6 border border-amber-900/30 text-amber-500 font-bold text-sm bg-amber-950/10">Comprehensive Enterprise Solution</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── SECTION 8: SITE SELECTION & ROADMAP ── */}
      <section className="py-24 bg-zinc-950 border-b border-zinc-900">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 reveal-section">
            
            {/* Site Selection */}
            <div>
              <h3 className="text-2xl font-black text-white mb-6">Site Selection: Wake County / RDU</h3>
              <p className="text-zinc-400 mb-8 leading-relaxed">The Research Triangle corridor offers the optimal convergence of logistics, academic talent, and zoning efficiency for a transatlantic gateway.</p>
              <ul className="space-y-4">
                {[
                  "Under 10 min from RDU International Airport gates",
                  "Adjacent to the Research Triangle Park (RTP) innovation spine",
                  "Suburban commercial zoning allows for rapid tech fit-out",
                  "Proximity to NC State, Duke, and UNC Chapel Hill"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-zinc-600 shrink-0 mt-0.5" />
                    <span className="text-zinc-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Roadmap */}
            <div>
               <h3 className="text-2xl font-black text-white mb-6">Implementation Roadmap</h3>
               <div className="space-y-6">
                  {[
                     { phase: "Phase 1", time: "Months 1-6", title: "Mobilization", desc: "Site control finalization, architectural concept approval, and anchor tenant LOIs." },
                     { phase: "Phase 2", time: "Months 7-18", title: "Capital Campaign", desc: "Securing 30% anchor corporate commitments, philanthropic endowments, and municipal zoning." },
                     { phase: "Phase 3", time: "Months 19-36", title: "Activation", desc: "Physical construction, interior tech fit-out, and finalization of university research agreements." }
                  ].map((step, i) => (
                     <div key={i} className="flex gap-4">
                        <div className="flex flex-col items-center">
                           <div className="w-3 h-3 rounded-full bg-amber-500 mb-2 mt-1.5" />
                           {i !== 2 && <div className="w-px h-full bg-zinc-800" />}
                        </div>
                        <div className="pb-6">
                           <div className="flex items-baseline gap-3 mb-1">
                              <h4 className="font-bold text-white text-lg">{step.phase}: {step.title}</h4>
                              <span className="text-xs font-bold text-zinc-500 uppercase">{step.time}</span>
                           </div>
                           <p className="text-sm text-zinc-400 leading-relaxed">{step.desc}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* ── SECTION 10: DUAL CTA ── */}
      <section id="invest" className="py-24 bg-[#080808]">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 reveal-section">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Invest */}
            <div className="bg-gradient-to-br from-amber-950/40 to-zinc-900/50 border border-amber-900/30 rounded-xl p-12 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] group-hover:bg-amber-500/20 transition-colors" />
              <div className="relative z-10">
                <h3 className="text-3xl font-black text-white mb-4 tracking-tight">Invest in the Vision</h3>
                <p className="text-zinc-400 leading-relaxed mb-8 max-w-sm">Join the capital campaign to establish North Carolina's transatlantic gateway. Open to institutional investors, sovereign funds, and accredited diaspora members.</p>
                <Link href="/diaspora-impact-fund" className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-sm font-bold tracking-widest uppercase px-8 py-4 rounded-sm transition-all shadow-md">
                  <span>View Impact Fund</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Naming Rights */}
            <div className="bg-gradient-to-br from-emerald-950/40 to-zinc-900/50 border border-emerald-900/30 rounded-xl p-12 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] group-hover:bg-emerald-500/20 transition-colors" />
              <div className="relative z-10">
                <h3 className="text-3xl font-black text-white mb-4 tracking-tight">Bid for Naming Rights</h3>
                <p className="text-zinc-400 leading-relaxed mb-8 max-w-sm">Secure a legacy endowment. Naming rights are available for the Summit Hall, Heritage Archive, Policy Lab, and Trade Desk.</p>
                <Link href="/contact?topic=naming-rights" className="inline-flex items-center justify-center gap-2 border border-emerald-500/50 hover:bg-emerald-500/10 text-emerald-400 text-sm font-bold tracking-widest uppercase px-8 py-4 rounded-sm transition-all">
                  <span>Submit Inquiry</span>
                </Link>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      <Newsletter />
      <Footer />
    </main>
  );
}
