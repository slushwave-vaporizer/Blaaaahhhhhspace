// YourSpace Creative Labs - Social Media Types
export interface SocialUser {
  id: string;
  username: string;
  display_name: string;
  bio?: string;
  avatar_url?: string;
  banner_image?: string;
  followers: number;
  following: number;
  posts: number;
  is_verified: boolean;
  location?: string;
  website?: string;
  created_at: string;
  is_online?: boolean;
  is_following?: boolean;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  post_type: 'post' | 'reply' | 'repost' | 'quote';
  reply_to_id?: string;
  quoted_post_id?: string;
  media_urls: string[];
  hashtags: string[];
  mentions: string[];
  like_count: number;
  repost_count: number;
  reply_count: number;
  bookmark_count: number;
  view_count: number;
  is_pinned: boolean;
  visibility: 'public' | 'followers' | 'private';
  location?: string;
  poll_data?: Poll;
  created_at: string;
  updated_at: string;
  
  // Enhanced fields from API
  user?: SocialUser;
  is_liked?: boolean;
  is_reposted?: boolean;
  is_bookmarked?: boolean;
  quoted_post?: Post;
  reply_to?: Post;
}

export interface Poll {
  id: string;
  options: PollOption[];
  total_votes: number;
  ends_at: string;
  voted: boolean;
  user_vote?: number;
}

export interface PollOption {
  text: string;
  votes: number;
}

export interface DirectMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  message_type: 'text' | 'image' | 'video' | 'audio' | 'file';
  media_url?: string;
  reply_to_id?: string;
  is_read: boolean;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
  
  // Enhanced fields
  sender?: SocialUser;
  recipient?: SocialUser;
}

export interface Conversation {
  id: string;
  participants: string[];
  last_message_id?: string;
  last_message_at: string;
  is_group: boolean;
  group_name?: string;
  group_avatar_url?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  
  // Enhanced fields
  last_message?: DirectMessage;
  other_participant?: SocialUser;
  unread_count?: number;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'like' | 'repost' | 'follow' | 'mention' | 'reply' | 'quote' | 'message';
  title: string;
  content?: string;
  related_post_id?: string;
  related_user_id?: string;
  related_conversation_id?: string;
  metadata: Record<string, any>;
  is_read: boolean;
  created_at: string;
  
  // Enhanced fields
  related_user?: SocialUser;
  related_post?: Post;
}

export interface Hashtag {
  id: string;
  name: string;
  post_count: number;
  trending_score: number;
  first_used_at: string;
  last_used_at: string;
  created_at: string;
}

export interface TrendingTopic {
  id: string;
  user_id: string;
  topic: string;
  category?: string;
  description?: string;
  post_count: number;
  engagement_score: number;
  location?: string;
  created_at: string;
}

export interface SearchResult {
  posts: Post[];
  users: SocialUser[];
  hashtags: Hashtag[];
}

export interface PostFormData {
  content: string;
  mediaFiles: File[];
  postType: 'post' | 'reply' | 'quote';
  replyToId?: string;
  quotedPostId?: string;
  visibility: 'public' | 'followers' | 'private';
  location?: string;
  poll?: {
    options: string[];
    duration: number; // hours
  };
}

export interface TimelineFeedParams {
  page: number;
  limit: number;
  feedType: 'home' | 'following' | 'explore' | 'trending';
}

export interface SearchParams {
  query: string;
  searchType: 'all' | 'posts' | 'users' | 'hashtags';
  page: number;
  limit: number;
}

export interface PostInteractionParams {
  postId: string;
  interactionType: 'like' | 'repost' | 'bookmark';
  action: 'toggle' | 'add' | 'remove';
}

export interface MessageParams {
  recipientId: string;
  content: string;
  messageType?: 'text' | 'image' | 'video' | 'audio' | 'file';
  mediaUrl?: string;
  replyToId?: string;
  conversationId?: string;
}