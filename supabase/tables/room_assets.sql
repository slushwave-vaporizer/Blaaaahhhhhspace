-- Room Assets Table
-- Tracks 3D models, positions, rotations, scales within rooms
CREATE TABLE room_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES virtual_rooms(id) ON DELETE CASCADE NOT NULL,
  asset_id UUID REFERENCES asset_library(id) ON DELETE CASCADE NOT NULL,
  position_x FLOAT DEFAULT 0,
  position_y FLOAT DEFAULT 0,
  position_z FLOAT DEFAULT 0,
  rotation_x FLOAT DEFAULT 0,
  rotation_y FLOAT DEFAULT 0,
  rotation_z FLOAT DEFAULT 0,
  scale_x FLOAT DEFAULT 1,
  scale_y FLOAT DEFAULT 1,
  scale_z FLOAT DEFAULT 1,
  custom_properties JSONB DEFAULT '{}', -- Custom properties like materials, colors, etc.
  is_interactive BOOLEAN DEFAULT false,
  interaction_type VARCHAR(50), -- 'click', 'hover', 'proximity', etc.
  interaction_data JSONB DEFAULT '{}',
  order_index INTEGER DEFAULT 0, -- For layering/ordering
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE room_assets ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view assets in public rooms" ON room_assets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM virtual_rooms vr 
      WHERE vr.id = room_assets.room_id 
      AND (vr.is_public = true OR vr.user_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage assets in their own rooms" ON room_assets
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM virtual_rooms vr 
      WHERE vr.id = room_assets.room_id 
      AND vr.user_id = auth.uid()
    )
  );

-- Indexes
CREATE INDEX idx_room_assets_room_id ON room_assets(room_id);
CREATE INDEX idx_room_assets_asset_id ON room_assets(asset_id);
CREATE INDEX idx_room_assets_order ON room_assets(room_id, order_index);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_room_assets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_room_assets_updated_at
  BEFORE UPDATE ON room_assets
  FOR EACH ROW
  EXECUTE FUNCTION update_room_assets_updated_at();