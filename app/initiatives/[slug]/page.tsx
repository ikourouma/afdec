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
import { getInitiative, type Initiative, type InitiativeSection } from "@/lib/initiatives-data";
import {
  ArrowRight, TrendingUp, Network, Award, Globe, Users, Briefcase, Heart,
  Home, BookOpen, Sun, Zap, Leaf, BarChart, Scale, FileText, Handshake,
  GraduationCap, ShieldCheck, Lock, Bell, CheckCircle2, ChevronRight
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

// ── Accent color map ───────────────────────────────────────────────────────
const accentMap: Record<string, { border: string; text: string; bg: string; badge: string; btn: string; stat: string }> = {
  blue:    { border: "border-blue-500/50",   text: "text-blue-400",    bg: "bg-blue-600/10",    badge: "bg-blue-900/30 text-blue-400 border-blue-800",    btn: "bg-blue-600 hover:bg-blue-700",    stat: "text-blue-400" },
  emerald: { border: "border-emerald-500/50",text: "text-emerald-400", bg: "bg-emerald-600/10", badge: "bg-emerald-900/30 text-emerald-400 border-emerald-800", btn: "bg-emerald-600 hover:bg-emerald-700", stat: "text-emerald-400" },
  amber:   { border: "border-amber-500/50",  text: "text-amber-400",   bg: "bg-amber-600/10",   badge: "bg-amber-900/30 text-amber-400 border-amber-800",   btn: "bg-amber-600 hover:bg-amber-700",   stat: "text-amber-400" },
  green:   { border: "border-green-500/50",  text: "text-green-400",   bg: "bg-green-600/10",   badge: "bg-green-900/30 text-green-400 border-green-800",   btn: "bg-green-600 hover:bg-green-700",   stat: "text-green-400" },
  purple:  { border: "border-purple-500/50", text: "text-purple-400",  bg: "bg-purple-600/10",  badge: "bg-purple-900/30 text-purple-400 border-purple-800",  btn: "bg-purple-600 hover:bg-purple-700",  stat: "text-purple-400" },
  red:     { border: "border-red-500/50",    text: "text-red-400",     bg: "bg-red-600/10",     badge: "bg-red-900/30 text-red-400 border-red-800",     btn: "bg-red-600 hover:bg-red-700",     stat: "text-red-400" },
};

// ── Section renderers ──────────────────────────────────────────────────────
function TextColumnsSection({ section, colors }: { section: InitiativeSection; colors: typeof accentMap["blue"] }) {
  const { heading, body, columns } = section.data;
  return (
    <div className="py-20 border-b border-zinc-800/50">
      <div className="max-w-3xl mb-14">
        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-6">{heading}</h2>
        <p className="text-lg text-zinc-400 font-medium leading-relaxed">{body}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((col: any, i: number) => (
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

function HeroStatsSection({ section, colors }: { section: InitiativeSection; colors: typeof accentMap["blue"] }) {
  const { stats } = section.data;
  return (
    <div className="py-20 border-b border-zinc-800/50">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-800/50 rounded-lg overflow-hidden">
        {stats.map((stat: any, i: number) => (
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

function CtaSection({ section, colors }: { section: InitiativeSection; colors: typeof accentMap["blue"] }) {
  const { heading, body, primary_label, primary_href, secondary_label, secondary_href } = section.data;
  return (
    <div className="py-20">
      <div className={`bg-zinc-900/60 border ${colors.border} rounded-lg p-12 md:p-16 relative overflow-hidden`}>
        <div className={`absolute -right-24 -top-24 w-72 h-72 rounded-full ${colors.bg} blur-[80px] opacity-50`} />
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

function ComingSoonSection({ section, colors }: { section: InitiativeSection; colors: typeof accentMap["blue"] }) {
  const { heading, body, features, notify_heading, notify_body } = section.data;
  return (
    <div className="py-20">
      {/* Locked overlay */}
      <div className="relative">
        <div className={`border ${colors.border} rounded-lg overflow-hidden mb-10`}>
          {/* Coming soon banner */}
          <div className={`${colors.bg} border-b ${colors.border} px-8 py-4 flex items-center justify-between`}>
            <div className="flex items-center space-x-3">
              <Lock className={`w-4 h-4 ${colors.text}`} />
              <span className={`text-sm font-black uppercase tracking-widest ${colors.text}`}>Initiative In Development</span>
            </div>
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Coming Soon</span>
          </div>

          {/* Preview content — blurred for non-members */}
          <div className="p-10 md:p-16 bg-zinc-900/40 relative">
            <div className="max-w-2xl mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-6">{heading}</h2>
              <p className="text-zinc-400 text-lg leading-relaxed font-medium">{body}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              {features.map((feature: string, i: number) => (
                <div key={i} className="flex items-start space-x-3">
                  <CheckCircle2 className={`w-5 h-5 ${colors.text} shrink-0 mt-0.5`} />
                  <span className="text-zinc-300 text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notify Me CTA */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-10 md:p-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-xl">
              <div className="flex items-center space-x-2 mb-4">
                <Bell className={`w-5 h-5 ${colors.text}`} />
                <h3 className="text-xl font-black text-white">{notify_heading}</h3>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed font-medium">{notify_body}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link href="/contact" className={`inline-flex items-center justify-center px-8 py-4 ${colors.btn} text-white font-black text-sm uppercase tracking-widest rounded-sm transition-all shadow-lg group`}>
                Register Interest <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/invest" className="inline-flex items-center justify-center px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-sm uppercase tracking-widest rounded-sm transition-all">
                Become a Member
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Dot Nav ────────────────────────────────────────────────────────────────
function DotNav({ sections, colors }: { sections: InitiativeSection[]; colors: typeof accentMap["blue"] }) {
  const [active, setActive] = React.useState(sections[0]?.id ?? "");

  const scrollTo = (id: string) => {
    const el = document.getElementById(`section-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(id);
  };

  return (
    <div className="hidden xl:flex fixed right-8 top-1/2 -translate-y-1/2 z-50 flex-col items-end space-y-3">
      {sections.map((s) => (
        <button
          key={s.id}
          onClick={() => scrollTo(s.id)}
          className="flex items-center group"
          title={s.label}
        >
          <span className={`text-[10px] font-bold uppercase tracking-widest mr-3 transition-all duration-200 ${active === s.id ? colors.text : "text-zinc-600 group-hover:text-zinc-400"} opacity-0 group-hover:opacity-100`}>
            {s.label}
          </span>
          <div className={`rounded-full transition-all duration-200 ${active === s.id ? `w-3 h-3 ${colors.text.replace("text-", "bg-")}` : "w-2 h-2 bg-zinc-700 group-hover:bg-zinc-500"}`} />
        </button>
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function InitiativePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const initiative = getInitiative(slug);

  if (!initiative) notFound();

  const colors = accentMap[initiative.accent] ?? accentMap.blue;
  const heroRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(heroRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" });
    gsap.fromTo(".initiative-section",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power2.out",
        scrollTrigger: { trigger: ".initiative-content", start: "top 90%" } }
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

      {/* Dot nav — desktop only */}
      <DotNav sections={initiative.sections} colors={colors} />

      {/* ── Cinematic Hero ── */}
      <section className="relative bg-zinc-950 border-b border-zinc-800/50 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: `url('${initiative.hero_image}')`,
            backgroundSize: "cover",
            backgroundPosition: initiative.hero_image_position ?? "center",
          }}
        />
        <div className="absolute inset-0 opacity-[0.035] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.5'%3E%3Cpath d='M0 30h60M30 0v60'/%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: "60px 60px" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-zinc-950/20" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-zinc-950 to-transparent" />

        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-28 md:py-36 relative z-10" ref={heroRef}>
          {/* Breadcrumb trail */}
          <div className="flex items-center space-x-2 text-xs font-bold text-zinc-600 uppercase tracking-widest mb-8">
            <Link href="/" className="hover:text-zinc-400 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-zinc-500">Initiatives</span>
            <ChevronRight className="w-3 h-3" />
            <span className={colors.text}>{initiative.label}</span>
          </div>

          <div className={`inline-flex items-center px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest mb-8 ${colors.badge}`}>
            {initiative.label}
            {initiative.is_gated && <Lock className="w-3 h-3 ml-2" />}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] max-w-4xl mb-6">
            {initiative.hero_title}
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 font-medium leading-relaxed max-w-2xl mb-10">
            {initiative.hero_subtitle}
          </p>

          {!initiative.is_gated && (
            <Link href="/contact" className={`inline-flex items-center px-8 py-4 ${colors.btn} text-white font-black text-sm uppercase tracking-widest rounded-sm transition-all shadow-lg group`}>
              Engage With This Initiative <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
          {initiative.is_gated && (
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className={`inline-flex items-center px-8 py-4 ${colors.btn} text-white font-black text-sm uppercase tracking-widest rounded-sm transition-all shadow-lg group`}>
                Register Interest <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/invest" className="inline-flex items-center px-8 py-4 bg-zinc-800/80 hover:bg-zinc-700 text-white font-bold text-sm uppercase tracking-widest rounded-sm transition-all backdrop-blur-sm">
                Become a Member
              </Link>
            </div>
          )}
        </div>

        <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-${initiative.accent}-500/30 to-transparent`} />
      </section>

      {/* ── Sections ── */}
      <main className="initiative-content max-w-[1600px] mx-auto px-6 lg:px-12">
        {initiative.sections.map((section) => (
          <div key={section.id} id={`section-${section.id}`} className="initiative-section">
            {section.type === "text_columns" && <TextColumnsSection section={section} colors={colors} />}
            {section.type === "hero_stats" && <HeroStatsSection section={section} colors={colors} />}
            {section.type === "cta" && <CtaSection section={section} colors={colors} />}
            {section.type === "coming_soon" && <ComingSoonSection section={section} colors={colors} />}
          </div>
        ))}
      </main>

      <Newsletter />
      <Footer />
    </div>
  );
}
