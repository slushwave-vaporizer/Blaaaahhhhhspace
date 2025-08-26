// YourSpace Creative Labs - Marketplace Page with Basic Functionality
import { useState, useEffect } from 'react'
import { useContent } from '../../hooks/useContent'
import { 
  ShoppingBagIcon,
  TagIcon,
  StarIcon,
  CurrencyDollarIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { formatCurrency, cn } from '../../lib/utils'

const categories = [
  { id: 'all', name: 'All Items', icon: ShoppingBagIcon },
  { id: 'templates', name: 'Templates', icon: TagIcon },
  { id: 'assets', name: 'Digital Assets', icon: StarIcon },
  { id: 'presets', name: 'Presets', icon: CurrencyDollarIcon },
]

const sortOptions = [
  { id: 'featured', name: 'Featured' },
  { id: 'newest', name: 'Newest' },
  { id: 'price_low', name: 'Price: Low to High' },
  { id: 'price_high', name: 'Price: High to Low' },
  { id: 'popular', name: 'Most Popular' },
]

// Sample marketplace items (in production, fetch from database)
const sampleItems = [
  {
    id: '1',
    title: 'Vaporwave UI Kit',
    description: 'Complete UI kit with neon components and cyberpunk elements',
    price: 2499, // $24.99
    originalPrice: 3999,
    category: 'templates',
    creator: 'DesignNinja',
    rating: 4.8,
    sales: 156,
    thumbnail: '/api/placeholder/300/200',
    tags: ['ui-kit', 'vaporwave', 'components']
  },
  {
    id: '2',
    title: 'Synthwave Music Pack',
    description: '20 high-quality synthwave tracks for your projects',
    price: 1999, // $19.99
    category: 'assets',
    creator: 'SynthMaster',
    rating: 4.9,
    sales: 89,
    thumbnail: '/api/placeholder/300/200',
    tags: ['music', 'synthwave', 'audio']
  },
  {
    id: '3',
    title: 'Neon Photo Presets',
    description: 'Professional photo editing presets for cyberpunk aesthetics',
    price: 1499, // $14.99
    category: 'presets',
    creator: 'CyberPhotog',
    rating: 4.7,
    sales: 234,
    thumbnail: '/api/placeholder/300/200',
    tags: ['photography', 'presets', 'neon']
  }
]

export const MarketplacePage = () => {
  const [items, setItems] = useState(sampleItems)
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredItems, setFilteredItems] = useState(sampleItems)

  useEffect(() => {
    let filtered = [...items]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => b.id.localeCompare(a.id))
        break
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'popular':
        filtered.sort((a, b) => b.sales - a.sales)
        break
      default:
        // featured - keep original order
        break
    }

    setFilteredItems(filtered)
  }, [items, searchQuery, selectedCategory, sortBy])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold gradient-text mb-4">Creative Marketplace</h1>
        <p className="text-gray-400 text-lg">
          Discover and purchase digital assets, templates, and creative resources
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
        {/* Search Bar */}
        <div className="relative mb-6">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for templates, assets, presets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-black/30 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
          />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Category Filters */}
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <span className="text-gray-400 text-sm font-medium">Category:</span>
            <div className="flex space-x-2">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      'flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                      selectedCategory === category.id
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-400/50'
                        : 'bg-black/30 text-gray-400 hover:bg-purple-500/10 hover:text-purple-300 border border-transparent'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{category.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 text-sm font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-black/30 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
            >
              {sortOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="loading-spinner w-8 h-8" />
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-xl overflow-hidden hover:border-purple-400/40 hover:scale-105 transition-all duration-200 group cursor-pointer"
              >
                {/* Item Image */}
                <div className="aspect-video bg-gradient-to-br from-purple-600/20 to-pink-600/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Price Badge */}
                  <div className="absolute top-3 right-3">
                    <div className="bg-black/70 rounded-lg px-2 py-1">
                      <span className="text-purple-300 font-semibold">
                        {formatCurrency(item.price)}
                      </span>
                      {item.originalPrice && (
                        <span className="text-gray-400 text-sm line-through ml-1">
                          {formatCurrency(item.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Rating */}
                  <div className="absolute bottom-3 left-3">
                    <div className="flex items-center space-x-1 bg-black/70 rounded-lg px-2 py-1">
                      <StarIcon className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-white text-sm font-medium">{item.rating}</span>
                      <span className="text-gray-400 text-sm">({item.sales})</span>
                    </div>
                  </div>
                </div>

                {/* Item Info */}
                <div className="p-4">
                  <h3 className="text-white font-semibold text-lg mb-1 truncate">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-purple-300 text-sm">
                      by {item.creator}
                    </span>
                    <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white text-sm font-medium hover:from-pink-600 hover:to-purple-600 transition-all">
                      Buy Now
                    </button>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {item.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
              <ShoppingBagIcon className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Items Found</h3>
            <p className="text-gray-400">
              {searchQuery 
                ? `No results found for "${searchQuery}"`
                : 'No items available in this category'
              }
            </p>
          </div>
        )}
      </div>

      {/* Seller CTA */}
      <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Become a Seller</h2>
        <p className="text-gray-400 mb-6">
          Share your creative work with the community and earn money from your digital assets.
        </p>
        <button className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-white font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-200 neon-glow">
          Start Selling
        </button>
      </div>
    </div>
  )
}