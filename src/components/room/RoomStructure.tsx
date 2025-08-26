// Room Structure Component
// Handles walls, floor, ceiling and basic room architecture

import React, { useMemo } from 'react'
import { useTexture } from '@react-three/drei'
// import { usePlane } from '@react-three/cannon'
import * as THREE from 'three'

interface RoomStructureProps {
  config?: any
  theme?: string
  floorTexture?: string
  wallTexture?: string
  ceilingTexture?: string
  backgroundColor?: string
}

export const RoomStructure: React.FC<RoomStructureProps> = ({
  config = {},
  theme = 'modern',
  floorTexture,
  wallTexture,
  ceilingTexture,
  backgroundColor = '#f8f8f8'
}) => {
  // Room dimensions from config or defaults
  const roomWidth = config.width || 12
  const roomDepth = config.depth || 12  
  const roomHeight = config.height || 8
  
  // Load textures
  const floorTextureMap = useTexture(
    floorTexture || '/textures/dark_walnut_wood_floor_seamless_texture_3d.jpg'
  )
  
  // Configure texture tiling
  useMemo(() => {
    if (floorTextureMap) {
      floorTextureMap.wrapS = floorTextureMap.wrapT = THREE.RepeatWrapping
      floorTextureMap.repeat.set(roomWidth / 1.5, roomDepth / 1.5)
    }
  }, [floorTextureMap, roomWidth, roomDepth])
  
  // Physics planes for collision - commented out for now
  // const [floorRef] = usePlane(() => ({
  //   rotation: [-Math.PI / 2, 0, 0],
  //   position: [0, 0, 0],
  //   material: { friction: 0.4, restitution: 0.1 }
  // }))
  
  // const [frontWallRef] = usePlane(() => ({
  //   position: [0, roomHeight / 2, -roomDepth / 2],
  //   rotation: [0, 0, 0]
  // }))
  
  // const [backWallRef] = usePlane(() => ({
  //   position: [0, roomHeight / 2, roomDepth / 2],
  //   rotation: [0, Math.PI, 0]
  // }))
  
  // const [leftWallRef] = usePlane(() => ({
  //   position: [-roomWidth / 2, roomHeight / 2, 0],
  //   rotation: [0, Math.PI / 2, 0]
  // }))
  
  // const [rightWallRef] = usePlane(() => ({
  //   position: [roomWidth / 2, roomHeight / 2, 0],
  //   rotation: [0, -Math.PI / 2, 0]
  // }))
  
  // const [ceilingRef] = usePlane(() => ({
  //   rotation: [Math.PI / 2, 0, 0],
  //   position: [0, roomHeight, 0]
  // }))

  // Theme-based materials
  const getWallMaterial = () => {
    switch (theme) {
      case 'gallery':
        return {
          color: '#fdfdfd',
          roughness: 0.1,
          metalness: 0.05
        }
      case 'studio':
        return {
          color: '#f0f0f0',
          roughness: 0.3,
          metalness: 0.1
        }
      case 'industrial':
        return {
          color: '#e8e8e8',
          roughness: 0.8,
          metalness: 0.2
        }
      default:
        return {
          color: backgroundColor || '#fdfdfd',
          roughness: 0.1,
          metalness: 0.05
        }
    }
  }

  const wallMaterial = getWallMaterial()

  return (
    <group name="room-structure">
      {/* Floor */}
      <mesh receiveShadow name="floor" position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[roomWidth, roomDepth]} />
        <meshStandardMaterial 
          map={floorTextureMap}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      
      {/* Front Wall */}
      <mesh receiveShadow name="front-wall" position={[0, roomHeight / 2, -roomDepth / 2]}>
        <planeGeometry args={[roomWidth, roomHeight]} />
        <meshStandardMaterial 
          color={wallMaterial.color}
          roughness={wallMaterial.roughness}
          metalness={wallMaterial.metalness}
        />
      </mesh>
      
      {/* Back Wall */}
      <mesh receiveShadow name="back-wall" position={[0, roomHeight / 2, roomDepth / 2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[roomWidth, roomHeight]} />
        <meshStandardMaterial 
          color={wallMaterial.color}
          roughness={wallMaterial.roughness}
          metalness={wallMaterial.metalness}
        />
      </mesh>
      
      {/* Left Wall */}
      <mesh receiveShadow name="left-wall" position={[-roomWidth / 2, roomHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[roomDepth, roomHeight]} />
        <meshStandardMaterial 
          color={wallMaterial.color}
          roughness={wallMaterial.roughness}
          metalness={wallMaterial.metalness}
        />
      </mesh>
      
      {/* Right Wall */}
      <mesh receiveShadow name="right-wall" position={[roomWidth / 2, roomHeight / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[roomDepth, roomHeight]} />
        <meshStandardMaterial 
          color={wallMaterial.color}
          roughness={wallMaterial.roughness}
          metalness={wallMaterial.metalness}
        />
      </mesh>
      
      {/* Ceiling */}
      <mesh receiveShadow name="ceiling" position={[0, roomHeight, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[roomWidth, roomDepth]} />
        <meshStandardMaterial 
          color={theme === 'industrial' ? '#e0e0e0' : '#f8f8f8'}
          roughness={0.2}
          metalness={0.0}
        />
      </mesh>
    </group>
  )
}