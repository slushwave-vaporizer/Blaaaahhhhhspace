// YourSpace Creative Labs - Stream Camera Component for Virtual Room
import React, { useState, useEffect } from 'react';
import { VideoCameraIcon, MicrophoneIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useStreaming, StreamSession } from '../../hooks/useStreaming';
import { cn } from '../../lib/utils';

interface StreamCameraProps {
  roomId: string;
  position: { x: number; y: number };
  onClick: () => void;
  className?: string;
  isEditMode?: boolean;
  onDragEnd?: (x: number, y: number) => void;
}

export const StreamCamera: React.FC<StreamCameraProps> = ({
  roomId,
  position,
  onClick,
  className = '',
  isEditMode = false,
  onDragEnd,
}) => {
  const { activeStreams, fetchActiveStreams } = useStreaming();
  const [streamInfo, setStreamInfo] = useState<StreamSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const loadStreams = async () => {
      setIsLoading(true);
      try {
        await fetchActiveStreams(roomId);
      } catch (error) {
        console.error('Error loading streams:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStreams();

    // Set up a refresh interval
    const intervalId = setInterval(loadStreams, 30000); // refresh every 30 seconds
    return () => clearInterval(intervalId);
  }, [roomId, fetchActiveStreams]);

  // Set the active stream for this room, if any
  useEffect(() => {
    if (activeStreams.length > 0) {
      const roomStream = activeStreams.find(stream => stream.room_id === roomId && stream.status === 'live');
      setStreamInfo(roomStream || null);
    } else {
      setStreamInfo(null);
    }
  }, [activeStreams, roomId]);

  const handleDragEnd = (e: React.DragEvent) => {
    if (!isEditMode || !onDragEnd) return;

    const rect = (e.currentTarget as HTMLElement).parentElement?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Clamp to room boundaries
    const clampedX = Math.max(0.05, Math.min(0.95, x));
    const clampedY = Math.max(0.05, Math.min(0.95, y));

    onDragEnd(clampedX, clampedY);
  };

  return (
    <div
      className={cn(
        'absolute group cursor-pointer transform -translate-x-1/2 -translate-y-1/2',
        className
      )}
      style={{
        left: `${position.x * 100}%`,
        top: `${position.y * 100}%`,
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      draggable={isEditMode}
      onDragEnd={handleDragEnd}
    >
      <div
        className={cn(
          'w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-300',
          'border border-white/20 shadow-lg',
          streamInfo
            ? 'bg-gradient-to-br from-red-500 to-purple-500 animate-pulse'
            : 'bg-gradient-to-br from-slate-700 to-slate-800',
          'hover:scale-110 hover:shadow-xl',
          isEditMode
            ? 'ring-2 ring-white/50 ring-offset-2 ring-offset-transparent'
            : 'hover:ring-2 hover:ring-white/30'
        )}
      >
        <div className="flex flex-col items-center justify-center">
          <VideoCameraIcon className="h-7 w-7 text-white drop-shadow-sm" />
          {streamInfo && (
            <div className="mt-1 flex items-center gap-1">
              <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-xs text-white font-medium">LIVE</span>
            </div>
          )}
        </div>
      </div>

      {/* Status indicators */}
      {streamInfo && (
        <>
          {/* Participant count */}
          <div className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            <EyeIcon className="h-3 w-3" />
          </div>
          
          {/* Stream type indicator */}
          <div className="absolute -bottom-2 -right-2 bg-indigo-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {streamInfo.stream_type === 'teaching' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            ) : streamInfo.stream_type === 'production' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4zm2 0h1V9h-1v2zm1-4V5h-1v2h1zM5 5v2H4V5h1zm0 4H4v2h1V9zm-1 4h1v2H4v-2z" clipRule="evenodd" />
              </svg>
            ) : (
              <MicrophoneIcon className="h-3 w-3" />
            )}
          </div>
        </>
      )}

      {/* Stream info tooltip on hover */}
      {isHovered && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-10 bg-black/80 backdrop-blur-sm rounded-lg p-2 text-white text-xs w-48">
          {streamInfo ? (
            <>
              <div className="font-semibold">{streamInfo.title}</div>
              <div className="text-purple-300 text-xs mt-1">
                {streamInfo.stream_type === 'teaching' ? 'Teaching Session' : 
                 streamInfo.stream_type === 'production' ? 'Production Stream' : 
                 streamInfo.stream_type === 'collaboration' ? 'Collaboration' : 'Social Stream'}
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-gray-400">Host: {streamInfo.host?.display_name || streamInfo.host?.username || 'Unknown'}</span>
                <span className="flex items-center gap-1">
                  <EyeIcon className="h-3 w-3 text-purple-300" />
                  <span>{streamInfo.participant_count || 1}</span>
                </span>
              </div>
            </>
          ) : isLoading ? (
            <div className="text-center py-1">
              <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : (
            <div className="text-center py-1">
              <div>No active stream</div>
              <div className="text-purple-300 text-xs mt-1">Click to start streaming</div>
            </div>
          )}
        </div>
      )}

      {/* Edit Mode Indicator */}
      {isEditMode && (
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        </div>
      )}
    </div>
  );
};
