// YourSpace Creative Labs - Real-time Collaboration Hook
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'
import toast from 'react-hot-toast'

interface CollaborationRoom {
  id: string
  title: string
  description?: string
  type: 'canvas' | 'code' | 'music' | 'video'
  created_by: string
  status: 'active' | 'paused' | 'completed'
  settings: Record<string, any>
  participants?: any[]
  content?: any
  created_at: string
  updated_at: string
}

export const useCollaboration = () => {
  const { user } = useAuth()
  const [collaborations, setCollaborations] = useState<CollaborationRoom[]>([])
  const [activeRoom, setActiveRoom] = useState<CollaborationRoom | null>(null)
  const [loading, setLoading] = useState(false)
  const [participants, setParticipants] = useState<any[]>([])

  const fetchCollaborations = async () => {
    if (!user) return

    setLoading(true)
    try {
      // Fetch collaborations where user is a participant
      const { data: participantData, error: participantError } = await supabase
        .from('collaboration_participants')
        .select(`
          collaboration_id,
          role,
          collaborations!inner (
            id,
            title,
            description,
            type,
            created_by,
            status,
            settings,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', user.id)

      if (participantError) throw participantError

      const collaborationData = participantData?.map(p => p.collaborations).flat() || []
      setCollaborations(collaborationData as CollaborationRoom[])
    } catch (error) {
      console.error('Error fetching collaborations:', error)
      toast.error('Error loading collaborations')
    } finally {
      setLoading(false)
    }
  }

  const createCollaboration = async ({
    title,
    description,
    type,
    isPublic = false
  }: {
    title: string
    description?: string
    type: 'canvas' | 'code' | 'music' | 'video'
    isPublic?: boolean
  }) => {
    if (!user) {
      toast.error('You must be signed in to create collaborations')
      return null
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-collaboration', {
        body: { title, description, type, collaborators: [] },
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      })

      if (error) throw error

      toast.success('Collaboration room created!')
      await fetchCollaborations()
      return data.collaboration
    } catch (error) {
      console.error('Error creating collaboration:', error)
      toast.error('Error creating collaboration')
      return null
    }
  }

  const joinCollaboration = async (collaborationId: string) => {
    if (!user) return false

    try {
      // Check if already a participant
      const { data: existing } = await supabase
        .from('collaboration_participants')
        .select('id')
        .eq('collaboration_id', collaborationId)
        .eq('user_id', user.id)
        .single()

      if (existing) {
        // Already a participant, just join the room
        const { data: collaboration } = await supabase
          .from('collaborations')
          .select('*')
          .eq('id', collaborationId)
          .single()

        if (collaboration) {
          setActiveRoom(collaboration)
          return true
        }
      } else {
        // Add as participant
        const { error } = await supabase
          .from('collaboration_participants')
          .insert({
            collaboration_id: collaborationId,
            user_id: user.id,
            role: 'collaborator',
            permissions: ['read', 'write']
          })

        if (error) throw error

        // Fetch and set active room
        const { data: collaboration } = await supabase
          .from('collaborations')
          .select('*')
          .eq('id', collaborationId)
          .single()

        if (collaboration) {
          setActiveRoom(collaboration)
          toast.success('Joined collaboration!')
          return true
        }
      }
    } catch (error) {
      console.error('Error joining collaboration:', error)
      toast.error('Error joining collaboration')
    }
    return false
  }

  const leaveCollaboration = async (collaborationId: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('collaboration_participants')
        .delete()
        .eq('collaboration_id', collaborationId)
        .eq('user_id', user.id)

      if (error) throw error

      if (activeRoom?.id === collaborationId) {
        setActiveRoom(null)
      }

      await fetchCollaborations()
      toast.success('Left collaboration')
    } catch (error) {
      console.error('Error leaving collaboration:', error)
      toast.error('Error leaving collaboration')
    }
  }

  const fetchParticipants = async (collaborationId: string) => {
    try {
      const { data, error } = await supabase
        .from('collaboration_participants')
        .select(`
          user_id,
          role,
          permissions,
          profiles!inner (
            username,
            display_name,
            avatar_url
          )
        `)
        .eq('collaboration_id', collaborationId)

      if (error) throw error
      setParticipants(data || [])
    } catch (error) {
      console.error('Error fetching participants:', error)
    }
  }

  // Real-time subscriptions
  useEffect(() => {
    if (!user) return

    // Subscribe to collaboration updates
    const collaborationSubscription = supabase
      .channel('collaboration_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'collaborations'
        },
        () => {
          fetchCollaborations()
        }
      )
      .subscribe()

    // Subscribe to participant updates
    const participantSubscription = supabase
      .channel('participant_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'collaboration_participants'
        },
        (payload) => {
          if (activeRoom && (payload.new as any)?.collaboration_id === activeRoom.id) {
            fetchParticipants(activeRoom.id)
          }
        }
      )
      .subscribe()

    return () => {
      collaborationSubscription.unsubscribe()
      participantSubscription.unsubscribe()
    }
  }, [user, activeRoom])

  useEffect(() => {
    if (user) {
      fetchCollaborations()
    }
  }, [user])

  useEffect(() => {
    if (activeRoom) {
      fetchParticipants(activeRoom.id)
    }
  }, [activeRoom])

  return {
    collaborations,
    activeRoom,
    participants,
    loading,
    fetchCollaborations,
    createCollaboration,
    joinCollaboration,
    leaveCollaboration,
    setActiveRoom
  }
}