
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Manually load env from .env file
const envPath = path.resolve(process.cwd(), '.env');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabaseUrl = envConfig.VITE_SUPABASE_URL;
const supabaseServiceKey = envConfig.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function debugUsers() {
    console.log('--- DEBUGGING USERS & PROFILES ---');
    console.log(`Connecting to: ${supabaseUrl}`);

    // 1. Fetch all auth users
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();

    if (usersError) {
        console.error('Error fetching auth users:', usersError);
        return;
    }

    console.log(`\nFound ${users.length} users in 'auth.users':`);
    users.forEach(u => console.log(` - ID: ${u.id} | Email: ${u.email}`));

    // 2. Fetch all profiles (Bypassing RLS because we use Service Role)
    const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

    if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
    } else {
        console.log(`\nFound ${profiles.length} profiles in 'public.profiles':`);
        profiles.forEach(p => console.log(` - ID: ${p.id} | Name: ${p.full_name} | Role: ${p.role} | Banned: ${p.is_banned}`));
    }

    // 3. Compare and Check for Discrepancies
    const profileIds = new Set(profiles.map(p => p.id));
    const missingProfiles = users.filter(u => !profileIds.has(u.id));

    if (missingProfiles.length > 0) {
        console.log(`\n[WARNING] ${missingProfiles.length} users are MISSING profiles:`);
        missingProfiles.forEach(u => console.log(` - ${u.email} (${u.id})`));
    } else {
        console.log('\n[OK] All users have profiles.');
    }

    // 4. Check Admin Count
    const admins = profiles.filter(p => p.role === 'admin');
    if (admins.length === 0) {
        console.log('\n[CRITICAL] NO "admin" user found in public.profiles!');
        console.log('If you are logged in, you will NOT see the data because RLS requires role="admin".');
    } else {
        console.log(`\n[OK] Found ${admins.length} admin(s):`);
        admins.forEach(a => console.log(` - ${a.full_name} (${a.id})`));
    }
}

debugUsers();
