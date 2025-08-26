// YourSpace Creative Labs - Profile Page
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useContent } from '../../hooks/useContent'
import { 
  CogIcon,
  HeartIcon,
  EyeIcon,
  UserPlusIcon,
  GiftIcon,
  CalendarIcon,
  MapPinIcon,
  LinkIcon
} from '@heroicons/react/24/outline'
import { formatDate, formatRelativeTime } from '../../lib/utils'

export const ProfilePage = () => {
  const { username } = useParams()
  const { profile: currentUserProfile, user } = useAuth()
  const { content, loading, fetchContent } = useContent()
  const [profileData, setProfileData] = useState<any>(null)
  const [isOwnProfile, setIsOwnProfile] = useState(false)
  const [activeTab, setActiveTab] = useState<'content' | 'collections' | 'collaborations'>('content')
  const [stats, setStats] = useState({
    totalContent: 0,
    totalViews: 0,
    totalLikes: 0,
    followers: 0,
    following: 0
  })

  useEffect(() => {
    // Determine if this is the current user's profile
    const isOwn = !username || username === currentUserProfile?.username
    setIsOwnProfile(isOwn)

    if (isOwn && currentUserProfile) {
      setProfileData(currentUserProfile)
      fetchContent({ userId: currentUserProfile.id })
    } else {
      // Fetch other user's profile (simulated)
      setProfileData({
        username: username || 'unknown',
        display_name: 'Creative Artist',
        bio: 'Digital artist creating vaporwave and cyberpunk aesthetics. Always experimenting with new techniques and technologies.',
        avatar_url: null,
        background_url: null,
        website: 'https://example.com',
        location: 'Neo Tokyo',
        subscription_tier: 'creator',
        neon_theme: 'purple',
        created_at: '2024-01-15T00:00:00Z'
      })
    }

    // Simulate stats
    setStats({
      totalContent: 42,
      totalViews: 15420,
      totalLikes: 892,
      followers: 1234,
      following: 567
    })
  }, [username, currentUserProfile, fetchContent])

  if (!profileData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="loading-spinner w-8 h-8" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl overflow-hidden">
        {/* Background Cover */}
        <div className="h-48 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 relative">
          {profileData.background_url && (
            <img 
              src={profileData.background_url} 
              alt="Profile background"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Profile Info */}
        <div className="p-8 relative">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-6">
              {/* Avatar */}
              <div className="relative -mt-20 md:-mt-16">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 p-1">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                    {profileData.avatar_url ? (
                      <img 
                        src={profileData.avatar_url} 
                        alt={profileData.display_name}
                        className="w-28 h-28 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-4xl font-bold">
                        {(profileData.display_name || profileData.username).charAt(0)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-1">
                  {profileData.display_name || profileData.username}
                </h1>
                <p className="text-purple-300 mb-2">@{profileData.username}</p>
                
                {profileData.bio && (
                  <p className="text-gray-300 max-w-2xl mb-4">{profileData.bio}</p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                  {profileData.location && (
                    <span className="flex items-center">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      {profileData.location}
                    </span>
                  )}
                  {profileData.website && (
                    <a 
                      href={profileData.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center hover:text-purple-300 transition-colors"
                    >
                      <LinkIcon className="h-4 w-4 mr-1" />
                      Website
                    </a>
                  )}
                  <span className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    Joined {formatDate(profileData.created_at)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 mt-6 md:mt-0">
              {isOwnProfile ? (
                <button className="flex items-center space-x-2 px-6 py-3 bg-purple-500/20 border border-purple-400/50 rounded-xl text-purple-300 font-medium hover:bg-purple-500/30 transition-all">
                  <CogIcon className="h-5 w-5" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <>
                  <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-white font-medium hover:from-pink-600 hover:to-purple-600 transition-all neon-glow">
                    <UserPlusIcon className="h-5 w-5" />
                    <span>Follow</span>
                  </button>
                  <button className="flex items-center space-x-2 px-6 py-3 bg-black/30 border border-purple-500/30 rounded-xl text-purple-300 font-medium hover:bg-purple-500/20 transition-all">
                    <GiftIcon className="h-5 w-5" />
                    <span>Tip</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 text-center">
          <div className="text-2xl font-bold text-cyan-400">{stats.totalContent}</div>
          <div className="text-gray-400 text-sm">Content</div>
        </div>
        <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 text-center">
          <div className="text-2xl font-bold text-purple-400">{stats.totalViews.toLocaleString()}</div>
          <div className="text-gray-400 text-sm">Views</div>
        </div>
        <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 text-center">
          <div className="text-2xl font-bold text-pink-400">{stats.totalLikes.toLocaleString()}</div>
          <div className="text-gray-400 text-sm">Likes</div>
        </div>
        <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 text-center">
          <div className="text-2xl font-bold text-blue-400">{stats.followers.toLocaleString()}</div>
          <div className="text-gray-400 text-sm">Followers</div>
        </div>
        <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 text-center">
          <div className="text-2xl font-bold text-orange-400">{stats.following.toLocaleString()}</div>
          <div className="text-gray-400 text-sm">Following</div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-purple-500/20">
          {[
            { id: 'content', name: 'Content', count: stats.totalContent },
            { id: 'collections', name: 'Collections', count: 8 },
            { id: 'collaborations', name: 'Collaborations', count: 12 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-6 py-4 text-center font-medium transition-all ${
                activeTab === tab.id
                  ? 'text-purple-300 border-b-2 border-purple-400 bg-purple-500/10'
                  : 'text-gray-400 hover:text-purple-300'
              }`}
            >
              {tab.name} <span className="ml-1">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'content' && (
            <div>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="loading-spinner w-8 h-8" />
                </div>
              ) : content.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {content.map((item) => (
                    <div
                      key={item.id}
                      className="bg-black/30 border border-purple-500/30 rounded-xl overflow-hidden hover:border-purple-400/50 transition-all group"
                    >
                      <div className="aspect-video bg-gradient-to-br from-purple-600/20 to-pink-600/20 relative">
                        {item.file_url && (
                          <img 
                            src={item.file_url} 
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3">
                          <h3 className="text-white font-medium text-sm truncate">{item.title}</h3>
                          <div className="flex items-center justify-between text-xs text-gray-300 mt-1">
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
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {isOwnProfile ? 'No content yet' : 'No public content'}
                  </h3>
                  <p className="text-gray-400">
                    {isOwnProfile 
                      ? 'Start creating and sharing your work!'
                      : 'This user hasn\'t shared any public content yet.'
                    }
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'collections' && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-white mb-2">Collections</h3>
              <p className="text-gray-400">Content collections feature coming soon!</p>
            </div>
          )}

          {activeTab === 'collaborations' && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-white mb-2">Collaborations</h3>
              <p className="text-gray-400">Collaboration history feature coming soon!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}