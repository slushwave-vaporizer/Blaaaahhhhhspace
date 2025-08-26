// YourSpace Creative Labs - Content Management Hook
import { useState, useEffect } from 'react'
import { supabase, Content } from '../lib/supabase'
import { useAuth } from './useAuth'
import toast from 'react-hot-toast'

export const useContent = () => {
  const { user } = useAuth()
  const [content, setContent] = useState<Content[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const fetchContent = async (filters?: {
    userId?: string
    contentType?: string
    isPublic?: boolean
    limit?: number
    offset?: number
  }) => {
    setLoading(true)
    try {
      console.log('Fetching content with filters:', filters)
      
      // Use direct Supabase query instead of edge function for stability
      let query = supabase
        .from('content')
        .select('*, profiles!inner(display_name, username)')
      
      if (filters?.userId) {
        query = query.eq('creator_id', filters.userId)
      }
      
      if (filters?.contentType) {
        query = query.eq('content_type', filters.contentType)
      }
      
      if (filters?.isPublic !== undefined) {
        query = query.eq('is_public', filters.isPublic)
      }
      
      query = query.order('created_at', { ascending: false })
      
      if (filters?.limit) {
        query = query.limit(filters.limit)
      }
      
      if (filters?.offset) {
        query = query.range(filters.offset, (filters.offset || 0) + (filters.limit || 10) - 1)
      }

      const { data: contentData, error } = await query

      if (error) {
        console.log('Content query error (non-critical):', error)
        setContent([])
        return
      }

      const processedContent = contentData || []
      setContent(processedContent)
      console.log(`Content loaded successfully: ${processedContent.length} items`)
      
    } catch (error: any) {
      console.log('Error fetching content (non-critical):', error)
      setContent([])
    } finally {
      setLoading(false)
    }
  }

  const uploadContent = async ({
    file,
    title,
    description,
    tags = [],
    isPublic = true,
    contentType
  }: {
    file: File
    title: string
    description?: string
    tags?: string[]
    isPublic?: boolean
    contentType: string
  }) => {
    if (!user) {
      toast.error('You must be signed in to upload content')
      return null
    }

    setUploading(true)
    try {
      console.log('Starting content upload...', { title, contentType, fileSize: file.size })
      
      // Convert file to base64
      const fileData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      // Upload via edge function
      const { data, error } = await supabase.functions.invoke('content-upload', {
        body: {
          fileData,
          fileName: file.name,
          title,
          description: description || '',
          contentType,
          tags,
          isPublic
        }
      })

      if (error) {
        throw new Error(error.message)
      }

      if (data?.error) {
        throw new Error(data.error.message)
      }

      const uploadedContent = data?.data?.content
      if (uploadedContent) {
        // Add to local content for immediate display
        setContent(prev => [uploadedContent, ...prev])
        toast.success('Content uploaded successfully!')
        return uploadedContent
      }

      throw new Error('Upload succeeded but no content data returned')
    } catch (error: any) {
      console.error('Error uploading content:', error)
      toast.error(error.message || 'Upload failed. Please try again.')
      return null
    } finally {
      setUploading(false)
    }
  }

  const deleteContent = async (contentId: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('content')
        .delete()
        .eq('id', contentId)
        .eq('creator_id', user.id)

      if (error) throw error

      setContent(prev => prev.filter(item => item.id !== contentId))
      toast.success('Content deleted successfully!')
    } catch (error) {
      console.error('Error deleting content:', error)
      toast.error('Error deleting content')
    }
  }

  const likeContent = async (contentId: string) => {
    if (!user) return

    try {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('content_id', contentId)
        .eq('user_id', user.id)
        .single()

      if (existingLike) {
        // Unlike
        await supabase
          .from('likes')
          .delete()
          .eq('content_id', contentId)
          .eq('user_id', user.id)

        // Manually decrement like count
        const { data: content } = await supabase
          .from('content')
          .select('like_count')
          .eq('id', contentId)
          .single()
          
        if (content) {
          await supabase
            .from('content')
            .update({ like_count: Math.max(0, (content.like_count || 0) - 1) })
            .eq('id', contentId)
        }
      } else {
        // Like
        await supabase
          .from('likes')
          .insert({ content_id: contentId, user_id: user.id })

        // Manually increment like count
        const { data: content } = await supabase
          .from('content')
          .select('like_count')
          .eq('id', contentId)
          .single()
          
        if (content) {
          await supabase
            .from('content')
            .update({ like_count: (content.like_count || 0) + 1 })
            .eq('id', contentId)
        }
      }

      // Refresh content
      await fetchContent()
    } catch (error) {
      console.error('Error liking content:', error)
      toast.error('Failed to update like')
    }
  }

  useEffect(() => {
    if (user) {
      fetchContent()
    }
  }, [user])

  return {
    content,
    loading,
    uploading,
    fetchContent,
    uploadContent,
    deleteContent,
    likeContent
  }
}
