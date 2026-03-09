"use client";

import { useState } from "react";
import { X, Wand2, Shuffle, Check } from "lucide-react";

// --- Özellik Kategorileri ---
const SKIN_TONES = ["#FDDBB4", "#F5CBA7", "#E8A87C", "#C68642", "#8D5524", "#4A2912"];
const HAIR_STYLES = ["👧", "💇", "🧑", "👱", "🧔", "💆"];
const HAIR_COLORS = ["#2C1B0E", "#6B3A2A", "#C8A951", "#E8C887", "#FF6B6B", "#9B59B6", "#3498DB", "#FFFFFF"];
const EYE_COLORS = ["#4A3728", "#1E6B4A", "#1A5276", "#7D6608", "#6C3483"];
const ACCESSORIES = [
    { label: "Yok", icon: "✖️" },
    { label: "Güneş Gözlüğü", icon: "🕶️" },
    { label: "Çerçeveli Gözlük", icon: "👓" },
    { label: "Şapka", icon: "👑" },
    { label: "Kürpe", icon: "💎" },
];
const EXPRESSIONS = [
    { label: "Serin", icon: "😎" },
    { label: "Gizemli", icon: "😏" },
    { label: "Mutlu", icon: "😄" },
    { label: "Ciddi", icon: "😐" },
    { label: "Seksi", icon: "😍" },
];

interface AvatarBuilderProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (avatarDataUrl: string) => void;
}

