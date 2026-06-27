-- ─────────────────────────────────────────────────────────────────────────────
-- AfDEC Executive Roster Integration
-- ─────────────────────────────────────────────────────────────────────────────

-- 0. Ensure schema is ready
ALTER TABLE public.board_members 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS full_bio TEXT;

-- 1. Remove old mock data from the Sovereign Council tier
DELETE FROM public.board_members 
WHERE role_tier = 'council' OR role_tier IS NULL;

-- 2. Insert the official executive roster
INSERT INTO public.board_members (name, title, bio, full_bio, image_url, email, committees, is_featured, sort_order, role_tier)
VALUES
('Ibrahima Kourouma', 'President & Chairman', 'Strategic leader overseeing the AfDEC Sovereign Council and global institutional direction.', NULL, '/images/leadership/ibrahima-kourouma.png', 'ikourouma@afdecnc.org', '{Executive, Strategic Planning}', TRUE, 1, 'council'),

('Wangu Connie Bryant', 'Co-Chair & VP, Policy & Strategy', 'Directing capital allocation and high-level strategic partnerships for transatlantic growth.', NULL, '/images/leadership/connie-bryant.jpeg', 'cbryant@afdecnc.org', '{Executive, Capital & Strategies}', TRUE, 2, 'council'),

('Fanta Dorley', 'Treasurer & VP, Finances', 'Overseeing institutional financial architecture, compliance, and fund deployment across the corridor.', NULL, '/images/leadership/fanta-dorley.jpg', 'fdorley@afdecnc.org', '{Executive, Audit}', TRUE, 3, 'council'),

('Satta M. Sedi-Johnson', 'Secretary & Chief of Staffs', 'Managing global communications, sovereign relations, and institutional transparency.', NULL, '/images/leadership/sata-sedi-johnson.jpeg', 'ssedijohnson@afdecnc.org', '{Governance, Communications}', TRUE, 4, 'council'),

('Kimberly Nelson', 'VP, Partnerships', 'Driving international policy alignment and fostering sovereign-grade diplomatic partnerships.', NULL, '/images/leadership/kimberly-nelson.jpg', 'knelson@afdecnc.org', '{Executive, Policy}', FALSE, 5, 'council'),

('Dr. Emmanuel Clarke', 'VP, Investment & Capital', 'Leading the Investment & Capital division to secure and structure high-impact investment pipelines.', NULL, '/images/leadership/emmanuel-clark.png', 'eclark@afdecnc.org', '{Fund Oversight, Investment}', FALSE, 6, 'council'),

('Paul Nelson', 'VP, International Trades', 'Facilitating seamless cross-border trade operations and optimizing transatlantic supply chains.', NULL, '/images/leadership/paul-nelson.png', 'pnelson@afdecnc.org', '{Procurement, Trade Operations}', FALSE, 7, 'council');
