import { RealtimeAgent, RealtimeSession } from '@openai/agents/realtime';

const agent = new RealtimeAgent({
    name: 'Assistant',
    instructions: 'You are a helpful assistant.',
});

// Automatically connects your microphone and audio output in the browser via WebRTC.
const session = new RealtimeSession(agent);
await session.connect({
    apiKey: '<client-api-key>',
});

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const offerSDP = await req.text();
        console.log("offerSDP:", offerSDP);
        

        const resp = await fetch(
            "https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // secret on server
                    "Content-Type": "application/sdp",
                },
                body: offerSDP,
            }
        );

        const answerSDP = await resp.text();

        return new NextResponse(answerSDP, {
            status: 200,
            headers: { "Content-Type": "application/sdp" },
        });
    } catch (error) {
        console.error("WebRTC API error:", error);
        return new NextResponse("Error generating SDP", { status: 500 });
    }
}


