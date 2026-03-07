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

export default function PavyonPage() {
    const { isLoggedIn, nickname, avatarUrl, credits } = useUserStore();
    const router = useRouter();
    const [selectedUserProfile, setSelectedUserProfile] = useState<{ id: number, name: string, avatar: string, age: number } | null>(null);
    const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
    const [isGlobalChatOpen, setIsGlobalChatOpen] = useState(true);

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
        <div className="min-h-screen bg-transparent text-white flex flex-col p-3 md:p-6 gap-2 md:gap-4 h-screen overflow-hidden relative">
            {/* Background Grid Overlay */}
            <div className="fixed inset-0 pavyon-grid pointer-events-none opacity-20 z-0" />
            {/* Top Navbar / User Profile Strip */}
            <header className="flex justify-between items-center glass-panel rounded-full px-6 py-3 shrink-0 relative z-20 gap-4">
                <UserProfileMenu />

                <div className="flex-1 hidden md:flex items-center justify-center">
                    <TopReceivers onUserClick={setSelectedUserProfile} />
                </div>

                <div className="flex items-center gap-3 md:gap-6 shrink-0">
                    <NotificationMenu />

                    <div className="hidden xs:flex flex-col items-end">
                        <span className="text-[10px] text-white/40 uppercase tracking-tighter">Bakiye</span>
                        <span className="font-bold text-neon-pink text-sm tracking-tight">₺{credits.toFixed(2)}</span>
                    </div>
                    <button
                        onClick={() => setIsCreditModalOpen(true)}
                        className="text-[10px] md:text-sm border border-neon-pink/50 rounded-full px-3 md:px-4 py-1.5 hover:bg-neon-pink transition-all font-bold shadow-[0_0_15px_rgba(255,0,127,0.2)]"
                    >
                        Kredi Yükle
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0 relative z-10">

                {/* Left: Global Chat (Toggleable) */}
                <aside className={`fixed md:relative inset-y-0 left-0 z-[100] md:z-10 w-full md:w-80 lg:w-[320px] xl:w-[380px] flex flex-col shrink-0 transition-transform duration-500 transform ${isGlobalChatOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-0 overflow-hidden opacity-0'}`}>
                    <div className="h-full flex flex-col p-4 md:p-0">
                        {/* Mobile Close Button for Chat */}
                        <div className="md:hidden flex justify-end mb-2">
                            <button onClick={() => setIsGlobalChatOpen(false)} className="bg-white/10 p-2 rounded-full"><X className="w-5 h-5" /></button>
                        </div>
                        <GlobalChat />
                    </div>
                </aside>

                {/* Center Content: Live Radio + Leaderboards + Seats */}
                <main className="flex-1 flex flex-col gap-2 shrink min-w-0 h-full relative">
                    {/* Chat Toggle Button (Visible when chat closed) */}
                    {!isGlobalChatOpen && (
                        <button
                            onClick={() => setIsGlobalChatOpen(true)}
                            className="bg-neon-pink text-white px-4 py-2 rounded-r-xl absolute left-0 top-1/2 -translate-y-1/2 z-50 shadow-[0_0_15px_rgba(255,0,127,0.5)] flex items-center gap-2 hover:scale-105 transition-all text-[10px] md:text-xs font-bold whitespace-nowrap"
                        >
                            <MessageSquare className="w-4 h-4 md:w-5 md:h-5" /> <span className="hidden sm:inline">GENEL SOHBET</span>
                        </button>
                    )}

                    <div className="flex flex-col gap-2 shrink-0">
                        <div className="w-full">
                            <LiveRadio />
                        </div>

                        {/* Combined Leaders Row: Saves space on all devices */}
                        <div className="grid grid-cols-2 gap-2">
                            {/* Bonkörler (Givers) */}
                            <div className="bg-black/60 border border-gold-500/30 rounded-xl p-2 flex items-center justify-between gap-2 shadow-[0_0_15px_rgba(255,215,0,0.1)]">
                                <div className="flex flex-col flex-1 min-w-0">
                                    <h4 className="text-[8px] font-black text-gold-400/90 uppercase tracking-tighter mb-1 flex items-center gap-1">
                                        <Trophy className="w-2.5 h-2.5" /> BONKÖRLER
                                    </h4>
                                    <div className="flex -space-x-2">
                                        {[
                                            { id: 101, name: "Baron", avatar: "/avatars/male_avatar_1.png", age: 34 },
                                            { id: 102, name: "Reis", avatar: "/avatars/male_avatar_2.png", age: 41 },
                                            { id: 103, name: "Dayı", avatar: "/avatars/male_avatar_3.png", age: 45 }
                                        ].map((user) => (
                                            <div
                                                key={user.id}
                                                className="relative cursor-pointer hover:scale-110 transition-all z-[10] hover:z-[50] shrink-0"
                                                onClick={() => setSelectedUserProfile(user)}
                                            >
                                                <img src={user.avatar} className="w-6 h-6 rounded-full border border-gold-400 object-cover shadow-md" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Ünlüler (Receivers) */}
                            <div className="bg-black/60 border border-neon-pink/30 rounded-xl p-2 flex items-center justify-between gap-2 shadow-[0_0_15px_rgba(255,0,127,0.1)]">
                                <div className="flex flex-col flex-1 min-w-0">
                                    <h4 className="text-[8px] font-black text-neon-pink/90 uppercase tracking-tighter mb-1 flex items-center gap-1">
                                        <Sparkles className="w-2.5 h-2.5" /> ÜNLÜLER
                                    </h4>
                                    <div className="flex -space-x-2">
                                        {[
                                            { id: 201, name: "Selin", avatar: "/avatars/female_avatar_1.png", age: 24 },
                                            { id: 202, name: "Buse", avatar: "/avatars/female_avatar_2.png", age: 21 },
                                            { id: 203, name: "Ceren", avatar: "/avatars/female_avatar_3.png", age: 23 }
                                        ].map((user) => (
                                            <div
                                                key={user.id}
                                                className="relative cursor-pointer hover:scale-110 transition-all z-[10] hover:z-[50] shrink-0"
                                                onClick={() => setSelectedUserProfile(user)}
                                            >
                                                <img src={user.avatar} className="w-6 h-6 rounded-full border border-neon-pink object-cover shadow-md" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Seat Layout */}
                    <div className="flex-1 relative z-10 overflow-y-auto bg-black/20 rounded-2xl border border-white/5 mx-auto w-full flex items-start justify-center p-4 md:p-8 md:pt-4 scrollbar-thin scrollbar-thumb-white/10">
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
