// YourSpace Creative Labs - Post Card Component
import React, { useState } from 'react';
import { Heart, MessageCircle, Repeat, Share, Bookmark, MoreHorizontal, Eye, MapPin } from 'lucide-react';
import { Post, SocialUser } from '@/types/social';
import { useSocial } from '@/hooks/useSocial';
import { formatRelativeTime } from '@/utils/helpers';
import { toast } from 'react-hot-toast';

interface PostCardProps {
  post: Post;
  showActions?: boolean;
  onReply?: (post: Post) => void;
  onQuote?: (post: Post) => void;
  className?: string;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  showActions = true,
  onReply,
  onQuote,
  className = ''
}) => {
  const [isLiked, setIsLiked] = useState(post.is_liked || false);
  const [isReposted, setIsReposted] = useState(post.is_reposted || false);
  const [isBookmarked, setIsBookmarked] = useState(post.is_bookmarked || false);
  const [likeCount, setLikeCount] = useState(post.like_count);
  const [repostCount, setRepostCount] = useState(post.repost_count);
  const [bookmarkCount, setBookmarkCount] = useState(post.bookmark_count);
  
  const { postInteraction } = useSocial();
  
  const handleInteraction = async (type: 'like' | 'repost' | 'bookmark') => {
    try {
      const result = await postInteraction({
        postId: post.id,
        interactionType: type,
        action: 'toggle'
      });
      
      if (type === 'like') {
        setIsLiked(result.interacted);
        setLikeCount(prev => prev + result.countChange);
      } else if (type === 'repost') {
        setIsReposted(result.interacted);
        setRepostCount(prev => prev + result.countChange);
      } else if (type === 'bookmark') {
        setIsBookmarked(result.interacted);
        setBookmarkCount(prev => prev + result.countChange);
        toast.success(result.interacted ? 'Added to bookmarks' : 'Removed from bookmarks');
      }
    } catch (error: any) {
      toast.error(error.message || `Failed to ${type} post`);
    }
  };
  
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Post by ${post.user?.display_name}`,
          text: post.content,
          url: `${window.location.origin}/post/${post.id}`
        });
      } else {
        await navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
        toast.success('Link copied to clipboard!');
      } catch {
        toast.error('Failed to share post');
      }
    }
  };
  
  const renderMedia = () => {
    if (!post.media_urls || post.media_urls.length === 0) return null;
    
    const mediaCount = post.media_urls.length;
    
    return (
      <div className={`mt-3 rounded-xl overflow-hidden ${
        mediaCount === 1 ? 'grid-cols-1' :
        mediaCount === 2 ? 'grid grid-cols-2 gap-1' :
        mediaCount === 3 ? 'grid grid-cols-2 gap-1' :
        'grid grid-cols-2 gap-1'
      }`}>
        {post.media_urls.slice(0, 4).map((url, index) => {
          const isVideo = url.includes('.mp4') || url.includes('.webm') || url.includes('.mov');
          
          return (
            <div
              key={index}
              className={`relative ${
                mediaCount === 3 && index === 0 ? 'row-span-2' :
                mediaCount > 4 && index === 3 ? 'relative' : ''
              }`}
            >
              {isVideo ? (
                <video
                  src={url}
                  className="w-full h-full object-cover max-h-80"
                  controls
                  preload="metadata"
                />
              ) : (
                <img
                  src={url}
                  alt={`Post media ${index + 1}`}
                  className="w-full h-full object-cover max-h-80 cursor-pointer hover:opacity-95 transition-opacity"
                  loading="lazy"
                />
              )}
              
              {/* Overlay for additional images */}
              {mediaCount > 4 && index === 3 && (
                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-white font-bold text-xl">
                  +{mediaCount - 4}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };
  
  const renderPoll = () => {
    if (!post.poll_data) return null;
    
    return (
      <div className="mt-3 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div className="space-y-3">
          {post.poll_data.options.map((option, index) => {
            const percentage = post.poll_data!.total_votes > 0
              ? Math.round((option.votes / post.poll_data!.total_votes) * 100)
              : 0;
            
            return (
              <div
                key={index}
                className="relative cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-600"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{option.text}</span>
                  <span className="text-sm text-gray-500">{percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">{option.votes} votes</div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500">
          <div className="flex justify-between">
            <span>{post.poll_data.total_votes} total votes</span>
            <span>{formatRelativeTime(post.poll_data.ends_at)} left</span>
          </div>
        </div>
      </div>
    );
  };
  
  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };
  
  return (
    <article className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow ${className}`}>
      {/* Header */}
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {post.user?.avatar_url ? (
            <img
              src={post.user.avatar_url}
              alt={post.user.display_name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {post.user?.display_name?.[0] || 'U'}
            </div>
          )}
        </div>
        
        {/* User Info and Content */}
        <div className="flex-1 min-w-0">
          {/* User Info */}
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold text-gray-900 dark:text-white truncate">
              {post.user?.display_name || 'Unknown User'}
            </h3>
            {post.user?.is_verified && (
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                ✓
              </div>
            )}
            <span className="text-gray-500 dark:text-gray-400 truncate">
              @{post.user?.username || 'unknown'}
            </span>
            <span className="text-gray-500 dark:text-gray-400">·</span>
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              {formatRelativeTime(post.created_at)}
            </span>
          </div>
          
          {/* Post Content */}
          <div className="text-gray-900 dark:text-white text-base leading-relaxed mb-3 whitespace-pre-wrap break-words">
            {post.content}
          </div>
          
          {/* Location */}
          {post.location && (
            <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
              <MapPin className="w-4 h-4" />
              {post.location}
            </div>
          )}
          
          {/* Media */}
          {renderMedia()}
          
          {/* Poll */}
          {renderPoll()}
          
          {/* Quoted Post */}
          {post.quoted_post && (
            <div className="mt-3 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
                <img
                  src={post.quoted_post.user?.avatar_url || ''}
                  alt={post.quoted_post.user?.display_name}
                  className="w-4 h-4 rounded-full"
                />
                <span>{post.quoted_post.user?.display_name}</span>
                <span>@{post.quoted_post.user?.username}</span>
                <span>·</span>
                <span>{formatRelativeTime(post.quoted_post.created_at)}</span>
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                {post.quoted_post.content}
              </div>
            </div>
          )}
        </div>
        
        {/* More Options */}
        <div className="flex-shrink-0">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Actions */}
      {showActions && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          {/* Reply */}
          <button
            onClick={() => onReply?.(post)}
            className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
          >
            <MessageCircle className="w-5 h-5" />
            {post.reply_count > 0 && (
              <span className="text-sm font-medium">{formatCount(post.reply_count)}</span>
            )}
          </button>
          
          {/* Repost */}
          <button
            onClick={() => handleInteraction('repost')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors group ${
              isReposted
                ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-gray-700'
                : 'text-gray-500 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-gray-700'
            }`}
          >
            <Repeat className="w-5 h-5" />
            {repostCount > 0 && (
              <span className="text-sm font-medium">{formatCount(repostCount)}</span>
            )}
          </button>
          
          {/* Like */}
          <button
            onClick={() => handleInteraction('like')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors group ${
              isLiked
                ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-gray-700'
                : 'text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            {likeCount > 0 && (
              <span className="text-sm font-medium">{formatCount(likeCount)}</span>
            )}
          </button>
          
          {/* Views */}
          <div className="flex items-center gap-2 px-3 py-2 text-gray-500">
            <Eye className="w-5 h-5" />
            <span className="text-sm font-medium">{formatCount(post.view_count)}</span>
          </div>
          
          {/* Share & Bookmark */}
          <div className="flex items-center">
            <button
              onClick={() => handleInteraction('bookmark')}
              className={`p-2 rounded-lg transition-colors ${
                isBookmarked
                  ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-gray-700'
                  : 'text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-gray-700'
              }`}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
            
            <button
              onClick={handleShare}
              className="p-2 rounded-lg text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
              title="Share"
            >
              <Share className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </article>
  );
};