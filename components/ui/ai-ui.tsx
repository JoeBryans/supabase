"use client";
// Voice Agent UI with microphone button and AI speaking avatar

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { motion } from "framer-motion";

export default function VoiceAgentUI() {
    const [recording, setRecording] = useState(false);
    const [aiSpeaking, setAiSpeaking] = useState(false);
    const [transcript, setTranscript] = useState("");

    const toggleRecording = () => {
        setRecording(!recording);
    };

    return (
        <div className="w-full h-screen bg-gray-100 flex flex-col items-center p-6 gap-6">
            <h1 className="text-2xl font-bold">Realtime Voice Agent</h1>

            {/* AI Avatar */}
            <motion.div
                animate={aiSpeaking ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                transition={{ repeat: aiSpeaking ? Infinity : 0, duration: 0.8 }}
                className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 shadow-xl flex items-center justify-center"
            >
                <span className="text-white text-xl font-semibold">AI</span>
            </motion.div>

            {/* Transcript */}
            <div className="w-full max-w-md bg-white p-4 rounded-xl shadow">
                <p className="text-gray-700 whitespace-pre-wrap min-h-[80px]">{transcript || "Say something..."}</p>
            </div>

            {/* Microphone Button */}
            <motion.button
                onClick={toggleRecording}
                animate={recording ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                transition={{ repeat: recording ? Infinity : 0, duration: 0.6 }}
                className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl ${recording ? "bg-red-600" : "bg-blue-600"
                    }`}
            >
                {recording ? <MicOff size={36} /> : <Mic size={36} />}
            </motion.button>
        </div>
    );
}
