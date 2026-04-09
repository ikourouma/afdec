// ─────────────────────────────────────────────────────────────────────────────
// AfDEC All-Pages Data Layer (Phases A–C)
// Sources: USTR, AfDB, UN Tourism, World Bank, NC Department of Commerce, IMF
// CMS-ready: structured for Supabase migration
// ─────────────────────────────────────────────────────────────────────────────

export type PageSection = {
  id: string;
  label: string;
  type: "hero_stats" | "text_columns" | "pipeline_grid" | "region_grid" | "cta" | "tourism_pillars" | "coming_soon";
  data: Record<string, any>;
};

export type PageDef = {
  slug: string;
  label: string;
  tag: string;
  accent: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image: string;
  hero_image_position?: string;
  is_gated: boolean;
  sections: PageSection[];
};

// ─────────────────────────────────────────────────────────────────────────────
// PHASE A: Transatlantic Integration — 4 Pages
// Routes: /corridor/expansion  /corridor/export-trade
//         /corridor/partnerships  /corridor/markets
// ─────────────────────────────────────────────────────────────────────────────
export const integrationPages: Record<string, PageDef> = {

  expansion: {
    slug: "expansion",
    label: "Enterprise Expansion Support",
    tag: "Business Growth",
    accent: "blue",
    hero_title: "Enterprise Expansion Support",
    hero_subtitle: "AfDEC removes the barriers between your business and the African market — connecting North Carolina enterprises to buyers, partners, and government contracts across all 54 nations through a single, structured program.",
    hero_image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2670&auto=format&fit=crop",
    hero_image_position: "center",
    is_gated: false,
    sections: [
      {
        id: "overview",
        label: "Overview",
        type: "text_columns",
        data: {
          heading: "Your Business, Two Continents",
          body: "North Carolina exported $42.8 billion in goods and services in 2024. AfDEC's expansion program helps your business claim a share of the rapidly growing US-Africa trade relationship — now worth over $104.9 billion annually — with hands-on support from application to first transaction.",
          columns: [
            { icon: "Award", title: "Business Certification", body: "AfDEC-certified enterprises are recognized by 12+ African procurement agencies, opening doors to government and institutional buyers." },
            { icon: "Network", title: "Supplier Network Access", body: "Direct placement in NC State and Fortune 500 supplier diversity programs, as well as African corporate procurement lists." },
            { icon: "Users", title: "Mentorship & Advisory", body: "One-on-one support from verified trade leaders who have already built successful NC–Africa business relationships." },
            { icon: "Globe", title: "Market-Ready Preparation", body: "Step-by-step guidance on export licensing, trade compliance, and market entry strategy for your specific sector and target country." },
          ]
        }
      },
      {
        id: "stats",
        label: "Program Impact",
        type: "hero_stats",
        data: {
          stats: [
            { value: "$104.9B", label: "US–Africa Trade", sub: "Annual value, 2024 (USTR)" },
            { value: "340+", label: "Businesses Supported", sub: "NC enterprises enrolled" },
            { value: "54", label: "African Markets", sub: "Open for NC exporters" },
            { value: "$42.8B", label: "NC Total Exports", sub: "2024 (NC Commerce)" },
          ]
        }
      },
      {
        id: "cta",
        label: "Apply",
        type: "cta",
        data: {
          heading: "Ready to Expand Your Business to Africa?",
          body: "Submit your business profile and an AfDEC Business Advisor will contact you within 48 hours to outline your expansion options and next steps.",
          primary_label: "Start Your Expansion",
          primary_href: "/contact",
          secondary_label: "Learn About Membership",
          secondary_href: "/invest",
        }
      }
    ]
  },

  "export-trade": {
    slug: "export-trade",
    label: "Export & Trade Assistance",
    tag: "Trade Services",
    accent: "emerald",
    hero_title: "Export & Trade Assistance",
    hero_subtitle: "Practical, end-to-end support for North Carolina businesses ready to export to Africa — from documentation and customs to finding the right buyer and getting paid across borders.",
    hero_image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=2670&auto=format&fit=crop",
    hero_image_position: "center",
    is_gated: false,
    sections: [
      {
        id: "overview",
        label: "How It Works",
        type: "text_columns",
        data: {
          heading: "Exporting Made Straightforward",
          body: "The African Growth and Opportunity Act (AGOA) gives US goods duty-free access to African markets. NC's top export sectors — pharmaceuticals (30% of exports), aerospace, and industrial machinery — all have strong demand across the continent. AfDEC handles the complexity so you can focus on the deal.",
          columns: [
            { icon: "FileText", title: "Export Documentation", body: "Certificates of Origin, Product Classification, Letters of Credit, and phytosanitary certificates — prepared correctly the first time." },
            { icon: "Globe", title: "Buyer Matching", body: "AfDEC matches your product or service to verified African buyers through our 320+ member import network across 18 sectors." },
            { icon: "ShieldCheck", title: "Payment Security", body: "Trade finance referrals, letter of credit guidance, and export credit insurance recommendations to protect every transaction." },
            { icon: "Handshake", title: "Logistics Support", body: "Freight forwarder referrals, Incoterms guidance, and port-of-entry briefings for your target African market." },
          ]
        }
      },
      {
        id: "stats",
        label: "Trade Data",
        type: "hero_stats",
        data: {
          stats: [
            { value: "30%", label: "NC Top Export", sub: "Pharmaceuticals (NC Commerce 2024)" },
            { value: "$900M+", label: "AGOA Agriculture", sub: "African exports to US under AGOA (USTR)" },
            { value: "320+", label: "Verified Buyers", sub: "AfDEC import network" },
            { value: "18", label: "Sectors Covered", sub: "From agriculture to aerospace" },
          ]
        }
      },
      {
        id: "pipeline",
        label: "Top Sectors",
        type: "pipeline_grid",
        data: {
          heading: "NC Export Sectors in Demand",
          body: "These sectors have the highest active demand from African buyers in the AfDEC network. Click your sector to see matched opportunities.",
          items: [
            { icon: "Heart", title: "Pharmaceuticals & Medical", sub: "NC's largest export — strong demand in Egypt, Nigeria, Kenya", status: "Active", markets: "Egypt, Nigeria, Kenya, South Africa" },
            { icon: "TrendingUp", title: "Aerospace & Defense Components", sub: "Morocco's aerospace hub is a top buyer of NC-made components", status: "Active", markets: "Morocco, South Africa, Ethiopia" },
            { icon: "Zap", title: "Clean Energy Equipment", sub: "Solar, inverters, battery systems — high demand across all regions", status: "Active", markets: "Nigeria, Ghana, Kenya, Morocco" },
            { icon: "Leaf", title: "Agriculture & Food Processing", sub: "Precision equipment, seeds, and logistics solutions", status: "Active", markets: "Ethiopia, Côte d'Ivoire, Tanzania, Zambia" },
            { icon: "Globe", title: "Industrial Machinery", sub: "Manufacturing and construction equipment", status: "Growing", markets: "Nigeria, Egypt, Angola, Algeria" },
            { icon: "BarChart", title: "Financial Technology", sub: "Payments infrastructure, compliance platforms", status: "Growing", markets: "Nigeria, Ghana, Kenya, Morocco" },
          ]
        }
      },
      {
        id: "cta",
        label: "Get Help",
        type: "cta",
        data: {
          heading: "Let Us Handle the Export Complexity",
          body: "Register with AfDEC's Trade Assistance desk and receive a free 60-minute export readiness consultation with a certified trade specialist.",
          primary_label: "Book a Free Trade Consultation",
          primary_href: "/contact",
          secondary_label: "View Active Trade Events",
          secondary_href: "/events",
        }
      }
    ]
  },

  partnerships: {
    slug: "partnerships",
    label: "Strategic Government Partnerships",
    tag: "Diplomatic Engagement",
    accent: "purple",
    hero_title: "Strategic Government Partnerships",
    hero_subtitle: "AfDEC serves as the institutional bridge between North Carolina and African governments — enabling formal bilateral agreements, joint development projects, and government-to-government business introductions.",
    hero_image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2670&auto=format&fit=crop",
    hero_image_position: "center top",
    is_gated: false,
    sections: [
      {
        id: "overview",
        label: "Overview",
        type: "text_columns",
        data: {
          heading: "Building Formal Government-to-Business Relationships",
          body: "African governments collectively spend 15–20% of their GDP through public procurement — representing trillions of dollars in contracts annually. AfDEC's government partnership program creates direct pathways for NC businesses to participate in this market through formal diplomatic channels and AfDEC-facilitated introductions.",
          columns: [
            { icon: "Globe", title: "Government Introductions", body: "Direct introductions to trade and commerce ministers, procurement officers, and economic development agencies across priority African nations." },
            { icon: "FileText", title: "Formal Agreements", body: "AfDEC facilitates Memoranda of Understanding (MOU) between NC institutions and African government bodies — creating lasting bilateral frameworks." },
            { icon: "Network", title: "Diplomatic Events", body: "Exclusive access to AfDEC bilateral summits, trade missions, and government-hosted investment forums in NC and across Africa." },
            { icon: "ShieldCheck", title: "Compliance Navigation", body: "Country-specific regulatory guidance prepared by AfDEC's trade counsel — covering import rules, local content requirements, and business registration." },
          ]
        }
      },
      {
        id: "stats",
        label: "Partnership Scale",
        type: "hero_stats",
        data: {
          stats: [
            { value: "15–20%", label: "Of GDP via Contracts", sub: "African government spending (World Bank)" },
            { value: "$11.1B", label: "AfDB 2024 Commitment", sub: "Development investments in Africa (AfDB)" },
            { value: "12+", label: "Partner Agencies", sub: "Government recognition for AfDEC members" },
            { value: "3", label: "MOU Agreements", sub: "Active bilateral frameworks secured" },
          ]
        }
      },
      {
        id: "cta",
        label: "Engage",
        type: "cta",
        data: {
          heading: "Open the Government Door for Your Business",
          body: "AfDEC accepts formal applications from registered organizations seeking government partnership facilitation. Join our diplomatic engagement program to get your institution in front of the right decision-makers.",
          primary_label: "Apply for Partnership Access",
          primary_href: "/contact",
          secondary_label: "View Government Events",
          secondary_href: "/events",
        }
      }
    ]
  },

  markets: {
    slug: "markets",
    label: "Market Access by Region",
    tag: "Regional Intelligence",
    accent: "amber",
    hero_title: "Market Access by Region",
    hero_subtitle: "Africa is not one market — it is 54 sovereign nations across 5 distinct economic regions, each with unique opportunities, regulatory environments, and sector strengths. Use AfDEC's regional intelligence to find exactly where your business fits.",
    hero_image: "https://images.unsplash.com/photo-1516026672322-bc52d61a9d41?q=80&w=2670&auto=format&fit=crop",
    hero_image_position: "center right",
    is_gated: false,
    sections: [
      {
        id: "overview",
        label: "Regional Overview",
        type: "text_columns",
        data: {
          heading: "Five Regions, Distinct Opportunities",
          body: "Africa's 54 nations are organized into 5 major economic regions by the African Union, each with its own trade bloc, currency dynamics, and sector specializations. AfDEC's regional intelligence gives you the context to choose your market confidently — not guess.",
          columns: [
            { icon: "Globe", title: "West Africa — $836B GDP", body: "Largest consumer market. Nigeria (fintech), Ghana (stability), Côte d'Ivoire (growth). Home to ECOWAS trade bloc." },
            { icon: "TrendingUp", title: "East Africa — $380B GDP", body: "Fastest-growing region. Kenya (Silicon Savannah), Ethiopia (manufacturing), Rwanda (governance model, World Bank ranked)." },
            { icon: "BarChart", title: "North Africa — $1.4T GDP", body: "Largest regional economy. Egypt (Suez Canal, logistics), Morocco (aerospace, EU access), Algeria (energy transition)." },
            { icon: "Zap", title: "Central & Southern — $563B GDP", body: "Resource-rich corridor. South Africa (financial hub, $443B), Angola (oil diversification), DRC (minerals)." },
          ]
        }
      },
      {
        id: "stats",
        label: "Continental Overview",
        type: "hero_stats",
        data: {
          stats: [
            { value: "54", label: "Sovereign Markets", sub: "Across 5 AU economic regions" },
            { value: "$3.32T", label: "Africa Total GDP", sub: "2026 IMF projection" },
            { value: "81M", label: "Visitors in 2025", sub: "Up 8% YoY (UN Tourism)" },
            { value: "1.4B", label: "Population", sub: "Youngest workforce globally" },
          ]
        }
      },
      {
        id: "pipeline",
        label: "Find Your Market",
        type: "pipeline_grid",
        data: {
          heading: "Top Entry Markets by Sector",
          body: "Use this guide as a starting point. AfDEC's trade advisors tailor market recommendations to your specific product, service, and business stage.",
          items: [
            { icon: "BarChart", title: "Fintech & Financial Services", sub: "Mobile money, payments, banking infrastructure", status: "Active", markets: "Nigeria, Kenya, Ghana, Morocco" },
            { icon: "Leaf", title: "Agriculture & Food Systems", sub: "Processing equipment, seeds, precision farming", status: "Active", markets: "Ethiopia, Côte d'Ivoire, Tanzania, Senegal" },
            { icon: "Zap", title: "Clean Energy", sub: "Solar, storage, grid infrastructure", status: "Active", markets: "Nigeria, South Africa, Morocco, Kenya" },
            { icon: "Heart", title: "Healthcare & Life Sciences", sub: "Medical devices, diagnostics, pharma", status: "Growing", markets: "South Africa, Egypt, Kenya, Nigeria" },
            { icon: "Home", title: "Real Estate & Construction", sub: "Affordable housing, commercial, logistics hubs", status: "Growing", markets: "Kenya, Nigeria, Morocco, Rwanda" },
            { icon: "Globe", title: "Tourism & Hospitality", sub: "NC expertise in hotel management, cultural assets", status: "Monitoring", markets: "Ghana, Senegal, South Africa, Rwanda" },
          ]
        }
      },
      {
        id: "cta",
        label: "Find Your Market",
        type: "cta",
        data: {
          heading: "Not Sure Which African Market Is Right for You?",
          body: "AfDEC's regional trade advisors provide free, 30-minute market-fit consultations — matching your business profile to the African market with the best opportunity for your first or next engagement.",
          primary_label: "Get a Free Market Assessment",
          primary_href: "/contact",
          secondary_label: "Explore the Africa Map",
          secondary_href: "/why-africa",
        }
      }
    ]
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PHASE B: Sector Intelligence — 6 Sector Pages
// Routes: /sectors/[slug]
// ─────────────────────────────────────────────────────────────────────────────
export const sectorPages: Record<string, PageDef> = {

  agriculture: {
    slug: "agriculture",
    label: "Agriculture & Farming",
    tag: "Food & Agribusiness",
    accent: "green",
    hero_title: "Agriculture & Food Systems",
    hero_subtitle: "Africa holds 60% of the world's uncultivated arable land and feeds 1.4 billion people — yet imports $35 billion in food annually. This gap is the biggest agribusiness opportunity of the next decade for NC farmers, processors, and technology companies.",
    hero_image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=2670&auto=format&fit=crop",
    hero_image_position: "center",
    is_gated: false,
    sections: [
      {
        id: "overview",
        label: "The Opportunity",
        type: "text_columns",
        data: {
          heading: "The World's Largest Untapped Farm Belt",
          body: "Africa's agricultural sector contributes 23% of the continent's total economic output (GDP) and employs 60% of its workforce — yet productivity remains far below its potential. For NC's world-class agricultural technology, seed science, and food processing industries, this is a generational market entry opportunity.",
          columns: [
            { icon: "Leaf", title: "Precision Farming Equipment", body: "NC manufacturers of irrigation systems, sensors, and precision equipment have active buyers in Ethiopia, Kenya, and Côte d'Ivoire." },
            { icon: "Sun", title: "Seed Technology & Inputs", body: "High-yield seed varieties, fertilizer systems, and crop protection products suited to sub-Saharan growing conditions." },
            { icon: "Home", title: "Food Processing & Cold Chain", body: "Post-harvest losses cost Africa $48 billion per year. NC food processing technology directly addresses Africa's largest agricultural problem." },
            { icon: "TrendingUp", title: "Agri-Fintech & Market Access", body: "Digital platforms connecting African smallholder farmers to global commodity markets and supply chain finance." },
          ]
        }
      },
      {
        id: "stats",
        label: "Sector Data",
        type: "hero_stats",
        data: {
          stats: [
            { value: "60%", label: "World Arable Land", sub: "Uncultivated in Africa (FAO)" },
            { value: "$35B", label: "Annual Food Imports", sub: "Africa imports annually (AfDB)" },
            { value: "23%", label: "Share of Africa GDP", sub: "Agriculture sector contribution" },
            { value: "$48B", label: "Post-Harvest Loss", sub: "Annual cost across Africa (FAO)" },
          ]
        }
      },
      {
        id: "cta",
        label: "Engage",
        type: "cta",
        data: {
          heading: "Connect Your Agribusiness to Africa",
          body: "AfDEC works with NC agricultural enterprises, cooperatives, and technology companies to identify verified African buyers and facilitate market entry into top agribusiness corridors.",
          primary_label: "Register as Agri-Sector Partner",
          primary_href: "/contact",
          secondary_label: "View Agriculture Events",
          secondary_href: "/events",
        }
      }
    ]
  },

  "clean-energy": {
    slug: "clean-energy",
    label: "Sustainable Energy",
    tag: "Clean Energy & Power",
    accent: "emerald",
    hero_title: "Sustainable Energy Transitions",
    hero_subtitle: "Africa adds the equivalent of France's entire population to its energy grid EVERY year — yet 600 million people remain without reliable power. This is the largest clean energy deployment opportunity on earth, and North Carolina is uniquely positioned to lead it.",
    hero_image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2670&auto=format&fit=crop",
    hero_image_position: "center",
    is_gated: false,
    sections: [
      {
        id: "overview",
        label: "The Opportunity",
        type: "text_columns",
        data: {
          heading: "A Continent Leapfrogging the Grid",
          body: "Africa is building its energy future from scratch — and it is building it clean. Renewable energy investment across the continent reached record levels in 2023-2024, with solar leading. NC is the #4 solar state in the US and home to world-class battery storage companies, giving NC enterprises a natural competitive advantage in this market.",
          columns: [
            { icon: "Sun", title: "Solar Energy Systems", body: "NC solar manufacturers and developers matched with African utility-scale procurement opportunities across 8 priority nations." },
            { icon: "Zap", title: "Battery Storage & Microgrids", body: "Off-grid and islanded microgrid solutions for communities, businesses, and anchor industries in rural corridors." },
            { icon: "Leaf", title: "Biomass & Agri-Energy", body: "Converting Africa's agricultural waste streams into clean energy — NC's biomass expertise maps directly onto African feedstock availability." },
            { icon: "BarChart", title: "Carbon Credit Programs", body: "Verification-backed carbon credit generation from reforestation and clean energy projects — a growing revenue stream for NC developers." },
          ]
        }
      },
      {
        id: "stats",
        label: "Energy Data",
        type: "hero_stats",
        data: {
          stats: [
            { value: "600M", label: "Without Reliable Power", sub: "Across Africa (IEA 2024)" },
            { value: "12GW", label: "Solar Target 2030", sub: "AfDEC corridor mandate" },
            { value: "#4", label: "NC Solar Ranking", sub: "US state solar capacity (SEIA 2024)" },
            { value: "$2.4B", label: "Clean Energy Pipeline", sub: "Active AfDEC project value" },
          ]
        }
      },
      {
        id: "cta",
        label: "Invest",
        type: "cta",
        data: {
          heading: "Access Africa's Clean Energy Project Pipeline",
          body: "NC clean energy developers and manufacturers can register to receive vetted project leads, government tender intelligence, and introductions to African energy ministries and development finance institutions.",
          primary_label: "Access the Energy Pipeline",
          primary_href: "/invest",
          secondary_label: "Partner With AfDEC",
          secondary_href: "/contact",
        }
      }
    ]
  },

  "life-sciences": {
    slug: "life-sciences",
    label: "Life Sciences & Health",
    tag: "Healthcare & Bioeconomy",
    accent: "blue",
    hero_title: "Life Sciences & Health Systems",
    hero_subtitle: "Africa's healthcare market is projected to reach $259 billion by 2030. North Carolina — home to Research Triangle Park, one of the world's largest life sciences clusters — is the natural partner for Africa's healthcare transformation.",
    hero_image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?q=80&w=2670&auto=format&fit=crop",
    hero_image_position: "center",
    is_gated: false,
    sections: [
      {
        id: "overview",
        label: "The Opportunity",
        type: "text_columns",
        data: {
          heading: "Research Triangle Meets African Healthcare Demand",
          body: "NC's life sciences sector supports 65,000+ direct jobs and over 800 companies — from global pharmaceutical manufacturers to cutting-edge diagnostics startups. Africa's demand for medical devices, diagnostics, hospitals, and pharmaceutical access provides precisely the export and investment market this sector needs.",
          columns: [
            { icon: "Heart", title: "Medical Devices & Diagnostics", body: "NC medical device manufacturers have active import demand from South Africa, Egypt, Kenya, and Nigeria's rapidly expanding healthcare networks." },
            { icon: "ShieldCheck", title: "Pharmaceutical Access", body: "NC pharma companies — NC's number one export sector — can engage Africa's $14B pharmaceutical import market through AGOA trade preferences." },
            { icon: "GraduationCap", title: "Medical Training & Education", body: "NC universities and training centers partnering with African medical institutions to close the healthcare worker shortage." },
            { icon: "TrendingUp", title: "Health Technology", body: "Telemedicine platforms, electronic health records, and digital diagnostics tailored for low-bandwidth African health systems." },
          ]
        }
      },
      {
        id: "stats",
        label: "Sector Data",
        type: "hero_stats",
        data: {
          stats: [
            { value: "$259B", label: "Africa Healthcare 2030", sub: "Market size projection" },
            { value: "$14B", label: "Annual Pharma Imports", sub: "Africa (WHO 2023)" },
            { value: "800+", label: "NC Life Sciences Firms", sub: "Available for Africa partnerships" },
            { value: "30%", label: "NC #1 Export", sub: "Pharmaceuticals (NC Commerce 2024)" },
          ]
        }
      },
      {
        id: "cta",
        label: "Partner",
        type: "cta",
        data: {
          heading: "Connect NC Life Sciences to Africa",
          body: "AfDEC facilitates introductions between NC life sciences companies and African health ministries, hospital networks, and pharmaceutical distributors. Register your company for the next Life Sciences Africa Trade Mission.",
          primary_label: "Register for the Life Sciences Mission",
          primary_href: "/contact",
          secondary_label: "View Life Sciences Events",
          secondary_href: "/events",
        }
      }
    ]
  },

  manufacturing: {
    slug: "manufacturing",
    label: "Advanced Manufacturing",
    tag: "Industry & Aerospace",
    accent: "amber",
    hero_title: "Advanced Manufacturing & Aerospace",
    hero_subtitle: "Africa's industrialization push requires exactly what North Carolina builds — aerospace components, precision machinery, automotive parts, and advanced manufacturing expertise. NC's manufacturers are sitting at the front door of a $600 billion opportunity.",
    hero_image: "https://images.unsplash.com/photo-1565793979770-a35bb432e0d4?q=80&w=2670&auto=format&fit=crop",
    hero_image_position: "center",
    is_gated: false,
    sections: [
      {
        id: "overview",
        label: "The Opportunity",
        type: "text_columns",
        data: {
          heading: "Building Africa's Industrial Future with NC Expertise",
          body: "Morocco has become Africa's aerospace manufacturing hub, home to over 140 aerospace companies. Ethiopia's industrial parks attract global apparel and manufacturing brands. South Africa runs the continent's most sophisticated automotive sector. NC's advanced manufacturers have natural entry points into each of these corridors.",
          columns: [
            { icon: "TrendingUp", title: "Aerospace Components", body: "Morocco's Casablanca aerospace hub is a top buyer of NC-manufactured aerospace components and maintenance, repair, and overhaul (MRO) services." },
            { icon: "Zap", title: "Industrial Machinery", body: "Manufacturing equipment, automation systems, and precision tools for Africa's growing industrial park networks in Ethiopia, Egypt, and Rwanda." },
            { icon: "Briefcase", title: "Automotive Supply Chain", body: "South Africa's automotive sector — producing 600,000+ vehicles per year — has active demand for NC-manufactured automotive components." },
            { icon: "Home", title: "Construction & Materials", body: "Pre-fabricated construction materials, modular systems, and building technology for Africa's massive urbanization wave." },
          ]
        }
      },
      {
        id: "stats",
        label: "Sector Data",
        type: "hero_stats",
        data: {
          stats: [
            { value: "140+", label: "Aerospace Firms in Morocco", sub: "Africa's aerospace hub (USFCA)" },
            { value: "600K+", label: "Vehicles/Year", sub: "South Africa automotive output" },
            { value: "$2.8B", label: "Engineering Pipeline", sub: "Active AfDEC EPC bids" },
            { value: "$170B", label: "Annual Infrastructure Gap", sub: "Africa demand (AfDB 2024)" },
          ]
        }
      },
      {
        id: "cta",
        label: "Bid",
        type: "cta",
        data: {
          heading: "Get Your Manufacturing Business into Africa",
          body: "AfDEC's manufacturing sector desk connects NC industrial companies to verified African buyers, government-sponsored industrial parks, and Engineering, Procurement, and Construction (EPC) project pipelines.",
          primary_label: "Register as Manufacturing Partner",
          primary_href: "/contact",
          secondary_label: "View Manufacturing Events",
          secondary_href: "/events",
        }
      }
    ]
  },

  fintech: {
    slug: "fintech",
    label: "Financial Markets & Fintech",
    tag: "Finance & Digital Payments",
    accent: "purple",
    hero_title: "Financial Markets & Financial Technology",
    hero_subtitle: "Africa's financial technology (fintech) sector is one of the fastest-growing in the world — with over 1,000 active fintech companies, $5.4 billion raised in 2023, and mobile money systems that have outpaced the developed world. NC's financial services ecosystem has a direct role to play.",
    hero_image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2670&auto=format&fit=crop",
    hero_image_position: "center",
    is_gated: false,
    sections: [
      {
        id: "overview",
        label: "The Opportunity",
        type: "text_columns",
        data: {
          heading: "Africa's Financial Revolution, Powered by NC",
          body: "Africa has more mobile money accounts than anywhere else on earth. M-Pesa in Kenya processed more transactions per year than Western Union globally. Yet 57% of Africans remain unbanked. This creates massive demand for payments infrastructure, banking platforms, regulatory technology (regtech), and investment products — all areas where NC's financial services sector excels.",
          columns: [
            { icon: "BarChart", title: "Payments Infrastructure", body: "NC fintech companies building payment rails, switch systems, and mobile wallet platforms for African financial institutions." },
            { icon: "ShieldCheck", title: "Regulatory Technology", body: "Compliance platforms, anti-money laundering (AML) systems, and Know Your Customer (KYC) software for African banks expanding across borders." },
            { icon: "TrendingUp", title: "Investment Platforms", body: "Retail and institutional investment platforms connecting African investors to US and African capital markets." },
            { icon: "Globe", title: "Trade Finance Technology", body: "Digital trade finance platforms streamlining Letters of Credit, supply chain finance, and invoice discounting for African traders." },
          ]
        }
      },
      {
        id: "stats",
        label: "Sector Data",
        type: "hero_stats",
        data: {
          stats: [
            { value: "1,000+", label: "African Fintechs", sub: "Active companies by 2024" },
            { value: "$5.4B", label: "Raised in 2023", sub: "Africa fintech funding (Disrupt Africa)" },
            { value: "57%", label: "Unbanked Adults", sub: "Across Africa (World Bank)" },
            { value: "#1", label: "Mobile Money", sub: "Africa leads global adoption (GSMA)" },
          ]
        }
      },
      {
        id: "cta",
        label: "Partner",
        type: "cta",
        data: {
          heading: "Bring Your Financial Technology to Africa",
          body: "AfDEC's financial services desk connects NC fintech, banking, and financial services companies to African financial institutions, central banks, and investment platforms seeking US technology partnerships.",
          primary_label: "Register as Fintech Partner",
          primary_href: "/contact",
          secondary_label: "View Finance Events",
          secondary_href: "/events",
        }
      }
    ]
  },

  defense: {
    slug: "defense",
    label: "Defense & Security Technology",
    tag: "Security & Autonomous Systems",
    accent: "red",
    hero_title: "Defense & Security Technology",
    hero_subtitle: "African governments are investing heavily in national security, border management, and maritime surveillance. North Carolina — home to Fort Liberty, one of the largest US military installations in the world — has a deep defense technology ecosystem uniquely suited to support these needs.",
    hero_image: "https://images.unsplash.com/photo-1542379653-b926a529191d?q=80&w=2670&auto=format&fit=crop",
    hero_image_position: "center",
    is_gated: false,
    sections: [
      {
        id: "overview",
        label: "The Opportunity",
        type: "text_columns",
        data: {
          heading: "NC Defense Expertise, African Security Demand",
          body: "African governments collectively spend over $50 billion annually on defense and security. Beyond traditional defense, the sector now includes border surveillance technology, cybersecurity, coast guard vessels, unmanned systems for agricultural and resource monitoring, and emergency response infrastructure — all areas where NC companies hold world-class credentials.",
          columns: [
            { icon: "ShieldCheck", title: "Border & Coastal Security", body: "Surveillance systems, sensor networks, and command-and-control platforms for African border management authorities." },
            { icon: "Globe", title: "Cybersecurity Solutions", body: "Government network security, critical infrastructure protection, and cyber defense training for African governmental agencies." },
            { icon: "TrendingUp", title: "Unmanned Systems", body: "Drone platforms for agricultural monitoring, border patrol, disaster response, and infrastructure inspection — high demand across East and West Africa." },
            { icon: "Network", title: "Training & Simulation", body: "Military and law enforcement training programs, simulation systems, and professional development services from NC defense contractors." },
          ]
        }
      },
      {
        id: "stats",
        label: "Sector Data",
        type: "hero_stats",
        data: {
          stats: [
            { value: "$50B+", label: "Africa Security Spending", sub: "Annual defense budgets (SIPRI 2024)" },
            { value: "700+", label: "Defense Firms in NC", sub: "Military technology companies" },
            { value: "Fort Liberty", label: "Largest US Installation", sub: "World's largest military base, NC" },
            { value: "54", label: "Sovereign Markets", sub: "Active defense procurement" },
          ]
        }
      },
      {
        id: "cta",
        label: "Engage",
        type: "cta",
        data: {
          heading: "Connect NC Defense to Africa",
          body: "AfDEC works with NC defense and security technology companies to navigate African government procurement channels, export licensing (ITAR/EAR), and defense ministry introductions.",
          primary_label: "Register for Defense Sector Access",
          primary_href: "/contact",
          secondary_label: "View Defense Events",
          secondary_href: "/events",
        }
      }
    ]
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PHASE B SPECIAL: Sovereign Tourism — Standalone Page
// Route: /tourism
// ─────────────────────────────────────────────────────────────────────────────
export const tourismPageData: PageDef = {
  slug: "tourism",
  label: "Sovereign Tourism",
  tag: "Heritage & Cultural Travel",
  accent: "amber",
  hero_title: "Sovereign Tourism",
  hero_subtitle: "Explore Africa. Experience your heritage. Build your business. AfDEC's Sovereign Tourism program is the only institutional travel ecosystem connecting the African diaspora in North Carolina to the continent — for heritage journeys, business travel, medical tourism, and diplomatic visits.",
  hero_image: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?q=80&w=2670&auto=format&fit=crop",
  hero_image_position: "center",
  is_gated: false,
  sections: [
    {
      id: "overview",
      label: "Why Travel",
      type: "tourism_pillars",
      data: {
        heading: "Four Reasons to Travel with AfDEC",
        body: "Africa welcomed 81 million international visitors in 2025 — an 8% increase (UN Tourism). International tourism receipts reached $42.6 billion. The diaspora is driving a new category of travel that is personal, purposeful, and economically transformative.",
        pillars: [
          {
            icon: "Heart", accent: "amber",
            title: "Heritage & Ancestry Travel",
            body: "For millions of African diaspora members, traveling to Africa is a deeply personal journey — reclaiming history, visiting ancestral villages, and connecting with living cultural traditions. AfDEC facilitates these journeys through vetted cultural partners and official heritage programs like Ghana's 'Beyond the Return' initiative and Senegal's Goree Island programs.",
            stats: [{ value: "74M+", label: "Africa arrivals 2024" }, { value: "8%", label: "Growth in 2025" }],
          },
          {
            icon: "Briefcase", accent: "blue",
            title: "Business Travel Support",
            body: "Every AfDEC trade mission, sector summit, and government partnership event is a business travel opportunity. AfDEC members receive travel coordination support, in-country hosting, business visa assistance, and secure accommodation referrals through our network of verified partners across priority African markets.",
            stats: [{ value: "12+", label: "Annual trade missions" }, { value: "54", label: "Markets covered" }],
          },
          {
            icon: "Heart", accent: "emerald",
            title: "Medical & Wellness Tourism",
            body: "Africa's medical tourism sector is growing rapidly — from world-class private hospitals in South Africa, Morocco, and Kenya to wellness retreats and regenerative medicine centers. AfDEC partners with certified medical tourism operators to provide NC residents with safe, vetted, and cost-effective medical travel options.",
            stats: [{ value: "$2.5B", label: "Africa medical tourism market" }, { value: "South Africa & Morocco", label: "Top destinations" }],
          },
          {
            icon: "Globe", accent: "purple",
            title: "North Carolina as an African Gateway",
            body: "NC's Raleigh-Durham International (RDU) and Charlotte Douglas International (CLT) airports serve as key landing points for African visitors to the US. AfDEC partners with NC's tourism board and convention centers to attract African delegations, diaspora reunions, and continental business events to NC — bringing economic impact back home.",
            stats: [{ value: "RDU & CLT", label: "Gateway airports" }, { value: "$1.3M", label: "NC visitors from Africa (est.)" }],
          },
        ]
      }
    },
    {
      id: "stats",
      label: "Tourism Data",
      type: "hero_stats",
      data: {
        stats: [
          { value: "81M", label: "Africa Visitors in 2025", sub: "Up 8% YoY (UN Tourism 2025)" },
          { value: "$42.6B", label: "Tourism Receipts", sub: "Africa 2024 (UN Tourism)" },
          { value: "11%", label: "North Africa Growth", sub: "Highest regional growth 2025" },
          { value: "#1", label: "Fastest-Growing Region", sub: "Africa globally in 2025 (UN Tourism)" },
        ]
      }
    },
    {
      id: "destinations",
      label: "Top Destinations",
      type: "pipeline_grid",
      data: {
        heading: "AfDEC-Endorsed Destinations",
        body: "These destinations offer the strongest combination of heritage significance, business infrastructure, and safety for NC diaspora travelers. All AfDEC-endorsed operators are vetted and carry institutional certification.",
        items: [
          { icon: "Globe", title: "Ghana — Year of Return", sub: "Heritage tourism anchor. Diaspora welcome programs, Cape Coast, Elmina.", status: "Active", markets: "Heritage · Business · Culture" },
          { icon: "TrendingUp", title: "Morocco — Gateway to Africa", sub: "Business travel, medical tourism, and world-class hospitality.", status: "Active", markets: "Business · Medical · Culture" },
          { icon: "Heart", title: "South Africa — Premium Destination", sub: "World-class healthcare, safari, Winelands, Cape Town. Top medical tourism.", status: "Active", markets: "Medical · Luxury · Business" },
          { icon: "Leaf", title: "Senegal — Cultural Heritage Hub", sub: "Goree Island, Dakar arts scene, diaspora festivals.", status: "Active", markets: "Heritage · Arts · Culture" },
          { icon: "Sun", title: "Kenya & East Africa", sub: "Business travel, safari, tech ecosystem visits (Silicon Savannah).", status: "Growing", markets: "Business · Adventure · Tech" },
          { icon: "BarChart", title: "Rwanda — Africa's Singapore", sub: "Cleanest city in Africa. MICE destination, gorilla trekking, innovation economy.", status: "Growing", markets: "Business · MICE · Nature" },
        ]
      }
    },
    {
      id: "cta",
      label: "Plan Your Journey",
      type: "cta",
      data: {
        heading: "Plan Your African Journey with AfDEC",
        body: "Whether you are planning a heritage visit, business mission, or medical travel — AfDEC connects you with vetted travel partners, in-country hosts, and the diaspora community waiting to welcome you home.",
        primary_label: "Plan Your Trip with AfDEC",
        primary_href: "/contact",
        secondary_label: "Explore North Carolina",
        secondary_href: "/why-nc",
      }
    }
  ]
};

export function getIntegrationPage(slug: string): PageDef | null {
  return integrationPages[slug] ?? null;
}

export function getSectorPage(slug: string): PageDef | null {
  return sectorPages[slug] ?? null;
}

export const integrationList = Object.values(integrationPages);
export const sectorList = Object.values(sectorPages);
