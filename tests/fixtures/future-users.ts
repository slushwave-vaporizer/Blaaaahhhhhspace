// Future Users Mock Data with Advanced Features
// Building on existing users for roadmap features testing

import { mockUsers } from '../users';

// Enhanced user profiles for future features testing
export const futureUsers = {
  // AI-Enhanced Creator with Advanced Analytics
  aiCreatorPro: {
    id: 'future-user-001',
    email: 'ai.enhanced@neuralbeats.ai',
    profile: {
      username: 'AICreatorPro',
      display_name: 'Neural Beat Architect',
      bio: 'Pioneering AI-assisted music creation in the post-digital era. Crafting neural symphonies through machine-human collaboration.',
      avatar_url: '/images/avatars/ai-creator-pro.jpg',
      background_image_url: '/images/backgrounds/neural-network-grid.jpg',
      theme: 'ai-enhanced-neon',
      creator_type: 'ai_musician',
      is_verified: true,
      is_premium: true,
      ai_features_enabled: true,
      subscription_tier: 'creator_elite',
      profile_views: 45892,
      follower_count: 23450,
      following_count: 1250,
      total_earnings: 15847.25,
      reputation_score: 98,
      vibe_tags: ['ai-assisted', 'neural-beats', 'post-digital', 'experimental'],
      ai_preferences: {
        content_analysis_enabled: true,
        auto_tagging: true,
        mood_detection: true,
        style_recommendations: true,
        collaborative_ai: true,
      },
      discovery_settings: {
        algorithm_version: 'v3.0_neural',
        personalization_level: 'maximum',
        cross_platform_sync: true,
        predictive_recommendations: true,
      },
    },
  },

  // VR/WebXR Specialist
  vrArtistMaster: {
    id: 'future-user-002',
    email: 'vr.master@metaverse.space',
    profile: {
      username: 'VRMetaMaster',
      display_name: 'Metaverse Architect',
      bio: 'Building immersive worlds where art transcends reality. WebXR pioneer creating tomorrow\'s creative experiences today.',
      avatar_url: '/images/avatars/vr-artist-master.jpg',
      background_video_url: '/videos/vr-environment-preview.mp4',
      theme: 'immersive-reality',
      creator_type: 'vr_designer',
      is_verified: true,
      is_premium: true,
      vr_features_enabled: true,
      subscription_tier: 'immersive_creator',
      profile_views: 78234,
      follower_count: 34567,
      following_count: 2890,
      total_earnings: 28934.50,
      reputation_score: 96,
      vibe_tags: ['webxr', 'immersive', '3d-worlds', 'metaverse', 'vr-ready'],
      vr_capabilities: {
        headset_compatible: ['quest', 'vive', 'index', 'pico'],
        room_scale: true,
        hand_tracking: true,
        eye_tracking: false,
        haptic_feedback: true,
      },
      created_rooms: [
        {
          id: 'vr-room-001',
          name: 'Cyberpunk Gallery 2084',
          type: 'immersive_gallery',
          visitors_total: 15623,
          webxr_enabled: true,
        },
        {
          id: 'vr-room-002', 
          name: 'Neon Jam Space',
          type: 'collaborative_studio',
          visitors_total: 8945,
          webxr_enabled: true,
        },
      ],
    },
  },

  // Live Streaming Educator
  streamingGuru: {
    id: 'future-user-003',
    email: 'live.guru@streamwave.edu',
    profile: {
      username: 'StreamWaveGuru',
      display_name: 'Digital Wisdom Streamer',
      bio: 'Teaching creative skills through immersive live experiences. Bridging knowledge and creativity in the digital realm.',
      avatar_url: '/images/avatars/streaming-guru.jpg',
      background_image_url: '/images/backgrounds/streaming-setup.jpg',
      theme: 'educational-cyber',
      creator_type: 'educator_streamer',
      is_verified: true,
      is_premium: true,
      streaming_enabled: true,
      subscription_tier: 'learning_mentor',
      profile_views: 156789,
      follower_count: 89456,
      following_count: 3456,
      total_earnings: 45623.75,
      reputation_score: 99,
      vibe_tags: ['live-streaming', 'education', 'mentorship', 'workshops'],
      streaming_stats: {
        total_streams: 234,
        total_watch_hours: 45678,
        average_viewers: 234,
        peak_concurrent: 1890,
        courses_created: 45,
        completion_rate: 0.78,
      },
      learning_features: {
        workshops_enabled: true,
        mentorship_program: true,
        progress_tracking: true,
        certification_issuer: true,
        ai_tutor_assistant: true,
      },
    },
  },

  // Marketplace Pioneer
  marketplaceTycoon: {
    id: 'future-user-004',
    email: 'market.tycoon@digitalgoods.trade',
    profile: {
      username: 'DigitalTycoon',
      display_name: 'Marketplace Mogul',
      bio: 'Revolutionizing digital creative commerce. From samples to NFTs, building the future of creator economics.',
      avatar_url: '/images/avatars/marketplace-tycoon.jpg',
      background_image_url: '/images/backgrounds/digital-marketplace.jpg',
      theme: 'commerce-gold',
      creator_type: 'marketplace_seller',
      is_verified: true,
      is_premium: true,
      marketplace_seller: true,
      subscription_tier: 'commerce_elite',
      profile_views: 234567,
      follower_count: 45678,
      following_count: 1234,
      total_earnings: 125847.90,
      reputation_score: 97,
      vibe_tags: ['marketplace', 'digital-goods', 'nft', 'commerce', 'entrepreneur'],
      marketplace_stats: {
        products_sold: 1247,
        total_revenue: 125847.90,
        average_rating: 4.8,
        repeat_customers: 456,
        international_sales: true,
        payment_methods: ['crypto', 'paypal', 'stripe', 'bank_transfer'],
      },
      store_features: {
        advanced_analytics: true,
        inventory_management: true,
        international_shipping: true,
        bulk_pricing: true,
        affiliate_program: true,
        subscription_products: true,
      },
    },
  },

  // Mobile-First Creator
  mobileNative: {
    id: 'future-user-005',
    email: 'mobile.native@pocketstudio.app',
    profile: {
      username: 'MobileNative',
      display_name: 'Pocket Studio Artist',
      bio: 'Creating on-the-go masterpieces with mobile-first creativity tools. Art knows no boundaries in the palm of your hand.',
      avatar_url: '/images/avatars/mobile-native.jpg',
      background_image_url: '/images/backgrounds/mobile-studio.jpg',
      theme: 'mobile-sleek',
      creator_type: 'mobile_artist',
      is_verified: false,
      is_premium: true,
      mobile_optimized: true,
      subscription_tier: 'mobile_pro',
      profile_views: 67834,
      follower_count: 12456,
      following_count: 890,
      total_earnings: 8934.25,
      reputation_score: 85,
      vibe_tags: ['mobile-first', 'on-the-go', 'pocket-art', 'touch-interface'],
      mobile_features: {
        offline_mode: true,
        push_notifications: true,
        touch_optimized: true,
        gesture_controls: true,
        voice_commands: false,
        ar_camera_integration: true,
      },
      device_usage: {
        primary_device: 'smartphone',
        secondary_device: 'tablet',
        os_preference: 'cross_platform',
        screen_time_daily: '4.5_hours',
      },
    },
  },

  // Community Moderator with AI Tools
  aiModerator: {
    id: 'future-user-006',
    email: 'ai.mod@communityguardian.safe',
    profile: {
      username: 'AIGuardian',
      display_name: 'Community Sentinel',
      bio: 'Maintaining digital harmony through AI-assisted moderation. Protecting creative spaces while preserving artistic freedom.',
      avatar_url: '/images/avatars/ai-moderator.jpg',
      background_image_url: '/images/backgrounds/guardian-interface.jpg',
      theme: 'guardian-blue',
      creator_type: 'community_moderator',
      is_verified: true,
      is_premium: true,
      moderation_powers: true,
      subscription_tier: 'community_guardian',
      profile_views: 23456,
      follower_count: 5678,
      following_count: 345,
      total_earnings: 12000.00, // Paid position
      reputation_score: 100,
      vibe_tags: ['ai-moderation', 'community', 'safety', 'guardian'],
      moderation_tools: {
        ai_content_scanning: true,
        automated_flagging: true,
        sentiment_analysis: true,
        spam_detection: true,
        deepfake_detection: true,
        toxicity_filtering: true,
      },
      moderation_stats: {
        actions_taken: 2456,
        false_positive_rate: 0.02,
        community_satisfaction: 0.94,
        response_time_avg: '2.3_minutes',
      },
    },
  },
};

