-- ====================================================================
-- AFDEC PLATFORM — DATABASE MIGRATION
-- Migration: sql-pack-v1.19-partner-map-locks.sql
-- Goal: Partner Map Access locks & requests governance
-- Standard: Sovereign / Fortune-5
-- Directory: database/sql-pack-v1.19-partner-map-locks.sql
-- ====================================================================

-- 1. Create request status enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'partner_request_status') THEN
    CREATE TYPE partner_request_status AS ENUM ('pending', 'approved', 'rejected');
  END IF;
END$$;

-- 2. Create the partner requests table
CREATE TABLE IF NOT EXISTS public.partner_map_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status partner_request_status NOT NULL DEFAULT 'pending',
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES public.profiles(id),
  rejection_reason TEXT
);

-- 3. Standalone Partial Unique Index (gotcha fix: WHERE on UNIQUE not supported inline)
CREATE UNIQUE INDEX IF NOT EXISTS unique_user_pending_request 
  ON public.partner_map_requests (user_id) 
  WHERE (status = 'pending');

-- 4. Enable RLS
ALTER TABLE public.partner_map_requests ENABLE ROW LEVEL SECURITY;

-- 5. Recreate Policies safely
DROP POLICY IF EXISTS "Users can view own partner requests" ON public.partner_map_requests;
DROP POLICY IF EXISTS "Users can insert own partner requests" ON public.partner_map_requests;
DROP POLICY IF EXISTS "Admins have full access to partner requests" ON public.partner_map_requests;

CREATE POLICY "Users can view own partner requests" ON public.partner_map_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own partner requests" ON public.partner_map_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins have full access to partner requests" ON public.partner_map_requests
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

COMMENT ON TABLE public.partner_map_requests IS 'Governance table for AfDEC partner map access requests.';
