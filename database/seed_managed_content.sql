-- ==========================================
-- AFDEC SOVEREIGN OS: MANAGED CONTENT SEED
-- Path: database/seed_managed_content.sql
-- ==========================================

-- Seed Member Dashboard Navigation Cards
INSERT INTO managed_content (slug, page_path, section_name, content)
VALUES 
(
    'member_dashboard_cards', 
    '/dashboard/member', 
    'Navigation Portal', 
    '[
        {
            "id": "expansion",
            "title": "Enterprise Expansion",
            "description": "Track the status of your organization''s deployment applications and physical infrastructure requests.",
            "href": "/dashboard/member/expansion",
            "icon": "Building2",
            "color": "blue"
        },
        {
            "id": "briefings",
            "title": "AfDEC Market Briefings",
            "description": "Read strategic market analyses, policy changes, and Q4 infrastructure forecasts drafted by the Board.",
            "href": "/news",
            "icon": "FileText",
            "color": "emerald"
        },
        {
            "id": "concierge",
            "title": "AfDEC Secure Concierge",
            "description": "Direct encrypted communication link. Submit strategic inquiries, compliance files, or schedule advisory sessions.",
            "href": "/dashboard/member/concierge",
            "icon": "Globe2",
            "color": "purple"
        },
        {
            "id": "registry",
            "title": "Business Registry",
            "description": "Manage your registered sovereign entity status, compliance documents, and institutional profiles.",
            "href": "/dashboard/member/registry",
            "icon": "ShieldCheck",
            "color": "amber"
        }
    ]'::jsonb
)
ON CONFLICT (slug) DO UPDATE 
SET content = EXCLUDED.content, updated_at = NOW();

-- Seed Homepage Hero Managed Data
INSERT INTO managed_content (slug, page_path, section_name, content)
VALUES 
(
    'home_hero_managed', 
    '/', 
    'Hero Section', 
    '{
        "title": "The Strategic Framework for African Economic Sovereignty",
        "subtitle": "Mobilizing the Global African Diaspora to build the infrastructure of the future.",
        "cta_primary": { "text": "Explore Active Corridors", "href": "/corridor" },
        "cta_secondary": { "text": "Diaspora Fund", "href": "/diaspora-impact-fund" }
    }'::jsonb
)
ON CONFLICT (slug) DO UPDATE 
SET content = EXCLUDED.content, updated_at = NOW();

-- Seed Map Top 10 Economies (Board Controlled)
INSERT INTO managed_content (slug, page_path, section_name, content)
VALUES 
(
    'map_top_economies', 
    '/', 
    'Intelligence Map', 
    '[
        { "rank": 1,  "iso3": "ZAF", "name": "South Africa",   "gdp": "$443.64B", "gdp_growth": "+1.2%",  "region": "south" },
        { "rank": 2,  "iso3": "EGY", "name": "Egypt",           "gdp": "$399.51B", "gdp_growth": "+4.1%",  "region": "north" },
        { "rank": 3,  "iso3": "NGA", "name": "Nigeria",         "gdp": "$334.34B", "gdp_growth": "+3.4%",  "region": "west"  },
        { "rank": 4,  "iso3": "DZA", "name": "Algeria",         "gdp": "$284.98B", "gdp_growth": "+3.2%",  "region": "north" },
        { "rank": 5,  "iso3": "MAR", "name": "Morocco",         "gdp": "$196.12B", "gdp_growth": "+3.0%",  "region": "north" },
        { "rank": 6,  "iso3": "KEN", "name": "Kenya",           "gdp": "$140.87B", "gdp_growth": "+5.0%",  "region": "east"  },
        { "rank": 7,  "iso3": "ETH", "name": "Ethiopia",        "gdp": "$125.74B", "gdp_growth": "+7.1%",  "region": "east"  },
        { "rank": 8,  "iso3": "GHA", "name": "Ghana",           "gdp": "$113.49B", "gdp_growth": "+3.8%",  "region": "west"  },
        { "rank": 9,  "iso3": "CIV", "name": "Côte d''Ivoire",  "gdp": "$111.45B", "gdp_growth": "+6.4%",  "region": "west"  },
        { "rank": 10, "iso3": "AGO", "name": "Angola",          "gdp": "$109.86B", "gdp_growth": "+3.6%",  "region": "south" }
    ]'::jsonb
)
ON CONFLICT (slug) DO UPDATE 
SET content = EXCLUDED.content, updated_at = NOW();