// Advanced user preferences for future features
export const futureUserPreferences = {
  'future-user-001': {
    ai_settings: {
      content_analysis_level: 'deep',
      auto_enhancement_enabled: true,
      style_suggestions: true,
      collaborative_ai_partner: true,
      learning_algorithm: 'neural_adaptive',
    },
    discovery_preferences: {
      algorithm_transparency: 'full',
      cross_platform_recommendations: true,
      real_time_trending: true,
      mood_based_discovery: true,
      serendipity_factor: 0.3,
    },
    monetization_preferences: {
      revenue_sharing_enabled: true,
      subscription_offerings: ['basic', 'premium', 'exclusive'],
      tip_jar_enabled: true,
      merchandise_store: true,
      live_streaming_monetization: true,
    },
  },
  
  'future-user-002': {
    vr_preferences: {
      default_room_type: 'immersive_gallery',
      comfort_settings: 'moderate',
      interaction_style: 'hand_tracking',
      audio_spatialization: true,
      haptic_feedback: true,
    },
    webxr_settings: {
      auto_enter_vr: false,
      fallback_mode: '3d_desktop',
      performance_optimization: 'balanced',
      cross_platform_compatibility: true,
    },
  },
  
  'future-user-003': {
    streaming_preferences: {
      default_quality: '1080p60',
      chat_moderation: 'ai_assisted',
      recording_enabled: true,
      multi_platform_streaming: true,
      interactive_features: ['polls', 'q_and_a', 'screen_share'],
    },
    learning_settings: {
      progress_tracking: 'detailed',
      certification_enabled: true,
      peer_review_system: true,
      adaptive_difficulty: true,
    },
  },
  
  'future-user-004': {
    marketplace_settings: {
      auto_pricing: false,
      inventory_alerts: true,
      international_shipping: true,
      currency_preferences: ['USD', 'EUR', 'BTC', 'ETH'],
      tax_calculation: 'automatic',
    },
    analytics_preferences: {
      detailed_reporting: true,
      predictive_insights: true,
      competitor_analysis: false,
      customer_behavior_tracking: true,
    },
  },
  
  'future-user-005': {
    mobile_preferences: {
      offline_sync: true,
      data_usage_optimization: 'aggressive',
      gesture_shortcuts: {
        'double_tap': 'like',
        'long_press': 'save',
        'swipe_left': 'next',
        'swipe_right': 'previous',
      },
      notification_types: [
        'new_follower',
        'collaboration_request',
        'trending_content',
        'live_stream_alert',
      ],
    },
    accessibility_settings: {
      font_size: 'large',
      high_contrast: false,
      voice_navigation: false,
      haptic_feedback: true,
      color_blind_support: false,
    },
  },
};

