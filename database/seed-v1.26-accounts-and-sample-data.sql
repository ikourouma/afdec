-- ====================================================================
-- AfDEC Seed v1.26  -  Account roles + sample data for every admin module
-- Run AFTER v1.26a, v1.26b and v1.27.  Idempotent: safe to re-run.
--
-- * Sample rows use example.org emails / "Sample" markers so they are easy
--   to spot.  Every one can be edited or deleted from the admin dashboard.
-- * Country figures are ROUNDED PLACEHOLDERS (data_source = 'SAMPLE ...').
--   Replace with verified IMF / World Bank / AfDB data before launch.
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. ACCOUNT ROLES  (accounts must already exist in Supabase Auth)
-- --------------------------------------------------------------------
UPDATE public.profiles p
SET role = 'super_admin'::public.user_role, status = 'active', updated_at = now()
FROM auth.users u
WHERE u.id = p.id AND lower(u.email) IN ('admin@afdecnc.org', 'admin@afronovation.com', 'afdecadmin@afronovation.com');

UPDATE public.profiles p
SET role = 'investor'::public.user_role, status = 'active', is_partner_approved = true,
    deal_room_approved = true, updated_at = now()
FROM auth.users u
WHERE u.id = p.id AND lower(u.email) = 'investor@afdecnc.org';

UPDATE public.profiles p
SET role = 'member'::public.user_role, status = 'active', is_partner_approved = true, updated_at = now()
FROM auth.users u
WHERE u.id = p.id AND lower(u.email) = 'member@afdecnc.org';

-- Which of the expected accounts are still missing from Supabase Auth?
-- (Create them in Authentication > Users > Add user, then re-run this file.)
SELECT v.email AS missing_account
FROM (VALUES ('admin@afdecnc.org'), ('admin@afronovation.com'), ('afdecadmin@afronovation.com'),
             ('investor@afdecnc.org'), ('member@afdecnc.org')) AS v(email)
WHERE NOT EXISTS (SELECT 1 FROM auth.users u WHERE lower(u.email) = v.email);

-- --------------------------------------------------------------------
-- 2. SETTINGS + ALERTS
-- --------------------------------------------------------------------
INSERT INTO public.site_settings (key, value, description) VALUES
  ('contact', '{"general_email":"info@afdecnc.org","phone":"","address":"North Carolina, USA"}', 'Public contact details'),
  ('social', '{"linkedin":"","x":"","facebook":"","instagram":"","youtube":""}', 'Social profile URLs (empty = icon hidden)'),
  ('terminal', '{"teaser_metrics":["gdp_usd","population","gdp_growth_pct","fdi_inflows_usd"]}', 'Africa Intelligence public teaser')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.global_alerts (message, link_text, link_url, priority_level, audience, is_active)
SELECT 'The Institutional Capital Board has opened Tier-1 applications for the Diaspora Impact Fund.',
       'Apply now', '/diaspora-impact-fund/apply', 'standard', 'all', true
WHERE NOT EXISTS (SELECT 1 FROM public.global_alerts WHERE audience = 'all');

INSERT INTO public.global_alerts (message, link_text, link_url, priority_level, audience, is_active)
SELECT 'Council members: the Q4 member briefing is available in your dashboard.',
       'Open dashboard', '/dashboard/member', 'standard', 'members', true
WHERE NOT EXISTS (SELECT 1 FROM public.global_alerts WHERE audience = 'members');

-- --------------------------------------------------------------------
-- 3. EVENTS / CAREERS / BUSINESSES / SPONSORS / INBOX / PRESS / NEWSLETTER
-- --------------------------------------------------------------------
INSERT INTO public.events (title, description, event_date, location, capacity, event_type, status)
SELECT * FROM (VALUES
  ('Transatlantic Trade Summit 2026', 'Two days of sessions linking North Carolina exporters with African buyers.', now() + interval '60 days', 'Raleigh, NC', 300, 'conference', 'published'),
  ('AfCFTA Market Entry Workshop', 'Hands-on briefing on tariffs, rules of origin and logistics under the AfCFTA.', now() + interval '25 days', 'Charlotte, NC (and online)', 120, 'workshop', 'published'),
  ('Diaspora Investor Roundtable', 'Closed-door roundtable for diaspora investors and fund partners.', now() + interval '90 days', 'Durham, NC', 40, 'roundtable', 'published')
) AS v(title, description, event_date, location, capacity, event_type, status)
WHERE NOT EXISTS (SELECT 1 FROM public.events e WHERE e.title = v.title);

