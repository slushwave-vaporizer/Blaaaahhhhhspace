// Mock audio data with YourSpace vibe

export const mockAudioTracks = {
  synthwaveClassic: {
    id: 'track-001',
    title: 'Neon Highway',
    artist: 'NeonDreamer',
    album: 'Digital Nostalgia',
    duration: 245, // 4:05
    url: '/audio/neon-highway.mp3',
    waveform_url: '/waveforms/neon-highway.json',
    genre: 'Synthwave',
    bpm: 120,
    key: 'Am',
    mood: 'nostalgic',
    energy: 'medium',
    tags: ['synthwave', 'retro', 'driving', 'neon'],
    release_date: '2025-01-10T00:00:00Z',
    play_count: 15420,
    like_count: 892,
    metadata: {
      sampleRate: 44100,
      bitRate: 320,
      channels: 2,
      format: 'mp3',
      quality: 'high',
    },
  },
  
  cyberpunkBeats: {
    id: 'track-002', 
    title: 'Digital Rain',
    artist: 'CyberGhost404',
    album: 'Code Matrix',
    duration: 198, // 3:18
    url: '/audio/digital-rain.mp3',
    waveform_url: '/waveforms/digital-rain.json',
    genre: 'Cyberpunk',
    bpm: 128,
    key: 'Dm',
    mood: 'dark',
    energy: 'high',
    tags: ['cyberpunk', 'industrial', 'glitch', 'dark'],
    release_date: '2025-01-12T00:00:00Z',
    play_count: 9876,
    like_count: 567,
    metadata: {
      sampleRate: 48000,
      bitRate: 320,
      channels: 2,
      format: 'mp3',
      quality: 'high',
    },
  },
  
  retroWaveVibes: {
    id: 'track-003',
    title: 'Sunset Drive',
    artist: 'SynthMaster85',
    album: 'Retro Nights',
    duration: 267, // 4:27
    url: '/audio/sunset-drive.wav',
    waveform_url: '/waveforms/sunset-drive.json',
    genre: 'Retrowave',
    bpm: 85,
    key: 'C',
    mood: 'dreamy',
    energy: 'low',
    tags: ['retrowave', 'chill', 'sunset', 'nostalgic'],
    release_date: '2025-01-08T00:00:00Z',
    play_count: 12345,
    like_count: 734,
    metadata: {
      sampleRate: 44100,
      bitRate: 1411, // uncompressed WAV
      channels: 2,
      format: 'wav',
      quality: 'lossless',
    },
  },
  
  ambientMatrix: {
    id: 'track-004',
    title: 'Code Meditation',
    artist: 'CodeMatrix',
    album: 'Algorithmic Dreams',
    duration: 420, // 7:00
    url: '/audio/code-meditation.mp3',
    waveform_url: '/waveforms/code-meditation.json',
    genre: 'Ambient',
    bpm: 60,
    key: 'F#m',
    mood: 'meditative',
    energy: 'very_low',
    tags: ['ambient', 'meditation', 'code', 'minimal'],
    release_date: '2025-01-13T00:00:00Z',
    play_count: 7890,
    like_count: 456,
    metadata: {
      sampleRate: 44100,
      bitRate: 192,
      channels: 2,
      format: 'mp3',
      quality: 'medium',
    },
  },
  
  collaborativeMix: {
    id: 'track-005',
    title: 'Collective Groove',
    artist: 'Various Artists',
    album: 'Collaboration Station',
    duration: 356, // 5:56
    url: '/audio/collective-groove.mp3',
    waveform_url: '/waveforms/collective-groove.json',
    genre: 'Electronic',
    bpm: 125,
    key: 'G',
    mood: 'energetic',
    energy: 'high',
    tags: ['collaboration', 'electronic', 'upbeat', 'community'],
    release_date: '2025-01-14T00:00:00Z',
    play_count: 5432,
    like_count: 321,
    collaborators: [
      { artist: 'NeonDreamer', role: 'synth', timestamp: '1:23' },
      { artist: 'CyberGhost404', role: 'glitch_fx', timestamp: '2:45' },
      { artist: 'SynthMaster85', role: 'bassline', timestamp: '0:30' },
    ],
    metadata: {
      sampleRate: 44100,
      bitRate: 320,
      channels: 2,
      format: 'mp3',
      quality: 'high',
    },
  },
};

