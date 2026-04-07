-- AfDEC MASTER DATABASE INITIALIZATION SCRIPT
-- Paste this entire file into the Supabase SQL Editor and click 'RUN'.

-- 1. Create custom enum types
CREATE TYPE news_status AS ENUM ('published', 'archived', 'inactive');
CREATE TYPE lead_source AS ENUM ('impact_report', 'newsletter', 'expansion_application', 'contact_form');
CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'member');
CREATE TYPE alert_priority AS ENUM ('standard', 'urgent');

-- 2. Create the Profiles table for RBAC (Role Based Access Control)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    role user_role DEFAULT 'member'::user_role NOT NULL,
    first_name TEXT,
    last_name TEXT,
    organization TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create the Hero Slides table for dynamic multi-media marketing
CREATE TABLE public.hero_slides (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT CHECK (type IN ('video', 'single_image', 'dual_image')) NOT NULL,
    media_1 TEXT NOT NULL, 
    media_2 TEXT,          
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    primary_cta_text TEXT NOT NULL,
    primary_cta_link TEXT NOT NULL,
    secondary_cta_type TEXT,
    secondary_cta_text TEXT,
    secondary_cta_link TEXT,
    event_date TEXT,
    event_location TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

-- 4. Create the Global Market Briefings (News) table
CREATE TABLE public.news_briefings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    status news_status DEFAULT 'inactive'::news_status NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    full_content TEXT,
    image_url TEXT,
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    valid_to TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.news_briefings ENABLE ROW LEVEL SECURITY;

-- 5. Create the highly secure Lead Intakes (CRM) table
CREATE TABLE public.lead_intakes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    source lead_source NOT NULL,
    first_name TEXT,
    last_name TEXT,
    email TEXT NOT NULL,
    organization TEXT,
    industry TEXT,
    raw_data JSONB, 
    status TEXT DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.lead_intakes ENABLE ROW LEVEL SECURITY;

-- 6. Create the Global Alerts table
CREATE TABLE public.global_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message TEXT NOT NULL,
    link_text TEXT,
    link_url TEXT,
    priority_level alert_priority DEFAULT 'standard'::alert_priority NOT NULL,
    is_active BOOLEAN DEFAULT true, 
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    valid_to TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.global_alerts ENABLE ROW LEVEL SECURITY;

-- 7. Basic Admin Bypass Policy Check
CREATE POLICY "Admins bypass ALL" ON public.profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
);

-- 8. FORCE YOUR SUPER ADMIN CLEARANCE (Executes last!)
INSERT INTO public.profiles (id, role, first_name, last_name, organization) 
VALUES ('ee836fba-5405-4008-8d00-d686c65c50f9', 'super_admin', 'Ibrahima', 'Kourouma', 'Afronovation')
ON CONFLICT (id) DO UPDATE SET role = 'super_admin';

-- 9. Create the Market Sentiments Telemetry table (Pulse Tracker)
CREATE TABLE public.market_sentiments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sentiment_score INTEGER CHECK (sentiment_score >= 1 AND sentiment_score <= 5) NOT NULL,
    improvement_feedback TEXT,
    page_context TEXT,
    session_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.market_sentiments ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts for feedback (No read access)
CREATE POLICY "Enable insert for anonymous users" ON public.market_sentiments FOR INSERT WITH CHECK (true);

-- 10. Create the CMS Page Content table (Phase 7)
CREATE TABLE IF NOT EXISTS public.page_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    page_slug TEXT NOT NULL UNIQUE,
    page_title TEXT NOT NULL,
    meta_description TEXT,
    hero_headline TEXT,
    hero_subheadline TEXT,
    hero_image_url TEXT,
    sections JSONB NOT NULL DEFAULT '[]',
    sidebar JSONB,
    is_published BOOLEAN DEFAULT false,
    language TEXT DEFAULT 'en',
    updated_at TIMESTAMPTZ DEFAULT now(),
    updated_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;

-- Public read for published pages
CREATE POLICY "Published pages are viewable by everyone" ON public.page_content
    FOR SELECT USING (is_published = true);

-- Admins can manage all page content
CREATE POLICY "Admins manage page content" ON public.page_content FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
);

-- 11. Create the Country Profiles table (Africa Investment Intelligence Map)
CREATE TABLE IF NOT EXISTS public.country_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    country_code TEXT NOT NULL,
    country_name TEXT NOT NULL,
    region TEXT NOT NULL,
    capital TEXT,
    currency TEXT,
    gdp_usd BIGINT,
    gdp_growth_pct DECIMAL(5,2),
    fdi_inflows_usd BIGINT,
    population BIGINT,
    urban_population_pct DECIMAL(5,2),
    internet_penetration_pct DECIMAL(5,2),
    tourism_arrivals INTEGER,
    trade_pct_gdp DECIMAL(5,2),
    inflation_pct DECIMAL(5,2),
    mobile_subscriptions_per100 DECIMAL(6,2),
    afdec_priority BOOLEAN DEFAULT false,
    afdec_notes TEXT,
    data_year INTEGER,
    last_refreshed TIMESTAMPTZ DEFAULT now(),
    UNIQUE(country_code)
);

ALTER TABLE public.country_profiles ENABLE ROW LEVEL SECURITY;

-- Public read access for country data
CREATE POLICY "Country profiles are viewable by everyone" ON public.country_profiles
    FOR SELECT USING (true);

-- Admins manage country data
CREATE POLICY "Admins manage country profiles" ON public.country_profiles FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
);
