const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function run() {
  // PHASE 1: Nuclear Reset
  console.log("=== PHASE 1: NUCLEAR AUTH RESET ===");
  const { data: resetResult, error: resetError } = await supabase.rpc('nuclear_auth_reset');
  
  if (resetError) {
    console.error("Reset failed:", resetError.message);
    return;
  }
  console.log("Reset result:", JSON.stringify(resetResult, null, 2));
  console.log("");

  // PHASE 2: Verify GoTrue is unblocked
  console.log("=== PHASE 2: TESTING GOTRUE ===");
  const { data: listData, error: listError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 10 });
  
  if (listError) {
    console.error("GoTrue STILL broken:", listError.message);
    console.log("\nThe GoTrue service may need a restart. This can happen on hosted Supabase.");
    console.log("Try: Supabase Dashboard > Settings > General > Restart project");
    return;
  }
  
  console.log("GoTrue is UNBLOCKED! Current users:", listData.users.length);
  console.log("");

  // PHASE 3: Create all three test accounts
  console.log("=== PHASE 3: CREATING TEST ACCOUNTS ===");
  
  const accounts = [
    { email: 'afdecadmin@afronovation.com', role: 'super_admin', first: 'Ibrahima', last: 'Kourouma', partner: true },
    { email: 'afdecmember@afronovation.com', role: 'member', first: 'Verified', last: 'Member', partner: false },
    { email: 'afdecvisitor@afronovation.com', role: 'member', first: 'Stakeholder', last: 'Visitor', partner: false }
  ];

  for (const acct of accounts) {
    console.log(`Creating ${acct.email}...`);
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: acct.email,
      password: 'PEGWest@1235',
      email_confirm: true,
      user_metadata: {
        first_name: acct.first,
        last_name: acct.last,
        organization: 'Afronovation, Inc.'
      }
    });

    if (createError) {
      console.error(`  FAIL: ${createError.message}`);
      continue;
    }

    console.log(`  Auth user created: ${newUser.user.id}`);

    // Link profile
    const { error: profileError } = await supabase.from('profiles').upsert({
      id: newUser.user.id,
      role: acct.role,
      first_name: acct.first,
      last_name: acct.last,
      organization: 'Afronovation, Inc.',
      is_partner_approved: acct.partner
    });

    if (profileError) {
      console.error(`  Profile FAIL: ${profileError.message}`);
    } else {
      console.log(`  Profile linked as ${acct.role}`);
    }
  }
  console.log("");

  // PHASE 4: Verify sign-in
  console.log("=== PHASE 4: SIGN-IN VERIFICATION ===");
  const anonClient = createClient(supabaseUrl, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  const { data: signIn, error: signInError } = await anonClient.auth.signInWithPassword({
    email: 'afdecadmin@afronovation.com',
    password: 'PEGWest@1235'
  });

  if (signInError) {
    console.error("SIGN-IN FAILED:", signInError.message);
  } else {
    console.log("SIGN-IN SUCCESSFUL!");
    console.log("User:", signIn.user?.email);
    console.log("Session active:", !!signIn.session);
  }

  console.log("\n=== ALL DONE ===");
  console.log("Go to /auth and sign in with: afdecadmin@afronovation.com / PEGWest@1235");
}

run().catch(err => {
  console.error("FATAL:", err);
  process.exit(1);
});
