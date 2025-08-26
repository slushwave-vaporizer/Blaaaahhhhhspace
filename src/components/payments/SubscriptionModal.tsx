// YourSpace Creative Labs - Subscription Modal Component
import { useState } from 'react'
import { usePayments } from '../../hooks/usePayments'
import { useAuth } from '../../hooks/useAuth'
import { SUBSCRIPTION_TIERS, formatCurrency } from '../../lib/stripe'
import { 
  XMarkIcon,
  CheckIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import { cn } from '../../lib/utils'

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  creatorId: string
  creatorName: string
  creatorAvatar?: string
}

export const SubscriptionModal = ({ 
  isOpen, 
  onClose, 
  creatorId, 
  creatorName,
  creatorAvatar 
}: SubscriptionModalProps) => {
  const { user } = useAuth()
  const { createSubscription } = usePayments()
  const [selectedTier, setSelectedTier] = useState<'basic' | 'premium' | 'vip'>('basic')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubscribe = async () => {
    if (!user) return

    setLoading(true)
    try {
      await createSubscription({
        creatorId,
        tier: selectedTier
      })
      // The user will be redirected to Stripe Checkout
    } catch (error) {
      console.error('Subscription error:', error)
    } finally {
      setLoading(false)
    }
  }

  const tierIcons = {
    basic: StarIcon,
    premium: StarIcon,
    vip: StarIcon
  }

  const tierColors = {
    basic: 'from-blue-500 to-cyan-500',
    premium: 'from-purple-500 to-pink-500',
    vip: 'from-orange-500 to-red-500'
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black/90 border border-purple-500/20 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
              {creatorAvatar ? (
                <img src={creatorAvatar} alt={creatorName} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <span className="text-white font-semibold">{creatorName.charAt(0)}</span>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Subscribe to {creatorName}
              </h2>
              <p className="text-gray-400 text-sm">Get exclusive access and support their work</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Subscription Tiers */}
        <div className="space-y-4 mb-6">
          {Object.entries(SUBSCRIPTION_TIERS).map(([tier, config]) => {
            const TierIcon = tierIcons[tier as keyof typeof tierIcons]
            const isSelected = selectedTier === tier
            
            return (
              <div
                key={tier}
                onClick={() => setSelectedTier(tier as any)}
                className={cn(
                  'p-6 border rounded-xl cursor-pointer transition-all',
                  isSelected
                    ? 'border-purple-400 bg-purple-500/20'
                    : 'border-purple-500/30 hover:border-purple-400/50 hover:bg-purple-500/10'
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${tierColors[tier as keyof typeof tierColors]} flex items-center justify-center`}>
                      <TierIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{config.name}</h3>
                        <span className="text-2xl font-bold text-purple-300">
                          {formatCurrency(config.amount)}/month
                        </span>
                      </div>
                      <ul className="space-y-1">
                        {config.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-gray-300 text-sm">
                            <CheckIcon className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckIcon className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Billing Info */}
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 mb-6">
          <h4 className="text-white font-medium mb-2">Billing Details</h4>
          <div className="space-y-1 text-sm text-gray-300">
            <div className="flex justify-between">
              <span>Monthly subscription:</span>
              <span>{formatCurrency(SUBSCRIPTION_TIERS[selectedTier].amount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Platform fee (10%):</span>
              <span>{formatCurrency(Math.round(SUBSCRIPTION_TIERS[selectedTier].amount * 0.1))}</span>
            </div>
            <div className="flex justify-between">
              <span>Creator receives:</span>
              <span className="font-medium text-green-400">
                {formatCurrency(SUBSCRIPTION_TIERS[selectedTier].amount - Math.round(SUBSCRIPTION_TIERS[selectedTier].amount * 0.1))}
              </span>
            </div>
          </div>
          <p className="text-gray-400 text-xs mt-3">
            You can cancel anytime. Next billing date will be shown after checkout.
          </p>
        </div>

        {/* Subscribe Button */}
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold py-4 px-6 rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
              Processing...
            </div>
          ) : (
            `Subscribe for ${formatCurrency(SUBSCRIPTION_TIERS[selectedTier].amount)}/month`
          )}
        </button>

        <p className="text-center text-gray-400 text-sm mt-4">
          You'll be redirected to our secure payment processor to complete your subscription.
        </p>
      </div>
    </div>
  )
}