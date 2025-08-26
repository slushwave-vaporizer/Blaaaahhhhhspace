// YourSpace Creative Labs - Initialize Room Objects Edge Function (Fixed)
Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        // Get environment variables
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        
        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        // Get user from auth header
        const authHeader = req.headers.get('authorization');
        if (!authHeader) {
            throw new Error('No authorization header');
        }

        const token = authHeader.replace('Bearer ', '');

        // Verify token and get user
        const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'apikey': serviceRoleKey
            }
        });

        if (!userResponse.ok) {
            throw new Error('Invalid token');
        }

        const userData = await userResponse.json();
        const userId = userData.id;

        // Check if user already has room objects
        const checkResponse = await fetch(`${supabaseUrl}/rest/v1/epk_room_objects?user_id=eq.${userId}&limit=1`, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey
            }
        });

        if (checkResponse.ok) {
            const existingObjects = await checkResponse.json();
            if (existingObjects.length > 0) {
                return new Response(JSON.stringify({
                    data: {
                        success: true,
                        message: 'Room objects already exist',
                        objects_created: 0
                    }
                }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }
        }

        // Create default room objects
        const defaultObjects = [
            {
                user_id: userId,
                room_id: 'virtual_room',
                object_type: 'epk_computer',
                position_x: 0.3,
                position_y: 0.7,
                is_active: true
            },
            {
                user_id: userId,
                room_id: 'virtual_room',
                object_type: 'camera',
                position_x: 0.7,
                position_y: 0.3,
                is_active: true
            },
            {
                user_id: userId,
                room_id: 'virtual_room',
                object_type: 'discord_integration',
                position_x: 0.5,
                position_y: 0.5,
                is_active: true
            }
        ];

        // Insert default objects
        const insertResponse = await fetch(`${supabaseUrl}/rest/v1/epk_room_objects`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(defaultObjects)
        });

        if (!insertResponse.ok) {
            const errorText = await insertResponse.text();
            throw new Error(`Failed to create room objects: ${errorText}`);
        }

        const createdObjects = await insertResponse.json();

        return new Response(JSON.stringify({
            data: {
                success: true,
                objects_created: defaultObjects.length,
                message: 'Room objects created successfully',
                objects: createdObjects
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        console.error('Error in initialize-room-objects function:', error);
        
        return new Response(JSON.stringify({
            error: {
                code: 'ROOM_OBJECTS_INIT_FAILED',
                message: error.message
            }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});