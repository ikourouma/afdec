-- ====================================================================
-- AfDEC SQL Pack v1.27  -  New modules
--   Assets library, Surveys, Country briefs (intelligence terminal),
--   Deal Room, Site settings
-- Run AFTER v1.26b.  Idempotent: safe to re-run.
-- ====================================================================

-- --------------------------------------------------------------------
-- 0. POLICY HELPER (same as v1.26b; dropped at the end)
-- --------------------------------------------------------------------
-- Stop early with a clear message if v1.26b has not been applied (it creates is_staff() etc.)
DO $$ BEGIN
  IF to_regprocedure('public.is_staff()') IS NULL THEN
    RAISE EXCEPTION 'Run sql-pack-v1.26b-foundation.sql successfully BEFORE v1.27 (public.is_staff() is missing).';
  END IF;
END $$;
-- Policy helper failures are recorded here instead of aborting the whole pack
-- (the Supabase SQL editor runs a script as ONE transaction, so a single error used to roll everything back).
CREATE TABLE IF NOT EXISTS public.afdec_policy_skips (
  id bigserial PRIMARY KEY,
  tbl text,
  policy text,
  error text,
  at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.afdec_policy_skips ENABLE ROW LEVEL SECURITY;  -- no policies: invisible to API users
TRUNCATE public.afdec_policy_skips;
CREATE OR REPLACE FUNCTION public._afdec_policies(
  tbl text, sel text, ins text, upd text, del text, pub_ins text DEFAULT NULL)
RETURNS void LANGUAGE plpgsql AS $f$
DECLARE r record; stmts text[] := ARRAY[]::text[]; s text;
BEGIN
  IF to_regclass('public.' || tbl) IS NULL THEN
    RAISE NOTICE 'skip % (table not found)', tbl;
    INSERT INTO public.afdec_policy_skips (tbl, policy, error) VALUES (tbl, '(table missing)', 'table not found');
    RETURN;
  END IF;
  EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', tbl);
  FOR r IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = tbl LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, tbl);
  END LOOP;
  IF sel IS NOT NULL THEN stmts := stmts || format('CREATE POLICY afdec_select ON public.%I FOR SELECT USING (%s)', tbl, sel); END IF;
  IF ins IS NOT NULL THEN stmts := stmts || format('CREATE POLICY afdec_insert ON public.%I FOR INSERT WITH CHECK (%s)', tbl, ins); END IF;
  IF pub_ins IS NOT NULL THEN stmts := stmts || format('CREATE POLICY afdec_public_insert ON public.%I FOR INSERT WITH CHECK (%s)', tbl, pub_ins); END IF;
  IF upd IS NOT NULL THEN stmts := stmts || format('CREATE POLICY afdec_update ON public.%I FOR UPDATE USING (%s) WITH CHECK (%s)', tbl, upd, upd); END IF;
  IF del IS NOT NULL THEN stmts := stmts || format('CREATE POLICY afdec_delete ON public.%I FOR DELETE USING (%s)', tbl, del); END IF;
  FOREACH s IN ARRAY stmts LOOP
    BEGIN
      EXECUTE s;
    EXCEPTION WHEN others THEN
      -- table stays RLS-enabled with fewer policies = deny by default (safe failure mode)
      INSERT INTO public.afdec_policy_skips (tbl, policy, error)
      VALUES (tbl, substring(s from 'CREATE POLICY (\w+)'), SQLERRM);
      RAISE WARNING 'policy skipped on %: %', tbl, SQLERRM;
    END;
  END LOOP;
END $f$;
-- --------------------------------------------------------------------
-- 1. ASSET LIBRARY
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket text NOT NULL DEFAULT 'site-assets',
  path text NOT NULL,
  public_url text,
  file_name text NOT NULL,
  title text,
  alt_text text,
  mime_type text,
  size_bytes bigint,
  width integer,
  height integer,
  folder text NOT NULL DEFAULT 'general',
  tags text[] NOT NULL DEFAULT '{}',
  uploaded_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (bucket, path)
);
CREATE INDEX IF NOT EXISTS idx_assets_folder ON public.assets (folder);
SELECT public._afdec_policies('assets', 'public.is_staff()', 'public.is_staff()', 'public.is_staff()', 'public.is_admin()');

