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
import { PageHero } from "@/components/ui/page-hero";
import { FlashBanner } from "@/components/ui/flash-banner";
import { ArrowRight, Plane, Ship, Train, Wifi, Building2, DollarSign, Users, Sun, TreePine, Heart, Briefcase, Factory, Globe } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ─── NC Statistics (EDPNC / public source data) ───
const stats = [
  { value: "#1", label: "Top State for Business", source: "CNBC, 3x in 4 years" },
  { value: "2.5%", label: "Corporate Tax Rate", source: "Lowest in the U.S." },
  { value: "10.8M", label: "Population", source: "U.S. Census Bureau" },
  { value: "$730B", label: "Gross State Product", source: "Bureau of Economic Analysis" },
  { value: "72", label: "International Flights Daily", source: "CLT + RDU Airports" },
  { value: "5%", label: "Below National Avg. Cost of Living", source: "Bureau of Labor Statistics" },
];

// ─── Infrastructure ───
const infrastructure = [
  { icon: Plane, title: "International Airports", count: "2 Major", description: "Charlotte Douglas (CLT) — 6th busiest in the U.S. Raleigh-Durham (RDU) — direct routes to London, Paris, and major U.S. hubs." },
  { icon: Ship, title: "Deep-Water Seaports", count: "2 Major", description: "Port of Wilmington and Morehead City — strategic Atlantic corridor access for containerized and bulk cargo." },
  { icon: Train, title: "Rail & Interstate Network", count: "5 Interstates", description: "I-40, I-85, I-95 corridor connectivity. Norfolk Southern and CSX freight rail serving major industrial parks." },
  { icon: Wifi, title: "Broadband & Digital", count: "95%+ Coverage", description: "Statewide broadband initiative. Research Triangle Park — largest research park in the U.S. at 7,000 acres." },
];

// ─── Workforce & Education ───
const workforce = [
  { value: "#1", label: "Workforce Climate", detail: "Ranked #1 in workforce climate among all U.S. states by Area Development Magazine" },
  { value: "58", label: "Community Colleges", detail: "North Carolina Community College System — the nation's 3rd largest — provides customized workforce training" },
  { value: "16", label: "University System", detail: "UNC System with world-class institutions: Duke, NC State, UNC-Chapel Hill, Wake Forest" },
  { value: "3", label: "Tier-1 Research Universities", detail: "Producing 12,000+ STEM graduates annually feeding directly into the state's innovation pipeline" },
];

// ─── Key Industries ───
const industries = [
  { icon: Factory, title: "Advanced Manufacturing", description: "Aerospace, automotive, and EV manufacturing hub. $4.7B JetZero facility in Greensboro." },
  { icon: Heart, title: "Life Sciences & Biotech", description: "RTP anchors 300+ life science companies. $3.6B annual R&D investment." },
  { icon: DollarSign, title: "Financial Services & Fintech", description: "Charlotte — 2nd largest U.S. banking center. Home to Bank of America and Truist." },
  { icon: Briefcase, title: "Technology & AI", description: "Apple, Google, Meta, and Amazon have major NC operations. $10B AWS AI campus incoming." },
  { icon: Sun, title: "Clean Energy", description: "Top 5 in U.S. solar capacity. $12B+ invested in clean energy infrastructure." },
  { icon: Globe, title: "Tourism & Hospitality", description: "$34B annual visitor spending. Blue Ridge Parkway, Outer Banks, and 41 state parks." },
];

// ─── Quality of Life ───
const qualityOfLife = [
  { stat: "300+", label: "Days of Sunshine Annually", icon: Sun },
  { stat: "41", label: "State Parks & Recreation Areas", icon: TreePine },
  { stat: "3", label: "Distinct Regions: Mountains, Piedmont, Coast", icon: Globe },
  { stat: "Top 10", label: "Best Places to Live in the U.S.", icon: Heart },
];

