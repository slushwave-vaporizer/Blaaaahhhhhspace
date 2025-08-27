// Mock content data with YourSpace aesthetic

export const mockContent = {
  // Vaporwave Audio Track
  synthwaveNights: {
    id: 'content-001',
    creator_id: 'user-001',
    title: 'Synthwave Nights',
    description: 'A journey through neon-lit streets and digital dreams. Featuring lush pads, vintage drum machines, and ethereal vocals.',
    content_type: 'audio',
    file_url: '/audio/synthwave-nights.mp3',
    thumbnail_url: '/images/thumbnails/synthwave-nights.jpg',
    file_size: 8456723, // ~8.5MB
    mime_type: 'audio/mpeg',
    duration: 245, // 4:05
    is_public: true,
    is_premium: false,
    download_count: 1247,
    view_count: 15420,
    like_count: 892,
    comment_count: 47,
    price: 0,
    commission_enabled: true,
    vibe_tags: ['vaporwave', 'synthwave', 'chill', 'retro', 'ambient'],
    created_at: '2025-01-10T14:30:00Z',
    updated_at: '2025-01-10T14:30:00Z',
    metadata: {
      bpm: 85,
      key: 'C# minor',
      genre: 'Synthwave',
      mood: 'nostalgic',
      energy: 'low',
      instruments: ['synthesizer', 'drum-machine', 'pad', 'bass'],
    },
  },
  
  // Cyberpunk Visual Art
  neonCityscape: {
    id: 'content-002',
    creator_id: 'user-002',
    title: 'Neon Cityscape 2084',
    description: 'A glitched vision of tomorrow\'s urban landscape. Digital art exploring themes of technological dystopia and neon-soaked futures.',
    content_type: 'image',
    file_url: '/images/art/neon-cityscape-2084.jpg',
    thumbnail_url: '/images/thumbnails/neon-cityscape-thumb.jpg',
    file_size: 2847392, // ~2.8MB
    mime_type: 'image/jpeg',
    is_public: true,
    is_premium: true,
    download_count: 634,
    view_count: 9876,
    like_count: 567,
    comment_count: 23,
    price: 15.99,
    commission_enabled: false,
    vibe_tags: ['cyberpunk', 'glitch', 'neon', 'dystopia', 'urban'],
    created_at: '2025-01-12T09:15:00Z',
    updated_at: '2025-01-12T09:15:00Z',
    metadata: {
      dimensions: '3840x2160',
      color_palette: ['#ff006e', '#8338ec', '#3a86ff', '#06ffa5'],
      software: 'Photoshop, After Effects',
      style: 'cyberpunk-glitch',
      complexity: 'high',
    },
  },
  
  // Collaborative Music Project
  retroRemix: {
    id: 'content-003',
    creator_id: 'user-003',
    title: 'Retro Remix Collective',
    description: 'A collaborative remix of classic 80s tracks with modern production. Features contributions from 5 different artists.',
    content_type: 'audio',
    file_url: '/audio/retro-remix-collective.wav',
    thumbnail_url: '/images/thumbnails/retro-remix.jpg',
    file_size: 45672341, // ~45MB high quality
    mime_type: 'audio/wav',
    duration: 420, // 7:00
    is_public: true,
    is_premium: false,
    download_count: 2341,
    view_count: 12345,
    like_count: 1456,
    comment_count: 89,
    price: 0,
    commission_enabled: true,
    vibe_tags: ['retrowave', 'remix', 'collaboration', 'vintage', 'upbeat'],
    remix_parent_id: 'content-original-80s-track',
    created_at: '2025-01-08T16:45:00Z',
    updated_at: '2025-01-14T10:20:00Z',
    collaborators: [
      { user_id: 'user-001', role: 'producer', contribution: 'synth-leads' },
      { user_id: 'user-004', role: 'mixing', contribution: 'final-mix' },
      { user_id: 'user-005', role: 'vocals', contribution: 'lead-vocals' },
    ],
    metadata: {
      bpm: 128,
      key: 'A major',
      genre: 'Retrowave',
      mood: 'energetic',
      energy: 'high',
      quality: 'studio',
    },
  },
  
  // 3D Virtual Room Asset
  cyberpunkRoom: {
    id: 'content-004',
    creator_id: 'user-002',
    title: 'Cyberpunk Apartment - 3D Scene',
    description: 'Fully furnished cyberpunk apartment scene with interactive objects, ambient lighting, and atmospheric effects.',
    content_type: '3d_model',
    file_url: '/models/cyberpunk-apartment.glb',
    thumbnail_url: '/images/thumbnails/cyberpunk-apartment.jpg',
    file_size: 15789432, // ~15MB
    mime_type: 'model/gltf-binary',
    is_public: true,
    is_premium: true,
    download_count: 234,
    view_count: 3456,
    like_count: 287,
    comment_count: 15,
    price: 29.99,
    commission_enabled: true,
    vibe_tags: ['3d', 'cyberpunk', 'interior', 'vr-ready', 'interactive'],
    created_at: '2025-01-11T11:30:00Z',
    updated_at: '2025-01-11T11:30:00Z',
    metadata: {
      polygons: 45632,
      textures: 12,
      materials: 8,
      animations: ['door-open', 'screen-flicker', 'neon-pulse'],
      vr_compatible: true,
      lighting: 'baked',
    },
  },
  
  // Video Content
  visualizerExperiment: {
    id: 'content-005',
    creator_id: 'user-004',
    title: 'Matrix Code Visualizer',
    description: 'Hypnotic audio-reactive visualizer inspired by digital rain. Synesthesia made visual through algorithmic beauty.',
    content_type: 'video',
    file_url: '/videos/matrix-visualizer.mp4',
    thumbnail_url: '/images/thumbnails/matrix-viz.jpg',
    file_size: 89234567, // ~89MB
    mime_type: 'video/mp4',
    duration: 180, // 3:00
    is_public: true,
    is_premium: false,
    download_count: 567,
    view_count: 7890,
    like_count: 345,
    comment_count: 28,
    price: 0,
    commission_enabled: false,
    vibe_tags: ['visualizer', 'generative', 'matrix', 'audio-reactive', 'code'],
    created_at: '2025-01-13T20:15:00Z',
    updated_at: '2025-01-13T20:15:00Z',
    metadata: {
      resolution: '1920x1080',
      framerate: 60,
      codec: 'h264',
      audio_sync: true,
      interactive: false,
    },
  },
  
  // Sample Pack
  synthDrumKit: {
    id: 'content-006',
    creator_id: 'user-003',
    title: 'Vintage Synth Drum Kit',
    description: 'Collection of 48 vintage synthesizer drum samples. Recorded from classic Roland, Korg, and Yamaha machines.',
    content_type: 'sample_pack',
    file_url: '/packs/vintage-synth-drums.zip',
    thumbnail_url: '/images/thumbnails/synth-drums.jpg',
    file_size: 125678901, // ~125MB
    mime_type: 'application/zip',
    is_public: true,
    is_premium: true,
    download_count: 1789,
    view_count: 5432,
    like_count: 432,
    comment_count: 67,
    price: 24.99,
    commission_enabled: true,
    vibe_tags: ['samples', 'drums', 'vintage', 'analog', 'production'],
    created_at: '2025-01-09T13:20:00Z',
    updated_at: '2025-01-09T13:20:00Z',
    metadata: {
      sample_count: 48,
      formats: ['wav', 'aiff'],
      quality: '24bit/44.1khz',
      bpm_range: '80-140',
      categories: ['kick', 'snare', 'hihat', 'perc', 'fx'],
    },
  },
};

