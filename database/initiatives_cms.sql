-- ====================================================================
-- AFDEC PLATFORM — DATABASE MIGRATION
-- Migration: initiatives_cms.sql
-- Goal: Unified CMS for Impact Capital and Flagship Initiatives
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.impact_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'impact_capital', -- 'impact_capital' or 'flagship_initiative'
  status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'active', 'hidden', 'archived', 'funding_closed'
  description TEXT,
  full_content TEXT,
  funding_goal NUMERIC,
  funding_raised NUMERIC DEFAULT 0,
  hero_image_url TEXT,
  location VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.impact_projects ENABLE ROW LEVEL SECURITY;

-- Public read for visible projects
CREATE POLICY "Public read active impact_projects" ON public.impact_projects 
  FOR SELECT USING (status != 'hidden');

-- Admins can manage all
CREATE POLICY "Admins manage impact_projects" ON public.impact_projects
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

-- Seed Initial Data
INSERT INTO public.impact_projects (slug, title, type, status, description, funding_goal, hero_image_url) VALUES
('agtech-corridor', 'Transatlantic Ag-Tech Corridor', 'impact_capital', 'active', 'Accelerating advanced agricultural technology transfers between North Carolina and East Africa.', 50000000, 'https://images.unsplash.com/photo-1595804595822-1d48c8b45942?q=80&w=1000&auto=format&fit=crop'),
('lithium-hub', 'NC-Africa Lithium Hub', 'impact_capital', 'active', 'Tier 1 lithium processing and battery manufacturing hub in central North Carolina.', 120000000, 'https://images.unsplash.com/photo-1565893322194-e840003b0cbe?q=80&w=1000&auto=format&fit=crop')
ON CONFLICT (slug) DO NOTHING;
