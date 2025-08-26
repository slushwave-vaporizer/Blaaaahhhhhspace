// Individual Virtual Room View Page
// Full-screen immersive room experience

import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useVirtualRooms, VirtualRoom } from '../../hooks/useVirtualRooms'
import { VirtualRoom as VirtualRoomComponent } from '../../components/room/VirtualRoom.full'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { useAuth } from '../../hooks/useAuth'
import {
  ArrowLeftIcon,
  EyeIcon,
  HeartIcon,
  ShareIcon,
  UserIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export const VirtualRoomViewPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { getRoom, loading } = useVirtualRooms()
  const [room, setRoom] = useState<VirtualRoom | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    if (roomId) {
      loadRoom(roomId)
    }
  }, [roomId])

  const loadRoom = async (id: string) => {
    try {
      const roomData = await getRoom(id)
      if (roomData) {
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

  const handleRoomInteraction = (type: string, data: any) => {
    console.log('Room interaction:', type, data)
    // Handle different interaction types
    switch (type) {
      case 'room_enter':
        console.log('User entered room')
        break
      case 'room_exit':
        console.log('User exited room')
        break
      case 'asset_interaction':
        console.log('User interacted with asset:', data.assetId)
        break
      case 'player_move':
        // Optional: track user movement for analytics
        break
    }
  }

  const handleLike = async () => {
    if (!user) {
      toast.error('Please sign in to like rooms')
      return
    }
    // TODO: Implement like functionality
    setLiked(!liked)
    toast.success(liked ? 'Removed from favorites' : 'Added to favorites')
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${room?.name} - Virtual Room`,
          text: room?.description || 'Check out this amazing virtual space!',
          url: window.location.href,
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast.success('Room link copied to clipboard!')
    }
  }

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
    setIsFullscreen(!isFullscreen)
  }

  if (loading || !room) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const isOwner = user && room.user_id === user.id

  return (
    <div className="min-h-screen bg-black">
      {/* Header Controls */}
      {!isFullscreen && (
        <div className="absolute top-0 left-0 right-0 z-10 bg-black/50 backdrop-blur-sm border-b border-purple-500/20">
          <div className="flex items-center justify-between p-4">
            {/* Left: Back and Room Info */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-purple-500/20 rounded-lg text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              
              <div>
                <h1 className="text-lg font-semibold text-white">{room.name}</h1>
                <div className="flex items-center space-x-3 text-sm text-gray-400">
                  {room.profiles && (
                    <div className="flex items-center space-x-1">
                      <UserIcon className="h-4 w-4" />
                      <span>{room.profiles.display_name || room.profiles.username}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <EyeIcon className="h-4 w-4" />
                    <span>{room.visit_count} visits</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleLike}
                className={`p-2 rounded-lg transition-colors ${
                  liked ? 'bg-pink-500/20 text-pink-300' : 'hover:bg-purple-500/20 text-gray-300 hover:text-white'
                }`}
              >
                <HeartIcon className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
              </button>
              
              <button
                onClick={handleShare}
                className="p-2 hover:bg-purple-500/20 rounded-lg text-gray-300 hover:text-white transition-colors"
              >
                <ShareIcon className="h-5 w-5" />
              </button>
              
              {isOwner && (
                <Link
                  to={`/rooms/${room.id}/edit`}
                  className="p-2 hover:bg-purple-500/20 rounded-lg text-gray-300 hover:text-white transition-colors"
                >
                  <Cog6ToothIcon className="h-5 w-5" />
                </Link>
              )}
              
              <button
                onClick={toggleFullscreen}
                className="px-3 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white text-sm font-medium hover:from-pink-600 hover:to-purple-600 transition-all duration-200"
              >
                Fullscreen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Virtual Room */}
      <div className={isFullscreen ? 'fixed inset-0 z-50' : 'h-screen pt-16'}>
        <VirtualRoomComponent 
          roomId={room.id}
          roomData={room}
          height="100%"
          onInteraction={handleRoomInteraction}
          enableControls={true}
          readOnly={!isOwner}
        />
      </div>

      {/* Fullscreen Exit Button */}
      {isFullscreen && (
        <button
          onClick={toggleFullscreen}
          className="fixed top-4 right-4 z-50 px-4 py-2 bg-black/70 backdrop-blur-sm rounded-lg text-white hover:bg-black/80 transition-colors"
        >
          Exit Fullscreen
        </button>
      )}
    </div>
  )
}