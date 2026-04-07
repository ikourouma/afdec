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
import { Users, Target, Award, Handshake, ArrowRight, Building2, Globe } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ─── Board of Directors (Placeholder) ───
const boardMembers = [
  { name: "Ibrahima K.", title: "Chairman & Founder", org: "AfDEC", image: null },
  { name: "Amara D.", title: "Vice Chair, Strategy", org: "Continental Finance Group", image: null },
  { name: "Fatima N.", title: "Secretary, Governance", org: "Pan-African Trade Council", image: null },
  { name: "Kwame A.", title: "Treasurer", org: "Atlas Capital Partners", image: null },
  { name: "Sarah M.", title: "Director, Programs", org: "Diaspora Bridge Foundation", image: null },
  { name: "David O.", title: "Director, Partnerships", org: "NC Innovation Hub", image: null },
];

// ─── Committees ───
const committees = [
  { name: "Finance & Audit Committee", description: "Oversees fiscal integrity, annual budgets, and financial reporting standards.", members: 4 },
  { name: "Programs & Impact Committee", description: "Designs and evaluates initiative effectiveness across all AfDEC programs.", members: 5 },
  { name: "Governance & Nominating Committee", description: "Manages board composition, bylaws compliance, and leadership transitions.", members: 3 },
  { name: "Fundraising & Development Committee", description: "Drives capital campaigns, donor relations, and partnership pipeline growth.", members: 4 },
  { name: "Communications & Marketing Committee", description: "Shapes institutional messaging, brand strategy, and media relations.", members: 3 },
];

// ─── Board of Advisors ───
const advisors = [
  { name: "Dr. Olusegun B.", title: "Senior Economic Advisor", expertise: "Macroeconomic Policy & Trade", region: "West Africa" },
  { name: "Michelle T.", title: "Strategic Advisor", expertise: "Corporate Governance & ESG", region: "North America" },
  { name: "Jean-Pierre L.", title: "Francophone Markets Advisor", expertise: "Bilateral Investment Treaties", region: "Central Africa" },
  { name: "Prof. Aisha K.", title: "Research Advisor", expertise: "Diaspora Economics & Migration", region: "East Africa" },
];

// ─── Timeline ───
const milestones = [
  { year: "2024", title: "Founding Vision", description: "AfDEC conceptualized as a transatlantic economic bridge connecting North Carolina and the African continent." },
  { year: "2025", title: "Incorporation & Board Formation", description: "Incorporated as a North Carolina 501(c)(4). Inaugural board seated. Strategic framework ratified." },
  { year: "2026", title: "Platform Launch & Phase 1 Operations", description: "Digital platform deployed. First market briefings published. Member enrollment opens." },
  { year: "2027", title: "Expansion Target", description: "First bilateral trade delegation. Accra and Nairobi hub activation. Inaugural State of Africa Business event." },
];

// ─── Values ───
const values = [
  { icon: Target, title: "Sovereign Purpose", description: "Every initiative exists to create tangible economic pathways between Africa and North Carolina." },
  { icon: Users, title: "Diaspora-First", description: "The African diaspora is not a demographic — it is an economic force. We center their capital, talent, and vision." },
  { icon: Handshake, title: "Bilateral Integrity", description: "All partnerships are structured for mutual benefit. We reject extractive models." },
  { icon: Award, title: "Institutional Excellence", description: "We operate at the standard of a Fortune 5 organization — in transparency, data, and accountability." },
];

