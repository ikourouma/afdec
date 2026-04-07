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
import { ArrowRight, TrendingUp, Users, Globe, DollarSign, MapPin } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ─── Continental Statistics (World Bank / AfDB data) ───
const continentalStats = [
  { value: "1.4B", label: "Population (2024)", source: "World Bank" },
  { value: "3.7%", label: "Avg. GDP Growth", source: "AfDB, 2024 Outlook" },
  { value: "$3.4T", label: "Combined GDP", source: "World Bank" },
  { value: "54", label: "Sovereign Nations", source: "African Union" },
  { value: "$80B+", label: "Annual Diaspora Remittances", source: "World Bank" },
  { value: "43%", label: "Internet Penetration", source: "ITU 2024" },
];

// ─── Regional Corridors ───
const regions = [
  {
    name: "West Africa",
    color: "blue",
    anchor: "Nigeria, Ghana, Senegal, Côte d'Ivoire",
    gdp: "$836B combined",
    population: "430M+",
    keyStats: "Largest consumer market. Lagos — Africa's fintech capital. Accra — emerging tech hub.",
    opportunities: ["Fintech & Digital Payments", "Agriculture & Agribusiness", "Energy Infrastructure", "Consumer Goods"],
  },
  {
    name: "East Africa",
    color: "emerald",
    anchor: "Kenya, Tanzania, Ethiopia, Rwanda",
    gdp: "$380B combined",
    population: "320M+",
    keyStats: "Fastest-growing region. Nairobi — Africa's Silicon Savannah. Kigali — continental model for governance.",
    opportunities: ["Technology & Innovation", "Tourism & Wildlife", "Infrastructure & Construction", "Healthcare & Biotech"],
  },
  {
    name: "Southern Africa",
    color: "amber",
    anchor: "South Africa, Botswana, Mozambique, Zambia",
    gdp: "$580B combined",
    population: "210M+",
    keyStats: "Most industrialized region. Johannesburg — Africa's financial capital. Rich in minerals & mining.",
    opportunities: ["Mining & Minerals", "Financial Services", "Renewable Energy", "Manufacturing"],
  },
  {
    name: "North Africa",
    color: "purple",
    anchor: "Morocco, Egypt, Tunisia",
    gdp: "$620B combined",
    population: "250M+",
    keyStats: "Gateway to Europe. Morocco — Africa's automotive manufacturing hub. Egypt — Suez Canal strategic corridor.",
    opportunities: ["Automotive & Manufacturing", "Logistics & Trade", "Renewable Energy", "Tourism & Hospitality"],
  },
];

// ─── AfCFTA Impact ───
const tradeStats = [
  { value: "$450B", label: "Projected Intra-African Trade by 2035", icon: DollarSign },
  { value: "30M", label: "People Lifted from Extreme Poverty", icon: Users },
  { value: "1.3B", label: "Continental Free Trade Area Population", icon: Globe },
  { value: "$3.4T", label: "Combined Continental GDP", icon: TrendingUp },
];

const colorMap: Record<string, { bg: string; text: string; border: string; tag: string }> = {
  blue: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20", tag: "bg-blue-500/10 text-blue-300 border-blue-500/20" },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", tag: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", tag: "bg-amber-500/10 text-amber-300 border-amber-500/20" },
  purple: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20", tag: "bg-purple-500/10 text-purple-300 border-purple-500/20" },
};

