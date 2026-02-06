-- Create Store Settings table (Singleton pattern usually, or one row per store)
CREATE TABLE IF NOT EXISTS public.store_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    store_name TEXT DEFAULT 'My Store',
    currency TEXT DEFAULT 'USD',
    timezone TEXT DEFAULT 'UTC',
    order_system_enabled BOOLEAN DEFAULT true,
    email_notifications BOOLEAN DEFAULT false,
    payment_alerts BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Insert default settings row if not exists
INSERT INTO public.store_settings (store_name, currency, timezone)
SELECT 'My Store', 'USD', 'UTC'
WHERE NOT EXISTS (SELECT 1 FROM public.store_settings);

-- Create Coupons table
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed')) NOT NULL,
    discount_value NUMERIC NOT NULL,
    min_purchase_amount NUMERIC DEFAULT 0,
    max_discount_amount NUMERIC,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    applicable_categories JSONB DEFAULT '[]'::jsonb, -- Store category IDs or Names as JSON array
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create index for faster coupon lookup
CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON public.coupons(is_active);

-- Enable RLS
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Policies (assuming public/anon read for settings/active coupons, admin full access)
CREATE POLICY "Public read settings" ON public.store_settings FOR SELECT USING (true);
CREATE POLICY "Admin update settings" ON public.store_settings FOR UPDATE USING (true); -- Ideally restrict to admin role

CREATE POLICY "Public read active coupons" ON public.coupons FOR SELECT USING (is_active = true);
CREATE POLICY "Admin full access coupons" ON public.coupons FOR ALL USING (true); -- Ideally restrict to admin role
