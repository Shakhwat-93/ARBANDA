import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_SERVICE_ROLE_KEY);

async function run() {
    // We can't run raw SQL easily via JS client for information_schema
    // unless there is an RPC. 
    // BUT we can try to query it if it's exposed (usually not).

    // Instead, let's try to query the REST endpoint for a non-existent table 
    // and compare the error messages.

    const p = await supabase.from('products').select('*').limit(1);
    const x = await supabase.from('definitely_not_a_table_123').select('*').limit(1);

    console.log('PRODUCTS_ERR:' + p.error?.message);
    console.log('DUMMY_ERR:' + x.error?.message);
}
run();
