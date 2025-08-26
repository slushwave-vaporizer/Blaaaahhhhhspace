// YourSpace Creative Labs - EPK Hook
import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { supabase } from '../lib/supabase'
import { toast } from 'react-hot-toast'

export interface EPKData {
  id?: string
  user_id?: string
  artist_name: string
  genre?: string
  location?: string
  spotify_link?: string
  youtube_link?: string
  soundcloud_link?: string
  bandcamp_link?: string
  short_bio?: string
  long_bio?: string
  achievements?: string
  website?: string
  instagram?: string
  facebook?: string
  twitter?: string
  tiktok?: string
  mgmt_name?: string
  mgmt_email?: string
  mgmt_phone?: string
  booking_name?: string
  booking_email?: string
  booking_phone?: string
  live_video?: string
  music_video?: string
  promo_video?: string
  created_at?: string
  updated_at?: string
}

export interface EPKPhoto {
  id: string
  epk_id: string
  photo_type: string
  photo_url: string
  original_filename?: string
  file_size?: number
  created_at: string
}

export interface EPKPressQuote {
  id: string
  epk_id: string
  quote_text: string
  quote_source: string
  created_at: string
}

export interface EPKRoomObject {
  id: string
  user_id: string
  room_id: string
  object_type: string
  position_x: number
  position_y: number
  position_z: number
  rotation_x: number
  rotation_y: number
  rotation_z: number
  is_active: boolean
  created_at: string
}

interface UseEPKReturn {
  epk: EPKData | null
  photos: EPKPhoto[]
  pressQuotes: EPKPressQuote[]
  roomObjects: EPKRoomObject[]
  loading: boolean
  createEPK: (data: Partial<EPKData>) => Promise<EPKData | null>
  updateEPK: (id: string, data: Partial<EPKData>) => Promise<EPKData | null>
  deleteEPK: (id: string) => Promise<boolean>
  uploadPhoto: (epkId: string, file: File, photoType: string) => Promise<EPKPhoto | null>
  deletePhoto: (photoId: string) => Promise<boolean>
  addPressQuote: (epkId: string, text: string, source: string) => Promise<EPKPressQuote | null>
  updatePressQuote: (id: string, text: string, source: string) => Promise<EPKPressQuote | null>
  deletePressQuote: (id: string) => Promise<boolean>
  exportEPK: (epkId: string, format?: 'html' | 'json') => Promise<string | null>
  fetchEPK: (userId?: string) => Promise<void>
  hasEPK: boolean
}

