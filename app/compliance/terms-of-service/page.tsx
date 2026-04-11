"use client";

import React from "react";
import { TopNav } from "@/components/ui/top-nav";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { BookOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-zinc-950 font-sans text-zinc-300 selection:bg-blue-500/30 flex flex-col">
      <div className="sticky top-0 z-[100] w-full flex flex-col">
        <TopNav />
        <Header />
      </div>
      <Breadcrumb />

      <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-24 pb-40">
        <Link href="/compliance" className="inline-flex items-center text-xs font-bold text-zinc-500 hover:text-blue-400 mb-12 transition-colors uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Compliance Vault
        </Link>

        <div className="mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-950/40 border border-amber-900/30 rounded-full mb-6">
            <BookOpen className="w-3 h-3 text-amber-500" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-amber-500 uppercase">Operating Mandate</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            Terms of Sovereignty<br />& Institutional Conduct
          </h1>
          <p className="text-sm font-bold text-emerald-500 tracking-widest uppercase mb-10">Last Ratified: October 14, 2026</p>
          <div className="h-px w-full bg-gradient-to-r from-zinc-800 to-transparent"></div>
        </div>

        <div className="prose prose-invert prose-zinc max-w-none prose-h3:text-amber-500 prose-h3:text-lg prose-h3:tracking-wide prose-h3:font-bold prose-h3:mt-12 prose-p:leading-relaxed prose-p:text-zinc-400 prose-li:text-zinc-400">
          <p className="text-lg leading-relaxed text-zinc-300 mb-8 italic">
            By bypassing the AfDEC Gateway and accessing our Deal Rooms, Intelligence Terminal, or public Strategic Framework, you agree to rigorous corporate operating behaviors as mandated by the Executive Board.
          </p>

          <h3>1. Capital Allocation Integrity</h3>
          <p>Any financial data, project modeling, or grant valuations presented in the AfDEC Deal Rooms are highly classified institutional assets. Unauthorized scraping, distribution, or secondary manipulation of these outputs will immediately trigger IP isolation protocols and legal deterrence.</p>
          
          <ul className="space-y-4 list-none pl-0 my-8">
            {[
              "Absolute non-disclosure of proprietary trade corridor valuations.",
              "Prohibition of automated data extraction (bots/crawlers) without explicit API licensure.",
              "Consent to institutional behavioral monitoring within secure deal room environments."
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2.5 shrink-0 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <h3>2. Bilateral Trade Ethics</h3>
          <p>Entities utilizing the AfDEC Transatlantic Corridors must adhere to all FCPA (U.S.) and relevant African sovereign anti-corruption regulations. AfDEC serves as a transparent bridge; we do not facilitate or tolerate illicit capital movement or non-certified supply chain activity.</p>

          <h3>3. Board Interventions</h3>
          <p>The AfDEC Executive Board reserves the absolute right to terminate platform access, revoke grant applications, or suspend corridor clearance for any entity that breaches trade ethics or acts against the strategic interests of North Carolina or our sovereign African partner states.</p>

          <h3>4. Intellectual Property of the Mandate</h3>
          <p>The "Strategic Framework 2026-2030," "Africa Intelligence Terminal," and all associated methodology are the exclusive intellectual property of the African Diaspora Economic Council. Unauthorized reproduction of these strategic blueprints is strictly prohibited.</p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
