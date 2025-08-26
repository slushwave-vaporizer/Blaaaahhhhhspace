// YourSpace Creative Labs - Payment Processing Hook
import { useState } from 'react'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'
import toast from 'react-hot-toast'

export const usePayments = () => {
  const { user } = useAuth()
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)

  const createPaymentIntent = async ({
    amount,
    creatorId,
    type = 'tip',
    message
  }: {
    amount: number
    creatorId: string
    type?: 'tip' | 'purchase'
    message?: string
  }) => {
    if (!user) {
      toast.error('You must be signed in to make payments')
      return null
    }

    try {
      const { data, error } = await supabase.functions.invoke('tip-creator', {
        body: { creatorId, amount, message },
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating payment intent:', error)
      toast.error('Error processing payment')
      return null
    }
  }

  const processPayment = async (clientSecret: string) => {
    if (!stripe || !elements) {
      toast.error('Stripe not loaded')
      return false
    }

    setProcessing(true)
    try {
      const card = elements.getElement(CardElement)
      if (!card) {
        throw new Error('Card element not found')
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            email: user?.email,
          },
        },
      })

      if (error) {
        toast.error(error.message || 'Payment failed')
        return false
      }

      if (paymentIntent.status === 'succeeded') {
        toast.success('Payment successful!')
        return true
      }

      return false
    } catch (error) {
      console.error('Error processing payment:', error)
      toast.error('Error processing payment')
      return false
    } finally {
      setProcessing(false)
    }
  }

  const createSubscription = async ({
    creatorId,
    tier
  }: {
    creatorId: string
    tier: 'basic' | 'premium' | 'vip'
  }) => {
    if (!user) {
      toast.error('You must be signed in to subscribe')
      return null
    }

    try {
      const { data, error } = await supabase.functions.invoke('process-subscription', {
        body: { creatorId, tier },
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      })

      if (error) throw error

      // Redirect to Stripe Checkout
      if (data.sessionUrl) {
        window.location.href = data.sessionUrl
      }

      return data
    } catch (error) {
      console.error('Error creating subscription:', error)
      toast.error('Error creating subscription')
      return null
    }
  }

  const setupStripeConnect = async () => {
    if (!user) {
      toast.error('You must be signed in to connect Stripe')
      return null
    }

    try {
      const { data, error } = await supabase.functions.invoke('connect-stripe-account', {
        body: { action: 'create_account' },
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      })

      if (error) throw error

      if (data.onboardingUrl) {
        window.location.href = data.onboardingUrl
      }

      return data
    } catch (error) {
      console.error('Error setting up Stripe Connect:', error)
      toast.error('Error connecting Stripe account')
      return null
    }
  }

  const getStripeDashboard = async () => {
    if (!user) return null

    try {
      const { data, error } = await supabase.functions.invoke('connect-stripe-account', {
        body: { action: 'get_dashboard_link' },
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      })

      if (error) throw error

      if (data.dashboardUrl) {
        window.open(data.dashboardUrl, '_blank')
      }

      return data
    } catch (error) {
      console.error('Error getting Stripe dashboard:', error)
      toast.error('Error accessing Stripe dashboard')
      return null
    }
  }

  const checkStripeStatus = async () => {
    if (!user) return null

    try {
      const { data, error } = await supabase.functions.invoke('connect-stripe-account', {
        body: { action: 'check_status' },
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error checking Stripe status:', error)
      return null
    }
  }

  return {
    processing,
    createPaymentIntent,
    processPayment,
    createSubscription,
    setupStripeConnect,
    getStripeDashboard,
    checkStripeStatus
  }
}