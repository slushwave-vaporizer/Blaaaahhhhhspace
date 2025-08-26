// Room Assets Component
// Handles rendering and interaction with 3D assets within the room

import React, { useState, useEffect } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'
// import { useBox } from '@react-three/cannon'
import { ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { Computer3DAsset } from './Computer3DAsset'
import { ComputerInterfaceModal } from './ComputerInterfaceModal'

interface RoomAsset {
  id: string
  asset_id: string
  position_x: number
  position_y: number
  position_z: number
  rotation_x: number
  rotation_y: number
  rotation_z: number
  scale_x: number
  scale_y: number
  scale_z: number
  custom_properties?: any
  is_interactive?: boolean
  interaction_type?: string
  interaction_data?: any
  asset_library?: {
    name: string
    file_url: string
    thumbnail_url?: string
    category: string
    dimensions?: any
  }
}

interface RoomAssetsProps {
  roomId?: string
  assets: RoomAsset[]
  onInteraction?: (assetId: string, interactionType: string, data: any) => void
  readOnly?: boolean
  creatorName?: string
}

export const RoomAssets: React.FC<RoomAssetsProps> = ({
  roomId,
  assets = [],
  onInteraction,
  readOnly = false,
  creatorName = 'Creator'
}) => {
  const [computerModalOpen, setComputerModalOpen] = useState(false)
  const [selectedComputerAsset, setSelectedComputerAsset] = useState<RoomAsset | null>(null)

  const handleComputerClick = (asset: RoomAsset) => {
    setSelectedComputerAsset(asset)
    setComputerModalOpen(true)
    
    if (onInteraction) {
      onInteraction(asset.id, 'computer_interface_open', {
        assetId: asset.id,
        roomId,
        timestamp: Date.now()
      })
    }
  }

  const handleComputerModalClose = () => {
    setComputerModalOpen(false)
    setSelectedComputerAsset(null)
    
    if (onInteraction && selectedComputerAsset) {
      onInteraction(selectedComputerAsset.id, 'computer_interface_close', {
        assetId: selectedComputerAsset.id,
        roomId,
        timestamp: Date.now()
      })
    }
  }

  return (
    <>
      <group name="room-assets">
        {assets.map((asset) => (
          <RoomAsset
            key={asset.id}
            asset={asset}
            onInteraction={onInteraction}
            onComputerClick={handleComputerClick}
            readOnly={readOnly}
            creatorName={creatorName}
          />
        ))}
      </group>

      {/* Computer Interface Modal */}
      <ComputerInterfaceModal
        isOpen={computerModalOpen}
        onClose={handleComputerModalClose}
        creatorId={selectedComputerAsset?.asset_library?.custom_properties?.creator_id}
        roomId={roomId}
      />
    </>
  )
}

interface RoomAssetProps {
  asset: RoomAsset
  onInteraction?: (assetId: string, interactionType: string, data: any) => void
  onComputerClick?: (asset: RoomAsset) => void
  readOnly?: boolean
  creatorName?: string
}

const RoomAsset: React.FC<RoomAssetProps> = ({
  asset,
  onInteraction,
  onComputerClick,
  readOnly = false,
  creatorName = 'Creator'
}) => {
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  // Position, rotation, and scale
  const position: [number, number, number] = [
    asset.position_x,
    asset.position_y,
    asset.position_z
  ]
  
  const rotation: [number, number, number] = [
    asset.rotation_x,
    asset.rotation_y,
    asset.rotation_z
  ]
  
  const scale: [number, number, number] = [
    asset.scale_x,
    asset.scale_y,
    asset.scale_z
  ]

  // Physics body for collision - commented out for now
  // const [meshRef] = useBox(() => ({
  //   position,
  //   rotation,
  //   mass: 0, // Static objects
  //   args: [asset.asset_library?.dimensions?.width || 1, 
  //          asset.asset_library?.dimensions?.height || 1, 
  //          asset.asset_library?.dimensions?.depth || 1]
  // }))

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    
    if (asset.is_interactive) {
      setClicked(true)
      setTimeout(() => setClicked(false), 200)
      
      // Handle computer interface clicks specially
      if (asset.interaction_type === 'computer_interface' && onComputerClick) {
        onComputerClick(asset)
        return
      }
      
      if (onInteraction) {
        onInteraction(asset.id, asset.interaction_type || 'click', {
          position: e.point,
          asset: asset,
          timestamp: Date.now()
        })
      }
    }
  }

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    if (asset.is_interactive) {
      setHovered(true)
      document.body.style.cursor = 'pointer'
    }
  }

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setHovered(false)
    document.body.style.cursor = 'auto'
  }

  // Render different asset types
  const renderAsset = () => {
    if (!asset.asset_library) {
      return (
        <mesh
          position={position}
          rotation={rotation}
          scale={scale}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial 
            color={hovered ? '#8338ec' : '#666666'} 
            emissive={clicked ? '#ff006e' : '#000000'}
          />
        </mesh>
      )
    }

    // Handle computer workstation assets specially
    if (asset.interaction_type === 'computer_interface' || 
        asset.asset_library.subcategory === 'computer_workstation') {
      return (
        <Computer3DAsset
          position={position}
          rotation={rotation}
          scale={scale}
          onClick={handleClick}
          onHover={(hovered) => {
            if (hovered) {
              handlePointerOver({} as any)
            } else {
              handlePointerOut({} as any)
            }
          }}
          hovered={hovered}
          clicked={clicked}
          creatorName={creatorName}
        />
      )
    }

    // Handle different asset categories
    switch (asset.asset_library.category) {
      case 'artwork':
        return (
          <ArtworkAsset 
            asset={asset}
            position={position}
            rotation={rotation}
            scale={scale}
            hovered={hovered}
            clicked={clicked}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            onClick={handleClick}
          />
        )
      
      case 'furniture':
      case 'decorations':
      case 'lighting':
      default:
        return (
          <Generic3DAsset 
            asset={asset}
            position={position}
            rotation={rotation}
            scale={scale}
            hovered={hovered}
            clicked={clicked}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            onClick={handleClick}
          />
        )
    }
  }

  return (
    <group name={`asset-${asset.id}`}>
      {renderAsset()}
    </group>
  )
}

