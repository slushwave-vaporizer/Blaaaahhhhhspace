// YourSpace Creative Labs - Header Component
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { 
  BellIcon, 
  MagnifyingGlassIcon,
  PlusIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'

export const Header = () => {
  const { user, profile, signOut } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="h-20 bg-black/20 backdrop-blur-xl border-b border-purple-500/20 flex items-center justify-between px-6">
      {/* Search Bar */}
      <div className="flex-1 max-w-lg">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search creators, content, collaborations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {user ? (
          // Authenticated User Content
          <>
            {/* Quick Create Button */}
            <Link
              to="/create"
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white font-medium hover:from-pink-600 hover:to-purple-600 transition-all duration-200 neon-glow"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Create</span>
            </Link>

            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-purple-300 transition-colors">
              <BellIcon className="h-6 w-6" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-pink-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-purple-500/10 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                  {profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt={profile.display_name} 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-5 w-5 text-white" />
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-white">
                    {profile?.display_name || profile?.username || 'User'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {profile?.subscription_tier || 'Free'}
                  </p>
                </div>
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-56 bg-black/90 backdrop-blur-xl border border-purple-500/20 rounded-lg shadow-lg focus:outline-none">
                  <div className="p-2">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/profile"
                          className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                            active ? 'bg-purple-500/20 text-purple-300' : 'text-gray-300'
                          }`}
                        >
                          View Profile
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/settings"
                          className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                            active ? 'bg-purple-500/20 text-purple-300' : 'text-gray-300'
                          }`}
                        >
                          Settings
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/studio"
                          className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                            active ? 'bg-purple-500/20 text-purple-300' : 'text-gray-300'
                          }`}
                        >
                          Creator Studio
                        </Link>
                      )}
                    </Menu.Item>
                    <hr className="my-2 border-purple-500/20" />
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={signOut}
                          className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                            active ? 'bg-red-500/20 text-red-300' : 'text-gray-300'
                          }`}
                        >
                          Sign Out
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </>
        ) : (
          // Guest User Content
          <>
            <div className="text-sm text-purple-300 hidden md:block">
              Sign up to create and collaborate
            </div>
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="px-4 py-2 text-purple-300 hover:text-white transition-colors font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white font-medium hover:from-pink-600 hover:to-purple-600 transition-all duration-200 neon-glow"
              >
                Sign Up
              </Link>
            </div>
          </>
        )}
      </div>
    </header>
  )
}