// Database test helpers
import { vi } from 'vitest';
import { mockUsers } from '../fixtures/users';
import { mockContent } from '../fixtures/content';
import { mockRooms } from '../fixtures/rooms';
import { mockAudioTracks } from '../fixtures/audio';

// Mock database responses
export const mockDatabaseResponses = {
  selectSuccess: (data: any[]) => ({
    data,
    error: null,
    status: 200,
    statusText: 'OK',
  }),
  
  selectEmpty: {
    data: [],
    error: null,
    status: 200,
    statusText: 'OK',
  },
  
  insertSuccess: (data: any) => ({
    data: [data],
    error: null,
    status: 201,
    statusText: 'Created',
  }),
  
  updateSuccess: (data: any) => ({
    data: [data],
    error: null,
    status: 200,
    statusText: 'OK',
  }),
  
  deleteSuccess: {
    data: null,
    error: null,
    status: 204,
    statusText: 'No Content',
  },
  
  errorNotFound: {
    data: null,
    error: {
      message: 'Record not found',
      code: 'PGRST116',
      hint: null,
      details: null,
    },
    status: 404,
    statusText: 'Not Found',
  },
  
  errorUnauthorized: {
    data: null,
    error: {
      message: 'Unauthorized',
      code: 'PGRST301',
      hint: null,
      details: null,
    },
    status: 401,
    statusText: 'Unauthorized',
  },
  
  errorValidation: {
    data: null,
    error: {
      message: 'Validation failed',
      code: 'PGRST202',
      hint: 'Check required fields',
      details: 'Missing required field: title',
    },
    status: 400,
    statusText: 'Bad Request',
  },
};

// Mock Supabase client database methods
export const mockSupabaseDatabase = () => {
  const createQueryBuilder = () => {
    const queryBuilder = {
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      upsert: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      neq: vi.fn().mockReturnThis(),
      gt: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lt: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      like: vi.fn().mockReturnThis(),
      ilike: vi.fn().mockReturnThis(),
      is: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      contains: vi.fn().mockReturnThis(),
      containedBy: vi.fn().mockReturnThis(),
      rangeGt: vi.fn().mockReturnThis(),
      rangeGte: vi.fn().mockReturnThis(),
      rangeLt: vi.fn().mockReturnThis(),
      rangeLte: vi.fn().mockReturnThis(),
      rangeAdjacent: vi.fn().mockReturnThis(),
      overlaps: vi.fn().mockReturnThis(),
      textSearch: vi.fn().mockReturnThis(),
      match: vi.fn().mockReturnThis(),
      not: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      filter: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      range: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockReturnThis(),
      csv: vi.fn().mockReturnThis(),
      then: vi.fn(),
    };
    
    return queryBuilder;
  };
  
  const mockFrom = vi.fn(() => createQueryBuilder());
  
  return { from: mockFrom };
};

// Table-specific helpers
export const mockProfilesTable = () => {
  const mockProfiles = Object.values(mockUsers).map(user => user.profile);
  
  return {
    select: () => Promise.resolve(mockDatabaseResponses.selectSuccess(mockProfiles)),
    selectByUserId: (userId: string) => {
      const profile = mockProfiles.find(p => p.id === userId);
      return Promise.resolve(profile ? 
        mockDatabaseResponses.selectSuccess([profile]) : 
        mockDatabaseResponses.selectEmpty
      );
    },
    insert: (data: any) => Promise.resolve(mockDatabaseResponses.insertSuccess({
      ...data,
      id: `profile-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })),
    update: (id: string, data: any) => {
      const existing = mockProfiles.find(p => p.id === id);
      if (!existing) return Promise.resolve(mockDatabaseResponses.errorNotFound);
      
      return Promise.resolve(mockDatabaseResponses.updateSuccess({
        ...existing,
        ...data,
        updated_at: new Date().toISOString(),
      }));
    },
  };
};

export const mockContentTable = () => {
  const mockContentList = Object.values(mockContent);
  
  return {
    select: () => Promise.resolve(mockDatabaseResponses.selectSuccess(mockContentList)),
    selectById: (id: string) => {
      const content = mockContentList.find(c => c.id === id);
      return Promise.resolve(content ? 
        mockDatabaseResponses.selectSuccess([content]) : 
        mockDatabaseResponses.selectEmpty
      );
    },
    selectByCreator: (creatorId: string) => {
      const creatorContent = mockContentList.filter(c => c.creator_id === creatorId);
      return Promise.resolve(mockDatabaseResponses.selectSuccess(creatorContent));
    },
    selectByType: (type: string) => {
      const typeContent = mockContentList.filter(c => c.content_type === type);
      return Promise.resolve(mockDatabaseResponses.selectSuccess(typeContent));
    },
    insert: (data: any) => Promise.resolve(mockDatabaseResponses.insertSuccess({
      ...data,
      id: `content-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      view_count: 0,
      like_count: 0,
      comment_count: 0,
      download_count: 0,
    })),
    update: (id: string, data: any) => {
      const existing = mockContentList.find(c => c.id === id);
      if (!existing) return Promise.resolve(mockDatabaseResponses.errorNotFound);
      
      return Promise.resolve(mockDatabaseResponses.updateSuccess({
        ...existing,
        ...data,
        updated_at: new Date().toISOString(),
      }));
    },
    delete: (id: string) => {
      const existing = mockContentList.find(c => c.id === id);
      return Promise.resolve(existing ? 
        mockDatabaseResponses.deleteSuccess : 
        mockDatabaseResponses.errorNotFound
      );
    },
  };
};

