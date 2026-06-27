"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowRight, ShieldCheck, Lock, Globe2, CreditCard } from "lucide-react";
import { TopNav } from "@/components/ui/top-nav";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { FlashBanner } from "@/components/ui/flash-banner";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function ContributePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(".reveal-hero", 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" }
    );
  }, { scope: containerRef });

  return (
    <main ref={containerRef} className="min-h-screen bg-zinc-950 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      <div className="sticky top-0 z-[100] w-full flex flex-col">
        <TopNav />
        <FlashBanner />
        <Header />
      </div>
      <Breadcrumb />

      <section className="relative min-h-[90vh] flex items-center bg-[#080808] border-b border-zinc-800/50 overflow-hidden py-24">
        {/* Layer 1: Background Depth */}
        <div className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?q=80&w=2670&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/90 to-zinc-950/40" />
        
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Column: Narrative */}
            <div className="max-w-2xl">
              <div className="reveal-hero inline-flex items-center space-x-2 px-3 py-1 bg-amber-950/30 border border-amber-900/50 mb-8 rounded-full backdrop-blur-md">
                <Globe2 className="w-4 h-4 text-amber-500" />
                <span className="text-[11px] font-bold tracking-[0.2em] text-amber-500 uppercase">Impact Capital Portal</span>
              </div>
              
              <h1 className="reveal-hero text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] mb-8">
                Deploy Sovereign <br/>Capital.
              </h1>
              
              <p className="reveal-hero text-lg md:text-xl text-zinc-400 font-medium leading-relaxed mb-10">
                Support the AfDEC Diaspora Impact Fund. Your contribution directly capitalizes verified cross-border infrastructure, ag-tech deployment, and sovereign enterprise expansion between North Carolina and the African continent.
              </p>
              
              <div className="reveal-hero flex items-center space-x-6 text-sm font-bold text-zinc-500 uppercase tracking-widest">
                <div className="flex items-center"><ShieldCheck className="w-4 h-4 text-emerald-500 mr-2" /> Audited</div>
                <div className="flex items-center"><Lock className="w-4 h-4 text-emerald-500 mr-2" /> Encrypted</div>
              </div>
            </div>

            {/* Right Column: Payment/Contribution Module */}
            <div className="reveal-hero relative">
              {/* Payment Terminal (Visual representation for MVP, prior to Stripe integration) */}
              <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-700/50 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px]" />
                
                <h3 className="text-2xl font-black text-white mb-2 relative z-10">Direct Contribution</h3>
                <p className="text-zinc-400 text-sm mb-8 relative z-10">Select an investment tier to capitalize the framework.</p>

                <div className="space-y-4 mb-8 relative z-10">
                  <div className="grid grid-cols-3 gap-4">
                    {["$500", "$1,000", "$5,000"].map((amt, i) => (
                      <button key={i} className={`py-4 rounded-lg border font-black text-lg transition-colors ${i === 1 ? 'bg-amber-500 border-amber-500 text-zinc-950' : 'bg-zinc-950 border-zinc-800 text-white hover:border-amber-500/50'}`}>
                        {amt}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-black text-lg">$</span>
                    <input type="text" placeholder="Custom Amount" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-4 pl-8 pr-4 text-white font-black text-lg focus:outline-none focus:border-amber-500 transition-colors" />
                  </div>
                </div>

                <div className="space-y-4 relative z-10">
                  <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Payment Method</h4>
                  <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center justify-center opacity-50 cursor-not-allowed">
                     <CreditCard className="w-5 h-5 text-zinc-500 mr-3" />
                     <span className="text-sm font-bold text-zinc-500">Stripe Terminal Offline (Pre-Launch)</span>
                  </div>
                </div>

                <button disabled className="w-full mt-8 bg-zinc-800 text-zinc-500 font-black tracking-widest uppercase py-5 rounded-lg border border-zinc-700 cursor-not-allowed transition-all relative z-10">
                  Secure Processing Unavailable
                </button>
                <p className="text-xs text-zinc-600 mt-4 text-center">
                  Live payment gateway integration (Stripe for Nonprofits) will be activated upon formal Secretariat deployment.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Why Contribute ── */}
      <section className="bg-zinc-950 py-24 border-b border-zinc-900">
         <div className="max-w-[1600px] mx-auto px-6 lg:px-12 text-center">
            <h2 className="text-3xl font-black text-white mb-16 tracking-tight">Institutional Impact Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="p-8 border border-zinc-800 rounded-lg bg-zinc-900/30">
                  <div className="text-4xl font-black text-amber-500 mb-4">100%</div>
                  <h4 className="text-white font-bold text-lg mb-2">Deployed Capital</h4>
                  <p className="text-zinc-500 text-sm">Direct capital allocation into structural assets and active tech corridors. Overhead is subsidized by corporate underwriting.</p>
               </div>
               <div className="p-8 border border-zinc-800 rounded-lg bg-zinc-900/30">
                  <div className="text-4xl font-black text-emerald-500 mb-4">501(c)(4)</div>
                  <h4 className="text-white font-bold text-lg mb-2">Sovereign Compliance</h4>
                  <p className="text-zinc-500 text-sm">Contributions empower bold, structural policy advocacy at the intersection of US and African Union legislative chambers.</p>
               </div>
               <div className="p-8 border border-zinc-800 rounded-lg bg-zinc-900/30">
                  <div className="text-4xl font-black text-blue-500 mb-4">$1.2B</div>
                  <h4 className="text-white font-bold text-lg mb-2">Market Multiplier</h4>
                  <p className="text-zinc-500 text-sm">The projected downstream economic output triggered by AfDEC's initial strategic corridor development.</p>
               </div>
            </div>
         </div>
      </section>

      <Footer />
    </main>
  );
}
