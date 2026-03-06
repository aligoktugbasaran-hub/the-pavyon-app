"use client";

import React, { useState } from 'react';
import { Upload, Mail, Lock, User as UserIcon, CheckCircle2, Wand2 } from 'lucide-react';
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { AvatarBuilder } from "@/components/pavyon/AvatarBuilder";

export default function PavyonAuthPage() {
    const router = useRouter();
    const login = useUserStore((state) => state.login);

    const [step, setStep] = useState(1);
    const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isAvatarBuilderOpen, setIsAvatarBuilderOpen] = useState(false);

    // Avatar listesi: Pavyon kültürüne daha uygun, gerçekçi ve iddialı görseller (Neon/Makyajlı/Ağır Abi/Gece Kulübü hissi)
    const avatars = [
        // Kadınlar (İddialı, gece makyajlı, dekolte/neon ışıklı vb. vibe)
        "/avatars/female_avatar_1.png", // Neon Işıklı
        "/avatars/female_avatar_2.png", // Siyah, iddialı
        "/avatars/female_avatar_3.png", // Ağır makyajlı
        "/avatars/female_avatar_4.png", // Model, dik bakış
        "/avatars/female_avatar_5.png", // Parti/Gece kızı
        "/avatars/female_avatar_6.png", // Renkli saçlı, abartılı

        // Erkekler (Ağır abi, ceketli, karanlık, maço vibe)
        "/avatars/male_avatar_1.png", // Karanlık, ciddi
        "/avatars/male_avatar_2.png", // Takım elbiseli, sert abi
        "/avatars/male_avatar_3.png", // Maço stil
        "/avatars/male_avatar_4.png", // Özgüvenli patron
        "/avatars/male_avatar_5.png", // Sakallı ağır takılan
        "/avatars/male_avatar_6.png"  // Gözlüklü gece kulübü mafyası
    ];

    const handleJoin = () => {
        // For now we just use the selected avatar and nickname to login locally
        const avatarUrl = selectedAvatar !== null ? avatars[selectedAvatar] : avatars[0];
        login(nickname || "Anonim", avatarUrl, "Gizli");
        router.push("/pavyon");
    };

    return (
        <div className="min-h-screen bg-[#0a0510] relative overflow-hidden flex flex-col items-center justify-center p-4 font-sans text-white" style={{ backgroundColor: '#0a0510', color: 'white' }}>
            {/* Arka plan ışık efektleri (Glow) */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ff007f] rounded-full mix-blend-screen filter blur-[150px] opacity-20 animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#ffd700] rounded-full mix-blend-screen filter blur-[150px] opacity-10"></div>

            {/* Tabela / Logo Alanı */}
            <div className="z-10 flex flex-col items-center mb-8">
                <img
                    // Yeni üretilen lüks pavyon logosu
                    src="/logo.png"
                    alt="The Pavyon Icon"
                    className="w-40 h-40 md:w-56 md:h-56 object-contain drop-shadow-[0_0_20px_rgba(255,215,0,0.6)] mb-2 mix-blend-lighten"
                    style={{
                        width: '160px',
                        height: '160px',
                        WebkitMaskImage: 'radial-gradient(circle, black 40%, transparent 75%)',
                        maskImage: 'radial-gradient(circle, black 40%, transparent 75%)'
                    }}
                />
                <p className="text-[#ff007f] mt-2 tracking-widest text-sm uppercase opacity-80 shadow-black drop-shadow-lg">
                    Gerçek kimliğini kapıda bırak
                </p>
            </div>

            {/* Cam Görünümlü Kart (Glassmorphism) */}
            <div className="z-10 w-full max-w-xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-[0_0_40px_rgba(255,0,127,0.15)] relative">

                {/* Step 1: Hesap Bilgileri */}
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-2xl font-semibold text-white/90 mb-4 text-center">Masaya Rezerve Yap</h2>

                        <div className="space-y-4">
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Gizli E-Posta Adresin (İsteğe Bağlı)"
                                    className="w-full bg-black/40 border border-[#ff007f]/30 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff007f] focus:ring-1 focus:ring-[#ff007f] transition-all"
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Şifren (En az 6 hane) (İsteğe Bağlı)"
                                    className="w-full bg-black/40 border border-[#ff007f]/30 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff007f] focus:ring-1 focus:ring-[#ff007f] transition-all"
                                />
                            </div>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    placeholder="Pavyon Lakabın (Zorunlu)"
                                    required
                                    className="w-full bg-black/40 border border-yellow-500/40 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
                                />
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                if (nickname.trim() === "") {
                                    alert("Lütfen bir lakap giriniz!");
                                } else {
                                    setStep(2);
                                }
                            }}
                            disabled={nickname.trim() === ""}
                            className={`w-full mt-6 py-3 px-6 rounded-xl font-bold transition-all transform flex items-center justify-center gap-2 ${nickname.trim() === "" ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-[#ff007f] to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white shadow-[0_0_20px_rgba(255,0,127,0.4)] hover:scale-[1.02]'}`}
                            style={nickname.trim() === "" ? { backgroundColor: '#374151' } : { background: 'linear-gradient(to right, #ff007f, #7e22ce)' }}
                        >
                            Karakterimi Seç
                        </button>
                    </div>
                )}

                {/* Step 2: Avatar ve Fotoğraf Yükleme */}
                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="flex justify-between items-center mb-2">
                            <button onClick={() => setStep(1)} className="text-gray-400 hover:text-white text-sm">Geri</button>
                            <h2 className="text-xl font-semibold text-center text-yellow-500">Görünümünü Belirle</h2>
                            <div className="w-8"></div>
                        </div>

                        {/* Avatar Grid */}
                        <div>
                            <p className="text-sm text-gray-400 mb-3 text-center">Seni yansıtacak bir avatar seç...</p>
                            <div className="grid grid-cols-4 md:grid-cols-6 gap-3 max-h-48 overflow-y-auto p-1 rounded-xl scrollbar-thin scrollbar-thumb-[#ff007f]/50">
                                {avatars.map((avatar, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setSelectedAvatar(idx)}
                                        className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${selectedAvatar === idx ? 'border-yellow-400 shadow-[0_0_15px_rgba(255,215,0,0.6)] scale-110 relative z-10' : 'border-transparent hover:border-white/20'}`}
                                    >
                                        <img src={avatar} alt={`Avatar ${idx}`} className="w-full h-full object-cover aspect-square bg-black/50" />
                                        {selectedAvatar === idx && (
                                            <div className="absolute top-1 right-1 bg-black rounded-full text-yellow-400">
                                                <CheckCircle2 className="w-4 h-4" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Avatarını Oluştur Butonu */}
                        <button
                            type="button"
                            onClick={() => setIsAvatarBuilderOpen(true)}
                            className="w-full mt-3 flex items-center justify-center gap-2 py-3 px-4 bg-purple-900/30 border border-purple-500/40 hover:border-purple-400 hover:bg-purple-900/50 rounded-xl text-purple-300 hover:text-white font-bold text-sm transition-all"
                        >
                            <Wand2 className="w-4 h-4" />
                            Ya da Kendi Avatárını Oluştur
                        </button>

                        {/* Gerçek Fotoğraf Yükleme */}
                        <div className="pt-4 border-t border-white/10">
                            <p className="text-sm text-gray-300 mb-3 text-center">...ya da en fazla 2 gerçek fotoğrafını yükle</p>
                            <div className="flex gap-4 justify-center">
                                {/* Slot 1 */}
                                <label className="flex flex-col items-center justify-center w-28 h-32 border-2 border-dashed border-[#ff007f]/40 rounded-2xl bg-black/30 hover:bg-[#ff007f]/10 cursor-pointer transition-all group">
                                    <Upload className="w-6 h-6 text-[#ff007f] mb-2 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs text-gray-400">Fotoğraf 1</span>
                                    <input type="file" className="hidden" accept="image/*" />
                                </label>
                                {/* Slot 2 */}
                                <label className="flex flex-col items-center justify-center w-28 h-32 border-2 border-dashed border-[#ff007f]/40 rounded-2xl bg-black/30 hover:bg-[#ff007f]/10 cursor-pointer transition-all group">
                                    <Upload className="w-6 h-6 text-[#ff007f] mb-2 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs text-gray-400">Fotoğraf 2</span>
                                    <input type="file" className="hidden" accept="image/*" />
                                </label>
                            </div>
                        </div>

                        <button
                            onClick={handleJoin}
                            className="w-full mt-6 bg-gradient-to-r from-yellow-600 to-yellow-400 hover:from-yellow-500 hover:to-yellow-300 text-black font-bold py-3 px-6 rounded-xl shadow-[0_0_20px_rgba(255,215,0,0.4)] transition-all transform hover:scale-[1.02]"
                        >
                            Masaya Geç (İçeri Gir)
                        </button>
                    </div>
                )}

            </div>

            {/* Avatar Oluşturucu Modal */}
            <AvatarBuilder
                isOpen={isAvatarBuilderOpen}
                onClose={() => setIsAvatarBuilderOpen(false)}
                onSave={(avatarDataUrl) => {
                    setSelectedAvatar(-1);
                }}
            />
        </div>
    );
}
