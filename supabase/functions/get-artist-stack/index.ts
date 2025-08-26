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
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        // Get user from auth header (optional for anonymous browsing)
        const authHeader = req.headers.get('authorization');
        let userId = null;
        let currentUser = null;
        
        if (authHeader) {
            try {
                const token = authHeader.replace('Bearer ', '');
                
                // Verify token and get user
                const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'apikey': serviceRoleKey
                    }
                });

                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    userId = userData.id;
                    
                    // Get current user's profile for preferences
                    const currentUserResponse = await fetch(`${supabaseUrl}/rest/v1/profiles?user_id=eq.${userId}`, {
                        headers: {
                            'Authorization': `Bearer ${serviceRoleKey}`,
                            'apikey': serviceRoleKey
                        }
                    });

                    if (currentUserResponse.ok) {
                        const currentUserProfiles = await currentUserResponse.json();
                        if (currentUserProfiles.length > 0) {
                            currentUser = currentUserProfiles[0];
                        }
                    }
                }
            } catch (error) {
                console.log('Auth verification failed, proceeding as anonymous:', error.message);
            }
        }

        let swipedArtistIds = [];
        
        // If user is authenticated, get list of already swiped artist IDs
        if (userId) {
            const swipesResponse = await fetch(`${supabaseUrl}/rest/v1/artist_swipes?swiper_id=eq.${userId}&select=artist_id`, {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey
                }
            });

            if (swipesResponse.ok) {
                const swipes = await swipesResponse.json();
                swipedArtistIds = swipes.map(swipe => swipe.artist_id);
            }
        }

        // Build query to get potential artist matches
        let profilesQuery = `${supabaseUrl}/rest/v1/profiles?creator_type=eq.artist`;
        
        // Exclude current user if authenticated
        if (userId) {
            profilesQuery += `&user_id=neq.${userId}`;
        }
        
        // Exclude already swiped profiles if user is authenticated
        if (swipedArtistIds.length > 0) {
            profilesQuery += `&user_id=not.in.(${swipedArtistIds.join(',')})`;
        }
        
        // Get artists ordered by verification status and reputation
        profilesQuery += '&order=is_verified.desc,reputation_score.desc,created_at.desc&limit=20';

        const profilesResponse = await fetch(profilesQuery, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey
            }
        });

        if (!profilesResponse.ok) {
            throw new Error('Failed to get artist profiles');
        }

        let artists = await profilesResponse.json();

        // For each artist, get their content samples (up to 3 recent pieces)
        const artistsWithContent = await Promise.all(artists.map(async (artist) => {
            const contentResponse = await fetch(`${supabaseUrl}/rest/v1/content?creator_id=eq.${artist.user_id}&is_public=eq.true&order=view_count.desc,created_at.desc&limit=3`, {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey
                }
            });

            let content = [];
            if (contentResponse.ok) {
                content = await contentResponse.json();
            }

            return {
                ...artist,
                content_samples: content
            };
        }));

        // For anonymous users, shuffle the artists to provide variety
        if (!userId) {
            for (let i = artistsWithContent.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [artistsWithContent[i], artistsWithContent[j]] = [artistsWithContent[j], artistsWithContent[i]];
            }
        }

        return new Response(JSON.stringify({ 
            data: artistsWithContent,
            isAnonymous: !userId 
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Get artist stack error:', error);

        const errorResponse = {
            error: {
                code: 'GET_ARTIST_STACK_FAILED',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});