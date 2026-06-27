-- AfDEC V1.21 Admin Governance & Events Pack

-- 1. Create Business Entities Table
CREATE TABLE IF NOT EXISTS public.business_entities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    legal_name TEXT NOT NULL,
    dba_name TEXT,
    registration_country TEXT,
    registration_state TEXT,
    entity_type TEXT,
    industry TEXT,
    website TEXT,
    tax_id TEXT,
    status TEXT DEFAULT 'pending', -- pending, active, suspended
    is_verified BOOLEAN DEFAULT false,
    verification_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'system', -- system, message, alert
    priority TEXT DEFAULT 'standard', -- standard, important, urgent
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.business_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 3. Fix Profiles RLS (if it was causing issues)
-- Drop existing profiles RLS first to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Super admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- Super admins and Admins can view all profiles. We avoid infinite recursion by not querying the profiles table in the policy.
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (
        (auth.jwt() ->> 'role') = 'super_admin' OR (auth.jwt() ->> 'role') = 'admin' OR 
        auth.email() IN ('admin@afronovation.com', 'afdecadmin@afronovation.com')
    );

-- 4. Business Entities RLS
DROP POLICY IF EXISTS "Users can view own businesses" ON public.business_entities;
DROP POLICY IF EXISTS "Admins can view all businesses" ON public.business_entities;

CREATE POLICY "Users can view own businesses" ON public.business_entities
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all businesses" ON public.business_entities
    FOR ALL USING (
        (auth.jwt() ->> 'role') = 'super_admin' OR (auth.jwt() ->> 'role') = 'admin' OR 
        auth.email() IN ('admin@afronovation.com', 'afdecadmin@afronovation.com')
    );

-- 5. Notifications RLS
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admins can insert notifications" ON public.notifications;

CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can insert notifications" ON public.notifications
    FOR INSERT WITH CHECK (
        (auth.jwt() ->> 'role') = 'super_admin' OR (auth.jwt() ->> 'role') = 'admin' OR 
        auth.email() IN ('admin@afronovation.com', 'afdecadmin@afronovation.com')
    );

-- 6. Events RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read events" ON public.events;
DROP POLICY IF EXISTS "Admins can manage events" ON public.events;

CREATE POLICY "Anyone can read events" ON public.events
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage events" ON public.events
    FOR ALL USING (
        (auth.jwt() ->> 'role') = 'super_admin' OR (auth.jwt() ->> 'role') = 'admin' OR 
        auth.email() IN ('admin@afronovation.com', 'afdecadmin@afronovation.com')
    );
