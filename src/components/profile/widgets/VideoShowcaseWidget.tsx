import React, { useState } from 'react'
import { WidgetConfig } from '../../../hooks/useProfileBuilder'
import { VideoCameraIcon, PlayIcon, EyeIcon, HeartIcon, ShareIcon } from '@heroicons/react/24/outline'

interface VideoShowcaseWidgetProps {
  widget: WidgetConfig
}

export const VideoShowcaseWidget: React.FC<VideoShowcaseWidgetProps> = ({ widget }) => {
  const data = widget.data || {}
  
  // Mock video data
  const videos = data.videos || [
    {
      id: '1',
      title: 'Motion Graphics Reel 2024',
      thumbnail: '/api/placeholder/320/180',
      duration: '2:34',
      views: 15420,
      likes: 892,
      published: '2024-01-15',
      category: 'Demo Reel',
      featured: true
    },
    {
      id: '2',
      title: 'Cyberpunk Logo Animation',
      thumbnail: '/api/placeholder/320/180',
      duration: '0:45',
      views: 8730,
      likes: 654,
      published: '2024-02-01',
      category: 'Logo Design',
      featured: false
    },
    {
      id: '3',
      title: '3D Character Turnaround',
      thumbnail: '/api/placeholder/320/180',
      duration: '1:12',
      views: 12540,
      likes: 743,
      published: '2024-01-28',
      category: '3D Modeling',
      featured: false
    },
    {
      id: '4',
      title: 'UI Animation Showcase',
      thumbnail: '/api/placeholder/320/180',
      duration: '1:58',
      views: 6890,
      likes: 421,
      published: '2024-02-10',
      category: 'UI/UX',
      featured: false
    }
  ]

  const [selectedVideo, setSelectedVideo] = useState(videos.find(v => v.featured) || videos[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set())

  const toggleLike = (videoId: string) => {
    const newLiked = new Set(likedVideos)
    if (newLiked.has(videoId)) {
      newLiked.delete(videoId)
    } else {
      newLiked.add(videoId)
    }
    setLikedVideos(newLiked)
  }

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`
    return views.toString()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 30) return `${diffDays} days ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return `${Math.floor(diffDays / 365)} years ago`
  }

  return (
    <div className="w-full h-full p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-pink-400 flex items-center">
          <VideoCameraIcon className="w-4 h-4 mr-1" />
          Video Showcase
        </h3>
        <div className="text-xs text-gray-400">
          {videos.length} videos
        </div>
      </div>
      
      {/* Featured Video */}
      <div className="mb-4">
        <div className="relative bg-gray-800 rounded-lg overflow-hidden group">
          {/* Video Thumbnail */}
          <div className="aspect-video bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center relative">
            <div className="text-center">
              <VideoCameraIcon className="w-12 h-12 text-pink-400 mx-auto mb-2" />
              <div className="text-white font-medium">{selectedVideo.title}</div>
              <div className="text-xs text-gray-400 mt-1">{selectedVideo.category}</div>
            </div>
            
            {/* Play Button Overlay */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200"
            >
              <div className="w-16 h-16 bg-pink-600 hover:bg-pink-700 rounded-full flex items-center justify-center transition-colors">
                <PlayIcon className="w-8 h-8 text-white ml-1" />
              </div>
            </button>
            
            {/* Duration Badge */}
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {selectedVideo.duration}
            </div>
            
            {/* Featured Badge */}
            {selectedVideo.featured && (
              <div className="absolute top-2 left-2 bg-pink-600 text-white text-xs px-2 py-1 rounded-full">
                Featured
              </div>
            )}
          </div>
          
          {/* Video Info */}
          <div className="p-3">
            <h4 className="text-sm font-medium text-white mb-2">{selectedVideo.title}</h4>
            
            <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <EyeIcon className="w-3 h-3" />
                  <span>{formatViews(selectedVideo.views)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <HeartIcon className="w-3 h-3" />
                  <span>{selectedVideo.likes}</span>
                </div>
              </div>
              <span>{formatDate(selectedVideo.published)}</span>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => toggleLike(selectedVideo.id)}
                className={`flex items-center space-x-1 px-3 py-1.5 text-xs rounded-lg transition-colors ${
                  likedVideos.has(selectedVideo.id)
                    ? 'bg-pink-600/20 border border-pink-500/30 text-pink-400'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                <HeartIcon className={`w-3 h-3 ${likedVideos.has(selectedVideo.id) ? 'fill-current' : ''}`} />
                <span>Like</span>
              </button>
              
              <button className="flex items-center space-x-1 px-3 py-1.5 bg-gray-700 text-gray-400 text-xs rounded-lg hover:bg-gray-600 transition-colors">
                <ShareIcon className="w-3 h-3" />
                <span>Share</span>
              </button>
              
              <button className="flex-1 px-3 py-1.5 bg-pink-600 hover:bg-pink-700 text-white text-xs rounded-lg font-medium transition-colors">
                Watch Full Video
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Video Grid */}
      <div className="space-y-2 max-h-40 overflow-y-auto">
        <h5 className="text-xs font-medium text-gray-400 mb-2">More Videos</h5>
        {videos.filter(v => v.id !== selectedVideo.id).slice(0, 3).map((video) => (
          <button
            key={video.id}
            onClick={() => setSelectedVideo(video)}
            className="w-full flex items-center space-x-3 p-2 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors text-left"
          >
            {/* Thumbnail */}
            <div className="w-16 h-9 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded flex items-center justify-center flex-shrink-0 relative">
              <VideoCameraIcon className="w-4 h-4 text-pink-400" />
              <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                {video.duration}
              </div>
            </div>
            
            {/* Video Info */}
            <div className="flex-1 min-w-0">
              <h6 className="text-sm font-medium text-white truncate">{video.title}</h6>
              <div className="text-xs text-gray-400 flex items-center space-x-2">
                <span>{formatViews(video.views)} views</span>
                <span>•</span>
                <span>{formatDate(video.published)}</span>
              </div>
            </div>
            
            {/* Category Badge */}
            <div className="flex-shrink-0">
              <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
                {video.category}
              </span>
            </div>
          </button>
        ))}
      </div>
      
      {/* Channel Stats */}
      <div className="mt-4 pt-3 border-t border-gray-800">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-sm font-bold text-pink-400">
              {formatViews(videos.reduce((sum, v) => sum + v.views, 0))}
            </div>
            <div className="text-xs text-gray-400">Total Views</div>
          </div>
          <div>
            <div className="text-sm font-bold text-pink-400">
              {videos.reduce((sum, v) => sum + v.likes, 0)}
            </div>
            <div className="text-xs text-gray-400">Total Likes</div>
          </div>
          <div>
            <div className="text-sm font-bold text-pink-400">
              {videos.length}
            </div>
            <div className="text-xs text-gray-400">Videos</div>
          </div>
        </div>
      </div>
    </div>
  )
}