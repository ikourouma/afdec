# AfDEC Platform — Full Assessment & Implementation Plan
**Execution Window:** 24 Hours | **Standard:** Production-Ready, Zero Errors  
**Prepared:** May 26, 2026 | **Lead Architect:** Antigravity IDE  
**Stack:** Next.js 16.2.2 (Turbopack) · TypeScript · Tailwind CSS v4 · Supabase · GSAP

---

## PLATFORM CONTEXT

The AfDEC (African Diaspora Economic Council) platform is a sovereign institutional web portal bridging North Carolina and the African continent. It operates as:
- A **public-facing institutional website** for stakeholders, investors, and diaspora communities
- A **Command Center** (Admin Dashboard) at `/dashboard/admin` for super admins and admins
- A **Member Portal** at `/dashboard/member` for verified partners
- A **Sovereign CMS** — all visible content is managed from the admin dashboard via Supabase

**Credentials:** Super Admin = `afdecadmin@afronovation.com` | Role bypass in `app/auth/page.tsx` line 133  
**Build command:** `npm run build` — must pass 52+ pages with 0 errors after every major change  
**Key rule:** Do NOT delete or revert any existing functionality unless explicitly instructed

---

## AUDIT FINDINGS: Broken Links & Missing Pages

The following navigation items in `components/ui/header.tsx` point to **non-existent routes**:

| Navigation Link | Target | Status |
|---|---|---|
| "Government Relations" | `/corridor/partnerships` | ❌ Page does not exist |
| "Sponsorship & Tenders" | `/invest#sponsorship` | ❌ `id="sponsorship"` section does not exist |
| "Leadership & Governance Hub" | `/about/leadership` | ⚠️ Name must be simplified — remove "Hub" |
| "Staff & Committee Appointments" | `/about/leadership#executive` | ⚠️ Tab will be hidden — link must be updated |
| "The Africa Center" | Does not exist | ❌ New flagship page must be built |
| `/dashboard/admin/portfolio` | Sidebar link only | ❌ Page not built — stub needed |
| `/dashboard/admin/partner-requests` | Sidebar link only | ❌ Page not built — stub needed |
| `/dashboard/admin/events` | Sidebar link only | ❌ Page not built — stub needed |
| `/dashboard/admin/diaspora` | Sidebar link only | ❌ Page not built — stub needed |
| `/dashboard/admin/businesses` | Sidebar link only | ❌ Page not built — stub needed |

### Policy Briefs Status
- `/insights/policy` ✅ CMS-ready (reads from `v_published_articles` Supabase view with mock fallback)
- **Gap:** No admin panel to create/edit/delete policy briefs. Required: `/dashboard/admin/policy`

### Diaspora Data Terminal Status
- `/insights/data-terminal` ✅ Page exists, shows "In Development — Q3 2026"
- 4 planned data products: Diaspora Demographics, Remittance Flow Analytics, Diaspora Business Intelligence, Investment Pipeline Tracker
- No new page needed — document as Phase 5 deliverable

---

## DECISIONS ALREADY APPROVED BY USER

1. **Africa Center URL:** `/initiatives/africa-center`
2. **Naming Rights CTA:** Contact form with `?topic=naming-rights` pre-filled
3. **Invest CTA:** Primary → `/diaspora-impact-fund`, Secondary → `/invest`
4. **Stub admin pages:** Build minimal "In Development" stub pages — do not leave 404s
5. **Executive Mandate tab:** Hide using `const SHOW_EXECUTIVE_MANDATE = false` feature flag (not deleted)
6. **Hub Network:** Migrate from hardcoded to CMS-driven (Supabase tables + admin module)
7. **Policy Briefs:** Super admin managed — build `/dashboard/admin/policy` CRUD module
8. **Capital target for Africa Center:** $15 Million (includes $3M land reserve)

---

## EXECUTION ORDER

Run `npm run build` after groups 1-3, 5, and 9 to verify zero regressions.

### GROUP 1 — Critical Fixes (Do First)

#### Task 1.1 — Fix Login Redirect Bug
**File:** `app/auth/page.tsx`  
**Problem:** `setTimeout(() => router.push('/dashboard/admin'), 500)` fires but navigation does not complete — user is stuck on "Admin Clearance Verified. Booting Command Center..."  
**Fix:** 
- Remove the `setTimeout` wrapper entirely
- Call `window.location.replace('/dashboard/admin')` for super_admin/admin roles (hard redirect guarantees navigation)
- Call `router.push(redirectPath)` for member roles
- Move `setIsLoading(false)` to run only in the `catch` and `finally` blocks — NOT before the redirect fires

#### Task 1.2 — "Become a Member" Pre-select Register Tab
**File:** `app/about/page.tsx`  
**Change:** Update the "Become a Member" button from `href="/auth"` → `href="/auth?view=register"`

