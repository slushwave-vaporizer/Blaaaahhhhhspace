// Virtual Room Editor Page
// Interface for customizing and editing virtual rooms

import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useVirtualRooms, VirtualRoom } from '../../hooks/useVirtualRooms'
import { useRoomAssets } from '../../hooks/useRoomAssets'
import { VirtualRoom as VirtualRoomComponent } from '../../components/room/VirtualRoom'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { useAuth } from '../../hooks/useAuth'
import {
  ArrowLeftIcon,
  Cog6ToothIcon,
  PaintBrushIcon,
  CubeIcon,
  EyeIcon,
  CheckIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface EditorTab {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
}

const editorTabs: EditorTab[] = [
  { id: 'room', name: 'Room Settings', icon: Cog6ToothIcon },
  { id: 'appearance', name: 'Appearance', icon: PaintBrushIcon },
  { id: 'assets', name: 'Assets', icon: CubeIcon }
]

export const VirtualRoomEditorPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { getRoom, updateRoom, loading } = useVirtualRooms()
  const { getRoomAssets, roomAssets } = useRoomAssets()
  
  const [room, setRoom] = useState<VirtualRoom | null>(null)
  const [activeTab, setActiveTab] = useState('room')
  const [hasChanges, setHasChanges] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  useEffect(() => {
    if (roomId) {
      loadRoom(roomId)
      loadRoomAssets(roomId)
    }
  }, [roomId])

  const loadRoom = async (id: string) => {
    try {
      const roomData = await getRoom(id)
      if (roomData) {
        // Check if user owns this room
        if (user && roomData.user_id !== user.id) {
          navigate('/rooms', { replace: true })
          toast.error('You can only edit your own rooms')
          return
        }
        setRoom(roomData)
      } else {
        navigate('/rooms', { replace: true })
        toast.error('Room not found')
      }
    } catch (error) {
      console.error('Error loading room:', error)
      navigate('/rooms', { replace: true })
      toast.error('Failed to load room')
    }
  }

  const loadRoomAssets = async (id: string) => {
    await getRoomAssets(id)
  }

  const handleSaveRoom = async () => {
    if (!room || !roomId) return
    
    const success = await updateRoom(roomId, {
      name: room.name,
      description: room.description,
      room_type: room.room_type,
      is_public: room.is_public,
      theme: room.theme,
      background_color: room.background_color,
      floor_texture: room.floor_texture,
      wall_texture: room.wall_texture,
      ceiling_texture: room.ceiling_texture,
      ambient_lighting: room.ambient_lighting
    })
    
    if (success) {
      setHasChanges(false)
      toast.success('Room saved successfully!')
    }
  }

  const handleRoomChange = (updates: Partial<VirtualRoom>) => {
    if (room) {
      setRoom({ ...room, ...updates })
      setHasChanges(true)
    }
  }

  if (loading || !room) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-xl border-b border-purple-500/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/rooms/manage')}
              className="p-2 hover:bg-purple-500/20 rounded-lg text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">Room Editor</h1>
              <p className="text-gray-400">{room.name}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                previewMode
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
              }`}
            >
              <EyeIcon className="h-4 w-4 inline mr-2" />
              {previewMode ? 'Exit Preview' : 'Preview'}
            </button>
            
            {hasChanges && (
              <button
                onClick={handleSaveRoom}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg text-white font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50"
              >
                {loading ? <LoadingSpinner size="sm" /> : <CheckIcon className="h-4 w-4" />}
                <span>Save Changes</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Editor Sidebar */}
        {!previewMode && (
          <div className="w-80 bg-black/20 backdrop-blur-xl border-r border-purple-500/20 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-purple-500/20">
              {editorTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-2 text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-purple-500/20 text-purple-300 border-b-2 border-purple-400'
                      : 'text-gray-400 hover:text-gray-300 hover:bg-purple-500/10'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{tab.name}</span>
                </button>
              ))}
            </div>
            
            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'room' && (
                <RoomSettingsTab room={room} onChange={handleRoomChange} />
              )}
              {activeTab === 'appearance' && (
                <AppearanceTab room={room} onChange={handleRoomChange} />
              )}
              {activeTab === 'assets' && (
                <AssetsTab roomId={room.id} assets={roomAssets} />
              )}
            </div>
          </div>
        )}

        {/* 3D Room Preview */}
        <div className="flex-1">
          <VirtualRoomComponent 
            roomId={room.id}
            roomData={room}
            height="100%"
            enableControls={previewMode}
            readOnly={!previewMode}
          />
        </div>
      </div>
    </div>
  )
}

// Room Settings Tab
interface RoomSettingsTabProps {
  room: VirtualRoom
  onChange: (updates: Partial<VirtualRoom>) => void
}

const RoomSettingsTab: React.FC<RoomSettingsTabProps> = ({ room, onChange }) => {
  const roomTypes = [
    { value: 'gallery', label: 'Art Gallery' },
    { value: 'studio', label: 'Creative Studio' },
    { value: 'exhibition', label: 'Exhibition Hall' },
    { value: 'lounge', label: 'Social Lounge' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'office', label: 'Virtual Office' }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Basic Settings</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Room Name
            </label>
            <input
              type="text"
              value={room.name}
              onChange={(e) => onChange({ name: e.target.value })}
              className="w-full px-3 py-2 bg-black/30 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-400"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={room.description || ''}
              onChange={(e) => onChange({ description: e.target.value })}
              className="w-full px-3 py-2 bg-black/30 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-400 resize-none"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Room Type
            </label>
            <select
              value={room.room_type}
              onChange={(e) => onChange({ room_type: e.target.value as any })}
              className="w-full px-3 py-2 bg-black/30 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-400"
            >
              {roomTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={room.is_public}
                onChange={(e) => onChange({ is_public: e.target.checked })}
                className="w-4 h-4 text-purple-600 bg-black/30 border-gray-600 rounded focus:ring-purple-500"
              />
              <span className="text-sm text-gray-300">Make room public</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

// Appearance Tab
interface AppearanceTabProps {
  room: VirtualRoom
  onChange: (updates: Partial<VirtualRoom>) => void
}

const AppearanceTab: React.FC<AppearanceTabProps> = ({ room, onChange }) => {
  const themes = [
    { value: 'modern', label: 'Modern', colors: ['#ffffff', '#f5f5f5'] },
    { value: 'gallery', label: 'Gallery', colors: ['#fdfdfd', '#f0f0f0'] },
    { value: 'industrial', label: 'Industrial', colors: ['#e8e8e8', '#d0d0d0'] },
    { value: 'dark', label: 'Dark', colors: ['#2a2a2a', '#1a1a1a'] },
    { value: 'warm', label: 'Warm', colors: ['#f9f7f4', '#f0ebe3'] }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Theme & Colors</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Theme Preset
            </label>
            <div className="grid grid-cols-2 gap-2">
              {themes.map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => onChange({ theme: theme.value })}
                  className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                    room.theme === theme.value
                      ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                      : 'bg-black/20 border-gray-600 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="flex space-x-1">
                      {theme.colors.map((color, i) => (
                        <div
                          key={i}
                          className="w-3 h-3 rounded-full border border-gray-600"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{theme.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Background Color
            </label>
            <input
              type="color"
              value={room.background_color}
              onChange={(e) => onChange({ background_color: e.target.value })}
              className="w-full h-10 bg-black/30 border border-gray-600 rounded-lg cursor-pointer"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Ambient Light Intensity
            </label>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.1"
              value={room.ambient_lighting?.intensity || 0.3}
              onChange={(e) => onChange({ 
                ambient_lighting: {
                  ...room.ambient_lighting,
                  intensity: parseFloat(e.target.value)
                }
              })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Dim</span>
              <span>Bright</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Assets Tab
interface AssetsTabProps {
  roomId: string
  assets: any[]
}

const AssetsTab: React.FC<AssetsTabProps> = ({ roomId, assets }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Room Assets</h3>
        
        {assets.length === 0 ? (
          <div className="text-center py-8">
            <CubeIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-400">No assets in this room yet</p>
            <button className="mt-3 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-300 text-sm transition-all duration-200">
              Add Asset
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="p-3 bg-black/20 border border-gray-600 rounded-lg hover:border-gray-500 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">
                      {asset.asset_library?.name || 'Unnamed Asset'}
                    </h4>
                    <p className="text-xs text-gray-400">
                      {asset.asset_library?.category || 'Unknown'}
                    </p>
                  </div>
                  <button className="text-red-400 hover:text-red-300">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}