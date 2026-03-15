"use client";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Phone, PhoneCall, PhoneOutgoing } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
export default function VoiceAgent() {
    const pcRef = useRef<RTCPeerConnection | null>(null);
    const dcRef = useRef<RTCDataChannel | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [connected, setConnected] = useState(false);
    const [userText, setUserText] = useState("");
    const [aiText, setAiText] = useState("");
    const [conversation, setConversation] = useState([
        { sender: "user", text: "" },
        { sender: "ai", text: "" },
    ]);
    const [aiSpeaking, setAiSpeaking] = useState(false);
    const [aiResponseId, setAiResponseId] = useState("");
    console.log("userText:", userText);
    console.log("aiText:", aiText);
    console.log("conversation:", conversation);

    async function startCall() {
        // 1. Microphone
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        // 2. PeerConnection
        const pc = new RTCPeerConnection();
        pcRef.current = pc;

        // 3. Data channel for instructions
        const dc = pc.createDataChannel("oai-events");
        dcRef.current = dc;

        dc.onopen = () => {
            console.log("DataChannel opened → sending English instruction");

            dc.send(
                JSON.stringify({
                    type: "session.update",
                    session: {
                        instructions:
                            "You are an AI tutor. ALWAYS speak English. Never switch to any other language.",
                    },
                })
            );
        };
        dc.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            console.log("message:", msg, msg.type);

            // === USER SPEECH → TEXT ===
            if (msg.type === "input_audio_buffer.speech_started") {
                const text = msg.transcript;
                setUserText(text);

                setConversation((prev) => [
                    ...prev,
                    { sender: "user", text }
                ]);
            }
            if (msg.type === "session.update") {
                const text = msg.transcript;
                console.log("session.update:",text);
                
                setUserText(text);

                setConversation((prev) => [
                    ...prev,
                    { sender: "user", text }
                ]);
            }

            // === AI STREAMING TRANSCRIPT (from audio) ===
            if (msg.type === "response.audio_transcript.delta") {
                setAiSpeaking(true);
                setAiText((prev) => prev + msg.delta);
            }

            // === AI FINAL TEXT ===
            if (msg.type === "response.audio_transcript.completed") {
                const full = msg.transcript;

                setAiText(full);

                setConversation((prev) => [
                    ...prev,
                    { sender: "ai", text: full }
                ]);
            }
        };


        // 4. Add mic track
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        // 5. Play remote audio
        const remoteStream = new MediaStream();
        audioRef.current = new Audio();
        audioRef.current.srcObject = remoteStream;
        audioRef.current.autoplay = true;

        pc.ontrack = (event) => remoteStream.addTrack(event.track);

        // 6. Offer
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        // 7. Send to OpenAI
        const resp = await fetch(
            "https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_KEY}`,
                    "Content-Type": "application/sdp",
                },
                body: offer.sdp,
            }
        );

        const answerSDP = await resp.text();
        console.log("answerSDP:", answerSDP);
        // 8. Set remote description
        await pc.setRemoteDescription({
            type: "answer",
            sdp: answerSDP,
        });

        setConnected(true);
    }

    async function stopCall() {
        // 1. Stop audio
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.srcObject = null;
        }

        // 3. Close peer connection
        if (pcRef.current) {
            pcRef.current.close();
        }

        // stop ai response


        setConnected(false);
    }
    return (
        <div className="p-6">
            {
                connected ?
                    <div className="flex flex-col gap-4 items-center justify-center">
                        {/* <div className='rounded-full shadow-sm w-52 h-52'>
                            <Image src="/aicaller.png" alt="ai-visual-assistant" width={500} height={500}
                                className="w-full rounded-full object-cover h-full"
                            />
                        </div> */}

                        <div className="w-full h-screen bg-gray-100 flex flex-col items-center p-6 gap-6">
                            <h1 className="text-2xl font-bold">Realtime Voice Agent</h1>

                            {/* AI Avatar */}
                            <motion.div
                                animate={aiSpeaking ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                                transition={{ repeat: aiSpeaking ? Infinity : 0, duration: 0.8 }}
                                className="w-32 h-32 rounded-full bg-linear-to-br from-blue-400 to-indigo-600 shadow-xl flex items-center justify-center"
                            >
                                <span className="text-white text-xl font-semibold">AI</span>
                            </motion.div>

                            {/* Transcript */}
                            <div className="w-full max-w-md bg-white p-4 rounded-xl shadow">
                                <p className="text-gray-700 whitespace-pre-wrap min-h-20">{aiText || "Say something..."}</p>
                            </div>

                            {/* Microphone Button */}
                            <motion.button
                                onClick={stopCall}
                                animate={connected ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                                transition={{ repeat: connected ? Infinity : 0, duration: 0.6 }}
                                className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl ${connected ? "bg-red-600" : "bg-blue-600"
                                    }`}
                            >
                                {connected ? <MicOff size={36} /> : <Mic size={36} />}
                            </motion.button>
                        </div>
                        <div className="mt-4 w-full max-w-xl mx-auto bg-gray-100 p-3 rounded-xl text-gray-700 text-sm">
                            <p><span className="font-semibold">You:</span> {userText}</p>
                            <p><span className="font-semibold">AI:</span> {aiText}</p>
                        </div>


                        <Button
                            // onClick={startCall}
                            variant={"destructive"}
                        // className="px-6 py-3 rounded-xl bg--600 text-white"
                        >
                            Stop Call <Phone className="w-4 h-4 ml-2" />
                        </Button>
                        <audio ref={audioRef} hidden /></div>

                    : <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl ${connected ? "bg-red-600" : "bg-blue-600"
                        }`} onClick={startCall}>
                        <Mic size={36} />
                    </div>
            }
        </div>
    );
}
