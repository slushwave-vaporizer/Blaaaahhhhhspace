import React from 'react';
import { Play, Pause, Music, Clock, Headphones } from 'lucide-react';
import { useGlobalMusic } from './GlobalMusicProvider';
import { useMusicPlayer } from '../../contexts/MusicPlayerContext';
import { Track } from './AudioEngine';
import { formatRelativeTime } from '../../lib/utils';

interface AudioContentCardProps {
  content: any;
  className?: string;
  showPlayCount?: boolean;
  compact?: boolean;
}

export const AudioContentCard: React.FC<AudioContentCardProps> = ({ 
  content, 
  className = '', 
  showPlayCount = true,
  compact = false 
}) => {
  const { playContentAudio, state } = useGlobalMusic();
  const musicPlayer = useMusicPlayer();
  
  // Check both context implementations for current track
  const isCurrentTrackGlobal = state.currentTrack?.id === content.id;
  const isCurrentTrackNew = musicPlayer.currentTrack?.id === content.id;
  const isCurrentTrack = isCurrentTrackGlobal || isCurrentTrackNew;
  
  // Check for playing state in both implementations
  const isPlayingGlobal = isCurrentTrackGlobal && state.isPlaying;
  const isPlayingNew = isCurrentTrackNew && musicPlayer.isPlaying;
  const isPlaying = isPlayingGlobal || isPlayingNew;
  
  // Loading state check
  const isLoadingGlobal = isCurrentTrackGlobal && state.isLoading;
  const isLoadingNew = isCurrentTrackNew && musicPlayer.isLoading;
  const isLoading = isLoadingGlobal || isLoadingNew;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isCurrentTrack && isPlaying) {
      // Pause if current track is playing
      musicPlayer.pause();
    } else if (isCurrentTrack && !isPlaying) {
      // Resume if current track is paused
      musicPlayer.play();
    } else {
      // Play this audio content using the new context
      // Create a track object from content
      const track: Track = {
        id: content.id,
        user_id: content.creator_id,
        title: content.title,
        artist: content.creator_name || 'Unknown Artist',
        file_url: content.file_url,
        duration: content.duration,
        file_size: content.file_size,
        file_type: content.mime_type || 'audio/mp3',
        play_count: content.view_count || 0,
        created_at: content.created_at
      };

      // Set playlist with this track and play it
      musicPlayer.setPlaylist([track]);
      musicPlayer.playTrackByIndex(0);
    }
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (compact) {
    return (
      <div className={`group relative ${className}`}>
        {/* Compact Audio Card */}
        <div className="bg-black/20 border border-purple-500/20 rounded-xl p-4 hover:border-purple-400/40 transition-all duration-200">
          <div className="flex items-center gap-3">
            {/* Play Button */}
            <button
              onClick={handlePlayClick}
              disabled={isLoading}
              className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                isCurrentTrack
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-300 hover:from-purple-500/50 hover:to-pink-500/50 hover:text-white'
              } disabled:opacity-50 group-hover:scale-105 relative`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause size={20} />
              ) : (
                <>
                  <Play size={20} className="ml-0.5" />
                  <div className="absolute -right-1 -top-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs animate-pulse-slow">
                    <Music size={10} />
                  </div>
                </>
              )}
            </button>
            
            {/* Content Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-sm truncate group-hover:text-purple-200 transition-colors">
                {content.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Music size={12} />
                <span>{content.creator_name || 'Unknown Artist'}</span>
                {content.duration && (
                  <>
                    <span>•</span>
                    <Clock size={12} />
                    <span>{formatDuration(content.duration)}</span>
                  </>
                )}
              </div>
              
              {showPlayCount && (
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Headphones size={10} />
                    {(content.view_count || 0).toLocaleString()} plays
                  </span>
                  <span>{formatRelativeTime(content.created_at)}</span>
                </div>
              )}
            </div>
            
            {/* Audio Type Badge */}
            <div className="flex-shrink-0">
              <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30">
                Audio
              </span>
            </div>
          </div>
          
          {/* Progress Bar for Current Track */}
          {isCurrentTrack && (musicPlayer.duration || state.duration) && (
            <div className="mt-3">
              <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-150"
                  style={{ 
                    width: isCurrentTrackNew ? 
                      `${(musicPlayer.currentTime / musicPlayer.duration) * 100}%` : 
                      `${(state.currentTime / state.duration) * 100}%` 
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`group relative ${className}`}>
      {/* Full Audio Card */}
      <div className="bg-black/20 border border-purple-500/20 rounded-xl overflow-hidden hover:border-purple-400/40 transition-all duration-200">
        {/* Audio Waveform Placeholder */}
        <div className="aspect-video bg-gradient-to-br from-purple-600/20 to-pink-600/20 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Animated Waveform */}
            <div className="flex items-center gap-1">
              {Array.from({ length: 20 }, (_, i) => (
                <div
                  key={i}
                  className={`bg-purple-400 rounded-full transition-all duration-300 ${
                    isPlaying ? 'animate-pulse' : ''
                  }`}
                  style={{
                    width: '3px',
                    height: `${Math.random() * 40 + 10}px`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* Visible Play Indicator - Always visible */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className={`w-12 h-12 rounded-full bg-black/60 flex items-center justify-center ${
              isPlaying ? 'opacity-0' : 'opacity-70'
            } transition-opacity duration-200`}>
              <Play size={20} className="text-white ml-1" />
            </div>
          </div>
          
          {/* Play Button Overlay on Hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <button
              onClick={handlePlayClick}
              disabled={isLoading}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 ${
                isCurrentTrack
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-white/90 text-gray-900 hover:scale-110'
              } disabled:opacity-50`}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause size={24} />
              ) : (
                <Play size={24} className="ml-1" />
              )}
            </button>
          </div>
          
          {/* Audio Type Badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-black/70 text-white text-xs rounded-full font-medium">
              🎵 Audio
            </span>
          </div>
          
          {/* Duration Badge */}
          {content.duration && (
            <div className="absolute top-4 right-4">
              <span className="px-2 py-1 bg-black/70 text-white text-xs rounded-full">
                {formatDuration(content.duration)}
              </span>
            </div>
          )}
        </div>
        
        {/* Content Info */}
        <div className="p-4">
          <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-purple-200 transition-colors">
            {content.title}
          </h3>
          
          {content.description && (
            <p className="text-gray-300 text-sm mb-3 line-clamp-2">
              {content.description}
            </p>
          )}
          
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Music size={14} />
                {content.creator_name || 'Unknown Artist'}
              </span>
              
              {showPlayCount && (
                <span className="flex items-center gap-1">
                  <Headphones size={14} />
                  {(content.view_count || 0).toLocaleString()}
                </span>
              )}
            </div>
            
            <span>{formatRelativeTime(content.created_at)}</span>
          </div>
          
          {/* Progress Bar for Current Track */}
          {isCurrentTrack && (musicPlayer.duration || state.duration) && (
            <div className="mt-3">
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-150"
                  style={{ 
                    width: isCurrentTrackNew ? 
                      `${(musicPlayer.currentTime / musicPlayer.duration) * 100}%` : 
                      `${(state.currentTime / state.duration) * 100}%` 
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>
                  {isCurrentTrackNew ? 
                    `${Math.floor(musicPlayer.currentTime / 60)}:${Math.floor(musicPlayer.currentTime % 60).toString().padStart(2, '0')}` :
                    `${Math.floor(state.currentTime / 60)}:${Math.floor(state.currentTime % 60).toString().padStart(2, '0')}`
                  }
                </span>
                <span>
                  {isCurrentTrackNew ? 
                    `${Math.floor(musicPlayer.duration / 60)}:${Math.floor(musicPlayer.duration % 60).toString().padStart(2, '0')}` :
                    `${Math.floor(state.duration / 60)}:${Math.floor(state.duration % 60).toString().padStart(2, '0')}`
                  }
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};