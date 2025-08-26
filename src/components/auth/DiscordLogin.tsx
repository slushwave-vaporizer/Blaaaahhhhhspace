// YourSpace Creative Labs - Discord Login Component
import React from 'react'
import { useDiscord } from '../../hooks/useDiscord'
import { cn } from '../../lib/utils'

interface DiscordLoginProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary'
  showText?: boolean
  text?: string
}

const DiscordIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className}
    fill="currentColor"
  >
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.010c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
)

const LoadingSpinner = ({ className }: { className?: string }) => (
  <svg 
    className={cn('animate-spin', className)} 
    viewBox="0 0 24 24" 
    fill="none"
  >
    <circle 
      cx="12" 
      cy="12" 
      r="10" 
      stroke="currentColor" 
      strokeWidth="4" 
      className="opacity-25"
    />
    <path 
      fill="currentColor" 
      className="opacity-75" 
      d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
)

export const DiscordLogin: React.FC<DiscordLoginProps> = ({
  className = '',
  size = 'md',
  variant = 'primary',
  showText = true,
  text = 'Connect Discord'
}) => {
  const { loading, initiateDiscordAuth } = useDiscord()

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const variantClasses = {
    primary: 'bg-[#5865F2] hover:bg-[#4752C4] text-white border-[#5865F2]',
    secondary: 'bg-black/20 hover:bg-[#5865F2]/20 text-[#5865F2] border-[#5865F2]/30 hover:border-[#5865F2]/50'
  }

  return (
    <button
      onClick={initiateDiscordAuth}
      disabled={loading}
      className={cn(
        'inline-flex items-center justify-center font-semibold rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#5865F2]/50 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {loading ? (
        <LoadingSpinner className={cn(iconSizes[size], showText ? 'mr-2' : '')} />
      ) : (
        <DiscordIcon className={cn(iconSizes[size], showText ? 'mr-2' : '')} />
      )}
      
      {showText && (
        <span>{loading ? 'Connecting...' : text}</span>
      )}
    </button>
  )
}

export default DiscordLogin
