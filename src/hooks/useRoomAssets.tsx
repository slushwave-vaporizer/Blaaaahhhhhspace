// Room Assets Management Hook
// Handles asset placement and interaction within virtual rooms

import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'
import toast from 'react-hot-toast'

export interface RoomAsset {
  id: string
  room_id: string
  asset_id: string
  position_x: number
  position_y: number
  position_z: number
  rotation_x: number
  rotation_y: number
  rotation_z: number
  scale_x: number
  scale_y: number
  scale_z: number
  custom_properties: any
  is_interactive: boolean
  interaction_type?: string
  interaction_data: any
  order_index: number
  created_at: string
  updated_at: string
  asset_library?: {
    id: string
    name: string
    category: string
    file_url: string
    thumbnail_url?: string
    dimensions?: any
  }
}

export interface RoomAssetData {
  asset_id: string
  position_x?: number
  position_y?: number
  position_z?: number
  rotation_x?: number
  rotation_y?: number
  rotation_z?: number
  scale_x?: number
  scale_y?: number
  scale_z?: number
  custom_properties?: any
  is_interactive?: boolean
  interaction_type?: string
  interaction_data?: any
  order_index?: number
}

export const useRoomAssets = () => {
  const { user, session } = useAuth()
  const [loading, setLoading] = useState(false)
  const [roomAssets, setRoomAssets] = useState<RoomAsset[]>([])

  // Add asset to room
  const addAssetToRoom = useCallback(async (roomId: string, assetData: RoomAssetData): Promise<RoomAsset | null> => {
    if (!user || !session) {
      toast.error('Please sign in to add assets')
      return null
    }

    setLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('room-assets-management', {
        body: {
          action: 'add',
          roomId,
          assetData
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      })

      if (error) throw error
      if (data.error) throw new Error(data.error.message)

      const newRoomAsset = data.data
      setRoomAssets(prev => [...prev, newRoomAsset])
      toast.success('Asset added to room!')
      return newRoomAsset
    } catch (error: any) {
      console.error('Error adding asset to room:', error)
      toast.error(error.message || 'Failed to add asset')
      return null
    } finally {
      setLoading(false)
    }
  }, [user, session])

  // Update asset position/properties
  const updateRoomAsset = useCallback(async (roomAssetId: string, assetData: Partial<RoomAssetData>): Promise<RoomAsset | null> => {
    if (!user || !session) {
      toast.error('Please sign in to update assets')
      return null
    }

    setLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('room-assets-management', {
        body: {
          action: 'update',
          roomAssetId,
          assetData
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      })

      if (error) throw error
      if (data.error) throw new Error(data.error.message)

      const updatedAsset = data.data
      setRoomAssets(prev => prev.map(asset => 
        asset.id === roomAssetId ? updatedAsset : asset
      ))
      return updatedAsset
    } catch (error: any) {
      console.error('Error updating room asset:', error)
      toast.error(error.message || 'Failed to update asset')
      return null
    } finally {
      setLoading(false)
    }
  }, [user, session])

  // Remove asset from room
  const removeAssetFromRoom = useCallback(async (roomAssetId: string): Promise<boolean> => {
    if (!user || !session) {
      toast.error('Please sign in to remove assets')
      return false
    }

    setLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('room-assets-management', {
        body: {
          action: 'remove',
          roomAssetId
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      })

      if (error) throw error
      if (data.error) throw new Error(data.error.message)

      setRoomAssets(prev => prev.filter(asset => asset.id !== roomAssetId))
      toast.success('Asset removed from room')
      return true
    } catch (error: any) {
      console.error('Error removing asset from room:', error)
      toast.error(error.message || 'Failed to remove asset')
      return false
    } finally {
      setLoading(false)
    }
  }, [user, session])

  // Get all assets in a room
  const getRoomAssets = useCallback(async (roomId: string): Promise<RoomAsset[]> => {
    if (!session) {
      return []
    }

    setLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('room-assets-management', {
        body: {
          action: 'list',
          roomId
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      })

      if (error) throw error
      if (data.error) throw new Error(data.error.message)

      const assets = data.data || []
      setRoomAssets(assets)
      return assets
    } catch (error: any) {
      console.error('Error fetching room assets:', error)
      return []
    } finally {
      setLoading(false)
    }
  }, [session])

  // Bulk update multiple assets (for drag operations)
  const bulkUpdateAssets = useCallback(async (roomId: string, assetsData: Array<{ id: string } & Partial<RoomAssetData>>): Promise<RoomAsset[]> => {
    if (!user || !session) {
      toast.error('Please sign in to update assets')
      return []
    }

    setLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('room-assets-management', {
        body: {
          action: 'bulk_update',
          roomId,
          assetData: assetsData
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      })

      if (error) throw error
      if (data.error) throw new Error(data.error.message)

      const updatedAssets = data.data
      
      // Update local state
      setRoomAssets(prev => {
        const updated = [...prev]
        updatedAssets.forEach((updatedAsset: RoomAsset) => {
          const index = updated.findIndex(asset => asset.id === updatedAsset.id)
          if (index !== -1) {
            updated[index] = updatedAsset
          }
        })
        return updated
      })
      
      return updatedAssets
    } catch (error: any) {
      console.error('Error bulk updating assets:', error)
      toast.error(error.message || 'Failed to update assets')
      return []
    } finally {
      setLoading(false)
    }
  }, [user, session])

  // Clear room assets from state
  const clearRoomAssets = useCallback(() => {
    setRoomAssets([])
  }, [])

  return {
    // State
    loading,
    roomAssets,
    
    // Actions
    addAssetToRoom,
    updateRoomAsset,
    removeAssetFromRoom,
    getRoomAssets,
    bulkUpdateAssets,
    
    // Utilities
    clearRoomAssets
  }
}