// YourSpace Creative Labs - Discord OAuth2 Callback Page
import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'
import { toast } from 'react-hot-toast'

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
    className={`animate-spin ${className}`} 
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

export const DiscordCallbackPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code')
      const error = searchParams.get('error')
      const state = searchParams.get('state')

      if (error) {
        setError(`Discord authorization failed: ${error}`)
        setLoading(false)
        return
      }

      if (!code) {
        setError('No authorization code received from Discord')
        setLoading(false)
        return
      }

      try {
        // Call Discord OAuth edge function
        const response = await fetch('/functions/v1/discord-oauth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: code,
            redirect_uri: `${window.location.origin}/auth/discord/callback`
          })
        })

        const result = await response.json()

        if (!response.ok || !result.success) {
          throw new Error(result.error?.message || 'Discord authentication failed')
        }

        // Authentication successful
        setSuccess(true)
        
        if (result.user.is_new_user) {
          toast.success(`Welcome to YourSpace, ${result.user.display_name}! Your Discord account has been connected.`)
        } else {
          toast.success(`Discord account connected successfully! Welcome back, ${result.user.display_name}.`)
        }

        // If user is already logged in to YourSpace, just refresh the page
        if (user) {
          setTimeout(() => {
            navigate('/', { replace: true })
          }, 2000)
        } else {
          // For new users, redirect to session URL or dashboard
          if (result.session_url) {
            window.location.href = result.session_url
          } else {
            setTimeout(() => {
              navigate('/login', { replace: true })
            }, 2000)
          }
        }

      } catch (err: any) {
        console.error('Discord callback error:', err)
        setError(err.message || 'Failed to connect Discord account')
        toast.error('Failed to connect Discord account')
      } finally {
        setLoading(false)
      }
    }

    handleCallback()
  }, [searchParams, navigate, user])

  const handleRetry = () => {
    navigate('/login', { replace: true })
  }

  const handleGoHome = () => {
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 w-full max-w-md text-center">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-[#5865F2] to-[#4752C4] rounded-2xl flex items-center justify-center">
            {loading ? (
              <LoadingSpinner className="w-8 h-8 text-white" />
            ) : success ? (
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <DiscordIcon className="w-8 h-8 text-white" />
            )}
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-2">
            {loading && 'Connecting Discord...'}
            {success && 'Discord Connected!'}
            {error && 'Connection Failed'}
          </h1>
          
          <p className="text-gray-400">
            {loading && 'Please wait while we connect your Discord account to YourSpace.'}
            {success && 'Your Discord account has been successfully connected. Redirecting you now...'}
            {error && 'We encountered an issue connecting your Discord account.'}
          </p>
        </div>

        {error && (
          <div className="mb-6">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleRetry}
                className="flex-1 px-4 py-2 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-lg font-semibold transition-colors"
              >
                Try Again
              </button>
              
              <button
                onClick={handleGoHome}
                className="flex-1 px-4 py-2 bg-black/30 border border-gray-500/30 text-gray-300 hover:text-white hover:border-gray-400/50 rounded-lg font-semibold transition-all"
              >
                Go Home
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center space-x-2 text-purple-400">
            <LoadingSpinner className="w-4 h-4" />
            <span className="text-sm">Processing...</span>
          </div>
        )}

        {success && (
          <div className="flex items-center justify-center space-x-2 text-green-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm">Redirecting...</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default DiscordCallbackPage
