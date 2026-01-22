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

async function checkTable() {
    console.log('--- DB CHECK ---');
    const { data, error, count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error('ERROR:', error.message);
        console.error('CODE:', error.code);
        if (error.code === 'PGRST116' || error.message.includes('cache')) {
            console.log('RESULT: Table does NOT exist or cache is stale.');
        }
    } else {
        console.log('RESULT: Table EXISTS.');
        console.log('COUNT:', count);
    }
    console.log('----------------');
}

checkTable();
