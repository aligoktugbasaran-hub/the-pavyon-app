"use client";
import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Music, ChevronLeft, ChevronRight } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";

const PROXY = "/api/radio-proxy?url=";

const RADIOS = [
    { id: "seymen", name: "Radyo Seymen", url: PROXY + encodeURIComponent("http://yayin.radyoseymen.com.tr:1070/"), streamLabel: "Ankara Havaları" },
    { id: "lofi", name: "Lofi Beats", url: "https://streams.fluxfm.de/Chillhop/mp3-320/streams.fluxfm.de/", streamLabel: "Lofi & Chill" },
    { id: "somagroove", name: "Groove Salad", url: "https://ice2.somafm.com/groovesalad-256-mp3", streamLabel: "Ambient Groove" },
    { id: "somadefcon", name: "Synthwave", url: "https://ice2.somafm.com/defcon-256-mp3", streamLabel: "Synthwave" },
    { id: "somaindie", name: "Indie Pop", url: "https://ice2.somafm.com/indiepop-128-mp3", streamLabel: "Indie Pop" },
    { id: "somametal", name: "Metal", url: "https://ice2.somafm.com/metal-128-mp3", streamLabel: "Heavy Metal" },
    { id: "somabossa", name: "Bossa Nova", url: "https://ice2.somafm.com/bossa-128-mp3", streamLabel: "Bossa Nova" },
    { id: "somasoul", name: "70s Soul", url: "https://ice2.somafm.com/7soul-128-mp3", streamLabel: "70s Soul" },
    { id: "somagoa", name: "Goa Trance", url: "https://ice2.somafm.com/suburbsofgoa-128-mp3", streamLabel: "Goa & Trance" },
    { id: "somaspace", name: "Space Station", url: "https://ice2.somafm.com/spacestation-128-mp3", streamLabel: "Uzay Müziği" },
    { id: "somasecret", name: "Secret Agent", url: "https://ice2.somafm.com/secretagent-256-mp3", streamLabel: "Lounge & Jazz" },
    { id: "somafolk", name: "Folk Forward", url: "https://ice2.somafm.com/folkfwd-128-mp3", streamLabel: "Folk" },
    { id: "somalush", name: "Lush", url: "https://ice2.somafm.com/lush-128-mp3", streamLabel: "Sensual" },
    { id: "somabeat", name: "Beat Blender", url: "https://ice2.somafm.com/beatblender-128-mp3", streamLabel: "Deep House" },
    { id: "somacliq", name: "Cliq Hop", url: "https://ice2.somafm.com/cliqhop-256-mp3", streamLabel: "IDM & Glitch" },
    { id: "powerjazz", name: "Power Jazz", url: PROXY + encodeURIComponent("https://listen.powerapp.com.tr/powersmoothjazz/mpeg/icecast.audio"), streamLabel: "Jazz" },
    { id: "powerturk", name: "PowerTürk", url: PROXY + encodeURIComponent("https://listen.powerapp.com.tr/powerturk/mpeg/icecast.audio"), streamLabel: "Türkçe Pop" },
    { id: "powerfm", name: "Power FM", url: PROXY + encodeURIComponent("https://listen.powerapp.com.tr/powerfm/mpeg/icecast.audio"), streamLabel: "Yabancı Pop" },
    { id: "taksim", name: "Taksim FM", url: PROXY + encodeURIComponent("http://cast1.taksim.fm:8008/"), streamLabel: "Arabesk" },
    { id: "damarfm", name: "Damar FM", url: PROXY + encodeURIComponent("https://yayin.damarfm.com:8080/"), streamLabel: "Damar" },
];

