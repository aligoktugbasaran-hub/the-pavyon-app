import { useState, useRef } from "react";
import { useUserStore } from "@/store/useUserStore";
import { Settings, Users, LogOut, X, Edit2, Check, Camera as CameraIcon, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { Camera, CameraResultType } from "@capacitor/camera";
import { PublicProfileModal } from "@/components/pavyon/PublicProfileModal";

export function UserProfileMenu() {
    const { nickname, avatarUrl, logout, login, friends } = useUserStore();
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"menu" | "edit" | "friends">("menu");

    const [bio, setBio] = useState("Buraya kendin hakkında bir şeyler yaz...");
    const [interests, setInterests] = useState("Müzik, Sinema, Eğlence");
    const [isSaving, setIsSaving] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [selectedProfile, setSelectedProfile] = useState<{ id: string, name: string, avatar: string, age: number } | null>(null);

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    const pickImageNative = async () => {
        try {
            const image = await Camera.getPhoto({
                quality: 90,
                allowEditing: true,
                resultType: CameraResultType.Base64
            });
            if (image.base64String) {
                const dataUrl = `data:image/jpeg;base64,${image.base64String}`;
                login(nickname, dataUrl, "Gizli");
            }
        } catch (e) {
            fileInputRef.current?.click();
        }
    };

    const handleWebFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                login(nickname, reader.result as string, "Gizli");
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setActiveTab("menu");
        }, 800);
    };

    return (
        <div className="relative">
            {/* Trigger Avatar */}
            <button
                onClick={() => { setIsOpen(!isOpen); setActiveTab("menu"); }}
                className="flex items-center gap-3 hover:bg-white/5 p-1 pr-3 rounded-full transition-colors"
            >
                <img src={avatarUrl} alt={nickname} className="w-10 h-10 rounded-full border-2 border-gold-400 shadow-[0_0_10px_rgba(255,215,0,0.3)] object-cover" />
                <span className="font-bold text-lg text-white">{nickname}</span>
            </button>

            {/* Dropdown Modal */}
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

                    <div className="absolute top-14 left-0 w-80 bg-black/95 border border-white/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200 flex flex-col">

                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-neon-pink/20 to-transparent">
                            <h3 className="font-bold text-white">
                                {activeTab === "menu" && "Hesabım"}
                                {activeTab === "edit" && "Profili Düzenle"}
                                {activeTab === "friends" && "Arkadaşlarım"}
                            </h3>
                            {activeTab !== "menu" ? (
                                <button onClick={() => setActiveTab("menu")} className="text-xs text-white/50 hover:text-white transition-colors">Geri</button>
                            ) : (
                                <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Content Body */}
                        <div className="p-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">

                            {/* Main Menu */}
                            {activeTab === "menu" && (
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-4 mb-4 bg-white/5 p-3 rounded-xl border border-white/5">
                                        <img src={avatarUrl} alt={nickname} className="w-14 h-14 rounded-full border-2 border-neon-pink object-cover" />
                                        <div>
                                            <h4 className="font-bold text-lg text-white">{nickname}</h4>
                                            <p className="text-xs text-gold-400 font-bold uppercase tracking-widest">Sitede Çevrimiçi</p>
                                        </div>
                                    </div>

                                    <button onClick={() => setActiveTab("edit")} className="flex items-center gap-3 w-full p-3 text-left rounded-xl hover:bg-white/10 transition-colors text-white/80 hover:text-white group">
                                        <div className="bg-neon-pink/20 p-2 rounded-lg group-hover:bg-neon-pink/40 transition-colors">
                                            <Settings className="w-4 h-4 text-neon-pink" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm">Profili Düzenle</div>
                                            <div className="text-[10px] text-white/40">Fotağraf, bio, hakkında...</div>
                                        </div>
                                    </button>

                                    <button onClick={() => setActiveTab("friends")} className="flex items-center gap-3 w-full p-3 text-left rounded-xl hover:bg-white/10 transition-colors text-white/80 hover:text-white group">
                                        <div className="bg-purple-500/20 p-2 rounded-lg group-hover:bg-purple-500/40 transition-colors">
                                            <Users className="w-4 h-4 text-purple-400" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm">Arkadaşlarım</div>
                                            <div className="text-[10px] text-white/40">Sohbet ettiğin kişiler...</div>
                                        </div>
                                    </button>

                                    <div className="h-px w-full bg-white/10 my-2" />

                                    <button onClick={handleLogout} className="flex items-center gap-3 w-full p-3 text-left rounded-xl hover:bg-red-900/40 transition-colors text-red-400 hover:text-red-300 group">
                                        <LogOut className="w-4 h-4" />
                                        <span className="font-bold text-sm">Çıkış Yap</span>
                                    </button>
                                </div>
                            )}

                            {/* Edit Profile Tab */}
                            {activeTab === "edit" && (
                                <div className="flex flex-col gap-4">
                                    <div className="flex justify-center mb-2 relative group">
                                        <div className="relative cursor-pointer" onClick={pickImageNative}>
                                            <img src={avatarUrl} alt={nickname} className="w-20 h-20 rounded-full border-2 border-neon-pink object-cover group-hover:opacity-70 transition-opacity" />
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-full">
                                                <CameraIcon className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleWebFileUpload}
                                        />
                                    </div>

                                    <button onClick={() => setActiveTab("edit")} className="flex items-center gap-3 w-full p-3 text-left rounded-xl hover:bg-white/10 transition-colors text-white/80 hover:text-white group">
                                        <div className="bg-neon-pink/20 p-2 rounded-lg group-hover:bg-neon-pink/40 transition-colors">
                                            <Settings className="w-4 h-4 text-neon-pink" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm">Profili Düzenle</div>
                                            <div className="text-[10px] text-white/40">İlgi alanları, bio, hakkında...</div>
                                        </div>
                                    </button>

                                    <button onClick={() => setActiveTab("friends")} className="flex items-center gap-3 w-full p-3 text-left rounded-xl hover:bg-white/10 transition-colors text-white/80 hover:text-white group">
                                        <div className="bg-purple-500/20 p-2 rounded-lg group-hover:bg-purple-500/40 transition-colors">
                                            <Users className="w-4 h-4 text-purple-400" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm">Arkadaşlarım</div>
                                            <div className="text-[10px] text-white/40">Sohbet ettiğin kişiler...</div>
                                        </div>
                                    </button>

                                    <div className="h-px w-full bg-white/10 my-2" />

                                    <button onClick={handleLogout} className="flex items-center gap-3 w-full p-3 text-left rounded-xl hover:bg-red-900/40 transition-colors text-red-400 hover:text-red-300 group">
                                        <LogOut className="w-4 h-4" />
                                        <span className="font-bold text-sm">Çıkış Yap</span>
                                    </button>
                                </div>
                            )}

                            {/* Edit Profile Tab */}
                            {activeTab === "edit" && (
                                <div className="flex flex-col gap-4">
                                    <div className="flex justify-center mb-2 relative">
                                        <img src={avatarUrl} alt={nickname} className="w-20 h-20 rounded-full border-2 border-dashed border-white/30 p-1 opacity-80" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <label className="bg-black/80 p-2 rounded-full cursor-pointer hover:bg-neon-pink transition-colors">
                                                <Edit2 className="w-4 h-4 text-white" />
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-white/60 mb-1">Rumuz</label>
                                        <input type="text" value={nickname} disabled className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/50 cursor-not-allowed" />
                                        <p className="text-[9px] text-white/40 mt-1">Rumuz değiştirilemez.</p>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-white/60 mb-1">Biyografi</label>
                                        <textarea
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            rows={2}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-neon-pink/50 transition-colors resize-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-white/60 mb-1">İlgi Alanları (Virgülle ayırın)</label>
                                        <input
                                            type="text"
                                            value={interests}
                                            onChange={(e) => setInterests(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-neon-pink/50 transition-colors"
                                        />
                                    </div>

                                    <button
                                        onClick={handleSaveProfile}
                                        disabled={isSaving}
                                        className="w-full mt-2 bg-gradient-to-r from-neon-pink to-purple-600 hover:from-neon-pink/80 hover:to-purple-600/80 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all"
                                    >
                                        {isSaving ? (
                                            <span className="animate-pulse">Kaydediliyor...</span>
                                        ) : (
                                            <><Check className="w-4 h-4" /> Kaydet</>
                                        )}
                                    </button>
                                </div>
                            )}

                            {/* Friends Tab */}
                            {activeTab === "friends" && (
                                <div className="flex flex-col gap-3">
                                    {friends.length > 0 ? (
                                        friends.map(friend => (
                                            <div key={friend.id} onClick={() => setSelectedProfile({ id: friend.id, name: friend.name, avatar: friend.avatar, age: 25 })} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors cursor-pointer group">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative">
                                                        <img src={friend.avatar} alt={friend.name} className="w-10 h-10 rounded-full border border-white/20 object-cover" />
                                                        <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black bg-green-500"></div>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-sm text-white">{friend.name}</div>
                                                        <div className="text-[10px] text-white/40">Çevrimiçi</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-6 text-white/40 text-sm">
                                            Henüz hiç arkadaşınız yok.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
            <PublicProfileModal
                isOpen={!!selectedProfile}
                onClose={() => setSelectedProfile(null)}
                user={selectedProfile}
            />
        </div>
    );
}
