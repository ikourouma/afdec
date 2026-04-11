"use client";

import React, { useEffect, useState } from "react";
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
import { SideNav, type NavSection } from "@/components/ui/side-nav";
import { supabase } from "@/lib/supabase";
import { ImpactCalculator } from "@/components/sections/impact-calculator";
import {
  Heart, Globe, Users, ArrowRight, CheckCircle, Building2,
  Landmark, DollarSign, Leaf, Zap, Shield, BookOpen, Star,
  ChevronRight, TrendingUp, Award
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const PAGE_SECTIONS: NavSection[] = [
  { id: "mission", label: "Our Mission" },
  { id: "impact", label: "Impact Simulator" },
  { id: "methodology", label: "Methodology" },
  { id: "projects", label: "Projects" },
  { id: "contribute", label: "Contribute" },
  { id: "apply", label: "SME Apply" },
  { id: "governance", label: "Governance" },
];

type FundProject = {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  cover_image_url?: string;
  country: string;
  region: string;
  target_amount_usd: number;
  raised_amount_usd: number;
  funding_pct: number;
  beneficiary_estimate?: number;
  multilateral_tags?: string[];
  sdg_goals?: number[];
  is_featured: boolean;
  status: string;
  applications_open: boolean;
  max_grant_usd?: number;
};

// ── Seed fallback data matching what's in impact_fund_migration.sql ──────────
const SEED_PROJECTS: FundProject[] = [
  {
    id: "1", slug: "agrilink-west-africa", title: "AgriLink West Africa",
    category: "Agriculture", country: "Ghana, Senegal", region: "West Africa",
    description: "Connecting 500 smallholder farmers across Ghana and Senegal to mobile agritech platforms — providing real-time market pricing, soil health data, and micro-loan facilitation through NC-Africa agricultural technology partnerships.",
    cover_image_url: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=900&auto=format&fit=crop",
    target_amount_usd: 150000, raised_amount_usd: 0, funding_pct: 0,
    beneficiary_estimate: 500, multilateral_tags: ["AfDB"], sdg_goals: [2, 8],
    is_featured: true, status: "active", applications_open: false, max_grant_usd: 7500,
  },
  {
    id: "2", slug: "nc-kenya-health-bridge", title: "NC–Kenya Health Bridge",
    category: "Health", country: "Kenya", region: "East Africa",
    description: "Establishing a sustainable medical supply corridor between North Carolina health systems and 12 rural clinics in Western Kenya — supporting the Kenyan government's Universal Health Coverage mandate.",
    cover_image_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=900&auto=format&fit=crop",
    target_amount_usd: 200000, raised_amount_usd: 0, funding_pct: 0,
    beneficiary_estimate: 12000, multilateral_tags: ["WorldBank", "USAID"], sdg_goals: [3, 10],
    is_featured: true, status: "active", applications_open: false, max_grant_usd: 10000,
  },
  {
    id: "3", slug: "sahel-solar-schools", title: "Sahel Solar Schools",
    category: "Education & Energy", country: "Mali, Burkina Faso", region: "West Africa",
    description: "Deploying off-grid solar power and digital learning infrastructure to 10 rural schools — impacting 3,200 students, aligned with SDG 4 (Quality Education) and SDG 7 (Affordable and Clean Energy).",
    cover_image_url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=900&auto=format&fit=crop",
    target_amount_usd: 250000, raised_amount_usd: 0, funding_pct: 0,
    beneficiary_estimate: 3200, multilateral_tags: ["UNDP", "AfDB"], sdg_goals: [4, 7, 13],
    is_featured: false, status: "coming_soon", applications_open: false, max_grant_usd: 5000,
  },
  {
    id: "4", slug: "afcfta-micro-enterprise-fund", title: "AfCFTA Micro-Enterprise Fund",
    category: "Trade & SME", country: "Pan-African", region: "Pan-African",
    description: "Providing 20 African micro-enterprises with grants of $3,000–$8,000 to access AfCFTA cross-border trade — covering certification, compliance, digital storefronts, and AfDEC Hub memberships.",
    cover_image_url: "https://images.unsplash.com/photo-1556740714-a8395b3bf30f?q=80&w=900&auto=format&fit=crop",
    target_amount_usd: 100000, raised_amount_usd: 0, funding_pct: 0,
    beneficiary_estimate: 20, multilateral_tags: ["AfCFTA", "IMF"], sdg_goals: [8, 10, 17],
    is_featured: true, status: "coming_soon", applications_open: false, max_grant_usd: 8000,
  },
  {
    id: "5", slug: "digital-talent-pipeline", title: "Digital Talent Pipeline",
    category: "ICT & Youth", country: "Nigeria, Kenya, Ghana", region: "Pan-African",
    description: "An intensive 6-month digital skills program training 500 African youth in software development, data analytics, and digital marketing — placing 70% into NC-affiliated remote roles.",
    cover_image_url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=900&auto=format&fit=crop",
    target_amount_usd: 80000, raised_amount_usd: 0, funding_pct: 0,
    beneficiary_estimate: 500, multilateral_tags: ["IFC", "AfDB"], sdg_goals: [4, 8, 10],
    is_featured: false, status: "coming_soon", applications_open: false, max_grant_usd: 3000,
  },
];

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "Agriculture": Leaf,
  "Health": Heart,
  "Education & Energy": Zap,
  "Trade & SME": TrendingUp,
  "ICT & Youth": BookOpen,
};

