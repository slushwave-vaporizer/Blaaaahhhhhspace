// YourSpace Creative Labs - Tip Creator Modal Component
import { useState } from 'react'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { usePayments } from '../../hooks/usePayments'
import { useAuth } from '../../hooks/useAuth'
import { TIP_AMOUNTS, formatCurrency } from '../../lib/stripe'
import { 
  XMarkIcon,
  HeartIcon,
  GiftIcon
} from '@heroicons/react/24/outline'
import { cn } from '../../lib/utils'

interface TipCreatorModalProps {
  isOpen: boolean
  onClose: () => void
  creatorId: string
  creatorName: string
  creatorAvatar?: string
}

export const TipCreatorModal = ({ 
  isOpen, 
  onClose, 
  creatorId, 
  creatorName,
  creatorAvatar 
}: TipCreatorModalProps) => {
  const { user } = useAuth()
  const { createPaymentIntent, processPayment, processing } = usePayments()
  const stripe = useStripe()
  const elements = useElements()
  
  const [selectedAmount, setSelectedAmount] = useState<number>(TIP_AMOUNTS[2]) // Default to $5
  const [customAmount, setCustomAmount] = useState('')
  const [message, setMessage] = useState('')
  const [step, setStep] = useState<'amount' | 'payment' | 'success'>('amount')
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  if (!isOpen) return null

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount)
    setCustomAmount('')
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    const amount = parseFloat(value) * 100 // Convert to cents
    if (!isNaN(amount) && amount > 0) {
      setSelectedAmount(amount)
    }
  }

  const handleContinueToPayment = async () => {
    if (!user || selectedAmount < 100) return // Minimum $1

    const result = await createPaymentIntent({
      amount: selectedAmount,
      creatorId,
      message
    })

    if (result?.clientSecret) {
      setClientSecret(result.clientSecret)
      setStep('payment')
    }
  }

  const handlePayment = async () => {
    if (!clientSecret || !stripe || !elements) return

    const success = await processPayment(clientSecret)
    if (success) {
      setStep('success')
    }
  }

  const resetModal = () => {
    setStep('amount')
    setSelectedAmount(TIP_AMOUNTS[2])
    setCustomAmount('')
    setMessage('')
    setClientSecret(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black/90 border border-purple-500/20 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
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
              <h2 className="text-xl font-bold text-white flex items-center">
                <GiftIcon className="h-5 w-5 mr-2 text-pink-400" />
                Tip {creatorName}
              </h2>
              <p className="text-gray-400 text-sm">Show your appreciation</p>
            </div>
          </div>
          <button
            onClick={resetModal}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {step === 'amount' && (
          <div className="space-y-6">
            {/* Preset Amounts */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Choose Amount
              </label>
              <div className="grid grid-cols-3 gap-3">
                {TIP_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleAmountSelect(amount)}
                    className={cn(
                      'p-3 border rounded-lg text-center transition-all',
                      selectedAmount === amount && !customAmount
                        ? 'border-purple-400 bg-purple-500/20 text-purple-300'
                        : 'border-purple-500/30 text-gray-300 hover:border-purple-400/50'
                    )}
                  >
                    {formatCurrency(amount)}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Custom Amount (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  placeholder="0.00"
                  min="1"
                  step="0.01"
                  className="w-full pl-8 pr-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Message (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Leave a nice message for the creator..."
                rows={3}
                className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all resize-none"
              />
            </div>

            {/* Total */}
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span className="text-gray-300">Total:</span>
                <span className="text-purple-300">{formatCurrency(selectedAmount)}</span>
              </div>
              <p className="text-gray-400 text-sm mt-1">
                {/* @tweakable */ formatCurrency(Math.round(selectedAmount * 0.05))} platform fee • {formatCurrency(selectedAmount - Math.round(selectedAmount * 0.05))} to creator
              </p>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinueToPayment}
              disabled={selectedAmount < 100}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold py-3 px-4 rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Payment
            </button>
          </div>
        )}

        {step === 'payment' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-300 mb-2">
                {formatCurrency(selectedAmount)}
              </div>
              <p className="text-gray-400">to {creatorName}</p>
            </div>

            {/* Payment Form */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Payment Details
              </label>
              <div className="p-4 bg-black/30 border border-purple-500/30 rounded-lg">
                <CardElement 
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#ffffff',
                        '::placeholder': {
                          color: '#9ca3af',
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

            {message && (
              <div className="bg-black/30 border border-purple-500/30 rounded-lg p-4">
                <p className="text-gray-300 text-sm">
                  <span className="font-medium">Your message:</span> {message}
                </p>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => setStep('amount')}
                className="flex-1 px-4 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500 transition-all"
              >
                Back
              </button>
              <button
                onClick={handlePayment}
                disabled={processing || !stripe || !elements}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  'Send Tip'
                )}
              </button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <HeartIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Tip Sent!</h3>
              <p className="text-gray-400">
                Your {formatCurrency(selectedAmount)} tip has been sent to {creatorName}.
              </p>
              {message && (
                <p className="text-gray-400 mt-2">
                  Your message has been delivered too!
                </p>
              )}
            </div>
            <button
              onClick={resetModal}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold py-3 px-4 rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}