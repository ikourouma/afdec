"use client";
// ─────────────────────────────────────────────────────────────────────────────
// /africa-intelligence — Flagship Full-Viewport Intelligence Terminal
// Fortune 5 product standard: Bloomberg-grade interactive map experience
// Future: white-label API licensing to partner organizations
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import Link from "next/link";
import { AfricaMap } from "@/components/sections/africa-map";
import { Footer } from "@/components/ui/footer";
import { Newsletter } from "@/components/ui/newsletter";
import { BrandLogo } from "@/components/ui/brand-logo";
import {
  Globe, ArrowLeft, ExternalLink, Database, Shield, Zap,
  TrendingUp, Building2, ChevronDown
} from "lucide-react";


const API_FEATURES = [
  { icon: Database, title: "Real-Time Data API",   body: "RESTful endpoints for country profiles, GDP data, FDI inflows, and sector intelligence updated from IMF and World Bank feeds." },
  { icon: Shield,   title: "Sovereign Security",   body: "Enterprise-grade authentication, audit logs, and role-based access control for institutional API consumers." },
  { icon: Zap,      title: "Embeddable Widget",    body: "White-label the intelligence map as a standalone widget — deployable on any partner or government organization's platform." },
  { icon: TrendingUp, title: "Analytics Dashboard", body: "Full admin dashboard with usage analytics, data refresh scheduling, and country profile management." },
];

export default function AfricaIntelligencePage() {
  const [showApiSection, setShowApiSection] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 font-sans selection:bg-blue-500/20">

      {/* ── Top Navigation Bar — Branded Terminal Style ── */}
      <nav className="sticky top-0 z-[100] bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800 px-6 lg:px-12">
        <div className="max-w-[1600px] mx-auto h-14 flex items-center justify-between">
          {/* Left: AfDEC Brand + back link */}
          <div className="flex items-center gap-5">
            <BrandLogo isDarkTheme={true} variant="full" />
            <div className="w-px h-5 bg-zinc-800 hidden sm:block" />
            <Link
              href="/why-africa"
              className="hidden sm:flex items-center gap-2 text-zinc-600 hover:text-zinc-300 transition-colors text-xs font-bold uppercase tracking-widest"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </Link>
            <div className="w-px h-5 bg-zinc-800" />
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-400" />
              <span className="text-white font-black text-sm tracking-tight">Africa Intelligence Terminal</span>
            </div>
          </div>

          {/* Center: live indicator */}
          <div className="flex items-center gap-2.5 absolute left-1/2 -translate-x-1/2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest hidden md:block">
              Live · Supabase Connected
            </span>
          </div>

          {/* Right: API access + partner CTA */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowApiSection(!showApiSection)}
              className="hidden sm:flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 transition-colors text-xs font-bold uppercase tracking-widest"
            >
              <Database className="w-3.5 h-3.5" />
              API Access
              <ChevronDown className={`w-3 h-3 transition-transform ${showApiSection ? "rotate-180" : ""}`} />
            </button>
            <Link
              href="/contact"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-black uppercase tracking-widest rounded-sm transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Request Access</span>
            </Link>
          </div>
        </div>

        {/* API Access Dropdown Panel */}
        {showApiSection && (
          <div className="border-t border-zinc-800 bg-zinc-900/95 backdrop-blur-md">
            <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {API_FEATURES.map((f) => {
                  const Icon = f.icon;
                  return (
                    <div key={f.title} className="flex gap-4">
                      <div className="w-8 h-8 bg-blue-600/10 rounded-lg flex items-center justify-center shrink-0 border border-blue-900/40">
                        <Icon className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-black text-xs mb-1">{f.title}</h4>
                        <p className="text-zinc-500 text-[11px] leading-relaxed">{f.body}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-4 border-t border-zinc-800 pt-6">
                <div className="flex-1">
                  <p className="text-zinc-400 text-xs font-medium">
                    The AfDEC Africa Intelligence API is available to institutional partners, government agencies, and approved organizations.
                    API licensing includes white-label rights for the interactive map widget.
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest rounded-sm transition-colors shrink-0"
                >
                  Request API Access
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ── Page Header — Briefing Style ── */}
      <section className="border-b border-zinc-800/50 bg-[#070707]">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Building2 className="w-4 h-4 text-zinc-600" />
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">AfDEC Intelligence Division</span>
                <div className="w-px h-3 bg-zinc-700" />
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Terminal v1.0</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2">
                Africa Investment & Market Intelligence Map
              </h1>
              <p className="text-zinc-500 text-sm font-medium max-w-2xl">
                Interactive sovereign intelligence across all 54 African nations — GDP, Foreign Direct Investment (FDI), sector data, and AfDEC market assessments. Powered by IMF 2026 projections and real-time Bridgedbs —{" "}
                <a href="https://www.afronovation.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-2">Afronovation, Inc</a>{" "}data infrastructure.
              </p>

            </div>
            <div className="flex items-center gap-4 shrink-0">
              <div className="text-center px-5 border-r border-zinc-800">
                <div className="text-2xl font-black text-blue-400">54</div>
                <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Nations</div>
              </div>
              <div className="text-center px-5 border-r border-zinc-800">
                <div className="text-2xl font-black text-emerald-400">5</div>
                <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Regions</div>
              </div>
              <div className="text-center px-5">
                <div className="text-2xl font-black text-amber-400">2026</div>
                <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">IMF Data</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Full Map — Flagship Display ── */}
      <section className="bg-zinc-950 py-10">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <AfricaMap />
        </div>
      </section>

      {/* ── API Roadmap / Future Hub Section ── */}
      <section className="bg-[#060606] border-t border-zinc-800/50 py-20">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="bg-gradient-to-br from-blue-950/30 to-zinc-900/40 border border-blue-900/20 rounded-xl p-10 md:p-14 relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-72 h-72 bg-blue-600/5 rounded-full blur-[100px]" />
            <div className="relative z-10 w-full">
              <div className="flex items-center gap-3 mb-6">
                <Database className="w-5 h-5 text-blue-400" />
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-widest">Intelligence API — Coming for Partners</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-4 tracking-tight">
                The AfDEC Africa Intelligence Map API
              </h2>
              <p className="text-zinc-400 text-base leading-relaxed mb-8 font-medium">
                AfDEC is building a licensed data intelligence infrastructure that partner organizations — government agencies, development banks, diaspora organizations, and institutional investors — can embed directly into their own platforms. The Africa Intelligence Map will become a sovereign-grade data product.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-10">
                {API_FEATURES.map((f) => {
                  const Icon = f.icon;
                  return (
                    <div key={f.title} className="flex flex-col bg-zinc-900/60 border border-zinc-800 rounded-lg p-5 h-full">
                      <Icon className="w-5 h-5 text-blue-400 mb-3 shrink-0" />
                      <h3 className="text-white font-black text-sm mb-2">{f.title}</h3>
                      <p className="text-zinc-500 text-[12px] leading-relaxed flex-1">{f.body}</p>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm uppercase tracking-widest rounded-sm transition-all shadow-lg group"
                >
                  Join the API Waitlist <ExternalLink className="w-4 h-4 ml-2" />
                </Link>
                <Link
                  href="/sectors"
                  className="inline-flex items-center justify-center px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-sm uppercase tracking-widest rounded-sm transition-all"
                >
                  Explore Sector Intelligence
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Newsletter />
      <Footer />
    </div>
  );
}
