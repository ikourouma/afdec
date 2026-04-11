"use client";

import React, { useEffect, useState } from "react";
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
import { SideNav, type NavSection } from "@/components/ui/side-nav";
import { supabase } from "@/lib/supabase";
import { 
  Shield, Globe, TrendingUp, Zap, Leaf, Users, 
  ArrowRight, CheckCircle2, Award, Landmark, 
  FileText, Network, BarChart, Building2, Pickaxe
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const SECTIONS: NavSection[] = [
  { id: "vision", label: "2030 Vision" },
  { id: "pillars", label: "Bilateral Six" },
  { id: "methodology", label: "Global Methodology" },
  { id: "milestones", label: "Strategic Milestones" },
];

const PILLARS = [
  {
    icon: Globe,
    title: "Regional Market Access",
    description: "Aligning North Carolina enterprises with the African Continental Free Trade Area (AfCFTA) to enable seamless transatlantic commerce.",
    metrics: ["Duty-Free Access", "Trade Corridor Optimization"]
  },
  {
    icon: Zap,
    title: "Strategic Infrastructure",
    description: "Developing regional energy grids, digital backbones, and transport corridors that connect the NC hub to African economic zones.",
    metrics: ["Renewable Energy GW", "Digital Connectivity %"]
  },
  {
    icon: Building2,
    title: "Export & Trade Logistics",
    description: "Building sustainable diaspora supply chains by integrating African SMEs into NC industrial manufacturing ecosystems.",
    metrics: ["SME Grant Deployment", "Supply Chain Diversification"]
  },
  {
    icon: Leaf,
    title: "Agricultural Resilience",
    description: "Expanding the AgriLink platform to secure bilateral food systems and deploy precision agritech at the continental scale.",
    metrics: ["AgriLink Enrollment", "Precision Tech Adoption"]
  },
  {
    icon: Users,
    title: "Human Capital",
    description: "Facilitating talent mobility and technology transfer through professional volunteer corps and university partnerships.",
    metrics: ["Talent Corridor Yield", "Technology Licensing"]
  },
  {
    icon: Pickaxe,
    title: "Critical Minerals & Processing Corridors",
    description: "Developing sovereign bilateral supply chains for rare-earth elements and critical minerals, moving value-addition to source-proximate processing hubs.",
    metrics: ["Bilateral Minerals Agreement", "Refining Capacity Investment"]
  }
];

const METHODOLOGY = [
  { 
    step: "01", 
    label: "Strategic Directive", 
    description: "Identifying bilateral objectives aligned with both NC Department of Commerce and African Union development pillars." 
  },
  { 
    step: "02", 
    label: "Intelligence Mapping", 
    description: "Deep-layer data analysis via the Africa Intelligence Terminal to identify high-probability outcome corridors." 
  },
  { 
    step: "03", 
    label: "Bilateral Engagement", 
    description: "Direct diplomatic mobilization between the AfDEC Executive Board and relevant government/institutional stakeholders." 
  },
  { 
    step: "04", 
    label: "Operational Execution", 
    description: "Deployment of resources, infrastructure coordination, and partner matchmaking managed by the AfDEC Deal Team." 
  },
  { 
    step: "05", 
    label: "Monitoring & Impact", 
    description: "Continuous tracking of economic yield, social impact, and compliance through our sovereign reporting framework." 
  }
];

export default function StrategicFrameworkPage() {
  const [milestones, setMilestones] = useState<any[]>([]);

  useEffect(() => {
    async function fetchMilestones() {
      try {
        const { data, error } = await supabase
          .from("strategic_milestones")
          .select("*")
          .order("accomplishment_date", { ascending: false });
        
        if (!error && data) setMilestones(data);
      } catch (err) {
        console.error("Failed to fetch milestones:", err);
      }
    }
    fetchMilestones();
  }, []);

  useGSAP(() => {
    gsap.fromTo(".pillar-card", 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: "#section-pillars", start: "top 80%" }
      }
    );
    gsap.fromTo(".method-step",
      { x: -20, opacity: 0 },
      { x: 0, opacity: 1, stagger: 0.12, duration: 0.6, ease: "power2.out",
        scrollTrigger: { trigger: "#section-methodology", start: "top 85%" }
      }
    );
  }, {});

  return (
    <main className="min-h-screen bg-zinc-950 font-sans selection:bg-blue-500/30">
      <div className="sticky top-0 z-[100] w-full flex flex-col">
        <TopNav />
        <FlashBanner />
        <Header />
      </div>
      <Breadcrumb />
      <SideNav sections={SECTIONS} accentColor="blue" />

      {/* ── Cinematic Hero ── */}
      <section id="section-vision" className="relative bg-zinc-950 border-b border-zinc-800/40 overflow-hidden">
        <div className="absolute inset-0 opacity-30" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2670&auto=format&fit=crop')", backgroundSize: "cover", backgroundPosition: "center top" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-zinc-950/30" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-zinc-950 to-transparent" />

        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-28 md:py-40 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-950/40 border border-blue-900/30 mb-8 rounded-full backdrop-blur-md">
            <Shield className="w-3 h-3 text-blue-400" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-blue-400 uppercase">Institutional Mandate</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] max-w-4xl mb-6">
            AfDEC Strategic<br />Framework (2026-2030)
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 font-medium leading-relaxed max-w-2xl mb-12">
            The sovereign blueprint for transatlantic economic integration — driving prosperity between North Carolina and the African continent through structured, high-impact pillars.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/corridor/expansion" className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm uppercase tracking-widest rounded-sm transition-all shadow-lg group">
              Explore the Mandate <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── The Bilateral Five ── */}
      <section id="section-pillars" className="bg-[#080808] py-24 border-b border-zinc-800/30">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-px bg-blue-500" />
              <span className="text-[11px] font-bold tracking-[0.2em] text-blue-400 uppercase">Strategic Pillars</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white">The "Bilateral Six"</h2>
            <p className="text-zinc-500 mt-4 max-w-2xl text-[15px]">Six foundational vectors through which AfDEC operationalizes transatlantic growth.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {PILLARS.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="pillar-card group bg-zinc-900/20 border border-zinc-800/50 p-8 rounded-lg hover:border-blue-500/40 transition-all duration-500">
                  <div className="w-14 h-14 bg-blue-900/10 border border-blue-900/20 rounded-xl flex items-center justify-center mb-8 group-hover:bg-blue-500/10 transition-colors">
                    <Icon className="w-7 h-7 text-blue-400" />
                  </div>
                  <h3 className="text-white font-black text-xl mb-4 group-hover:text-blue-400 transition-colors">{p.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-8">{p.description}</p>
                  <div className="space-y-3 pt-6 border-t border-zinc-800/60">
                    {p.metrics.map(m => (
                      <div key={m} className="flex items-center space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500/60" />
                        <span className="text-[12px] font-bold text-zinc-500 uppercase tracking-widest">{m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── methodology Walkthrough ── */}
      <section id="section-methodology" className="bg-zinc-950 py-24 border-b border-zinc-800/30">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 lg:gap-24 items-start">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-px bg-zinc-500" />
                <span className="text-[11px] font-bold tracking-[0.2em] text-zinc-500 uppercase">Process Transparency</span>
              </div>
              <h2 className="text-3xl font-black text-white mb-6">Global Framework<br />Methodology</h2>
              <p className="text-zinc-400 text-[15px] leading-relaxed mb-8">
                Every AfDEC strategic accomplishment follows a rigorous, procurement-grade lifecycle. This structured approach ensures transparency for our partners and accountability for our team.
              </p>
              <div className="p-6 bg-zinc-900/30 border border-zinc-800/50 rounded-xl">
                <h4 className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-3">Institutional Training</h4>
                <p className="text-zinc-500 text-[13px] leading-relaxed">
                  This methodology is used to train all AfDEC Regional Coordinators and Deal Team members, ensuring a consistent standard of excellence globally.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {METHODOLOGY.map((m) => (
                <div key={m.step} className="method-step group grid grid-cols-[80px_1fr] gap-6 p-8 bg-zinc-900/20 border border-zinc-800/40 rounded-xl hover:border-zinc-700 transition-all duration-300">
                  <div className="text-3xl font-black text-zinc-800 group-hover:text-blue-500/40 transition-colors self-center">{m.step}</div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{m.label}</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed">{m.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Milestones & Outcomes ── */}
      <section id="section-milestones" className="bg-[#080808] py-24 border-b border-zinc-800/30">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="text-[11px] font-bold tracking-[0.2em] text-zinc-500 uppercase">Track Record</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-3">Strategic Milestones</h2>
            <p className="text-zinc-500 mt-4 max-w-xl mx-auto text-sm">Realized outcomes of the AfDEC Strategic Framework across global corridors.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {milestones.length > 0 ? milestones.map((m) => (
              <div key={m.id} className="bg-zinc-900/40 border border-zinc-800 hover:border-blue-500/20 rounded-xl overflow-hidden transition-all group">
                {m.image_url && <img src={m.image_url} alt={m.title} className="w-full h-48 object-cover opacity-60 group-hover:opacity-100 transition-opacity" />}
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold text-blue-400 bg-blue-900/20 border border-blue-900/30 px-2.5 py-1 rounded-full uppercase tracking-widest">
                      {m.category.replace(/_/g, " ")}
                    </span>
                    <span className="text-[10px] text-zinc-600 font-medium">{new Date(m.accomplishment_date).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-3 leading-tight">{m.title}</h3>
                  <p className="text-zinc-500 text-[13px] leading-relaxed mb-6">{m.description}</p>
                  <div className="flex items-center justify-between pt-6 border-t border-zinc-800/60">
                    <span className="text-[11px] text-zinc-600 font-bold uppercase tracking-widest">{m.location}</span>
                    <Link href="#" className="text-blue-500 text-[11px] font-black uppercase tracking-widest hover:text-blue-400 transition-colors">Documentation →</Link>
                  </div>
                </div>
              </div>
            )) : (
              // Empty State / Loading State
              <div className="col-span-full py-20 text-center border border-dashed border-zinc-800 rounded-xl">
                 <p className="text-zinc-600 font-medium">Tracking the next milestone of the 2026-2030 Mandate...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="relative bg-zinc-950 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-overlay pointer-events-none" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')" }} />
        <Newsletter />
        <Footer />
      </div>
    </main>
  );
}
