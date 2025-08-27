// Marketplace & NFT Data with Vaporwave/Cyberpunk Aesthetic
// For testing advanced marketplace, blockchain integration, and monetization features

export const marketplaceData = {
  // Digital Art & NFT Collections
  nftCollections: {
    synthWave2084: {
      id: 'nft-collection-001',
      creator_id: 'future-user-001',
      name: 'SynthWave 2084',
      description: 'A collection of AI-generated synthwave artworks capturing the essence of neo-Tokyo nightscapes',
      collection_type: 'digital_art',
      blockchain: 'polygon',
      contract_address: '0x742d35Cc6235C4532E6dE53DB5D814FE',
      total_supply: 888,
      minted_count: 234,
      floor_price: 0.15, // ETH
      total_volume: 45.7, // ETH
      royalty_percentage: 7.5,
      featured_image: '/images/nft/synthwave-2084-featured.jpg',
      preview_images: [
        '/images/nft/synthwave-001.jpg',
        '/images/nft/synthwave-002.jpg',
        '/images/nft/synthwave-003.jpg',
      ],
      categories: ['digital_art', 'generative', 'synthwave', 'cyberpunk'],
      verified: true,
      trending: true,
      metadata: {
        animation_url: '/animations/nft/synthwave-collection-preview.mp4',
        traits: {
          'Color Palette': ['Neon Pink', 'Electric Blue', 'Sunset Orange'],
          'Style': 'Synthwave',
          'AI Model': 'Neural Dream v2.1',
          'Resolution': '4K Ultra',
        },
      },
    },

    cyberpunkSamples: {
      id: 'nft-collection-002',
      creator_id: 'future-user-003',
      name: 'Cyberpunk Sample Vault',
      description: 'Exclusive sample packs and loops from the underground electronic music scene of Neo-Shibuya',
      collection_type: 'audio_nft',
      blockchain: 'ethereum',
      contract_address: '0x892f47Dd9254E6bF9875C3DB83B2a2C1',
      total_supply: 500,
      minted_count: 189,
      floor_price: 0.08,
      total_volume: 23.4,
      royalty_percentage: 10.0,
      featured_image: '/images/nft/cyberpunk-samples-featured.jpg',
      audio_preview: '/audio/nft/cyberpunk-sample-preview.wav',
      categories: ['audio', 'samples', 'electronic', 'underground'],
      verified: true,
      trending: false,
      utility_features: {
        commercial_license: true,
        stem_separation: true,
        remix_rights: true,
        collaboration_access: true,
      },
    },
  },

  // Individual Marketplace Items
  marketplaceItems: {
    neonDreamscape: {
      id: 'item-001',
      seller_id: 'future-user-002',
      title: 'Neon Dreamscape #147',
      description: 'A mesmerizing digital artwork featuring cascading neon waterfalls in a cyberpunk metropolis',
      category: 'digital_art',
      subcategory: 'generative_art',
      price: 0.25, // ETH
      currency: 'ETH',
      fiat_price: 425.50, // USD equivalent
      is_auction: false,
      is_nft: true,
      blockchain: 'polygon',
      token_id: '147',
      file_format: 'MP4',
      resolution: '3840x2160',
      file_size: 89456123, // ~89MB
      duration: 15, // seconds for animated pieces
      preview_url: '/images/marketplace/neon-dreamscape-147.jpg',
      full_url: '/videos/marketplace/neon-dreamscape-147.mp4',
      tags: ['neon', 'cyberpunk', 'animation', 'dreamscape', 'futuristic'],
      created_at: '2024-11-15T10:30:00Z',
      views: 3847,
      likes: 267,
      favorited: 89,
      verified: true,
      exclusive: false,
      limited_edition: true,
      edition_number: 147,
      total_editions: 500,
    },

    retroSynthPack: {
      id: 'item-002',
      seller_id: 'future-user-004',
      title: 'RetroSynth Producer Pack',
      description: 'Professional-grade sample pack featuring authentic 80s synthesizer sounds and drum machines',
      category: 'audio',
      subcategory: 'sample_packs',
      price: 15.99,
      currency: 'USD',
      is_auction: false,
      is_nft: false,
      instant_download: true,
      commercial_license: true,
      file_format: 'WAV/MIDI',
      total_samples: 128,
      total_size: 524288000, // ~524MB
      bpm_range: '80-140',
      preview_tracks: [
        '/audio/marketplace/retrosynth-preview-1.wav',
        '/audio/marketplace/retrosynth-preview-2.wav',
        '/audio/marketplace/retrosynth-preview-3.wav',
      ],
      tags: ['retro', 'synth', 'samples', 'producer', '80s', 'analog'],
      created_at: '2024-11-10T14:20:00Z',
      downloads: 1247,
      rating: 4.8,
      reviews: 89,
      verified: true,
    },

    holographicVinyl: {
      id: 'item-003',
      seller_id: 'future-user-005',
      title: 'Limited Edition Holographic Vinyl - Neon Nights EP',
      description: 'Physical holographic vinyl record with embedded NFC chip for digital unlocks',
      category: 'physical_goods',
      subcategory: 'vinyl',
      price: 89.99,
      currency: 'USD',
      is_physical: true,
      shipping_required: true,
      in_stock: 47,
      total_stock: 100,
      is_limited_edition: true,
      edition_number: null, // Will be assigned on purchase
      digital_unlocks: {
        full_album_wav: true,
        exclusive_remixes: true,
        behind_scenes_content: true,
        virtual_concert_access: true,
      },
      shipping_options: [
        { method: 'standard', price: 5.99, days: '7-10' },
        { method: 'express', price: 15.99, days: '3-5' },
        { method: 'overnight', price: 29.99, days: '1-2' },
      ],
      preview_image: '/images/marketplace/holographic-vinyl.jpg',
      unboxing_video: '/videos/marketplace/vinyl-unboxing.mp4',
      tags: ['vinyl', 'physical', 'holographic', 'limited', 'nfc', 'collectible'],
      created_at: '2024-11-08T09:15:00Z',
      pre_orders: 53,
      rating: 4.9,
      reviews: 23,
    },
  },

  // Subscription Services
  subscriptionServices: {
    creatorStudioPro: {
      id: 'sub-service-001',
      provider_id: 'platform-official',
      name: 'Creator Studio Pro',
      description: 'Advanced creation tools with AI assistance, unlimited storage, and premium analytics',
      tier: 'professional',
      price_monthly: 29.99,
      price_yearly: 299.99, // 2 months free
      currency: 'USD',
      trial_days: 14,
      features: [
        'Unlimited cloud storage',
        'AI-powered content analysis',
        'Advanced analytics dashboard',
        'Priority customer support',
        'Exclusive sample libraries',
        'Collaboration tools',
        'White-label options',
        'API access',
      ],
      subscriber_count: 12847,
      rating: 4.7,
      reviews: 2156,
      category: 'creator_tools',
    },

    neuralBeatsUnlimited: {
      id: 'sub-service-002',
      provider_id: 'future-user-001',
      name: 'Neural Beats Unlimited',
      description: 'Access to exclusive AI-generated music library with commercial licensing',
      tier: 'premium',
      price_monthly: 19.99,
      price_yearly: 199.99,
      currency: 'USD',
      trial_days: 7,
      features: [
        'Unlimited AI music generation',
        'Commercial use rights',
        'Custom mood/genre requests',
        'Stem separation tools',
        'Early access to new models',
        'Personal music assistant AI',
      ],
      subscriber_count: 8934,
      rating: 4.9,
      reviews: 1445,
      category: 'ai_music',
    },
  },

  // Virtual Services & Experiences
  virtualServices: {
    vrConcertExperience: {
      id: 'vr-service-001',
      creator_id: 'future-user-002',
      name: 'Immersive VR Concert: Synthwave Odyssey',
      description: 'Live virtual reality concert experience with interactive elements and audience participation',
      service_type: 'live_experience',
      price: 25.00,
      currency: 'USD',
      duration_minutes: 90,
      max_attendees: 500,
      current_bookings: 347,
      vr_required: false, // Also accessible on desktop/mobile
      upcoming_shows: [
        {
          id: 'show-001',
          date: '2024-12-15T20:00:00Z',
          timezone: 'UTC',
          spots_available: 153,
        },
        {
          id: 'show-002', 
          date: '2024-12-22T21:00:00Z',
          timezone: 'UTC',
          spots_available: 245,
        },
      ],
      features: [
        'Spatial audio experience',
        'Interactive light shows',
        'Audience voting on setlist',
        'Meet & greet after show',
        'Exclusive merchandise unlocks',
      ],
      preview_video: '/videos/services/vr-concert-preview.mp4',
      rating: 4.8,
      reviews: 234,
    },

    personalizedAIMentor: {
      id: 'ai-service-001',
      creator_id: 'future-user-006',
      name: '1-on-1 AI Music Production Mentor',
      description: 'Personalized AI mentorship sessions for music production with real-time feedback',
      service_type: 'mentorship',
      price: 79.99,
      currency: 'USD',
      session_duration: 60, // minutes
      package_sessions: 1,
      booking_method: 'calendar', // instant, calendar, request
      available_slots: [
        '2024-11-25T10:00:00Z',
        '2024-11-25T14:00:00Z',
        '2024-11-26T16:00:00Z',
      ],
      mentor_ai_features: [
        'Real-time audio analysis',
        'Personalized learning path',
        'Custom exercise generation',
        'Progress tracking',
        'Style adaptation',
      ],
      completed_sessions: 156,
      rating: 4.9,
      reviews: 87,
    },
  },

  // Marketplace Analytics
  marketplaceStats: {
    overview: {
      total_items: 15847,
      total_creators: 3456,
      total_volume_eth: 2847.6,
      total_volume_usd: 4_825_490.75,
      average_price_eth: 0.18,
      average_price_usd: 305.20,
      trending_categories: [
        { name: 'digital_art', growth: 23.4 },
        { name: 'audio_nft', growth: 18.7 },
        { name: 'virtual_experiences', growth: 31.2 },
        { name: 'physical_collectibles', growth: 15.8 },
      ],
      top_selling_genres: [
        'synthwave',
        'cyberpunk',
        'vaporwave',
        'lo-fi',
        'ambient',
      ],
    },

    recentTransactions: [
      {
        id: 'tx-001',
        item_id: 'item-001',
        buyer_id: 'buyer-001',
        seller_id: 'future-user-002',
        price: 0.25,
        currency: 'ETH',
        timestamp: '2024-11-20T15:30:00Z',
        transaction_hash: '0x742d35Cc6235C4532E6dE53DB5D814FE892f47Dd',
        gas_fee: 0.0023,
      },
      {
        id: 'tx-002',
        item_id: 'item-002',
        buyer_id: 'buyer-002',
        seller_id: 'future-user-004',
        price: 15.99,
        currency: 'USD',
        timestamp: '2024-11-20T14:15:00Z',
        payment_method: 'stripe',
        transaction_fee: 0.79,
      },
    ],
  },

  // Creator Earnings & Royalties
  creatorEarnings: {
    topEarners: [
      {
        creator_id: 'future-user-001',
        username: 'AICreatorPro',
        monthly_earnings: 8947.25,
        total_earnings: 67234.80,
        primary_category: 'ai_music',
        items_sold: 234,
        royalties_earned: 1847.60,
      },
      {
        creator_id: 'future-user-002',
        username: 'VRArtistMaster',
        monthly_earnings: 6523.40,
        total_earnings: 45891.20,
        primary_category: 'vr_experiences',
        items_sold: 156,
        royalties_earned: 2134.75,
      },
    ],

    royaltyStreams: [
      {
        id: 'royalty-001',
        creator_id: 'future-user-001',
        item_id: 'item-001',
        original_sale: 0.25,
        resale_count: 7,
        total_royalties: 0.13125, // 7.5% on each resale
        last_payment: '2024-11-18T12:00:00Z',
        next_payment: '2024-12-18T12:00:00Z',
        payment_frequency: 'monthly',
      },
    ],
  },

  // Market Trends & Predictions
  marketTrends: {
    priceAnalytics: {
      eth_price_usd: 1695.25,
      gas_price_gwei: 35.7,
      marketplace_fee: 2.5, // percentage
      creator_royalty_average: 8.2, // percentage
    },

    emergingTrends: [
      {
        trend: 'AI-Generated Music NFTs',
        growth_rate: 156.3,
        confidence: 0.89,
        projected_volume: 125000,
      },
      {
        trend: 'Interactive VR Experiences',
        growth_rate: 98.7,
        confidence: 0.92,
        projected_volume: 87500,
      },
      {
        trend: 'Phygital Collectibles',
        growth_rate: 78.2,
        confidence: 0.76,
        projected_volume: 56000,
      },
    ],
  },
};

