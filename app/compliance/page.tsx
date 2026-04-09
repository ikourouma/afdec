"use client";

import React, { useState } from "react";
import { TopNav } from "@/components/ui/top-nav";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Shield, BookOpen, Cookie, Accessibility, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

const TABS = [
  { id: "privacy", label: "Data Privacy Protocol", icon: Shield },
  { id: "tos", label: "Terms of Sovereignty", icon: BookOpen },
  { id: "cookies", label: "Telemetry & Cookies", icon: Cookie },
  { id: "a11y", label: "Accessibility Mandate", icon: Accessibility }
];

export default function ComplianceVaultPage() {
  const [activeTab, setActiveTab] = useState("privacy");

  return (
    <main className="min-h-screen bg-zinc-950 font-sans text-zinc-300 selection:bg-blue-500/30 selection:text-white flex flex-col">
      <div className="sticky top-0 z-[100] w-full flex flex-col">
        <TopNav />
        <Header />
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-24 flex flex-col md:flex-row gap-12">
        
        {/* Left Sidebar - Compliance Directory */}
        <div className="w-full md:w-64 shrink-0">
          <div className="sticky top-48">
            <h1 className="text-3xl font-black text-white tracking-tight mb-8">Compliance Vault.</h1>
            <nav className="flex flex-col space-y-2 relative">
              <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-zinc-800"></div>
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center px-6 py-3 text-sm font-bold tracking-wide transition-all group ${isActive ? 'text-white bg-zinc-900/50' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-blue-500 rounded-r-md"></div>}
                    <Icon className={`w-4 h-4 mr-3 ${isActive ? 'text-blue-500' : 'text-zinc-600 group-hover:text-zinc-400'}`} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Right Content - Institutional Text Blocks */}
        <div className="flex-1 bg-zinc-900/20 border border-zinc-800/50 rounded-sm p-8 md:p-12 mb-20">
          
          {activeTab === 'privacy' && (
            <div className="animate-fade-in space-y-8">
               <div className="border-b border-zinc-800 pb-8">
                 <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Global Data Privacy Protocol</h2>
                 <p className="text-xs font-bold text-emerald-500 tracking-widest uppercase">Last Ratified: October 14, 2026</p>
               </div>
                <div className="prose prose-invert prose-zinc max-w-none prose-h3:text-blue-400 prose-h3:text-lg prose-h3:tracking-wide prose-p:leading-relaxed prose-p:text-zinc-400 prose-li:text-zinc-400">
                  <p className="mb-8">The African Diaspora Economic Council (AfDEC) operates under Tier-1 data sovereignty regulations. This protocol dictates the absolute safeguarding of enterprise and delegate telemetry traversing our international network corridors.</p>
                  
                  <h3>1. The Sovereign Data Gateway</h3>
                  <p>Information submitted through our Contact and Dashboard portals is encrypted instantly at the perimeter using asymmetrical cryptography. AfDEC does not retain personal telemetry outside of explicit mandate clearance.</p>
                  
                  <ul className="space-y-4 list-none pl-0 my-8">
                    {[
                      "AES-256 endpoint encryption at the institutional perimeter.",
                      "Zero-knowledge storage architecture for sovereign trade documents.",
                      "Biometric audit trails for all executive-level data access."
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <h3>2. Intercontinental Data Routing</h3>
                  <p>Given our dual mandate across North Carolina and active African sovereign states, your data may traverse transatlantic fiber corridors. We utilize localized node structures ensuring compliance with both federal US regulations and continental African Union data protection directives.</p>
                </div>
            </div>
          )}

          {activeTab === 'tos' && (
            <div className="animate-fade-in space-y-8">
               <div className="border-b border-zinc-800 pb-8">
                 <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Terms of Sovereignty (ToS)</h2>
                 <p className="text-xs font-bold text-emerald-500 tracking-widest uppercase">Last Ratified: October 14, 2026</p>
               </div>
                <div className="prose prose-invert prose-zinc max-w-none prose-h3:text-blue-400 prose-h3:text-lg prose-h3:tracking-wide prose-p:leading-relaxed prose-p:text-zinc-400">
                  <p className="mb-8">By bypassing the AfDEC Gateway and accessing our Deal Rooms or public Intelligence outputs, you agree to rigorous corporate operating behaviors.</p>
                  
                  <h3>1. Capital Allocation Integrity</h3>
                  <p>Any financial data or modeling presented in the deal rooms is highly classified. Unauthorized scraping, distribution, or manipulation of AfDEC project valuations will immediately trigger IP isolation protocols and legal deterrence.</p>
                  
                  <ul className="space-y-4 list-none pl-0 my-8">
                    {[
                      "Non-disclosure of proprietary trade corridor valuations.",
                      "Prohibition of automated data extraction without API licensure.",
                      "Consent to institutional monitoring within deal room environments."
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <h3>2. Board Interventions</h3>
                  <p>The AfDEC Executive Board reserves the absolute right to terminate platform access to any entity that breaches transatlantic trade ethics or acts against the interests of North Carolina or our sovereign African partner states.</p>
                </div>
            </div>
          )}

          {activeTab === 'cookies' && (
            <div className="animate-fade-in space-y-8">
               <div className="border-b border-zinc-800 pb-8">
                 <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Telemetry & Cookie Governance</h2>
                 <p className="text-xs font-bold text-emerald-500 tracking-widest uppercase">Active Node Tracking</p>
               </div>
                <div className="prose prose-invert prose-zinc max-w-none prose-h3:text-blue-400 prose-h3:text-lg prose-h3:tracking-wide prose-p:leading-relaxed prose-p:text-zinc-400">
                  <p className="mb-8">We deploy critical systems cookies solely for routing efficiency and high-level behavioral telemetry. This ensures our Deal Rooms load instantly regardless of your geographical location.</p>
                  
                  <h3>1. Institutional Session State</h3>
                  <p>Required cookies govern your Super Admin / Deal Room authentication. These cannot be bypassed if you expect to interact with the backend.</p>
                  
                  <ul className="space-y-4 list-none pl-0 my-8">
                    {[
                      "Authentication session tokens with 24-hour expiry.",
                      "CSRF protection tokens for secure data submission.",
                      "Language preference persistence for EN/FR routing."
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <h3>2. Translation Routing</h3>
                  <p>We store your EN / FR linguistic preference locally to ensure seamless traversal across platform documents without generating heavy edge-computing loads on our core servers.</p>
                </div>
            </div>
          )}

          {activeTab === 'a11y' && (
            <div className="animate-fade-in space-y-8">
               <div className="border-b border-zinc-800 pb-8">
                 <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Accessibility Mandate</h2>
                 <p className="text-xs font-bold text-emerald-500 tracking-widest uppercase">Universal Readability Protocol</p>
               </div>
                <div className="prose prose-invert prose-zinc max-w-none prose-h3:text-blue-400 prose-h3:text-lg prose-h3:tracking-wide prose-p:leading-relaxed prose-p:text-zinc-400">
                  <p className="mb-8">Execution requires clarity. AfDEC is committed to ensuring our platform is structurally robust and readable for all delegates, regardless of visual or physical interfacing parameters.</p>
                  
                  <h3>1. Contrast Compliance</h3>
                  <p>Our aesthetic (Zinc-950 and Blue-500) has been rigorously tested to meet WCAG 2.1 AA standards for high contrast clarity against structural data components.</p>
                  
                  <ul className="space-y-4 list-none pl-0 my-8">
                    {[
                      "Contrast ratios exceeding 7:1 for all primary text elements.",
                      "Semantic HTML5 structure for assistive technology compatibility.",
                      "Aria-label implementation for all interactive terminal buttons."
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <h3>2. Screen Routing</h3>
                  <p>The core terminal blocks and dashboard tables are structurally annotated, allowing screen readers and autonomous agents to accurately extract capital logic without faltering on visual layers.</p>
                </div>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </main>
  );
}
