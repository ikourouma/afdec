-- ==========================================
-- AFDEC SOVEREIGN OS: HERO SLIDES SEED
-- Path: database/seed_hero_slides.sql
-- ==========================================

INSERT INTO hero_slides (display_order, type, title, subtitle, media_1, media_2, primary_cta_text, primary_cta_link, secondary_cta_type, secondary_cta_text, secondary_cta_link)
VALUES 
(
    1, 
    'dual_image', 
    'The Bridge Between North Carolina and Africa.', 
    'The African Diaspora Economic Council (AfDEC) drives bilateral trade, infrastructure development, and policy advocacy across the Atlantic.',
    'https://images.unsplash.com/photo-1601058268499-e52658b8ebf8?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=2000&auto=format&fit=crop',
    'Initiate Expansion',
    '/contact',
    'button',
    'Access Member Portal',
    '/dashboard/member'
),
(
    2, 
    'single_image', 
    'The Africa Innovation & Trade Summit.', 
    'Join global trade leaders, sovereign delegates, and enterprise innovators to forge the next era of transatlantic partnerships.',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2000&auto=format&fit=crop',
    NULL,
    'Secure Early Registration',
    '/events',
    'event_details',
    NULL,
    NULL
);

-- Note: For the event slide, we need to update date/location
UPDATE hero_slides 
SET event_date = 'Sept 26-27, 2026', event_location = 'Raleigh, NC'
WHERE title = 'The Africa Innovation & Trade Summit.';