**File:** `app/auth/page.tsx`  
**Change:** On component mount, read `const params = new URLSearchParams(window.location.search)` and if `params.get('view') === 'register'`, call `setView('register')`

---

### GROUP 2 — Navigation Fixes

#### Task 2.1 — Fix Broken Header Links
**File:** `components/ui/header.tsx`  
**Changes:**
- Rename "Leadership & Governance Hub" → "Leadership & Governance"
- Replace "Staff & Committee Appointments" link → rename to "Board of Advisors" with `href="/about/leadership#advisor"`
- Replace `/corridor/partnerships` → `href="/contact?topic=government-relations"`
- Replace `/invest#sponsorship` → `href="/invest#sponsorship"` (after adding the anchor in Task 2.2)
- Add under "The Council" → "Impact Capital": `{ name: "The Africa Center Initiative", href: "/initiatives/africa-center" }`

#### Task 2.2 — Add Sponsorship Anchor to Invest Page
**File:** `app/invest/page.tsx`  
**Change:** Find the existing sponsorship/partnership section and add `id="sponsorship"` to its wrapper element

#### Task 2.3 — Build 5 Admin Stub Pages
Create minimal stub pages (same design standard — dark sidebar layout, "In Development" content) for:
- `app/dashboard/admin/portfolio/page.tsx` — Development Portfolio
- `app/dashboard/admin/partner-requests/page.tsx` — Partner Requests
- `app/dashboard/admin/events/page.tsx` — Event Engine
- `app/dashboard/admin/diaspora/page.tsx` — Diaspora Registry
- `app/dashboard/admin/businesses/page.tsx` — Enterprise Entities

Each stub page must include:
- The standard admin header with page title and description
- An "In Development" badge with estimated launch quarter
- A list of planned features for that module
- Consistent with the existing admin dashboard design system (zinc-950 bg, blue accents)

---

### GROUP 3 — Leadership Page Simplification

#### Task 3.1 — Hide Executive Mandate Tab
**File:** `app/about/leadership/page.tsx`  
**Changes:**
- Add at top of file: `const SHOW_EXECUTIVE_MANDATE = false;` (feature flag)
- Filter the tab array: only render `executive` tab if `SHOW_EXECUTIVE_MANDATE === true`
- Remove "Executive Mandate" from the `SECTIONS` SideNav array (line 32)
- Remove "Executive Mandate" from the `Tier` type to `'council' | 'advisor' | 'governance'` (or keep it in the type but just hide the tab render)
- The default active tier should remain `'council'`

#### Task 3.2 — Clean Up About Page Labels
**File:** `app/about/page.tsx`  
**Changes:**
- Button label line 228: "Explore the Identity Hub" → "Meet the Leadership"
- The 3 governance tier cards still link to `#council`, `#executive`, `#advisor` — remove the Executive Mandate card or rename it to "Advisory Structure" linking to `#advisor`

---

### GROUP 4 — Hub Network CMS Migration

#### Task 4.1 — Create SQL Migration
**File:** `database/sql-pack-v1.25-hub-cms.sql` (NEW)

```sql
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
```

**Action Required:** Run this SQL file in the Supabase SQL Editor after it is created in the repository.

#### Task 4.2 — Make Hub Page CMS-Driven
**File:** `app/dual-continent-business-hub/page.tsx`  
**Changes:**
- Add `useEffect` to fetch from `hub_locations`, `hub_services`, `hub_stats` Supabase tables on mount
- Use existing hardcoded `HUB_LOCATIONS`, `SERVICES`, `STATS` constants as fallback if Supabase returns empty
- Add `useState` for `hubLocations`, `services`, `stats`, `isLoading`
- Render from state instead of constants

#### Task 4.3 — Build Hub Admin Module
**File:** `app/dashboard/admin/hub/page.tsx` (NEW)  
- Three tabbed sections: Hub Locations | Services | Stats
- Each section: table/list of items with Edit, Hide/Show, Delete buttons
- "New Hub Location" slide-over form with all fields
- "New Service" slide-over form
- Update sidebar in `app/dashboard/admin/layout.tsx` — add Hub Network entry

---

### GROUP 5 — Policy Briefs Admin Module

#### Task 5.1 — Build Policy Admin Module
**File:** `app/dashboard/admin/policy/page.tsx` (NEW)  
- List all articles from `published_articles` table where `category = 'policy'`
- "+ New Policy Brief" button opens slide-over form:
  - Title, Subtitle, Excerpt, Cover Image URL, Content Type (Brief/Report/Article)
  - Tags (comma-separated → stored as array), Author Name, Author Title
  - Published At date, Allow Download toggle, Download URL, Download Label
  - Is Featured toggle, Is Published toggle
