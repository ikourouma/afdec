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
import { tourismPageData } from "@/lib/all-pages-data";
import { AfricaMapEmbed } from "@/components/sections/africa-map-embed";
import { MapTeaser } from "@/components/sections/africa-map-teaser";
import {
  ArrowRight, Heart, Briefcase, Globe, Map, Plane, Star,
  TrendingUp, Sun, Leaf, BarChart
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, React.ElementType> = {
  Heart, Briefcase, Globe, Map, Plane, Star, TrendingUp, Sun, Leaf, BarChart
};

// Pillar accent colors
const pillarAccent: Record<string, { text: string; bg: string; border: string; badge: string }> = {
  amber:   { text: "text-amber-400",   bg: "bg-amber-600/10",   border: "border-amber-500/30",   badge: "bg-amber-900/30 text-amber-300 border-amber-800/50" },
  blue:    { text: "text-blue-400",    bg: "bg-blue-600/10",    border: "border-blue-500/30",     badge: "bg-blue-900/30 text-blue-300 border-blue-800/50" },
  emerald: { text: "text-emerald-400", bg: "bg-emerald-600/10", border: "border-emerald-500/30",  badge: "bg-emerald-900/30 text-emerald-300 border-emerald-800/50" },
  purple:  { text: "text-purple-400",  bg: "bg-purple-600/10",  border: "border-purple-500/30",   badge: "bg-purple-900/30 text-purple-300 border-purple-800/50" },
};

const statusColor: Record<string, string> = {
  Active:  "bg-emerald-900/40 text-emerald-400 border-emerald-800/50",
  Growing: "bg-blue-900/40 text-blue-400 border-blue-800/50",
};

export default function TourismPage() {
  const heroRef = useRef(null);
  const page = tourismPageData;

  useGSAP(() => {
    gsap.fromTo(heroRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" });
    gsap.fromTo(".pillar-card",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.13, ease: "power2.out",
        scrollTrigger: { trigger: ".pillars-grid", start: "top 88%" } }
    );
    gsap.fromTo(".tourism-stat",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.09, ease: "power2.out",
        scrollTrigger: { trigger: ".stats-bar", start: "top 90%" } }
    );
    gsap.fromTo(".dest-card",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.10, ease: "power2.out",
        scrollTrigger: { trigger: ".destinations-grid", start: "top 88%" } }
    );
  }, { scope: undefined });

  // Extract sections from data
  const pillarsSection = page.sections.find((s) => s.type === "tourism_pillars");
  const statsSection   = page.sections.find((s) => s.type === "hero_stats");
  const destSection    = page.sections.find((s) => s.type === "pipeline_grid");
  const ctaSection     = page.sections.find((s) => s.type === "cta");

  return (
    <div className="min-h-screen bg-zinc-950 font-sans selection:bg-amber-500/20">
      <div className="sticky top-0 z-[100] w-full flex flex-col">
        <TopNav />
        <FlashBanner />
        <Header />
      </div>
      <Breadcrumb />

      {/* ── Cinematic Hero ── */}
      <section className="relative bg-zinc-950 border-b border-zinc-800/50 overflow-hidden min-h-[600px] flex items-center">
        {/* Background — African landscape */}
        <div
          className="absolute inset-0 opacity-[0.45]"
          style={{
            backgroundImage: `url('${page.hero_image}')`,
            backgroundSize: "cover",
            backgroundPosition: page.hero_image_position ?? "center",
          }}
        />
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.5'%3E%3Cpath d='M0 30h60M30 0v60'/%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: "60px 60px" }} />
        {/* Warm amber tint gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-zinc-950/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/20 via-transparent to-zinc-950" />
        {/* Warm glow */}
        <div className="absolute top-1/2 left-1/3 w-[600px] h-[400px] -translate-y-1/2 bg-amber-600/8 rounded-full blur-[120px]" />

        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-28 md:py-36 relative z-10 w-full" ref={heroRef}>
          <div className="flex items-center space-x-3 mb-8">
            <Plane className="w-5 h-5 text-amber-400" />
            <span className="text-[11px] font-black tracking-[0.25em] text-amber-400 uppercase">Sovereign Tourism</span>
          </div>

          <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-amber-800/50 bg-amber-900/30 text-amber-300 text-xs font-bold uppercase tracking-widest mb-8">
            Heritage · Business · Wellness · Diplomacy
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] max-w-4xl mb-6">
            Sovereign Tourism<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
              Africa Awaits You
            </span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 font-medium leading-relaxed max-w-2xl mb-12">
            {page.hero_subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-black text-sm uppercase tracking-widest rounded-sm transition-all shadow-lg group"
            >
              Plan Your Journey <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/why-nc"
              className="inline-flex items-center px-8 py-4 bg-zinc-800/80 hover:bg-zinc-700 text-white font-bold text-sm uppercase tracking-widest rounded-sm transition-all backdrop-blur-sm"
            >
              Why Choose North Carolina
            </Link>
          </div>
        </div>
      </section>

      {/* ── Four Tourism Pillars ── */}
      {pillarsSection && (
        <section className="bg-zinc-950 py-24 border-b border-zinc-800/30">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
            <div className="mb-16">
              <div className="inline-flex items-center space-x-2 mb-4">
                <div className="w-8 h-px bg-amber-500" />
                <span className="text-[11px] font-bold tracking-[0.2em] text-amber-400 uppercase">Why Travel with AfDEC</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">{pillarsSection.data.heading}</h2>
              <p className="text-zinc-400 max-w-2xl text-[15px] leading-relaxed">{pillarsSection.data.body}</p>
            </div>

            <div className="pillars-grid grid grid-cols-1 md:grid-cols-2 gap-6">
              {pillarsSection.data.pillars.map((pillar: any, i: number) => {
                const Icon = iconMap[pillar.icon] ?? Globe;
                const ac = pillarAccent[pillar.accent] ?? pillarAccent.amber;
                return (
                  <div key={i} className={`pillar-card bg-zinc-900/50 border ${ac.border} rounded-lg p-8 transition-all duration-300 hover:bg-zinc-900/80`}>
                    <div className={`w-12 h-12 ${ac.bg} rounded-lg flex items-center justify-center mb-6 border ${ac.border}`}>
                      <Icon className={`w-6 h-6 ${ac.text}`} />
                    </div>
                    <h3 className={`text-xl font-black text-white mb-4 ${ac.text}`}>{pillar.title}</h3>
                    <p className="text-zinc-400 text-[14px] leading-relaxed font-medium mb-6">{pillar.body}</p>
                    {/* Mini stats */}
                    <div className="grid grid-cols-2 gap-3">
                      {pillar.stats.map((s: { value: string; label: string }, j: number) => (
                        <div key={j} className={`${ac.bg} rounded-lg p-3 border ${ac.border}`}>
                          <div className={`text-lg font-black ${ac.text} mb-0.5`}>{s.value}</div>
                          <div className="text-zinc-500 text-[11px] font-medium">{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Stats Bar ── */}
      {statsSection && (
        <section className="bg-zinc-900/40 border-b border-zinc-800/50">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
            <div className="stats-bar grid grid-cols-2 md:grid-cols-4 divide-x divide-zinc-800/50">
              {statsSection.data.stats.map((s: { value: string; label: string; sub: string }, i: number) => (
                <div key={i} className="tourism-stat px-8 py-8 text-center">
                  <div className="text-3xl md:text-4xl font-black text-amber-400 mb-1">{s.value}</div>
                  <div className="text-white font-bold text-sm mb-0.5">{s.label}</div>
                  <div className="text-zinc-600 text-xs font-medium">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── AfDEC-Endorsed Destinations ── */}
      {destSection && (
        <section className="bg-[#080808] py-24 border-b border-zinc-800/30">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
            <div className="mb-16">
              <div className="inline-flex items-center space-x-2 mb-4">
                <div className="w-8 h-px bg-amber-500" />
                <span className="text-[11px] font-bold tracking-[0.2em] text-amber-400 uppercase">Destinations</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">{destSection.data.heading}</h2>
              <p className="text-zinc-400 max-w-2xl text-[15px] leading-relaxed">{destSection.data.body}</p>
            </div>
            <div className="destinations-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {destSection.data.items.map((item: any, i: number) => {
                const Icon = iconMap[item.icon] ?? Globe;
                return (
                  <div key={i} className="dest-card bg-zinc-900/50 border border-zinc-800 hover:border-amber-500/30 rounded-lg p-6 transition-all duration-300 group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 bg-amber-600/10 rounded-lg flex items-center justify-center shrink-0 border border-amber-500/20">
                        <Icon className="w-5 h-5 text-amber-400" />
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${statusColor[item.status] ?? statusColor.Growing}`}>
                        {item.status}
                      </span>
                    </div>
                    <h3 className="font-black text-white mb-1 group-hover:text-amber-400 transition-colors">{item.title}</h3>
                    <p className="text-xs text-zinc-500 font-medium mb-3">{item.sub}</p>
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3 h-3 text-amber-600/60" />
                      <span className="text-[10px] text-zinc-600 font-medium">{item.markets}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      {ctaSection && (
        <section className="bg-zinc-950 py-24">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
            <div className="bg-zinc-900/60 border border-amber-900/30 rounded-lg p-12 md:p-16 relative overflow-hidden">
              <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full bg-amber-600/6 blur-[100px]" />
              <div className="relative z-10 max-w-3xl">
                <div className="inline-flex items-center space-x-2 mb-6">
                  <Plane className="w-5 h-5 text-amber-400" />
                  <span className="text-[11px] font-bold tracking-[0.2em] text-amber-400 uppercase">Plan Your Journey</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-6">{ctaSection.data.heading}</h2>
                <p className="text-zinc-400 text-lg leading-relaxed mb-10">{ctaSection.data.body}</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href={ctaSection.data.primary_href} className="inline-flex items-center justify-center px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-black text-sm uppercase tracking-widest rounded-sm transition-all shadow-lg group">
                    {ctaSection.data.primary_label} <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href={ctaSection.data.secondary_href} className="inline-flex items-center justify-center px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-sm uppercase tracking-widest rounded-sm transition-all">
                    {ctaSection.data.secondary_label}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <MapTeaser
        heading="Discover Your African Destination"
        subtext="Live economic and cultural intelligence for all 54 African nations — heritage sites, business hubs, wellness retreats, and diaspora landmarks, sourced from official tourism data."
        ctaLabel="Explore the Africa Map"
        accentColor="amber"
      />

      <Newsletter />
      <Footer />
    </div>
  );
}
