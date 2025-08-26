import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AudioEngine, useAudioEngine, Track, AudioState } from './AudioEngine';
import { supabase } from '../../lib/supabase';
import { Play, Pause, SkipBack, SkipForward, Volume2, X, Music } from 'lucide-react';

interface GlobalMusicContextType {
  audioEngine: AudioEngine;
  state: AudioState;
  playContentAudio: (content: any) => void;
  isMinimized: boolean;
  setIsMinimized: (minimized: boolean) => void;
  showFullPlayer: () => void;
}

const GlobalMusicContext = createContext<GlobalMusicContextType | null>(null);

export const useGlobalMusic = () => {
  const context = useContext(GlobalMusicContext);
  if (!context) {
    throw new Error('useGlobalMusic must be used within a GlobalMusicProvider');
  }
  return context;
};

interface GlobalMusicProviderProps {
  children: ReactNode;
}

export const GlobalMusicProvider: React.FC<GlobalMusicProviderProps> = ({ children }) => {
  const { audioEngine, state } = useAudioEngine();
  const [isMinimized, setIsMinimized] = useState(true);
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);

  // Show mini player when audio is playing and player is minimized
  useEffect(() => {
    setShowMiniPlayer(state.currentTrack !== null && isMinimized);
  }, [state.currentTrack, isMinimized]);

  const playContentAudio = async (content: any) => {
    if (content.content_type !== 'audio') return;
    
    try {
      // Create a track object from content
      const track: Track = {
        id: content.id,
        user_id: content.creator_id,
        title: content.title,
        artist: content.creator_name || 'Unknown Artist',
        file_url: content.file_url,
        duration: content.duration,
        file_size: content.file_size,
        file_type: content.mime_type,
        play_count: content.view_count || 0,
        created_at: content.created_at
      };

      // Set as single track playlist and play
      audioEngine.setPlaylist([track]);
      audioEngine.playTrackByIndex(0);
      
      // Wait a moment then start playback
      setTimeout(() => {
        audioEngine.play();
      }, 300);
      
      console.log('Playing content audio:', track.title);
    } catch (error) {
      console.error('Error playing content audio:', error);
    }
  };

  const showFullPlayer = () => {
    setIsMinimized(false);
  };

  const handleMiniPlayerClose = () => {
    audioEngine.stop();
    setShowMiniPlayer(false);
  };

  const contextValue: GlobalMusicContextType = {
    audioEngine,
    state,
    playContentAudio,
    isMinimized,
    setIsMinimized,
    showFullPlayer
  };

  return (
    <GlobalMusicContext.Provider value={contextValue}>
      {children}
      
      {/* Mini Player */}
      {showMiniPlayer && (
        <div className="fixed bottom-4 right-4 z-40 bg-gradient-to-r from-gray-900 to-gray-800 border border-purple-500/30 rounded-xl p-4 shadow-2xl max-w-sm">
          <div className="flex items-center gap-3">
            {/* Track Info */}
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <Music className="text-purple-300" size={20} />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-medium text-sm truncate">
                {state.currentTrack?.title || 'No track selected'}
              </h4>
              <p className="text-purple-300 text-xs truncate">
                {state.currentTrack?.artist || 'Unknown Artist'}
              </p>
              
              {/* Progress Bar */}
              <div className="w-full h-1 bg-gray-700 rounded-full mt-2">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-150"
                  style={{ 
                    width: state.duration ? `${(state.currentTime / state.duration) * 100}%` : '0%' 
                  }}
                />
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => audioEngine.previousTrack()}
                className="p-2 text-purple-300 hover:text-white transition-colors"
              >
                <SkipBack size={16} />
              </button>
              
              <button
                onClick={() => state.isPlaying ? audioEngine.pause() : audioEngine.play()}
                disabled={state.isLoading}
                className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
              >
                {state.isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
              
              <button
                onClick={() => audioEngine.nextTrack()}
                className="p-2 text-purple-300 hover:text-white transition-colors"
              >
                <SkipForward size={16} />
              </button>
              
              <button
                onClick={showFullPlayer}
                className="p-2 text-purple-300 hover:text-white transition-colors"
                title="Open full player"
              >
                <Volume2 size={16} />
              </button>
              
              <button
                onClick={handleMiniPlayerClose}
                className="p-2 text-purple-300 hover:text-red-400 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </GlobalMusicContext.Provider>
  );
};