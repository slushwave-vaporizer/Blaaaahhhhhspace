import React from 'react';

interface MusicRadioProps {
  position?: { x: number; y: number };
  onClick?: () => void;
  isActive?: boolean;
  roomId?: string;
  collaborativeMode?: boolean;
}

const MusicRadio: React.FC<MusicRadioProps> = (props) => {
  // Simplified placeholder component
  return (
    <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center cursor-pointer hover:bg-purple-500 transition-colors"
         onClick={props.onClick}
         style={{
           position: 'absolute',
           left: props.position?.x || 0,
           top: props.position?.y || 0,
           transform: 'translate(-50%, -50%)'
         }}>
      <span className="text-white text-sm">🎵</span>
    </div>
  );
};

export default MusicRadio;
