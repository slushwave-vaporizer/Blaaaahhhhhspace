// Virtual Room 3D Component
// Main 3D room container with Three.js integration

import React, { Suspense, useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
// import { Physics } from '@react-three/cannon'
import { VirtualRoomContent } from './VirtualRoomContent'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { cn } from '../../lib/utils'

interface VirtualRoomProps {
  roomId?: string
  roomData?: any
  onInteraction?: (type: string, data: any) => void
  className?: string
  height?: string
  enableControls?: boolean
  readOnly?: boolean
}

export const VirtualRoom: React.FC<VirtualRoomProps> = ({
  roomId,
  roomData,
  onInteraction,
  className,
  height = '600px',
  enableControls = true,
  readOnly = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Track room visit if roomId is provided
    if (roomId && onInteraction) {
      onInteraction('room_enter', { roomId, timestamp: Date.now() })
      
      return () => {
        onInteraction('room_exit', { roomId, timestamp: Date.now() })
      }
    }
  }, [roomId, onInteraction])

  return (
    <div 
      className={cn(
        'relative bg-black rounded-xl overflow-hidden border border-purple-500/20',
        className
      )}
      style={{ height }}
    >
      <Canvas
        ref={canvasRef}
        camera={{
          position: [0, 1.7, 3],
          fov: 75,
          near: 0.1,
          far: 1000
        }}
        shadows
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          {/* <Physics gravity={[0, -9.82, 0]}> */}
            <VirtualRoomContent
              roomData={roomData}
              roomId={roomId}
              onInteraction={onInteraction}
              enableControls={enableControls}
              readOnly={readOnly}
            />
          {/* </Physics> */}
        </Suspense>
      </Canvas>
      
      {/* Loading overlay */}
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <LoadingSpinner size="lg" />
        </div>
      }>
        <div className="absolute inset-0 pointer-events-none">
          {/* Optional UI overlay components */}
        </div>
      </Suspense>
      
      {/* Controls hint */}
      {enableControls && (
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg p-3">
          <p className="text-white text-sm font-medium mb-1">Controls</p>
          <p className="text-gray-300 text-xs">
            WASD: Move • Mouse: Look around • Click: Interact
          </p>
        </div>
      )}
      
      {/* Room info */}
      {roomData && (
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg p-3">
          <h3 className="text-white font-semibold">{roomData.name}</h3>
          {roomData.description && (
            <p className="text-gray-300 text-sm mt-1">{roomData.description}</p>
          )}
        </div>
      )}
    </div>
  )
}