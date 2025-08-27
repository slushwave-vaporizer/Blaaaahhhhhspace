// VR/WebXR Environments and Immersive Experience Mock Data
// For testing future virtual reality and immersive features

export const vrEnvironments = {
  // Immersive Art Gallery with WebXR
  cyberGallery2084: {
    id: 'vr-env-001',
    creator_id: 'future-user-002',
    name: 'Cyber Gallery 2084',
    description: 'An immersive cyberpunk art gallery featuring interactive holograms, spatial audio, and collaborative viewing experiences.',
    type: 'immersive_gallery',
    environment_size: 'large', // small, medium, large, infinite
    max_concurrent_users: 20,
    current_users: 7,
    total_visits: 15623,
    webxr_enabled: true,
    vr_headset_required: false,
    mobile_compatible: true,
    file_url: '/vr/environments/cyber-gallery-2084.glb',
    preview_images: [
      '/images/vr/cyber-gallery-preview-1.jpg',
      '/images/vr/cyber-gallery-preview-2.jpg',
      '/images/vr/cyber-gallery-preview-3.jpg',
    ],
    preview_video: '/videos/vr/cyber-gallery-walkthrough.mp4',
    file_size: 125678901, // ~125MB
    theme: 'cyberpunk-neon',
    accessibility_features: {
      subtitle_support: true,
      audio_descriptions: true,
      colorblind_support: true,
      motion_comfort_options: true,
      seated_experience: true,
    },
    technical_specs: {
      recommended_fps: 90,
      minimum_fps: 72,
      polygon_count: 2456789,
      texture_memory: '450MB',
      audio_sources: 32,
      dynamic_lighting: true,
      real_time_reflections: true,
      particle_systems: 15,
    },
    interaction_features: {
      hand_tracking: true,
      eye_tracking: false,
      gesture_recognition: true,
      voice_commands: true,
      haptic_feedback: true,
      spatial_audio: true,
    },
    comfort_settings: {
      locomotion_options: ['teleport', 'smooth', 'snap_turn', 'room_scale'],
      comfort_rating: 'comfortable',
      motion_sickness_mitigation: true,
      customizable_play_area: true,
    },
    artworks: [
      {
        id: 'vr-artwork-001',
        title: 'Digital Consciousness',
        artist: 'CyberGhost404',
        position: { x: -3, y: 1.5, z: 2 },
        rotation: { x: 0, y: 45, z: 0 },
        interactive: true,
        holographic: true,
        audio_reactive: true,
      },
      {
        id: 'vr-artwork-002',
        title: 'Neon Dreams',
        artist: 'NeonDreamer',
        position: { x: 3, y: 1.5, z: -2 },
        rotation: { x: 0, y: -30, z: 0 },
        interactive: false,
        holographic: false,
        audio_reactive: false,
      },
    ],
    collaborative_features: {
      voice_chat: true,
      shared_experiences: true,
      synchronized_viewing: true,
      group_tours: true,
      collaborative_annotation: true,
    },
    created_at: '2025-01-15T14:30:00Z',
    updated_at: '2025-01-20T09:15:00Z',
  },

  // Virtual Music Studio for Collaboration
  synthwaveStudioVR: {
    id: 'vr-env-002',
    creator_id: 'future-user-003',
    name: 'Synthwave Studio VR',
    description: 'A virtual music production studio where creators can jam together in real-time, complete with 3D instruments and spatial audio mixing.',
    type: 'collaborative_studio',
    environment_size: 'medium',
    max_concurrent_users: 8,
    current_users: 3,
    total_visits: 8945,
    webxr_enabled: true,
    vr_headset_required: false,
    mobile_compatible: false, // Requires more processing power
    file_url: '/vr/environments/synthwave-studio-vr.glb',
    preview_images: [
      '/images/vr/synthwave-studio-preview-1.jpg',
      '/images/vr/synthwave-studio-preview-2.jpg',
    ],
    preview_video: '/videos/vr/synthwave-studio-demo.mp4',
    file_size: 89456123,
    theme: 'retro-synthwave',
    technical_specs: {
      recommended_fps: 90,
      minimum_fps: 72,
      polygon_count: 1834567,
      texture_memory: '320MB',
      audio_sources: 48, // High for music production
      dynamic_lighting: true,
      real_time_reflections: false,
      particle_systems: 8,
      audio_latency: '<20ms', // Critical for music collaboration
    },
    music_features: {
      virtual_instruments: [
        {
          type: 'synthesizer',
          model: 'Moog Minimoog VR',
          position: { x: -2, y: 0.8, z: 1 },
          interactive: true,
          midi_compatible: true,
        },
        {
          type: 'drum_machine',
          model: 'Roland TR-808 VR',
          position: { x: 2, y: 0.8, z: 0 },
          interactive: true,
          midi_compatible: true,
        },
        {
          type: 'mixing_console',
          model: 'Virtual SSL Console',
          position: { x: 0, y: 1, z: -1 },
          interactive: true,
          real_time_mixing: true,
        },
      ],
      audio_processing: {
        real_time_effects: true,
        spatial_mixing: true,
        multi_track_recording: true,
        collaborative_editing: true,
        export_formats: ['wav', 'mp3', 'flac', 'stems'],
      },
      collaboration_tools: {
        synchronized_playback: true,
        individual_monitoring: true,
        chat_integration: true,
        screen_sharing: false, // Not applicable in VR
        session_recording: true,
      },
    },
    created_at: '2025-01-16T20:45:00Z',
    updated_at: '2025-01-18T16:20:00Z',
  },

  // Procedural Infinite World
  proceduralNeonForest: {
    id: 'vr-env-003',
    creator_id: 'future-user-002',
    name: 'Infinite Neon Forest',
    description: 'A procedurally generated infinite world where bioluminescent trees create an ever-changing landscape. Perfect for meditation and exploration.',
    type: 'procedural_world',
    environment_size: 'infinite',
    max_concurrent_users: 50,
    current_users: 23,
    total_visits: 34567,
    webxr_enabled: true,
    vr_headset_required: false,
    mobile_compatible: true,
    file_url: '/vr/environments/procedural-neon-forest-base.glb',
    preview_images: [
      '/images/vr/neon-forest-preview-1.jpg',
      '/images/vr/neon-forest-preview-2.jpg',
      '/images/vr/neon-forest-preview-3.jpg',
      '/images/vr/neon-forest-preview-4.jpg',
    ],
    preview_video: '/videos/vr/neon-forest-flight.mp4',
    file_size: 67890123, // Base environment, procedural content generated in real-time
    theme: 'bioluminescent-nature',
    procedural_features: {
      generation_algorithm: 'L-system_trees',
      seed_based: true,
      user_influenced: true, // User presence affects generation
      real_time_generation: true,
      infinite_exploration: true,
      biome_variety: [
        'glowing_mushroom_groves',
        'crystal_clearings',
        'floating_islands',
        'aurora_valleys',
      ],
    },
    environmental_systems: {
      weather_system: true,
      day_night_cycle: true,
      seasonal_changes: true,
      wildlife_simulation: true,
      physics_interaction: true,
      growth_simulation: true, // Trees and plants grow over time
    },
    social_features: {
      shared_world: true,
      persistent_changes: false, // World resets to maintain infinite generation
      player_markers: true,
      voice_chat: true,
      gesture_communication: true,
      photo_mode: true,
    },
    wellness_features: {
      meditation_mode: true,
      guided_experiences: true,
      binaural_audio: true,
      stress_relief_metrics: true,
      mindfulness_exercises: true,
    },
    created_at: '2025-01-17T11:30:00Z',
    updated_at: '2025-01-19T14:45:00Z',
  },

  // Educational VR Classroom
  virtualLearningSpace: {
    id: 'vr-env-004',
    creator_id: 'future-user-003',
    name: 'Holographic Learning Amphitheater',
    description: 'A futuristic learning environment where students can attend lectures, workshops, and interactive demonstrations in immersive 3D.',
    type: 'educational_space',
    environment_size: 'large',
    max_concurrent_users: 100,
    current_users: 45,
    total_visits: 12456,
    webxr_enabled: true,
    vr_headset_required: false,
    mobile_compatible: true,
    file_url: '/vr/environments/learning-amphitheater.glb',
    preview_images: [
      '/images/vr/amphitheater-preview-1.jpg',
      '/images/vr/amphitheater-preview-2.jpg',
    ],
    preview_video: '/videos/vr/learning-space-tour.mp4',
    file_size: 78901234,
    theme: 'futuristic-academy',
    educational_features: {
      holographic_presentations: true,
      3d_model_interaction: true,
      collaborative_whiteboards: true,
      breakout_rooms: true,
      recording_capability: true,
      live_streaming: true,
      screen_sharing: true,
      interactive_simulations: true,
    },
    classroom_management: {
      raise_hand_system: true,
      mute_controls: true,
      attention_tracking: true,
      engagement_metrics: true,
      quiz_integration: true,
      attendance_tracking: true,
    },
    accessibility_features: {
      closed_captions: true,
      sign_language_interpreter: true,
      multiple_languages: true,
      seated_accessible: true,
      visual_impairment_support: true,
      hearing_impairment_support: true,
    },
    created_at: '2025-01-18T08:00:00Z',
    updated_at: '2025-01-20T12:30:00Z',
  },

  // Marketplace Showcase Environment
  virtualMarketplace: {
    id: 'vr-env-005',
    creator_id: 'future-user-004',
    name: 'Digital Bazaar VR',
    description: 'A bustling virtual marketplace where creators can showcase and sell their digital goods in immersive storefronts.',
    type: 'commerce_environment',
    environment_size: 'large',
    max_concurrent_users: 150,
    current_users: 67,
    total_visits: 45678,
    webxr_enabled: true,
    vr_headset_required: false,
    mobile_compatible: true,
    file_url: '/vr/environments/digital-bazaar.glb',
    preview_images: [
      '/images/vr/bazaar-preview-1.jpg',
      '/images/vr/bazaar-preview-2.jpg',
      '/images/vr/bazaar-preview-3.jpg',
    ],
    preview_video: '/videos/vr/marketplace-walkthrough.mp4',
    file_size: 156789012,
    theme: 'digital-commerce',
    commerce_features: {
      virtual_storefronts: true,
      product_demonstrations: true,
      try_before_buy: true,
      payment_integration: true,
      shopping_cart: true,
      wishlist_system: true,
      social_shopping: true,
      reviews_and_ratings: true,
    },
    vendor_areas: [
      {
        vendor_id: 'future-user-004',
        storefront_name: 'Digital Tycoon\'s Vault',
        location: { x: -10, y: 0, z: 5 },
        size: 'large',
        theme: 'luxury-gold',
        products_displayed: 25,
      },
      {
        vendor_id: 'future-user-001',
        storefront_name: 'AI Creator\'s Workshop',
        location: { x: 10, y: 0, z: -5 },
        size: 'medium',
        theme: 'tech-neon',
        products_displayed: 15,
      },
    ],
    social_commerce: {
      group_shopping: true,
      friend_recommendations: true,
      social_proof: true,
      influencer_showcases: true,
      live_shopping_events: true,
    },
    created_at: '2025-01-19T15:20:00Z',
    updated_at: '2025-01-21T10:45:00Z',
  },
};

