"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Radio, Volume2, VolumeX, Music } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";

const RADIOS = [
    { id: "chillhop", name: "Lofi Beats", url: "https://streams.fluxfm.de/Chillhop/mp3-320/streams.fluxfm.de/", streamLabel: "Lofi & Chill" },
    { id: "jazz", name: "Smooth Jazz", url: "https://streaming.radio.co/s774887f7b/listen", streamLabel: "Jazz & Soul" },
    { id: "classical", name: "Klasik Müzik", url: "https://live.musopen.org:8085/streamvbr0", streamLabel: "Klasik & Orkestra" },
    { id: "deephouse", name: "Deep House", url: "https://streams.fluxfm.de/Chillhop/mp3-320/streams.fluxfm.de/", streamLabel: "Deep & Chill" },
];

export function LiveRadio() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [currentRadio, setCurrentRadio] = useState(RADIOS[0]);
    const [isRadioMenuOpen, setIsRadioMenuOpen] = useState(false);

    // We use an audio element to play the stream
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        try {
            audioRef.current = new Audio();
            audioRef.current.volume = volume;
            audioRef.current.preload = "none";
        } catch (e) {
            console.warn("Audio init failed", e);
        }
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = "";
            }
        };
    }, []);

    // Change radio station
    useEffect(() => {
        if (!audioRef.current) return;
        const wasPlaying = isPlaying;
        audioRef.current.pause();
        audioRef.current.src = currentRadio.url;
        if (wasPlaying) {
            audioRef.current.play().catch(e => {
                console.log("Stream yüklenemedi", e);
                useUserStore.getState().showToast("Bu radyo şu an yayında değil, başka kanal dene.", "info");
                setIsPlaying(false);
            });
        }
    }, [currentRadio]);

    // Handle play/pause
    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.src = currentRadio.url;
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(err => {
                    console.error("Radyo başlatılamadı", err);
                    useUserStore.getState().showToast("Radyo başlatılamadı. Başka kanal deneyin.", "info");
                });
        }
    };

    // Handle mute
    const toggleMute = () => {
        if (!audioRef.current) return;
        audioRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    // Handle volume change
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        setVolume(val);
        if (audioRef.current) {
            audioRef.current.volume = val;
            if (val > 0 && isMuted) {
                toggleMute();
            }
        }
    };

    return (
        <div className="w-full bg-black/60 border border-white/10 rounded-xl p-2 flex items-center gap-3 glass-panel relative z-30 mb-2 shadow-[0_0_30px_rgba(255,0,127,0.1)]">

            {/* Top Row: Info + Controls (On same line for mobile efficiency) */}
            <div className="flex items-center justify-between gap-2 overflow-hidden">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="relative w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-neon-pink to-purple-900 border border-neon-pink/50 flex items-center justify-center shadow-[0_0_15px_rgba(255,0,127,0.4)]">
                        <Music className="w-5 h-5 text-white animate-pulse" />
                        {isPlaying && (
                            <div className="absolute -top-1 -right-1 flex gap-0.5">
                                <span className="w-1 h-2.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-1 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-1 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="shrink-0 px-1.5 py-0.5 bg-red-600 rounded-[4px] text-[8px] font-black text-white tracking-tighter uppercase flex items-center gap-1 shadow-[0_0_10px_rgba(220,38,38,0.8)]">
                                <span className="w-1 h-1 rounded-full bg-white animate-pulse"></span>
                                CANLI
                            </span>
                            <h3 className="font-bold text-white text-sm md:text-lg tracking-tight truncate">{currentRadio.name}</h3>
                        </div>
                        <p className="text-[10px] text-white/50 truncate hidden xs:block">{currentRadio.streamLabel}</p>
                    </div>
                </div>

                {/* Right controls - Merged into top row for space */}
                <div className="flex items-center gap-2 bg-white/5 px-2 py-1.5 rounded-xl border border-white/5 shrink-0">
                    {/* Oynat / Durdur */}
                    <button
                        onClick={togglePlay}
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-neon-pink text-white transition-all shadow-lg hover:shadow-[0_0_15px_rgba(255,0,127,0.6)] active:scale-95"
                    >
                        {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                    </button>

                    {/* Radyo Seçici Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsRadioMenuOpen(!isRadioMenuOpen)}
                            className="flex items-center gap-1 text-[10px] font-black text-white/80 hover:text-white px-2 py-1.5 rounded-lg border border-white/10 bg-white/5 transition-all"
                        >
                            <Radio className="w-3.5 h-3.5 text-gold-400" />
                            <span className="hidden sm:inline">KANAL</span>
                        </button>

                        {isRadioMenuOpen && (
                            <div className="absolute top-12 right-0 w-48 bg-black border border-white/20 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.95)] p-2 z-[9999] animate-in fade-in zoom-in-95 duration-200 backdrop-blur-xl" onClick={(e) => e.stopPropagation()}>
                                {RADIOS.map((radio) => (
                                    <button
                                        key={radio.id}
                                        onClick={() => {
                                            setCurrentRadio(radio);
                                            setIsRadioMenuOpen(false);
                                            if (!isPlaying) togglePlay();
                                        }}
                                        className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold transition-all flex flex-col gap-0.5 mb-1 last:mb-0 ${currentRadio.id === radio.id ? 'bg-neon-pink text-white shadow-lg' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                                    >
                                        <span>{radio.name}</span>
                                        <span className={`text-[9px] font-normal ${currentRadio.id === radio.id ? 'text-white/80' : 'opacity-60'}`}>{radio.streamLabel}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}
