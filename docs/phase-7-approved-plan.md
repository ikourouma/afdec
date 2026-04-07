# AfDEC Phase 7: Public Pages & CMS Backbone — Approved Plan
> Approved: April 6, 2026

---

## CMS-First Architecture

Every public page reads content from a single `page_content` Supabase table. The Super Admin edits content through the dashboard. Zero developer intervention after deployment.

### Database Tables (LIVE in Supabase)

#### `public.page_content`
Stores all structured page content as JSONB blocks.

#### `public.country_profiles`
Stores World Bank macroeconomic data for all 54 African nations. Refreshed via one-click Super Admin action using the World Bank API.

---

## Pages to Build

### Tier 1: Core Identity

| Route | Page | Key Sections |
|-------|------|-------------|
| `/about` | Who We Are | Hero, Mission/Vision split, Board of Directors (placeholder), Committees (collapsible), Board of Advisors, Timeline, Partners |
| `/why-nc` | Why North Carolina | Hero, NC Statistics (GSAP counters), Infrastructure, Workforce, Tourism, Quality of Life, CTA |
| `/why-africa` | Why Africa | Hero, Continental Growth stats, Interactive Regional Map (react-simple-maps + World Bank API), Tourism, Trade & Investment, CTA |

### Tier 2: Programmatic Pages

| Route | Page | Key Features |
|-------|------|-------------|
| `/about/careers` | Careers & Volunteer | Dual-tab: Open Positions + Volunteer Corps. Volunteer form with primary/secondary role selection |
| `/invest` | Invest in AfDEC | Fundraising gateway. Tiered partnership cards (Community/Strategic/Institutional/Founding Circle). Investor briefing request form |
| `/annual-report` | Annual Report | Gated download (name/phone/email modal). Logged-in users bypass gate. Interactive metrics dashboard |
| `/media` | Media Relations | Press kit, recent coverage, media contact. Brand guide placeholder for future upload |

### Tier 2b: Initiative Pages (Template-Driven)

All initiatives share a single reusable template: `/initiatives/[slug]/page.tsx`

| Initiative | Slug | Notes |
|------------|------|-------|
| Grow with AfDEC | `grow` | Future micro-site on subdomain. For now, internal page |
| Africa Works | `africa-works` | Workforce development, training, jobs |
| Standing Against Poverty | `poverty` | Impact programs, partnership gateway |
| Climate & Growth | `climate` | Green infrastructure, sustainability data |
| State of Africa Business | `state-of-business` | **Members-only gated data**. Future flagship event (virtual + in-person) |
| Antitrust & Free Markets | `antitrust` | Policy advocacy, regulatory monitoring |

### Interactive Africa Map Feature

| Layer | Technology | Description |
|-------|-----------|-------------|
| Data Pipeline | World Bank API → Supabase | One-click refresh pulls latest data for all 54 nations |
| Database | `country_profiles` table | 10 indicators + AfDEC priority flags + custom notes |
| Map UI | `react-simple-maps` (D3/TopoJSON) | 4 color-coded regions, clickable countries, slide-out data panels |
| Comparison Tool | Custom component | Select 2-3 countries for side-by-side comparison |

### Key Design Decisions

1. **Volunteer Corps**: Full intake form with primary + secondary role dropdown
2. **Invest Page**: Conversion-grade fundraising engine, not informational
3. **Annual Report**: Gated behind registration modal (bypass for logged-in users)
4. **Initiative Template**: Single long-scroll + sticky dot-nav for section jumping
5. **Africa Map**: World Bank API auto-populates data, Super Admin adds AfDEC context
6. **Board Page**: Board of Directors + Committees (collapsible) + Board of Advisors
7. **Statistics**: Seeded from verified public sources (World Bank, AfDB, EDPNC, U.S. Census)

---

## Execution Sequence

```
Session 1:  Reusable PageRenderer component + page layout system
Session 2:  /about page (Board grid, Committees, Advisors, Timeline)
Session 3:  /why-nc (stat counters, tourism, infrastructure)
Session 4:  /why-africa (growth data, regional map intro)
Session 5:  /invest + /annual-report + /media + /careers (with volunteer form)
Session 6:  Initiative template + all 6 initiative pages
Session 7:  Interactive Africa Map (react-simple-maps + World Bank data pipeline)
Session 8:  Country comparison tool + region subpages
Session 9:  Super Admin CMS editor for page_content (CRUD interface)
```
