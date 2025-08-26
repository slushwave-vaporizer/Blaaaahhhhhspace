// YourSpace Creative Labs - Social Media API Hooks
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Post,
  SocialUser,
  DirectMessage,
  Conversation,
  Notification,
  PostFormData,
  TimelineFeedParams,
  SearchParams,
  PostInteractionParams,
  MessageParams,
  SearchResult
} from '@/types/social';

export function useSocial() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create Post
  const createPost = async (postData: PostFormData): Promise<Post> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.functions.invoke('create-post', {
        body: postData
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error.message);

      return data.data.post;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get Timeline Feed
  const getTimelineFeed = async (params: TimelineFeedParams): Promise<{ posts: Post[], hasMore: boolean, page: number }> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.functions.invoke('timeline-feed', {
        body: params
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error.message);

      return data.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Post Interaction (Like, Repost, Bookmark)
  const postInteraction = async (params: PostInteractionParams): Promise<{ success: boolean, interacted: boolean, countChange: number }> => {
    try {
      setError(null);

      const { data, error } = await supabase.functions.invoke('post-interaction', {
        body: params
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error.message);

      return data.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Send Direct Message
  const sendMessage = async (params: MessageParams): Promise<{ message: DirectMessage, conversationId: string }> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.functions.invoke('send-message', {
        body: params
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error.message);

      return data.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get Notifications
  const getNotifications = async (limit: number = 20, lastNotificationId?: string): Promise<{ notifications: Notification[], hasMore: boolean }> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.functions.invoke('get-notifications', {
        body: { limit, lastNotificationId }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error.message);

      return data.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Search
  const search = async (params: SearchParams): Promise<SearchResult & { hasMore: boolean, page: number }> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.functions.invoke('search', {
        body: params
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error.message);

      return {
        posts: data.data.results.posts,
        users: data.data.results.users,
        hashtags: data.data.results.hashtags,
        hasMore: data.data.hasMore,
        page: data.data.page
      };
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Follow/Unfollow User
  const followUser = async (userId: string): Promise<{ success: boolean, isFollowing: boolean }> => {
    try {
      setError(null);

      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) throw new Error('Not authenticated');

      // Check if already following
      const { data: existingFollow } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', currentUser.user.id)
        .eq('following_id', userId)
        .maybeSingle();

      if (existingFollow) {
        // Unfollow
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', currentUser.user.id)
          .eq('following_id', userId);

        if (error) throw error;

        // Update follower counts
        await supabase.rpc('update_follower_counts', {
          user_id: userId,
          follower_id: currentUser.user.id,
          is_following: false
        });

        return { success: true, isFollowing: false };
      } else {
        // Follow
        const { error } = await supabase
          .from('follows')
          .insert({
            follower_id: currentUser.user.id,
            following_id: userId
          });

        if (error) throw error;

        // Update follower counts
        await supabase.rpc('update_follower_counts', {
          user_id: userId,
          follower_id: currentUser.user.id,
          is_following: true
        });

        return { success: true, isFollowing: true };
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Get User Profile
  const getUserProfile = async (username: string): Promise<SocialUser | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .maybeSingle();

      if (error) throw error;

      return data ? {
        id: data.id,
        username: data.username,
        display_name: data.display_name || data.username,
        bio: data.bio,
        avatar_url: data.avatar_url,
        banner_image: data.background_image_url,
        followers: data.follower_count || 0,
        following: data.following_count || 0,
        posts: 0, // TODO: Count posts
        is_verified: data.is_verified || false,
        location: data.bio, // Placeholder
        website: '', // Placeholder
        created_at: data.created_at,
        is_online: false, // Placeholder
        is_following: false // Will be determined by caller
      } : null;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createPost,
    getTimelineFeed,
    postInteraction,
    sendMessage,
    getNotifications,
    search,
    followUser,
    getUserProfile
  };
}

// Hook for real-time updates
export function useSocialRealtime() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [messages, setMessages] = useState<DirectMessage[]>([]);

  useEffect(() => {
    const { data: currentUser } = supabase.auth.getUser();
    
    if (!currentUser) return;

    // Subscribe to new posts
    const postsSubscription = supabase
      .channel('posts')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'posts',
        filter: `visibility=eq.public`
      }, (payload) => {
        const newPost = payload.new as Post;
        setPosts(prev => [newPost, ...prev]);
      })
      .subscribe();

    // Subscribe to notifications for current user
    const notificationsSubscription = supabase
      .channel('user-notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${currentUser}`
      }, (payload) => {
        const newNotification = payload.new as Notification;
        setNotifications(prev => [newNotification, ...prev]);
      })
      .subscribe();

    // Subscribe to direct messages for current user
    const messagesSubscription = supabase
      .channel('user-messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'direct_messages',
        filter: `recipient_id=eq.${currentUser}`
      }, (payload) => {
        const newMessage = payload.new as DirectMessage;
        setMessages(prev => [newMessage, ...prev]);
      })
      .subscribe();

    return () => {
      postsSubscription.unsubscribe();
      notificationsSubscription.unsubscribe();
      messagesSubscription.unsubscribe();
    };
  }, []);

  return {
    posts,
    notifications,
    messages,
    setPosts,
    setNotifications,
    setMessages
  };
}