// Specialized component for artwork (paintings, photos)
const ArtworkAsset: React.FC<{
  asset: RoomAsset
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  hovered: boolean
  clicked: boolean
  onPointerOver: (e: ThreeEvent<PointerEvent>) => void
  onPointerOut: (e: ThreeEvent<PointerEvent>) => void
  onClick: (e: ThreeEvent<MouseEvent>) => void
}> = ({ asset, position, rotation, scale, hovered, clicked, ...handlers }) => {
  const texture = useTexture(asset.asset_library?.thumbnail_url || '/images/default-artwork.jpg')
  
  // Default painting dimensions
  const width = asset.asset_library?.dimensions?.width || 2
  const height = asset.asset_library?.dimensions?.height || 1.5
  const depth = 0.05

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Frame */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width + 0.2, height + 0.2, depth + 0.02]} />
        <meshStandardMaterial 
          color={hovered ? '#8B4513' : '#654321'}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      {/* Artwork */}
      <mesh 
        // ref={ref}
        position={[0, 0, depth / 2 + 0.01]}
        castShadow
        {...handlers}
      >
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial 
          map={texture}
          emissive={clicked ? '#ff006e' : hovered ? '#8338ec' : '#000000'}
          emissiveIntensity={clicked ? 0.3 : hovered ? 0.1 : 0}
        />
      </mesh>
    </group>
  )
}

// Generic 3D asset component for other types
const Generic3DAsset: React.FC<{
  asset: RoomAsset
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  hovered: boolean
  clicked: boolean
  onPointerOver: (e: ThreeEvent<PointerEvent>) => void
  onPointerOut: (e: ThreeEvent<PointerEvent>) => void
  onClick: (e: ThreeEvent<MouseEvent>) => void
}> = ({ asset, position, rotation, scale, hovered, clicked, ...handlers }) => {
  // Try to load GLTF model, fallback to basic geometry
  let gltf
  try {
    if (asset.asset_library?.file_url && 
        (asset.asset_library.file_url.includes('.gltf') || 
         asset.asset_library.file_url.includes('.glb'))) {
      gltf = useGLTF(asset.asset_library.file_url)
    }
  } catch (error) {
    console.warn('Failed to load GLTF model:', asset.asset_library?.file_url)
  }

  if (gltf && gltf.scene) {
    return (
      <primitive
        // ref={ref}
        object={gltf.scene.clone()}
        position={position}
        rotation={rotation}
        scale={scale}
        castShadow
        receiveShadow
        {...handlers}
      />
    )
  }

  // Fallback to basic geometry based on category
  const getGeometry = () => {
    const dims = asset.asset_library?.dimensions
    const width = dims?.width || 1
    const height = dims?.height || 1
    const depth = dims?.depth || 1

    switch (asset.asset_library?.category) {
      case 'furniture':
        return <boxGeometry args={[width, height, depth]} />
      case 'lighting':
        return <sphereGeometry args={[width / 2, 16, 16]} />
      case 'plants':
        return <coneGeometry args={[width / 2, height, 8]} />
      default:
        return <boxGeometry args={[width, height, depth]} />
    }
  }

  const getMaterial = () => {
    const baseColor = asset.custom_properties?.color || '#8B7D6B'
    
    return (
      <meshStandardMaterial
        color={hovered ? '#8338ec' : baseColor}
        roughness={0.7}
        metalness={0.3}
        emissive={clicked ? '#ff006e' : '#000000'}
        emissiveIntensity={clicked ? 0.2 : 0}
      />
    )
  }

  return (
    <mesh
      // ref={ref}
      position={position}
      rotation={rotation}
      scale={scale}
      castShadow
      receiveShadow
      {...handlers}
    >
      {getGeometry()}
      {getMaterial()}
    </mesh>
  )
}