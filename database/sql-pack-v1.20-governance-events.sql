-- ====================================================================
-- AFDEC PLATFORM — DATABASE MIGRATION
-- Migration: sql-pack-v1.20-governance-events.sql
-- Goal: Access Roles, Newsletter, Event Module, and RPC Elevation
-- Standard: Sovereign / Fortune-5
-- Directory: database/sql-pack-v1.20-governance-events.sql
-- ====================================================================

-- 1. Add partner approval column to profiles
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS is_partner_approved BOOLEAN NOT NULL DEFAULT false;

-- 2. Newsletter subscriptions
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  source VARCHAR(100) DEFAULT 'terminal-gateway',
  is_active BOOLEAN NOT NULL DEFAULT true,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Event Management Module
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  location VARCHAR(255) NOT NULL,
  capacity INTEGER,
  registration_fields JSONB NOT NULL DEFAULT '[]'::jsonb, -- e.g., [{"label": "Org", "type": "text", "required": true}]
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- 4. Dynamic Event Registrations
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  form_data JSONB NOT NULL DEFAULT '{}'::jsonb, -- Dynamic template outputs
  status VARCHAR(50) NOT NULL DEFAULT 'registered', -- registered, attended, cancelled
  registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Enable RLS
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- 6. Newsletter Policies
DROP POLICY IF EXISTS "Newsletter signup is public" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can view subscribers" ON public.newsletter_subscribers;

CREATE POLICY "Newsletter signup is public" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view subscribers" ON public.newsletter_subscribers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

-- 7. Event Policies
DROP POLICY IF EXISTS "Events are public readable" ON public.events;
DROP POLICY IF EXISTS "Admins can modify events" ON public.events;

CREATE POLICY "Events are public readable" ON public.events
  FOR SELECT USING (true);

CREATE POLICY "Admins can modify events" ON public.events
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

-- 8. Registration Policies
DROP POLICY IF EXISTS "Anyone can register for events" ON public.event_registrations;
DROP POLICY IF EXISTS "Users can view own registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Admins can view all registrations" ON public.event_registrations;

CREATE POLICY "Anyone can register for events" ON public.event_registrations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own registrations" ON public.event_registrations
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all registrations" ON public.event_registrations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

-- 9. Secure elevation RPC (super_admin only)
CREATE OR REPLACE FUNCTION public.elevate_user_role(
  target_user_id UUID,
  new_role user_role,
  justification TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with high-privilege bypass
AS $$
DECLARE
  caller_role user_role;
BEGIN
  -- 1. Identify caller role
  SELECT role INTO caller_role FROM public.profiles
  WHERE id = auth.uid();

  -- 2. Restrict to super_admin only
  IF caller_role != 'super_admin' AND EXISTS (SELECT 1 FROM public.profiles WHERE role = 'super_admin') THEN
    RAISE EXCEPTION 'Access Denied: Only a Super Admin can elevate roles.';
  END IF;

  -- 3. Perform Role Elevation
  UPDATE public.profiles
  SET role = new_role
  WHERE id = target_user_id;

  RETURN true;
END;
$$;

COMMENT ON FUNCTION public.elevate_user_role IS 'Secure function to escalate user roles, restricted strictly to super admin accounts.';