// Utility functions for marketplace testing
export const getItemById = (id: string) => {
  return Object.values(marketplaceData.marketplaceItems).find(item => item.id === id);
};

export const getItemsByCategory = (category: string) => {
  return Object.values(marketplaceData.marketplaceItems).filter(item => item.category === category);
};

export const getCreatorEarnings = (creatorId: string) => {
  return marketplaceData.creatorEarnings.topEarners.find(creator => creator.creator_id === creatorId);
};

export const generateMockTransaction = (itemId: string, buyerId: string, sellerId: string) => {
  const item = getItemById(itemId);
  if (!item) return null;
  
  return {
    id: `tx-${Date.now()}`,
    item_id: itemId,
    buyer_id: buyerId,
    seller_id: sellerId,
    price: item.price,
    currency: item.currency,
    timestamp: new Date().toISOString(),
    transaction_hash: item.is_nft ? `0x${Math.random().toString(16).substr(2, 32)}` : null,
    gas_fee: item.is_nft ? Math.random() * 0.01 : null,
    payment_method: item.is_nft ? 'blockchain' : 'stripe',
    transaction_fee: !item.is_nft ? item.price * 0.029 + 0.30 : null, // Stripe fees
  };
};

export const mockMarketplaceSearch = (query: string, filters: any = {}) => {
  const allItems = Object.values(marketplaceData.marketplaceItems);
  
  return allItems.filter(item => {
    const matchesQuery = item.title.toLowerCase().includes(query.toLowerCase()) ||
                        item.description.toLowerCase().includes(query.toLowerCase()) ||
                        item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
    
    const matchesCategory = !filters.category || item.category === filters.category;
    const matchesPriceRange = !filters.maxPrice || item.fiat_price <= filters.maxPrice;
    const matchesType = !filters.nftOnly || item.is_nft === true;
    
    return matchesQuery && matchesCategory && matchesPriceRange && matchesType;
  });
};

