// Virtual Room Content Component
// Contains the actual 3D scene elements

import React from 'react'
import { RoomStructure } from './RoomStructure'
import { RoomAssets } from './RoomAssets'
import { RoomLighting } from './RoomLighting'
import { FirstPersonControls } from './FirstPersonControls'
import { Sky } from '@react-three/drei'

interface VirtualRoomContentProps {
  roomData?: any
  roomId?: string
  onInteraction?: (type: string, data: any) => void
  enableControls?: boolean
  readOnly?: boolean
}

export const VirtualRoomContent: React.FC<VirtualRoomContentProps> = ({
  roomData,
  roomId,
  onInteraction,
  enableControls = true,
  readOnly = false
}) => {
  const handleAssetInteraction = (assetId: string, interactionType: string, data: any) => {
    if (onInteraction) {
      onInteraction('asset_interaction', {
        assetId,
        interactionType,
        data,
        roomId,
        timestamp: Date.now()
      })
    }
  }

  return (
    <>
      {/* Sky/Environment */}
      <Sky 
        sunPosition={[0, 1, 0]} 
        turbidity={8}
        rayleigh={6}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
        inclination={0} // Noon
        azimuth={0.25} // North
      />
      
      {/* Lighting System */}
      <RoomLighting 
        config={roomData?.ambient_lighting || { intensity: 0.3, color: '#ffffff' }}
        roomAssets={roomData?.assets || []}
      />
      
      {/* Room Structure (walls, floor, ceiling) */}
      <RoomStructure 
        config={roomData?.room_config || {}}
        theme={roomData?.theme || 'modern'}
        floorTexture={roomData?.floor_texture}
        wallTexture={roomData?.wall_texture}
        ceilingTexture={roomData?.ceiling_texture}
        backgroundColor={roomData?.background_color || '#f8f8f8'}
      />
      
      {/* Room Assets (furniture, artwork, etc.) */}
      <RoomAssets 
        roomId={roomId}
        assets={roomData?.assets || []}
        onInteraction={handleAssetInteraction}
        readOnly={readOnly}
        creatorName={roomData?.profiles?.display_name || roomData?.profiles?.username || 'Creator'}
      />
      
      {/* First Person Controls */}
      {enableControls && (
        <FirstPersonControls 
          onMove={(position) => {
            if (onInteraction) {
              onInteraction('player_move', { position, roomId, timestamp: Date.now() })
            }
          }}
        />
      )}
    </>
  )
}