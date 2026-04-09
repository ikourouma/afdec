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
  BookOpen, Download, ArrowRight, Calendar, Clock,
  FileText, ChevronRight, Tag, ExternalLink
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
  author_title?: string;
  tags?: string[];
};

const PAGE_SECTIONS: NavSection[] = [
  { id: "overview", label: "Overview" },
  { id: "publications", label: "Publications" },
  { id: "submit", label: "Contribute" },
];

const MOCK_POLICY: Article[] = [
  {
    id: "1", slug: "afcfta-nc-opportunity-2026", category: "policy", content_type: "report",
    title: "AfCFTA and the North Carolina Opportunity: A Policy Framework for 2026",
    subtitle: "How the African Continental Free Trade Area reshapes bilateral trade dynamics for NC enterprises",
    excerpt: "The African Continental Free Trade Area (AfCFTA), now operational across 47 AU member states, creates a $3.4 trillion combined market with preferential tariff schedules that directly benefit North Carolina export sectors — life sciences, advanced manufacturing, and clean energy chief among them.",
    cover_image_url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200&auto=format&fit=crop",
    reading_time_min: 12, published_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    is_featured: true, allow_download: true, download_label: "Download Full 24-Page Report",
    view_count: 1247, author_name: "AfDEC Policy Unit", author_title: "Policy Research Division",
    tags: ["AfCFTA", "North Carolina", "Trade Corridor", "Policy", "Manufacturing"],
  },
  {
    id: "3", slug: "nigeria-nc-fintech-corridor", category: "policy", content_type: "brief",
    title: "Nigeria–North Carolina Fintech Corridor: Bilateral Opportunity Brief",
    subtitle: "M&A targets, regulatory pathways, and partnership frameworks for NC fintech companies entering Nigeria",
    excerpt: "Nigeria's $3.7B fintech ecosystem — anchored by Flutterwave, Paystack, and OPay — presents structured entry points for North Carolina financial technology companies seeking African market access.",
    cover_image_url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop",
    reading_time_min: 8, published_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    is_featured: false, allow_download: false,
    view_count: 634, author_name: "AfDEC Policy Unit", author_title: "Policy Research Division",
    tags: ["Nigeria", "Fintech", "Trade Corridor", "West Africa"],
  },
  {
    id: "5", slug: "sovereign-incentives-guide-2026", category: "policy", content_type: "brief",
    title: "Sovereign Incentives Navigator: NC & Africa — 2026 Edition",
    subtitle: "The complete guide to stacking NC state grants, federal programs, and Africa-side IPA incentives",
    excerpt: "A practical guide for enterprise decision-makers navigating the full incentive landscape — from NC JDIG grants and Opportunity Zones to AfCFTA preferential tariffs and Afreximbank trade finance instruments.",
    cover_image_url: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1200&auto=format&fit=crop",
    reading_time_min: 15, published_at: new Date(Date.now() - 21 * 86400000).toISOString(),
    is_featured: false, allow_download: true, download_label: "Download Navigator Guide",
    view_count: 892, author_name: "AfDEC Intelligence Desk", author_title: "Editorial Team",
    tags: ["Sovereign Incentives", "JDIG", "AfCFTA", "Policy", "North Carolina"],
  },
];

