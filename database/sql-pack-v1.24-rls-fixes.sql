-- AfDEC V1.24 Patch: RLS & Architecture Hardening

-- 1. Fix Infinite Recursion in Profiles RLS
-- First, drop ALL existing policies on profiles to ensure a clean slate
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Super admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;

-- Create safe policies that don't query the profiles table itself
-- Policy 1: Users can always view and update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Policy 2: Admins can view/update all profiles based on JWT role or email (no table lookup)
CREATE POLICY "Admins can manage all profiles" ON public.profiles
    FOR ALL USING (
        (auth.jwt() ->> 'role') = 'super_admin' OR (auth.jwt() ->> 'role') = 'admin' OR 
        auth.email() IN ('admin@afronovation.com', 'afdecadmin@afronovation.com')
    );

-- 2. Create missing newsletter_subscribers table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    source TEXT DEFAULT 'direct',
    is_active BOOLEAN DEFAULT true,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for newsletter_subscribers
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow admins to manage newsletter_subscribers
DROP POLICY IF EXISTS "Admins can manage newsletter subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admins can manage newsletter subscribers" ON public.newsletter_subscribers
    FOR ALL USING (
        (auth.jwt() ->> 'role') = 'super_admin' OR (auth.jwt() ->> 'role') = 'admin' OR 
        auth.email() IN ('admin@afronovation.com', 'afdecadmin@afronovation.com')
    );

-- Allow public to insert (subscribe)
DROP POLICY IF EXISTS "Public can subscribe to newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Public can subscribe to newsletter" ON public.newsletter_subscribers
    FOR INSERT WITH CHECK (true);


-- 3. Create missing press_releases table
CREATE TABLE IF NOT EXISTS public.press_releases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    date DATE NOT NULL,
    url TEXT NOT NULL,
    source TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.press_releases ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage press releases" ON public.press_releases;
CREATE POLICY "Admins can manage press releases" ON public.press_releases
    FOR ALL USING (
        (auth.jwt() ->> 'role') = 'super_admin' OR (auth.jwt() ->> 'role') = 'admin' OR 
        auth.email() IN ('admin@afronovation.com', 'afdecadmin@afronovation.com')
    );
DROP POLICY IF EXISTS "Public can view active press releases" ON public.press_releases;
CREATE POLICY "Public can view active press releases" ON public.press_releases
    FOR SELECT USING (is_active = true);

