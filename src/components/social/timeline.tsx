import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Repeat2, Share, Bookmark, MoreHorizontal, ImageIcon, Smile, Calendar, MapPin } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { socialApi } from '../../lib/api';
import { Post } from '../../lib/supabase';

interface PostWithInteractions extends Post {
  likes_count: number;
  replies_count: number;
  bookmarks_count: number;
  is_liked: boolean;
  is_bookmarked: boolean;
  profiles?: {
    user_id: string;
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
}

const ComposerBox = () => {
  const [postText, setPostText] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const { user, profile } = useAuth();
  const maxChars = 280;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postText.trim() || postText.length > maxChars || !user) return;
    
    setIsPosting(true);
    try {
      await socialApi.createPost(postText);
      setPostText('');
      // Trigger a refresh of the timeline
      window.dispatchEvent(new CustomEvent('refreshTimeline'));
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };
  
  if (!user) {
    return (
      <div className="border-b border-gray-200 dark:border-gray-800 p-4">
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Sign in to share your creative thoughts</p>
          <button className="px-6 py-2 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors">
            Sign In
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="border-b border-gray-200 dark:border-gray-800 p-4">
      <div className="flex space-x-4">
        <img
          src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || user.email || 'User')}&background=6366f1&color=fff`}
          alt="Your avatar"
          className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700"
        />
        <div className="flex-1">
          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder="What's happening in your creative world?"
            className="w-full text-xl placeholder-gray-500 bg-transparent text-gray-900 dark:text-white resize-none border-none outline-none"
            rows={3}
            maxLength={maxChars}
            disabled={isPosting}
          />
          
          {/* Composer Actions */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4">
              <button type="button" className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                <ImageIcon className="w-5 h-5 text-blue-500" />
              </button>
              <button type="button" className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                <Smile className="w-5 h-5 text-blue-500" />
              </button>
              <button type="button" className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                <Calendar className="w-5 h-5 text-blue-500" />
              </button>
              <button type="button" className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                <MapPin className="w-5 h-5 text-blue-500" />
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`text-sm ${
                  postText.length > maxChars * 0.9 
                    ? 'text-red-500' 
                    : postText.length > maxChars * 0.8 
                    ? 'text-yellow-500' 
                    : 'text-gray-500'
                }`}>
                  {maxChars - postText.length}
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center">
                  <div className={`w-6 h-6 rounded-full ${
                    postText.length > maxChars * 0.9 
                      ? 'bg-red-500' 
                      : postText.length > maxChars * 0.8 
                      ? 'bg-yellow-500' 
                      : 'bg-blue-500'
                  }`} style={{
                    transform: `scale(${Math.min(postText.length / maxChars, 1)})`
                  }}></div>
                </div>
              </div>
              <button 
                type="submit"
                disabled={!postText.trim() || postText.length > maxChars || isPosting}
                className="px-6 py-2 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isPosting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

const PostItem = ({ post }: { post: PostWithInteractions }) => {
  const [isLiked, setIsLiked] = useState(post.is_liked);
  const [isBookmarked, setIsBookmarked] = useState(post.is_bookmarked);
  const [likes, setLikes] = useState(post.likes_count);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleLike = async () => {
    if (!user || isLoading) return;
    
    setIsLoading(true);
    try {
      if (isLiked) {
        await socialApi.unlikePost(post.id);
        setLikes(likes - 1);
      } else {
        await socialApi.likePost(post.id);
        setLikes(likes + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookmark = async () => {
    if (!user || isLoading) return;
    
    setIsLoading(true);
    try {
      if (isBookmarked) {
        await socialApi.unbookmarkPost(post.id);
      } else {
        await socialApi.bookmarkPost(post.id);
      }
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d`;
    }
  };

  const profile = post.profiles;
  const displayName = profile?.full_name || profile?.username || 'Anonymous';
  const username = profile?.username || `user${post.user_id.slice(0, 8)}`;
  const avatarUrl = profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`;

  return (
    <article className="border-b border-gray-200 dark:border-gray-800 p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors cursor-pointer">
      <div className="flex space-x-3">
        <img
          src={avatarUrl}
          alt={displayName}
          className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          {/* User Info */}
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-gray-900 dark:text-white truncate">
              {displayName}
            </h3>
            <span className="text-gray-500 dark:text-gray-400 truncate">@{username}</span>
            <span className="text-gray-500 dark:text-gray-400">·</span>
            <span className="text-gray-500 dark:text-gray-400 flex-shrink-0">{timeAgo(post.created_at)}</span>
            <button className="ml-auto p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
              <MoreHorizontal className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          {/* Post Content */}
          <div className="mt-2">
            <p className="text-gray-900 dark:text-white text-base leading-relaxed">
              {post.content}
            </p>
          </div>
          
          {/* Post Actions */}
          <div className="flex items-center justify-between mt-4 max-w-md">
            <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-sm">{post.replies_count}</span>
            </button>
            
            <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-green-50 dark:group-hover:bg-green-900/20 transition-colors">
                <Repeat2 className="w-5 h-5" />
              </div>
              <span className="text-sm">0</span>
            </button>
            
            <button 
              onClick={handleLike}
              disabled={!user || isLoading}
              className={`flex items-center space-x-2 transition-colors group ${
                isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              } ${(!user || isLoading) ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              <div className="p-2 rounded-full group-hover:bg-red-50 dark:group-hover:bg-red-900/20 transition-colors">
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </div>
              <span className="text-sm">{likes}</span>
            </button>
            
            <div className="flex items-center space-x-1">
              <button 
                onClick={handleBookmark}
                disabled={!user || isLoading}
                className={`p-2 rounded-full transition-colors ${
                  isBookmarked 
                    ? 'text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20' 
                    : 'text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                } ${(!user || isLoading) ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
              
              <button className="p-2 rounded-full text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                <Share className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

const Timeline = () => {
  const [posts, setPosts] = useState<PostWithInteractions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const loadPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const postsData = await socialApi.getPosts();
      
      // Transform posts to include interaction counts and states
      const postsWithInteractions: PostWithInteractions[] = await Promise.all(
        postsData.map(async (post) => {
          let isLiked = false;
          let isBookmarked = false;
          
          if (user) {
            try {
              [isLiked, isBookmarked] = await Promise.all([
                socialApi.checkIfUserLikedPost(post.id, user.id),
                socialApi.checkIfUserBookmarkedPost(post.id, user.id)
              ]);
            } catch (error) {
              console.error('Error checking interaction state:', error);
            }
          }
          
          // Get like count
          let likesCount = 0;
          try {
            const likes = await socialApi.getPostLikes(post.id);
            likesCount = likes.length;
          } catch (error) {
            console.error('Error getting likes count:', error);
          }
          
          return {
            ...post,
            likes_count: likesCount,
            replies_count: 0, // TODO: implement replies
            bookmarks_count: 0, // TODO: implement bookmark count
            is_liked: isLiked,
            is_bookmarked: isBookmarked
          };
        })
      );
      
      setPosts(postsWithInteractions);
    } catch (err) {
      console.error('Error loading posts:', err);
      setError('Failed to load posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
    
    // Listen for timeline refresh events
    const handleRefresh = () => {
      loadPosts();
    };
    
    window.addEventListener('refreshTimeline', handleRefresh);
    return () => window.removeEventListener('refreshTimeline', handleRefresh);
  }, [user]);

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="sticky top-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 z-10">
          <div className="px-4 py-3">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Home</h1>
          </div>
        </div>
        <div className="p-8 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={loadPosts}
            className="px-6 py-2 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 z-10">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Home</h1>
        </div>
        
        {/* Timeline Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-800">
          <button className="flex-1 px-4 py-3 text-center font-medium text-gray-900 dark:text-white border-b-2 border-blue-500">
            For you
          </button>
          <button className="flex-1 px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            Following
          </button>
        </div>
      </div>
      
      {/* Composer */}
      <ComposerBox />
      
      {/* Posts Feed */}
      <div>
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Loading posts...</p>
          </div>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <PostItem key={post.id} post={post} />
          ))
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No posts yet. {user ? 'Be the first to share something!' : 'Sign in to see posts from the creative community.'}
            </p>
            {user && (
              <button 
                onClick={() => document.querySelector('textarea')?.focus()}
                className="px-6 py-2 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors"
              >
                Create First Post
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Load More */}
      {posts.length > 0 && !loading && (
        <div className="p-4 text-center">
          <button 
            onClick={loadPosts}
            className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
          >
            Refresh posts
          </button>
        </div>
      )}
    </div>
  );
};

export default Timeline;