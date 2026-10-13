# Supabase -> Neon migration (to-do, not started)

**Decision (from the project owner):** keep fixing and launching on Supabase first. Migrate to Neon later, one
component at a time. Nothing in this document needs to be done before launch.

Keep this file updated as the Supabase footprint changes (see "Rules to keep migration cheap").

## 1. What AfDEC uses from Supabase today

| Capability | Where it is used | Migration impact |
|---|---|---|
| **Postgres** (tables, views, enums, triggers) | `database/*.sql`, every `supabase.from(...)` call | Low. Plain Postgres; dump and restore. |
| **Row Level Security** policies and `SECURITY DEFINER` helpers (`is_admin()`, `is_registered()`, `has_member_access()` ...) | `database/sql-pack-v1.26b-foundation.sql`, `v1.27` | Medium. Policies call `auth.uid()` / `auth.jwt()`, which Supabase provides. |
| **Auth** (email/password, sessions via `@supabase/ssr` cookies, `auth.users`) | `lib/auth.tsx`, `proxy.ts`, `app/auth`, `scripts/provision-accounts.mjs` | **High.** Users, password hashes and sessions live in `auth.users`. |
| **PostgREST API** via `supabase-js` (browser + server) | `lib/supabase.ts`, ~all pages | **High** (volume). Every page queries tables directly from the browser. |
| **RPC** functions (`admin_set_user_role`, `admin_list_users`, `accept_deal_room_nda`, ...) | admin Users, Deal Room | Medium. Move with the database; callers must reach them somehow. |
| **Storage** buckets: `site-assets` (public), `deal-room` (private, 60 s signed URLs) | `lib/assets.ts`, Asset Library, Deal Room | Medium. Files must be copied; signed-URL logic re-implemented. |
| **Realtime** | not used | None. |
| **Edge Functions** | not used | None. |

Environment variables involved: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
(scripts only; never ship to the browser).

## 2. Recommended order (each step is independently shippable)

1. **Inventory and freeze.** Export the schema (`pg_dump --schema-only`) and a data dump. Record row counts per table.
   Confirm every SQL pack in `database/` has been applied, so the dump is the single source of truth.
2. **Database first, auth unchanged.** Restore the schema and data into a Neon branch. Run the app against Neon only for
   *read-only* checks in a preview deployment. Policies that reference `auth.uid()` will fail until step 4 - expected.
3. **Decide the API layer** (see section 3). This is the biggest architectural choice.
4. **Move authentication.** Pick the replacement, import users, and rewrite `lib/auth.tsx` + `proxy.ts`.
5. **Move storage.** Copy buckets, update `lib/assets.ts` and the Deal Room signed-URL path.
6. **Cut over** during a quiet window: freeze writes, final dump/restore, flip env vars, smoke test with the persona
   accounts, keep Supabase read-only for one week as a rollback.
7. **Decommission** Supabase only after the rollback window and a verified backup.

## 3. Open decisions (need an owner answer before step 3)

1. **API layer.** Options: (a) a PostgREST-compatible data API if Neon's offering fits our RLS model; (b) move queries
   into Next.js server actions / route handlers using `@neondatabase/serverless` and authorise in code *and* in RLS.
   Option (b) is safer long-term (nothing queries tables from the browser) but is the largest rewrite.
2. **Auth provider.** Options: Neon's built-in auth, Auth.js, Clerk, or keep Supabase Auth only. Password hashes may not
   be portable between providers: plan for a forced password reset (the passwords are being rotated after launch anyway).
3. **Storage provider.** Neon is a database; confirm whether to use its storage offering or an S3-compatible bucket
   (Cloudflare R2, S3, Vercel Blob). The Deal Room needs private objects and short-lived signed URLs.
4. **Cost and region.** Compare against current Supabase usage; keep the database in the same region as Vercel functions.

> Verify current Neon capabilities against its documentation at decision time; this file intentionally does not
> assume any feature that has not been checked.

## 4. Technical work list

### Database
- [ ] Replace references to the `auth` schema: `profiles.id` is currently a foreign key to `auth.users(id)`.
- [ ] Re-create `auth.uid()` / `auth.jwt()` equivalents if RLS is kept (for example, set
      `request.jwt.claims` per connection/transaction and define `auth.uid()` from it).
- [ ] Re-create roles referenced in `GRANT ... TO anon, authenticated` or map them to Neon roles.
- [ ] Re-check every `SECURITY DEFINER` function's `search_path` after the move.
- [ ] Re-run `database/tests` (or the RLS test script used in v1.26) against Neon.
- [ ] Re-create the `handle_new_user` style trigger on whatever replaces `auth.users`.

### Application
- [ ] Replace `lib/supabase.ts` (browser client + global DB error reporter) with the new data client; keep the
      `DB_ERROR_EVENT` toast contract so the admin error surfacing keeps working.
- [ ] Rewrite `lib/auth.tsx` (`AuthProvider`, `useAuth`) - the rest of the app only depends on its shape.
- [ ] Rewrite `proxy.ts` session check; the role guard logic itself is reusable.
- [ ] Replace `scripts/provision-accounts.mjs` (uses the service-role key and the Supabase Auth admin API).
- [ ] Update `lib/page-meta.ts`, which calls the REST endpoint directly.
- [ ] Update `lib/assets.ts` and the Asset Library for the new storage provider.

### Data
- [ ] Migrate `auth.users` (ids must be preserved so `profiles`, `diaspora_registry.user_id`, `audit_log` stay valid).
- [ ] Copy storage objects and rewrite stored URLs (`assets.url`, `hero_image_url`, `logo_url`, `file_url`, ...).
- [ ] Verify row counts and checksums per table; compare `audit_log` totals.

### Security
- [ ] Rotate all secrets after cut-over (database URL, auth secrets, storage keys).
- [ ] Re-run the persona matrix in `docs/ROLES-AND-PERMISSIONS.md` against the new stack.
- [ ] Confirm anonymous users still cannot read `country_profiles`, `deal_room_*`, `diaspora_registry`.

## 5. Rules to keep migration cheap (apply to all new work)

1. Put new database access behind small functions rather than scattering `supabase.from()` calls in components.
2. Do not add Supabase-only features (Realtime, Edge Functions, Vault, pg_graphql) without recording them here.
3. Keep authorisation in SQL (RLS / RPC), not only in the UI, so it survives a change of API layer.
4. Never store absolute Supabase storage URLs in content you cannot bulk-rewrite; prefer the Asset Library.
5. Keep every schema change in `database/*.sql` packs so a clean database can always be rebuilt.

## 6. Rollback plan

Until decommission, Supabase remains the system of record. If a defect is found after cut-over: switch the env vars
back, re-point DNS/Vercel to the previous deployment, and replay any writes made on Neon (the `audit_log` and
`created_at` timestamps identify them).