// WebXR Device Compatibility Data
export const webxrDeviceSupport = {
  desktop_browsers: {
    chrome: {
      version_required: '90+',
      webxr_support: 'full',
      performance: 'excellent',
      features: ['immersive-vr', 'immersive-ar', 'hand-tracking'],
    },
    firefox: {
      version_required: '98+',
      webxr_support: 'good',
      performance: 'good',
      features: ['immersive-vr', 'immersive-ar'],
    },
    edge: {
      version_required: '90+',
      webxr_support: 'full',
      performance: 'excellent',
      features: ['immersive-vr', 'immersive-ar', 'hand-tracking'],
    },
  },
  
  vr_headsets: {
    meta_quest: {
      models: ['Quest 2', 'Quest 3', 'Quest Pro'],
      compatibility: 'native',
      performance: 'excellent',
      special_features: {
        hand_tracking: true,
        eye_tracking: false, // Quest 3 and Pro only
        passthrough: true,
        guardian_system: true,
      },
    },
    valve_index: {
      models: ['Index'],
      compatibility: 'steamvr',
      performance: 'excellent',
      special_features: {
        finger_tracking: true,
        base_stations: true,
        high_refresh_rate: true,
      },
    },
    htc_vive: {
      models: ['Vive', 'Vive Pro', 'Vive Pro 2'],
      compatibility: 'steamvr',
      performance: 'good',
      special_features: {
        lighthouse_tracking: true,
        room_scale: true,
      },
    },
    pico: {
      models: ['Pico 4', 'Pico 4 Enterprise'],
      compatibility: 'native',
      performance: 'good',
      special_features: {
        hand_tracking: true,
        eye_tracking: true,
      },
    },
  },
  
  mobile_devices: {
    android: {
      version_required: 'Android 7+',
      webxr_support: 'limited',
      performance: 'variable',
      recommended_specs: {
        ram: '6GB+',
        gpu: 'Adreno 640+ / Mali G76+',
        cpu: 'Snapdragon 855+ / Exynos 9820+',
      },
    },
    ios: {
      version_required: 'iOS 14+',
      webxr_support: 'limited',
      performance: 'good',
      recommended_specs: {
        device: 'iPhone 12+ / iPad Pro',
        a_series_chip: 'A14+',
      },
    },
  },
};

