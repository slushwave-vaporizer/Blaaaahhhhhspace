// YourSpace Creative Labs - Computer Interface Modal
// Integrates MiniMax OS with YourSpace Creative Management Hub

import React, { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useContent } from '../../hooks/useContent'
import { supabase } from '../../lib/supabase'
import {
  XMarkIcon,
  ComputerDesktopIcon,
  CubeIcon,
  BrushIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  SparklesIcon,
  FolderIcon
} from '@heroicons/react/24/outline'
import { cn } from '../../lib/utils'
import toast from 'react-hot-toast'

interface ComputerInterfaceModalProps {
  isOpen: boolean
  onClose: () => void
  creatorId?: string
  roomId?: string
}

export const ComputerInterfaceModal: React.FC<ComputerInterfaceModalProps> = ({
  isOpen,
  onClose,
  creatorId,
  roomId
}) => {
  const { user, session } = useAuth()
  const { getCreatorContent } = useContent()
  const [currentView, setCurrentView] = useState<'desktop' | 'loading'>('desktop')
  const [iframeSrc, setIframeSrc] = useState('')
  const [creatorData, setCreatorData] = useState<any>(null)

  // Initialize computer interface
  useEffect(() => {
    if (isOpen && user) {
      initializeComputerInterface()
    }
  }, [isOpen, user])

  const initializeComputerInterface = async () => {
    setCurrentView('loading')
    
    try {
      if (!session) {
        throw new Error('No active session')
      }

      // Sync creator data with YourSpace
      const { data: syncData, error: syncError } = await supabase.functions.invoke(
        'computer-interface-sync',
        {
          body: {
            action: 'sync_creator_data'
          },
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        }
      )

      if (syncError) throw syncError
      if (syncData.error) throw new Error(syncData.error.message)

      const userData = syncData.data

      // Prepare creator-specific data for MiniMax OS
      const creatorInfo = {
        id: creatorId || user?.id,
        username: userData.profile?.username || user?.email?.split('@')[0],
        displayName: userData.profile?.display_name || 'Creative Creator',
        roomId: roomId,
        profile: userData.profile,
        content: userData.content,
        rooms: userData.rooms,
        preferences: userData.preferences
      }

      setCreatorData(creatorInfo)

      // Construct MiniMax OS URL with creator customization
      const miniMaxOSUrl = 'https://r1hespvq2jb8.space.minimax.io'
      const customizedUrl = `${miniMaxOSUrl}?creator=${encodeURIComponent(JSON.stringify(creatorInfo))}`
      
      setIframeSrc(customizedUrl)
      setCurrentView('desktop')
      
    } catch (error) {
      console.error('Failed to initialize computer interface:', error)
      toast.error('Failed to load computer interface')
      onClose()
    }
  }

  const handleMessage = (event: MessageEvent) => {
    // Handle messages from MiniMax OS iframe
    if (event.origin === 'https://r1hespvq2jb8.space.minimax.io') {
      console.log('Message from MiniMax OS:', event.data)
      
      switch (event.data.type) {
        case 'SAVE_CONTENT':
          handleSaveContent(event.data.payload)
          break
        case 'LOAD_CONTENT':
          handleLoadContent(event.data.payload)
          break
        case 'UPDATE_PROFILE':
          handleUpdateProfile(event.data.payload)
          break
        case 'CLOSE_INTERFACE':
          onClose()
          break
      }
    }
  }

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('message', handleMessage)
      return () => window.removeEventListener('message', handleMessage)
    }
  }, [isOpen])

  const handleSaveContent = async (contentData: any) => {
    try {
      if (!session) {
        throw new Error('No active session')
      }

      const { data, error } = await supabase.functions.invoke(
        'computer-interface-sync',
        {
          body: {
            action: 'save_content',
            data: contentData
          },
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        }
      )

      if (error) throw error
      if (data.error) throw new Error(data.error.message)

      toast.success('Content saved successfully!')
      
      // Send success confirmation back to MiniMax OS
      const iframe = document.getElementById('minimax-os-iframe') as HTMLIFrameElement
      if (iframe?.contentWindow) {
        iframe.contentWindow.postMessage({
          type: 'CONTENT_SAVED',
          payload: data.data
        }, 'https://r1hespvq2jb8.space.minimax.io')
      }
    } catch (error) {
      console.error('Failed to save content:', error)
      toast.error('Failed to save content')
      
      // Send error back to MiniMax OS
      const iframe = document.getElementById('minimax-os-iframe') as HTMLIFrameElement
      if (iframe?.contentWindow) {
        iframe.contentWindow.postMessage({
          type: 'CONTENT_SAVE_ERROR',
          payload: { error: error.message }
        }, 'https://r1hespvq2jb8.space.minimax.io')
      }
    }
  }

  const handleLoadContent = async (request: any) => {
    try {
      if (!session) {
        throw new Error('No active session')
      }

      const { data, error } = await supabase.functions.invoke(
        'computer-interface-sync',
        {
          body: {
            action: 'sync_creator_data'
          },
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        }
      )

      if (error) throw error
      if (data.error) throw new Error(data.error.message)
      
      // Send content back to MiniMax OS
      const iframe = document.getElementById('minimax-os-iframe') as HTMLIFrameElement
      if (iframe?.contentWindow) {
        iframe.contentWindow.postMessage({
          type: 'CONTENT_LOADED',
          payload: data.data
        }, 'https://r1hespvq2jb8.space.minimax.io')
      }
    } catch (error) {
      console.error('Failed to load content:', error)
      toast.error('Failed to load content')
      
      // Send error back to MiniMax OS
      const iframe = document.getElementById('minimax-os-iframe') as HTMLIFrameElement
      if (iframe?.contentWindow) {
        iframe.contentWindow.postMessage({
          type: 'CONTENT_LOAD_ERROR',
          payload: { error: error.message }
        }, 'https://r1hespvq2jb8.space.minimax.io')
      }
    }
  }

  const handleUpdateProfile = async (profileData: any) => {
    try {
      if (!session) {
        throw new Error('No active session')
      }

      const { data, error } = await supabase.functions.invoke(
        'computer-interface-sync',
        {
          body: {
            action: 'update_profile',
            data: profileData
          },
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        }
      )

      if (error) throw error
      if (data.error) throw new Error(data.error.message)

      toast.success('Profile updated successfully!')
      
      // Send success confirmation back to MiniMax OS
      const iframe = document.getElementById('minimax-os-iframe') as HTMLIFrameElement
      if (iframe?.contentWindow) {
        iframe.contentWindow.postMessage({
          type: 'PROFILE_UPDATED',
          payload: data.data
        }, 'https://r1hespvq2jb8.space.minimax.io')
      }
    } catch (error) {
      console.error('Failed to update profile:', error)
      toast.error('Failed to update profile')
      
      // Send error back to MiniMax OS
      const iframe = document.getElementById('minimax-os-iframe') as HTMLIFrameElement
      if (iframe?.contentWindow) {
        iframe.contentWindow.postMessage({
          type: 'PROFILE_UPDATE_ERROR',
          payload: { error: error.message }
        }, 'https://r1hespvq2jb8.space.minimax.io')
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-full h-full max-w-none max-h-none bg-black border border-purple-500/30 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-b border-purple-500/20">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <ComputerDesktopIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                YourSpace Creative Workstation
              </h2>
              <p className="text-gray-300 text-sm">
                {creatorData?.displayName}'s Creative Management Hub
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Computer Status Indicators */}
            <div className="flex items-center space-x-4 text-xs text-gray-400">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Online</span>
              </div>
              <div className="flex items-center space-x-1">
                <FolderIcon className="w-4 h-4" />
                <span>MiniMax OS</span>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              title="Close Computer Interface"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Computer Interface Content */}
        <div className="flex-1 relative">
          {currentView === 'loading' && (
            <div className="absolute inset-0 bg-black flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <ComputerDesktopIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Booting Up Creative Workstation...</h3>
                <p className="text-gray-400">Initializing MiniMax OS interface</p>
                <div className="flex items-center justify-center mt-4">
                  <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                </div>
              </div>
            </div>
          )}

          {currentView === 'desktop' && iframeSrc && (
            <iframe
              id="minimax-os-iframe"
              src={iframeSrc}
              className="w-full h-full border-none"
              title="MiniMax OS Creative Workstation"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
              allowFullScreen
            />
          )}
        </div>

        {/* Computer Interface Footer */}
        <div className="px-6 py-3 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-t border-purple-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <CubeIcon className="w-4 h-4" />
                <span>Room Designer</span>
              </div>
              <div className="flex items-center space-x-2">
                <BrushIcon className="w-4 h-4" />
                <span>Content Studio</span>
              </div>
              <div className="flex items-center space-x-2">
                <ChartBarIcon className="w-4 h-4" />
                <span>Analytics Hub</span>
              </div>
              <div className="flex items-center space-x-2">
                <Cog6ToothIcon className="w-4 h-4" />
                <span>Profile Manager</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <SparklesIcon className="w-4 h-4" />
              <span>Powered by MiniMax OS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
