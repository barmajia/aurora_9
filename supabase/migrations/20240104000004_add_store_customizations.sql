-- Add store customization settings
CREATE TABLE IF NOT EXISTS store_customizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES middleman_profiles(id) ON DELETE CASCADE,
  template_id VARCHAR(50) NOT NULL,
  
  -- Layout Settings
  layout_mode VARCHAR(20) DEFAULT 'grid', -- grid, list, masonry, minimal
  products_per_page INT DEFAULT 12,
  show_sidebar BOOLEAN DEFAULT true,
  
  -- Branding
  primary_color VARCHAR(7) DEFAULT '#3B82F6',
  secondary_color VARCHAR(7) DEFAULT '#1E40AF',
  font_family VARCHAR(50) DEFAULT 'inter',
  
  -- Content
  hero_banner_url TEXT,
  hero_title TEXT,
  hero_subtitle TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX idx_store_customizations_store_id ON store_customizations(store_id);

-- RLS Policies
ALTER TABLE store_customizations ENABLE ROW LEVEL SECURITY;

-- Owners can view/edit their own store settings
CREATE POLICY "Store owners can view own settings" 
  ON store_customizations FOR SELECT 
  USING (auth.uid() IN (
    SELECT user_id FROM middleman_profiles WHERE id = store_customizations.store_id
  ));

CREATE POLICY "Store owners can update own settings" 
  ON store_customizations FOR UPDATE 
  USING (auth.uid() IN (
    SELECT user_id FROM middleman_profiles WHERE id = store_customizations.store_id
  ));

CREATE POLICY "Store owners can insert own settings" 
  ON store_customizations FOR INSERT 
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM middleman_profiles WHERE id = store_customizations.store_id
  ));

-- Public can read settings for rendering stores
CREATE POLICY "Public can view store settings" 
  ON store_customizations FOR SELECT 
  USING (true);
