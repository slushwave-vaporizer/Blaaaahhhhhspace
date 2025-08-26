// Room Lighting Component
// Manages lighting setup for virtual rooms

import React from 'react'
import * as THREE from 'three'

interface RoomLightingProps {
  config?: {
    intensity?: number
    color?: string
  }
  roomAssets?: any[]
  theme?: string
}

export const RoomLighting: React.FC<RoomLightingProps> = ({
  config = { intensity: 0.3, color: '#ffffff' },
  roomAssets = [],
  theme = 'modern'
}) => {
  // Generate spotlight positions based on room assets (paintings, artwork)
  const getSpotlightPositions = () => {
    const positions = []
    
    // Add spotlights for artwork
    const artworkAssets = roomAssets.filter(asset => 
      asset.asset_library?.category === 'artwork'
    )
    
    artworkAssets.forEach(asset => {
      const targetPos = [asset.position_x, asset.position_y, asset.position_z]
      const lightPos = [
        asset.position_x,
        asset.position_y + 2,
        asset.position_z < 0 ? asset.position_z + 1.5 : asset.position_z - 1.5
      ]
      
      positions.push({
        position: lightPos as [number, number, number],
        target: targetPos as [number, number, number]
      })
    })
    
    // Add general room lighting positions if no specific assets
    if (positions.length === 0) {
      positions.push(
        { position: [-3, 6, -4] as [number, number, number], target: [-3, 2, -5.5] as [number, number, number] },
        { position: [0, 6, -4] as [number, number, number], target: [0, 2, -5.5] as [number, number, number] },
        { position: [3, 6, -4] as [number, number, number], target: [3, 2, -5.5] as [number, number, number] },
        { position: [4, 6, 0] as [number, number, number], target: [5.5, 2, 0] as [number, number, number] }
      )
    }
    
    return positions
  }

  const spotlights = getSpotlightPositions()
  
  return (
    <>
      {/* Ambient light - soft overall illumination */}
      <ambientLight 
        intensity={config.intensity || 0.3} 
        color={config.color || '#ffffff'} 
      />
      
      {/* Main directional light - simulates sunlight */}
      <directionalLight
        position={[0, 10, 0]}
        intensity={theme === 'gallery' ? 0.6 : 0.4}
        color={config.color || '#ffffff'}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.001}
      />
      
      {/* Spotlights for featured content */}
      {spotlights.map((spotlight, index) => {
        const targetObject = new THREE.Object3D()
        targetObject.position.set(
          spotlight.target[0], 
          spotlight.target[1], 
          spotlight.target[2]
        )
        
        return (
          <spotLight
            key={index}
            position={spotlight.position}
            target={targetObject}
            intensity={theme === 'gallery' ? 1.5 : 1.0}
            angle={Math.PI / 6} // 30 degree cone
            penumbra={0.3} // Soft edge
            decay={1.5}
            distance={15}
            color={config.color || '#ffffff'}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-camera-fov={45}
            shadow-camera-near={1}
            shadow-camera-far={20}
            shadow-bias={-0.001}
          />
        )
      })}
      
      {/* Fill light from floor - adds subtle bottom lighting */}
      <rectAreaLight
        position={[0, 0.1, 0]}
        args={[12, 12]}
        intensity={0.2}
        color="#fff8dc" // Warm white
        rotation={[-Math.PI / 2, 0, 0]}
      />
      
      {/* Room corner accent lighting */}
      <pointLight
        position={[-5, 3, -5]}
        intensity={0.3}
        color={theme === 'studio' ? '#ff9500' : '#ffffff'}
        decay={2}
        distance={10}
      />
      
      <pointLight
        position={[5, 3, 5]}
        intensity={0.3}
        color={theme === 'studio' ? '#ff9500' : '#ffffff'}
        decay={2}
        distance={10}
      />
    </>
  )
}