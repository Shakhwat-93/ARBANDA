
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const envPath = path.resolve(process.cwd(), '.env');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabase = createClient(envConfig.VITE_SUPABASE_URL, envConfig.VITE_SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function listUsers() {
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    if (error) return console.error(error);

    console.log('--- REGISTERED USERS ---');
    users.forEach(u => console.log(`Email: ${u.email}  (ID: ${u.id})`));
    console.log('------------------------');
}

listUsers();
