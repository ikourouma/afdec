-- ====================================================================
-- AfDEC SQL Pack v1.26b  -  Foundation: roles, RLS reset, missing tables
-- Run AFTER v1.26a.  Idempotent: safe to re-run.
--
-- What this does
--   1. Adds profile columns (email, status, partner/deal-room approval ...)
--   2. Creates SECURITY DEFINER role helpers (fixes the 42P17 RLS recursion)
--   3. Blocks users from escalating their own role (trigger)
--   4. Creates the tables the admin pages already expect but that do not exist
--   5. Adds columns the public pages already query but that do not exist
--   6. Drops EVERY existing policy on the platform tables and rebuilds a
--      clean, role-based set (public / registered / member / staff / admin)
--   7. Creates storage buckets + policies, safe public views, audit log
--
-- Role model (profiles.role):
--   super_admin > admin > staff > investor / member > registered > (anonymous)
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------------------
-- 1. PROFILE COLUMNS
-- --------------------------------------------------------------------
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS country text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS suspended_reason text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_partner_approved boolean NOT NULL DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS deal_room_approved boolean NOT NULL DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS nda_accepted_at timestamptz;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_login_at timestamptz;

DO $$ BEGIN
  ALTER TABLE public.profiles ADD CONSTRAINT profiles_status_check
    CHECK (status IN ('active', 'suspended', 'revoked'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Backfill email from auth.users
UPDATE public.profiles p SET email = u.email
FROM auth.users u WHERE u.id = p.id AND p.email IS NULL;

-- --------------------------------------------------------------------
-- 2. ROLE HELPERS (SECURITY DEFINER = read profiles without triggering RLS)
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.current_role_text()
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT CASE WHEN p.status IN ('suspended', 'revoked') THEN 'suspended' ELSE p.role::text END
  FROM public.profiles p WHERE p.id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE(public.current_role_text() = 'super_admin', false)
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE(public.current_role_text() IN ('super_admin', 'admin'), false)
$$;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE(public.current_role_text() IN ('super_admin', 'admin', 'staff'), false)
$$;

CREATE OR REPLACE FUNCTION public.is_registered()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE(public.current_role_text() IN
    ('registered', 'member', 'investor', 'staff', 'admin', 'super_admin'), false)
$$;

CREATE OR REPLACE FUNCTION public.has_member_access()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE(
    public.current_role_text() IN ('member', 'investor', 'staff', 'admin', 'super_admin')
    OR EXISTS (SELECT 1 FROM public.profiles p
               WHERE p.id = auth.uid() AND p.is_partner_approved AND p.status = 'active'),
    false)
$$;

CREATE OR REPLACE FUNCTION public.has_deal_room_access()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE(
    public.current_role_text() IN ('admin', 'super_admin')
    OR EXISTS (SELECT 1 FROM public.profiles p
               WHERE p.id = auth.uid() AND p.status = 'active'
                 AND p.role::text IN ('investor', 'member')
                 AND p.deal_room_approved AND p.nda_accepted_at IS NOT NULL),
    false)
$$;

-- --------------------------------------------------------------------
-- 3. PROFILE PROTECTION + SIGNUP TRIGGER
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.protect_profile_privileged_columns()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  -- service role / SQL editor / auth trigger: no JWT user
  IF auth.uid() IS NULL THEN RETURN NEW; END IF;

  IF public.is_admin() THEN
    IF NOT public.is_super_admin() AND NEW.role::text IN ('super_admin', 'admin') THEN
      IF TG_OP = 'INSERT' THEN
        RAISE EXCEPTION 'Only a super admin can grant admin roles';
      ELSIF NEW.role IS DISTINCT FROM OLD.role THEN
        RAISE EXCEPTION 'Only a super admin can grant admin roles';
      END IF;
    END IF;
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    NEW.role := 'registered'::public.user_role;
    NEW.status := 'active';
    NEW.is_partner_approved := false;
    NEW.deal_room_approved := false;
  ELSE
    NEW.id := OLD.id;
    NEW.role := OLD.role;
    NEW.status := OLD.status;
    NEW.is_partner_approved := OLD.is_partner_approved;
    NEW.deal_room_approved := OLD.deal_room_approved;
    NEW.suspended_reason := OLD.suspended_reason;
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_protect_profile ON public.profiles;
CREATE TRIGGER trg_protect_profile
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_privileged_columns();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, role)
  VALUES (NEW.id, NEW.email,
          NEW.raw_user_meta_data ->> 'first_name',
          NEW.raw_user_meta_data ->> 'last_name',
          'registered'::public.user_role)
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Make sure every auth user has a profile
INSERT INTO public.profiles (id, email, role)
SELECT u.id, u.email, 'registered'::public.user_role FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = u.id);

