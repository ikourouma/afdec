-- AfDEC Flash Alerts Schema Initialization
-- Paste this script into your Supabase SQL Editor to allow Super Admins to control global announcements via temporal dates.

-- 1. Create custom enum type for priority styling
CREATE TYPE alert_priority AS ENUM ('standard', 'urgent');

-- 2. Create the Global Alerts table
CREATE TABLE public.global_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message TEXT NOT NULL,
    link_text TEXT,
    link_url TEXT,
    priority_level alert_priority DEFAULT 'standard'::alert_priority NOT NULL,
    is_active BOOLEAN DEFAULT true, -- Master override switch
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    valid_to TIMESTAMP WITH TIME ZONE, -- Will automatically disappear when this expires
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable RLS
ALTER TABLE public.global_alerts ENABLE ROW LEVEL SECURITY;

-- 4. Public Access Policy (Only retrieve active alerts within temporal timeframe)
CREATE POLICY "Public can view active temporal alerts" ON public.global_alerts
    FOR SELECT USING (
        is_active = true AND 
        valid_from <= timezone('utc'::text, now()) AND 
        (valid_to IS NULL OR valid_to > timezone('utc'::text, now()))
    );

-- 5. Admin Access Policy (Can read/write everything)
CREATE POLICY "Admins can manage global alerts" ON public.global_alerts FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
);

-- 6. Insert a Demonstration Alert (So you can see it live right away!)
INSERT INTO public.global_alerts (message, link_text, link_url, priority_level)
VALUES (
    'The Sovereign Capital Board has officially opened Tier-1 applications for Q4 infrastructure deployments.',
    'Review Documentation',
    '/applications',
    'standard'
);