export default function WhyNCPage() {
  const statsRef = useRef<HTMLDivElement>(null);
  const infraRef = useRef<HTMLDivElement>(null);
  const workforceRef = useRef<HTMLDivElement>(null);
  const industriesRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Counter animation for stat cards
    gsap.fromTo(".stat-card",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: statsRef.current, start: "top 85%" }
      }
    );
    // Infrastructure cards
    gsap.fromTo(".infra-card",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: infraRef.current, start: "top 85%" }
      }
    );
    // Workforce items
    gsap.fromTo(".workforce-item",
      { x: -30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: workforceRef.current, start: "top 85%" }
      }
    );
    // Industry cards
    gsap.fromTo(".industry-card",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power3.out",
        scrollTrigger: { trigger: industriesRef.current, start: "top 85%" }
      }
    );
  }, { scope: undefined });

  return (
    <main className="min-h-screen bg-zinc-950 font-sans selection:bg-blue-500/30 selection:text-blue-200">
      <div className="sticky top-0 z-[100] w-full flex flex-col">
        <TopNav />
        <FlashBanner />
        <Header />
      </div>

      {/* ── Hero ── */}
      <PageHero
        tag="Strategic Footprint"
        headline="Why North Carolina"
        subheadline="The #1 state for business in America. The lowest corporate tax rate. A workforce pipeline that rivals any nation. This is where AfDEC chose to build — and why your enterprise should too."
      />

      {/* ── By the Numbers ── */}
      <section ref={statsRef} className="bg-zinc-950 py-24 border-b border-zinc-800/30">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <span className="text-[11px] font-bold tracking-[0.2em] text-zinc-500 uppercase">NC at a Glance</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-3">The Numbers That Matter</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="stat-card bg-zinc-900/40 border border-zinc-800/50 p-6 rounded-sm text-center hover:border-blue-500/30 transition-all duration-300">
                <div className="text-3xl md:text-4xl font-black text-blue-400 mb-2">{s.value}</div>
                <div className="text-[13px] text-white font-semibold mb-1">{s.label}</div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider">{s.source}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Infrastructure ── */}
      <section ref={infraRef} className="bg-[#080808] py-24 border-b border-zinc-800/30">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div className="w-8 h-px bg-blue-500"></div>
              <span className="text-[11px] font-bold tracking-[0.2em] text-blue-400 uppercase">Connectivity</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white">Infrastructure That Moves Capital</h2>
            <p className="text-zinc-400 mt-4 max-w-2xl text-[15px]">North Carolina&apos;s multimodal infrastructure positions enterprises at the center of East Coast commerce — with direct access to 70% of the U.S. population within a day&apos;s drive.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {infrastructure.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="infra-card group bg-zinc-900/30 border border-zinc-800/50 p-8 rounded-sm hover:border-blue-500/20 transition-all duration-500">
                  <div className="flex items-start space-x-5">
                    <div className="w-14 h-14 rounded-sm bg-blue-500/10 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-colors">
                      <Icon className="w-7 h-7 text-blue-400" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-white font-bold text-lg">{item.title}</h3>
                        <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">{item.count}</span>
                      </div>
                      <p className="text-zinc-400 text-[14px] leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Workforce & Education ── */}
      <section ref={workforceRef} className="bg-zinc-950 py-24 border-b border-zinc-800/30">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <div>
              <div className="inline-flex items-center space-x-2 mb-4">
                <div className="w-8 h-px bg-emerald-500"></div>
                <span className="text-[11px] font-bold tracking-[0.2em] text-emerald-400 uppercase">Human Capital</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6">Workforce & Education</h2>
              <p className="text-zinc-400 text-[15px] leading-relaxed mb-8">
                North Carolina&apos;s education-to-employment pipeline is the most sophisticated in the Southeast. With 16 UNC System universities, 58 community colleges, and customized workforce training programs, enterprises access talent at scale — from entry-level operators to PhD-level researchers.
              </p>
              <Link href="/contact" className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold tracking-widest uppercase px-6 py-3 rounded-sm transition-all">
                <span>Explore Workforce Programs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {workforce.map((w) => (
                <div key={w.label} className="workforce-item bg-zinc-900/30 border border-zinc-800/40 p-5 rounded-sm flex items-start space-x-5">
                  <div className="text-3xl font-black text-emerald-400 shrink-0 w-16 text-center">{w.value}</div>
                  <div>
                    <h3 className="text-white font-semibold text-[15px]">{w.label}</h3>
                    <p className="text-zinc-500 text-[13px] mt-1 leading-relaxed">{w.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Key Industries ── */}
      <section ref={industriesRef} className="bg-[#080808] py-24 border-b border-zinc-800/30">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <span className="text-[11px] font-bold tracking-[0.2em] text-zinc-500 uppercase">Sector Strength</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-3">Industry Corridors</h2>
            <p className="text-zinc-400 mt-4 max-w-2xl text-[15px]">Six high-growth sectors anchoring North Carolina&apos;s position as the premier destination for enterprise investment, talent acquisition, and innovation.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((ind) => {
              const Icon = ind.icon;
              return (
                <div key={ind.title} className="industry-card group bg-zinc-900/20 border border-zinc-800/40 p-7 rounded-sm hover:border-zinc-700 transition-all duration-300">
                  <div className="w-10 h-10 rounded-sm bg-zinc-800/80 flex items-center justify-center mb-5 group-hover:bg-blue-500/10 transition-colors">
                    <Icon className="w-5 h-5 text-zinc-400 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <h3 className="text-white font-bold text-[16px] mb-2">{ind.title}</h3>
                  <p className="text-zinc-500 text-[13px] leading-relaxed">{ind.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Tourism ── */}
      <section className="bg-zinc-950 py-24 border-b border-zinc-800/30 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=2532&auto=format&fit=crop')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/90 to-zinc-950/70" />
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div className="w-8 h-px bg-amber-500"></div>
              <span className="text-[11px] font-bold tracking-[0.2em] text-amber-400 uppercase">Sovereign Tourism</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6">A $34 Billion Visitor Economy</h2>
            <p className="text-zinc-300 text-[15px] leading-relaxed mb-4">
              North Carolina welcomes over 50 million visitors annually — generating $34 billion in direct spending and supporting 225,000 jobs. From the Blue Ridge Mountains to the Outer Banks, the state&apos;s tourism infrastructure is a proven economic engine.
            </p>
            <p className="text-zinc-400 text-[14px] leading-relaxed mb-8">
              For African diaspora enterprises in hospitality, culinary arts, eco-tourism, and cultural heritage — North Carolina offers a market that is both deep and receptive. AfDEC is actively positioning tourism as a bilateral corridor: NC visitors discovering Africa, and African tourism operators accessing the U.S. market.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="text-[11px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full uppercase tracking-wider">50M+ Annual Visitors</span>
              <span className="text-[11px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full uppercase tracking-wider">225K Tourism Jobs</span>
              <span className="text-[11px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full uppercase tracking-wider">41 State Parks</span>
              <span className="text-[11px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full uppercase tracking-wider">3 Distinct Regions</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quality of Life ── */}
      <section className="bg-[#080808] py-24 border-b border-zinc-800/30">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="text-[11px] font-bold tracking-[0.2em] text-zinc-500 uppercase">Beyond Business</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-3">Quality of Life</h2>
            <p className="text-zinc-400 mt-4 max-w-lg mx-auto text-[15px]">The best talent doesn&apos;t just follow jobs — they follow quality of life. North Carolina delivers both.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {qualityOfLife.map((q) => {
              const Icon = q.icon;
              return (
                <div key={q.label} className="text-center p-8 bg-zinc-900/20 border border-zinc-800/30 rounded-sm">
                  <Icon className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                  <div className="text-2xl md:text-3xl font-black text-white mb-2">{q.stat}</div>
                  <div className="text-[12px] text-zinc-400 font-medium">{q.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-zinc-950 py-24">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6">Start Your NC Expansion</h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto mb-10">
            Whether you are relocating, expanding, or investing — North Carolina is ready. AfDEC will guide you from site selection to day one.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold tracking-widest uppercase px-8 py-4 rounded-sm transition-all">
              <span>Request a Briefing</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/why-africa" className="flex items-center space-x-2 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-sm font-bold tracking-widest uppercase px-8 py-4 rounded-sm transition-all">
              <span>Explore Africa Markets</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer Ecosystem ── */}
      <div className="relative bg-zinc-950 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')" }} />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-zinc-950 to-transparent pointer-events-none z-10" />
        <Newsletter />
        <Footer />
      </div>
    </main>
  );
}
