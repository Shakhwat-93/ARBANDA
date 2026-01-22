import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function initDb() {
    console.log('🚀 Initializing Supabase Database...');

    // Create products table using SQL RPC or raw query if available, 
    // but since we can't run raw SQL via the client easily without a pre-defined function,
    // we'll check if the table exists by trying to select from it.

    const { error: checkError } = await supabase.from('products').select('*').limit(1);

    if (checkError && checkError.code === 'PGRST116') {
        console.log('Table "products" does not exist. Please run the SQL in Supabase SQL Editor:');
        console.log(`
CREATE TABLE IF NOT EXISTS products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  category text,
  image_url text,
  secondary_images text[],
  stock integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
      `);
        // Unfortunately, standard Supabase JS client doesn't allow creating tables directly.
        // REST API / PostgREST doesn't support DDL (Data Definition Language).
    } else if (!checkError) {
        console.log('✅ Table "products" already exists.');
    } else {
        console.error('❌ Error checking table:', checkError.message);
    }
}

initDb();