-- --------------------------------------------------------------------
-- 2. SITE SETTINGS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  description text,
  updated_by uuid,
  updated_at timestamptz NOT NULL DEFAULT now()
);
SELECT public._afdec_policies('site_settings', 'true', 'public.is_admin()', 'public.is_admin()', 'public.is_admin()');

-- --------------------------------------------------------------------
-- 3. SURVEYS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.surveys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  thank_you_message text DEFAULT 'Thank you. Your response has been recorded.',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'closed')),
  audience text NOT NULL DEFAULT 'public' CHECK (audience IN ('public', 'registered', 'members')),
  target_segment jsonb NOT NULL DEFAULT '{}'::jsonb,   -- optional registry filter, e.g. {"country_of_origin":"Ghana"}
  starts_at timestamptz,
  ends_at timestamptz,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.survey_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id uuid NOT NULL REFERENCES public.surveys(id) ON DELETE CASCADE,
  position integer NOT NULL DEFAULT 0,
  type text NOT NULL CHECK (type IN ('single', 'multi', 'dropdown', 'text', 'long_text',
                                     'rating', 'nps', 'yes_no', 'number', 'date')),
  prompt text NOT NULL,
  help_text text,
  required boolean NOT NULL DEFAULT false,
  options jsonb NOT NULL DEFAULT '[]'::jsonb,
  settings jsonb NOT NULL DEFAULT '{}'::jsonb
);
CREATE INDEX IF NOT EXISTS idx_survey_questions_survey ON public.survey_questions (survey_id, position);

CREATE TABLE IF NOT EXISTS public.survey_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id uuid NOT NULL REFERENCES public.surveys(id) ON DELETE CASCADE,
  user_id uuid,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,          -- { "<question_id>": value }
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  submitted_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_survey_responses_survey ON public.survey_responses (survey_id, submitted_at);
CREATE UNIQUE INDEX IF NOT EXISTS uq_survey_one_per_user
  ON public.survey_responses (survey_id, user_id) WHERE user_id IS NOT NULL;

SELECT public._afdec_policies('surveys',
  $$public.is_staff() OR (status = 'open' AND (starts_at IS NULL OR starts_at <= now()) AND (ends_at IS NULL OR ends_at >= now())
    AND (audience = 'public' OR (audience = 'registered' AND public.is_registered()) OR (audience = 'members' AND public.has_member_access())))$$,
  'public.is_staff()', 'public.is_staff()', 'public.is_admin()');
SELECT public._afdec_policies('survey_questions',
  'EXISTS (SELECT 1 FROM public.surveys s WHERE s.id = survey_id)',
  'public.is_staff()', 'public.is_staff()', 'public.is_staff()');
SELECT public._afdec_policies('survey_responses',
  'public.is_staff() OR user_id = auth.uid()',
  NULL, NULL, 'public.is_admin()',
  $$EXISTS (SELECT 1 FROM public.surveys s WHERE s.id = survey_id AND s.status = 'open') AND (user_id IS NULL OR user_id = auth.uid())$$);

-- --------------------------------------------------------------------
-- 4. COUNTRY BRIEFS (Africa Intelligence terminal)
--    Tabs: Overview | Economy | Sectors | Trade | Opportunities | Risk | Reports
--    Overview/Economy/Sectors/Trade = any registered user
--    Opportunities/Risk/Reports     = per-row min_tier (registered | member)
-- --------------------------------------------------------------------
ALTER TABLE public.country_profiles ADD COLUMN IF NOT EXISTS flag text;
ALTER TABLE public.country_profiles ADD COLUMN IF NOT EXISTS overview text;
ALTER TABLE public.country_profiles ADD COLUMN IF NOT EXISTS political_context text;
ALTER TABLE public.country_profiles ADD COLUMN IF NOT EXISTS business_climate text;
ALTER TABLE public.country_profiles ADD COLUMN IF NOT EXISTS nc_corridor_summary text;
ALTER TABLE public.country_profiles ADD COLUMN IF NOT EXISTS data_source text DEFAULT 'IMF WEO / World Bank / AfDB';
ALTER TABLE public.country_profiles ADD COLUMN IF NOT EXISTS data_as_of date;

