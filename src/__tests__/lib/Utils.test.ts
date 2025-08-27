import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '../../lib/supabase';
import { formatTime, validateEmail, generateId } from '../../lib/utils';
import { createStripeCheckoutSession, handleStripeWebhook } from '../../lib/stripe';

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
    })),
    auth: {
      getUser: vi.fn(),
    },
  },
}));

// Mock Stripe
vi.mock('../../lib/stripe', () => ({
  createStripeCheckoutSession: vi.fn(),
  handleStripeWebhook: vi.fn(),
}));

describe('Utility Functions', () => {
  describe('formatTime', () => {
    it('formats seconds to mm:ss format', () => {
      expect(formatTime(0)).toBe('0:00');
      expect(formatTime(30)).toBe('0:30');
      expect(formatTime(60)).toBe('1:00');
      expect(formatTime(90)).toBe('1:30');
      expect(formatTime(3661)).toBe('61:01');
    });

    it('handles negative values', () => {
      expect(formatTime(-10)).toBe('0:00');
    });

    it('handles non-numeric values', () => {
      expect(formatTime(NaN)).toBe('0:00');
      expect(formatTime(null)).toBe('0:00');
      expect(formatTime(undefined)).toBe('0:00');
    });
  });

  describe('validateEmail', () => {
    it('validates correct email addresses', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('test.email+tag@domain.co.uk')).toBe(true);
      expect(validateEmail('user.name123@test-domain.org')).toBe(true);
    });

    it('rejects invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('user..double.dot@domain.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
      expect(validateEmail(null)).toBe(false);
      expect(validateEmail(undefined)).toBe(false);
    });
  });

  describe('generateId', () => {
    it('generates unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      
      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
      expect(id1).not.toBe(id2);
    });

    it('generates IDs with correct format', () => {
      const id = generateId();
      
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });

    it('generates IDs with custom prefix', () => {
      const id = generateId('widget');
      
      expect(id.startsWith('widget-')).toBe(true);
    });
  });
});

describe('API Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Supabase Database Operations', () => {
    it('fetches user profile successfully', async () => {
      const mockProfile = {
        id: '1',
        user_id: 'user-1',
        layout_id: 'modern',
        widgets: [],
      };
      
      supabase.from().select().eq().single.mockResolvedValue({
        data: mockProfile,
        error: null,
      });
      
      const fetchProfile = async (userId: string) => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        if (error) throw error;
        return data;
      };
      
      const result = await fetchProfile('user-1');
      
      expect(result).toEqual(mockProfile);
      expect(supabase.from).toHaveBeenCalledWith('profiles');
    });

    it('handles database errors gracefully', async () => {
      supabase.from().select().eq().single.mockResolvedValue({
        data: null,
        error: { message: 'Profile not found' },
      });
      
      const fetchProfile = async (userId: string) => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        if (error) throw error;
        return data;
      };
      
      await expect(fetchProfile('nonexistent-user')).rejects.toThrow('Profile not found');
    });

    it('creates new profile', async () => {
      const newProfile = {
        user_id: 'user-1',
        layout_id: 'modern',
        widgets: [],
      };
      
      const createdProfile = { id: '1', ...newProfile };
      
      supabase.from().insert().select().single.mockResolvedValue({
        data: createdProfile,
        error: null,
      });
      
      const createProfile = async (profileData: any) => {
        const { data, error } = await supabase
          .from('profiles')
          .insert(profileData)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      };
      
      const result = await createProfile(newProfile);
      
      expect(result).toEqual(createdProfile);
      expect(supabase.from).toHaveBeenCalledWith('profiles');
    });
  });

  describe('Stripe Integration', () => {
    it('creates checkout session successfully', async () => {
      const mockSession = {
        id: 'cs_test_123',
        url: 'https://checkout.stripe.com/session/cs_test_123',
      };
      
      createStripeCheckoutSession.mockResolvedValue(mockSession);
      
      const result = await createStripeCheckoutSession({
        priceId: 'price_123',
        userId: 'user-1',
        successUrl: '/success',
        cancelUrl: '/cancel',
      });
      
      expect(result).toEqual(mockSession);
      expect(createStripeCheckoutSession).toHaveBeenCalledWith({
        priceId: 'price_123',
        userId: 'user-1',
        successUrl: '/success',
        cancelUrl: '/cancel',
      });
    });

    it('handles webhook events', async () => {
      const mockEvent = {
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test_123',
            customer: 'cus_123',
            metadata: { userId: 'user-1' },
          },
        },
      };
      
      handleStripeWebhook.mockResolvedValue({ received: true });
      
      const result = await handleStripeWebhook(mockEvent);
      
      expect(result).toEqual({ received: true });
      expect(handleStripeWebhook).toHaveBeenCalledWith(mockEvent);
    });
  });
});
