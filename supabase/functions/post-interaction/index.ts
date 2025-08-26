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
    const { postId, interactionType, action = 'toggle' } = await req.json();

    if (!postId || !interactionType) {
      throw new Error('Post ID and interaction type are required');
    }

    if (!['like', 'repost', 'bookmark'].includes(interactionType)) {
      throw new Error('Invalid interaction type');
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

    // Check if interaction already exists
    const existingInteractionResponse = await fetch(`${supabaseUrl}/rest/v1/post_interactions?select=id&post_id=eq.${postId}&user_id=eq.${userId}&interaction_type=eq.${interactionType}`, {
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey
      }
    });

    if (!existingInteractionResponse.ok) {
      throw new Error('Failed to check existing interaction');
    }

    const existingInteractions = await existingInteractionResponse.json();
    const hasInteracted = existingInteractions.length > 0;

    let isNowInteracted = false;
    let countChange = 0;

    if (action === 'toggle') {
      if (hasInteracted) {
        // Remove interaction
        await fetch(`${supabaseUrl}/rest/v1/post_interactions?post_id=eq.${postId}&user_id=eq.${userId}&interaction_type=eq.${interactionType}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey
          }
        });
        countChange = -1;
      } else {
        // Add interaction
        const interactionData = {
          post_id: postId,
          user_id: userId,
          interaction_type: interactionType,
          created_at: new Date().toISOString()
        };

        await fetch(`${supabaseUrl}/rest/v1/post_interactions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(interactionData)
        });
        countChange = 1;
        isNowInteracted = true;
      }
    } else if (action === 'add' && !hasInteracted) {
      // Add interaction
      const interactionData = {
        post_id: postId,
        user_id: userId,
        interaction_type: interactionType,
        created_at: new Date().toISOString()
      };

      await fetch(`${supabaseUrl}/rest/v1/post_interactions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(interactionData)
      });
      countChange = 1;
      isNowInteracted = true;
    } else if (action === 'remove' && hasInteracted) {
      // Remove interaction
      await fetch(`${supabaseUrl}/rest/v1/post_interactions?post_id=eq.${postId}&user_id=eq.${userId}&interaction_type=eq.${interactionType}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey
        }
      });
      countChange = -1;
    }

    // Update post counts
    if (countChange !== 0) {
      const countField = `${interactionType}_count`;
      const updateResponse = await fetch(`${supabaseUrl}/rest/v1/posts?id=eq.${postId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          [countField]: `${countField} + ${countChange}`,
          updated_at: new Date().toISOString()
        })
      });

      if (!updateResponse.ok) {
        console.error('Failed to update post counts');
      }

      // Create notification for likes (not for own posts)
      if (interactionType === 'like' && isNowInteracted) {
        const postResponse = await fetch(`${supabaseUrl}/rest/v1/posts?select=user_id&id=eq.${postId}`, {
          headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey
          }
        });

        if (postResponse.ok) {
          const posts = await postResponse.json();
          if (posts.length > 0 && posts[0].user_id !== userId) {
            const notificationData = {
              user_id: posts[0].user_id,
              type: 'like',
              title: 'Someone liked your post',
              content: `@${userData.username || 'Someone'} liked your post`,
              related_post_id: postId,
              related_user_id: userId,
              created_at: new Date().toISOString()
            };

            await fetch(`${supabaseUrl}/rest/v1/notifications`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(notificationData)
            });
          }
        }
      }
    }

    return new Response(JSON.stringify({
      data: {
        success: true,
        interacted: isNowInteracted,
        countChange
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Post interaction error:', error);

    const errorResponse = {
      error: {
        code: 'POST_INTERACTION_FAILED',
        message: error.message
      }
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});