CREATE TABLE IF NOT EXISTS public.country_indicators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code text NOT NULL,
  indicator text NOT NULL,            -- gdp_usd, gdp_growth_pct, fdi_inflows_usd, inflation_pct ...
  year integer NOT NULL,
  value numeric NOT NULL,
  unit text,
  source text,
  source_url text,
  as_of date,
  UNIQUE (country_code, indicator, year)
);

CREATE TABLE IF NOT EXISTS public.country_sectors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code text NOT NULL,
  sector text NOT NULL,
  gdp_share_pct numeric(5,2),
  growth_pct numeric(5,2),
  summary text,
  key_players text[] DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.country_trade (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code text NOT NULL,
  direction text NOT NULL CHECK (direction IN ('export', 'import')),
  partner text,
  product text,
  value_usd bigint,
  share_pct numeric(5,2),
  year integer
);

CREATE TABLE IF NOT EXISTS public.country_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code text NOT NULL,
  title text NOT NULL,
  sector text,
  description text,
  stage text DEFAULT 'pipeline',
  ticket_min_usd bigint,
  ticket_max_usd bigint,
  nc_link text,
  min_tier text NOT NULL DEFAULT 'member' CHECK (min_tier IN ('registered', 'member')),
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.country_risks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code text NOT NULL,
  category text NOT NULL,              -- political | macro | regulatory | security | climate | fx
  level text NOT NULL DEFAULT 'medium' CHECK (level IN ('low', 'medium', 'high')),
  title text NOT NULL,
  description text,
  mitigation text,
  min_tier text NOT NULL DEFAULT 'member' CHECK (min_tier IN ('registered', 'member')),
  sort_order integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.country_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code text,                   -- NULL = multi-country report
  title text NOT NULL,
  report_type text NOT NULL DEFAULT 'country-brief',   -- country-brief | sector | market-outlook | risk | ai-generated
  summary text,
  file_url text,
  is_ai_generated boolean NOT NULL DEFAULT false,
  min_tier text NOT NULL DEFAULT 'member' CHECK (min_tier IN ('registered', 'member')),
  status text NOT NULL DEFAULT 'published',
  published_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_country_sectors_cc ON public.country_sectors (country_code);
CREATE INDEX IF NOT EXISTS idx_country_trade_cc ON public.country_trade (country_code);
CREATE INDEX IF NOT EXISTS idx_country_opps_cc ON public.country_opportunities (country_code);
CREATE INDEX IF NOT EXISTS idx_country_risks_cc ON public.country_risks (country_code);
CREATE INDEX IF NOT EXISTS idx_country_reports_cc ON public.country_reports (country_code);

SELECT public._afdec_policies('country_indicators', 'public.is_registered()', 'public.is_staff()', 'public.is_staff()', 'public.is_admin()');
SELECT public._afdec_policies('country_sectors',    'public.is_registered()', 'public.is_staff()', 'public.is_staff()', 'public.is_admin()');
SELECT public._afdec_policies('country_trade',      'public.is_registered()', 'public.is_staff()', 'public.is_staff()', 'public.is_admin()');
SELECT public._afdec_policies('country_opportunities',
  $$public.is_staff() OR (status = 'active' AND ((min_tier = 'registered' AND public.is_registered()) OR (min_tier = 'member' AND public.has_member_access())))$$,
  'public.is_staff()', 'public.is_staff()', 'public.is_admin()');
SELECT public._afdec_policies('country_risks',
  $$public.is_staff() OR (min_tier = 'registered' AND public.is_registered()) OR (min_tier = 'member' AND public.has_member_access())$$,
  'public.is_staff()', 'public.is_staff()', 'public.is_admin()');
SELECT public._afdec_policies('country_reports',
  $$public.is_staff() OR (status = 'published' AND ((min_tier = 'registered' AND public.is_registered()) OR (min_tier = 'member' AND public.has_member_access())))$$,
  'public.is_staff()', 'public.is_staff()', 'public.is_admin()');