// VR Performance Metrics
export const vrPerformanceMetrics = {
  'vr-env-001': {
    average_fps: 87,
    frame_drops: 0.02,
    loading_time: '3.2s',
    memory_usage: '450MB',
    gpu_utilization: 0.78,
    cpu_utilization: 0.45,
    network_bandwidth: '5.2Mbps',
    latency: '18ms',
    user_comfort_score: 0.94,
  },
  
  'vr-env-002': {
    average_fps: 90,
    frame_drops: 0.01,
    loading_time: '2.8s',
    memory_usage: '320MB',
    gpu_utilization: 0.72,
    cpu_utilization: 0.68, // Higher due to audio processing
    network_bandwidth: '8.7Mbps', // Higher for real-time audio
    latency: '12ms', // Lower latency for music
    audio_latency: '8ms',
    user_comfort_score: 0.96,
  },
  
  'vr-env-003': {
    average_fps: 85,
    frame_drops: 0.03,
    loading_time: '1.5s', // Fast initial load
    memory_usage: '280MB',
    gpu_utilization: 0.65,
    cpu_utilization: 0.82, // High due to procedural generation
    network_bandwidth: '2.1Mbps',
    latency: '25ms',
    procedural_generation_time: '150ms',
    user_comfort_score: 0.98, // Very comfortable
  },
};

