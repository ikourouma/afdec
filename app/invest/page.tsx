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
  ShieldCheck, 
  Handshake, 
  TrendingUp, 
  Building2, 
  ArrowRight, 
  Award, 
  Globe2, 
  Users 
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const investmentTiers = [
  {
    tier: "Founding Partner",
    capacity: "Limited to 5 Entities",
    fee: "Contact for Institutional Pricing",
    description: "The highest level of sovereign engagement. Founding partners hold a permanent seat on the Global Strategy Board and oversee the execution of Tier-1 infrastructure mandates.",
    benefits: [
      "Permanent seat on the Global Strategy Board",
      "First-priority access to Sovereign EPC contracts",
      "Direct Ministerial-level networking access",
      "Executive branding on all Global Briefings",
      "Private concierge for cross-border logistics"
    ],
    cta: "Request Governance Briefing",
    accent: "border-amber-500/50 bg-amber-500/5",
    button: "bg-amber-600 hover:bg-amber-500"
  },
  {
    tier: "Strategic Institutional",
    capacity: "Rolling Enrollment",
    fee: "Contact for Institutional Pricing",
    description: "Designed for mid-to-large cap enterprises expanding into African or NC corridors. Provides the institutional infrastructure needed to scale operations with policy-level support.",
    benefits: [
      "Quarterly Market Intelligence reports",
      "Priority registration for Trade Missions",
      "Sovereign Guarantee advisory services",
      "Policy advocacy representation (NC & AU)",
      "Access to the AfDEC Vendor Registry"
    ],
    cta: "Submit Intake Document",
    accent: "border-blue-500/50 bg-blue-500/5",
    button: "bg-blue-600 hover:bg-blue-500"
  },
  {
    tier: "Corporate Member",
    capacity: "Open Enrollment",
    fee: "Contact for Institutional Pricing",
    description: "The standard entry level for businesses seeking access to the AfDEC ecosystem. Connect with over 1,200 entities across North Carolina and the African continent.",
    benefits: [
      "Monthly Virtual Nexus networking sessions",
      "Standard access to the AfDEC Portal",
      "SME development resources",
      "Digital badge of Membership Excellence",
      "Discounted attendance at Annual Summit"
    ],
    cta: "Apply for Membership",
    accent: "border-zinc-800 bg-zinc-900/50",
    button: "bg-zinc-800 hover:bg-zinc-700"
  }
];

const impactMetrics = [
  { label: "Capital Deployed", value: "$4.2B", icon: TrendingUp },
  { label: "Jobs Facilitated", value: "85K+", icon: Users },
  { label: "Markets Activated", value: "12", icon: Globe2 },
  { label: "Institutional Partners", value: "1.2K", icon: Building2 },
];

