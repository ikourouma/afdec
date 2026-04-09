"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TopNav } from "@/components/ui/top-nav";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Newsletter } from "@/components/ui/newsletter";
import { FlashBanner } from "@/components/ui/flash-banner";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { 
  BarChart3, 
  FileText, 
  Download, 
  TrendingUp, 
  Building2, 
  ArrowRight, 
  ShieldCheck, 
  Globe2, 
  Users,
  Presentation
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const reports = [
  {
    year: "2023 Executive Briefing",
    title: "The Bi-National Mandate: Year One",
    type: "Board Report",
    size: "4.2 MB",
    description: "The baseline telemetry report for the AfDEC ecosystem, outlining the initial formation of the NC-Africa trade corridor.",
    status: "Published",
    accent: "text-blue-500 bg-blue-500/5",
    icon: FileText
  },
  {
    year: "2024 Institutional Review",
    title: "Capital Formation & Infrastructure EPC",
    type: "Impact Analysis",
    size: "6.8 MB",
    description: "Detailed analysis of capital deployment across 12 African markets and North Carolina industrial parks.",
    status: "Published",
    accent: "text-emerald-500 bg-emerald-500/5",
    icon: BarChart3
  },
  {
    year: "2025 Sovereign Telemetry",
    title: "The Digital Corridor & EPC Mandates",
    type: "Quarterly Review",
    size: "3.1 MB",
    description: "Tracking the activation of the AfDEC Digital Portal and its impact on bi-national procurement efficiency.",
    status: "Published",
    accent: "text-purple-500 bg-purple-500/5",
    icon: Globe2
  }
];

export default function AnnualReportPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(".report-card", 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: "power3.out" }
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

      {/* ── Hero: Sovereign Telemetry ── */}
      <section className="relative bg-zinc-950 border-b border-zinc-800/50 overflow-hidden">
        {/* Layer 1: Data Depth */}
        <div
          className="absolute inset-0 opacity-[0.25]"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1551288049-bbdac8a28a1e?q=80&w=2070&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        
        {/* Layer 2: Institutional Digital Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.045] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.5'%3E%3Cpath d='M0 20h40M20 0v40'/%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: "40px 40px" }} />

        {/* Layer 3: Cinematic Reveal Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-zinc-950/20" />
        
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-24 md:py-32 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-500/10 border border-blue-500/30 mb-6 rounded-full backdrop-blur-md">
            <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-[11px] font-bold tracking-[0.2em] text-blue-500 uppercase">Executive Telemetry</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] max-w-4xl">
            Bi-National Impact &<br/>Sovereign Telemetry
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 mt-8 max-w-2xl leading-relaxed font-medium">
            We operate with radical transparency at the institutional level. Access the official record of AfDEC&apos;s impact on global capital movement, industrial growth, and diaspora engagement.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      </section>

      {/* ── Macro Impact Summaries ── */}
      <section className="bg-zinc-950 py-24 md:py-32 border-b border-zinc-900">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="space-y-6">
              <div className="w-12 h-12 bg-blue-600/10 rounded-sm flex items-center justify-center border border-blue-600/20">
                <Building2 className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">Institutional Stability</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                AfDEC facilitates the sovereign-level risk mitigation needed for institutional capital to flow safely into emerging high-growth markets.
              </p>
            </div>
            <div className="space-y-6">
              <div className="w-12 h-12 bg-emerald-600/10 rounded-sm flex items-center justify-center border border-emerald-600/20">
                <Globe2 className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">Trade Lane Optimization</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Reducing the friction of crossing borders through the AfDEC Digital Corridor, yielding an average 24% reduction in logistics timelines.
              </p>
            </div>
            <div className="space-y-6">
              <div className="w-12 h-12 bg-purple-600/10 rounded-sm flex items-center justify-center border border-purple-600/20">
                <ShieldCheck className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">Governance & Compliance</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Operating under the highest standards of international governance mandated by the African Union and State of North Carolina.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Report Repository ── */}
      <section className="bg-[#080808] py-24 md:py-32">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-24">
            <div className="max-w-2xl">
              <span className="text-[11px] font-bold tracking-[0.2em] text-zinc-600 uppercase">Official Document Repository</span>
              <h2 className="text-3xl md:text-5xl font-black text-white mt-4 tracking-tight leading-tight">Historical Briefings & Reviews</h2>
            </div>
            <Link href="/dashboard/admin/hero" className="flex items-center space-x-2 text-[12px] font-black tracking-widest uppercase text-blue-500 transition-all hover:text-blue-400">
              <Download className="w-4 h-4" />
              <span>Full Archive Access</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reports.map((report) => (
              <div 
                key={report.year} 
                className="report-card group bg-zinc-900/40 border border-zinc-800 rounded-lg p-10 hover:border-zinc-700 transition-all duration-500 flex flex-col"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className={`w-12 h-12 rounded-sm flex items-center justify-center ${report.accent}`}>
                    <report.icon className="w-6 h-6" />
                  </div>
                  <div className="text-[10px] font-black text-zinc-500 tracking-widest uppercase">{report.year}</div>
                </div>
                
                <h3 className="text-2xl font-black text-white mb-2 leading-tight group-hover:text-blue-400 transition-colors">
                  {report.title}
                </h3>
                <div className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest mb-6">{report.type} • {report.size}</div>
                
                <p className="text-[14px] text-zinc-500 leading-relaxed mb-10 flex-grow">
                  {report.description}
                </p>
                
                <Link 
                  href="#" 
                  className="w-full flex items-center justify-between py-4 border-t border-zinc-800 group/link transition-all"
                >
                  <span className="text-[11px] font-black tracking-[0.25em] text-white uppercase flex items-center">
                    <Download className="w-3.5 h-3.5 mr-2 text-zinc-500 group-hover/link:text-blue-500" />
                    Download Briefing
                  </span>
                  <ArrowRight className="w-4 h-4 text-zinc-700 group-hover/link:translate-x-1 group-hover/link:text-blue-500 transition-all" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quarterly Call to Action ── */}
      <section className="bg-zinc-950 py-24 mb-10">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="bg-blue-600/5 border border-blue-500/20 rounded-lg p-10 md:p-20 text-center relative overflow-hidden">
            {/* Background design element */}
            <div className="absolute left-0 top-0 w-32 h-32 bg-blue-500/10 -translate-x-16 -translate-y-16 rounded-full blur-3xl" />
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <Presentation className="w-12 h-12 text-blue-500 mx-auto mb-8" />
              <h2 className="text-3xl md:text-5xl font-black text-white mb-8 tracking-tight">Q4 Bi-National Stakeholder Briefing</h2>
              <p className="text-lg text-zinc-400 leading-relaxed mb-10">
                Are you a sovereign stakeholder, board member, or institutional partner? Access the upcoming live quarterly presentation to review market telemetry for next quarter.
              </p>
              <Link href="/contact" className="inline-flex items-center px-10 py-5 bg-white text-zinc-950 text-[13px] font-black tracking-[0.25em] uppercase hover:bg-zinc-200 transition-all rounded-sm shadow-xl">
                Register for Briefing Access
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="relative">
        <Newsletter />
        <Footer />
      </div>
    </main>
  );
}
