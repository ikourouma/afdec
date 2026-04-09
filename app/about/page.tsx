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
import { Users, Target, Award, Handshake, ArrowRight, Building2, Globe, Shield, FileText, Zap } from "lucide-react";

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

// ─── Board of Directors (Placeholder) ───
const boardMembers = [
  { name: "Ibrahima Kourouma", title: "President & Chairman", org: "AfDEC", image: null },
  { name: "Amara D.", title: "Vice Chair, Strategy", org: "Continental Finance Group", image: null },
  { name: "Fatima N.", title: "Secretary, Governance", org: "Pan-African Trade Council", image: null },
  { name: "Kwame A.", title: "Treasurer", org: "Atlas Capital Partners", image: null },
  { name: "Sarah M.", title: "Director, Programs", org: "Diaspora Bridge Foundation", image: null },
  { name: "David O.", title: "Director, Partnerships", org: "NC Innovation Hub", image: null },
];

// ─── Committee Members (Placeholder - 9 members, 3x3) ───
const committeeMembers = [
  { name: "Aminata S.", title: "Finance & Audit", role: "Committee Chair", region: "West Africa" },
  { name: "John T.", title: "Finance & Audit", role: "Committee Member", region: "North America" },
  { name: "Blessing O.", title: "Finance & Audit", role: "Committee Member", region: "Southern Africa" },
  { name: "Marie-Claire D.", title: "Programs & Impact", role: "Committee Chair", region: "Central Africa" },
  { name: "Rashid K.", title: "Programs & Impact", role: "Committee Member", region: "East Africa" },
  { name: "Patricia H.", title: "Programs & Impact", role: "Committee Member", region: "North America" },
  { name: "Samuel E.", title: "Governance & Nominating", role: "Committee Chair", region: "West Africa" },
  { name: "Linda W.", title: "Fundraising & Development", role: "Committee Chair", region: "North America" },
  { name: "Ahmed B.", title: "Communications", role: "Committee Chair", region: "North Africa" },
];

// ─── Board of Advisors (Placeholder - 9 advisors, 3x3) ───
const advisors = [
  { name: "Dr. Olusegun B.", title: "Senior Economic Advisor", expertise: "Macroeconomic Policy & Trade", region: "West Africa" },
  { name: "Michelle T.", title: "Strategic Advisor", expertise: "Corporate Governance & ESG", region: "North America" },
  { name: "Jean-Pierre L.", title: "Francophone Markets Advisor", expertise: "Bilateral Investment Treaties", region: "Central Africa" },
  { name: "Prof. Aisha K.", title: "Research Advisor", expertise: "Diaspora Economics & Migration", region: "East Africa" },
  { name: "Dr. Robert M.", title: "Infrastructure Advisor", expertise: "Public-Private Partnerships", region: "Southern Africa" },
  { name: "Nadia E.", title: "Legal & Compliance Advisor", expertise: "International Trade Law", region: "North Africa" },
  { name: "Charles N.", title: "Technology Advisor", expertise: "Digital Transformation & Fintech", region: "East Africa" },
  { name: "Susan P.", title: "Tourism & Hospitality Advisor", expertise: "Sovereign Tourism Strategy", region: "North America" },
  { name: "Dr. Yusuf A.", title: "Climate & Energy Advisor", expertise: "Green Infrastructure & ESG", region: "West Africa" },
];

// ─── Values ───
const values = [
  { icon: Target, title: "Sovereign Purpose", description: "Every initiative exists to create tangible economic pathways between Africa and North Carolina." },
  { icon: Users, title: "Diaspora-First", description: "The African diaspora is not a demographic — it is an economic force. We center their capital, talent, and vision." },
  { icon: Handshake, title: "Bilateral Integrity", description: "All partnerships are structured for mutual benefit. We reject extractive models." },
  { icon: Award, title: "Institutional Excellence", description: "We operate at the highest standard — in transparency, data, and accountability." },
];