// VR User Behavior Analytics
export const vrUserBehavior = {
  session_metrics: {
    average_session_duration: '18.5_minutes',
    return_visit_rate: 0.67,
    comfort_break_frequency: '12_minutes',
    interaction_rate: 0.89,
    social_interaction_rate: 0.34,
  },
  
  interaction_heatmaps: {
    'vr-env-001': {
      hotspots: [
        { position: { x: -3, y: 1.5, z: 2 }, interactions: 1247 },
        { position: { x: 0, y: 1, z: 0 }, interactions: 2345 },
        { position: { x: 5, y: 1.5, z: -3 }, interactions: 987 },
      ],
      cold_spots: [
        { position: { x: -8, y: 2, z: 8 }, interactions: 23 },
      ],
    },
  },
  
  comfort_metrics: {
    motion_sickness_reports: 0.03,
    eye_strain_reports: 0.05,
    fatigue_reports: 0.08,
    overall_satisfaction: 0.92,
    recommendation_rate: 0.87,
  },
};

// Helper functions
export const getVREnvironmentById = (id: string) => {
  return Object.values(vrEnvironments).find(env => env.id === id);
};

export const getVREnvironmentsByType = (type: string) => {
  return Object.values(vrEnvironments).filter(env => env.type === type);
};

export const getVREnvironmentsByCreator = (creatorId: string) => {
  return Object.values(vrEnvironments).filter(env => env.creator_id === creatorId);
};

export const checkWebXRCompatibility = (userAgent: string, device: string) => {
  // Mock compatibility check
  const compatibilityScore = {
    webxr_support: true,
    performance_rating: 'good',
    recommended_settings: {
      quality: 'medium',
      fps_target: 72,
      comfort_mode: true,
    },
    limitations: [],
  };
  
  return compatibilityScore;
};

export const simulateVRSession = (environmentId: string, userId: string, duration: number = 900) => {
  const environment = getVREnvironmentById(environmentId);
  if (!environment) return null;
  
  return {
    session_id: `vr-session-${Date.now()}`,
    environment_id: environmentId,
    user_id: userId,
    start_time: new Date().toISOString(),
    duration_seconds: duration,
    interactions: Math.floor(Math.random() * 50) + 10,
    comfort_score: 0.9 + Math.random() * 0.1,
    performance_metrics: {
      average_fps: 85 + Math.random() * 10,
      frame_drops: Math.random() * 0.05,
      latency: 15 + Math.random() * 15,
    },
    social_interactions: Math.floor(Math.random() * 5),
    achievements_unlocked: [],
    session_rating: 4 + Math.random(),
  };
};