export function LiveRadio() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const currentRadio = RADIOS[currentIndex];

    useEffect(() => {
        audioRef.current = new Audio();
        audioRef.current.volume = volume;
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = "";
            }
        };
    }, []);

    const playStation = (index: number) => {
        if (!audioRef.current) return;
        const radio = RADIOS[index];
        setIsLoading(true);
        audioRef.current.pause();

        // HLS (m3u8) formatı için farklı yaklaşım
        if (radio.url.includes('.m3u8')) {
            // Tarayıcı HLS'i doğrudan desteklemeyebilir, alternatif dene
            audioRef.current.src = radio.url;
            audioRef.current.play().then(() => {
                setIsPlaying(true);
                setIsLoading(false);
            }).catch(() => {
                // m3u8 çalışmazsa hata göster
                setIsPlaying(false);
                setIsLoading(false);
                useUserStore.getState().showToast("Bu kanal tarayıcınızda desteklenmiyor.", "info");
            });
            return;
        }

        audioRef.current.src = radio.url;
        const cleanup = () => {
            audioRef.current?.removeEventListener('canplay', onReady);
            audioRef.current?.removeEventListener('error', onFail);
        };
        const onReady = () => {
            audioRef.current?.play().then(() => {
                setIsPlaying(true);
                setIsLoading(false);
            }).catch(() => {
                setIsPlaying(false);
                setIsLoading(false);
                useUserStore.getState().showToast("Bu kanal şu an yayında değil.", "info");
            });
            cleanup();
        };
        const onFail = () => {
            setIsPlaying(false);
            setIsLoading(false);
            useUserStore.getState().showToast("Kanal yüklenemedi, başka dene.", "info");
            cleanup();
        };
        audioRef.current.addEventListener('canplay', onReady);
        audioRef.current.addEventListener('error', onFail);
        audioRef.current.load();
    };

    const selectStation = (index: number) => {
        setCurrentIndex(index);
        playStation(index);
    };

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            playStation(currentIndex);
        }
    };

    const nextStation = () => {
        const next = (currentIndex + 1) % RADIOS.length;
        selectStation(next);
    };

    const prevStation = () => {
        const prev = (currentIndex - 1 + RADIOS.length) % RADIOS.length;
        selectStation(prev);
    };

    const toggleMute = () => {
        if (!audioRef.current) return;
        audioRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    return (
        <div className="w-full bg-black/60 border border-white/10 rounded-xl glass-panel relative z-30 mb-2 shadow-[0_0_30px_rgba(255,0,127,0.1)]">
            {/* Üst satır: Şu an çalan + kontroller */}
            <div className="flex items-center gap-3 p-2">
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
                <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        {isPlaying && (
                            <span className="shrink-0 px-1.5 py-0.5 bg-red-600 rounded-[4px] text-[8px] font-black text-white tracking-tighter uppercase flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-white animate-pulse"></span>
                                CANLI
                            </span>
                        )}
                        <h3 className="font-bold text-white text-sm tracking-tight truncate">
                            {isLoading ? "Yükleniyor..." : currentRadio.name}
                        </h3>
                    </div>
                    <p className="text-[10px] text-white/50 truncate">{currentRadio.streamLabel}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                    <button onClick={prevStation} className="w-7 h-7 rounded-full flex items-center justify-center bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-all">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button onClick={togglePlay} disabled={isLoading} className="w-9 h-9 rounded-full flex items-center justify-center bg-neon-pink text-white transition-all shadow-lg hover:shadow-[0_0_15px_rgba(255,0,127,0.6)] active:scale-95 disabled:opacity-50">
                        {isLoading ? (
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : isPlaying ? (
                            <Pause className="w-4 h-4 fill-current" />
                        ) : (
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                        )}
                    </button>
                    <button onClick={nextStation} className="w-7 h-7 rounded-full flex items-center justify-center bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-all">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                    <button onClick={toggleMute} className="w-7 h-7 rounded-full flex items-center justify-center bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-all">
                        {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                </div>
            </div>
            {/* Alt satır: Kanal seçici (yatay scroll) */}
            <div className="border-t border-white/5 px-2 py-1.5">
                <div ref={scrollRef} className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1">
                    {RADIOS.map((radio, idx) => (
                        <button
                            key={radio.id}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                selectStation(idx);
                            }}
                            className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all whitespace-nowrap ${
                                currentIndex === idx
                                    ? 'bg-neon-pink text-white shadow-[0_0_10px_rgba(255,0,127,0.4)]'
                                    : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80'
                            }`}
                        >
                            {radio.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
