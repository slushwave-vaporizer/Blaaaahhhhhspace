-- Room Shares Table
-- Manage room sharing and collaboration permissions
CREATE TABLE room_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES virtual_rooms(id) ON DELETE CASCADE NOT NULL,
  shared_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  shared_with UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  permission_level VARCHAR(20) DEFAULT 'view' CHECK (permission_level IN ('view', 'edit', 'admin')),
  share_type VARCHAR(20) DEFAULT 'direct' CHECK (share_type IN ('direct', 'link', 'public')),
  share_token VARCHAR(100) UNIQUE, -- For link-based sharing
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE room_shares ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Room owners can manage shares" ON room_shares
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM virtual_rooms vr 
      WHERE vr.id = room_shares.room_id 
      AND vr.user_id = auth.uid()
    ) OR shared_by = auth.uid()
  );

CREATE POLICY "Users can view shares with them" ON room_shares
  FOR SELECT USING (shared_with = auth.uid() AND is_active = true);

-- Indexes
CREATE INDEX idx_room_shares_room_id ON room_shares(room_id);
CREATE INDEX idx_room_shares_shared_with ON room_shares(shared_with);
CREATE INDEX idx_room_shares_token ON room_shares(share_token) WHERE share_token IS NOT NULL;
CREATE INDEX idx_room_shares_active ON room_shares(is_active) WHERE is_active = true;

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_room_shares_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_room_shares_updated_at
  BEFORE UPDATE ON room_shares
  FOR EACH ROW
  EXECUTE FUNCTION update_room_shares_updated_at();