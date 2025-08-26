// YourSpace Creative Labs - Tailwind CSS Configuration
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          pink: '#ff006e',
          purple: '#8338ec',
          blue: '#3a86ff',
          cyan: '#06ffa5',
          orange: '#fb8500',
        },
        dark: {
          purple: '#240046',
          blue: '#10002b',
          midnight: '#000011',
          cyan: '#003554',
          charcoal: '#0d1b2a',
        },
      },
      backgroundImage: {
        'gradient-vaporwave': 'linear-gradient(135deg, #ff006e 0%, #8338ec 50%, #3a86ff 100%)',
        'gradient-aurora': 'linear-gradient(45deg, #06ffa5 0%, #3a86ff 50%, #8338ec 100%)',
        'gradient-cyberpunk': 'linear-gradient(180deg, #240046 0%, #10002b 100%)',
        'gradient-neon': 'linear-gradient(90deg, #ff006e 0%, #fb8500 100%)',
      },
      boxShadow: {
        'neon': '0 0 20px currentColor',
        'neon-lg': '0 0 40px currentColor',
      },
      animation: {
        'gradient-shift': 'gradientShift 15s ease infinite',
        'pulse-neon': 'pulseNeon 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'hologram': 'hologramShift 3s linear infinite',
      },
      keyframes: {
        gradientShift: {
          '0%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 50%' },
        },
        pulseNeon: {
          'from': { filter: 'drop-shadow(0 0 10px currentColor)' },
          'to': { filter: 'drop-shadow(0 0 20px currentColor) drop-shadow(0 0 40px currentColor)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        hologramShift: {
          '0%': { 'background-position': '-200% 0' },
          '100%': { 'background-position': '200% 0' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}

export default config