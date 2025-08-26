// YourSpace Creative Labs - Settings Page with Real Functionality
import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { usePayments } from '../../hooks/usePayments'
import { useTheme } from '../../lib/theme'
import { 
  CogIcon,
  UserIcon,
  BellIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  PaintBrushIcon,
  EyeIcon,
  EyeSlashIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline'
import { cn } from '../../lib/utils'
import { ProfileBuilder } from '../../components/profile/ProfileBuilder'

type SettingsTab = 'profile' | 'account' | 'notifications' | 'privacy' | 'billing' | 'appearance' | 'profilebuilder'

export const SettingsPage = () => {
  const { profile, updateProfile } = useAuth()
  const { checkStripeStatus, setupStripeConnect, getStripeDashboard } = usePayments()
  const { currentTheme, setTheme, isDarkMode, toggleDarkMode } = useTheme()
  
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')
  const [loading, setLoading] = useState(false)
  const [stripeStatus, setStripeStatus] = useState<any>(null)
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    display_name: profile?.display_name || '',
    bio: profile?.bio || '',
    website: profile?.website || '',
    location: profile?.location || ''
  })

  // Settings state
  const [settings, setSettings] = useState({
    notifications: {
      email_tips: true,
      email_follows: true,
      email_collaborations: true,
      push_notifications: true
    },
    privacy: {
      profile_public: true,
      show_email: false,
      show_location: true,
      allow_direct_messages: true
    }
  })

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'profilebuilder', name: 'Profile Builder', icon: Squares2X2Icon },
    { id: 'account', name: 'Account', icon: ShieldCheckIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'privacy', name: 'Privacy', icon: EyeIcon },
    { id: 'billing', name: 'Billing', icon: CreditCardIcon },
    { id: 'appearance', name: 'Appearance', icon: PaintBrushIcon },
  ]

  const themeColors = {
    pink: '#ff006e',
    purple: '#8338ec',
    blue: '#3a86ff',
    cyan: '#06ffa5',
    orange: '#fb8500'
  }

  useEffect(() => {
    if (profile) {
      setProfileForm({
        display_name: profile.display_name || '',
        bio: profile.bio || '',
        website: profile.website || '',
        location: profile.location || ''
      })
    }
  }, [profile])

  useEffect(() => {
    // Check Stripe status
    const loadStripeStatus = async () => {
      const status = await checkStripeStatus()
      setStripeStatus(status)
    }
    loadStripeStatus()
  }, [])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await updateProfile(profileForm)
    setLoading(false)
  }

  const handleSettingsUpdate = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold gradient-text mb-2">Settings</h1>
        <p className="text-gray-400 text-lg">
          Customize your profile, privacy, and account preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as SettingsTab)}
                    className={cn(
                      'w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-all',
                      activeTab === tab.id
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-400/50'
                        : 'text-gray-400 hover:bg-purple-500/10 hover:text-purple-300'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.name}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Profile Settings</h2>
                
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.display_name}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, display_name: e.target.value }))}
                        className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                        placeholder="Your display name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={profileForm.location}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                        placeholder="Your location"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={profileForm.website}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, website: e.target.value }))}
                      className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                      placeholder="https://your-website.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all resize-none"
                      placeholder="Tell others about yourself and your creative work..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white font-semibold hover:from-pink-600 hover:to-purple-600 transition-all disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update Profile'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'profilebuilder' && (
              <div className="h-[80vh]">
                <ProfileBuilder />
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Appearance</h2>
                
                {/* Theme Colors */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Neon Theme</h3>
                  <div className="grid grid-cols-5 gap-4">
                    {Object.entries(themeColors).map(([name, color]) => (
                      <button
                        key={name}
                        onClick={() => setTheme(name as any)}
                        className={cn(
                          'w-16 h-16 rounded-lg border-2 transition-all',
                          currentTheme === name
                            ? 'border-white scale-110'
                            : 'border-transparent hover:border-purple-400/50'
                        )}
                        style={{ backgroundColor: color }}
                        title={name.charAt(0).toUpperCase() + name.slice(1)}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Dark Mode Toggle */}
                <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Dark Mode</h4>
                    <p className="text-gray-400 text-sm">Use dark theme across the interface</p>
                  </div>
                  <button
                    onClick={toggleDarkMode}
                    className={cn(
                      'relative w-12 h-6 rounded-full transition-colors',
                      isDarkMode ? 'bg-purple-500' : 'bg-gray-600'
                    )}
                  >
                    <div className={cn(
                      'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
                      isDarkMode ? 'translate-x-7' : 'translate-x-1'
                    )} />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Billing & Payments</h2>
                
                {/* Stripe Connect Status */}
                <div className="bg-black/30 border border-purple-500/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Creator Payments</h3>
                  
                  {stripeStatus ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Payment Status:</span>
                        <span className={cn(
                          'px-3 py-1 rounded-full text-sm font-medium',
                          stripeStatus.charges_enabled
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        )}>
                          {stripeStatus.charges_enabled ? 'Active' : 'Setup Required'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Payouts:</span>
                        <span className={cn(
                          'px-3 py-1 rounded-full text-sm font-medium',
                          stripeStatus.payouts_enabled
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        )}>
                          {stripeStatus.payouts_enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      
                      {stripeStatus.connected && (
                        <button
                          onClick={getStripeDashboard}
                          className="w-full mt-4 px-4 py-3 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-300 font-medium hover:bg-purple-500/30 transition-all"
                        >
                          Open Stripe Dashboard
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CreditCardIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400 mb-4">
                        Connect your Stripe account to receive payments from tips and subscriptions.
                      </p>
                      <button
                        onClick={setupStripeConnect}
                        className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white font-semibold hover:from-pink-600 hover:to-purple-600 transition-all"
                      >
                        Connect Stripe Account
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Notification Preferences</h2>
                
                <div className="space-y-4">
                  {Object.entries(settings.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
                      <div>
                        <h4 className="text-white font-medium capitalize">
                          {key.replace('_', ' ')}
                        </h4>
                        <p className="text-gray-400 text-sm">
                          Receive notifications for {key.replace('email_', '').replace('_', ' ')}
                        </p>
                      </div>
                      <button
                        onClick={() => handleSettingsUpdate('notifications', key, !value)}
                        className={cn(
                          'relative w-12 h-6 rounded-full transition-colors',
                          value ? 'bg-purple-500' : 'bg-gray-600'
                        )}
                      >
                        <div className={cn(
                          'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
                          value ? 'translate-x-7' : 'translate-x-1'
                        )} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Privacy Settings</h2>
                
                <div className="space-y-4">
                  {Object.entries(settings.privacy).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
                      <div>
                        <h4 className="text-white font-medium capitalize">
                          {key.replace('_', ' ')}
                        </h4>
                        <p className="text-gray-400 text-sm">
                          Control your {key.replace('_', ' ')} visibility
                        </p>
                      </div>
                      <button
                        onClick={() => handleSettingsUpdate('privacy', key, !value)}
                        className={cn(
                          'relative w-12 h-6 rounded-full transition-colors',
                          value ? 'bg-purple-500' : 'bg-gray-600'
                        )}
                      >
                        <div className={cn(
                          'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
                          value ? 'translate-x-7' : 'translate-x-1'
                        )} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Account Settings</h2>
                
                <div className="space-y-6">
                  <div className="bg-black/30 border border-purple-500/30 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Username:</span>
                        <span className="text-white">@{profile?.username}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Email:</span>
                        <span className="text-white">{profile?.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Subscription:</span>
                        <span className="text-purple-300 capitalize">
                          {profile?.subscription_tier || 'Free'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h3>
                    <p className="text-gray-400 mb-4">
                      These actions are permanent and cannot be undone.
                    </p>
                    <button className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 font-medium hover:bg-red-500/30 transition-all">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}