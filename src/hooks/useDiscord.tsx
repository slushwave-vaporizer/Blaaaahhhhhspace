// YourSpace Creative Labs - Discord Integration Hook
import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

interface DiscordProfile {
  id: string
  user_id: string
  discord_id: string
  username: string
  discriminator?: string
  avatar?: string
  global_name?: string
  email?: string
  verified: boolean
  linked_at: string
}

export const useDiscord = () => {
  const { user } = useAuth()
  const [discordProfile, setDiscordProfile] = useState<DiscordProfile | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      fetchDiscordProfile()
    }
  }, [user])

  const fetchDiscordProfile = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('discord_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.log('Discord profile fetch error (non-critical):', error)
        setDiscordProfile(null)
        setIsConnected(false)
        return
      }

      if (data) {
        setDiscordProfile(data)
        setIsConnected(true)
      } else {
        setDiscordProfile(null)
        setIsConnected(false)
      }
    } catch (error) {
      console.log('Error fetching Discord profile:', error)
      setDiscordProfile(null)
      setIsConnected(false)
    }
  }

  const linkDiscordAccount = async () => {
    if (!user) {
      toast.error('You must be signed in to link Discord')
      return
    }

    setLoading(true)
    try {
      // For demo purposes, simulate Discord linking without actual OAuth
      // In production, this would redirect to Discord OAuth
      
      // Simulate Discord OAuth response
      const mockDiscordData = {
        user_id: user.id,
        discord_id: `discord_${Math.random().toString(36).substring(7)}`,
        username: `Creator${Math.floor(Math.random() * 1000)}`,
        discriminator: '0001',
        avatar: `https://cdn.discordapp.com/embed/avatars/${Math.floor(Math.random() * 6)}.png`,
        global_name: `Creative User`,
        email: user.email || '',
        verified: true
      }

      const { data, error } = await supabase
        .from('discord_profiles')
        .insert(mockDiscordData)
        .select()
        .single()

      if (error) {
        console.log('Discord linking error (demo mode):', error)
        // For demo, create mock data locally
        const mockProfile = {
          id: crypto.randomUUID(),
          ...mockDiscordData,
          linked_at: new Date().toISOString()
        }
        setDiscordProfile(mockProfile)
        setIsConnected(true)
        toast.success('Discord account linked successfully! (Demo Mode)')
        return
      }

      if (data) {
        setDiscordProfile(data)
        setIsConnected(true)
        toast.success('Discord account linked successfully!')
      }
    } catch (error) {
      console.error('Error linking Discord account:', error)
      toast.error('Failed to link Discord account')
    } finally {
      setLoading(false)
    }
  }

  const unlinkDiscordAccount = async () => {
    if (!user || !discordProfile) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('discord_profiles')
        .delete()
        .eq('user_id', user.id)

      if (error) {
        console.log('Discord unlinking error:', error)
      }

      // Reset state regardless of database result (for demo)
      setDiscordProfile(null)
      setIsConnected(false)
      toast.success('Discord account unlinked successfully!')
    } catch (error) {
      console.error('Error unlinking Discord account:', error)
      toast.error('Failed to unlink Discord account')
    } finally {
      setLoading(false)
    }
  }

  const createVoiceChannel = async (channelName: string) => {
    if (!isConnected) {
      toast.error('Discord account not connected')
      return null
    }

    try {
      // For demo purposes, return a mock Discord invite
      const mockInvite = {
        code: `yourspace_${Math.random().toString(36).substring(7)}`,
        url: `https://discord.gg/yourspace_demo`,
        channel_name: channelName,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }

      // Save voice session to database
      const { data, error } = await supabase
        .from('discord_voice_sessions')
        .insert({
          room_id: 'virtual_room',
          discord_channel_id: 'demo_channel_123',
          channel_name: channelName,
          invite_code: mockInvite.code,
          creator_user_id: user?.id,
          expires_at: mockInvite.expires_at
        })
        .select()
        .single()

      if (error) {
        console.log('Voice session creation error:', error)
        // Return mock data for demo
        return mockInvite
      }

      return mockInvite
    } catch (error) {
      console.error('Error creating voice channel:', error)
      toast.error('Failed to create voice channel')
      return null
    }
  }

  const initiateDiscordAuth = () => {
    // For demo purposes, just call linkDiscordAccount directly
    linkDiscordAccount()
  }

  return {
    discordProfile,
    isConnected,
    loading,
    linkDiscordAccount,
    unlinkDiscordAccount,
    createVoiceChannel,
    initiateDiscordAuth,
    fetchDiscordProfile
  }
}nvite
      }

      toast.success(`Voice channel "${channelName}" created!`)
      return mockInvite
    } catch (error) {
      console.error('Error creating voice channel:', error)
      toast.error('Failed to create voice channel')
      return null
    }
  }

  return {
    discordProfile,
    isConnected,
    loading,
    linkDiscordAccount,
    unlinkDiscordAccount,
    createVoiceChannel,
    refreshProfile: fetchDiscordProfile
  }
}
