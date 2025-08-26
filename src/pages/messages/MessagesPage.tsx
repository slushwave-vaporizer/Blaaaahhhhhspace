// YourSpace Creative Labs - Messages Page
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { 
  PaperAirplaneIcon,
  MagnifyingGlassIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';
import { formatRelativeTime } from '../../lib/utils';

// Mock data for conversations - in real app this would come from Supabase
const mockConversations = [
  {
    id: '1',
    participant: {
      id: '1',
      username: 'john_artist',
      display_name: 'John Artist',
      avatar_url: null,
      is_online: true
    },
    last_message: {
      content: 'Hey! I love your latest track. Would you be interested in collaborating?',
      created_at: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
    },
    unread_count: 2
  },
  {
    id: '2',
    participant: {
      id: '2',
      username: 'creative_sarah',
      display_name: 'Sarah Creative',
      avatar_url: null,
      is_online: false
    },
    last_message: {
      content: 'Thanks for the feedback on my virtual room design!',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
    },
    unread_count: 0
  },
  {
    id: '3',
    participant: {
      id: '3',
      username: 'music_producer',
      display_name: 'Alex Producer',
      avatar_url: null,
      is_online: true
    },
    last_message: {
      content: 'The mix sounds great! Ready to release?',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
    },
    unread_count: 0
  }
];

const mockMessages = [
  {
    id: '1',
    sender_id: '1',
    content: 'Hey! I love your latest track. Would you be interested in collaborating?',
    created_at: new Date(Date.now() - 1000 * 60 * 45),
    is_read: true
  },
  {
    id: '2',
    sender_id: 'current_user',
    content: 'Thanks! I would love to collaborate. What did you have in mind?',
    created_at: new Date(Date.now() - 1000 * 60 * 35),
    is_read: true
  },
  {
    id: '3',
    sender_id: '1',
    content: 'I was thinking we could create something with electronic and acoustic elements. I have some beats that might work well with your style.',
    created_at: new Date(Date.now() - 1000 * 60 * 30),
    is_read: false
  }
];

const MessagesPage = () => {
  const { profile } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<string>('1');
  const [messageText, setMessageText] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    
    // In real app, this would send to Supabase
    console.log('Sending message:', messageText);
    setMessageText('');
  };

  const getSelectedConversation = () => {
    return mockConversations.find(conv => conv.id === selectedConversation);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl overflow-hidden">
      {/* Conversations List */}
      <div className="w-80 border-r border-purple-500/20 flex flex-col">
        <div className="p-4 border-b border-purple-500/20">
          <h2 className="text-xl font-bold text-white mb-4">Messages</h2>
          
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {mockConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation.id)}
              className={`p-4 border-b border-purple-500/10 cursor-pointer hover:bg-purple-500/10 transition-colors ${
                selectedConversation === conversation.id ? 'bg-purple-500/20' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                    {conversation.participant.avatar_url ? (
                      <img 
                        src={conversation.participant.avatar_url} 
                        alt={conversation.participant.display_name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-semibold">
                        {conversation.participant.display_name.charAt(0)}
                      </span>
                    )}
                  </div>
                  {conversation.participant.is_online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-gray-900 rounded-full"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-white truncate">
                      {conversation.participant.display_name}
                    </h3>
                    {conversation.unread_count > 0 && (
                      <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                        {conversation.unread_count}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 truncate">
                    {conversation.last_message.content}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatRelativeTime(conversation.last_message.created_at)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* New Message Button */}
        <div className="p-4 border-t border-purple-500/20">
          <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white font-medium hover:from-pink-600 hover:to-purple-600 transition-all duration-200">
            <UserPlusIcon className="h-4 w-4" />
            <span>New Message</span>
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-purple-500/20 bg-gray-900/30">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {getSelectedConversation()?.participant.display_name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-white">
                    {getSelectedConversation()?.participant.display_name}
                  </h3>
                  <p className="text-sm text-gray-400">
                    @{getSelectedConversation()?.participant.username}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {mockMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender_id === 'current_user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender_id === 'current_user'
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                        : 'bg-gray-800 text-gray-100'
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender_id === 'current_user' 
                        ? 'text-purple-100' 
                        : 'text-gray-400'
                    }`}>
                      {formatRelativeTime(message.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-purple-500/20">
              <form onSubmit={handleSendMessage} className="flex space-x-4">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  disabled={!messageText.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white font-medium hover:from-pink-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <PaperAirplaneIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Select a conversation</h3>
              <p className="text-gray-400">Choose a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
