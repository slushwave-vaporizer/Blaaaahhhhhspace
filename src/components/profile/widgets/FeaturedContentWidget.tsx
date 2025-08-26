import React, { useState } from 'react'
import { WidgetConfig } from '../../../hooks/useProfileBuilder'
import { StarIcon, EyeIcon, HeartIcon, ShareIcon, PlayIcon } from '@heroicons/react/24/outline'

interface FeaturedContentWidgetProps {
  widget: WidgetConfig
}

export const FeaturedContentWidget: React.FC<FeaturedContentWidgetProps> = ({ widget }) => {
  const data = widget.data || {}
  
  // Mock featured content
  const featuredItems = data.items || [
    {
      id: '1',
      title: 'Neon Genesis Cityscape',
      type: 'image',
      category: 'Digital Art',
      description: 'A cyberpunk-inspired cityscape featuring neon lights and futuristic architecture.',
      thumbnail: '/api/placeholder/300/200',
      views: 15420,
      likes: 892,
      shares: 156,
      featured: true,
      createdAt: '2024-02-10',
      tags: ['Cyberpunk', 'Digital Art', 'Concept Art']
    },
    {
      id: '2',
      title: 'Motion Graphics Showreel 2024',
      type: 'video',
      category: 'Animation',
      description: 'A compilation of my best motion graphics work from the past year.',
      thumbnail: '/api/placeholder/300/200',
      duration: '2:34',
      views: 8730,
      likes: 654,
      shares: 89,
      featured: false,
      createdAt: '2024-01-28',
      tags: ['Motion Graphics', 'Showreel', 'Animation']
    },
    {
      id: '3',
      title: 'Vaporwave Album Cover Series',
      type: 'collection',
      category: 'Design',
      description: 'A series of album covers inspired by 80s aesthetics and vaporwave culture.',
      thumbnail: '/api/placeholder/300/200',
      items: 12,
      views: 12540,
      likes: 743,
      shares: 234,
      featured: false,
      createdAt: '2024-02-05',
      tags: ['Vaporwave', 'Album Art', 'Retro']
    }
  ]

  const [selectedItem, setSelectedItem] = useState(featuredItems.find(item => item.featured) || featuredItems[0])
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set())
  
  const toggleLike = (itemId: string) => {
    const newLiked = new Set(likedItems)
    if (newLiked.has(itemId)) {
      newLiked.delete(itemId)
    } else {
      newLiked.add(itemId)
    }
    setLikedItems(newLiked)
  }
  
  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`
    return views.toString()
  }
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <PlayIcon className="w-4 h-4" />
      case 'collection': return <div className="w-4 h-4 grid grid-cols-2 gap-0.5"><div className="bg-current w-1.5 h-1.5 rounded-sm"></div><div className="bg-current w-1.5 h-1.5 rounded-sm"></div><div className="bg-current w-1.5 h-1.5 rounded-sm"></div><div className="bg-current w-1.5 h-1.5 rounded-sm"></div></div>
      default: return <StarIcon className="w-4 h-4" />
    }
  }

  return (
    <div className="w-full h-full p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-pink-400 flex items-center">
          <StarIcon className="w-4 h-4 mr-1" />
          Featured Work
        </h3>
        <div className="text-xs text-gray-400">
          {featuredItems.length} items
        </div>
      </div>
      
      {/* Featured Item Display */}
      <div className="mb-4">
        <div className="relative bg-gray-800 rounded-lg overflow-hidden group">
          {/* Main Display */}
          <div className="aspect-video bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center relative">
            <div className="text-center p-4">
              <div className="flex items-center justify-center mb-2">
                <div className="p-3 bg-pink-500/20 rounded-full">
                  {getTypeIcon(selectedItem.type)}
                </div>
              </div>
              <h4 className="text-white font-medium mb-2">{selectedItem.title}</h4>
              <div className="text-xs text-gray-400 mb-2">{selectedItem.category}</div>
              <p className="text-sm text-gray-300 max-w-xs">{selectedItem.description}</p>
            </div>
            
            {/* Type Badge */}
            <div className="absolute top-2 left-2 flex items-center space-x-1 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
              {getTypeIcon(selectedItem.type)}
              <span className="capitalize">{selectedItem.type}</span>
              {selectedItem.duration && <span>• {selectedItem.duration}</span>}
              {selectedItem.items && <span>• {selectedItem.items} items</span>}
            </div>
            
            {/* Featured Badge */}
            {selectedItem.featured && (
              <div className="absolute top-2 right-2 bg-pink-600 text-white text-xs px-2 py-1 rounded-full">
                Featured
              </div>
            )}
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
              <button className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium transition-colors">
                View Full Work
              </button>
            </div>
          </div>
          
          {/* Stats and Actions */}
          <div className="p-3">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <EyeIcon className="w-3 h-3" />
                  <span>{formatViews(selectedItem.views)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <HeartIcon className="w-3 h-3" />
                  <span>{selectedItem.likes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ShareIcon className="w-3 h-3" />
                  <span>{selectedItem.shares}</span>
                </div>
              </div>
              <span>{new Date(selectedItem.createdAt).toLocaleDateString()}</span>
            </div>
            
            {/* Tags */}
            <div className="flex space-x-1 mb-3 overflow-x-auto">
              {selectedItem.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full whitespace-nowrap"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => toggleLike(selectedItem.id)}
                className={`flex items-center space-x-1 px-3 py-1.5 text-xs rounded-lg transition-colors ${
                  likedItems.has(selectedItem.id)
                    ? 'bg-pink-600/20 border border-pink-500/30 text-pink-400'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                <HeartIcon className={`w-3 h-3 ${likedItems.has(selectedItem.id) ? 'fill-current' : ''}`} />
                <span>Like</span>
              </button>
              
              <button className="flex items-center space-x-1 px-3 py-1.5 bg-gray-700 text-gray-400 text-xs rounded-lg hover:bg-gray-600 transition-colors">
                <ShareIcon className="w-3 h-3" />
                <span>Share</span>
              </button>
              
              <button className="flex-1 px-3 py-1.5 bg-pink-600 hover:bg-pink-700 text-white text-xs rounded-lg font-medium transition-colors">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Other Items */}
      <div className="space-y-2">
        <h5 className="text-xs font-medium text-gray-400">More Featured Work</h5>
        {featuredItems.filter(item => item.id !== selectedItem.id).slice(0, 2).map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="w-full flex items-center space-x-3 p-2 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors text-left"
          >
            {/* Thumbnail */}
            <div className="w-12 h-8 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded flex items-center justify-center flex-shrink-0">
              <div className="text-pink-400">{getTypeIcon(item.type)}</div>
            </div>
            
            {/* Item Info */}
            <div className="flex-1 min-w-0">
              <h6 className="text-sm font-medium text-white truncate">{item.title}</h6>
              <div className="text-xs text-gray-400 flex items-center space-x-2">
                <span>{item.category}</span>
                <span>•</span>
                <span>{formatViews(item.views)} views</span>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex items-center space-x-2 text-xs text-gray-400 flex-shrink-0">
              <div className="flex items-center space-x-1">
                <HeartIcon className="w-3 h-3" />
                <span>{item.likes}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      {/* Portfolio Link */}
      <div className="mt-4 pt-3 border-t border-gray-800">
        <button className="w-full px-3 py-2 bg-pink-600/20 border border-pink-500/30 text-pink-400 text-xs rounded-lg hover:bg-pink-600/30 transition-colors">
          View Complete Portfolio
        </button>
      </div>
    </div>
  )
}