// YourSpace Creative Labs - Artist Discovery Page
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useArtistDiscovery } from '../../hooks/useArtistDiscovery'
import { ArtistSwipeCard } from '../../components/discover/ArtistSwipeCard'
import { useAuth } from '../../hooks/useAuth'
import { 
  SparklesIcon,
  ChartBarIcon,
  ArrowPathIcon,
  InformationCircleIcon,
  HeartIcon,
  XMarkIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import { Button } from '../../components/ui/button'
import { cn } from '../../lib/utils'

export const ArtistDiscoveryPage = () => {
  const { user } = useAuth()
  const {
    currentArtist,
    nextArtist,
    loading,
    swiping,
    analytics,
    remainingCount,
    loadArtistStack,
    swipeArtist,
    loadAnalytics,
    resetDiscovery
  } = useArtistDiscovery()
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)

  useEffect(() => {
    loadArtistStack()
    if (user) {
      loadAnalytics()
    }
  }, [loadArtistStack, loadAnalytics, user])

  const handleSwipe = async (liked: boolean) => {
    await swipeArtist(liked)
  }

  const handleRefresh = async () => {
    await resetDiscovery()
    if (user) {
      await loadAnalytics()
    }
  }

  if (loading && !currentArtist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner w-12 h-12 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Finding Amazing Artists</h3>
          <p className="text-gray-400">Curating the perfect discovery experience for you...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <SparklesIcon className="h-8 w-8 text-purple-400" />
          <h1 className="text-4xl font-bold gradient-text">Discover Artists</h1>
        </div>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-4">
          Swipe through talented creators and build your creative network. Like to discover, pass to continue exploring.
        </p>
        
        {/* Anonymous User Banner */}
        {!user && (
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4 max-w-2xl mx-auto">
            <p className="text-purple-300 text-sm">
              ✨ <Link to="/register" className="underline hover:text-purple-200 transition-colors">Sign up</Link> to save your discovered artists and get personalized recommendations!
            </p>
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {user && (
            <Button
              onClick={() => setShowAnalytics(!showAnalytics)}
              variant="outline"
              className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
            >
              <ChartBarIcon className="h-4 w-4 mr-2" />
              {showAnalytics ? 'Hide Stats' : 'Your Stats'}
            </Button>
          )}
          
          <Button
            onClick={() => setShowInstructions(!showInstructions)}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-purple-300"
          >
            <InformationCircleIcon className="h-4 w-4 mr-2" />
            How it works
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-400">
            {remainingCount} artists remaining
          </div>
          
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={loading}
            className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
          >
            <ArrowPathIcon className={cn('h-4 w-4 mr-2', loading && 'animate-spin')} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Instructions */}
      {showInstructions && (
        <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">How to Discover Artists</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-400 rounded-full flex items-center justify-center mx-auto mb-2">
                <HeartIcon className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-white font-medium mb-1">Swipe Right / Heart</h4>
              <p className="text-gray-400 text-sm">Discover this artist and add to your network</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-400 rounded-full flex items-center justify-center mx-auto mb-2">
                <XMarkIcon className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-white font-medium mb-1">Swipe Left / X</h4>
              <p className="text-gray-400 text-sm">Pass on this artist and continue exploring</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <UserGroupIcon className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-white font-medium mb-1">Build Network</h4>
              <p className="text-gray-400 text-sm">Artists you discover will appear in your feed</p>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Dashboard */}
      {showAnalytics && analytics && user && (
        <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Your Discovery Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">
                {analytics.summary.total_artists_seen}
              </div>
              <div className="text-sm text-gray-400">Artists Seen</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {analytics.summary.artists_liked}
              </div>
              <div className="text-sm text-gray-400">Discovered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-400 mb-1">
                {analytics.summary.engagement_rate}
              </div>
              <div className="text-sm text-gray-400">Like Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {analytics.discovery_score}
              </div>
              <div className="text-sm text-gray-400">Discovery Score</div>
            </div>
          </div>
          
          {analytics.recent_activity.length > 0 && (
            <div>
              <h4 className="text-white font-medium mb-3">Recent Activity</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {analytics.recent_activity.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2 px-3 bg-black/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        'w-2 h-2 rounded-full',
                        activity.liked ? 'bg-green-400' : 'bg-red-400'
                      )} />
                      <span className="text-sm text-gray-300">
                        {activity.liked ? 'Discovered' : 'Passed on'} {activity.artist_info.display_name || activity.artist_info.username}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Swipe Interface */}
      <div className="relative">
        {currentArtist || nextArtist ? (
          <div className="relative h-[600px] max-w-md mx-auto">
            {/* Next artist card (background) */}
            {nextArtist && (
              <ArtistSwipeCard
                key={`next-${nextArtist.id}`}
                artist={nextArtist}
                onSwipe={() => {}}
                isTop={false}
              />
            )}
            
            {/* Current artist card (foreground) */}
            {currentArtist && (
              <ArtistSwipeCard
                key={`current-${currentArtist.id}`}
                artist={currentArtist}
                onSwipe={handleSwipe}
                isTop={true}
              />
            )}
            
            {/* Swiping overlay */}
            {swiping && (
              <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-2xl flex items-center justify-center z-50">
                <div className="loading-spinner w-8 h-8" />
              </div>
            )}
          </div>
        ) : (
          <div className="h-[600px] flex items-center justify-center">
            <div className="text-center max-w-md mx-auto">
              <SparklesIcon className="h-16 w-16 text-purple-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-white mb-2">No More Artists Right Now</h3>
              <p className="text-gray-400 mb-6">
                You've seen all available artists. Check back later for new creators to discover!
              </p>
              <Button
                onClick={handleRefresh}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 neon-glow"
              >
                <ArrowPathIcon className="h-4 w-4 mr-2" />
                Refresh Artists
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Instructions */}
      <div className="md:hidden bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4">
        <div className="text-center text-sm text-gray-400">
          Swipe cards left or right, or use the buttons below
        </div>
      </div>
    </div>
  )
}