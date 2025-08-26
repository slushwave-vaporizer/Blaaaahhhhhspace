import React, { useState, useEffect } from 'react'
import { WidgetConfig } from '../../../hooks/useProfileBuilder'
import { useAuth } from '../../../hooks/useAuth'
import { supabase } from '../../../lib/supabase'
import { LinkIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'

interface SocialLinksWidgetProps {
  widget: WidgetConfig
}

interface SocialLink {
  id: string
  platform: string
  url: string
  display_name: string
  is_visible: boolean
  follower_count: number
  created_at: string
}

const PLATFORM_ICONS = {
  twitter: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
    </svg>
  ),
  instagram: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  ),
  linkedin: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  github: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  ),
  website: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  )
}

const PLATFORM_COLORS = {
  twitter: 'text-blue-400 border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20',
  instagram: 'text-pink-400 border-pink-500/30 bg-pink-500/10 hover:bg-pink-500/20',
  linkedin: 'text-blue-500 border-blue-600/30 bg-blue-600/10 hover:bg-blue-600/20',
  github: 'text-gray-300 border-gray-500/30 bg-gray-500/10 hover:bg-gray-500/20',
  website: 'text-green-400 border-green-500/30 bg-green-500/10 hover:bg-green-500/20'
}

export const SocialLinksWidget: React.FC<SocialLinksWidgetProps> = ({ widget }) => {
  const { user } = useAuth()
  const data = widget.data || {}
  
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [loading, setLoading] = useState(true)
  const [totalFollowers, setTotalFollowers] = useState(0)
  
  useEffect(() => {
    if (user) {
      loadSocialLinks()
    }
  }, [user])

  const loadSocialLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('user_social_links')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_visible', true)
        .order('follower_count', { ascending: false })

      if (error) {
        console.error('Error loading social links:', error)
        return
      }

      setSocialLinks(data || [])
      
      // Calculate total followers
      const total = (data || []).reduce((sum, link) => sum + link.follower_count, 0)
      setTotalFollowers(total)
    } catch (error) {
      console.error('Error loading social links:', error)
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
        loadSocialLinks()
      }, 1000)
    } catch (error) {
      console.error('Error creating sample data:', error)
    }
  }
  
  const handleLinkClick = (url: string) => {
    // In a real app, this would open the link
    console.log('Opening:', url)
    window.open(url, '_blank')
  }

  const formatFollowerCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toString()
  }

  if (loading) {
    return (
      <div className="w-full h-full p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <div className="text-sm text-gray-400">Loading social links...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-pink-400 flex items-center">
          <LinkIcon className="w-4 h-4 mr-1" />
          Connect
        </h3>
        <div className="text-xs text-gray-400">
          {socialLinks.length} links
        </div>
      </div>
      
      {/* Links */}
      <div className="space-y-2">
        {socialLinks.length > 0 ? (
          socialLinks.map((link) => {
            const platformKey = link.platform as keyof typeof PLATFORM_ICONS
            const icon = PLATFORM_ICONS[platformKey] || PLATFORM_ICONS.website
            const colorClasses = PLATFORM_COLORS[platformKey] || PLATFORM_COLORS.website
            
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.url)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 hover:scale-[1.02] ${colorClasses}`}
              >
                <div className="flex-shrink-0">
                  {icon}
                </div>
                
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-white">
                    {link.display_name || link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
                  </div>
                  <div className="text-xs text-gray-400 truncate">
                    {link.url.replace(/^https?:\/\//, '').replace(/^www\./, '')}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatFollowerCount(link.follower_count)} followers
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  <ArrowTopRightOnSquareIcon className="w-4 h-4 text-gray-400" />
                </div>
              </button>
            )
          })
        ) : (
          <div className="text-center py-6">
            <LinkIcon className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <div className="text-sm text-gray-400 mb-2">No social links added</div>
            <button
              onClick={createSampleData}
              className="px-3 py-2 bg-pink-600 hover:bg-pink-700 text-white text-xs rounded-lg transition-colors"
            >
              Add Sample Data
            </button>
          </div>
        )}
      </div>
      
      {/* Stats */}
      {socialLinks.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-800">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div>
              <div className="text-lg font-bold text-pink-400">
                {formatFollowerCount(totalFollowers)}
              </div>
              <div className="text-xs text-gray-400">Total Followers</div>
            </div>
            <div>
              <div className="text-lg font-bold text-pink-400">94%</div>
              <div className="text-xs text-gray-400">Engagement</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Quick Actions */}
      {socialLinks.length > 0 && (
        <div className="mt-3 flex space-x-2">
          <button className="flex-1 px-3 py-2 bg-pink-600/20 border border-pink-500/30 text-pink-400 text-xs rounded-lg hover:bg-pink-600/30 transition-colors">
            Follow All
          </button>
          <button className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 text-gray-400 text-xs rounded-lg hover:bg-gray-700 transition-colors">
            Share Profile
          </button>
        </div>
      )}
    </div>
  )
}