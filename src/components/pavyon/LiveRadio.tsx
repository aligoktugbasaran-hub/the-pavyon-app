"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Radio, Volume2, VolumeX, Music } from "lucide-react";

const RADIOS = [
    { id: "seymen", name: "Seymenler FM", url: "https://listen.radyoseymen.com.tr/seymen/seymen_low/icecast.audio", streamLabel: "Ankara Havaları" },
    { id: "kral", name: "Kral FM", url: "https://kralfm.turkmedya.com.tr/kralfm_low.mp3", streamLabel: "Arabesk & Damar" },
    { id: "fenomen", name: "Radyo Fenomen", url: "https://listen.radyofenomen.com/fenomen/128/icecast.audio", streamLabel: "Pop & Hit" },
    { id: "slow", name: "JoyTurk", url: "https://listen.joyturk.com.tr/joyturk/128/icecast.audio", streamLabel: "Slow & Aşk" }
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
                    alert("Radyoyu başlatmak için lütfen sayfaya bir kez tıklayın.");
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
        <div className="w-full bg-black/60 border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 glass-panel relative z-30 mb-2 shadow-[0_0_30px_rgba(255,0,127,0.1)]">

            {/* Sol Taraf: Canlı Sahne Info */}
            <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-neon-pink to-purple-900 border border-neon-pink/50 flex items-center justify-center shadow-[0_0_15px_rgba(255,0,127,0.4)]">
                    <Music className="w-6 h-6 text-white animate-pulse" />
                    {isPlaying && (
                        <div className="absolute -top-1 -right-1 flex gap-0.5">
                            <span className="w-1.5 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-1.5 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-1.5 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                    )}
                </div>
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-red-600 rounded text-[10px] font-bold text-white tracking-widest uppercase flex items-center gap-1 shadow-[0_0_10px_rgba(220,38,38,0.8)]">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                            Canlı Sahne
                        </span>
                        <h3 className="font-bold text-white text-lg tracking-wide">{currentRadio.name}</h3>
                    </div>
                    <p className="text-xs text-white/50">{currentRadio.streamLabel} • Pavyon Ortak Yayın</p>
                </div>
            </div>

            {/* Orta/Sağ Alan: Kontroller */}
            <div className="flex items-center gap-4 md:gap-6 bg-black/40 px-6 py-2 rounded-full border border-white/5">

                {/* Oynat / Durdur */}
                <button
                    onClick={togglePlay}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-neon-pink text-white hover:text-white transition-all shadow-lg hover:shadow-[0_0_15px_rgba(255,0,127,0.6)] hover:scale-105"
                >
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
                </button>

                {/* Ses Kontrol */}
                <div className="flex items-center gap-2 group">
                    <button onClick={toggleMute} className="text-white/60 hover:text-white transition-colors">
                        {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-20 md:w-24 h-1.5 rounded-full bg-white/20 appearance-none cursor-pointer accent-neon-pink"
                    />
                </div>

                {/* Radyo Seçici Dropdown */}
                <div className="relative border-l border-white/10 pl-4 md:pl-6 ml-2">
                    <button
                        onClick={() => setIsRadioMenuOpen(!isRadioMenuOpen)}
                        className="flex items-center gap-2 text-xs font-bold text-white/80 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-all"
                    >
                        <Radio className="w-4 h-4 text-gold-400" />
                        Kanal Değiştir
                    </button>

                    {isRadioMenuOpen && (
                        <div className="absolute top-12 right-0 w-48 bg-black/95 border border-white/20 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                            {RADIOS.map((radio) => (
                                <button
                                    key={radio.id}
                                    onClick={() => {
                                        setCurrentRadio(radio);
                                        setIsRadioMenuOpen(false);
                                        if (!isPlaying) togglePlay(); // Auto play if they were paused
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex flex-col gap-0.5 ${currentRadio.id === radio.id ? 'bg-neon-pink/20 text-neon-pink font-bold border border-neon-pink/30' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                                >
                                    <span>{radio.name}</span>
                                    <span className="text-[9px] opacity-60 font-normal">{radio.streamLabel}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
