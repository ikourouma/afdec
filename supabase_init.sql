-- AfDEC Fortune-5 Platform Schema Initialization
-- Paste this entire file into the Supabase SQL Editor and click 'RUN'.

-- 1. Create custom enum types for statuses
CREATE TYPE news_status AS ENUM ('published', 'archived', 'inactive');
CREATE TYPE lead_source AS ENUM ('impact_report', 'newsletter', 'expansion_application', 'contact_form');
CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'member');

-- 2. Create the Profiles table for RBAC (Role Based Access Control)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    role user_role DEFAULT 'member'::user_role NOT NULL,
    first_name TEXT,
    last_name TEXT,
    organization TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Security: Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create the Hero Slides table for dynamic multi-media marketing
CREATE TABLE public.hero_slides (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT CHECK (type IN ('video', 'single_image', 'dual_image')) NOT NULL,
    media_1 TEXT NOT NULL, -- Primary background or Left Image depending on type
    media_2 TEXT,          -- Used only for Right Image in 'dual_image'
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    primary_cta_text TEXT NOT NULL,
    primary_cta_link TEXT NOT NULL,
    secondary_cta_text TEXT,
    secondary_cta_link TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active slides
CREATE POLICY "Public can view active slides" ON public.hero_slides
    FOR SELECT USING (is_active = true);

-- 4. Create the Global Market Briefings (News) table
CREATE TABLE public.news_briefings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    status news_status DEFAULT 'inactive'::news_status NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    full_content TEXT,
    image_url TEXT,
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    valid_to TIMESTAMP WITH TIME ZONE, -- If null, it never auto-archives
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.news_briefings ENABLE ROW LEVEL SECURITY;

-- Allow public read access only if published and within valid temporal window
CREATE POLICY "Public can view published and valid briefings" ON public.news_briefings
    FOR SELECT USING (
        status = 'published' AND 
        valid_from <= timezone('utc'::text, now()) AND 
        (valid_to IS NULL OR valid_to > timezone('utc'::text, now()))
    );

-- 5. Create the highly secure Lead Intakes (CRM) table
CREATE TABLE public.lead_intakes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    source lead_source NOT NULL,
    first_name TEXT,
    last_name TEXT,
    email TEXT NOT NULL,
    organization TEXT,
    industry TEXT,
    raw_data JSONB, -- Flexible payload for complex multi-step expansion forms
    status TEXT DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.lead_intakes ENABLE ROW LEVEL SECURITY;

-- Public can INSERT leads (submit forms), but can NEVER read them
CREATE POLICY "Public can submit leads" ON public.lead_intakes
    FOR INSERT WITH CHECK (true);

-- 6. Basic Admin Bypass Policy Check (Generic implementation for all tables)
-- In a production environment, you write explicit policies allowing Admins to read/write all rows.
CREATE POLICY "Admins can do everything on profiles" ON public.profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
);

CREATE POLICY "Admins can do everything on hero_slides" ON public.hero_slides FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
);

CREATE POLICY "Admins can do everything on news_briefings" ON public.news_briefings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
);

CREATE POLICY "Admins can view lead intakes" ON public.lead_intakes FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
);
