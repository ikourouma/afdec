-- Add category column to news_briefings if it doesn't exist
ALTER TABLE public.news_briefings 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Press Release';

-- Seed initial market briefings
INSERT INTO public.news_briefings (status, category, title, excerpt, full_content, image_url, valid_from)
VALUES
('published', 'Press Release', 'AfDEC Announces $50M Transatlantic Ag-Tech Fund', 'The Council today finalized the deployment of a $50 million sovereign-backed fund to accelerate advanced agricultural technology transfers between North Carolina and the East African tech corridor.', NULL, 'https://images.unsplash.com/photo-1595804595822-1d48c8b45942?q=80&w=1000&auto=format&fit=crop', '2026-10-12 00:00:00+00'),

('published', 'Press Release', 'North Carolina Megasite Selected for Continent-Level Battery Manufacturing', 'A major African EV conglomerate has partnered with AfDEC to establish a Tier 1 lithium processing and battery manufacturing hub in central North Carolina, creating 3,000 projected high-yield jobs.', NULL, 'https://images.unsplash.com/photo-1565893322194-e840003b0cbe?q=80&w=1000&auto=format&fit=crop', '2026-09-28 00:00:00+00'),

('published', 'Press Release', 'AfDEC Hosted Sovereign Delegation Secures Fintech Corridor', 'Following a three-day summit in Raleigh, trade ministers from four West African nations signed the Fintech Corridor Agreement, drastically reducing cross-border banking friction for diaspora-led enterprises.', NULL, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop', '2026-09-04 00:00:00+00'),

('published', 'Macro Intelligence', 'Q4 Continental Infrastructure Forecast', 'Analysis of the $1.2B direct investment inflows targeting the West African agritech and logistics corridors, heavily anchored by North Carolina 501(c)(4) deployment strategies.', NULL, 'https://images.unsplash.com/photo-1590487988256-9ed24133863e?q=80&w=1000&auto=format&fit=crop', '2026-11-14 00:00:00+00'),

('published', 'Policy Framework', 'Sovereign Debt Repositioning Strategies', 'Examining the impact of the latest bilateral tariff adjustments and their effect on US-Africa enterprise scalability through Q2 2027.', NULL, 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?q=80&w=1000&auto=format&fit=crop', '2026-10-22 00:00:00+00');
