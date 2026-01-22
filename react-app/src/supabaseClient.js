import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isUrlValid = (url) => {
    try {
        return url && (url.startsWith('http://') || url.startsWith('https://'));
    } catch {
        return false;
    }
};

// Initialize with empty strings if missing to avoid immediate crash in some environments, 
// though createClient usually requires a valid URL.
// We'll export a conditional client or null to allow the UI to handle it.
export const supabase = isUrlValid(supabaseUrl) && supabaseAnonKey && !supabaseAnonKey.includes('YOUR_')
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        auth: {
            getSession: () => Promise.resolve({ data: { session: null } }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            signInWithPassword: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
            signOut: () => Promise.resolve(),
        },
        from: () => ({
            select: () => ({
                order: () => Promise.resolve({ data: [], error: { message: 'Supabase not configured' } }),
            }),
        }),
    };

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials missing. Please check your .env file. The app is running in "Mock Mode".');
}