// Playlists for testing
export const mockPlaylists = {
  vaporwaveEssentials: {
    id: 'playlist-001',
    name: 'Vaporwave Essentials',
    description: 'The ultimate collection of vaporwave classics',
    creator_id: 'user-001',
    track_ids: ['track-001', 'track-003'],
    is_public: true,
    is_collaborative: false,
    total_duration: 512, // sum of track durations
    play_count: 2341,
    subscriber_count: 456,
    created_at: '2025-01-05T12:00:00Z',
    updated_at: '2025-01-15T14:30:00Z',
    cover_image: '/images/playlists/vaporwave-essentials.jpg',
    mood: 'nostalgic',
    tags: ['vaporwave', 'synthwave', 'retro'],
  },
  
  cyberpunkVibes: {
    id: 'playlist-002',
    name: 'Cyberpunk Vibes',
    description: 'Dark electronic beats for the digital underground',
    creator_id: 'user-002',
    track_ids: ['track-002', 'track-004'],
    is_public: true,
    is_collaborative: false,
    total_duration: 618,
    play_count: 1876,
    subscriber_count: 289,
    created_at: '2025-01-07T16:30:00Z',
    updated_at: '2025-01-12T09:15:00Z',
    cover_image: '/images/playlists/cyberpunk-vibes.jpg',
    mood: 'dark',
    tags: ['cyberpunk', 'industrial', 'electronic'],
  },
  
  collaborativeJams: {
    id: 'playlist-003',
    name: 'Community Collaborations',
    description: 'Tracks created through community collaboration',
    creator_id: 'user-005',
    track_ids: ['track-005'],
    is_public: true,
    is_collaborative: true,
    contributors: ['user-001', 'user-002', 'user-003'],
    total_duration: 356,
    play_count: 987,
    subscriber_count: 123,
    created_at: '2025-01-14T12:00:00Z',
    updated_at: '2025-01-15T16:45:00Z',
    cover_image: '/images/playlists/collaborative-jams.jpg',
    mood: 'energetic',
    tags: ['collaboration', 'community', 'electronic'],
  },
};

// Audio effects and processing data
export const mockAudioEffects = {
  reverb: {
    id: 'fx-001',
    name: 'Synthwave Hall',
    type: 'reverb',
    parameters: {
      roomSize: 0.7,
      damping: 0.3,
      wetness: 0.4,
      dryness: 0.6,
    },
    presets: {
      small_room: { roomSize: 0.3, damping: 0.5, wetness: 0.2, dryness: 0.8 },
      large_hall: { roomSize: 0.9, damping: 0.2, wetness: 0.6, dryness: 0.4 },
      plate: { roomSize: 0.5, damping: 0.8, wetness: 0.5, dryness: 0.5 },
    },
  },
  
  delay: {
    id: 'fx-002',
    name: 'Neon Echo',
    type: 'delay',
    parameters: {
      time: 0.25, // 1/4 note
      feedback: 0.35,
      wetness: 0.3,
      sync: true,
    },
    presets: {
      short_slap: { time: 0.08, feedback: 0.15, wetness: 0.2 },
      long_echo: { time: 0.5, feedback: 0.6, wetness: 0.4 },
      ping_pong: { time: 0.25, feedback: 0.4, wetness: 0.35 },
    },
  },
  
  distortion: {
    id: 'fx-003',
    name: 'Cyber Glitch',
    type: 'distortion',
    parameters: {
      drive: 0.6,
      tone: 0.5,
      level: 0.8,
      mode: 'tube',
    },
    presets: {
      soft_warmth: { drive: 0.3, tone: 0.7, level: 0.9, mode: 'tube' },
      hard_clip: { drive: 0.9, tone: 0.3, level: 0.7, mode: 'transistor' },
      bit_crush: { drive: 0.8, tone: 0.2, level: 0.6, mode: 'digital' },
    },
  },
  
  filter: {
    id: 'fx-004',
    name: 'Vintage Filter',
    type: 'filter',
    parameters: {
      cutoff: 800,
      resonance: 0.3,
      type: 'lowpass',
      slope: '24db',
    },
    presets: {
      warm_low: { cutoff: 500, resonance: 0.2, type: 'lowpass', slope: '12db' },
      bright_high: { cutoff: 3000, resonance: 0.4, type: 'highpass', slope: '24db' },
      notch_sweep: { cutoff: 1200, resonance: 0.8, type: 'notch', slope: '12db' },
    },
  },
};

