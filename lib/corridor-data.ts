// ─────────────────────────────────────────────────────────────────────────────
// AfDEC Transatlantic Corridor — Data Layer
// CMS-ready: structured for 1:1 Supabase migration
// ─────────────────────────────────────────────────────────────────────────────

export type CorridorSection = {
  id: string;
  label: string;
  type: "hero_stats" | "text_columns" | "pipeline_grid" | "cta" | "coming_soon";
  data: Record<string, any>;
};

export type CorridorPage = {
  slug: string;
  label: string;
  tag: string;
  accent: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image: string;
  hero_image_position?: string;
  is_gated: boolean;
  sections: CorridorSection[];
  // Mega menu group: 'core' (shown on /corridor hub) | 'integration' (shown under transatlantic nav)
  group?: "core" | "integration";
};

export const corridorPages: Record<string, CorridorPage> = {

  // ── 1. NC–Africa Trade Corridor ──────────────────────────────────────────
  "nc-africa": {
    slug: "nc-africa",
    group: "core",
    label: "NC–Africa Trade Corridor",
    tag: "Transatlantic Commerce",
    accent: "blue",
    hero_title: "The North Carolina — Africa Trade Corridor",
    hero_subtitle: "A structured bilateral trade program connecting North Carolina's $680 billion economy with 54 African sovereign markets — through deal flow support, compliance guidance, and institutional business matchmaking.",
    hero_image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=2670&auto=format&fit=crop",
    hero_image_position: "center",
    is_gated: false,
    sections: [
      {
        id: "overview",
        label: "Overview",
        type: "text_columns",
        data: {
          heading: "Sovereign-Grade Trade Infrastructure",
          body: "The NC–Africa Trade Corridor is the primary commercial artery of the AfDEC framework — a structured pathway converting diaspora relationships into institutionalized trade agreements, verified supplier networks, and bankable cross-border transactions.",
          columns: [
            { icon: "Handshake", title: "Bilateral Matchmaking", body: "Verified NC exporters matched with African importers across 12 high-demand sectors through AfDEC's sovereign deal desk." },
            { icon: "FileText", title: "Trade Documentation", body: "End-to-end export compliance — Certificates of Origin, phytosanitary documentation, and bilateral treaty structuring." },
            { icon: "Globe", title: "Market Access", body: "Direct access to government procurement officers, port authorities, and trade ministers across priority African markets." },
            { icon: "ShieldCheck", title: "Business Verification", body: "AfDEC-prepared verification reports on African trade partners and buyers — protecting NC exporters before any transaction is committed." },
          ]
        }
      },
      {
        id: "stats",
        label: "Corridor Data",
        type: "hero_stats",
        data: {
          stats: [
            { value: "$2.1B", label: "Annual Trade Volume", sub: "NC–Africa corridor (2024)" },
            { value: "54", label: "Sovereign Markets", sub: "Active bilateral coverage" },
            { value: "320+", label: "Verified Suppliers", sub: "NC-based exporters" },
            { value: "18", label: "Sector Categories", sub: "From agri to aerospace" },
          ]
        }
      },
      {
        id: "pipeline",
        label: "Pipeline",
        type: "pipeline_grid",
        data: {
          heading: "Active Trade Categories",
          body: "AfDEC actively sources buyer-seller matches across these priority sectors. NC exporters can register to be included in the next quarterly trade briefing.",
          items: [
            { icon: "Sun", title: "Clean Energy", sub: "Solar panels, inverters, battery systems", status: "Active", markets: "Nigeria, Ghana, Kenya" },
            { icon: "Leaf", title: "Agri-Tech", sub: "Precision farming equipment, seeds, irrigation", status: "Active", markets: "Ethiopia, Côte d'Ivoire, Zambia" },
            { icon: "GraduationCap", title: "EdTech & Training", sub: "LMS platforms, curriculum, vocational tooling", status: "Active", markets: "South Africa, Morocco, Tanzania" },
            { icon: "Heart", title: "Life Sciences", sub: "Medical devices, diagnostics, pharmaceuticals", status: "Growing", markets: "Kenya, Egypt, Nigeria" },
            { icon: "BarChart", title: "Financial Services", sub: "Fintech infrastructure, compliance solutions", status: "Growing", markets: "Nigeria, Ghana, Morocco" },
            { icon: "Briefcase", title: "Professional Services", sub: "Legal, accounting, engineering, consulting", status: "Monitoring", markets: "All 54 markets" },
          ]
        }
      },
      {
        id: "cta",
        label: "Register",
        type: "cta",
        data: {
          heading: "Register for the NC–Africa Trade Corridor",
          body: "NC-based exporters and African importers can apply to be included in AfDEC's quarterly Trade Briefing — a curated bilateral deal session attended by sovereign procurement officers and institutional buyers.",
          primary_label: "Register as NC Exporter",
          primary_href: "/contact",
          secondary_label: "View Trade Events",
          secondary_href: "/events",
        }
      }
    ]
  },

  // ── 2. Sovereign Procurement ──────────────────────────────────────────────
  procurement: {
    slug: "procurement",
    group: "core",
    label: "Sovereign Procurement",
    tag: "Public Sector Access",
    accent: "amber",
    hero_title: "Sovereign Procurement Gateway",
    hero_subtitle: "Connecting AfDEC-certified enterprises directly to African government procurement pipelines — public infrastructure, healthcare, defense supply chains, and national digitization programs.",
    hero_image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2670&auto=format&fit=crop",
    hero_image_position: "center top",
    is_gated: false,
    sections: [
      {
        id: "overview",
        label: "Overview",
        type: "text_columns",
        data: {
          heading: "Institutional Access to African Public Sector",
          body: "African governments collectively procure over $600 billion annually. AfDEC's Sovereign Procurement Gateway provides NC-based enterprises with the compliance certification, relationship infrastructure, and bid support to compete for this institutional market.",
          columns: [
            { icon: "Award", title: "AfDEC Certification", body: "Certified enterprises receive a verified supplier credential recognized by 12+ African procurement agencies." },
            { icon: "Globe", title: "Tender Intelligence", body: "Early-access intelligence on upcoming government RFPs across infrastructure, health, and digitization sectors." },
            { icon: "Network", title: "Bid Consortium Support", body: "AfDEC structures JV agreements and consortium bids enabling smaller NC firms to qualify for large sovereign contracts." },
            { icon: "FileText", title: "Compliance Navigation", body: "Country-specific regulatory guidance — covering import licensing, local content rules, and fiscal law requirements for 12+ African markets." },
          ]
        }
      },
      {
        id: "stats",
        label: "Impact",
        type: "hero_stats",
        data: {
          stats: [
            { value: "$600B+", label: "Annual Procurement", sub: "African public sector total" },
            { value: "12+", label: "Partner Agencies", sub: "Government procurement recognition" },
            { value: "47", label: "Active Bids", sub: "Q1 2026 pipeline" },
            { value: "$380M", label: "Contracts Supported", sub: "Since program inception" },
          ]
        }
      },
      {
        id: "cta",
        label: "Apply",
        type: "cta",
        data: {
          heading: "Get Procurement-Certified by AfDEC",
          body: "The AfDEC Procurement Certification process takes 30 days and positions your enterprise for competitive inclusion in African government tender processes across 12 priority nations.",
          primary_label: "Begin Certification Process",
          primary_href: "/contact",
          secondary_label: "View Active Tenders",
          secondary_href: "/events",
        }
      }
    ]
  },

  // ── 3. Investment Architecture ────────────────────────────────────────────
  investment: {
    slug: "investment",
    group: "core",
    label: "Investment Program",
    tag: "Business Investment",
    accent: "emerald",
    hero_title: "Transatlantic Investment Program",
    hero_subtitle: "AfDEC's structured investment program — connecting NC investors and capital to African businesses, government bonds, and growth funds through verified channels and bilateral partnerships.",
    hero_image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2670&auto=format&fit=crop",
    hero_image_position: "center",
    is_gated: false,
    sections: [
      {
        id: "overview",
        label: "Overview",
        type: "text_columns",
        data: {
          heading: "Capital Mobility at Institutional Scale",
          body: "AfDEC's Investment Architecture division creates the regulatory, legal, and operational infrastructure to move capital efficiently and compliantly between NC and African markets — at sovereign-grade standards.",
          columns: [
            { icon: "TrendingUp", title: "Diaspora Bond Program", body: "Sovereign and sub-sovereign bond instruments co-designed with African finance ministries for diaspora investors." },
            { icon: "Network", title: "Investment Fund Setup", body: "Investor and fund manager partnership structures compliant with SEC, FINRA, and African capital market regulations — for funds operating in both jurisdictions." },
            { icon: "BarChart", title: "Deal Sourcing", body: "AfDEC's investment desk sources opportunities across infrastructure, real estate, agribusiness, and technology sectors." },
            { icon: "ShieldCheck", title: "Business Verification", body: "Institutional-grade verification reports on African investment opportunities, reviewed by AfDEC's intelligence team before introduction." },
          ]
        }
      },
      {
        id: "stats",
        label: "Capital Data",
        type: "hero_stats",
        data: {
          stats: [
            { value: "$480M", label: "Investment Portfolio", sub: "Active deal management" },
            { value: "16", label: "Investment Vehicles", sub: "Active across 8 sectors" },
            { value: "3", label: "Diaspora Bond Issues", sub: "Co-structured with ministries" },
            { value: "$120M+", label: "Capital Deployed", sub: "Since 2022 inception" },
          ]
        }
      },
      {
        id: "cta",
        label: "Invest",
        type: "cta",
        data: {
          heading: "Access AfDEC's Investment Desk",
          body: "Individual and institutional investors can book a briefing with an AfDEC Investment Advisor to explore our current portfolio of transatlantic investment opportunities.",
          primary_label: "Request Investment Briefing",
          primary_href: "/invest",
          secondary_label: "Download Investment Deck",
          secondary_href: "/annual-report",
        }
      }
    ]
  },

  // ── 4. EPC & Infrastructure ───────────────────────────────────────────────
  infrastructure: {
    slug: "infrastructure",
    group: "core",
    label: "Engineering & Construction (EPC)",
    tag: "Development Finance",
    accent: "purple",
    hero_title: "Engineering, Procurement & Construction (EPC)",
    hero_subtitle: "Deploying NC's world-class engineering and construction capacity into Africa's $170 billion annual infrastructure gap — through AfDEC-facilitated project finance, contractor certification, and development bank partnerships.",
    hero_image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2670&auto=format&fit=crop",
    hero_image_position: "center",
    is_gated: false,
    sections: [
      {
        id: "overview",
        label: "Overview",
        type: "text_columns",
        data: {
          heading: "NC Engineering Meets Africa's Infrastructure Gap",
          body: "The African Development Bank estimates a $170 billion annual infrastructure financing gap — updated from the widely-cited $108B to reflect 2024-2025 investment data. AfDEC's Engineering, Procurement, and Construction (EPC) program positions NC's engineering firms to capture a meaningful share of this opportunity through formal project pipeline access and development finance partnerships.",
          columns: [
            { icon: "Zap", title: "Energy Infrastructure", body: "Grid development, solar farms, and utility-scale storage — AfDEC connects NC EPC firms to African energy ministry RFPs." },
            { icon: "Globe", title: "Transport & Logistics", body: "Road, rail, port, and cold chain logistics development across priority African corridors." },
            { icon: "Home", title: "Urban Development", body: "Affordable housing, commercial real estate, and smart city infrastructure in high-growth urban corridors." },
            { icon: "TrendingUp", title: "Project Finance", body: "AfDB, IFC, and DFC project finance structuring — AfDEC navigates development bank pipelines for NC contractors." },
          ]
        }
      },
      {
        id: "stats",
        label: "Pipeline",
        type: "hero_stats",
        data: {
          stats: [
            { value: "$170B", label: "Annual Infrastructure Gap", sub: "Revised AfDB 2024 figure" },
            { value: "24", label: "Active Projects", sub: "AfDEC EPC pipeline" },
            { value: "8", label: "Development Banks", sub: "Finance partner network" },
            { value: "$2.8B", label: "Project Value", sub: "Current bid pipeline" },
          ]
        }
      },
      {
        id: "cta",
        label: "Bid",
        type: "cta",
        data: {
          heading: "Access AfDEC's EPC Project Pipeline",
          body: "NC-based EPC firms can register for AfDEC's contractor certification program to receive vetted project RFPs, development bank introductions, and bid support from AfDEC's infrastructure team.",
          primary_label: "Register as EPC Contractor",
          primary_href: "/contact",
          secondary_label: "View Infrastructure Events",
          secondary_href: "/events",
        }
      }
    ]
  },
};

// ── Corridor pages also serve the 4 Transatlantic Integration mega menu links
// These are imported from all-pages-data and re-exported here for the /corridor/[slug] router
export { integrationPages, getIntegrationPage } from "@/lib/all-pages-data";

export function getCorridorPage(slug: string): CorridorPage | null {
  // Check core corridor pages first
  return corridorPages[slug] ?? null;
}

export const corridorList = Object.values(corridorPages).filter((p) => p.group === "core" || !p.group);
