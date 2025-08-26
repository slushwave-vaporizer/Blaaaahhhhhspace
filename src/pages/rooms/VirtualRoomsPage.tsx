// Virtual Rooms Gallery Page
// Public page showing featured virtual rooms

import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useVirtualRooms, VirtualRoom } from '../../hooks/useVirtualRooms'
import { VirtualRoom as VirtualRoomComponent } from '../../components/room/VirtualRoom'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { 
  BuildingLibraryIcon,
  EyeIcon,
  HeartIcon,
  UserIcon
} from '@heroicons/react/24/outline'

export const VirtualRoomsPage: React.FC = () => {
  const { getPublicRooms, loading } = useVirtualRooms()
  const [searchParams] = useSearchParams()
  const [featuredRooms, setFeaturedRooms] = useState<VirtualRoom[]>([])
  const [previewRoom, setPreviewRoom] = useState<VirtualRoom | null>(null)
  const [filteredArtist, setFilteredArtist] = useState<string | null>(null)

  useEffect(() => {
    const artistFilter = searchParams.get('artist')
    setFilteredArtist(artistFilter)
    loadFeaturedRooms(artistFilter)
  }, [searchParams])

  const loadFeaturedRooms = async (artistFilter?: string | null) => {
    const rooms = await getPublicRooms()
    let filteredRooms = rooms.filter(room => room.is_featured).slice(0, 12)
    
    // If artist filter is provided, show only rooms from that artist
    if (artistFilter && rooms.length > 0) {
      const artistRooms = rooms.filter(room => 
        room.profiles?.username === artistFilter ||
        room.profiles?.display_name?.toLowerCase().includes(artistFilter.toLowerCase())
      )
      if (artistRooms.length > 0) {
        filteredRooms = artistRooms
      }
    }
    
    setFeaturedRooms(filteredRooms)
  }

  if (loading && featuredRooms.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            {filteredArtist ? `${filteredArtist}'s Virtual Studios` : 'Virtual Creative Spaces'}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {filteredArtist 
              ? `Explore immersive 3D galleries and studios created by ${filteredArtist}.`
              : 'Explore immersive 3D galleries, studios, and creative spaces crafted by our community of artists and creators.'
            }
          </p>
          {filteredArtist && (
            <div className="mt-4">
              <Link
                to="/rooms"
                className="text-purple-300 hover:text-purple-200 text-sm underline transition-colors"
              >
                ← View all virtual rooms
              </Link>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex justify-center space-x-8 mb-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-300">{featuredRooms.length}</div>
            <div className="text-sm text-gray-400">Featured Rooms</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-300">1.2k+</div>
            <div className="text-sm text-gray-400">Total Visits</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-300">24</div>
            <div className="text-sm text-gray-400">Active Creators</div>
          </div>
        </div>
      </div>

      {/* Room Preview Modal */}
      {previewRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="max-w-6xl w-full mx-4">
            <div className="bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white">{previewRoom.name}</h3>
                  <p className="text-gray-400">{previewRoom.description}</p>
                </div>
                <button 
                  onClick={() => setPreviewRoom(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              <VirtualRoomComponent 
                roomId={previewRoom.id}
                roomData={previewRoom}
                height="500px"
                className="mb-4"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <EyeIcon className="h-4 w-4" />
                    <span>{previewRoom.visit_count} visits</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <HeartIcon className="h-4 w-4" />
                    <span>{previewRoom.like_count} likes</span>
                  </div>
                </div>
                <Link
                  to={`/rooms/${previewRoom.id}`}
                  className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white font-medium hover:from-pink-600 hover:to-purple-600 transition-all duration-200"
                >
                  Enter Room
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Featured Rooms Grid */}
      <div className="max-w-7xl mx-auto">
        {featuredRooms.length === 0 ? (
          <div className="text-center py-16">
            <BuildingLibraryIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              {filteredArtist ? `No virtual rooms found for ${filteredArtist}` : 'No featured rooms yet'}
            </h3>
            <p className="text-gray-500">
              {filteredArtist 
                ? 'This artist hasn\'t created any virtual rooms yet. Check back soon!'
                : 'Check back soon for amazing virtual spaces created by our community!'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRooms.map((room) => (
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
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-purple-300 transition-colors">
                        {room.name}
                      </h3>
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {room.description}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full capitalize">
                      {room.room_type}
                    </span>
                  </div>
                  
                  {/* Creator Info */}
                  {room.profiles && (
                    <div className="flex items-center space-x-2 mb-4">
                      <UserIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-400">by</span>
                      <span className="text-sm font-medium text-purple-300">
                        {room.profiles.display_name || room.profiles.username}
                      </span>
                    </div>
                  )}
                  
                  {/* Stats */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <EyeIcon className="h-3 w-3" />
                        <span>{room.visit_count}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <HeartIcon className="h-3 w-3" />
                        <span>{room.like_count}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setPreviewRoom(room)}
                      className="flex-1 py-2 px-4 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg text-sm font-medium text-gray-300 hover:text-white transition-all duration-200"
                    >
                      Preview
                    </button>
                    <Link
                      to={`/rooms/${room.id}`}
                      className="flex-1 py-2 px-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 rounded-lg text-sm font-medium text-white transition-all duration-200 text-center"
                    >
                      Enter
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}