// Audio analysis data
export const mockAudioAnalysis = {
  'track-001': {
    spectral_data: {
      dominant_frequencies: [220, 440, 880, 1760], // Hz
      frequency_distribution: {
        bass: 0.35,
        mids: 0.45,
        highs: 0.20,
      },
      dynamic_range: 18.5, // dB
      peak_frequency: 440,
    },
    rhythm_analysis: {
      detected_bpm: 119.8,
      time_signature: '4/4',
      beat_strength: 0.78,
      rhythm_regularity: 0.92,
    },
    mood_analysis: {
      valence: 0.65, // happiness/sadness
      arousal: 0.45, // energy/calm
      dominance: 0.55, // control/submissiveness
      emotional_keywords: ['nostalgic', 'dreamy', 'uplifting', 'synthetic'],
    },
    technical_quality: {
      signal_to_noise: 45.2, // dB
      total_harmonic_distortion: 0.003, // %
      stereo_width: 0.72,
      loudness_lufs: -14.2,
    },
  },
};

// Real-time audio session data for collaboration testing
export const mockAudioSessions = {
  synthJamSession: {
    id: 'session-001',
    name: 'Synthwave Jam Session',
    host_id: 'user-001',
    participants: [
      {
        user_id: 'user-001',
        role: 'host',
        instrument: 'lead_synth',
        audio_stream: true,
        video_stream: false,
        joined_at: '2025-01-15T20:00:00Z',
      },
      {
        user_id: 'user-003',
        role: 'participant',
        instrument: 'bass_synth',
        audio_stream: true,
        video_stream: false,
        joined_at: '2025-01-15T20:02:30Z',
      },
      {
        user_id: 'user-004',
        role: 'participant',
        instrument: 'drum_machine',
        audio_stream: true,
        video_stream: false,
        joined_at: '2025-01-15T20:05:15Z',
      },
    ],
    session_settings: {
      bpm: 120,
      key: 'Am',
      time_signature: '4/4',
      metronome: true,
      recording: true,
      max_participants: 8,
    },
    created_at: '2025-01-15T20:00:00Z',
    status: 'active',
    duration: 1800, // 30 minutes
  },
};

// Helper functions
export const getTrackById = (id: string) => {
  return Object.values(mockAudioTracks).find(track => track.id === id);
};

export const getTracksByArtist = (artist: string) => {
  return Object.values(mockAudioTracks).filter(track => track.artist === artist);
};

export const getTracksByGenre = (genre: string) => {
  return Object.values(mockAudioTracks).filter(track => track.genre === genre);
};

export const getTracksByMood = (mood: string) => {
  return Object.values(mockAudioTracks).filter(track => track.mood === mood);
};

export const createTestTrack = (overrides: Partial<typeof mockAudioTracks.synthwaveClassic> = {}) => {
  return {
    ...mockAudioTracks.synthwaveClassic,
    ...overrides,
    id: `test-track-${Date.now()}`,
  };
};

// Audio streaming simulation
export const simulateAudioStream = (trackId: string) => {
  const track = getTrackById(trackId);
  if (!track) return null;
  
  return {
    trackId,
    currentTime: 0,
    duration: track.duration,
    isPlaying: false,
    volume: 0.8,
    playbackRate: 1.0,
    buffered: [{ start: 0, end: track.duration * 0.1 }], // 10% buffered
    networkState: 'loading',
    readyState: 'have_metadata',
  };
};
