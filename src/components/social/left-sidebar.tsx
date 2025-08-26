import React, { useState } from 'react';
import { Home, Search, Bell, Mail, Bookmark, User, Settings, MoreHorizontal, Plus, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface NavigationItem {
  title: string;
  href: string;
  icon: React.ComponentType<any>;
}

const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    title: "Home",
    href: "/",
    icon: Home
  },
  {
    title: "Explore",
    href: "/explore",
    icon: Search
  },
  {
    title: "Notifications",
    href: "/notifications",
    icon: Bell
  },
  {
    title: "Messages",
    href: "/messages",
    icon: Mail
  },
  {
    title: "Bookmarks",
    href: "/bookmarks",
    icon: Bookmark
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings
  }
];

const SignInModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        await signUp(email, password, fullName);
        alert('Sign up successful! Please check your email to verify your account.');
      } else {
        await signIn(email, password);
      }
      onClose();
      setEmail('');
      setPassword('');
      setFullName('');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isSignUp ? 'Join YourSpace' : 'Sign in to YourSpace'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Loading...' : (isSignUp ? 'Sign up' : 'Sign in')}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            className="text-blue-500 hover:text-blue-600 text-sm"
          >
            {isSignUp ? 'Already have an account? Sign in' : 'Don\'t have an account? Sign up'}
          </button>
        </div>
      </div>
    </div>
  );
};

const LeftSidebar = () => {
  const { user, profile, signOut, loading } = useAuth();
  const [showSignIn, setShowSignIn] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowUserMenu(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getUserDisplayName = () => {
    return profile?.full_name || profile?.username || user?.email || 'User';
  };

  const getUserUsername = () => {
    return profile?.username || `user${user?.id.slice(0, 8)}` || 'username';
  };

  const getUserAvatarUrl = () => {
    return profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(getUserDisplayName())}&background=6366f1&color=fff`;
  };

  return (
    <>
      <section className="sticky top-0 h-screen flex flex-col justify-between py-4 px-2">
        <div className="flex flex-col space-y-2">
          {/* Logo */}
          <div className="p-4 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">YS</span>
            </div>
          </div>
          
          {/* Navigation Items */}
          {NAVIGATION_ITEMS.map((item) => (
            <a
              href={item.href}
              key={item.title}
              className="flex items-center space-x-4 p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
              onClick={(e) => {
                if (!user && (item.title === 'Notifications' || item.title === 'Messages' || item.title === 'Bookmarks' || item.title === 'Profile')) {
                  e.preventDefault();
                  setShowSignIn(true);
                }
              }}
            >
              <item.icon className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-blue-500" />
              <span className="hidden xl:block text-xl font-medium text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">
                {item.title}
              </span>
            </a>
          ))}
          
          {/* More Menu */}
          <button className="flex items-center space-x-4 p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group">
            <MoreHorizontal className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-blue-500" />
            <span className="hidden xl:block text-xl font-medium text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">
              More
            </span>
          </button>
          
          {/* Post Button */}
          <button 
            className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full transition-colors w-full xl:w-auto"
            onClick={() => {
              if (!user) {
                setShowSignIn(true);
              } else {
                document.querySelector('textarea')?.focus();
              }
            }}
          >
            <Plus className="w-6 h-6 xl:hidden" />
            <span className="hidden xl:block">Post</span>
          </button>
        </div>
        
        {/* User Profile / Sign In */}
        {loading ? (
          <div className="flex items-center space-x-3 p-3">
            <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
            <div className="hidden xl:flex flex-col space-y-2 flex-1">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
            </div>
          </div>
        ) : user ? (
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full text-left"
            >
              <img
                src={getUserAvatarUrl()}
                alt={getUserDisplayName()}
                className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(getUserDisplayName())}&background=6366f1&color=fff`;
                }}
              />
              <div className="hidden xl:flex flex-col flex-1 min-w-0">
                <p className="font-bold text-gray-900 dark:text-white truncate">{getUserDisplayName()}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm truncate">@{getUserUsername()}</p>
              </div>
              <MoreHorizontal className="w-5 h-5 text-gray-500 hidden xl:block" />
            </button>
            
            {/* User Menu */}
            {showUserMenu && (
              <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 min-w-48 z-10">
                <button 
                  onClick={handleSignOut}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button 
            onClick={() => setShowSignIn(true)}
            className="flex items-center space-x-3 p-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors w-full text-center justify-center xl:justify-start"
          >
            <User className="w-6 h-6" />
            <span className="hidden xl:block font-medium">Sign In</span>
          </button>
        )}
      </section>
      
      <SignInModal isOpen={showSignIn} onClose={() => setShowSignIn(false)} />
    </>
  );
};

export default LeftSidebar;