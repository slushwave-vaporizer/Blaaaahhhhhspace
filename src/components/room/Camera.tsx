// YourSpace Creative Labs - Camera 3D Model Component
import React from 'react';
import { VideoCameraIcon } from '@heroicons/react/24/outline';

interface CameraProps {
  status?: 'available' | 'streaming' | 'disabled';
  onClick?: () => void;
  isEditMode?: boolean;
  className?: string;
}

/**
 * A Camera component for the virtual room
 * This represents the streaming camera object
 */
const Camera: React.FC<CameraProps> = ({ 
  status = 'available', 
  onClick, 
  isEditMode = false,
  className = ''
}) => {
  return (
    <div className={`group ${className}`}>
      <div 
        className={`
          w-14 h-12 rounded-xl shadow-lg border border-white/20 cursor-pointer
          flex items-center justify-center transition-all duration-300
          ${status === 'streaming' 
            ? 'bg-gradient-to-br from-red-500 to-pink-500 animate-pulse' 
            : status === 'disabled'
              ? 'bg-gradient-to-br from-gray-600 to-gray-700 opacity-70'
              : 'bg-gradient-to-br from-purple-500 to-blue-500 hover:scale-110'}
          ${isEditMode ? 'ring-2 ring-white/50 ring-offset-2 ring-offset-transparent' : ''}
        `}
        onClick={onClick}
      >
        <VideoCameraIcon className="w-6 h-6 text-white drop-shadow-sm" />
        {status === 'streaming' && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
        )}
      </div>

      {/* Label */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          {status === 'streaming' ? 'Live Stream' : status === 'disabled' ? 'Camera Disabled' : 'Start Streaming'}
        </div>
      </div>
    </div>
  );
};

export default Camera;
