
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const envPath = path.resolve(process.cwd(), '.env');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabase = createClient(envConfig.VITE_SUPABASE_URL, envConfig.VITE_SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function verifyEmails() {
    console.log('Verifying emails in profiles table...');

    // Select * will fail if column doesn't exist? No, it just won't return it if we don't ask, or we can ask specific.
    // Let's try to select 'email'.
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .limit(5);

    if (error) {
        console.error('Error fetching profiles:', error.message);
        console.log('Use likely has NOT run the "add_email_to_profiles.sql" script yet.');
    } else {
        console.log('Successfully fetched profiles. Sample data:');
        profiles.forEach(p => console.log(` - ${p.full_name}: ${p.email}`));

        const hasEmails = profiles.some(p => p.email);
        if (hasEmails) {
            console.log('✅ Email column exists and has data.');
        } else {
            console.log('⚠️ Email column exists but appears empty (or null).');
        }
    }
}

verifyEmails();
