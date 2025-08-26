// YourSpace Creative Labs - Discord-Style Collaboration Page
import { useState, useEffect, useRef } from 'react'
import { useChat } from '../../hooks/useChat'
import {
  ChatBubbleLeftRightIcon,
  MicrophoneIcon,
  SpeakerWaveIcon,
  PlusIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  UserIcon,
  HashtagIcon,
  SpeakerXMarkIcon,
  NoSymbolIcon
} from '@heroicons/react/24/outline'
import { formatRelativeTime } from '../../lib/utils'
import toast from 'react-hot-toast'

export const CollaboratePage = () => {
  const {
    rooms,
    messages,
    voiceSessions,
    voiceParticipants,
    loading,
    currentRoom,
    currentVoiceSession,
    createRoom,
    joinRoom,
    fetchRooms,
    setCurrentRoom,
    sendMessage,
    uploadFile,
    fetchMessages,
    startVoiceSession,
    joinVoiceSession,
    leaveVoiceSession,
    updateVoiceStatus,
    setCurrentVoiceSession
  } = useChat()

  const [newMessage, setNewMessage] = useState('')
  const [showCreateRoom, setShowCreateRoom] = useState(false)
  const [newRoomName, setNewRoomName] = useState('')
  const [newRoomDescription, setNewRoomDescription] = useState('')
  const [newRoomType, setNewRoomType] = useState<'text' | 'voice' | 'video'>('text')
  const [isPrivate, setIsPrivate] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currentRoomData = rooms.find(room => room.id === currentRoom)
  const currentRoomMessages = currentRoom ? messages[currentRoom] || [] : []
  const currentVoiceSessionData = voiceSessions.find(session => session.id === currentVoiceSession)
  const currentVoiceParticipants = currentVoiceSession ? voiceParticipants[currentVoiceSession] || [] : []

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentRoomMessages])

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRoomName.trim()) return

    try {
      await createRoom(newRoomName, newRoomDescription, newRoomType, isPrivate)
      setNewRoomName('')
      setNewRoomDescription('')
      setNewRoomType('text')
      setIsPrivate(false)
      setShowCreateRoom(false)
    } catch (error) {
      // Error is handled by useChat hook
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !currentRoom) return

    try {
      await sendMessage(currentRoom, newMessage.trim())
      setNewMessage('')
    } catch (error) {
      // Error is handled by useChat hook
    }
  }

  const handleFileUpload = async (file: File) => {
    if (!currentRoom) return

    try {
      const uploadResult = await uploadFile(file, currentRoom)
      
      const messageType = file.type.startsWith('image/') ? 'image' : 'file'
      
      await sendMessage(
        currentRoom, 
        `Shared: ${file.name}`, 
        messageType, 
        {
          url: uploadResult.url,
          filename: uploadResult.filename,
          size: uploadResult.size
        }
      )
      
      toast.success('File uploaded successfully!')
    } catch (error) {
      // Error is handled by useChat hook
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleStartVoiceChat = async () => {
    if (!currentRoom) return
    
    try {
      const session = await startVoiceSession(currentRoom)
      setCurrentVoiceSession(session.id)
    } catch (error) {
      // Error handled by useChat hook
    }
  }

  const handleJoinVoiceChat = async (sessionId: string) => {
    try {
      await joinVoiceSession(sessionId)
    } catch (error) {
      // Error handled by useChat hook
    }
  }

  const handleLeaveVoiceChat = async () => {
    if (!currentVoiceSession) return
    
    try {
      await leaveVoiceSession(currentVoiceSession)
      setCurrentVoiceSession(null)
    } catch (error) {
      // Error handled by useChat hook
    }
  }

  const toggleMute = async () => {
    if (!currentVoiceSession) return
    
    const newMutedState = !isMuted
    setIsMuted(newMutedState)
    await updateVoiceStatus(currentVoiceSession, newMutedState, isSpeaking)
  }

  return (
    <div className="h-full flex bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Sidebar - Rooms List */}
      <div className="w-80 bg-black/20 backdrop-blur-sm border-r border-purple-500/20 flex flex-col">
        <div className="p-4 border-b border-purple-500/20">
          <h2 className="text-xl font-bold text-white mb-4">Collaboration Rooms</h2>
          <button
            onClick={() => setShowCreateRoom(true)}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Create Room</span>
          </button>
        </div>

        {/* Rooms List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="loading-spinner w-6 h-6" />
            </div>
          ) : rooms.length > 0 ? (
            <div className="p-2 space-y-1">
              {rooms.map((room) => {
                const isActive = currentRoom === room.id
                const hasVoiceSession = voiceSessions.some(session => session.room_id === room.id && session.status === 'active')
                
                return (
                  <button
                    key={room.id}
                    onClick={() => setCurrentRoom(room.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      isActive 
                        ? 'bg-purple-500/30 border border-purple-400/50 text-white'
                        : 'hover:bg-purple-500/10 text-gray-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <HashtagIcon className="h-4 w-4 text-gray-400" />
                      <span className="font-medium truncate">{room.name}</span>
                      {hasVoiceSession && (
                        <SpeakerWaveIcon className="h-4 w-4 text-green-400" />
                      )}
                    </div>
                    {room.description && (
                      <p className="text-xs text-gray-400 mt-1 truncate">{room.description}</p>
                    )}
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="text-center p-8">
              <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No rooms available</p>
              <p className="text-gray-500 text-sm">Create a room to get started</p>
            </div>
          )}
        </div>

        {/* Voice Chat Controls */}
        {currentVoiceSession && (
          <div className="p-4 border-t border-purple-500/20 bg-green-500/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-400">Voice Chat Active</span>
              <span className="text-xs text-gray-400">
                {currentVoiceParticipants.length} participant{currentVoiceParticipants.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className={`p-2 rounded-lg transition-colors ${
                  isMuted ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                }`}
              >
                {isMuted ? (
                  <NoSymbolIcon className="h-4 w-4" />
                ) : (
                  <MicrophoneIcon className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={handleLeaveVoiceChat}
                className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
              >
                Leave Voice Chat
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentRoom ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-purple-500/20 bg-black/20 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <HashtagIcon className="h-6 w-6 text-purple-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">{currentRoomData?.name}</h3>
                    {currentRoomData?.description && (
                      <p className="text-sm text-gray-400">{currentRoomData.description}</p>
                    )}
                  </div>
                </div>
                
                {/* Voice Chat Button */}
                <div className="flex items-center space-x-2">
                  {currentVoiceSession ? (
                    <span className="text-sm text-green-400 flex items-center space-x-1">
                      <SpeakerWaveIcon className="h-4 w-4" />
                      <span>Voice Chat Active</span>
                    </span>
                  ) : (
                    <button
                      onClick={handleStartVoiceChat}
                      className="flex items-center space-x-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors"
                    >
                      <MicrophoneIcon className="h-4 w-4" />
                      <span>Start Voice Chat</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div 
              className={`flex-1 overflow-y-auto p-4 space-y-4 transition-all ${
                isDragging ? 'bg-purple-500/10 border-2 border-dashed border-purple-400' : ''
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {currentRoomMessages.length > 0 ? (
                currentRoomMessages.map((message) => (
                  <div key={message.id} className="flex space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {message.user_profile?.avatar_url ? (
                        <img 
                          src={message.user_profile.avatar_url} 
                          alt={message.user_profile.username}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        message.user_profile?.username?.charAt(0).toUpperCase() || 'U'
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-white">
                          {message.user_profile?.display_name || message.user_profile?.username || 'Unknown User'}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatRelativeTime(message.created_at)}
                        </span>
                      </div>
                      <div className="bg-black/30 rounded-lg p-3">
                        {message.message_type === 'text' ? (
                          <p className="text-gray-200">{message.content}</p>
                        ) : message.message_type === 'image' && message.file_url ? (
                          <div>
                            <img 
                              src={message.file_url} 
                              alt={message.file_name}
                              className="max-w-xs rounded-lg mb-2"
                            />
                            <p className="text-gray-200">{message.content}</p>
                          </div>
                        ) : message.file_url ? (
                          <div className="flex items-center space-x-2">
                            <PaperClipIcon className="h-4 w-4 text-purple-400" />
                            <a 
                              href={message.file_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-purple-300 hover:text-purple-200 underline"
                            >
                              {message.file_name}
                            </a>
                          </div>
                        ) : (
                          <p className="text-gray-200">{message.content}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <ChatBubbleLeftRightIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No messages yet</h3>
                  <p className="text-gray-400">Be the first to start the conversation!</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-purple-500/20 bg-black/20 backdrop-blur-sm">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-400 hover:text-purple-400 transition-colors"
                >
                  <PaperClipIcon className="h-5 w-5" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileUpload(file)
                  }}
                  className="hidden"
                  accept="image/*,video/*,audio/*,.pdf,.txt,.doc,.docx"
                />
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Message #${currentRoomData?.name}`}
                  className="flex-1 px-4 py-2 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          // No room selected
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <ChatBubbleLeftRightIcon className="h-24 w-24 text-gray-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-2">Welcome to Collaboration</h2>
              <p className="text-gray-400 mb-6">
                Select a room from the sidebar or create a new one to start collaborating
              </p>
              <button
                onClick={() => setShowCreateRoom(true)}
                className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
              >
                Create Your First Room
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Room Modal */}
      {showCreateRoom && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-black/80 border border-purple-500/30 rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Create New Room</h3>
            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Room Name
                </label>
                <input
                  type="text"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="Enter room name"
                  className="w-full px-4 py-2 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={newRoomDescription}
                  onChange={(e) => setNewRoomDescription(e.target.value)}
                  placeholder="Describe the purpose of this room"
                  rows={3}
                  className="w-full px-4 py-2 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Room Type
                </label>
                <select
                  value={newRoomType}
                  onChange={(e) => setNewRoomType(e.target.value as 'text' | 'voice' | 'video')}
                  className="w-full px-4 py-2 bg-black/30 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-400"
                >
                  <option value="text">Text Chat</option>
                  <option value="voice">Voice Chat</option>
                  <option value="video">Video Chat</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPrivate"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="w-4 h-4 text-purple-600 bg-black/30 border-purple-500/30 rounded focus:ring-purple-400"
                />
                <label htmlFor="isPrivate" className="text-sm text-gray-300">
                  Make this room private
                </label>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateRoom(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                >
                  Create Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
