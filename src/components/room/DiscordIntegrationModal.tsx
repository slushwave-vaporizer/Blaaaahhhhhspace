// YourSpace Creative Labs - Discord Integration Modal
import { useState } from 'react'
import {
  XMarkIcon,
  LinkIcon,
  UserIcon,
  MicrophoneIcon,
  SpeakerWaveIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { cn } from '../../lib/utils'

interface DiscordIntegrationModalProps {
  isOpen: boolean
  onClose: () => void
}

export const DiscordIntegrationModal = ({ isOpen, onClose }: DiscordIntegrationModalProps) => {
  const [isLinked, setIsLinked] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  if (!isOpen) return null

  const handleLinkAccount = () => {
    setIsConnecting(true)
    // TODO: Implement OAuth2 flow in next step
    setTimeout(() => {
      setIsConnecting(false)
      setIsLinked(true)
    }, 2000)
  }

  const DiscordIcon = () => (
    <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.010c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  )

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black/90 border border-purple-500/30 rounded-2xl w-full max-w-3xl max-h-[80vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <DiscordIcon />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Discord Integration
              </h2>
              <p className="text-gray-400 text-sm">
                Connect your Discord account for enhanced social features
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto">
            {!isLinked ? (
              <div>
                {/* Integration Overview */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-purple-500/20 mb-6">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <DiscordIcon />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Connect with Discord
                    </h3>
                    
                    <p className="text-gray-400 mb-6">
                      Link your Discord account to unlock social features, voice chat integration, and seamless community connectivity within YourSpace.
                    </p>
                  </div>

                  {/* Link Account Button */}
                  <button
                    onClick={handleLinkAccount}
                    disabled={isConnecting}
                    className={cn(
                      "w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-xl font-semibold transition-all",
                      isConnecting
                        ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                        : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600"
                    )}
                  >
                    {isConnecting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <>
                        <LinkIcon className="w-5 h-5" />
                        <span>Link Discord Account</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Features Preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-black/20 border border-purple-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <UserIcon className="w-5 h-5 text-purple-400" />
                      <h5 className="text-white font-medium">Profile Integration</h5>
                    </div>
                    <p className="text-gray-400 text-sm">Display your Discord profile info and status on your YourSpace profile</p>
                  </div>
                  
                  <div className="bg-black/20 border border-purple-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <MicrophoneIcon className="w-5 h-5 text-purple-400" />
                      <h5 className="text-white font-medium">Voice Chat</h5>
                    </div>
                    <p className="text-gray-400 text-sm">Quick access to Discord voice channels directly from your virtual room</p>
                  </div>
                  
                  <div className="bg-black/20 border border-purple-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <SpeakerWaveIcon className="w-5 h-5 text-purple-400" />
                      <h5 className="text-white font-medium">Social Features</h5>
                    </div>
                    <p className="text-gray-400 text-sm">Enhanced social connectivity with your Discord friends and communities</p>
                  </div>
                  
                  <div className="bg-black/20 border border-purple-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <DiscordIcon />
                      <h5 className="text-white font-medium">Server Integration</h5>
                    </div>
                    <p className="text-gray-400 text-sm">Connect YourSpace activities with your Discord servers and channels</p>
                  </div>
                </div>

                {/* Security Note */}
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                  <h4 className="text-purple-400 font-semibold mb-2 flex items-center space-x-2">
                    <CheckCircleIcon className="w-5 h-5" />
                    <span>Secure Integration</span>
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Your Discord account will be securely linked using OAuth2. YourSpace will only access basic profile information and never store your Discord password. You can disconnect at any time.
                  </p>
                </div>
              </div>
            ) : (
              /* Connected State */
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircleIcon className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">
                  Discord Connected!
                </h3>
                
                <p className="text-gray-400 mb-6">
                  Your Discord account has been successfully linked. You can now access Discord features from your YourSpace profile.
                </p>

                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-purple-500/20 mb-6">
                  <h4 className="text-white font-semibold mb-4">Connected Account</h4>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                      <DiscordIcon />
                    </div>
                    <div className="text-left">
                      <p className="text-white font-medium">Demo User#1234</p>
                      <p className="text-gray-400 text-sm">Connected just now</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all"
                >
                  Continue to YourSpace
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
