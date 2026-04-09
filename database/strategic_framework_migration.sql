-- ─────────────────────────────────────────────────────────────────────────────
-- AfDEC Platform — Strategic Framework & Milestones Migration
-- Version: 1.0.0 | Created: 2026-04-09
-- Purpose: Manages "Success Pillars", "Bilateral Accomplishments", and
--          Strategic Framework meetings for institutional transparency.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. ENUM TYPES
DO $$ BEGIN
  CREATE TYPE milestone_category AS ENUM (
    'bilateral_meeting',    -- High-level diplomatic/government meeting
    'trade_agreement',      -- Formal MOUs or trade deals
    'project_launch',       -- Official launch of an AfDEC initiative
    'policy_brief',         -- Publication of major strategic research
    'membership_milestone'  -- Significant partner onboarding
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. STRATEGIC MILESTONES TABLE
CREATE TABLE IF NOT EXISTS public.strategic_milestones (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category          milestone_category NOT NULL,
  title             TEXT NOT NULL,
  description       TEXT,
  accomplishment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Metadata for routing and labeling
  location          TEXT,                       -- e.g. 'Raleigh, NC', 'Accra, Ghana'
  partners          TEXT[],                     -- Array of partner org names
  strategic_pillar  TEXT,                       -- Links to 'Bilateral Six' pillars
  
  -- Media
  image_url         TEXT,
  document_url      TEXT,                       -- Link to full MOU or Brief PDF
  
  -- Admin
  status            news_status DEFAULT 'published',
  is_featured       BOOLEAN DEFAULT FALSE,
  sort_order        INTEGER DEFAULT 0,
  
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.strategic_milestones IS 
  'Institutional achievements and bilateral framework meetings for AfDEC transparency.';

-- 3. INDEXES
CREATE INDEX IF NOT EXISTS idx_milestones_category ON public.strategic_milestones(category);
CREATE INDEX IF NOT EXISTS idx_milestones_status ON public.strategic_milestones(status);
CREATE INDEX IF NOT EXISTS idx_milestones_date ON public.strategic_milestones(accomplishment_date DESC);

-- 4. AUTO-UPDATE updated_at
DROP TRIGGER IF EXISTS trg_strategic_milestones_updated_at ON public.strategic_milestones;
CREATE TRIGGER trg_strategic_milestones_updated_at
  BEFORE UPDATE ON public.strategic_milestones
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 5. ROW-LEVEL SECURITY
ALTER TABLE public.strategic_milestones ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can view published milestones"
  ON public.strategic_milestones FOR SELECT
  USING (status = 'published');

-- Admin full access
CREATE POLICY "Admins can manage milestones"
  ON public.strategic_milestones FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

-- 6. SEED DATA (Placeholder Success Pillars)
INSERT INTO public.strategic_milestones (
  category, title, description, accomplishment_date, location, partners, strategic_pillar, is_featured
) VALUES
  (
    'trade_agreement',
    'North Carolina–West Africa Agri-MOU',
    'Formalized a bilateral framework for precision agriculture technology transfer between the NC Department of Agriculture and the ECOWAS Trade Commission.',
    '2026-02-15', 'Raleigh, NC', '{ECOWAS, NC Dept of Agriculture}', 'Agriculture & Resilience', TRUE
  ),
  (
    'bilateral_meeting',
    'AfCFTA High-Level Implementation Summit',
    'Executive meeting with AfCFTA Secretariat to align AfDEC Hub desk protocols with international trade corridors.',
    '2026-03-10', 'Accra, Ghana', '{AfCFTA Secretariat}', 'Market Integration', TRUE
  ),
  (
    'project_launch',
    'Diaspora Impact Fund — Phase 1 Enrollment',
    'Institutional rollout of the Diaspora Impact Fund for North Carolina-based accredited investors.',
    '2026-04-01', 'Charlotte, NC', '{Institutional Partners}', 'Capital Mobilization', TRUE
  ),
  (
    'trade_agreement',
    'Bilateral Critical Minerals Strategic Protocol',
    'Establishing a sovereign framework for critical mineral processing corridors between NC technology manufacturers and African mining hubs.',
    '2026-05-20', 'Raleigh, NC', '{NC Semiconductor Consortium}', 'Critical Minerals & Processing', TRUE
  )
ON CONFLICT DO NOTHING;
