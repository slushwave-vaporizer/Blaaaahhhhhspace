// First Person Controls Component
// Handles WASD movement and mouse look for 3D room navigation

import React, { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
// import { useSphere } from '@react-three/cannon'
import { PointerLockControls } from '@react-three/drei'
import * as THREE from 'three'

interface FirstPersonControlsProps {
  onMove?: (position: THREE.Vector3) => void
  speed?: number
  initialPosition?: [number, number, number]
}

export const FirstPersonControls: React.FC<FirstPersonControlsProps> = ({
  onMove,
  speed = 2.5,
  initialPosition = [0, 1.7, 3]
}) => {
  const { camera } = useThree()
  const controlsRef = useRef<any>()
  
  // Simple camera controls without physics
  const cameraPosition = useRef(new THREE.Vector3(...initialPosition))
  
  const velocity = useRef([0, 0, 0])
  const direction = useRef(new THREE.Vector3())
  const frontVector = useRef(new THREE.Vector3())
  const sideVector = useRef(new THREE.Vector3())
  
  // Keyboard state tracking
  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false
  })
  
  // Set up keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keys.current.forward = true
          break
        case 'KeyS':
        case 'ArrowDown':
          keys.current.backward = true
          break
        case 'KeyA':
        case 'ArrowLeft':
          keys.current.left = true
          break
        case 'KeyD':
        case 'ArrowRight':
          keys.current.right = true
          break
        case 'ShiftLeft':
        case 'ShiftRight':
          keys.current.sprint = true
          break
      }
    }
    
    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keys.current.forward = false
          break
        case 'KeyS':
        case 'ArrowDown':
          keys.current.backward = false
          break
        case 'KeyA':
        case 'ArrowLeft':
          keys.current.left = false
          break
        case 'KeyD':
        case 'ArrowRight':
          keys.current.right = false
          break
        case 'ShiftLeft':
        case 'ShiftRight':
          keys.current.sprint = false
          break
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [])
  
  // Animation loop for movement
  useFrame(() => {
    // Update camera position based on movement
    camera.position.copy(cameraPosition.current)
    
    // Call movement callback
    if (onMove) {
      onMove(cameraPosition.current)
    }
    
    // Calculate movement direction based on camera orientation and input
    frontVector.current.set(
      0, 
      0, 
      Number(keys.current.backward) - Number(keys.current.forward)
    )
    
    sideVector.current.set(
      Number(keys.current.left) - Number(keys.current.right), 
      0, 
      0
    )
    
    // Combine movement vectors and apply camera rotation
    direction.current
      .subVectors(frontVector.current, sideVector.current)
      .normalize()
      .multiplyScalar(speed * (keys.current.sprint ? 1.5 : 1)) // Sprint multiplier
      .applyEuler(camera.rotation)
    
    // Apply movement to camera position
    cameraPosition.current.add(direction.current)
  })
  
  // Subscribe to velocity updates from physics engine
  // useEffect(() => {
  //   const unsubscribe = api.velocity.subscribe((v) => {
  //     velocity.current = v
  //   })
  //   return unsubscribe
  // }, [api.velocity])
  
  return (
    <>
      {/* Pointer lock controls for mouse look */}
      <PointerLockControls 
        ref={controlsRef}
        selector="#instructions" // Optional: CSS selector for lock instructions
      />
    </>
  )
}