export default function InvestPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tiersRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Reveal impact metrics
    gsap.fromTo(".impact-card", 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: ".impact-section", start: "top 80%" }
      }
    );

    // Reveal investment tiers
    gsap.fromTo(".tier-card",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out",
        scrollTrigger: { trigger: tiersRef.current, start: "top 80%" }
      }
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

      {/* ── Hero: The Sovereign Investment Thesis ── */}
      <section className="relative bg-zinc-950 border-b border-zinc-800/50 overflow-hidden">
        {/* Layer 1: Photorealistic Institutional Depth */}
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center right",
          }}
        />
        
        {/* Layer 2: Sovereign Infrastructure Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.045] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.5'%3E%3Cpath d='M0 30h60M30 0v60'/%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: "60px 60px" }} />

        {/* Layer 3: Cinematic Reveal Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/90 to-zinc-950/25" />
        
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-24 md:py-32 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 mb-6 rounded-full backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[11px] font-bold tracking-[0.2em] text-amber-500 uppercase">Institutional Partnership</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] max-w-4xl">
            Own the Mandate:<br/>Invest in Shared Prosperity
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 mt-8 max-w-2xl leading-relaxed font-medium">
            AfDEC is not just an organization — it is the economic engine of a binational corridor. We connect the world&apos;s fastest-growing economies to North Carolina&apos;s industrial excellence.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
            <Link href="#tiers" className="w-full sm:w-auto px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold tracking-widest uppercase rounded-sm transition-all text-center">
              View Partnership Tiers
            </Link>
            <Link href="/contact" className="w-full sm:w-auto px-8 py-4 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-sm font-bold tracking-widest uppercase rounded-sm transition-all text-center">
              Schedule a Briefing
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
      </section>

      {/* ── Impact Section ── */}
      <section className="impact-section bg-zinc-950 py-24 border-b border-zinc-800/30">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {impactMetrics.map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.label} className="impact-card bg-zinc-900/30 border border-zinc-800/40 p-10 rounded-sm text-center">
                  <Icon className="w-8 h-8 text-amber-400 mx-auto mb-4" />
                  <div className="text-3xl md:text-5xl font-black text-white mb-2">{m.value}</div>
                  <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">{m.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Membership Tiers (The Core Mandate) ── */}
      <section id="tiers" ref={tiersRef} className="bg-[#080808] py-24 md:py-32">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16 md:mb-24">
            <span className="text-[11px] font-bold tracking-[0.2em] text-zinc-600 uppercase">Governance & Participation</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mt-4 tracking-tight">Institutional Engagement Models</h2>
            <p className="text-zinc-500 mt-6 max-w-2xl mx-auto text-lg leading-relaxed">
              We offer three tiers of structural partnership — each designed to provide specific levels of market access, policy influence, and operational support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {investmentTiers.map((tier) => (
              <div 
                key={tier.tier} 
                className={`tier-card group relative border p-10 rounded-sm transition-all duration-500 flex flex-col ${tier.accent}`}
              >
                <div className="mb-8">
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.25em] mb-2">{tier.capacity}</div>
                  <h3 className="text-2xl font-black text-white mb-1">{tier.tier}</h3>
                  <div className="text-lg font-bold text-zinc-400">{tier.fee}</div>
                </div>
                
                <p className="text-[14px] text-zinc-500 leading-relaxed mb-8 border-b border-zinc-800 pb-8">
                  {tier.description}
                </p>
                
                <div className="space-y-4 mb-10 flex-grow">
                  <div className="text-[11px] font-black text-zinc-600 uppercase tracking-widest mb-4 flex items-center">
                    <Award className="w-3.5 h-3.5 mr-2" />
                    Key Executive Benefits
                  </div>
                  {tier.benefits.map((benefit) => (
                    <div key={benefit} className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500/40 mt-1.5 shrink-0" />
                      <span className="text-[13px] text-zinc-400 leading-snug">{benefit}</span>
                    </div>
                  ))}
                </div>
                
                <Link 
                  href="/contact" 
                  className={`w-full py-4 text-white text-[12px] font-black tracking-widest uppercase rounded-sm transition-all flex items-center justify-center space-x-2 ${tier.button}`}
                >
                  <span>{tier.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Private Direct Contact ── */}
      <section className="bg-zinc-950 py-24 border-t border-zinc-900 overflow-hidden relative">
        {/* Subtle background kente element */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full" />
        
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-10 md:p-20 relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center space-x-2 mb-6">
                <Handshake className="w-5 h-5 text-blue-400" />
                <span className="text-[11px] font-bold tracking-[0.2em] text-blue-400 uppercase">Private Direct Placement</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-8">
                Is your organization currently reviewing African market expansion or NC industrial development?
              </h2>
              <p className="text-zinc-400 text-lg leading-relaxed mb-10">
                Beyond standard membership, AfDEC facilitates private, bilateral institutional partnerships. We provide the policy corridors and sovereign risk mitigation needed for high-scale enterprise mandates.
              </p>
              <Link href="/contact" className="inline-flex items-center space-x-3 group text-white text-lg font-bold border-b-2 border-blue-600 pb-2 hover:border-blue-400 transition-all">
                <span>Engage the Executive Secretariat</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer Ecosystem ── */}
      <div className="relative bg-zinc-950 overflow-hidden">
        <Newsletter />
        <Footer />
      </div>
    </main>
  );
}
