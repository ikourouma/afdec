-- ====================================================================
-- AfDEC SQL Pack v1.26a  -  Role enum extension
-- RUN THIS FIRST, ON ITS OWN, then run v1.26b.
-- (Postgres cannot use a new enum value in the same transaction that adds it.)
-- Safe to re-run.
-- ====================================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE public.user_role AS ENUM ('super_admin', 'admin', 'staff', 'investor', 'member', 'registered');
  END IF;
END $$;

ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'super_admin';
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'admin';
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'staff';
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'investor';
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'member';
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'registered';