-- --------------------------------------------------------------------
-- 4. AUDIT LOG
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid,
  actor_email text,
  action text NOT NULL,
  target_type text,
  target_id text,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- --------------------------------------------------------------------
-- 5. ADMIN RPCs (the only way to change role / status)
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.admin_set_user_role(target uuid, new_role text, justification text DEFAULT NULL)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE old_role text;
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'Access denied'; END IF;
  IF new_role NOT IN ('super_admin','admin','staff','investor','member','registered') THEN
    RAISE EXCEPTION 'Unknown role %', new_role;
  END IF;
  IF new_role IN ('super_admin', 'admin') AND NOT public.is_super_admin() THEN
    RAISE EXCEPTION 'Only a super admin can grant admin roles';
  END IF;
  SELECT role::text INTO old_role FROM public.profiles WHERE id = target;
  IF old_role IN ('super_admin', 'admin') AND NOT public.is_super_admin() THEN
    RAISE EXCEPTION 'Only a super admin can change an admin account';
  END IF;
  IF target = auth.uid() THEN RAISE EXCEPTION 'You cannot change your own role'; END IF;

  UPDATE public.profiles SET role = new_role::public.user_role, updated_at = now() WHERE id = target;
  INSERT INTO public.audit_log (actor_id, actor_email, action, target_type, target_id, details)
  VALUES (auth.uid(), auth.jwt() ->> 'email', 'role_change', 'profile', target::text,
          jsonb_build_object('from', old_role, 'to', new_role, 'justification', justification));
  RETURN true;
END $$;

CREATE OR REPLACE FUNCTION public.admin_set_user_status(target uuid, new_status text, reason text DEFAULT NULL)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE old_status text; target_role text;
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'Access denied'; END IF;
  IF new_status NOT IN ('active', 'suspended', 'revoked') THEN RAISE EXCEPTION 'Unknown status %', new_status; END IF;
  IF target = auth.uid() THEN RAISE EXCEPTION 'You cannot change your own status'; END IF;
  SELECT status, role::text INTO old_status, target_role FROM public.profiles WHERE id = target;
  IF target_role IN ('super_admin', 'admin') AND NOT public.is_super_admin() THEN
    RAISE EXCEPTION 'Only a super admin can change an admin account';
  END IF;

  UPDATE public.profiles
  SET status = new_status,
      suspended_reason = CASE WHEN new_status = 'active' THEN NULL ELSE reason END,
      -- revoke = strip partner/deal-room access and drop to registered
      is_partner_approved = CASE WHEN new_status = 'revoked' THEN false ELSE is_partner_approved END,
      deal_room_approved  = CASE WHEN new_status = 'revoked' THEN false ELSE deal_room_approved END,
      role = CASE WHEN new_status = 'revoked' AND role::text IN ('member','investor','staff')
                  THEN 'registered'::public.user_role ELSE role END,
      updated_at = now()
  WHERE id = target;

  INSERT INTO public.audit_log (actor_id, actor_email, action, target_type, target_id, details)
  VALUES (auth.uid(), auth.jwt() ->> 'email', 'status_change', 'profile', target::text,
          jsonb_build_object('from', old_status, 'to', new_status, 'reason', reason));
  RETURN true;
