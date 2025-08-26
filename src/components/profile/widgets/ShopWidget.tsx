import React, { useState, useEffect } from 'react'
import { WidgetConfig } from '../../../hooks/useProfileBuilder'
import { ShoppingBagIcon, CurrencyDollarIcon, StarIcon, HeartIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../../../hooks/useAuth'
import { supabase } from '../../../lib/supabase'

interface ShopWidgetProps {
  widget: WidgetConfig
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image_url?: string;
  is_available: boolean;
  stock_quantity: number;
  sales_count: number;
  rating: number;
  created_at: string;
}

export const ShopWidget: React.FC<ShopWidgetProps> = ({ widget }) => {
  const { user } = useAuth()
  const data = widget.data || {}
  
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [favoriteItems, setFavoriteItems] = useState<Set<string>>(new Set())
  
  useEffect(() => {
    if (user) {
      loadProducts()
    }
  }, [user])

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('user_products')
        .select('*')
        .eq('user_id', user?.id)
        .order('sales_count', { ascending: false })

      if (error) {
        console.error('Error loading products:', error)
        return
      }

      setProducts(data || [])
    } catch (error) {
      console.error('Error loading products:', error)
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
        loadProducts()
      }, 1000)
    } catch (error) {
      console.error('Error creating sample data:', error)
    }
  }
  
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))]
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory)
  
  const toggleFavorite = (productId: string) => {
    const newFavorites = new Set(favoriteItems)
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId)
    } else {
      newFavorites.add(productId)
    }
    setFavoriteItems(newFavorites)
  }

  if (loading) {
    return (
      <div className="w-full h-full p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <div className="text-sm text-gray-400">Loading products...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-pink-400 flex items-center">
          <ShoppingBagIcon className="w-4 h-4 mr-1" />
          Shop
        </h3>
        <div className="text-xs text-gray-400">
          {products.length} items
        </div>
      </div>
      
      {/* Category Filter */}
      {products.length > 0 && (
        <div className="flex space-x-2 mb-4 overflow-x-auto">
          {categories.map((category: string) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex-shrink-0 px-3 py-1 text-xs rounded-full transition-colors ${
                selectedCategory === category
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}
      
      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 max-h-[calc(100%-8rem)] overflow-y-auto">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="relative bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-pink-500/50 transition-all duration-200 group"
            >
              {/* Product Image */}
              <div className="aspect-square bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center relative">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-full h-full object-cover absolute inset-0"
                  />
                ) : (
                  <ShoppingBagIcon className="w-8 h-8 text-pink-400" />
                )}
                
                {/* Stock Status */}
                {!product.is_available && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-xs text-red-400 font-medium">Out of Stock</span>
                  </div>
                )}
                
                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-2 right-2 p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <HeartIcon 
                    className={`w-3 h-3 ${
                      favoriteItems.has(product.id) 
                        ? 'text-pink-500 fill-current' 
                        : 'text-gray-400'
                    }`} 
                  />
                </button>
              </div>
              
              {/* Product Info */}
              <div className="p-3">
                <h4 className="text-sm font-medium text-white truncate mb-1">
                  {product.name}
                </h4>
                
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1">
                    <CurrencyDollarIcon className="w-3 h-3 text-green-400" />
                    <span className="text-sm font-bold text-green-400">
                      ${product.price}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <StarIcon className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-400">
                      {product.rating}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{product.sales_count} sold</span>
                  <span className="px-2 py-0.5 bg-gray-700 rounded-full">
                    {product.category}
                  </span>
                </div>
                
                {/* Action Button */}
                <button
                  disabled={!product.is_available}
                  className={`w-full mt-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    product.is_available
                      ? 'bg-pink-600 hover:bg-pink-700 text-white'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {product.is_available ? 'Add to Cart' : 'Notify Me'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 mt-4">
          <ShoppingBagIcon className="w-8 h-8 text-gray-600 mx-auto mb-2" />
          <div className="text-sm text-gray-400 mb-2">No products added</div>
          <button
            onClick={createSampleData}
            className="px-3 py-2 bg-pink-600 hover:bg-pink-700 text-white text-xs rounded-lg transition-colors"
          >
            Add Sample Data
          </button>
        </div>
      )}
      
      {/* Shop Stats */}
      {products.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-800">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-sm font-bold text-pink-400">
                {products.reduce((sum, p) => sum + (p.sales_count || 0), 0)}
              </div>
              <div className="text-xs text-gray-400">Total Sales</div>
            </div>
            <div>
              <div className="text-sm font-bold text-pink-400">
                {(products.reduce((sum, p) => sum + (p.rating || 0), 0) / products.length || 0).toFixed(1)}
              </div>
              <div className="text-xs text-gray-400">Avg Rating</div>
            </div>
            <div>
              <div className="text-sm font-bold text-pink-400">
                ${products.reduce((sum, p) => sum + (p.price * (p.sales_count || 0)), 0).toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">Revenue</div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex space-x-2 mt-3">
            <button className="flex-1 px-3 py-2 bg-pink-600/20 border border-pink-500/30 text-pink-400 text-xs rounded-lg hover:bg-pink-600/30 transition-colors">
              View All
            </button>
            <button className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 text-gray-400 text-xs rounded-lg hover:bg-gray-700 transition-colors">
              Contact
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
