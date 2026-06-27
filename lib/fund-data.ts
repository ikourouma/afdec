import { Heart, Globe, Leaf, Zap, TrendingUp, BookOpen } from "lucide-react";
import React from "react";

export type FundProject = {
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

export const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "Agriculture": Leaf,
  "Health": Heart,
  "Education & Energy": Zap,
  "Trade & SME": TrendingUp,
  "ICT & Youth": BookOpen,
};

export const SEED_PROJECTS: FundProject[] = [
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
