import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function probe() {
    console.log('--- SCHEMA PROBE ---');

    // Try products
    const { error: error1 } = await supabase.from('products').select('*').limit(1);
    console.log('PRODUCTS ERROR:', error1?.message || 'NONE');

    // Try orders
    const { error: error2 } = await supabase.from('orders').select('*').limit(1);
    console.log('ORDERS ERROR:', error2?.message || 'NONE');

    // Try dummy
    const { error: error3 } = await supabase.from('non_existent_table').select('*').limit(1);
    console.log('DUMMY ERROR:', error3?.message || 'NONE');

    console.log('--------------------');
}

probe();
