// YourSpace Creative Labs - Live Stream Manager Component
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { useStreamingSession } from '../../hooks/useStreamingSession';
import {
  VideoCameraIcon,
  MicrophoneIcon,
  XMarkIcon,
  ComputerDesktopIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  CogIcon,
  EyeIcon,
  ClockIcon,
  FilmIcon,
  PlusIcon,
  StopIcon,
  PauseIcon,
  PlayIcon,
  CameraIcon,
  PhoneXMarkIcon,
  ViewfinderCircleIcon,
  ArrowsPointingOutIcon,
  XCircleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { cn } from '../../lib/utils';
import StreamChat from './StreamChat';

interface LiveStreamManagerProps {
  roomId: string;
  onClose: () => void;
}

type StreamMode = 'webcam' | 'screen' | 'both';

const LiveStreamManager: React.FC<LiveStreamManagerProps> = ({ roomId, onClose }) => {
  const { user, profile } = useAuth();
  const {
    session,
    participants,
    isHost,
    isConnecting,
    isStreaming,
    startStreaming,
    stopStreaming,
    joinSession,
    leaveSession,
    streamError,
  } = useStreamingSession(roomId);

  // Local state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sessionType, setSessionType] = useState<'teaching' | 'production' | 'collaboration'>('teaching');
  const [streamMode, setStreamMode] = useState<StreamMode>('webcam');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenShareEnabled, setIsScreenShareEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const [showChat, setShowChat] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [availableDevices, setAvailableDevices] = useState<{
    videoinput: MediaDeviceInfo[];
    audioinput: MediaDeviceInfo[];
  }>({
    videoinput: [],
    audioinput: [],
  });
  const [selectedDevices, setSelectedDevices] = useState<{
    videoinput: string;
    audioinput: string;
  }>({
    videoinput: '',
    audioinput: '',
  });

  // Refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<number | null>(null);

  // Load available devices
  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoinput = devices.filter((device) => device.kind === 'videoinput');
        const audioinput = devices.filter((device) => device.kind === 'audioinput');

        setAvailableDevices({
          videoinput,
          audioinput,
        });

        // Set default devices
        if (videoinput.length > 0 && !selectedDevices.videoinput) {
          setSelectedDevices((prev) => ({
            ...prev,
            videoinput: videoinput[0].deviceId,
          }));
        }

        if (audioinput.length > 0 && !selectedDevices.audioinput) {
          setSelectedDevices((prev) => ({
            ...prev,
            audioinput: audioinput[0].deviceId,
          }));
        }
      } catch (error) {
        console.error('Error getting media devices:', error);
      }
    };

    getDevices();
  }, []);

  // Initialize local video
  useEffect(() => {
    const initLocalVideo = async () => {
      try {
        if (localStreamRef.current) {
          // Stop previous stream
          localStreamRef.current.getTracks().forEach((track) => track.stop());
        }

        const constraints: MediaStreamConstraints = {
          video: selectedDevices.videoinput
            ? {
                deviceId: { exact: selectedDevices.videoinput },
                width: { ideal: 1280 },
                height: { ideal: 720 },
              }
            : true,
          audio: selectedDevices.audioinput
            ? {
                deviceId: { exact: selectedDevices.audioinput },
                echoCancellation: true,
                noiseSuppression: true,
              }
            : true,
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        localStreamRef.current = stream;

        // Apply mute state
        stream.getAudioTracks().forEach((track) => {
          track.enabled = !isMuted;
        });

        // Apply video enabled state
        stream.getVideoTracks().forEach((track) => {
          track.enabled = isVideoEnabled;
        });

        // Set video source
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error initializing local video:', error);
        setIsVideoEnabled(false);
      }
    };

    if (isVideoEnabled) {
      initLocalVideo();
    }

    return () => {
      // Clean up stream when component unmounts
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [selectedDevices, isVideoEnabled]);

  // Toggle screen sharing
  useEffect(() => {
    const toggleScreenShare = async () => {
      try {
        if (isScreenShareEnabled) {
          // Start screen sharing
          const stream = await navigator.mediaDevices.getDisplayMedia({
            video: {
              displaySurface: 'monitor' as any,
            },
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
            },
          });

          screenStreamRef.current = stream;

          // Set up handler for when user stops sharing
          stream.getVideoTracks()[0].onended = () => {
            setIsScreenShareEnabled(false);
          };

          // Set video source
          if (screenVideoRef.current) {
            screenVideoRef.current.srcObject = stream;
          }
        } else {
          // Stop screen sharing
          if (screenStreamRef.current) {
            screenStreamRef.current.getTracks().forEach((track) => track.stop());
            screenStreamRef.current = null;
          }
        }
      } catch (error) {
        console.error('Error toggling screen share:', error);
        setIsScreenShareEnabled(false);
      }
    };

    toggleScreenShare();

    return () => {
      // Clean up screen share stream when component unmounts
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isScreenShareEnabled]);

  // Toggle mute
  useEffect(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !isMuted;
      });
    }
  }, [isMuted]);

  // Toggle video
  useEffect(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = isVideoEnabled;
      });
    }
  }, [isVideoEnabled]);

  // Handle recording
  useEffect(() => {
    const startRecording = async () => {
      if (!localStreamRef.current) return;

      let combinedStream;

      // Create a combined stream based on the current mode
      if (streamMode === 'both' && screenStreamRef.current) {
        // Combine webcam and screen share
        const videoTracks = [...screenStreamRef.current.getVideoTracks()];
        const audioTracks = [...localStreamRef.current.getAudioTracks()];
        combinedStream = new MediaStream([...videoTracks, ...audioTracks]);
      } else if (streamMode === 'screen' && screenStreamRef.current) {
        // Use screen share only
        combinedStream = screenStreamRef.current;
      } else {
        // Use webcam only
        combinedStream = localStreamRef.current;
      }

      // Reset recorded chunks
      recordedChunksRef.current = [];

      // Create media recorder
      const options = { mimeType: 'video/webm; codecs=vp9' };
      mediaRecorderRef.current = new MediaRecorder(combinedStream, options);

      // Set up event handlers
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      // Start recording
      mediaRecorderRef.current.start(1000); // Capture data every second

      // Set up timer
      setRecordingTime(0);
      recordingIntervalRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    };

    const stopRecording = async () => {
      if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') return;

      return new Promise<void>((resolve) => {
        mediaRecorderRef.current!.onstop = async () => {
          // Create blob from recorded chunks
          const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });

          // Convert to base64 for storage
          const reader = new FileReader();
          reader.onloadend = async () => {
            const base64data = reader.result as string;

            try {
              // Save recording via Supabase function
              const { data: { session: authSession } } = await supabase.auth.getSession();
              
              if (authSession) {
                const { data, error } = await supabase.functions.invoke('save-stream-recording', {
                  body: {
                    sessionId: session?.id,
                    recordingData: base64data,
                    title: `Recording of ${session?.title || 'stream'}`,
                    duration: recordingTime,
                  },
                  headers: {
                    Authorization: `Bearer ${authSession.access_token}`,
                  },
                });

                if (error) {
                  console.error('Error saving recording:', error);
                } else {
                  console.log('Recording saved successfully:', data);
                }
              }
            } catch (error) {
              console.error('Error processing recording:', error);
            }

            // Reset recording state
            setRecordingTime(0);
            recordedChunksRef.current = [];
            resolve();
          };
          reader.readAsDataURL(blob);
        };

        // Stop the recorder
        mediaRecorderRef.current!.stop();

        // Clear the interval
        if (recordingIntervalRef.current) {
          clearInterval(recordingIntervalRef.current);
          recordingIntervalRef.current = null;
        }
      });
    };

    if (isRecording) {
      startRecording();
    } else if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      stopRecording();
    }

    return () => {
      // Clean up recording when component unmounts
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }

      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    };
  }, [isRecording, session, streamMode]);

  // Format recording time
  const formatRecordingTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle start stream button click
  const handleStartStream = async () => {
    if (!title) {
      setTitle(`${profile?.display_name || 'User'}'s Stream`);
    }

    await startStreaming(
      title || `${profile?.display_name || 'User'}'s Stream`,
      description
    );
  };

  // Handle stop stream button click
  const handleStopStream = async () => {
    setIsRecording(false); // Stop recording if active
    await stopStreaming();
  };

  // Handle close button click
  const handleClose = () => {
    if (isStreaming) {
      // Confirm before closing if streaming
      if (window.confirm('Are you sure you want to end your stream?')) {
        handleStopStream();
        onClose();
      }
    } else {
      onClose();
    }
  };

  // Initial screen - Select stream type
  const renderSetupScreen = () => (
    <div className="flex flex-col h-full justify-center items-center p-8 space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Start Streaming</h2>
        <p className="text-gray-400">Set up your live stream session</p>
      </div>

      <div className="w-full max-w-md space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="stream-title" className="block text-sm font-medium text-gray-400 mb-1">
              Stream Title
            </label>
            <input
              id="stream-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your stream"
              className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label htmlFor="stream-description" className="block text-sm font-medium text-gray-400 mb-1">
              Description (Optional)
            </label>
            <textarea
              id="stream-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What will you be sharing in this stream?"
              rows={3}
              className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Stream Type</label>
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setSessionType('teaching')}
                className={cn(
                  'flex flex-col items-center justify-center p-4 rounded-lg border transition-all',
                  sessionType === 'teaching'
                    ? 'bg-purple-500/20 border-purple-500 text-white'
                    : 'bg-black/30 border-gray-700 text-gray-400 hover:bg-purple-500/10 hover:border-purple-500/50'
                )}
              >
                <ComputerDesktopIcon className="h-8 w-8 mb-2" />
                <span>Teaching</span>
              </button>

              <button
                type="button"
                onClick={() => setSessionType('production')}
                className={cn(
                  'flex flex-col items-center justify-center p-4 rounded-lg border transition-all',
                  sessionType === 'production'
                    ? 'bg-purple-500/20 border-purple-500 text-white'
                    : 'bg-black/30 border-gray-700 text-gray-400 hover:bg-purple-500/10 hover:border-purple-500/50'
                )}
              >
                <FilmIcon className="h-8 w-8 mb-2" />
                <span>Production</span>
              </button>

              <button
                type="button"
                onClick={() => setSessionType('collaboration')}
                className={cn(
                  'flex flex-col items-center justify-center p-4 rounded-lg border transition-all',
                  sessionType === 'collaboration'
                    ? 'bg-purple-500/20 border-purple-500 text-white'
                    : 'bg-black/30 border-gray-700 text-gray-400 hover:bg-purple-500/10 hover:border-purple-500/50'
                )}
              >
                <UserGroupIcon className="h-8 w-8 mb-2" />
                <span>Collaboration</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Stream Mode</label>
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setStreamMode('webcam')}
                className={cn(
                  'flex flex-col items-center justify-center p-4 rounded-lg border transition-all',
                  streamMode === 'webcam'
                    ? 'bg-purple-500/20 border-purple-500 text-white'
                    : 'bg-black/30 border-gray-700 text-gray-400 hover:bg-purple-500/10 hover:border-purple-500/50'
                )}
              >
                <VideoCameraIcon className="h-8 w-8 mb-2" />
                <span>Webcam</span>
              </button>

              <button
                type="button"
                onClick={() => setStreamMode('screen')}
                className={cn(
                  'flex flex-col items-center justify-center p-4 rounded-lg border transition-all',
                  streamMode === 'screen'
                    ? 'bg-purple-500/20 border-purple-500 text-white'
                    : 'bg-black/30 border-gray-700 text-gray-400 hover:bg-purple-500/10 hover:border-purple-500/50'
                )}
              >
                <ComputerDesktopIcon className="h-8 w-8 mb-2" />
                <span>Screen</span>
              </button>

              <button
                type="button"
                onClick={() => setStreamMode('both')}
                className={cn(
                  'flex flex-col items-center justify-center p-4 rounded-lg border transition-all',
                  streamMode === 'both'
                    ? 'bg-purple-500/20 border-purple-500 text-white'
                    : 'bg-black/30 border-gray-700 text-gray-400 hover:bg-purple-500/10 hover:border-purple-500/50'
                )}
              >
                <ViewfinderCircleIcon className="h-8 w-8 mb-2" />
                <span>Both</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-6 py-3 bg-gray-700 rounded-lg text-white hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleStartStream}
            disabled={isConnecting}
            className={cn(
              'flex-1 px-6 py-3 rounded-lg text-white transition-colors flex items-center justify-center',
              isConnecting
                ? 'bg-purple-500/50 cursor-wait'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
            )}
          >
            {isConnecting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connecting...
              </>
            ) : (
              'Start Streaming'
            )}
          </button>
        </div>

        {streamError && (
          <div className="bg-red-500/20 border border-red-500 p-4 rounded-lg text-red-300 text-sm">
            <p className="font-semibold">Error:</p>
            <p>{streamError}</p>
          </div>
        )}
      </div>

      <div className="text-center text-gray-500 text-sm">
        <p>By starting a stream, you agree to our Terms of Service and Community Guidelines.</p>
      </div>
    </div>
  );

  // Preview screen with camera and controls
  const renderPreviewScreen = () => (
    <div className="flex h-full">
      {/* Video preview area */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          {streamMode !== 'screen' && (
            <div className={cn(
              'relative mx-auto overflow-hidden transition-all duration-300',
              streamMode === 'both' ? 'w-2/3 aspect-video' : 'w-full h-full',
              isVideoEnabled ? '' : 'bg-gray-900 flex items-center justify-center'
            )}>
              {isVideoEnabled ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <VideoCameraIcon className="h-16 w-16 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-500">Camera is off</p>
                </div>
              )}
            </div>
          )}

          {streamMode === 'screen' || streamMode === 'both' ? (
            <div className={cn(
              'relative overflow-hidden transition-all duration-300',
              streamMode === 'both' ? 'absolute top-4 right-4 w-1/4 aspect-video shadow-lg border border-gray-700 rounded-lg' : 'w-full h-full',
              isScreenShareEnabled ? '' : 'bg-gray-900 flex items-center justify-center'
            )}>
              {isScreenShareEnabled ? (
                <video
                  ref={screenVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center p-4">
                  <ComputerDesktopIcon className="h-12 w-12 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">
                    {streamMode === 'both' ? 'Share your screen' : 'Screen sharing is off'}
                  </p>
                  {streamMode === 'both' && (
                    <button
                      onClick={() => setIsScreenShareEnabled(true)}
                      className="mt-2 px-3 py-1 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Start
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : null}

          {/* Stream Info Overlay */}
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm p-3 rounded-lg max-w-xs">
            <h3 className="font-semibold text-white truncate">{session?.title}</h3>
            <div className="flex items-center mt-1 text-sm text-gray-300">
              <EyeIcon className="h-4 w-4 mr-1" /> {viewCount}
              <span className="mx-2">•</span>
              <ClockIcon className="h-4 w-4 mr-1" /> 
              {formatRecordingTime(Math.floor((Date.now() - new Date(session?.started_at || Date.now()).getTime()) / 1000))}
            </div>
          </div>

          {/* Recording Indicator */}
          {isRecording && (
            <div className="absolute top-4 right-4 bg-red-500/80 text-white px-3 py-1 rounded-full flex items-center">
              <span className="w-3 h-3 bg-white rounded-full animate-pulse mr-2"></span>
              <span>REC {formatRecordingTime(recordingTime)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Controls sidebar */}
      <div className={cn(
        'w-80 border-l border-purple-500/20 bg-black/40 flex flex-col transition-all',
        showChat ? 'translate-x-0' : 'translate-x-full absolute right-0 top-0 bottom-0'
      )}>
        {showSettings ? (
          // Settings panel
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-purple-500/20">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Settings</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-purple-500/20 transition-colors"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Camera settings */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Camera</h4>
                <div className="space-y-2">
                  <select
                    value={selectedDevices.videoinput}
                    onChange={(e) => setSelectedDevices((prev) => ({
                      ...prev,
                      videoinput: e.target.value,
                    }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                    disabled={!isVideoEnabled}
                  >
                    {availableDevices.videoinput.map((device) => (
                      <option key={device.deviceId} value={device.deviceId}>
                        {device.label || `Camera ${availableDevices.videoinput.indexOf(device) + 1}`}
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center">
                    <input
                      id="video-enabled"
                      type="checkbox"
                      checked={isVideoEnabled}
                      onChange={(e) => setIsVideoEnabled(e.target.checked)}
                      className="h-4 w-4 text-purple-600 rounded border-gray-700 focus:ring-purple-500 bg-gray-800"
                    />
                    <label htmlFor="video-enabled" className="ml-2 text-sm text-gray-300">
                      Enable camera
                    </label>
                  </div>
                </div>
              </div>

              {/* Microphone settings */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Microphone</h4>
                <div className="space-y-2">
                  <select
                    value={selectedDevices.audioinput}
                    onChange={(e) => setSelectedDevices((prev) => ({
                      ...prev,
                      audioinput: e.target.value,
                    }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                    disabled={isMuted}
                  >
                    {availableDevices.audioinput.map((device) => (
                      <option key={device.deviceId} value={device.deviceId}>
                        {device.label || `Microphone ${availableDevices.audioinput.indexOf(device) + 1}`}
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center">
                    <input
                      id="audio-muted"
                      type="checkbox"
                      checked={!isMuted}
                      onChange={(e) => setIsMuted(!e.target.checked)}
                      className="h-4 w-4 text-purple-600 rounded border-gray-700 focus:ring-purple-500 bg-gray-800"
                    />
                    <label htmlFor="audio-muted" className="ml-2 text-sm text-gray-300">
                      Enable microphone
                    </label>
                  </div>
                </div>
              </div>

              {/* Screen share settings */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Screen Sharing</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="screen-share-enabled"
                      type="checkbox"
                      checked={isScreenShareEnabled}
                      onChange={(e) => setIsScreenShareEnabled(e.target.checked)}
                      disabled={streamMode === 'webcam'}
                      className="h-4 w-4 text-purple-600 rounded border-gray-700 focus:ring-purple-500 bg-gray-800 disabled:opacity-50"
                    />
                    <label 
                      htmlFor="screen-share-enabled" 
                      className={cn(
                        "ml-2 text-sm", 
                        streamMode === 'webcam' ? 'text-gray-500' : 'text-gray-300'
                      )}
                    >
                      Enable screen sharing
                    </label>
                  </div>

                  <p className="text-xs text-gray-500">
                    {streamMode === 'webcam' 
                      ? 'Change stream mode to enable screen sharing' 
                      : 'Share your entire screen or specific application window'}
                  </p>
                </div>
              </div>

              {/* Recording settings */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Recording</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="recording-enabled"
                      type="checkbox"
                      checked={isRecording}
                      onChange={(e) => setIsRecording(e.target.checked)}
                      className="h-4 w-4 text-purple-600 rounded border-gray-700 focus:ring-purple-500 bg-gray-800"
                    />
                    <label htmlFor="recording-enabled" className="ml-2 text-sm text-gray-300">
                      Record stream
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    Recordings will be saved to your content library
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : showChat ? (
          // Chat panel
          <StreamChat
            sessionId={session?.id || ''}
            onClose={() => setShowChat(false)}
          />
        ) : null}
      </div>

      {/* Bottom control bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-purple-500/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Mic toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={cn(
                'p-3 rounded-full',
                isMuted
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                  : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'
              )}
              title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
            >
              {isMuted ? (
                <MicrophoneIcon className="h-5 w-5" />
              ) : (
                <MicrophoneIcon className="h-5 w-5" />
              )}
            </button>

            {/* Camera toggle */}
            <button
              onClick={() => setIsVideoEnabled(!isVideoEnabled)}
              className={cn(
                'p-3 rounded-full',
                !isVideoEnabled
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                  : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'
              )}
              title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
            >
              <VideoCameraIcon className="h-5 w-5" />
            </button>

            {/* Screen share toggle */}
            {(streamMode === 'screen' || streamMode === 'both') && (
              <button
                onClick={() => setIsScreenShareEnabled(!isScreenShareEnabled)}
                className={cn(
                  'p-3 rounded-full',
                  !isScreenShareEnabled
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                    : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'
                )}
                title={isScreenShareEnabled ? 'Stop screen sharing' : 'Share screen'}
              >
                <ComputerDesktopIcon className="h-5 w-5" />
              </button>
            )}

            {/* Recording toggle */}
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={cn(
                'p-3 rounded-full',
                isRecording
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'
              )}
              title={isRecording ? 'Stop recording' : 'Start recording'}
            >
              {isRecording ? (
                <StopIcon className="h-5 w-5" />
              ) : (
                <CameraIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {/* Participant count */}
            <div className="flex items-center text-gray-300">
              <UserGroupIcon className="h-5 w-5 mr-2" />
              <span>{participants.length}</span>
            </div>

            {/* Chat toggle */}
            <button
              onClick={() => {
                setShowChat(!showChat);
                setShowSettings(false);
              }}
              className={cn(
                'p-3 rounded-full',
                showChat
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                  : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'
              )}
              title={showChat ? 'Hide chat' : 'Show chat'}
            >
              <ChatBubbleLeftRightIcon className="h-5 w-5" />
            </button>

            {/* Settings button */}
            <button
              onClick={() => {
                setShowSettings(!showSettings);
                setShowChat(true);
              }}
              className={cn(
                'p-3 rounded-full',
                showSettings
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                  : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'
              )}
              title="Stream settings"
            >
              <CogIcon className="h-5 w-5" />
            </button>

            {/* End stream button */}
            <button
              onClick={handleStopStream}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
            >
              <PhoneXMarkIcon className="h-5 w-5 mr-2" />
              End Stream
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Viewer screen
  const renderViewerScreen = () => (
    <div className="flex h-full">
      {/* Video stream area */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-contain"
          />

          {/* Stream Info Overlay */}
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm p-3 rounded-lg max-w-xs">
            <h3 className="font-semibold text-white truncate">{session?.title}</h3>
            <div className="flex items-center mt-1 text-sm text-gray-300">
              <UserGroupIcon className="h-4 w-4 mr-1" /> {participants.length} viewers
              <span className="mx-2">•</span>
              <ClockIcon className="h-4 w-4 mr-1" /> 
              {formatRecordingTime(Math.floor((Date.now() - new Date(session?.started_at || Date.now()).getTime()) / 1000))}
            </div>
          </div>
        </div>
      </div>

      {/* Chat sidebar */}
      <div className={cn(
        'w-80 border-l border-purple-500/20 bg-black/40 flex flex-col transition-all',
        showChat ? 'translate-x-0' : 'translate-x-full absolute right-0 top-0 bottom-0'
      )}>
        {showChat && (
          <StreamChat
            sessionId={session?.id || ''}
            onClose={() => setShowChat(false)}
          />
        )}
      </div>

      {/* Bottom control bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-purple-500/20 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white">
              <span className="text-purple-400 font-medium">{session?.profiles?.display_name || 'Host'}</span> is streaming
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Chat toggle */}
            <button
              onClick={() => setShowChat(!showChat)}
              className={cn(
                'p-3 rounded-full',
                showChat
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                  : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'
              )}
              title={showChat ? 'Hide chat' : 'Show chat'}
            >
              <ChatBubbleLeftRightIcon className="h-5 w-5" />
            </button>

            {/* Fullscreen button */}
            <button
              onClick={() => {
                if (remoteVideoRef.current) {
                  if (document.fullscreenElement) {
                    document.exitFullscreen();
                  } else {
                    remoteVideoRef.current.requestFullscreen();
                  }
                }
              }}
              className="p-3 rounded-full bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
              title="Toggle fullscreen"
            >
              <ArrowsPointingOutIcon className="h-5 w-5" />
            </button>

            {/* Leave stream button */}
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
            >
              <PhoneXMarkIcon className="h-5 w-5 mr-2" />
              Leave Stream
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Loading screen
  const renderLoadingScreen = () => (
    <div className="flex flex-col h-full justify-center items-center p-8 space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-white mb-2">{isHost ? 'Starting stream...' : 'Joining stream...'}</h2>
        <p className="text-gray-400">This may take a few moments</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex">
      <div className="bg-gradient-to-br from-gray-900 via-purple-900/10 to-gray-900 w-full h-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-black/40 backdrop-blur-sm border-b border-purple-500/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <VideoCameraIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  {isHost ? 'YourSpace Live Studio' : session?.title || 'Live Stream'}
                </h1>
                <p className="text-gray-400 text-sm">
                  {isHost ? 'Broadcast to your audience' : `Hosted by ${session?.profiles?.display_name || 'Creator'}`}
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-hidden">
          {isConnecting ? (
            renderLoadingScreen()
          ) : session && isStreaming ? (
            isHost ? renderPreviewScreen() : renderViewerScreen()
          ) : (
            renderSetupScreen()
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveStreamManager;
