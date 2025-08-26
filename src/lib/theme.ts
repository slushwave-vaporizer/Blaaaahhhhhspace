// YourSpace Creative Labs - Vaporwave Theme Configuration
import { createContext, useContext } from 'react'

// Vaporwave color palettes
/* @tweakable */ export const NEON_COLORS = {
  primary: {
    pink: '#ff006e',
    purple: '#8338ec',
    blue: '#3a86ff',
    cyan: '#06ffa5',
    orange: '#fb8500'
  },
  secondary: {
    darkPurple: '#240046',
    deepBlue: '#10002b',
    midnight: '#000011',
    darkCyan: '#003554',
    charcoal: '#0d1b2a'
  },
  gradients: {
    sunset: 'linear-gradient(135deg, #ff006e 0%, #8338ec 50%, #3a86ff 100%)',
    aurora: 'linear-gradient(45deg, #06ffa5 0%, #3a86ff 50%, #8338ec 100%)',
    cyberpunk: 'linear-gradient(180deg, #240046 0%, #10002b 100%)',
    neon: 'linear-gradient(90deg, #ff006e 0%, #fb8500 100%)'
  }
}

/* @tweakable */ export const ANIMATION_SETTINGS = {
  glowIntensity: 20, // Neon glow blur radius
  pulseSpeed: 2, // Animation duration in seconds
  hoverScale: 1.05, // Scale factor on hover
  transitionDuration: 0.3, // Default transition time
  particleCount: 50 // Background particle count
}

/* @tweakable */ export const LAYOUT_SETTINGS = {
  sidebarWidth: 280, // pixels
  headerHeight: 80, // pixels
  borderRadius: 12, // pixels
  cardPadding: 24, // pixels
  gridGap: 20 // pixels
}

export interface ThemeContextType {
  currentTheme: keyof typeof NEON_COLORS.primary
  setTheme: (theme: keyof typeof NEON_COLORS.primary) => void
  isDarkMode: boolean
  toggleDarkMode: () => void
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}