-- Middleman / Multi-vendor System Schema

-- 1. Profiles Table: Stores the middleman identity and store settings
CREATE TABLE IF NOT EXISTS middleman_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  store_name TEXT NOT NULL,
  store_slug TEXT UNIQUE NOT NULL, -- e.g., 'johns-store' -> localhost:3000/johns-store
  bio TEXT,
  avatar_url TEXT,
  template_id UUID, -- Currently active template
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Templates Table: Available designs for stores
CREATE TABLE IF NOT EXISTS templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  config JSONB DEFAULT '{}'::jsonb, -- Theme colors, layout options
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Store Products Table: Links a profile to specific ASINs
CREATE TABLE IF NOT EXISTS store_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES middleman_profiles(id) ON DELETE CASCADE,
  asin TEXT NOT NULL, -- The ASIN from the main catalog
  custom_title TEXT, -- Optional override
  custom_price DECIMAL(10, 2), -- Optional override
  sort_order INTEGER DEFAULT 0,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(profile_id, asin)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_slug ON middleman_profiles(store_slug);
CREATE INDEX IF NOT EXISTS idx_store_products_profile ON store_products(profile_id);
CREATE INDEX IF NOT EXISTS idx_store_products_asin ON store_products(asin);

-- RLS Policies (Basic Setup - Adjust based on your auth needs)
ALTER TABLE middleman_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_products ENABLE ROW LEVEL SECURITY;

-- Policies: Public can view active profiles and templates
CREATE POLICY "Public view profiles" ON middleman_profiles FOR SELECT USING (is_active = true);
CREATE POLICY "Public view templates" ON templates FOR SELECT USING (true);
CREATE POLICY "Public view store products" ON store_products FOR SELECT USING (true);

-- Policies: Users can manage their own profiles and products
CREATE POLICY "Users insert own profile" ON middleman_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own profile" ON middleman_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users manage own products" ON store_products FOR ALL USING (
  EXISTS (SELECT 1 FROM middleman_profiles WHERE id = profile_id AND user_id = auth.uid())
);
