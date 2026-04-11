-- ==========================================
-- AFDEC SOVEREIGN OS: PHASE 14 SCHEMA
-- Path: database/phase_14_schema.sql
-- ==========================================

-- 1. ENUM DEFINITIONS (CORE ROLES & STATUS)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'member', 'investigator', 'visitor');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'node_status') THEN
        CREATE TYPE node_status AS ENUM ('active', 'pending', 'archived', 'emergency');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'submission_type') THEN
        CREATE TYPE submission_type AS ENUM ('event', 'grant_application', 'partner_vetting', 'diaspora_registry', 'inquiry');
    END IF;
END $$;

-- 2. PROFILE EXPANSION (Sovereign Identity)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'member',
ADD COLUMN IF NOT EXISTS institutional_tier TEXT DEFAULT 'general',
ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS profile_image_url TEXT;

-- 3. SOVEREIGN CMS (The "Everything-Managed" Engine)
-- This table stores content for any card, section, or component identified by a slug
CREATE TABLE IF NOT EXISTS managed_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL, -- e.g., 'home_hero', 'about_pillars_card_1'
    page_path TEXT NOT NULL,   -- e.g., '/', '/about'
    section_name TEXT,         -- e.g., 'Market Briefings'
    content JSONB NOT NULL,    -- Stores { title, description, image_url, button_text, etc. }
    is_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES profiles(id)
);

-- 4. HERO SLIDER MANAGEMENT
CREATE TABLE IF NOT EXISTS hero_slides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    display_order INTEGER DEFAULT 0,
    type TEXT DEFAULT 'single_image', -- single_image, dual_image, video
    title TEXT NOT NULL,
    subtitle TEXT,
    media_1 TEXT, -- primary image or video url
    media_2 TEXT, -- second image for dual layout
    primary_cta_text TEXT,
    primary_cta_link TEXT,
    secondary_cta_type TEXT DEFAULT 'button', -- button, event_details
    secondary_cta_text TEXT,
    secondary_cta_link TEXT,
    event_date TEXT,
    event_location TEXT,
    is_active BOOLEAN DEFAULT true,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. UNIVERSAL SUBMISSION PIPELINE (C2 Inbox)
CREATE TABLE IF NOT EXISTS sovereign_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type submission_type NOT NULL,
    user_id UUID REFERENCES profiles(id), -- Nullable for public/visitor entries
    status TEXT DEFAULT 'pending', -- pending, reviewing, approved, rejected
    data JSONB NOT NULL,           -- The actual form payload
    internal_notes TEXT,           -- Only visible to Admins
    reference_id TEXT UNIQUE,      -- Human-readable e.g., AF-EV-001
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    processed_by UUID REFERENCES profiles(id)
);

-- 6. INVESTMENT LEDGER (Sovereign Portfolio)
CREATE TABLE IF NOT EXISTS investment_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    amount DECIMAL(18,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    project_title TEXT,
    location_iso3 TEXT,
    transaction_reference TEXT UNIQUE,
    status TEXT DEFAULT 'processed', -- processed, pending, reversed
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. SAVED INSIGHTS (Member Vault)
CREATE TABLE IF NOT EXISTS saved_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    country_iso3 TEXT NOT NULL,
    country_name TEXT NOT NULL,
    note TEXT,
    saved_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, country_iso3)
);

-- 8. PLATFORM TELEMETRY (Market Intelligence Analytics)
CREATE TABLE IF NOT EXISTS platform_telemetry (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL, -- 'gdp', 'market', 'user_activity'
    label TEXT NOT NULL,
    value_current TEXT NOT NULL,
    value_target TEXT,
    trend_direction TEXT, -- 'up', 'down', 'stable'
    last_sync_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. SOVEREIGN NOTIFICATION ENGINE (Toast Gateway)
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info', -- info, success, warning, error
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. SECURITY & RLS POLICIES
ALTER TABLE managed_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE sovereign_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- PUBLIC: Read Access for Active Content
CREATE POLICY "Public Read Managed Content" ON managed_content FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Active Slides" ON hero_slides FOR SELECT USING (is_active = true AND (expires_at IS NULL OR expires_at > NOW()));
CREATE POLICY "Public Read Telemetry" ON platform_telemetry FOR SELECT TO authenticated, anon USING (true);

-- ADMIN: God Mode Access (All tables)
CREATE POLICY "Admin Full Access Content" ON managed_content TO authenticated 
USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admin Full Access Slides" ON hero_slides TO authenticated 
USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admin Full Access Submissions" ON sovereign_submissions TO authenticated 
USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admin Full Access Telemetry" ON platform_telemetry TO authenticated 
USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admin Full Access Notifications" ON notifications TO authenticated 
USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- MEMBER: Portfolio Access (Submissions, Ledger, Insights, Notifications)
CREATE POLICY "Members View Own Submissions" ON sovereign_submissions FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Members Create Submissions" ON sovereign_submissions FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Members View Own Ledger" ON investment_ledger FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Members View Own Insights" ON saved_insights FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Members Manage Own Insights" ON saved_insights FOR ALL TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Members View Own Notifications" ON notifications FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Members Update Own Notifications" ON notifications FOR UPDATE TO authenticated
USING (user_id = auth.uid());

-- 8. INITIAL SEED DATA (Standardized Fallbacks)
INSERT INTO platform_telemetry (id, category, label, value_current, trend_direction)
VALUES 
('global_gdp_impact', 'gdp', 'Investment Deployment', '$3.4B', 'up'),
('active_markets', 'market', 'Active Sovereign Corridors', '54', 'stable'),
('diaspora_registries', 'user_activity', 'Diaspora Members', '12,482', 'up')
ON CONFLICT (id) DO NOTHING;
