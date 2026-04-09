"use client";

import React, { useRef } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TopNav } from "@/components/ui/top-nav";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { FlashBanner } from "@/components/ui/flash-banner";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Newsletter } from "@/components/ui/newsletter";
import { SideNav } from "@/components/ui/side-nav";
import { getCorridorPage, type CorridorPage, type CorridorSection } from "@/lib/corridor-data";
import { getIntegrationPage } from "@/lib/all-pages-data";
import { AfricaMapEmbed } from "@/components/sections/africa-map-embed";
import { MapTeaser } from "@/components/sections/africa-map-teaser";
import {
  ArrowRight, TrendingUp, Network, Award, Globe, Users, Briefcase,
  Home, BookOpen, Sun, Zap, Leaf, BarChart, Scale, FileText, Handshake,
  GraduationCap, ShieldCheck, Heart, ChevronRight, CheckCircle2
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ── Icon resolver ──────────────────────────────────────────────────────────
const iconMap: Record<string, React.ElementType> = {
  TrendingUp, Network, Award, Globe, Users, Briefcase, Heart, Home,
  BookOpen, Sun, Zap, Leaf, BarChart, Scale, FileText, Handshake,
  GraduationCap, ShieldCheck,
};
function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const Icon = iconMap[name] ?? Globe;
  return <Icon className={className} />;
}

// ── Accent color map (mirrored from initiatives) ──────────────────────────
const accentMap: Record<string, { border: string; text: string; bg: string; badge: string; btn: string; stat: string; dim: string }> = {
  blue:    { border: "border-blue-500/50",   text: "text-blue-400",    bg: "bg-blue-600/10",    badge: "bg-blue-900/30 text-blue-400 border-blue-800",    btn: "bg-blue-600 hover:bg-blue-700",    stat: "text-blue-400",    dim: "bg-blue-600/5" },
  emerald: { border: "border-emerald-500/50",text: "text-emerald-400", bg: "bg-emerald-600/10", badge: "bg-emerald-900/30 text-emerald-400 border-emerald-800", btn: "bg-emerald-600 hover:bg-emerald-700", stat: "text-emerald-400", dim: "bg-emerald-600/5" },
  amber:   { border: "border-amber-500/50",  text: "text-amber-400",   bg: "bg-amber-600/10",   badge: "bg-amber-900/30 text-amber-400 border-amber-800",   btn: "bg-amber-600 hover:bg-amber-700",   stat: "text-amber-400",   dim: "bg-amber-600/5" },
  purple:  { border: "border-purple-500/50", text: "text-purple-400",  bg: "bg-purple-600/10",  badge: "bg-purple-900/30 text-purple-400 border-purple-800",  btn: "bg-purple-600 hover:bg-purple-700",  stat: "text-purple-400",  dim: "bg-purple-600/5" },
  green:   { border: "border-green-500/50",  text: "text-green-400",   bg: "bg-green-600/10",   badge: "bg-green-900/30 text-green-400 border-green-800",   btn: "bg-green-600 hover:bg-green-700",   stat: "text-green-400",   dim: "bg-green-600/5" },
};