INSERT INTO public.job_postings (title, department, location, type, description, requirements, is_active)
SELECT * FROM (VALUES
  ('Program Manager, Diaspora Impact Fund', 'Programs', 'Raleigh, NC', 'Full-Time', 'Manage grant cycles, partner reporting and impact metrics for the Fund.', E'5+ years in grants or program management\nExperience with African markets\nStrong written communication', true),
  ('Policy Research Fellow', 'Research', 'Remote', 'Contract', 'Support the production of policy briefs and market outlooks.', E'Master''s in economics, public policy or related field\nData analysis skills', true),
  ('Community Engagement Intern', 'Outreach', 'Charlotte, NC', 'Internship', 'Help grow the Diaspora Registry and run community events.', E'Enrolled in or recently completed a degree\nFluency in an African language is a plus', true)
) AS v(title, department, location, type, description, requirements, is_active)
WHERE NOT EXISTS (SELECT 1 FROM public.job_postings j WHERE j.title = v.title);

INSERT INTO public.businesses (name, sector, location, website, contact_email, description, status)
SELECT * FROM (VALUES
  ('Sample Agrilink Exports LLC', 'Agriculture', 'Greensboro, NC', 'https://example.org/agrilink', 'hello@example.org', 'Sample record: cashew and shea trade between Ghana and North Carolina.', 'active'),
  ('Sample Savanna Fintech Inc.', 'Fintech', 'Charlotte, NC', 'https://example.org/savanna', 'team@example.org', 'Sample record: cross-border payments for diaspora remittances.', 'verified'),
  ('Sample Baobab Health Partners', 'Healthcare', 'Durham, NC', 'https://example.org/baobab', 'contact@example.org', 'Sample record: medical supply distribution to East Africa.', 'pending')
) AS v(name, sector, location, website, contact_email, description, status)
WHERE NOT EXISTS (SELECT 1 FROM public.businesses b WHERE b.name = v.name);

INSERT INTO public.sponsorships (company_name, contact_name, contact_email, tier, amount, status, start_date, end_date, notes)
SELECT * FROM (VALUES
  ('Sample Corporate Partner A', 'Jordan Ellis', 'sponsor-a@example.org', 'gold', 25000, 'active', CURRENT_DATE - 30, CURRENT_DATE + 335, 'Sample record'),
  ('Sample Foundation B', 'Amina Yusuf', 'sponsor-b@example.org', 'silver', 10000, 'active', CURRENT_DATE - 10, CURRENT_DATE + 355, 'Sample record'),
  ('Sample Bank C', 'Chris Mensah', 'sponsor-c@example.org', 'platinum', 50000, 'active', CURRENT_DATE, CURRENT_DATE + 365, 'Sample record')
) AS v(company_name, contact_name, contact_email, tier, amount, status, start_date, end_date, notes)
WHERE NOT EXISTS (SELECT 1 FROM public.sponsorships s WHERE s.company_name = v.company_name);

INSERT INTO public.membership_applications (full_name, email, organization, tier, country, message, status)
SELECT * FROM (VALUES
  ('Sample Applicant One', 'applicant1@example.org', 'Sample Holdings', 'Council', 'Nigeria', 'Interested in the investor council.', 'pending'),
  ('Sample Applicant Two', 'applicant2@example.org', NULL, 'Standard', 'Ghana', 'Individual diaspora member.', 'pending'),
  ('Sample Applicant Three', 'applicant3@example.org', 'Sample Logistics', 'Partner', 'Kenya', 'Logistics partner.', 'approved')
) AS v(full_name, email, organization, tier, country, message, status)
WHERE NOT EXISTS (SELECT 1 FROM public.membership_applications m WHERE m.email = v.email);

