"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { TopNav } from "@/components/ui/top-nav";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Newsletter } from "@/components/ui/newsletter";
import { FlashBanner } from "@/components/ui/flash-banner";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { supabase } from "@/lib/supabase";
import {
  FileText, Download, ArrowRight, TrendingUp, Globe,
  BookOpen, Calendar, Clock, Star, Filter
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Types (mirrors the Supabase insights_articles schema)
// ─────────────────────────────────────────────────────────────────────────────
type Article = {
  id: string;
  slug: string;
  category: "policy" | "market-outlook" | "research" | "intelligence" | "press-release" | "op-ed";
  content_type: "article" | "report" | "brief" | "data-snapshot" | "video";
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
  download_count: number;
  author_name?: string;
  author_title?: string;
  tags?: string[];
};

const CATEGORY_META: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ComponentType<{ className?: string }> }> = {
  policy:          { label: "Policy Brief",   color: "text-blue-400",   bg: "bg-blue-950/30",   border: "border-blue-900/30",   icon: BookOpen },
  "market-outlook":{ label: "Market Outlook", color: "text-emerald-400",bg: "bg-emerald-950/30",border: "border-emerald-900/30",icon: TrendingUp },
  research:        { label: "Research",       color: "text-purple-400", bg: "bg-purple-950/30", border: "border-purple-900/30", icon: Globe },
  intelligence:    { label: "Intelligence",   color: "text-amber-400",  bg: "bg-amber-950/30",  border: "border-amber-900/30",  icon: Globe },
  "press-release": { label: "Press Release",  color: "text-zinc-400",   bg: "bg-zinc-900/30",   border: "border-zinc-700/30",   icon: FileText },
  "op-ed":         { label: "Op-Ed",          color: "text-rose-400",   bg: "bg-rose-950/30",   border: "border-rose-900/30",   icon: FileText },
};

// ─────────────────────────────────────────────────────────────────────────────
// Seed Mock Data (shown when Supabase has no rows yet)
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_ARTICLES: Article[] = [
  {
    id: "1", slug: "afcfta-nc-opportunity-2026", category: "policy", content_type: "report",
    title: "AfCFTA and the North Carolina Opportunity: A Policy Framework for 2026",
    subtitle: "How the African Continental Free Trade Area reshapes bilateral trade dynamics for NC enterprises",
    excerpt: "The African Continental Free Trade Area (AfCFTA), now operational across 47 AU member states, creates a $3.4 trillion combined market with preferential tariff schedules that directly benefit North Carolina export sectors.",
    cover_image_url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200&auto=format&fit=crop",
    reading_time_min: 12, published_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    is_featured: true, allow_download: true, download_label: "Download Full Report",
    view_count: 1247, download_count: 312, author_name: "AfDEC Intelligence Desk", author_title: "Editorial Team",
    tags: ["AfCFTA", "North Carolina", "Trade Corridor", "Policy"],
  },
  {
    id: "2", slug: "transatlantic-market-outlook-q1-2026", category: "market-outlook", content_type: "report",
    title: "Transatlantic Market Outlook: Q1 2026",
    subtitle: "GDP projections, FDI flows, and sector intelligence across all five African economic regions",
    excerpt: "AfDEC's flagship quarterly market intelligence report covering GDP growth trajectories, foreign direct investment inflows, and emerging sector opportunities across all five African regions.",
    cover_image_url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200&auto=format&fit=crop",
    reading_time_min: 18, published_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    is_featured: true, allow_download: true, download_label: "Download Q1 2026 Report",
    view_count: 2891, download_count: 748, author_name: "AfDEC Intelligence Desk", author_title: "Editorial Team",
    tags: ["Market Outlook", "FDI", "West Africa", "East Africa"],
  },
  {
    id: "3", slug: "nigeria-nc-fintech-corridor", category: "policy", content_type: "brief",
    title: "Nigeria–North Carolina Fintech Corridor: Bilateral Opportunity Brief",
    subtitle: "M&A targets, regulatory pathways, and partnership frameworks for NC fintech companies entering Nigeria",
    excerpt: "Nigeria's $3.7B fintech ecosystem — anchored by Flutterwave, Paystack, and OPay — presents structured entry points for North Carolina financial technology companies seeking African market access.",
    cover_image_url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop",
    reading_time_min: 8, published_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    is_featured: false, allow_download: false,
    view_count: 634, download_count: 0, author_name: "AfDEC Policy Unit", author_title: "Policy Research Division",
    tags: ["Nigeria", "Fintech", "Trade Corridor"],
  },
  {
    id: "4", slug: "kenya-life-sciences-market-entry", category: "market-outlook", content_type: "brief",
    title: "Kenya Life Sciences: Market Entry Assessment 2026",
    subtitle: "Regulatory landscape, distribution networks, and investment incentives for NC pharmaceutical and biotech firms",
    excerpt: "Kenya's Universal Health Coverage mandate and Nairobi's emerging medtech hub create a $1.2B addressable market for North Carolina life sciences exports over the next 36 months.",
    cover_image_url: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=1200&auto=format&fit=crop",
    reading_time_min: 10, published_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    is_featured: false, allow_download: false,
    view_count: 441, download_count: 0, author_name: "AfDEC Intelligence Desk", author_title: "Editorial Team",
    tags: ["Kenya", "Life Sciences", "Market Outlook", "East Africa"],
  },
];

function ArticleCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  const meta = CATEGORY_META[article.category] ?? CATEGORY_META.research;
  const Icon = meta.icon;
  const date = new Date(article.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  if (featured) {
    return (
      <div className="group bg-zinc-900/30 border border-zinc-800/50 rounded-xl overflow-hidden hover:border-zinc-700 transition-all duration-300">
        {article.cover_image_url && (
          <div className="overflow-hidden h-52">
            <img src={article.cover_image_url} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
        )}
        <div className="p-7">
          <div className="flex items-center gap-3 mb-4">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest border ${meta.bg} ${meta.border} ${meta.color}`}>
              <Icon className="w-3 h-3" />
              {meta.label}
            </span>
            {article.is_featured && <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />}
          </div>
          <h3 className="text-white font-black text-xl mb-2 leading-tight group-hover:text-blue-300 transition-colors">{article.title}</h3>
          {article.subtitle && <p className="text-zinc-500 text-sm mb-3 font-medium">{article.subtitle}</p>}
          {article.excerpt && <p className="text-zinc-400 text-[13px] leading-relaxed mb-5 line-clamp-3">{article.excerpt}</p>}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-[10px] text-zinc-600 font-medium uppercase tracking-widest">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{date}</span>
              {article.reading_time_min && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.reading_time_min} min</span>}
            </div>
            <div className="flex items-center gap-2">
              {article.allow_download && (
                <a href={article.download_url ?? "#"} className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-widest">
                  <Download className="w-3 h-3" />
                  PDF
                </a>
              )}
              <Link href={`/insights/${article.category}/${article.slug}`} className="flex items-center gap-1 text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest">
                Read <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex gap-5 py-5 border-b border-zinc-800/50 hover:bg-zinc-900/20 px-4 -mx-4 rounded-sm transition-colors">
      {article.cover_image_url && (
        <div className="w-20 h-16 rounded-sm overflow-hidden shrink-0">
          <img src={article.cover_image_url} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`text-[9px] font-bold uppercase tracking-widest ${meta.color}`}>{meta.label}</span>
          <span className="text-zinc-700 text-[9px]">·</span>
          <span className="text-zinc-600 text-[9px] font-medium">{date}</span>
        </div>
        <h4 className="text-zinc-200 font-bold text-sm leading-snug group-hover:text-white transition-colors line-clamp-2">{article.title}</h4>
        {article.reading_time_min && <span className="text-[10px] text-zinc-600 mt-1 block">{article.reading_time_min} min read</span>}
      </div>
      <Link href={`/insights/${article.category}/${article.slug}`} className="shrink-0 self-center">
        <ArrowRight className="w-4 h-4 text-zinc-700 group-hover:text-blue-400 transition-colors" />
      </Link>
    </div>
  );
}

export default function InsightsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  useEffect(() => {
    async function loadArticles() {
      try {
        const { data } = await supabase.from("v_published_articles").select("*").order("published_at", { ascending: false });
        setArticles(data && data.length > 0 ? (data as Article[]) : MOCK_ARTICLES);
      } catch {
        setArticles(MOCK_ARTICLES);
      }
    }
    loadArticles();
  }, []);

  const featured = articles.filter((a) => a.is_featured);
  const rest = articles.filter((a) => !a.is_featured);
  const filtered = activeFilter === "all" ? rest : rest.filter((a) => a.category === activeFilter);

  const FILTERS = [
    { id: "all", label: "All Insights" },
    { id: "policy", label: "Policy Briefs" },
    { id: "market-outlook", label: "Market Outlook" },
    { id: "research", label: "Research" },
    { id: "intelligence", label: "Intelligence" },
  ];

  return (
    <main className="min-h-screen bg-zinc-950 font-sans selection:bg-blue-500/30 selection:text-blue-200">
      <div className="sticky top-0 z-[100] w-full flex flex-col" data-nav-id="main-nav">
        <TopNav />
        <FlashBanner />
        <Header />
      </div>
      <Breadcrumb />

      {/* ── Hero ── */}
      <section className="relative bg-zinc-950 border-b border-zinc-800/50 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.5'%3E%3Cpath d='M0 30h60M30 0v60'/%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: "60px 60px" }} />
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-20 md:py-28 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-800/80 border border-zinc-700/50 mb-6 rounded-full backdrop-blur-md">
            <BookOpen className="w-3 h-3 text-blue-400" />
            <span className="text-[11px] font-bold tracking-[0.2em] text-zinc-400 uppercase">AfDEC Intelligence Division</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] max-w-4xl mb-6">
            Insights &amp; Analytics
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed font-medium">
            Policy briefs, transatlantic market outlooks, sector intelligence, and research publications — produced by the AfDEC Intelligence Division for institutional decision-makers.
          </p>
          <div className="flex gap-4 mt-8">
            <Link href="/insights/policy" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold tracking-widest uppercase px-6 py-3 rounded-sm transition-all">
              Policy Briefs
            </Link>
            <Link href="/insights/market-outlook" className="inline-flex items-center gap-2 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-sm font-bold tracking-widest uppercase px-6 py-3 rounded-sm transition-all">
              Market Outlook
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      </section>

      {/* ── Featured Articles ── */}
      {featured.length > 0 && (
        <section className="bg-zinc-950 py-16 border-b border-zinc-800/30">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
            <div className="flex items-center gap-3 mb-8">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Featured Publications</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featured.map((a) => <ArticleCard key={a.id} article={a} featured />)}
            </div>
          </div>
        </section>
      )}

      {/* ── All Articles with Filter ── */}
      <section className="bg-zinc-950 py-16">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <h2 className="text-2xl font-black text-white">All Publications</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-zinc-600" />
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm border transition-all ${
                    activeFilter === f.id
                      ? "bg-blue-600 border-blue-500 text-white"
                      : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div className="max-w-3xl">
            {filtered.length === 0 ? (
              <div className="py-16 text-center">
                <BookOpen className="w-8 h-8 text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-600 text-sm">No articles in this category yet. Check back soon.</p>
              </div>
            ) : (
              filtered.map((a) => <ArticleCard key={a.id} article={a} />)
            )}
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
