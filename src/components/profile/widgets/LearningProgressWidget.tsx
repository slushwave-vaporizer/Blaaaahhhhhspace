import React from 'react'
import { WidgetConfig } from '../../../hooks/useProfileBuilder'
import { AcademicCapIcon, StarIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

interface LearningProgressWidgetProps {
  widget: WidgetConfig
}

export const LearningProgressWidget: React.FC<LearningProgressWidgetProps> = ({ widget }) => {
  const data = widget.data || {}
  
  // Mock learning data
  const learningData = {
    totalHours: 487,
    completedCourses: 24,
    currentStreak: 15,
    skillLevel: 'Advanced',
    badges: [
      { id: '1', name: 'Digital Art Master', icon: '🎨', earned: true, date: '2024-01-15' },
      { id: '2', name: '3D Modeling Pro', icon: '🔮', earned: true, date: '2024-02-01' },
      { id: '3', name: 'Animation Expert', icon: '🎬', earned: false, progress: 80 },
      { id: '4', name: 'UI/UX Designer', icon: '📱', earned: false, progress: 45 }
    ],
    currentCourses: [
      {
        id: '1',
        title: 'Advanced Blender Techniques',
        progress: 78,
        instructor: 'Maya Rodriguez',
        category: '3D Modeling',
        nextLesson: 'Particle Systems',
        estimatedCompletion: '3 days'
      },
      {
        id: '2',
        title: 'Motion Graphics Mastery',
        progress: 34,
        instructor: 'Alex Turner',
        category: 'Animation',
        nextLesson: 'Keyframe Animation',
        estimatedCompletion: '2 weeks'
      }
    ],
    skills: [
      { name: 'Digital Art', level: 95, category: 'Creative' },
      { name: '3D Modeling', level: 88, category: 'Technical' },
      { name: 'Animation', level: 72, category: 'Creative' },
      { name: 'UI/UX Design', level: 65, category: 'Design' }
    ]
  }

  const getSkillColor = (level: number) => {
    if (level >= 90) return 'from-pink-500 to-purple-500'
    if (level >= 70) return 'from-blue-500 to-cyan-500'
    if (level >= 50) return 'from-green-500 to-emerald-500'
    return 'from-yellow-500 to-orange-500'
  }

  return (
    <div className="w-full h-full p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-pink-400 flex items-center">
          <AcademicCapIcon className="w-4 h-4 mr-1" />
          Learning Progress
        </h3>
        <div className="text-xs text-gray-400">
          {learningData.skillLevel}
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-pink-400">{learningData.totalHours}</div>
          <div className="text-xs text-gray-400">Hours</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-pink-400">{learningData.completedCourses}</div>
          <div className="text-xs text-gray-400">Courses</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-pink-400">{learningData.currentStreak}</div>
          <div className="text-xs text-gray-400">Day Streak</div>
        </div>
      </div>
      
      {/* Current Courses */}
      <div className="mb-4">
        <h4 className="text-xs font-medium text-gray-400 mb-2">Current Courses</h4>
        <div className="space-y-2">
          {learningData.currentCourses.map((course) => (
            <div key={course.id} className="bg-gray-800 border border-gray-700 rounded-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h5 className="text-sm font-medium text-white">{course.title}</h5>
                  <div className="text-xs text-gray-400 mt-1">
                    by {course.instructor} • {course.category}
                  </div>
                </div>
                <div className="text-xs text-pink-400 font-medium">
                  {course.progress}%
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                <div 
                  className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Next: {course.nextLesson}</span>
                <div className="flex items-center space-x-1">
                  <ClockIcon className="w-3 h-3" />
                  <span>{course.estimatedCompletion}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Skills */}
      <div className="mb-4">
        <h4 className="text-xs font-medium text-gray-400 mb-2">Skills</h4>
        <div className="space-y-2">
          {learningData.skills.slice(0, 3).map((skill, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-white font-medium">{skill.name}</span>
                  <span className="text-gray-400">{skill.level}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div 
                    className={`bg-gradient-to-r ${getSkillColor(skill.level)} h-1.5 rounded-full transition-all duration-300`}
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Badges */}
      <div>
        <h4 className="text-xs font-medium text-gray-400 mb-2">Recent Badges</h4>
        <div className="grid grid-cols-2 gap-2">
          {learningData.badges.slice(0, 4).map((badge) => (
            <div
              key={badge.id}
              className={`relative p-2 rounded-lg border text-center transition-colors ${
                badge.earned
                  ? 'bg-pink-500/20 border-pink-500/30'
                  : 'bg-gray-800/50 border-gray-700'
              }`}
            >
              <div className="text-lg mb-1">{badge.icon}</div>
              <div className="text-xs font-medium text-white truncate">{badge.name}</div>
              
              {badge.earned ? (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircleIcon className="w-2.5 h-2.5 text-white" />
                </div>
              ) : (
                <div className="mt-1 text-xs text-gray-400">{badge.progress}%</div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Action Button */}
      <div className="mt-4 pt-3 border-t border-gray-800">
        <button className="w-full px-3 py-2 bg-pink-600/20 border border-pink-500/30 text-pink-400 text-xs rounded-lg hover:bg-pink-600/30 transition-colors">
          Continue Learning
        </button>
      </div>
    </div>
  )
}