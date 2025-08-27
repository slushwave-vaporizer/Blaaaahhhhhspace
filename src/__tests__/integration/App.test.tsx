import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MusicPlayerContext } from '../../contexts/MusicPlayerContext';
import { AuthContext } from '../../contexts/AuthContext';
import App from '../../App';
import HomePage from '../../pages/HomePage';

// Mock contexts
const mockAuthContext = {
  user: { id: 'user-1', email: 'test@example.com' },
  signIn: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn(),
  loading: false,
};

const mockMusicContext = {
  currentTrack: null,
  isPlaying: false,
  volume: 0.8,
  currentTime: 0,
  duration: 0,
  playlist: [],
  playTrack: vi.fn(),
  pauseTrack: vi.fn(),
  nextTrack: vi.fn(),
  previousTrack: vi.fn(),
  setVolume: vi.fn(),
  seekTo: vi.fn(),
  addToPlaylist: vi.fn(),
  removeFromPlaylist: vi.fn(),
  clearPlaylist: vi.fn(),
  shuffle: vi.fn(),
  repeat: vi.fn(),
  isShuffled: false,
  repeatMode: 'none' as const,
};

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: mockAuthContext.user } }),
      onAuthStateChange: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      then: vi.fn().mockResolvedValue({ data: [], error: null }),
    })),
  },
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={mockAuthContext}>
        <MusicPlayerContext.Provider value={mockMusicContext}>
          {component}
        </MusicPlayerContext.Provider>
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

describe('Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('App Integration', () => {
    it('renders main application structure', () => {
      renderWithProviders(<App />);
      
      // Check for main navigation elements
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      
      // Check for main content area
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('shows authenticated user navigation', () => {
      renderWithProviders(<App />);
      
      // Should show authenticated navigation
      expect(screen.getByText(/profile/i)).toBeInTheDocument();
      expect(screen.getByText(/rooms/i)).toBeInTheDocument();
      expect(screen.getByText(/studio/i)).toBeInTheDocument();
    });

    it('handles navigation between pages', async () => {
      renderWithProviders(<App />);
      
      const profileLink = screen.getByText(/profile/i);
      fireEvent.click(profileLink);
      
      await waitFor(() => {
        expect(window.location.pathname).toBe('/profile');
      });
    });
  });

  describe('Home Page Integration', () => {
    it('renders home page with user content', () => {
      renderWithProviders(<HomePage />);
      
      expect(screen.getByText(/welcome to yourspace/i)).toBeInTheDocument();
      expect(screen.getByText(/discover/i)).toBeInTheDocument();
    });

    it('displays recent activity feed', async () => {
      renderWithProviders(<HomePage />);
      
      await waitFor(() => {
        expect(screen.getByText(/recent activity/i)).toBeInTheDocument();
      });
    });

    it('shows featured content sections', () => {
      renderWithProviders(<HomePage />);
      
      expect(screen.getByText(/featured artists/i)).toBeInTheDocument();
      expect(screen.getByText(/popular rooms/i)).toBeInTheDocument();
      expect(screen.getByText(/trending music/i)).toBeInTheDocument();
    });
  });

  describe('Music Player Integration', () => {
    it('integrates music player with navigation', () => {
      renderWithProviders(<App />);
      
      // Music player should be present in the app
      expect(screen.getByTestId('music-player')).toBeInTheDocument();
    });

    it('persists music player state across page navigation', async () => {
      const playingContext = { ...mockMusicContext, isPlaying: true, currentTrack: { id: '1', title: 'Test Song' } };
      
      render(
        <BrowserRouter>
          <AuthContext.Provider value={mockAuthContext}>
            <MusicPlayerContext.Provider value={playingContext}>
              <App />
            </MusicPlayerContext.Provider>
          </AuthContext.Provider>
        </BrowserRouter>
      );
      
      // Navigate to different page
      const profileLink = screen.getByText(/profile/i);
      fireEvent.click(profileLink);
      
      // Music player should still show playing state
      await waitFor(() => {
        expect(screen.getByText('Test Song')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
      });
    });
  });

  describe('Authentication Integration', () => {
    it('handles user logout', async () => {
      renderWithProviders(<App />);
      
      const logoutButton = screen.getByRole('button', { name: /logout/i });
      fireEvent.click(logoutButton);
      
      await waitFor(() => {
        expect(mockAuthContext.signOut).toHaveBeenCalled();
      });
    });

    it('redirects to login when unauthenticated', () => {
      const unauthenticatedContext = { ...mockAuthContext, user: null };
      
      render(
        <BrowserRouter>
          <AuthContext.Provider value={unauthenticatedContext}>
            <MusicPlayerContext.Provider value={mockMusicContext}>
              <App />
            </MusicPlayerContext.Provider>
          </AuthContext.Provider>
        </BrowserRouter>
      );
      
      expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    });
  });

  describe('Profile Builder Integration', () => {
    it('loads user profile on profile page', async () => {
      renderWithProviders(<App />);
      
      const profileLink = screen.getByText(/profile/i);
      fireEvent.click(profileLink);
      
      await waitFor(() => {
        expect(screen.getByText(/profile builder/i)).toBeInTheDocument();
      });
    });

    it('saves profile changes and shows confirmation', async () => {
      renderWithProviders(<App />);
      
      // Navigate to profile builder
      const profileLink = screen.getByText(/profile/i);
      fireEvent.click(profileLink);
      
      await waitFor(() => {
        const saveButton = screen.getByRole('button', { name: /save/i });
        fireEvent.click(saveButton);
      });
      
      await waitFor(() => {
        expect(screen.getByText(/profile saved/i)).toBeInTheDocument();
      });
    });
  });

  describe('Virtual Rooms Integration', () => {
    it('loads user rooms on rooms page', async () => {
      renderWithProviders(<App />);
      
      const roomsLink = screen.getByText(/rooms/i);
      fireEvent.click(roomsLink);
      
      await waitFor(() => {
        expect(screen.getByText(/my virtual rooms/i)).toBeInTheDocument();
      });
    });

    it('creates new room and redirects to editor', async () => {
      renderWithProviders(<App />);
      
      // Navigate to rooms page
      const roomsLink = screen.getByText(/rooms/i);
      fireEvent.click(roomsLink);
      
      await waitFor(() => {
        const createButton = screen.getByRole('button', { name: /create room/i });
        fireEvent.click(createButton);
      });
      
      await waitFor(() => {
        expect(screen.getByText(/room editor/i)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling Integration', () => {
    it('shows error boundary when component crashes', () => {
      const ThrowError = () => {
        throw new Error('Test error');
      };
      
      const { container } = render(
        <BrowserRouter>
          <AuthContext.Provider value={mockAuthContext}>
            <MusicPlayerContext.Provider value={mockMusicContext}>
              <ThrowError />
            </MusicPlayerContext.Provider>
          </AuthContext.Provider>
        </BrowserRouter>
      );
      
      expect(container.textContent).toContain('Something went wrong');
    });

    it('handles network errors gracefully', async () => {
      // Mock network error
      vi.mocked(global.fetch).mockRejectedValue(new Error('Network error'));
      
      renderWithProviders(<HomePage />);
      
      await waitFor(() => {
        expect(screen.getByText(/unable to load content/i)).toBeInTheDocument();
      });
    });
  });
});