export const useEPK = (): UseEPKReturn => {
  const { user } = useAuth()
  const [epk, setEPK] = useState<EPKData | null>(null)
  const [photos, setPhotos] = useState<EPKPhoto[]>([])
  const [pressQuotes, setPressQuotes] = useState<EPKPressQuote[]>([])
  const [roomObjects, setRoomObjects] = useState<EPKRoomObject[]>([])
  const [loading, setLoading] = useState(false)

  const hasEPK = epk !== null

  const fetchEPK = async (userId?: string) => {
    if (!user && !userId) return
    
    try {
      setLoading(true)
      
      const params = userId ? `?userId=${userId}` : ''
      const { data, error } = await supabase.functions.invoke('epk-get' + params)
      
      if (error) {
        if (error.message !== 'No EPK found') {
          throw error
        }
        return
      }
      
      if (data?.data) {
        setEPK(data.data.epk)
        setPhotos(data.data.photos || [])
        setPressQuotes(data.data.pressQuotes || [])
      }
    } catch (error: any) {
      console.error('Error fetching EPK:', error)
      if (error.message !== 'No EPK found' && error.message !== 'Authentication required or specify epkId/userId') {
        toast.error(error.message || 'Failed to fetch EPK')
      }
    } finally {
      setLoading(false)
    }
  }

  const createEPK = async (data: Partial<EPKData>): Promise<EPKData | null> => {
    if (!user) {
      toast.error('Please log in to create an EPK')
      return null
    }
    
    try {
      setLoading(true)
      
      const { data: result, error } = await supabase.functions.invoke('epk-create', {
        body: data
      })
      
      if (error) {
        throw error
      }
      
      const newEPK = result.data.epk
      setEPK(newEPK)
      toast.success('EPK created successfully!')
      return newEPK
    } catch (error: any) {
      console.error('Error creating EPK:', error)
      toast.error(error.message || 'Failed to create EPK')
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateEPK = async (id: string, data: Partial<EPKData>): Promise<EPKData | null> => {
    try {
      setLoading(true)
      
      const { data: result, error } = await supabase.functions.invoke('epk-update', {
        body: { epkId: id, ...data }
      })
      
      if (error) {
        throw error
      }
      
      const updatedEPK = result.data.epk
      setEPK(updatedEPK)
      toast.success('EPK updated successfully!')
      return updatedEPK
    } catch (error: any) {
      console.error('Error updating EPK:', error)
      toast.error(error.message || 'Failed to update EPK')
      return null
    } finally {
      setLoading(false)
    }
  }

  const deleteEPK = async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      
      const { error } = await supabase
        .from('epk_data')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id)
      
      if (error) {
        throw error
      }
      
      setEPK(null)
      setPhotos([])
      setPressQuotes([])
      toast.success('EPK deleted successfully!')
      return true
    } catch (error: any) {
      console.error('Error deleting EPK:', error)
      toast.error(error.message || 'Failed to delete EPK')
      return false
    } finally {
      setLoading(false)
    }
  }

  const uploadPhoto = async (epkId: string, file: File, photoType: string): Promise<EPKPhoto | null> => {
    try {
      setLoading(true)
      
      // Convert file to base64
      const reader = new FileReader()
      return new Promise((resolve, reject) => {
        reader.onloadend = async () => {
          try {
            const base64Data = reader.result as string
            
            const { data, error } = await supabase.functions.invoke('epk-photo-upload', {
              body: {
                imageData: base64Data,
                fileName: file.name,
                photoType,
                epkId
              }
            })
            
            if (error) {
              throw error
            }
            
            const newPhoto = data.data.photo
            setPhotos(prev => [...prev, newPhoto])
            toast.success('Photo uploaded successfully!')
            resolve(newPhoto)
          } catch (error: any) {
            console.error('Error uploading photo:', error)
            toast.error(error.message || 'Failed to upload photo')
            reject(error)
          } finally {
            setLoading(false)
          }
        }
        
        reader.onerror = () => {
          const error = new Error('Failed to read file')
          toast.error('Failed to read file')
          reject(error)
          setLoading(false)
        }
        
        reader.readAsDataURL(file)
      })
    } catch (error: any) {
      console.error('Error uploading photo:', error)
      toast.error(error.message || 'Failed to upload photo')
      setLoading(false)
      return null
    }
  }

  const deletePhoto = async (photoId: string): Promise<boolean> => {
    try {
      setLoading(true)
      
      const { error } = await supabase
        .from('epk_photos')
        .delete()
        .eq('id', photoId)
      
      if (error) {
        throw error
      }
      
      setPhotos(prev => prev.filter(p => p.id !== photoId))
      toast.success('Photo deleted successfully!')
      return true
    } catch (error: any) {
      console.error('Error deleting photo:', error)
      toast.error(error.message || 'Failed to delete photo')
      return false
    } finally {
      setLoading(false)
    }
  }

  const addPressQuote = async (epkId: string, text: string, source: string): Promise<EPKPressQuote | null> => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('epk_press_quotes')
        .insert({
          epk_id: epkId,
          quote_text: text,
          quote_source: source
        })
        .select()
        .single()
      
      if (error) {
        throw error
      }
      
      setPressQuotes(prev => [...prev, data])
      toast.success('Press quote added successfully!')
      return data
    } catch (error: any) {
      console.error('Error adding press quote:', error)
      toast.error(error.message || 'Failed to add press quote')
      return null
    } finally {
      setLoading(false)
    }
  }

  const updatePressQuote = async (id: string, text: string, source: string): Promise<EPKPressQuote | null> => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('epk_press_quotes')
        .update({
          quote_text: text,
          quote_source: source
        })
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        throw error
      }
      
      setPressQuotes(prev => prev.map(q => q.id === id ? data : q))
      toast.success('Press quote updated successfully!')
      return data
    } catch (error: any) {
      console.error('Error updating press quote:', error)
      toast.error(error.message || 'Failed to update press quote')
      return null
    } finally {
      setLoading(false)
    }
  }

  const deletePressQuote = async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      
      const { error } = await supabase
        .from('epk_press_quotes')
        .delete()
        .eq('id', id)
      
      if (error) {
        throw error
      }
      
      setPressQuotes(prev => prev.filter(q => q.id !== id))
      toast.success('Press quote deleted successfully!')
      return true
    } catch (error: any) {
      console.error('Error deleting press quote:', error)
      toast.error(error.message || 'Failed to delete press quote')
      return false
    } finally {
      setLoading(false)
    }
  }

  const exportEPK = async (epkId: string, format: 'html' | 'json' = 'html'): Promise<string | null> => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase.functions.invoke('epk-export', {
        body: { epkId, format }
      })
      
      if (error) {
        throw error
      }
      
      if (format === 'html') {
        // Create download
        const blob = new Blob([data.data.html], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${epk?.artist_name || 'EPK'}.html`
        a.click()
        URL.revokeObjectURL(url)
        toast.success('EPK exported successfully!')
      }
      
      return data.data.html || JSON.stringify(data.data, null, 2)
    } catch (error: any) {
      console.error('Error exporting EPK:', error)
      toast.error(error.message || 'Failed to export EPK')
      return null
    } finally {
      setLoading(false)
    }
  }

  // Auto-fetch EPK on mount
  useEffect(() => {
    if (user) {
      fetchEPK()
    }
  }, [user])

  return {
    epk,
    photos,
    pressQuotes,
    roomObjects,
    loading,
    createEPK,
    updateEPK,
    deleteEPK,
    uploadPhoto,
    deletePhoto,
    addPressQuote,
    updatePressQuote,
    deletePressQuote,
    exportEPK,
    fetchEPK,
    hasEPK
  }
}