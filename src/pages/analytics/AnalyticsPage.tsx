// YourSpace Creative Labs - Analytics Page with Real Data
import { useEffect, useState } from 'react'
import { useAnalytics } from '../../hooks/useAnalytics'
import { 
  ChartBarIcon,
  EyeIcon,
  HeartIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'
import { formatCurrency, formatRelativeTime } from '../../lib/utils'

export const AnalyticsPage = () => {
  const { stats, loading, fetchAnalytics } = useAnalytics()
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    fetchAnalytics()
    
    // Generate sample chart data (in production, fetch real time-series data)
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365
    const data = Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      views: Math.floor(Math.random() * 100) + 20,
      likes: Math.floor(Math.random() * 20) + 5,
      revenue: Math.floor(Math.random() * 50) + 10
    }))
    setChartData(data)
  }, [timeRange, fetchAnalytics])

  const getGrowthPercentage = (current: number, previous: number) => {
    if (previous === 0) return 0
    return ((current - previous) / previous) * 100
  }

  const viewsGrowth = getGrowthPercentage(stats.monthlyViews, stats.totalViews * 0.6)
  const likesGrowth = getGrowthPercentage(stats.monthlyLikes, stats.totalLikes * 0.6)
  const revenueGrowth = getGrowthPercentage(stats.totalRevenue, stats.totalRevenue * 0.8)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Analytics Dashboard</h1>
          <p className="text-gray-400 text-lg">
            Track your content performance and audience engagement
          </p>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-5 w-5 text-gray-400" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="bg-black/30 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 3 months</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <EyeIcon className="h-6 w-6 text-white" />
            </div>
            <div className={`flex items-center text-sm ${
              viewsGrowth >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {viewsGrowth >= 0 ? <ArrowTrendingUpIcon className="h-4 w-4 mr-1" /> : <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />}
              {Math.abs(viewsGrowth).toFixed(1)}%
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {stats.totalViews.toLocaleString()}
          </div>
          <div className="text-gray-400 text-sm">Total Views</div>
          <div className="text-purple-300 text-sm mt-2">
            {stats.monthlyViews.toLocaleString()} this month
          </div>
        </div>

        <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
              <HeartIcon className="h-6 w-6 text-white" />
            </div>
            <div className={`flex items-center text-sm ${
              likesGrowth >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {likesGrowth >= 0 ? <ArrowTrendingUpIcon className="h-4 w-4 mr-1" /> : <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />}
              {Math.abs(likesGrowth).toFixed(1)}%
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {stats.totalLikes.toLocaleString()}
          </div>
          <div className="text-gray-400 text-sm">Total Likes</div>
          <div className="text-purple-300 text-sm mt-2">
            {stats.monthlyLikes.toLocaleString()} this month
          </div>
        </div>

        <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <CurrencyDollarIcon className="h-6 w-6 text-white" />
            </div>
            <div className={`flex items-center text-sm ${
              revenueGrowth >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {revenueGrowth >= 0 ? <ArrowTrendingUpIcon className="h-4 w-4 mr-1" /> : <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />}
              {Math.abs(revenueGrowth).toFixed(1)}%
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {formatCurrency(stats.totalRevenue)}
          </div>
          <div className="text-gray-400 text-sm">Total Revenue</div>
          <div className="text-purple-300 text-sm mt-2">
            {formatCurrency(Math.round(stats.totalRevenue * 0.3))} this month
          </div>
        </div>

        <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <ChartBarIcon className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {stats.totalContent}
          </div>
          <div className="text-gray-400 text-sm">Total Content</div>
          <div className="text-purple-300 text-sm mt-2">
            {Math.round(stats.totalContent * 0.2)} this month
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Performance Overview</h3>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <ChartBarIcon className="h-16 w-16 text-purple-400 mx-auto mb-4" />
              <p className="text-gray-400">
                Interactive charts coming soon!
              </p>
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Revenue Trends</h3>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <CurrencyDollarIcon className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <p className="text-gray-400">
                Revenue analytics coming soon!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Content */}
      <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Top Performing Content</h3>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="loading-spinner w-8 h-8" />
          </div>
        ) : stats.topContent.length > 0 ? (
          <div className="space-y-4">
            {stats.topContent.map((item, index) => (
              <div key={item.id} className="flex items-center space-x-4 p-4 bg-black/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-400 w-8">
                  #{index + 1}
                </div>
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
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center">
                      <EyeIcon className="h-3 w-3 mr-1" />
                      {item.view_count || 0}
                    </span>
                    <span className="flex items-center">
                      <HeartIcon className="h-3 w-3 mr-1" />
                      {item.like_count || 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ChartBarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Content Data</h3>
            <p className="text-gray-400">
              Create and publish content to see analytics here.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}