-- --------------------------------------------------------------------
-- 5. DEAL ROOM
--    Flow: request -> admin approves (profiles.deal_room_approved) ->
--          user accepts NDA (profiles.nda_accepted_at) -> documents unlock.
--    Files live in the PRIVATE 'deal-room' bucket; serve via signed URLs only.
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.deal_room_access_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  full_name text,
  organization text NOT NULL,
  investor_type text,                  -- DFI | family office | corporate | foundation | individual
  purpose text,
  indicative_range text,               -- e.g. '$250k-$1M'
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by uuid,
  reviewed_at timestamptz,
  review_note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_deal_room_one_pending
  ON public.deal_room_access_requests (user_id) WHERE status = 'pending';

CREATE TABLE IF NOT EXISTS public.deal_room_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'overview',   -- overview | financials | structure | legal | impact | other
  file_path text,                               -- path inside bucket 'deal-room'
  file_name text,
  mime_type text,
  size_bytes bigint,
  version text DEFAULT '1.0',
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  uploaded_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.deal_room_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  document_id uuid,
  action text NOT NULL CHECK (action IN ('open_room', 'view', 'download', 'accept_nda')),
  created_at timestamptz NOT NULL DEFAULT now()
);

SELECT public._afdec_policies('deal_room_access_requests',
  'user_id = auth.uid() OR public.is_staff()', 'user_id = auth.uid()', 'public.is_admin()', 'public.is_admin()');
SELECT public._afdec_policies('deal_room_documents',
  '(is_active AND public.has_deal_room_access()) OR public.is_admin()', 'public.is_admin()', 'public.is_admin()', 'public.is_admin()');
SELECT public._afdec_policies('deal_room_activity',
  'public.is_admin()', 'user_id = auth.uid() AND public.has_deal_room_access()', NULL, NULL);

-- NDA acceptance (only possible once approved)
CREATE OR REPLACE FUNCTION public.accept_deal_room_nda()
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
  UPDATE public.profiles SET nda_accepted_at = now(), updated_at = now()
  WHERE id = auth.uid() AND deal_room_approved AND status = 'active';
  IF NOT FOUND THEN RAISE EXCEPTION 'Deal Room access has not been approved'; END IF;
  INSERT INTO public.deal_room_activity (user_id, action) VALUES (auth.uid(), 'accept_nda');
  RETURN true;
END $$;

-- Approving a request grants access in one step (admin only)
CREATE OR REPLACE FUNCTION public.admin_review_deal_room_request(request_id uuid, approve boolean, note text DEFAULT NULL)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid;
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'Access denied'; END IF;
  UPDATE public.deal_room_access_requests
  SET status = CASE WHEN approve THEN 'approved' ELSE 'rejected' END,
      reviewed_by = auth.uid(), reviewed_at = now(), review_note = note
  WHERE id = request_id RETURNING user_id INTO uid;
  IF uid IS NULL THEN RAISE EXCEPTION 'Request not found'; END IF;
  IF approve THEN
    UPDATE public.profiles SET deal_room_approved = true, updated_at = now() WHERE id = uid;
  END IF;
  INSERT INTO public.audit_log (actor_id, actor_email, action, target_type, target_id, details)
  VALUES (auth.uid(), auth.jwt() ->> 'email', 'deal_room_review', 'deal_room_access_requests', request_id::text,
          jsonb_build_object('approved', approve, 'note', note));
  RETURN true;
END $$;

-- --------------------------------------------------------------------
-- 6. TERMINAL ACCESS REQUESTS: let anonymous visitors file a lead-style request
--    (registered users continue to use partner_map_requests)
-- --------------------------------------------------------------------
ALTER TABLE public.lead_intakes ADD COLUMN IF NOT EXISTS country_code text;

DROP FUNCTION IF EXISTS public._afdec_policies(text, text, text, text, text, text);

SELECT 'v1.27 applied' AS result, 0::bigint AS value, NULL::text AS detail
UNION ALL SELECT 'policies_skipped_due_to_error (want 0)', count(*),
  string_agg(tbl || '.' || policy || ': ' || error, ' | ') FROM public.afdec_policy_skips WHERE policy <> '(table missing)'
UNION ALL SELECT 'tables_not_found (informational)', count(*),
  string_agg(tbl, ', ') FROM public.afdec_policy_skips WHERE policy = '(table missing)';
