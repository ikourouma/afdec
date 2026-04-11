"use client";

import React from "react";
import { TopNav } from "@/components/ui/top-nav";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Shield, Accessibility, Globe, CheckCircle } from "lucide-react";

export default function AccessibilityPage() {
  return (
    <main className="min-h-screen bg-zinc-950 font-sans selection:bg-blue-500/30">
      <div className="sticky top-0 z-[100] w-full flex flex-col">
        <TopNav />
        <Header />
      </div>
      <Breadcrumb />

      <section className="max-w-[1600px] mx-auto px-6 lg:px-12 py-24">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-950/40 border border-blue-900/30 mb-8 rounded-full">
            <Accessibility className="w-4 h-4 text-blue-400" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-blue-400 uppercase">Institutional Inclusion</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-8">
            Accessibility<br />Statement
          </h1>
          
          <div className="space-y-12">
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Our Commitment</h2>
              <p className="text-zinc-400 leading-relaxed text-lg">
                AfDEC is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards to our sovereign platform.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-zinc-900/30 border border-zinc-800 rounded-xl">
                <Globe className="w-8 h-8 text-blue-500 mb-6" />
                <h3 className="text-lg font-bold text-white mb-3">Conformance Status</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. AfDEC is partially conformant with WCAG 2.1 level AA.
                </p>
              </div>
              <div className="p-8 bg-zinc-900/30 border border-zinc-800 rounded-xl">
                <Shield className="w-8 h-8 text-emerald-500 mb-6" />
                <h3 className="text-lg font-bold text-white mb-3">Feedback Node</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  We welcome your feedback on the accessibility of the AfDEC platform. Please let us know if you encounter accessibility barriers by contacting our technical team.
                </p>
              </div>
            </div>

            <div className="border-t border-zinc-800 pt-12">
              <h2 className="text-xl font-bold text-white mb-6">Technical Specifications</h2>
              <div className="space-y-4">
                {[
                  "Semantic HTML structure for screen readers",
                  "High-contrast ratios for all institutional typography",
                  "Keyboard-only navigation support for active nodes",
                  "Aria-label implementation for interactive components",
                  "Responsive design ensuring accessibility across all device viewports"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    <span className="text-zinc-400 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
