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
  const [joined, setJoined] = useState(false);
  const [token, setToken] = useState('');
  const [roomInstance] = useState(() => new Room({ adaptiveStream: true, dynacast: true }));
  const [showChat, setShowChat] = useState(false);

  const joinRoom = async () => {
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
        setToken(data.token);
        await roomInstance.connect(data.url, data.token);
        setJoined(true);
      }
    } catch (e) {
      console.error('Connection error:', e);
    }
  };

  useEffect(() => {
    return () => {
      roomInstance.disconnect();
    };
  }, [roomInstance]);

  if (!joined) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <button
          onClick={joinRoom}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition"
        >
          Join Room
        </button>
      </div>
    );
  }

  return (
    <RoomContext.Provider value={roomInstance}>
      <div className="relative flex h-screen w-screen" data-lk-theme="default">
        <div className={`flex-1 transition-all duration-300 ${showChat ? 'w-3/4' : 'w-full'}`}>
          <MyVideoConference />
          <RoomAudioRenderer />
          <ControlBar />
        </div>

        {/* Chat Panel */}
        <div
          className={`bg-white border-l border-gray-200 h-full transition-transform duration-300 shadow-lg ${
            showChat ? 'translate-x-0 w-1/4' : 'translate-x-full w-0'
          }`}
        >
          {showChat && <ChatPanel />}
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setShowChat(!showChat)}
          className="absolute top-4 right-4 bg-white border p-2 rounded-full shadow hover:bg-gray-100 transition"
        >
          {showChat ? 'Close Chat' : 'Open Chat'}
        </button>
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
    { onlySubscribed: false }
  );

  return (
    <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
      <ParticipantTile />
    </GridLayout>
  );
}

function ChatPanel() {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b font-semibold">Chat</div>
      <div className="flex-1 overflow-y-auto p-4 text-sm text-gray-700">
        {/* Example messages */}
        <div className="mb-2">👋 Welcome to the chat!</div>
      </div>
      <div className="p-4 border-t">
        <input
          type="text"
          placeholder="Type a message..."
          className="w-full px-3 py-2 border rounded-md outline-none focus:ring focus:ring-blue-200"
        />
      </div>
    </div>
  );
}
