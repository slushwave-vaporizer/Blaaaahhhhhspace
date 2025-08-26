-- Virtual Rooms Table
-- Stores room configurations, settings, and metadata for 3D virtual spaces
CREATE TABLE virtual_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  room_type VARCHAR(50) DEFAULT 'gallery' CHECK (room_type IN ('gallery', 'studio', 'lounge', 'workshop', 'office', 'exhibition')),
  is_public BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  room_config JSONB DEFAULT '{}', -- Stores room dimensions, lighting settings, etc.
  theme VARCHAR(50) DEFAULT 'modern',
  background_color VARCHAR(7) DEFAULT '#f8f8f8',
  floor_texture VARCHAR(255),
  wall_texture VARCHAR(255),
  ceiling_texture VARCHAR(255),
  ambient_lighting JSONB DEFAULT '{"intensity": 0.3, "color": "#ffffff"}',
  visit_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE virtual_rooms ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view public rooms" ON virtual_rooms
  FOR SELECT USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can manage their own rooms" ON virtual_rooms
  FOR ALL USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_virtual_rooms_user_id ON virtual_rooms(user_id);
CREATE INDEX idx_virtual_rooms_public ON virtual_rooms(is_public) WHERE is_public = true;
CREATE INDEX idx_virtual_rooms_featured ON virtual_rooms(is_featured) WHERE is_featured = true;
CREATE INDEX idx_virtual_rooms_type ON virtual_rooms(room_type);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_virtual_rooms_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_virtual_rooms_updated_at
  BEFORE UPDATE ON virtual_rooms
  FOR EACH ROW
  EXECUTE FUNCTION update_virtual_rooms_updated_at();