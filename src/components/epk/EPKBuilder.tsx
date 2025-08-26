// YourSpace Creative Labs - EPK Builder Component
import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'
import { toast } from 'react-hot-toast'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentArrowDownIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import { cn } from '../../lib/utils'
import { LoadingSpinner } from '../ui/LoadingSpinner'

interface EPKData {
  id?: string
  artistName: string
  genre: string
  location: string
  spotifyLink: string
  youtubeLink: string
  soundcloudLink: string
  bandcampLink: string
  shortBio: string
  longBio: string
  achievements: string
  website: string
  instagram: string
  facebook: string
  twitter: string
  tiktok: string
  mgmtName: string
  mgmtEmail: string
  mgmtPhone: string
  bookingName: string
  bookingEmail: string
  bookingPhone: string
  liveVideo: string
  musicVideo: string
  promoVideo: string
}

interface PressQuote {
  text: string
  source: string
}

const TOTAL_STEPS = 7

export const EPKBuilder = () => {
  const { user, profile } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [existingEPK, setExistingEPK] = useState<any>(null)
  const [showPreview, setShowPreview] = useState(false)
  
  const [formData, setFormData] = useState<EPKData>({
    artistName: '',
    genre: '',
    location: '',
    spotifyLink: '',
    youtubeLink: '',
    soundcloudLink: '',
    bandcampLink: '',
    shortBio: '',
    longBio: '',
    achievements: '',
    website: '',
    instagram: '',
    facebook: '',
    twitter: '',
    tiktok: '',
    mgmtName: '',
    mgmtEmail: '',
    mgmtPhone: '',
    bookingName: '',
    bookingEmail: '',
    bookingPhone: '',
    liveVideo: '',
    musicVideo: '',
    promoVideo: ''
  })
  
  const [pressQuotes, setPressQuotes] = useState<PressQuote[]>([{ text: '', source: '' }])
  const [photos, setPhotos] = useState<any[]>([])

  // Auto-populate from user profile
  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        artistName: profile.display_name || profile.username || '',
        location: profile.location || '',
        website: profile.website || '',
        longBio: profile.bio || ''
      }))
    }
  }, [profile])

  // Check for existing EPK
  useEffect(() => {
    const fetchExistingEPK = async () => {
      if (!user) return
      
      try {
        const { data, error } = await supabase.functions.invoke('epk-get')
        
        if (error) {
          console.log('No existing EPK found')
          return
        }
        
        if (data?.data?.epk) {
          setExistingEPK(data.data.epk)
          // Populate form with existing data
          const epk = data.data.epk
          setFormData({
            artistName: epk.artist_name || '',
            genre: epk.genre || '',
            location: epk.location || '',
            spotifyLink: epk.spotify_link || '',
            youtubeLink: epk.youtube_link || '',
            soundcloudLink: epk.soundcloud_link || '',
            bandcampLink: epk.bandcamp_link || '',
            shortBio: epk.short_bio || '',
            longBio: epk.long_bio || '',
            achievements: epk.achievements || '',
            website: epk.website || '',
            instagram: epk.instagram || '',
            facebook: epk.facebook || '',
            twitter: epk.twitter || '',
            tiktok: epk.tiktok || '',
            mgmtName: epk.mgmt_name || '',
            mgmtEmail: epk.mgmt_email || '',
            mgmtPhone: epk.mgmt_phone || '',
            bookingName: epk.booking_name || '',
            bookingEmail: epk.booking_email || '',
            bookingPhone: epk.booking_phone || '',
            liveVideo: epk.live_video || '',
            musicVideo: epk.music_video || '',
            promoVideo: epk.promo_video || ''
          })
          
          if (data.data.pressQuotes) {
            setPressQuotes(data.data.pressQuotes.map((q: any) => ({
              text: q.quote_text,
              source: q.quote_source
            })))
          }
          
          if (data.data.photos) {
            setPhotos(data.data.photos)
          }
        }
      } catch (error) {
        console.error('Error fetching EPK:', error)
      }
    }
    
    fetchExistingEPK()
  }, [user])

  const handleInputChange = (field: keyof EPKData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addPressQuote = () => {
    setPressQuotes(prev => [...prev, { text: '', source: '' }])
  }

  const removePressQuote = (index: number) => {
    setPressQuotes(prev => prev.filter((_, i) => i !== index))
  }

  const updatePressQuote = (index: number, field: keyof PressQuote, value: string) => {
    setPressQuotes(prev => prev.map((quote, i) => 
      i === index ? { ...quote, [field]: value } : quote
    ))
  }

  const handleFileUpload = async (file: File, photoType: string) => {
    if (!existingEPK?.id) {
      toast.error('Please save your EPK first before uploading photos')
      return
    }

    try {
      setLoading(true)
      
      // Convert file to base64
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64Data = reader.result as string
        
        const { data, error } = await supabase.functions.invoke('epk-photo-upload', {
          body: {
            imageData: base64Data,
            fileName: file.name,
            photoType,
            epkId: existingEPK.id
          }
        })
        
        if (error) {
          throw error
        }
        
        setPhotos(prev => [...prev, data.data.photo])
        toast.success('Photo uploaded successfully!')
      }
      
      reader.readAsDataURL(file)
    } catch (error: any) {
      console.error('Photo upload error:', error)
      toast.error(error.message || 'Failed to upload photo')
    } finally {
      setLoading(false)
    }
  }

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        return formData.artistName.trim() !== ''
      default:
        return true
    }
  }

  const nextStep = () => {
    if (validateStep() && currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const saveEPK = async () => {
    if (!formData.artistName.trim()) {
      toast.error('Artist name is required')
      return
    }

    try {
      setLoading(true)
      
      const epkData = {
        ...formData,
        pressQuotes: pressQuotes.filter(q => q.text.trim() && q.source.trim())
      }
      
      let response
      if (existingEPK) {
        response = await supabase.functions.invoke('epk-update', {
          body: { epkId: existingEPK.id, ...epkData }
        })
      } else {
        response = await supabase.functions.invoke('epk-create', {
          body: epkData
        })
      }
      
      if (response.error) {
        throw response.error
      }
      
      if (!existingEPK) {
        setExistingEPK(response.data.data.epk)
      }
      
      toast.success(existingEPK ? 'EPK updated successfully!' : 'EPK created successfully!')
      setShowPreview(true)
    } catch (error: any) {
      console.error('EPK save error:', error)
      toast.error(error.message || 'Failed to save EPK')
    } finally {
      setLoading(false)
    }
  }

  const exportEPK = async () => {
    if (!existingEPK?.id) {
      toast.error('Please save your EPK first')
      return
    }

    try {
      const { data, error } = await supabase.functions.invoke('epk-export', {
        body: { epkId: existingEPK.id, format: 'html' }
      })
      
      if (error) throw error
      
      // Create download link
      const blob = new Blob([data.data.html], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${formData.artistName}_EPK.html`
      a.click()
      URL.revokeObjectURL(url)
      
      toast.success('EPK exported successfully!')
    } catch (error: any) {
      console.error('EPK export error:', error)
      toast.error(error.message || 'Failed to export EPK')
    }
  }

  if (showPreview) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowPreview(false)}
            className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <PencilIcon className="w-5 h-5" />
            <span>Edit EPK</span>
          </button>
          
          <div className="flex space-x-3">
            <button
              onClick={exportEPK}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all"
            >
              <DocumentArrowDownIcon className="w-5 h-5" />
              <span>Export EPK</span>
            </button>
          </div>
        </div>
        
        <div className="bg-black/20 border border-purple-500/20 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              {formData.artistName}
            </h1>
            <p className="text-gray-300 text-lg">Electronic Press Kit</p>
            {formData.genre && <p className="text-purple-400 mt-2">{formData.genre}</p>}
            {formData.location && <p className="text-gray-400">{formData.location}</p>}
          </div>
          
          {/* Bio Section */}
          {(formData.shortBio || formData.longBio) && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">About</h2>
              <p className="text-gray-300 leading-relaxed">
                {formData.longBio || formData.shortBio}
              </p>
            </div>
          )}
          
          {/* Streaming Links */}
          {(formData.spotifyLink || formData.youtubeLink || formData.soundcloudLink || formData.bandcampLink) && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Music & Streaming</h2>
              <div className="flex flex-wrap gap-3">
                {formData.spotifyLink && (
                  <a href={formData.spotifyLink} target="_blank" rel="noopener noreferrer" 
                     className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                    Spotify
                  </a>
                )}
                {formData.youtubeLink && (
                  <a href={formData.youtubeLink} target="_blank" rel="noopener noreferrer" 
                     className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                    YouTube
                  </a>
                )}
                {formData.soundcloudLink && (
                  <a href={formData.soundcloudLink} target="_blank" rel="noopener noreferrer" 
                     className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                    SoundCloud
                  </a>
                )}
                {formData.bandcampLink && (
                  <a href={formData.bandcampLink} target="_blank" rel="noopener noreferrer" 
                     className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    Bandcamp
                  </a>
                )}
              </div>
            </div>
          )}
          
          {/* Press Quotes */}
          {pressQuotes.some(q => q.text.trim() && q.source.trim()) && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Press & Reviews</h2>
              <div className="grid gap-4">
                {pressQuotes.filter(q => q.text.trim() && q.source.trim()).map((quote, index) => (
                  <div key={index} className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                    <p className="text-gray-300 italic mb-2">"{quote.text}"</p>
                    <p className="text-purple-400 font-medium">- {quote.source}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Contact Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Contact & Booking</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {(formData.mgmtName || formData.mgmtEmail || formData.mgmtPhone) && (
                <div className="bg-black/20 border border-purple-500/20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-purple-400 mb-2">Management</h3>
                  {formData.mgmtName && <p className="text-gray-300">Name: {formData.mgmtName}</p>}
                  {formData.mgmtEmail && <p className="text-gray-300">Email: {formData.mgmtEmail}</p>}
                  {formData.mgmtPhone && <p className="text-gray-300">Phone: {formData.mgmtPhone}</p>}
                </div>
              )}
              
              {(formData.bookingName || formData.bookingEmail || formData.bookingPhone) && (
                <div className="bg-black/20 border border-purple-500/20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-purple-400 mb-2">Booking</h3>
                  {formData.bookingName && <p className="text-gray-300">Name: {formData.bookingName}</p>}
                  {formData.bookingEmail && <p className="text-gray-300">Email: {formData.bookingEmail}</p>}
                  {formData.bookingPhone && <p className="text-gray-300">Phone: {formData.bookingPhone}</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          {existingEPK ? 'Edit Your EPK' : 'Create Your EPK'}
        </h2>
        <p className="text-gray-400">Build a professional Electronic Press Kit to showcase your work</p>
      </div>

      {/* Progress Bar */}
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-400">Step {currentStep} of {TOTAL_STEPS}</span>
          <span className="text-sm text-gray-400">{Math.round((currentStep / TOTAL_STEPS) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      {/* Form Steps */}
      <div className="max-w-2xl mx-auto bg-black/20 border border-purple-500/20 rounded-2xl p-8">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-6">Basic Information</h3>
            
            <div>
              <label className="block text-gray-300 mb-2">Artist/Band Name *</label>
              <input
                type="text"
                value={formData.artistName}
                onChange={(e) => handleInputChange('artistName', e.target.value)}
                className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white focus:border-purple-400 focus:outline-none transition-colors"
                placeholder="Your artist or band name"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Genre</label>
              <input
                type="text"
                value={formData.genre}
                onChange={(e) => handleInputChange('genre', e.target.value)}
                className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white focus:border-purple-400 focus:outline-none transition-colors"
                placeholder="e.g., Electronic, Rock, Pop"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white focus:border-purple-400 focus:outline-none transition-colors"
                placeholder="City, Country"
              />
            </div>
          </div>
        )}

        {/* Step 2: Music Links */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-6">Music & Streaming Links</h3>
            
            <div>
              <label className="block text-gray-300 mb-2">Spotify URL</label>
              <input
                type="url"
                value={formData.spotifyLink}
                onChange={(e) => handleInputChange('spotifyLink', e.target.value)}
                className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white focus:border-purple-400 focus:outline-none transition-colors"
                placeholder="https://open.spotify.com/artist/..."
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">YouTube URL</label>
              <input
                type="url"
                value={formData.youtubeLink}
                onChange={(e) => handleInputChange('youtubeLink', e.target.value)}
                className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white focus:border-purple-400 focus:outline-none transition-colors"
                placeholder="https://youtube.com/..."
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">SoundCloud URL</label>
              <input
                type="url"
                value={formData.soundcloudLink}
                onChange={(e) => handleInputChange('soundcloudLink', e.target.value)}
                className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white focus:border-purple-400 focus:outline-none transition-colors"
                placeholder="https://soundcloud.com/..."
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Bandcamp URL</label>
              <input
                type="url"
                value={formData.bandcampLink}
                onChange={(e) => handleInputChange('bandcampLink', e.target.value)}
                className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white focus:border-purple-400 focus:outline-none transition-colors"
                placeholder="https://bandcamp.com/..."
              />
            </div>
          </div>
        )}

        {/* Step 3: Photos */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-6">Photos & Visual Assets</h3>
            
            <div>
              <label className="block text-gray-300 mb-2">Main Artist Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileUpload(file, 'hero')
                }}
                className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white focus:border-purple-400 focus:outline-none transition-colors"
              />
              <small className="text-gray-400">High-resolution photo for main display</small>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Band/Group Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileUpload(file, 'band')
                }}
                className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white focus:border-purple-400 focus:outline-none transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Promotional Photos</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || [])
                  files.forEach(file => handleFileUpload(file, 'promo'))
                }}
                className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white focus:border-purple-400 focus:outline-none transition-colors"
              />
              <small className="text-gray-400">Upload up to 5 additional promotional photos</small>
            </div>
            
            {photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                {photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={photo.photo_url} 
                      alt={photo.photo_type}
                      className="w-full h-24 object-cover rounded-lg border border-purple-500/30"
                    />
                    <span className="absolute top-1 left-1 bg-purple-500 text-white text-xs px-2 py-1 rounded">
                      {photo.photo_type}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 4: Biography */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-6">Biography & About</h3>
            
            <div>
              <label className="block text-gray-300 mb-2">Short Biography (50-100 words)</label>
              <textarea
                value={formData.shortBio}
                onChange={(e) => handleInputChange('shortBio', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white focus:border-purple-400 focus:outline-none transition-colors resize-none"
                placeholder="A brief description of your music and background..."
              />
              <div className="text-right text-gray-400 text-sm mt-1">
                {formData.shortBio.trim().split(/\s+/).filter(word => word.length > 0).length} words
              </div>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Full Biography (200-500 words)</label>
              <textarea
                value={formData.longBio}
                onChange={(e) => handleInputChange('longBio', e.target.value)}
                rows={8}
                className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white focus:border-purple-400 focus:outline-none transition-colors resize-none"
                placeholder="Detailed biography including achievements, notable shows, band history..."
              />
              <div className="text-right text-gray-400 text-sm mt-1">
                {formData.longBio.trim().split(/\s+/).filter(word => word.length > 0).length} words
              </div>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Key Achievements (one per line)</label>
              <textarea
                value={formData.achievements}
                onChange={(e) => handleInputChange('achievements', e.target.value)}
                rows={5}
                className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white focus:border-purple-400 focus:outline-none transition-colors resize-none"
                placeholder="e.g.,\n50+ Shows Played\n100K+ Streams\nFeatured in Local Gazette"
              />
            </div>
          </div>
        )}

        {/* Step 5: Press Quotes */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-6">Press Quotes & Reviews</h3>
            
            {pressQuotes.map((quote, index) => (
              <div key={index} className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 relative">
                {pressQuotes.length > 1 && (
                  <button
                    onClick={() => removePressQuote(index)}
                    className="absolute top-2 right-2 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                )}
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Press Quote</label>
                    <textarea
                      value={quote.text}
                      onChange={(e) => updatePressQuote(index, 'text', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white focus:border-purple-400 focus:outline-none transition-colors resize-none"
                      placeholder="Enter the quote here..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Source</label>
                    <input
                      type="text"
                      value={quote.source}
                      onChange={(e) => updatePressQuote(index, 'source', e.target.value)}
                      className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white focus:border-purple-400 focus:outline-none transition-colors"
                      placeholder="Publication name or reviewer"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <button
              onClick={addPressQuote}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Add Another Quote</span>
            </button>
          </div>
        )}

        {/* Step 6: Videos */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-6">Videos</h3>
            
            <div>
              <label className="block text-gray-300 mb-2">Live Performance Video URL</label>
              <input
                type="url"
                value={formData.liveVideo}
                onChange={(e) => handleInputChange('liveVideo', e.target.value)}
                className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white focus:border-purple-400 focus:outline-none transition-colors"
                placeholder="YouTube, Vimeo, or other video URL"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Music Video URL</label>
              <input
                type="url"
                value={formData.musicVideo}
                onChange={(e) => handleInputChange('musicVideo', e.target.value)}
                className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white focus:border-purple-400 focus:outline-none transition-colors"
                placeholder="Official music video URL"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Promotional Video URL</label>
              <input
                type="url"
                value={formData.promoVideo}
                onChange={(e) => handleInputChange('promoVideo', e.target.value)}
                className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white focus:border-purple-400 focus:outline-none transition-colors"
                placeholder="Band promo or EPK video URL"
              />
            </div>
          </div>
        )}

        {/* Step 7: Contact & Social */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-6">Contact & Social Media</h3>
            
            {/* Management Contact */}
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-purple-400 mb-4">Management Contact</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.mgmtName}
                    onChange={(e) => handleInputChange('mgmtName', e.target.value)}
                    className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white focus:border-purple-400 focus:outline-none transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.mgmtEmail}
                    onChange={(e) => handleInputChange('mgmtEmail', e.target.value)}
                    className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white focus:border-purple-400 focus:outline-none transition-colors"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-gray-300 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.mgmtPhone}
                  onChange={(e) => handleInputChange('mgmtPhone', e.target.value)}
                  className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white focus:border-purple-400 focus:outline-none transition-colors"
                />
              </div>
            </div>
            
            {/* Booking Contact */}
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-purple-400 mb-4">Booking Contact</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.bookingName}
                    onChange={(e) => handleInputChange('bookingName', e.target.value)}
                    className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white focus:border-purple-400 focus:outline-none transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.bookingEmail}
                    onChange={(e) => handleInputChange('bookingEmail', e.target.value)}
                    className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white focus:border-purple-400 focus:outline-none transition-colors"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-gray-300 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.bookingPhone}
                  onChange={(e) => handleInputChange('bookingPhone', e.target.value)}
                  className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white focus:border-purple-400 focus:outline-none transition-colors"
                />
              </div>
            </div>
            
            {/* Social Media */}
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-purple-400 mb-4">Social Media</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Website</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white focus:border-purple-400 focus:outline-none transition-colors"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Instagram</label>
                    <input
                      type="url"
                      value={formData.instagram}
                      onChange={(e) => handleInputChange('instagram', e.target.value)}
                      className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white focus:border-purple-400 focus:outline-none transition-colors"
                      placeholder="https://instagram.com/yourusername"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Facebook</label>
                    <input
                      type="url"
                      value={formData.facebook}
                      onChange={(e) => handleInputChange('facebook', e.target.value)}
                      className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white focus:border-purple-400 focus:outline-none transition-colors"
                      placeholder="https://facebook.com/yourpage"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Twitter</label>
                    <input
                      type="url"
                      value={formData.twitter}
                      onChange={(e) => handleInputChange('twitter', e.target.value)}
                      className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white focus:border-purple-400 focus:outline-none transition-colors"
                      placeholder="https://twitter.com/yourusername"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">TikTok</label>
                    <input
                      type="url"
                      value={formData.tiktok}
                      onChange={(e) => handleInputChange('tiktok', e.target.value)}
                      className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white focus:border-purple-400 focus:outline-none transition-colors"
                      placeholder="https://tiktok.com/@yourusername"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8 border-t border-purple-500/20">
          <button
            onClick={prevStep}
            disabled={currentStep === 1 || loading}
            className={cn(
              'flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all',
              currentStep === 1 || loading
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-purple-500/20 border border-purple-400/50 text-purple-300 hover:bg-purple-500/30'
            )}
          >
            <ChevronLeftIcon className="w-5 h-5" />
            <span>Previous</span>
          </button>
          
          {currentStep === TOTAL_STEPS ? (
            <div className="flex space-x-3">
              <button
                onClick={() => setShowPreview(true)}
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-500/20 border border-blue-400/50 rounded-lg text-blue-300 font-medium hover:bg-blue-500/30 transition-all disabled:opacity-50"
              >
                <EyeIcon className="w-5 h-5" />
                <span>Preview</span>
              </button>
              
              <button
                onClick={saveEPK}
                disabled={loading || !validateStep()}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <LoadingSpinner className="w-5 h-5" />
                ) : (
                  <span>{existingEPK ? 'Update EPK' : 'Create EPK'}</span>
                )}
              </button>
            </div>
          ) : (
            <button
              onClick={nextStep}
              disabled={loading || !validateStep()}
              className={cn(
                'flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all',
                !validateStep() || loading
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
              )}
            >
              <span>Next</span>
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}