// ── Section Components ─────────────────────────────────────────────────────
function TextColumnsSection({ section, colors }: { section: CorridorSection; colors: typeof accentMap["blue"] }) {
  const { heading, body, columns } = section.data;
  return (
    <div className="py-20 border-b border-zinc-800/50">
      <div className="max-w-3xl mb-14">
        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-6">{heading}</h2>
        <p className="text-lg text-zinc-400 font-medium leading-relaxed">{body}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((col: { icon: string; title: string; body: string }, i: number) => (
          <div key={i} className={`p-8 rounded-lg bg-zinc-900/60 border border-zinc-800 hover:${colors.border} transition-all duration-300 group`}>
            <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center mb-6`}>
              <DynamicIcon name={col.icon} className={`w-6 h-6 ${colors.text}`} />
            </div>
            <h3 className={`font-black text-white mb-3 tracking-tight group-hover:${colors.text} transition-colors`}>{col.title}</h3>
            <p className="text-sm text-zinc-500 leading-relaxed font-medium">{col.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroStatsSection({ section, colors }: { section: CorridorSection; colors: typeof accentMap["blue"] }) {
  const { stats } = section.data;
  return (
    <div className="py-20 border-b border-zinc-800/50">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-800/50 rounded-lg overflow-hidden">
        {stats.map((stat: { value: string; label: string; sub: string }, i: number) => (
          <div key={i} className="bg-zinc-950 p-10 text-center">
            <div className={`text-4xl md:text-5xl font-black mb-2 ${colors.stat}`}>{stat.value}</div>
            <div className="text-white font-bold text-lg mb-1">{stat.label}</div>
            <div className="text-zinc-500 text-sm font-medium">{stat.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PipelineGridSection({ section, colors }: { section: CorridorSection; colors: typeof accentMap["blue"] }) {
  const { heading, body, items } = section.data;
  const statusColor: Record<string, string> = {
    Active:     "bg-emerald-900/40 text-emerald-400 border-emerald-800/50",
    Growing:    "bg-blue-900/40 text-blue-400 border-blue-800/50",
    Monitoring: "bg-zinc-800/80 text-zinc-400 border-zinc-700/50",
  };
  return (
    <div className="py-20 border-b border-zinc-800/50">
      <div className="max-w-3xl mb-14">
        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-6">{heading}</h2>
        <p className="text-lg text-zinc-400 font-medium leading-relaxed">{body}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item: { icon: string; title: string; sub: string; status: string; markets: string }, i: number) => (
          <div key={i} className={`bg-zinc-900/50 border border-zinc-800 hover:${colors.border} rounded-lg p-6 transition-all duration-300 group`}>
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center shrink-0`}>
                <DynamicIcon name={item.icon} className={`w-5 h-5 ${colors.text}`} />
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${statusColor[item.status] ?? statusColor.Monitoring}`}>
                {item.status}
              </span>
            </div>
            <h3 className={`font-black text-white mb-1 group-hover:${colors.text} transition-colors`}>{item.title}</h3>
            <p className="text-xs text-zinc-500 font-medium mb-3">{item.sub}</p>
            <div className="flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-zinc-700" />
              <span className="text-[10px] text-zinc-600 font-medium">{item.markets}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CtaSection({ section, colors }: { section: CorridorSection; colors: typeof accentMap["blue"] }) {
  const { heading, body, primary_label, primary_href, secondary_label, secondary_href } = section.data;
  return (
    <div className="py-20">
      <div className={`bg-zinc-900/60 border ${colors.border} rounded-lg p-12 md:p-16 relative overflow-hidden`}>
        <div className={`absolute -right-24 -top-24 w-72 h-72 rounded-full ${colors.dim} blur-[80px] opacity-60`} />
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-6">{heading}</h2>
          <p className="text-zinc-400 text-lg leading-relaxed mb-10 font-medium">{body}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={primary_href} className={`inline-flex items-center justify-center px-8 py-4 ${colors.btn} text-white font-black text-sm uppercase tracking-widest rounded-sm transition-all shadow-lg group`}>
              {primary_label} <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href={secondary_href} className="inline-flex items-center justify-center px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-sm uppercase tracking-widest rounded-sm transition-all">
              {secondary_label}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Dot Nav ────────────────────────────────────────────────────────────────

// ── Page ───────────────────────────────────────────────────────────────────
export default function CorridorSubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  // Core corridor pages first, then integration mega-menu pages (same template)
  const page = (getCorridorPage(slug) ?? getIntegrationPage(slug)) as CorridorPage | null;

  if (!page) notFound();

  const colors = accentMap[page.accent] ?? accentMap.blue;
  const heroRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(heroRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" });
    gsap.fromTo(".corridor-section",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power2.out",
        scrollTrigger: { trigger: ".corridor-content", start: "top 90%" } }
    );
  }, { scope: undefined });

  return (
    <div className="min-h-screen bg-zinc-950 font-sans selection:bg-blue-500/30">
      <div className="sticky top-0 z-[100] w-full flex flex-col">
        <TopNav />
        <FlashBanner />
        <Header />
      </div>
      <Breadcrumb />

      {/* Dot nav */}
      <SideNav sections={page.sections} accentColor={page.accent === "emerald" || page.accent === "blue" || page.accent === "amber" || page.accent === "purple" || page.accent === "green" || page.accent === "red" ? page.accent : "blue"} />

      {/* ── Cinematic Hero ── */}
      <section className="relative bg-zinc-950 border-b border-zinc-800/50 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: `url('${page.hero_image}')`,
            backgroundSize: "cover",
            backgroundPosition: page.hero_image_position ?? "center",
          }}
        />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.5'%3E%3Cpath d='M0 30h60M30 0v60'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px"
        }} />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-zinc-950/20" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-zinc-950 to-transparent" />

        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-28 md:py-36 relative z-10" ref={heroRef}>
          {/* Breadcrumb trail */}
          <div className="flex items-center space-x-2 text-xs font-bold text-zinc-600 uppercase tracking-widest mb-8">
            <Link href="/" className="hover:text-zinc-400 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/corridor" className="hover:text-zinc-400 transition-colors">Corridor</Link>
            <ChevronRight className="w-3 h-3" />
            <span className={colors.text}>{page.label}</span>
          </div>

          <div className={`inline-flex items-center px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest mb-8 ${colors.badge}`}>
            {page.tag}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] max-w-4xl mb-6">
            {page.hero_title}
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 font-medium leading-relaxed max-w-2xl mb-10">
            {page.hero_subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/contact" className={`inline-flex items-center px-8 py-4 ${colors.btn} text-white font-black text-sm uppercase tracking-widest rounded-sm transition-all shadow-lg group`}>
              Engage This Program <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/corridor" className="inline-flex items-center px-8 py-4 bg-zinc-800/80 hover:bg-zinc-700 text-white font-bold text-sm uppercase tracking-widest rounded-sm transition-all backdrop-blur-sm">
              ← All Corridor Programs
            </Link>
          </div>
        </div>

        <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-${page.accent}-500/30 to-transparent`} />
      </section>

      {/* ── Section Dispatcher ── */}
      <main className="corridor-content max-w-[1600px] mx-auto px-6 lg:px-12">
        {page.sections.map((section) => (
          <div key={section.id} id={`section-${section.id}`} className="corridor-section">
            {section.type === "text_columns"  && <TextColumnsSection  section={section} colors={colors} />}
            {section.type === "hero_stats"    && <HeroStatsSection    section={section} colors={colors} />}
            {section.type === "pipeline_grid" && <PipelineGridSection section={section} colors={colors} />}
            {section.type === "cta"           && <CtaSection          section={section} colors={colors} />}
          </div>
        ))}
      </main>

      <MapTeaser
        heading="Explore African Markets — Live Data"
        subtext="Economic intelligence for every African nation relevant to this program. GDP, sector data, FDI flows, and AfDEC market assessments — updated in real time."
        accentColor={(page.accent === "blue" || page.accent === "emerald" || page.accent === "amber" || page.accent === "purple") ? page.accent : "blue"}
      />
      <Newsletter />
      <Footer />
    </div>
  );
}