- Edit existing brief: same slide-over, pre-populated
- Delete with confirmation dialog
- Publish/Unpublish inline toggle in the list
- Update sidebar in `app/dashboard/admin/layout.tsx` — rename or add Policy Briefs entry

---

### GROUP 6 — THE AFRICA CENTER (Flagship Page)

#### Task 6.1 — Add to Initiatives Data
**File:** `lib/initiatives-data.ts`  
Add `"africa-center"` slug entry — but this page will be a **custom standalone page**, not rendered by the `[slug]` template. The slug entry in `initiatives-data.ts` is optional; the page itself is standalone.

#### Task 6.2 — Build The Africa Center Page
**File:** `app/initiatives/africa-center/page.tsx` (NEW — STANDALONE, NOT DYNAMIC TEMPLATE)

This is the platform's most important new page. It must be built to a "Fortune 5 capital campaign" standard — the same visual level as a Bezos Earth Fund or Gates Foundation initiative page.

**Full Page Structure:**

```
SECTION 1: CINEMATIC HERO
- Full-bleed background: modern architectural / city skyline + African cultural texture overlay
- Top badge: "AfDEC Flagship Infrastructure Initiative"
- H1: "The NC Africa Center"
- Subtitle: "North Carolina's First Sovereign Gateway for Transatlantic Commerce, Innovation & Community Development"
- Capital badge: "$15M Capital Initiative · Wake County, NC"
- Status badge (amber pulse): "Capital Campaign Active — 2026"
- Two primary CTAs:
  [Invest in the Vision →] → /diaspora-impact-fund
  [Bid for Naming Rights →] → /contact?topic=naming-rights
- Bottom stat bar: $12M Facility Value | 35,000 Sq Ft | 2 Strategic Floors | Month 14 Break-Even

SECTION 2: STRATEGIC IMPERATIVE (Two-column)
Left: "The Gap" — NC lacks a centralized African Center for economic development
Right: "The Opportunity" — Africa's $180B digital economy + AfCFTA + AU 6th Region positioning
Center quote: "The Western Hemisphere Anchor for the African Union's Sixth Region — The Diaspora."

SECTION 3: THE BLUEPRINT — Floor-by-Floor (Two large cards, full-width)
Card 1 (Floor 1 — "The Public Face"):
  - 17,500 Sq Ft
  - Summit & Event Hall (6th Region Amphitheater)
  - "Homecoming" Heritage Archive
  - Icon: Building2

Card 2 (Floor 2 — "The Business Engine"):
  - 17,500 Sq Ft
  - Transatlantic B2B Trade Desk (AfCFTA Navigation)
  - Startup "Soft-Landing" Incubator (40 desks)
  - Pan-African Policy Lab
  - Icon: Briefcase

SECTION 4: FINANCIAL SUSTAINABILITY — Year 1/2/3 Projections
Three side-by-side cards:
  Year 1: $585K Gross Revenue | $165K NOI | "Launch & Lease-Up Phase"
  Year 2: $910K Gross Revenue | $445K NOI | "Stabilized Operations"
  Year 3: $1.175M Gross Revenue | $665K NOI | "Peak Capacity"
  
Highlight callout: "Operational Self-Sustainability by Month 14"

Revenue breakdown table (below cards):
  | Revenue Stream | Year 1 | Year 2 | Year 3 |
  | Private Office Leases | $96K | $144K | $160K |
  | Startup Desk Memberships | $57.6K | $108K | $129.6K |
  | Corporate Partner Sponsorships | $150K | $250K | $350K |
  | Trade Desk Consulting | $120K | $210K | $290K |
  | Event Hall Allocations | $161.4K | $198K | $245.4K |
  | TOTAL GROSS | $585K | $910K | $1.175M |
  | OPEX | ($420K) | ($465K) | ($510K) |
  | NET OPERATING INCOME | $165K | $445K | $665K |

SECTION 5: CAPITAL BLUEPRINT — $15M Structure
Four-segment visual breakdown:
  32% / $4.8M — Public Appropriations & Grants (NC General Assembly + Wake County)
  28% / $4.2M — Corporate RTP Commitments & Pre-Leases
  20% / $3.0M — Philanthropy & Naming Rights Endowments
  20% / $3.0M — Land Appropriation & Contingency Reserve

SECTION 6: STRATEGIC PILLARS (4 cards)
1. Commercial Trade — Transatlantic Trade Desk for AfCFTA navigation
2. Innovation Hub — Startup Soft-Landing Suite for African tech companies
3. Policy & Research — Pan-African Policy Lab with HBCU partnerships
4. Conventions & Events — 6th Region Amphitheater for bilateral summits

SECTION 7: COMPETITIVE DIFFERENTIATION (comparison table)
4 columns: Academic Centers | Black Chambers | Cultural Havens | AfDEC (The Solution)
Rows: Focus Area | Target Audience | Key Gap

SECTION 8: SITE SELECTION — Why Wake County / RDU Corridor
3-column advantages:
  ✓ Under 10 min from RDU Airport gates
  ✓ Adjacent to Research Triangle Park spine
  ✓ Suburban zoning = capital efficiency for tech fit-out

SECTION 9: IMPLEMENTATION ROADMAP — 3 Phases
Phase 1 (Months 1-6): Mobilization — Site control + architectural concept
Phase 2 (Months 7-18): Capital Campaign — 30% anchor corporate commitments + zoning
Phase 3 (Months 19-36): Activation — Construction + university research agreements

SECTION 10: DUAL CTA — INVESTMENT & NAMING RIGHTS
Split two-column premium section:
Left (gold-accent): "Invest in the Vision" → /diaspora-impact-fund
  - "Join the capital campaign to establish North Carolina's transatlantic gateway"
  
Right (emerald-accent): "Bid for a Naming Rights"
  - Summit Hall · Heritage Archive · Policy Lab · Trade Desk (each available)
  - CTA → /contact?topic=naming-rights

SECTION 11: Newsletter + Footer
```

