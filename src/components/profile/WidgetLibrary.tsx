import React, { useState, useMemo } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { WidgetType } from '../../hooks/useProfileBuilder'
import {
  PhotoIcon,
  UserIcon,
  LinkIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  AcademicCapIcon,
  MusicalNoteIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  PhoneIcon,
  ChartBarIcon,
  StarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

interface WidgetLibraryProps {
  className?: string
}

interface WidgetInfo {
  type: WidgetType
  name: string
  description: string
  icon: React.ComponentType<any>
  category: 'content' | 'profile' | 'interaction' | 'media'
  color: string
  isPremium?: boolean
  difficulty: 'easy' | 'medium' | 'advanced'
}

const WIDGET_DEFINITIONS: WidgetInfo[] = [
  {
    type: 'portfolio-gallery',
    name: 'Portfolio Gallery',
    description: 'Showcase your work with an elegant gallery layout',
    icon: PhotoIcon,
    category: 'content',
    color: 'bg-purple-500',
    difficulty: 'easy'
  },
  {
    type: 'about-section',
    name: 'About Me',
    description: 'Tell your story with a personal introduction',
    icon: UserIcon,
    category: 'profile',
    color: 'bg-blue-500',
    difficulty: 'easy'
  },
  {
    type: 'social-links',
    name: 'Social Links',
    description: 'Connect visitors to your social media profiles',
    icon: LinkIcon,
    category: 'profile',
    color: 'bg-green-500',
    difficulty: 'easy'
  },
  {
    type: 'shop',
    name: 'Shop',
    description: 'Display and sell your products directly',
    icon: ShoppingBagIcon,
    category: 'interaction',
    color: 'bg-yellow-500',
    isPremium: true,
    difficulty: 'advanced'
  },
  {
    type: 'collaboration-board',
    name: 'Collaboration Board',
    description: 'Show your collaborative projects and teamwork',
    icon: UserGroupIcon,
    category: 'content',
    color: 'bg-indigo-500',
    difficulty: 'medium'
  },
  {
    type: 'learning-progress',
    name: 'Learning Progress',
    description: 'Display your educational achievements and progress',
    icon: AcademicCapIcon,
    category: 'profile',
    color: 'bg-cyan-500',
    difficulty: 'medium'
  },
  {
    type: 'audio-player',
    name: 'Audio Player',
    description: 'Share your music, podcasts, or audio content',
    icon: MusicalNoteIcon,
    category: 'media',
    color: 'bg-pink-500',
    difficulty: 'medium'
  },
  {
    type: 'video-showcase',
    name: 'Video Showcase',
    description: 'Feature your video content and reels',
    icon: VideoCameraIcon,
    category: 'media',
    color: 'bg-red-500',
    difficulty: 'medium'
  },
  {
    type: 'blog-updates',
    name: 'Blog Updates',
    description: 'Share your latest thoughts and blog posts',
    icon: DocumentTextIcon,
    category: 'content',
    color: 'bg-orange-500',
    difficulty: 'easy'
  },
  {
    type: 'contact',
    name: 'Contact',
    description: 'Make it easy for visitors to get in touch',
    icon: PhoneIcon,
    category: 'interaction',
    color: 'bg-emerald-500',
    difficulty: 'easy'
  },
  {
    type: 'statistics',
    name: 'Statistics',
    description: 'Show your achievements and key metrics',
    icon: ChartBarIcon,
    category: 'profile',
    color: 'bg-violet-500',
    difficulty: 'easy'
  },
  {
    type: 'featured-content',
    name: 'Featured Content',
    description: 'Highlight your best and most popular work',
    icon: StarIcon,
    category: 'content',
    color: 'bg-amber-500',
    isPremium: true,
    difficulty: 'advanced'
  }
]

const CATEGORY_LABELS = {
  content: 'Content & Portfolio',
  profile: 'Personal Info',
  interaction: 'Engagement',
  media: 'Media & Audio'
}

const DIFFICULTY_COLORS = {
  easy: 'bg-green-500',
  medium: 'bg-yellow-500',
  advanced: 'bg-red-500'
}

interface DraggableWidgetProps {
  widget: WidgetInfo
}

const DraggableWidget: React.FC<DraggableWidgetProps> = ({ widget }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging
  } = useDraggable({
    id: `library-${widget.type}`,
    data: { type: widget.type }
  })

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined

  const IconComponent = widget.icon

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={`group relative p-4 rounded-lg border transition-all duration-200 cursor-grab active:cursor-grabbing ${
        isDragging
          ? 'z-50 shadow-2xl shadow-pink-500/20 border-pink-500 bg-gray-800 scale-105'
          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800 hover:scale-[1.02]'
      }`}
    >
      {/* Premium Badge */}
      {widget.isPremium && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
          <SparklesIcon className="w-3 h-3 text-white" />
        </div>
      )}
      
      {/* Difficulty Indicator */}
      <div className={`absolute top-2 left-2 w-2 h-2 rounded-full ${DIFFICULTY_COLORS[widget.difficulty]}`}
           title={`Difficulty: ${widget.difficulty}`}></div>
      
      {/* Widget Icon */}
      <div className={`w-12 h-12 rounded-lg ${widget.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
        <IconComponent className="w-6 h-6 text-white" />
      </div>
      
      {/* Widget Info */}
      <div className="space-y-2">
        <h4 className="font-semibold text-gray-200 text-sm group-hover:text-white transition-colors">
          {widget.name}
        </h4>
        <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
          {widget.description}
        </p>
        
        {/* Category Badge */}
        <div className="flex items-center justify-between mt-3">
          <span className="inline-block px-2 py-1 text-xs bg-gray-700/50 text-gray-300 rounded-full">
            {CATEGORY_LABELS[widget.category]}
          </span>
          
          {/* Drag Indicator */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex space-x-0.5">
              <div className="w-1 h-1 bg-pink-400 rounded-full"></div>
              <div className="w-1 h-1 bg-pink-400 rounded-full"></div>
              <div className="w-1 h-1 bg-pink-400 rounded-full"></div>
              <div className="w-1 h-1 bg-pink-400 rounded-full"></div>
              <div className="w-1 h-1 bg-pink-400 rounded-full"></div>
              <div className="w-1 h-1 bg-pink-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-pink-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none"></div>
    </div>
  )
}

export const WidgetLibrary: React.FC<WidgetLibraryProps> = ({ className = '' }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showPremiumOnly, setShowPremiumOnly] = useState(false)
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  
  // Filter widgets based on search and filters
  const filteredWidgets = useMemo(() => {
    return WIDGET_DEFINITIONS.filter(widget => {
      const matchesSearch = !searchQuery || 
        widget.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        widget.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory = selectedCategory === 'all' || widget.category === selectedCategory
      const matchesPremium = !showPremiumOnly || widget.isPremium
      const matchesDifficulty = selectedDifficulty === 'all' || widget.difficulty === selectedDifficulty
      
      return matchesSearch && matchesCategory && matchesPremium && matchesDifficulty
    })
  }, [searchQuery, selectedCategory, showPremiumOnly, selectedDifficulty])

  // Group widgets by category for display
  const widgetsByCategory = useMemo(() => {
    const groups: Record<string, WidgetInfo[]> = {}
    
    filteredWidgets.forEach(widget => {
      if (!groups[widget.category]) {
        groups[widget.category] = []
      }
      groups[widget.category].push(widget)
    })
    
    return groups
  }, [filteredWidgets])

  const resetFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setShowPremiumOnly(false)
    setSelectedDifficulty('all')
  }

  return (
    <div className={`h-full flex flex-col bg-gray-900/50 backdrop-blur-sm ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-800 bg-gray-900/30">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center">
            <PhotoIcon className="w-5 h-5 text-pink-400 mr-2" />
            Widget Library
          </h2>
          <div className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
            {filteredWidgets.length} widget{filteredWidgets.length !== 1 ? 's' : ''}
          </div>
        </div>
        
        {/* Search */}
        <div className="relative mb-3">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search widgets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
            >
              ×
            </button>
          )}
        </div>
        
        {/* Filters */}
        <div className="space-y-3">
          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <FunnelIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded text-sm text-white focus:outline-none focus:ring-1 focus:ring-pink-500"
            >
              <option value="all">All Categories</option>
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          
          {/* Difficulty & Premium Filters */}
          <div className="flex space-x-2">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded text-sm text-white focus:outline-none focus:ring-1 focus:ring-pink-500"
            >
              <option value="all">All Levels</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="advanced">Advanced</option>
            </select>
            
            <label className="flex items-center space-x-2 text-sm text-gray-400 cursor-pointer bg-gray-800 px-3 py-1.5 rounded border border-gray-700">
              <input
                type="checkbox"
                checked={showPremiumOnly}
                onChange={(e) => setShowPremiumOnly(e.target.checked)}
                className="w-3 h-3 text-pink-600 bg-gray-700 border-gray-600 rounded focus:ring-pink-500 focus:ring-1"
              />
              <SparklesIcon className="w-4 h-4 text-yellow-500" />
            </label>
          </div>
          
          {/* Reset Filters */}
          {(searchQuery || selectedCategory !== 'all' || showPremiumOnly || selectedDifficulty !== 'all') && (
            <button
              onClick={resetFilters}
              className="text-xs text-pink-400 hover:text-pink-300 transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>
      
      {/* Widget Grid */}
      <div className="flex-1 overflow-y-auto">
        {selectedCategory === 'all' ? (
          // Group by category
          <div className="p-4 space-y-6">
            {Object.entries(widgetsByCategory).map(([category, widgets]) => {
              if (widgets.length === 0) return null
              
              return (
                <div key={category}>
                  <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                    <div className="w-2 h-2 bg-pink-500 rounded-full mr-2"></div>
                    {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
                    <span className="ml-2 text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">({widgets.length})</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {widgets.map(widget => (
                      <DraggableWidget key={widget.type} widget={widget} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          // Single category view
          <div className="p-4">
            <div className="grid grid-cols-1 gap-3">
              {filteredWidgets.map(widget => (
                <DraggableWidget key={widget.type} widget={widget} />
              ))}
            </div>
          </div>
        )}
        
        {/* Empty State */}
        {filteredWidgets.length === 0 && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <MagnifyingGlassIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-400 mb-2">No widgets found</h3>
              <p className="text-sm text-gray-500 mb-4">Try adjusting your search or filters</p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-sm rounded-lg transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-gray-800 bg-gray-900/30">
        <div className="text-xs text-gray-500 space-y-2">
          <p className="text-center font-medium">Drag widgets onto your canvas to add them</p>
          
          <div className="flex items-center justify-center space-x-6">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Easy</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>Medium</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>Advanced</span>
            </div>
            <div className="flex items-center space-x-1">
              <SparklesIcon className="w-3 h-3 text-yellow-500" />
              <span>Premium</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}