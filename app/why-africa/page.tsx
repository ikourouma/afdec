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

// ─── 5 Regional Corridors (Bento Grid) ───
const regions = [
  {
    name: "West Africa",
    anchor: "Nigeria, Ghana, Senegal, Côte d'Ivoire",
    gdp: "$836B",
    population: "430M+",
    keyStats: "The largest consumer market on the continent. Lagos — Africa's unrivalled fintech capital. Accra — fastest-growing tech hub. Home to ECOWAS and the engine of continental commerce.",
    opportunities: ["Fintech & Digital Payments", "Agriculture & Agribusiness", "Energy Infrastructure", "Consumer Goods"],
    colorScheme: { bg: "from-blue-600/15 to-blue-900/10", border: "border-blue-500/30", text: "text-blue-400", tag: "bg-blue-500/10 text-blue-300 border-blue-500/20", badge: "bg-blue-500/10 text-blue-300" },
  },
  {
    name: "East Africa",
    anchor: "Kenya, Tanzania, Ethiopia, Rwanda",
    gdp: "$380B",
    population: "320M+",
    keyStats: "Fastest-growing region. Nairobi — Silicon Savannah. Kigali — governance model. M-Pesa revolutionized global mobile payments here.",
    opportunities: ["Technology & Innovation", "Tourism & Wildlife", "Infrastructure", "Healthcare & Biotech"],
    colorScheme: { bg: "from-emerald-600/15 to-emerald-900/10", border: "border-emerald-500/30", text: "text-emerald-400", tag: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20", badge: "bg-emerald-500/10 text-emerald-300" },
  },
  {
    name: "Central Africa",
    anchor: "DRC, Cameroon, Gabon, Congo",
    gdp: "$260B",
    population: "200M+",
    keyStats: "The resource frontier. DRC holds 70% of global cobalt. Vast forestry and agricultural potential. Emerging logistics corridor.",
    opportunities: ["Mining & Minerals", "Forestry & Agriculture", "Logistics", "Renewable Energy"],
    colorScheme: { bg: "from-violet-600/15 to-violet-900/10", border: "border-violet-500/30", text: "text-violet-400", tag: "bg-violet-500/10 text-violet-300 border-violet-500/20", badge: "bg-violet-500/10 text-violet-300" },
  },
  {
    name: "Northern Africa",
    anchor: "Morocco, Egypt, Tunisia, Algeria",
    gdp: "$620B",
    population: "250M+",
    keyStats: "Gateway to Europe and the Mediterranean. Morocco — Africa's automotive manufacturing powerhouse. Egypt — Suez Canal strategic corridor.",
    opportunities: ["Automotive & Manufacturing", "Logistics & Trade", "Renewable Energy", "Tourism"],
    colorScheme: { bg: "from-amber-600/15 to-amber-900/10", border: "border-amber-500/30", text: "text-amber-400", tag: "bg-amber-500/10 text-amber-300 border-amber-500/20", badge: "bg-amber-500/10 text-amber-300" },
  },
  {
    name: "Southern Africa",
    anchor: "South Africa, Botswana, Mozambique, Zambia",
    gdp: "$580B",
    population: "210M+",
    keyStats: "Most industrialized region. Johannesburg — Africa's financial capital. Rich in diamonds, platinum, and critical minerals.",
    opportunities: ["Financial Services", "Mining & Minerals", "Renewable Energy", "Manufacturing"],
    colorScheme: { bg: "from-rose-600/15 to-rose-900/10", border: "border-rose-500/30", text: "text-rose-400", tag: "bg-rose-500/10 text-rose-300 border-rose-500/20", badge: "bg-rose-500/10 text-rose-300" },
  },
];

// ─── AfCFTA Impact ───
const tradeStats = [
  { value: "$450B", label: "Projected Intra-African Trade by 2035", icon: DollarSign },
  { value: "30M", label: "People Lifted from Extreme Poverty", icon: Users },
  { value: "1.3B", label: "Continental Free Trade Area Population", icon: Globe },
  { value: "$3.4T", label: "Combined Continental GDP", icon: TrendingUp },
];

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
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: "power3.out",
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

      {/* ── Hero with African Geometric Pattern ── */}
      <section className="relative bg-zinc-950 border-b border-zinc-800/50 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.8'%3E%3Cpath d='M0 50h100M50 0v100'/%3E%3Cpath d='M25 0l25 25L25 50 0 25zM75 0l25 25L75 50 50 25zM25 50l25 25L25 100 0 75zM75 50l25 25L75 100 50 75z'/%3E%3Ccircle cx='50' cy='50' r='12'/%3E%3Ccircle cx='50' cy='50' r='6'/%3E%3Ccircle cx='0' cy='0' r='5'/%3E%3Ccircle cx='100' cy='0' r='5'/%3E%3Ccircle cx='0' cy='100' r='5'/%3E%3Ccircle cx='100' cy='100' r='5'/%3E%3Ccircle cx='50' cy='0' r='3'/%3E%3Ccircle cx='50' cy='100' r='3'/%3E%3Ccircle cx='0' cy='50' r='3'/%3E%3Ccircle cx='100' cy='50' r='3'/%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: "100px 100px" }} />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-zinc-950 to-transparent" />

        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-24 md:py-32 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-zinc-800/80 border border-zinc-700/50 mb-6 rounded-full backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-bold tracking-[0.2em] text-zinc-400 uppercase">The Mandate</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] max-w-4xl">
            Why Africa
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 mt-6 max-w-2xl leading-relaxed font-medium">
            1.4 billion people. The world&apos;s youngest population. The fastest-growing consumer markets on the planet. Africa is not an emerging story — it is the defining economic narrative of the 21st century.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
      </section>

      {/* ── Continental Growth Engine ── */}
      <section ref={statsRef} className="bg-zinc-950 py-24 border-b border-zinc-800/30">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <span className="text-[11px] font-bold tracking-[0.2em] text-zinc-500 uppercase">Continental Overview</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-3">The Growth Engine</h2>
            <p className="text-zinc-400 mt-4 max-w-2xl text-[15px] leading-relaxed">
              Africa is home to the world&apos;s youngest workforce, six of the ten fastest-growing economies, and a consumer class projected to spend $2.1 trillion annually by 2030. For investors and enterprises seeking the next frontier of sustainable growth, the data speaks for itself.
            </p>
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

      {/* ── Regional Corridors — Bento Grid ── */}
      <section ref={regionsRef} className="bg-[#080808] py-24 border-b border-zinc-800/30">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div className="w-8 h-px bg-emerald-500"></div>
              <span className="text-[11px] font-bold tracking-[0.2em] text-emerald-400 uppercase">Regional Intelligence</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white">Five Economic Corridors</h2>
            <p className="text-zinc-400 mt-4 max-w-2xl text-[15px]">Africa is not monolithic. Each region presents distinct investment profiles, sector strengths, and market access opportunities.</p>
          </div>

          {/* Bento Grid: West Africa dominant (2-col, 2-row), East + Central stacked right, Northern + Southern bottom */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* West Africa — Dominant Card */}
            <div className={`region-card md:col-span-2 md:row-span-2 bg-gradient-to-br ${regions[0].colorScheme.bg} border ${regions[0].colorScheme.border} p-8 lg:p-10 rounded-sm`}>
              <div className="flex items-center justify-between mb-5">
                <h3 className={`text-2xl lg:text-3xl font-black ${regions[0].colorScheme.text}`}>{regions[0].name}</h3>
                <span className={`text-[11px] font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${regions[0].colorScheme.tag}`}>{regions[0].gdp} GDP</span>
              </div>
              <p className="text-zinc-400 text-[14px] font-medium mb-3">
                <MapPin className="w-3.5 h-3.5 inline mr-1.5" />{regions[0].anchor}
              </p>
              <p className="text-zinc-400 text-[15px] leading-relaxed mb-5">{regions[0].keyStats}</p>
              <div className="flex items-center space-x-2 mb-6">
                <Users className="w-3.5 h-3.5 text-zinc-500" />
                <span className="text-[12px] text-zinc-500 font-medium">{regions[0].population} population</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {regions[0].opportunities.map((opp) => (
                  <span key={opp} className={`text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${regions[0].colorScheme.badge}`}>{opp}</span>
                ))}
              </div>
            </div>

            {/* East Africa — Stacked Right Top */}
            {[regions[1], regions[2]].map((region) => (
              <div key={region.name} className={`region-card bg-gradient-to-br ${region.colorScheme.bg} border ${region.colorScheme.border} p-6 lg:p-7 rounded-sm`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`text-lg font-black ${region.colorScheme.text}`}>{region.name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${region.colorScheme.tag}`}>{region.gdp}</span>
                </div>
                <p className="text-zinc-400 text-[12px] font-medium mb-2">
                  <MapPin className="w-3 h-3 inline mr-1" />{region.anchor}
                </p>
                <p className="text-zinc-500 text-[13px] leading-relaxed mb-3">{region.keyStats}</p>
                <div className="flex items-center space-x-2 mb-4">
                  <Users className="w-3 h-3 text-zinc-600" />
                  <span className="text-[11px] text-zinc-500">{region.population}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {region.opportunities.map((opp) => (
                    <span key={opp} className="text-[10px] font-bold text-zinc-400 bg-zinc-800/80 px-2 py-1 rounded-full uppercase tracking-wider">{opp}</span>
                  ))}
                </div>
              </div>
            ))}

            {/* Northern + Southern — Bottom Row */}
            {[regions[3], regions[4]].map((region) => (
              <div key={region.name} className={`region-card bg-gradient-to-br ${region.colorScheme.bg} border ${region.colorScheme.border} p-6 lg:p-7 rounded-sm ${region.name === "Southern Africa" ? "md:col-span-2" : ""}`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`text-lg font-black ${region.colorScheme.text}`}>{region.name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${region.colorScheme.tag}`}>{region.gdp}</span>
                </div>
                <p className="text-zinc-400 text-[12px] font-medium mb-2">
                  <MapPin className="w-3 h-3 inline mr-1" />{region.anchor}
                </p>
                <p className="text-zinc-500 text-[13px] leading-relaxed mb-3">{region.keyStats}</p>
                <div className="flex items-center space-x-2 mb-4">
                  <Users className="w-3 h-3 text-zinc-600" />
                  <span className="text-[11px] text-zinc-500">{region.population}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {region.opportunities.map((opp) => (
                    <span key={opp} className="text-[10px] font-bold text-zinc-400 bg-zinc-800/80 px-2 py-1 rounded-full uppercase tracking-wider">{opp}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-zinc-500 text-[13px]">The Africa Investment Intelligence Map with country-level World Bank data is coming soon.</p>
          </div>
        </div>
      </section>

      {/* ── Tourism with African Pattern Background ── */}
      <section className="bg-zinc-950 py-24 border-b border-zinc-800/30 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.6'%3E%3Cpath d='M0 60h120M60 0v120'/%3E%3Cpath d='M30 0l30 30L30 60 0 30zM90 0l30 30L90 60 60 30zM30 60l30 30L30 120 0 90zM90 60l30 30L90 120 60 90z'/%3E%3Ccircle cx='60' cy='60' r='15'/%3E%3Ccircle cx='60' cy='60' r='8'/%3E%3Ccircle cx='0' cy='0' r='6'/%3E%3Ccircle cx='120' cy='0' r='6'/%3E%3Ccircle cx='0' cy='120' r='6'/%3E%3Ccircle cx='120' cy='120' r='6'/%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: "120px 120px" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/90 to-zinc-950/70" />
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div className="w-8 h-px bg-amber-500"></div>
              <span className="text-[11px] font-bold tracking-[0.2em] text-amber-400 uppercase">Sovereign Tourism</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-black text-white mb-6 whitespace-nowrap">Africa&apos;s $200 Billion Tourism Economy</h2>
            <p className="text-zinc-300 text-[15px] leading-relaxed mb-4">
              Tourism employs 24 million people across the continent and is growing at 5.1% annually — faster than the global average. From Kenya&apos;s safari corridors to Morocco&apos;s heritage cities to South Africa&apos;s wine country, Africa offers a tourism product that is both diverse and premium.
            </p>
            <p className="text-zinc-400 text-[14px] leading-relaxed mb-8">
              AfDEC is building bilateral tourism corridors between North Carolina and key African destinations. Our mandate: position African tourism operators for the U.S. market, and position NC hospitality enterprises for African visitor growth.
            </p>
            <div className="flex flex-row items-center gap-3 mb-8 flex-nowrap overflow-x-auto">
              <span className="text-[11px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full uppercase tracking-wider whitespace-nowrap">70M+ Int&apos;l Arrivals</span>
              <span className="text-[11px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full uppercase tracking-wider whitespace-nowrap">24M Tourism Jobs</span>
              <span className="text-[11px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full uppercase tracking-wider whitespace-nowrap">5.1% Annual Growth</span>
              <span className="text-[11px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full uppercase tracking-wider whitespace-nowrap">UNESCO Heritage Sites</span>
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
