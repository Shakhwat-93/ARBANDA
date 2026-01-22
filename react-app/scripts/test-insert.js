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

async function testInsert() {
    console.log('--- INSERT TEST ---');
    const { data, error } = await supabase
        .from('products')
        .insert([{
            name: 'Test Product',
            price: 9.99,
            description: 'Connectivity check'
        }])
        .select();

    if (error) {
        console.error('INSERT ERROR:', error.message);
    } else {
        console.log('INSERT SUCCESS:', data[0].id);

        // Cleanup
        await supabase.from('products').delete().eq('id', data[0].id);
        console.log('CLEANUP SUCCESS.');
    }
    console.log('-------------------');
}

testInsert();
