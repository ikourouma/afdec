import type { Metadata } from "next";

/**
 * Per-page SEO. Static defaults live in code; staff can override title / description / social image
 * from Admin → Pages & SEO (table `page_content`, keyed by URL path such as "/about").
 * Cached for 5 minutes so it never slows a request down; any failure falls back to the defaults.
 */
export async function pageMeta(
  path: string,
  fallback: { title: string; description: string; image?: string }
): Promise<Metadata> {
  let title = fallback.title;
  let description = fallback.description;
  let image = fallback.image;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key) {
    try {
      const res = await fetch(
        `${url}/rest/v1/page_content?select=page_title,meta_description,hero_image_url&page_slug=eq.${encodeURIComponent(path)}&is_published=eq.true&limit=1`,
        { headers: { apikey: key, Authorization: `Bearer ${key}` }, next: { revalidate: 300 } }
      );
      if (res.ok) {
        const [row] = (await res.json()) as { page_title?: string; meta_description?: string; hero_image_url?: string }[];
        if (row?.page_title) title = row.page_title;
        if (row?.meta_description) description = row.meta_description;
        if (row?.hero_image_url) image = row.hero_image_url;
      }
    } catch {
      /* use defaults */
    }
  }

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, ...(image ? { images: [{ url: image }] } : {}) },
    twitter: { card: "summary_large_image", title, description, ...(image ? { images: [image] } : {}) },
  };
}
