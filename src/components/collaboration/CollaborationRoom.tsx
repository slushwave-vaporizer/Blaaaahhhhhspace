// YourSpace Creative Labs - Collaboration Room Component
import { useState, useEffect } from 'react'
import { useCollaboration } from '../../hooks/useCollaboration'
import { 
  XMarkIcon,
  UsersIcon,
  ShareIcon,
  PaintBrushIcon,
  CodeBracketIcon,
  MusicalNoteIcon,
  VideoCameraIcon,
  PlayIcon,
  PauseIcon,
  StopIcon
} from '@heroicons/react/24/outline'
import { cn } from '../../lib/utils'

interface CollaborationRoomProps {
  roomId: string
  onLeave: () => void
}

export const CollaborationRoom = ({ roomId, onLeave }: CollaborationRoomProps) => {
  const { activeRoom, participants, leaveCollaboration } = useCollaboration()
  const [roomStatus, setRoomStatus] = useState<'active' | 'paused'>('active')
  const [isRecording, setIsRecording] = useState(false)
  
  const handleLeaveRoom = async () => {
    await leaveCollaboration(roomId)
    onLeave()
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'canvas': return PaintBrushIcon
      case 'code': return CodeBracketIcon
      case 'music': return MusicalNoteIcon
      case 'video': return VideoCameraIcon
      default: return PaintBrushIcon
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'canvas': return 'from-pink-500 to-purple-500'
      case 'code': return 'from-blue-500 to-cyan-500'
      case 'music': return 'from-purple-500 to-blue-500'
      case 'video': return 'from-orange-500 to-pink-500'
      default: return 'from-pink-500 to-purple-500'
    }
  }

  if (!activeRoom) {
    return (
      <div className="text-center py-12">
        <div className="loading-spinner w-8 h-8 mx-auto" />
        <p className="text-gray-400 mt-4">Loading collaboration room...</p>
      </div>
    )
  }

  const TypeIcon = getTypeIcon(activeRoom.type)

  return (
    <div className="h-screen flex flex-col bg-black/20">
      {/* Room Header */}
      <div className="bg-black/40 backdrop-blur-sm border-b border-purple-500/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${getTypeColor(activeRoom.type)} flex items-center justify-center`}>
              <TypeIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{activeRoom.title}</h1>
              <p className="text-gray-400 text-sm capitalize">{activeRoom.type} collaboration</p>
            </div>
            <div className={cn(
              'px-3 py-1 rounded-full text-xs font-medium',
              roomStatus === 'active'
                ? 'bg-green-500/20 text-green-400'
                : 'bg-yellow-500/20 text-yellow-400'
            )}>
              {roomStatus}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Participants */}
            <div className="flex items-center space-x-2">
              <UsersIcon className="h-4 w-4 text-gray-400" />
              <div className="flex -space-x-2">
                {participants.slice(0, 5).map((participant, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 border-2 border-black flex items-center justify-center"
                    title={participant.profiles?.display_name || participant.profiles?.username}
                  >
                    {participant.profiles?.avatar_url ? (
                      <img 
                        src={participant.profiles.avatar_url} 
                        alt={participant.profiles.display_name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-xs font-semibold">
                        {(participant.profiles?.display_name || participant.profiles?.username || 'U').charAt(0)}
                      </span>
                    )}
                  </div>
                ))}
                {participants.length > 5 && (
                  <div className="w-8 h-8 rounded-full bg-gray-600 border-2 border-black flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">
                      +{participants.length - 5}
                    </span>
                  </div>
                )}
              </div>
              <span className="text-gray-400 text-sm ml-2">
                {participants.length} participant{participants.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Room Controls */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setRoomStatus(roomStatus === 'active' ? 'paused' : 'active')}
                className="p-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-300 hover:bg-purple-500/30 transition-colors"
                title={roomStatus === 'active' ? 'Pause session' : 'Resume session'}
              >
                {roomStatus === 'active' ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
              </button>
              
              <button 
                onClick={() => setIsRecording(!isRecording)}
                className={cn(
                  'p-2 border rounded-lg transition-colors',
                  isRecording
                    ? 'bg-red-500/20 border-red-500/30 text-red-400'
                    : 'bg-purple-500/20 border-purple-500/30 text-purple-300 hover:bg-purple-500/30'
                )}
                title={isRecording ? 'Stop recording' : 'Start recording'}
              >
                <div className={cn(
                  'w-4 h-4 rounded-full',
                  isRecording ? 'bg-red-400' : 'border-2 border-current'
                )} />
              </button>

              <button className="p-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-300 hover:bg-purple-500/30 transition-colors">
                <ShareIcon className="h-4 w-4" />
              </button>

              <button 
                onClick={handleLeaveRoom}
                className="p-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Collaboration Workspace */}
      <div className="flex-1 p-6">
        {activeRoom.type === 'canvas' && <CanvasWorkspace />}
        {activeRoom.type === 'code' && <CodeWorkspace />}
        {activeRoom.type === 'music' && <MusicWorkspace />}
        {activeRoom.type === 'video' && <VideoWorkspace />}
      </div>
    </div>
  )
}

// Workspace Components
const CanvasWorkspace = () => (
  <div className="h-full bg-black/30 border border-purple-500/20 rounded-xl flex items-center justify-center">
    <div className="text-center">
      <PaintBrushIcon className="h-16 w-16 text-purple-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">Digital Canvas</h3>
      <p className="text-gray-400">
        Real-time collaborative drawing workspace coming soon!
      </p>
    </div>
  </div>
)

const CodeWorkspace = () => (
  <div className="h-full bg-black/30 border border-purple-500/20 rounded-xl flex items-center justify-center">
    <div className="text-center">
      <CodeBracketIcon className="h-16 w-16 text-blue-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">Code Editor</h3>
      <p className="text-gray-400">
        Live collaborative coding environment coming soon!
      </p>
    </div>
  </div>
)

const MusicWorkspace = () => (
  <div className="h-full bg-black/30 border border-purple-500/20 rounded-xl flex items-center justify-center">
    <div className="text-center">
      <MusicalNoteIcon className="h-16 w-16 text-purple-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">Music Studio</h3>
      <p className="text-gray-400">
        Multi-track collaborative music production coming soon!
      </p>
    </div>
  </div>
)

const VideoWorkspace = () => (
  <div className="h-full bg-black/30 border border-purple-500/20 rounded-xl flex items-center justify-center">
    <div className="text-center">
      <VideoCameraIcon className="h-16 w-16 text-orange-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">Video Studio</h3>
      <p className="text-gray-400">
        Real-time video editing and effects coming soon!
      </p>
    </div>
  </div>
)