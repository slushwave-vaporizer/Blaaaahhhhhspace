// Computer Interface Data Sync Edge Function
// Handles data synchronization between MiniMax OS and YourSpace Creative Labs

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Credentials': 'false'
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Get user from request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Authorization header required')
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      throw new Error('Invalid authorization token')
    }

    const { action, data: requestData } = await req.json()

    switch (action) {
      case 'sync_creator_data': {
        // Get creator profile and content data
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (profileError) throw profileError

        const { data: content, error: contentError } = await supabase
          .from('content')
          .select('*')
          .eq('creator_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50)

        if (contentError) throw contentError

        const { data: rooms, error: roomsError } = await supabase
          .from('virtual_rooms')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (roomsError) throw roomsError

        return new Response(JSON.stringify({
          data: {
            profile,
            content,
            rooms,
            preferences: {
              theme: profile?.theme || 'neon-city',
              workspace_config: profile?.custom_css || '{}'
            }
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      case 'save_content': {
        const { title, description, content_type, file_data, metadata } = requestData

        if (!title || !content_type) {
          throw new Error('Title and content type required')
        }

        // Handle file upload if provided
        let file_url = null
        if (file_data) {
          const fileName = `${user.id}/${Date.now()}_${title.replace(/[^a-zA-Z0-9]/g, '_')}`
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('content')
            .upload(fileName, file_data, {
              contentType: metadata?.mime_type,
              upsert: false
            })

          if (uploadError) throw uploadError
          
          const { data: urlData } = supabase.storage
            .from('content')
            .getPublicUrl(uploadData.path)
          
          file_url = urlData.publicUrl
        }

        // Create content record
        const { data: content, error: contentError } = await supabase
          .from('content')
          .insert({
            creator_id: user.id,
            title,
            description,
            content_type,
            file_url,
            file_size: metadata?.file_size || 0,
            mime_type: metadata?.mime_type,
            is_public: requestData.is_public || true,
            metadata: metadata || {}
          })
          .select()
          .single()

        if (contentError) throw contentError

        return new Response(JSON.stringify({ data: content }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      case 'update_profile': {
        const { display_name, bio, theme, custom_css, background_image_url } = requestData

        const updateData: any = {}
        if (display_name !== undefined) updateData.display_name = display_name
        if (bio !== undefined) updateData.bio = bio
        if (theme !== undefined) updateData.theme = theme
        if (custom_css !== undefined) updateData.custom_css = custom_css
        if (background_image_url !== undefined) updateData.background_image_url = background_image_url

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('user_id', user.id)
          .select()
          .single()

        if (profileError) throw profileError

        return new Response(JSON.stringify({ data: profile }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      case 'get_room_data': {
        const { room_id } = requestData
        
        if (!room_id) {
          throw new Error('Room ID required')
        }

        // Get room data with assets
        const { data: room, error: roomError } = await supabase
          .from('virtual_rooms')
          .select(`
            *,
            room_assets (
              *,
              asset_library (*)
            )
          `)
          .eq('id', room_id)
          .single()

        if (roomError) throw roomError

        if (room.user_id !== user.id && !room.is_public) {
          throw new Error('Not authorized to access this room')
        }

        return new Response(JSON.stringify({ data: room }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      case 'update_room': {
        const { room_id, name, description, theme, room_config, is_public } = requestData
        
        if (!room_id) {
          throw new Error('Room ID required')
        }

        // Verify room ownership
        const { data: existingRoom, error: roomError } = await supabase
          .from('virtual_rooms')
          .select('user_id')
          .eq('id', room_id)
          .single()

        if (roomError || !existingRoom) throw new Error('Room not found')
        if (existingRoom.user_id !== user.id) throw new Error('Not authorized')

        const updateData: any = {}
        if (name !== undefined) updateData.name = name
        if (description !== undefined) updateData.description = description
        if (theme !== undefined) updateData.theme = theme
        if (room_config !== undefined) updateData.room_config = room_config
        if (is_public !== undefined) updateData.is_public = is_public

        const { data: updatedRoom, error: updateError } = await supabase
          .from('virtual_rooms')
          .update(updateData)
          .eq('id', room_id)
          .select()
          .single()

        if (updateError) throw updateError

        return new Response(JSON.stringify({ data: updatedRoom }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      case 'get_analytics': {
        // Get user analytics data
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('profile_views, follower_count, following_count, total_earnings')
          .eq('user_id', user.id)
          .single()

        if (profileError) throw profileError

        // Get content engagement stats
        const { data: contentStats, error: contentError } = await supabase
          .from('content')
          .select('view_count, like_count, comment_count')
          .eq('creator_id', user.id)

        if (contentError) throw contentError

        // Get room visit stats
        const { data: roomStats, error: roomError } = await supabase
          .from('virtual_rooms')
          .select('visit_count, like_count')
          .eq('user_id', user.id)

        if (roomError) throw roomError

        const analytics = {
          profile: profile,
          content: {
            total_pieces: contentStats.length,
            total_views: contentStats.reduce((sum, c) => sum + c.view_count, 0),
            total_likes: contentStats.reduce((sum, c) => sum + c.like_count, 0),
            total_comments: contentStats.reduce((sum, c) => sum + c.comment_count, 0)
          },
          rooms: {
            total_rooms: roomStats.length,
            total_visits: roomStats.reduce((sum, r) => sum + r.visit_count, 0),
            total_likes: roomStats.reduce((sum, r) => sum + r.like_count, 0)
          }
        }

        return new Response(JSON.stringify({ data: analytics }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      default:
        throw new Error('Invalid action')
    }

  } catch (error) {
    console.error('Computer interface sync error:', error)
    
    const errorResponse = {
      error: {
        code: 'COMPUTER_INTERFACE_ERROR',
        message: error.message
      }
    }

    return new Response(JSON.stringify(errorResponse), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
