// YourSpace Creative Labs - Initialize User Profile Edge Function
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
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        
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
        const userEmail = userData.email;

        // Extract profile data from request
        const requestData = await req.json();
        const { username, displayName, bio } = requestData;

        // Generate username if not provided
        const finalUsername = username || userEmail.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');

        // Check if profile already exists
        const existingProfileResponse = await fetch(`${supabaseUrl}/rest/v1/profiles?user_id=eq.${userId}`, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey
            }
        });

        if (existingProfileResponse.ok) {
            const existingProfiles = await existingProfileResponse.json();
            if (existingProfiles.length > 0) {
                return new Response(JSON.stringify({
                    data: {
                        profile: existingProfiles[0],
                        message: 'Profile already exists'
                    }
                }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }
        }

        // Create new profile
        const profileData = {
            user_id: userId,
            username: finalUsername,
            display_name: displayName || finalUsername,
            bio: bio || '',
            theme: 'neon-city',
            creator_type: 'artist',
            is_verified: false,
            is_premium: false,
            profile_views: 0,
            follower_count: 0,
            following_count: 0,
            total_earnings: 0,
            reputation_score: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        const createProfileResponse = await fetch(`${supabaseUrl}/rest/v1/profiles`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(profileData)
        });

        if (!createProfileResponse.ok) {
            const errorText = await createProfileResponse.text();
            throw new Error(`Profile creation failed: ${errorText}`);
        }

        const profile = await createProfileResponse.json();

        return new Response(JSON.stringify({
            data: {
                profile: profile[0],
                success: true,
                message: 'Profile created successfully'
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Profile initialization error:', error);

        const errorResponse = {
            error: {
                code: 'PROFILE_INIT_FAILED',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});