"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, ShieldCheck, FileText, Share2 } from "lucide-react";
import { TopNav } from "@/components/ui/top-nav";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { FlashBanner } from "@/components/ui/flash-banner";
import { supabase } from "@/lib/supabase";

export default function NewsArticlePage({ params }: { params: { id: string } }) {
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticle() {
      const { data, error } = await supabase
        .from("news_briefings")
        .select("*")
        .eq("id", params.id)
        .single();
      
      if (!error && data) {
        setArticle(data);
      }
      setLoading(false);
    }
    fetchArticle();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <div className="sticky top-0 z-[100] w-full flex flex-col">
          <TopNav />
          <FlashBanner />
          <Header />
        </div>
        <main className="max-w-4xl mx-auto px-6 py-32 text-center animate-pulse">
          <div className="h-8 bg-zinc-900 w-1/4 mx-auto rounded mb-8"></div>
          <div className="h-16 bg-zinc-900 w-3/4 mx-auto rounded mb-8"></div>
          <div className="h-96 bg-zinc-900 w-full rounded"></div>
        </main>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <div className="sticky top-0 z-[100] w-full flex flex-col">
          <TopNav />
          <FlashBanner />
          <Header />
        </div>
        <main className="max-w-4xl mx-auto px-6 py-32 text-center">
          <h1 className="text-4xl font-black text-white mb-6">Briefing Not Found</h1>
          <p className="text-zinc-400">The requested intelligence brief has been redacted or does not exist.</p>
          <Link href="/news" className="inline-block mt-8 text-blue-500 hover:text-blue-400 font-bold uppercase tracking-widest text-sm">
            Return to Archives
          </Link>
        </main>
      </div>
    );
  }

  const formattedDate = new Date(article.valid_from).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="min-h-screen bg-zinc-950 font-sans selection:bg-blue-500/30">
      <div className="sticky top-0 z-[100] w-full flex flex-col">
        <TopNav />
        <FlashBanner />
        <Header />
      </div>

      <main className="max-w-[1000px] mx-auto px-6 lg:px-12 py-24">
        <Link href="/news" className="inline-flex items-center text-sm font-bold text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-widest mb-12">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Archives
        </Link>

        <article>
          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-zinc-900 text-zinc-300 text-[10px] font-bold uppercase tracking-widest rounded-sm border border-zinc-800">
                {article.category || "Press Release"}
              </span>
              <div className="flex items-center text-xs font-bold text-zinc-500 uppercase tracking-widest">
                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                {formattedDate}
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-8">
              {article.title}
            </h1>
            
            <p className="text-xl text-zinc-400 font-medium leading-relaxed max-w-3xl border-l-4 border-blue-500 pl-6 mb-12">
              {article.excerpt}
            </p>

            {article.image_url && (
              <div className="w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden border border-zinc-800 relative mb-16">
                <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent opacity-60"></div>
              </div>
            )}
          </header>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-1 order-2 md:order-1">
              <div className="sticky top-32 space-y-6">
                <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-lg">
                  <ShieldCheck className="w-8 h-8 text-blue-500 mb-4" />
                  <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-2">Verified Briefing</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed">This transmission has been verified by the Secretariat. Distribution is public.</p>
                </div>
                <button className="flex items-center justify-center w-full px-4 py-3 border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800 text-white rounded text-sm font-bold tracking-widest uppercase transition-colors">
                  <Share2 className="w-4 h-4 mr-2" /> Share Release
                </button>
              </div>
            </div>

            <div className="md:col-span-3 order-1 md:order-2">
              <div className="prose prose-invert prose-zinc max-w-none">
                {article.full_content ? (
                  <div dangerouslySetInnerHTML={{ __html: article.full_content }} />
                ) : (
                  <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap text-lg">
                    {/* Fallback to excerpt if full content is missing */}
                    {article.excerpt}
                    <br/><br/>
                    Detailed intelligence metrics and full documentation are restricted to the Member Portal. For comprehensive analysis, please login to the Sovereign Terminal.
                  </p>
                )}
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
