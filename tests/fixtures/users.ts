// Mock user data with YourSpace vibe-centric themes

export const mockUsers = {
  // Vaporwave Artist
  neonDreamer: {
    id: 'user-001',
    email: 'neon.dreamer@synthwave.net',
    profile: {
      username: 'NeonDreamer',
      display_name: 'Neon Dreamer',
      bio: 'Creating ethereal soundscapes in the digital void. Vaporwave producer & visual artist exploring the intersection of nostalgia and future.',
      avatar_url: '/images/avatars/neon-dreamer.jpg',
      background_image_url: '/images/backgrounds/synthwave-city.jpg',
      theme: 'neon-city',
      creator_type: 'musician',
      is_verified: true,
      is_premium: true,
      profile_views: 15420,
      follower_count: 8392,
      following_count: 245,
      total_earnings: 2847.50,
      reputation_score: 92,
      vibe_tags: ['vaporwave', 'synthwave', 'chillwave', 'retrowave'],
      custom_css: `
        .profile-container {
          background: linear-gradient(135deg, #ff006e, #8338ec, #3a86ff);
          backdrop-filter: blur(10px);
        }
        .content-grid {
          filter: drop-shadow(0 0 20px rgba(255, 0, 110, 0.3));
        }
      `,
    },
  },
  
  // Cyberpunk Digital Artist
  cyberGhost: {
    id: 'user-002', 
    email: 'cyber.ghost@neuralnets.dev',
    profile: {
      username: 'CyberGhost404',
      display_name: 'Cyber Ghost',
      bio: 'Digital anarchist crafting glitch art and cyberpunk aesthetics. Exploring the boundaries between human and machine creativity.',
      avatar_url: '/images/avatars/cyber-ghost.jpg',
      background_image_url: '/images/backgrounds/cyber-city.jpg',
      theme: 'cyber-blue',
      creator_type: 'visual_artist',
      is_verified: true,
      is_premium: false,
      profile_views: 9876,
      follower_count: 4567,
      following_count: 123,
      total_earnings: 1234.75,
      reputation_score: 88,
      vibe_tags: ['cyberpunk', 'glitch', 'digital-art', 'neon'],
      custom_css: `
        .profile-container {
          background: linear-gradient(90deg, #00f5ff, #0077ff, #004cff);
          border: 1px solid rgba(0, 245, 255, 0.3);
        }
      `,
    },
  },
  
  // Retro-wave Producer
  synthMaster: {
    id: 'user-003',
    email: 'synth.master@retrowave.fm',
    profile: {
      username: 'SynthMaster85',
      display_name: 'Synth Master',
      bio: 'Analog synthesizer enthusiast bringing 80s vibes to the modern world. Producer, composer, and vintage gear collector.',
      avatar_url: '/images/avatars/synth-master.jpg',
      background_video_url: '/videos/retro-grid.mp4',
      theme: 'retro-wave',
      creator_type: 'producer',
      is_verified: false,
      is_premium: true,
      profile_views: 12345,
      follower_count: 6789,
      following_count: 456,
      total_earnings: 3456.20,
      reputation_score: 85,
      vibe_tags: ['retrowave', 'synthwave', 'analog', 'vintage'],
    },
  },
  
  // Matrix-style Coder
  codeMatrix: {
    id: 'user-004',
    email: 'the.matrix@green.code',
    profile: {
      username: 'CodeMatrix',
      display_name: 'The Matrix',
      bio: 'Reality is just poorly written code. Creating algorithmic art and generative music through the digital matrix.',
      avatar_url: '/images/avatars/matrix-avatar.jpg',
      background_image_url: '/images/backgrounds/matrix-rain.gif',
      theme: 'matrix-green',
      creator_type: 'developer',
      is_verified: true,
      is_premium: true,
      profile_views: 20123,
      follower_count: 11456,
      following_count: 789,
      total_earnings: 5678.90,
      reputation_score: 95,
      vibe_tags: ['algorithmic', 'generative', 'code-art', 'matrix'],
    },
  },
  
  // Collaborative Artist
  collabCreator: {
    id: 'user-005',
    email: 'collab.creator@collective.space',
    profile: {
      username: 'CollabCreator',
      display_name: 'Collaboration Creator',
      bio: 'Building bridges between artists in the digital realm. Specializing in multi-artist collaborations and remix culture.',
      avatar_url: '/images/avatars/collab-creator.jpg',
      background_image_url: '/images/backgrounds/network-nodes.jpg',
      theme: 'cyber-blue',
      creator_type: 'collaborator',
      is_verified: false,
      is_premium: false,
      profile_views: 7890,
      follower_count: 3456,
      following_count: 1234,
      total_earnings: 890.45,
      reputation_score: 78,
      vibe_tags: ['collaboration', 'remix', 'community', 'networking'],
    },
  },
};

