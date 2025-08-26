import React, { useEffect, useRef, useCallback, useState } from 'react';
import { supabase } from '../../lib/supabase';

export interface Track {
  id: string;
  user_id: string;
  title: string;
  artist: string;
  duration?: number;
  file_url: string;
  file_size?: number;
  file_type?: string;
  play_count?: number;
  last_played?: string;
  created_at: string;
}

export interface AudioState {
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
}

export interface AudioContextManager {
  audioContext: AudioContext | null;
  staticBuffer: AudioBuffer | null;
}

export class AudioEngine {
  private audioElement: HTMLAudioElement;
  private audioContextManager: AudioContextManager;
  private state: AudioState;
  private listeners: Set<(state: AudioState) => void>;
  private intervalId: number | null = null;

  constructor() {
    this.audioElement = new Audio();
    this.audioContextManager = {
      audioContext: null,
      staticBuffer: null
    };
    
    this.state = {
      isPlaying: false,
      currentTrack: null,
      currentTime: 0,
      duration: 0,
      volume: 0.8,
      isLoading: false,
      isShuffle: false,
      repeatMode: 'none',
      playlist: [],
      currentIndex: -1
    };
    
    this.listeners = new Set();
    this.initializeAudioContext();
    this.setupEventListeners();
  }

  private async initializeAudioContext(): Promise<void> {
    try {
      this.audioContextManager.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      await this.createStaticSound();
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  }

  private async createStaticSound(): Promise<void> {
    if (!this.audioContextManager.audioContext) return;
    
    const bufferSize = this.audioContextManager.audioContext.sampleRate * 1.5; // 1.5 seconds
    const buffer = this.audioContextManager.audioContext.createBuffer(1, bufferSize, this.audioContextManager.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    this.audioContextManager.staticBuffer = buffer;
  }

  public playStatic(): void {
    if (!this.audioContextManager.audioContext || !this.audioContextManager.staticBuffer) return;
    
    const staticNode = this.audioContextManager.audioContext.createBufferSource();
    staticNode.buffer = this.audioContextManager.staticBuffer;
    
    const gainNode = this.audioContextManager.audioContext.createGain();
    gainNode.gain.value = 0.15; // Lower volume for static
    
    staticNode.connect(gainNode);
    gainNode.connect(this.audioContextManager.audioContext.destination);
    
    staticNode.start();
    
    // Fade out static
    setTimeout(() => {
      if (this.audioContextManager.audioContext) {
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContextManager.audioContext.currentTime + 0.3);
        setTimeout(() => {
          try {
            staticNode.stop();
          } catch (e) {
            // Ignore if already stopped
          }
        }, 300);
      }
    }, 200);
  }

  private setupEventListeners(): void {
    this.audioElement.addEventListener('loadstart', () => {
      this.updateState({ isLoading: true });
    });

    this.audioElement.addEventListener('loadedmetadata', () => {
      this.updateState({
        duration: this.audioElement.duration,
        isLoading: false
      });
    });

    this.audioElement.addEventListener('timeupdate', () => {
      this.updateState({
        currentTime: this.audioElement.currentTime
      });
    });

    this.audioElement.addEventListener('play', () => {
      this.updateState({ isPlaying: true });
    });

    this.audioElement.addEventListener('pause', () => {
      this.updateState({ isPlaying: false });
    });

    this.audioElement.addEventListener('ended', () => {
      this.handleTrackEnd();
    });

    this.audioElement.addEventListener('error', (e) => {
      console.error('Audio playback error:', e);
      this.updateState({ 
        isPlaying: false, 
        isLoading: false 
      });
    });

    // Set initial volume
    this.audioElement.volume = this.state.volume;
  }

  private updateState(updates: Partial<AudioState>): void {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }

  public subscribe(listener: (state: AudioState) => void): () => void {
    this.listeners.add(listener);
    // Immediately call with current state
    listener(this.state);
    
    return () => {
      this.listeners.delete(listener);
    };
  }

  public async loadTrack(track: Track): Promise<void> {
    try {
      this.updateState({ 
        isLoading: true,
        currentTrack: track
      });
      
      this.audioElement.src = track.file_url;
      this.audioElement.load();
      
      // Update play count
      this.updatePlayCount(track.id);
      
    } catch (error) {
      console.error('Error loading track:', error);
      this.updateState({ isLoading: false });
    }
  }

  public async play(): Promise<void> {
    try {
      // Resume audio context if suspended
      if (this.audioContextManager.audioContext?.state === 'suspended') {
        await this.audioContextManager.audioContext.resume();
      }
      
      await this.audioElement.play();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }

  public pause(): void {
    this.audioElement.pause();
  }

  public stop(): void {
    this.audioElement.pause();
    this.audioElement.currentTime = 0;
  }

  public setVolume(volume: number): void {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    this.audioElement.volume = clampedVolume;
    this.updateState({ volume: clampedVolume });
  }

  public seek(time: number): void {
    if (this.audioElement.duration) {
      this.audioElement.currentTime = Math.max(0, Math.min(this.audioElement.duration, time));
    }
  }

  public setPlaylist(tracks: Track[]): void {
    this.updateState({ 
      playlist: tracks,
      currentIndex: -1
    });
  }

  public playTrackByIndex(index: number): void {
    if (index >= 0 && index < this.state.playlist.length) {
      this.playStatic();
      
      setTimeout(() => {
        this.updateState({ currentIndex: index });
        this.loadTrack(this.state.playlist[index]);
      }, 200);
    }
  }

  public nextTrack(): void {
    if (this.state.playlist.length === 0) return;
    
    this.playStatic();
    
    let nextIndex: number;
    
    if (this.state.isShuffle) {
      // Shuffle mode: random track (avoid repeating current)
      do {
        nextIndex = Math.floor(Math.random() * this.state.playlist.length);
      } while (nextIndex === this.state.currentIndex && this.state.playlist.length > 1);
    } else {
      // Normal mode: next in sequence
      nextIndex = (this.state.currentIndex + 1) % this.state.playlist.length;
    }
    
    setTimeout(() => {
      this.playTrackByIndex(nextIndex);
    }, 200);
  }

  public previousTrack(): void {
    if (this.state.playlist.length === 0) return;
    
    this.playStatic();
    
    let prevIndex: number;
    
    if (this.state.currentIndex > 0) {
      prevIndex = this.state.currentIndex - 1;
    } else {
      prevIndex = this.state.playlist.length - 1;
    }
    
    setTimeout(() => {
      this.playTrackByIndex(prevIndex);
    }, 200);
  }

  public toggleShuffle(): void {
    this.updateState({ isShuffle: !this.state.isShuffle });
  }

  public setRepeatMode(mode: 'none' | 'one' | 'all'): void {
    this.updateState({ repeatMode: mode });
  }

  public toggleRepeat(): void {
    const modes: Array<'none' | 'one' | 'all'> = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(this.state.repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    this.setRepeatMode(nextMode);
  }

  private handleTrackEnd(): void {
    switch (this.state.repeatMode) {
      case 'one':
        // Repeat current track
        this.audioElement.currentTime = 0;
        this.play();
        break;
      case 'all':
      case 'none':
        if (this.state.currentIndex < this.state.playlist.length - 1 || this.state.repeatMode === 'all') {
          this.nextTrack();
        } else {
          // End of playlist, stop
          this.updateState({ 
            isPlaying: false,
            currentIndex: -1
          });
        }
        break;
    }
  }

  private async updatePlayCount(trackId: string): Promise<void> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      await supabase.functions.invoke('music-library', {
        body: {
          action: 'update_play_count',
          trackId
        },
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
    } catch (error) {
      console.error('Error updating play count:', error);
    }
  }

  public getState(): AudioState {
    return { ...this.state };
  }

  public destroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    this.audioElement.pause();
    this.audioElement.src = '';
    this.listeners.clear();
    
    if (this.audioContextManager.audioContext) {
      this.audioContextManager.audioContext.close();
    }
  }
}

// React hook to use the audio engine
export function useAudioEngine(): {
  audioEngine: AudioEngine;
  state: AudioState;
} {
  const audioEngineRef = useRef<AudioEngine | null>(null);
  const [state, setState] = useState<AudioState>({
    isPlaying: false,
    currentTrack: null,
    currentTime: 0,
    duration: 0,
    volume: 0.8,
    isLoading: false,
    isShuffle: false,
    repeatMode: 'none',
    playlist: [],
    currentIndex: -1
  });

  useEffect(() => {
    if (!audioEngineRef.current) {
      audioEngineRef.current = new AudioEngine();
    }

    const unsubscribe = audioEngineRef.current.subscribe(setState);

    return () => {
      unsubscribe();
      if (audioEngineRef.current) {
        audioEngineRef.current.destroy();
        audioEngineRef.current = null;
      }
    };
  }, []);

  return {
    audioEngine: audioEngineRef.current!,
    state
  };
}