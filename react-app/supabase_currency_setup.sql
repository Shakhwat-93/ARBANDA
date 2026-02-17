-- Create the store_settings table if it doesn't exist
create table if not exists public.store_settings (
  id bigint primary key generated always as identity,
  setting_key text unique not null,
  setting_value jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Safely add columns if they are missing (in case table already existed with different schema)
do $$
begin
    -- Handle setting_key
    if not exists (select 1 from information_schema.columns where table_name = 'store_settings' and column_name = 'setting_key') then
        -- 1. Add column as nullable first
        alter table public.store_settings add column setting_key text;
        
        -- 2. Populate existing rows with a default unique value to satisfy NOT NULL and UNIQUE later
        update public.store_settings set setting_key = 'setting_' || id::text where setting_key is null;
        
        -- 3. Add constraints
        alter table public.store_settings alter column setting_key set not null;
        alter table public.store_settings add constraint store_settings_setting_key_key unique (setting_key);
    end if;

    -- Handle setting_value
    if not exists (select 1 from information_schema.columns where table_name = 'store_settings' and column_name = 'setting_value') then
        alter table public.store_settings add column setting_value jsonb;
        update public.store_settings set setting_value = '{}'::jsonb where setting_value is null;
        alter table public.store_settings alter column setting_value set not null;
    end if;
end $$;

-- Enable Row Level Security (RLS)
alter table public.store_settings enable row level security;

-- Create policies (drop existing first to avoid errors)
drop policy if exists "Enable read access for all users" on public.store_settings;
create policy "Enable read access for all users"
on public.store_settings for select
using (true);

drop policy if exists "Enable insert for authenticated users only" on public.store_settings;
create policy "Enable insert for authenticated users only"
on public.store_settings for insert
with check (auth.role() = 'authenticated');

drop policy if exists "Enable update for authenticated users only" on public.store_settings;
create policy "Enable update for authenticated users only"
on public.store_settings for update
using (auth.role() = 'authenticated');

-- Seed default currency (BDT) if not exists
insert into public.store_settings (setting_key, setting_value)
values ('currency', '"BDT"')
on conflict (setting_key) do nothing;