INSERT INTO public.partner_requests (full_name, email, organization, request_type, message, status)
SELECT * FROM (VALUES
  ('Sample Partner One', 'partner1@example.org', 'Sample Chamber of Commerce', 'partnership', 'Joint trade mission proposal.', 'pending'),
  ('Sample Partner Two', 'partner2@example.org', 'Sample University', 'research', 'Data-sharing collaboration.', 'pending')
) AS v(full_name, email, organization, request_type, message, status)
WHERE NOT EXISTS (SELECT 1 FROM public.partner_requests p WHERE p.email = v.email);

INSERT INTO public.press_releases (title, date, url, source, description, is_active)
SELECT * FROM (VALUES
  ('AfDEC Announces Diaspora Impact Fund Tier-1 Applications', CURRENT_DATE - 14, 'https://example.org/press/dif-tier-1', 'AfDEC Press Office', 'Applications are now open for the first funding cycle of the Diaspora Impact Fund.', true),
  ('AfDEC and Partners Sign Transatlantic Trade MOU', CURRENT_DATE - 45, 'https://example.org/press/trade-mou', 'AfDEC Press Office', 'A memorandum of understanding to streamline NC-Africa export pathways.', true)
) AS v(title, date, url, source, description, is_active)
WHERE NOT EXISTS (SELECT 1 FROM public.press_releases r WHERE r.title = v.title);

INSERT INTO public.newsletter_subscribers (email, source, is_active)
SELECT * FROM (VALUES
  ('subscriber1@example.org', 'seed', true), ('subscriber2@example.org', 'seed', true),
  ('subscriber3@example.org', 'seed', false)
) AS v(email, source, is_active)
ON CONFLICT (email) DO NOTHING;

-- --------------------------------------------------------------------
-- 4. DIASPORA REGISTRY (sample)
-- --------------------------------------------------------------------
INSERT INTO public.diaspora_registry
  (full_name, email, country_of_origin, residence_city, residence_county, residence_state, residence_country,
   profession, sector, education_level, generation, interests, consent_at, consent_version)
SELECT * FROM (VALUES
  ('Sample Registrant A', 'reg-a@example.org', 'Ghana', 'Charlotte', 'Mecklenburg', 'NC', 'USA', 'Software Engineer', 'Technology', 'Bachelor''s', 'first', ARRAY['invest','mentor'], now(), 'v1'),
  ('Sample Registrant B', 'reg-b@example.org', 'Nigeria', 'Raleigh', 'Wake', 'NC', 'USA', 'Physician', 'Healthcare', 'Doctorate', 'first', ARRAY['trade'], now(), 'v1'),
  ('Sample Registrant C', 'reg-c@example.org', 'Kenya', 'Durham', 'Durham', 'NC', 'USA', 'Entrepreneur', 'Agriculture', 'Master''s', 'second', ARRAY['invest','volunteer'], now(), 'v1'),
  ('Sample Registrant D', 'reg-d@example.org', 'Senegal', 'Greensboro', 'Guilford', 'NC', 'USA', 'Accountant', 'Finance', 'Bachelor''s', 'first', ARRAY['mentor'], now(), 'v1')
) AS v(full_name, email, country_of_origin, residence_city, residence_county, residence_state, residence_country,
       profession, sector, education_level, generation, interests, consent_at, consent_version)
WHERE NOT EXISTS (SELECT 1 FROM public.diaspora_registry d WHERE d.email = v.email);

-- --------------------------------------------------------------------
-- 5. COUNTRY INTELLIGENCE (sample placeholders - verify before launch)
-- --------------------------------------------------------------------
INSERT INTO public.country_profiles
  (country_code, country_name, region, capital, currency, gdp_usd, gdp_growth_pct, fdi_inflows_usd, population,
   afdec_priority, data_year, data_source, data_as_of, overview)
