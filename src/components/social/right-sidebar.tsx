import React, { useState, useEffect } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { socialApi } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

interface TrendingHashtag {
  id: string;
  name: string;
  post_count: number;
}

interface SuggestedUser {
  user_id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

const RightSidebar = () => {
  const [trendingHashtags, setTrendingHashtags] = useState<TrendingHashtag[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load trending hashtags and suggested users in parallel
        const [hashtagsData, usersData] = await Promise.all([
          socialApi.getTrendingHashtags(5).catch(() => []),
          socialApi.getSuggestedUsers(4).catch(() => [])
        ]);
        
        // Process hashtags data
        const processedHashtags = hashtagsData.map((hashtag: any) => ({
          id: hashtag.id,
          name: hashtag.name,
          post_count: hashtag.post_hashtags?.length || 0
        }));
        
        setTrendingHashtags(processedHashtags);
        setSuggestedUsers(usersData);
      } catch (error) {
        console.error('Error loading sidebar data:', error);
        // Use fallback data if API fails
        setTrendingHashtags([
          { id: '1', name: '#AIArt', post_count: 152 },
          { id: '2', name: '#CreativeWorkspace', post_count: 87 },
          { id: '3', name: '#VirtualSpaces', post_count: 124 },
          { id: '4', name: '#ArtistSupport', post_count: 251 },
          { id: '5', name: '#CreativeTech2025', post_count: 98 }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const getUserDisplayName = (user: SuggestedUser) => {
    return user.full_name || user.username || `User ${user.user_id.slice(0, 8)}`;
  };

  const getUserAvatarUrl = (user: SuggestedUser) => {
    return user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(getUserDisplayName(user))}&background=random`;
  };

  const getUserUsername = (user: SuggestedUser) => {
    return user.username || `user${user.user_id.slice(0, 8)}`;
  };

  return (
    <div className="sticky top-0 h-screen overflow-y-auto">
      <div className="flex flex-col w-80 p-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search YourSpace"
            className="w-full bg-gray-100 dark:bg-gray-800 rounded-full py-3 px-4 pl-12 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* What's Happening */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">What's happening</h2>
          <div className="space-y-3">
            {loading ? (
              <div className="animate-pulse space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            ) : trendingHashtags.length > 0 ? (
              trendingHashtags.map((hashtag) => (
                <div key={hashtag.id} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Trending in Creative Tech</p>
                      <p className="font-bold text-gray-900 dark:text-white">{hashtag.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {hashtag.post_count > 0 ? `${hashtag.post_count} posts` : 'Trending'}
                      </p>
                    </div>
                    <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No trending topics right now</p>
            )}
          </div>
          <button className="text-blue-500 hover:text-blue-600 text-sm font-medium mt-2 transition-colors">
            Show more
          </button>
        </div>

        {/* Who to Follow */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Who to follow</h2>
          <div className="space-y-4">
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                    <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  </div>
                ))}
              </div>
            ) : suggestedUsers.length > 0 ? (
              suggestedUsers
                .filter(suggestedUser => suggestedUser.user_id !== user?.id) // Don't suggest current user
                .slice(0, 4)
                .map((suggestedUser) => (
                  <div key={suggestedUser.user_id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={getUserAvatarUrl(suggestedUser)}
                        alt={getUserDisplayName(suggestedUser)}
                        className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(getUserDisplayName(suggestedUser))}&background=6366f1&color=fff`;
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1">
                          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                            {getUserDisplayName(suggestedUser)}
                          </p>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">@{getUserUsername(suggestedUser)}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          New to YourSpace
                        </p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                      Follow
                    </button>
                  </div>
                ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No suggestions available</p>
            )}
          </div>
          {!loading && suggestedUsers.length > 0 && (
            <button className="text-blue-500 hover:text-blue-600 text-sm font-medium mt-4 transition-colors">
              Show more
            </button>
          )}
        </div>

        {/* Footer Links */}
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <div className="flex flex-wrap gap-2">
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Cookie Policy</a>
            <a href="#" className="hover:underline">Accessibility</a>
            <a href="#" className="hover:underline">Ads info</a>
          </div>
          <p>© 2025 YourSpace Creative Labs</p>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;