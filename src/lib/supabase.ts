import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ilqcgqzyodflstmuakgf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlscWNncXp5b2RmbHN0bXVha2dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyMzM5NTUsImV4cCI6MjA3MDgwOTk1NX0.5sTbrruiNHTOmEfbT9pASGt6tLfi2QHnMhTsmBfPwMw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types (based on our migration)
export interface Profile {
  id: string;
  username: string | null;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  background_image_url: string | null;
  background_video_url: string | null;
  theme: string | null;
  custom_css: string | null;
  creator_type: string | null;
  is_verified: boolean | null;
  is_premium: boolean | null;
  profile_views: number | null;
  follower_count: number | null;
  following_count: number | null;
  total_earnings: number | null;
  reputation_score: number | null;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  content: string;
  user_id: string;
  post_type: string | null;
  reply_to_id: string | null;
  quoted_post_id: string | null;
  media_urls: any | null;
  hashtags: string[] | null;
  mentions: string[] | null;
  like_count: number | null;
  repost_count: number | null;
  reply_count: number | null;
  bookmark_count: number | null;
  view_count: number | null;
  is_pinned: boolean | null;
  visibility: string | null;
  location: string | null;
  poll_data: any | null;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
}

export interface Hashtag {
  id: string;
  name: string;
  created_at: string;
}

export interface PostHashtag {
  post_id: string;
  hashtag_id: string;
}

export interface Like {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
}

export interface Follow {
  id: string;
  follower_id: string;
  followed_id: string;
  created_at: string;
}