// Content collections/playlists
export const mockCollections = {
  vaporwaveEssentials: {
    id: 'collection-001',
    creator_id: 'user-001',
    title: 'Vaporwave Essentials',
    description: 'Curated collection of the finest vaporwave tracks for late-night vibes.',
    is_public: true,
    content_ids: ['content-001', 'content-003'],
    subscriber_count: 1234,
    play_count: 8765,
    created_at: '2025-01-05T12:00:00Z',
    updated_at: '2025-01-15T14:30:00Z',
  },
  
  cyberpunkArt: {
    id: 'collection-002',
    creator_id: 'user-002',
    title: 'Cyberpunk Art Gallery',
    description: 'Digital dystopia visualized. A collection of cyberpunk-inspired artworks.',
    is_public: true,
    content_ids: ['content-002', 'content-004'],
    subscriber_count: 567,
    play_count: 2345,
    created_at: '2025-01-07T16:30:00Z',
    updated_at: '2025-01-12T09:15:00Z',
  },
};

// Trending content for discovery testing
export const mockTrendingContent = [
  {
    content_id: 'content-001',
    trend_score: 95.8,
    category: 'audio',
    timeframe: '24h',
  },
  {
    content_id: 'content-003',
    trend_score: 87.2,
    category: 'audio',
    timeframe: '24h',
  },
  {
    content_id: 'content-002',
    trend_score: 79.4,
    category: 'visual',
    timeframe: '7d',
  },
];

// Content interaction analytics
export const mockContentAnalytics = {
  'content-001': {
    daily_plays: [45, 67, 89, 123, 98, 145, 167],
    geographic_data: {
      'US': 45,
      'UK': 23,
      'DE': 18,
      'JP': 14,
    },
    age_demographics: {
      '18-24': 35,
      '25-34': 42,
      '35-44': 18,
      '45+': 5,
    },
    listening_completion: 0.78, // 78% average completion
    peak_listening_hours: [20, 21, 22, 23, 0, 1], // 8PM-1AM
  },
};

// Helper functions
export const getContentById = (id: string) => {
  return Object.values(mockContent).find(content => content.id === id);
};

export const getContentByCreator = (creatorId: string) => {
  return Object.values(mockContent).filter(content => content.creator_id === creatorId);
};

export const getContentByType = (type: string) => {
  return Object.values(mockContent).filter(content => content.content_type === type);
};

export const getContentByTags = (tags: string[]) => {
  return Object.values(mockContent).filter(content => 
    content.vibe_tags.some(tag => tags.includes(tag))
  );
};

export const createTestContent = (overrides: Partial<typeof mockContent.synthwaveNights> = {}) => {
  return {
    ...mockContent.synthwaveNights,
    ...overrides,
    id: `test-content-${Date.now()}`,
  };
};