// Helper functions for future user testing
export const getFutureUserById = (id: string) => {
  return Object.values(futureUsers).find(user => user.id === id);
};

export const getFutureUserByFeature = (feature: string) => {
  const featureMap: Record<string, string[]> = {
    ai: ['future-user-001', 'future-user-006'],
    vr: ['future-user-002'],
    streaming: ['future-user-003'],
    marketplace: ['future-user-004'],
    mobile: ['future-user-005'],
    moderation: ['future-user-006'],
  };
  
  const userIds = featureMap[feature] || [];
  return userIds.map(id => getFutureUserById(id)).filter(Boolean);
};

export const createAdvancedTestUser = (features: string[] = [], overrides: any = {}) => {
  const baseUser = {
    ...futureUsers.aiCreatorPro,
    id: `advanced-test-${Date.now()}`,
    profile: {
      ...futureUsers.aiCreatorPro.profile,
      ...overrides.profile,
    },
  };
  
  // Enable specific features for testing
  features.forEach(feature => {
    switch (feature) {
      case 'ai':
        baseUser.profile.ai_features_enabled = true;
        break;
      case 'vr':
        baseUser.profile.vr_features_enabled = true;
        break;
      case 'streaming':
        baseUser.profile.streaming_enabled = true;
        break;
      case 'marketplace':
        baseUser.profile.marketplace_seller = true;
        break;
      case 'mobile':
        baseUser.profile.mobile_optimized = true;
        break;
    }
  });
  
  return baseUser;
};

// Subscription tiers for future monetization testing
export const subscriptionTiers = {
  basic: {
    name: 'Creative Explorer',
    price: 9.99,
    features: [
      'Basic AI assistance',
      'Standard upload limits',
      'Community access',
      'Basic analytics',
    ],
    ai_features: false,
    vr_features: false,
    streaming_quality: '720p',
    storage_limit: '10GB',
  },
  
  pro: {
    name: 'Digital Artisan',
    price: 24.99,
    features: [
      'Advanced AI tools',
      'VR room creation',
      'Live streaming',
      'Detailed analytics',
      'Priority support',
    ],
    ai_features: true,
    vr_features: true,
    streaming_quality: '1080p',
    storage_limit: '100GB',
  },
  
  elite: {
    name: 'Cyber Visionary',
    price: 49.99,
    features: [
      'Full AI collaboration suite',
      'WebXR experiences',
      '4K streaming',
      'Advanced marketplace tools',
      'White-label options',
      'Direct mentorship',
    ],
    ai_features: true,
    vr_features: true,
    streaming_quality: '4K',
    storage_limit: 'unlimited',
    marketplace_features: true,
    custom_branding: true,
  },
};