export default function AboutPage() {
  const valuesRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(".value-card", 
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: valuesRef.current, start: "top 80%" }
      }
    );
    gsap.fromTo(".board-card",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power3.out",
        scrollTrigger: { trigger: boardRef.current, start: "top 80%" }
      }
    );
    gsap.fromTo(".committee-card",
      { y: 25, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: "power3.out",
        scrollTrigger: { trigger: ".committee-section", start: "top 80%" }
      }
    );
    gsap.fromTo(".advisor-card",
      { y: 25, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: "power3.out",
        scrollTrigger: { trigger: ".advisor-section", start: "top 80%" }
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
              <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
                {[
                  { label: "Market Access", icon: Globe, color: "blue" },
                  { label: "SME Growth", icon: Building2, color: "emerald" },
                  { label: "Infrastructure", icon: Zap, color: "amber" },
                  { label: "Human Capital", icon: Users, color: "purple" },
                ].map((item) => (
                  <div key={item.label} className="bg-zinc-900/40 border border-zinc-800/40 p-5 rounded-xl flex flex-col items-center text-center">
                    <item.icon className="w-5 h-5 text-zinc-600 mb-2" />
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{item.label}</span>
                  </div>
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

      {/* ── Board of Directors ── */}
      <section id="section-governance" ref={boardRef} className="bg-zinc-950 py-24 border-b border-zinc-800/30">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <span className="text-[11px] font-bold tracking-[0.2em] text-zinc-500 uppercase">Governance</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-3">Board of Directors</h2>
            <p className="text-zinc-400 mt-4 max-w-xl text-[15px]">Representing the unified interests of the African diaspora business community across North Carolina and the continent.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {boardMembers.map((member) => (
              <div key={member.name} className="board-card group bg-zinc-900/30 border border-zinc-800/50 p-6 rounded-sm hover:border-zinc-700 transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 rounded-sm bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-black text-xl shrink-0">
                    {member.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-white font-bold text-[15px]">{member.name}</h3>
                    <p className="text-blue-400 text-[13px] font-medium mt-0.5">{member.title}</p>
                    <p className="text-zinc-500 text-[12px] mt-1">{member.org}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-zinc-600 hover:text-blue-400 cursor-pointer transition-colors"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  <span className="text-[11px] text-zinc-600">View Profile</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Standing Committees ── */}
      <section id="section-committees" className="committee-section bg-[#080808] py-24 border-b border-zinc-800/30">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <span className="text-[11px] font-bold tracking-[0.2em] text-zinc-500 uppercase">Operational Structure</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-3">Standing Committees</h2>
            <p className="text-zinc-400 mt-4 max-w-xl text-[15px]">Our committees drive the day-to-day operations and strategic execution of the Council&apos;s mandate.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {committeeMembers.map((member) => (
              <div key={member.name} className="committee-card bg-zinc-900/20 border border-zinc-800/40 p-6 rounded-sm flex items-start space-x-4">
                <div className="w-14 h-14 rounded-sm bg-gradient-to-br from-amber-600/20 to-amber-800/20 border border-amber-700/30 flex items-center justify-center text-amber-400 font-bold text-lg shrink-0">
                  {member.name.split(" ").map(n => n[0]).join("").slice(0,2)}
                </div>
                <div>
                  <h3 className="text-white font-bold text-[15px]">{member.name}</h3>
                  <p className="text-amber-400 text-[13px] font-medium mt-0.5">{member.role}</p>
                  <div className="flex items-center space-x-3 mt-2">
                    <span className="text-[11px] text-zinc-500 flex items-center space-x-1">
                      <Building2 className="w-3 h-3" />
                      <span>{member.title}</span>
                    </span>
                    <span className="text-[11px] text-zinc-600 flex items-center space-x-1">
                      <Globe className="w-3 h-3" />
                      <span>{member.region}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Board of Advisors ── */}
      <section id="section-advisors" className="advisor-section bg-zinc-950 py-24 border-b border-zinc-800/30">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <span className="text-[11px] font-bold tracking-[0.2em] text-zinc-500 uppercase">Strategic Counsel</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-3">Board of Advisors</h2>
            <p className="text-zinc-400 mt-4 max-w-xl text-[15px]">Distinguished leaders providing strategic counsel on policy, governance, and transatlantic market development.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {advisors.map((advisor) => (
              <div key={advisor.name} className="advisor-card bg-zinc-900/20 border border-zinc-800/40 p-6 rounded-sm flex items-start space-x-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 border border-emerald-700/30 flex items-center justify-center text-emerald-400 font-bold text-lg shrink-0">
                  {advisor.name.split(" ").map(n => n[0]).join("").slice(0,2)}
                </div>
                <div>
                  <h3 className="text-white font-bold text-[15px]">{advisor.name}</h3>
                  <p className="text-emerald-400 text-[13px] font-medium mt-0.5">{advisor.title}</p>
                  <div className="flex items-center space-x-3 mt-2">
                    <span className="text-[11px] text-zinc-500 flex items-center space-x-1">
                      <Building2 className="w-3 h-3" />
                      <span>{advisor.expertise}</span>
                    </span>
                    <span className="text-[11px] text-zinc-600 flex items-center space-x-1">
                      <Globe className="w-3 h-3" />
                      <span>{advisor.region}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
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

