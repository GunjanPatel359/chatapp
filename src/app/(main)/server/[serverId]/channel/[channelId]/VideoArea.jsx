'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Room,
  RoomEvent,
  createLocalAudioTrack,
  createLocalVideoTrack,
  LocalVideoTrack,
  LocalAudioTrack,
} from 'livekit-client';

export default function VideoArea({ roomName, userId, role }) {
  const [room, setRoom] = useState(null);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCamOn, setIsCamOn] = useState(false);
  const [screenTrack, setScreenTrack] = useState(null);
  const [participants, setParticipants] = useState([]);
  const videoRef = useRef(null);

  // Safe update participants function that checks if properties exist
  const updateParticipants = (currentRoom) => {
    if (!currentRoom) return;
    
    const participantArray = [];
    
    // Add remote participants - safely check if participants Map exists
    if (currentRoom.participants && typeof currentRoom.participants.forEach === 'function') {
      currentRoom.participants.forEach(participant => {
        participantArray.push({
          id: participant.identity,
          name: participant.name || participant.identity,
          isLocal: false
        });
      });
    }
    
    // Add local participant - safely check if localParticipant exists
    if (currentRoom.localParticipant) {
      participantArray.push({
        id: currentRoom.localParticipant.identity,
        name: currentRoom.localParticipant.name || 'Me',
        isLocal: true
      });
    }
    
    setParticipants(participantArray);
  };

  useEffect(() => {
    const connectRoom = async () => {
      try {
        const res = await fetch('/api/livekit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomName, userId, role }),
        });
    
        const { token, url } = await res.json();
        console.log('Token:', token, 'URL:', url);
    
        const newRoom = new Room();
        
        // Set up event listeners before connecting
        newRoom.on(RoomEvent.ParticipantConnected, () => {
          updateParticipants(newRoom);
        });
        
        newRoom.on(RoomEvent.ParticipantDisconnected, () => {
          updateParticipants(newRoom);
        });
        
        newRoom.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
          // Attach remote participant tracks to the DOM
          if (track.kind === 'video') {
            const element = document.getElementById(`participant-${participant.identity}`);
            if (element) {
              track.attach(element);
            }
          }
        });
        
        // Connect to the room with connect options
        await newRoom.connect(url, token, {
          autoSubscribe: true,
        });
        
        setRoom(newRoom);
        
        // Only call updateParticipants after the room is fully connected
        if (newRoom.state === 'connected') {
          updateParticipants(newRoom);
        }
      } catch (error) {
        console.error("Failed to connect to room:", error);
      }
    };
    
    connectRoom();
  
    return () => {
      if (room) {
        room.disconnect();
      }
    };
  }, [roomName, userId, role]);
  
  const toggleMic = async () => {
    if (!room) return;
  
    try {
      if (!isMicOn) {
        const mic = await createLocalAudioTrack();
        await room.localParticipant.publishTrack(mic);
      } else {
        // Find all audio publications and unpublish them
        if (room.localParticipant && room.localParticipant.audioTracks) {
          for (const publication of room.localParticipant.audioTracks.values()) {
            await room.localParticipant.unpublishTrack(publication.track);
            publication.track.stop();
          }
        }
      }
    
      setIsMicOn(!isMicOn);
    } catch (error) {
      console.error("Error toggling microphone:", error);
    }
  };
  
  const toggleCam = async () => {
    if (!room) return;
  
    try {
      if (!isCamOn) {
        const cam = await createLocalVideoTrack();
        await room.localParticipant.publishTrack(cam);
    
        // Attach to UI
        if (videoRef.current && cam) {
          cam.attach(videoRef.current);
        }
      } else {
        // Find all video publications and unpublish them
        if (room.localParticipant && room.localParticipant.videoTracks) {
          for (const publication of room.localParticipant.videoTracks.values()) {
            // Don't unpublish screen share
            if (publication.track.source !== 'screen') {
              await room.localParticipant.unpublishTrack(publication.track);
              publication.track.stop();
            }
          }
        }
        
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      }
    
      setIsCamOn(!isCamOn);
    } catch (error) {
      console.error("Error toggling camera:", error);
    }
  };
  
  const startScreenShare = async () => {
    if (!room) return;
    
    try {
      if (screenTrack) {
        // Stop and unpublish the screen sharing track
        await room.localParticipant.unpublishTrack(screenTrack);
        screenTrack.stop();
        setScreenTrack(null);
      } else {
        // Use the correct method to capture screen - don't use getUserMedia directly
        const screenTrackOptions = { audio: false, video: true };
        
        // This is the correct way to get screen share in LiveKit
        const stream = await navigator.mediaDevices.getDisplayMedia(screenTrackOptions);
        const videoTrack = stream.getVideoTracks()[0];
        
        if (!videoTrack) {
          throw new Error('No video track found in screen share');
        }
        
        // Create a LocalVideoTrack from the acquired MediaStreamTrack
        const localTrack = new LocalVideoTrack(videoTrack, 'screen');
        
        await room.localParticipant.publishTrack(localTrack);
        setScreenTrack(localTrack);
        
        // Add listener for when user ends screen sharing via browser UI
        videoTrack.addEventListener('ended', () => {
          if (room.localParticipant) {
            room.localParticipant.unpublishTrack(localTrack);
          }
          setScreenTrack(null);
        });
      }
    } catch (err) {
      console.error('Screen share failed:', err);
      // User likely canceled the screen share dialog
    }
  };

  const sendActionToServer = async (type) => {
    const targetUserElement = document.getElementById('targetId');
    if (!targetUserElement) return;
    
    const targetUser = targetUserElement.value;
    if (!targetUser) {
      alert("Please enter a target user ID");
      return;
    }

    try {
      const response = await fetch('/api/room/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomName,
          fromUser: userId,
          targetUser,
          action: type,
        }),
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      
      alert(`${type} action sent successfully`);
    } catch (error) {
      console.error(`Failed to send ${type} action:`, error);
      alert(`Failed to send ${type} action: ${error.message}`);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Local preview */}
      <div className="relative">
        <video ref={videoRef} autoPlay muted playsInline 
          className={`w-64 h-48 border rounded ${isCamOn ? '' : 'hidden'}`} />
        
        {!isCamOn && (
          <div className="w-64 h-48 border rounded bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">Camera off</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <button onClick={toggleMic} className={`text-white px-3 py-1 rounded ${isMicOn ? 'bg-red-500' : 'bg-blue-500'}`}>
          {isMicOn ? 'Mute Mic' : 'Unmute Mic'}
        </button>
        <button onClick={toggleCam} className={`text-white px-3 py-1 rounded ${isCamOn ? 'bg-red-500' : 'bg-green-500'}`}>
          {isCamOn ? 'Stop Cam' : 'Start Cam'}
        </button>
        <button onClick={startScreenShare} className={`text-white px-3 py-1 rounded ${screenTrack ? 'bg-red-500' : 'bg-purple-500'}`}>
          {screenTrack ? 'Stop Share' : 'Share Screen'}
        </button>
      </div>

      {/* Participants list */}
      {participants.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium mb-2">Participants ({participants.length})</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {participants.map(participant => (
              <div key={participant.id} className="border p-2 rounded">
                <div className="h-24 bg-gray-100 mb-2 relative">
                  <video 
                    id={`participant-${participant.id}`} 
                    autoPlay 
                    playsInline
                    muted={participant.isLocal}
                    className="w-full h-full object-cover" 
                  />
                </div>
                <p className="text-sm truncate">
                  {participant.name} {participant.isLocal ? '(You)' : ''}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Admin controls */}
      {role === 'admin' && (
        <div className="pt-4 border-t mt-4">
          <h3 className="font-bold mb-2">Admin Controls</h3>

          <div className="flex flex-wrap gap-2 items-center">
            <input
              placeholder="Target user ID"
              id="targetId"
              className="border px-2 py-1"
            />
            <button
              onClick={() => sendActionToServer('MUTE')}
              className="bg-yellow-500 text-white px-3 py-1 rounded"
            >
              Mute User
            </button>
            <button
              onClick={() => sendActionToServer('KICK')}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Kick User
            </button>
          </div>
        </div>
      )}
    </div>
  );
}