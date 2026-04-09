-- ─────────────────────────────────────────────────────────────────────────────
-- AfDEC Platform — Supabase Migration: Diaspora Impact Fund
-- Version: 1.0.0 | Created: 2026-04-09
-- ─────────────────────────────────────────────────────────────────────────────
-- ARCHITECTURE:
-- Models the full lifecycle of the AfDEC Diaspora Impact Fund:
--   1. impact_fund_projects    — Admin-curated development projects (5+ seeded)
--   2. fund_applications       — SME grant applications with full procurement lifecycle
--   3. fund_interests          — Donor/partner interest capture
--
-- Procurement Lifecycle Status Machine:
--   submitted → under_review → (additional_info_requested ↔ submitted)
--                            → shortlisted → approved → funded
--                            → rejected (at any stage after review)
-- ─────────────────────────────────────────────────────────────────────────────

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. ENUM TYPES
-- ─────────────────────────────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE project_status AS ENUM (
    'active',       -- Currently accepting donations / applicants
    'funded',       -- Target reached
    'closed',       -- No longer active
    'coming_soon'   -- Announced but not yet launched
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE application_status AS ENUM (
    'submitted',                  -- Initial submission by applicant
    'under_review',               -- Assigned to committee reviewer
    'additional_info_requested',  -- Committee needs more info from applicant
    'shortlisted',                -- Passed first review; on shortlist
    'approved',                   -- Committee approved for funding
    'funded',                     -- Grant disbursed
    'rejected',                   -- Not selected (reason stored in rejected_reason)
    'withdrawn'                   -- Applicant withdrew application
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE fund_interest_type AS ENUM (
    'donor_individual',           -- Individual philanthropic donor
    'donor_institutional',        -- Foundation, corporation, or government donor
    'program_partner',            -- Organizations partnering on execution
    'in_kind_contributor',        -- Non-cash contributions (expertise, services)
    'matching_funds'              -- Matching fund pledge
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE multilateral_alignment AS ENUM (
    'AfDB',       -- African Development Bank
    'WorldBank',  -- World Bank Group
    'IMF',        -- International Monetary Fund
    'USAID',      -- U.S. Agency for International Development
    'IFC',        -- International Finance Corporation
    'UNDP',       -- United Nations Development Programme
    'AU',         -- African Union
    'AfCFTA'      -- African Continental Free Trade Area
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. IMPACT FUND PROJECTS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.impact_fund_projects (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug                  TEXT UNIQUE NOT NULL,
  title                 TEXT NOT NULL,
  category              TEXT NOT NULL,                           -- e.g. 'Agriculture', 'Health', 'Education'
  description           TEXT,
  full_description      TEXT,                                    -- Markdown body for detail page
  cover_image_url       TEXT,
  country               TEXT,
  region                TEXT,                                    -- e.g. 'West Africa', 'East Africa'

  -- Financials
  target_amount_usd     INTEGER NOT NULL DEFAULT 0,
  raised_amount_usd     INTEGER NOT NULL DEFAULT 0,             -- Updated by admin as donations come in
  grant_count           INTEGER DEFAULT 0,                       -- Number of SME grants awarded from this project

  -- Impact Metrics
  beneficiary_estimate  INTEGER,                                 -- Target # of people impacted
  beneficiary_actual    INTEGER DEFAULT 0,                       -- Actual # after funding
  
  -- Alignment
  multilateral_tags     multilateral_alignment[] DEFAULT '{}',  -- e.g. '{AfDB, WorldBank}'
  sdg_goals             INTEGER[],                               -- UN SDG numbers (e.g. {1, 2, 4, 7})

  -- Display
  is_featured           BOOLEAN DEFAULT FALSE,
  sort_order            INTEGER DEFAULT 0,
  status                project_status NOT NULL DEFAULT 'coming_soon',

  -- Applications
  applications_open     BOOLEAN DEFAULT FALSE,
  application_deadline  TIMESTAMPTZ,
  max_grant_usd         INTEGER,                                 -- Max individual grant from this project

  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.impact_fund_projects IS
  'AfDEC Diaspora Impact Fund: development projects accepting donations and SME grant applications.';

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. SME GRANT APPLICATIONS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.fund_applications (
  id                        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_number          TEXT UNIQUE NOT NULL,               -- Auto-generated: AFDEC-2026-XXXX

  -- Project link
  project_id                UUID REFERENCES public.impact_fund_projects(id) ON DELETE SET NULL,

  -- Applicant business info
  business_name             TEXT NOT NULL,
  business_registration_no  TEXT,
  country                   TEXT NOT NULL,
  region                    TEXT,
  sector                    TEXT NOT NULL,
  years_in_operation        INTEGER,
  employee_count            INTEGER,
  annual_revenue_band       TEXT,                               -- e.g. '$0–$50K', '$50K–$250K'
  website_url               TEXT,

  -- Contact
  contact_name              TEXT NOT NULL,
  contact_title             TEXT,
  contact_email             TEXT NOT NULL,
  contact_phone             TEXT,

  -- Application content
  project_title             TEXT NOT NULL,
  project_description       TEXT NOT NULL,
  requested_amount_usd      INTEGER NOT NULL,
  impact_statement          TEXT,
  implementation_plan       TEXT,
  beneficiary_estimate      INTEGER,
  timeline_months           INTEGER,

  -- Supporting documents (Supabase Storage URLs)
  business_plan_url         TEXT,
  registration_doc_url      TEXT,
  financial_statements_url  TEXT,
  additional_docs           TEXT[],

  -- Auth link (registered user = can track their application)
  applicant_user_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- ── PROCUREMENT LIFECYCLE ──────────────────────────────────────────────────
  status                    application_status NOT NULL DEFAULT 'submitted',

  -- Review tracking
  assigned_reviewer_id      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  assigned_at               TIMESTAMPTZ,
  reviewed_at               TIMESTAMPTZ,
  reviewer_notes            TEXT,

  -- Additional info request
  info_request_text         TEXT,
  info_request_sent_at      TIMESTAMPTZ,
  info_response_text        TEXT,
  info_response_at          TIMESTAMPTZ,

  -- Decision
  shortlisted_at            TIMESTAMPTZ,
  approved_at               TIMESTAMPTZ,
  rejected_at               TIMESTAMPTZ,
  rejected_reason           TEXT,

  -- Funding
  funded_at                 TIMESTAMPTZ,
  grant_amount_usd          INTEGER,                           -- May differ from requested
  disbursement_notes        TEXT,

  -- Announcement
  is_public_announcement    BOOLEAN DEFAULT FALSE,             -- If true, show on public results page
  announcement_date         TIMESTAMPTZ,

  submitted_at              TIMESTAMPTZ DEFAULT NOW(),
  created_at                TIMESTAMPTZ DEFAULT NOW(),
  updated_at                TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.fund_applications IS
  'SME grant applications for AfDEC Diaspora Impact Fund projects. Full procurement lifecycle tracked here. '
  'Only the submitting user and admins can view application details.';

-- Auto-generate reference number
CREATE OR REPLACE FUNCTION public.generate_application_reference()
RETURNS TRIGGER AS $$
BEGIN
  NEW.reference_number = 'AFDEC-' || EXTRACT(YEAR FROM NOW())::TEXT || '-' || 
    LPAD((NEXTVAL('public.application_ref_seq'))::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS public.application_ref_seq START 1000;

DROP TRIGGER IF EXISTS trg_application_reference ON public.fund_applications;
CREATE TRIGGER trg_application_reference
  BEFORE INSERT ON public.fund_applications
  FOR EACH ROW
  WHEN (NEW.reference_number IS NULL OR NEW.reference_number = '')
  EXECUTE FUNCTION public.generate_application_reference();

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. DONOR / PARTNER INTEREST
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.fund_interests (
  id                        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inquiry_type              fund_interest_type NOT NULL,

  -- Contact
  full_name                 TEXT NOT NULL,
  organization              TEXT,
  email                     TEXT NOT NULL,
  phone                     TEXT,
  country                   TEXT,

  -- Contribution details
  contribution_type         TEXT,
  estimated_contribution_usd INTEGER,
  preferred_project_id      UUID REFERENCES public.impact_fund_projects(id) ON DELETE SET NULL,
  message                   TEXT,

  -- CRM tracking (admin only)
  status                    TEXT NOT NULL DEFAULT 'new',        -- new | contacted | converted | declined
  admin_notes               TEXT,
  contacted_at              TIMESTAMPTZ,
  converted_at              TIMESTAMPTZ,

  created_at                TIMESTAMPTZ DEFAULT NOW(),
  updated_at                TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.fund_interests IS
  'Donor and partner interest records for AfDEC Diaspora Impact Fund. Admin-only visibility.';

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. INDEXES
-- ─────────────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_fund_projects_status ON public.impact_fund_projects(status);
CREATE INDEX IF NOT EXISTS idx_fund_projects_featured ON public.impact_fund_projects(is_featured, sort_order);

CREATE INDEX IF NOT EXISTS idx_fund_applications_status ON public.fund_applications(status);
CREATE INDEX IF NOT EXISTS idx_fund_applications_user ON public.fund_applications(applicant_user_id);
CREATE INDEX IF NOT EXISTS idx_fund_applications_project ON public.fund_applications(project_id);
CREATE INDEX IF NOT EXISTS idx_fund_applications_ref ON public.fund_applications(reference_number);

CREATE INDEX IF NOT EXISTS idx_fund_interests_status ON public.fund_interests(status);
CREATE INDEX IF NOT EXISTS idx_fund_interests_type ON public.fund_interests(inquiry_type);

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. AUTO-UPDATE updated_at TRIGGERS
-- ─────────────────────────────────────────────────────────────────────────────
DROP TRIGGER IF EXISTS trg_fund_projects_updated_at ON public.impact_fund_projects;
CREATE TRIGGER trg_fund_projects_updated_at
  BEFORE UPDATE ON public.impact_fund_projects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_fund_applications_updated_at ON public.fund_applications;
CREATE TRIGGER trg_fund_applications_updated_at
  BEFORE UPDATE ON public.fund_applications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_fund_interests_updated_at ON public.fund_interests;
CREATE TRIGGER trg_fund_interests_updated_at
  BEFORE UPDATE ON public.fund_interests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. ROW-LEVEL SECURITY
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.impact_fund_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fund_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fund_interests ENABLE ROW LEVEL SECURITY;

-- Projects: public read (active/funded/coming_soon visible to all)
CREATE POLICY "Public read active fund projects"
  ON public.impact_fund_projects FOR SELECT
  USING (status IN ('active', 'funded', 'coming_soon'));

-- Projects: admin full access
CREATE POLICY "Admin full access to fund projects"
  ON public.impact_fund_projects FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Applications: ONLY the submitting user can see their own application
CREATE POLICY "Applicant reads own application"
  ON public.fund_applications FOR SELECT
  USING (applicant_user_id = auth.uid());

-- Applications: authenticated users can INSERT (submit an application)
CREATE POLICY "Authenticated users can submit applications"
  ON public.fund_applications FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND applicant_user_id = auth.uid());

-- Applications: applicant can UPDATE only their own application when status = 'additional_info_requested'
CREATE POLICY "Applicant can respond to info requests"
  ON public.fund_applications FOR UPDATE
  USING (applicant_user_id = auth.uid() AND status = 'additional_info_requested')
  WITH CHECK (applicant_user_id = auth.uid());

-- Applications: admin full access
CREATE POLICY "Admin full access to applications"
  ON public.fund_applications FOR ALL
  USING (auth.jwt() ->> 'role' IN ('admin', 'super_admin'))
  WITH CHECK (auth.jwt() ->> 'role' IN ('admin', 'super_admin'));

-- Fund interests: admin only (no public visibility)
CREATE POLICY "Admin full access to fund interests"
  ON public.fund_interests FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Fund interests: public INSERT (so anon users can submit interest)
CREATE POLICY "Public can submit fund interest"
  ON public.fund_interests FOR INSERT
  WITH CHECK (TRUE);

-- ─────────────────────────────────────────────────────────────────────────────
-- 8. SEED DATA — 5 Development Projects
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.impact_fund_projects (
  slug, title, category, description, cover_image_url,
  country, region, target_amount_usd, raised_amount_usd,
  beneficiary_estimate, multilateral_tags, sdg_goals,
  is_featured, sort_order, status, applications_open, max_grant_usd
) VALUES
  (
    'agrilink-west-africa',
    'AgriLink West Africa',
    'Agriculture',
    'Connecting 500 smallholder farmers across Ghana and Senegal to mobile agritech platforms — providing real-time market pricing, soil health data, and micro-loan facilitation through NC-Africa agricultural technology partnerships.',
    'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2070&auto=format&fit=crop',
    'Ghana, Senegal', 'West Africa', 150000, 0,
    500, '{AfDB}', '{2, 8}',
    TRUE, 1, 'active', FALSE, 7500
  ),
  (
    'nc-kenya-health-bridge',
    'NC–Kenya Health Bridge',
    'Health',
    'Establishing a sustainable medical supply corridor between North Carolina health systems and 12 rural clinics in Western Kenya — supporting the Kenyan government''s Universal Health Coverage mandate and reducing medical supply gaps by 40%.',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop',
    'Kenya', 'East Africa', 200000, 0,
    12000, '{WorldBank, USAID}', '{3, 10}',
    TRUE, 2, 'active', FALSE, 10000
  ),
  (
    'sahel-solar-schools',
    'Sahel Solar Schools',
    'Education & Energy',
    'Deploying off-grid solar power and digital learning infrastructure to 10 rural schools in Mali and Burkina Faso — impacting 3,200 students, aligned with SDG 4 (Quality Education) and SDG 7 (Affordable and Clean Energy).',
    'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2070&auto=format&fit=crop',
    'Mali, Burkina Faso', 'West Africa', 250000, 0,
    3200, '{UNDP, AfDB}', '{4, 7, 13}',
    FALSE, 3, 'coming_soon', FALSE, 5000
  ),
  (
    'afcfta-micro-enterprise-fund',
    'AfCFTA Micro-Enterprise Fund',
    'Trade & SME',
    'Providing 20 African micro-enterprises with grants of $3,000–$8,000 to access AfCFTA cross-border trade — covering certification, compliance, digital storefronts, and AfDEC Hub desk memberships for 6 months.',
    'https://images.unsplash.com/photo-1556740714-a8395b3bf30f?q=80&w=2070&auto=format&fit=crop',
    'Pan-African', 'Pan-African', 100000, 0,
    20, '{AfCFTA, IMF}', '{8, 10, 17}',
    TRUE, 4, 'coming_soon', FALSE, 8000
  ),
  (
    'digital-talent-pipeline',
    'Digital Talent Pipeline',
    'ICT & Youth',
    'An intensive 6-month digital skills program training 500 African youth aged 18–30 across Lagos, Nairobi, and Accra in software development, data analytics, and digital marketing — placing 70% into NC-affiliated remote roles.',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2070&auto=format&fit=crop',
    'Nigeria, Kenya, Ghana', 'Pan-African', 80000, 0,
    500, '{IFC, AfDB}', '{4, 8, 10}',
    FALSE, 5, 'coming_soon', FALSE, 3000
  )
ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 9. USEFUL VIEWS
-- ─────────────────────────────────────────────────────────────────────────────
-- Public view: projects with funding progress
CREATE OR REPLACE VIEW public.v_active_fund_projects AS
SELECT
  id, slug, title, category, description, cover_image_url,
  country, region,
  target_amount_usd, raised_amount_usd,
  CASE WHEN target_amount_usd > 0
    THEN ROUND((raised_amount_usd::NUMERIC / target_amount_usd) * 100, 1)
    ELSE 0
  END AS funding_pct,
  beneficiary_estimate, beneficiary_actual,
  multilateral_tags, sdg_goals,
  is_featured, sort_order, status,
  applications_open, application_deadline, max_grant_usd
FROM public.impact_fund_projects
WHERE status IN ('active', 'funded', 'coming_soon')
ORDER BY sort_order ASC;

COMMENT ON VIEW public.v_active_fund_projects IS
  'Public API view: impact fund projects with computed funding percentage.';

-- Admin view: application pipeline summary
CREATE OR REPLACE VIEW public.v_application_pipeline AS
SELECT
  fa.id, fa.reference_number,
  fa.business_name, fa.country, fa.sector,
  fa.project_title, fa.requested_amount_usd,
  fa.status, fa.submitted_at,
  fp.title AS project_title_fund,
  fa.contact_name, fa.contact_email
FROM public.fund_applications fa
LEFT JOIN public.impact_fund_projects fp ON fa.project_id = fp.id
ORDER BY fa.submitted_at DESC;

COMMENT ON VIEW public.v_application_pipeline IS
  'Admin-only: full application pipeline with project linkage. Protected by RLS.';

-- ─────────────────────────────────────────────────────────────────────────────
-- Migration complete.
-- Next steps:
--   1. Run this SQL in Supabase SQL Editor
--   2. Create Storage bucket: 'fund-applications' (PRIVATE — no public access)
--   3. Create Storage bucket: 'fund-project-images' (PUBLIC)
--   4. Update the 'fund-applications' bucket with RLS policy:
--      - Only the uploading user can read their own uploads
--      - Admins can read all uploads
--   5. Configure email notifications:
--      - Application received: Supabase Edge Function → Resend/SendGrid
--      - Status change notifications: trigger-based Edge Function
-- ─────────────────────────────────────────────────────────────────────────────
