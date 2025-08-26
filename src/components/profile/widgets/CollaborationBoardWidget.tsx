import React, { useState } from 'react'
import { WidgetConfig } from '../../../hooks/useProfileBuilder'
import { UserGroupIcon, ClockIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'

interface CollaborationBoardWidgetProps {
  widget: WidgetConfig
}

export const CollaborationBoardWidget: React.FC<CollaborationBoardWidgetProps> = ({ widget }) => {
  const data = widget.data || {}
  
  // Mock collaboration data
  const collaborations = data.collaborations || [
    {
      id: '1',
      title: 'Cyberpunk Album Cover',
      type: 'project',
      status: 'active',
      collaborators: [
        { name: 'Sarah Kim', role: 'Musician', avatar: '/api/placeholder/32/32' },
        { name: 'Mike Chen', role: 'Producer', avatar: '/api/placeholder/32/32' }
      ],
      deadline: '2024-03-15',
      progress: 65,
      tags: ['Music', 'Visual Art']
    },
    {
      id: '2',
      title: 'NFT Collection Launch',
      type: 'project',
      status: 'recruiting',
      collaborators: [
        { name: 'Emma Davis', role: 'Developer', avatar: '/api/placeholder/32/32' }
      ],
      deadline: '2024-04-01',
      progress: 25,
      tags: ['NFT', 'Blockchain']
    },
    {
      id: '3',
      title: 'Looking for Motion Graphics Artist',
      type: 'opportunity',
      status: 'open',
      collaborators: [],
      deadline: '2024-02-28',
      progress: 0,
      tags: ['Motion Graphics', 'Animation']
    }
  ]

  const [activeTab, setActiveTab] = useState<'active' | 'recruiting' | 'open'>('active')
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'recruiting': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'open': return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircleIcon className="w-4 h-4" />
      case 'recruiting': return <ExclamationCircleIcon className="w-4 h-4" />
      case 'open': return <ClockIcon className="w-4 h-4" />
      default: return <ClockIcon className="w-4 h-4" />
    }
  }

  const filteredCollaborations = collaborations.filter(collab => collab.status === activeTab)

  return (
    <div className="w-full h-full p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-pink-400 flex items-center">
          <UserGroupIcon className="w-4 h-4 mr-1" />
          Collaborations
        </h3>
        <div className="text-xs text-gray-400">
          {collaborations.length} total
        </div>
      </div>
      
      {/* Status Tabs */}
      <div className="flex space-x-1 mb-4 bg-gray-800 rounded-lg p-1">
        {[
          { id: 'active' as const, label: 'Active', count: collaborations.filter(c => c.status === 'active').length },
          { id: 'recruiting' as const, label: 'Recruiting', count: collaborations.filter(c => c.status === 'recruiting').length },
          { id: 'open' as const, label: 'Open', count: collaborations.filter(c => c.status === 'open').length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-pink-600 text-white'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>
      
      {/* Collaborations List */}
      <div className="space-y-3 max-h-[calc(100%-8rem)] overflow-y-auto">
        {filteredCollaborations.length > 0 ? (
          filteredCollaborations.map((collab) => (
            <div
              key={collab.id}
              className="bg-gray-800 border border-gray-700 rounded-lg p-3 hover:border-pink-500/50 transition-colors"
            >
              {/* Title and Status */}
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-medium text-white pr-2">{collab.title}</h4>
                <div className={`flex items-center space-x-1 px-2 py-1 text-xs rounded-full border ${getStatusColor(collab.status)}`}>
                  {getStatusIcon(collab.status)}
                  <span className="capitalize">{collab.status}</span>
                </div>
              </div>
              
              {/* Progress Bar (for active projects) */}
              {collab.status === 'active' && collab.progress > 0 && (
                <div className="mb-2">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{collab.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${collab.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {/* Collaborators */}
              {collab.collaborators.length > 0 && (
                <div className="mb-2">
                  <div className="text-xs text-gray-400 mb-1">Collaborators</div>
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-1">
                      {collab.collaborators.slice(0, 3).map((collaborator, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full border-2 border-gray-800 flex items-center justify-center"
                          title={`${collaborator.name} (${collaborator.role})`}
                        >
                          <span className="text-xs text-white font-medium">
                            {collaborator.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      ))}
                      {collab.collaborators.length > 3 && (
                        <div className="w-6 h-6 bg-gray-700 rounded-full border-2 border-gray-800 flex items-center justify-center">
                          <span className="text-xs text-gray-400">+{collab.collaborators.length - 3}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-400">
                      {collab.collaborators.length} member{collab.collaborators.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Tags and Deadline */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-1">
                  {collab.tags.slice(0, 2).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 text-xs bg-gray-700 text-gray-300 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <ClockIcon className="w-3 h-3" />
                  <span>{new Date(collab.deadline).toLocaleDateString()}</span>
                </div>
              </div>
              
              {/* Action Button */}
              <div className="mt-3">
                <button className="w-full px-3 py-1.5 bg-pink-600/20 border border-pink-500/30 text-pink-400 text-xs rounded-lg hover:bg-pink-600/30 transition-colors">
                  {collab.status === 'active' ? 'View Project' : collab.status === 'recruiting' ? 'Join Project' : 'Apply'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6">
            <UserGroupIcon className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <div className="text-sm text-gray-400">No {activeTab} collaborations</div>
            <div className="text-xs text-gray-500 mt-1">
              {activeTab === 'open' ? 'Create new opportunities' : 'Start collaborating with others'}
            </div>
          </div>
        )}
      </div>
      
      {/* Quick Actions */}
      <div className="mt-4 pt-3 border-t border-gray-800">
        <div className="flex space-x-2">
          <button className="flex-1 px-3 py-2 bg-pink-600/20 border border-pink-500/30 text-pink-400 text-xs rounded-lg hover:bg-pink-600/30 transition-colors">
            New Project
          </button>
          <button className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 text-gray-400 text-xs rounded-lg hover:bg-gray-700 transition-colors">
            Find Partners
          </button>
        </div>
      </div>
    </div>
  )
}