// Authentication test helpers
import { vi } from 'vitest';
import { mockUsers, mockAuthStates } from '../fixtures/users';
import { supabase } from '../../src/lib/supabase';

// Mock authentication responses
export const mockAuthResponses = {
  signInSuccess: {
    data: {
      user: mockUsers.neonDreamer,
      session: {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_at: Date.now() + 3600000, // 1 hour from now
      },
    },
    error: null,
  },
  
  signInError: {
    data: { user: null, session: null },
    error: {
      message: 'Invalid login credentials',
      status: 400,
    },
  },
  
  signUpSuccess: {
    data: {
      user: {
        ...mockUsers.cyberGhost,
        email_confirmed_at: null,
      },
      session: null,
    },
    error: null,
  },
  
  signUpError: {
    data: { user: null, session: null },
    error: {
      message: 'User already registered',
      status: 422,
    },
  },
  
  signOutSuccess: {
    error: null,
  },
  
  getUserSuccess: {
    data: { user: mockUsers.neonDreamer },
    error: null,
  },
  
  getUserNotAuthenticated: {
    data: { user: null },
    error: null,
  },
};

// Setup authentication mocks
export const mockSupabaseAuth = () => {
  const mockAuth = {
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    getUser: vi.fn(),
    getSession: vi.fn(),
    onAuthStateChange: vi.fn(),
    refreshSession: vi.fn(),
    resetPasswordForEmail: vi.fn(),
    updateUser: vi.fn(),
  };
  
  // Default successful responses
  mockAuth.signInWithPassword.mockResolvedValue(mockAuthResponses.signInSuccess);
  mockAuth.signUp.mockResolvedValue(mockAuthResponses.signUpSuccess);
  mockAuth.signOut.mockResolvedValue(mockAuthResponses.signOutSuccess);
  mockAuth.getUser.mockResolvedValue(mockAuthResponses.getUserSuccess);
  mockAuth.getSession.mockResolvedValue({ data: { session: null }, error: null });
  mockAuth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });
  
  return mockAuth;
};

// Authentication state helpers
export const setupAuthState = (state: keyof typeof mockAuthStates) => {
  const authState = mockAuthStates[state];
  
  vi.mock('../../src/contexts/AuthContext', () => ({
    useAuth: () => authState,
    AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  }));
  
  return authState;
};

// Login test helper
export const performLogin = async (email: string, password: string) => {
  const mockResponse = email === 'test@example.com' && password === 'password123'
    ? mockAuthResponses.signInSuccess
    : mockAuthResponses.signInError;
    
  supabase.auth.signInWithPassword = vi.fn().mockResolvedValue(mockResponse);
  
  return await supabase.auth.signInWithPassword({ email, password });
};

// Registration test helper  
export const performRegistration = async (email: string, password: string, username?: string) => {
  const mockResponse = email.includes('existing')
    ? mockAuthResponses.signUpError
    : mockAuthResponses.signUpSuccess;
    
  supabase.auth.signUp = vi.fn().mockResolvedValue(mockResponse);
  
  return await supabase.auth.signUp({ 
    email, 
    password,
    options: { 
      data: { username } 
    }
  });
};

// Session management helpers
export const simulateAuthStateChange = (user: any, event: string) => {
  const callback = supabase.auth.onAuthStateChange.mock.calls[0]?.[0];
  if (callback) {
    callback(event, user ? { user, access_token: 'mock-token' } : null);
  }
};

// Password reset test helper
export const performPasswordReset = async (email: string) => {
  const mockResponse = {
    data: {},
    error: email.includes('invalid') ? {
      message: 'Invalid email address',
      status: 422,
    } : null,
  };
  
  supabase.auth.resetPasswordForEmail = vi.fn().mockResolvedValue(mockResponse);
  
  return await supabase.auth.resetPasswordForEmail(email);
};

// Profile update helper
export const performProfileUpdate = async (updates: any) => {
  const mockResponse = {
    data: { user: { ...mockUsers.neonDreamer, ...updates } },
    error: null,
  };
  
  supabase.auth.updateUser = vi.fn().mockResolvedValue(mockResponse);
  
  return await supabase.auth.updateUser(updates);
};

// Authentication flow test utilities
export const testAuthFlow = {
  // Complete login flow
  async loginUser(email: string = 'test@example.com', password: string = 'password123') {
    const response = await performLogin(email, password);
    if (!response.error) {
      simulateAuthStateChange(response.data.user, 'SIGNED_IN');
    }
    return response;
  },
  
  // Complete logout flow
  async logoutUser() {
    supabase.auth.signOut = vi.fn().mockResolvedValue(mockAuthResponses.signOutSuccess);
    const response = await supabase.auth.signOut();
    simulateAuthStateChange(null, 'SIGNED_OUT');
    return response;
  },
  
  // Complete registration flow
  async registerUser(email: string = 'new@example.com', password: string = 'password123', username?: string) {
    const response = await performRegistration(email, password, username);
    if (!response.error && response.data.session) {
      simulateAuthStateChange(response.data.user, 'SIGNED_IN');
    }
    return response;
  },
};

// Token validation helpers
export const validateAuthToken = (token: string) => {
  // Mock JWT token validation
  if (token === 'mock-access-token') {
    return {
      valid: true,
      payload: {
        sub: mockUsers.neonDreamer.id,
        email: mockUsers.neonDreamer.email,
        exp: Date.now() + 3600000,
      },
    };
  }
  
  return {
    valid: false,
    error: 'Invalid token',
  };
};

// Permission testing helpers
export const checkUserPermissions = (userId: string, resource: string, action: string) => {
  const user = Object.values(mockUsers).find(u => u.id === userId);
  
  if (!user) return false;
  
  // Mock permission logic
  const permissions = {
    'user-001': ['read:all', 'write:own', 'admin:profile'],
    'user-002': ['read:public', 'write:own'],
    'user-003': ['read:all', 'write:own', 'collaborate:all'],
    'user-004': ['read:all', 'write:all', 'admin:all'],
    'user-005': ['read:all', 'collaborate:all'],
  };
  
  const userPermissions = permissions[userId as keyof typeof permissions] || [];
  const requiredPermission = `${action}:${resource}`;
  
  return userPermissions.includes(requiredPermission) || 
         userPermissions.includes(`${action}:all`) ||
         userPermissions.includes('admin:all');
};

// Multi-factor authentication mock
export const mockMFASetup = {
  async enableMFA(userId: string) {
    return {
      data: {
        qr_code: 'data:image/png;base64,mock-qr-code-data',
        secret: 'JBSWY3DPEHPK3PXP',
        backup_codes: ['12345678', '87654321', '11223344'],
      },
      error: null,
    };
  },
  
  async verifyMFA(token: string) {
    const validTokens = ['123456', '789012'];
    return {
      data: { verified: validTokens.includes(token) },
      error: validTokens.includes(token) ? null : { message: 'Invalid MFA token' },
    };
  },
};

// Social authentication mocks
export const mockSocialAuth = {
  async signInWithGoogle() {
    return {
      data: {
        user: { ...mockUsers.neonDreamer, provider: 'google' },
        session: { access_token: 'google-mock-token' },
      },
      error: null,
    };
  },
  
  async signInWithGithub() {
    return {
      data: {
        user: { ...mockUsers.codeMatrix, provider: 'github' },
        session: { access_token: 'github-mock-token' },
      },
      error: null,
    };
  },
  
  async signInWithDiscord() {
    return {
      data: {
        user: { ...mockUsers.cyberGhost, provider: 'discord' },
        session: { access_token: 'discord-mock-token' },
      },
      error: null,
    };
  },
};
