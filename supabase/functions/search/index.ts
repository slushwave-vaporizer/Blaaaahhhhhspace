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
    const { query, searchType = 'all', page = 0, limit = 20 } = await req.json();

    if (!query || query.trim().length === 0) {
      throw new Error('Search query is required');
    }

    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');

    if (!serviceRoleKey || !supabaseUrl) {
      throw new Error('Supabase configuration missing');
    }

    // Get user from auth header for personalized results
    let userId = null;
    const authHeader = req.headers.get('authorization');
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
    const searchTerm = query.trim().toLowerCase();
    
    let results = {
      posts: [],
      users: [],
      hashtags: []
    };

    // Search posts
    if (searchType === 'all' || searchType === 'posts') {
      const postsQuery = `${supabaseUrl}/rest/v1/posts?select=*&visibility=eq.public&or=(content.ilike.*${searchTerm}*,hashtags.cs.{"${searchTerm}"})&order=created_at.desc&limit=${limit}&offset=${offset}`;
      
      const postsResponse = await fetch(postsQuery, {
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey
        }
      });

      if (postsResponse.ok) {
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

            results.posts = posts.map(post => ({
              ...post,
              user: profileMap[post.user_id] || { username: 'unknown', display_name: 'Unknown User' },
              media_urls: typeof post.media_urls === 'string' ? JSON.parse(post.media_urls) : post.media_urls || []
            }));
          }
        }
      }
    }

    // Search users
    if (searchType === 'all' || searchType === 'users') {
      const usersQuery = `${supabaseUrl}/rest/v1/profiles?select=id,username,display_name,bio,avatar_url,is_verified,follower_count,following_count&or=(username.ilike.*${searchTerm}*,display_name.ilike.*${searchTerm}*,bio.ilike.*${searchTerm}*)&limit=${limit}&offset=${offset}`;
      
      const usersResponse = await fetch(usersQuery, {
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey
        }
      });

      if (usersResponse.ok) {
        const users = await usersResponse.json();
        
        // Check if current user follows these users
        if (userId && users.length > 0) {
          const userIds = users.map(u => u.id);
          const followsResponse = await fetch(`${supabaseUrl}/rest/v1/follows?select=following_id&follower_id=eq.${userId}&following_id=in.(${userIds.join(',')})`, {
            headers: {
              'Authorization': `Bearer ${serviceRoleKey}`,
              'apikey': serviceRoleKey
            }
          });

          if (followsResponse.ok) {
            const follows = await followsResponse.json();
            const followingIds = new Set(follows.map(f => f.following_id));
            
            results.users = users.map(user => ({
              ...user,
              is_following: followingIds.has(user.id)
            }));
          }
        } else {
          results.users = users.map(user => ({
            ...user,
            is_following: false
          }));
        }
      }
    }

    // Search hashtags
    if (searchType === 'all' || searchType === 'hashtags') {
      const hashtagsQuery = `${supabaseUrl}/rest/v1/hashtags?select=*&name.ilike.*${searchTerm}*&order=post_count.desc&limit=${limit}&offset=${offset}`;
      
      const hashtagsResponse = await fetch(hashtagsQuery, {
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey
        }
      });

      if (hashtagsResponse.ok) {
        results.hashtags = await hashtagsResponse.json();
      }
    }

    // Save search history if user is logged in
    if (userId) {
      const searchHistoryData = {
        user_id: userId,
        query: searchTerm,
        search_type: searchType,
        result_count: results.posts.length + results.users.length + results.hashtags.length,
        created_at: new Date().toISOString()
      };

      await fetch(`${supabaseUrl}/rest/v1/search_history`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(searchHistoryData)
      });
    }

    return new Response(JSON.stringify({
      data: {
        query: searchTerm,
        searchType,
        results,
        hasMore: Object.values(results).some(arr => arr.length === limit),
        page
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Search error:', error);

    const errorResponse = {
      error: {
        code: 'SEARCH_FAILED',
        message: error.message
      }
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});