const STATS = [
  { value: "$780K", label: "Total Fund Target", sub: "2026 Goal" },
  { value: "5", label: "Development Projects", sub: "Across 8 Countries" },
  { value: "16,220", label: "Target Beneficiaries", sub: "Lives Impacted" },
  { value: "100%", label: "Deployment Rate", sub: "No admin overhead > 15%" },
];

const CONTRIBUTION_PATHS = [
  {
    icon: DollarSign,
    title: "Grant Partner",
    subtitle: "Institutional / Corporate",
    amount: "$10,000+",
    accent: "blue",
    description: "Institutional donors — foundations, corporations, government agencies — partner with AfDEC to fund one or more development projects. Your name appears on the project page alongside your contribution.",
    benefits: ["Named project sponsorship", "Quarterly impact reporting", "AfDEC Partnership recognition", "Tax documentation provided"],
    cta: "Become a Grant Partner",
    href: "/diaspora-impact-fund/interest?inquiry=donor_institutional",
  },
  {
    icon: Heart,
    title: "Individual Donor",
    subtitle: "Individual Philanthropy",
    amount: "Any Amount",
    accent: "emerald",
    description: "Individuals from the North Carolina and African diaspora community can contribute any amount to the fund. Every dollar is deployed to active development projects.",
    benefits: ["Contribution tax receipt", "AfDEC Donor Newsletter", "Annual Impact Report", "Project updates by email"],
    cta: "Donate to the Fund",
    href: "/diaspora-impact-fund/interest?inquiry=donor_individual",
  },
  {
    icon: Users,
    title: "Program Partner",
    subtitle: "In-Kind / Expertise",
    amount: "Non-Cash",
    accent: "purple",
    description: "Organizations contributing professional services, technology, logistics, or expertise rather than cash. Program partners co-execute projects alongside AfDEC's on-the-ground team.",
    benefits: ["Program co-execution credit", "Access to project teams", "AfDEC Network access", "Joint press releases"],
    cta: "Explore Partnership",
    href: "/diaspora-impact-fund/interest?inquiry=program_partner",
  },
];

const GOVERNANCE = [
  { role: "Fund Committee Chair", note: "AfDEC Board Designated" },
  { role: "Impact Evaluation Officer", note: "Independent Third Party" },
  { role: "Africa Field Coordinator", note: "In-Country AfDEC Hub Lead" },
  { role: "Finance & Compliance Officer", note: "AfDEC CFO or designee" },
  { role: "Community Representative", note: "Beneficiary country org." },
];

