// Mock virtual room data with YourSpace themes

export const mockRooms = {
  // Neon Synthwave Studio
  synthwaveStudio: {
    id: 'room-001',
    owner_id: 'user-001',
    name: 'Synthwave Production Studio',
    description: 'A neon-drenched music production space with vintage synthesizers and futuristic vibes.',
    theme: 'synthwave-neon',
    is_public: true,
    max_visitors: 8,
    current_visitors: 3,
    total_visits: 1247,
    room_type: 'studio',
    environment_settings: {
      lighting: {
        ambient: '#ff006e',
        accent: '#8338ec',
        intensity: 0.7,
        animated: true,
      },
      atmosphere: {
        fog: true,
        particles: 'neon-sparkles',
        background_music: 'ambient-synthwave.mp3',
        volume: 0.3,
      },
      physics: {
        gravity: 9.81,
        collision_detection: true,
        realistic_audio: true,
      },
    },
    assets: [
      {
        id: 'asset-001',
        type: 'synthesizer',
        model: 'vintage-moog.glb',
        position: { x: -2, y: 0, z: 1 },
        rotation: { x: 0, y: 45, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        interactive: true,
        audio_reactive: true,
        metadata: {
          brand: 'Moog',
          model: 'Minimoog',
          sounds: ['bass', 'lead', 'pad'],
        },
      },
      {
        id: 'asset-002',
        type: 'drum_machine',
        model: 'roland-808.glb',
        position: { x: 2, y: 0.8, z: 0 },
        rotation: { x: 0, y: -30, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        interactive: true,
        audio_reactive: true,
        metadata: {
          brand: 'Roland',
          model: 'TR-808',
          patterns: ['house', 'techno', 'trap'],
        },
      },
      {
        id: 'asset-003',
        type: 'monitor',
        model: 'studio-monitor.glb',
        position: { x: 0, y: 1.2, z: -1 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        interactive: false,
        audio_reactive: true,
        metadata: {
          brand: 'Yamaha',
          model: 'HS8',
          frequency_response: '38Hz-30kHz',
        },
      },
    ],
    created_at: '2025-01-10T10:00:00Z',
    updated_at: '2025-01-15T14:30:00Z',
  },
  
  // Cyberpunk Art Gallery
  cyberpunkGallery: {
    id: 'room-002',
    owner_id: 'user-002',
    name: 'Neon Dystopia Gallery',
    description: 'An immersive cyberpunk art gallery featuring glitch art and digital installations.',
    theme: 'cyberpunk-dark',
    is_public: true,
    max_visitors: 15,
    current_visitors: 7,
    total_visits: 892,
    room_type: 'gallery',
    environment_settings: {
      lighting: {
        ambient: '#001a2e',
        accent: '#00f5ff',
        intensity: 0.4,
        animated: true,
      },
      atmosphere: {
        fog: true,
        particles: 'digital-rain',
        background_music: 'dark-ambient.mp3',
        volume: 0.2,
      },
      effects: {
        screen_flicker: true,
        hologram_projections: true,
        neon_reflections: true,
      },
    },
    assets: [
      {
        id: 'asset-004',
        type: 'art_display',
        model: 'hologram-frame.glb',
        position: { x: -3, y: 1.5, z: 0 },
        rotation: { x: 0, y: 90, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        interactive: true,
        content_id: 'content-002',
        metadata: {
          artwork: 'Neon Cityscape 2084',
          artist: 'CyberGhost404',
          year: '2025',
        },
      },
      {
        id: 'asset-005',
        type: 'interactive_terminal',
        model: 'cyber-terminal.glb',
        position: { x: 3, y: 0.8, z: 2 },
        rotation: { x: 0, y: -45, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        interactive: true,
        functions: ['browse_art', 'artist_info', 'purchase'],
        metadata: {
          os: 'CyberOS 2084',
          access_level: 'public',
          security: 'encrypted',
        },
      },
    ],
    created_at: '2025-01-12T15:30:00Z',
    updated_at: '2025-01-14T09:45:00Z',
  },
  
  // Retro Lounge
  retroLounge: {
    id: 'room-003',
    owner_id: 'user-003',
    name: 'Retro Wave Lounge',
    description: 'Chill retro lounge with vintage aesthetics and relaxing synthwave ambience.',
    theme: 'retro-sunset',
    is_public: true,
    max_visitors: 12,
    current_visitors: 5,
    total_visits: 2341,
    room_type: 'lounge',
    environment_settings: {
      lighting: {
        ambient: '#ff8c00',
        accent: '#ff006e',
        intensity: 0.6,
        animated: false,
      },
      atmosphere: {
        fog: false,
        particles: 'sunset-rays',
        background_music: 'chill-synthwave.mp3',
        volume: 0.4,
      },
      skybox: 'retro-sunset-grid',
    },
    assets: [
      {
        id: 'asset-006',
        type: 'seating',
        model: 'retro-couch.glb',
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        interactive: true,
        functions: ['sit', 'voice_chat'],
        metadata: {
          material: 'velvet',
          color: 'magenta',
          capacity: 3,
        },
      },
      {
        id: 'asset-007',
        type: 'music_player',
        model: 'retro-boombox.glb',
        position: { x: -2, y: 0.5, z: -1 },
        rotation: { x: 0, y: 30, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        interactive: true,
        audio_source: true,
        metadata: {
          brand: 'Retro Beats',
          supported_formats: ['mp3', 'wav', 'vinyl'],
          equalizer: true,
        },
      },
    ],
    created_at: '2025-01-08T20:15:00Z',
    updated_at: '2025-01-13T11:20:00Z',
  },
  
  // Collaborative Workspace
  collabSpace: {
    id: 'room-004',
    owner_id: 'user-005',
    name: 'Creative Collaboration Hub',
    description: 'Multi-purpose creative space for real-time collaboration and co-creation.',
    theme: 'digital-workspace',
    is_public: false,
    max_visitors: 6,
    current_visitors: 2,
    total_visits: 156,
    room_type: 'workspace',
    collaboration_features: {
      real_time_editing: true,
      voice_chat: true,
      screen_sharing: true,
      file_sharing: true,
      whiteboard: true,
    },
    environment_settings: {
      lighting: {
        ambient: '#ffffff',
        accent: '#0066cc',
        intensity: 0.8,
        animated: false,
      },
      atmosphere: {
        background_music: 'focus-ambient.mp3',
        volume: 0.1,
      },
    },
    assets: [
      {
        id: 'asset-008',
        type: 'collaborative_canvas',
        model: 'digital-canvas.glb',
        position: { x: 0, y: 1.5, z: -2 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2, y: 1.5, z: 0.1 },
        interactive: true,
        functions: ['draw', 'erase', 'share', 'export'],
        metadata: {
          resolution: '4096x3072',
          layers: 16,
          collaborative: true,
        },
      },
      {
        id: 'asset-009',
        type: 'audio_workstation',
        model: 'daw-setup.glb',
        position: { x: 2, y: 0.8, z: 1 },
        rotation: { x: 0, y: -45, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        interactive: true,
        functions: ['record', 'edit', 'mix', 'collaborate'],
        metadata: {
          software: 'YourSpace DAW',
          tracks: 64,
          real_time_sync: true,
        },
      },
    ],
    created_at: '2025-01-14T12:00:00Z',
    updated_at: '2025-01-15T16:45:00Z',
  },
  
  // Matrix Code Space
  matrixSpace: {
    id: 'room-005',
    owner_id: 'user-004',
    name: 'The Matrix Code Space',
    description: 'Enter the matrix. A generative environment where code becomes reality.',
    theme: 'matrix-green',
    is_public: true,
    max_visitors: 10,
    current_visitors: 4,
    total_visits: 666,
    room_type: 'experimental',
    environment_settings: {
      lighting: {
        ambient: '#000000',
        accent: '#00ff41',
        intensity: 0.9,
        animated: true,
      },
      atmosphere: {
        particles: 'matrix-rain',
        background_music: 'digital-void.mp3',
        volume: 0.3,
      },
      effects: {
        code_rain: true,
        digital_distortion: true,
        reality_glitch: true,
      },
    },
    assets: [
      {
        id: 'asset-010',
        type: 'code_generator',
        model: 'matrix-terminal.glb',
        position: { x: 0, y: 1, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        interactive: true,
        generative: true,
        functions: ['generate_code', 'visualize_data', 'matrix_mode'],
        metadata: {
          language: 'matrix-script',
          ai_powered: true,
          reality_level: 'simulated',
        },
      },
    ],
    created_at: '2025-01-13T03:33:33Z',
    updated_at: '2025-01-15T23:59:59Z',
  },
};

// Room templates for quick creation
export const roomTemplates = {
  musicStudio: {
    name: 'Music Production Studio',
    description: 'Professional music production environment',
    theme: 'synthwave-neon',
    room_type: 'studio',
    default_assets: ['synthesizer', 'drum_machine', 'monitor', 'mixing_board'],
  },
  
  artGallery: {
    name: 'Art Gallery',
    description: 'Showcase your visual creations',
    theme: 'cyberpunk-dark',
    room_type: 'gallery',
    default_assets: ['art_display', 'spotlight', 'information_panel'],
  },
  
  socialLounge: {
    name: 'Social Lounge',
    description: 'Relaxed space for community interaction',
    theme: 'retro-sunset',
    room_type: 'lounge',
    default_assets: ['seating', 'music_player', 'ambient_lighting'],
  },
  
  collabWorkspace: {
    name: 'Collaboration Workspace',
    description: 'Real-time creative collaboration space',
    theme: 'digital-workspace',
    room_type: 'workspace',
    default_assets: ['collaborative_canvas', 'audio_workstation', 'file_sharing'],
  },
};

// Asset library for room customization
export const assetLibrary = {
  // Music & Audio
  synthesizers: [
    { id: 'moog-minimoog', name: 'Moog Minimoog', model: 'moog-minimoog.glb', price: 0 },
    { id: 'korg-ms20', name: 'Korg MS-20', model: 'korg-ms20.glb', price: 5.99 },
    { id: 'roland-sh101', name: 'Roland SH-101', model: 'roland-sh101.glb', price: 7.99 },
  ],
  
  drumMachines: [
    { id: 'roland-808', name: 'Roland TR-808', model: 'roland-808.glb', price: 0 },
    { id: 'roland-909', name: 'Roland TR-909', model: 'roland-909.glb', price: 8.99 },
    { id: 'linn-drum', name: 'Linn Drum', model: 'linn-drum.glb', price: 12.99 },
  ],
  
  // Visual & Display
  artDisplays: [
    { id: 'hologram-frame', name: 'Hologram Frame', model: 'hologram-frame.glb', price: 0 },
    { id: 'neon-frame', name: 'Neon Frame', model: 'neon-frame.glb', price: 3.99 },
    { id: 'glitch-screen', name: 'Glitch Screen', model: 'glitch-screen.glb', price: 6.99 },
  ],
  
  // Furniture & Environment
  seating: [
    { id: 'retro-couch', name: 'Retro Couch', model: 'retro-couch.glb', price: 0 },
    { id: 'gaming-chair', name: 'Gaming Chair', model: 'gaming-chair.glb', price: 4.99 },
    { id: 'bean-bag', name: 'Cyber Bean Bag', model: 'cyber-beanbag.glb', price: 2.99 },
  ],
  
  // Interactive Objects
  computers: [
    { id: 'retro-computer', name: 'Retro Computer', model: 'retro-computer.glb', price: 0 },
    { id: 'cyber-terminal', name: 'Cyber Terminal', model: 'cyber-terminal.glb', price: 8.99 },
    { id: 'matrix-console', name: 'Matrix Console', model: 'matrix-console.glb', price: 15.99 },
  ],
};

// Helper functions
export const getRoomById = (id: string) => {
  return Object.values(mockRooms).find(room => room.id === id);
};

export const getRoomsByOwner = (ownerId: string) => {
  return Object.values(mockRooms).filter(room => room.owner_id === ownerId);
};

export const getRoomsByTheme = (theme: string) => {
  return Object.values(mockRooms).filter(room => room.theme === theme);
};

export const getPublicRooms = () => {
  return Object.values(mockRooms).filter(room => room.is_public);
};

export const createTestRoom = (overrides: Partial<typeof mockRooms.synthwaveStudio> = {}) => {
  return {
    ...mockRooms.synthwaveStudio,
    ...overrides,
    id: `test-room-${Date.now()}`,
  };
};
