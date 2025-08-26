-- Computer Workstation Assets
-- Add computer workstation assets to the asset library

-- Insert computer workstation assets
INSERT INTO asset_library (
  name,
  description,
  category,
  subcategory,
  file_url,
  thumbnail_url,
  file_type,
  dimensions,
  materials,
  tags,
  is_public,
  is_free,
  license_type
) VALUES 
(
  'Modern Creative Workstation',
  'Professional computer setup with monitor, keyboard, and desk perfect for creative work and management tasks.',
  'electronics',
  'computer_workstation',
  '/models/computer_workstation_modern.gltf',
  '/images/computer_workstation_modern_thumbnail.jpg',
  'gltf',
  '{"width": 2, "height": 1.5, "depth": 1.2}',
  '["wood", "metal", "glass", "plastic"]',
  '{"computer", "workstation", "desk", "monitor", "creative", "professional", "modern"}',
  true,
  true,
  'cc0'
),
(
  'Gaming Creative Setup',
  'High-performance computer workstation designed for content creation, streaming, and creative work.',
  'electronics',
  'computer_workstation',
  '/models/gaming_workstation.gltf',
  '/images/gaming_workstation_thumbnail.jpg',
  'gltf',
  '{"width": 2.2, "height": 1.6, "depth": 1.4}',
  '["wood", "metal", "rgb_lighting", "glass"]',
  '{"gaming", "computer", "workstation", "rgb", "creative", "streaming", "professional"}',
  true,
  true,
  'cc0'
),
(
  'Minimalist Work Hub',
  'Clean, minimalist computer setup perfect for focused creative work and digital art creation.',
  'electronics',
  'computer_workstation',
  '/models/minimalist_workstation.gltf',
  '/images/minimalist_workstation_thumbnail.jpg',
  'gltf',
  '{"width": 1.8, "height": 1.4, "depth": 1.0}',
  '["white_wood", "aluminum", "glass"]',
  '{"minimalist", "computer", "workstation", "clean", "white", "modern", "creative"}',
  true,
  true,
  'cc0'
),
(
  'Studio Command Center',
  'Professional dual-monitor setup for advanced creative work, video editing, and content management.',
  'electronics',
  'computer_workstation',
  '/models/studio_command_center.gltf',
  '/images/studio_command_center_thumbnail.jpg',
  'gltf',
  '{"width": 2.5, "height": 1.8, "depth": 1.5}',
  '["dark_wood", "metal", "multiple_monitors", "professional_gear"]',
  '{"studio", "professional", "dual_monitor", "command_center", "creative", "workstation"}',
  true,
  true,
  'cc0'
);

-- Create room asset entries for default computer workstations in existing rooms
-- This will add computer workstations to all existing rooms
INSERT INTO room_assets (
  room_id,
  asset_id,
  position_x,
  position_y,
  position_z,
  rotation_x,
  rotation_y,
  rotation_z,
  scale_x,
  scale_y,
  scale_z,
  is_interactive,
  interaction_type,
  interaction_data,
  order_index
)
SELECT 
  vr.id as room_id,
  al.id as asset_id,
  -4.0 as position_x,  -- Position in corner of room
  0.0 as position_y,
  -4.0 as position_z,
  0.0 as rotation_x,
  0.0 as rotation_y,
  0.0 as rotation_z,
  1.0 as scale_x,
  1.0 as scale_y,
  1.0 as scale_z,
  true as is_interactive,
  'computer_interface' as interaction_type,
  '{"type": "workstation", "apps": ["file_manager", "content_studio", "room_designer", "analytics", "profile_builder"]}' as interaction_data,
  100 as order_index  -- High order to ensure computers are rendered last
FROM virtual_rooms vr
CROSS JOIN (
  SELECT id FROM asset_library 
  WHERE subcategory = 'computer_workstation' 
  AND name = 'Modern Creative Workstation'
  LIMIT 1
) al
WHERE NOT EXISTS (
  -- Don't add if room already has a computer workstation
  SELECT 1 FROM room_assets ra
  JOIN asset_library al2 ON ra.asset_id = al2.id
  WHERE ra.room_id = vr.id AND al2.subcategory = 'computer_workstation'
);
