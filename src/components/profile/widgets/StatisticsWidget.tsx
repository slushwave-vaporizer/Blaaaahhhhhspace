import React, { useState, useEffect } from 'react'
import { WidgetConfig } from '../../../hooks/useProfileBuilder'
import { ChartBarIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, EyeIcon, HeartIcon, UserIcon } from '@heroicons/react/24/outline'

interface StatisticsWidgetProps {
  widget: WidgetConfig
}

export const StatisticsWidget: React.FC<StatisticsWidgetProps> = ({ widget }) => {
  const data = widget.data || {}
  
  // Mock statistics data
  const [stats, setStats] = useState({
    followers: { current: 2849, change: 12.5, period: '7d' },
    views: { current: 45720, change: -3.2, period: '7d' },
    likes: { current: 15234, change: 18.7, period: '7d' },
    engagement: { current: 4.8, change: 5.1, period: '7d' },
    projects: { current: 127, change: 8.0, period: '30d' },
    revenue: { current: 12450, change: 25.3, period: '30d' }
  })
  
  const [viewType, setViewType] = useState<'overview' | 'detailed'>('overview')
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('7d')
  
  // Mock chart data for sparklines
  const chartData = {
    followers: [2800, 2815, 2822, 2835, 2840, 2849],
    views: [48000, 47200, 46800, 45900, 45100, 45720],
    likes: [14800, 14950, 15100, 15180, 15200, 15234],
    engagement: [4.2, 4.4, 4.6, 4.7, 4.8, 4.8]
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toLocaleString()
  }
  
  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : ''
    return `${sign}${change.toFixed(1)}%`
  }
  
  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-400' : 'text-red-400'
  }
  
  const getChangeIcon = (change: number) => {
    return change >= 0 ? ArrowTrendingUpIcon : ArrowTrendingDownIcon
  }
  
  const renderSparkline = (data: number[], color: string = 'pink') => {
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = 100 - ((value - min) / range) * 100
      return `${x},${y}`
    })
    
    return (
      <svg className="w-16 h-8" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke={`var(--color-${color}-400)`}
          strokeWidth="3"
          points={points.join(' ')}
        />
      </svg>
    )
  }

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        views: {
          ...prev.views,
          current: prev.views.current + Math.floor(Math.random() * 10)
        }
      }))
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full h-full p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-pink-400 flex items-center">
          <ChartBarIcon className="w-4 h-4 mr-1" />
          Analytics
        </h3>
        
        {/* View Toggle */}
        <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setViewType('overview')}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              viewType === 'overview'
                ? 'bg-pink-600 text-white'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setViewType('detailed')}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              viewType === 'detailed'
                ? 'bg-pink-600 text-white'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Detailed
          </button>
        </div>
      </div>
      
      {/* Period Selector */}
      <div className="flex space-x-1 mb-4">
        {['7d', '30d', '90d'].map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period as any)}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              selectedPeriod === period
                ? 'bg-gray-700 text-pink-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            {period}
          </button>
        ))}
      </div>
      
      {viewType === 'overview' ? (
        /* Overview Stats */
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: 'followers', label: 'Followers', icon: UserIcon, color: 'pink' },
            { key: 'views', label: 'Views', icon: EyeIcon, color: 'blue' },
            { key: 'likes', label: 'Likes', icon: HeartIcon, color: 'red' },
            { key: 'engagement', label: 'Engagement', icon: ArrowTrendingUpIcon, color: 'green', suffix: '%' }
          ].map((item) => {
            const stat = stats[item.key as keyof typeof stats]
            const IconComponent = item.icon
            const ChangeIcon = getChangeIcon(stat.change)
            
            return (
              <div key={item.key} className="bg-gray-800/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <IconComponent className={`w-4 h-4 text-${item.color}-400`} />
                  <div className="flex items-center space-x-1">
                    <ChangeIcon className={`w-3 h-3 ${getChangeColor(stat.change)}`} />
                    <span className={`text-xs font-medium ${getChangeColor(stat.change)}`}>
                      {formatChange(stat.change)}
                    </span>
                  </div>
                </div>
                
                <div className="text-lg font-bold text-white">
                  {item.suffix && item.key === 'engagement' ? stat.current.toFixed(1) : formatNumber(stat.current)}
                  {item.suffix || ''}
                </div>
                
                <div className="text-xs text-gray-400">{item.label}</div>
                
                {/* Mini Sparkline */}
                {chartData[item.key as keyof typeof chartData] && (
                  <div className="mt-2">
                    {renderSparkline(chartData[item.key as keyof typeof chartData] as number[], item.color)}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        /* Detailed Stats */
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {[
            { key: 'followers', label: 'Total Followers', icon: UserIcon },
            { key: 'views', label: 'Profile Views', icon: EyeIcon },
            { key: 'likes', label: 'Total Likes', icon: HeartIcon },
            { key: 'engagement', label: 'Engagement Rate', icon: ArrowTrendingUpIcon, suffix: '%' },
            { key: 'projects', label: 'Total Projects', icon: ChartBarIcon },
            { key: 'revenue', label: 'Revenue', icon: ChartBarIcon, prefix: '$' }
          ].map((item) => {
            const stat = stats[item.key as keyof typeof stats]
            const IconComponent = item.icon
            const ChangeIcon = getChangeIcon(stat.change)
            
            return (
              <div key={item.key} className="bg-gray-800/50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-pink-500/20 rounded-lg">
                      <IconComponent className="w-4 h-4 text-pink-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">
                        {item.prefix || ''}
                        {item.key === 'engagement' ? stat.current.toFixed(1) : formatNumber(stat.current)}
                        {item.suffix || ''}
                      </div>
                      <div className="text-xs text-gray-400">{item.label}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`flex items-center space-x-1 ${getChangeColor(stat.change)}`}>
                      <ChangeIcon className="w-3 h-3" />
                      <span className="text-xs font-medium">{formatChange(stat.change)}</span>
                    </div>
                    <div className="text-xs text-gray-400">{stat.period}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
      
      {/* Summary */}
      <div className="mt-4 pt-3 border-t border-gray-800">
        <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg p-3 border border-pink-500/20">
          <div className="flex items-center space-x-2 mb-1">
            <ArrowTrendingUpIcon className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-white">Performance Summary</span>
          </div>
          <div className="text-xs text-gray-400">
            Your profile is performing {stats.engagement.change >= 0 ? 'well' : 'below average'} this week with {formatChange(stats.engagement.change)} engagement growth.
          </div>
        </div>
      </div>
    </div>
  )
}