import { GlassCard } from "@/components/ui/GlassCard";
import { Mic2, Radio, Play, Pause, SkipForward, Volume2, ChevronDown } from "lucide-react";
import { useState } from "react";

const RADIOS = [
    { id: "seymenler", name: "Seymenler FM", stream: "#" },
    { id: "alaturka", name: "Alaturka Radyo", stream: "#" },
    { id: "ask_fm", name: "Aşk FM", stream: "#" },
    { id: "damar", name: "Damar FM", stream: "#" },
    { id: "arabesk", name: "Kral Arabesk", stream: "#" }
];

export function Stage() {
    const [selectedRadio, setSelectedRadio] = useState(RADIOS[0]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);

    return (
        <GlassCard className="h-full flex flex-col w-full relative group border-gold-500/20 p-0">

            {/* Gerçek Pavyon Sahnesi Arka Planı (Unsplash) */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105 rounded-2xl overflow-hidden"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1598368195835-91e67f80c9d7?q=80&w=1000&auto=format&fit=crop")',
                }}
            />
            {/* Karartma ve Renk Efekti */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-purple-900/40 z-0 mix-blend-multiply rounded-2xl overflow-hidden" />
            <div className="absolute inset-0 bg-black/40 z-0 backdrop-blur-[2px] rounded-2xl overflow-hidden" />

            {/* İçerik */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full w-full gap-4">
                {/* Başlık */}
                <div className="flex items-center gap-3">
                    <Mic2 className="w-8 h-8 text-neon-pink drop-shadow-[0_0_10px_rgba(255,20,147,0.8)] animate-pulse" />
                    <h2 className="font-heading font-black text-3xl md:text-4xl text-white drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)] tracking-widest uppercase">CANLI SAHNE</h2>
                </div>

                {/* Radyo Oynatıcı & Seçici */}
                <div className="relative flex flex-col items-center">
                    <div className="flex items-center gap-4 bg-black/60 border border-white/10 backdrop-blur-md rounded-full px-6 py-2 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                        <div className="flex items-center gap-2">
                            <Radio className={`w-5 h-5 ${isPlaying ? 'text-gold-400 animate-pulse' : 'text-white/40'}`} />

                            {/* Dropdown Toggle */}
                            <div
                                className="flex items-center gap-2 cursor-pointer group hover:bg-white/5 px-2 py-1 rounded-lg transition-colors"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-white/60 uppercase tracking-widest font-bold">
                                        {isPlaying ? "Canlı Yayın" : "Duraklatıldı"}
                                    </span>
                                    <span className="text-sm font-bold text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)] group-hover:text-gold-400 transition-colors">
                                        {selectedRadio.name}
                                    </span>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </div>
                        </div>

                        <div className="h-6 w-px bg-white/10 mx-2"></div>

                        <div className="flex items-center gap-3">
                            <button
                                className="text-white/60 hover:text-white transition-colors"
                                onClick={() => setIsPlaying(!isPlaying)}
                            >
                                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                            </button>
                            <button
                                className="text-white/60 hover:text-white transition-colors"
                                onClick={() => {
                                    const currentIndex = RADIOS.findIndex(r => r.id === selectedRadio.id);
                                    const nextIndex = (currentIndex + 1) % RADIOS.length;
                                    setSelectedRadio(RADIOS[nextIndex]);
                                }}
                            >
                                <SkipForward className="w-5 h-5 fill-current" />
                            </button>
                        </div>

                        <div className="h-6 w-px bg-white/10 mx-2"></div>

                        <div className="flex items-center gap-2">
                            <Volume2 className="w-4 h-4 text-white/50 cursor-pointer hover:text-white transition-colors" />
                            <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer group">
                                <div className="w-2/3 h-full bg-gold-400 rounded-full shadow-[0_0_5px_rgba(255,215,0,0.8)] group-hover:bg-neon-pink transition-colors"></div>
                            </div>
                        </div>
                    </div>

                    {/* Radio Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className="absolute top-14 left-1/2 -translate-x-1/2 w-48 bg-black/90 border border-white/20 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                            {RADIOS.map((radio) => (
                                <button
                                    key={radio.id}
                                    className={`w-full text-left px-4 py-3 text-sm font-bold transition-colors flex items-center gap-2 ${selectedRadio.id === radio.id ? 'bg-white/10 text-gold-400' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
                                    onClick={() => {
                                        setSelectedRadio(radio);
                                        setIsDropdownOpen(false);
                                        setIsPlaying(true);
                                    }}
                                >
                                    {selectedRadio.id === radio.id && <Radio className="w-3.5 h-3.5" />}
                                    <span className={selectedRadio.id !== radio.id ? 'ml-5' : ''}>{radio.name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Spot Işığı Yansıması */}
            <div className="absolute top-0 right-10 w-32 h-64 bg-neon-pink/10 blur-[50px] transform skew-x-12 z-0 pointer-events-none" />
        </GlassCard >
    );
}
