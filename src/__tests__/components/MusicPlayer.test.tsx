import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MusicPlayerContext } from '../../contexts/MusicPlayerContext';
import MusicPlayer from '../../components/music/MusicPlayer';
import FullMusicPlayer from '../../components/music/FullMusicPlayer';

const mockTrack = {
  id: '1',
  title: 'Test Track',
  artist: 'Test Artist',
  album: 'Test Album',
  duration: 180,
  url: '/test-track.mp3',
  artwork_url: '/test-artwork.jpg',
};

const mockMusicContext = {
  currentTrack: mockTrack,
  isPlaying: false,
  volume: 0.8,
  currentTime: 0,
  duration: 180,
  playlist: [mockTrack],
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

const renderWithMusicContext = (component: React.ReactElement) => {
  return render(
    <MusicPlayerContext.Provider value={mockMusicContext}>
      {component}
    </MusicPlayerContext.Provider>
  );
};

describe('Music Player Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('MusicPlayer', () => {
    it('renders track information when a track is loaded', () => {
      renderWithMusicContext(<MusicPlayer />);
      
      expect(screen.getByText('Test Track')).toBeInTheDocument();
      expect(screen.getByText('Test Artist')).toBeInTheDocument();
    });

    it('shows play button when track is paused', () => {
      renderWithMusicContext(<MusicPlayer />);
      
      const playButton = screen.getByRole('button', { name: /play/i });
      expect(playButton).toBeInTheDocument();
    });

    it('shows pause button when track is playing', () => {
      const playingContext = { ...mockMusicContext, isPlaying: true };
      render(
        <MusicPlayerContext.Provider value={playingContext}>
          <MusicPlayer />
        </MusicPlayerContext.Provider>
      );
      
      const pauseButton = screen.getByRole('button', { name: /pause/i });
      expect(pauseButton).toBeInTheDocument();
    });

    it('calls playTrack when play button is clicked', () => {
      renderWithMusicContext(<MusicPlayer />);
      
      const playButton = screen.getByRole('button', { name: /play/i });
      fireEvent.click(playButton);
      
      expect(mockMusicContext.playTrack).toHaveBeenCalled();
    });

    it('calls pauseTrack when pause button is clicked', () => {
      const playingContext = { ...mockMusicContext, isPlaying: true };
      render(
        <MusicPlayerContext.Provider value={playingContext}>
          <MusicPlayer />
        </MusicPlayerContext.Provider>
      );
      
      const pauseButton = screen.getByRole('button', { name: /pause/i });
      fireEvent.click(pauseButton);
      
      expect(mockMusicContext.pauseTrack).toHaveBeenCalled();
    });

    it('calls nextTrack when next button is clicked', () => {
      renderWithMusicContext(<MusicPlayer />);
      
      const nextButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(nextButton);
      
      expect(mockMusicContext.nextTrack).toHaveBeenCalled();
    });

    it('calls previousTrack when previous button is clicked', () => {
      renderWithMusicContext(<MusicPlayer />);
      
      const prevButton = screen.getByRole('button', { name: /previous/i });
      fireEvent.click(prevButton);
      
      expect(mockMusicContext.previousTrack).toHaveBeenCalled();
    });
  });

  describe('FullMusicPlayer', () => {
    it('renders full player interface', () => {
      renderWithMusicContext(<FullMusicPlayer />);
      
      expect(screen.getByText('Test Track')).toBeInTheDocument();
      expect(screen.getByText('Test Artist')).toBeInTheDocument();
      expect(screen.getByRole('slider', { name: /volume/i })).toBeInTheDocument();
    });

    it('updates volume when volume slider is changed', () => {
      renderWithMusicContext(<FullMusicPlayer />);
      
      const volumeSlider = screen.getByRole('slider', { name: /volume/i });
      fireEvent.change(volumeSlider, { target: { value: '0.5' } });
      
      expect(mockMusicContext.setVolume).toHaveBeenCalledWith(0.5);
    });

    it('shows playlist when available', () => {
      renderWithMusicContext(<FullMusicPlayer />);
      
      expect(screen.getByText(/playlist/i)).toBeInTheDocument();
    });
  });
});
