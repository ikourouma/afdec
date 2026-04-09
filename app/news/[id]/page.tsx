"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Construction } from "lucide-react";
import { TopNav } from "@/components/ui/top-nav";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { FlashBanner } from "@/components/ui/flash-banner";

export default function BriefingDetailPage() {
  return (
    <div className="min-h-screen bg-zinc-950 font-sans selection:bg-blue-500/30">
      <div className="sticky top-0 z-[100] w-full flex flex-col">
        <TopNav />
        <FlashBanner />
        <Header />
      </div>

      <main className="max-w-[1600px] mx-auto px-6 lg:px-12 py-24">
        <Link href="/news" className="inline-flex items-center text-sm font-bold text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-widest mb-12">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Market Briefings
        </Link>

        <div className="max-w-3xl mx-auto text-center py-20">
          <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center mx-auto mb-8">
            <Construction className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">Briefing Details</h1>
          <p className="text-lg text-zinc-400 font-medium leading-relaxed mb-10 max-w-xl mx-auto">
            The full intelligence briefing and supporting documentation is being compiled by the Board of Directors. Check back soon for the complete report.
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-bold text-zinc-500 uppercase tracking-widest">
            <FileText className="w-3.5 h-3.5 mr-2 text-emerald-500" />
            Coming Soon — Admin Managed
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
