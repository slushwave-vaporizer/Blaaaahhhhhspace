// YourSpace Creative Labs - Discover Page
import { useState, useEffect } from 'react'
import { useContent } from '../../hooks/useContent'
import { AudioContentCard } from '../../components/music/AudioContentCard'
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  FireIcon,
  ClockIcon,
  HeartIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { cn, formatRelativeTime } from '../../lib/utils'

const filterOptions = [
  { id: 'all', name: 'All Content', icon: null },
  { id: 'image', name: 'Images', icon: '🖼️' },
  { id: 'video', name: 'Videos', icon: '🎬' },
  { id: 'audio', name: 'Audio', icon: '🎵' },
  { id: 'model', name: '3D Models', icon: '🎲' },
  { id: 'code', name: 'Code', icon: '💻' }
]

const sortOptions = [
  { id: 'trending', name: 'Trending', icon: FireIcon },
  { id: 'recent', name: 'Most Recent', icon: ClockIcon },
  { id: 'popular', name: 'Most Popular', icon: HeartIcon }
]

export const DiscoverPage = () => {
  const { content, loading, fetchContent } = useContent()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedSort, setSelectedSort] = useState('trending')
  const [filteredContent, setFilteredContent] = useState<any[]>([])

  useEffect(() => {
    // Fetch public content
    fetchContent({ isPublic: true, limit: 50 })
  }, [])

  useEffect(() => {
    let filtered = [...content]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply content type filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(item => item.content_type === selectedFilter)
    }

    // Apply sorting
    switch (selectedSort) {
      case 'trending':
        filtered.sort((a, b) => (b.view_count + b.like_count * 2) - (a.view_count + a.like_count * 2))
        break
      case 'recent':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case 'popular':
        filtered.sort((a, b) => b.like_count - a.like_count)
        break
    }

    setFilteredContent(filtered)
  }, [content, searchQuery, selectedFilter, selectedSort])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold gradient-text mb-4">Discover Amazing Content</h1>
        <p className="text-gray-400 text-lg">
          Explore the latest creations from the YourSpace community
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
        {/* Search Bar */}
        <div className="relative mb-6">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for content, creators, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-black/30 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
          />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Content Type Filters */}
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <span className="text-gray-400 text-sm font-medium">Filter:</span>
            <div className="flex space-x-2">
              {filterOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedFilter(option.id)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    selectedFilter === option.id
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-400/50'
                      : 'bg-black/30 text-gray-400 hover:bg-purple-500/10 hover:text-purple-300 border border-transparent'
                  )}
                >
                  {option.icon && <span className="mr-1">{option.icon}</span>}
                  {option.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 text-sm font-medium">Sort by:</span>
            <div className="flex space-x-2">
              {sortOptions.map((option) => {
                const Icon = option.icon
                return (
                  <button
                    key={option.id}
                    onClick={() => setSelectedSort(option.id)}
                    className={cn(
                      'flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                      selectedSort === option.id
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-400/50'
                        : 'bg-black/30 text-gray-400 hover:bg-purple-500/10 hover:text-purple-300 border border-transparent'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{option.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="loading-spinner w-8 h-8" />
          </div>
        ) : filteredContent.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredContent.map((item) => {
              // Use AudioContentCard for audio content
              if (item.content_type === 'audio') {
                return (
                  <AudioContentCard
                    key={item.id}
                    content={item}
                    showPlayCount={true}
                    compact={false}
                  />
                );
              }
              
              // Regular content card for other types
              return (
                <div
                  key={item.id}
                  className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-xl overflow-hidden hover:border-purple-400/40 hover:scale-105 transition-all duration-200 group cursor-pointer"
                >
                  {/* Content Preview */}
                  <div className="aspect-square bg-gradient-to-br from-purple-600/20 to-pink-600/20 relative overflow-hidden">
                    {item.file_url && (
                      <img 
                        src={item.file_url} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    {/* Content Type Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-black/70 rounded-full text-xs text-white capitalize">
                        {item.content_type}
                      </span>
                    </div>
                    
                    {/* Stats Overlay */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-semibold text-sm mb-1 truncate">
                        {item.title}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-gray-300">
                        <span className="flex items-center">
                          <EyeIcon className="h-3 w-3 mr-1" />
                          {item.view_count}
                        </span>
                        <span className="flex items-center">
                          <HeartIcon className="h-3 w-3 mr-1" />
                          {item.like_count}
                        </span>
                        <span>{formatRelativeTime(item.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content Info */}
                  <div className="p-4">
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {item.description || 'No description available'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
              <MagnifyingGlassIcon className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Content Found</h3>
            <p className="text-gray-400">
              {searchQuery 
                ? `No results found for "${searchQuery}"`
                : 'No content available with the selected filters'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}