export default function WhyAfricaPage() {
  const statsRef = useRef<HTMLDivElement>(null);
  const regionsRef = useRef<HTMLDivElement>(null);
  const tradeRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(".africa-stat",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: statsRef.current, start: "top 85%" }
      }
    );
    gsap.fromTo(".region-card",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: "power3.out",
        scrollTrigger: { trigger: regionsRef.current, start: "top 85%" }
      }
    );
    gsap.fromTo(".trade-stat",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: tradeRef.current, start: "top 85%" }
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
        tag="The Mandate"
        headline="Why Africa"
        subheadline="1.4 billion people. The world's youngest population. The fastest-growing consumer markets on the planet. Africa is not an emerging story — it is the defining economic narrative of the 21st century."
      />

      {/* ── Continental Growth Engine ── */}
      <section ref={statsRef} className="bg-zinc-950 py-24 border-b border-zinc-800/30">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <span className="text-[11px] font-bold tracking-[0.2em] text-zinc-500 uppercase">Continental Overview</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-3">The Growth Engine</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {continentalStats.map((s) => (
              <div key={s.label} className="africa-stat bg-zinc-900/40 border border-zinc-800/50 p-6 rounded-sm text-center hover:border-emerald-500/30 transition-all duration-300">
                <div className="text-3xl md:text-4xl font-black text-emerald-400 mb-2">{s.value}</div>
                <div className="text-[13px] text-white font-semibold mb-1">{s.label}</div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider">{s.source}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Regional Corridors ── */}
      <section ref={regionsRef} className="bg-[#080808] py-24 border-b border-zinc-800/30">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div className="w-8 h-px bg-emerald-500"></div>
              <span className="text-[11px] font-bold tracking-[0.2em] text-emerald-400 uppercase">Regional Intelligence</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white">Four Economic Corridors</h2>
            <p className="text-zinc-400 mt-4 max-w-2xl text-[15px]">Africa is not monolithic. Each region presents distinct investment profiles, sector strengths, and market access opportunities. Click through to explore country-level data.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {regions.map((region) => {
              const colors = colorMap[region.color];
              return (
                <div key={region.name} className={`region-card bg-zinc-900/30 border border-zinc-800/50 p-8 rounded-sm hover:${colors.border} transition-all duration-500`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-xl font-black ${colors.text}`}>{region.name}</h3>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${colors.tag}`}>{region.gdp}</span>
                  </div>
                  <p className="text-zinc-400 text-[13px] font-medium mb-2">
                    <MapPin className="w-3 h-3 inline mr-1" />{region.anchor}
                  </p>
                  <p className="text-zinc-500 text-[13px] leading-relaxed mb-4">{region.keyStats}</p>
                  <div className="flex items-center space-x-2 mb-5">
                    <Users className="w-3 h-3 text-zinc-600" />
                    <span className="text-[11px] text-zinc-500">{region.population} population</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {region.opportunities.map((opp) => (
                      <span key={opp} className="text-[10px] font-bold text-zinc-400 bg-zinc-800/80 px-2.5 py-1 rounded-full uppercase tracking-wider">{opp}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <p className="text-zinc-500 text-[13px] mb-4">The Africa Investment Intelligence Map with country-level World Bank data is coming soon.</p>
          </div>
        </div>
      </section>

      {/* ── Tourism ── */}
      <section className="bg-zinc-950 py-24 border-b border-zinc-800/30 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=2572&auto=format&fit=crop')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/90 to-zinc-950/70" />
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div className="w-8 h-px bg-amber-500"></div>
              <span className="text-[11px] font-bold tracking-[0.2em] text-amber-400 uppercase">Sovereign Tourism</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6">Africa&apos;s $200 Billion Tourism Economy</h2>
            <p className="text-zinc-300 text-[15px] leading-relaxed mb-4">
              Tourism employs 24 million people across the continent and is growing at 5.1% annually — faster than the global average. From Kenya&apos;s safari corridors to Morocco&apos;s heritage cities to South Africa&apos;s wine country, Africa offers a tourism product that is both diverse and premium.
            </p>
            <p className="text-zinc-400 text-[14px] leading-relaxed mb-8">
              AfDEC is building bilateral tourism corridors between North Carolina and key African destinations. Our mandate: position African tourism operators for the U.S. market, and position NC hospitality enterprises for African visitor growth.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="text-[11px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full uppercase tracking-wider">70M+ Int&apos;l Arrivals</span>
              <span className="text-[11px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full uppercase tracking-wider">24M Tourism Jobs</span>
              <span className="text-[11px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full uppercase tracking-wider">5.1% Annual Growth</span>
              <span className="text-[11px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full uppercase tracking-wider">UNESCO World Heritage Sites</span>
            </div>
            <Link href="/contact" className="inline-flex items-center space-x-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold tracking-widest uppercase px-6 py-3 rounded-sm transition-all">
              <span>Explore Tourism Opportunities</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── AfCFTA & Trade ── */}
      <section ref={tradeRef} className="bg-[#080808] py-24 border-b border-zinc-800/30">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div className="w-8 h-px bg-blue-500"></div>
              <span className="text-[11px] font-bold tracking-[0.2em] text-blue-400 uppercase">Continental Integration</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white">The African Continental Free Trade Area</h2>
            <p className="text-zinc-400 mt-4 max-w-2xl text-[15px]">
              The AfCFTA — the world&apos;s largest free trade area by number of countries — is projected to increase intra-African trade by 52% by 2035. For diaspora enterprises, this means access to a unified market of 1.3 billion consumers with reduced tariffs and streamlined customs.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {tradeStats.map((t) => {
              const Icon = t.icon;
              return (
                <div key={t.label} className="trade-stat text-center p-8 bg-zinc-900/30 border border-zinc-800/40 rounded-sm">
                  <Icon className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                  <div className="text-2xl md:text-3xl font-black text-white mb-2">{t.value}</div>
                  <div className="text-[12px] text-zinc-400 font-medium">{t.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-zinc-950 py-24">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6">Enter the African Market</h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto mb-10">
            From Lagos to Nairobi, from Accra to Johannesburg — AfDEC connects your enterprise to Africa&apos;s fastest-growing economies.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold tracking-widest uppercase px-8 py-4 rounded-sm transition-all">
              <span>Request Market Briefing</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/why-nc" className="flex items-center space-x-2 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-sm font-bold tracking-widest uppercase px-8 py-4 rounded-sm transition-all">
              <span>See Why North Carolina</span>
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
