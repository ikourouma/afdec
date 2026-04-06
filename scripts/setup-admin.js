
const { createClient } = require('@supabase/supabase-js');

async function setupSuperAdmin() {
  const supabaseUrl = 'https://cwktnlhjxtoylpxibkmg.supabase.co';
  const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQxNjg2NywiZXhwIjoyMDkwOTkyODY3fQ.xsuPcjNxGfodqmAmwgoih6u_saZ-klu_nnvfIdkvj-8';

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  const email = 'admin@afronovation.com';
  const password = 'PEGWest@1235';

  const { data: userAuth, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { first_name: 'Ibrahima', last_name: 'Kourouma', organization: 'Afronovation' }
  });

  if (authError && !authError.message.includes('already registered')) {
    console.error('Failed auth', authError.message);
    return;
  }

  let userId;
  if (userAuth?.user) {
    userId = userAuth.user.id;
  } else {
    const { data: listData } = await supabase.auth.admin.listUsers();
    if (listData) {
      const existing = listData.users.find(u => u.email === email);
      if (existing) userId = existing.id;
    }
  }

  if (!userId) return console.log('No user id');

  const { error: profileError } = await supabase.from('profiles').upsert({
      id: userId,
      role: 'super_admin',
      first_name: 'Ibrahima',
      last_name: 'Kourouma',
      organization: 'Afronovation'
  }, { onConflict: 'id' });

  if (profileError) return console.error('Failed profile', profileError.message);

  console.log('SUCCESS: SUPER ADMIN GRANTED');
}
setupSuperAdmin();

