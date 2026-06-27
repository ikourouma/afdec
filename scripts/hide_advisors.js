const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE credentials in environment.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  console.log("Hiding existing advisors in Supabase...");

  const { data, error } = await supabase
    .from('board_members')
    .update({ is_active: false })
    .eq('role_tier', 'advisor');

  if (error) {
    console.error("Error hiding advisors:", error);
  } else {
    console.log("Successfully set is_active = false for all advisors.");
  }
}

run();
