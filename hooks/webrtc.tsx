import { useEffect, useRef, useState } from "react";

export function useWebRTC(signaling) {
    const localVideo = useRef(null);
    const remoteVideo = useRef(null);
    const peer = useRef(null);

    const startCall = async () => {
        peer.current = new RTCPeerConnection();

        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });

        localVideo.current.srcObject = stream;

        stream.getTracks().forEach((track) =>
            peer.current.addTrack(track, stream)
        );

        peer.current.ontrack = (event) => {
            remoteVideo.current.srcObject = event.streams[0];
        };

        signaling.on("offer", async (offer) => {
            await peer.current.setRemoteDescription(offer);
            const answer = await peer.current.createAnswer();
            await peer.current.setLocalDescription(answer);
            signaling.emit("answer", answer);
        });

        signaling.on("answer", async (answer) => {
            await peer.current.setRemoteDescription(answer);
        });

        signaling.on("ice", async (candidate) => {
            await peer.current.addIceCandidate(candidate);
        });

        peer.current.onicecandidate = (event) => {
            if (event.candidate) signaling.emit("ice", event.candidate);
        };

        // create offer
        const offer = await peer.current.createOffer();
        await peer.current.setLocalDescription(offer);
        signaling.emit("offer", offer);
    };

    return { localVideo, remoteVideo, startCall };
}
