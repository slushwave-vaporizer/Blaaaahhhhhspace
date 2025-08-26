import React, { useState, useEffect } from 'react'
import { WidgetConfig } from '../../../hooks/useProfileBuilder'
import { useAuth } from '../../../hooks/useAuth'
import { supabase } from '../../../lib/supabase'
import { PhotoIcon, PlayIcon, EyeIcon } from '@heroicons/react/24/outline'

interface PortfolioGalleryWidgetProps {
  widget: WidgetConfig
}

interface PortfolioItem {
  id: string
  title: string
  description: string
  type: string
  url?: string
  thumbnail_url?: string
  views: number
  likes: number
  category: string
  tags: string[]
  is_featured: boolean
  created_at: string
}

export const PortfolioGalleryWidget: React.FC<PortfolioGalleryWidgetProps> = ({ widget }) => {
  const { user } = useAuth()
  const data = widget.data || {}
  const layout = data.layout || 'grid'
  const columns = data.columns || 3
  const showCaptions = data.showCaptions || false
  
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadPortfolioItems()
    }
  }, [user])

  const loadPortfolioItems = async () => {
    try {
      const { data, error } = await supabase
        .from('user_portfolio_items')
        .select('*')
        .eq('user_id', user?.id)
        .order('is_featured', { ascending: false })
        .order('views', { ascending: false })

      if (error) {
        console.error('Error loading portfolio items:', error)
        return
      }

      setPortfolioItems(data || [])
    } catch (error) {
      console.error('Error loading portfolio items:', error)
    } finally {
      setLoading(false)
    }
  }

  const createSampleData = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('create-sample-widget-data')
      if (error) throw error
      
      // Reload data after creating samples
      setTimeout(() => {
        loadPortfolioItems()
      }, 1000)
    } catch (error) {
      console.error('Error creating sample data:', error)
    }
  }

  const renderGridLayout = () => (
    <div 
      className={`grid gap-2 h-full overflow-hidden`}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {portfolioItems.slice(0, columns * 2).map((item, index) => (
        <div
          key={item.id}
          className="relative group cursor-pointer overflow-hidden rounded-lg bg-gray-800 border border-gray-700 hover:border-pink-500/50 transition-all duration-300"
          onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
        >
          <div className="w-full h-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
            <div className="text-center p-2">
              {item.type === 'video' ? (
                <PlayIcon className="w-6 h-6 text-pink-400 mx-auto mb-2" />
              ) : (
                <PhotoIcon className="w-6 h-6 text-pink-400 mx-auto mb-2" />
              )}
              <div className="text-xs text-gray-300 font-medium truncate">{item.title}</div>
              {item.is_featured && (
                <div className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full"></div>
              )}
            </div>
          </div>
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="text-center p-2">
              <EyeIcon className="w-5 h-5 text-white mx-auto mb-1" />
              <div className="text-xs text-white">{item.views.toLocaleString()} views</div>
              <div className="text-xs text-white">{item.likes} likes</div>
            </div>
          </div>
          
          {/* Selection Indicator */}
          {selectedItem === item.id && (
            <div className="absolute inset-0 border-2 border-pink-500 bg-pink-500/10 rounded-lg">
              <div className="absolute top-2 right-2 w-3 h-3 bg-pink-500 rounded-full"></div>
            </div>
          )}
          
          {/* Caption */}
          {showCaptions && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
              <div className="text-xs text-white font-medium truncate">{item.title}</div>
              <div className="text-xs text-gray-300 truncate">{item.description}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  )

  const renderMasonryLayout = () => (
    <div className="columns-2 lg:columns-3 gap-2 h-full overflow-hidden">
      {portfolioItems.slice(0, 6).map((item, index) => (
        <div
          key={item.id}
          className={`relative group cursor-pointer overflow-hidden rounded-lg bg-gray-800 border border-gray-700 hover:border-pink-500/50 transition-all duration-300 mb-2 break-inside-avoid ${
            index % 3 === 0 ? 'h-24' : index % 3 === 1 ? 'h-32' : 'h-20'
          }`}
          onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
        >
          <div className="w-full h-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
            <div className="text-center p-2">
              {item.type === 'video' ? (
                <PlayIcon className="w-5 h-5 text-pink-400 mx-auto mb-1" />
              ) : (
                <PhotoIcon className="w-5 h-5 text-pink-400 mx-auto mb-1" />
              )}
              <div className="text-xs text-gray-300 font-medium truncate">{item.title}</div>
              {item.is_featured && (
                <div className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full"></div>
              )}
            </div>
          </div>
          
          {selectedItem === item.id && (
            <div className="absolute inset-0 border-2 border-pink-500 bg-pink-500/10 rounded-lg">
              <div className="absolute top-2 right-2 w-3 h-3 bg-pink-500 rounded-full"></div>
            </div>
          )}
        </div>
      ))}
    </div>
  )

  const renderCarouselLayout = () => {
    const [currentIndex, setCurrentIndex] = useState(0)
    
    if (portfolioItems.length === 0) return null
    
    return (
      <div className="relative h-full">
        {/* Main Display */}
        <div className="h-full relative overflow-hidden rounded-lg bg-gray-800 border border-gray-700">
          <div className="w-full h-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
            <div className="text-center p-4">
              {portfolioItems[currentIndex]?.type === 'video' ? (
                <PlayIcon className="w-8 h-8 text-pink-400 mx-auto mb-2" />
              ) : (
                <PhotoIcon className="w-8 h-8 text-pink-400 mx-auto mb-2" />
              )}
              <div className="text-sm text-gray-300 font-medium mb-1">
                {portfolioItems[currentIndex]?.title}
              </div>
              <div className="text-xs text-gray-400">
                {portfolioItems[currentIndex]?.description}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {portfolioItems[currentIndex]?.views.toLocaleString()} views • {portfolioItems[currentIndex]?.likes} likes
              </div>
            </div>
          </div>
          
          {/* Navigation Arrows */}
          {portfolioItems.length > 1 && (
            <>
              <button
                onClick={() => setCurrentIndex((prev) => 
                  prev > 0 ? prev - 1 : portfolioItems.length - 1
                )}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={() => setCurrentIndex((prev) => 
                  prev < portfolioItems.length - 1 ? prev + 1 : 0
                )}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>
        
        {/* Thumbnails */}
        {portfolioItems.length > 1 && (
          <div className="absolute bottom-2 left-2 right-2 flex space-x-1 overflow-x-auto">
            {portfolioItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 w-8 h-6 rounded border transition-colors ${
                  index === currentIndex
                    ? 'border-pink-500 bg-pink-500/20'
                    : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                }`}
              >
                <div className="w-full h-full flex items-center justify-center">
                  {item.type === 'video' ? (
                    <PlayIcon className="w-3 h-3 text-pink-400" />
                  ) : (
                    <PhotoIcon className="w-3 h-3 text-gray-400" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="w-full h-full p-3 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <div className="text-sm text-gray-400">Loading portfolio...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full p-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-pink-400 flex items-center">
          <PhotoIcon className="w-4 h-4 mr-1" />
          Portfolio
        </h3>
        <div className="text-xs text-gray-400">
          {portfolioItems.length} items
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 h-[calc(100%-2rem)]">
        {portfolioItems.length > 0 ? (
          <>
            {layout === 'grid' && renderGridLayout()}
            {layout === 'masonry' && renderMasonryLayout()}
            {layout === 'carousel' && renderCarouselLayout()}
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-4">
              <PhotoIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <div className="text-sm text-gray-400 mb-2">No portfolio items yet</div>
              <button
                onClick={createSampleData}
                className="px-3 py-2 bg-pink-600 hover:bg-pink-700 text-white text-xs rounded-lg transition-colors"
              >
                Add Sample Data
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}