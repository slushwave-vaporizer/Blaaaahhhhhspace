// YourSpace Creative Labs - Theme Provider Component
import { useState, useEffect, ReactNode } from 'react'
import { ThemeContext, NEON_COLORS } from '../../lib/theme'

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [currentTheme, setCurrentTheme] = useState<keyof typeof NEON_COLORS.primary>('pink')
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('neon-theme') as keyof typeof NEON_COLORS.primary
    const savedDarkMode = localStorage.getItem('dark-mode') === 'true'
    
    if (savedTheme && NEON_COLORS.primary[savedTheme]) {
      setCurrentTheme(savedTheme)
    }
    
    setIsDarkMode(savedDarkMode)
    
    // Apply theme to document
    document.documentElement.className = savedDarkMode ? 'dark' : ''
    document.documentElement.style.setProperty('--primary-neon', NEON_COLORS.primary[savedTheme || 'pink'])
  }, [])

  const setTheme = (theme: keyof typeof NEON_COLORS.primary) => {
    setCurrentTheme(theme)
    localStorage.setItem('neon-theme', theme)
    document.documentElement.style.setProperty('--primary-neon', NEON_COLORS.primary[theme])
  }

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    localStorage.setItem('dark-mode', newDarkMode.toString())
    document.documentElement.className = newDarkMode ? 'dark' : ''
  }

  const value = {
    currentTheme,
    setTheme,
    isDarkMode,
    toggleDarkMode
  }

  return (
    <ThemeContext.Provider value={value}>
      <div className={`theme-${currentTheme} ${isDarkMode ? 'dark' : ''}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}