"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight, Heart, Globe, Leaf, PieChart, ArrowUpRight, CheckCircle
} from "lucide-react";
import { TopNav } from "@/components/ui/top-nav";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Newsletter } from "@/components/ui/newsletter";
import { FlashBanner } from "@/components/ui/flash-banner";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { supabase } from "@/lib/supabase";
import { SEED_PROJECTS, CATEGORY_ICONS, type FundProject } from "@/lib/fund-data";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: "5", label: "Active Projects", sub: "2026 Portfolio" },
  { value: "8", label: "Countries", sub: "Across the Continent" },
  { value: "16,220+", label: "Target Beneficiaries", sub: "Direct Impact" },
  { value: "$780K", label: "Total Target", sub: "Fund Goal 2026" },
];

export default function ImpactProjectsPage() {
  const [projects, setProjects] = useState<FundProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const categories = ["All", "Agriculture", "Health", "Education & Energy", "Trade & SME", "ICT & Youth"];

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data } = await supabase
          .from("v_active_fund_projects")
          .select("*")
          .order("sort_order");
        setProjects(data && data.length > 0 ? (data as FundProject[]) : SEED_PROJECTS);
      } catch {
        setProjects(SEED_PROJECTS);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProjects();
  }, []);

  useGSAP(() => {
    if (isLoading) return;
    gsap.fromTo(".project-card",
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: ".project-grid", start: "top 85%" }
      }
    );
  }, [isLoading]);

  const filtered = activeFilter === "All"
    ? projects
    : projects.filter(p => p.category === activeFilter);

  return (
    <div className="min-h-screen bg-zinc-950 font-sans selection:bg-emerald-500/30">
      <div className="sticky top-0 z-[100] w-full flex flex-col">
        <TopNav />
        <FlashBanner />
        <Header />
      </div>
      <Breadcrumb />

      {/* ── Hero ── */}
      <section className="relative bg-zinc-950 overflow-hidden border-b border-zinc-800/40">
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2670&auto=format&fit=crop')",
            backgroundSize: "cover", backgroundPosition: "center 40%"
          }} />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/88 to-zinc-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />

        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-24 md:py-32 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/60 border border-emerald-900/40 mb-7 rounded-full backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold tracking-[0.2em] text-emerald-400 uppercase">AfDEC Diaspora Impact Fund</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] max-w-4xl mb-6">
            2026 Development<br />Project Portfolio
          </h1>
          <p className="text-lg md:text-xl text-zinc-300 max-w-2xl leading-relaxed font-medium mb-4">
            Five named development initiatives across eight African countries — each with defined funding targets, impact metrics, and full accountability frameworks aligned with AfDB, World Bank, and IMF pillars.
          </p>
          <p className="text-sm text-zinc-500 max-w-xl mb-10">
            All projects are Super Admin managed. New initiatives are published through the AfDEC Secretariat and reviewed by the Fund Committee.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/diaspora-impact-fund/contribute"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold tracking-widest uppercase px-8 py-4 rounded-sm transition-all shadow-lg shadow-emerald-900/30">
              <Heart className="w-4 h-4" />
              Contribute to the Fund
            </Link>
            <Link href="/diaspora-impact-fund"
              className="inline-flex items-center gap-2 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-sm font-bold tracking-widest uppercase px-8 py-4 rounded-sm transition-all">
              About the Fund
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-zinc-900/30 border-b border-zinc-800/30 py-10">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {STATS.map((s) => (
              <div key={s.label} className="text-center p-5 border border-zinc-800/40 rounded-sm bg-zinc-900/20">
                <div className="text-3xl md:text-4xl font-black text-emerald-400 mb-1">{s.value}</div>
                <div className="text-white font-bold text-sm mb-0.5">{s.label}</div>
                <div className="text-zinc-600 text-[10px] uppercase tracking-wide font-medium">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Project Grid ── */}
      <section className="bg-[#080808] py-24 border-b border-zinc-800/30">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-12">
            {categories.map(cat => (
              <button key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-5 py-2 text-[11px] font-bold uppercase tracking-widest rounded-sm border transition-all ${
                  activeFilter === cat
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : "bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white"
                }`}>
                {cat}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="py-20 text-center text-zinc-500 font-bold uppercase tracking-widest text-sm animate-pulse">
              Syncing Project Ledger...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center text-zinc-500 font-bold uppercase tracking-widest">
              No Projects in this Category
            </div>
          ) : (
            <div className="project-grid space-y-6">
              {filtered.map((project) => {
                const Icon = CATEGORY_ICONS[project.category] ?? Leaf;
                const pct = project.funding_pct ?? Math.round((project.raised_amount_usd / project.target_amount_usd) * 100);

                return (
                  <div key={project.id}
                    className="project-card group grid grid-cols-1 md:grid-cols-[300px_1fr] gap-0 border border-zinc-800/50 rounded-xl overflow-hidden hover:border-emerald-900/60 hover:shadow-xl hover:shadow-emerald-950/20 transition-all duration-300 bg-zinc-900/20">

                    {/* Image */}
                    {project.cover_image_url && (
                      <div className="overflow-hidden h-56 md:h-auto relative">
                        <img src={project.cover_image_url} alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 to-transparent md:bg-gradient-to-r" />
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-7 md:p-8 flex flex-col justify-between">
                      <div>
                        {/* Badges */}
                        <div className="flex items-center gap-3 flex-wrap mb-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/40 border border-emerald-900/30 rounded-sm text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                            <Icon className="w-3 h-3" />
                            {project.category}
                          </span>
                          <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{project.region}</span>
                          {project.status === "coming_soon" && (
                            <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full uppercase tracking-widest">
                              Coming Soon
                            </span>
                          )}
                          {project.status === "active" && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full uppercase tracking-widest">
                              <span className="w-1 h-1 rounded-full bg-blue-400 animate-pulse" />Active
                            </span>
                          )}
                        </div>

                        {/* Title + Description */}
                        <h3 className="text-white font-black text-xl md:text-2xl mb-2 group-hover:text-emerald-400 transition-colors">
                          <Link href={`/diaspora-impact-fund/projects/${project.slug}`}>{project.title}</Link>
                        </h3>
                        <p className="text-zinc-400 text-[13px] leading-relaxed mb-5">{project.description}</p>

                        {/* Tags */}
                        {project.multilateral_tags && project.multilateral_tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {project.multilateral_tags.map((tag) => (
                              <span key={tag} className="text-[10px] font-bold text-zinc-500 bg-zinc-800/60 border border-zinc-700/50 px-2 py-0.5 rounded-sm uppercase tracking-wider">{tag}</span>
                            ))}
                            {project.sdg_goals?.map((sdg) => (
                              <span key={sdg} className="text-[10px] font-bold text-indigo-400 bg-indigo-950/30 border border-indigo-900/30 px-2 py-0.5 rounded-sm uppercase tracking-wider">SDG {sdg}</span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        {/* Funding Progress */}
                        <div className="mb-5">
                          <div className="flex items-center justify-between text-[11px] font-bold mb-2">
                            <span className="text-zinc-400">Funding Progress</span>
                            <span className="text-white">${project.raised_amount_usd.toLocaleString()} / ${project.target_amount_usd.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-zinc-800/60 rounded-full h-1.5">
                            <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(pct, 100)}%` }} />
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-[10px] text-zinc-600">{pct}% funded</span>
                            {project.beneficiary_estimate && (
                              <span className="text-[10px] text-zinc-600">{project.beneficiary_estimate.toLocaleString()} target beneficiaries</span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-zinc-800/50">
                          <Link href={`/diaspora-impact-fund/projects/${project.slug}`}
                            className="inline-flex items-center gap-1.5 text-[10px] font-bold text-white hover:text-emerald-400 border border-zinc-700 hover:border-emerald-900/40 px-4 py-2.5 rounded-sm transition-colors uppercase tracking-widest">
                            <ArrowUpRight className="w-3.5 h-3.5" />
                            Project Dossier
                          </Link>
                          <Link href="/diaspora-impact-fund/contribute"
                            className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 hover:text-emerald-300 border border-emerald-900/40 px-4 py-2.5 rounded-sm transition-colors uppercase tracking-widest">
                            <Heart className="w-3 h-3" />
                            Donate to this Project
                          </Link>
                          {project.max_grant_usd && (
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-zinc-500 px-4 py-2.5">
                              Max grant: ${project.max_grant_usd.toLocaleString()} per SME
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="bg-zinc-950 py-20 border-b border-zinc-800/30">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-gradient-to-br from-emerald-950/30 to-zinc-900/40 border border-emerald-900/20 rounded-xl p-8 md:p-10">
              <Globe className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-2xl font-black text-white mb-3">Contribute to the Fund</h3>
              <p className="text-zinc-400 text-[14px] leading-relaxed mb-6 max-w-xl">
                Every dollar contributed is deployed directly to named projects. There is zero ambiguity about where your capital goes. 100% deployment rate, independently audited.
              </p>
              <div className="space-y-2 mb-8">
                {[
                  "Named project sponsorship available for institutional donors",
                  "Individual contributions of any size accepted",
                  "Quarterly impact reports with real metrics",
                ].map(item => (
                  <div key={item} className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-zinc-400 text-[13px]">{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/diaspora-impact-fund/contribute"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold tracking-widest uppercase px-6 py-3.5 rounded-sm transition-all">
                Open Contribution Portal
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-8 flex flex-col">
              <PieChart className="w-8 h-8 text-amber-400 mb-4" />
              <h3 className="text-xl font-black text-white mb-3">African SME?</h3>
              <p className="text-zinc-400 text-[13px] leading-relaxed mb-6 flex-grow">
                African micro and small enterprises are invited to apply for development grants between $3,000–$10,000. Application window opens Q3 2026.
              </p>
              <Link href="/diaspora-impact-fund/apply"
                className="inline-flex items-center gap-2 border border-amber-900/40 text-amber-400 hover:text-amber-300 text-xs font-bold tracking-widest uppercase px-6 py-3.5 rounded-sm transition-all mt-auto">
                Launch SME Application
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Newsletter />
      <Footer />
    </div>
  );
}
