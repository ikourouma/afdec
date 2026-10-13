import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://afdecnc.org";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/dashboard/", "/deal-room", "/auth", "/access-request", "/insights/data-terminal"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
