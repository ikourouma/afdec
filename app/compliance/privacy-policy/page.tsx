"use client";

import React from "react";
import { TopNav } from "@/components/ui/top-nav";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function PrivacyPolicyPage() {
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
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-950/40 border border-blue-900/30 rounded-full mb-6">
            <Shield className="w-3 h-3 text-blue-400" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-blue-400 uppercase">Institutional Protocol</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            Global Data Privacy<br />& Sovereignty Protocol
          </h1>
          <p className="text-sm font-bold text-emerald-500 tracking-widest uppercase mb-10">Last Ratified: October 14, 2026</p>
          <div className="h-px w-full bg-gradient-to-r from-zinc-800 to-transparent"></div>
        </div>

        <div className="prose prose-invert prose-zinc max-w-none prose-h3:text-blue-400 prose-h3:text-lg prose-h3:tracking-wide prose-h3:font-bold prose-h3:mt-12 prose-p:leading-relaxed prose-p:text-zinc-400 prose-li:text-zinc-400">
          <p className="text-lg leading-relaxed text-zinc-300 mb-8 italic">
            The African Diaspora Economic Council (AfDEC) operates under Tier-1 data sovereignty regulations. This protocol dictates the absolute safeguarding of enterprise and delegate telemetry traversing our international network corridors.
          </p>

          <h3>1. The Sovereign Data Gateway</h3>
          <p>Information submitted through our Contact and Dashboard portals is encrypted instantly at the perimeter using asymmetrical cryptography (AES-256). AfDEC does not retain personal telemetry outside of explicit mandate clearance.</p>
          
          <ul className="space-y-4 list-none pl-0 my-8">
            {[
              "AES-256 endpoint encryption at the institutional perimeter.",
              "Zero-knowledge storage architecture for sovereign trade documents.",
              "Biometric audit trails for all executive-level data access."
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <h3>2. Intercontinental Data Routing</h3>
          <p>Given our dual mandate across North Carolina and active African sovereign states, your data may traverse transatlantic fiber corridors. We utilize localized node structures ensuring compliance with both federal US regulations and continental African Union data protection directives.</p>

          <h3>3. Enterprise Telemetry Rights</h3>
          <p>Any organization registered within the AfDEC infrastructure retains the absolute right to mandate a "Telemetry Purge." Upon formal notification, our system architecture will permanently erase all non-regulatory historical data linked to the organization's unique ID.</p>

          <h3>4. Third-Party Intelligence Restrictions</h3>
          <p>AfDEC will never sell, lease, or distribute member telemetry to third-party commercial entities. Data sharing is limited strictly to Bilateral State Partners and Multilateral Institutions (e.g., AfDB, World Bank) exclusively when required for grant disbursement or trade clearance.</p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
