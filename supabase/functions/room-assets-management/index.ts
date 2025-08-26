// Room Assets Management Edge Function
// Handles placement, positioning, and management of assets within rooms

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

    const { action, roomId, assetData, roomAssetId } = await req.json()

    // Helper function to check room ownership
    const checkRoomOwnership = async (roomId: string) => {
      const { data: room, error } = await supabase
        .from('virtual_rooms')
        .select('user_id')
        .eq('id', roomId)
        .single()
      
      if (error || !room) throw new Error('Room not found')
      if (room.user_id !== user.id) throw new Error('Not authorized to modify this room')
      
      return room
    }

    switch (action) {
      case 'add': {
        if (!roomId || !assetData.asset_id) {
          throw new Error('Room ID and Asset ID required')
        }

        // Check room ownership
        await checkRoomOwnership(roomId)

        // Verify asset exists and is accessible
        const { data: asset, error: assetError } = await supabase
          .from('asset_library')
          .select('*')
          .eq('id', assetData.asset_id)
          .single()

        if (assetError || !asset) throw new Error('Asset not found')
        if (!asset.is_public && asset.user_id !== user.id) {
          throw new Error('Not authorized to use this asset')
        }

        // Add asset to room
        const { data, error } = await supabase
          .from('room_assets')
          .insert({
            room_id: roomId,
            asset_id: assetData.asset_id,
            position_x: assetData.position_x || 0,
            position_y: assetData.position_y || 0,
            position_z: assetData.position_z || 0,
            rotation_x: assetData.rotation_x || 0,
            rotation_y: assetData.rotation_y || 0,
            rotation_z: assetData.rotation_z || 0,
            scale_x: assetData.scale_x || 1,
            scale_y: assetData.scale_y || 1,
            scale_z: assetData.scale_z || 1,
            custom_properties: assetData.custom_properties || {},
            is_interactive: assetData.is_interactive || false,
            interaction_type: assetData.interaction_type,
            interaction_data: assetData.interaction_data || {},
            order_index: assetData.order_index || 0
          })
          .select(`
            *,
            asset_library (*)
          `)
          .single()

        if (error) throw error

        return new Response(JSON.stringify({ data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      case 'update': {
        if (!roomAssetId) throw new Error('Room Asset ID required')

        // Get room asset and verify ownership
        const { data: roomAsset, error: roomAssetError } = await supabase
          .from('room_assets')
          .select(`
            *,
            virtual_rooms!inner(user_id)
          `)
          .eq('id', roomAssetId)
          .single()

        if (roomAssetError || !roomAsset) throw new Error('Room asset not found')
        if (roomAsset.virtual_rooms.user_id !== user.id) {
          throw new Error('Not authorized to update this room asset')
        }

        // Update room asset
        const { data, error } = await supabase
          .from('room_assets')
          .update({
            position_x: assetData.position_x,
            position_y: assetData.position_y,
            position_z: assetData.position_z,
            rotation_x: assetData.rotation_x,
            rotation_y: assetData.rotation_y,
            rotation_z: assetData.rotation_z,
            scale_x: assetData.scale_x,
            scale_y: assetData.scale_y,
            scale_z: assetData.scale_z,
            custom_properties: assetData.custom_properties,
            is_interactive: assetData.is_interactive,
            interaction_type: assetData.interaction_type,
            interaction_data: assetData.interaction_data,
            order_index: assetData.order_index
          })
          .eq('id', roomAssetId)
          .select(`
            *,
            asset_library (*)
          `)
          .single()

        if (error) throw error

        return new Response(JSON.stringify({ data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      case 'remove': {
        if (!roomAssetId) throw new Error('Room Asset ID required')

        // Get room asset and verify ownership
        const { data: roomAsset, error: roomAssetError } = await supabase
          .from('room_assets')
          .select(`
            *,
            virtual_rooms!inner(user_id)
          `)
          .eq('id', roomAssetId)
          .single()

        if (roomAssetError || !roomAsset) throw new Error('Room asset not found')
        if (roomAsset.virtual_rooms.user_id !== user.id) {
          throw new Error('Not authorized to remove this room asset')
        }

        // Remove asset from room
        const { error } = await supabase
          .from('room_assets')
          .delete()
          .eq('id', roomAssetId)

        if (error) throw error

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      case 'list': {
        if (!roomId) throw new Error('Room ID required')

        // Check room access (public or owned)
        const { data: room, error: roomError } = await supabase
          .from('virtual_rooms')
          .select('is_public, user_id')
          .eq('id', roomId)
          .single()

        if (roomError || !room) throw new Error('Room not found')
        if (!room.is_public && room.user_id !== user.id) {
          throw new Error('Not authorized to view this room')
        }

        // Get all assets in the room
        const { data, error } = await supabase
          .from('room_assets')
          .select(`
            *,
            asset_library (*)
          `)
          .eq('room_id', roomId)
          .order('order_index', { ascending: true })
          .order('created_at', { ascending: true })

        if (error) throw error

        return new Response(JSON.stringify({ data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      case 'bulk_update': {
        if (!roomId || !Array.isArray(assetData)) {
          throw new Error('Room ID and assets array required')
        }

        // Check room ownership
        await checkRoomOwnership(roomId)

        // Update multiple assets in a transaction
        const updates = await Promise.all(
          assetData.map(async (asset) => {
            if (!asset.id) throw new Error('Asset ID required for bulk update')

            const { data, error } = await supabase
              .from('room_assets')
              .update({
                position_x: asset.position_x,
                position_y: asset.position_y,
                position_z: asset.position_z,
                rotation_x: asset.rotation_x,
                rotation_y: asset.rotation_y,
                rotation_z: asset.rotation_z,
                scale_x: asset.scale_x,
                scale_y: asset.scale_y,
                scale_z: asset.scale_z,
                order_index: asset.order_index
              })
              .eq('id', asset.id)
              .eq('room_id', roomId)
              .select()
              .single()

            if (error) throw error
            return data
          })
        )

        return new Response(JSON.stringify({ data: updates }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      default:
        throw new Error('Invalid action')
    }

  } catch (error) {
    console.error('Room assets management error:', error)
    
    const errorResponse = {
      error: {
        code: 'ROOM_ASSETS_ERROR',
        message: error.message
      }
    }

    return new Response(JSON.stringify(errorResponse), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})