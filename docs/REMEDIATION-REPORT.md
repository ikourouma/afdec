# AfDEC pre-launch remediation report

Scope: the approved fix plan following the platform audit (see `docs/ui-audit/AUDIT-REPORT.md`).
Stack: Next.js 16.2.2 (Turbopack, `proxy.ts`), Tailwind v4, Supabase.

## 1. Status at a glance

| Area | Status | Notes |
|---|---|---|
| Database foundation (roles, RLS, views, RPCs, audit log) | Done in repo; **must be run in Supabase** | Packs v1.26a, v1.26b, v1.27, v1.28 + seed |
| Security (server role guard, secrets, shared auth) | Done | Roles read only from `profiles.role` |
| Admin dashboard | Done | New: Assets, Users, Audit, Settings, Pages & SEO, Country Intelligence, Surveys, Deal Room (investor) |
| Intelligence terminal tiering + country brief | Done | Numbers no longer ship in the browser bundle |
| Diaspora Registry (public page + placements) | Done | Needs v1.28 SQL |
| Survey module | Done | Needs v1.27 SQL |
| Public UI (contrast, breadcrumb, a11y, images) | Done | See section 4 |
| Links and SEO | Done | Crawler: 63 URLs, 0 errors |
| Neon migration to-do | Done | `docs/neon-migration.md` |
| Live persona run / screenshots | **Not done** | Needs the SQL packs applied to the target database first |

## 2. Verification performed

| Check | Result |
|---|---|
| `tsc --noEmit` | 0 errors |
| `next build` (production) | Passes; all routes compile, `robots.txt` and `sitemap.xml` generated |
| Internal link crawl (`scripts/crawl-links.mjs`) against the production build | 63 URLs, **0 broken**; 4 gated URLs correctly redirect anonymous visitors (307) |
| Gating (anonymous requests) | `/africa-intelligence/GHA`, `/dashboard/admin`, `/dashboard/admin/surveys`, `/deal-room`, `/insights/data-terminal`, `/diaspora-impact-fund/apply` -> redirect |
| Data leak check | Old hard-coded GDP dataset (e.g. `443.64B`, `399.51B`) is absent from `.next/static` and `.next/server` |
| Unsplash image health | 62 URLs tested, 13 broken IDs replaced with verified-working ones |
| ESLint | 171 pre-existing findings (97 `no-explicit-any`, 45 `react/no-unescaped-entities`, 24 `set-state-in-effect`, 5 other). No functional errors; not changed to keep the blast radius small. Schedule a clean-up after launch. |

## 3. What changed (by theme)

### Security
- `proxy.ts` enforces role access on `/dashboard/admin/**`, `/dashboard/**`, `/deal-room/**`, `/africa-intelligence/<country>`, `/insights/data-terminal`, `/diaspora-impact-fund/apply`. RLS is the real protection; the proxy is the first line.
- Email-based role logic removed (`/africa-intelligence` previously trusted two hard-coded emails).
- Leaked scripts/credential files removed from git tracking; `.gitignore` extended. **Secrets still exist in git history - rotate them (see section 6).**
- Staff role is limited (read/write content only; never people, money or access). Documented in `docs/ROLES-AND-PERMISSIONS.md`.

### Africa Intelligence terminal
- Anonymous visitors: map, regions, priority markets; GDP / growth / population / FDI are **blurred filler text** and the real numbers are never requested (view `v_country_teaser` has no numeric columns).
- Registered: headline figures from `country_profiles`. Members/partners: opportunities, risk & mitigation, reports (`min_tier = member`), enforced by RLS.
- "Full brief" -> anonymous: `/access-request?country=XXX`; registered: `/africa-intelligence/XXX`.
- New country brief with tabs: Overview, Economy, Sectors, Trade, Opportunities, Risk & Mitigation, Reports (AI-assisted reports supported via `is_ai_generated`).
- Admin -> Country Intelligence edits profiles, indicators, sectors, trade, opportunities, risks and reports.
- `/insights/data-terminal` is signed-in only.

### Diaspora Registry
- New public page `/diaspora-registry` with a consent-based form (consent timestamp and version stored; one entry per email; aggregate-only public counts).
- Placements: utility bar (every page, emerald highlight), homepage strip with live counts, footer "Join" link, member dashboard card, survey thank-you page.
- Admin -> Diaspora Registry already supports search, filter, export.

