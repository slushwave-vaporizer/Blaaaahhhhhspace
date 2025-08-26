// YourSpace Creative Labs - Artist Discovery Swipe Card Component
import { useState, useRef } from 'react'
import { motion, PanInfo, useAnimation } from 'framer-motion'
import { Heart, X, Eye, Play, Users, Sparkles, Home } from 'lucide-react'
import { Profile } from '../../lib/supabase'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'
import { Link } from 'react-router-dom'

interface ArtistSwipeCardProps {
  artist: Profile & { content_samples?: any[] }
  onSwipe: (liked: boolean) => void
  isTop?: boolean
}

export function ArtistSwipeCard({ artist, onSwipe, isTop = false }: ArtistSwipeCardProps) {
  const [exitX, setExitX] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()

  const handleDragEnd = (event: any, info: PanInfo) => {
    const offset = info.offset.x
    const velocity = info.velocity.x
    const swipeThreshold = 100

    if (Math.abs(offset) > swipeThreshold || Math.abs(velocity) > 500) {
      const liked = offset > 0
      setExitX(liked ? 300 : -300)
      controls.start({
        x: liked ? 300 : -300,
        rotate: liked ? 30 : -30,
        opacity: 0,
        transition: { duration: 0.3 }
      }).then(() => {
        onSwipe(liked)
      })
    } else {
      controls.start({
        x: 0,
        rotate: 0,
        opacity: 1,
        transition: { duration: 0.3 }
      })
    }
  }

  const handleButtonSwipe = (liked: boolean) => {
    setExitX(liked ? 300 : -300)
    controls.start({
      x: liked ? 300 : -300,
      rotate: liked ? 30 : -30,
      opacity: 0,
      transition: { duration: 0.3 }
    }).then(() => {
      onSwipe(liked)
    })
  }

  const primaryContent = artist.content_samples && artist.content_samples.length > 0 ? artist.content_samples[0] : null

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        'absolute inset-4 bg-black/40 backdrop-blur-sm border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing',
        isTop ? 'z-10' : 'z-0'
      )}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={controls}
      initial={{ scale: isTop ? 1 : 0.95, opacity: isTop ? 1 : 0.8 }}
      whileDrag={{ rotate: 0 }}
      style={{
        transform: isTop ? 'translateY(0)' : 'translateY(8px)',
      }}
    >
      {/* Artist Profile Image/Content Preview */}
      <div className="relative h-full">
        {primaryContent?.file_url ? (
          <div className="relative w-full h-full">
            {primaryContent.content_type === 'image' ? (
              <img
                src={primaryContent.file_url}
                alt={primaryContent.title}
                className="w-full h-full object-cover"
              />
            ) : primaryContent.content_type === 'video' ? (
              <div className="relative w-full h-full bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
                <Play className="h-16 w-16 text-white/60" />
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-xs text-white">
                  Video
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
                <div className="text-white/60 text-center">
                  <Sparkles className="h-16 w-16 mx-auto mb-2" />
                  <div className="text-sm capitalize">{primaryContent.content_type} Content</div>
                </div>
              </div>
            )}
          </div>
        ) : artist.avatar_url ? (
          <img
            src={artist.avatar_url}
            alt={artist.display_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center">
            <div className="text-white text-6xl font-bold">
              {(artist.display_name || artist.username).charAt(0).toUpperCase()}
            </div>
          </div>
        )}
        
        {/* Like/Pass overlay indicators */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0 }}
        />

        {/* Verification Badge */}
        {artist.is_verified && (
          <div className="absolute top-4 right-4">
            <div className="bg-green-500/90 rounded-full p-1">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
          </div>
        )}

        {/* Content samples indicator */}
        {artist.content_samples && artist.content_samples.length > 0 && (
          <div className="absolute top-4 left-4">
            <div className="bg-black/70 rounded-full px-2 py-1 text-xs text-white flex items-center space-x-1">
              <Eye className="h-3 w-3" />
              <span>{artist.content_samples.length} works</span>
            </div>
          </div>
        )}

        {/* Gradient overlay for text readability */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent h-48" />
        
        {/* Artist Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center space-x-2 mb-2">
            <h2 className="text-2xl font-bold">
              {artist.display_name || artist.username}
            </h2>
            {artist.is_premium && (
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded px-2 py-1 text-xs font-medium">
                PRO
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-300 mb-3">
            <span className="capitalize">{artist.creator_type || 'Artist'}</span>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{artist.follower_count} followers</span>
            </div>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{artist.profile_views} views</span>
            </span>
          </div>
          
          {artist.bio && (
            <p className="text-sm text-gray-300 line-clamp-3 mb-3">
              {artist.bio}
            </p>
          )}
          
          {/* Theme indicator */}
          {artist.theme && (
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <span className="capitalize">{artist.theme.replace('-', ' ')} theme</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons - Only visible on top card */}
      {isTop && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
          {/* Virtual Room Button - Positioned above main actions */}
          <div className="flex justify-center mb-3">
            <Link
              to={`/rooms?artist=${artist.username}`}
              className="px-4 py-2 bg-black/70 backdrop-blur-sm border border-purple-500/60 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400 hover:text-purple-200 rounded-lg shadow-lg transition-all duration-200 text-sm font-medium flex items-center space-x-2 neon-glow-purple"
            >
              <Home className="h-4 w-4" />
              <span>Visit Studio</span>
            </Link>
          </div>
          
          {/* Main Actions */}
          <div className="flex space-x-4">
            <Button
              variant="outline"
              size="circle"
              className="w-14 h-14 bg-black/70 backdrop-blur-sm border-2 border-red-500/60 text-red-400 hover:bg-red-500/20 hover:border-red-400 hover:text-red-300 shadow-lg transition-all duration-200"
              onClick={() => handleButtonSwipe(false)}
            >
              <X className="h-7 w-7" />
            </Button>
            <Button
              variant="outline"
              size="circle"
              className="w-14 h-14 bg-black/70 backdrop-blur-sm border-2 border-green-500/60 text-green-400 hover:bg-green-500/20 hover:border-green-400 hover:text-green-300 shadow-lg transition-all duration-200 neon-glow-green"
              onClick={() => handleButtonSwipe(true)}
            >
              <Heart className="h-7 w-7" />
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  )
}