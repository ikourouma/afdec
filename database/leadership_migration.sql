-- ─────────────────────────────────────────────────────────────────────────────
-- AfDEC Platform — Supabase Migration: Corporate Identity & Leadership
-- Version: 1.0.0 | Created: 2026-04-09
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. BOARD MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.board_members (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  title         TEXT NOT NULL,          -- e.g. 'Board Chair', 'Executive Director'
  bio           TEXT NOT NULL,          -- Detailed biography
  image_url     TEXT,                   -- Headshot URL
  committees    TEXT[] DEFAULT '{}',    -- e.g. {'Audit', 'Oversight'}
  linkedin_url  TEXT,
  is_featured   BOOLEAN DEFAULT FALSE,  -- Featured members at the top
  sort_order    INTEGER DEFAULT 0,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ENABLE RLS
ALTER TABLE public.board_members ENABLE ROW LEVEL SECURITY;

-- 3. POLICIES
CREATE POLICY "Board members are viewable by everyone"
  ON public.board_members FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Admins manage board members"
  ON public.board_members FOR ALL
  USING (auth.jwt() ->> 'role' IN ('admin', 'super_admin'))
  WITH CHECK (auth.jwt() ->> 'role' IN ('admin', 'super_admin'));

-- 4. SEED DATA (Demo Council)
INSERT INTO public.board_members (name, title, bio, committees, is_featured, sort_order)
VALUES 
  (
    'Dr. Amara Diop', 
    'Chairman of the Board', 
    'A former diplomat and institutional capital specialist with over 25 years of experience in transatlantic trade policy. Dr. Diop oversees AfDEC''s strategic alignment with the African Union and the US Department of Commerce.',
    '{Executive, Audit, Strategic Planning}',
    TRUE,
    1
  ),
  (
    'Marcus Thorne', 
    'Executive Director', 
    'An infrastructure venture specialist focusing on early-stage mega-site development. Marcus leads the AfDEC Deal Team and manages the Diaspora Impact Fund''s institutional relations across North Carolina.',
    '{Executive, Fund Oversight}',
    TRUE,
    2
  ),
  (
    'Elena Vance', 
    'Director of Trade Policy', 
    'Specializing in AfCFTA compliance and inter-continental logistics, Elena ensures that AfDEC corridors remain frictionless for SME expansion.',
    '{Governance, Procurement}',
    FALSE,
    3
  )
ON CONFLICT DO NOTHING;