// Authentication states for testing
export const mockAuthStates = {
  loggedOut: {
    user: null,
    loading: false,
  },
  
  loading: {
    user: null,
    loading: true,
  },
  
  loggedInBasic: {
    user: {
      id: mockUsers.neonDreamer.id,
      email: mockUsers.neonDreamer.email,
      ...mockUsers.neonDreamer.profile,
    },
    loading: false,
  },
  
  loggedInPremium: {
    user: {
      id: mockUsers.cyberGhost.id,
      email: mockUsers.cyberGhost.email,
      ...mockUsers.cyberGhost.profile,
    },
    loading: false,
  },
};

// User interaction patterns for testing
export const mockUserInteractions = {
  likes: [
    { user_id: 'user-001', content_id: 'content-001', created_at: '2025-01-15T10:30:00Z' },
    { user_id: 'user-001', content_id: 'content-002', created_at: '2025-01-15T10:35:00Z' },
    { user_id: 'user-002', content_id: 'content-001', created_at: '2025-01-15T11:00:00Z' },
  ],
  
  follows: [
    { follower_id: 'user-001', following_id: 'user-002', created_at: '2025-01-10T09:00:00Z' },
    { follower_id: 'user-002', following_id: 'user-003', created_at: '2025-01-12T14:30:00Z' },
    { follower_id: 'user-003', following_id: 'user-001', created_at: '2025-01-14T16:45:00Z' },
  ],
  
  comments: [
    {
      id: 'comment-001',
      user_id: 'user-002',
      content_id: 'content-001',
      text: 'This vaporwave track hits different! 🌌💾 The synthesizer work is absolutely ethereal.',
      created_at: '2025-01-15T12:00:00Z',
    },
    {
      id: 'comment-002',
      user_id: 'user-003',
      content_id: 'content-001',
      text: 'Love the nostalgic vibes here. Reminds me of late-night drives through neon-lit streets.',
      created_at: '2025-01-15T12:30:00Z',
    },
  ],
};

// User preferences for testing personalization
export const mockUserPreferences = {
  'user-001': {
    theme: 'neon-city',
    audio_quality: 'high',
    auto_play: true,
    notifications: {
      likes: true,
      comments: true,
      follows: true,
      collaborations: true,
    },
    discovery: {
      genres: ['vaporwave', 'synthwave', 'chillwave'],
      exclude_genres: ['heavy-metal', 'hardcore'],
      similar_artists: true,
      trending: true,
    },
    privacy: {
      profile_visibility: 'public',
      analytics_sharing: true,
      message_requests: 'followers',
    },
  },
  
  'user-002': {
    theme: 'cyber-blue',
    audio_quality: 'medium',
    auto_play: false,
    notifications: {
      likes: false,
      comments: true,
      follows: true,
      collaborations: true,
    },
    discovery: {
      genres: ['cyberpunk', 'industrial', 'glitch'],
      exclude_genres: ['pop', 'country'],
      similar_artists: false,
      trending: false,
    },
    privacy: {
      profile_visibility: 'public',
      analytics_sharing: false,
      message_requests: 'none',
    },
  },
};

// Export helper functions
export const getUserById = (id: string) => {
  return Object.values(mockUsers).find(user => user.id === id);
};

export const getUserByUsername = (username: string) => {
  return Object.values(mockUsers).find(user => user.profile.username === username);
};

export const createTestUser = (overrides: Partial<typeof mockUsers.neonDreamer> = {}) => {
  return {
    ...mockUsers.neonDreamer,
    ...overrides,
    id: `test-user-${Date.now()}`,
  };
};
