// YourSpace Creative Labs - Discord Profile Component
import React, { useEffect } from 'react'
import { useDiscord } from '../../hooks/useDiscord'
import {
  UserIcon,
  GlobeAltIcon,
  CheckBadgeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { cn } from '../../lib/utils'

interface DiscordProfileProps {
  className?: string
  showGuilds?: boolean
  compact?: boolean
}

const DiscordStatus = ({ isConnected, verified }: { isConnected: boolean; verified?: boolean }) => (
  <div className="flex items-center space-x-1">
    <div className={cn(
      'w-2 h-2 rounded-full',
      isConnected ? 'bg-green-500' : 'bg-gray-500'
    )} />
    <span className={cn(
      'text-xs font-medium',
      isConnected ? 'text-green-400' : 'text-gray-400'
    )}>
      {isConnected ? 'Connected' : 'Disconnected'}
    </span>
    {verified && (
      <CheckBadgeIcon className="w-4 h-4 text-blue-400" title="Verified Discord Account" />
    )}
  </div>
)

const GuildBadge = ({ guild, getGuildIconUrl }: { guild: any; getGuildIconUrl: (guild: any, size?: number) => string | null }) => {
  const iconUrl = getGuildIconUrl(guild, 32)
  
  return (
    <div className="group relative">
      <div className="w-8 h-8 rounded-lg overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
        {iconUrl ? (
          <img 
            src={iconUrl} 
            alt={guild.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-white text-xs font-bold">
            {guild.name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-black/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          {guild.name}
          {guild.owner && ' (Owner)'}
        </div>
      </div>
    </div>
  )
}

export const DiscordProfile: React.FC<DiscordProfileProps> = ({
  className = '',
  showGuilds = false,
  compact = false
}) => {
  const { 
    discordProfile, 
    discordGuilds, 
    loading, 
    isConnected, 
    fetchDiscordGuilds, 
    disconnectDiscord,
    getDiscordAvatarUrl 
  } = useDiscord()

  // Fetch guilds when component mounts and user is connected
  useEffect(() => {
    if (isConnected && showGuilds && discordGuilds.length === 0) {
      fetchDiscordGuilds()
    }
  }, [isConnected, showGuilds, discordGuilds.length, fetchDiscordGuilds])

  if (!isConnected || !discordProfile) {
    return null
  }

  const avatarUrl = getDiscordAvatarUrl()
  const displayName = discordProfile.global_name || discordProfile.username
  const discriminator = discordProfile.discriminator && discordProfile.discriminator !== '0' 
    ? `#${discordProfile.discriminator}` 
    : ''

  if (compact) {
    return (
      <div className={cn(
        'flex items-center space-x-2 px-3 py-2 bg-[#5865F2]/10 border border-[#5865F2]/20 rounded-lg',
        className
      )}>
        <div className="relative">
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt={displayName}
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <UserIcon className="w-4 h-4 text-white" />
            </div>
          )}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#5865F2] rounded-full flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-2 h-2 text-white fill-current">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.010c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {displayName}
          </p>
          <DiscordStatus isConnected={isConnected} verified={discordProfile.verified} />
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      'bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6',
      className
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt={displayName}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#5865F2] rounded-full flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-3 h-3 text-white fill-current">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.010c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white">
              {displayName}
              {discriminator && (
                <span className="text-gray-400 font-normal">{discriminator}</span>
              )}
            </h3>
            <p className="text-sm text-gray-400">@{discordProfile.username}</p>
            <DiscordStatus isConnected={isConnected} verified={discordProfile.verified} />
          </div>
        </div>
        
        <button
          onClick={disconnectDiscord}
          disabled={loading}
          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
          title="Disconnect Discord"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
      
      {discordProfile.email && (
        <div className="mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <GlobeAltIcon className="w-4 h-4" />
            <span>{discordProfile.email}</span>
          </div>
        </div>
      )}
      
      {showGuilds && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-white">Discord Servers</h4>
            <button
              onClick={fetchDiscordGuilds}
              disabled={loading}
              className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
          
          {discordGuilds.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {discordGuilds.slice(0, 8).map((guild) => (
                <GuildBadge 
                  key={guild.id} 
                  guild={guild} 
                  getGuildIconUrl={(guild, size) => 
                    guild.icon 
                      ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=${size}` 
                      : null
                  } 
                />
              ))}
              
              {discordGuilds.length > 8 && (
                <div className="w-8 h-8 rounded-lg bg-gray-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">+{discordGuilds.length - 8}</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No Discord servers found</p>
          )}
        </div>
      )}
    </div>
  )
}

export default DiscordProfile
