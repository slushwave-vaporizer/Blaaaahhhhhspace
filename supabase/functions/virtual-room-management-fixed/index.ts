// Virtual Room Management Edge Function
// Handles room creation, updates, and management

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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    // Get user from request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Authorization header required')
    }

    const token = authHeader.replace('Bearer ', '')
    const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': supabaseServiceKey
      }
    })
    
    if (!userResponse.ok) {
      throw new Error('Invalid authorization token')
    }

    const userData = await userResponse.json()
    const user = userData

    const { action, roomData, roomId } = await req.json()

    switch (action) {
      case 'create': {
        const insertData = {
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
        }

        const response = await fetch(`${supabaseUrl}/rest/v1/virtual_rooms`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'apikey': supabaseServiceKey,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(insertData)
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Failed to create room: ${errorText}`)
        }

        const data = await response.json()

        return new Response(JSON.stringify({ data: data[0] }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      case 'update': {
        if (!roomId) throw new Error('Room ID required for update')

        // First check if user owns the room
        const roomCheck = await fetch(`${supabaseUrl}/rest/v1/virtual_rooms?select=user_id&id=eq.${roomId}`, {
          headers: {
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'apikey': supabaseServiceKey
          }
        })

        if (!roomCheck.ok) throw new Error('Room not found')
        const rooms = await roomCheck.json()
        if (rooms.length === 0) throw new Error('Room not found')
        if (rooms[0].user_id !== user.id) throw new Error('Not authorized to update this room')

        const response = await fetch(`${supabaseUrl}/rest/v1/virtual_rooms?id=eq.${roomId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'apikey': supabaseServiceKey,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(roomData)
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Failed to update room: ${errorText}`)
        }

        const data = await response.json()

        return new Response(JSON.stringify({ data: data[0] }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      case 'delete': {
        if (!roomId) throw new Error('Room ID required for deletion')

        // Check ownership
        const roomCheck = await fetch(`${supabaseUrl}/rest/v1/virtual_rooms?select=user_id&id=eq.${roomId}`, {
          headers: {
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'apikey': supabaseServiceKey
          }
        })

        if (!roomCheck.ok) throw new Error('Room not found')
        const rooms = await roomCheck.json()
        if (rooms.length === 0) throw new Error('Room not found')
        if (rooms[0].user_id !== user.id) throw new Error('Not authorized to delete this room')

        const response = await fetch(`${supabaseUrl}/rest/v1/virtual_rooms?id=eq.${roomId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'apikey': supabaseServiceKey
          }
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Failed to delete room: ${errorText}`)
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      case 'get': {
        if (!roomId) throw new Error('Room ID required')

        const response = await fetch(`${supabaseUrl}/rest/v1/virtual_rooms?select=*,profiles!virtual_rooms_user_id_fkey(username,display_name,avatar_url)&id=eq.${roomId}`, {
          headers: {
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'apikey': supabaseServiceKey
          }
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Failed to get room: ${errorText}`)
        }

        const data = await response.json()
        if (data.length === 0) throw new Error('Room not found')

        const room = data[0]
        // Check if user can access this room
        if (!room.is_public && room.user_id !== user.id) {
          throw new Error('Not authorized to access this room')
        }

        return new Response(JSON.stringify({ data: room }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      case 'list': {
        const { page = 1, limit = 10, room_type, is_public } = roomData || {}
        
        let queryParams = 'select=*,profiles!virtual_rooms_user_id_fkey(username,display_name,avatar_url)'
        let filterParams = []

        // Apply filters
        if (is_public !== undefined) {
          filterParams.push(`is_public=eq.${is_public}`)
        } else {
          // Default to showing public rooms or user's own rooms
          filterParams.push(`or=(is_public.eq.true,user_id.eq.${user.id})`)
        }

        if (room_type) {
          filterParams.push(`room_type=eq.${room_type}`)
        }

        filterParams.push('order=updated_at.desc')
        filterParams.push(`limit=${limit}`)
        filterParams.push(`offset=${(page - 1) * limit}`)

        const queryString = queryParams + '&' + filterParams.join('&')
        const response = await fetch(`${supabaseUrl}/rest/v1/virtual_rooms?${queryString}`, {
          headers: {
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'apikey': supabaseServiceKey,
            'Prefer': 'count=exact'
          }
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Failed to list rooms: ${errorText}`)
        }

        const data = await response.json()
        const count = parseInt(response.headers.get('content-range')?.split('/')[1] || '0')

        return new Response(JSON.stringify({ 
          data, 
          count,
          page,
          limit,
          totalPages: Math.ceil(count / limit)
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