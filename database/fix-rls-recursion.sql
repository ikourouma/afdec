-- 1. Drop ALL possible policies on profiles to prevent conflicts and clear infinite loops
DROP POLICY IF EXISTS "Admins bypass ALL" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Super admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;

-- 2. Recreate the safe policies based on JWT claims (no table lookups)
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles" ON public.profiles
    FOR ALL USING (
        (auth.jwt() ->> 'role') = 'super_admin' OR (auth.jwt() ->> 'role') = 'admin' OR 
        auth.email() IN ('admin@afronovation.com', 'afdecadmin@afronovation.com', 'admin@afdecnc.org')
    );
