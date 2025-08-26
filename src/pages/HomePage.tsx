// YourSpace Creative Labs - Home Page with Real Data
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useContent } from '../hooks/useContent'
import { useAnalytics } from '../hooks/useAnalytics'
import { 
  PlusIcon, 
  FireIcon, 
  SparklesIcon,
  EyeIcon,
  HeartIcon,
  UserGroupIcon,
  HomeIcon
} from '@heroicons/react/24/outline'
import { formatRelativeTime } from '../lib/utils'
import { VirtualRoom } from '../components/room/VirtualRoom'
import { EPKComputerModal } from '../components/room/EPKComputerModal'

export const HomePage = () => {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const { content, loading, fetchContent } = useContent()
  const { stats, fetchTrendingContent } = useAnalytics()
  const [featuredContent, setFeaturedContent] = useState<any[]>([])
  const [showEPKModal, setShowEPKModal] = useState(false)

  useEffect(() => {
    // Fetch user's recent content for activity feed (only if authenticated)
    if (profile) {
      fetchContent({ userId: profile.id, limit: 5 })
    }
    
    // Fetch trending content for featured section
    const loadTrending = async () => {
      const trending = await fetchTrendingContent()
      setFeaturedContent(trending.slice(0, 3))
    }
    loadTrending()
  }, [profile])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const handleOpenEPK = () => {
    setShowEPKModal(true)
  }

  // Anonymous user experience
  if (!user) {
    return (
      <div className="space-y-8">
        {/* Hero Section for Anonymous Users */}
        <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-12 text-center">
          <h1 className="text-5xl font-bold gradient-text mb-4">
            Welcome to YourSpace
          </h1>
          <p className="text-gray-300 text-xl mb-6 max-w-3xl mx-auto">
            Discover amazing artists, explore creative content, and find your next collaboration. 
            Join our creative community to unlock all features.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-white font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-200 neon-glow"
            >
              Join YourSpace
            </Link>
            <Link
              to="/discover-artists"
              className="px-8 py-4 bg-black/20 border border-purple-500/30 rounded-xl text-purple-300 font-semibold hover:bg-purple-500/20 transition-all duration-200"
            >
              Explore Artists
            </Link>
          </div>
        </div>

        {/* Featured Content */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <FireIcon className="h-6 w-6 text-orange-400 mr-2" />
              Trending Now
            </h2>
            <Link to="/discover" className="text-purple-400 hover:text-purple-300 font-medium">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredContent.length > 0 ? featuredContent.map((item) => (
              <div
                key={item.id}
                className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-xl overflow-hidden hover:border-purple-400/40 transition-all duration-200 group"
              >
                <div className="aspect-video bg-gradient-to-br from-purple-600/20 to-pink-600/20 relative overflow-hidden">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-semibold text-lg truncate">{item.title}</h3>
                    <p className="text-gray-300 text-sm">by {item.profiles?.display_name || item.profiles?.username}</p>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="px-2 py-1 bg-black/50 rounded-full text-xs text-white capitalize">
                      {item.content_type}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        {item.view_count?.toLocaleString() || 0}
                      </span>
                      <span className="flex items-center">
                        <HeartIcon className="h-4 w-4 mr-1" />
                        {item.like_count || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-400">Loading amazing content...</p>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-pink-900/20 to-purple-900/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Create?</h2>
          <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
            Join thousands of creators sharing their passion, collaborating on projects, and building their audience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-white font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-200 neon-glow"
            >
              <PlusIcon className="h-5 w-5 inline mr-2" />
              Start Creating
            </Link>
            <Link
              to="/discover-artists"
              className="px-6 py-3 bg-black/20 border border-purple-500/30 rounded-xl text-purple-300 font-semibold hover:bg-purple-500/20 transition-all duration-200"
            >
              <SparklesIcon className="h-5 w-5 inline mr-2" />
              Discover Artists
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Authenticated user experience (existing code)
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">
              {getGreeting()}, {profile?.display_name || profile?.username}!
            </h1>
            <p className="text-gray-400 text-lg">
              Welcome to your creative universe. Ready to make something amazing?
            </p>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/create"
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-white font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-200 neon-glow"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Create</span>
            </Link>
            <Link
              to="/collaborate"
              className="flex items-center space-x-2 px-6 py-3 bg-black/20 border border-purple-500/30 rounded-xl text-purple-300 font-semibold hover:bg-purple-500/20 transition-all duration-200"
            >
              <UserGroupIcon className="h-5 w-5" />
              <span>Collaborate</span>
            </Link>
          </div>
        </div>

        {/* Real User Stats */}
        <div className="grid grid-cols-3 gap-6 mt-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan-400">{stats.totalViews?.toLocaleString() || 0}</div>
            <div className="text-gray-400 text-sm">Total Views</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-pink-400">{stats.totalLikes?.toLocaleString() || 0}</div>
            <div className="text-gray-400 text-sm">Total Likes</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">{stats.totalCollaborations || 0}</div>
            <div className="text-gray-400 text-sm">Collaborations</div>
          </div>
        </div>
      </div>

      {/* Virtual Room */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <HomeIcon className="h-6 w-6 text-blue-400 mr-2" />
            Your Virtual Room
          </h2>
          <button 
            onClick={() => navigate('/studio', { state: { tab: 'epk' } })}
            className="text-purple-400 hover:text-purple-300 font-medium"
          >
            Manage EPK
          </button>
        </div>

        <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
          <VirtualRoom 
            onOpenEPK={handleOpenEPK}
            className="mb-4"
          />
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              Click on objects in your room to interact with them. Your EPK computer allows you to create and manage your Electronic Press Kit.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Content */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <FireIcon className="h-6 w-6 text-orange-400 mr-2" />
            Trending Now
          </h2>
          <Link to="/discover" className="text-purple-400 hover:text-purple-300 font-medium">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredContent.length > 0 ? featuredContent.map((item) => (
            <div
              key={item.id}
              className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-xl overflow-hidden hover:border-purple-400/40 transition-all duration-200 group"
            >
              <div className="aspect-video bg-gradient-to-br from-purple-600/20 to-pink-600/20 relative overflow-hidden">
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-semibold text-lg truncate">{item.title}</h3>
                  <p className="text-gray-300 text-sm">by {item.profiles?.display_name || item.profiles?.username}</p>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="px-2 py-1 bg-black/50 rounded-full text-xs text-white capitalize">
                    {item.content_type}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <EyeIcon className="h-4 w-4 mr-1" />
                      {item.view_count?.toLocaleString() || 0}
                    </span>
                    <span className="flex items-center">
                      <HeartIcon className="h-4 w-4 mr-1" />
                      {item.like_count || 0}
                    </span>
                  </div>
                  <button className="text-purple-400 hover:text-purple-300 transition-colors">
                    <HeartIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-400">No trending content available yet. Be the first to create!</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <SparklesIcon className="h-6 w-6 text-yellow-400 mr-2" />
            Your Recent Activity
          </h2>
        </div>

        <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="loading-spinner w-8 h-8" />
            </div>
          ) : content.length > 0 ? (
            <div className="space-y-4">
              {content.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 bg-black/20 rounded-lg">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {item.content_type.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{item.title}</h4>
                    <p className="text-gray-400 text-sm">
                      {item.description || 'No description'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">
                      {formatRelativeTime(item.created_at)}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>{item.view_count || 0} views</span>
                      <span>•</span>
                      <span>{item.like_count || 0} likes</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                <PlusIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Start Creating</h3>
              <p className="text-gray-400 mb-4">
                Upload your first piece and begin your creative journey
              </p>
              <Link
                to="/create"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-white font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-200 neon-glow"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Create Now</span>
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* EPK Computer Modal */}
      <EPKComputerModal 
        isOpen={showEPKModal}
        onClose={() => setShowEPKModal(false)}
      />
    </div>
  )
}