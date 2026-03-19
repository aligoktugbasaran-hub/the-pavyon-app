"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { TopReceivers } from "@/components/pavyon/TopReceivers";
import { LiveRadio } from "@/components/pavyon/LiveRadio";
import { GlobalChat } from "@/components/pavyon/GlobalChat";
import { SeatLayout } from "@/components/pavyon/SeatLayout";
import { GiftPanel } from "@/components/pavyon/GiftPanel";
import { UserProfileMenu } from "@/components/pavyon/UserProfileMenu";
import { NotificationMenu } from "@/components/pavyon/NotificationMenu";
import { PublicProfileModal } from "@/components/pavyon/PublicProfileModal";
import { CreditModal } from "@/components/pavyon/CreditModal";
import { MessageSquare, Trophy, Sparkles, X } from "lucide-react";
import { fetchWithBase } from "@/lib/api";
import { PavyonToast } from "@/components/pavyon/PavyonToast";

export default function PavyonPage() {
    const { isLoggedIn, nickname, avatarUrl, credits, id: userId, setFriends, setBlockedUsers, showToast } = useUserStore();
    const router = useRouter();
    const [selectedUserProfile, setSelectedUserProfile] = useState<{ id: any, name: string, avatar: string, age: number } | null>(null);
    const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
    const [isGlobalChatOpen, setIsGlobalChatOpen] = useState(true);
    const [leaderboard, setLeaderboard] = useState<{ givers: any[], receivers: any[] }>({ givers: [], receivers: [] });

    // Fetch Leaderboard
    const fetchLeaderboard = async () => {
        try {
            const data = await fetchWithBase("/api/leaderboard");
            setLeaderboard(data);
        } catch (e) {
            console.error("Leaderboard fetch error", e);
            showToast("Gecenin en bonkörleri henüz belli değil, listeler karıştı!", "info");
        }
    };

    // Fetch User Data (Friends, Blocks)
    const fetchUserData = async () => {
        if (!userId) return;
        try {
            const friendsData = await fetchWithBase(`/api/friends?userId=${userId}`);
            const blocksData = await fetchWithBase(`/api/blocks?userId=${userId}`);

            setFriends(friendsData.map((f: any) => ({
                id: f.id,
                name: f.nickname,
                avatar: f.avatar
            })));
            setBlockedUsers(blocksData);
        } catch (e) {
            console.error("User data fetch error", e);
            showToast("Arkadaş listen kapıdaki kalabalıkta kayboldu, bi' daha dene!", "error");
        }
    };

    useEffect(() => {
        fetchLeaderboard();
        fetchUserData();
        const interval = setInterval(fetchLeaderboard, 30000); // 30s refresh
        return () => clearInterval(interval);
    }, [userId]);

    // Otomatik kapatma mobilde
    useEffect(() => {
        if (window.innerWidth < 768) {
            setIsGlobalChatOpen(false);
        }
    }, []);

    useEffect(() => {
        if (!isLoggedIn) {
            router.push("/join");
        }
    }, [isLoggedIn, router]);

    if (!isLoggedIn) return null; // Avoid hydration mismatch or flash

    return (
        <div className="min-h-screen bg-black text-white relative flex flex-col overflow-hidden pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
            <PavyonToast />
            {/* Background Grid Overlay */}
            <div className="fixed inset-0 pavyon-grid pointer-events-none opacity-20 z-0" />
            {/* Top Navbar / User Profile Strip */}
            <header className="flex justify-between items-center glass-panel rounded-full px-3 md:px-6 py-2 md:py-3 shrink-0 relative z-20 gap-2 md:gap-4 mb-2">
                <UserProfileMenu />

                <div className="flex-1 hidden md:flex items-center justify-center">
                    <img
                        src="/logo.png"
                        alt="The Pavyon Logo"
                        loading="eager"
                        fetchPriority="high"
                        className="h-12 w-auto object-contain drop-shadow-[0_0_10px_rgba(255,215,0,0.4)] hover:scale-110 transition-transform cursor-pointer"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    />
                </div>

                <div className="flex items-center gap-3 md:gap-6 shrink-0">
                    <NotificationMenu />

                    <div className="flex flex-col items-end">
                        <span className="text-[8px] md:text-[10px] text-white/40 uppercase tracking-tighter">Bakiye</span>
                        <span className="font-bold text-neon-pink text-xs md:text-sm tracking-tight">₺{credits.toFixed(0)}</span>
                    </div>
                    <button
                        onClick={() => setIsCreditModalOpen(true)}
                        className="text-[9px] md:text-sm border border-neon-pink/50 rounded-full px-2 md:px-4 py-1 md:py-1.5 hover:bg-neon-pink transition-all font-bold shadow-[0_0_15px_rgba(255,0,127,0.2)] whitespace-nowrap"
                    >
                        Kredi Yükle
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0 relative z-10">

                {/* Left: Global Chat (Toggleable) */}
                <aside className={`fixed md:relative inset-y-0 left-0 z-[100] md:z-10 w-full md:w-80 lg:w-[320px] xl:w-[380px] flex flex-col shrink-0 transition-transform duration-500 transform ${isGlobalChatOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-0 overflow-hidden opacity-0'}`}>
                    <div className="h-full flex flex-col p-4 md:p-0 bg-black/90 md:bg-transparent rounded-2xl md:rounded-none">
                        {/* Mobile Close Button for Chat */}
                        <div className="md:hidden flex justify-end mb-2">
                            <button onClick={() => setIsGlobalChatOpen(false)} className="bg-white/10 p-2 rounded-full"><X className="w-5 h-5" /></button>
                        </div>
                        <GlobalChat onProfileClick={setSelectedUserProfile} />
                    </div>
                </aside>

                {/* Center Content: Leaderboards (TOP) + Live Radio + Seats */}
                <main className="flex-1 flex flex-col gap-4 shrink min-w-0 h-full relative overflow-hidden">
                    {/* Chat Toggle Button (Visible when chat closed) */}
                    {!isGlobalChatOpen && (
                        <button
                            onClick={() => setIsGlobalChatOpen(true)}
                            className="bg-neon-pink text-white px-3 py-2 rounded-r-xl fixed left-0 top-1/2 -translate-y-1/2 z-[200] shadow-[0_0_20px_rgba(255,0,127,0.6)] flex items-center gap-1.5 hover:scale-105 transition-all text-[10px] md:text-xs font-bold animate-pulse"
                        >
                            <MessageSquare className="w-4 h-4 md:w-5 md:h-5" /> <span className="hidden sm:inline">SOHBET</span>
                        </button>
                    )}

                    <div className="shrink-0">
                        <LiveRadio />
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                        {/* Combined Leaders Row: MOVED TO TOP AND ENLARGED */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Bonkörler (Givers) */}
                            <div className="bg-black/60 border-2 border-gold-500/40 rounded-2xl p-2 flex items-center justify-between gap-2 shadow-[0_0_25px_rgba(255,215,0,0.15)] backdrop-blur-md">
                                <div className="flex flex-col flex-1 min-w-0">
                                    <h4 className="text-[10px] md:text-xs font-black text-gold-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                        <Trophy className="w-4 h-4" /> GÜNÜN BONKÖRLERİ
                                    </h4>
                                    <div className="flex -space-x-3 items-center">
                                        {leaderboard.givers.length > 0 ? (
                                            leaderboard.givers.map((user, idx) => (
                                                <div
                                                    key={user.id}
                                                    className={`relative cursor-pointer hover:scale-110 transition-all z-[${10 - idx}] hover:z-[50] shrink-0 group`}
                                                    onClick={() => setSelectedUserProfile({ ...user, age: 30 })}
                                                >
                                                    <div className="absolute -inset-1 bg-gold-400/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    <img src={user.avatar} className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-gold-400 object-cover shadow-[0_0_15px_rgba(255,215,0,0.3)] bg-black ${idx === 0 ? 'scale-110' : ''}`} />
                                                    {idx === 0 && <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xl">👑</div>}
                                                </div>
                                            ))
                                        ) : (
                                            <span className="text-xs text-white/20 italic ml-2">İkram bekliyor...</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Ünlüler (Receivers) */}
                            <div className="bg-black/60 border-2 border-neon-pink/40 rounded-2xl p-2 flex items-center justify-between gap-2 shadow-[0_0_25px_rgba(255,0,127,0.15)] backdrop-blur-md">
                                <div className="flex flex-col flex-1 min-w-0">
                                    <h4 className="text-[10px] md:text-xs font-black text-neon-pink uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                        <Sparkles className="w-4 h-4" /> GÜNÜN ÜNLÜLERİ
                                    </h4>
                                    <div className="flex -space-x-3 items-center">
                                        {leaderboard.receivers.length > 0 ? (
                                            leaderboard.receivers.slice(0, 5).map((user, idx) => (
                                                <div
                                                    key={user.id}
                                                    className={`relative cursor-pointer hover:scale-110 transition-all z-[${10 - idx}] hover:z-[50] shrink-0 group`}
                                                    onClick={() => setSelectedUserProfile(user)}
                                                >
                                                    <div className="absolute -inset-1 bg-neon-pink/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    <img src={user.avatar} className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-neon-pink object-cover shadow-[0_0_15px_rgba(255,0,127,0.3)] bg-black ${idx === 0 ? 'scale-110' : idx > 2 ? 'opacity-60 grayscale-[0.5]' : ''}`} />
                                                    {idx === 0 && <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xl text-neon-pink drop-shadow-[0_0_5px_rgba(255,0,127,0.8)]">✨</div>}
                                                </div>
                                            ))
                                        ) : (
                                            <span className="text-xs text-white/20 italic ml-2">Sahne boş...</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>

                    {/* Seat Layout */}
                    <div className="flex-1 relative z-10 min-h-[500px] bg-black/20 rounded-2xl border border-white/5 mx-auto w-full overflow-hidden" style={{height: 'calc(100vh - 200px)'}}>
                        <SeatLayout />
                    </div>
                </main>

                {/* Right: Gift Panel */}
                <aside className="w-full md:w-80 flex flex-col shrink-0 h-full hidden lg:flex">
                    <GiftPanel />
                </aside>
            </div>

            {/* Global Modals */}
            <PublicProfileModal
                isOpen={!!selectedUserProfile}
                onClose={() => setSelectedUserProfile(null)}
                user={selectedUserProfile}
            />

            {/* Kredi Yükleme Modalı */}
            <CreditModal
                isOpen={isCreditModalOpen}
                onClose={() => setIsCreditModalOpen(false)}
            />
        </div>
    );
}
