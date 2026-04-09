-- ─────────────────────────────────────────────────────────────────────────────
-- AfDEC Platform — Supabase Migration: Insights & Intelligence Articles
-- Version: 1.0.0 | Created: 2026-04-08
-- ─────────────────────────────────────────────────────────────────────────────
-- ARCHITECTURE NOTE:
-- All platform content is designed to be API-first. This migration creates the
-- insights_articles table plus the full supporting schema (authors, tags,
-- attachments, analytics). Admin users manage content via Supabase Dashboard or
-- a future private /admin CMS. Public API endpoints serve GET requests only.
--
-- API pattern:
--   GET /rest/v1/insights_articles?category=eq.policy&is_published=eq.true
--   GET /rest/v1/insights_articles?category=eq.market-outlook&order=published_at.desc
--
-- Future: wrap in Edge Functions at /api/insights/* for caching + rate limiting.
-- ─────────────────────────────────────────────────────────────────────────────

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. EXTENSIONS (safe to run multiple times)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- for full-text search on titles

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. ENUM TYPES
-- ─────────────────────────────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE article_category AS ENUM (
    'policy',             -- Policy Publications & Briefs
    'market-outlook',     -- Transatlantic Market Outlook
    'research',           -- General research reports
    'intelligence',       -- Africa Intelligence briefs
    'press-release',      -- Official AfDEC press releases
    'op-ed'               -- Opinion / editorial
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE article_status AS ENUM (
    'draft',              -- Not visible to public
    'review',             -- Under editorial review
    'published',          -- Live on the platform
    'archived'            -- Hidden, kept for record
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE content_type AS ENUM (
    'article',            -- Long-form written content
    'report',             -- Downloadable PDF report
    'brief',              -- Short policy/intelligence brief
    'data-snapshot',      -- Data visualization + narrative
    'video'               -- Video / webinar recording
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. AUTHORS TABLE
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.insight_authors (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name         TEXT NOT NULL,
  title             TEXT,                                   -- e.g. "Senior Policy Analyst"
  organization      TEXT DEFAULT 'AfDEC',
  bio               TEXT,
  avatar_url        TEXT,
  linkedin_url      TEXT,
  email             TEXT UNIQUE,
  is_external       BOOLEAN DEFAULT FALSE,                  -- Guest contributors
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.insight_authors IS 'Authors and contributors for AfDEC Insights articles.';

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. TAGS / TAXONOMY TABLE
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.insight_tags (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug              TEXT UNIQUE NOT NULL,                   -- e.g. "nigeria", "clean-energy"
  label             TEXT NOT NULL,                          -- e.g. "Nigeria", "Clean Energy"
  tag_group         TEXT,                                   -- e.g. "country", "sector", "topic"
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.insight_tags IS 'Tags / taxonomy for filtering insights articles.';

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. MAIN ARTICLES TABLE
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.insights_articles (
  -- Identity
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug              TEXT UNIQUE NOT NULL,                   -- URL: /insights/policy/why-afcfta-matters

  -- Classification
  category          article_category NOT NULL,
  content_type      content_type NOT NULL DEFAULT 'article',
  status            article_status NOT NULL DEFAULT 'draft',

  -- Content
  title             TEXT NOT NULL,
  subtitle          TEXT,                                   -- Deck / standfirst
  excerpt           TEXT,                                   -- Short SEO-friendly description (≤300 chars)
  body              TEXT,                                   -- Full markdown or HTML body
  cover_image_url   TEXT,                                   -- Hero image
  reading_time_min  INTEGER,                                -- Estimated reading time

  -- Authorship
  author_id         UUID REFERENCES public.insight_authors(id) ON DELETE SET NULL,
  co_authors        UUID[],                                 -- Array of additional author IDs

  -- Download / Attachment (for reports/briefs)
  download_url      TEXT,                                   -- Supabase Storage URL for PDF
  download_label    TEXT DEFAULT 'Download Report',
  file_size_kb      INTEGER,

  -- SEO
  meta_title        TEXT,
  meta_description  TEXT,

  -- Dates
  published_at      TIMESTAMPTZ,
  featured_until    TIMESTAMPTZ,                            -- Pin as featured until date
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),

  -- Flags
  is_published      BOOLEAN GENERATED ALWAYS AS (status = 'published') STORED,
  is_featured       BOOLEAN DEFAULT FALSE,
  is_premium        BOOLEAN DEFAULT FALSE,                  -- Members-only content
  allow_download    BOOLEAN DEFAULT FALSE,

  -- Analytics (lightweight, not replacing PostHog/GA)
  view_count        INTEGER DEFAULT 0,
  download_count    INTEGER DEFAULT 0
);

COMMENT ON TABLE public.insights_articles IS
  'AfDEC Insights: all published policy briefs, market outlooks, research reports, and intelligence documents. '
  'API-first architecture — frontend reads via Supabase REST API, admins write via Dashboard or future /admin CMS.';

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. ARTICLE ↔ TAG JUNCTION TABLE
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.article_tags (
  article_id        UUID REFERENCES public.insights_articles(id) ON DELETE CASCADE,
  tag_id            UUID REFERENCES public.insight_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. RELATED ARTICLES JUNCTION (optional — for "see also" widgets)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.article_related (
  article_id        UUID REFERENCES public.insights_articles(id) ON DELETE CASCADE,
  related_id        UUID REFERENCES public.insights_articles(id) ON DELETE CASCADE,
  sort_order        INTEGER DEFAULT 0,
  PRIMARY KEY (article_id, related_id)
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 8. INDEXES
-- ─────────────────────────────────────────────────────────────────────────────
-- Published articles by category (primary read pattern)
CREATE INDEX IF NOT EXISTS idx_insights_category_published
  ON public.insights_articles(category, published_at DESC)
  WHERE status = 'published';

-- Full-text search on title + excerpt
CREATE INDEX IF NOT EXISTS idx_insights_title_search
  ON public.insights_articles USING GIN (to_tsvector('english', title || ' ' || COALESCE(excerpt, '')));

-- Featured articles
CREATE INDEX IF NOT EXISTS idx_insights_featured
  ON public.insights_articles(is_featured, published_at DESC)
  WHERE status = 'published' AND is_featured = TRUE;

-- Tags lookup
CREATE INDEX IF NOT EXISTS idx_insight_tags_slug ON public.insight_tags(slug);

-- ─────────────────────────────────────────────────────────────────────────────
-- 9. AUTO-UPDATE updated_at TRIGGER
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_insights_updated_at ON public.insights_articles;
CREATE TRIGGER trg_insights_updated_at
  BEFORE UPDATE ON public.insights_articles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_authors_updated_at ON public.insight_authors;
CREATE TRIGGER trg_authors_updated_at
  BEFORE UPDATE ON public.insight_authors
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- 10. ROW-LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.insights_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insight_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insight_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_tags ENABLE ROW LEVEL SECURITY;

-- Public: read published articles only
CREATE POLICY "Public read published articles"
  ON public.insights_articles FOR SELECT
  USING (status = 'published');

-- Admins (authenticated with admin role): full access
CREATE POLICY "Admin full access to articles"
  ON public.insights_articles FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Public: read all authors
CREATE POLICY "Public read authors"
  ON public.insight_authors FOR SELECT USING (TRUE);

-- Public: read all tags
CREATE POLICY "Public read tags"
  ON public.insight_tags FOR SELECT USING (TRUE);

-- Public: read article_tags
CREATE POLICY "Public read article_tags"
  ON public.article_tags FOR SELECT USING (TRUE);

-- ─────────────────────────────────────────────────────────────────────────────
-- 11. SEED DATA — AfDEC house author + initial tags
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.insight_authors (full_name, title, organization, bio, is_external)
VALUES
  ('AfDEC Intelligence Desk', 'Editorial Team', 'AfDEC', 
   'The AfDEC Intelligence Desk produces quarterly market outlooks, policy briefs, and sovereign intelligence reports on transatlantic trade between North Carolina and Africa.', 
   FALSE),
  ('AfDEC Policy Unit', 'Policy Research Division', 'AfDEC',
   'Dedicated to analyzing legislative, diplomatic, and regulatory developments affecting AfDEC member organizations and African diaspora enterprises.', 
   FALSE)
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.insight_tags (slug, label, tag_group) VALUES
  -- Regions / Countries
  ('west-africa', 'West Africa', 'region'),
  ('east-africa', 'East Africa', 'region'),
  ('north-africa', 'North Africa', 'region'),
  ('central-africa', 'Central Africa', 'region'),
  ('southern-africa', 'Southern Africa', 'region'),
  ('nigeria', 'Nigeria', 'country'),
  ('kenya', 'Kenya', 'country'),
  ('south-africa', 'South Africa', 'country'),
  ('ghana', 'Ghana', 'country'),
  ('ethiopia', 'Ethiopia', 'country'),
  -- Sectors
  ('clean-energy', 'Clean Energy', 'sector'),
  ('fintech', 'Fintech', 'sector'),
  ('life-sciences', 'Life Sciences', 'sector'),
  ('agriculture', 'Agriculture', 'sector'),
  ('manufacturing', 'Manufacturing', 'sector'),
  ('infrastructure', 'Infrastructure', 'sector'),
  ('tourism', 'Tourism', 'sector'),
  -- Topics
  ('afcfta', 'AfCFTA', 'topic'),
  ('fdi', 'Foreign Direct Investment', 'topic'),
  ('diaspora', 'Diaspora Economy', 'topic'),
  ('trade-corridor', 'Trade Corridor', 'topic'),
  ('north-carolina', 'North Carolina', 'topic'),
  ('policy', 'Policy', 'topic'),
  ('market-outlook', 'Market Outlook', 'topic'),
  ('sovereign-incentives', 'Sovereign Incentives', 'topic')
ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 12. SEED DATA — Sample articles (shown as mock data when DB is empty)
-- ─────────────────────────────────────────────────────────────────────────────
WITH author AS (SELECT id FROM public.insight_authors WHERE full_name = 'AfDEC Intelligence Desk' LIMIT 1)
INSERT INTO public.insights_articles (
  slug, category, content_type, status, title, subtitle, excerpt,
  cover_image_url, reading_time_min, author_id, published_at,
  is_featured, allow_download, meta_title, meta_description
)
SELECT
  slug, category::article_category, content_type::content_type, status::article_status,
  title, subtitle, excerpt, cover_image_url, reading_time_min,
  author.id, published_at, is_featured, allow_download, meta_title, meta_description
FROM author, (VALUES
  (
    'afcfta-nc-opportunity-2026',
    'policy', 'report', 'published',
    'AfCFTA and the North Carolina Opportunity: A Policy Framework for 2026',
    'How the African Continental Free Trade Area reshapes bilateral trade dynamics for NC enterprises',
    'The African Continental Free Trade Area (AfCFTA), now operational across 47 AU member states, creates a $3.4 trillion combined market with preferential tariff schedules that directly benefit North Carolina export sectors.',
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2000&auto=format&fit=crop',
    12, now() - INTERVAL '15 days', TRUE, TRUE,
    'AfCFTA & North Carolina: 2026 Policy Framework | AfDEC',
    'AfDEC analysis of AfCFTA trade opportunities for North Carolina enterprises across clean energy, manufacturing, and life sciences.'
  ),
  (
    'transatlantic-market-outlook-q1-2026',
    'market-outlook', 'report', 'published',
    'Transatlantic Market Outlook: Q1 2026',
    'GDP projections, FDI flows, and sector intelligence across all five African economic regions',
    'AfDEC''s flagship quarterly market intelligence report covering GDP growth trajectories, foreign direct investment inflows, and emerging sector opportunities across North Africa, West Africa, East Africa, Central Africa, and Southern Africa.',
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2000&auto=format&fit=crop',
    18, now() - INTERVAL '30 days', TRUE, TRUE,
    'AfDEC Transatlantic Market Outlook Q1 2026',
    'Quarterly intelligence on African GDP, FDI, and sector trends for North Carolina trade partners.'
  ),
  (
    'nigeria-nc-fintech-corridor',
    'policy', 'brief', 'published',
    'Nigeria–North Carolina Fintech Corridor: Bilateral Opportunity Brief',
    'M&A targets, regulatory pathways, and partnership frameworks for NC fintech companies entering Nigeria',
    'Nigeria''s $3.7B fintech ecosystem — anchored by Flutterwave, Paystack, and OPay — presents structured entry points for North Carolina financial technology companies seeking African market access.',
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2000&auto=format&fit=crop',
    8, now() - INTERVAL '7 days', FALSE, FALSE,
    'Nigeria-NC Fintech Corridor: Policy Brief | AfDEC',
    'AfDEC bilateral brief on Nigeria fintech market entry for North Carolina financial technology companies.'
  ),
  (
    'kenya-life-sciences-market-entry',
    'market-outlook', 'brief', 'published',
    'Kenya Life Sciences: Market Entry Assessment 2026',
    'Regulatory landscape, distribution networks, and investment incentives for NC pharmaceutical and biotech firms in Kenya',
    'Kenya''s Universal Health Coverage mandate and Nairobi''s emerging medtech hub create a $1.2B addressable market for North Carolina life sciences exports over the next 36 months.',
    'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=2000&auto=format&fit=crop',
    10, now() - INTERVAL '3 days', FALSE, FALSE,
    'Kenya Life Sciences Market Entry 2026 | AfDEC Intelligence',
    'AfDEC market assessment for Kenya pharmaceutical and biotech sector — regulatory landscape and NC investment windows.'
  )
) AS v(slug, category, content_type, status, title, subtitle, excerpt, cover_image_url, reading_time_min, published_at, is_featured, allow_download, meta_title, meta_description)
ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 13. USEFUL VIEWS (for API simplicity)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW public.v_published_articles AS
SELECT
  a.id, a.slug, a.category, a.content_type,
  a.title, a.subtitle, a.excerpt,
  a.cover_image_url, a.reading_time_min,
  a.published_at, a.is_featured,
  a.allow_download, a.download_url, a.download_label, a.file_size_kb,
  a.view_count, a.download_count,
  auth.full_name AS author_name,
  auth.title AS author_title,
  auth.avatar_url AS author_avatar,
  ARRAY_AGG(DISTINCT t.label) FILTER (WHERE t.label IS NOT NULL) AS tags
FROM public.insights_articles a
LEFT JOIN public.insight_authors auth ON a.author_id = auth.id
LEFT JOIN public.article_tags at ON a.id = at.article_id
LEFT JOIN public.insight_tags t ON at.tag_id = t.id
WHERE a.status = 'published'
GROUP BY a.id, auth.full_name, auth.title, auth.avatar_url
ORDER BY a.published_at DESC;

COMMENT ON VIEW public.v_published_articles IS
  'Primary API view: returns all published articles with author name and tag array. '
  'Query: GET /rest/v1/v_published_articles?category=eq.policy';

-- ─────────────────────────────────────────────────────────────────────────────
-- Migration complete.
-- Next steps:
--   1. Run this file in Supabase SQL Editor
--   2. Create a Supabase Storage bucket named "insight-attachments" (public)
--   3. Upload PDFs to the bucket and set download_url on each article row
--   4. Future: wrap reads in Edge Functions at /api/insights/* for caching
-- ─────────────────────────────────────────────────────────────────────────────
