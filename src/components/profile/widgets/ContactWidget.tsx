import React, { useState } from 'react'
import { WidgetConfig } from '../../../hooks/useProfileBuilder'
import { PhoneIcon, EnvelopeIcon, MapPinIcon, CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline'

interface ContactWidgetProps {
  widget: WidgetConfig
}

export const ContactWidget: React.FC<ContactWidgetProps> = ({ widget }) => {
  const data = widget.data || {}
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    projectType: 'design'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Mock contact info
  const contactInfo = {
    email: 'hello@alexchen.art',
    location: 'Neo Tokyo, Japan',
    timezone: 'JST (GMT+9)',
    availability: 'Mon-Fri, 9AM-6PM JST',
    responseTime: '24 hours',
    languages: ['English', 'Japanese', 'Mandarin']
  }
  
  const projectTypes = [
    { value: 'design', label: 'Graphic Design', icon: '🎨' },
    { value: 'animation', label: 'Animation', icon: '🎬' },
    { value: '3d', label: '3D Modeling', icon: '🔮' },
    { value: 'logo', label: 'Logo Design', icon: '🎨' },
    { value: 'ui', label: 'UI/UX Design', icon: '📱' },
    { value: 'other', label: 'Other', icon: '💬' }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      projectType: 'design'
    })
    setIsSubmitting(false)
    
    // In real app, show success message
    console.log('Contact form submitted:', formData)
  }

  return (
    <div className="w-full h-full p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-pink-400 flex items-center">
          <PhoneIcon className="w-4 h-4 mr-1" />
          Get in Touch
        </h3>
        <div className="flex items-center space-x-1 text-xs text-green-400">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Available</span>
        </div>
      </div>
      
      {/* Contact Info */}
      <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
        <div className="space-y-2 text-xs">
          <div className="flex items-center space-x-2 text-gray-300">
            <EnvelopeIcon className="w-3 h-3 text-pink-400" />
            <span className="font-medium">{contactInfo.email}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-400">
            <MapPinIcon className="w-3 h-3" />
            <span>{contactInfo.location}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-400">
            <ClockIcon className="w-3 h-3" />
            <span>{contactInfo.availability}</span>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t border-gray-700">
            <span className="text-gray-400">Response time</span>
            <span className="text-pink-400 font-medium">{contactInfo.responseTime}</span>
          </div>
        </div>
      </div>
      
      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Name and Email */}
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Your name"
            required
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Your email"
            required
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors"
          />
        </div>
        
        {/* Project Type */}
        <select
          name="projectType"
          value={formData.projectType}
          onChange={handleInputChange}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500 transition-colors"
        >
          {projectTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.icon} {type.label}
            </option>
          ))}
        </select>
        
        {/* Subject */}
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleInputChange}
          placeholder="Project subject"
          required
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors"
        />
        
        {/* Message */}
        <textarea
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          placeholder="Tell me about your project..."
          rows={3}
          required
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors resize-none"
        />
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-2 bg-pink-600 hover:bg-pink-700 disabled:bg-pink-800 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Sending...</span>
            </>
          ) : (
            <>
              <EnvelopeIcon className="w-4 h-4" />
              <span>Send Message</span>
            </>
          )}
        </button>
      </form>
      
      {/* Quick Contact Options */}
      <div className="mt-4 pt-3 border-t border-gray-800">
        <div className="text-xs text-gray-400 mb-2">Prefer other ways to connect?</div>
        <div className="grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center space-x-1 px-3 py-2 bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs rounded-lg hover:bg-blue-600/30 transition-colors">
            <CalendarDaysIcon className="w-3 h-3" />
            <span>Schedule Call</span>
          </button>
          
          <button className="flex items-center justify-center space-x-1 px-3 py-2 bg-green-600/20 border border-green-500/30 text-green-400 text-xs rounded-lg hover:bg-green-600/30 transition-colors">
            <EnvelopeIcon className="w-3 h-3" />
            <span>Direct Email</span>
          </button>
        </div>
        
        {/* Languages */}
        <div className="mt-3 text-center">
          <div className="text-xs text-gray-500 mb-1">I speak:</div>
          <div className="flex items-center justify-center space-x-2">
            {contactInfo.languages.map((lang, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}