# AfDEC Pre-Launch Platform Audit — Results & Recommendations

Audit date: 12 Oct 2026 · Build audited: production build (`next build` + `next start`) on localhost:3001 · Branch state: working tree incl. uncommitted changes · Tooling: headless Edge over CDP, axe-core, per-element pixel-sampled contrast, Lighthouse (mobile preset), static code/headers review, 4-persona walkthrough.

Coverage: **69 routes x 2 viewports (1440 desktop, 390 mobile) = 138 page loads, 0 crashed.** 6,089 desktop + 5,150 mobile text elements measured.

> No code was changed during the audit. Everything below is a proposal for your review. Screenshots with failing text boxed in red are in this folder.

---

## 1. Executive summary

| Area | Verdict | Headline |
|---|---|---|
| **Security / access control** | BLOCKER | Admin UI renders for anonymous, visitor and member accounts (no route guard). Admin emails hard-coded. Service-role-style key + shared demo password are tracked in git. |
| **Database (Supabase)** | BLOCKER | RLS infinite recursion (42P17) returns 500 on `events`, `profiles`, `newsletter_subscribers`, `strategic_milestones`, `impact_projects`. 7 tables referenced by admin pages don't exist (404). |
| **Readability (grey on black)** | HIGH | **40% of measured text fails WCAG AA** (2,415 of 6,089 desktop; 2,205 of 5,150 mobile). ~600 per viewport are below 3:1 (effectively unreadable). Root cause is 3 Tailwind classes. |
| **Admin completeness** | HIGH | Users page is mock data with inert buttons; command-center numbers are fake; hub edit form is blank; no upload; no pages/survey modules. |
| **Public content integrity** | HIGH | Africa Center financial figures + capital structure visible; 11 dead Unsplash images; `/initiatives` breadcrumb 404; missing `africa-map-preview.png`; 297 `href="#"`. |
| **SEO** | HIGH | All 69 pages share **one** title + description; no OpenGraph, no canonical. |
| **Performance** | MEDIUM | Lighthouse mobile perf 50–65 (LCP 4–8.5 s, TBT 0.6–1.2 s). `/about/leadership` ships 6.4 MB. |
| **Responsive** | LOW | Only `/africa-intelligence` overflows sideways on mobile (103 px). Breadcrumb is the main mobile text problem. |
| **Accessibility (non-contrast)** | HIGH | 0 skip links, 104 unlabeled inputs, 63 icon buttons with no name, 2,361 text nodes under 12 px. |

---

## 2. Your 18 items — status found

