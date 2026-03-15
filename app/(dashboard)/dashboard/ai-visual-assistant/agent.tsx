"use client";

import { useState, useEffect } from "react";
import { RealtimeAgent, RealtimeSession,tool } from "@openai/agents/realtime";

export default function VoiceAssistant() {
    const [session, setSession] = useState<RealtimeSession | null>(null);
    const [connected, setConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [isTalking, setIsTalking] = useState(false);

    async function startCall() {
        // Request ephemeral token
        const res = await fetch("/api/session", {
            method: "POST",
            body: JSON.stringify({}),
        });
        const { client_secret } = await res.json();

        // Use RealtimeAgent
        const agent = new RealtimeAgent({
            name: "Tutor",
            instructions: "You are an AI e-learning assistant. Speak clearly.",
        });

        const realtimeSession = new RealtimeSession(agent);

        // Register text output
        realtimeSession.on("response.output_text.delta", (ev) => {
            setMessages((prev) => [...prev, { from: "ai", text: ev.delta }]);
        });

        // Register user transcript
        realtimeSession.on("input.audio_transcript.delta", (ev) => {
            setMessages((prev) => [...prev, { from: "me", text: ev.delta }]);
        });

        // Speaking animation
        realtimeSession.on("response.audio.delta", () => setIsTalking(true));
        realtimeSession.on("response.completed", () => setIsTalking(false));

        // Connect WebRTC
        await realtimeSession.connect({
            clientSecret: client_secret,
        });

        setConnected(true);
        setSession(realtimeSession);
    }

    function stopCall() {
        // safely disconnect if we have a session, then clear it
        session?.disconnect();
        setSession(null);
        setConnected(false);
    }

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">AI Voice Tutor</h1>

            <div className="space-y-2 mb-4 h-64 overflow-y-auto bg-gray-100 p-3 rounded">
                {messages.map((m, i) => (
                    <div key={i} className={m.from === "me" ? "text-blue-600" : "text-green-700"}>
                        <b>{m.from === "me" ? "You" : "AI"}:</b> {m.text}
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-4">
                {!connected ? (
                    <button
                        onClick={startCall}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Start Call
                    </button>
                ) : (
                    <button
                        onClick={stopCall}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                        Stop Call
                    </button>
                )}

                <div
                    className={`w-10 h-10 rounded-full transition-all ${isTalking ? "bg-green-500 animate-pulse" : "bg-gray-400"
                        }`}
                ></div>
            </div>
        </div>
    );
}
