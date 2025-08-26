import React from 'react'
import { ProfileLayout, WidgetConfig } from '../../hooks/useProfileBuilder'
import { WidgetRenderer } from './WidgetRenderer'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface ProfilePreviewProps {
  layout: ProfileLayout | null
  widgets: WidgetConfig[]
  onExitPreview: () => void
  className?: string
}

export const ProfilePreview: React.FC<ProfilePreviewProps> = ({
  layout,
  widgets,
  onExitPreview,
  className = ''
}) => {
  if (!layout) {
    return (
      <div className={`min-h-screen bg-black text-white flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="text-gray-400 text-lg mb-4">No layout selected</div>
          <button
            onClick={onExitPreview}
            className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors"
          >
            Back to Editor
          </button>
        </div>
      </div>
    )
  }

  const visibleWidgets = widgets
    .filter(widget => widget.isVisible)
    .sort((a, b) => a.zIndex - b.zIndex)

  return (
    <div className={`min-h-screen bg-black text-white ${className}`}>
      {/* Preview Header */}
      <div className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-white">Profile Preview</h1>
              <div className="text-sm text-gray-400">Layout: {layout.name}</div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-400">
                {visibleWidgets.length} visible widgets
              </div>
              
              <button
                onClick={onExitPreview}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white rounded-lg transition-colors"
              >
                <XMarkIcon className="w-4 h-4" />
                <span>Exit Preview</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="relative">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(rgba(236, 72, 153, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(236, 72, 153, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />
          
          {/* Gradient Orbs */}
          <div className="absolute top-20 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl" />
          <div className="absolute top-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        {/* Widget Container */}
        <div className="relative max-w-6xl mx-auto p-6">
          {visibleWidgets.length > 0 ? (
            <div className="relative">
              {/* Render widgets in a responsive grid */}
              <div className="grid grid-cols-12 gap-4 auto-rows-min">
                {visibleWidgets.map((widget) => {
                  // Calculate responsive grid positioning
                  const colSpan = Math.min(12, Math.max(1, Math.floor(widget.size.width / 2)))
                  const rowSpan = Math.max(1, Math.floor(widget.size.height / 3))
                  
                  return (
                    <div
                      key={widget.id}
                      className={`bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden hover:border-pink-500/30 transition-all duration-300`}
                      style={{
                        gridColumn: `span ${colSpan}`,
                        minHeight: `${rowSpan * 120}px`
                      }}
                    >
                      <WidgetRenderer widget={widget} />
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="flex items-center justify-center min-h-96">
              <div className="text-center p-8">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-400 mb-2">No Visible Widgets</h3>
                <p className="text-gray-500 mb-4 max-w-md">
                  This layout doesn't have any visible widgets. Add some widgets and make them visible to see your profile in action.
                </p>
                <button
                  onClick={onExitPreview}
                  className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors"
                >
                  Back to Editor
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between text-sm text-gray-400">
              <div>
                Profile preview for <span className="text-white font-medium">{layout.name}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span>Last updated: {new Date(layout.updatedAt).toLocaleDateString()}</span>
                <span>•</span>
                <span>{visibleWidgets.length} widgets active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}