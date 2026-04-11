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
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { SideNav, type NavSection } from "@/components/ui/side-nav";
import { Users, Target, Award, Handshake, ArrowRight, Building2, Globe, Shield, FileText, Zap, Landmark } from "lucide-react";
import { motion } from "framer-motion";

const SECTIONS: NavSection[] = [
  { id: "hero", label: "The Council" },
  { id: "mission", label: "Mission & Vision" },
  { id: "mandate", label: "Sovereign Mandate" },
  { id: "values", label: "Core Values" },
  { id: "governance", label: "Governance" },
  { id: "committees", label: "Committees" },
  { id: "advisors", label: "Advisors" },
];

gsap.registerPlugin(ScrollTrigger);

// ─── Values ───
const values = [
  { icon: Target, title: "Sovereign Purpose", description: "Every initiative exists to create tangible economic pathways between Africa and North Carolina." },
  { icon: Users, title: "Diaspora-First", description: "The African diaspora is not a demographic — it is an economic force. We center their capital, talent, and vision." },
  { icon: Handshake, title: "Bilateral Integrity", description: "All partnerships are structured for mutual benefit. We reject extractive models." },
  { icon: Award, title: "Institutional Excellence", description: "We operate at the highest standard — in transparency, data, and accountability." },
];

export default function AboutPage() {
  const valuesRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(".value-card", 
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: valuesRef.current, start: "top 80%" }
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
      <Breadcrumb />
      <SideNav sections={SECTIONS} accentColor="blue" />
      {/* Page Content Begins */}

      {/* ── Hero with Dual-Layer Background (Photo + Sovereign Pattern) ── */}
      <section id="section-hero" className="relative bg-zinc-950 border-b border-zinc-800/50 overflow-hidden">
        {/* Layer 1: Photorealistic Depth (Strategic Leadership) */}
        <div
          className="absolute inset-0 opacity-[0.45]"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2670&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center right",
          }}
        />
        
        {/* Layer 2: Sovereign Geometric Pattern Overlay — African Institutional Style */}
        <div className="absolute inset-0 opacity-[0.045] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='1'%3E%3Cpath d='M0 0l40 40L0 80zM80 0L40 40l40 40z'/%3E%3Cpath d='M20 0l20 20L20 40zM60 0L40 20l20 20zM20 40l20 20L20 80zM60 40L40 60l20 20z'/%3E%3Ccircle cx='40' cy='40' r='8'/%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: "80px 80px" }} />

        {/* Layer 3: Cinematic Left-Dark / Right-Reveal Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/90 to-zinc-950/25" />
        
        {/* Bottom fade into page content */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-zinc-950 to-transparent" />
        {/* Subtle African geometric texture on top */}
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='1'%3E%3Cpath d='M0 0l40 40L0 80zM80 0L40 40l40 40z'/%3E%3Ccircle cx='40' cy='40' r='8'/%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: "80px 80px" }} />

        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-24 md:py-32 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-zinc-800/80 border border-zinc-700/50 mb-6 rounded-full backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-[11px] font-bold tracking-[0.2em] text-zinc-400 uppercase">The Council</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] max-w-4xl">
            The African Diaspora Economic Council
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 mt-6 max-w-2xl leading-relaxed font-medium">
            A sovereign institution building permanent economic bridges between North Carolina and the African continent. We exist to connect capital, talent, and enterprise across both shores.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      </section>

      {/* ── Sovereign Mandate (Fortune 5 Style Segment) ── */}
      <section id="section-mandate" className="bg-zinc-950 py-12">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="relative bg-zinc-900/30 border border-zinc-800/50 rounded-2xl overflow-hidden p-8 md:p-12">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30L0 0h60L30 30z' fill='%23ffffff'/%3E%3C/svg%3E")` }} />
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="max-w-2xl text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-950/40 border border-blue-900/30 mb-6 rounded-full">
                  <Shield className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-[10px] font-bold tracking-[0.2em] text-blue-400 uppercase">Strategic Directive</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6">
                  The AfDEC Strategic<br />Framework (2026-2030)
                </h2>
                <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                  A sovereign blueprint for transatlantic economic integration — driving prosperity between North Carolina and the African continent through structured, high-impact pillars.
                </p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                  <Link href="/about/strategic-framework" className="inline-flex items-center gap-2 group bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-black tracking-widest uppercase px-8 py-4 rounded-sm transition-all shadow-xl">
                    Explore the 2030 Blueprint
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="/insights/policy" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white text-xs font-bold tracking-widest uppercase px-6 py-4 transition-colors">
                    <FileText className="w-4 h-4" />
                    Policy Publications
                  </Link>
                </div>
              </div>
              
              {/* Visual Element: Pillar Highlight */}
              <div className="grid grid-cols-2 gap-6 w-full lg:w-auto">
                {[
                  { label: "Regional Market Access", icon: Globe, color: "blue", glow: "hover:border-blue-500/50 hover:bg-blue-500/5", iconColor: "text-blue-500" },
                  { label: "Export & Trade Logistics", icon: Building2, color: "emerald", glow: "hover:border-emerald-500/50 hover:bg-emerald-500/5", iconColor: "text-emerald-500" },
                  { label: "Infrastructure", icon: Zap, color: "amber", glow: "hover:border-amber-500/50 hover:bg-amber-500/5", iconColor: "text-amber-500" },
                  { label: "Human Capital", icon: Users, color: "purple", glow: "hover:border-purple-500/50 hover:bg-purple-500/5", iconColor: "text-purple-500" },
                ].map((item) => (
                  <motion.div 
                    key={item.label} 
                    whileHover={{ y: -5, scale: 1.02 }}
                    className={`bg-zinc-900/60 border border-zinc-800/60 p-8 rounded-xl flex flex-col items-center text-center transition-all duration-300 cursor-default min-w-[180px] ${item.glow}`}
                  >
                    <item.icon className={`w-8 h-8 mb-4 transition-colors ${item.iconColor}`} />
                    <span className="text-[11px] font-black text-white uppercase tracking-[0.2em]">{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section id="section-mission" className="bg-zinc-950 py-24 border-b border-zinc-800/30">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <div>
              <div className="inline-flex items-center space-x-2 mb-6">
                <div className="w-8 h-px bg-blue-500"></div>
                <span className="text-[11px] font-bold tracking-[0.2em] text-blue-400 uppercase">Our Mission</span>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-white leading-snug mb-6">
                We build the bridges that connect African and American enterprises to shared prosperity.
              </p>
              <p className="text-[15px] text-zinc-400 leading-relaxed">
                AfDEC brings together investors, businesses, and government partners to open new markets, create jobs, and move capital across the Atlantic. Based in Raleigh, North Carolina, we work at the intersection of trade, investment, and diaspora-driven growth — turning relationships into lasting economic infrastructure.
              </p>
            </div>
            <div>
              <div className="inline-flex items-center space-x-2 mb-6">
                <div className="w-8 h-px bg-emerald-500"></div>
                <span className="text-[11px] font-bold tracking-[0.2em] text-emerald-400 uppercase">Our Vision</span>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-white leading-snug mb-6">
                A world where the African diaspora leads its own economic future — on both continents.
              </p>
              <p className="text-[15px] text-zinc-400 leading-relaxed">
                By 2030, AfDEC will be the leading platform connecting Africa and North America — deploying capital into high-growth sectors, empowering 10,000 enterprises with cross-border opportunity, and building policy pathways that create generational wealth for the diaspora.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Core Values ── */}
      <section id="section-values" ref={valuesRef} className="bg-[#080808] py-24 border-b border-zinc-800/30">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="text-[11px] font-bold tracking-[0.2em] text-zinc-500 uppercase">Foundational Principles</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-3">What We Stand For</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="value-card group bg-zinc-900/50 border border-zinc-800 p-8 rounded-sm hover:border-blue-500/30 transition-all duration-500">
                  <div className="w-12 h-12 rounded-sm bg-blue-500/10 flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                    <Icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{v.title}</h3>
                  <p className="text-[13px] text-zinc-500 leading-relaxed">{v.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Institutional Leadership & Oversight (Cinematic Portal) ── */}
      <section id="section-governance" className="bg-[#080808] py-32 border-b border-zinc-800/30 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0,transparent_70%)]" />
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-zinc-900 border border-zinc-800 mb-8 rounded-full">
                <Users className="w-3 h-3 text-blue-500" />
                <span className="text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase">Institutional Governance</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[0.95] mb-8">
                The Sovereign<br />Mandate.
              </h2>
              <p className="text-xl text-zinc-400 font-medium leading-relaxed mb-10">
                Our leadership hierarchy is structured across three distinct pillars: The Sovereign Council (Fiduciary), the Executive Mandate (Operations), and the Board of Advisors (Strategy). 
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Link href="/about/leadership" className="inline-flex items-center gap-2 group bg-blue-600 hover:bg-blue-500 text-white text-xs font-black tracking-widest uppercase px-10 py-5 rounded-sm transition-all shadow-xl">
                  Explore the Identity Hub
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/about/leadership#governance" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white text-xs font-bold tracking-widest uppercase px-6 py-4 transition-colors">
                  <Landmark className="w-4 h-4" />
                  Institutional Framework
                </Link>
              </div>
            </div>
            
            {/* Visual Abstract: The Trinity Tiers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full lg:w-auto">
               {[
                 { label: "Sovereign Council", color: "text-blue-500", glow: "hover:border-blue-500/40", detail: "Fiduciary Oversight", href: "/about/leadership#council" },
                 { label: "Executive Mandate", color: "text-amber-500", glow: "hover:border-amber-500/40", detail: "Operational Drive", href: "/about/leadership#executive" },
                 { label: "Board of Advisors", color: "text-emerald-500", glow: "hover:border-emerald-500/40", detail: "Strategic Counsel", href: "/about/leadership#advisor" }
               ].map((tier) => (
                 <Link 
                   key={tier.label} 
                   href={tier.href}
                   className={`p-10 border border-zinc-800 bg-zinc-900/40 rounded-sm text-center group transition-all duration-500 flex flex-col justify-center min-h-[240px] ${tier.glow}`}
                 >
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <div className={`text-[10px] font-black ${tier.color} uppercase tracking-[0.4em] mb-4`}>{tier.label}</div>
                      <div className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest group-hover:text-zinc-300 transition-colors">{tier.detail}</div>
                      <div className="mt-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className={`w-5 h-5 mx-auto ${tier.color}`} />
                      </div>
                    </motion.div>
                 </Link>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#080808] py-24">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6">Join the Mandate</h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto mb-10">
            Whether you are an investor, an entrepreneur, or a policy leader — there is a seat at this table.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth" className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold tracking-widest uppercase px-8 py-4 rounded-sm transition-all">
              <span>Become a Member</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/contact" className="flex items-center space-x-2 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-sm font-bold tracking-widest uppercase px-8 py-4 rounded-sm transition-all">
              <span>Contact the Council</span>
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

