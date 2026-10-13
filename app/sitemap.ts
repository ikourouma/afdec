import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://afdecnc.org";

// Public, indexable routes. Member-only and utility pages are intentionally excluded.
const ROUTES = [
  "", "/about", "/about/leadership", "/about/strategic-framework", "/africa-intelligence", "/annual-report", "/careers",
  "/compliance", "/compliance/accessibility", "/compliance/cookie-policy", "/compliance/privacy-policy", "/compliance/terms-of-service",
  "/contact", "/corridor", "/corridor/expansion", "/corridor/export-trade", "/corridor/markets",
  "/diaspora-impact-fund", "/diaspora-impact-fund/projects", "/diaspora-registry", "/dual-continent-business-hub",
  "/events", "/faqs", "/government-relations", "/initiatives/africa-center", "/insights", "/insights/market-outlook", "/insights/policy",
  "/invest", "/media", "/news", "/sectors", "/sitemap", "/sovereign-incentives-grants", "/tourism", "/why-africa", "/why-nc",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((path) => ({ url: `${SITE_URL}${path}`, lastModified: now, changeFrequency: "weekly", priority: path === "" ? 1 : 0.7 }));
}