| # | Your item | What the audit found |
|---|---|---|
| 1 | Mobile breadcrumb | `components/ui/breadcrumb.tsx` uses `overflow-hidden`, `text-[10px]`, `text-zinc-600` (2.5:1). Long trails clip; unreadable. Also parent segment `/initiatives` links to a **404**. |
| 2 | Remove Africa Center financial sustainability $ | `app/initiatives/africa-center/page.tsx` lines ~246-343. Confirmed present. |
| 3 | Disclose $15M? | See section 6 (advice). It appears on lines ~96, 121, 164. |
| 4 | Hide capital structure + Deal Room | Lines ~346-367 are public. A `deal-room` admin page exists; no gated member-facing Deal Room. |
| 5 | Grey text on black | Confirmed, quantified in section 4. |
| 6 | `/africa-intelligence` country → `/contact` | `components/sections/africa-map.tsx` ~1057-1066 hard-codes `/contact`. No country detail page exists. Anonymous: locked; visitor/member/admin: open (no tiering). |
| 7 | Seed sample data | Most admin lists load empty or error (RLS/missing tables), so seeding must follow the DB fix. |
| 8 | Command center full metrics | `app/dashboard/admin/page.tsx` values are static; dead links `/cms`, `/submissions`, `/agencies`, `/markets`; `profiles` query 500s. |
| 9 | Survey module + report | Does not exist. Net-new build. |
| 10 | Council-member flash banner | `components/ui/flash-banner.tsx` is hard-coded text with `href="#"`. `global_alerts` table exists but unused by it. |
| 11 | Accessibility (501(c)(4)) | See section 5. |
| 12 | Admin page management | No Pages module. Page copy is in TSX. |
| 13 | Clickable user profile | `app/dashboard/admin/users/page.tsx` renders `mockUsers`; edit/suspend/revoke buttons do nothing. |
| 14 | Upload + auto URL | No upload component anywhere; admin forms take pasted URLs. |
| 15 | Press release upload + short description | Media admin has no description field. |
| 16 | Hub edit blank | `app/dashboard/admin/hub/page.tsx` uses `defaultValue` prefills (don't update after load); `highlights.join` line ~294. |
| 17 | Self-audit of buttons/links | Done: section 7. |
| 18 | Supabase → Neon | Agreed: fix on Supabase first. `docs/neon-migration.md` to be written after approval. |

---

## 3. Security & access control (fix before anything else)

1. **Admin routes are unguarded.** Persona test (real sessions): `/dashboard/admin` and `/dashboard/admin/users` open for **anonymous, visitor and member**. Only `/dashboard`, `/dashboard/member`, `/diaspora-impact-fund/apply` redirect anonymous users, client-side. `proxy.ts` / `middleware.ts` are both disabled (`*.disabled`).
   - Fix: re-enable a `proxy.ts` (Next 16 convention) that checks the Supabase session + `profiles.role` for `/dashboard/*`; also enforce server-side via RLS (the real protection).
2. **Hard-coded admin emails** in client code decide who is admin. Replace with `profiles.role` via a `SECURITY DEFINER is_admin()`.
3. **Secrets in git**: `scripts/setup-admin.js` has a hard-coded service-role-style JWT; `demo_credentials.md` has a shared password. Both tracked in what the audit assumes is a shared repo. Rotate the Supabase keys + passwords, remove files, scrub history if the repo is or was public. *(Your action: rotate in Supabase dashboard.)*
4. **No security headers** in `next.config.mjs` (CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy, HSTS at host).
5. **Newsletter form** (`components/ui/newsletter.tsx` line 46) does `preventDefault()` only — signups are silently discarded. `impact-report.tsx` fakes a submit and links to a missing `/files/dummy-report.pdf`.
6. `/dashboard/settings` is 404 for every role (login redirect and nav may point at it).

Access matrix observed:

| Route | Anonymous | Visitor | Member | Admin |
|---|---|---|---|---|
| `/africa-intelligence` | locked | open | open | open |
| `/dashboard/member` | → /auth | open | open | open |
| `/dashboard/admin` | **open** | **open** | **open** | open |
| `/dashboard/admin/users` | **open** | **open** | **open** | open |
| `/diaspora-impact-fund/apply` | → /auth | open | open | open |
| `/insights/data-terminal` | open | open | open | open |
| `/dashboard/settings` | 404 | 404 | 404 | 404 |

---

## 4. Readability: grey on black (UI audit)

Method: for every visible text node I hid the text, sampled the real rendered background pixels behind it (handles images/gradients that axe can't judge), and computed WCAG contrast. Big/bold text uses the 3:1 threshold, else 4.5:1.

| Viewport | Elements measured | Fail AA | Under 3:1 |
|---|---|---|---|
| Desktop 1440 | 6,089 | 2,415 (40%) | 608 |
| Mobile 390 | 5,150 | 2,205 (43%) | 628 |

axe `color-contrast`: 1,852 nodes on 68 of 69 desktop pages; 1,687 on 67 mobile pages.

**Root cause — three classes account for ~90% of failures** (on `#0c0c0e`):

| Class | Ratio | Occurrences (desktop) | Verdict |
|---|---|---|---|
| `text-zinc-500` (mostly with `text-[13px]`, `[11px]`, `[10px]`, `xs`) | 4.05:1 | ~1,600 | Fails; smaller sizes worse |
| `text-zinc-600` | 2.53:1 | ~230 | Unreadable |
| `text-zinc-700` | ~1.8:1 | 15 | Invisible |
| `text-blue-500` (#1E40AF) on dark | low | 24 | Fails on dark |
| (no class — over images/gradients/overlays) | varies | 304 | Needs overlay fix per component |

**Recommendation — a 3-tier text system, applied by search/replace on the tokens, not page by page:**

| Tier | Use | Class | Contrast |
|---|---|---|---|
| Primary | headings, key numbers | `text-white` | 19:1 |
| Secondary | body copy | `text-zinc-300` | ~12:1 |
| Tertiary | captions/meta | `text-zinc-400` | 7.45:1 |

Also: nothing below 12 px (`text-[10px]`, `text-[11px]` → `text-xs`; `text-[13px]` → `text-sm`); `text-blue-500` on dark → `text-blue-300/400`. Light mode keeps current tokens.
Worst pages: `/diaspora-impact-fund` (42%), `/sovereign-incentives-grants`, `/insights/market-outlook` (46-52%), `/dual-continent-business-hub`, `/diaspora-impact-fund/projects`, `/tourism`, `/sitemap` (65-72% — mostly zinc-600 links), `/corridor/nc-africa`, `/careers`.
Samples: `diaspora-impact-fund__desktop.jpg`, `insights_market-outlook__desktop.jpg`, `dual-continent-business-hub__mobile.jpg`, `home__mobile.jpg`.

---

## 5. Accessibility beyond contrast

*(Note: I'm not giving legal advice. 501(c)(4) status doesn't exempt a public website from ADA Title III expectations; WCAG 2.1 AA is the practical standard and what plaintiffs/grants refer to. Recommend publishing a conformance statement and contact route — `/compliance/accessibility` exists, make it accurate after fixes.)*

| Finding | Count |
|---|---|
| Skip-to-content link | 0 of 69 pages |
| Inputs without label | 104 |
| Buttons without accessible name (icon-only: close, hamburger, social) | 63 on 23 pages |
| Links without name (mobile) | 39 on 37 pages |
| Select without name | 2 |
| Image without alt | 1 |
| Heading order skipped | 58 nodes on 44 pages |
| Pages missing/duplicated `<main>` | 6 |
| Scrollable regions not keyboard-focusable (mobile) | 21 on 16 pages |
| Touch targets < 24 px | 9 |
| Text < 12 px | 2,361 nodes on 44 pages |
| Reduced-motion support for GSAP | to verify/add |

---

## 6. Content & disclosure recommendations

**Africa Center financials / $15M / capital structure** (opinion, not legal/financial advice; confirm with your board and counsel):
- Remove the financial-sustainability dollar values and capital-structure block from the public page (you've decided this).
- $15M: a public *target* figure is common for capital campaigns, but disclosing it prematurely invites scrutiny of how it is governed, and a stated amount becomes a commitment benchmark. Safer pattern: public page says "Capital programme — details available to qualified partners", with a **Request Prospectus** form; the number and structure appear only inside a gated Deal Room (approved members after NDA acknowledgement). If you do want a public figure, show it as a range/"target" with a date and a one-line governance statement.
- Deal Room: gated by `profiles.role` + an `approved` flag; documents in a private Supabase bucket served with signed URLs; every view logged.

**Africa Intelligence country exploration:** replace the hard-coded `/contact` CTA with `/africa-intelligence/[country]` (profile, indicators, sectors, "Request briefing" with country pre-filled). Tiering proposal: visitor = overview; member = full indicators; admin = all. Needs your sign-off on what each tier sees.

---

## 7. Links, buttons, images, and console (self-audit)

- **297 `href="#"`** across pages (footer social ×5 on every page, flash banner, assorted CTAs). Replace with real URLs or remove.
- Broken: `/initiatives` (breadcrumb parent, 404), `/dashboard/admin/cms`, `/submissions`, `/agencies`, `/markets` (dead dashboard cards), `/files/dummy-report.pdf`, `/images/africa-map-preview.png`, `/dashboard/settings`.
- **11 Unsplash photos return errors** (hotlinked): home `1601058268499`, annual-report `1551288049`, careers `1521737703`, corridor/markets `1554224155`, media ×2 (`1492619334`, `1541872703`), news `1504711434`, sectors ×2 (`1565793979`, `1542379653`), why-africa `1516026672`, why-nc `1569344445`. Recommendation: self-host (`/public/images`) via `next/image`; also fixes the ORB errors and improves LCP.
- Project detail route calls `impact_fund_projects?slug=eq.undefined` (406) — slug param not read correctly on `/diaspora-impact-fund/projects/[slug]`.
- Supabase errors by page: see section 8.
- Console you pasted: LockManager (multiple `createClient` instances → single shared provider), GSAP `.event-card` target not found (query before render/empty events), broken Unsplash — all accounted for.

---

## 8. Database / data layer

Errors seen against live Supabase (admin pages unless noted):

| Table | Status | Where |
|---|---|---|
| `events` | 500 | public `/events`, admin events |
| `strategic_milestones` | 500 | `/about/strategic-framework` |
| `profiles` | 500 | admin overview |
| `impact_projects` | 500 | admin portfolio |
| `newsletter_subscribers` | 500 | admin newsletter |
| `managed_content` | 406 | home (banner/pulse config rows missing) |
| `diaspora_registry` | 400 | embedded `profiles!` join invalid |
| `businesses`, `job_postings`, `membership_applications`, `partner_requests`, `published_articles`, `sponsorships` | 404 (table doesn't exist) | admin pages |
| `sovereign_submissions` | request aborted | admin overview |

500s = RLS recursion from policies that sub-select `profiles` inside `profiles` (`database/master_schema.sql` 91-93, `supabase_init.sql` 90-92). `database/fix-rls-recursion-final.sql` exists but isn't applied to the live project (or is incomplete). Fix = `SECURITY DEFINER is_admin()` + rewrite policies; add missing tables/columns/buckets as one idempotent v1.26 script; then seed.

---

## 9. SEO

- One shared `<title>` and description for all 69 pages. No `og:*`, no canonical, `robots`/sitemap behaviour to confirm. Lighthouse SEO reads 100 because it only checks presence.
- Fix: `generateMetadata`/`metadata` per route (title template `%s | AfDEC`), OG image, canonical, JSON-LD `Organization` + `NonprofitOrganization`.

---

## 10. Performance (Lighthouse, mobile preset, local prod build)

| Page | Perf | A11y | Best Pr. | SEO | LCP | TBT |
|---|---|---|---|---|---|---|
| `/` | 60 | 90 | 96 | 100 | 6.0 s | 600 ms |
| `/about/leadership` | 62 | 90 | 100 | 100 | 4.1 s | 1,240 ms |
| `/corridor` | 50 | 91 | 100 | 100 | 8.5 s | 800 ms |
| `/diaspora-impact-fund` | 53 | **85** | 100 | 100 | 8.5 s | 700 ms |
| `/initiatives/africa-center` | 52 | 91 | 96 | 100 | 6.6 s | 1,120 ms |
| `/events` | 65 | 90 | 96 | 100 | 4.6 s | 750 ms |

CLS ≈ 0 and server response 10-30 ms are good. Throttled mobile numbers are pessimistic, but the pattern is real:
- Heavy: `/about/leadership` 6.4 MB (unoptimised headshots), `/corridor` 1.85 MB, `/diaspora-impact-fund/projects` 1.4 MB.
- Fixes: resize/convert leadership + hero images to WebP/AVIF via `next/image` with `sizes`; self-host Unsplash; dynamic-import GSAP/ScrollTrigger and the Africa map (≈1,000-line component); avoid blocking the main thread on first paint; lazy-load below-fold sections. Target: perf ≥ 80, LCP < 3 s.

---

## 11. Responsive

- Only `/africa-intelligence` scrolls sideways on phones (103 px).
- Earlier-noted sideways scroll from top-nav/flash-banner is not reproduced on the audited routes — re-verify after banner rewrite.
- Breadcrumb unreadable at 390 px (item 1).
- Logo lockup verified at 5 widths in the earlier test.

---

## 12. Proposed fix plan (needs your approval — nothing started)

| Phase | Scope | Why this order |
|---|---|---|
| **0 DB** | v1.26 SQL (is_admin, RLS rewrite, missing tables/cols/buckets, `managed_content` rows) + seed pack | Everything else depends on data working |
| **1 Security** | Role-guard `proxy.ts`, remove hard-coded emails, shared auth provider, password reset, `/dashboard/settings`, country page + persona gating; rotate keys (your action) | Launch blocker |
| **2 Admin** | Fix broken modules, delete everywhere, real Users drawer (suspend/revoke), upload component, press-release description, hub edit fix, real command-center metrics, flash banner from `global_alerts`, Pages module | Items 7-8, 10, 12-16 |
| **3 Survey** | Builder, public page, responses, report + CSV | Item 9 |
| **4 Public UI** | Token-level contrast fix, breadcrumb, Africa Center removal + prospectus CTA, a11y pass, overflow, self-hosted images | Items 1-5, 11 |
| **5 Links/SEO** | Remove `href="#"`, fix dead links, `/initiatives` page or breadcrumb fix, per-page metadata, sitemap | Item 17 |
| **6 Verify** | Build/lint, link crawler, screenshots at multiple widths, persona re-run, before/after contrast numbers, final report | Sign-off |
| **Doc** | `docs/neon-migration.md` | Item 18 |

Success criteria: 0 pages with AA-failing text under 3:1; ≥ 95% pass at AA; 0 console errors; 0 broken links in crawler; admin routes return redirect for non-admins; all admin modules create/edit/delete round-trip against the DB.

## 13. Decisions I need from you

1. Approve the plan (or reorder). Per `.cursorrules` I won't modify files until you type **APPROVED**.
2. $15M: gated Deal Room only, or public range?
3. Country page tiering: what do visitor vs member see?
4. Who may be admin (list of emails to seed as `role='admin'`) and whether staff have a limited role.
5. Are the 11 Unsplash replacements to be chosen by me (stock) or will you supply photos?
6. Is `/insights/data-terminal` intentionally public?
7. Confirm the leaked keys/passwords will be rotated by you.
8. Vercel GitHub integration is not building pushes — needs reconnecting by you before staging QA.
