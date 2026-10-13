# AfDEC Roles & Permissions

Single source of truth for who can do what. Enforced in **three layers** (any one of them alone is enough to stop a breach):

1. **Database (Supabase RLS)** – the real boundary. Roles are read only from `profiles.role`; users cannot edit it (profile-protection trigger) and `user_metadata` is never trusted.
2. **Server route guard** – `proxy.ts` (Next.js 16 replacement for middleware) checks the cookie session and role before a protected page is served.
3. **UI** – `lib/auth.tsx` (`useAuth`) and `lib/roles.ts` hide what a role cannot use. This is cosmetic only.

## Roles

| Role | Who | Home after sign-in |
|---|---|---|
| `super_admin` | Platform owners (`admin@afdecnc.org`, backups `admin@afronovation.com`, `afdecadmin@afronovation.com`) | `/dashboard/admin` |
| `admin` | Senior AfDEC administrators | `/dashboard/admin` |
| `staff` | AfDEC team members who run day-to-day content (limited role) | `/dashboard/admin` (reduced menu) |
| `investor` | Approved investors (`investor@afdecnc.org`) | `/dashboard/investor` |
| `member` | Members / diaspora / citizens (`member@afdecnc.org`) | `/dashboard/member` |
| `registered` | Any self-registered account, no approval yet | `/dashboard/member` |
| anonymous | Not signed in | public site |

Account `status` (`active`, `suspended`, ...) overrides role: a suspended user is signed out and treated as anonymous.

## Capability matrix

| Capability | Anon | Registered | Member | Investor | Staff | Admin | Super admin |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Public site, published news/insights/events | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Africa Intelligence map (blurred headline numbers via `v_country_teaser`) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Un-blurred headline figures & country brief (`min_tier = registered`) | ❌ | ✅ (any active signed-in account) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Brief content marked `min_tier = member` | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/insights/data-terminal` | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Request terminal access | ✅ (lead form) | ✅ | – | – | – | – | – |
| Deal Room (approved **and** NDA accepted) | ❌ | ❌ | ✅ if approved | ✅ if approved | ❌ | ✅ | ✅ |
| Admin: create/edit content (news, events, careers, businesses, media, policy, hub, hero, portfolio, briefings, diaspora, concierge, intelligence, surveys, assets, pages) | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Admin: delete content | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Admin-only modules: **Users, Settings, Sponsorships, Newsletter, Deal Room admin, Audit log** (menu hidden for staff, blocked by `proxy.ts` and RLS). Partner-request / membership *decisions* are also admin-only at the database level; staff can view them | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Change a user's role (RPC `admin_set_user_role`, justification required, audited) | ❌ | ❌ | ❌ | ❌ | ❌ | staff / investor / member / registered only | ✅ any (incl. creating admins) |

Staff are deliberately **read/write on content, never on people, money, or access**. The admin-only module list lives in `ADMIN_ONLY_PATHS` in `lib/roles.ts` and is mirrored by RLS; change both together.

## Deal Room flow (best practice implemented)

`Public teaser → request access → admin approves (RPC) → NDA click-through (RPC, timestamped) → private bucket, 60-second signed URLs → every open/view/download logged`.
Revocation: Admin → Users → profile drawer → *Revoke access* (clears `deal_room_approved`; policies deny immediately).

## Intelligence terminal tiers

- **Public/anon**: map plus blurred GDP, population, growth, FDI inflows. Numbers are never sent to the browser (served from `v_country_teaser`, which exposes no numeric columns to anon).
- **Registered (any active signed-in account)**: headline figures plus brief content marked `registered` (overview, economy, sectors, trade, and any opportunity/risk/report rows with `min_tier = registered`).
- **Member / investor / staff / admin, or a partner approved by AfDEC** (`has_member_access()`): everything marked `member` (opportunities, risk & mitigation, reports).
- **Click "Full brief"**: anon → `/access-request?country=XX`; registered → `/africa-intelligence/XX`.

## Diaspora Registry and surveys

- `/diaspora-registry` is public: anyone can register, **consent is mandatory** and recorded (`consent_at`, `consent_version`); one entry per email. Visitors cannot read any registry row; staff/admin read all; the public only sees aggregate counts (`v_diaspora_stats`).
- Surveys (`/survey/<slug>`) honour their audience (public / registered / members) through RLS; results and CSV export are staff-only (Admin → Surveys).

## Run order (Supabase SQL editor)

1. `database/sql-pack-v1.26a-roles-enum.sql` – **run alone** (enum values must commit first)
2. `database/sql-pack-v1.26b-foundation.sql`
3. `database/sql-pack-v1.27-modules.sql`
3b. `database/sql-pack-v1.28-diaspora-registry.sql` (public registry sign-up + aggregate stats view)
4. `node scripts/provision-accounts.mjs` (needs `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` in your shell) – creates missing accounts
5. `database/seed-v1.26-accounts-and-sample-data.sql` – assigns roles by email + sample data (figures marked SAMPLE)

## Operational rules

- Never put a role in `user_metadata`; never decide access from an email address in code.
- Rotate the service-role key and all demo passwords after launch (older versions of `scripts/` and `demo_credentials.md` exist in git history).
- Every role/status change goes through an RPC and writes `audit_log`.
