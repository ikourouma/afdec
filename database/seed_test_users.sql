-- ==============================================================================
-- AfDEC Test Users & Credentials Seeder
-- ==============================================================================
-- Run this script in the Supabase SQL Editor to instantly provision
-- the verified test personas across the platform.

-- Ensure the pgcrypto extension is active for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Insert into auth.users (Supabase Authentication Engine)
INSERT INTO auth.users (
  id, 
  instance_id, 
  email, 
  encrypted_password, 
  email_confirmed_at, 
  raw_app_meta_data, 
  raw_user_meta_data, 
  created_at, 
  updated_at, 
  role, 
  aud, 
  confirmation_token
)
VALUES 
-- Super Admin 
(uuid_generate_v4(), '00000000-0000-0000-0000-000000000000', 'admin@afdecnc.org', crypt('Password1!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"first_name": "Super", "last_name": "Admin"}', now(), now(), 'authenticated', 'authenticated', ''),

-- Super Admin Backup
(uuid_generate_v4(), '00000000-0000-0000-0000-000000000000', 'admin@afronovation.com', crypt('Password1!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"first_name": "Backup", "last_name": "Admin"}', now(), now(), 'authenticated', 'authenticated', ''),

-- Investor Account (Member Tier)
(uuid_generate_v4(), '00000000-0000-0000-0000-000000000000', 'investor@afdecnc.org', crypt('Password1!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"first_name": "Test", "last_name": "Investor"}', now(), now(), 'authenticated', 'authenticated', ''),

-- Standard Member Account
(uuid_generate_v4(), '00000000-0000-0000-0000-000000000000', 'member@afdecnc.org', crypt('Password1!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"first_name": "Standard", "last_name": "Member"}', now(), now(), 'authenticated', 'authenticated', '')
ON CONFLICT (id) DO NOTHING;


-- 2. Insert corresponding public profiles with correct RBAC roles
INSERT INTO public.profiles (id, first_name, last_name, role)
VALUES 
((SELECT id FROM auth.users WHERE email = 'admin@afdecnc.org'), 'Super', 'Admin', 'super_admin'),
((SELECT id FROM auth.users WHERE email = 'admin@afronovation.com'), 'Backup', 'Admin', 'super_admin'),
((SELECT id FROM auth.users WHERE email = 'investor@afdecnc.org'), 'Test', 'Investor', 'member'),
((SELECT id FROM auth.users WHERE email = 'member@afdecnc.org'), 'Standard', 'Member', 'member')
ON CONFLICT (id) DO UPDATE 
SET role = EXCLUDED.role, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name;


-- 3. Wire the auth identities for Supabase Session Management
INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES 
(uuid_generate_v4(), (SELECT id FROM auth.users WHERE email = 'admin@afdecnc.org'), format('{"sub":"%s","email":"%s"}', (SELECT id FROM auth.users WHERE email = 'admin@afdecnc.org')::text, 'admin@afdecnc.org')::jsonb, 'email', now(), now(), now()),
(uuid_generate_v4(), (SELECT id FROM auth.users WHERE email = 'admin@afronovation.com'), format('{"sub":"%s","email":"%s"}', (SELECT id FROM auth.users WHERE email = 'admin@afronovation.com')::text, 'admin@afronovation.com')::jsonb, 'email', now(), now(), now()),
(uuid_generate_v4(), (SELECT id FROM auth.users WHERE email = 'investor@afdecnc.org'), format('{"sub":"%s","email":"%s"}', (SELECT id FROM auth.users WHERE email = 'investor@afdecnc.org')::text, 'investor@afdecnc.org')::jsonb, 'email', now(), now(), now()),
(uuid_generate_v4(), (SELECT id FROM auth.users WHERE email = 'member@afdecnc.org'), format('{"sub":"%s","email":"%s"}', (SELECT id FROM auth.users WHERE email = 'member@afdecnc.org')::text, 'member@afdecnc.org')::jsonb, 'email', now(), now(), now())
ON CONFLICT (provider, id) DO NOTHING;