function PolicyCard({ article }: { article: Article }) {
  const date = new Date(article.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const typeLabel = article.content_type === "report" ? "Policy Report" : article.content_type === "brief" ? "Policy Brief" : "Publication";

  return (
    <article className="group grid grid-cols-1 md:grid-cols-[280px_1fr] gap-0 border border-zinc-800/50 rounded-xl overflow-hidden hover:border-zinc-700 transition-all duration-300 bg-zinc-900/20">
      {article.cover_image_url && (
        <div className="overflow-hidden h-52 md:h-auto">
          <img src={article.cover_image_url} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        </div>
      )}
      <div className="p-7 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest border bg-blue-950/30 border-blue-900/30 text-blue-400">
              <FileText className="w-3 h-3" />
              {typeLabel}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-zinc-600 font-medium">
              <Calendar className="w-3 h-3" />{date}
            </span>
            {article.reading_time_min && (
              <span className="flex items-center gap-1 text-[10px] text-zinc-600 font-medium">
                <Clock className="w-3 h-3" />{article.reading_time_min} min read
              </span>
            )}
          </div>
          <h2 className="text-white font-black text-xl mb-2 leading-tight group-hover:text-blue-300 transition-colors">{article.title}</h2>
          {article.subtitle && <p className="text-zinc-500 text-sm font-medium mb-3">{article.subtitle}</p>}
          {article.excerpt && <p className="text-zinc-400 text-[13px] leading-relaxed mb-5 line-clamp-3">{article.excerpt}</p>}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {article.tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 text-[9px] font-bold text-zinc-500 bg-zinc-800/60 border border-zinc-700/50 px-2 py-0.5 rounded-sm uppercase tracking-wider">
                  <Tag className="w-2.5 h-2.5" />{tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 pt-4 border-t border-zinc-800/50">
          {article.author_name && (
            <div className="flex-1">
              <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">By {article.author_name}</p>
            </div>
          )}
          <div className="flex items-center gap-3">
            {article.allow_download && (
              <a
                href={article.download_url ?? "#"}
                className="inline-flex items-center gap-1.5 text-[10px] font-black text-emerald-400 hover:text-emerald-300 border border-emerald-900/40 px-3 py-1.5 rounded-sm transition-colors uppercase tracking-widest"
              >
                <Download className="w-3 h-3" />
                {article.download_label ?? "Download PDF"}
              </a>
            )}
            <Link
              href={`/insights/policy/${article.slug}`}
              className="inline-flex items-center gap-1.5 text-[10px] font-black text-blue-400 hover:text-blue-300 border border-blue-900/40 px-3 py-1.5 rounded-sm transition-colors uppercase tracking-widest"
            >
              Read Full Brief
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function PolicyInsightsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadArticles() {
      try {
        const { data } = await supabase
          .from("v_published_articles")
          .select("*")
          .eq("category", "policy")
          .order("published_at", { ascending: false });
        setArticles(data && data.length > 0 ? (data as Article[]) : MOCK_POLICY);
      } catch {
        setArticles(MOCK_POLICY);
      } finally {
        setIsLoading(false);
      }
    }
    loadArticles();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 font-sans selection:bg-blue-500/30 selection:text-blue-200">
      <div className="sticky top-0 z-[100] w-full flex flex-col" data-nav-id="main-nav">
        <TopNav />
        <FlashBanner />
        <Header />
      </div>
      <Breadcrumb />
      <SectionNav sections={PAGE_SECTIONS} accentColor="blue" />

      {/* ── Hero ── */}
      <section id="overview" className="relative bg-zinc-950 border-b border-zinc-800/50 overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2670&auto=format&fit=crop')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/88 to-zinc-950/30" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-950 to-transparent" />
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-20 md:py-28 relative z-10">
          <nav className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-8">
            <Link href="/insights" className="hover:text-blue-400 transition-colors">Insights</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-zinc-400">Policy Publications</span>
          </nav>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-950/40 border border-blue-900/30 mb-6 rounded-full backdrop-blur-md">
            <BookOpen className="w-3 h-3 text-blue-400" />
            <span className="text-[11px] font-bold tracking-[0.2em] text-blue-400 uppercase">AfDEC Policy Research Division</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] max-w-4xl mb-6">
            Policy Publications<br className="hidden md:block" /> & Briefs
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed font-medium">
            AfDEC policy research analyzes legislative, diplomatic, and regulatory developments affecting transatlantic trade — providing institutional decision-makers with actionable intelligence on NC–Africa bilateral corridor policy.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      </section>

      {/* ── Publications ── */}
      <section id="publications" className="bg-zinc-950 py-20">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-2xl font-black text-white">Policy Publications</h2>
              <p className="text-zinc-500 text-sm mt-1">{articles.length} publication{articles.length !== 1 ? "s" : ""} available</p>
            </div>
            <Link href="/insights" className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 hover:text-zinc-300 transition-colors uppercase tracking-widest">
              <ExternalLink className="w-3 h-3" />
              All Insights
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-56 bg-zinc-900/30 border border-zinc-800/50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div className="py-24 text-center">
              <BookOpen className="w-10 h-10 text-zinc-700 mx-auto mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">No publications yet</h3>
              <p className="text-zinc-500 text-sm max-w-sm mx-auto">The AfDEC Policy Research Division will publish briefs and reports here. Check back soon or subscribe to our newsletter.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {articles.map((a) => <PolicyCard key={a.id} article={a} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── Contribute ── */}
      <section id="submit" className="bg-[#080808] py-20 border-t border-zinc-800/30">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="bg-gradient-to-br from-blue-950/30 to-zinc-900/40 border border-blue-900/20 rounded-xl p-10 md:p-14 relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-72 h-72 bg-blue-600/5 rounded-full blur-[100px]" />
            <div className="relative z-10 max-w-2xl">
              <FileText className="w-8 h-8 text-blue-400 mb-4" />
              <h2 className="text-3xl font-black text-white mb-4">Contribute a Policy Brief</h2>
              <p className="text-zinc-400 text-[15px] leading-relaxed mb-8">
                AfDEC welcomes policy research contributions from member organizations, academic institutions, government advisors, and subject matter experts. Accepted briefs are published under the AfDEC Policy Research Division banner and distributed to our full institutional audience.
              </p>
              <Link href="/contact" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold tracking-widest uppercase px-8 py-4 rounded-sm transition-all">
                Submit for Publication
                <ArrowRight className="w-4 h-4" />
              </Link>
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
