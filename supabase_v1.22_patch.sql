-- AfDEC V1.22 Patch
-- 1. Create missing newsletter_subscribers table
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

-- 2. Fix Infinite Recursion in Profiles RLS
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

-- 3. partner_map_requests RLS Fixes
DROP POLICY IF EXISTS "Users can view own requests" ON public.partner_map_requests;
DROP POLICY IF EXISTS "Users can insert own requests" ON public.partner_map_requests;
DROP POLICY IF EXISTS "Admins can manage all requests" ON public.partner_map_requests;

CREATE POLICY "Users can view own requests" ON public.partner_map_requests
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own requests" ON public.partner_map_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all requests" ON public.partner_map_requests
    FOR ALL USING (
        (auth.jwt() ->> 'role') = 'super_admin' OR (auth.jwt() ->> 'role') = 'admin' OR 
        auth.email() IN ('admin@afronovation.com', 'afdecadmin@afronovation.com')
    );
