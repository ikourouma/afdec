"use client";

import React from "react";
import Link from "next/link";
import { TopNav } from "@/components/ui/top-nav";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Newsletter } from "@/components/ui/newsletter";
import { FlashBanner } from "@/components/ui/flash-banner";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  Database, Globe, BarChart2, TrendingUp, Lock, Zap, ArrowRight, Bell
} from "lucide-react";

const COMING_FEATURES = [
  {
    icon: Globe,
    title: "Diaspora Demographics",
    body: "Real-time mapping of African diaspora communities across NC counties — population estimates, origin countries, sector concentrations, and economic contribution data.",
    color: "text-blue-400",
    bg: "bg-blue-950/40 border-blue-900/30",
  },
  {
    icon: BarChart2,
    title: "Remittance Flow Analytics",
    body: "Track bilateral remittance data between NC and African nations — volumes, corridors, transfer platforms, and year-on-year trend analysis.",
    color: "text-emerald-400",
    bg: "bg-emerald-950/40 border-emerald-900/30",
  },
  {
    icon: TrendingUp,
    title: "Diaspora Business Intelligence",
    body: "Directory and intelligence on African diaspora-led enterprises in North Carolina — sector breakdown, revenue bands, employment, and AfDEC engagement status.",
    color: "text-purple-400",
    bg: "bg-purple-950/40 border-purple-900/30",
  },
  {
    icon: Database,
    title: "Investment Pipeline Tracker",
    body: "Live tracker of NC-Africa cross-border investment tickets in the AfDEC pipeline — stage, sector, country, and capital deployment timeline.",
    color: "text-amber-400",
    bg: "bg-amber-950/40 border-amber-900/30",
  },
];

export default function DataTerminalComingSoonPage() {
  return (
    <main className="min-h-screen bg-zinc-950 font-sans selection:bg-blue-500/30 selection:text-blue-200">
      <div className="sticky top-0 z-[100] w-full flex flex-col" data-nav-id="main-nav">
        <TopNav />
        <FlashBanner />
        <Header />
      </div>
      <Breadcrumb />

      {/* ── Hero ── */}
      <section className="relative bg-zinc-950 overflow-hidden min-h-[60vh] flex items-center border-b border-zinc-800/50">
        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.5'%3E%3Cpath d='M0 30h60M30 0v60'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }} />
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/5 rounded-full blur-[120px]" />

        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-28 relative z-10 w-full">
          <div className="max-w-3xl">
            {/* Terminal badge */}
            <div className="inline-flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 px-4 py-2 rounded-full mb-8 backdrop-blur-md">
              <Database className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[11px] font-bold tracking-[0.2em] text-zinc-400 uppercase">AfDEC Insights Division · Data Terminal</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] mb-6">
              Diaspora Data<br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                Terminal
              </span>
            </h1>

            <p className="text-xl text-zinc-400 leading-relaxed mb-6 font-medium">
              A live intelligence dashboard tracking the African diaspora economy across North Carolina — remittance flows, enterprise data, investment pipelines, and community demographics.
            </p>

            {/* Status badge */}
            <div className="inline-flex items-center gap-3 bg-zinc-900/60 border border-zinc-700/40 rounded-sm px-5 py-3 mb-10">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                </span>
                <span className="text-amber-400 text-xs font-black uppercase tracking-widest">In Development</span>
              </div>
              <div className="w-px h-4 bg-zinc-700" />
              <span className="text-zinc-500 text-xs font-medium">Launching to AfDEC Partners — Q3 2026</span>
            </div>

            {/* Notify CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold tracking-widest uppercase px-8 py-4 rounded-sm transition-all">
                <Bell className="w-4 h-4" />
                Notify Me at Launch
              </Link>
              <Link href="/africa-intelligence" className="inline-flex items-center gap-2 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-sm font-bold tracking-widest uppercase px-8 py-4 rounded-sm transition-all">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500" />
                </span>
                Live Africa Intelligence Map
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      </section>

      {/* ── What's Coming ── */}
      <section className="bg-[#080808] py-24 border-b border-zinc-800/30">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="mb-14">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-px bg-blue-500" />
              <span className="text-[11px] font-bold tracking-[0.2em] text-blue-400 uppercase">Preview</span>
            </div>
            <h2 className="text-3xl font-black text-white">What's Inside the Data Terminal</h2>
            <p className="text-zinc-400 text-[15px] mt-3 max-w-2xl">
              Four live data products — built on AfDEC's proprietary diaspora economy data infrastructure in partnership with Bridgedbs / Afronovation, Inc.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {COMING_FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className={`relative flex gap-5 p-7 rounded-xl border ${f.bg} overflow-hidden`}>
                  {/* Coming soon badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-zinc-900/60 border border-zinc-700/40 px-2 py-0.5 rounded-full">
                    <Lock className="w-2.5 h-2.5 text-zinc-500" />
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Q3 2026</span>
                  </div>
                  <div className={`w-10 h-10 rounded-sm flex items-center justify-center shrink-0 bg-zinc-900/60 border border-zinc-800`}>
                    <Icon className={`w-5 h-5 ${f.color}`} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base mb-2">{f.title}</h3>
                    <p className="text-zinc-400 text-[13px] leading-relaxed">{f.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Access CTA ── */}
      <section className="bg-zinc-950 py-24">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="bg-gradient-to-br from-blue-950/20 to-zinc-900/40 border border-blue-900/20 rounded-xl p-10 md:p-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03]"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.5'%3E%3Cpath d='M0 20h40M20 0v40'/%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: "40px 40px" }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px]" />
            <div className="relative z-10">
              <Zap className="w-8 h-8 text-blue-400 mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-black text-white mb-4">Request Early Access</h2>
              <p className="text-zinc-400 text-[15px] max-w-xl mx-auto mb-8 leading-relaxed">
                AfDEC institutional members, government partners, and accredited research organizations can request early access to the Diaspora Data Terminal beta program launching Q3 2026.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold tracking-widest uppercase px-8 py-4 rounded-sm transition-all">
                  Request Early Access
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/insights" className="inline-flex items-center justify-center gap-2 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-sm font-bold tracking-widest uppercase px-8 py-4 rounded-sm transition-all">
                  Browse Insights
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
