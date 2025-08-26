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
    const { limit = 20, lastNotificationId } = await req.json();

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

    // Build query with pagination
    let notificationsQuery = `${supabaseUrl}/rest/v1/notifications?select=*&user_id=eq.${userId}&order=created_at.desc&limit=${limit}`;
    
    if (lastNotificationId) {
      notificationsQuery += `&created_at=lt.(select created_at from notifications where id='${lastNotificationId}')`;
    }

    const notificationsResponse = await fetch(notificationsQuery, {
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey
      }
    });

    if (!notificationsResponse.ok) {
      throw new Error('Failed to fetch notifications');
    }

    const notifications = await notificationsResponse.json();

    // Get related user profiles for notifications
    if (notifications.length > 0) {
      const relatedUserIds = notifications
        .filter(n => n.related_user_id)
        .map(n => n.related_user_id);
      
      if (relatedUserIds.length > 0) {
        const uniqueUserIds = [...new Set(relatedUserIds)];
        const profilesResponse = await fetch(`${supabaseUrl}/rest/v1/profiles?select=id,username,display_name,avatar_url,is_verified&id=in.(${uniqueUserIds.join(',')})`, {
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

          // Enhance notifications with user data
          const enhancedNotifications = notifications.map(notification => {
            const relatedUser = notification.related_user_id ? profileMap[notification.related_user_id] : null;
            return {
              ...notification,
              related_user: relatedUser,
              metadata: notification.metadata ? (typeof notification.metadata === 'string' ? JSON.parse(notification.metadata) : notification.metadata) : {}
            };
          });

          return new Response(JSON.stringify({
            data: {
              notifications: enhancedNotifications,
              hasMore: notifications.length === limit
            }
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      }
    }

    // Return notifications without user enhancement if no related users
    const basicNotifications = notifications.map(notification => ({
      ...notification,
      metadata: notification.metadata ? (typeof notification.metadata === 'string' ? JSON.parse(notification.metadata) : notification.metadata) : {}
    }));

    return new Response(JSON.stringify({
      data: {
        notifications: basicNotifications,
        hasMore: notifications.length === limit
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Get notifications error:', error);

    const errorResponse = {
      error: {
        code: 'GET_NOTIFICATIONS_FAILED',
        message: error.message
      }
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});