export function AvatarBuilder({ isOpen, onClose, onSave }: AvatarBuilderProps) {
    const [skinTone, setSkinTone] = useState(SKIN_TONES[0]);
    const [hairStyle, setHairStyle] = useState(0);
    const [hairColor, setHairColor] = useState(HAIR_COLORS[0]);
    const [eyeColor, setEyeColor] = useState(EYE_COLORS[0]);
    const [accessory, setAccessory] = useState(0);
    const [expression, setExpression] = useState(0);

    if (!isOpen) return null;

    const randomize = () => {
        setSkinTone(SKIN_TONES[Math.floor(Math.random() * SKIN_TONES.length)]);
        setHairStyle(Math.floor(Math.random() * HAIR_STYLES.length));
        setHairColor(HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)]);
        setEyeColor(EYE_COLORS[Math.floor(Math.random() * EYE_COLORS.length)]);
        setAccessory(Math.floor(Math.random() * ACCESSORIES.length));
        setExpression(Math.floor(Math.random() * EXPRESSIONS.length));
    };

    // Generate a simple SVG/canvas-based avatar description for the preview
    const previewStyle = {
        background: `radial-gradient(circle at 50% 40%, ${skinTone} 45%, ${skinTone}88 90%)`,
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-gradient-to-br from-[#0d0818] to-black border border-white/10 rounded-3xl w-full max-w-2xl shadow-[0_0_60px_rgba(255,0,127,0.2)] overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <Wand2 className="w-6 h-6 text-neon-pink" />
                        <div>
                            <h2 className="text-xl font-black text-white tracking-wide">Avatarını Oluştur</h2>
                            <p className="text-xs text-white/40">Pavyon kimliğini kendin tasarla</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex flex-col md:flex-row">
                    {/* Left: Preview */}
                    <div className="w-full md:w-2/5 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/10 gap-4">
                        <div
                            className="w-40 h-40 rounded-full border-4 border-neon-pink shadow-[0_0_30px_rgba(255,0,127,0.4)] flex items-center justify-center relative overflow-hidden"
                            style={previewStyle}
                        >
                            {/* Stylized preview emoji + overlays */}
                            <div className="flex flex-col items-center">
                                <div className="text-5xl" style={{ filter: `drop-shadow(0 0 8px ${hairColor})` }}>
                                    {HAIR_STYLES[hairStyle]}
                                </div>
                                <div className="text-3xl -mt-2">{EXPRESSIONS[expression].icon}</div>
                                {accessory > 0 && <div className="text-2xl absolute top-2">{ACCESSORIES[accessory].icon}</div>}
                            </div>
                        </div>
                        <button
                            onClick={randomize}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/70 hover:text-white text-sm font-bold transition-all"
                        >
                            <Shuffle className="w-4 h-4" /> Rastgele
                        </button>
                    </div>

                    {/* Right: Controls */}
                    <div className="w-full md:w-3/5 p-6 flex flex-col gap-5 overflow-y-auto max-h-[60vh] md:max-h-none scrollbar-thin scrollbar-thumb-white/10">

                        {/* Ten Rengi */}
                        <div>
                            <label className="text-xs font-bold text-white/60 uppercase tracking-widest mb-2 block">Ten Rengi</label>
                            <div className="flex gap-2 flex-wrap">
                                {SKIN_TONES.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setSkinTone(s)}
                                        className={`w-8 h-8 rounded-full border-2 transition-all ${skinTone === s ? 'border-neon-pink scale-125' : 'border-white/10 hover:border-white/40'}`}
                                        style={{ backgroundColor: s }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Saç Stili */}
                        <div>
                            <label className="text-xs font-bold text-white/60 uppercase tracking-widest mb-2 block">Saç Stili</label>
                            <div className="flex gap-2 flex-wrap">
                                {HAIR_STYLES.map((h, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setHairStyle(i)}
                                        className={`w-10 h-10 rounded-xl text-2xl flex items-center justify-center border transition-all ${hairStyle === i ? 'border-neon-pink bg-neon-pink/10' : 'border-white/10 bg-white/5 hover:border-white/30'}`}
                                    >
                                        {h}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Saç Rengi */}
                        <div>
                            <label className="text-xs font-bold text-white/60 uppercase tracking-widest mb-2 block">Saç Rengi</label>
                            <div className="flex gap-2 flex-wrap">
                                {HAIR_COLORS.map((c) => (
                                    <button
                                        key={c}
                                        onClick={() => setHairColor(c)}
                                        className={`w-8 h-8 rounded-full border-2 transition-all ${hairColor === c ? 'border-white scale-125' : 'border-white/10'}`}
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Aksesuar */}
                        <div>
                            <label className="text-xs font-bold text-white/60 uppercase tracking-widest mb-2 block">Aksesuar</label>
                            <div className="flex gap-2 flex-wrap">
                                {ACCESSORIES.map((a, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setAccessory(i)}
                                        className={`px-3 py-1.5 rounded-xl text-sm border transition-all flex items-center gap-1.5 ${accessory === i ? 'border-neon-pink bg-neon-pink/10 text-white' : 'border-white/10 bg-white/5 text-white/60 hover:border-white/30'}`}
                                    >
                                        <span>{a.icon}</span> <span className="text-xs">{a.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* İfade */}
                        <div>
                            <label className="text-xs font-bold text-white/60 uppercase tracking-widest mb-2 block">İfade</label>
                            <div className="flex gap-2 flex-wrap">
                                {EXPRESSIONS.map((e, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setExpression(i)}
                                        className={`w-12 h-12 text-3xl rounded-xl border flex items-center justify-center transition-all ${expression === i ? 'border-neon-pink bg-neon-pink/10 scale-110' : 'border-white/10 bg-white/5 hover:border-white/30'}`}
                                        title={e.label}
                                    >
                                        {e.icon}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 flex justify-end gap-3">
                    <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/30 font-bold text-sm transition-all">
                        İptal
                    </button>
                    <button
                        onClick={() => {
                            // Create temporary canvas
                            const canvas = document.createElement('canvas');
                            canvas.width = 200;
                            canvas.height = 200;
                            const ctx = canvas.getContext('2d');
                            if (ctx) {
                                // Background
                                ctx.fillStyle = skinTone;
                                ctx.beginPath();
                                ctx.arc(100, 100, 90, 0, Math.PI * 2);
                                ctx.fill();

                                // Hair
                                ctx.font = "100px Arial";
                                ctx.textAlign = "center";
                                ctx.textBaseline = "middle";
                                ctx.fillText(HAIR_STYLES[hairStyle], 100, 80);

                                // Expression
                                ctx.font = "60px Arial";
                                ctx.fillText(EXPRESSIONS[expression].icon, 100, 120);

                                // Accessory
                                if (accessory > 0) {
                                    ctx.font = "50px Arial";
                                    ctx.fillText(ACCESSORIES[accessory].icon, 100, 50);
                                }

                                const dataUrl = canvas.toDataURL("image/png");
                                onSave(dataUrl);
                            }
                            onClose();
                        }}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-neon-pink to-purple-600 hover:opacity-90 text-white font-bold text-sm flex items-center gap-2 transition-opacity shadow-[0_0_20px_rgba(255,0,127,0.3)]"
                    >
                        <Check className="w-4 h-4" /> Bu Avatarı Kullan
                    </button>
                </div>
            </div>
        </div>
    );
}
