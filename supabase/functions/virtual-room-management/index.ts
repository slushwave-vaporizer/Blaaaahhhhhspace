// Virtual Room Management Edge Function
// Handles room creation, updates, and management

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

    const { action, roomData, roomId } = await req.json()

    switch (action) {
      case 'create': {
        const { data, error } = await supabase
          .from('virtual_rooms')
          .insert({
            user_id: user.id,
            name: roomData.name,
            description: roomData.description || '',
            room_type: roomData.room_type || 'gallery',
            is_public: roomData.is_public || false,
            theme: roomData.theme || 'modern',
            room_config: roomData.room_config || {},
            floor_texture: roomData.floor_texture,
            wall_texture: roomData.wall_texture,
            ceiling_texture: roomData.ceiling_texture,
            ambient_lighting: roomData.ambient_lighting || { intensity: 0.3, color: '#ffffff' }
          })
          .select()
          .single()

        if (error) throw error

        return new Response(JSON.stringify({ data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      case 'update': {
        if (!roomId) throw new Error('Room ID required for update')

        // First check if user owns the room
        const { data: room, error: roomError } = await supabase
          .from('virtual_rooms')
          .select('user_id')
          .eq('id', roomId)
          .single()

        if (roomError || !room) throw new Error('Room not found')
        if (room.user_id !== user.id) throw new Error('Not authorized to update this room')

        const { data, error } = await supabase
          .from('virtual_rooms')
          .update(roomData)
          .eq('id', roomId)
          .select()
          .single()

        if (error) throw error

        return new Response(JSON.stringify({ data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      case 'delete': {
        if (!roomId) throw new Error('Room ID required for deletion')

        // Check ownership
        const { data: room, error: roomError } = await supabase
          .from('virtual_rooms')
          .select('user_id')
          .eq('id', roomId)
          .single()

        if (roomError || !room) throw new Error('Room not found')
        if (room.user_id !== user.id) throw new Error('Not authorized to delete this room')

        const { error } = await supabase
          .from('virtual_rooms')
          .delete()
          .eq('id', roomId)

        if (error) throw error

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      case 'get': {
        if (!roomId) throw new Error('Room ID required')

        const { data, error } = await supabase
          .from('virtual_rooms')
          .select(`
            *,
            profiles:user_id (
              username,
              display_name,
              avatar_url
            )
          `)
          .eq('id', roomId)
          .single()

        if (error) throw error

        // Check if user can access this room
        if (!data.is_public && data.user_id !== user.id) {
          throw new Error('Not authorized to access this room')
        }

        return new Response(JSON.stringify({ data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      case 'list': {
        const { page = 1, limit = 10, room_type, is_public } = roomData || {}
        
        let query = supabase
          .from('virtual_rooms')
          .select(`
            *,
            profiles:user_id (
              username,
              display_name,
              avatar_url
            )
          `, { count: 'exact' })

        // Apply filters
        if (is_public !== undefined) {
          query = query.eq('is_public', is_public)
        } else {
          // Default to showing public rooms or user's own rooms
          query = query.or(`is_public.eq.true,user_id.eq.${user.id}`)
        }

        if (room_type) {
          query = query.eq('room_type', room_type)
        }

        query = query
          .order('updated_at', { ascending: false })
          .range((page - 1) * limit, page * limit - 1)

        const { data, error, count } = await query

        if (error) throw error

        return new Response(JSON.stringify({ 
          data, 
          count,
          page,
          limit,
          totalPages: Math.ceil((count || 0) / limit)
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      default:
        throw new Error('Invalid action')
    }

  } catch (error) {
    console.error('Room management error:', error)
    
    const errorResponse = {
      error: {
        code: 'ROOM_MANAGEMENT_ERROR',
        message: error.message
      }
    }

    return new Response(JSON.stringify(errorResponse), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})