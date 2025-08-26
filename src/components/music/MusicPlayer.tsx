import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Repeat, 
  Shuffle, 
  Upload,
  List,
  X,
  Music,
  Clock
} from 'lucide-react';
import { Track } from './AudioEngine';
import { useMusicPlayer } from '../../contexts/MusicPlayerContext';
import { supabase } from '../../lib/supabase';

interface MusicPlayerProps {
  onClose: () => void;
  roomId?: string;
  collaborativeMode?: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ 
  onClose, 
  roomId, 
  collaborativeMode = false 
}) => {
  const musicPlayer = useMusicPlayer();
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load user's music library on component mount
  useEffect(() => {
    loadMusicLibrary();
  }, []);

  // Update music player playlist when tracks change
  useEffect(() => {
    musicPlayer.setPlaylist(tracks);
  }, [tracks, musicPlayer]);

  const loadMusicLibrary = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await supabase.functions.invoke('music-library', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.error) {
        throw response.error;
      }

      if (response.data?.data?.tracks) {
        setTracks(response.data.data.tracks);
      }
    } catch (error) {
      console.error('Error loading music library:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    setUploading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      for (const file of Array.from(files)) {
        if (!file.type.startsWith('audio/')) continue;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', file.name.replace(/\.[^/.]+$/, ''));
        formData.append('artist', 'Unknown Artist');

        const response = await supabase.functions.invoke('music-upload', {
          body: formData,
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });

        if (response.error) {
          console.error('Upload error:', response.error);
          continue;
        }

        if (response.data?.data) {
          setTracks(prev => [response.data.data, ...prev]);
        }
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handlePlayPause = () => {
    if (musicPlayer.isPlaying) {
      musicPlayer.pause();
    } else if (musicPlayer.currentTrack) {
      musicPlayer.play();
    } else if (tracks.length > 0) {
      musicPlayer.playTrackByIndex(0);
    }
  };

  const handleProgressClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !musicPlayer.duration) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = clickX / rect.width;
    const seekTime = percentage * musicPlayer.duration;
    
    musicPlayer.seek(seekTime);
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(event.target.value) / 100;
    musicPlayer.setVolume(volume);
  };

  const formatTime = (seconds: number): string => {
    if (!seconds || !isFinite(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRepeatIcon = () => {
    switch (musicPlayer.repeatMode) {
      case 'one':
        return <div className="relative"><Repeat size={18} /><span className="absolute -top-1 -right-1 text-xs">1</span></div>;
      case 'all':
        return <Repeat size={18} />;
      default:
        return <Repeat size={18} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 border border-purple-500/30 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-6 border-b border-purple-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Music className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Music Player</h2>
                <p className="text-purple-200 text-sm">
                  {tracks.length} tracks in library
                  {collaborativeMode && ' • Collaborative Mode'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-purple-300 hover:text-white p-2 rounded-lg hover:bg-purple-800/50 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex h-[600px]">
          {/* Main Player */}
          <div className="flex-1 p-6 flex flex-col">
            {/* Current Track Display */}
            <div className="bg-gray-800/50 rounded-2xl p-6 mb-6 flex-shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  {musicPlayer.currentTrack ? (
                    <Music className="text-purple-300" size={24} />
                  ) : (
                    <Clock className="text-purple-300" size={24} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold text-white truncate">
                    {musicPlayer.currentTrack?.title || 'No track selected'}
                  </h3>
                  <p className="text-purple-300 truncate">
                    {musicPlayer.currentTrack?.artist || 'Select a track to play'}
                  </p>
                </div>
                {musicPlayer.isLoading && (
                  <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div 
                ref={progressBarRef}
                className="w-full h-2 bg-gray-700 rounded-full cursor-pointer group"
                onClick={handleProgressClick}
              >
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-150 group-hover:from-purple-400 group-hover:to-pink-400"
                  style={{ 
                    width: musicPlayer.duration ? `${(musicPlayer.currentTime / musicPlayer.duration) * 100}%` : '0%' 
                  }}
                />
              </div>
              <div className="flex justify-between text-sm text-purple-300 mt-2">
                <span>{formatTime(musicPlayer.currentTime)}</span>
                <span>{formatTime(musicPlayer.duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <button
                onClick={() => musicPlayer.toggleShuffle()}
                className={`p-3 rounded-xl transition-all ${
                  musicPlayer.isShuffle 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-800 text-purple-300 hover:bg-purple-800/50'
                }`}
              >
                <Shuffle size={18} />
              </button>
              
              <button
                onClick={() => musicPlayer.previousTrack()}
                disabled={tracks.length === 0}
                className="p-3 bg-gray-800 text-purple-300 rounded-xl hover:bg-purple-800/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SkipBack size={20} />
              </button>
              
              <button
                onClick={handlePlayPause}
                disabled={tracks.length === 0 || musicPlayer.isLoading}
                className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {musicPlayer.isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
              
              <button
                onClick={() => musicPlayer.nextTrack()}
                disabled={tracks.length === 0}
                className="p-3 bg-gray-800 text-purple-300 rounded-xl hover:bg-purple-800/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SkipForward size={20} />
              </button>
              
              <button
                onClick={() => musicPlayer.toggleRepeat()}
                className={`p-3 rounded-xl transition-all ${
                  musicPlayer.repeatMode !== 'none' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-800 text-purple-300 hover:bg-purple-800/50'
                }`}
              >
                {getRepeatIcon()}
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-3 mb-6">
              <button className="text-purple-300 hover:text-white transition-colors">
                {musicPlayer.volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={musicPlayer.volume * 100}
                onChange={handleVolumeChange}
                className="flex-1 h-2 bg-gray-700 rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                  [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-purple-500 [&::-webkit-slider-thumb]:to-pink-500 
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
              />
              <span className="text-sm text-purple-300 w-10 text-right">
                {Math.round(musicPlayer.volume * 100)}%
              </span>
            </div>

            {/* Upload Section */}
            <div className="mt-auto">
              <div className="border-2 border-dashed border-purple-500/30 rounded-xl p-4 text-center">
                <Upload className="mx-auto h-8 w-8 text-purple-400 mb-2" />
                <p className="text-purple-200 mb-2">Upload Music Files</p>
                <p className="text-sm text-purple-300 mb-3">
                  Drag & drop audio files or click to browse
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Choose Files'}
                </button>
              </div>
            </div>
          </div>

          {/* Playlist Sidebar */}
          <div className="w-80 border-l border-purple-500/30 p-6 bg-gray-900/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <List size={18} />
                Playlist
              </h3>
            </div>
            
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {loading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-purple-300">Loading tracks...</p>
                </div>
              ) : tracks.length === 0 ? (
                <div className="text-center py-8">
                  <Music className="mx-auto h-12 w-12 text-purple-500 mb-4" />
                  <p className="text-purple-200">No tracks found</p>
                  <p className="text-sm text-purple-400">Upload some music to get started</p>
                </div>
              ) : (
                tracks.map((track, index) => (
                  <div
                    key={track.id}
                    onClick={() => musicPlayer.playTrackByIndex(index)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      musicPlayer.currentIndex === index
                        ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/50'
                        : 'bg-gray-800/50 hover:bg-purple-800/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        {musicPlayer.currentIndex === index && musicPlayer.isPlaying ? (
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        ) : (
                          <Music className="text-purple-300" size={14} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">
                          {track.title}
                        </p>
                        <p className="text-purple-300 text-xs truncate">
                          {track.artist}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;