VALUES
  ('GHA', 'Ghana', 'West Africa', 'Accra', 'GHS', 76000000000, 5.7, 1500000000, 34000000, true, 2024, 'SAMPLE - verify before publishing', CURRENT_DATE, 'Sample overview: stable democracy with deep North Carolina diaspora ties.'),
  ('NGA', 'Nigeria', 'West Africa', 'Abuja', 'NGN', 187000000000, 3.4, 1200000000, 224000000, true, 2024, 'SAMPLE - verify before publishing', CURRENT_DATE, 'Sample overview: Africa''s largest consumer market.'),
  ('KEN', 'Kenya', 'East Africa', 'Nairobi', 'KES', 108000000000, 5.0, 1000000000, 55000000, true, 2024, 'SAMPLE - verify before publishing', CURRENT_DATE, 'Sample overview: East Africa''s technology and logistics hub.'),
  ('ZAF', 'South Africa', 'Southern Africa', 'Pretoria', 'ZAR', 400000000000, 1.2, 4000000000, 62000000, false, 2024, 'SAMPLE - verify before publishing', CURRENT_DATE, NULL),
  ('EGY', 'Egypt', 'North Africa', 'Cairo', 'EGP', 347000000000, 4.1, 10000000000, 112000000, false, 2024, 'SAMPLE - verify before publishing', CURRENT_DATE, NULL),
  ('ETH', 'Ethiopia', 'East Africa', 'Addis Ababa', 'ETB', 156000000000, 7.1, 3000000000, 126000000, false, 2024, 'SAMPLE - verify before publishing', CURRENT_DATE, NULL),
  ('MAR', 'Morocco', 'North Africa', 'Rabat', 'MAD', 154000000000, 3.0, 1000000000, 37000000, false, 2024, 'SAMPLE - verify before publishing', CURRENT_DATE, NULL),
  ('CIV', 'Cote d''Ivoire', 'West Africa', 'Yamoussoukro', 'XOF', 87000000000, 6.4, 1800000000, 29000000, false, 2024, 'SAMPLE - verify before publishing', CURRENT_DATE, NULL),
  ('SEN', 'Senegal', 'West Africa', 'Dakar', 'XOF', 31000000000, 6.0, 1300000000, 18000000, true, 2024, 'SAMPLE - verify before publishing', CURRENT_DATE, NULL),
  ('RWA', 'Rwanda', 'East Africa', 'Kigali', 'RWF', 14000000000, 7.2, 400000000, 14000000, false, 2024, 'SAMPLE - verify before publishing', CURRENT_DATE, NULL),
  ('TZA', 'Tanzania', 'East Africa', 'Dodoma', 'TZS', 79000000000, 5.4, 1700000000, 67000000, false, 2024, 'SAMPLE - verify before publishing', CURRENT_DATE, NULL),
  ('DZA', 'Algeria', 'North Africa', 'Algiers', 'DZD', 264000000000, 3.2, 1000000000, 46000000, false, 2024, 'SAMPLE - verify before publishing', CURRENT_DATE, NULL)
ON CONFLICT (country_code) DO NOTHING;

INSERT INTO public.country_sectors (country_code, sector, gdp_share_pct, growth_pct, summary, sort_order)
SELECT * FROM (VALUES
  ('GHA', 'Agriculture & Agribusiness', 20.0, 4.5, 'Sample: cocoa, cashew and shea value-chain upgrading.', 1),
  ('GHA', 'Mining & Minerals', 8.0, 3.0, 'Sample: gold and emerging lithium exploration.', 2),
  ('NGA', 'Fintech & Digital Finance', 4.0, 12.0, 'Sample: payments and mobile banking.', 1),
  ('KEN', 'Technology & Logistics', 9.0, 8.0, 'Sample: Nairobi tech ecosystem and port logistics.', 1)
) AS v(country_code, sector, gdp_share_pct, growth_pct, summary, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.country_sectors s WHERE s.country_code = v.country_code AND s.sector = v.sector);

