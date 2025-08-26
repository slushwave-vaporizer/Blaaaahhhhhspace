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
        const { artist_id, liked } = await req.json();

        if (!artist_id || typeof liked !== 'boolean') {
            throw new Error('artist_id and liked (boolean) are required');
        }

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
        const swiper_id = userData.id;

        // Check if user already swiped on this artist
        const existingSwipeResponse = await fetch(`${supabaseUrl}/rest/v1/artist_swipes?swiper_id=eq.${swiper_id}&artist_id=eq.${artist_id}`, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey
            }
        });

        if (!existingSwipeResponse.ok) {
            throw new Error('Failed to check existing swipe');
        }

        const existingSwipes = await existingSwipeResponse.json();
        if (existingSwipes.length > 0) {
            throw new Error('Already swiped on this artist');
        }

        // Record the swipe
        const swipeResponse = await fetch(`${supabaseUrl}/rest/v1/artist_swipes`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                swiper_id,
                artist_id,
                liked
            })
        });

        if (!swipeResponse.ok) {
            const errorText = await swipeResponse.text();
            throw new Error(`Failed to record swipe: ${errorText}`);
        }

        // Update discovery analytics
        const analyticsResponse = await fetch(`${supabaseUrl}/rest/v1/discovery_analytics?user_id=eq.${swiper_id}`, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey
            }
        });

        let analyticsExists = false;
        let currentAnalytics = {
            total_swipes: 0,
            likes_given: 0,
            artists_discovered: 0
        };

        if (analyticsResponse.ok) {
            const analytics = await analyticsResponse.json();
            if (analytics.length > 0) {
                analyticsExists = true;
                currentAnalytics = analytics[0];
            }
        }

        const updatedAnalytics = {
            total_swipes: currentAnalytics.total_swipes + 1,
            likes_given: currentAnalytics.likes_given + (liked ? 1 : 0),
            artists_discovered: currentAnalytics.artists_discovered + (liked ? 1 : 0),
            last_swipe_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        if (analyticsExists) {
            // Update existing analytics
            await fetch(`${supabaseUrl}/rest/v1/discovery_analytics?user_id=eq.${swiper_id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedAnalytics)
            });
        } else {
            // Create new analytics record
            await fetch(`${supabaseUrl}/rest/v1/discovery_analytics`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: swiper_id,
                    ...updatedAnalytics
                })
            });
        }

        // If it's a like, create artist preferences based on artist's content and profile
        if (liked) {
            // Get artist profile and content for preference analysis
            const artistResponse = await fetch(`${supabaseUrl}/rest/v1/profiles?user_id=eq.${artist_id}`, {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey
                }
            });

            if (artistResponse.ok) {
                const artists = await artistResponse.json();
                if (artists.length > 0) {
                    const artist = artists[0];
                    
                    // Create preferences based on artist attributes
                    const preferences = [];

                    if (artist.creator_type) {
                        preferences.push({
                            user_id: swiper_id,
                            preference_type: 'creator_type',
                            preference_value: artist.creator_type,
                            weight: 1.0
                        });
                    }

                    if (artist.theme) {
                        preferences.push({
                            user_id: swiper_id,
                            preference_type: 'theme',
                            preference_value: artist.theme,
                            weight: 0.5
                        });
                    }

                    // Insert preferences (or update weights if they exist)
                    for (const preference of preferences) {
                        await fetch(`${supabaseUrl}/rest/v1/artist_preferences`, {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${serviceRoleKey}`,
                                'apikey': serviceRoleKey,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(preference)
                        });
                    }
                }
            }
        }

        // Check if this creates a mutual follow (if the artist follows this user)
        let mutualFollow = false;
        if (liked) {
            const followResponse = await fetch(`${supabaseUrl}/rest/v1/follows?follower_id=eq.${artist_id}&following_id=eq.${swiper_id}`, {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey
                }
            });

            if (followResponse.ok) {
                const follows = await followResponse.json();
                if (follows.length > 0) {
                    mutualFollow = true;
                    
                    // Auto-follow the artist back for mutual connection
                    await fetch(`${supabaseUrl}/rest/v1/follows`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${serviceRoleKey}`,
                            'apikey': serviceRoleKey,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            follower_id: swiper_id,
                            following_id: artist_id
                        })
                    });
                }
            }
        }

        return new Response(JSON.stringify({ 
            data: { 
                swipe_recorded: true, 
                is_mutual_follow: mutualFollow,
                analytics: updatedAnalytics
            } 
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Handle artist swipe error:', error);

        const errorResponse = {
            error: {
                code: 'HANDLE_ARTIST_SWIPE_FAILED',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});