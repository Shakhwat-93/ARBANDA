-- Force PostgREST to reload the schema cache immediately
NOTIFY pgrst, 'reload config';

-- Check if the table really exists (should return rows or empty set, not error)
SELECT * FROM public.store_settings;
