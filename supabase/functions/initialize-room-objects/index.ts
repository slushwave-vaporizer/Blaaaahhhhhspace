// YourSpace Creative Labs - Initialize Room Objects Edge Function
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'false'
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Extract user_id from request
    const { user_id } = await req.json()
    
    if (!user_id) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'User ID is required' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check if user already has room objects
    const { data: existingObjects, error: checkError } = await supabase
      .from('epk_room_objects')
      .select('id')
      .eq('user_id', user_id)
      .limit(1)
    
    if (checkError) {
      console.error('Error checking existing objects:', checkError)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to check existing objects' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // If user already has objects, return success
    if (existingObjects && existingObjects.length > 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Room objects already exist',
          objects_created: 0
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create default room objects
    const defaultObjects = [
      {
        user_id: user_id,
        room_id: 'virtual_room',
        object_type: 'epk_computer',
        position_x: 0.3,
        position_y: 0.7,
        is_active: true
      },
      {
        user_id: user_id,
        room_id: 'virtual_room',
        object_type: 'camera',
        position_x: 0.7,
        position_y: 0.3,
        is_active: true
      },
      {
        user_id: user_id,
        room_id: 'virtual_room',
        object_type: 'discord_integration',
        position_x: 0.5,
        position_y: 0.5,
        is_active: true
      }
    ]

    // Insert default objects
    const { data, error } = await supabase
      .from('epk_room_objects')
      .insert(defaultObjects)
      .select('id')
    
    if (error) {
      console.error('Error creating room objects:', error)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to create room objects' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        objects_created: defaultObjects.length,
        message: 'Room objects created successfully'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
    
  } catch (error) {
    console.error('Error in initialize-room-objects function:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
