-- Room Visits Table
-- Track room visit analytics and user engagement
CREATE TABLE room_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES virtual_rooms(id) ON DELETE CASCADE NOT NULL,
  visitor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- NULL for anonymous visits
  visit_duration INTEGER, -- Duration in seconds
  interaction_count INTEGER DEFAULT 0, -- Number of interactions during visit
  actions JSONB DEFAULT '[]', -- Array of actions taken during visit
  device_type VARCHAR(20) DEFAULT 'desktop' CHECK (device_type IN ('desktop', 'mobile', 'tablet', 'vr')),
  browser_info JSONB DEFAULT '{}',
  referrer VARCHAR(500), -- How they found the room
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE room_visits ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Room owners can view visits to their rooms" ON room_visits
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM virtual_rooms vr 
      WHERE vr.id = room_visits.room_id 
      AND vr.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can create visit records" ON room_visits
  FOR INSERT WITH CHECK (true);

-- Indexes
CREATE INDEX idx_room_visits_room_id ON room_visits(room_id);
CREATE INDEX idx_room_visits_visitor_id ON room_visits(visitor_id);
CREATE INDEX idx_room_visits_created_at ON room_visits(created_at);
CREATE INDEX idx_room_visits_device_type ON room_visits(device_type);