export default function AboutPage() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Animate value cards
    gsap.fromTo(".value-card", 
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: valuesRef.current, start: "top 80%" }
      }
    );
    // Animate board cards
    gsap.fromTo(".board-card",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power3.out",
        scrollTrigger: { trigger: boardRef.current, start: "top 80%" }
      }
    );
    // Animate timeline items
    gsap.fromTo(".timeline-item",
      { x: -30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, stagger: 0.15, ease: "power3.out",
        scrollTrigger: { trigger: timelineRef.current, start: "top 80%" }
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
        tag="The Council"
        headline="The African Diaspora Economic Council"
        subheadline="A sovereign institution bridging institutional capital and enterprise expansion between North Carolina and the African continent. We exist to create permanent economic infrastructure for the global African diaspora."
      />

      {/* ── Mission & Vision ── */}
      <section className="bg-zinc-950 py-24 border-b border-zinc-800/30">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <div>
              <div className="inline-flex items-center space-x-2 mb-6">
                <div className="w-8 h-px bg-blue-500"></div>
                <span className="text-[11px] font-bold tracking-[0.2em] text-blue-400 uppercase">Our Mission</span>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-white leading-snug mb-6">
                To architect bilateral economic corridors that unlock capital, talent, and trade between the U.S. and Africa.
              </p>
              <p className="text-[15px] text-zinc-400 leading-relaxed">
                AfDEC operates at the intersection of foreign direct investment, diaspora capital mobilization, and sovereign economic development. Based in Raleigh, North Carolina, we convene investors, enterprises, and government partners to build the infrastructure required for transatlantic prosperity.
              </p>
            </div>
            <div>
              <div className="inline-flex items-center space-x-2 mb-6">
                <div className="w-8 h-px bg-emerald-500"></div>
                <span className="text-[11px] font-bold tracking-[0.2em] text-emerald-400 uppercase">Our Vision</span>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-white leading-snug mb-6">
                A world where the African diaspora commands its economic destiny across both continents.
              </p>
              <p className="text-[15px] text-zinc-400 leading-relaxed">
                By 2030, AfDEC will be the preeminent institutional bridge between Africa and North America — deploying capital into high-growth sectors, connecting 10,000 enterprises to cross-border opportunity, and establishing permanent policy pathways that outlast any single administration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Core Values ── */}
      <section ref={valuesRef} className="bg-[#080808] py-24 border-b border-zinc-800/30">
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
      <section ref={boardRef} className="bg-zinc-950 py-24 border-b border-zinc-800/30">
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

      {/* ── Committees ── */}
      <section className="bg-[#080808] py-24 border-b border-zinc-800/30">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <span className="text-[11px] font-bold tracking-[0.2em] text-zinc-500 uppercase">Operational Structure</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-3">Standing Committees</h2>
          </div>
          <div className="space-y-3">
            {committees.map((c) => (
              <details key={c.name} className="group bg-zinc-900/30 border border-zinc-800/50 rounded-sm overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-zinc-900/60 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 rounded-full bg-blue-500/60 group-open:bg-blue-500 transition-colors"></div>
                    <h3 className="text-white font-semibold text-[15px]">{c.name}</h3>
                  </div>
                  <span className="text-[11px] text-zinc-600 font-medium tracking-wider uppercase">{c.members} Members</span>
                </summary>
                <div className="px-6 pb-6 pl-12">
                  <p className="text-zinc-400 text-[14px] leading-relaxed">{c.description}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Board of Advisors ── */}
      <section className="bg-zinc-950 py-24 border-b border-zinc-800/30">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <span className="text-[11px] font-bold tracking-[0.2em] text-zinc-500 uppercase">Strategic Counsel</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-3">Board of Advisors</h2>
            <p className="text-zinc-400 mt-4 max-w-xl text-[15px]">Distinguished leaders who provide strategic counsel on macroeconomic policy, governance, and transatlantic market development.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {advisors.map((advisor) => (
              <div key={advisor.name} className="bg-zinc-900/20 border border-zinc-800/40 p-6 rounded-sm flex items-start space-x-5">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 border border-emerald-700/30 flex items-center justify-center text-emerald-400 font-bold text-lg shrink-0">
                  {advisor.name.split(" ").map(n => n[0]).join("").slice(0,2)}
                </div>
                <div>
                  <h3 className="text-white font-bold text-[15px]">{advisor.name}</h3>
                  <p className="text-emerald-400 text-[13px] font-medium mt-0.5">{advisor.title}</p>
                  <div className="flex items-center space-x-4 mt-2">
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

      {/* ── Timeline ── */}
      <section ref={timelineRef} className="bg-[#080808] py-24 border-b border-zinc-800/30">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <span className="text-[11px] font-bold tracking-[0.2em] text-zinc-500 uppercase">Institutional Trajectory</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-3">The Journey</h2>
          </div>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-blue-500/20 to-transparent hidden md:block"></div>

            <div className="space-y-12">
              {milestones.map((m, i) => (
                <div key={m.year} className="timeline-item flex items-start space-x-8">
                  <div className="relative shrink-0 hidden md:block">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black border-2 ${i === milestones.length - 1 ? 'border-zinc-700 bg-zinc-900 text-zinc-500' : 'border-blue-500/50 bg-blue-500/10 text-blue-400'}`}>
                      {m.year.slice(2)}
                    </div>
                  </div>
                  <div className="pb-2">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-blue-400 font-black text-sm md:hidden">{m.year}</span>
                      <h3 className="text-white font-bold text-lg">{m.title}</h3>
                    </div>
                    <p className="text-zinc-400 text-[14px] leading-relaxed max-w-lg">{m.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-zinc-950 py-24">
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
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')" }}
        />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-zinc-950 to-transparent pointer-events-none z-10" />
        <Newsletter />
        <Footer />
      </div>
    </main>
  );
}
