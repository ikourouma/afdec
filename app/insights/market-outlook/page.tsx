"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { TopNav } from "@/components/ui/top-nav";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Newsletter } from "@/components/ui/newsletter";
import { FlashBanner } from "@/components/ui/flash-banner";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { SectionNav, type NavSection } from "@/components/ui/section-nav";
import { supabase } from "@/lib/supabase";
import {
  TrendingUp, Download, ArrowRight, Calendar, Clock,
  Globe, ChevronRight, Tag, BarChart3, ExternalLink
} from "lucide-react";

type Article = {
  id: string;
  slug: string;
  category: string;
  content_type: string;
  title: string;
  subtitle?: string;
  excerpt?: string;
  cover_image_url?: string;
  reading_time_min?: number;
  published_at: string;
  is_featured: boolean;
  allow_download: boolean;
  download_url?: string;
  download_label?: string;
  view_count: number;
  author_name?: string;
  tags?: string[];
};

const PAGE_SECTIONS: NavSection[] = [
  { id: "overview", label: "Overview" },
  { id: "latest", label: "Latest Issue" },
  { id: "sectors", label: "Sector Briefs" },
  { id: "subscribe", label: "Subscribe" },
];

// ── Quarterly issue data (editorial calendar) ──────────────────────────────
const EDITORIAL_CALENDAR = [
  { quarter: "Q1 2026", period: "Jan – Mar 2026", status: "published",  theme: "East Africa Growth & FDI Acceleration" },
  { quarter: "Q2 2026", period: "Apr – Jun 2026", status: "upcoming",   theme: "West Africa Digital Economy & Fintech" },
  { quarter: "Q3 2026", period: "Jul – Sep 2026", status: "upcoming",   theme: "North Africa Infrastructure & Energy" },
  { quarter: "Q4 2026", period: "Oct – Dec 2026", status: "upcoming",   theme: "Southern Africa Critical Minerals & EV" },
];

const MOCK_MARKET: Article[] = [
  {
    id: "2", slug: "transatlantic-market-outlook-q1-2026", category: "market-outlook", content_type: "report",
    title: "Transatlantic Market Outlook: Q1 2026",
    subtitle: "GDP projections, FDI flows, and sector intelligence across all five African economic regions",
    excerpt: "AfDEC's flagship quarterly market intelligence report covering GDP growth trajectories, foreign direct investment inflows, and emerging sector opportunities across North Africa, West Africa, East Africa, Central Africa, and Southern Africa. IMF 2026 projections baseline with AfDEC sector weighting.",
    cover_image_url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200&auto=format&fit=crop",
    reading_time_min: 18, published_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    is_featured: true, allow_download: true, download_label: "Download Q1 2026 Full Report (42 pages)",
    view_count: 2891, author_name: "AfDEC Intelligence Desk",
    tags: ["Q1 2026", "Market Outlook", "FDI", "GDP", "Pan-African"],
  },
];

// ── Key Metrics from the Q1 2026 Report ──────────────────────────────────────
const Q1_METRICS = [
  { label: "Average African GDP Growth",     value: "+4.8%",  context: "2026 IMF Projection",   color: "text-emerald-400" },
  { label: "Total African FDI Inflows",      value: "$83.2B", context: "2026 Estimate",          color: "text-blue-400" },
  { label: "NC–Africa Trade Volume",         value: "$2.4B",  context: "2025 Bilateral Actual",  color: "text-amber-400" },
  { label: "AfCFTA Active Members",          value: "47",     context: "Tariff-Eliminating States", color: "text-purple-400" },
];

