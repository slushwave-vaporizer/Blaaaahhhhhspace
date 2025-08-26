// YourSpace Creative Labs - EPK Computer Modal
import { useState } from 'react'
import { useEPK } from '../../hooks/useEPK'
import { EPKBuilder } from '../epk/EPKBuilder'
import {
  XMarkIcon,
  DocumentDuplicateIcon,
  ComputerDesktopIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { cn } from '../../lib/utils'

interface EPKComputerModalProps {
  isOpen: boolean
  onClose: () => void
}

export const EPKComputerModal = ({ isOpen, onClose }: EPKComputerModalProps) => {
  const { hasEPK, epk } = useEPK()
  const [currentView, setCurrentView] = useState<'computer' | 'builder' | 'preview'>('computer')

  if (!isOpen) return null

  const handleStartEPK = () => {
    setCurrentView('builder')
  }

  const handleBackToComputer = () => {
    setCurrentView('computer')
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black/90 border border-purple-500/30 rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <ComputerDesktopIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {currentView === 'computer' ? 'EPK Computer' : 
                 currentView === 'builder' ? 'EPK Builder' : 'EPK Preview'}
              </h2>
              <p className="text-gray-400 text-sm">
                {currentView === 'computer' ? 'Create and manage your Electronic Press Kit' :
                 currentView === 'builder' ? 'Build your professional EPK' : 'Preview your EPK'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {currentView !== 'computer' && (
              <button
                onClick={handleBackToComputer}
                className="px-4 py-2 bg-gray-600/20 border border-gray-500/30 rounded-lg text-gray-300 hover:text-white hover:border-gray-400/50 transition-all"
              >
                Back to Computer
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
          {currentView === 'computer' && (
            <div className="h-full flex flex-col items-center justify-center p-8">
              {/* Computer Interface */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-purple-500/20 max-w-2xl w-full">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <DocumentDuplicateIcon className="w-10 h-10 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {hasEPK ? 'Your EPK' : 'Electronic Press Kit'}
                  </h3>
                  
                  <p className="text-gray-400 mb-6">
                    {hasEPK 
                      ? `Welcome back! Your EPK "${epk?.artist_name}" is ready to view and edit.`
                      : 'Create a professional Electronic Press Kit to showcase your work to industry professionals.'
                    }
                  </p>
                </div>

                {/* EPK Actions */}
                <div className="space-y-4">
                  {hasEPK ? (
                    <>
                      <button
                        onClick={handleStartEPK}
                        className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
                      >
                        <SparklesIcon className="w-5 h-5" />
                        <span>Edit Your EPK</span>
                      </button>
                      
                      <button
                        onClick={() => setCurrentView('preview')}
                        className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-black/30 border border-purple-500/30 text-purple-300 rounded-xl font-semibold hover:bg-purple-500/20 transition-all"
                      >
                        <DocumentDuplicateIcon className="w-5 h-5" />
                        <span>View EPK</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleStartEPK}
                        className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
                      >
                        <SparklesIcon className="w-5 h-5" />
                        <span>Create Your First EPK</span>
                      </button>
                      
                      <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                        <h4 className="text-purple-400 font-semibold mb-2">What's an EPK?</h4>
                        <p className="text-gray-300 text-sm">
                          An Electronic Press Kit is a digital portfolio that showcases your music, 
                          photos, biography, press coverage, and contact information. It's essential 
                          for booking shows, getting press coverage, and connecting with industry professionals.
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* EPK Features */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="bg-black/20 border border-purple-500/20 rounded-lg p-4">
                    <h5 className="text-white font-medium mb-1">Professional Design</h5>
                    <p className="text-gray-400 text-sm">Beautiful, industry-standard layouts</p>
                  </div>
                  
                  <div className="bg-black/20 border border-purple-500/20 rounded-lg p-4">
                    <h5 className="text-white font-medium mb-1">Easy Export</h5>
                    <p className="text-gray-400 text-sm">Download as HTML or share online</p>
                  </div>
                  
                  <div className="bg-black/20 border border-purple-500/20 rounded-lg p-4">
                    <h5 className="text-white font-medium mb-1">Auto-Populate</h5>
                    <p className="text-gray-400 text-sm">Uses your YourSpace profile data</p>
                  </div>
                  
                  <div className="bg-black/20 border border-purple-500/20 rounded-lg p-4">
                    <h5 className="text-white font-medium mb-1">Press Ready</h5>
                    <p className="text-gray-400 text-sm">Industry-standard format</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentView === 'builder' && (
            <div className="h-full overflow-auto p-6">
              <EPKBuilder />
            </div>
          )}

          {currentView === 'preview' && hasEPK && (
            <div className="h-full overflow-auto p-6">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                    {epk?.artist_name}
                  </h1>
                  <p className="text-gray-300 text-lg">Electronic Press Kit Preview</p>
                </div>
                
                <div className="bg-black/20 border border-purple-500/20 rounded-2xl p-8">
                  <p className="text-gray-400 text-center">
                    EPK preview functionality will be implemented here.
                    For now, use the Edit EPK option to view and modify your EPK.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}