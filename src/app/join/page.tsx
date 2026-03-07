"use client";

import React, { useState } from 'react';
import { Upload, Mail, Lock, User as UserIcon, CheckCircle2, Wand2, Sparkles } from 'lucide-react';
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
    const [verificationCode, setVerificationCode] = useState("");
    const [isPrivacyAccepted, setIsPrivacyAccepted] = useState(false);

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
        if (!nickname.trim()) {
            setStep(1);
            return;
        }
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

                        <div className="space-y-3">
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Gizli E-Posta (İsteğe Bağlı)"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-neon-pink/50 transition-all"
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Şifren (En az 6 hane)"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-neon-pink/50 transition-all"
                                />
                            </div>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-500/40" />
                                <input
                                    type="text"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    placeholder="Pavyon Lakabın (Zorunlu)"
                                    required
                                    className="w-full bg-black/40 border border-yellow-500/20 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-yellow-500/50 transition-all"
                                />
                            </div>
                        </div>

                        <div className="bg-black/40 border border-white/5 p-4 rounded-xl mb-4">
                            <div className="flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    id="privacy"
                                    checked={isPrivacyAccepted}
                                    onChange={(e) => setIsPrivacyAccepted(e.target.checked)}
                                    className="mt-1 w-4 h-4 accent-neon-pink"
                                />
                                <label htmlFor="privacy" className="text-[10px] text-white/50 leading-relaxed font-medium">
                                    <span className="text-neon-pink font-bold">SORUMLULUK REDDİ:</span> Paylaştığınız kişisel bilgilerin (isim, soyisim, fotoğraf vb.) sorumluluğu tamamen size aittir. The Pavyon yönetimi bu bilgilerin üçüncü kişilerce kullanımından sorumlu tutulamaz.
                                </label>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                if (nickname.trim() === "") {
                                    alert("Lütfen bir lakap giriniz!");
                                } else if (!isPrivacyAccepted) {
                                    alert("Lütfen sorumluluk reddini kabul ediniz!");
                                } else {
                                    setStep(email ? 1.5 : 2);
                                }
                            }}
                            disabled={nickname.trim() === "" || !isPrivacyAccepted}
                            className={`w-full mt-4 py-4 px-6 rounded-2xl font-black transition-all transform flex items-center justify-center gap-2 uppercase tracking-widest text-xs ${nickname.trim() === "" || !isPrivacyAccepted ? 'bg-white/5 text-white/20 cursor-not-allowed opacity-50' : 'bg-gradient-to-r from-[#ff007f] to-purple-600 text-white shadow-[0_10px_25px_rgba(255,0,127,0.3)] active:scale-95'}`}
                        >
                            <Sparkles className="w-4 h-4" /> Devam Et
                        </button>
                    </div>
                )}

                {/* Step 1.5: E-Posta Doğrulama (Simüle) */}
                {step === 1.5 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 text-center">
                        <div className="w-16 h-16 bg-neon-pink/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-neon-pink/30">
                            <Mail className="w-8 h-8 text-neon-pink" />
                        </div>
                        <h2 className="text-xl font-bold text-white">E-Postanı Doğrula</h2>
                        <p className="text-sm text-white/50">
                            <span className="text-white font-medium">{email}</span> adresine bir onay kodu gönderdik. Lütfen aşağıdaki alana girin.
                        </p>

                        <div className="flex justify-center gap-2">
                            <input
                                type="text"
                                maxLength={6}
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                                placeholder="000000"
                                className="w-48 bg-black/40 border border-white/10 rounded-xl py-4 text-center text-2xl font-black tracking-[0.5em] text-white focus:outline-none focus:border-neon-pink/50 transition-all"
                            />
                        </div>

                        <button
                            onClick={() => {
                                if (verificationCode.length === 6) {
                                    setStep(2);
                                } else {
                                    alert("Lütfen 6 haneli doğrulama kodunu girin (Simülasyon için herhangi bir 6 hane)");
                                }
                            }}
                            className="w-full bg-neon-pink text-white font-black py-4 rounded-2xl shadow-[0_10px_25px_rgba(255,0,127,0.3)] uppercase tracking-widest text-xs active:scale-95 transition-all"
                        >
                            Doğrula ve Karakter Seç
                        </button>

                        <button onClick={() => setStep(1)} className="text-xs text-white/30 hover:text-neon-pink transition-colors uppercase font-bold tracking-widest pt-2">E-Postayı Değiştir</button>
                    </div>
                )}

                {/* Step 2: Avatar ve Fotoğraf Yükleme */}
                {step === 2 && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="flex justify-between items-center mb-1">
                            <button onClick={() => setStep(1)} className="text-white/40 hover:text-white text-[10px] font-bold uppercase tracking-widest border border-white/10 px-3 py-1 rounded-lg">Geri</button>
                            <h2 className="text-lg font-bold text-center text-yellow-500 uppercase tracking-tighter">Görünümünü Seç</h2>
                            <div className="w-12"></div>
                        </div>

                        {/* Avatar Grid */}
                        <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
                            <p className="text-[10px] text-white/30 mb-3 text-center uppercase font-black tracking-widest">Seni yansıtacak bir avatar seç...</p>
                            <div className="grid grid-cols-5 gap-2 max-h-36 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-neon-pink/50">
                                {avatars.map((avatar, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setSelectedAvatar(idx)}
                                        className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all aspect-square ${selectedAvatar === idx ? 'border-neon-pink shadow-[0_0_15px_rgba(255,0,127,0.4)] scale-105 active:scale-95' : 'border-white/5 hover:border-white/20'}`}
                                    >
                                        <img src={avatar} alt={`Avatar ${idx}`} className="w-full h-full object-cover bg-black/50" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Gerçek Fotoğraf Yükleme */}
                        <div className="pt-2">
                            <p className="text-[10px] text-white/30 mb-2 text-center uppercase font-black tracking-widest">veya gerçek fotoğrafını yükle</p>
                            <div className="flex gap-3 justify-center">
                                <label className="flex flex-col items-center justify-center w-20 h-24 border-2 border-dashed border-white/10 rounded-xl bg-black/30 hover:bg-neon-pink/10 cursor-pointer transition-all active:scale-95">
                                    <Upload className="w-5 h-5 text-neon-pink mb-1" />
                                    <span className="text-[8px] text-white/40 uppercase font-black">Yükle</span>
                                    <input type="file" className="hidden" accept="image/*" />
                                </label>
                                <label className="flex flex-col items-center justify-center w-20 h-24 border-2 border-dashed border-white/10 rounded-xl bg-black/30 hover:bg-neon-pink/10 cursor-pointer transition-all active:scale-95">
                                    <Upload className="w-5 h-5 text-neon-pink mb-1" />
                                    <span className="text-[8px] text-white/40 uppercase font-black">Yükle</span>
                                    <input type="file" className="hidden" accept="image/*" />
                                </label>
                            </div>
                        </div>

                        <button
                            onClick={handleJoin}
                            className="w-full mt-4 bg-gradient-to-r from-neon-pink to-purple-700 hover:from-pink-500 hover:to-purple-600 text-white font-black py-3.5 px-6 rounded-2xl shadow-[0_10px_30px_rgba(255,0,127,0.3)] transition-all transform active:scale-[0.98] text-sm uppercase tracking-widest"
                        >
                            Masaya Geç
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