// ── 4 High-Impact Sector Briefs (quarterly) ────────────────────────────────
const SECTOR_BRIEFS = [
  {
    emoji: "🌾",
    label: "Agriculture & Farming",
    accent: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", hoverBorder: "hover:border-emerald-900/40", header: "from-emerald-950/60" },
    description: "Smallholder access, agritech adoption, NC export corridors, and AfDB agri-fund alignment.",
    q1: { title: "West Africa Smallholder Tech Adoption & NC AgriExport Opportunity Assessment", slug: "agriculture-q1-2026" },
    q2: { title: "East Africa Irrigation Infrastructure & NC Equipment Export Market" },
  },
  {
    emoji: "🏭",
    label: "Advanced Manufacturing",
    accent: { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", hoverBorder: "hover:border-blue-900/40", header: "from-blue-950/60" },
    description: "NC industrial base meets Africa's manufacturing ambitions — SEZs, AfCFTA supply chains, and FDI flows.",
    q1: { title: "Morocco & Egypt Automotive SEZ — NC Tier 1 Supplier Entry Market Assessment", slug: "manufacturing-q1-2026" },
    q2: { title: "Sub-Saharan Africa Critical Minerals Processing & NC Advanced Mfg. Corridor" },
  },
  {
    emoji: "⚡",
    label: "Innovation & Technology",
    accent: { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", hoverBorder: "hover:border-purple-900/40", header: "from-purple-950/60" },
    description: "Silicon Savannah meets Research Triangle — fintech, AI, and deep-tech bilateral corridor mapping.",
    q1: { title: "Kenya-Nigeria-Ghana Tech Hub Ecosystem: Investment & Partnership Map for NC Deep-Tech", slug: "innovation-q1-2026" },
    q2: { title: "AI & Sovereign Data Infrastructure — Africa Regulatory Landscape for NC Cloud Cos." },
  },
  {
    emoji: "🛡️",
    label: "Defense & Security Tech",
    accent: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", hoverBorder: "hover:border-amber-900/40", header: "from-amber-950/60" },
    description: "African security architectures, AU peacekeeping procurement, and NC defense corridor opportunities.",
    q1: { title: "AU Peacekeeping Tech Procurement 2026 — NC Defense Sector Entry Points & Compliance Framework", slug: "defense-q1-2026" },
    q2: { title: "Cybersecurity & Surveillance Tech: East Africa Government Procurement for NC Vendors" },
  },
];

export default function MarketOutlookPage() {
  const [featured, setFeatured] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabase
          .from("v_published_articles")
          .select("*")
          .eq("category", "market-outlook")
          .eq("is_featured", true)
          .order("published_at", { ascending: false })
          .limit(1);
        setFeatured(data && data.length > 0 ? (data[0] as Article) : MOCK_MARKET[0]);
      } catch {
        setFeatured(MOCK_MARKET[0]);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 font-sans selection:bg-blue-500/30 selection:text-blue-200">
      <div className="sticky top-0 z-[100] w-full flex flex-col" data-nav-id="main-nav">
        <TopNav />
        <FlashBanner />
        <Header />
      </div>
      <Breadcrumb />
      <SectionNav sections={PAGE_SECTIONS} accentColor="emerald" />

      {/* ── Hero ── */}
      <section id="overview" className="relative bg-zinc-950 border-b border-zinc-800/50 overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2670&auto=format&fit=crop')", backgroundSize: "cover", backgroundPosition: "center top" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/88 to-zinc-950/30" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-950 to-transparent" />
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-20 md:py-28 relative z-10">
          <nav className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-8">
            <Link href="/insights" className="hover:text-blue-400 transition-colors">Insights</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-zinc-400">Transatlantic Market Outlook</span>
          </nav>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/40 border border-emerald-900/30 mb-6 rounded-full backdrop-blur-md">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span className="text-[11px] font-bold tracking-[0.2em] text-emerald-400 uppercase">AfDEC Intelligence Division · Quarterly</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] max-w-4xl mb-6">
            Transatlantic<br className="hidden md:block" /> Market Outlook
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed font-medium mb-6">
            Quarterly sovereign intelligence on GDP trajectories, FDI flows, sector opportunities, and bilateral trade trends across all five African regions — benchmarked against North Carolina's export economy.
          </p>
          <p className="text-[13px] text-zinc-600 font-medium">
            Published quarterly · Sourced from IMF, World Bank, UNCTAD, and AfDEC proprietary intelligence
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
      </section>

      {/* ── Key Metrics ── */}
      <section className="bg-zinc-900/30 border-b border-zinc-800/30 py-12">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-6">Q1 2026 Headline Metrics</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Q1_METRICS.map((m) => (
              <div key={m.label} className="bg-zinc-900/30 border border-zinc-800/50 rounded-sm p-5">
                <div className={`text-3xl font-black mb-1 ${m.color}`}>{m.value}</div>
                <div className="text-white text-[12px] font-bold">{m.label}</div>
                <div className="text-zinc-600 text-[10px] uppercase tracking-wider font-medium mt-0.5">{m.context}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Editorial Calendar ── */}
      <section className="bg-zinc-950 py-16 border-b border-zinc-800/30">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-3 mb-8">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xl font-black text-white">2026 Editorial Calendar</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {EDITORIAL_CALENDAR.map((issue) => (
              <div key={issue.quarter}
                className={`p-5 rounded-sm border ${
                  issue.status === "published"
                    ? "bg-emerald-950/20 border-emerald-900/30"
                    : "bg-zinc-900/20 border-zinc-800/40"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-black text-white">{issue.quarter}</span>
                  <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                    issue.status === "published"
                      ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                      : "bg-zinc-800/50 border border-zinc-700/30 text-zinc-500"
                  }`}>
                    {issue.status === "published" ? "📄 Published" : "🔜 Upcoming"}
                  </span>
                </div>
                <div className="text-[10px] text-zinc-600 uppercase tracking-wider font-medium mb-2">{issue.period}</div>
                <div className="text-zinc-400 text-[12px] leading-relaxed">{issue.theme}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Latest Issue ── */}
      <section id="latest" className="bg-[#080808] py-20 border-b border-zinc-800/30">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <h2 className="text-2xl font-black text-white mb-10">Latest Issue</h2>
          {isLoading ? (
            <div className="h-72 bg-zinc-900/30 border border-zinc-800/50 rounded-xl animate-pulse" />
          ) : featured ? (
            <div className="group grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-0 border border-zinc-800/50 rounded-xl overflow-hidden hover:border-zinc-700 transition-all duration-300 bg-zinc-900/20">
              {featured.cover_image_url && (
                <div className="overflow-hidden h-60 lg:h-auto">
                  <img src={featured.cover_image_url} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
              )}
              <div className="p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest border bg-emerald-950/30 border-emerald-900/30 text-emerald-400">
                      <TrendingUp className="w-3 h-3" />
                      Quarterly Report
                    </span>
                    <span className="text-[10px] text-zinc-600 font-medium">
                      {new Date(featured.published_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </span>
                    {featured.reading_time_min && (
                      <span className="flex items-center gap-1 text-[10px] text-zinc-600 font-medium">
                        <Clock className="w-3 h-3" />{featured.reading_time_min} min read
                      </span>
                    )}
                  </div>
                  <h3 className="text-white font-black text-2xl md:text-3xl leading-tight mb-3 group-hover:text-emerald-300 transition-colors">{featured.title}</h3>
                  {featured.subtitle && <p className="text-zinc-500 text-base font-medium mb-4">{featured.subtitle}</p>}
                  {featured.excerpt && <p className="text-zinc-400 text-[14px] leading-relaxed mb-6">{featured.excerpt}</p>}
                  {featured.tags && (
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {featured.tags.map((tag) => (
                        <span key={tag} className="flex items-center gap-1 text-[9px] font-bold text-zinc-500 bg-zinc-800/60 border border-zinc-700/50 px-2 py-0.5 rounded-sm uppercase tracking-wider">
                          <Tag className="w-2.5 h-2.5" />{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-5 border-t border-zinc-800/50">
                  {featured.allow_download && (
                    <a href={featured.download_url ?? "#"}
                      className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black tracking-widest uppercase px-6 py-3 rounded-sm transition-all">
                      <Download className="w-3.5 h-3.5" />
                      {featured.download_label ?? "Download Report"}
                    </a>
                  )}
                  <Link href={`/insights/market-outlook/${featured.slug}`}
                    className="inline-flex items-center justify-center gap-2 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-xs font-black tracking-widest uppercase px-6 py-3 rounded-sm transition-all">
                    Read Online
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center border border-zinc-800/50 rounded-xl">
              <TrendingUp className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-600 text-sm">The Q1 2026 edition is being finalized. Subscribe to receive it upon publication.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Sector Briefs Calendar ── */}
      <section id="sectors" className="bg-zinc-950 py-20 border-b border-zinc-800/30">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-px bg-emerald-500" />
                <span className="text-[11px] font-bold tracking-[0.2em] text-emerald-400 uppercase">Sector Intelligence · Quarterly Briefs</span>
              </div>
              <h2 className="text-2xl font-black text-white">High-Impact Sector Briefs</h2>
              <p className="text-zinc-400 text-sm mt-2 max-w-xl">
                AfDEC Intelligence publishes quarterly sector briefs on the four highest-impact transatlantic trade sectors — tracking opportunities, risks, and bilateral corridor data every quarter.
              </p>
            </div>
            <Link href="/insights" className="flex items-center gap-1 text-[10px] font-bold text-zinc-500 hover:text-zinc-300 transition-colors uppercase tracking-widest shrink-0">
              <ExternalLink className="w-3 h-3" /> All Insights
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {SECTOR_BRIEFS.map((s) => (
              <div key={s.label} className={`flex flex-col bg-zinc-900/20 border border-zinc-800/40 rounded-xl overflow-hidden ${s.accent.hoverBorder} transition-all duration-300`}>
                {/* Header */}
                <div className={`bg-gradient-to-br ${s.accent.header} to-zinc-900/40 px-6 pt-6 pb-4 border-b border-zinc-800/40`}>
                  <div className="text-3xl mb-3">{s.emoji}</div>
                  <div className={`text-[10px] font-bold ${s.accent.text} uppercase tracking-widest mb-1`}>Sector Brief</div>
                  <h3 className="text-white font-black text-lg leading-tight">{s.label}</h3>
                  <p className="text-zinc-500 text-[12px] mt-1.5 leading-relaxed">{s.description}</p>
                </div>
                {/* Q1 Published */}
                <div className="flex-1 p-5 space-y-3">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold">
                    <span className="text-zinc-600">Q1 2026</span>
                    <span className={`${s.accent.text} ${s.accent.bg} border ${s.accent.border} px-2 py-0.5 rounded-full`}>Published</span>
                  </div>
                  <p className="text-zinc-400 text-[12px] leading-relaxed">{s.q1.title}</p>
                  <div className="flex gap-2 pt-1">
                    <Link href={`/insights/market-outlook/${s.q1.slug}`} className={`flex items-center gap-1 text-[10px] font-bold ${s.accent.text} hover:opacity-80 uppercase tracking-widest`}>
                      Read <ArrowRight className="w-3 h-3" />
                    </Link>
                    <span className="text-zinc-700 text-[10px]">·</span>
                    <a href="#" className="flex items-center gap-1 text-[10px] font-bold text-zinc-500 hover:text-zinc-300 uppercase tracking-widest">
                      <Download className="w-2.5 h-2.5" /> PDF
                    </a>
                  </div>
                </div>
                {/* Q2 Upcoming */}
                <div className="px-5 pb-5 border-t border-zinc-800/40 pt-4">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold mb-1.5">
                    <span className="text-zinc-600">Q2 2026</span>
                    <span className="text-zinc-500 bg-zinc-800/60 border border-zinc-700/30 px-2 py-0.5 rounded-full">Coming Jun 2026</span>
                  </div>
                  <p className="text-zinc-600 text-[11px]">{s.q2.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Subscribe ── */}
      <section id="subscribe" className="bg-[#080808] py-20">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="bg-gradient-to-br from-emerald-950/30 to-zinc-900/40 border border-emerald-900/20 rounded-xl p-10 md:p-14 relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-72 h-72 bg-emerald-600/5 rounded-full blur-[100px]" />
            <div className="relative z-10 max-w-2xl">
              <Globe className="w-8 h-8 text-emerald-400 mb-4" />
              <h2 className="text-3xl font-black text-white mb-4">Subscribe to the Quarterly Outlook</h2>
              <p className="text-zinc-400 text-[15px] leading-relaxed mb-8">
                Receive the AfDEC Transatlantic Market Outlook quarterly — PDF report delivered to your inbox alongside the executive briefing, key data tables, and sector intelligence supplements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold tracking-widest uppercase px-8 py-4 rounded-sm transition-all">
                  Subscribe to Quarterly Briefing
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/africa-intelligence" className="inline-flex items-center gap-2 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-sm font-bold tracking-widest uppercase px-8 py-4 rounded-sm transition-all">
                  <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"/><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"/></span>
                  Live Intelligence Map
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="relative bg-zinc-950 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')" }} />
        <Newsletter />
        <Footer />
      </div>
    </main>
  );
}
