// YourSpace Creative Labs - Chat Management Hook
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'
import toast from 'react-hot-toast'

export interface ChatRoom {
  id: string
  name: string
  description?: string
  type: 'text' | 'voice' | 'video'
  is_private: boolean
  created_by: string
  user_role: 'admin' | 'member'
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  id: string
  room_id: string
  user_id: string
  content: string
  message_type: 'text' | 'file' | 'image' | 'audio' | 'video'
  file_url?: string
  file_name?: string
  file_size?: number
  reply_to?: string
  user_profile?: {
    id: string
    username: string
    display_name?: string
    avatar_url?: string
  }
  created_at: string
  edited_at?: string
}

export interface VoiceSession {
  id: string
  room_id: string
  created_by: string
  status: 'active' | 'ended'
  started_at: string
  ended_at?: string
}

export interface VoiceParticipant {
  id: string
  session_id: string
  user_id: string
  is_muted: boolean
  is_speaking: boolean
  user_profile?: {
    id: string
    username: string
    display_name?: string
    avatar_url?: string
  }
  joined_at: string
  left_at?: string
}

export const useChat = () => {
  const { user } = useAuth()
  const [rooms, setRooms] = useState<ChatRoom[]>([])
  const [messages, setMessages] = useState<{ [roomId: string]: ChatMessage[] }>({})
  const [voiceSessions, setVoiceSessions] = useState<VoiceSession[]>([])
  const [voiceParticipants, setVoiceParticipants] = useState<{ [sessionId: string]: VoiceParticipant[] }>({})
  const [loading, setLoading] = useState(false)
  const [currentRoom, setCurrentRoom] = useState<string | null>(null)
  const [currentVoiceSession, setCurrentVoiceSession] = useState<string | null>(null)

  // Real-time subscriptions
  const [messagesSubscription, setMessagesSubscription] = useState<any>(null)
  const [roomsSubscription, setRoomsSubscription] = useState<any>(null)
  const [voiceSubscription, setVoiceSubscription] = useState<any>(null)

  const invokeFunction = async (action: string, params: any = {}) => {
    if (!user) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase.functions.invoke('chat-manager', {
      body: { action, ...params },
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (error) {
      console.error(`Chat manager error (${action}):`, error)
      throw new Error(error.message || `Failed to ${action}`)
    }

    if (data?.error) {
      console.error(`Chat manager returned error (${action}):`, data.error)
      throw new Error(data.error.message || `Failed to ${action}`)
    }

    return data?.data
  }

  const invokeVoiceFunction = async (action: string, params: any = {}) => {
    if (!user) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase.functions.invoke('voice-chat-manager', {
      body: { action, ...params },
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (error) {
      console.error(`Voice chat manager error (${action}):`, error)
      throw new Error(error.message || `Failed to ${action}`)
    }

    if (data?.error) {
      console.error(`Voice chat manager returned error (${action}):`, data.error)
      throw new Error(data.error.message || `Failed to ${action}`)
    }

    return data?.data
  }

  // Chat room management
  const createRoom = async (name: string, description?: string, type: 'text' | 'voice' | 'video' = 'text', isPrivate = false) => {
    try {
      const room = await invokeFunction('create_room', {
        name,
        description,
        type,
        isPrivate
      })
      await fetchRooms()
      toast.success('Room created successfully!')
      return room
    } catch (error: any) {
      toast.error(error.message || 'Failed to create room')
      throw error
    }
  }

  const joinRoom = async (roomId: string) => {
    try {
      await invokeFunction('join_room', { roomId })
      await fetchRooms()
      toast.success('Joined room successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to join room')
      throw error
    }
  }

  const fetchRooms = async () => {
    if (!user) return

    try {
      setLoading(true)
      const roomsData = await invokeFunction('get_rooms')
      setRooms(roomsData || [])
    } catch (error: any) {
      console.error('Error fetching rooms:', error)
      toast.error('Failed to load rooms')
    } finally {
      setLoading(false)
    }
  }

  // Message management
  const sendMessage = async (roomId: string, content: string, messageType: 'text' | 'file' | 'image' = 'text', fileData?: {
    url: string
    filename: string
    size: number
  }, replyTo?: string) => {
    try {
      const messageData = {
        roomId,
        content,
        messageType,
        ...(fileData && {
          fileUrl: fileData.url,
          fileName: fileData.filename,
          fileSize: fileData.size
        }),
        ...(replyTo && { replyTo })
      }
      
      await invokeFunction('send_message', messageData)
      // Real-time subscription will handle message updates
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message')
      throw error
    }
  }

  const uploadFile = async (file: File, roomId: string) => {
    try {
      const fileData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      const uploadResult = await invokeFunction('upload_file', {
        fileData,
        fileName: file.name,
        roomId
      })

      return uploadResult
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload file')
      throw error
    }
  }

  const fetchMessages = async (roomId: string, limit = 50, offset = 0) => {
    try {
      const messagesData = await invokeFunction('get_messages', {
        roomId,
        limit,
        offset
      })
      
      setMessages(prev => ({
        ...prev,
        [roomId]: messagesData || []
      }))
      
      return messagesData || []
    } catch (error: any) {
      console.error('Error fetching messages:', error)
      toast.error('Failed to load messages')
      return []
    }
  }

  // Voice chat management
  const startVoiceSession = async (roomId: string) => {
    try {
      const session = await invokeVoiceFunction('start_voice_session', { roomId })
      setCurrentVoiceSession(session.id)
      await fetchVoiceSessions()
      toast.success('Voice session started!')
      return session
    } catch (error: any) {
      toast.error(error.message || 'Failed to start voice session')
      throw error
    }
  }

  const joinVoiceSession = async (sessionId: string) => {
    try {
      await invokeVoiceFunction('join_voice_session', { sessionId })
      setCurrentVoiceSession(sessionId)
      await fetchSessionParticipants(sessionId)
      toast.success('Joined voice chat!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to join voice session')
      throw error
    }
  }

  const leaveVoiceSession = async (sessionId: string) => {
    try {
      await invokeVoiceFunction('leave_voice_session', { sessionId })
      setCurrentVoiceSession(null)
      await fetchVoiceSessions()
      toast.success('Left voice chat')
    } catch (error: any) {
      toast.error(error.message || 'Failed to leave voice session')
      throw error
    }
  }

  const updateVoiceStatus = async (sessionId: string, isMuted?: boolean, isSpeaking?: boolean) => {
    try {
      await invokeVoiceFunction('update_voice_status', {
        sessionId,
        isMuted,
        isSpeaking
      })
      await fetchSessionParticipants(sessionId)
    } catch (error: any) {
      console.error('Failed to update voice status:', error)
    }
  }

  const fetchVoiceSessions = async (roomId?: string) => {
    try {
      const sessions = await invokeVoiceFunction('get_voice_sessions', { roomId })
      setVoiceSessions(sessions || [])
      return sessions || []
    } catch (error: any) {
      console.error('Error fetching voice sessions:', error)
      return []
    }
  }

  const fetchSessionParticipants = async (sessionId: string) => {
    try {
      const participants = await invokeVoiceFunction('get_session_participants', { sessionId })
      setVoiceParticipants(prev => ({
        ...prev,
        [sessionId]: participants || []
      }))
      return participants || []
    } catch (error: any) {
      console.error('Error fetching session participants:', error)
      return []
    }
  }

  // Real-time subscriptions
  const subscribeToMessages = useCallback((roomId: string) => {
    if (!user || !roomId) return

    // Unsubscribe from previous subscription
    if (messagesSubscription) {
      messagesSubscription.unsubscribe()
    }

    const subscription = supabase
      .channel(`chat_messages:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newMessage = payload.new as ChatMessage
            setMessages(prev => ({
              ...prev,
              [roomId]: [...(prev[roomId] || []), newMessage]
            }))
          }
        }
      )
      .subscribe()

    setMessagesSubscription(subscription)
  }, [user, messagesSubscription])

  const subscribeToRooms = useCallback(() => {
    if (!user) return

    if (roomsSubscription) {
      roomsSubscription.unsubscribe()
    }

    const subscription = supabase
      .channel('chat_rooms')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_rooms'
        },
        () => {
          fetchRooms() // Refetch rooms on any change
        }
      )
      .subscribe()

    setRoomsSubscription(subscription)
  }, [user, roomsSubscription])

  const subscribeToVoice = useCallback(() => {
    if (!user) return

    if (voiceSubscription) {
      voiceSubscription.unsubscribe()
    }

    const subscription = supabase
      .channel('voice_sessions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'voice_sessions'
        },
        () => {
          fetchVoiceSessions()
        }
      )
      .subscribe()

    setVoiceSubscription(subscription)
  }, [user, voiceSubscription])

  // Initialize subscriptions and data
  useEffect(() => {
    if (user) {
      fetchRooms()
      subscribeToRooms()
      subscribeToVoice()
    }

    return () => {
      if (messagesSubscription) messagesSubscription.unsubscribe()
      if (roomsSubscription) roomsSubscription.unsubscribe()
      if (voiceSubscription) voiceSubscription.unsubscribe()
    }
  }, [user])

  // Subscribe to messages when current room changes
  useEffect(() => {
    if (currentRoom) {
      subscribeToMessages(currentRoom)
      fetchMessages(currentRoom)
    }
  }, [currentRoom, subscribeToMessages])

  return {
    // State
    rooms,
    messages,
    voiceSessions,
    voiceParticipants,
    loading,
    currentRoom,
    currentVoiceSession,
    
    // Room management
    createRoom,
    joinRoom,
    fetchRooms,
    setCurrentRoom,
    
    // Message management
    sendMessage,
    uploadFile,
    fetchMessages,
    
    // Voice chat management
    startVoiceSession,
    joinVoiceSession,
    leaveVoiceSession,
    updateVoiceStatus,
    fetchVoiceSessions,
    fetchSessionParticipants,
    setCurrentVoiceSession,
    
    // Real-time subscriptions
    subscribeToMessages
  }
}
