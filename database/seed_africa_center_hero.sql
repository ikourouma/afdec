-- ==========================================
-- AFDEC SOVEREIGN OS: AFRICA CENTER HERO SLIDE
-- Path: database/seed_africa_center_hero.sql
-- ==========================================

INSERT INTO public.hero_slides (
  display_order, 
  type, 
  title, 
  subtitle, 
  media_1, 
  primary_cta_text, 
  primary_cta_link, 
  secondary_cta_type, 
  secondary_cta_text, 
  secondary_cta_link,
  is_active
) VALUES (
  3, 
  'single_image', 
  'The NC Africa Center Initiative.', 
  'North Carolina''s First Sovereign Gateway for Transatlantic Commerce, Innovation & Community Development.',
  'https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=2670&auto=format&fit=crop',
  'Explore The Blueprint',
  '/initiatives/africa-center',
  'button',
  'Bid for Naming Rights',
  '/contact?topic=naming-rights',
  true
);
