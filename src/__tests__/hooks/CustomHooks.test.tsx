import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../../hooks/useAuth';
import { useProfileBuilder } from '../../hooks/useProfileBuilder';
import { useMusicPlayer } from '../../hooks/useMusicPlayer';
import { useVirtualRooms } from '../../hooks/useVirtualRooms';

// Mock supabase
const mockSupabase = {
  auth: {
    getUser: vi.fn(),
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChange: vi.fn(),
  },
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
  })),
};

vi.mock('../../lib/supabase', () => ({
  supabase: mockSupabase,
}));

describe('Custom Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useAuth', () => {
    it('initializes with loading state', () => {
      const { result } = renderHook(() => useAuth());
      
      expect(result.current.loading).toBe(true);
      expect(result.current.user).toBe(null);
    });

    it('handles successful login', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: { id: '1', email: 'test@example.com' } },
        error: null,
      });
      
      const { result } = renderHook(() => useAuth());
      
      await act(async () => {
        await result.current.signIn('test@example.com', 'password123');
      });
      
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('handles login error', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: null },
        error: { message: 'Invalid credentials' },
      });
      
      const { result } = renderHook(() => useAuth());
      
      await act(async () => {
        const error = await result.current.signIn('test@example.com', 'wrongpassword');
        expect(error).toBe('Invalid credentials');
      });
    });

    it('handles successful signup', async () => {
      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: { id: '1', email: 'test@example.com' } },
        error: null,
      });
      
      const { result } = renderHook(() => useAuth());
      
      await act(async () => {
        await result.current.signUp('test@example.com', 'password123');
      });
      
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('handles logout', async () => {
      mockSupabase.auth.signOut.mockResolvedValue({ error: null });
      
      const { result } = renderHook(() => useAuth());
      
      await act(async () => {
        await result.current.signOut();
      });
      
      expect(mockSupabase.auth.signOut).toHaveBeenCalled();
    });
  });

  describe('useProfileBuilder', () => {
    it('initializes with empty profile', () => {
      const { result } = renderHook(() => useProfileBuilder());
      
      expect(result.current.profile).toBeDefined();
      expect(result.current.widgets).toEqual([]);
      expect(result.current.selectedWidget).toBe(null);
    });

    it('adds widget to profile', () => {
      const { result } = renderHook(() => useProfileBuilder());
      
      act(() => {
        result.current.addWidget('about', { content: 'Test content' });
      });
      
      expect(result.current.widgets).toHaveLength(1);
      expect(result.current.widgets[0].type).toBe('about');
      expect(result.current.widgets[0].data.content).toBe('Test content');
    });

    it('removes widget from profile', () => {
      const { result } = renderHook(() => useProfileBuilder());
      
      act(() => {
        result.current.addWidget('about', { content: 'Test content' });
      });
      
      const widgetId = result.current.widgets[0].id;
      
      act(() => {
        result.current.removeWidget(widgetId);
      });
      
      expect(result.current.widgets).toHaveLength(0);
    });

    it('updates widget data', () => {
      const { result } = renderHook(() => useProfileBuilder());
      
      act(() => {
        result.current.addWidget('about', { content: 'Test content' });
      });
      
      const widgetId = result.current.widgets[0].id;
      
      act(() => {
        result.current.updateWidget(widgetId, { content: 'Updated content' });
      });
      
      expect(result.current.widgets[0].data.content).toBe('Updated content');
    });

    it('saves profile successfully', async () => {
      mockSupabase.from().upsert.mockResolvedValue({ error: null });
      
      const { result } = renderHook(() => useProfileBuilder());
      
      await act(async () => {
        await result.current.saveProfile();
      });
      
      expect(mockSupabase.from).toHaveBeenCalledWith('profiles');
    });
  });

  describe('useVirtualRooms', () => {
    it('initializes with empty rooms', () => {
      const { result } = renderHook(() => useVirtualRooms());
      
      expect(result.current.rooms).toEqual([]);
      expect(result.current.loading).toBe(true);
    });

    it('fetches user rooms', async () => {
      const mockRooms = [
        { id: '1', name: 'Room 1', user_id: 'user-1' },
        { id: '2', name: 'Room 2', user_id: 'user-1' },
      ];
      
      mockSupabase.from().select().eq().mockResolvedValue({
        data: mockRooms,
        error: null,
      });
      
      const { result } = renderHook(() => useVirtualRooms('user-1'));
      
      await act(async () => {
        await result.current.fetchRooms();
      });
      
      expect(result.current.rooms).toEqual(mockRooms);
      expect(result.current.loading).toBe(false);
    });

    it('creates new room', async () => {
      const newRoom = {
        name: 'New Room',
        description: 'A new virtual room',
        theme: 'modern',
      };
      
      mockSupabase.from().insert().select().single.mockResolvedValue({
        data: { id: '3', ...newRoom },
        error: null,
      });
      
      const { result } = renderHook(() => useVirtualRooms('user-1'));
      
      await act(async () => {
        await result.current.createRoom(newRoom);
      });
      
      expect(mockSupabase.from).toHaveBeenCalledWith('virtual_rooms');
    });

    it('deletes room', async () => {
      mockSupabase.from().delete().eq.mockResolvedValue({ error: null });
      
      const { result } = renderHook(() => useVirtualRooms('user-1'));
      
      await act(async () => {
        await result.current.deleteRoom('room-1');
      });
      
      expect(mockSupabase.from).toHaveBeenCalledWith('virtual_rooms');
    });
  });
});