export const mockRoomsTable = () => {
  const mockRoomsList = Object.values(mockRooms);
  
  return {
    select: () => Promise.resolve(mockDatabaseResponses.selectSuccess(mockRoomsList)),
    selectById: (id: string) => {
      const room = mockRoomsList.find(r => r.id === id);
      return Promise.resolve(room ? 
        mockDatabaseResponses.selectSuccess([room]) : 
        mockDatabaseResponses.selectEmpty
      );
    },
    selectByOwner: (ownerId: string) => {
      const ownerRooms = mockRoomsList.filter(r => r.owner_id === ownerId);
      return Promise.resolve(mockDatabaseResponses.selectSuccess(ownerRooms));
    },
    selectPublic: () => {
      const publicRooms = mockRoomsList.filter(r => r.is_public);
      return Promise.resolve(mockDatabaseResponses.selectSuccess(publicRooms));
    },
    insert: (data: any) => Promise.resolve(mockDatabaseResponses.insertSuccess({
      ...data,
      id: `room-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      current_visitors: 0,
      total_visits: 0,
    })),
    update: (id: string, data: any) => {
      const existing = mockRoomsList.find(r => r.id === id);
      if (!existing) return Promise.resolve(mockDatabaseResponses.errorNotFound);
      
      return Promise.resolve(mockDatabaseResponses.updateSuccess({
        ...existing,
        ...data,
        updated_at: new Date().toISOString(),
      }));
    },
  };
};

// Database transaction helpers
export const mockDatabaseTransaction = () => {
  const transactionSteps: any[] = [];
  
  return {
    begin: () => {
      transactionSteps.push({ type: 'begin', timestamp: Date.now() });
      return Promise.resolve({ data: null, error: null });
    },
    commit: () => {
      transactionSteps.push({ type: 'commit', timestamp: Date.now() });
      return Promise.resolve({ data: null, error: null });
    },
    rollback: () => {
      transactionSteps.push({ type: 'rollback', timestamp: Date.now() });
      return Promise.resolve({ data: null, error: null });
    },
    getSteps: () => transactionSteps,
    clear: () => transactionSteps.length = 0,
  };
};

// Real-time subscriptions mock
export const mockRealtimeSubscription = () => {
  const subscribers = new Map();
  
  return {
    channel: (channelName: string) => ({
      on: (event: string, callback: Function) => {
        const key = `${channelName}:${event}`;
        if (!subscribers.has(key)) {
          subscribers.set(key, []);
        }
        subscribers.get(key).push(callback);
        return {
          subscribe: vi.fn(),
          unsubscribe: vi.fn(() => {
            const callbacks = subscribers.get(key) || [];
            const index = callbacks.indexOf(callback);
            if (index > -1) {
              callbacks.splice(index, 1);
            }
          }),
        };
      },
      subscribe: vi.fn(),
      unsubscribe: vi.fn(),
    }),
    
    // Simulate real-time events
    simulateEvent: (channelName: string, event: string, payload: any) => {
      const key = `${channelName}:${event}`;
      const callbacks = subscribers.get(key) || [];
      callbacks.forEach((callback: Function) => {
        callback(payload);
      });
    },
    
    getSubscribers: () => subscribers,
    clearSubscribers: () => subscribers.clear(),
  };
};

// Database seeding helpers
export const seedTestDatabase = async () => {
  // Mock seeding process
  const seededData = {
    profiles: Object.values(mockUsers).map(user => user.profile),
    content: Object.values(mockContent),
    rooms: Object.values(mockRooms),
    audio_tracks: Object.values(mockAudioTracks),
  };
  
  return {
    data: seededData,
    error: null,
    recordsSeeded: {
      profiles: seededData.profiles.length,
      content: seededData.content.length,
      rooms: seededData.rooms.length,
      audio_tracks: seededData.audio_tracks.length,
    },
  };
};

export const cleanTestDatabase = async () => {
  // Mock cleanup process
  return {
    data: { message: 'Test database cleaned' },
    error: null,
    recordsDeleted: {
      profiles: 5,
      content: 6,
      rooms: 5,
      audio_tracks: 5,
    },
  };
};

// Query performance testing
export const measureQueryPerformance = async (queryFn: Function) => {
  const startTime = performance.now();
  const result = await queryFn();
  const endTime = performance.now();
  
  return {
    result,
    executionTime: endTime - startTime,
    timestamp: new Date().toISOString(),
  };
};

// Database connection mock
export const mockDatabaseConnection = {
  isConnected: true,
  connectionCount: 1,
  maxConnections: 100,
  
  async testConnection() {
    return {
      connected: this.isConnected,
      latency: Math.random() * 50 + 10, // 10-60ms
      timestamp: new Date().toISOString(),
    };
  },
  
  async getConnectionInfo() {
    return {
      activeConnections: this.connectionCount,
      maxConnections: this.maxConnections,
      database: 'yourspace_test',
      host: 'localhost',
      port: 5432,
    };
  },
};
