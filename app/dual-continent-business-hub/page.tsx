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
import { SectionNav, type NavSection } from "@/components/ui/section-nav";
import {
  Building2, Globe, MapPin, Users, Wifi, ArrowRight,
  CheckCircle, Landmark, Network, Briefcase, Zap
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const PAGE_SECTIONS: NavSection[] = [
  { id: "overview", label: "Overview" },
  { id: "hub-locations", label: "Hub Locations" },
  { id: "services", label: "Services" },
  { id: "ecosystem", label: "Ecosystem" },
  { id: "apply", label: "Apply" },
];

const HUB_LOCATIONS = [
  {
    city: "Raleigh-Durham",
    country: "North Carolina, USA",
    type: "Headquarters Hub",
    description: "AfDEC's primary North Carolina hub — embedding African diaspora enterprises within the Research Triangle's world-class innovation ecosystem. Co-located at Research Triangle Park, the world's largest research park.",
    address: "Research Triangle Park, NC",
    flag: "🇺🇸",
    accent: "blue",
    highlights: ["500+ acre business campus", "Direct CLT/RDU airport access", "Duke, NC State, UNC proximity", "30-day desk-to-office onboarding"],
    status: "Active",
  },
  {
    city: "Charlotte",
    country: "North Carolina, USA",
    type: "Financial Hub",
    description: "Charlotte — the U.S.'s second-largest banking center — anchors AfDEC's financial services and trade finance operations. Strategic base for enterprise banking, VC, and capital markets engagement.",
    address: "Uptown Charlotte, NC",
    flag: "🇺🇸",
    accent: "blue",
    highlights: ["Bank of America HQ city", "Truist Financial operations", "Charlotte Douglas International (6th busiest US)", "Cross-border trade finance desk"],
    status: "Active",
  },
  {
    city: "Nairobi",
    country: "Kenya, East Africa",
    type: "East Africa Hub",
    description: "The Silicon Savannah. AfDEC's East Africa anchor in the continent's most dynamic startup and fintech ecosystem. Positioned adjacent to Nairobi's Westlands business district with M-Pesa ecosystem access.",
    address: "Westlands Business District, Nairobi",
    flag: "🇰🇪",
    accent: "emerald",
    highlights: ["Silicon Savannah access", "M-Pesa & fintech ecosystem", "Safaricom & Equity Bank corridor", "Kenya Investment Authority liaison"],
    status: "Active",
  },
  {
    city: "Lagos",
    country: "Nigeria, West Africa",
    type: "West Africa Hub",
    description: "Africa's financial capital. AfDEC's West Africa hub in Lagos gives NC enterprises direct access to Nigeria's 223M-person consumer market, the continent's largest fintech ecosystem, and ECOWAS trade corridors.",
    address: "Victoria Island, Lagos",
    flag: "🇳🇬",
    accent: "emerald",
    highlights: ["Largest African consumer market", "ECOWAS trade corridor access", "Nollywood & entertainment industry", "MTN Nigeria & fintech network"],
    status: "Active",
  },
  {
    city: "Accra",
    country: "Ghana, West Africa",
    type: "Diaspora Hub",
    description: "AfDEC's Year of Return heritage hub. Ghana's most stable democratic governance and deep NC diaspora ties make Accra the ideal home for cultural economy, agribusiness, and diaspora investment facilitation.",
    address: "Airport City, Accra",
    flag: "🇬🇭",
    accent: "emerald",
    highlights: ["AfDEC Accra Summit host city", "Year of Return investment portal", "GIPC investment facilitation", "NC-Ghana diaspora community"],
    status: "Active",
  },
  {
    city: "Abidjan",
    country: "Côte d'Ivoire, West Africa",
    type: "Finance & Trade Hub",
    description: "The economic capital of Francophone Africa. AfDEC's Abidjan hub serves as the gateway to WAEMU's 130M-person common market and the world's largest cocoa processing economy.",
    address: "Plateau District, Abidjan",
    flag: "🇨🇮",
    accent: "amber",
    highlights: ["WAEMU economic zone gateway", "World's largest cocoa market", "Port Autonome de San-Pédro access", "French-English bilingual services"],
    status: "Launching 2026",
  },
];

const SERVICES = [
  {
    icon: Building2,
    title: "Desk & Office Space",
    description: "Serviced desks, private offices, and dedicated floors at both NC and Africa hub locations. BYOD or fully equipped — from week-1 soft landings to long-term operational headquarters.",
    tags: ["Hot desk", "Private office", "Virtual membership"],
  },
  {
    icon: Network,
    title: "Trade Facilitation Services",
    description: "AfDEC-managed trade facilitation: customs pre-clearance advisory, HS code classification, ECOWAS and AfCFTA tariff navigation, and bilateral trade corridor documentation support.",
    tags: ["AfCFTA navigation", "Customs advisory", "Trade finance bridge"],
  },
  {
    icon: Users,
    title: "SME Incubation Program",
    description: "12-month cohort-based incubation for African diaspora SMEs entering NC — or NC enterprises expanding into Africa. Mentors drawn from Fortune 500 executives, NC government officials, and African heads of state advisors.",
    tags: ["12-month cohort", "Mentor network", "Pitch preparation"],
  },
  {
    icon: Briefcase,
    title: "Government Liaison Desk",
    description: "Direct liaison with NC Department of Commerce, EDPNC, USAID, and in-country Investment Promotion Agencies at every AfDEC hub. We navigate bureaucracy so you can move at business speed.",
    tags: ["EDPNC access", "IPA liaison", "Regulatory navigation"],
  },
  {
    icon: Zap,
    title: "Digital Infrastructure",
    description: "Enterprise-grade internet, secure VPN, VoIP, co-working management systems, and access to the AfDEC intelligence platform at every hub location. GDPR/SOC2-adjacent security standards.",
    tags: ["1Gbps internet", "Secure VPN", "AfDEC intelligence access"],
  },
  {
    icon: Landmark,
    title: "Banking & Finance Access",
    description: "Introductions to NC banking partners (First Horizon, Truist, Southern First), trade finance instruments, Afreximbank correspondent relationships, and EB-5 investment pathway advisory.",
    tags: ["Business bank intro", "Trade finance", "Afreximbank network"],
  },
];

const STATS = [
  { value: "6", label: "Hub Cities", sublabel: "2 NC + 4 Africa" },
  { value: "180+", label: "Companies Served", sublabel: "Since 2023" },
  { value: "$2.3B", label: "Trade Facilitated", sublabel: "Through hub corridors" },
  { value: "12", label: "Gov't Partners", sublabel: "NC + Africa IPAs" },
];

export default function DualContinentBusinessHubPage() {
  const statsRef = useRef<HTMLDivElement>(null);
  const hubsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(".stat-item", { y: 30, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: "power3.out",
        scrollTrigger: { trigger: statsRef.current, start: "top 85%" } }
    );
    gsap.fromTo(".hub-card", { y: 40, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: "power3.out",
        scrollTrigger: { trigger: hubsRef.current, start: "top 80%" } }
    );
  }, {});

  return (
    <main className="min-h-screen bg-zinc-950 font-sans selection:bg-blue-500/30 selection:text-blue-200">
      <div className="sticky top-0 z-[100] w-full flex flex-col" data-nav-id="main-nav">
        <TopNav />
        <FlashBanner />
        <Header />
      </div>
      <Breadcrumb />
      <SectionNav sections={PAGE_SECTIONS} accentColor="blue" />

      {/* ── Hero ── */}
      <section id="overview" className="relative bg-zinc-950 border-b border-zinc-800/50 overflow-hidden">
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=2670&auto=format&fit=crop')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-zinc-950/30" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-950 to-transparent" />
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-24 md:py-32 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-800/80 border border-zinc-700/50 mb-6 rounded-full backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[11px] font-bold tracking-[0.2em] text-zinc-400 uppercase">Strategic Footprint · Infrastructure</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] max-w-4xl mb-6">
            Dual-Continent<br className="hidden md:block" /> Business Hubs
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed font-medium mb-10">
            Physical and operational presence across North Carolina and five African cities — serving as the transatlantic commercial infrastructure for enterprise expansion, trade facilitation, and diaspora investment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="#apply" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold tracking-widest uppercase px-8 py-4 rounded-sm transition-all">
              <span>Claim Your Hub Desk</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="#hub-locations" className="inline-flex items-center gap-2 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-sm font-bold tracking-widest uppercase px-8 py-4 rounded-sm transition-all">
              View All Hub Locations
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      </section>

      {/* ── Stats ── */}
      <section ref={statsRef} className="bg-zinc-900/30 border-b border-zinc-800/30 py-14">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s) => (
              <div key={s.label} className="stat-item text-center p-6 border border-zinc-800/50 rounded-sm bg-zinc-900/20">
                <div className="text-4xl font-black text-blue-400 mb-1">{s.value}</div>
                <div className="text-sm font-bold text-white mb-0.5">{s.label}</div>
                <div className="text-[10px] text-zinc-600 uppercase tracking-wider font-medium">{s.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Hub Locations ── */}
      <section id="hub-locations" ref={hubsRef} className="bg-zinc-950 py-24 border-b border-zinc-800/30">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-px bg-blue-500" />
              <span className="text-[11px] font-bold tracking-[0.2em] text-blue-400 uppercase">Hub Network</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white">Six Cities. One Network.</h2>
            <p className="text-zinc-400 mt-4 max-w-2xl text-[15px]">
              Four African hubs and two North Carolina anchors form a single, interconnected trade and enterprise infrastructure system — giving AfDEC members simultaneous presence on both continents.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {HUB_LOCATIONS.map((hub) => (
              <div key={hub.city}
                className="hub-card group bg-zinc-900/30 border border-zinc-800/50 rounded-sm p-7 hover:border-blue-500/20 transition-all duration-300 relative overflow-hidden"
              >
                {hub.status !== "Active" && (
                  <div className="absolute top-4 right-4 px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 rounded-full text-[9px] font-bold text-amber-400 uppercase tracking-widest">
                    {hub.status}
                  </div>
                )}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-3xl mb-2">{hub.flag}</div>
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{hub.type}</div>
                    <h3 className="text-xl font-black text-white">{hub.city}</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3 h-3 text-zinc-600" />
                      <span className="text-xs text-zinc-500">{hub.country}</span>
                    </div>
                  </div>
                </div>
                <p className="text-zinc-400 text-[13px] leading-relaxed mb-5">{hub.description}</p>
                <div className="space-y-2">
                  {hub.highlights.map((h) => (
                    <div key={h} className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />
                      <span className="text-[12px] text-zinc-400">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" className="bg-[#080808] py-24 border-b border-zinc-800/30">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-px bg-emerald-500" />
              <span className="text-[11px] font-bold tracking-[0.2em] text-emerald-400 uppercase">Hub Services</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white">What You Get at Every Hub</h2>
            <p className="text-zinc-400 mt-4 max-w-2xl text-[15px]">
              Each AfDEC hub delivers a consistent stack of enterprise services — adapted for local context, connected across the full network.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((svc) => {
              const Icon = svc.icon;
              return (
                <div key={svc.title} className="group bg-zinc-900/20 border border-zinc-800/40 p-7 rounded-sm hover:border-zinc-700 transition-all duration-300">
                  <div className="w-10 h-10 rounded-sm bg-zinc-800/80 flex items-center justify-center mb-5 group-hover:bg-blue-500/10 transition-colors">
                    <Icon className="w-5 h-5 text-zinc-400 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <h3 className="text-white font-bold text-[16px] mb-2">{svc.title}</h3>
                  <p className="text-zinc-500 text-[13px] leading-relaxed mb-4">{svc.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {svc.tags.map((tag) => (
                      <span key={tag} className="text-[10px] font-bold text-zinc-500 bg-zinc-800/60 px-2 py-0.5 rounded-sm border border-zinc-700/50 uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Ecosystem Map ── */}
      <section id="ecosystem" className="bg-zinc-950 py-24 border-b border-zinc-800/30">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="w-8 h-px bg-purple-500" />
                <span className="text-[11px] font-bold tracking-[0.2em] text-purple-400 uppercase">Ecosystem</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6">The Hub Ecosystem</h2>
              <p className="text-zinc-400 text-[15px] leading-relaxed mb-8">
                The AfDEC hub network operates as a single coordinated enterprise ecosystem — not a collection of co-working spaces. From Raleigh to Nairobi, members have access to the same intelligence platform, the same government liaison desk, and the same global trade facilitation infrastructure.
              </p>
              <div className="space-y-4">
                {[
                  { label: "Unified AfDEC Intelligence Platform access across all 6 hubs" },
                  { label: "Single membership — operate in any hub city without extra fees" },
                  { label: "Weekly cross-hub video briefings connecting NC and Africa teams" },
                  { label: "Shared deal room for cross-continental M&A and JV coordination" },
                  { label: "Quarterly in-person summits alternating between NC and Africa" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span className="text-zinc-300 text-[14px]">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Visual - Network diagram */}
            <div className="relative">
              <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-8 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03]"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.5'%3E%3Cpath d='M0 20h40M20 0v40'/%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: "40px 40px" }} />
                <div className="relative z-10 flex flex-col gap-4">
                  {/* NC Hubs */}
                  <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">🇺🇸 North Carolina</div>
                  <div className="grid grid-cols-2 gap-3">
                    {["Raleigh-Durham HQ", "Charlotte Finance"].map((hub) => (
                      <div key={hub} className="bg-blue-950/40 border border-blue-900/30 rounded-sm px-4 py-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mb-2" />
                        <div className="text-xs font-bold text-blue-300">{hub}</div>
                      </div>
                    ))}
                  </div>
                  {/* Connection line */}
                  <div className="flex items-center gap-2 my-2">
                    <div className="flex-1 h-px bg-gradient-to-r from-blue-500/50 to-emerald-500/50" />
                    <Globe className="w-4 h-4 text-zinc-600" />
                    <div className="flex-1 h-px bg-gradient-to-r from-emerald-500/50 to-blue-500/50" />
                  </div>
                  {/* Africa Hubs */}
                  <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">🌍 Africa</div>
                  <div className="grid grid-cols-2 gap-3">
                    {["Nairobi, Kenya", "Lagos, Nigeria", "Accra, Ghana", "Abidjan, CI"].map((hub) => (
                      <div key={hub} className="bg-emerald-950/40 border border-emerald-900/30 rounded-sm px-4 py-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mb-2" />
                        <div className="text-xs font-bold text-emerald-300">{hub}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Apply / CTA ── */}
      <section id="apply" className="bg-[#080808] py-24">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="bg-gradient-to-br from-blue-950/30 to-zinc-900/40 border border-blue-900/20 rounded-xl p-10 md:p-14 relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-72 h-72 bg-blue-600/5 rounded-full blur-[100px]" />
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 mb-6">
                <Building2 className="w-5 h-5 text-blue-400" />
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-widest">Hub Access</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Claim Your Hub Presence</h2>
              <p className="text-zinc-400 text-[15px] leading-relaxed mb-8">
                Whether you are a North Carolina company seeking African market entry, or an African enterprise establishing a U.S. base — AfDEC hub membership gives you the physical, operational, and network infrastructure to move at speed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold tracking-widest uppercase px-8 py-4 rounded-sm transition-all">
                  <span>Request Hub Access</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/invest" className="inline-flex items-center gap-2 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-sm font-bold tracking-widest uppercase px-8 py-4 rounded-sm transition-all">
                  Explore Membership
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="relative bg-zinc-950 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')" }} />
        <Newsletter />
        <Footer />
      </div>
    </main>
  );
}
