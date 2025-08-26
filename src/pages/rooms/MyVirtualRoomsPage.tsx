// My Virtual Rooms Management Page
// Creator dashboard for managing personal virtual rooms

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useVirtualRooms, VirtualRoom, VirtualRoomCreateData } from '../../hooks/useVirtualRooms'
import { VirtualRoom as VirtualRoomComponent } from '../../components/room/VirtualRoom'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { useAuth } from '../../hooks/useAuth'
import {
  PlusIcon,
  PencilIcon,
  EyeIcon,
  TrashIcon,
  GlobeAltIcon,
  LockClosedIcon,
  BuildingLibraryIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export const MyVirtualRoomsPage: React.FC = () => {
  const { user } = useAuth()
  const { getUserRooms, createRoom, deleteRoom, loading } = useVirtualRooms()
  const [myRooms, setMyRooms] = useState<VirtualRoom[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [deletingRoomId, setDeletingRoomId] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadMyRooms()
    }
  }, [user])

  const loadMyRooms = async () => {
    const rooms = await getUserRooms()
    setMyRooms(rooms)
  }

  const handleCreateRoom = async (roomData: VirtualRoomCreateData) => {
    const newRoom = await createRoom(roomData)
    if (newRoom) {
      setMyRooms(prev => [newRoom, ...prev])
      setShowCreateModal(false)
    }
  }

  const handleDeleteRoom = async (roomId: string) => {
    if (window.confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
      setDeletingRoomId(roomId)
      const success = await deleteRoom(roomId)
      if (success) {
        setMyRooms(prev => prev.filter(room => room.id !== roomId))
      }
      setDeletingRoomId(null)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Sign in Required</h2>
          <p className="text-gray-400 mb-6">You need to be signed in to manage virtual rooms.</p>
          <Link
            to="/login"
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white font-medium hover:from-pink-600 hover:to-purple-600 transition-all duration-200"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">
              My Virtual Rooms
            </h1>
            <p className="text-gray-400">
              Create and manage your immersive 3D spaces
            </p>
          </div>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white font-medium hover:from-pink-600 hover:to-purple-600 transition-all duration-200 neon-glow"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Create New Room</span>
          </button>
        </div>

        {/* Room Grid */}
        {loading && myRooms.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        ) : myRooms.length === 0 ? (
          <div className="text-center py-16">
            <BuildingLibraryIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No rooms yet</h3>
            <p className="text-gray-500 mb-6">Create your first virtual room to start showcasing your creativity!</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white font-medium hover:from-pink-600 hover:to-purple-600 transition-all duration-200"
            >
              Create Your First Room
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myRooms.map((room) => (
              <div
                key={room.id}
                className="bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 overflow-hidden hover:border-purple-400/40 transition-all duration-200 group"
              >
                <div className="aspect-video">
                  <VirtualRoomComponent 
                    roomId={room.id}
                    roomData={room}
                    height="100%"
                    enableControls={false}
                    readOnly={true}
                  />
                </div>
                
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {room.name}
                      </h3>
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {room.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {room.is_public ? (
                        <GlobeAltIcon className="h-4 w-4 text-green-400" title="Public" />
                      ) : (
                        <LockClosedIcon className="h-4 w-4 text-yellow-400" title="Private" />
                      )}
                      <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full capitalize">
                        {room.room_type}
                      </span>
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <EyeIcon className="h-3 w-3" />
                        <span>{room.visit_count} visits</span>
                      </div>
                      <div className="text-gray-600">•</div>
                      <span>
                        {new Date(room.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Link
                      to={`/rooms/${room.id}`}
                      className="flex-1 py-2 px-3 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg text-sm font-medium text-gray-300 hover:text-white transition-all duration-200 text-center"
                    >
                      View
                    </Link>
                    <Link
                      to={`/rooms/${room.id}/edit`}
                      className="flex-1 py-2 px-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 hover:border-blue-400/50 rounded-lg text-sm font-medium text-blue-300 hover:text-blue-200 transition-all duration-200 text-center"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteRoom(room.id)}
                      disabled={deletingRoomId === room.id}
                      className="p-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 hover:border-red-400/50 rounded-lg text-red-300 hover:text-red-200 transition-all duration-200 disabled:opacity-50"
                    >
                      {deletingRoomId === room.id ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <TrashIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Room Modal */}
        {showCreateModal && (
          <CreateRoomModal
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreateRoom}
            loading={loading}
          />
        )}
      </div>
    </div>
  )
}

// Create Room Modal Component
interface CreateRoomModalProps {
  onClose: () => void
  onCreate: (data: VirtualRoomCreateData) => void
  loading: boolean
}

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ onClose, onCreate, loading }) => {
  const [formData, setFormData] = useState<VirtualRoomCreateData>({
    name: '',
    description: '',
    room_type: 'gallery',
    is_public: false,
    theme: 'modern'
  })

  const roomTypes = [
    { value: 'gallery', label: 'Art Gallery', desc: 'Perfect for showcasing artwork and creative pieces' },
    { value: 'studio', label: 'Creative Studio', desc: 'Workspace for artists and creators' },
    { value: 'exhibition', label: 'Exhibition Hall', desc: 'Large space for special collections' },
    { value: 'lounge', label: 'Social Lounge', desc: 'Comfortable space for community interaction' },
    { value: 'workshop', label: 'Workshop', desc: 'Collaborative workspace for projects' },
    { value: 'office', label: 'Virtual Office', desc: 'Professional meeting and presentation space' }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error('Room name is required')
      return
    }
    onCreate(formData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="max-w-2xl w-full mx-4">
        <div className="bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Create New Virtual Room</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Room Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Room Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                  placeholder="Enter room name..."
                  maxLength={100}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 resize-none"
                  placeholder="Describe your virtual room..."
                  rows={3}
                  maxLength={500}
                />
              </div>

              {/* Room Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Room Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {roomTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData({...formData, room_type: type.value})}
                      className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                        formData.room_type === type.value
                          ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                          : 'bg-black/20 border-gray-600 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-gray-400 mt-1">{type.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Privacy */}
              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.is_public}
                    onChange={(e) => setFormData({...formData, is_public: e.target.checked})}
                    className="w-4 h-4 text-purple-600 bg-black/30 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-300">Make room public</span>
                    <p className="text-xs text-gray-400">Public rooms can be discovered and visited by anyone</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit */}
            <div className="flex space-x-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.name.trim()}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 rounded-lg text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? <LoadingSpinner size="sm" /> : 'Create Room'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}