export default function DiasporaImpactFundPage() {
  const [projects, setProjects] = useState<FundProject[]>([]);
  const projectsRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        const { data } = await supabase.from("v_active_fund_projects").select("*").order("sort_order");
        setProjects(data && data.length > 0 ? (data as FundProject[]) : SEED_PROJECTS);
      } catch {
        setProjects(SEED_PROJECTS);
      }
    }
    loadProjects();
  }, []);

  useGSAP(() => {
    gsap.fromTo(".stat-tile", { y: 30, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: "power3.out",
        scrollTrigger: { trigger: ".stat-tile", start: "top 88%" } }
    );
  }, {});

  const totalTarget = SEED_PROJECTS.reduce((sum, p) => sum + p.target_amount_usd, 0);

  return (
    <main className="min-h-screen bg-zinc-950 font-sans selection:bg-emerald-500/30 scroll-smooth">
      <div className="sticky top-0 z-[100] w-full flex flex-col" data-nav-id="main-nav">
        <TopNav />
        <FlashBanner />
        <Header />
      </div>
      <Breadcrumb />
      <SideNav sections={PAGE_SECTIONS} accentColor="emerald" />

      {/* ── Hero ── */}
      <section id="section-mission" className="relative bg-zinc-950 overflow-hidden border-b border-zinc-800/40">
        <div className="absolute inset-0 opacity-25"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2670&auto=format&fit=crop')", backgroundSize: "cover", backgroundPosition: "center 40%" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-zinc-950/40" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-zinc-950 to-transparent" />

        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-24 md:py-36 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/60 border border-emerald-900/40 mb-7 rounded-full backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold tracking-[0.2em] text-emerald-400 uppercase">AfDEC Strategic Initiative</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] max-w-4xl mb-6">
            Diaspora<br />Impact Fund
          </h1>
          <p className="text-lg md:text-xl text-zinc-300 max-w-2xl leading-relaxed font-medium mb-4">
            Channeling the power of the African diaspora economy into transformational development initiatives across the continent — through grants, donations, and strategic partnerships.
          </p>
          <p className="text-sm text-zinc-500 max-w-xl mb-10 leading-relaxed">
            Aligned with African Development Bank, World Bank, and IMF development pillars. 100% of net donations deployed to named development projects. Zero ambiguity. Maximum impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/diaspora-impact-fund/interest" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold tracking-widest uppercase px-8 py-4 rounded-sm transition-all shadow-lg shadow-emerald-900/30">
              <Heart className="w-4 h-4" />
              Make a Contribution
            </Link>
            <Link href="#projects" className="inline-flex items-center gap-2 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-sm font-bold tracking-widest uppercase px-8 py-4 rounded-sm transition-all">
              View Projects
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-zinc-900/30 border-b border-zinc-800/30 py-12">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {STATS.map((s) => (
              <div key={s.label} className="stat-tile text-center p-6 border border-zinc-800/40 rounded-sm bg-zinc-900/20">
                <div className="text-3xl md:text-4xl font-black text-emerald-400 mb-1">{s.value}</div>
                <div className="text-white font-bold text-sm mb-0.5">{s.label}</div>
                <div className="text-zinc-600 text-[10px] uppercase tracking-wide font-medium">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About the Fund ── */}
      <section className="bg-zinc-950 py-20 border-b border-zinc-800/30">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-px bg-emerald-500" />
                <span className="text-[11px] font-bold tracking-[0.2em] text-emerald-400 uppercase">About the Fund</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
                A Commitment to<br />Africa's Development Future
              </h2>
              <p className="text-zinc-400 text-[15px] leading-relaxed mb-5">
                The AfDEC Diaspora Impact Fund is a strategic fundraising initiative of the Africa-Focused Diaspora Economic Council — designed to mobilize capital from the North Carolina African diaspora community, corporate partners, and institutional donors for high-impact development projects across Africa.
              </p>
              <p className="text-zinc-500 text-[14px] leading-relaxed mb-8">
                Unlike traditional charity, every fund project is selected for alignment with proven multilateral frameworks — African Development Bank sector priorities, World Bank development indicators, and IMF economic growth targets. Impact is measured, reported, and independently verified.
              </p>
              <div className="space-y-3">
                {[
                  "Aligned with AfDB, World Bank, and IMF development pillars",
                  "100% grant deployment — no administrative overhead above 15%",
                  "Independent impact evaluation at project close",
                  "Quarterly donor reporting with real metrics — not marketing",
                  "African SME preference for all grant applications",
                  "Fund Committee maintains full governance independence",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-zinc-300 text-[14px]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Multilateral Alignment Visual */}
            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-8">
              <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-6">Multilateral Alignment Framework</div>
              <div className="space-y-4">
                {[
                  { org: "African Development Bank (AfDB)", focus: "Agriculture, Energy, Industrialization, Integration, Quality of Life", color: "emerald" },
                  { org: "World Bank Group", focus: "Universal Health Coverage, Education, Social Protection, Climate", color: "blue" },
                  { org: "IMF / IFC", focus: "Private Sector Development, SME Finance, Macroeconomic Stability", color: "purple" },
                  { org: "AfCFTA", focus: "Intra-African Trade, Supply Chains, Cross-Border SME Development", color: "amber" },
                ].map((item) => (
                  <div key={item.org} className="flex gap-4 p-4 bg-zinc-900/40 rounded-sm border border-zinc-800/40">
                    <div className={`w-2 shrink-0 rounded-full bg-${item.color}-500/40 self-stretch`} />
                    <div>
                      <div className={`text-${item.color}-400 text-xs font-bold mb-1`}>{item.org}</div>
                      <div className="text-zinc-500 text-[11px] leading-relaxed">{item.focus}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sovereign Impact Simulator (Fortress Feature) ── */}
      <section id="impact" className="bg-zinc-950 py-24 border-b border-zinc-800/30">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
           <div className="mb-14">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-px bg-emerald-500" />
                <span className="text-[11px] font-bold tracking-[0.2em] text-emerald-400 uppercase">Interactive Telemetry</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                Sovereign Impact<br />Simulator.
              </h2>
           </div>
           
           <ImpactCalculator />
        </div>
      </section>

      {/* ── Fund Methodology & AfCFTA Integration ── */}
      <section id="methodology" className="bg-[#050505] py-24 border-b border-zinc-800/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-px bg-blue-500" />
                <span className="text-[11px] font-bold tracking-[0.2em] text-blue-400 uppercase">Institutional logic</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-8">
                The Methodology of<br />Sovereign Deployment
              </h2>
              <p className="text-zinc-400 text-[15px] leading-relaxed mb-8">
                Our deployment strategy is not merely philanthropic — it is a calculated economic intervention. By aligning every grant with the **AfCFTA (African Continental Free Trade Area)**, we ensure that micro-investments contribute to macro-economic supply chain resilience.
              </p>
              
              <div className="p-6 bg-gradient-to-br from-blue-950/20 to-emerald-950/10 border border-blue-900/30 rounded-xl mb-10">
                <div className="flex items-center gap-3 mb-3">
                  <Globe className="w-5 h-5 text-blue-400" />
                  <h3 className="text-blue-100 font-bold text-sm">AfCFTA Strategic Nexus</h3>
                </div>
                <p className="text-zinc-500 text-[13px] leading-relaxed">
                  We categorize projects based on their ability to facilitate cross-border trade. A grant to a Ghanain farmer is weighted by its potential to export to neighboring Ivory Coast or Senegal under the AfCFTA tariff-reduction protocols.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { title: "Tariff Optimization", desc: "Prioritizing SMEs in sectors with 90% tariff removal status." },
                  { title: "Supply Chain Linkage", desc: "Focusing on logistics that bridge NC capital to African raw materials." },
                  { title: "Digital Protocol Hubs", desc: "Funding the digitial infrastructure required for AfCFTA compliance." }
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                    <div>
                      <div className="text-white text-xs font-bold uppercase tracking-widest">{item.title}</div>
                      <div className="text-zinc-500 text-xs mt-1">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-8 md:p-12">
                <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-10">7-Step Deployment Lifecycle</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                  {[
                    { step: "01", label: "Vetting", sub: "KYC/AML checks on all applicants via NC legal nodes." },
                    { step: "02", label: "Alignment", sub: "Matching project goals to SDG 2030 and AfCFTA pillars." },
                    { step: "03", label: "Simulated ROI", sub: "Running the data through our Sovereign Impact Simulator." },
                    { step: "04", label: "Funding", sub: "Capital escrowed in the Diaspora Impact Fund vault." },
                    { step: "05", label: "Execution", sub: "Milestone-based disbursement to on-the-ground SMEs." },
                    { step: "06", label: "Monitoring", sub: "Telemetry check-ins every 30 days via AfDEC field reps." },
                    { step: "07", label: "Reporting", sub: "Final Impact Audit published to institutional donors." },
                  ].map((item) => (
                    <div key={item.step} className="relative pl-8 border-l border-zinc-800">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-zinc-950 border border-zinc-700 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                      </div>
                      <div className="text-[10px] font-black text-zinc-700 mb-1">{item.step}</div>
                      <div className="text-zinc-200 text-xs font-bold uppercase tracking-widest">{item.label}</div>
                      <div className="text-zinc-500 text-[11px] mt-1 leading-relaxed">{item.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Development Projects ── */}
      <section id="projects" ref={projectsRef} className="bg-[#080808] py-24 border-b border-zinc-800/30">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-amber-500" />
              <span className="text-[11px] font-bold tracking-[0.2em] text-amber-400 uppercase">Development Portfolio</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white">2026 Project Portfolio</h2>
            <p className="text-zinc-400 mt-4 max-w-2xl text-[15px]">
              Five named development initiatives across eight African countries — each with defined funding targets, impact metrics, and accountability frameworks.
            </p>
          </div>

          <div className="space-y-6">
            {(projects.length > 0 ? projects : SEED_PROJECTS).map((project, idx) => {
              const Icon = CATEGORY_ICONS[project.category] ?? Leaf;
              const pct = project.funding_pct ?? Math.round((project.raised_amount_usd / project.target_amount_usd) * 100);
              return (
                <div key={project.id}
                  className="group grid grid-cols-1 md:grid-cols-[280px_1fr] gap-0 border border-zinc-800/50 rounded-xl overflow-hidden hover:border-zinc-700 transition-all duration-300 bg-zinc-900/20">
                  {project.cover_image_url && (
                    <div className="overflow-hidden h-48 md:h-auto">
                      <img src={project.cover_image_url} alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                  )}
                  <div className="p-7 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 flex-wrap mb-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/40 border border-emerald-900/30 rounded-sm text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                          <Icon className="w-3 h-3" />
                          {project.category}
                        </span>
                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{project.region}</span>
                        {project.status === "coming_soon" && (
                          <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full uppercase tracking-widest">Coming Soon</span>
                        )}
                        {project.status === "active" && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full uppercase tracking-widest">
                            <span className="w-1 h-1 rounded-full bg-blue-400 animate-pulse" />Active
                          </span>
                        )}
                      </div>
                      <h3 className="text-white font-black text-xl mb-2">{project.title}</h3>
                      <p className="text-zinc-400 text-[13px] leading-relaxed mb-5">{project.description}</p>
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
                      {/* Funding progress */}
                      <div className="mb-4">
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
                      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-zinc-800/50">
                        <Link href="/contact?inquiry=donor_institutional"
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
        </div>
      </section>

      {/* ── How to Contribute ── */}
      <section id="section-contribute" className="bg-zinc-950 py-24 border-b border-zinc-800/30">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-blue-500" />
              <span className="text-[11px] font-bold tracking-[0.2em] text-blue-400 uppercase">How to Contribute</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white">Three Ways to Create Impact</h2>
            <p className="text-zinc-400 mt-4 max-w-2xl text-[15px]">
              Whether you are a philanthropic individual, a corporate foundation, or a professional organization — there is a structured pathway for your contribution.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CONTRIBUTION_PATHS.map((path) => {
              const Icon = path.icon;
              const accentMap: Record<string, string> = {
                blue: "border-blue-900/30 bg-blue-950/20",
                emerald: "border-emerald-900/30 bg-emerald-950/20",
                purple: "border-purple-900/30 bg-purple-950/20",
              };
              const iconAccent: Record<string, string> = {
                blue: "text-blue-400 bg-blue-500/10",
                emerald: "text-emerald-400 bg-emerald-500/10",
                purple: "text-purple-400 bg-purple-500/10",
              };
              const btnAccent: Record<string, string> = {
                blue: "bg-blue-600 hover:bg-blue-500",
                emerald: "bg-emerald-600 hover:bg-emerald-500",
                purple: "bg-purple-600 hover:bg-purple-500",
              };
              return (
                <div key={path.title}
                  className={`flex flex-col border rounded-xl p-7 ${accentMap[path.accent]} hover:border-zinc-600 transition-all duration-300`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${iconAccent[path.accent]}`}>
                    <Icon className={`w-6 h-6 ${iconAccent[path.accent].split(" ")[0]}`} />
                  </div>
                  <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">{path.subtitle}</div>
                  <h3 className="text-white font-black text-xl mb-1">{path.title}</h3>
                  <div className="text-2xl font-black text-white/60 mb-4">{path.amount}</div>
                  <p className="text-zinc-400 text-[13px] leading-relaxed mb-5 flex-1">{path.description}</p>
                  <div className="space-y-2 mb-6">
                    {path.benefits.map((b) => (
                      <div key={b} className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="text-zinc-400 text-[12px]">{b}</span>
                      </div>
                    ))}
                  </div>
                  <Link href={path.href}
                    className={`inline-flex items-center justify-center gap-2 ${btnAccent[path.accent]} text-white text-xs font-bold tracking-widest uppercase px-6 py-3.5 rounded-sm transition-all`}>
                    {path.cta}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SME Application Notice ── */}
      <section id="section-apply" className="bg-[#080808] py-24 border-b border-zinc-800/30">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-px bg-amber-500" />
                <span className="text-[11px] font-bold tracking-[0.2em] text-amber-400 uppercase">African SME Grant Application</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6">Apply for a Development Grant</h2>
              <p className="text-zinc-400 text-[15px] leading-relaxed mb-5">
                African micro and small enterprises — including NC-based African-led businesses — are invited to apply for development grants through the AfDEC Diaspora Impact Fund. Grants range from $3,000 to $10,000 depending on the project.
              </p>
              <p className="text-zinc-500 text-[14px] leading-relaxed mb-8">
                Applications are reviewed by a full Fund Committee in a procurement-grade process: submission → review → shortlisting → approval → announcement. All applicants receive a reference number and can track their status through their AfDEC account.
              </p>
              <div className="bg-amber-950/20 border border-amber-900/30 rounded-xl p-6 mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Application Window Opening Q3 2026</span>
                </div>
                <p className="text-zinc-400 text-[13px] leading-relaxed">
                  The formal application portal will launch with the first round of open projects. Register your interest now to receive the application announcement directly.
                </p>
              </div>
              <div className="space-y-2 mb-8">
                {[
                  "African-registered or NC African-led businesses are eligible",
                  "No minimum revenue requirement for micro-enterprises",
                  "Projects must align with an active AfDEC fund project area",
                  "Free to apply — no application fee",
                  "Full process tracked by reference number in your account",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span className="text-zinc-400 text-[13px]">{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/diaspora-impact-fund/apply"
                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold tracking-widest uppercase px-8 py-4 rounded-sm transition-all">
                Launch SME Application
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Lifecycle visual */}
            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-8">
              <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-6">Grant Application Lifecycle</div>
              <div className="space-y-1">
                {[
                  { step: "01", label: "Online Application Submitted", sub: "Applicant receives reference number via email", color: "border-zinc-600 text-zinc-400" },
                  { step: "02", label: "Committee Receives & Logs", sub: "Fund Committee acknowledges within 5 business days", color: "border-zinc-600 text-zinc-400" },
                  { step: "03", label: "Due Diligence Review", sub: "All documents reviewed; applicant notified of any gaps", color: "border-blue-900/50 text-blue-400" },
                  { step: "04", label: "Shortlisting Decision", sub: "Top applications advanced; all others notified", color: "border-blue-900/50 text-blue-400" },
                  { step: "05", label: "Final Committee Approval", sub: "Approved applicants contacted for grant agreement", color: "border-emerald-900/50 text-emerald-400" },
                  { step: "06", label: "Public Announcement", sub: "Grantees announced on AfDEC website and press release", color: "border-emerald-900/50 text-emerald-400" },
                  { step: "07", label: "Grant Disbursement", sub: "Funds transferred per agreed milestone schedule", color: "border-amber-900/50 text-amber-400" },
                ].map((item) => (
                  <div key={item.step} className={`flex gap-4 p-4 border-l-2 ${item.color} ml-4`}>
                    <div className="text-[10px] font-black text-zinc-700 w-6 shrink-0 mt-0.5">{item.step}</div>
                    <div>
                      <div className="text-zinc-200 text-[13px] font-bold">{item.label}</div>
                      <div className="text-zinc-600 text-[11px] mt-0.5">{item.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Governance ── */}
      <section id="section-governance" className="bg-zinc-950 py-20 border-b border-zinc-800/30">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-px bg-zinc-500" />
                <span className="text-[11px] font-bold tracking-[0.2em] text-zinc-400 uppercase">Fund Governance</span>
              </div>
              <h2 className="text-3xl font-black text-white mb-6">Transparency & Accountability</h2>
              <p className="text-zinc-400 text-[15px] leading-relaxed mb-6">
                The AfDEC Diaspora Impact Fund operates under a multi-stakeholder governance structure with full financial transparency. The Fund Committee operates independently from AfDEC's business development functions.
              </p>
              <div className="space-y-3 mb-8">
                {GOVERNANCE.map((g) => (
                  <div key={g.role} className="flex items-start justify-between gap-4 py-3 border-b border-zinc-800/50">
                    <div>
                      <div className="text-white text-sm font-bold">{g.role}</div>
                      <div className="text-zinc-500 text-[11px] mt-0.5">{g.note}</div>
                    </div>
                    <Award className="w-4 h-4 text-zinc-700 shrink-0 mt-0.5" />
                  </div>
                ))}
              </div>
              <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-6">
                <h3 className="text-white font-bold text-sm mb-3">Reporting Cadence</h3>
                <div className="space-y-2">
                  {[
                    { period: "Quarterly", desc: "Donor progress reports — project-level metrics" },
                    { period: "Semi-annual", desc: "Fund Committee public report — disbursements + pipeline" },
                    { period: "Annual", desc: "Audited impact report — independent evaluation" },
                  ].map((r) => (
                    <div key={r.period} className="flex gap-3 text-[12px]">
                      <span className="font-bold text-emerald-400 w-28 shrink-0">{r.period}</span>
                      <span className="text-zinc-500">{r.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Impact CTA */}
            <div className="bg-gradient-to-br from-emerald-950/30 to-zinc-900/40 border border-emerald-900/20 rounded-xl p-8 md:p-10 sticky top-32">
              <Globe className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-2xl font-black text-white mb-3">Join the Mission</h3>
              <p className="text-zinc-400 text-[14px] leading-relaxed mb-6">
                The AfDEC Diaspora Impact Fund needs institutional partners, individual donors, and African SMEs ready to grow with the fund.
              </p>
              <div className="space-y-3">
                <Link href="/diaspora-impact-fund/interest?inquiry=donor_institutional" className="flex items-center justify-between w-full bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-emerald-900/40 px-5 py-3.5 rounded-sm transition-all group">
                  <span className="text-zinc-300 text-sm font-bold group-hover:text-white">Institutional Donation</span>
                  <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400" />
                </Link>
                <Link href="/diaspora-impact-fund/interest?inquiry=donor_individual" className="flex items-center justify-between w-full bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-emerald-900/40 px-5 py-3.5 rounded-sm transition-all group">
                  <span className="text-zinc-300 text-sm font-bold group-hover:text-white">Individual Donation</span>
                  <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400" />
                </Link>
                <Link href="/diaspora-impact-fund/interest?inquiry=program_partner" className="flex items-center justify-between w-full bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-emerald-900/40 px-5 py-3.5 rounded-sm transition-all group">
                  <span className="text-zinc-300 text-sm font-bold group-hover:text-white">Program Partnership</span>
                  <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400" />
                </Link>
                <Link href="/diaspora-impact-fund/apply" className="flex items-center justify-between w-full bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-amber-900/40 px-5 py-3.5 rounded-sm transition-all group">
                  <span className="text-zinc-300 text-sm font-bold group-hover:text-white">SME Grant Application</span>
                  <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-amber-400" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="relative bg-zinc-950 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop')" }} />
        <Newsletter />
        <Footer />
      </div>
    </main>
  );
}
