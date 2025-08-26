// YourSpace Creative Labs - Main Layout Component
import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { ParticleBackground } from '../effects/ParticleBackground'

interface LayoutProps {
  children: ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      <ParticleBackground />
      
      <div className="flex">
        <Sidebar />
        
        <div className="flex-1 flex flex-col">
          <Header />
          
          <main className="flex-1 p-6 relative z-10">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}