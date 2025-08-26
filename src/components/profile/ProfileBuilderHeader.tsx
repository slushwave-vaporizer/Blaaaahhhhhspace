import React, { useState } from 'react'
import { ProfileLayout } from '../../hooks/useProfileBuilder'
import {
  PlusIcon,
  EyeIcon,
  BookmarkIcon,
  Bars3Icon,
  TrashIcon,
  DocumentDuplicateIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon
} from '@heroicons/react/24/outline'

interface ProfileBuilderHeaderProps {
  layouts: ProfileLayout[]
  activeLayout: ProfileLayout | null
  onCreateLayout: (name: string) => Promise<void>
  onActivateLayout: (layoutId: string) => Promise<void>
  onDeleteLayout: (layoutId: string) => Promise<void>
  onSave: () => Promise<void>
  onPreview: () => void
  onToggleLibrary: () => void
}

export const ProfileBuilderHeader: React.FC<ProfileBuilderHeaderProps> = ({
  layouts,
  activeLayout,
  onCreateLayout,
  onActivateLayout,
  onDeleteLayout,
  onSave,
  onPreview,
  onToggleLibrary
}) => {
  const [showLayoutMenu, setShowLayoutMenu] = useState(false)
  const [newLayoutName, setNewLayoutName] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleCreateLayout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLayoutName.trim()) return

    await onCreateLayout(newLayoutName.trim())
    setNewLayoutName('')
    setShowCreateForm(false)
    setShowLayoutMenu(false)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave()
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteLayout = async (layoutId: string) => {
    if (layouts.length <= 1) {
      alert('Cannot delete the last layout')
      return
    }
    
    if (window.confirm('Are you sure you want to delete this layout?')) {
      await onDeleteLayout(layoutId)
    }
  }

  return (
    <header className="h-16 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 flex items-center justify-between px-6">
      {/* Left Side - Layout Controls */}
      <div className="flex items-center space-x-4">
        {/* Widget Library Toggle */}
        <button
          onClick={onToggleLibrary}
          className="p-2 text-gray-400 hover:text-pink-400 transition-colors"
          title="Toggle Widget Library"
        >
          <Bars3Icon className="w-5 h-5" />
        </button>

        {/* Layout Selector */}
        <div className="relative">
          <button
            onClick={() => setShowLayoutMenu(!showLayoutMenu)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition-colors"
          >
            <span className="text-white font-medium">
              {activeLayout?.name || 'No Layout'}
            </span>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showLayoutMenu && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
              <div className="p-2 max-h-60 overflow-y-auto">
                {/* Existing Layouts */}
                {layouts.map((layout) => (
                  <div
                    key={layout.id}
                    className={`flex items-center justify-between p-2 rounded-lg hover:bg-gray-700 ${
                      layout.isActive ? 'bg-pink-500/20 border border-pink-500/30' : ''
                    }`}
                  >
                    <button
                      onClick={() => {
                        onActivateLayout(layout.id)
                        setShowLayoutMenu(false)
                      }}
                      className="flex-1 text-left text-white hover:text-pink-400 transition-colors"
                    >
                      {layout.name}
                    </button>
                    
                    {layouts.length > 1 && (
                      <button
                        onClick={() => handleDeleteLayout(layout.id)}
                        className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                        title="Delete Layout"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}

                {/* Create New Layout */}
                <div className="border-t border-gray-700 mt-2 pt-2">
                  {showCreateForm ? (
                    <form onSubmit={handleCreateLayout} className="space-y-2">
                      <input
                        type="text"
                        value={newLayoutName}
                        onChange={(e) => setNewLayoutName(e.target.value)}
                        placeholder="Layout name"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                        autoFocus
                      />
                      <div className="flex space-x-2">
                        <button
                          type="submit"
                          className="flex-1 px-3 py-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          Create
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowCreateForm(false)
                            setNewLayoutName('')
                          }}
                          className="flex-1 px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      onClick={() => setShowCreateForm(true)}
                      className="w-full flex items-center space-x-2 p-2 text-gray-400 hover:text-pink-400 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <PlusIcon className="w-4 h-4" />
                      <span>New Layout</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center - Title */}
      <div className="flex-1 text-center">
        <h1 className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
          Profile Builder
        </h1>
        {activeLayout && (
          <div className="text-sm text-gray-400 mt-1">
            {activeLayout.widgets.length} widgets
          </div>
        )}
      </div>

      {/* Right Side - Actions */}
      <div className="flex items-center space-x-3">
        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white rounded-lg font-medium transition-colors"
        >
          <BookmarkIcon className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save'}</span>
        </button>

        {/* Preview Button */}
        <button
          onClick={onPreview}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <EyeIcon className="w-4 h-4" />
          <span>Preview</span>
        </button>

        {/* More Actions */}
        <div className="relative group">
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
          
          <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="p-2 space-y-1">
              <button className="w-full flex items-center space-x-2 p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                <DocumentDuplicateIcon className="w-4 h-4" />
                <span>Duplicate Layout</span>
              </button>
              <button className="w-full flex items-center space-x-2 p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                <ArrowDownTrayIcon className="w-4 h-4" />
                <span>Export Layout</span>
              </button>
              <button className="w-full flex items-center space-x-2 p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                <ArrowUpTrayIcon className="w-4 h-4" />
                <span>Import Layout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}