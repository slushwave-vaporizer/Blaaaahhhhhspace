// YourSpace Creative Labs - Computer 3D Asset Component
// Specialized component for interactive computer workstations in virtual rooms

import React, { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'

interface Computer3DAssetProps {
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  onClick: (e: ThreeEvent<MouseEvent>) => void
  onHover?: (hovered: boolean) => void
  hovered: boolean
  clicked: boolean
  creatorName?: string
}

export const Computer3DAsset: React.FC<Computer3DAssetProps> = ({
  position,
  rotation,
  scale,
  onClick,
  onHover,
  hovered,
  clicked,
  creatorName = "Creator"
}) => {
  const groupRef = useRef<THREE.Group>(null)
  const [screenGlow, setScreenGlow] = useState(0.3)

  // Animate screen glow
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    setScreenGlow(0.3 + Math.sin(time * 2) * 0.1)
    
    if (groupRef.current && hovered) {
      groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.05
    }
  })

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    onClick(e)
  }

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    onHover?.(true)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    onHover?.(false)
    document.body.style.cursor = 'auto'
  }

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Desk Surface */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.1, 1.2]} />
        <meshStandardMaterial 
          color={hovered ? '#8B4513' : '#654321'}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Monitor Stand */}
      <mesh position={[0, 0.3, -0.3]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 0.5]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Monitor Base */}
      <mesh position={[0, 0.05, -0.3]} castShadow>
        <cylinderGeometry args={[0.25, 0.3, 0.1]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Monitor Screen Frame */}
      <mesh position={[0, 0.8, -0.25]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 1.0, 0.08]} />
        <meshStandardMaterial 
          color={hovered ? '#1a1a1a' : '#000000'}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Monitor Screen */}
      <mesh position={[0, 0.8, -0.21]}>
        <planeGeometry args={[1.4, 0.8]} />
        <meshStandardMaterial 
          color={clicked ? '#ff006e' : '#0066cc'}
          emissive={clicked ? '#ff006e' : '#0066cc'}
          emissiveIntensity={screenGlow * (clicked ? 1.5 : 1)}
          roughness={0}
          metalness={0}
        />
      </mesh>

      {/* Keyboard */}
      <mesh position={[0, 0.06, 0.2]} castShadow>
        <boxGeometry args={[1.2, 0.04, 0.4]} />
        <meshStandardMaterial 
          color={hovered ? '#333333' : '#2a2a2a'}
          roughness={0.6}
          metalness={0.4}
        />
      </mesh>

      {/* Mouse */}
      <mesh position={[0.6, 0.06, 0.3]} castShadow>
        <boxGeometry args={[0.08, 0.02, 0.12]} />
        <meshStandardMaterial 
          color="#1a1a1a"
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>

      {/* Screen Content Hint */}
      <Text
        position={[0, 0.8, -0.2]}
        fontSize={0.08}
        color={clicked ? '#ffffff' : '#ffffff'}
        anchorX="center"
        anchorY="middle"
        maxWidth={1.2}
      >
        {clicked ? 'Opening Workstation...' : `${creatorName}'s Creative Hub`}
      </Text>

      {/* Interaction Indicator */}
      {hovered && (
        <Text
          position={[0, 0.4, -0.2]}
          fontSize={0.06}
          color="#8338ec"
          anchorX="center"
          anchorY="middle"
        >
          Click to access workstation
        </Text>
      )}

      {/* Ambient Light from Screen */}
      <pointLight
        position={[0, 0.8, -0.1]}
        color={clicked ? '#ff006e' : '#0066cc'}
        intensity={screenGlow * 0.5}
        distance={3}
        decay={2}
      />
    </group>
  )
}
