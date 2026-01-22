import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Error: VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_ROLE_KEY must be set in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupStorage() {
    console.log('Checking for "product-images" bucket...');

    try {
        const { data: buckets, error: listError } = await supabase.storage.listBuckets();

        if (listError) {
            console.error('Error listing buckets:', listError.message);
            return;
        }

        const bucketExists = buckets.find(b => b.name === 'product-images');

        if (bucketExists) {
            console.log('Bucket "product-images" already exists.');
        } else {
            console.log('Creating "product-images" bucket...');
            const { data, error: createError } = await supabase.storage.createBucket('product-images', {
                public: true,
                allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
                fileSizeLimit: 5242880 // 5MB
            });

            if (createError) {
                console.error('Error creating bucket:', createError.message);
                return;
            }
            console.log('Successfully created public bucket: "product-images"');
        }

        console.log('\n--- NEXT STEPS ---');
        console.log('1. Go to your Supabase Dashboard.');
        console.log('2. Navigate to Storage > product-images.');
        console.log('3. Double check that "Public" access is enabled in settings.');
        console.log('------------------\n');
    } catch (err) {
        console.error('Unexpected error:', err.message);
    }
}

setupStorage();
