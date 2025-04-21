'use client';

import {
  ControlBar,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  RoomContext,
} from '@livekit/components-react';
import { Room, Track } from 'livekit-client';
import '@livekit/components-styles';
import { useEffect, useState } from 'react';

export default function Page({ roomName, userId }) {
  const [roomInstance] = useState(() =>
    new Room({
      adaptiveStream: true,
      dynacast: true,
    }),
  );

  const [joined, setJoined] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const joinRoom = async () => {
    setConnecting(true);
    try {
      const resp = await fetch('/api/livekit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomName,
          userId,
          role: 'participant',
        }),
      });

      const data = await resp.json();
      if (data.token && data.url) {
        await roomInstance.connect(data.url, data.token);
        setJoined(true);
      }
    } catch (e) {
      console.error('Connection error:', e);
    } finally {
      setConnecting(false);
    }
  };

  useEffect(() => {
    return () => {
      roomInstance.disconnect();
    };
  }, [roomInstance]);

  if (!joined) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Welcome, {userId}</h2>
        <p>Room: <strong>{roomName}</strong></p>
        <button onClick={joinRoom} disabled={connecting}>
          {connecting ? 'Joining...' : 'Join Room'}
        </button>
      </div>
    );
  }

  return (
    <RoomContext.Provider value={roomInstance}>
      <div data-lk-theme="default" style={{ height: '100dvh' }}>
        <MyVideoConference />
        <RoomAudioRenderer />
        <ControlBar />
      </div>
    </RoomContext.Provider>
  );
}

function MyVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );

  return (
    <GridLayout
      tracks={tracks}
      style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}
    >
      <ParticipantTile />
    </GridLayout>
  );
}
