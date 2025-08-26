-- Asset Library Table
-- Catalog of available 3D assets and user uploads
CREATE TABLE asset_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL CHECK (category IN (
    'furniture', 'artwork', 'sculptures', 'decorations', 'lighting', 
    'plants', 'electronics', 'tools', 'instruments', 'books', 
    'textiles', 'architecture', 'vehicles', 'other'
  )),
  subcategory VARCHAR(100),
  file_url VARCHAR(500) NOT NULL, -- URL to 3D model file
  thumbnail_url VARCHAR(500), -- URL to preview image
  file_type VARCHAR(20) DEFAULT 'gltf' CHECK (file_type IN ('gltf', 'glb', 'obj', 'fbx')),
  file_size BIGINT, -- File size in bytes
  dimensions JSONB DEFAULT '{}', -- {"width": 1, "height": 1, "depth": 1}
  materials JSONB DEFAULT '[]', -- Array of material information
  tags TEXT[], -- Array of searchable tags
  is_public BOOLEAN DEFAULT false,
  is_free BOOLEAN DEFAULT true,
  price DECIMAL(10,2) DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0, -- Average rating 0-5
  rating_count INTEGER DEFAULT 0,
  license_type VARCHAR(50) DEFAULT 'cc0' CHECK (license_type IN ('cc0', 'cc_by', 'cc_by_sa', 'custom', 'commercial')),
  license_details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE asset_library ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view public assets" ON asset_library
  FOR SELECT USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can manage their own assets" ON asset_library
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public asset details" ON asset_library
  FOR SELECT USING (is_public = true);

-- Indexes
CREATE INDEX idx_asset_library_user_id ON asset_library(user_id);
CREATE INDEX idx_asset_library_category ON asset_library(category);
CREATE INDEX idx_asset_library_public ON asset_library(is_public) WHERE is_public = true;
CREATE INDEX idx_asset_library_tags ON asset_library USING gin(tags);
CREATE INDEX idx_asset_library_price ON asset_library(price) WHERE is_public = true;

-- Full text search index
CREATE INDEX idx_asset_library_search ON asset_library USING gin(
  to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, ''))
);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_asset_library_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_asset_library_updated_at
  BEFORE UPDATE ON asset_library
  FOR EACH ROW
  EXECUTE FUNCTION update_asset_library_updated_at();