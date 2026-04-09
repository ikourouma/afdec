export type InitiativeSection = {
  id: string;
  label: string;
  type: "hero_stats" | "text_columns" | "cards" | "cta" | "coming_soon";
  data: Record<string, any>;
};

export type Initiative = {
  slug: string;
  label: string;
  badge_color: string;
  accent: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image: string;
  hero_image_position?: string;
  is_gated: boolean;
  sections: InitiativeSection[];
};

export const initiatives: Record<string, Initiative> = {
  grow: {
    slug: "grow",
    label: "Business Development",
    badge_color: "text-blue-400",
    accent: "blue",
    hero_title: "Grow with AfDEC",
    hero_subtitle: "A sovereign business development engine connecting African diaspora-led enterprises to North Carolina's supply chains, capital markets, and government procurement pipelines.",
    hero_image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2670&auto=format&fit=crop",
    is_gated: false,
    sections: [
      {
        id: "overview",
        label: "Overview",
        type: "text_columns",
        data: {
          heading: "From Startup to Sovereign Scale",
          body: "AfDEC's Grow initiative provides diaspora entrepreneurs with direct access to NC's institutional procurement ecosystem, strategic capital introductions, and high-value mentorship from verified trade leaders.",
          columns: [
            { icon: "TrendingUp", title: "Capital Access", body: "Direct introductions to NC-based impact investors, CDFI lenders, and sovereign trade finance desks." },
            { icon: "Network", title: "Supply Chain Integration", body: "Preferred vendor placement in State of NC and Fortune 500 supplier diversity programs." },
            { icon: "Award", title: "Certification Support", body: "DBE, MBE, and SBA 8(a) certification pathways with dedicated case managers." },
            { icon: "Globe", title: "Export Readiness", body: "Export licensing, trade compliance, and market entry strategy for bi-national expansion." },
          ]
        }
      },
      {
        id: "stats",
        label: "Impact",
        type: "hero_stats",
        data: {
          stats: [
            { value: "$120M+", label: "Capital Facilitated", sub: "Since inception" },
            { value: "340+", label: "Businesses Supported", sub: "Across 18 sectors" },
            { value: "54", label: "African Markets", sub: "Export-ready pipelines" },
            { value: "92%", label: "Success Rate", sub: "DBE/MBE certifications" },
          ]
        }
      },
      {
        id: "cta",
        label: "Apply",
        type: "cta",
        data: {
          heading: "Ready to scale your enterprise?",
          body: "Submit your institutional profile and a dedicated AfDEC Growth Advisor will contact you within 48 hours to assess your fit for the program.",
          primary_label: "Apply to Grow with AfDEC",
          primary_href: "/contact",
          secondary_label: "Learn About Membership",
          secondary_href: "/invest",
        }
      }
    ]
  },

  "africa-works": {
    slug: "africa-works",
    label: "Workforce Development",
    badge_color: "text-emerald-400",
    accent: "emerald",
    hero_title: "Africa Works Initiative",
    hero_subtitle: "Closing the skills gap between African talent and the North Carolina economy through sovereign workforce pipelines, bilateral training programs, and executive placement.",
    hero_image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2670&auto=format&fit=crop",
    is_gated: false,
    sections: [
      {
        id: "overview",
        label: "Overview",
        type: "text_columns",
        data: {
          heading: "Building the Transatlantic Talent Bridge",
          body: "Africa Works is AfDEC's flagship human capital program — directly connecting trained African professionals with NC employers in high-demand sectors including advanced manufacturing, life sciences, and financial services.",
          columns: [
            { icon: "Users", title: "Talent Pipeline", body: "Curated database of 5,000+ pre-vetted professionals from 22 African nations ready for NC placement." },
            { icon: "Briefcase", title: "Executive Placement", body: "C-suite and senior leadership placements in partnership with NC's top executive search firms." },
            { icon: "GraduationCap", title: "Skills Certification", body: "Industry-recognized certification pathways co-developed with NC Community College system." },
            { icon: "Handshake", title: "Employer Network", body: "450+ NC employers enrolled in the Africa Works preferred hiring network." },
          ]
        }
      },
      {
        id: "stats",
        label: "Impact",
        type: "hero_stats",
        data: {
          stats: [
            { value: "5,000+", label: "Talent Pool", sub: "Pre-vetted professionals" },
            { value: "450+", label: "NC Employers", sub: "Active hiring partners" },
            { value: "22", label: "African Nations", sub: "Talent sourcing" },
            { value: "$85K", label: "Avg. Placement Salary", sub: "2025 cohort" },
          ]
        }
      },
      {
        id: "cta",
        label: "Join",
        type: "cta",
        data: {
          heading: "Employers: Access African Talent",
          body: "Join 450+ NC employers who have discovered the strategic advantage of Africa Works placements. Register your organization to receive curated candidate profiles.",
          primary_label: "Register as Employer",
          primary_href: "/contact",
          secondary_label: "View Job Fairs 2026",
          secondary_href: "/careers",
        }
      }
    ]
  },

  poverty: {
    slug: "poverty",
    label: "Social Impact",
    badge_color: "text-amber-400",
    accent: "amber",
    hero_title: "Standing Against Poverty",
    hero_subtitle: "AfDEC's sovereign social impact mandate. Deploying institutional capital and diaspora expertise to fund community resilience, food security, and economic mobility across underserved African communities.",
    hero_image: "https://images.unsplash.com/photo-1609198092458-38a293c7ac4b?q=80&w=2670&auto=format&fit=crop",
    is_gated: false,
    sections: [
      {
        id: "overview",
        label: "Overview",
        type: "text_columns",
        data: {
          heading: "Economic Dignity as a Sovereign Right",
          body: "This initiative mobilizes the diaspora's collective economic power — through targeted micro-investment, skills training, and public-private partnerships — to create substantive, measurable impact against poverty across the continent.",
          columns: [
            { icon: "Heart", title: "Micro-Investment", body: "Direct funding to community-led enterprises in food security, water access, and health." },
            { icon: "BookOpen", title: "Education Access", body: "Scholarship programs and digital learning infrastructure for underserved youth." },
            { icon: "Home", title: "Housing & Shelter", body: "Diaspora-backed affordable housing development initiatives in partnership with local NGOs." },
            { icon: "ShieldCheck", title: "Health Systems", body: "Investment in primary care and maternal health infrastructure across 12 priority nations." },
          ]
        }
      },
      {
        id: "stats",
        label: "Impact",
        type: "hero_stats",
        data: {
          stats: [
            { value: "$8.2M", label: "Deployed Capital", sub: "Direct community impact" },
            { value: "12", label: "Priority Nations", sub: "Active programs" },
            { value: "18,000+", label: "Lives Impacted", sub: "2025 fiscal year" },
            { value: "47", label: "Partner NGOs", sub: "On-ground execution" },
          ]
        }
      },
      {
        id: "cta",
        label: "Contribute",
        type: "cta",
        data: {
          heading: "Contribute to the Diaspora Impact Fund",
          body: "Your institutional contribution funds measurable community transformation. All deployments are audited and reported in the AfDEC Annual Report.",
          primary_label: "Make an Impact Contribution",
          primary_href: "/invest",
          secondary_label: "Read the Annual Report",
          secondary_href: "/annual-report",
        }
      }
    ]
  },

  climate: {
    slug: "climate",
    label: "Sustainability",
    badge_color: "text-green-400",
    accent: "green",
    hero_title: "Climate & Growth",
    hero_subtitle: "Positioning Africa's green infrastructure transition as North Carolina's most significant bilateral investment opportunity of the next decade.",
    hero_image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2670&auto=format&fit=crop",
    is_gated: false,
    sections: [
      {
        id: "overview",
        label: "Overview",
        type: "text_columns",
        data: {
          heading: "Green Infrastructure as Sovereign Capital",
          body: "AfDEC's Climate & Growth initiative channels NC's clean energy expertise — solar, EV, and biomass — directly into Africa's rapidly growing green infrastructure pipeline, creating sovereign-grade investment opportunities.",
          columns: [
            { icon: "Sun", title: "Solar Development", body: "NC solar developers matched with African utility-scale procurement opportunities across 8 nations." },
            { icon: "Zap", title: "EV & Battery Hub", body: "Lithium processing and EV manufacturing corridor development anchored in central NC." },
            { icon: "Leaf", title: "AgriTech & Biomass", body: "Sustainable agriculture technology transfers reducing food waste and expanding bioenergy capacity." },
            { icon: "BarChart", title: "Carbon Markets", body: "Sovereign carbon credit origination and verification programs for diaspora-led reforestation." },
          ]
        }
      },
      {
        id: "stats",
        label: "Impact",
        type: "hero_stats",
        data: {
          stats: [
            { value: "$2.4B", label: "Pipeline Value", sub: "Green infrastructure" },
            { value: "8", label: "Target Nations", sub: "Solar & EV corridors" },
            { value: "12GW", label: "Solar Capacity Target", sub: "2030 mandate" },
            { value: "3,200", label: "Green Jobs", sub: "Projected NC creation" },
          ]
        }
      },
      {
        id: "cta",
        label: "Invest",
        type: "cta",
        data: {
          heading: "Join the Green Corridor Investment Group",
          body: "Institutional investors and NC-based clean energy developers can access exclusive project RFPs through the AfDEC Green Corridor program.",
          primary_label: "Access Investment Briefings",
          primary_href: "/invest",
          secondary_label: "Partner With Us",
          secondary_href: "/contact",
        }
      }
    ]
  },

  "state-of-business": {
    slug: "state-of-business",
    label: "Members Only",
    badge_color: "text-purple-400",
    accent: "purple",
    hero_title: "The State of Africa Business",
    hero_subtitle: "AfDEC's premier annual intelligence publication — the definitive data-driven benchmark for US-Africa bilateral trade, investment flows, and sovereign market intelligence.",
    hero_image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2670&auto=format&fit=crop",
    is_gated: true,
    sections: [
      {
        id: "coming_soon",
        label: "Coming Soon",
        type: "coming_soon",
        data: {
          heading: "The Flagship is Being Built",
          body: "The State of Africa Business will be the most comprehensive bilateral intelligence publication on the US-Africa trade corridor — rigorously modeled on leading institutional reports from the US Chamber, World Bank, and AfDB. We are currently assessing the full scope of this initiative to ensure it reflects the depth and authority appropriate for sovereign-grade stakeholders.",
          features: [
            "Annual flagship report — bilateral trade, FDI flows, sector intelligence",
            "Virtual & in-person executive summits, AfDEC-hosted",
            "Members-only data terminal with live economic indicators",
            "Embargoed country briefs for institutional investors",
            "Curated executive briefing sessions with government ministers",
          ],
          notify_heading: "Stay Informed",
          notify_body: "Register your institutional interest. Members and strategic partners will receive priority access to the inaugural publication.",
        }
      }
    ]
  },

  antitrust: {
    slug: "antitrust",
    label: "Policy Advocacy",
    badge_color: "text-red-400",
    accent: "red",
    hero_title: "Antitrust & Free Markets",
    hero_subtitle: "AfDEC's policy advocacy arm — championing fair competition, open trade, and regulatory frameworks that enable African diaspora enterprises to compete without structural disadvantage.",
    hero_image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2670&auto=format&fit=crop",
    is_gated: false,
    sections: [
      {
        id: "overview",
        label: "Overview",
        type: "text_columns",
        data: {
          heading: "Policy as a Sovereign Tool",
          body: "AfDEC monitors legislative and regulatory developments that directly impact diaspora enterprise viability — engaging federal agencies, NC state legislature, and international trade bodies to ensure fair market access.",
          columns: [
            { icon: "Scale", title: "Regulatory Monitoring", body: "Real-time tracking of US-Africa trade regulations, tariff schedules, and compliance mandates." },
            { icon: "FileText", title: "Policy Briefs", body: "Institutional-grade policy briefs submitted to USTR, Commerce, and NC legislative bodies." },
            { icon: "Users", title: "Coalition Building", body: "Organizing diaspora business coalitions to engage effectively in public comment and rulemaking." },
            { icon: "Globe", title: "International Advocacy", body: "Representation at WTO, AfDB, and bilateral treaty sessions impacting diaspora enterprise." },
          ]
        }
      },
      {
        id: "stats",
        label: "Advocacy",
        type: "hero_stats",
        data: {
          stats: [
            { value: "24", label: "Policy Briefs Filed", sub: "Federal & state level" },
            { value: "8", label: "Trade Agreements", sub: "Monitored actively" },
            { value: "3", label: "Congressional Hearings", sub: "Testimony submitted" },
            { value: "12", label: "Coalition Partners", sub: "Unified advocacy" },
          ]
        }
      },
      {
        id: "cta",
        label: "Engage",
        type: "cta",
        data: {
          heading: "Shape the Policy Landscape",
          body: "AfDEC accepts formal policy submissions from registered member organizations. Join our advocacy coalition to amplify diaspora enterprise interests at every level of government.",
          primary_label: "Join the Policy Coalition",
          primary_href: "/contact",
          secondary_label: "View Policy Publications",
          secondary_href: "/annual-report",
        }
      }
    ]
  }
};

export function getInitiative(slug: string): Initiative | null {
  return initiatives[slug] ?? null;
}

export const initiativesList = Object.values(initiatives);
