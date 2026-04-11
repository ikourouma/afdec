"use client";

import React from "react";
import Link from "next/link";
import { TopNav } from "@/components/ui/top-nav";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { 
  Network, Shield, Globe, TrendingUp, Users, 
  Map as MapIcon, BookOpen, Newspaper, Heart, 
  Building2, ArrowRight, Landmark, Zap
} from "lucide-react";

const SITEMAP_DATA = [
  {
    category: "Institutional Core",
    icon: Shield,
    links: [
      { name: "Sovereign Nexus (Home)", href: "/" },
      { name: "About the Council", href: "/about" },
      { name: "Sovereign Leadership Hub", href: "/about/leadership" },
      { name: "Strategic Framework (2030)", href: "/about/strategic-framework" },
      { name: "Global Careers", href: "/careers" },
      { name: "Annual Institutional Report", href: "/annual-report" },
      { name: "Institutional FAQ Vault", href: "/faqs" },
    ]
  },
  {
    category: "Economic Corridors",
    icon: Globe,
    links: [
      { name: "Transatlantic Corridor Hub", href: "/corridor" },
      { name: "Regional Market Access", href: "/corridor/markets" },
      { name: "Export & Trade Logistics", href: "/corridor/export-trade" },
      { name: "Enterprise Expansion Suite", href: "/corridor/expansion" },
      { name: "Dual-Continent Business Hub", href: "/dual-continent-business-hub" },
      { name: "Sovereign Incentives & Grants", href: "/sovereign-incentives-grants" },
    ]
  },
  {
    category: "Sovereign Intelligence",
    icon: Zap,
    links: [
      { name: "Africa Intelligence Terminal", href: "/africa-intelligence" },
      { name: "Sovereign Insights Hub", href: "/insights" },
      { name: "Real-Time Data Terminal", href: "/insights/data-terminal" },
      { name: "Policy Publications", href: "/insights/policy" },
      { name: "Institutional Newsroom", href: "/news" },
      { name: "Digital Media Archive", href: "/media" },
    ]
  },
  {
    category: "Ecosystem & Impact",
    icon: Heart,
    links: [
      { name: "Diaspora Impact Fund", href: "/diaspora-impact-fund" },
      { name: "Fund Interest Portal", href: "/diaspora-impact-fund/interest" },
      { name: "SME Application Portal", href: "/diaspora-impact-fund/apply" },
      { name: "Sovereign Industrial Sectors", href: "/sectors" },
      { name: "Institutional Events", href: "/events" },
      { name: "Transatlantic Tourism Hub", href: "/tourism" },
    ]
  },
  {
    category: "Governance & Vault",
    icon: Landmark,
    links: [
      { name: "Privacy Policy", href: "/compliance/privacy-policy" },
      { name: "Terms of Service", href: "/compliance/terms-of-service" },
      { name: "Cookie Policy", href: "/compliance/cookie-policy" },
      { name: "Accessibility Statement", href: "/compliance/accessibility" },
      { name: "Contact the Council", href: "/contact" },
      { name: "Member Portal", href: "/auth" },
    ]
  }
];

export default function SitemapPage() {
  return (
    <main className="min-h-screen bg-zinc-950 font-sans selection:bg-blue-500/30">
      <div className="sticky top-0 z-[100] w-full flex flex-col">
        <TopNav />
        <Header />
      </div>
      <Breadcrumb />

      <section className="max-w-[1600px] mx-auto px-6 lg:px-12 py-24">
        <div className="mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 mb-8 rounded-full">
            <Network className="w-3 h-3 text-blue-500" />
            <span className="text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase">Architecture Mapping</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-white tracking-tight leading-[0.95] mb-8">
            The Sovereign<br />Sitemap.
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl font-medium">
            Explore the full architectural layout of the AfDEC institutional platform — encompassing core pillars, economic corridors, and sovereign intelligence hubs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-10">
          {SITEMAP_DATA.map((group) => {
            const Icon = group.icon;
            return (
              <div key={group.category} className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg">
                    <Icon className="w-5 h-5 text-zinc-400" />
                  </div>
                  <h2 className="text-xs font-black text-white uppercase tracking-[0.3em]">
                    {group.category}
                  </h2>
                </div>
                
                <div className="space-y-4">
                  {group.links.map((link) => (
                    <Link 
                      key={link.href} 
                      href={link.href}
                      className="group flex items-center justify-between py-2 border-b border-zinc-900 hover:border-zinc-800 transition-colors"
                    >
                      <span className="text-[13px] font-medium text-zinc-500 group-hover:text-white transition-colors">
                        {link.name}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-800 group-hover:text-blue-500 transition-colors opacity-0 group-hover:opacity-100" />
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Audit Disclaimer */}
        <div className="mt-32 p-10 bg-zinc-900/40 border border-zinc-800 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 rounded-full border-2 border-zinc-800 border-t-blue-500 animate-spin flex items-center justify-center p-3">
               <Shield className="w-4 h-4 text-zinc-600 animate-none" />
            </div>
            <div>
              <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Architecture integrity audit</div>
              <div className="text-zinc-200 font-bold">29 Active Nodes Detected</div>
            </div>
          </div>
          <p className="text-zinc-500 text-sm max-w-md text-center md:text-right italic">
            "The sitemap is dynamically updated to reflect the evolving institutional mandates of the Africa-Focused Diaspora Economic Council."
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
