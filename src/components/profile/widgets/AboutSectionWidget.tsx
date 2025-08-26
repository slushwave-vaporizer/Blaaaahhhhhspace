import React from 'react'
import { WidgetConfig } from '../../../hooks/useProfileBuilder'
import { UserIcon, MapPinIcon, CalendarIcon, GlobeAltIcon } from '@heroicons/react/24/outline'

interface AboutSectionWidgetProps {
  widget: WidgetConfig
}

export const AboutSectionWidget: React.FC<AboutSectionWidgetProps> = ({ widget }) => {
  const data = widget.data || {}
  const title = data.title || 'About Me'
  const content = data.content || 'Digital artist and creative professional specializing in cyberpunk and vaporwave aesthetics. I blend traditional art techniques with cutting-edge digital tools to create immersive visual experiences that transport viewers to neon-lit futures.'
  const showAvatar = data.showAvatar !== false
  
  // Mock user data - in real app this would come from user profile
  const userInfo = {
    name: 'Alex Chen',
    avatar: '/api/placeholder/80/80',
    location: 'Neo Tokyo',
    joinDate: '2023',
    website: 'alexchen.art',
    skills: ['Digital Art', '3D Modeling', 'Animation', 'UI/UX Design'],
    stats: {
      projects: 127,
      followers: 2849,
      likes: 15.2
    }
  }

  return (
    <div className="w-full h-full p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-pink-400 flex items-center">
          <UserIcon className="w-4 h-4 mr-1" />
          {title}
        </h3>
      </div>
      
      {/* Content */}
      <div className="flex-1 space-y-4">
        {/* Avatar and Basic Info */}
        {showAvatar && (
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center border-2 border-pink-500/30">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-semibold text-sm">{userInfo.name}</h4>
              <div className="flex items-center space-x-3 mt-1">
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <MapPinIcon className="w-3 h-3" />
                  <span>{userInfo.location}</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <CalendarIcon className="w-3 h-3" />
                  <span>Since {userInfo.joinDate}</span>
                </div>
              </div>
              
              {userInfo.website && (
                <div className="flex items-center space-x-1 mt-1 text-xs">
                  <GlobeAltIcon className="w-3 h-3 text-pink-400" />
                  <a href={`https://${userInfo.website}`} className="text-pink-400 hover:text-pink-300 transition-colors">
                    {userInfo.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Bio Content */}
        <div className="text-sm text-gray-300 leading-relaxed">
          {content}
        </div>
        
        {/* Skills */}
        <div>
          <h5 className="text-xs font-medium text-gray-400 mb-2">Skills & Expertise</h5>
          <div className="flex flex-wrap gap-1">
            {userInfo.skills.map((skill, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 bg-gray-800 border border-gray-700 text-xs text-gray-300 rounded-full hover:border-pink-500/50 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-800">
          <div className="text-center">
            <div className="text-lg font-bold text-pink-400">{userInfo.stats.projects}</div>
            <div className="text-xs text-gray-400">Projects</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-pink-400">{userInfo.stats.followers.toLocaleString()}</div>
            <div className="text-xs text-gray-400">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-pink-400">{userInfo.stats.likes}K</div>
            <div className="text-xs text-gray-400">Likes</div>
          </div>
        </div>
        
        {/* Achievement Badges */}
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-xs text-gray-400">Top Creator • Featured Artist</div>
        </div>
      </div>
    </div>
  )
}