// YourSpace Creative Labs - Sidebar Navigation
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { 
  HomeIcon, 
  MagnifyingGlassIcon, 
  PlusIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  CogIcon,
  UserIcon,
  FilmIcon,
  SparklesIcon,
  LockClosedIcon,
  BuildingLibraryIcon,
  CubeIcon,
  ChatBubbleLeftRightIcon,
  RssIcon
} from '@heroicons/react/24/outline'
import { cn } from '../../lib/utils'

// Navigation items with authentication requirements
const publicNavigation = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Social Feed', href: '/social', icon: RssIcon },
  { name: 'Discover', href: '/discover', icon: MagnifyingGlassIcon },
  { name: 'Artist Discovery', href: '/discover-artists', icon: SparklesIcon },
  { name: 'Virtual Rooms', href: '/rooms', icon: BuildingLibraryIcon },
  { name: 'Marketplace', href: '/marketplace', icon: ShoppingBagIcon },
]

const creatorNavigation = [
  { name: 'Create', href: '/create', icon: PlusIcon, requiresAuth: true },
  { name: 'Collaborate', href: '/collaborate', icon: UserGroupIcon, requiresAuth: true },
  { name: 'Messages', href: '/messages', icon: ChatBubbleLeftRightIcon, requiresAuth: true },
  { name: 'My Rooms', href: '/rooms/manage', icon: CubeIcon, requiresAuth: true },
  { name: 'Studio', href: '/studio', icon: FilmIcon, requiresAuth: true },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon, requiresAuth: true },
]

const bottomNavigation = [
  { name: 'Profile', href: '/profile', icon: UserIcon, requiresAuth: true },
  { name: 'Settings', href: '/settings', icon: CogIcon, requiresAuth: true },
]

export const Sidebar = () => {
  const location = useLocation()
  const { user, profile } = useAuth()

  const handleAuthRequiredClick = (e: React.MouseEvent, href: string) => {
    if (!user) {
      e.preventDefault()
      // Could show a modal or toast here instead
      alert('Please sign in to access creator features')
    }
  }

  const renderNavItem = (item: any) => {
    const isActive = location.pathname === item.href
    const isDisabled = item.requiresAuth && !user
    
    return (
      <Link
        key={item.name}
        to={item.href}
        onClick={(e) => item.requiresAuth && handleAuthRequiredClick(e, item.href)}
        className={cn(
          'flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 group relative',
          isActive && user
            ? 'bg-purple-500/20 text-purple-300 neon-glow'
            : isDisabled
            ? 'text-gray-500 cursor-not-allowed'
            : 'text-gray-300 hover:bg-purple-500/10 hover:text-purple-300'
        )}
      >
        <item.icon
          className={cn(
            'w-5 h-5 mr-3 transition-colors',
            isActive && user
              ? 'text-purple-300'
              : isDisabled
              ? 'text-gray-500'
              : 'text-gray-400 group-hover:text-purple-300'
          )}
        />
        {item.name}
        {item.requiresAuth && !user && (
          <LockClosedIcon className="w-4 h-4 ml-auto text-gray-500" />
        )}
      </Link>
    )
  }

  return (
    <div className="w-64 h-screen bg-black/20 backdrop-blur-xl border-r border-purple-500/20 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-purple-500/20">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">Y</span>
          </div>
          <span className="text-xl font-bold gradient-text">YourSpace</span>
        </Link>
      </div>

      {/* Public Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        <div className="mb-4">
          <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Discover
          </h3>
          <div className="space-y-1">
            {publicNavigation.map(renderNavItem)}
          </div>
        </div>

        {/* Creator Navigation */}
        <div>
          <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Create
          </h3>
          <div className="space-y-1">
            {creatorNavigation.map(renderNavItem)}
          </div>
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="p-3 border-t border-purple-500/20 space-y-2">
        {bottomNavigation.map(renderNavItem)}
      </div>

      {/* User Profile Summary or Auth Prompt */}
      <div className="p-4 border-t border-purple-500/20">
        {user && profile ? (
          // Authenticated user profile
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
              {profile.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt={profile.display_name} 
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-semibold">
                  {profile.display_name?.charAt(0) || profile.username.charAt(0)}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {profile.display_name || profile.username}
              </p>
              <p className="text-xs text-gray-400 truncate">
                @{profile.username}
              </p>
            </div>
          </div>
        ) : (
          // Guest user auth prompt
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
              <UserIcon className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm font-medium text-white mb-2">Join YourSpace</p>
            <p className="text-xs text-gray-400 mb-3">Sign up to unlock creator features</p>
            <div className="space-y-2">
              <Link
                to="/register"
                className="block w-full py-2 px-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white text-sm font-medium hover:from-pink-600 hover:to-purple-600 transition-all duration-200"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="block w-full py-2 px-3 border border-purple-500/30 rounded-lg text-purple-300 text-sm font-medium hover:bg-purple-500/10 transition-all duration-200"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}