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
    const { content, mediaFiles, postType = 'post', replyToId, quotedPostId, visibility = 'public', location, pollData } = await req.json();

    if (!content || content.trim().length === 0) {
      throw new Error('Post content is required');
    }

    if (content.length > 280) {
      throw new Error('Post content must be 280 characters or less');
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

    // Extract hashtags and mentions
    const hashtags = content.match(/#[\w\u00c0-\u017f]+/g)?.map(tag => tag.slice(1).toLowerCase()) || [];
    const mentions = content.match(/@[\w\u00c0-\u017f]+/g)?.map(mention => mention.slice(1).toLowerCase()) || [];

    // Handle media uploads if any
    let mediaUrls = [];
    if (mediaFiles && mediaFiles.length > 0) {
      for (const media of mediaFiles) {
        if (media.data && media.fileName) {
          const base64Data = media.data.split(',')[1];
          const mimeType = media.data.split(';')[0].split(':')[1];
          const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
          
          const fileName = `posts/${userId}/${Date.now()}-${media.fileName}`;
          const uploadResponse = await fetch(`${supabaseUrl}/storage/v1/object/post-media/${fileName}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${serviceRoleKey}`,
              'Content-Type': mimeType,
              'x-upsert': 'true'
            },
            body: binaryData
          });

          if (uploadResponse.ok) {
            const publicUrl = `${supabaseUrl}/storage/v1/object/public/post-media/${fileName}`;
            mediaUrls.push(publicUrl);
          }
        }
      }
    }

    // Create the post
    const postData = {
      user_id: userId,
      content: content.trim(),
      post_type: postType,
      reply_to_id: replyToId || null,
      quoted_post_id: quotedPostId || null,
      media_urls: JSON.stringify(mediaUrls),
      hashtags,
      mentions,
      visibility,
      location: location || null,
      poll_data: pollData ? JSON.stringify(pollData) : null,
      created_at: new Date().toISOString()
    };

    const insertResponse = await fetch(`${supabaseUrl}/rest/v1/posts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(postData)
    });

    if (!insertResponse.ok) {
      const errorText = await insertResponse.text();
      throw new Error(`Failed to create post: ${errorText}`);
    }

    const post = await insertResponse.json();

    // Update hashtag statistics
    if (hashtags.length > 0) {
      for (const hashtag of hashtags) {
        const hashtagData = {
          name: hashtag,
          post_count: 1,
          trending_score: 1,
          last_used_at: new Date().toISOString()
        };

        await fetch(`${supabaseUrl}/rest/v1/hashtags`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify(hashtagData)
        });
      }
    }

    // Create notifications for mentions
    if (mentions.length > 0) {
      const mentionUsers = await fetch(`${supabaseUrl}/rest/v1/profiles?select=id,username&username=in.(${mentions.join(',')})`, {
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey
        }
      });

      if (mentionUsers.ok) {
        const users = await mentionUsers.json();
        const notifications = users.map(user => ({
          user_id: user.id,
          type: 'mention',
          title: 'You were mentioned in a post',
          content: `@${userData.username || 'Someone'} mentioned you in a post`,
          related_post_id: post[0].id,
          related_user_id: userId,
          created_at: new Date().toISOString()
        }));

        await fetch(`${supabaseUrl}/rest/v1/notifications`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(notifications)
        });
      }
    }

    return new Response(JSON.stringify({
      data: {
        post: post[0],
        success: true
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Create post error:', error);

    const errorResponse = {
      error: {
        code: 'POST_CREATION_FAILED',
        message: error.message
      }
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});