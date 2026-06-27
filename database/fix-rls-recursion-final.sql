-- ==============================================================================
-- AfDEC Platform Database Patch: Final RLS Infinite Recursion Repair
-- Path: database/fix-rls-recursion-final.sql
-- ==============================================================================
-- RUN THIS ENTIRE SCRIPT IN THE SUPABASE SQL EDITOR TO CLEAR ALL 42P17 ERRORS.
-- ==============================================================================

-- 1. Drop ALL possible conflicting or recursive policies on profiles
DROP POLICY IF EXISTS "Admins can do everything on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins bypass ALL" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Super admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;

-- Ensure RLS is enabled on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Create clean, non-recursive RLS policies (no subqueries referencing profiles)

-- Policy 2a: Users can SELECT their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- Policy 2b: Users can UPDATE their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Policy 2c: Users can INSERT their own profile during signup
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Policy 2d: Admins can do everything on all profiles based on JWT metadata/email (no table lookups)
CREATE POLICY "Admins can manage all profiles" ON public.profiles
    FOR ALL USING (
        (auth.jwt() ->> 'role') = 'super_admin' OR 
        (auth.jwt() ->> 'role') = 'admin' OR 
        auth.email() IN ('admin@afronovation.com', 'afdecadmin@afronovation.com', 'admin@afdecnc.org')
    );
