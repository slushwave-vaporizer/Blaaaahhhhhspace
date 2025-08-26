// Virtual Rooms Management Hook
// Handles room CRUD operations and state management

import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'
import toast from 'react-hot-toast'

export interface VirtualRoom {
  id: string
  user_id: string
  name: string
  description?: string
  room_type: 'gallery' | 'studio' | 'lounge' | 'workshop' | 'office' | 'exhibition'
  is_public: boolean
  is_featured: boolean
  room_config: any
  theme: string
  background_color: string
  floor_texture?: string
  wall_texture?: string
  ceiling_texture?: string
  ambient_lighting: {
    intensity: number
    color: string
  }
  visit_count: number
  like_count: number
  created_at: string
  updated_at: string
  profiles?: {
    username: string
    display_name: string
    avatar_url?: string
  }
  assets?: any[]
}

export interface VirtualRoomCreateData {
  name: string
  description?: string
  room_type?: string
  is_public?: boolean
  theme?: string
  room_config?: any
  floor_texture?: string
  wall_texture?: string
  ceiling_texture?: string
  ambient_lighting?: {
    intensity: number
    color: string
  }
}

export const useVirtualRooms = () => {
  const { user, session } = useAuth()
  const [loading, setLoading] = useState(false)
  const [rooms, setRooms] = useState<VirtualRoom[]>([])
  const [currentRoom, setCurrentRoom] = useState<VirtualRoom | null>(null)

  // Create a new virtual room
  const createRoom = useCallback(async (roomData: VirtualRoomCreateData): Promise<VirtualRoom | null> => {
    if (!user || !session) {
      toast.error('Please sign in to create a room')
      return null
    }

    setLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('virtual-room-management', {
        body: {
          action: 'create',
          roomData
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      })

      if (error) throw error
      if (data.error) throw new Error(data.error.message)

      const newRoom = data.data
      setRooms(prev => [newRoom, ...prev])
      toast.success('Virtual room created successfully!')
      return newRoom
    } catch (error: any) {
      console.error('Error creating room:', error)
      toast.error(error.message || 'Failed to create room')
      return null
    } finally {
      setLoading(false)
    }
  }, [user, session])

  // Update an existing room
  const updateRoom = useCallback(async (roomId: string, roomData: Partial<VirtualRoomCreateData>): Promise<VirtualRoom | null> => {
    if (!user || !session) {
      toast.error('Please sign in to update room')
      return null
    }

    setLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('virtual-room-management', {
        body: {
          action: 'update',
          roomId,
          roomData
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      })

      if (error) throw error
      if (data.error) throw new Error(data.error.message)

      const updatedRoom = data.data
      setRooms(prev => prev.map(room => room.id === roomId ? updatedRoom : room))
      if (currentRoom?.id === roomId) {
        setCurrentRoom(updatedRoom)
      }
      toast.success('Room updated successfully!')
      return updatedRoom
    } catch (error: any) {
      console.error('Error updating room:', error)
      toast.error(error.message || 'Failed to update room')
      return null
    } finally {
      setLoading(false)
    }
  }, [user, session, currentRoom])

  // Delete a room
  const deleteRoom = useCallback(async (roomId: string): Promise<boolean> => {
    if (!user || !session) {
      toast.error('Please sign in to delete room')
      return false
    }

    setLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('virtual-room-management', {
        body: {
          action: 'delete',
          roomId
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      })

      if (error) throw error
      if (data.error) throw new Error(data.error.message)

      setRooms(prev => prev.filter(room => room.id !== roomId))
      if (currentRoom?.id === roomId) {
        setCurrentRoom(null)
      }
      toast.success('Room deleted successfully!')
      return true
    } catch (error: any) {
      console.error('Error deleting room:', error)
      toast.error(error.message || 'Failed to delete room')
      return false
    } finally {
      setLoading(false)
    }
  }, [user, session, currentRoom])

  // Get a specific room
  const getRoom = useCallback(async (roomId: string): Promise<VirtualRoom | null> => {
    if (!session) {
      toast.error('Please sign in to view room')
      return null
    }

    setLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('virtual-room-management', {
        body: {
          action: 'get',
          roomId
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      })

      if (error) throw error
      if (data.error) throw new Error(data.error.message)

      const room = data.data
      setCurrentRoom(room)
      return room
    } catch (error: any) {
      console.error('Error fetching room:', error)
      toast.error(error.message || 'Failed to load room')
      return null
    } finally {
      setLoading(false)
    }
  }, [session])

  // List rooms with filters
  const listRooms = useCallback(async (options: {
    page?: number
    limit?: number
    room_type?: string
    is_public?: boolean
  } = {}): Promise<{ rooms: VirtualRoom[], totalPages: number } | null> => {
    if (!session) {
      // For public rooms, we can still fetch without authentication
      // but let's require it for now
      toast.error('Please sign in to view rooms')
      return null
    }

    setLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('virtual-room-management', {
        body: {
          action: 'list',
          roomData: options
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      })

      if (error) throw error
      if (data.error) throw new Error(data.error.message)

      const result = {
        rooms: data.data,
        totalPages: data.totalPages
      }
      
      if (options.page === 1 || !options.page) {
        setRooms(data.data)
      } else {
        setRooms(prev => [...prev, ...data.data])
      }
      
      return result
    } catch (error: any) {
      console.error('Error listing rooms:', error)
      toast.error(error.message || 'Failed to load rooms')
      return null
    } finally {
      setLoading(false)
    }
  }, [session])

  // Get user's rooms
  const getUserRooms = useCallback(async (): Promise<VirtualRoom[]> => {
    if (!user || !session) {
      return []
    }

    const result = await listRooms({ is_public: false })
    return result?.rooms || []
  }, [user, session, listRooms])

  // Get public rooms
  const getPublicRooms = useCallback(async (): Promise<VirtualRoom[]> => {
    const result = await listRooms({ is_public: true })
    return result?.rooms || []
  }, [listRooms])

  return {
    // State
    loading,
    rooms,
    currentRoom,
    
    // Actions
    createRoom,
    updateRoom,
    deleteRoom,
    getRoom,
    listRooms,
    getUserRooms,
    getPublicRooms,
    
    // Utilities
    setCurrentRoom,
    clearRooms: () => setRooms([])
  }
}