### Surveys
- Admin -> Surveys: builder (10 question types, reorder, required, audience: public / registered / members), results with per-question charts, NPS, averages, and CSV export.
- Public `/survey/<slug>`; audience enforced by RLS; one response per signed-in user.

### Deal Room / $15M
- All public $15M, revenue and capital-structure figures removed from the Africa Center page; CTAs now route to `/deal-room` (request access -> admin approval -> NDA -> private bucket, 60-second signed URLs, access logged).

### Public UI and accessibility
- Contrast: 747 low-contrast utility occurrences (`text-zinc-500/600/700`, `text-[9px]`, `text-[10px]`) on public pages are now **1** (remaining one is in a signed-in dashboard); all map to `zinc-400` or `text-xs` (>= 7.8:1 against the dark background for `zinc-400`).
- Breadcrumb: mobile shows only Home and the current page; parents without a page (for example `/initiatives`) render as text rather than 404 links.
- Skip-to-content link on every page; icon buttons labelled in new components; form labels bound with `htmlFor`.
- `.single()` -> `.maybeSingle()` on read queries (removes console 406 errors for missing rows).
- Fixed the `slug=undefined` / `id=undefined` bug: three detail pages (`/news/[id]`, `/events/[id]`, `/diaspora-impact-fund/projects/[slug]`) read `params` synchronously, which Next 16 no longer allows.

### Links, SEO, content
- `href="#"` replaced or removed (11 -> 0). Footer social icons now appear only when `NEXT_PUBLIC_SOCIAL_*` env vars hold real URLs. Member dashboard cards that pointed to non-existent pages are remapped to live pages.
- Per-route titles/descriptions via `pageMeta()` (overridable in Admin -> Pages & SEO); private pages are `noindex`; `robots.txt` and `sitemap.xml` added.
- Placeholder dead assets removed (`/files/dummy-report.pdf`, missing map preview image).

## 4. Before / after numbers

| Metric | Before | After |
|---|---|---|
| Low-contrast text utilities on public pages | 747 | 1 |
| `href="#"` placeholders | 11 | 0 |
| Broken Unsplash photo IDs | 13 | 0 |
| Broken internal links (crawl) | not measured (known dead: `/initiatives`, member sub-pages) | 0 of 63 |
| Hard-coded GDP dataset in client bundle | yes | no |
| Admin menu entries leading to missing pages | 2 (Intelligence, Surveys) | 0 |

## 5. Known gaps / honest limitations

1. **No live persona run or screenshots.** Playwright is not installed and the SQL packs have not yet been applied to your Supabase project, so role behaviour was verified by code review, type-check, build and anonymous-request tests only. Run the persona matrix in `docs/ROLES-AND-PERMISSIONS.md` after applying the packs.
2. **Images are still hot-linked from Unsplash** (working IDs). They have not been uploaded to the Asset Library, because that requires your Supabase storage. Recommended: upload them via Admin -> Asset Library and replace the URLs (a one-time task).
3. **Social profile URLs and real report PDFs are not in the repo.** Set `NEXT_PUBLIC_SOCIAL_LINKEDIN|FACEBOOK|INSTAGRAM|X|FLIPBOARD`; annual-report "Request Briefing" currently opens the contact form until PDFs exist.
4. The utility-bar search box is a visual placeholder (no search backend). Either implement search or remove it before launch.
5. Intelligence data in the database is **sample data** (seed rows are labelled "Sample"). Replace with sourced figures before launch; every figure shows its source and as-of date in the brief.
6. ESLint debt (section 2) is untouched.

## 6. Actions required from you (in order)

1. Supabase SQL editor: run `sql-pack-v1.26a-roles-enum.sql` **alone**, then `v1.26b`, `v1.27`, `v1.28`.
2. In a shell with `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`: `node scripts/provision-accounts.mjs` (prints one-time temporary passwords), then run `seed-v1.26-accounts-and-sample-data.sql`.
3. **Rotate** the Supabase service-role key and every demo password (they exist in git history).
4. Vercel: the project shows an old commit because the GitHub connection / commit author / ignored-build-step needs checking: Project -> Settings -> Git (repository connected, branch `main` or the staging branch), and confirm the commit author is a member of the Vercel team.
5. Add env vars in Vercel (`NEXT_PUBLIC_SITE_URL`, optional `NEXT_PUBLIC_SOCIAL_*`).
6. QA on staging with the persona accounts; sign off before merging to production.
