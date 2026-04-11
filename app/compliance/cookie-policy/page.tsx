"use client";

import React from "react";
import { TopNav } from "@/components/ui/top-nav";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Cookie, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function CookiePolicyPage() {
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
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-950/40 border border-emerald-900/30 rounded-full mb-6">
            <Cookie className="w-3 h-3 text-emerald-500" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-emerald-500 uppercase">Telemetry Governance</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            Telemetry & Cookie<br />Usage Mandate
          </h1>
          <p className="text-sm font-bold text-emerald-500 tracking-widest uppercase mb-10">Institutional Connectivity Transparency</p>
          <div className="h-px w-full bg-gradient-to-r from-zinc-800 to-transparent"></div>
        </div>

        <div className="prose prose-invert prose-zinc max-w-none prose-h3:text-emerald-500 prose-h3:text-lg prose-h3:tracking-wide prose-h3:font-bold prose-h3:mt-12 prose-p:leading-relaxed prose-p:text-zinc-400 prose-li:text-zinc-400">
          <p className="text-lg leading-relaxed text-zinc-300 mb-8 italic">
            AfDEC utilizes critical systems cookies solely for routing efficiency and high-level behavioral telemetry. This ensures our Deal Rooms and Intelligence Terminal load instantly across intercontinental fiber nodes.
          </p>

          <h3>1. Institutional Session Persistence</h3>
          <p>Required cookies govern your administrative and deal room authentication states. These are encrypted server-side and cannot be bypassed without compromising the integrity of the bilateral data exchange.</p>
          
          <ul className="space-y-4 list-none pl-0 my-8">
            {[
              "Highly-secure session tokens with mandatory 24-hour rotation.",
              "Cross-Site Request Forgery (CSRF) protection mechanisms.",
              "Load-balancing cookies for optimized transatlantic routing."
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2.5 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <h3>2. Analytics & Market Intelligence</h3>
          <p>We use localized telemetry to monitor which regions (e.g., North Carolina vs. West Africa) are interacting with specific sector data. This allows our Executive Board to more accurately allocate grant resources and diplomatic focus where market demand is highest.</p>

          <h3>3. Language Protocol Retention</h3>
          <p>The platform retains your preferred linguistic interface (English / French) using a structural local cookie. This avoids redundant edge-computing cycles and ensures a frictionless traversal of multilateral documents.</p>

          <h3>4. Opt-Out & Telemetry Control</h3>
          <p>While critical authentication cookies are mandatory for dashboard access, you may disable non-essential behavioral telemetry through your browser settings. Note that doing so may result in slightly higher latency when accessing heavy Intelligence Map datasets.</p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
