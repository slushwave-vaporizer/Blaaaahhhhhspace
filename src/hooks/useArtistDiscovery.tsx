// YourSpace Creative Labs - Artist Discovery Hook
import { useState, useCallback } from 'react'
import { supabase, Profile } from '../lib/supabase'
import { useAuth } from './useAuth'
import toast from 'react-hot-toast'

interface ArtistWithContent extends Profile {
  content_samples?: any[]
}

interface DiscoveryAnalytics {
  total_swipes: number
  likes_given: number
  artists_discovered: number
  engagement_rate: number
  discovery_score: number
  last_swipe_at: string | null
  summary: {
    total_artists_seen: number
    artists_liked: number
    artists_passed: number
    engagement_rate: string
  }
  preferences_by_type: Record<string, any[]>
  recent_activity: any[]
}

export const useArtistDiscovery = () => {
  const { user } = useAuth()
  const [artistStack, setArtistStack] = useState<ArtistWithContent[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [analytics, setAnalytics] = useState<DiscoveryAnalytics | null>(null)
  const [swiping, setSwiping] = useState(false)

  const loadArtistStack = useCallback(async () => {
    setLoading(true)
    try {
      console.log('Loading artist stack...')
      
      const { data, error } = await supabase.functions.invoke('get-artist-stack', {
        body: {}
      })

      if (error) {
        console.error('Error loading artist stack:', error)
        toast.error('Failed to load artists')
        return
      }

      if (data?.data) {
        setArtistStack(data.data)
        setCurrentIndex(0)
        console.log(`Loaded ${data.data.length} artists for discovery`)
      }
    } catch (error: any) {
      console.error('Error in loadArtistStack:', error)
      toast.error('Failed to load artists')
    } finally {
      setLoading(false)
    }
  }, [])

  const swipeArtist = useCallback(async (liked: boolean) => {
    if (!user) {
      toast.error('Please sign in to start discovering artists')
      return
    }

    const currentArtist = artistStack[currentIndex]
    if (!currentArtist) return

    setSwiping(true)
    try {
      console.log(`Swiping ${liked ? 'right (like)' : 'left (pass)'} on artist:`, currentArtist.username)
      
      const { data, error } = await supabase.functions.invoke('handle-artist-swipe', {
        body: {
          artist_id: currentArtist.user_id,
          liked: liked
        }
      })

      if (error) {
        console.error('Error handling swipe:', error)
        toast.error('Failed to record preference')
        return
      }

      if (data?.data) {
        console.log('Swipe recorded successfully:', data.data)
        
        if (liked) {
          toast.success(`Discovered ${currentArtist.display_name || currentArtist.username}!`)
          
          if (data.data.is_mutual_follow) {
            toast.success('Mutual connection created! You now follow each other.', {
              duration: 5000,
              style: {
                background: 'rgba(16, 185, 129, 0.1)',
                borderColor: 'rgb(16, 185, 129)',
                color: 'rgb(16, 185, 129)',
              }
            })
          }
        }

        // Move to next artist
        const nextIndex = currentIndex + 1
        setCurrentIndex(nextIndex)

        // If we're near the end of the stack, load more artists
        if (nextIndex >= artistStack.length - 2) {
          console.log('Near end of stack, loading more artists...')
          await loadArtistStack()
        }
      }
    } catch (error: any) {
      console.error('Error in swipeArtist:', error)
      toast.error('Failed to record preference')
    } finally {
      setSwiping(false)
    }
  }, [user, artistStack, currentIndex, loadArtistStack])

  const loadAnalytics = useCallback(async () => {
    if (!user) return

    try {
      console.log('Loading discovery analytics...')
      
      const { data, error } = await supabase.functions.invoke('get-discovery-analytics', {
        body: {}
      })

      if (error) {
        console.error('Error loading analytics:', error)
        return
      }

      if (data?.data) {
        setAnalytics(data.data)
        console.log('Analytics loaded:', data.data)
      }
    } catch (error: any) {
      console.error('Error in loadAnalytics:', error)
    }
  }, [user])

  const getCurrentArtist = useCallback(() => {
    return artistStack[currentIndex] || null
  }, [artistStack, currentIndex])

  const getNextArtist = useCallback(() => {
    return artistStack[currentIndex + 1] || null
  }, [artistStack, currentIndex])

  const getRemainingCount = useCallback(() => {
    return Math.max(0, artistStack.length - currentIndex)
  }, [artistStack, currentIndex])

  const resetDiscovery = useCallback(async () => {
    console.log('Resetting discovery...')
    setCurrentIndex(0)
    await loadArtistStack()
  }, [loadArtistStack])

  return {
    artistStack,
    currentArtist: getCurrentArtist(),
    nextArtist: getNextArtist(),
    loading,
    swiping,
    analytics,
    remainingCount: getRemainingCount(),
    currentIndex,
    loadArtistStack,
    swipeArtist,
    loadAnalytics,
    resetDiscovery
  }
}