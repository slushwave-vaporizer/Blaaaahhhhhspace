// YourSpace Creative Labs - Stripe Configuration
import { loadStripe } from '@stripe/stripe-js'

// Stripe publishable key
const stripePublishableKey = 'pk_test_51RwGXDDWHdV2k6pX7lfyVZxik4H1G090zbvBntAZtAXHYe4na38xTdC1fssmXH3R65ZlI4T47WZmrdrIs9SqOlsE00rrXlN6Li'

// Initialize Stripe
export const stripePromise = loadStripe(stripePublishableKey)

// Stripe Connect configuration
/* @tweakable */ export const PLATFORM_FEE_PERCENT = {
  tips: 5, // 5% for tips
  subscriptions: 10, // 10% for subscriptions
  purchases: 8, // 8% for direct purchases
  collaborations: 12 // 12% for collaboration earnings
}

/* @tweakable */ export const SUBSCRIPTION_TIERS = {
  basic: {
    amount: 999, // $9.99
    name: 'Basic Creator',
    features: ['Access to creator content', 'Early access to releases', 'Creator chat access']
  },
  premium: {
    amount: 1999, // $19.99
    name: 'Premium Supporter',
    features: ['All Basic features', 'Monthly video calls', 'Exclusive content', 'Custom requests']
  },
  vip: {
    amount: 4999, // $49.99
    name: 'VIP Collaborator',
    features: ['All Premium features', 'Direct collaboration access', 'Revenue sharing', '1-on-1 mentoring']
  }
}

/* @tweakable */ export const TIP_AMOUNTS = [100, 300, 500, 1000, 2000, 5000] // In cents

export interface PaymentIntentData {
  amount: number
  currency: string
  creatorId: string
  type: 'tip' | 'subscription' | 'purchase'
  metadata?: Record<string, any>
}

export interface SubscriptionData {
  creatorId: string
  tier: 'basic' | 'premium' | 'vip'
  customAmount?: number
}

// Utility functions
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount / 100)
}