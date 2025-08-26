// Theme definitions for YourSpace Creative Labs

export const themes = {
  'neon-city': {
    name: 'Neon City',
    description: 'Vaporwave aesthetic with neon grids and retro elements',
    primary: '#ff006e', // Neon pink
    secondary: '#8338ec', // Electric purple
    accent: '#3a86ff', // Cyber blue
    background: '#0d1117', // Dark space
    surface: '#161b22', // Card background
    text: '#ffffff',
    textSecondary: '#c9d1d9',
    grid: '#ff006e33', // Neon grid overlay
    glow: '#ff006e',
    gradient: 'linear-gradient(135deg, #ff006e 0%, #8338ec 50%, #3a86ff 100%)',
    css: `
      body { background: linear-gradient(45deg, #0d1117 25%, transparent 25%), 
             linear-gradient(-45deg, #0d1117 25%, transparent 25%), 
             linear-gradient(45deg, transparent 75%, #0d1117 75%), 
             linear-gradient(-45deg, transparent 75%, #0d1117 75%);
             background-size: 20px 20px;
             background-position: 0 0, 0 10px, 10px -10px, -10px 0px; }
      .neon-glow { box-shadow: 0 0 20px #ff006e, 0 0 40px #ff006e, 0 0 60px #ff006e; }
      .neon-text { text-shadow: 0 0 10px #ff006e, 0 0 20px #ff006e, 0 0 40px #ff006e; }
    `
  },
  
  'zen-garden': {
    name: 'Zen Garden',
    description: 'Minimalist design with calming natural tones',
    primary: '#2d5a27', // Forest green
    secondary: '#8fbc8f', // Sage green
    accent: '#f4f3ee', // Warm white
    background: '#fefefe', // Pure white
    surface: '#f8f9fa', // Light surface
    text: '#2c3e50',
    textSecondary: '#6c757d',
    grid: '#2d5a2710',
    glow: '#2d5a27',
    gradient: 'linear-gradient(135deg, #2d5a27 0%, #8fbc8f 100%)',
    css: `
      body { background: radial-gradient(circle at 20% 50%, #f4f3ee 0%, transparent 50%), 
             radial-gradient(circle at 80% 20%, #8fbc8f 0%, transparent 50%); }
      .zen-shadow { box-shadow: 0 4px 6px -1px rgba(45, 90, 39, 0.1), 0 2px 4px -1px rgba(45, 90, 39, 0.06); }
    `
  },
  
  'arcade-retro': {
    name: 'Arcade Retro',
    description: '8-bit styling with classic gaming aesthetics',
    primary: '#ff6b35', // Pixel orange
    secondary: '#f7931e', // Game yellow
    accent: '#ffd23f', // Bright yellow
    background: '#1a1a2e', // Dark purple
    surface: '#16213e', // Navy surface
    text: '#ffffff',
    textSecondary: '#b8c5d1',
    grid: '#ff6b3533',
    glow: '#ff6b35',
    gradient: 'linear-gradient(90deg, #ff6b35 0%, #f7931e 50%, #ffd23f 100%)',
    css: `
      body { background: repeating-linear-gradient(45deg, #1a1a2e 0px, #1a1a2e 2px, #16213e 2px, #16213e 4px); }
      .pixel-border { border: 2px solid #ff6b35; border-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><rect width="8" height="8" fill="%23ff6b35"/></svg>') 2; }
      .arcade-glow { box-shadow: 0 0 0 2px #ff6b35, 0 0 0 4px #f7931e, 0 0 20px #ff6b35; }
    `
  },
  
  'cyberpunk': {
    name: 'Cyberpunk',
    description: 'Dark tech theme with electric accents',
    primary: '#00ffff', // Cyan
    secondary: '#ff0080', // Hot pink
    accent: '#ffff00', // Electric yellow
    background: '#0a0a0a', // Deep black
    surface: '#1a1a1a', // Dark surface
    text: '#ffffff',
    textSecondary: '#888888',
    grid: '#00ffff33',
    glow: '#00ffff',
    gradient: 'linear-gradient(135deg, #00ffff 0%, #ff0080 50%, #ffff00 100%)',
    css: `
      body { background: linear-gradient(90deg, #0a0a0a 50%, transparent 50%), 
             linear-gradient(#0a0a0a 50%, transparent 50%); 
             background-size: 2px 2px; }
      .cyber-glow { box-shadow: 0 0 10px #00ffff, inset 0 0 10px #00ffff; }
      .cyber-scan { background: linear-gradient(90deg, transparent 0%, #00ffff22 50%, transparent 100%); 
                   animation: scan 2s linear infinite; }
      @keyframes scan { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
    `
  }
}

export type ThemeName = keyof typeof themes

export const getTheme = (themeName: ThemeName) => themes[themeName]

export const applyTheme = (themeName: ThemeName) => {
  const theme = getTheme(themeName)
  
  // Apply CSS custom properties
  const root = document.documentElement
  root.style.setProperty('--color-primary', theme.primary)
  root.style.setProperty('--color-secondary', theme.secondary)
  root.style.setProperty('--color-accent', theme.accent)
  root.style.setProperty('--color-background', theme.background)
  root.style.setProperty('--color-surface', theme.surface)
  root.style.setProperty('--color-text', theme.text)
  root.style.setProperty('--color-text-secondary', theme.textSecondary)
  root.style.setProperty('--color-glow', theme.glow)
  root.style.setProperty('--gradient-primary', theme.gradient)
  
  // Apply custom CSS
  let styleElement = document.getElementById('theme-styles')
  if (!styleElement) {
    styleElement = document.createElement('style')
    styleElement.id = 'theme-styles'
    document.head.appendChild(styleElement)
  }
  styleElement.textContent = theme.css
}

// Vibe-based color mapping
export const vibeColors = {
  chill: '#6dd5ed',
  energetic: '#ff6b6b',
  dark: '#4a4a4a',
  uplifting: '#ffd93d',
  nostalgic: '#dda0dd',
  creative: '#9b59b6',
  peaceful: '#52c39a',
  intense: '#e74c3c'
}

export const getVibeColor = (vibe: string) => vibeColors[vibe as keyof typeof vibeColors] || '#888888'