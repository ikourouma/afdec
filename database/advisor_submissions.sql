-- Table: advisor_submissions
CREATE TABLE IF NOT EXISTS public.advisor_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    linkedin_url TEXT,
    justification TEXT NOT NULL,
    resume_url TEXT,
    secondary_links TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'pending'
);

-- RLS Policies
ALTER TABLE public.advisor_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert for advisor_submissions"
ON public.advisor_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow super admin read for advisor_submissions"
ON public.advisor_submissions
FOR SELECT
TO authenticated
USING (
    (auth.jwt() ->> 'email') = 'afdecadmin@afronovation.com' OR 
    (auth.jwt() ->> 'email') = 'admin@afronovation.com' OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin'
);
