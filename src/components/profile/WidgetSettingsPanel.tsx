import React, { useState } from 'react'
import { WidgetConfig, WidgetType } from '../../hooks/useProfileBuilder'
import {
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
  TrashIcon,
  Cog6ToothIcon,
  ArrowsRightLeftIcon,
  ArrowsUpDownIcon
} from '@heroicons/react/24/outline'

interface WidgetSettingsPanelProps {
  widget: WidgetConfig
  onUpdate: (updates: Partial<WidgetConfig>) => void
  onClose: () => void
  className?: string
}

interface SettingsSection {
  title: string
  component: React.ComponentType<{ widget: WidgetConfig; onUpdate: (updates: Partial<WidgetConfig>) => void }>
}

// Generic settings components
const PositionSettings: React.FC<{ widget: WidgetConfig; onUpdate: (updates: Partial<WidgetConfig>) => void }> = ({ widget, onUpdate }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">X Position</label>
          <input
            type="number"
            value={widget.position.x}
            onChange={(e) => onUpdate({
              position: { ...widget.position, x: Math.max(0, parseInt(e.target.value) || 0) }
            })}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500"
            min="0"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">Y Position</label>
          <input
            type="number"
            value={widget.position.y}
            onChange={(e) => onUpdate({
              position: { ...widget.position, y: Math.max(0, parseInt(e.target.value) || 0) }
            })}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500"
            min="0"
          />
        </div>
      </div>
    </div>
  )
}

const SizeSettings: React.FC<{ widget: WidgetConfig; onUpdate: (updates: Partial<WidgetConfig>) => void }> = ({ widget, onUpdate }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">Width</label>
          <input
            type="number"
            value={widget.size.width}
            onChange={(e) => onUpdate({
              size: { ...widget.size, width: Math.max(1, parseInt(e.target.value) || 1) }
            })}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500"
            min="1"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">Height</label>
          <input
            type="number"
            value={widget.size.height}
            onChange={(e) => onUpdate({
              size: { ...widget.size, height: Math.max(1, parseInt(e.target.value) || 1) }
            })}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500"
            min="1"
          />
        </div>
      </div>
    </div>
  )
}

const VisibilitySettings: React.FC<{ widget: WidgetConfig; onUpdate: (updates: Partial<WidgetConfig>) => void }> = ({ widget, onUpdate }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={widget.isVisible}
            onChange={(e) => onUpdate({ isVisible: e.target.checked })}
            className="w-4 h-4 text-pink-500 bg-gray-800 border-gray-600 rounded focus:ring-pink-500 focus:ring-2"
          />
          <span className="text-sm text-gray-300">Show widget on profile</span>
        </label>
      </div>
      
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-2">Layer (Z-Index)</label>
        <input
          type="number"
          value={widget.zIndex}
          onChange={(e) => onUpdate({ zIndex: Math.max(0, parseInt(e.target.value) || 0) })}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500"
          min="0"
        />
        <div className="text-xs text-gray-500 mt-1">
          Higher values appear on top
        </div>
      </div>
    </div>
  )
}

// Widget-specific settings components
const PortfolioGallerySettings: React.FC<{ widget: WidgetConfig; onUpdate: (updates: Partial<WidgetConfig>) => void }> = ({ widget, onUpdate }) => {
  const data = widget.data || {}
  
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-2">Layout Style</label>
        <select
          value={data.layout || 'grid'}
          onChange={(e) => onUpdate({ data: { ...data, layout: e.target.value } })}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500"
        >
          <option value="grid">Grid</option>
          <option value="masonry">Masonry</option>
          <option value="carousel">Carousel</option>
        </select>
      </div>
      
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-2">Columns</label>
        <input
          type="number"
          value={data.columns || 3}
          onChange={(e) => onUpdate({ data: { ...data, columns: Math.max(1, parseInt(e.target.value) || 1) } })}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500"
          min="1"
          max="6"
        />
      </div>
      
      <div>
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.showCaptions || false}
            onChange={(e) => onUpdate({ data: { ...data, showCaptions: e.target.checked } })}
            className="w-4 h-4 text-pink-500 bg-gray-800 border-gray-600 rounded focus:ring-pink-500 focus:ring-2"
          />
          <span className="text-sm text-gray-300">Show captions</span>
        </label>
      </div>
    </div>
  )
}

const AboutSectionSettings: React.FC<{ widget: WidgetConfig; onUpdate: (updates: Partial<WidgetConfig>) => void }> = ({ widget, onUpdate }) => {
  const data = widget.data || {}
  
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-2">Title</label>
        <input
          type="text"
          value={data.title || 'About Me'}
          onChange={(e) => onUpdate({ data: { ...data, title: e.target.value } })}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500"
          placeholder="Section title"
        />
      </div>
      
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-2">Content</label>
        <textarea
          value={data.content || ''}
          onChange={(e) => onUpdate({ data: { ...data, content: e.target.value } })}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500 resize-none"
          rows={4}
          placeholder="Tell your story..."
        />
      </div>
      
      <div>
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.showAvatar || true}
            onChange={(e) => onUpdate({ data: { ...data, showAvatar: e.target.checked } })}
            className="w-4 h-4 text-pink-500 bg-gray-800 border-gray-600 rounded focus:ring-pink-500 focus:ring-2"
          />
          <span className="text-sm text-gray-300">Show avatar</span>
        </label>
      </div>
    </div>
  )
}

