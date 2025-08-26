// YourSpace Creative Labs - Discord Integration Hook
import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { supabase } from '../lib/supabase'
import { toast } from 'react-hot-toast'

interface DiscordProfile {
  discord_id: string
  username: string
  discriminator?: string
  global_name?: string
  avatar?: string
  banner?: string
  accent_color?: number
  verified?: boolean
  email?: string
  token_expires_at?: string
}

interface DiscordGuild {
  id: string
  name: string
  icon?: string
  owner: boolean
  permissions: string
  features: string[]
}

export const useDiscord = () => {
  const { user } = useAuth()
  const [discordProfile, setDiscordProfile] = useState<DiscordProfile | null>(null)
  const [discordGuilds, setDiscordGuilds] = useState<DiscordGuild[]>([])
  const [loading, setLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  // Fetch Discord profile when user changes
  useEffect(() => {
    if (user) {
      fetchDiscordProfile()
    } else {
      setDiscordProfile(null)
      setIsConnected(false)
    }
  }, [user])

  const fetchDiscordProfile = async () => {
    if (!user) return

    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('discord_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error) {
        if (error.code !== 'PGRST116') { // Not found is ok
          console.error('Error fetching Discord profile:', error)
        }
        setIsConnected(false)
        return
      }

      setDiscordProfile(data)
      setIsConnected(true)

      // Check if token needs refresh
      if (data.token_expires_at) {
        const expiresAt = new Date(data.token_expires_at)
        const now = new Date()
        const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000)

        if (expiresAt <= fiveMinutesFromNow) {
          await refreshDiscordToken()
        }
      }
      
    } catch (error: any) {
      console.error('Error fetching Discord profile:', error)
      setIsConnected(false)
    } finally {
      setLoading(false)
    }
  }

  const refreshDiscordToken = async () => {
    if (!user) return

    try {
      const response = await fetch('/functions/v1/discord-token-refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify({ user_id: user.id })
      })

      const result = await response.json()
      
      if (result.success) {
        // Refresh profile data
        await fetchDiscordProfile()
      } else {
        console.error('Token refresh failed:', result.error)
      }
    } catch (error) {
      console.error('Error refreshing Discord token:', error)
    }
  }

  const fetchDiscordGuilds = async () => {
    if (!user || !isConnected) return

    try {
      setLoading(true)
      
      const response = await fetch('/functions/v1/discord-bot/guilds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify({ user_id: user.id })
      })

      const result = await response.json()
      
      if (result.success) {
        setDiscordGuilds(result.guilds || [])
      } else {
        throw new Error(result.error?.message || 'Failed to fetch guilds')
      }
      
    } catch (error: any) {
      console.error('Error fetching Discord guilds:', error)
      toast.error('Failed to load Discord servers')
    } finally {
      setLoading(false)
    }
  }

  const initiateDiscordAuth = () => {
    const clientId = process.env.REACT_APP_DISCORD_CLIENT_ID || 'YOUR_DISCORD_CLIENT_ID'
    const redirectUri = `${window.location.origin}/auth/discord/callback`
    const scope = 'identify email guilds'
    const responseType = 'code'
    const state = btoa(JSON.stringify({ timestamp: Date.now(), user_id: user?.id }))
    
    const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${encodeURIComponent(scope)}&state=${encodeURIComponent(state)}`
    
    window.location.href = authUrl
  }

  const disconnectDiscord = async () => {
    if (!user) return

    try {
      setLoading(true)
      
      const { error } = await supabase
        .from('discord_profiles')
        .delete()
        .eq('user_id', user.id)

      if (error) {
        throw error
      }

      setDiscordProfile(null)
      setIsConnected(false)
      setDiscordGuilds([])
      toast.success('Discord account disconnected')
      
    } catch (error: any) {
      console.error('Error disconnecting Discord:', error)
      toast.error('Failed to disconnect Discord account')
    } finally {
      setLoading(false)
    }
  }

  const getDiscordAvatarUrl = (size: number = 128) => {
    if (!discordProfile?.avatar || !discordProfile?.discord_id) return null
    
    return `https://cdn.discordapp.com/avatars/${discordProfile.discord_id}/${discordProfile.avatar}.png?size=${size}`
  }

  const getGuildIconUrl = (guild: DiscordGuild, size: number = 64) => {
    if (!guild.icon) return null
    
    return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=${size}`
  }

  return {
    // State
    discordProfile,
    discordGuilds,
    loading,
    isConnected,
    
    // Actions
    fetchDiscordProfile,
    fetchDiscordGuilds,
    initiateDiscordAuth,
    disconnectDiscord,
    refreshDiscordToken,
    
    // Helpers
    getDiscordAvatarUrl,
    getGuildIconUrl
  }
}
