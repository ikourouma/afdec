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
import { sectorList } from "@/lib/all-pages-data";
import { MapTeaser } from "@/components/sections/africa-map-teaser";
import { ArrowRight, Leaf, Zap, Heart, TrendingUp, BarChart, Shield, Globe, Building2 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const accentColors: Record<string, { text: string; bgFrom: string; border: string; badge: string }> = {
  green:   { text: "text-emerald-400", bgFrom: "from-emerald-600/10", border: "border-emerald-500/30", badge: "bg-emerald-900/30 text-emerald-300 border-emerald-800/50" },
  emerald: { text: "text-emerald-400", bgFrom: "from-emerald-600/10", border: "border-emerald-500/30", badge: "bg-emerald-900/30 text-emerald-300 border-emerald-800/50" },
  blue:    { text: "text-blue-400",    bgFrom: "from-blue-600/10",    border: "border-blue-500/30",    badge: "bg-blue-900/30 text-blue-300 border-blue-800/50" },
  amber:   { text: "text-amber-400",   bgFrom: "from-amber-600/10",   border: "border-amber-500/30",   badge: "bg-amber-900/30 text-amber-300 border-amber-800/50" },
  purple:  { text: "text-purple-400",  bgFrom: "from-purple-600/10",  border: "border-purple-500/30",  badge: "bg-purple-900/30 text-purple-300 border-purple-800/50" },
  red:     { text: "text-red-400",     bgFrom: "from-red-600/10",     border: "border-red-500/30",     badge: "bg-red-900/30 text-red-300 border-red-800/50" },
};

const sectorIcons: Record<string, React.ElementType> = {
  agriculture: Leaf,
  "clean-energy": Zap,
  "life-sciences": Heart,
  manufacturing: TrendingUp,
  fintech: BarChart,
  defense: Shield,
};

const sectorsStats = [
  { value: "$104.9B", label: "US–Africa Trade", sub: "Annual value, 2024 (USTR)", color: "text-blue-400" },
  { value: "6",       label: "Core Sectors",    sub: "NC–Africa focus areas",      color: "text-emerald-400" },
  { value: "54",      label: "African Markets", sub: "Across all sectors",          color: "text-amber-400" },
  { value: "1.4B",    label: "Population",      sub: "Youngest workforce on earth", color: "text-purple-400" },
];

export default function SectorsHubPage() {
  const heroRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(heroRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" });
    gsap.fromTo(".sector-card",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.10, ease: "power2.out",
        scrollTrigger: { trigger: ".sectors-grid", start: "top 88%" } }
    );
    gsap.fromTo(".sector-stat",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.09, ease: "power2.out",
        scrollTrigger: { trigger: ".stats-bar", start: "top 90%" } }
    );
  }, { scope: undefined });

  return (
    <main className="min-h-screen bg-zinc-950 font-sans selection:bg-blue-500/30">
      <div className="sticky top-0 z-[100] w-full flex flex-col">
        <TopNav />
        <FlashBanner />
        <Header />
      </div>
      <Breadcrumb />

      {/* ── Hero ── */}
      <section className="relative bg-zinc-950 border-b border-zinc-800/50 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.3]"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center bottom",
          }}
        />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.5'%3E%3Cpath d='M0 30h60M30 0v60'/%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: "60px 60px" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/90 to-zinc-950/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-zinc-950" />

        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-28 md:py-36 relative z-10" ref={heroRef}>
          <div className="flex items-center space-x-3 mb-8">
            <Building2 className="w-5 h-5 text-blue-400" />
            <span className="text-[11px] font-black tracking-[0.25em] text-blue-400 uppercase">Sector Intelligence</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] max-w-5xl mb-6">
            Where NC Expertise<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              Meets African Demand
            </span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 font-medium leading-relaxed max-w-3xl mb-12">
            North Carolina leads America in pharmaceuticals, aerospace, clean energy, and financial technology. Africa leads the world in growth. AfDEC identifies exactly where these two strengths intersect — and opens the door.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/contact" className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm uppercase tracking-widest rounded-sm transition-all shadow-lg group">
              Find Your Sector <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/corridor" className="inline-flex items-center px-8 py-4 bg-zinc-800/80 hover:bg-zinc-700 text-white font-bold text-sm uppercase tracking-widest rounded-sm transition-all">
              Trade Corridor Programs
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-zinc-900/40 border-b border-zinc-800/50">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="stats-bar grid grid-cols-2 md:grid-cols-4 divide-x divide-zinc-800/50">
            {sectorsStats.map((s) => (
              <div key={s.label} className="sector-stat px-8 py-7 text-center">
                <div className={`text-3xl md:text-4xl font-black mb-1 ${s.color}`}>{s.value}</div>
                <div className="text-white font-bold text-sm mb-0.5">{s.label}</div>
                <div className="text-zinc-600 text-xs font-medium">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Six Sector Cards ── */}
      <section className="bg-zinc-950 py-24 border-b border-zinc-800/30">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div className="w-8 h-px bg-blue-500" />
              <span className="text-[11px] font-bold tracking-[0.2em] text-blue-400 uppercase">Core Sectors</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Six Sectors, One Corridor</h2>
            <p className="text-zinc-400 max-w-2xl text-[15px] leading-relaxed">
              Each sector page contains vetted market data, NC-specific export strengths, active buyer profiles, and AfDEC program pathways — all sourced from USTR, AfDB, World Bank, and NC Commerce Department.
            </p>
          </div>

          <div className="sectors-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sectorList.map((sector) => {
              const colors = accentColors[sector.accent] ?? accentColors.blue;
              const Icon = sectorIcons[sector.slug] ?? Globe;
              return (
                <Link
                  key={sector.slug}
                  href={`/sectors/${sector.slug}`}
                  className={`sector-card group relative bg-gradient-to-br ${colors.bgFrom} to-zinc-900/40 border ${colors.border} rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.015] hover:shadow-xl hover:shadow-black/40`}
                >
                  <div
                    className="absolute inset-0 opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-500"
                    style={{ backgroundImage: `url('${sector.hero_image}')`, backgroundSize: "cover", backgroundPosition: sector.hero_image_position ?? "center" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/50 to-transparent" />
                  <div className="relative z-10 p-8 flex flex-col min-h-[260px]">
                    <div className={`w-11 h-11 ${colors.bgFrom.replace("from-", "bg-").replace("/10", "/20")} rounded-lg flex items-center justify-center mb-5 border ${colors.border}`}>
                      <Icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-widest mb-4 w-fit ${colors.badge}`}>
                      {sector.tag}
                    </div>
                    <h3 className={`text-lg font-black text-white mb-2 group-hover:${colors.text} transition-colors`}>{sector.label}</h3>
                    <p className="text-zinc-500 text-[13px] leading-relaxed font-medium flex-1 line-clamp-2">
                      {sector.hero_subtitle.split("—")[0].trim()}
                    </p>
                    <div className={`flex items-center gap-2 mt-5 ${colors.text} text-[11px] font-black uppercase tracking-widest`}>
                      <span>Explore Sector</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Map Teaser ── */}
      <MapTeaser
        heading="Where Does Your Sector Fit Across Africa?"
        subtext="Live economic intelligence for all 54 African nations — identify which markets have the highest demand for your sector's products and services."
        ctaLabel="Open Africa Intelligence Terminal"
        accentColor="blue"
      />

      {/* ── Final CTA ── */}
      <section className="bg-[#080808] py-24">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="bg-zinc-900/60 border border-blue-900/30 rounded-lg p-12 md:p-16 relative overflow-hidden">
            <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full bg-blue-600/6 blur-[100px]" />
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center space-x-2 mb-6">
                <Building2 className="w-5 h-5 text-blue-400" />
                <span className="text-[11px] font-bold tracking-[0.2em] text-blue-400 uppercase">Not Sure Which Sector?</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
                Let AfDEC Match Your Business to the Right African Opportunity
              </h2>
              <p className="text-zinc-400 text-lg leading-relaxed mb-10">
                Schedule a free 30-minute sector assessment with an AfDEC trade advisor. We will map your company&apos;s strengths against current African market demand and identify your highest-probability entry point.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact" className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm uppercase tracking-widest rounded-sm transition-all shadow-lg group">
                  Book a Free Sector Assessment <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/invest" className="inline-flex items-center justify-center px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-sm uppercase tracking-widest rounded-sm transition-all">
                  Become an AfDEC Member
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
