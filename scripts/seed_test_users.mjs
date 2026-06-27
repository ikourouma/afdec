import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Read .env.local
const envFile = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  if (line && line.includes('=')) {
    const [key, val] = line.split('=');
    env[key.trim()] = val.trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const users = [
  { email: 'admin@afdecnc.org', password: 'Password1!', role: 'super_admin', full_name: 'Super Admin' },
  { email: 'admin@afronovation.com', password: 'Password1!', role: 'super_admin', full_name: 'Backup Admin' },
  { email: 'investor@afdecnc.org', password: 'Password1!', role: 'investor', full_name: 'AfDEC Investor' },
  { email: 'member@afdecnc.org', password: 'Password1!', role: 'citizen', full_name: 'AfDEC Member' }
];

async function seedUsers() {
  console.log("Seeding Test Users...");

  for (const u of users) {
    console.log(`Processing: ${u.email}`);
    
    // Check if user exists
    let { data: existingUsers, error: listErr } = await supabase.auth.admin.listUsers();
    let existingUser = existingUsers?.users?.find(x => x.email.toLowerCase() === u.email.toLowerCase());

    let userId = null;
    if (existingUser) {
      console.log(`User ${u.email} exists, updating password and confirming...`);
      userId = existingUser.id;
      await supabase.auth.admin.updateUserById(userId, {
        password: u.password,
        email_confirm: true
      });
    } else {
      console.log(`Creating user ${u.email}...`);
      const { data: newUser, error: createErr } = await supabase.auth.admin.createUser({
        email: u.email,
        password: u.password,
        email_confirm: true,
        user_metadata: { full_name: u.full_name }
      });
      if (createErr) {
         console.error(`Error creating ${u.email}:`, createErr.message);
         continue;
      }
      userId = newUser.user.id;
    }

    if (userId) {
       console.log(`Updating profile role for ${u.email} to ${u.role}`);
       // Update or Insert into public.profiles
       const names = u.full_name.split(' ');
       const { error: profileErr } = await supabase
        .from('profiles')
        .upsert({
           id: userId,
           first_name: names[0],
           last_name: names.slice(1).join(' '),
           role: u.role,
           organization: u.role === 'super_admin' ? 'AfDEC Secretariat' : 'Member Org'
        });
       if (profileErr) {
          console.error(`Error updating profile:`, profileErr.message);
       }
    }
  }

  console.log("Seeding complete!");
}

seedUsers();
