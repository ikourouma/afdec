"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { TopNav } from "@/components/ui/top-nav";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { FlashBanner } from "@/components/ui/flash-banner";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ArrowRight, ShieldCheck, Landmark, Globe2, Building2 } from "lucide-react";

export default function GovernmentRelationsPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(".reveal-item", 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" }
    );
  }, { scope: containerRef });

  return (
    <main ref={containerRef} className="min-h-screen bg-zinc-950 font-sans selection:bg-blue-500/30 selection:text-blue-200">
      <div className="sticky top-0 z-[100] w-full flex flex-col">
        <TopNav />
        <FlashBanner />
        <Header />
      </div>
      <Breadcrumb />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center bg-[#080808] border-b border-zinc-800/50 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.25]"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1572099606223-6e29045d7de3?q=80&w=2670&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/90 to-zinc-950/40" />
        
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 relative z-10 py-24">
          <div className="max-w-3xl">
            <div className="reveal-item inline-flex items-center space-x-2 px-3 py-1 bg-zinc-800/80 border border-zinc-700/50 mb-6 rounded-full backdrop-blur-md">
              <Landmark className="w-4 h-4 text-blue-500" />
              <span className="text-[11px] font-bold tracking-[0.2em] text-zinc-400 uppercase">Sovereign Advisory Services</span>
            </div>
            
            <h1 className="reveal-item text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] mb-8">
              Bi-National Government Relations.
            </h1>
            
            <p className="reveal-item text-lg md:text-xl text-zinc-400 font-medium leading-relaxed mb-10">
              Navigating the intersection of North Carolina state legislation, US federal trade policy, and African Union continental frameworks. We provide sovereign-grade advisory for institutional enterprise expansion.
            </p>
            
            <div className="reveal-item flex flex-col sm:flex-row gap-4">
              <Link href="/contact?topic=government-relations" className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold tracking-widest text-sm uppercase px-8 py-4 rounded transition-all shadow-[0_0_30px_-5px_rgba(37,99,235,0.4)]">
                Request Consultation
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-zinc-950 border-b border-zinc-900">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16 reveal-item">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">Core Strategic Competencies</h2>
            <p className="text-zinc-400 text-lg leading-relaxed">
              Our Government Relations desk operates natively within state legislatures and international trade tribunals, ensuring seamless deployment of capital.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="reveal-item p-8 bg-zinc-900/40 border border-zinc-800 rounded-lg hover:bg-zinc-900/80 transition-colors">
              <ShieldCheck className="w-10 h-10 text-emerald-500 mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">Regulatory Navigation</h3>
              <p className="text-zinc-400 leading-relaxed text-sm">
                Direct advisory on complying with both NC Department of Commerce mandates and African Continental Free Trade Area (AfCFTA) regulations.
              </p>
            </div>
            
            <div className="reveal-item p-8 bg-zinc-900/40 border border-zinc-800 rounded-lg hover:bg-zinc-900/80 transition-colors">
              <Globe2 className="w-10 h-10 text-blue-500 mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">Bilateral Trade Corridors</h3>
              <p className="text-zinc-400 leading-relaxed text-sm">
                Structuring public-private partnerships (PPPs) that align with foreign direct investment incentives and sovereign wealth guidelines.
              </p>
            </div>
            
            <div className="reveal-item p-8 bg-zinc-900/40 border border-zinc-800 rounded-lg hover:bg-zinc-900/80 transition-colors">
              <Building2 className="w-10 h-10 text-amber-500 mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">Legislative Advocacy</h3>
              <p className="text-zinc-400 leading-relaxed text-sm">
                Advocating for favorable economic deployment zones, tax incentives, and streamlined customs frameworks on behalf of AfDEC members.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-950/20 border-b border-blue-900/30">
         <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center reveal-item">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">Engage the Secretariat</h2>
            <p className="text-zinc-300 text-lg leading-relaxed mb-10">
              For complex cross-border infrastructure initiatives, direct coordination with our Government Relations team is essential. Complete an outreach form to initiate a secure advisory session.
            </p>
            <Link href="/contact?topic=government-relations" className="inline-flex items-center justify-center gap-2 bg-white hover:bg-zinc-200 text-blue-950 font-black tracking-widest text-sm uppercase px-10 py-5 rounded transition-all">
              Initiate Outreach Form
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
         </div>
      </section>

      <Footer />
    </main>
  );
}
