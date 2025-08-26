// YourSpace Creative Labs - Creator Studio Page
import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useContent } from '../../hooks/useContent'
import { useAnalytics } from '../../hooks/useAnalytics'
import { useEPK } from '../../hooks/useEPK'
import { TipCreatorModal } from '../../components/payments/TipCreatorModal'
import { SubscriptionModal } from '../../components/payments/SubscriptionModal'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { EPKBuilder } from '../../components/epk/EPKBuilder'
import {
  FilmIcon,
  EyeIcon,
  HeartIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  PlusIcon,
  CogIcon,
  ShareIcon,
  ArrowUpOnSquareIcon,
  PlayIcon,
  PhotoIcon,
  MicrophoneIcon,
  DocumentTextIcon,
  SparklesIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline'
import { cn } from '../../lib/utils'

export const CreatorStudioPage = () => {
  const { user, profile } = useAuth()
  const { content, loading: contentLoading, uploadContent, deleteContent } = useContent()
  const { stats, loading: statsLoading } = useAnalytics()
  const { hasEPK } = useEPK()
  const [showTipModal, setShowTipModal] = useState(false)
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [selectedTab, setSelectedTab] = useState<'overview' | 'content' | 'analytics' | 'monetize' | 'epk'>('overview')
  const [uploadType, setUploadType] = useState<'video' | 'audio' | 'image' | 'text' | null>(null)

  // Filter user's content
  const userContent = content.filter(item => item.creator_id === user?.id)
  const recentContent = userContent.slice(0, 6)

  const handleFileUpload = async (file: File, contentType: string) => {
    const title = prompt('Enter title for your content:')
    if (!title) return

    const description = prompt('Enter description (optional):')
    const tags = prompt('Enter tags (comma separated, optional):')
      ?.split(',')
      .map(tag => tag.trim())
      .filter(Boolean) || []

    await uploadContent({
      file,
      title,
      description: description || undefined,
      tags,
      contentType,
      isPublic: true
    })
    
    setUploadType(null)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100)
  }

  const StatCard = ({ icon: Icon, title, value, trend, color }: {
    icon: any
    title: string
    value: string | number
    trend?: string
    color: string
  }) => (
    <div className={`bg-black/30 border border-${color}/20 rounded-xl p-6 hover:border-${color}/40 transition-all`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold text-${color}`}>{title}</h3>
        <Icon className={`w-6 h-6 text-${color}`} />
      </div>
      <p className="text-3xl font-bold text-white mb-1">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      {trend && (
        <p className="text-sm text-gray-400">{trend}</p>
      )}
    </div>
  )

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-gray-400">Please log in to access your creator studio.</p>
        </div>
      </div>
    )
  }

  if (statsLoading || contentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="mb-6 md:mb-0">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              Creator Studio
            </h1>
            <p className="text-gray-400 text-lg">
              Welcome back, {profile?.display_name || user.email}! 🎨
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowSubscriptionModal(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center space-x-2"
            >
              <SparklesIcon className="w-5 h-5" />
              <span>Monetization</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-black/50 p-2 rounded-xl mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: ChartBarIcon },
            { id: 'content', label: 'Content', icon: FilmIcon },
            { id: 'analytics', label: 'Analytics', icon: EyeIcon },
            { id: 'monetize', label: 'Monetize', icon: CurrencyDollarIcon },
            { id: 'epk', label: hasEPK ? 'Edit EPK' : 'Create EPK', icon: DocumentDuplicateIcon }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={cn(
                'flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all',
                selectedTab === tab.id
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={FilmIcon}
                title="Total Content"
                value={stats.totalContent}
                color="purple-400"
              />
              <StatCard
                icon={EyeIcon}
                title="Total Views"
                value={stats.totalViews}
                trend={`+${stats.monthlyViews} this month`}
                color="cyan-400"
              />
              <StatCard
                icon={HeartIcon}
                title="Total Likes"
                value={stats.totalLikes}
                trend={`+${stats.monthlyLikes} this month`}
                color="pink-400"
              />
              <StatCard
                icon={CurrencyDollarIcon}
                title="Revenue"
                value={formatCurrency(stats.totalRevenue)}
                color="green-400"
              />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { type: 'video', icon: PlayIcon, label: 'Upload Video', color: 'red' },
                { type: 'image', icon: PhotoIcon, label: 'Upload Image', color: 'blue' },
                { type: 'audio', icon: MicrophoneIcon, label: 'Upload Audio', color: 'green' },
                { type: 'text', icon: DocumentTextIcon, label: 'Create Post', color: 'yellow' }
              ].map(action => (
                <button
                  key={action.type}
                  onClick={() => setUploadType(action.type as any)}
                  className={`bg-${action.color}-500/10 border border-${action.color}-500/20 rounded-xl p-6 hover:border-${action.color}-500/40 transition-all group`}
                >
                  <action.icon className={`w-8 h-8 text-${action.color}-400 mb-3 mx-auto group-hover:scale-110 transition-transform`} />
                  <p className={`text-${action.color}-400 font-medium`}>{action.label}</p>
                </button>
              ))}
            </div>

            {/* Recent Content */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Recent Content</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentContent.length > 0 ? (
                  recentContent.map(item => (
                    <div key={item.id} className="bg-black/30 border border-purple-500/20 rounded-xl overflow-hidden hover:border-purple-500/40 transition-all group">
                      {item.file_url && (
                        <img
                          src={item.file_url}
                          alt={item.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                        />
                      )}
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-2 truncate">{item.title}</h3>
                        <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
                          <span className="capitalize">{item.content_type}</span>
                          <span>{item.view_count || 0} views</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                          <button
                            onClick={() => deleteContent(item.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <ArrowUpOnSquareIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Content Yet</h3>
                    <p className="text-gray-400 mb-6">Start creating and uploading your amazing content!</p>
                    <button
                      onClick={() => setUploadType('video')}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
                    >
                      Upload Your First Content
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Content Tab */}
        {selectedTab === 'content' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">All Content</h2>
              <button
                onClick={() => setUploadType('video')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center space-x-2"
              >
                <PlusIcon className="w-5 h-5" />
                <span>Upload Content</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {userContent.map(item => (
                <div key={item.id} className="bg-black/30 border border-purple-500/20 rounded-xl overflow-hidden hover:border-purple-500/40 transition-all">
                  {item.file_url && (
                    <img
                      src={item.file_url}
                      alt={item.title}
                      className="w-full h-32 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-white font-semibold mb-2 truncate">{item.title}</h3>
                    <div className="flex justify-between items-center text-sm text-gray-400 mb-3">
                      <span>{item.view_count || 0} views</span>
                      <span>{item.like_count || 0} likes</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                      <div className="flex space-x-2">
                        <button className="text-blue-400 hover:text-blue-300">
                          <ShareIcon className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-300">
                          <CogIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {selectedTab === 'analytics' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white">Analytics & Insights</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-black/30 border border-purple-500/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-purple-400 mb-4">Top Performing Content</h3>
                <div className="space-y-3">
                  {stats.topContent.slice(0, 5).map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <span className="text-white truncate">{item.title}</span>
                      <span className="text-gray-400 text-sm">{item.view_count} views</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-black/30 border border-cyan-500/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-cyan-400 mb-4">Engagement Rate</h3>
                <div className="text-3xl font-bold text-white mb-2">
                  {stats.totalViews > 0 ? ((stats.totalLikes / stats.totalViews) * 100).toFixed(1) : '0'}%
                </div>
                <p className="text-gray-400 text-sm">Average engagement across all content</p>
              </div>
              
              <div className="bg-black/30 border border-green-500/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-green-400 mb-4">Growth This Month</h3>
                <div className="text-3xl font-bold text-white mb-2">
                  +{stats.monthlyViews}
                </div>
                <p className="text-gray-400 text-sm">New views in the last 30 days</p>
              </div>
            </div>
          </div>
        )}

        {/* Monetize Tab */}
        {selectedTab === 'monetize' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white">Monetization</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-black/30 border border-purple-500/20 rounded-xl p-8">
                <h3 className="text-xl font-bold text-white mb-4">Subscription Tiers</h3>
                <p className="text-gray-400 mb-6">Set up recurring revenue with subscription tiers for your most dedicated fans.</p>
                <button
                  onClick={() => setShowSubscriptionModal(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all w-full"
                >
                  Set Up Subscriptions
                </button>
              </div>
              
              <div className="bg-black/30 border border-green-500/20 rounded-xl p-8">
                <h3 className="text-xl font-bold text-white mb-4">Revenue Overview</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Earnings:</span>
                    <span className="text-2xl font-bold text-green-400">{formatCurrency(stats.totalRevenue)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">This Month:</span>
                    <span className="text-white font-semibold">$0.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Platform Fee:</span>
                    <span className="text-gray-400">10%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EPK Tab */}
        {selectedTab === 'epk' && (
          <EPKBuilder />
        )}

        {/* File Upload Modal */}
        {uploadType && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-black/90 border border-purple-500/20 rounded-2xl p-8 max-w-md w-full">
              <h3 className="text-xl font-bold text-white mb-6">Upload {uploadType}</h3>
              <input
                type="file"
                accept={uploadType === 'video' ? 'video/*' : uploadType === 'audio' ? 'audio/*' : uploadType === 'image' ? 'image/*' : '*'}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    handleFileUpload(file, uploadType)
                  }
                }}
                className="w-full mb-6 p-3 bg-black/30 border border-purple-500/30 rounded-lg text-white"
              />
              <div className="flex space-x-4">
                <button
                  onClick={() => setUploadType(null)}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modals */}
        {showTipModal && user && (
          <TipCreatorModal
            isOpen={showTipModal}
            onClose={() => setShowTipModal(false)}
            creatorId={user.id}
            creatorName={profile?.display_name || user.email || 'Creator'}
            creatorAvatar={profile?.avatar_url}
          />
        )}

        {showSubscriptionModal && user && (
          <SubscriptionModal
            isOpen={showSubscriptionModal}
            onClose={() => setShowSubscriptionModal(false)}
            creatorId={user.id}
            creatorName={profile?.display_name || user.email || 'Creator'}
            creatorAvatar={profile?.avatar_url}
          />
        )}
      </div>
    </div>
  )
}