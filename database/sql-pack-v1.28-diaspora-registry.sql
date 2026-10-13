-- ====================================================================
-- AfDEC SQL pack v1.28 - Diaspora Registry (public, consent-based)
-- Run AFTER v1.26b and v1.27. Safe to re-run.
--
-- What it does
--   1. Lets anyone (signed in or not) add themselves to the registry,
--      but only with recorded consent. Nobody can read rows they did not
--      create; staff/admin read everything (existing policies).
--   2. One registration per email (case-insensitive).
--   3. Publishes ANONYMOUS aggregate counts for the homepage / registry page.
-- ====================================================================

DO $$ BEGIN
  IF to_regprocedure('public.is_staff()') IS NULL THEN
    RAISE EXCEPTION 'Run sql-pack-v1.26b-foundation.sql successfully BEFORE v1.28.';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='diaspora_registry' AND column_name='consent_at') THEN
    RAISE EXCEPTION 'diaspora_registry.consent_at is missing: v1.26b did not complete. Re-run it first.';
  END IF;
END $$;
GRANT INSERT ON public.diaspora_registry TO anon, authenticated;

DROP POLICY IF EXISTS diaspora_public_insert ON public.diaspora_registry;
CREATE POLICY diaspora_public_insert ON public.diaspora_registry
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    consent_at IS NOT NULL
    AND (user_id IS NULL OR user_id = auth.uid())
  );

CREATE UNIQUE INDEX IF NOT EXISTS uq_diaspora_registry_email
  ON public.diaspora_registry (lower(email))
  WHERE email IS NOT NULL;

CREATE OR REPLACE VIEW public.v_diaspora_stats AS
SELECT
  count(*)::int                                   AS members,
  count(DISTINCT lower(country_of_origin))::int   AS origin_countries,
  count(DISTINCT lower(residence_state))::int     AS residence_states
FROM public.diaspora_registry;

GRANT SELECT ON public.v_diaspora_stats TO anon, authenticated;
