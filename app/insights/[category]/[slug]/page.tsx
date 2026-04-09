"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { TopNav } from "@/components/ui/top-nav";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Newsletter } from "@/components/ui/newsletter";
import { FlashBanner } from "@/components/ui/flash-banner";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { supabase } from "@/lib/supabase";
import {
  ArrowLeft, Download, Calendar, Clock, Tag, User,
  Lock, ChevronRight, BookOpen, TrendingUp, Globe,
  FileText, ArrowRight, Star, Share2, ExternalLink
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
type Article = {
  id: string;
  slug: string;
  category: string;
  content_type: string;
  title: string;
  subtitle?: string;
  excerpt?: string;
  body?: string;
  cover_image_url?: string;
  reading_time_min?: number;
  published_at: string;
  is_featured: boolean;
  is_premium: boolean;
  allow_download: boolean;
  download_url?: string;
  download_label?: string;
  view_count: number;
  download_count?: number;
  author_name?: string;
  author_title?: string;
  author_avatar?: string;
  tags?: string[];
};

type RelatedArticle = {
  id: string;
  slug: string;
  category: string;
  title: string;
  excerpt?: string;
  cover_image_url?: string;
  reading_time_min?: number;
  published_at: string;
  is_premium?: boolean;
};


// ─────────────────────────────────────────────────────────────────────────────
// Category display config
// ─────────────────────────────────────────────────────────────────────────────
const CATEGORY_META: Record<string, { label: string; color: string; bg: string; border: string }> = {
  policy:          { label: "Policy Brief",   color: "text-blue-400",   bg: "bg-blue-950/40",   border: "border-blue-900/30" },
  "market-outlook":{ label: "Market Outlook", color: "text-emerald-400",bg: "bg-emerald-950/40",border: "border-emerald-900/30" },
  research:        { label: "Research",       color: "text-purple-400", bg: "bg-purple-950/40", border: "border-purple-900/30" },
  intelligence:    { label: "Intelligence",   color: "text-amber-400",  bg: "bg-amber-950/40",  border: "border-amber-900/30" },
  "press-release": { label: "Press Release",  color: "text-zinc-400",   bg: "bg-zinc-900/40",   border: "border-zinc-700/30" },
  "op-ed":         { label: "Op-Ed",          color: "text-rose-400",   bg: "bg-rose-950/40",   border: "border-rose-900/30" },
};

// ─────────────────────────────────────────────────────────────────────────────
// Simple Markdown renderer (without react-markdown dependency)
// Uses a set of simple regex replacements for standard brief formatting
// ─────────────────────────────────────────────────────────────────────────────
function renderMarkdown(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3 class="text-white font-black text-xl mt-8 mb-3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-white font-black text-2xl mt-10 mb-4 border-b border-zinc-800/50 pb-3">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-white font-black text-3xl mt-10 mb-5">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="text-zinc-300 italic">$1</em>')
    .replace(/`(.+?)`/g, '<code class="text-blue-300 bg-zinc-800/60 px-1.5 py-0.5 rounded text-[13px] font-mono">$1</code>')
    .replace(/^\> (.+)$/gm, '<blockquote class="border-l-2 border-blue-500/50 pl-5 py-2 my-4 text-zinc-300 italic text-[15px] leading-relaxed">$1</blockquote>')
    .replace(/^- (.+)$/gm, '<li class="flex gap-2 text-zinc-400 text-[14px] leading-relaxed mb-1.5"><span class="text-blue-400 mt-1.5">•</span><span>$1</span></li>')
    .replace(/(<li.*<\/li>\n?)+/g, '<ul class="space-y-0.5 my-4">$&</ul>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors">$1</a>')
    .replace(/\n\n/g, '</p><p class="text-zinc-400 text-[15px] leading-relaxed mb-5">')
    .replace(/^(?!<[hbuac])/gm, '')
    .trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// Content Gate Component (soft gate for premium articles)
// ─────────────────────────────────────────────────────────────────────────────
function ContentGate({ category, slug }: { category: string; slug: string }) {
  return (
    <div className="relative">
      {/* Blur overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-zinc-950/95 border border-zinc-800 rounded-2xl p-8 md:p-10 max-w-lg w-full shadow-2xl">
          <div className="w-14 h-14 rounded-full bg-blue-600/10 border border-blue-900/30 flex items-center justify-center mx-auto mb-5">
            <Lock className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-white font-black text-xl mb-3">Members-Only Content</h3>
          <p className="text-zinc-400 text-sm leading-relaxed mb-6">
            This briefing is exclusive to AfDEC registered members and institutional partners. 
            Create a free account to access the full text, inline data, and downloadable report.
          </p>
          <div className="space-y-3">
            <Link
              href={`/auth?redirect=/insights/${category}/${slug}`}
              className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold tracking-widest uppercase px-6 py-3.5 rounded-sm transition-all"
            >
              Create Free Account
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={`/auth?view=login&redirect=/insights/${category}/${slug}`}
              className="flex items-center justify-center gap-2 w-full border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-sm font-bold tracking-widest uppercase px-6 py-3.5 rounded-sm transition-all"
            >
              Sign In to Continue
            </Link>
          </div>
          <p className="text-zinc-700 text-[11px] mt-5">
            Already a Sponsorship Partner or Council Member?{" "}
            <Link href="/contact" className="text-zinc-500 hover:text-zinc-300 underline">Contact AfDEC</Link> for enterprise access.
          </p>
        </div>
      </div>
      {/* Blurred ghost content behind gate */}
      <div className="blur-[6px] opacity-40 pointer-events-none select-none h-64 overflow-hidden">
        <div className="space-y-3 p-0">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`h-4 bg-zinc-700 rounded ${i % 3 === 0 ? 'w-full' : i % 3 === 1 ? 'w-4/5' : 'w-3/4'}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Related Article Card
// ─────────────────────────────────────────────────────────────────────────────
function RelatedCard({ article }: { article: RelatedArticle }) {
  const meta = CATEGORY_META[article.category] ?? CATEGORY_META.research;
  return (
    <Link
      href={`/insights/${article.category}/${article.slug}`}
      className="group flex gap-3 py-4 border-b border-zinc-800/50 hover:bg-zinc-900/20 -mx-3 px-3 rounded-sm transition-colors"
    >
      {article.cover_image_url && (
        <div className="w-16 h-12 rounded-sm overflow-hidden shrink-0">
          <img src={article.cover_image_url} alt={article.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-[9px] font-bold uppercase tracking-widest ${meta.color}`}>{meta.label}</span>
          {article.is_premium && <Lock className="w-2.5 h-2.5 text-zinc-600" />}
        </div>
        <h4 className="text-zinc-300 font-bold text-xs leading-snug group-hover:text-white transition-colors line-clamp-2">{article.title}</h4>
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
export default function InsightBriefDetailPage() {
  const params = useParams();
  const category = params?.category as string;
  const slug = params?.slug as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<RelatedArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        // Check auth status
        const { data: { user } } = await supabase.auth.getUser();
        setIsAuthenticated(!!user);

        // Fetch article
        const { data: articleData, error: articleError } = await supabase
          .from("v_published_articles")
          .select("*")
          .eq("category", category)
          .eq("slug", slug)
          .single();

        if (articleError || !articleData) {
          setError("Article not found. It may have been removed or the URL is incorrect.");
          return;
        }
        setArticle(articleData as Article);

        // Fetch related (same category, different slug, limit 3)
        const { data: relatedData } = await supabase
          .from("v_published_articles")
          .select("id, slug, category, title, excerpt, cover_image_url, reading_time_min, published_at, is_featured")
          .eq("category", category)
          .neq("slug", slug)
          .order("published_at", { ascending: false })
          .limit(3);
        if (relatedData) setRelated(relatedData as RelatedArticle[]);
      } catch (e) {
        setError("Unable to load this article. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
    if (category && slug) load();
  }, [category, slug]);

  // ── Determine if content should be gated ──────────────────────────────────
  const isGated = article?.is_premium && !isAuthenticated;

  const meta = CATEGORY_META[category] ?? CATEGORY_META.research;
  const publishDate = article ? new Date(article.published_at).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric"
  }) : "";

  // ── Loading state ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <main className="min-h-screen bg-zinc-950 font-sans">
        <div className="sticky top-0 z-[100] w-full flex flex-col" data-nav-id="main-nav">
          <TopNav /><FlashBanner /><Header />
        </div>
        <Breadcrumb />
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className={`h-4 bg-zinc-800 rounded animate-pulse ${i === 0 ? 'w-1/3' : i === 1 ? 'w-3/4' : i === 2 ? 'w-2/3' : 'w-full'}`} />
              ))}
            </div>
            <div className="h-72 bg-zinc-800 rounded animate-pulse" />
          </div>
        </div>
      </main>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (error || !article) {
    return (
      <main className="min-h-screen bg-zinc-950 font-sans">
        <div className="sticky top-0 z-[100] w-full flex flex-col" data-nav-id="main-nav">
          <TopNav /><FlashBanner /><Header />
        </div>
        <Breadcrumb />
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-32 text-center">
          <FileText className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white mb-3">Article Not Found</h2>
          <p className="text-zinc-500 text-[15px] mb-8 max-w-sm mx-auto">{error ?? "This article could not be found."}</p>
          <Link href="/insights" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold tracking-widest uppercase px-8 py-4 rounded-sm transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to Insights
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 font-sans selection:bg-blue-500/30 selection:text-blue-200">
      <div className="sticky top-0 z-[100] w-full flex flex-col" data-nav-id="main-nav">
        <TopNav />
        <FlashBanner />
        <Header />
      </div>
      <Breadcrumb />

      {/* ── Hero Section (2-col: left metadata + right image) ── */}
      <section className="relative bg-zinc-950 border-b border-zinc-800/40 py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.5'%3E%3Cpath d='M0 30h60M30 0v60'/%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: "60px 60px" }} />

        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 relative z-10">
          {/* Breadcrumb trail */}
          <nav className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-8 flex-wrap">
            <Link href="/insights" className="hover:text-blue-400 transition-colors">Insights</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/insights/${category}`} className="hover:text-blue-400 transition-colors capitalize">{meta.label}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-zinc-400 truncate max-w-[200px]">{article.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-10 lg:gap-16 items-start">
            {/* LEFT: Metadata + CTAs */}
            <div>
              <div className="flex items-center gap-3 flex-wrap mb-5">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-widest border ${meta.bg} ${meta.border} ${meta.color}`}>
                  <BookOpen className="w-3 h-3" />
                  {meta.label}
                </span>
                {article.is_featured && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-yellow-950/30 border border-yellow-900/30 rounded-sm text-[10px] font-bold text-yellow-400 uppercase tracking-widest">
                    <Star className="w-3 h-3 fill-yellow-400" /> Featured
                  </span>
                )}
                {article.is_premium && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-purple-950/30 border border-purple-900/30 rounded-sm text-[10px] font-bold text-purple-400 uppercase tracking-widest">
                    <Lock className="w-3 h-3" /> Members Only
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.1] mb-4">
                {article.title}
              </h1>

              {article.subtitle && (
                <p className="text-lg md:text-xl text-zinc-400 font-medium leading-relaxed mb-6">
                  {article.subtitle}
                </p>
              )}

              {/* Meta row */}
              <div className="flex items-center gap-5 flex-wrap text-[11px] text-zinc-500 font-medium mb-6">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {publishDate}
                </span>
                {article.reading_time_min && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {article.reading_time_min} min read
                  </span>
                )}
                {article.author_name && (
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    {article.author_name}
                    {article.author_title ? ` · ${article.author_title}` : ""}
                  </span>
                )}
              </div>

              {/* Tags */}
              {article.tags && article.tags.length > 0 && article.tags[0] !== null && (
                <div className="flex flex-wrap gap-1.5 mb-8">
                  {article.tags.map((tag) => (
                    <span key={tag} className="flex items-center gap-1 text-[9px] font-bold text-zinc-500 bg-zinc-800/60 border border-zinc-700/50 px-2.5 py-1 rounded-sm uppercase tracking-wider">
                      <Tag className="w-2.5 h-2.5" />{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* CTA row */}
              <div className="flex flex-col sm:flex-row gap-3">
                {article.allow_download && !isGated && (
                  <a href={article.download_url ?? "#"}
                    className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold tracking-widest uppercase px-6 py-3.5 rounded-sm transition-all">
                    <Download className="w-4 h-4" />
                    {article.download_label ?? "Download PDF"}
                  </a>
                )}
                <a href="#brief-body"
                  className="inline-flex items-center justify-center gap-2 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-xs font-bold tracking-widest uppercase px-6 py-3.5 rounded-sm transition-all">
                  Read Brief
                  <ArrowRight className="w-4 h-4" />
                </a>
                <button
                  onClick={() => { if (navigator.share) navigator.share({ title: article.title, url: window.location.href }); }}
                  className="inline-flex items-center justify-center gap-2 border border-zinc-800 hover:border-zinc-700 text-zinc-500 hover:text-zinc-300 text-xs font-bold tracking-widest uppercase px-4 py-3.5 rounded-sm transition-all"
                  aria-label="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* RIGHT: Cover Image */}
            {article.cover_image_url && (
              <div className="relative">
                <div className="aspect-[4/3] overflow-hidden rounded-xl border border-zinc-800/50 shadow-2xl shadow-black/50">
                  <img
                    src={article.cover_image_url}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/30 to-transparent" />
                </div>
                {/* Category badge on image */}
                <div className={`absolute top-4 left-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest border backdrop-blur-md ${meta.bg} ${meta.border} ${meta.color}`}>
                  {meta.label}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-700/30 to-transparent" />
      </section>

      {/* ── Body: 2-Column Layout ── */}
      <section id="brief-body" className="bg-zinc-950 py-16">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">

            {/* ── MAIN BODY — Left Column ─────────────────────────────────── */}
            <div className="min-w-0">
              {/* Excerpt / lede */}
              {article.excerpt && (
                <p className="text-lg text-zinc-300 font-medium leading-relaxed mb-8 border-l-2 border-blue-500/50 pl-6 py-1">
                  {article.excerpt}
                </p>
              )}

              {/* BODY CONTENT */}
              {isGated ? (
                // Premium gate — first ~300 chars visible + gate overlay
                <div>
                  <div className="relative">
                    {/* Preview text */}
                    {article.body ? (
                      <div className="text-zinc-400 text-[15px] leading-relaxed">
                        <p className="mb-4">{article.body.slice(0, 400)}...</p>
                      </div>
                    ) : (
                      <p className="text-zinc-400 text-[15px] leading-relaxed mb-4">
                        The full text of this briefing is available exclusively to AfDEC registered members and institutional partners.
                      </p>
                    )}
                    {/* Fade gradient */}
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-zinc-950 to-transparent" />
                  </div>
                  <div className="mt-8">
                    <ContentGate category={category} slug={slug} />
                  </div>
                </div>
              ) : article.body ? (
                // Full body content
                <div
                  className="prose-brief"
                  dangerouslySetInnerHTML={{
                    __html: `<p class="text-zinc-400 text-[15px] leading-relaxed mb-5">${renderMarkdown(article.body)}</p>`
                  }}
                  style={{ color: "inherit" }}
                />
              ) : (
                // Body not yet added (admin hasn't populated it)
                <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-10 text-center">
                  <FileText className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
                  <h3 className="text-white font-bold text-base mb-2">Full Report Coming Soon</h3>
                  <p className="text-zinc-500 text-sm max-w-sm mx-auto mb-6">
                    The full text of this report is being prepared for publication. Download the PDF version or register to be notified when it goes live.
                  </p>
                  {article.allow_download && (
                    <a href={article.download_url ?? "#"}
                      className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold tracking-widest uppercase px-6 py-3 rounded-sm transition-all">
                      <Download className="w-4 h-4" />
                      {article.download_label ?? "Download PDF Report"}
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* ── SIDEBAR — Right Column ────────────────────────────────── */}
            <aside className="space-y-6">

              {/* Download Box */}
              {article.allow_download && !isGated && (
                <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest">Download Report</span>
                  </div>
                  <p className="text-zinc-400 text-xs leading-relaxed mb-4">
                    Access the full {article.content_type === "report" ? "42-page" : ""} PDF report — optimized for institutional distribution and presentation.
                  </p>
                  <a href={article.download_url ?? "#"}
                    className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold tracking-widest uppercase px-4 py-3 rounded-sm transition-all">
                    <Download className="w-3.5 h-3.5" />
                    {article.download_label ?? "Download PDF"}
                  </a>
                </div>
              )}

              {/* Premium gate CTA in sidebar */}
              {article.is_premium && !isAuthenticated && (
                <div className="bg-purple-950/20 border border-purple-900/30 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Lock className="w-4 h-4 text-purple-400" />
                    <span className="text-[11px] font-bold text-purple-400 uppercase tracking-widest">Members Only</span>
                  </div>
                  <p className="text-zinc-400 text-xs leading-relaxed mb-4">
                    Create a free AfDEC account to read the full brief and access all member-exclusive intelligence publications.
                  </p>
                  <Link href={`/auth?redirect=/insights/${category}/${slug}`}
                    className="flex items-center justify-center gap-2 w-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold tracking-widest uppercase px-4 py-3 rounded-sm transition-all">
                    Create Free Account
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}

              {/* Newsletter Box */}
              <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-1">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span className="text-[11px] font-bold text-blue-400 uppercase tracking-widest">Intelligence Briefings</span>
                </div>
                <h3 className="text-white font-black text-base mb-2">Stay Ahead of the Market</h3>
                <p className="text-zinc-500 text-xs leading-relaxed mb-4">
                  Receive AfDEC policy briefs, market outlooks, and quarterly sector intelligence directly — free for NC and Africa business leaders.
                </p>
                <div className="space-y-2">
                  <input
                    type="email"
                    placeholder="your@organization.com"
                    className="w-full bg-zinc-800/60 border border-zinc-700/50 text-white text-sm px-4 py-2.5 rounded-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <button
                    type="button"
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold tracking-widest uppercase px-4 py-2.5 rounded-sm transition-all"
                  >
                    Subscribe to Briefs
                  </button>
                </div>
              </div>

              {/* Contact AfDEC */}
              <div className="bg-zinc-900/20 border border-zinc-800/40 rounded-xl p-5">
                <h3 className="text-white font-bold text-sm mb-2">Discuss This Brief</h3>
                <p className="text-zinc-500 text-xs leading-relaxed mb-4">
                  Connect with AfDEC Intelligence Desk to explore how this brief applies to your expansion or investment strategy.
                </p>
                <Link href="/contact"
                  className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-widest transition-colors">
                  Contact AfDEC Intelligence
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Related Publications */}
              {related.length > 0 && (
                <div className="bg-zinc-900/20 border border-zinc-800/40 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="w-4 h-4 text-zinc-500" />
                    <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Related Briefs</span>
                  </div>
                  <div className="divide-y divide-zinc-800/40">
                    {related.map((a) => (
                      <RelatedCard key={a.id} article={a} />
                    ))}
                  </div>
                  <Link href={`/insights/${category}`}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-600 hover:text-zinc-300 uppercase tracking-widest mt-4 transition-colors">
                    View All {meta.label}s
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              )}

              {/* Explore Sector */}
              <div className="bg-zinc-900/20 border border-zinc-800/40 rounded-xl p-5">
                <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">Explore Sector</div>
                <div className="space-y-1.5">
                  <Link href="/sectors/agriculture" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors py-1">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Agriculture &amp; Farming
                  </Link>
                  <Link href="/sectors/manufacturing" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors py-1">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-500" /> Advanced Manufacturing
                  </Link>
                  <Link href="/sectors/fintech" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors py-1">
                    <TrendingUp className="w-3.5 h-3.5 text-purple-500" /> Financial Technology
                  </Link>
                  <Link href="/sectors/defense" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors py-1">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-500" /> Defense &amp; Security
                  </Link>
                </div>
              </div>

            </aside>
          </div>
        </div>
      </section>

      {/* ── Bottom related grid ── */}
      {related.length > 0 && (
        <section className="bg-[#080808] py-16 border-t border-zinc-800/30">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black text-white">More {meta.label}s</h2>
              <Link href={`/insights/${category}`} className="flex items-center gap-1 text-[10px] font-bold text-zinc-500 hover:text-zinc-300 uppercase tracking-widest transition-colors">
                View All <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map((a) => {
                const relMeta = CATEGORY_META[a.category] ?? CATEGORY_META.research;
                return (
                  <Link key={a.id} href={`/insights/${a.category}/${a.slug}`}
                    className="group bg-zinc-900/20 border border-zinc-800/50 rounded-xl overflow-hidden hover:border-zinc-700 transition-all duration-300">
                    {a.cover_image_url && (
                      <div className="overflow-hidden h-36">
                        <img src={a.cover_image_url} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-[9px] font-bold uppercase tracking-widest ${relMeta.color}`}>{relMeta.label}</span>
                        {a.is_premium && <Lock className="w-2.5 h-2.5 text-zinc-600" />}
                      </div>
                      <h3 className="text-zinc-200 font-bold text-sm leading-snug group-hover:text-white transition-colors line-clamp-2">{a.title}</h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <Newsletter />
      <Footer />
    </main>
  );
}
