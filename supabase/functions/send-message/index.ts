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
    const { recipientId, content, messageType = 'text', mediaUrl, replyToId, conversationId } = await req.json();

    if (!recipientId || !content || content.trim().length === 0) {
      throw new Error('Recipient ID and content are required');
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

    // Find or create conversation
    let finalConversationId = conversationId;
    
    if (!finalConversationId) {
      // Look for existing conversation between these two users
      const existingConversationResponse = await fetch(`${supabaseUrl}/rest/v1/conversations?select=id&participants=cs.[\"${userId}\",\"${recipientId}\"]&is_group=eq.false`, {
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey
        }
      });

      if (existingConversationResponse.ok) {
        const conversations = await existingConversationResponse.json();
        if (conversations.length > 0) {
          finalConversationId = conversations[0].id;
        }
      }

      // Create new conversation if none exists
      if (!finalConversationId) {
        const newConversationData = {
          participants: [userId, recipientId],
          is_group: false,
          created_by: userId,
          created_at: new Date().toISOString()
        };

        const conversationResponse = await fetch(`${supabaseUrl}/rest/v1/conversations`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(newConversationData)
        });

        if (!conversationResponse.ok) {
          throw new Error('Failed to create conversation');
        }

        const newConversation = await conversationResponse.json();
        finalConversationId = newConversation[0].id;
      }
    }

    // Create the message
    const messageData = {
      conversation_id: finalConversationId,
      sender_id: userId,
      recipient_id: recipientId,
      content: content.trim(),
      message_type: messageType,
      media_url: mediaUrl || null,
      reply_to_id: replyToId || null,
      created_at: new Date().toISOString()
    };

    const messageResponse = await fetch(`${supabaseUrl}/rest/v1/direct_messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(messageData)
    });

    if (!messageResponse.ok) {
      const errorText = await messageResponse.text();
      throw new Error(`Failed to create message: ${errorText}`);
    }

    const message = await messageResponse.json();

    // Update conversation with last message info
    const updateConversationResponse = await fetch(`${supabaseUrl}/rest/v1/conversations?id=eq.${finalConversationId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        last_message_id: message[0].id,
        last_message_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    });

    if (!updateConversationResponse.ok) {
      console.error('Failed to update conversation');
    }

    // Create notification for recipient
    const notificationData = {
      user_id: recipientId,
      type: 'message',
      title: 'New direct message',
      content: `@${userData.username || 'Someone'} sent you a message`,
      related_conversation_id: finalConversationId,
      related_user_id: userId,
      metadata: JSON.stringify({ messagePreview: content.slice(0, 100) }),
      created_at: new Date().toISOString()
    };

    const notificationResponse = await fetch(`${supabaseUrl}/rest/v1/notifications`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(notificationData)
    });

    if (!notificationResponse.ok) {
      console.error('Failed to create notification');
    }

    return new Response(JSON.stringify({
      data: {
        message: message[0],
        conversationId: finalConversationId,
        success: true
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Send message error:', error);

    const errorResponse = {
      error: {
        code: 'SEND_MESSAGE_FAILED',
        message: error.message
      }
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});