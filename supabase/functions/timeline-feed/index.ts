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
    const { page = 0, limit = 20, feedType = 'home' } = await req.json();

    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');

    if (!serviceRoleKey || !supabaseUrl) {
      throw new Error('Supabase configuration missing');
    }

    // Get user from auth header
    const authHeader = req.headers.get('authorization');
    let userId = null;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'apikey': serviceRoleKey
        }
      });
      
      if (userResponse.ok) {
        const userData = await userResponse.json();
        userId = userData.id;
      }
    }

    const offset = page * limit;
    
    // Get posts based on feed type
    let postsQuery = `${supabaseUrl}/rest/v1/posts?select=*&visibility=eq.public&order=created_at.desc&limit=${limit}&offset=${offset}`;
    
    if (feedType === 'home' && userId) {
      // Get posts from followed users
      const followsResponse = await fetch(`${supabaseUrl}/rest/v1/follows?select=following_id&follower_id=eq.${userId}`, {
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey
        }
      });
      
      if (followsResponse.ok) {
        const follows = await followsResponse.json();
        const followedUserIds = follows.map(f => f.following_id);
        followedUserIds.push(userId); // Include user's own posts
        
        postsQuery = `${supabaseUrl}/rest/v1/posts?select=*&user_id=in.(${followedUserIds.join(',')})&visibility=eq.public&order=created_at.desc&limit=${limit}&offset=${offset}`;
      }
    }

    const postsResponse = await fetch(postsQuery, {
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey
      }
    });

    if (!postsResponse.ok) {
      throw new Error('Failed to fetch posts');
    }

    const posts = await postsResponse.json();

    // Get user profiles for posts
    if (posts.length > 0) {
      const userIds = [...new Set(posts.map(p => p.user_id))];
      const profilesResponse = await fetch(`${supabaseUrl}/rest/v1/profiles?select=id,username,display_name,avatar_url,is_verified&id=in.(${userIds.join(',')})`, {
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey
        }
      });

      if (profilesResponse.ok) {
        const profiles = await profilesResponse.json();
        const profileMap = profiles.reduce((acc, profile) => {
          acc[profile.id] = profile;
          return acc;
        }, {});

        // Get user interactions if logged in
        let userInteractions = {};
        if (userId) {
          const interactionsResponse = await fetch(`${supabaseUrl}/rest/v1/post_interactions?select=post_id,interaction_type&user_id=eq.${userId}&post_id=in.(${posts.map(p => p.id).join(',')})`, {
            headers: {
              'Authorization': `Bearer ${serviceRoleKey}`,
              'apikey': serviceRoleKey
            }
          });

          if (interactionsResponse.ok) {
            const interactions = await interactionsResponse.json();
            userInteractions = interactions.reduce((acc, interaction) => {
              if (!acc[interaction.post_id]) acc[interaction.post_id] = {};
              acc[interaction.post_id][interaction.interaction_type] = true;
              return acc;
            }, {});
          }
        }

        // Enhance posts with user data and interaction status
        const enhancedPosts = posts.map(post => ({
          ...post,
          user: profileMap[post.user_id] || { username: 'unknown', display_name: 'Unknown User' },
          is_liked: userInteractions[post.id]?.like || false,
          is_reposted: userInteractions[post.id]?.repost || false,
          is_bookmarked: userInteractions[post.id]?.bookmark || false,
          media_urls: typeof post.media_urls === 'string' ? JSON.parse(post.media_urls) : post.media_urls || [],
          poll_data: post.poll_data ? (typeof post.poll_data === 'string' ? JSON.parse(post.poll_data) : post.poll_data) : null
        }));

        return new Response(JSON.stringify({
          data: {
            posts: enhancedPosts,
            hasMore: posts.length === limit,
            page
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response(JSON.stringify({
      data: {
        posts: [],
        hasMore: false,
        page
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Timeline feed error:', error);

    const errorResponse = {
      error: {
        code: 'TIMELINE_FEED_FAILED',
        message: error.message
      }
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});