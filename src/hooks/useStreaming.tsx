// YourSpace Creative Labs - Streaming Hook
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export interface StreamSession {
  id: string;
  room_id: string;
  created_by: string;
  title: string;
  description?: string;
  stream_type: 'social' | 'teaching' | 'production' | 'collaboration';
  status: 'scheduled' | 'live' | 'ended';
  is_screen_share: boolean;
  settings: Record<string, any>;
  scheduled_start?: string;
  started_at?: string;
  ended_at?: string;
  created_at: string;
  updated_at: string;
  host?: {
    id: string;
    username: string;
    display_name?: string;
    avatar_url?: string;
  };
  participant_count?: number;
}

export interface StreamParticipant {
  id: string;
  session_id: string;
  user_id: string;
  role: 'host' | 'co-host' | 'viewer';
  is_camera_on: boolean;
  is_mic_on: boolean;
  is_screen_sharing: boolean;
  connection_data?: Record<string, any>;
  joined_at: string;
  left_at?: string;
  profiles?: {
    id: string;
    username: string;
    display_name?: string;
    avatar_url?: string;
  };
}

export interface ChatMessage {
  id: string;
  session_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles?: {
    id: string;
    username: string;
    display_name?: string;
    avatar_url?: string;
  };
}

export interface StreamRoomObject {
  id: string;
  room_id: string;
  object_type: 'camera' | 'screen' | 'mic';
  position_x: number;
  position_y: number;
  is_active: boolean;
  settings?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface PeerConnection {
  id: string;
  connection: RTCPeerConnection;
  stream?: MediaStream;
  userData: StreamParticipant;
}

export const useStreaming = () => {
  const { user, session } = useAuth();
  const [activeStreams, setActiveStreams] = useState<StreamSession[]>([]);
  const [currentStream, setCurrentStream] = useState<StreamSession | null>(null);
  const [participants, setParticipants] = useState<StreamParticipant[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [roomObjects, setRoomObjects] = useState<StreamRoomObject[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peers, setPeers] = useState<Record<string, PeerConnection>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Subscriptions
  const [streamSubscription, setStreamSubscription] = useState<any>(null);
  const [participantSubscription, setParticipantSubscription] = useState<any>(null);
  const [chatSubscription, setChatSubscription] = useState<any>(null);

  // Call the streaming manager edge function
  const invokeStreamingFunction = async (action: string, params: Record<string, any> = {}) => {
    if (!session) {
      throw new Error('Authentication required');
    }

    try {
      const { data, error } = await supabase.functions.invoke('streaming-manager', {
        body: { action, ...params },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error.message || 'An error occurred');

      return data?.data;
    } catch (error: any) {
      console.error(`Streaming function error (${action}):`, error);
      throw error;
    }
  };

  // Stream Session Management
  const createStream = async ({
    roomId,
    title,
    description,
    streamType,
    isScreenShare = false,
    settings = {},
    scheduledStart = null,
  }: {
    roomId: string;
    title: string;
    description?: string;
    streamType: 'social' | 'teaching' | 'production' | 'collaboration';
    isScreenShare?: boolean;
    settings?: Record<string, any>;
    scheduledStart?: string | null;
  }) => {
    try {
      setIsLoading(true);
      const stream = await invokeStreamingFunction('create_stream', {
        roomId,
        title,
        description,
        streamType,
        isScreenShare,
        settings,
        scheduledStart,
      });

      await fetchActiveStreams(roomId);
      setCurrentStream(stream);
      toast.success('Stream created successfully!');
      return stream;
    } catch (error: any) {
      toast.error(error.message || 'Failed to create stream');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const joinStream = async (sessionId: string, role: 'host' | 'co-host' | 'viewer' = 'viewer') => {
    try {
      setIsLoading(true);
      const { participant, stream } = await invokeStreamingFunction('join_stream', {
        sessionId,
        role,
      });

      setCurrentStream(stream);
      await fetchStreamParticipants(sessionId);
      await fetchChatMessages(sessionId);
      toast.success('Joined stream successfully!');
      return { participant, stream };
    } catch (error: any) {
      toast.error(error.message || 'Failed to join stream');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const leaveStream = async (sessionId: string) => {
    try {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        setLocalStream(null);
      }

      // Close and remove all peer connections
      Object.values(peers).forEach(peer => {
        peer.connection.close();
      });
      setPeers({});

      const result = await invokeStreamingFunction('leave_stream', { sessionId });
      setCurrentStream(null);
      toast.success('Left stream');
      return result;
    } catch (error: any) {
      toast.error(error.message || 'Failed to leave stream');
      throw error;
    }
  };

  const endStream = async (sessionId: string) => {
    try {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        setLocalStream(null);
      }

      // Close and remove all peer connections
      Object.values(peers).forEach(peer => {
        peer.connection.close();
      });
      setPeers({});

      const result = await invokeStreamingFunction('end_stream', { sessionId });
      setCurrentStream(null);
      toast.success('Stream ended');
      return result;
    } catch (error: any) {
      toast.error(error.message || 'Failed to end stream');
      throw error;
    }
  };

  const updateStream = async ({
    sessionId,
    title,
    description,
    settings,
    isScreenShare,
  }: {
    sessionId: string;
    title?: string;
    description?: string;
    settings?: Record<string, any>;
    isScreenShare?: boolean;
  }) => {
    try {
      const result = await invokeStreamingFunction('update_stream', {
        sessionId,
        title,
        description,
        settings,
        isScreenShare,
      });

      if (currentStream?.id === sessionId) {
        setCurrentStream(result);
      }

      return result;
    } catch (error: any) {
      toast.error(error.message || 'Failed to update stream');
      throw error;
    }
  };

  const fetchActiveStreams = async (roomId?: string) => {
    try {
      setIsLoading(true);
      const streams = await invokeStreamingFunction('get_active_streams', { roomId });
      setActiveStreams(streams || []);
      return streams;
    } catch (error: any) {
      console.error('Error fetching active streams:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStreamDetails = async (sessionId: string) => {
    try {
      const stream = await invokeStreamingFunction('get_stream', { sessionId });
      if (currentStream?.id === sessionId) {
        setCurrentStream(stream);
      }
      return stream;
    } catch (error: any) {
      console.error('Error fetching stream details:', error);
      throw error;
    }
  };

  // Participant Management
  const fetchStreamParticipants = async (sessionId: string) => {
    try {
      const participants = await invokeStreamingFunction('get_stream_participants', { sessionId });
      setParticipants(participants || []);
      return participants;
    } catch (error: any) {
      console.error('Error fetching stream participants:', error);
      return [];
    }
  };

  const updateParticipantStatus = async ({
    sessionId,
    isCameraOn,
    isMicOn,
    isScreenSharing,
    connectionData,
  }: {
    sessionId: string;
    isCameraOn?: boolean;
    isMicOn?: boolean;
    isScreenSharing?: boolean;
    connectionData?: Record<string, any>;
  }) => {
    try {
      const result = await invokeStreamingFunction('update_participant_status', {
        sessionId,
        isCameraOn,
        isMicOn,
        isScreenSharing,
        connectionData,
      });

      await fetchStreamParticipants(sessionId);
      return result;
    } catch (error: any) {
      console.error('Error updating participant status:', error);
      throw error;
    }
  };

  // Chat Messages
  const sendChatMessage = async (sessionId: string, content: string) => {
    try {
      const message = await invokeStreamingFunction('send_chat_message', {
        sessionId,
        content,
      });

      return message;
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message');
      throw error;
    }
  };

  const fetchChatMessages = async (sessionId: string, limit = 50, offset = 0) => {
    try {
      const messages = await invokeStreamingFunction('get_chat_messages', {
        sessionId,
        limit,
        offset,
      });

      setChatMessages(messages || []);
      return messages;
    } catch (error: any) {
      console.error('Error fetching chat messages:', error);
      return [];
    }
  };

  // Media Stream Management
  const startCamera = async (audio = true, video = true) => {
    try {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio, video });
      setLocalStream(stream);
      return stream;
    } catch (error: any) {
      console.error('Error accessing media devices:', error);
      toast.error('Failed to access camera or microphone');
      throw error;
    }
  };

  const startScreenShare = async (audio = true) => {
    try {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }

      // @ts-ignore - TypeScript doesn't have proper types for getDisplayMedia
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio
      });

      // Handle when user stops screen sharing
      stream.getVideoTracks()[0].onended = () => {
        if (currentStream) {
          updateParticipantStatus({
            sessionId: currentStream.id,
            isScreenSharing: false
          }).catch(console.error);
          
          // Switch back to camera
          startCamera().catch(console.error);
        }
      };

      setLocalStream(stream);
      return stream;
    } catch (error: any) {
      console.error('Error starting screen share:', error);
      toast.error('Failed to start screen sharing');
      throw error;
    }
  };

  const stopLocalStream = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
  };

  // WebRTC Peer Connection Management
  const createPeerConnection = (participantId: string, participant: StreamParticipant) => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
      ]
    });

    // Add local stream tracks to the connection
    if (localStream) {
      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });
    }

    // Setup event handlers
    peerConnection.onicecandidate = (event) => {
      if (event.candidate && currentStream) {
        // Send the ICE candidate to the other peer via your signaling server
        // We'll use the connection_data field in stream_participants for this
        const connectionData = {
          type: 'ice-candidate',
          candidateData: event.candidate.toJSON(),
          fromParticipantId: participantId,
        };

        updateParticipantStatus({
          sessionId: currentStream.id,
          connectionData,
        }).catch(console.error);
      }
    };

    peerConnection.ontrack = (event) => {
      // Create a new MediaStream from the received tracks
      const remoteStream = new MediaStream();
      event.streams[0].getTracks().forEach(track => {
        remoteStream.addTrack(track);
      });

      // Update the peer connection with the remote stream
      setPeers(prev => ({
        ...prev,
        [participantId]: {
          ...prev[participantId],
          stream: remoteStream,
        },
      }));
    };

    // Add the peer connection to our state
    setPeers(prev => ({
      ...prev,
      [participantId]: {
        id: participantId,
        connection: peerConnection,
        userData: participant,
      },
    }));

    return peerConnection;
  };

  const handleConnectionData = async (participantId: string, connectionData: any) => {
    if (!connectionData || !currentStream) return;

    try {
      switch (connectionData.type) {
        case 'offer':
          {
            // Get or create peer connection
            const participant = participants.find(p => p.user_id === participantId);
            if (!participant) return;

            let peerConnection = peers[participantId]?.connection;
            if (!peerConnection) {
              peerConnection = createPeerConnection(participantId, participant);
            }

            // Set the remote description from the offer
            await peerConnection.setRemoteDescription(new RTCSessionDescription(connectionData.sdp));

            // Create an answer
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);

            // Send the answer back
            await updateParticipantStatus({
              sessionId: currentStream.id,
              connectionData: {
                type: 'answer',
                sdp: peerConnection.localDescription,
                toParticipantId: participantId,
              },
            });
          }
          break;

        case 'answer':
          {
            // Ensure this answer is for us
            if (connectionData.toParticipantId !== user?.id) return;

            // Get the peer connection
            const peerConnection = peers[participantId]?.connection;
            if (!peerConnection) return;

            // Set the remote description from the answer
            await peerConnection.setRemoteDescription(new RTCSessionDescription(connectionData.sdp));
          }
          break;

        case 'ice-candidate':
          {
            // Ensure this candidate is for us
            if (connectionData.toParticipantId !== user?.id) return;

            // Get the peer connection
            const peerConnection = peers[participantId]?.connection;
            if (!peerConnection) return;

            // Add the ICE candidate
            await peerConnection.addIceCandidate(new RTCIceCandidate(connectionData.candidateData));
          }
          break;
      }
    } catch (error) {
      console.error('Error handling connection data:', error);
    }
  };

  const initiateConnection = async (participantId: string) => {
    if (!currentStream || !user) return;

    try {
      // Find the participant
      const participant = participants.find(p => p.user_id === participantId);
      if (!participant) return;

      // Create or get the peer connection
      let peerConnection = peers[participantId]?.connection;
      if (!peerConnection) {
        peerConnection = createPeerConnection(participantId, participant);
      }

      // Create an offer
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      // Send the offer to the other participant
      await updateParticipantStatus({
        sessionId: currentStream.id,
        connectionData: {
          type: 'offer',
          sdp: peerConnection.localDescription,
          toParticipantId: participantId,
        },
      });
    } catch (error) {
      console.error('Error initiating connection:', error);
    }
  };

  // Room Objects Management
  const fetchRoomObjects = async (roomId: string) => {
    try {
      const { data, error } = await supabase
        .from('stream_room_objects')
        .select('*')
        .eq('room_id', roomId)
        .eq('is_active', true);

      if (error) throw error;
      setRoomObjects(data || []);
      return data;
    } catch (error: any) {
      console.error('Error fetching room objects:', error);
      return [];
    }
  };

  const createRoomObject = async ({
    roomId,
    objectType,
    positionX,
    positionY,
    settings = {},
  }: {
    roomId: string;
    objectType: 'camera' | 'screen' | 'mic';
    positionX: number;
    positionY: number;
    settings?: Record<string, any>;
  }) => {
    try {
      const { data, error } = await supabase
        .from('stream_room_objects')
        .insert({
          room_id: roomId,
          object_type: objectType,
          position_x: positionX,
          position_y: positionY,
          settings,
        })
        .select()
        .single();

      if (error) throw error;
      await fetchRoomObjects(roomId);
      return data;
    } catch (error: any) {
      console.error('Error creating room object:', error);
      toast.error('Failed to create room object');
      throw error;
    }
  };

  // Real-time subscriptions
  const subscribeToStream = useCallback((sessionId: string) => {
    if (!sessionId) return;

    // Unsubscribe from previous subscription
    if (streamSubscription) {
      streamSubscription.unsubscribe();
    }

    const subscription = supabase
      .channel(`stream:${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'stream_sessions',
          filter: `id=eq.${sessionId}`,
        },
        (payload) => {
          // Refresh stream details
          fetchStreamDetails(sessionId).catch(console.error);
        }
      )
      .subscribe();

    setStreamSubscription(subscription);
  }, [streamSubscription]);

  const subscribeToParticipants = useCallback((sessionId: string) => {
    if (!sessionId) return;

    // Unsubscribe from previous subscription
    if (participantSubscription) {
      participantSubscription.unsubscribe();
    }

    const subscription = supabase
      .channel(`participants:${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'stream_participants',
          filter: `session_id=eq.${sessionId}`,
        },
        async (payload) => {
          // Refresh participants list
          const participants = await fetchStreamParticipants(sessionId);

          // Handle connection data for WebRTC signaling
          if (payload.eventType === 'UPDATE' && payload.new) {
            const updatedParticipant = payload.new as StreamParticipant;
            if (updatedParticipant.connection_data && updatedParticipant.user_id !== user?.id) {
              handleConnectionData(updatedParticipant.user_id, updatedParticipant.connection_data).catch(console.error);
            }
          }

          // Handle new participants for initiating connections
          if (payload.eventType === 'INSERT' && payload.new) {
            const newParticipant = payload.new as StreamParticipant;
            if (newParticipant.user_id !== user?.id && localStream) {
              // Wait a moment to ensure the participant is fully joined
              setTimeout(() => {
                initiateConnection(newParticipant.user_id).catch(console.error);
              }, 1000);
            }
          }

          // Handle participants leaving
          if (payload.eventType === 'UPDATE' && payload.new && (payload.new as StreamParticipant).left_at) {
            const leftParticipant = payload.new as StreamParticipant;
            // Close and remove the peer connection
            if (peers[leftParticipant.user_id]) {
              peers[leftParticipant.user_id].connection.close();
              setPeers(prev => {
                const newPeers = { ...prev };
                delete newPeers[leftParticipant.user_id];
                return newPeers;
              });
            }
          }
        }
      )
      .subscribe();

    setParticipantSubscription(subscription);
  }, [participantSubscription, user, peers, localStream]);

  const subscribeToChatMessages = useCallback((sessionId: string) => {
    if (!sessionId) return;

    // Unsubscribe from previous subscription
    if (chatSubscription) {
      chatSubscription.unsubscribe();
    }

    const subscription = supabase
      .channel(`chat:${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'stream_chat_messages',
          filter: `session_id=eq.${sessionId}`,
        },
        async (payload) => {
          if (payload.new) {
            // Fetch user info for the new message
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('id, username, display_name, avatar_url')
                .eq('id', (payload.new as ChatMessage).user_id)
                .single();
                
              const newMessage = {
                ...(payload.new as ChatMessage),
                profiles: profile,
              };
              setChatMessages(prev => [newMessage, ...prev]);
            } catch (error) {
              console.error('Error fetching profile:', error);
            }
          }
        }
      )
      .subscribe();

    setChatSubscription(subscription);
  }, [chatSubscription]);

  // Setup subscriptions and cleanup
  useEffect(() => {
    if (currentStream?.id) {
      subscribeToStream(currentStream.id);
      subscribeToParticipants(currentStream.id);
      subscribeToChatMessages(currentStream.id);
    }

    return () => {
      if (streamSubscription) streamSubscription.unsubscribe();
      if (participantSubscription) participantSubscription.unsubscribe();
      if (chatSubscription) chatSubscription.unsubscribe();
    };
  }, [currentStream, subscribeToStream, subscribeToParticipants, subscribeToChatMessages]);

  // Clean up media streams and peer connections on unmount
  useEffect(() => {
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }

      // Close all peer connections
      Object.values(peers).forEach(peer => {
        peer.connection.close();
      });
    };
  }, []);

  return {
    // State
    activeStreams,
    currentStream,
    participants,
    chatMessages,
    roomObjects,
    localStream,
    peers,
    isLoading,

    // Stream Session Management
    createStream,
    joinStream,
    leaveStream,
    endStream,
    updateStream,
    fetchActiveStreams,
    fetchStreamDetails,

    // Participant Management
    fetchStreamParticipants,
    updateParticipantStatus,

    // Chat Messages
    sendChatMessage,
    fetchChatMessages,

    // Media Stream Management
    startCamera,
    startScreenShare,
    stopLocalStream,

    // Room Objects Management
    fetchRoomObjects,
    createRoomObject,
  };
};
