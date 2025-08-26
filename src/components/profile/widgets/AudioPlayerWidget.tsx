import React, { useState, useEffect } from 'react'
import { WidgetConfig } from '../../../hooks/useProfileBuilder'
import { MusicalNoteIcon, PlayIcon, PauseIcon, SpeakerWaveIcon, HeartIcon } from '@heroicons/react/24/outline'

interface AudioPlayerWidgetProps {
  widget: WidgetConfig
}

export const AudioPlayerWidget: React.FC<AudioPlayerWidgetProps> = ({ widget }) => {
  const data = widget.data || {}
  
  // Mock audio data
  const tracks = data.tracks || [
    {
      id: '1',
      title: 'Neon Nights',
      artist: 'Alex Chen',
      duration: '3:42',
      genre: 'Synthwave',
      plays: 12540,
      likes: 890,
      waveform: Array.from({ length: 60 }, () => Math.random() * 100)
    },
    {
      id: '2',
      title: 'Digital Dreams',
      artist: 'Alex Chen',
      duration: '4:18',
      genre: 'Ambient',
      plays: 8730,
      likes: 654,
      waveform: Array.from({ length: 60 }, () => Math.random() * 100)
    },
    {
      id: '3',
      title: 'Cyberpunk City',
      artist: 'Alex Chen',
      duration: '5:05',
      genre: 'Electronic',
      plays: 15230,
      likes: 1240,
      waveform: Array.from({ length: 60 }, () => Math.random() * 100)
    }
  ]

  const [currentTrack, setCurrentTrack] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(75)
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set())

  const track = tracks[currentTrack]

  // Simulate playback progress
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false)
            return 0
          }
          return prev + 0.5
        })
      }, 100)
    }
    return () => clearInterval(interval)
  }, [isPlaying])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleLike = (trackId: string) => {
    const newLiked = new Set(likedTracks)
    if (newLiked.has(trackId)) {
      newLiked.delete(trackId)
    } else {
      newLiked.add(trackId)
    }
    setLikedTracks(newLiked)
  }

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length)
    setProgress(0)
  }

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length)
    setProgress(0)
  }

  const formatTime = (percentage: number, duration: string) => {
    const [minutes, seconds] = duration.split(':').map(Number)
    const totalSeconds = minutes * 60 + seconds
    const currentSeconds = Math.floor((percentage / 100) * totalSeconds)
    const currentMinutes = Math.floor(currentSeconds / 60)
    const remainingSeconds = currentSeconds % 60
    return `${currentMinutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="w-full h-full p-4 bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-pink-400 flex items-center">
          <MusicalNoteIcon className="w-4 h-4 mr-1" />
          Audio Player
        </h3>
        <div className="text-xs text-gray-400">
          {tracks.length} tracks
        </div>
      </div>
      
      {/* Current Track Info */}
      <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
        <div className="flex items-center space-x-3">
          {/* Album Art Placeholder */}
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <MusicalNoteIcon className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-white truncate">{track.title}</h4>
            <div className="text-xs text-gray-400">{track.artist} • {track.genre}</div>
            <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
              <span>{track.plays.toLocaleString()} plays</span>
              <span>{track.likes} likes</span>
            </div>
          </div>
          
          <button
            onClick={() => toggleLike(track.id)}
            className={`p-2 rounded-full transition-colors ${
              likedTracks.has(track.id)
                ? 'text-pink-500 bg-pink-500/20'
                : 'text-gray-400 hover:text-pink-400'
            }`}
          >
            <HeartIcon className={`w-4 h-4 ${likedTracks.has(track.id) ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
      
      {/* Waveform */}
      <div className="mb-4">
        <div className="flex items-end space-x-0.5 h-16 bg-gray-800/30 rounded-lg p-2 overflow-hidden">
          {track.waveform.map((height, index) => {
            const isActive = (index / track.waveform.length) * 100 <= progress
            return (
              <div
                key={index}
                className={`flex-1 rounded-full transition-colors duration-150 ${
                  isActive 
                    ? 'bg-gradient-to-t from-pink-500 to-purple-400' 
                    : 'bg-gray-600'
                }`}
                style={{ height: `${height}%` }}
              />
            )
          })}
        </div>
        
        {/* Progress Info */}
        <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
          <span>{formatTime(progress, track.duration)}</span>
          <span>{track.duration}</span>
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex items-center justify-center space-x-4 mb-4">
        <button
          onClick={prevTrack}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
          </svg>
        </button>
        
        <button
          onClick={togglePlay}
          className="p-3 bg-pink-600 hover:bg-pink-700 text-white rounded-full transition-colors"
        >
          {isPlaying ? (
            <PauseIcon className="w-5 h-5" />
          ) : (
            <PlayIcon className="w-5 h-5" />
          )}
        </button>
        
        <button
          onClick={nextTrack}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M11.555 14.832A1 1 0 0010 14v-2.798l-5.445 3.63A1 1 0 003 14V6a1 1 0 011.555-.832L10 8.798V6a1 1 0 011.555-.832l6 4a1 1 0 010 1.664l-6 4z" />
          </svg>
        </button>
      </div>
      
      {/* Volume Control */}
      <div className="flex items-center space-x-2 mb-4">
        <SpeakerWaveIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <div className="flex-1">
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, rgb(236 72 153) 0%, rgb(236 72 153) ${volume}%, rgb(55 65 81) ${volume}%, rgb(55 65 81) 100%)`
            }}
          />
        </div>
        <span className="text-xs text-gray-400 w-8">{volume}%</span>
      </div>
      
      {/* Track List */}
      <div className="space-y-1">
        {tracks.map((t, index) => (
          <button
            key={t.id}
            onClick={() => {
              setCurrentTrack(index)
              setProgress(0)
            }}
            className={`w-full flex items-center space-x-2 p-2 rounded-lg text-left transition-colors ${
              index === currentTrack
                ? 'bg-pink-500/20 border border-pink-500/30'
                : 'hover:bg-gray-800/50'
            }`}
          >
            <div className="flex-shrink-0">
              {index === currentTrack && isPlaying ? (
                <div className="flex space-x-0.5">
                  <div className="w-1 h-4 bg-pink-400 rounded animate-pulse"></div>
                  <div className="w-1 h-4 bg-pink-400 rounded animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-4 bg-pink-400 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                </div>
              ) : (
                <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center">
                  <span className="text-xs text-gray-400">{index + 1}</span>
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="text-sm text-white truncate">{t.title}</div>
              <div className="text-xs text-gray-400">{t.duration} • {t.genre}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}