INSERT INTO public.country_opportunities (country_code, title, sector, description, stage, ticket_min_usd, ticket_max_usd, nc_link, min_tier)
SELECT * FROM (VALUES
  ('GHA', 'Cashew processing partnership', 'Agriculture', 'Sample: co-invest in a processing facility serving US specialty buyers.', 'pipeline', 500000, 2000000, 'Port of Wilmington logistics', 'member'),
  ('KEN', 'Health supply distribution hub', 'Healthcare', 'Sample: regional distribution of medical supplies.', 'pipeline', 250000, 1000000, 'Research Triangle life sciences', 'member')
) AS v(country_code, title, sector, description, stage, ticket_min_usd, ticket_max_usd, nc_link, min_tier)
WHERE NOT EXISTS (SELECT 1 FROM public.country_opportunities o WHERE o.country_code = v.country_code AND o.title = v.title);

INSERT INTO public.country_risks (country_code, category, level, title, description, mitigation, min_tier, sort_order)
SELECT * FROM (VALUES
  ('GHA', 'fx', 'medium', 'Currency volatility', 'Sample: cedi depreciation can affect returns.', 'Hedge via USD-linked structures and staged capital deployment.', 'member', 1),
  ('NGA', 'regulatory', 'medium', 'Repatriation and FX policy', 'Sample: periodic FX policy changes.', 'Use registered capital importation and local counsel.', 'member', 1),
  ('KEN', 'political', 'low', 'Election-cycle uncertainty', 'Sample: short-term activity slowdowns near elections.', 'Phase commitments around election calendar.', 'member', 1)
) AS v(country_code, category, level, title, description, mitigation, min_tier, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.country_risks r WHERE r.country_code = v.country_code AND r.title = v.title);

INSERT INTO public.country_reports (country_code, title, report_type, summary, is_ai_generated, min_tier)
SELECT * FROM (VALUES
  ('GHA', 'Ghana Country Brief (Sample)', 'country-brief', 'Sample report entry. Attach a PDF in the admin to publish.', false, 'member'),
  (NULL, 'Transatlantic Market Outlook (Sample)', 'market-outlook', 'Sample multi-country report entry.', false, 'registered')
) AS v(country_code, title, report_type, summary, is_ai_generated, min_tier)
WHERE NOT EXISTS (SELECT 1 FROM public.country_reports r WHERE r.title = v.title);

-- --------------------------------------------------------------------
-- 6. SURVEY (sample) + DEAL ROOM DOCS (sample, no files attached)
-- --------------------------------------------------------------------
INSERT INTO public.surveys (slug, title, description, status, audience)
VALUES ('diaspora-needs-2026', 'Diaspora Needs Survey 2026', 'Help us understand how AfDEC can best serve the African diaspora in North Carolina.', 'open', 'public')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.survey_questions (survey_id, position, type, prompt, required, options)
SELECT s.id, v.position, v.type, v.prompt, v.required, v.options::jsonb
FROM public.surveys s,
(VALUES
  (1, 'single', 'Which best describes you?', true, '["First-generation immigrant","Second-generation","Business owner","Student","Other"]'),
  (2, 'multi', 'Which services would help you most?', true, '["Trade and export support","Investment opportunities","Networking events","Policy advocacy","Mentorship"]'),
  (3, 'rating', 'How satisfied are you with current diaspora support in NC?', true, '[]'),
  (4, 'nps', 'How likely are you to recommend AfDEC to a friend or colleague?', false, '[]'),
  (5, 'long_text', 'What one thing should AfDEC do in the next year?', false, '[]')
) AS v(position, type, prompt, required, options)
WHERE s.slug = 'diaspora-needs-2026'
  AND NOT EXISTS (SELECT 1 FROM public.survey_questions q WHERE q.survey_id = s.id);

INSERT INTO public.deal_room_documents (title, description, category, sort_order, is_active)
SELECT * FROM (VALUES
  ('Capital Programme Overview (Sample)', 'Sample entry. Upload the real document from Admin > Deal Room.', 'overview', 1, true),
  ('Financial Model Summary (Sample)', 'Sample entry. Upload the real document from Admin > Deal Room.', 'financials', 2, true),
  ('Governance and Legal Structure (Sample)', 'Sample entry. Upload the real document from Admin > Deal Room.', 'legal', 3, true)
) AS v(title, description, category, sort_order, is_active)
WHERE NOT EXISTS (SELECT 1 FROM public.deal_room_documents d WHERE d.title = v.title);

SELECT 'seed applied' AS result;
