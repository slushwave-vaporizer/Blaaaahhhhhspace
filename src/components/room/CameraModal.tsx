// YourSpace Creative Labs - Camera Modal (Step 1: Basic Implementation)
import { useState } from 'react'
import {
  XMarkIcon,
  VideoCameraIcon,
  MicrophoneIcon,
  ComputerDesktopIcon,
  PlayIcon,
  StopIcon
} from '@heroicons/react/24/outline'
import { cn } from '../../lib/utils'

interface CameraModalProps {
  isOpen: boolean
  onClose: () => void
}

export const CameraModal = ({ isOpen, onClose }: CameraModalProps) => {
  const [currentView, setCurrentView] = useState<'camera' | 'placeholder'>('camera')
  const [isPreviewActive, setIsPreviewActive] = useState(false)

  if (!isOpen) return null

  const handleStartPreview = () => {
    setIsPreviewActive(true)
    setCurrentView('placeholder')
  }

  const handleStopPreview = () => {
    setIsPreviewActive(false)
    setCurrentView('camera')
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black/90 border border-purple-500/30 rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
              <VideoCameraIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {currentView === 'camera' ? 'Camera Studio' : 'Live Preview'}
              </h2>
              <p className="text-gray-400 text-sm">
                {currentView === 'camera' 
                  ? 'Set up your streaming camera and audio' 
                  : 'Camera preview is active'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {currentView !== 'camera' && (
              <button
                onClick={() => setCurrentView('camera')}
                className="px-4 py-2 bg-gray-600/20 border border-gray-500/30 rounded-lg text-gray-300 hover:text-white hover:border-gray-400/50 transition-all"
              >
                Back to Studio
              </button>
            )}
            
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-hidden">
          {currentView === 'camera' && (
            <div className="h-full flex flex-col items-center justify-center p-8">
              {/* Camera Interface */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-purple-500/20 max-w-2xl w-full">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <VideoCameraIcon className="w-10 h-10 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Camera Studio
                  </h3>
                  
                  <p className="text-gray-400 mb-6">
                    Your personal streaming setup. Configure your camera and microphone for live sessions and recordings.
                  </p>
                </div>

                {/* Camera Controls */}
                <div className="space-y-4">
                  <button
                    onClick={handleStartPreview}
                    className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold hover:from-red-600 hover:to-pink-600 transition-all"
                  >
                    <PlayIcon className="w-5 h-5" />
                    <span>Start Camera Preview</span>
                  </button>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-black/30 border border-purple-500/30 text-purple-300 rounded-xl font-semibold hover:bg-purple-500/20 transition-all">
                      <VideoCameraIcon className="w-5 h-5" />
                      <span>Camera Settings</span>
                    </button>
                    
                    <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-black/30 border border-purple-500/30 text-purple-300 rounded-xl font-semibold hover:bg-purple-500/20 transition-all">
                      <MicrophoneIcon className="w-5 h-5" />
                      <span>Audio Settings</span>
                    </button>
                  </div>
                </div>

                {/* Camera Features Info */}
                <div className="mt-8 bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                  <h4 className="text-purple-400 font-semibold mb-2">Coming Soon</h4>
                  <p className="text-gray-300 text-sm">
                    This is the foundation for YourSpace's live streaming system. Full camera functionality, 
                    WebRTC integration, and collaborative streaming features will be added in upcoming phases.
                  </p>
                </div>

                {/* Feature Preview */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-black/20 border border-purple-500/20 rounded-lg p-4">
                    <h5 className="text-white font-medium mb-1">Live Streaming</h5>
                    <p className="text-gray-400 text-sm">Stream to your audience in real-time</p>
                  </div>
                  
                  <div className="bg-black/20 border border-purple-500/20 rounded-lg p-4">
                    <h5 className="text-white font-medium mb-1">Recording</h5>
                    <p className="text-gray-400 text-sm">Capture content for later editing</p>
                  </div>
                  
                  <div className="bg-black/20 border border-purple-500/20 rounded-lg p-4">
                    <h5 className="text-white font-medium mb-1">Collaboration</h5>
                    <p className="text-gray-400 text-sm">Co-stream with other creators</p>
                  </div>
                  
                  <div className="bg-black/20 border border-purple-500/20 rounded-lg p-4">
                    <h5 className="text-white font-medium mb-1">Screen Share</h5>
                    <p className="text-gray-400 text-sm">Share your screen during streams</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentView === 'placeholder' && (
            <div className="h-full flex flex-col p-6">
              <div className="flex-1 bg-gradient-to-br from-gray-900 to-black rounded-2xl border-2 border-purple-500/30 flex items-center justify-center relative overflow-hidden">
                {/* Camera Preview Placeholder */}
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <VideoCameraIcon className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Camera Preview Active</h3>
                  <p className="text-gray-400 mb-6">
                    This is where your camera feed would appear. Full implementation coming in Step 2.
                  </p>
                  
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={handleStopPreview}
                      className="flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
                    >
                      <StopIcon className="w-5 h-5" />
                      <span>Stop Preview</span>
                    </button>
                    
                    <button className="flex items-center space-x-2 px-6 py-3 bg-black/30 border border-gray-500/30 text-gray-300 rounded-lg hover:border-gray-400/50 transition-all">
                      <ComputerDesktopIcon className="w-5 h-5" />
                      <span>Settings</span>
                    </button>
                  </div>
                </div>
                
                {/* Status Indicator */}
                <div className="absolute top-4 left-4 flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-white text-sm font-medium">PREVIEW</span>
                </div>
                
                {/* Mock Controls */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                  <button className="w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all">
                    <MicrophoneIcon className="w-6 h-6 text-white" />
                  </button>
                  <button className="w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all">
                    <VideoCameraIcon className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
