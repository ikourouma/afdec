const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function run() {
  // Step 1: Get detailed info about remaining users
  console.log("=== DEEP DIAGNOSTIC ===\n");
  
  const { data: d1, error: e1 } = await supabase.rpc('emergency_auth_repair');
  console.log("Current state:", JSON.stringify(d1, null, 2));
  console.log("");

  // Step 2: Create a function that dumps ALL user details including instance_id
  console.log("Creating deep inspection function...");
  
  // We'll use a new RPC that just dumps everything
  // But first we need the user to create it via SQL editor
  // Actually, let's try calling the existing repair function repeatedly
  // to see if more orphans appear
  
  // Step 3: Let's try a nuclear option - delete ALL users and start completely fresh
  console.log("Creating nuclear_auth_reset function...");
  console.log("Please run this SQL in your Supabase SQL Editor:\n");
  
  console.log(`
CREATE OR REPLACE FUNCTION public.nuclear_auth_reset()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  result jsonb := '{}';
  users_deleted int;
BEGIN
  -- Delete ALL profiles that reference auth users
  DELETE FROM public.profiles WHERE id IN (SELECT id FROM auth.users);
  
  -- Delete ALL identities
  DELETE FROM auth.identities;
  
  -- Delete ALL refresh tokens
  DELETE FROM auth.refresh_tokens;
  
  -- Delete ALL sessions  
  DELETE FROM auth.sessions;
  
  -- Delete ALL mfa factors
  DELETE FROM auth.mfa_factors;
  
  -- Delete ALL users
  DELETE FROM auth.users;
  GET DIAGNOSTICS users_deleted = ROW_COUNT;
  
  result := jsonb_build_object(
    'users_deleted', users_deleted,
    'status', 'CLEAN_SLATE'
  );
  
  RETURN result;
END;
$$;
  `);
}

run().catch(err => console.error("FATAL:", err));
