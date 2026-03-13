"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Upload, Mail, Lock, User as UserIcon, CheckCircle2, Wand2, Sparkles, X, Camera as CameraIcon } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { AvatarBuilder } from "@/components/pavyon/AvatarBuilder";
import { Camera, CameraResultType } from '@capacitor/camera';
import { fetchWithBase } from "@/lib/api";
import { PavyonToast } from "@/components/pavyon/PavyonToast";

export default function PavyonAuthPage() {
    const router = useRouter();
    const login = useUserStore((state) => state.login);

    const [step, setStep] = useState(1);
    const [selectedAvatar, setSelectedAvatar] = useState<number | null>(0);
    const [customAvatar, setCustomAvatar] = useState<string | null>(null);
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isAvatarBuilderOpen, setIsAvatarBuilderOpen] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [isPrivacyAccepted, setIsPrivacyAccepted] = useState(false);
    const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
    const [nicknameError, setNicknameError] = useState("");
    const [isCheckingNickname, setIsCheckingNickname] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const showToast = useUserStore((state) => state.showToast);

    // If email is provided, check if user exists and auto-fill nickname
    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (email && /^\S+@\S+\.\S+$/.test(email)) {
                try {
                    const res = await fetchWithBase(`/api/auth?email=${encodeURIComponent(email)}`);
                    if (res.user) {
                        setNickname(res.user.nickname);
                        if (res.user.avatar) {
                            setCustomAvatar(res.user.avatar);
                            setSelectedAvatar(-1);
                        }
                    }
                } catch (e) {
                    console.log("No existing user found for this email");
                }
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [email]);

    // Check if nickname is taken
    useEffect(() => {
        const checkNickname = async () => {
            if (nickname.trim().length < 3) {
                setNicknameError("");
                return;
            };
            setIsCheckingNickname(true);
            try {
                const res = await fetchWithBase(`/api/auth?nickname=${encodeURIComponent(nickname.trim())}`);
                if (res.isTaken) {
                    // Check if the taken nickname belongs to THIS email if email is provided
                    const existingRes = await fetchWithBase(`/api/auth?email=${encodeURIComponent(email)}`);
                    if (existingRes.user && existingRes.user.nickname === nickname.trim()) {
                        setNicknameError("");
                    } else {
                        setNicknameError("Bu lakabı başkası kapmış, başka bir tane bul bakalım!");
                    }
                } else {
                    setNicknameError("");
                }
            } catch (e) {
                console.error("Nickname check failed", e);
            } finally {
                setIsCheckingNickname(false);
            }
        };

        const timeoutId = setTimeout(checkNickname, 500);
        return () => clearTimeout(timeoutId);
    }, [nickname, email]);

    useEffect(() => {
        avatars.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }, []);

    // Avatar listesi: Pavyon kültürüne daha uygun
    const avatars = [
        "/avatars/female_avatar_1.png",
        "/avatars/female_avatar_2.png",
        "/avatars/female_avatar_3.png",
        "/avatars/female_avatar_4.png",
        "/avatars/female_avatar_5.png",
        "/avatars/female_avatar_6.png",
        "/avatars/male_avatar_1.png",
        "/avatars/male_avatar_2.png",
        "/avatars/male_avatar_3.png",
        "/avatars/male_avatar_4.png",
        "/avatars/male_avatar_5.png",
        "/avatars/male_avatar_6.png"
    ];

    const pickImageNative = async () => {
        const isNative = typeof window !== "undefined" &&
            ((window as any).Capacitor?.isNativePlatform?.() === true);
        if (!isNative) {
            fileInputRef.current?.click();
            return;
        }
        try {
            const image = await Camera.getPhoto({
                quality: 90,
                allowEditing: true,
                resultType: CameraResultType.Base64
            });
            if (image.base64String) {
                const dataUrl = `data:image/jpeg;base64,${image.base64String}`;
                setUploadedPhotos(prev => [dataUrl, ...prev].slice(0, 2));
                setCustomAvatar(dataUrl);
                setSelectedAvatar(-1);
            }
        } catch (e) {
            console.log("User cancelled camera or error", e);
            fileInputRef.current?.click();
        }
    };

    const handleWebFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const dataUrl = reader.result as string;
                setUploadedPhotos(prev => [dataUrl, ...prev].slice(0, 2));
                setCustomAvatar(dataUrl);
                setSelectedAvatar(-1);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleJoin = async () => {
        if (!nickname.trim()) {
            setStep(1);
            return;
        }

        // Final avatar logic
        let finalAvatar = "";
        if (customAvatar) {
            finalAvatar = customAvatar;
        } else if (selectedAvatar !== null && selectedAvatar >= 0) {
            finalAvatar = avatars[selectedAvatar];
        } else {
            finalAvatar = avatars[0];
        }

        try {
            // Persist to DB or Auth logic
            const res = await fetchWithBase("/api/auth", {
                method: "POST",
                body: JSON.stringify({ email, nickname, avatar: finalAvatar })
            });

            // Sync with local store
            login(res.nickname, res.avatar || finalAvatar, "Gizli", res.id);
            router.push("/pavyon");
        } catch (e: any) {
            console.error("Android join error:", e);
            // fetchWithBase zaten hata fırlatıyor, içindeki mesajı gösterelim
            showToast(e.message || "Kapıdaki fedailer bir sorun çıkardı, mekana giriş yapamıyoruz!", "error");
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0510] relative overflow-hidden flex flex-col items-center justify-center p-4 font-sans text-white" style={{ backgroundColor: '#0a0510', color: 'white' }}>
            {/* Pavyon Toast System */}
            <PavyonToast />

            {/* Arka plan ışık efektleri (Glow) */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ff007f] rounded-full mix-blend-screen filter blur-[150px] opacity-20 animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#ffd700] rounded-full mix-blend-screen filter blur-[150px] opacity-10"></div>

            {/* Unified Premium Logo */}
            <div className="z-10 flex flex-col items-center mb-8">
                <motion.div
                    animate={{
                        scale: [1, 1.05, 1],
                        filter: [
                            "drop-shadow(0 0 15px rgba(255,215,0,0.3))",
                            "drop-shadow(0 0 30px rgba(255,215,0,0.5))",
                            "drop-shadow(0 0 15px rgba(255,215,0,0.3))"
                        ]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                >
                    <img
                        src="/logo.png"
                        alt="The Pavyon Original Logo"
                        className="w-40 h-40 md:w-56 md:h-56 object-contain"
                        style={{ filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.8))' }}
                    />
                </motion.div>
                <p className="text-[#ff007f] mt-2 tracking-widest text-sm uppercase opacity-80 shadow-black drop-shadow-lg font-black text-center">
                    Gerçek kimliğini kapıda bırak <br /> <span className="text-[10px] text-white/40 font-normal">Gecenin yıldızı olmaya hazır mısın?</span>
                </p>
            </div>

            {/* Cam Görünümlü Kart */}
            <div className="z-10 w-full max-w-xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-[0_0_40px_rgba(255,0,127,0.15)] relative">

                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-white/90 mb-1">Masaya Rezerve Yap</h2>
                            <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">Takma adınla hemen içeri gir</p>
                        </div>

                        <div className="space-y-3">
                            <div className="relative">
                                <UserIcon className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${nicknameError ? 'text-red-500' : 'text-yellow-500/40'}`} />
                                <input
                                    type="text"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    placeholder="Pavyon Lakabın (Zorunlu)"
                                    required
                                    className={`w-full bg-black/40 border ${nicknameError ? 'border-red-500/50' : 'border-yellow-500/20'} rounded-xl py-3 pl-11 pr-10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-yellow-500/50 transition-all font-bold`}
                                />
                                {isCheckingNickname && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <div className="w-4 h-4 border-2 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin" />
                                    </div>
                                )}
                            </div>
                            {nicknameError && (
                                <p className="text-[10px] text-red-500 font-bold px-1 animate-in fade-in slide-in-from-top-1">
                                    {nicknameError}
                                </p>
                            )}

                            <div className="relative pt-2">
                                <p className="text-[10px] text-white/30 mb-2 uppercase font-black px-1">Hesabını Korumak İster misin? (Opsiyonel)</p>
                                <div className="space-y-2">
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Gizli E-Posta (Yedekleme İçin)"
                                            className="w-full bg-black/20 border border-white/5 rounded-xl py-2.5 pl-11 pr-4 text-xs text-white placeholder-white/10 focus:outline-none focus:border-neon-pink/30 transition-all"
                                        />
                                    </div>
                                    {email && (
                                        <div className="relative animate-in slide-in-from-top-2 duration-300">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Şifreni Belirle"
                                                className="w-full bg-black/20 border border-white/5 rounded-xl py-2.5 pl-11 pr-4 text-xs text-white placeholder-white/10 focus:outline-none focus:border-neon-pink/30 transition-all"
                                            />
                                        </div>
                                    )}
                                </div>
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
                                <label htmlFor="privacy" className="text-[10px] text-white/50 leading-relaxed font-bold">
                                    <span className="text-neon-pink uppercase">Sorumluluk Reddi:</span> Paylaştığınız kişisel bilgilerin sorumluluğu tamamen size aittir. The Pavyon yönetimi sorumlu tutulamaz.
                                </label>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                if (nickname.trim() === "") {
                                    showToast("Lütfen bir lakap giriniz!", "info");
                                } else if (nicknameError) {
                                    showToast(nicknameError, "error");
                                } else if (!isPrivacyAccepted) {
                                    showToast("Lütfen sorumluluk reddini kabul ediniz!", "info");
                                } else {
                                    // Sadece lakap varsa veya henüz onay sistemi aktif olmadığı için direkt karakter seçimine geç
                                    setStep(2);
                                }
                            }}
                            disabled={nickname.trim() === "" || !isPrivacyAccepted || !!nicknameError || isCheckingNickname}
                            className={`w-full mt-4 py-4 px-6 rounded-2xl font-black transition-all transform flex flex-col items-center justify-center gap-1 uppercase tracking-widest ${nickname.trim() === "" || !isPrivacyAccepted || !!nicknameError || isCheckingNickname ? 'bg-white/5 text-white/20 cursor-not-allowed opacity-50' : 'bg-gradient-to-r from-[#ff007f] to-purple-600 text-white shadow-[0_10px_25px_rgba(255,0,127,0.3)] active:scale-95'}`}
                        >
                            <span className="text-xs flex items-center gap-2">
                                <Sparkles className="w-4 h-4" /> Masaya Geç
                            </span>
                            {!email && <span className="text-[8px] opacity-60">Üye Olmadan Katıl</span>}
                        </button>
                    </div>
                )}

                {step === 1.5 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 text-center">
                        <div className="w-16 h-16 bg-neon-pink/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-neon-pink/30">
                            <Mail className="w-8 h-8 text-neon-pink" />
                        </div>
                        <h2 className="text-xl font-bold text-white">E-Postanı Doğrula</h2>
                        <p className="text-sm text-white/50">
                            <span className="text-white font-medium">{email}</span> adresine bir onay kodu gönderdik.
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
                                    showToast("Kodun eksik gibi görünüyor, tekrar kontrol eder misin?", "error");
                                }
                            }}
                            className="w-full bg-neon-pink text-white font-black py-4 rounded-2xl shadow-[0_10px_25px_rgba(255,0,127,0.3)] uppercase tracking-widest text-xs active:scale-95 transition-all"
                        >
                            Doğrula ve Karakter Seç
                        </button>

                        <button onClick={() => setStep(1)} className="text-xs text-white/30 hover:text-neon-pink transition-colors uppercase font-bold tracking-widest pt-2">E-Postayı Değiştir</button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="flex justify-between items-center mb-1">
                            <button onClick={() => setStep(1)} className="text-white/40 hover:text-white text-[10px] font-bold uppercase tracking-widest border border-white/10 px-3 py-1 rounded-lg">Geri</button>
                            <h2 className="text-lg font-bold text-center text-yellow-500 uppercase tracking-tighter">Profilini Belirle</h2>
                            <div className="w-12"></div>
                        </div>

                        {/* Custom Avatar / Photo Preview */}
                        {customAvatar && (
                            <div className="flex flex-col items-center gap-2 animate-in zoom-in-50 duration-300">
                                <div className="relative group">
                                    <img src={customAvatar} className="w-24 h-24 rounded-full border-4 border-neon-pink shadow-[0_0_20px_rgba(255,0,127,0.5)] object-cover bg-black" />
                                    <button
                                        onClick={() => { setCustomAvatar(null); setSelectedAvatar(0); }}
                                        className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1 text-white shadow-lg"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <span className="text-[10px] text-white/50 uppercase font-black tracking-widest">Senin Seçimin</span>
                            </div>
                        )}

                        {/* Avatar Grid */}
                        <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
                            <div className="flex justify-between items-center mb-3">
                                <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">Hazır Avatarlar...</p>
                                <button
                                    onClick={() => setIsAvatarBuilderOpen(true)}
                                    className="text-[10px] text-neon-pink font-black uppercase flex items-center gap-1 hover:scale-105 transition-all active:scale-95"
                                >
                                    <Wand2 className="w-3 h-3" /> Avatar Tasarla
                                </button>
                            </div>
                            <div className="grid grid-cols-4 gap-2 max-h-36 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-neon-pink/50">
                                {avatars.map((avatar, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => { setSelectedAvatar(idx); setCustomAvatar(null); }}
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
                            <div className="flex gap-4 justify-center">
                                <div
                                    onClick={pickImageNative}
                                    className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-white/10 rounded-2xl bg-black/30 hover:border-neon-pink/40 hover:bg-neon-pink/10 cursor-pointer transition-all active:scale-95 group"
                                >
                                    <CameraIcon className="w-6 h-6 text-neon-pink mb-1 group-hover:scale-110 transition-transform" />
                                    <span className="text-[8px] text-white/40 uppercase font-black">Foto Çek</span>
                                </div>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-white/10 rounded-2xl bg-black/30 hover:border-gold-500/40 hover:bg-gold-500/10 cursor-pointer transition-all active:scale-95 group"
                                >
                                    <Upload className="w-6 h-6 text-gold-500 mb-1 group-hover:scale-110 transition-transform" />
                                    <span className="text-[8px] text-white/40 uppercase font-black">Dosya Seç</span>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleWebFileUpload}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleJoin}
                            className="w-full mt-4 bg-gradient-to-r from-neon-pink to-purple-700 hover:from-pink-500 hover:to-purple-600 text-white font-black py-4 px-6 rounded-2xl shadow-[0_10px_30px_rgba(255,0,127,0.3)] transition-all transform active:scale-95 text-sm uppercase tracking-[0.2em]"
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
                onSave={(dataUrl) => {
                    setCustomAvatar(dataUrl);
                    setSelectedAvatar(-1);
                }}
            />
        </div>
    );
}
