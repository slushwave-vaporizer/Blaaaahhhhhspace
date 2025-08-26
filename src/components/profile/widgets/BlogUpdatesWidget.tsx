import React, { useState } from 'react'
import { WidgetConfig } from '../../../hooks/useProfileBuilder'
import { DocumentTextIcon, ClockIcon, TagIcon, EyeIcon } from '@heroicons/react/24/outline'

interface BlogUpdatesWidgetProps {
  widget: WidgetConfig
}

export const BlogUpdatesWidget: React.FC<BlogUpdatesWidgetProps> = ({ widget }) => {
  const data = widget.data || {}
  
  // Mock blog data
  const posts = data.posts || [
    {
      id: '1',
      title: 'Creating Immersive Cyberpunk Environments',
      excerpt: 'Dive into the techniques I use to build atmospheric digital worlds that capture the essence of cyberpunk aesthetics...',
      content: 'Full blog post content would go here...',
      publishedAt: '2024-02-15T10:30:00Z',
      readTime: 5,
      views: 2340,
      category: 'Tutorial',
      tags: ['3D Art', 'Environment', 'Cyberpunk'],
      featured: true,
      status: 'published'
    },
    {
      id: '2',
      title: 'My Journey into Motion Graphics',
      excerpt: 'From static designs to dynamic animations - how I transitioned into motion graphics and the lessons learned along the way.',
      content: 'Full blog post content would go here...',
      publishedAt: '2024-02-10T14:15:00Z',
      readTime: 3,
      views: 1820,
      category: 'Personal',
      tags: ['Motion Graphics', 'Career'],
      featured: false,
      status: 'published'
    },
    {
      id: '3',
      title: 'Color Theory in Digital Art',
      excerpt: 'Understanding how color psychology impacts digital artwork and creating mood through strategic color choices.',
      content: 'Full blog post content would go here...',
      publishedAt: '2024-02-05T09:00:00Z',
      readTime: 7,
      views: 3150,
      category: 'Theory',
      tags: ['Color Theory', 'Digital Art', 'Design'],
      featured: false,
      status: 'published'
    },
    {
      id: '4',
      title: 'Upcoming NFT Collection Preview',
      excerpt: 'Get a sneak peek at my latest NFT collection featuring vaporwave-inspired digital landscapes...',
      content: 'Draft content...',
      publishedAt: '2024-02-20T12:00:00Z',
      readTime: 4,
      views: 0,
      category: 'Announcement',
      tags: ['NFT', 'Vaporwave', 'Collection'],
      featured: false,
      status: 'draft'
    }
  ]

  const [selectedPost, setSelectedPost] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<'all' | 'published' | 'draft'>('all')
  
  const categories = Array.from(new Set(posts.map(post => post.category)))
  
  const filteredPosts = posts.filter(post => {
    if (activeFilter === 'all') return true
    return post.status === activeFilter
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
  
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Tutorial': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Personal': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Theory': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'Announcement': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    }
    return colors[category] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }

  return (
    <div className="w-full h-full p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-pink-400 flex items-center">
          <DocumentTextIcon className="w-4 h-4 mr-1" />
          Blog & Updates
        </h3>
        <div className="text-xs text-gray-400">
          {posts.filter(p => p.status === 'published').length} published
        </div>
      </div>
      
      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-4 bg-gray-800 rounded-lg p-1">
        {[
          { id: 'all' as const, label: 'All', count: posts.length },
          { id: 'published' as const, label: 'Published', count: posts.filter(p => p.status === 'published').length },
          { id: 'draft' as const, label: 'Drafts', count: posts.filter(p => p.status === 'draft').length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeFilter === tab.id
                ? 'bg-pink-600 text-white'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>
      
      {/* Posts List */}
      <div className="space-y-3 max-h-[calc(100%-8rem)] overflow-y-auto">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className={`bg-gray-800 border rounded-lg p-3 transition-all duration-200 cursor-pointer ${
                post.featured
                  ? 'border-pink-500/50 bg-pink-500/5'
                  : 'border-gray-700 hover:border-gray-600'
              } ${selectedPost === post.id ? 'ring-2 ring-pink-500/30' : ''}`}
              onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
            >
              {/* Post Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-sm font-medium text-white">{post.title}</h4>
                    {post.featured && (
                      <span className="px-2 py-0.5 bg-pink-600 text-white text-xs rounded-full">
                        Featured
                      </span>
                    )}
                    {post.status === 'draft' && (
                      <span className="px-2 py-0.5 bg-yellow-600 text-yellow-100 text-xs rounded-full">
                        Draft
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-3 text-xs text-gray-400">
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="w-3 h-3" />
                      <span>{post.readTime} min read</span>
                    </div>
                    
                    {post.status === 'published' && (
                      <div className="flex items-center space-x-1">
                        <EyeIcon className="w-3 h-3" />
                        <span>{post.views} views</span>
                      </div>
                    )}
                    
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                </div>
                
                <div className={`px-2 py-1 text-xs rounded-full border ${getCategoryColor(post.category)}`}>
                  {post.category}
                </div>
              </div>
              
              {/* Post Excerpt */}
              <p className="text-sm text-gray-300 mb-3 line-clamp-2">{post.excerpt}</p>
              
              {/* Tags */}
              <div className="flex items-center space-x-2 mb-3">
                <TagIcon className="w-3 h-3 text-gray-400" />
                <div className="flex space-x-1">
                  {post.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="text-xs text-gray-400">+{post.tags.length - 3} more</span>
                  )}
                </div>
              </div>
              
              {/* Expanded Content */}
              {selectedPost === post.id && (
                <div className="border-t border-gray-700 pt-3 mt-3">
                  <div className="text-sm text-gray-300 mb-3">
                    {post.status === 'draft' ? (
                      <div className="italic text-gray-400">
                        This is a draft post. Content preview not available.
                      </div>
                    ) : (
                      post.content
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="px-3 py-1.5 bg-pink-600 hover:bg-pink-700 text-white text-xs rounded-lg transition-colors">
                      {post.status === 'draft' ? 'Edit Draft' : 'Read Full Post'}
                    </button>
                    
                    {post.status === 'published' && (
                      <button className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded-lg transition-colors">
                        Share
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-6">
            <DocumentTextIcon className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <div className="text-sm text-gray-400">No {activeFilter === 'all' ? '' : activeFilter} posts</div>
            <div className="text-xs text-gray-500 mt-1">Start writing to share your thoughts and insights</div>
          </div>
        )}
      </div>
      
      {/* Quick Actions */}
      <div className="mt-4 pt-3 border-t border-gray-800">
        <div className="flex space-x-2">
          <button className="flex-1 px-3 py-2 bg-pink-600/20 border border-pink-500/30 text-pink-400 text-xs rounded-lg hover:bg-pink-600/30 transition-colors">
            New Post
          </button>
          <button className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 text-gray-400 text-xs rounded-lg hover:bg-gray-700 transition-colors">
            View Blog
          </button>
        </div>
      </div>
    </div>
  )
}