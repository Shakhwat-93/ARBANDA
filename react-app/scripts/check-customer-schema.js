import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_SERVICE_ROLE_KEY);

async function checkSchema() {
    console.log('--- SCHEMA CHECK ---');
    const { data: cols, error } = await supabase
        .from('orders')
        .select('*')
        .limit(1);

    if (error) {
        console.error('ERROR:', error.message);
        return;
    }

    // Check if user_id exists in the first row keys if any, 
    // but better check information_schema via RPC if we had one.
    // Instead we'll try to Filter by user_id
    const { error: filterError } = await supabase
        .from('orders')
        .select('user_id')
        .limit(1);

    if (filterError) {
        console.log('RESULT: user_id column NOT found. Please run Section 3.1 SQL.');
    } else {
        console.log('RESULT: user_id column FOUND. Ready for Customer System!');
    }
    console.log('--------------------');
}

checkSchema();
