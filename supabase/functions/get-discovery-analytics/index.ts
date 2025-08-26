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

        // Get user's discovery analytics
        const analyticsResponse = await fetch(`${supabaseUrl}/rest/v1/discovery_analytics?user_id=eq.${userId}`, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey
            }
        });

        let analytics = {
            total_swipes: 0,
            likes_given: 0,
            artists_discovered: 0,
            last_swipe_at: null
        };

        if (analyticsResponse.ok) {
            const analyticsData = await analyticsResponse.json();
            if (analyticsData.length > 0) {
                analytics = analyticsData[0];
            }
        }

        // Get user's preferences breakdown
        const preferencesResponse = await fetch(`${supabaseUrl}/rest/v1/artist_preferences?user_id=eq.${userId}`, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey
            }
        });

        let preferences = [];
        if (preferencesResponse.ok) {
            preferences = await preferencesResponse.json();
        }

        // Group preferences by type for analysis
        const preferencesByType = preferences.reduce((acc, pref) => {
            if (!acc[pref.preference_type]) {
                acc[pref.preference_type] = [];
            }
            acc[pref.preference_type].push(pref);
            return acc;
        }, {});

        // Get recent swipes for activity timeline
        const recentSwipesResponse = await fetch(`${supabaseUrl}/rest/v1/artist_swipes?swiper_id=eq.${userId}&order=created_at.desc&limit=10`, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey
            }
        });

        let recentSwipes = [];
        if (recentSwipesResponse.ok) {
            const swipesData = await recentSwipesResponse.json();
            
            // For each swipe, get the artist info
            recentSwipes = await Promise.all(swipesData.map(async (swipe) => {
                const artistResponse = await fetch(`${supabaseUrl}/rest/v1/profiles?user_id=eq.${swipe.artist_id}`, {
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey
                    }
                });

                let artistInfo = { username: 'Unknown Artist' };
                if (artistResponse.ok) {
                    const artists = await artistResponse.json();
                    if (artists.length > 0) {
                        artistInfo = artists[0];
                    }
                }

                return {
                    ...swipe,
                    artist_info: artistInfo
                };
            }));
        }

        // Calculate engagement rate and discovery score
        const engagementRate = analytics.total_swipes > 0 ? (analytics.likes_given / analytics.total_swipes) * 100 : 0;
        const discoveryScore = analytics.likes_given * 10 + analytics.total_swipes * 2;

        return new Response(JSON.stringify({
            data: {
                analytics: {
                    ...analytics,
                    engagement_rate: Math.round(engagementRate * 100) / 100,
                    discovery_score: discoveryScore
                },
                preferences_by_type: preferencesByType,
                recent_activity: recentSwipes,
                summary: {
                    total_artists_seen: analytics.total_swipes,
                    artists_liked: analytics.likes_given,
                    artists_passed: analytics.total_swipes - analytics.likes_given,
                    engagement_rate: `${Math.round(engagementRate)}%`
                }
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Get discovery analytics error:', error);

        const errorResponse = {
            error: {
                code: 'GET_DISCOVERY_ANALYTICS_FAILED',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});