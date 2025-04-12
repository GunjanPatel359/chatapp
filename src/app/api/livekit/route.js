import { NextResponse } from 'next/server';
import { AccessToken } from 'livekit-server-sdk';

export async function POST(req) {
  const { roomName, userId, role } = await req.json();

  if (!roomName || !userId || !role) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const token = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    { identity: userId }
  );

  token.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });

  const newtoken= await token.toJwt()

  return NextResponse.json({
    token: newtoken,
    url: process.env.LIVEKIT_URL,
  });
}