END $$;

CREATE OR REPLACE FUNCTION public.admin_set_user_access(target uuid, partner_approved boolean, deal_room boolean)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'Access denied'; END IF;
  UPDATE public.profiles
  SET is_partner_approved = partner_approved, deal_room_approved = deal_room, updated_at = now()
  WHERE id = target;
  INSERT INTO public.audit_log (actor_id, actor_email, action, target_type, target_id, details)
  VALUES (auth.uid(), auth.jwt() ->> 'email', 'access_change', 'profile', target::text,
          jsonb_build_object('partner_approved', partner_approved, 'deal_room', deal_room));
  RETURN true;
END $$;

-- Replace the old elevate function (it had a "no super admin yet" loophole)
CREATE OR REPLACE FUNCTION public.elevate_user_role(target_user_id uuid, new_role public.user_role, justification text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_super_admin() THEN RAISE EXCEPTION 'Access Denied: Only a Super Admin can elevate roles.'; END IF;
  RETURN public.admin_set_user_role(target_user_id, new_role::text, justification);
END $$;

-- Admin-only listing of users with email (profiles.email is backfilled/synced)
CREATE OR REPLACE FUNCTION public.admin_list_users()
RETURNS TABLE (id uuid, email text, first_name text, last_name text, organization text, role text,
               status text, is_partner_approved boolean, deal_room_approved boolean,
               created_at timestamptz, last_sign_in_at timestamptz)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'Access denied'; END IF;
  RETURN QUERY
    SELECT p.id, COALESCE(p.email, u.email::text), p.first_name, p.last_name, p.organization,
           p.role::text, p.status, p.is_partner_approved, p.deal_room_approved,
           p.created_at, u.last_sign_in_at
    FROM public.profiles p LEFT JOIN auth.users u ON u.id = p.id
    ORDER BY p.created_at DESC;
END $$;

-- --------------------------------------------------------------------
-- 6. TABLES THE ADMIN PAGES EXPECT (were returning 404)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sector text,
  location text,
  website text,
  contact_email text,
  description text,
  logo_url text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.job_postings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  department text,
  location text,
  type text NOT NULL DEFAULT 'Full-Time',
  description text NOT NULL DEFAULT '',
  requirements text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.sponsorships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  contact_name text,
  contact_email text,
  tier text NOT NULL DEFAULT 'gold',
  amount numeric(14,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active',
  start_date date,
  end_date date,
  notes text,
  logo_url text,
  website text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.membership_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  full_name text,
  email text NOT NULL,
  organization text,
  tier text DEFAULT 'Standard',
  country text,
  phone text,
  message text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.partner_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  full_name text,
  email text NOT NULL,
  organization text,
  phone text,
  request_type text DEFAULT 'partnership',
  message text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Staff may triage requests but only admins may approve / reject
CREATE OR REPLACE FUNCTION public.enforce_admin_decisions()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND NEW.status IN ('approved', 'rejected')
     AND NEW.status IS DISTINCT FROM OLD.status AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only an admin can approve or reject';
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_admin_decisions ON public.membership_applications;
CREATE TRIGGER trg_admin_decisions BEFORE UPDATE ON public.membership_applications
  FOR EACH ROW EXECUTE FUNCTION public.enforce_admin_decisions();
DROP TRIGGER IF EXISTS trg_admin_decisions ON public.partner_requests;
CREATE TRIGGER trg_admin_decisions BEFORE UPDATE ON public.partner_requests
  FOR EACH ROW EXECUTE FUNCTION public.enforce_admin_decisions();

-- --------------------------------------------------------------------
-- 7. COLUMNS PUBLIC / ADMIN PAGES ALREADY QUERY BUT DID NOT EXIST
-- --------------------------------------------------------------------
-- events: /events selects event_type, image_url, status
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS event_type text DEFAULT 'conference';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'published';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false;

-- press releases: short description + uploaded file
ALTER TABLE public.press_releases ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public.press_releases ADD COLUMN IF NOT EXISTS file_url text;
ALTER TABLE public.press_releases ADD COLUMN IF NOT EXISTS file_name text;
ALTER TABLE public.press_releases ADD COLUMN IF NOT EXISTS image_url text;

-- insights: lets the admin Policy page store author/tags without the author tables
ALTER TABLE public.insights_articles ADD COLUMN IF NOT EXISTS author_name text;
ALTER TABLE public.insights_articles ADD COLUMN IF NOT EXISTS author_title text;
ALTER TABLE public.insights_articles ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- alerts: audience for the council-member flash banner
ALTER TABLE public.global_alerts ADD COLUMN IF NOT EXISTS audience text NOT NULL DEFAULT 'all';
ALTER TABLE public.global_alerts ADD COLUMN IF NOT EXISTS link_url text;
ALTER TABLE public.global_alerts ADD COLUMN IF NOT EXISTS link_text text;

-- diaspora registry: richer, consent-based record
ALTER TABLE public.diaspora_registry ADD COLUMN IF NOT EXISTS full_name text;
ALTER TABLE public.diaspora_registry ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.diaspora_registry ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.diaspora_registry ADD COLUMN IF NOT EXISTS generation text;
ALTER TABLE public.diaspora_registry ADD COLUMN IF NOT EXISTS languages text[] DEFAULT '{}';
ALTER TABLE public.diaspora_registry ADD COLUMN IF NOT EXISTS interests text[] DEFAULT '{}';
ALTER TABLE public.diaspora_registry ADD COLUMN IF NOT EXISTS organization text;
ALTER TABLE public.diaspora_registry ADD COLUMN IF NOT EXISTS contact_preference text DEFAULT 'email';
ALTER TABLE public.diaspora_registry ADD COLUMN IF NOT EXISTS consent_at timestamptz;
ALTER TABLE public.diaspora_registry ADD COLUMN IF NOT EXISTS consent_version text;
ALTER TABLE public.diaspora_registry ADD COLUMN IF NOT EXISTS open_to_survey boolean NOT NULL DEFAULT true;
ALTER TABLE public.diaspora_registry ALTER COLUMN user_id DROP NOT NULL;

-- --------------------------------------------------------------------
-- 8. VIEWS (safe public surfaces)
-- --------------------------------------------------------------------
-- Published articles: now falls back to the inline author/tags columns
CREATE OR REPLACE VIEW public.v_published_articles AS
SELECT
  a.id, a.slug, a.category, a.content_type,
  a.title, a.subtitle, a.excerpt,
  a.cover_image_url, a.reading_time_min,
  a.published_at, a.is_featured,
  a.allow_download, a.download_url, a.download_label, a.file_size_kb,
  a.view_count, a.download_count,
  COALESCE(auth.full_name, a.author_name) AS author_name,
  COALESCE(auth.title, a.author_title) AS author_title,
  auth.avatar_url AS author_avatar,
  COALESCE(ARRAY_AGG(DISTINCT t.label) FILTER (WHERE t.label IS NOT NULL), a.tags, '{}') AS tags
FROM public.insights_articles a
LEFT JOIN public.insight_authors auth ON a.author_id = auth.id
LEFT JOIN public.article_tags at ON a.id = at.article_id
LEFT JOIN public.insight_tags t ON at.tag_id = t.id
WHERE a.status = 'published'
GROUP BY a.id, auth.full_name, auth.title, auth.avatar_url
ORDER BY a.published_at DESC;

-- Public teaser of the intelligence map: NO numbers, so nothing can be un-blurred
CREATE OR REPLACE VIEW public.v_country_teaser AS
SELECT country_code, country_name, region, capital, afdec_priority
FROM public.country_profiles;

-- Public sponsor strip: no amounts, no contacts
CREATE OR REPLACE VIEW public.v_public_sponsors AS
SELECT id, company_name, tier, logo_url, website
FROM public.sponsorships
WHERE status = 'active' AND (end_date IS NULL OR end_date >= CURRENT_DATE);

GRANT SELECT ON public.v_published_articles, public.v_country_teaser, public.v_public_sponsors TO anon, authenticated;

-- --------------------------------------------------------------------
-- 9. RLS RESET  (drop every policy on platform tables, rebuild cleanly)
-- --------------------------------------------------------------------
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
-- profiles (own row + admin). Role/status columns are protected by the trigger.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DO $$ DECLARE r record; BEGIN
  FOR r IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', r.policyname);
  END LOOP;
END $$;
CREATE POLICY afdec_profiles_select ON public.profiles FOR SELECT USING (id = auth.uid() OR public.is_admin());
CREATE POLICY afdec_profiles_insert ON public.profiles FOR INSERT WITH CHECK (id = auth.uid() OR public.is_admin());
CREATE POLICY afdec_profiles_update ON public.profiles FOR UPDATE
  USING (id = auth.uid() OR public.is_admin()) WITH CHECK (id = auth.uid() OR public.is_admin());
CREATE POLICY afdec_profiles_delete ON public.profiles FOR DELETE USING (public.is_super_admin());

-- Content (staff create/edit, admin delete, public reads what is live)
SELECT public._afdec_policies('hero_slides',     'is_active OR public.is_staff()', 'public.is_staff()', 'public.is_staff()', 'public.is_admin()');
SELECT public._afdec_policies('news_briefings',  $$status::text = 'published' OR public.is_staff()$$, 'public.is_staff()', 'public.is_staff()', 'public.is_admin()');
SELECT public._afdec_policies('global_alerts',   'is_active OR public.is_staff()', 'public.is_staff()', 'public.is_staff()', 'public.is_admin()');
SELECT public._afdec_policies('page_content',    'is_published OR public.is_staff()', 'public.is_staff()', 'public.is_staff()', 'public.is_admin()');
SELECT public._afdec_policies('managed_content', 'is_active OR public.is_staff()', 'public.is_staff()', 'public.is_staff()', 'public.is_admin()');
SELECT public._afdec_policies('press_releases',  'is_active OR public.is_staff()', 'public.is_staff()', 'public.is_staff()', 'public.is_admin()');
SELECT public._afdec_policies('events',          $$status = 'published' OR public.is_staff()$$, 'public.is_staff()', 'public.is_staff()', 'public.is_admin()');
SELECT public._afdec_policies('hub_locations',   'is_visible OR public.is_staff()', 'public.is_staff()', 'public.is_staff()', 'public.is_admin()');
SELECT public._afdec_policies('hub_services',    'is_visible OR public.is_staff()', 'public.is_staff()', 'public.is_staff()', 'public.is_admin()');
SELECT public._afdec_policies('hub_stats',       'true', 'public.is_staff()', 'public.is_staff()', 'public.is_admin()');
SELECT public._afdec_policies('board_members',   'is_active OR public.is_staff()', 'public.is_staff()', 'public.is_staff()', 'public.is_admin()');
SELECT public._afdec_policies('job_postings',    'is_active OR public.is_staff()', 'public.is_staff()', 'public.is_staff()', 'public.is_admin()');
SELECT public._afdec_policies('businesses',      $$status IN ('active','verified') OR public.is_staff()$$, 'public.is_staff()', 'public.is_staff()', 'public.is_admin()');
-- live table (supabase_v1.21_admin_pack.sql) uses user_id and holds tax_id: owner/staff only, never public
SELECT public._afdec_policies('business_entities', 'user_id = auth.uid() OR public.is_staff()', 'public.is_staff()', 'user_id = auth.uid() OR public.is_staff()', 'public.is_admin()');
SELECT public._afdec_policies('impact_projects', 'true', 'public.is_staff()', 'public.is_staff()', 'public.is_admin()');
SELECT public._afdec_policies('strategic_milestones', $$status::text = 'published' OR public.is_staff()$$, 'public.is_staff()', 'public.is_staff()', 'public.is_admin()');
SELECT public._afdec_policies('insights_articles', $$status::text = 'published' OR public.is_staff()$$, 'public.is_staff()', 'public.is_staff()', 'public.is_admin()');
SELECT public._afdec_policies('insight_authors', 'true', 'public.is_staff()', 'public.is_staff()', 'public.is_admin()');
SELECT public._afdec_policies('insight_tags',    'true', 'public.is_staff()', 'public.is_staff()', 'public.is_admin()');
SELECT public._afdec_policies('article_tags',    'true', 'public.is_staff()', 'public.is_staff()', 'public.is_admin()');
SELECT public._afdec_policies('article_related', 'true', 'public.is_staff()', 'public.is_staff()', 'public.is_admin()');
SELECT public._afdec_policies('impact_fund_projects', 'true', 'public.is_staff()', 'public.is_staff()', 'public.is_admin()');
SELECT public._afdec_policies('platform_telemetry', 'true', 'public.is_admin()', 'public.is_admin()', 'public.is_admin()');

-- Registered users only: full intelligence data (anonymous gets v_country_teaser)
SELECT public._afdec_policies('country_profiles', 'public.is_registered()', 'public.is_staff()', 'public.is_staff()', 'public.is_admin()');

-- Inbound forms (anyone may submit, staff triage, admin decides/deletes)
SELECT public._afdec_policies('lead_intakes',    'public.is_staff()', NULL, 'public.is_staff()', 'public.is_admin()', 'true');
SELECT public._afdec_policies('advisor_submissions', 'public.is_staff()', NULL, 'public.is_staff()', 'public.is_admin()', 'true');
SELECT public._afdec_policies('fund_interests',  'public.is_staff()', NULL, 'public.is_staff()', 'public.is_admin()', 'true');
SELECT public._afdec_policies('market_sentiments','public.is_staff()', NULL, NULL, 'public.is_admin()', 'true');
SELECT public._afdec_policies('membership_applications', 'public.is_staff()', NULL, 'public.is_staff()', 'public.is_admin()', 'true');
SELECT public._afdec_policies('partner_requests','public.is_staff()', NULL, 'public.is_staff()', 'public.is_admin()', 'true');
SELECT public._afdec_policies('event_registrations', 'user_id = auth.uid() OR public.is_staff()', NULL, 'public.is_staff()', 'public.is_admin()', 'true');
SELECT public._afdec_policies('sovereign_submissions', 'user_id = auth.uid() OR public.is_staff()', NULL, 'public.is_staff()', 'public.is_admin()', 'user_id IS NULL OR user_id = auth.uid()');

-- Newsletter: public may subscribe, ONLY admins read/export the list
SELECT public._afdec_policies('newsletter_subscribers', 'public.is_admin()', NULL, 'public.is_admin()', 'public.is_admin()', $$email IS NOT NULL AND email LIKE '%@%'$$);

-- Money / personal data: admin only
SELECT public._afdec_policies('sponsorships',    'public.is_admin()', 'public.is_admin()', 'public.is_admin()', 'public.is_admin()');
SELECT public._afdec_policies('investment_ledger', 'user_id = auth.uid() OR public.is_admin()', 'public.is_admin()', 'public.is_admin()', 'public.is_admin()');
SELECT public._afdec_policies('audit_log',       'public.is_admin()', NULL, NULL, NULL);

-- Per-user data
SELECT public._afdec_policies('saved_insights',  'user_id = auth.uid()', 'user_id = auth.uid()', 'user_id = auth.uid()', 'user_id = auth.uid()');
SELECT public._afdec_policies('notifications',   'user_id = auth.uid() OR public.is_admin()', 'public.is_staff()', 'user_id = auth.uid() OR public.is_admin()', 'public.is_admin()');
SELECT public._afdec_policies('partner_map_requests', 'user_id = auth.uid() OR public.is_staff()', 'user_id = auth.uid()', 'public.is_admin()', 'public.is_admin()');
SELECT public._afdec_policies('fund_applications', 'applicant_user_id = auth.uid() OR public.is_staff()',
  'auth.uid() IS NOT NULL AND applicant_user_id = auth.uid()',
  $$public.is_staff() OR (applicant_user_id = auth.uid() AND status::text = 'additional_info_requested')$$,
  'public.is_admin()');

-- Diaspora registry: own row; staff read (analytics); admin delete
SELECT public._afdec_policies('diaspora_registry', 'user_id = auth.uid() OR public.is_staff()',
  'user_id = auth.uid() OR public.is_staff()', 'user_id = auth.uid() OR public.is_staff()', 'user_id = auth.uid() OR public.is_admin()');

DROP FUNCTION IF EXISTS public._afdec_policies(text, text, text, text, text, text);

-- --------------------------------------------------------------------
-- 10. STORAGE BUCKETS + POLICIES
-- --------------------------------------------------------------------
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public, file_size_limit)
  VALUES ('site-assets', 'site-assets', true, 10485760),
         ('insight-attachments', 'insight-attachments', true, 26214400),
         ('deal-room', 'deal-room', false, 52428800)
  ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public, file_size_limit = EXCLUDED.file_size_limit;

  DROP POLICY IF EXISTS afdec_storage_public_read ON storage.objects;
  DROP POLICY IF EXISTS afdec_storage_staff_insert ON storage.objects;
  DROP POLICY IF EXISTS afdec_storage_staff_update ON storage.objects;
  DROP POLICY IF EXISTS afdec_storage_admin_delete ON storage.objects;
  DROP POLICY IF EXISTS afdec_storage_deal_read ON storage.objects;
  DROP POLICY IF EXISTS afdec_storage_deal_write ON storage.objects;

  CREATE POLICY afdec_storage_public_read ON storage.objects FOR SELECT
    USING (bucket_id IN ('site-assets', 'insight-attachments'));
  CREATE POLICY afdec_storage_staff_insert ON storage.objects FOR INSERT
    WITH CHECK (bucket_id IN ('site-assets', 'insight-attachments') AND public.is_staff());
  CREATE POLICY afdec_storage_staff_update ON storage.objects FOR UPDATE
    USING (bucket_id IN ('site-assets', 'insight-attachments') AND public.is_staff());
  CREATE POLICY afdec_storage_admin_delete ON storage.objects FOR DELETE
    USING (bucket_id IN ('site-assets', 'insight-attachments', 'deal-room') AND public.is_admin());
  CREATE POLICY afdec_storage_deal_read ON storage.objects FOR SELECT
    USING (bucket_id = 'deal-room' AND public.has_deal_room_access());
  CREATE POLICY afdec_storage_deal_write ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'deal-room' AND public.is_admin());
EXCEPTION WHEN others THEN
  RAISE NOTICE 'Storage setup skipped: %', SQLERRM;
END $$;

-- --------------------------------------------------------------------
-- 11. VERIFY (read the result grid after running)
-- --------------------------------------------------------------------
SELECT 'policies_on_profiles' AS check, count(*) AS value, NULL::text AS detail FROM pg_policies WHERE schemaname='public' AND tablename='profiles'
UNION ALL SELECT 'tables_with_rls', count(*), NULL FROM pg_tables WHERE schemaname='public' AND rowsecurity
UNION ALL SELECT 'tables_without_rls', count(*), NULL FROM pg_tables WHERE schemaname='public' AND NOT rowsecurity
UNION ALL SELECT 'policies_skipped_due_to_error (want 0)', count(*),
  string_agg(tbl || '.' || policy || ': ' || error, ' | ') FROM public.afdec_policy_skips WHERE policy <> '(table missing)'
UNION ALL SELECT 'tables_not_found (informational)', count(*),
  string_agg(tbl, ', ') FROM public.afdec_policy_skips WHERE policy = '(table missing)';
