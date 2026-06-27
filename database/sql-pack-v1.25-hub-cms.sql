-- Hub Locations
CREATE TABLE IF NOT EXISTS public.hub_locations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  city text NOT NULL,
  country text NOT NULL,
  hub_type text NOT NULL,
  description text,
  address text,
  flag text,
  highlights text[] DEFAULT '{}',
  status text DEFAULT 'Active',
  is_visible boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  accent text DEFAULT 'blue',
  created_at timestamptz DEFAULT now()
);

-- Hub Services
CREATE TABLE IF NOT EXISTS public.hub_services (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  icon_name text NOT NULL,
  title text NOT NULL,
  description text,
  tags text[] DEFAULT '{}',
  is_visible boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Hub Stats
CREATE TABLE IF NOT EXISTS public.hub_stats (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  value text NOT NULL,
  label text NOT NULL,
  sublabel text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- RLS Policies
ALTER TABLE public.hub_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hub_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hub_stats ENABLE ROW LEVEL SECURITY;

-- Public read for visible records
CREATE POLICY "Public read hub_locations" ON public.hub_locations FOR SELECT USING (is_visible = true);
CREATE POLICY "Public read hub_services" ON public.hub_services FOR SELECT USING (is_visible = true);
CREATE POLICY "Public read hub_stats" ON public.hub_stats FOR SELECT USING (true);

-- Super admin full access (using JWT claim pattern to avoid recursion)
CREATE POLICY "Admin manage hub_locations" ON public.hub_locations FOR ALL USING (auth.jwt() ->> 'email' IN ('afdecadmin@afronovation.com', 'admin@afronovation.com'));
CREATE POLICY "Admin manage hub_services" ON public.hub_services FOR ALL USING (auth.jwt() ->> 'email' IN ('afdecadmin@afronovation.com', 'admin@afronovation.com'));
CREATE POLICY "Admin manage hub_stats" ON public.hub_stats FOR ALL USING (auth.jwt() ->> 'email' IN ('afdecadmin@afronovation.com', 'admin@afronovation.com'));

-- Seed with existing hardcoded data
INSERT INTO public.hub_locations (city, country, hub_type, description, address, flag, highlights, status, sort_order) VALUES
('Raleigh-Durham', 'North Carolina, USA', 'Headquarters Hub', 'AfDEC''s primary North Carolina hub — embedding African diaspora enterprises within the Research Triangle''s world-class innovation ecosystem.', 'Research Triangle Park, NC', '🇺🇸', ARRAY['500+ acre business campus', 'Direct CLT/RDU airport access', 'Duke, NC State, UNC proximity', '30-day desk-to-office onboarding'], 'Active', 1),
('Charlotte', 'North Carolina, USA', 'Financial Hub', 'Charlotte — the U.S.''s second-largest banking center — anchors AfDEC''s financial services and trade finance operations.', 'Uptown Charlotte, NC', '🇺🇸', ARRAY['Bank of America HQ city', 'Truist Financial operations', 'Charlotte Douglas International (6th busiest US)', 'Cross-border trade finance desk'], 'Active', 2),
('Nairobi', 'Kenya, East Africa', 'East Africa Hub', 'The Silicon Savannah. AfDEC''s East Africa anchor in the continent''s most dynamic startup and fintech ecosystem.', 'Westlands Business District, Nairobi', '🇰🇪', ARRAY['Silicon Savannah access', 'M-Pesa & fintech ecosystem', 'Safaricom & Equity Bank corridor', 'Kenya Investment Authority liaison'], 'Active', 3),
('Lagos', 'Nigeria, West Africa', 'West Africa Hub', 'Africa''s financial capital. AfDEC''s West Africa hub giving NC enterprises direct access to Nigeria''s 223M-person consumer market.', 'Victoria Island, Lagos', '🇳🇬', ARRAY['Largest African consumer market', 'ECOWAS trade corridor access', 'Nollywood & entertainment industry', 'MTN Nigeria & fintech network'], 'Active', 4),
('Accra', 'Ghana, West Africa', 'Diaspora Hub', 'AfDEC''s Year of Return heritage hub. Ghana''s most stable democratic governance and deep NC diaspora ties.', 'Airport City, Accra', '🇬🇭', ARRAY['AfDEC Accra Summit host city', 'Year of Return investment portal', 'GIPC investment facilitation', 'NC-Ghana diaspora community'], 'Active', 5),
('Abidjan', 'Côte d''Ivoire, West Africa', 'Finance & Trade Hub', 'The economic capital of Francophone Africa. Gateway to WAEMU''s 130M-person common market.', 'Plateau District, Abidjan', '🇨🇮', ARRAY['WAEMU economic zone gateway', 'World''s largest cocoa market', 'Port Autonome de San-Pédro access', 'French-English bilingual services'], 'Launching 2026', 6);
