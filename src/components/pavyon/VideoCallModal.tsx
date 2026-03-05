"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
    Video, VideoOff, Mic, MicOff, Phone, PhoneOff,
    PhoneIncoming, X, RefreshCw, Camera
} from "lucide-react";

export type CallStatus = "idle" | "requesting" | "ringing" | "accepted" | "active" | "rejected" | "ended";

interface VideoCallModalProps {
    isOpen: boolean;
    onClose: () => void;
    remoteUser: { name: string; avatar: string } | null;
    /** 
     * Simulates the remote party side. In production this would be 
     * driven by WebRTC signaling over WebSocket/Supabase Realtime.
     * For the demo: "caller" = you initiated, "receiver" = you received a call
     */
    role?: "caller" | "receiver";
}

export function VideoCallModal({ isOpen, onClose, remoteUser, role = "caller" }: VideoCallModalProps) {
    const [status, setStatus] = useState<CallStatus>(role === "caller" ? "requesting" : "ringing");
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCamOn, setIsCamOn] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => { setMounted(true); }, []);

    // Request local camera when status = accepted/active
    useEffect(() => {
        if (status === "active" && isCamOn) {
            navigator.mediaDevices?.getUserMedia({ video: true, audio: isMicOn })
                .then((stream) => {
                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = stream;
                    }
                })
                .catch(() => {
                    // Camera permission denied - continue without cam
                });
        }
        return () => {
            // Stop all tracks on cleanup
            if (localVideoRef.current?.srcObject) {
                (localVideoRef.current.srcObject as MediaStream)
                    .getTracks().forEach(t => t.stop());
            }
        };
    }, [status, isCamOn]);

    // Call timer
    useEffect(() => {
        if (status === "active") {
            timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
            setElapsed(0);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [status]);

    // Simulate remote acceptance after 3 seconds (for demo only)
    useEffect(() => {
        if (status === "requesting") {
            const timer = setTimeout(() => {
                // 80% chance the remote accepts for demo
                const accepts = Math.random() > 0.2;
                setStatus(accepts ? "accepted" : "rejected");
                if (accepts) {
                    setTimeout(() => setStatus("active"), 1000);
                }
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [status]);

    const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

    const handleAccept = () => {
        setStatus("accepted");
        setTimeout(() => setStatus("active"), 800);
    };

    const handleReject = () => {
        setStatus("rejected");
        setTimeout(() => { onClose(); setStatus(role === "caller" ? "requesting" : "ringing"); }, 1500);
    };

    const handleEndCall = () => {
        // Stop camera
        if (localVideoRef.current?.srcObject) {
            (localVideoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
        }
        setStatus("ended");
        setTimeout(() => { onClose(); setStatus(role === "caller" ? "requesting" : "ringing"); }, 1500);
    };

    if (!isOpen || !mounted || !remoteUser) return null;

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="relative w-full max-w-lg bg-gradient-to-br from-[#0d0818] via-[#110d22] to-black border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(255,0,127,0.15)]">

                {/* Close (only when not in active call) */}
                {status !== "active" && (
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 z-10 text-white/30 hover:text-white hover:bg-white/10 rounded-full transition-all">
                        <X className="w-4 h-4" />
                    </button>
                )}

                {/* === REQUESTING / RINGING === */}
                {(status === "requesting" || status === "ringing") && (
                    <div className="flex flex-col items-center justify-center p-12 gap-6">
                        <div className="relative">
                            <div className="w-28 h-28 rounded-full border-4 border-neon-pink shadow-[0_0_40px_rgba(255,0,127,0.5)] overflow-hidden">
                                <img src={remoteUser.avatar} alt={remoteUser.name} className="w-full h-full object-cover" />
                            </div>
                            {/* Ripple rings */}
                            <div className="absolute inset-0 rounded-full border-2 border-neon-pink/40 animate-ping" />
                            <div className="absolute -inset-4 rounded-full border border-neon-pink/20 animate-ping" style={{ animationDelay: "0.3s" }} />
                        </div>

                        <div className="text-center">
                            <div className="text-2xl font-black text-white">{remoteUser.name}</div>
                            {status === "requesting" ? (
                                <>
                                    <div className="text-white/50 text-sm mt-1">Görüntülü arama isteği gönderildi...</div>
                                    <div className="flex gap-1 justify-center mt-3">
                                        {[0, 150, 300].map(d => (
                                            <div key={d} className="w-2 h-2 bg-neon-pink rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                                        ))}
                                    </div>
                                    <div className="text-white/30 text-xs mt-2">Karşı tarafın kabul etmesi bekleniyor</div>
                                </>
                            ) : (
                                <>
                                    <div className="text-neon-pink text-sm mt-1 font-bold flex items-center gap-2 justify-center">
                                        <PhoneIncoming className="w-4 h-4" /> Görüntülü Arama Geliyor...
                                    </div>
                                    <div className="text-white/40 text-xs mt-2">Her iki taraf kabul ederse görüşme başlar</div>
                                </>
                            )}
                        </div>

                        {/* Buttons */}
                        {status === "requesting" ? (
                            <button onClick={handleReject} className="flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-500 rounded-full text-white font-bold transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                                <PhoneOff className="w-5 h-5" /> İptal Et
                            </button>
                        ) : (
                            <div className="flex gap-4">
                                <button onClick={handleReject} className="flex flex-col items-center gap-1">
                                    <div className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all hover:scale-110">
                                        <PhoneOff className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-white/50 text-xs">Reddet</span>
                                </button>
                                <button onClick={handleAccept} className="flex flex-col items-center gap-1">
                                    <div className="w-16 h-16 rounded-full bg-green-600 hover:bg-green-500 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.5)] transition-all hover:scale-110 animate-pulse">
                                        <Video className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-white/50 text-xs">Kabul Et</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* === ACCEPTED (connecting) === */}
                {status === "accepted" && (
                    <div className="flex flex-col items-center justify-center p-12 gap-4">
                        <RefreshCw className="w-10 h-10 text-neon-pink animate-spin" />
                        <div className="text-white font-bold">Bağlanıyor...</div>
                    </div>
                )}

                {/* === REJECTED === */}
                {status === "rejected" && (
                    <div className="flex flex-col items-center justify-center p-12 gap-4">
                        <PhoneOff className="w-10 h-10 text-red-400" />
                        <div className="text-white font-bold text-lg">Arama Reddedildi</div>
                        <div className="text-white/40 text-sm">{remoteUser.name} aramayı kabul etmedi.</div>
                    </div>
                )}

                {/* === ENDED === */}
                {status === "ended" && (
                    <div className="flex flex-col items-center justify-center p-12 gap-4">
                        <PhoneOff className="w-10 h-10 text-white/30" />
                        <div className="text-white font-bold text-lg">Arama Sonlandı</div>
                        <div className="text-white/40 text-sm">Süre: {formatTime(elapsed)}</div>
                    </div>
                )}

                {/* === ACTIVE CALL === */}
                {status === "active" && (
                    <div className="relative">
                        {/* Remote video (mock with avatar) */}
                        <div className="w-full h-80 bg-gradient-to-br from-purple-900/60 to-black flex items-center justify-center relative overflow-hidden">
                            <img src={remoteUser.avatar} alt={remoteUser.name} className="w-full h-full object-cover opacity-60 blur-sm scale-110" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <img src={remoteUser.avatar} alt={remoteUser.name} className="w-24 h-24 rounded-full border-4 border-neon-pink shadow-[0_0_30px_rgba(255,0,127,0.4)]" />
                                <div className="text-white font-bold mt-2">{remoteUser.name}</div>
                                <div className="text-neon-pink text-xs font-mono mt-1">{formatTime(elapsed)}</div>
                            </div>

                            {/* Local video (small pip) */}
                            <div className="absolute bottom-4 right-4 w-24 h-20 rounded-xl overflow-hidden border-2 border-white/30 shadow-lg bg-black">
                                {isCamOn ? (
                                    <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-900">
                                        <Camera className="w-6 h-6 text-white/30" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Call Controls */}
                        <div className="p-6 flex items-center justify-center gap-5 bg-black/80">
                            {/* Mic Toggle */}
                            <button
                                onClick={() => setIsMicOn(!isMicOn)}
                                className={`flex flex-col items-center gap-1.5`}
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isMicOn ? 'bg-white/10 hover:bg-white/20' : 'bg-red-600/80'}`}>
                                    {isMicOn ? <Mic className="w-5 h-5 text-white" /> : <MicOff className="w-5 h-5 text-white" />}
                                </div>
                                <span className="text-white/40 text-[10px]">{isMicOn ? "Mikrofon" : "Sessiz"}</span>
                            </button>

                            {/* End Call */}
                            <button onClick={handleEndCall} className="flex flex-col items-center gap-1.5">
                                <div className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all hover:scale-110">
                                    <Phone className="w-6 h-6 text-white rotate-[135deg]" />
                                </div>
                                <span className="text-white/40 text-[10px]">Kapat</span>
                            </button>

                            {/* Cam Toggle */}
                            <button
                                onClick={() => setIsCamOn(!isCamOn)}
                                className="flex flex-col items-center gap-1.5"
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isCamOn ? 'bg-white/10 hover:bg-white/20' : 'bg-red-600/80'}`}>
                                    {isCamOn ? <Video className="w-5 h-5 text-white" /> : <VideoOff className="w-5 h-5 text-white" />}
                                </div>
                                <span className="text-white/40 text-[10px]">{isCamOn ? "Kamera" : "Kamera Off"}</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
}