// Test data for different marketplace scenarios
export const testScenarios = {
  // High-value NFT sale
  premiumNftSale: {
    item: marketplaceData.marketplaceItems.neonDreamscape,
    buyer: 'premium-collector-001',
    expectedGasFee: 0.0045,
    expectedRoyalty: 0.01875, // 7.5% of 0.25 ETH
  },

  // Digital product purchase
  digitalProductPurchase: {
    item: marketplaceData.marketplaceItems.retroSynthPack,
    buyer: 'music-producer-001',
    expectedProcessingFee: 0.76, // Stripe fees
    expectedDeliveryTime: 'instant',
  },

  // Physical goods with shipping
  physicalGoodsOrder: {
    item: marketplaceData.marketplaceItems.holographicVinyl,
    buyer: 'vinyl-collector-001',
    shippingOption: 'express',
    expectedShippingCost: 15.99,
    expectedDeliveryDays: '3-5',
  },

  // Subscription service signup
  subscriptionSignup: {
    service: marketplaceData.subscriptionServices.creatorStudioPro,
    subscriber: 'aspiring-creator-001',
    plan: 'yearly',
    expectedSavings: 59.88, // 2 months free
    trialPeriod: 14,
  },

  // VR experience booking
  vrExperienceBooking: {
    service: marketplaceData.virtualServices.vrConcertExperience,
    attendee: 'vr-enthusiast-001',
    showId: 'show-001',
    expectedDate: '2024-12-15T20:00:00Z',
    requiresVR: false,
  },
};
