-- Table: diaspora_registry
CREATE TABLE IF NOT EXISTS public.diaspora_registry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    country_of_origin TEXT NOT NULL,
    residence_city TEXT NOT NULL,
    residence_county TEXT,
    residence_state TEXT NOT NULL,
    residence_country TEXT NOT NULL,
    profession TEXT NOT NULL,
    sector TEXT,
    education_level TEXT NOT NULL,
    family_size INTEGER DEFAULT 1,
    family_registry_details TEXT
);

-- RLS Policies
ALTER TABLE public.diaspora_registry ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own diaspora registry"
ON public.diaspora_registry
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own diaspora registry"
ON public.diaspora_registry
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own diaspora registry"
ON public.diaspora_registry
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Super admin can read all diaspora registries"
ON public.diaspora_registry
FOR SELECT
TO authenticated
USING (
    (auth.jwt() ->> 'email') = 'afdecadmin@afronovation.com' OR 
    (auth.jwt() ->> 'email') = 'admin@afronovation.com' OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin'
);