const SocialLinksSettings: React.FC<{ widget: WidgetConfig; onUpdate: (updates: Partial<WidgetConfig>) => void }> = ({ widget, onUpdate }) => {
  const data = widget.data || { links: [] }
  const links = data.links || []
  
  const addLink = () => {
    const newLinks = [...links, { platform: '', url: '', display: true }]
    onUpdate({ data: { ...data, links: newLinks } })
  }
  
  const removeLink = (index: number) => {
    const newLinks = links.filter((_: any, i: number) => i !== index)
    onUpdate({ data: { ...data, links: newLinks } })
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-400">Social Links</label>
        <button
          onClick={addLink}
          className="px-2 py-1 bg-pink-600 hover:bg-pink-700 text-white text-xs rounded-lg transition-colors"
        >
          Add Link
        </button>
      </div>
      
      {links.map((link: any, index: number) => (
        <div key={index} className="p-3 bg-gray-800 rounded-lg border border-gray-700">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <select
                value={link.platform || ''}
                onChange={(e) => {
                  const newLinks = [...links]
                  newLinks[index] = { ...link, platform: e.target.value }
                  onUpdate({ data: { ...data, links: newLinks } })
                }}
                className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs focus:outline-none focus:border-pink-500"
              >
                <option value="">Platform</option>
                <option value="twitter">Twitter</option>
                <option value="instagram">Instagram</option>
                <option value="linkedin">LinkedIn</option>
                <option value="github">GitHub</option>
                <option value="website">Website</option>
              </select>
              
              <button
                onClick={() => removeLink(index)}
                className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
              >
                Remove
              </button>
            </div>
            
            <input
              type="url"
              value={link.url || ''}
              onChange={(e) => {
                const newLinks = [...links]
                newLinks[index] = { ...link, url: e.target.value }
                onUpdate({ data: { ...data, links: newLinks } })
              }}
              className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs focus:outline-none focus:border-pink-500"
              placeholder="URL"
            />
          </div>
        </div>
      ))}
    </div>
  )
}

// Widget type to settings component mapping
const WIDGET_SETTINGS: Record<WidgetType, SettingsSection[]> = {
  'portfolio-gallery': [
    { title: 'Gallery Settings', component: PortfolioGallerySettings }
  ],
  'about-section': [
    { title: 'Content Settings', component: AboutSectionSettings }
  ],
  'social-links': [
    { title: 'Links Settings', component: SocialLinksSettings }
  ],
  'shop': [
    { title: 'Shop Settings', component: () => <div>Shop settings coming soon...</div> }
  ],
  'collaboration-board': [
    { title: 'Collaboration Settings', component: () => <div>Collaboration settings coming soon...</div> }
  ],
  'learning-progress': [
    { title: 'Learning Settings', component: () => <div>Learning settings coming soon...</div> }
  ],
  'audio-player': [
    { title: 'Audio Settings', component: () => <div>Audio settings coming soon...</div> }
  ],
  'video-showcase': [
    { title: 'Video Settings', component: () => <div>Video settings coming soon...</div> }
  ],
  'blog-updates': [
    { title: 'Blog Settings', component: () => <div>Blog settings coming soon...</div> }
  ],
  'contact': [
    { title: 'Contact Settings', component: () => <div>Contact settings coming soon...</div> }
  ],
  'statistics': [
    { title: 'Statistics Settings', component: () => <div>Statistics settings coming soon...</div> }
  ],
  'featured-content': [
    { title: 'Featured Settings', component: () => <div>Featured settings coming soon...</div> }
  ]
}

export const WidgetSettingsPanel: React.FC<WidgetSettingsPanelProps> = ({
  widget,
  onUpdate,
  onClose,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'appearance' | 'advanced'>('content')
  
  const widgetSettings = WIDGET_SETTINGS[widget.type] || []
  
  return (
    <div className={`h-full flex flex-col bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-white flex items-center">
            <Cog6ToothIcon className="w-5 h-5 text-pink-400 mr-2" />
            Widget Settings
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        
        <div className="text-sm text-gray-400 mb-3">
          {widget.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </div>
        
        {/* Quick Actions */}
        <div className="flex space-x-2">
          <button
            onClick={() => onUpdate({ isVisible: !widget.isVisible })}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              widget.isVisible
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-600 hover:bg-gray-700 text-gray-300'
            }`}
          >
            {widget.isVisible ? <EyeIcon className="w-3 h-3" /> : <EyeSlashIcon className="w-3 h-3" />}
            <span>{widget.isVisible ? 'Visible' : 'Hidden'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800">
        <div className="flex">
          {[
            { id: 'content' as const, label: 'Content' },
            { id: 'appearance' as const, label: 'Layout' },
            { id: 'advanced' as const, label: 'Advanced' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-pink-400 border-b-2 border-pink-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'content' && (
          <div className="space-y-6">
            {widgetSettings.map((section, index) => {
              const SettingsComponent = section.component
              return (
                <div key={index}>
                  <h3 className="text-sm font-medium text-gray-300 mb-3">{section.title}</h3>
                  <SettingsComponent widget={widget} onUpdate={onUpdate} />
                </div>
              )
            })}
          </div>
        )}
        
        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-3">Position</h3>
              <PositionSettings widget={widget} onUpdate={onUpdate} />
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-3">Size</h3>
              <SizeSettings widget={widget} onUpdate={onUpdate} />
            </div>
          </div>
        )}
        
        {activeTab === 'advanced' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-3">Visibility</h3>
              <VisibilitySettings widget={widget} onUpdate={onUpdate} />
            </div>
            
            <div className="pt-4 border-t border-gray-800">
              <h3 className="text-sm font-medium text-gray-300 mb-3">Widget Data</h3>
              <div className="p-3 bg-gray-800 rounded-lg">
                <pre className="text-xs text-gray-400 overflow-x-auto">
                  {JSON.stringify(widget.data, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}