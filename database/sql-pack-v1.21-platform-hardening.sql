-- ============================================================
-- AfDEC SQL Pack v1.21: Platform Hardening
-- Notifications, Business Registry, and RLS Policies
-- ============================================================

-- 1. Notifications table for mass messaging and alerts
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'announcement',
  priority VARCHAR(20) NOT NULL DEFAULT 'standard',
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 2. Business Entities registry
CREATE TABLE IF NOT EXISTS public.business_entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  industry VARCHAR(100),
  country VARCHAR(100),
  headquarters VARCHAR(255),
  description TEXT,
  website TEXT,
  registration_number VARCHAR(100),
  status VARCHAR(50) NOT NULL DEFAULT 'pending_review',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.business_entities ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- Events
CREATE POLICY IF NOT EXISTS "Admins manage events" ON public.events
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
);
CREATE POLICY IF NOT EXISTS "Public can view events" ON public.events
FOR SELECT USING (true);

-- Event Registrations
CREATE POLICY IF NOT EXISTS "Admins manage registrations" ON public.event_registrations
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
);
CREATE POLICY IF NOT EXISTS "Anyone can register" ON public.event_registrations
FOR INSERT WITH CHECK (true);

-- Newsletter
CREATE POLICY IF NOT EXISTS "Admins manage newsletter" ON public.newsletter_subscribers
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
);
CREATE POLICY IF NOT EXISTS "Public newsletter signup" ON public.newsletter_subscribers
FOR INSERT WITH CHECK (true);

-- Notifications
CREATE POLICY IF NOT EXISTS "Users read own notifications" ON public.notifications
FOR SELECT USING (user_id = auth.uid());
CREATE POLICY IF NOT EXISTS "Users mark own notifications read" ON public.notifications
FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY IF NOT EXISTS "Admins manage notifications" ON public.notifications
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
);

-- Business Entities
CREATE POLICY IF NOT EXISTS "Public view businesses" ON public.business_entities
FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Admins manage businesses" ON public.business_entities
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
);
CREATE POLICY IF NOT EXISTS "Owners manage own business" ON public.business_entities
FOR UPDATE USING (owner_id = auth.uid());