**Design Notes for The Africa Center page:**
- Color palette: Deep zinc-950 base, gold/amber accents (#D4AF37 equivalent), emerald highlights
- Hero background: Use a premium architectural image (search Unsplash for "modern african architecture building" or "glass office building skyline")
- Financial table: Use a styled dark table with hover states, not a plain HTML table
- The page should feel like a Goldman Sachs or Brookings Institution capital brief — authoritative, data-forward, premium

---

### GROUP 7 — Navigation & Header Final Update

#### Task 7.1 — Update Header Mega Menu (Final State)
**File:** `components/ui/header.tsx`

After all pages are built, the final mega menu must include:
- "The Africa Center Initiative" → `/initiatives/africa-center` under "Impact Capital"
- "Policy Publications & Briefs" must remain → `/insights/policy`
- Remove or fix all broken links identified in the audit

---

### GROUP 8 — Documentation Update

#### Task 8.1 — Update SOVEREIGN_SYSTEM_STATE.md
**File:** `SOVEREIGN_SYSTEM_STATE.md`  
Update to reflect current state:
- Phase 14 → Phase 15 (Platform Expansion & Africa Center Launch)
- Add Diaspora Data Terminal as Phase 5 deliverable with 4 data products listed
- Update completed milestones list
- Update "Immediate Priorities" to reflect what was done

#### Task 8.2 — Update PROJECT_OVERVIEW.md
**File:** `C:\Users\ikour\.gemini\antigravity\brain\0cfe6824-0868-4337-8f7b-616db2d25d1d\PROJECT_OVERVIEW.md`  
Update route table to include new pages (africa-center, hub admin, policy admin, 5 stub pages)

---

## VERIFICATION CHECKLIST

Before marking execution complete, verify each item:

- [ ] Login as super admin — redirect goes directly to `/dashboard/admin` without hanging
- [ ] "Become a Member" on `/about` pre-selects the Register tab on `/auth`
- [ ] No 404s — all navigation links resolve to actual pages
- [ ] `/about/leadership` — "Executive Mandate" tab is hidden
- [ ] `/about/leadership` — Title badge does not say "Hub"
- [ ] `/dual-continent-business-hub` — Content loads from Supabase (or falls back gracefully)
- [ ] `/dashboard/admin/hub` — Hub admin module functional
- [ ] `/dashboard/admin/policy` — Policy briefs CRUD functional
- [ ] `/initiatives/africa-center` — Flagship page loads with full content, both CTAs work
- [ ] "The Africa Center Initiative" appears in header mega menu
- [ ] All 5 stub admin pages load without 404
- [ ] `npm run build` — 57+ pages (new ones added), 0 TypeScript errors

---

## DATABASE ACTIONS REQUIRED FROM USER

After generating each SQL file, the following must be run in the **Supabase SQL Editor**:

1. `database/sql-pack-v1.25-hub-cms.sql` — Creates hub_locations, hub_services, hub_stats tables and seeds with current data

---

## STRICT EXECUTION RULES

1. **Do NOT modify any page not listed in this plan**
2. **Do NOT delete existing content** — only add or update as specified
3. **Run `npm run build`** after Groups 1-3, Group 5, and Group 9 (final)
4. **Follow the execution order exactly** — Groups 1 and 2 unblock all other work
5. **Every button on every admin page must be functional** — no static/placeholder states
6. **Design standard:** All new pages must match existing Fortune 5 aesthetic (zinc-950 bg, GSAP animations, premium typography)
7. **`/why-nc` and `/why-africa` must remain untouched**
