"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Radio, Volume2, VolumeX, Music } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";

const RADIOS = [
    { id: "seymen", name: "Seymenler FM", url: "https://radyoseymen.com.tr/radyo/seymen128.mp3", streamLabel: "Ankara Havaları" },
    { id: "kral", name: "Kral FM", url: "https://strm.radyotvonline.net/kralfm", streamLabel: "Arabesk & Damar" },
    { id: "metro", name: "Metro FM", url: "https://strm.radyotvonline.net/metrofm", streamLabel: "Pop & Hit" },
    { id: "slow", name: "Slow Türk", url: "https://strm.radyotvonline.net/slowturk", streamLabel: "Slow & Aşk" },
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
        // Initialize audio object once on mount
        audioRef.current = new Audio(currentRadio.url);
        audioRef.current.volume = volume;

        // Cleanup on unmount
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = "";
            }
        };
    }, []);

    // Change radio station
    useEffect(() => {
        if (audioRef.current) {
            const wasPlaying = isPlaying;
            audioRef.current.pause();
            audioRef.current.src = currentRadio.url;
            audioRef.current.load();
            if (wasPlaying) {
                audioRef.current.play().catch(e => console.log("Can't autoplay", e));
            }
        }
    }, [currentRadio]);

    // Handle play/pause
    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            // Need to handle browser autoplay policies (might require user interaction first)
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(err => {
                    console.error("Autoplay failed", err);
                    useUserStore.getState().showToast("Radyoyu başlatmak için lütfen sayfaya bir kez tıklayın.", "info");
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
                            <div className="absolute top-12 right-0 w-48 bg-black/98 border border-white/20 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.95)] p-2 z-[60] animate-in fade-in zoom-in-95 duration-200 backdrop-blur-xl">
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
