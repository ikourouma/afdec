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
import { corridorList } from "@/lib/corridor-data";
import { AfricaMapEmbed } from "@/components/sections/africa-map-embed";
import { MapTeaser } from "@/components/sections/africa-map-teaser";
import {
  ArrowRight, Globe, TrendingUp, Handshake, Award, BarChart,
  ShieldCheck, Network, Zap, ExternalLink
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const accentColors: Record<string, { text: string; bg: string; border: string; badge: string }> = {
  blue:    { text: "text-blue-400",    bg: "from-blue-600/10",    border: "border-blue-500/30",    badge: "bg-blue-900/30 text-blue-300 border-blue-800/50" },
  amber:   { text: "text-amber-400",   bg: "from-amber-600/10",   border: "border-amber-500/30",   badge: "bg-amber-900/30 text-amber-300 border-amber-800/50" },
  emerald: { text: "text-emerald-400", bg: "from-emerald-600/10", border: "border-emerald-500/30", badge: "bg-emerald-900/30 text-emerald-300 border-emerald-800/50" },
  purple:  { text: "text-purple-400",  bg: "from-purple-600/10",  border: "border-purple-500/30",  badge: "bg-purple-900/30 text-purple-300 border-purple-800/50" },
};

const corridorStats = [
  { value: "$2.1B", label: "Annual Trade Volume", sub: "NC–Africa corridor", icon: TrendingUp, color: "text-blue-400" },
  { value: "54",    label: "Sovereign Markets",   sub: "Active bilateral coverage", icon: Globe,      color: "text-emerald-400" },
  { value: "$600B+",label: "Gov't Procurement",   sub: "African public sector p.a.", icon: Award,   color: "text-amber-400" },
  { value: "$108B", label: "Infrastructure Gap",  sub: "AfDB annual estimate",  icon: Zap,           color: "text-purple-400" },
];

const iconMap: Record<string, React.ElementType> = {
  Globe, TrendingUp, Handshake, Award, BarChart, ShieldCheck, Network, Zap, ArrowRight
};

export default function CorridorHubPage() {
  const heroRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(heroRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" });
    gsap.fromTo(".corridor-card", { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power2.out",
        scrollTrigger: { trigger: ".corridor-grid", start: "top 88%" } }
    );
    gsap.fromTo(".hub-stat", { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.09, ease: "power2.out",
        scrollTrigger: { trigger: ".stats-row", start: "top 90%" } }
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

      {/* ── Cinematic Hero ── */}
      <section className="relative bg-zinc-950 border-b border-zinc-800/50 overflow-hidden">
        {/* Background layers */}
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2684&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* World map grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.5'%3E%3Cpath d='M0 40h80M40 0v80'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "80px 80px"
        }} />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/90 to-zinc-950/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-zinc-950" />
        {/* Accent glow */}
        <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] -translate-y-1/2 bg-blue-600/5 rounded-full blur-[120px]" />

        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-28 md:py-36 relative z-10" ref={heroRef}>
          {/* Eyebrow */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-px bg-blue-500" />
            <span className="text-[11px] font-black tracking-[0.25em] text-blue-400 uppercase">Transatlantic Integration</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] max-w-5xl mb-6">
            The NC–Africa<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">
              Transatlantic Corridor
            </span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 font-medium leading-relaxed max-w-3xl mb-12">
            A sovereign-grade bilateral integration framework — connecting North Carolina&apos;s $680 billion economy to 54 African markets through trade architecture, procurement access, institutional investment, and infrastructure development.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm uppercase tracking-widest rounded-sm transition-all shadow-lg group"
            >
              Engage the Corridor <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/africa-intelligence"
              className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-800/80 hover:bg-zinc-700 text-white font-bold text-sm uppercase tracking-widest rounded-sm transition-all backdrop-blur-sm group"
            >
              {/* Blinking live dot */}
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Africa Intelligence Map
              <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-60" />
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center px-8 py-4 bg-zinc-800/40 hover:bg-zinc-700/60 text-zinc-400 hover:text-white font-bold text-sm uppercase tracking-widest rounded-sm transition-all"
            >
              View Trade Events
            </Link>
          </div>
        </div>
      </section>

      {/* ── Corridor Statistics Bar ── */}
      <section className="bg-zinc-900/40 border-b border-zinc-800/50">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="stats-row grid grid-cols-2 md:grid-cols-4 divide-x divide-zinc-800/50">
            {corridorStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="hub-stat px-8 py-8 text-center">
                  <Icon className={`w-5 h-5 ${stat.color} mx-auto mb-3`} />
                  <div className={`text-3xl md:text-4xl font-black ${stat.color} mb-1`}>{stat.value}</div>
                  <div className="text-white font-bold text-sm mb-0.5">{stat.label}</div>
                  <div className="text-zinc-600 text-xs font-medium">{stat.sub}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Four Corridor Programs ── */}
      <section className="bg-zinc-950 py-24 border-b border-zinc-800/30">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div className="w-8 h-px bg-blue-500" />
              <span className="text-[11px] font-bold tracking-[0.2em] text-blue-400 uppercase">Corridor Programs</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Four Integration Pillars</h2>
            <p className="text-zinc-400 max-w-2xl text-[15px] leading-relaxed">
              Each corridor program addresses a distinct dimension of transatlantic integration — from commercial trade to sovereign capital deployment.
            </p>
          </div>

          <div className="corridor-grid grid grid-cols-1 md:grid-cols-2 gap-6">
            {corridorList.map((program, idx) => {
              const colors = accentColors[program.accent] ?? accentColors.blue;
              const isLarge = idx === 0;
              return (
                <Link
                  key={program.slug}
                  href={`/corridor/${program.slug}`}
                  className={`corridor-card group relative bg-gradient-to-br ${colors.bg} to-zinc-900/40 border ${colors.border} rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:shadow-black/40 ${isLarge ? "md:row-span-1" : ""}`}
                >
                  {/* Background image — subtle */}
                  <div
                    className="absolute inset-0 opacity-[0.08] group-hover:opacity-[0.14] transition-opacity duration-500"
                    style={{
                      backgroundImage: `url('${program.hero_image}')`,
                      backgroundSize: "cover",
                      backgroundPosition: program.hero_image_position ?? "center",
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/60 to-transparent" />

                  <div className="relative z-10 p-8 lg:p-10 flex flex-col h-full min-h-[280px]">
                    {/* Tag */}
                    <div className={`inline-flex items-center px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest mb-6 w-fit ${colors.badge}`}>
                      {program.tag}
                    </div>

                    {/* Title */}
                    <h3 className={`text-xl lg:text-2xl font-black text-white mb-3 group-hover:${colors.text} transition-colors duration-200`}>
                      {program.label}
                    </h3>

                    {/* Subtitle — truncated */}
                    <p className="text-zinc-400 text-[14px] leading-relaxed font-medium flex-1 line-clamp-3">
                      {program.hero_subtitle}
                    </p>

                    {/* CTA */}
                    <div className={`flex items-center gap-2 mt-6 ${colors.text} text-xs font-black uppercase tracking-widest`}>
                      <span>Explore Program</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="bg-[#080808] py-24 border-b border-zinc-800/30">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div className="w-8 h-px bg-zinc-500" />
              <span className="text-[11px] font-bold tracking-[0.2em] text-zinc-500 uppercase">Process</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white">How the Corridor Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Apply & Qualify", body: "Submit your enterprise profile. AfDEC conducts a 72-hour institutional review to qualify your organization for corridor participation.", color: "text-blue-400" },
              { step: "02", title: "Match & Certify", body: "Receive your AfDEC Corridor Certification and be matched with verified counterparts in your target markets across all 54 nations.", color: "text-emerald-400" },
              { step: "03", title: "Deal Facilitation", body: "AfDEC's sovereign deal desk supports documentation, compliance, and negotiation through your first bilateral transaction.", color: "text-amber-400" },
              { step: "04", title: "Scale & Report", body: "Access ongoing deal flow, trade intelligence briefings, and quarterly bilateral summits to scale your transatlantic enterprise.", color: "text-purple-400" },
            ].map((step) => (
              <div key={step.step} className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-8">
                <div className={`text-5xl font-black ${step.color} opacity-30 mb-4 font-mono`}>{step.step}</div>
                <h3 className="text-white font-black text-lg mb-3">{step.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed font-medium">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Africa Intelligence Map Teaser ── */}
      <MapTeaser
        heading="54 African Markets. Live Economic Intelligence."
        subtext="Explore GDP data, sector activity, and AfDEC priority markets for every African nation in the corridor. Click any country for a full intelligence brief."
        accentColor="blue"
      />

      {/* ── Final CTA ── */}
      <section className="bg-zinc-950 py-24">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="bg-zinc-900/60 border border-blue-900/30 rounded-lg p-12 md:p-16 relative overflow-hidden">
            <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full bg-blue-600/8 blur-[80px]" />
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center space-x-2 mb-6">
                <Handshake className="w-5 h-5 text-blue-400" />
                <span className="text-[11px] font-bold tracking-[0.2em] text-blue-400 uppercase">Engage the Corridor</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-6">
                Ready to Build Your Transatlantic Enterprise?
              </h2>
              <p className="text-zinc-400 text-lg leading-relaxed mb-10 font-medium">
                Whether you are a NC exporter seeking African buyers, an investor structuring a bilateral fund, or a government agency pursuing EPC contractors — the AfDEC Corridor is your institutional gateway.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact" className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm uppercase tracking-widest rounded-sm transition-all shadow-lg group">
                  Schedule a Corridor Briefing <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
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
