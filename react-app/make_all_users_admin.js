
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const envPath = path.resolve(process.cwd(), '.env');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabase = createClient(envConfig.VITE_SUPABASE_URL, envConfig.VITE_SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function makeAllAdmin() {
    console.log('Fetching users...');
    const { data: { users }, error } = await supabase.auth.admin.listUsers();

    if (error) return console.error(error);

    console.log(`Found ${users.length} users. Promoting ALL to admin...`);

    for (const user of users) {
        console.log(`Promoting ${user.email}...`);

        // 1. Ensure profile exists (Idempotent)
        const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
                id: user.id,
                full_name: user.user_metadata?.full_name || 'User',
                role: 'admin',      // <--- FORCE ADMIN
                is_banned: false
            }, { onConflict: 'id' });

        if (profileError) {
            console.error(`Failed to update profile for ${user.email}:`, profileError.message);
        } else {
            console.log(`✅ Success: ${user.email} is now ADMIN.`);
        }
    }
    console.log('Done.');
}

makeAllAdmin();
