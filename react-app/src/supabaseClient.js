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

const createMockClient = () => {
    const handler = {
        get(target, prop) {
            if (prop === 'then') return undefined;
            if (prop === 'auth') {
                return {
                    getSession: () => Promise.resolve({ data: { session: null } }),
                    getUser: () => Promise.resolve({ data: { user: null } }),
                    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
                    signInWithPassword: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
                    signOut: () => Promise.resolve(),
                };
            }
            if (prop === 'storage') {
                return {
                    from: () => new Proxy({}, handler)
                };
            }
            // Return a function that returns the proxy for chaining, 
            // but also acts as a promise for the final call
            const mockFunc = () => new Proxy({}, handler);
            mockFunc.then = (resolve) => resolve({ data: [], error: null });
            mockFunc.select = () => new Proxy({}, handler);
            mockFunc.from = () => new Proxy({}, handler);
            mockFunc.eq = () => new Proxy({}, handler);
            mockFunc.order = () => new Proxy({}, handler);
            mockFunc.single = () => Promise.resolve({ data: null, error: null });
            mockFunc.insert = () => Promise.resolve({ data: [], error: null });
            mockFunc.update = () => Promise.resolve({ data: [], error: null });
            mockFunc.upsert = () => Promise.resolve({ data: [], error: null });
            mockFunc.delete = () => Promise.resolve({ data: [], error: null });
            mockFunc.channel = () => ({
                on: () => ({ subscribe: () => ({ unsubscribe: () => { } }) }),
                subscribe: () => ({})
            });

            return mockFunc;
        }
    };
    return new Proxy({}, handler);
};

export const supabase = isUrlValid(supabaseUrl) && supabaseAnonKey && !supabaseAnonKey.includes('YOUR_')
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createMockClient();

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials missing. Please check your .env file or Vercel settings. The app is running in "Mock Mode".');
}
