import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAudioEngine, Track, AudioState } from '../components/music/AudioEngine';

interface MusicPlayerContextType {
  // State
  isPlaying: boolean;
  currentTrack: Track | null;
  currentTime: number;
  duration: number;
  volume: number;
  isLoading: boolean;
  isShuffle: boolean;
  repeatMode: 'none' | 'one' | 'all';
  playlist: Track[];
  currentIndex: number;
  
  // Methods
  play: () => Promise<void>;
  pause: () => void;
  stop: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  nextTrack: () => void;
  previousTrack: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  setPlaylist: (tracks: Track[]) => void;
  playTrackByIndex: (index: number) => void;
  playTrack: (track: Track) => Promise<void>;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | null>(null);

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
};

interface MusicPlayerProviderProps {
  children: ReactNode;
}

export const MusicPlayerProvider: React.FC<MusicPlayerProviderProps> = ({ children }) => {
  const { audioEngine, state } = useAudioEngine();
  
  const contextValue: MusicPlayerContextType = {
    // State properties directly mapped from AudioEngine state
    isPlaying: state.isPlaying,
    currentTrack: state.currentTrack,
    currentTime: state.currentTime,
    duration: state.duration,
    volume: state.volume,
    isLoading: state.isLoading,
    isShuffle: state.isShuffle,
    repeatMode: state.repeatMode,
    playlist: state.playlist,
    currentIndex: state.currentIndex,
    
    // Methods directly mapped to AudioEngine methods
    play: async () => await audioEngine.play(),
    pause: () => audioEngine.pause(),
    stop: () => audioEngine.stop(),
    setVolume: (volume: number) => audioEngine.setVolume(volume),
    seek: (time: number) => audioEngine.seek(time),
    nextTrack: () => audioEngine.nextTrack(),
    previousTrack: () => audioEngine.previousTrack(),
    toggleShuffle: () => audioEngine.toggleShuffle(),
    toggleRepeat: () => audioEngine.toggleRepeat(),
    setPlaylist: (tracks: Track[]) => audioEngine.setPlaylist(tracks),
    playTrackByIndex: (index: number) => audioEngine.playTrackByIndex(index),
    playTrack: async (track: Track) => await audioEngine.loadTrack(track),
  };

  return (
    <MusicPlayerContext.Provider value={contextValue}>
      {children}
    </MusicPlayerContext.Provider>
  );
};

export default MusicPlayerContext;
