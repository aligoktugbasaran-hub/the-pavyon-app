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

export default function PavyonPage() {
    const { isLoggedIn, nickname, avatarUrl, credits } = useUserStore();
    const router = useRouter();
    const [selectedUserProfile, setSelectedUserProfile] = useState<{ id: number, name: string, avatar: string, age: number } | null>(null);
    const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);

    useEffect(() => {
        if (!isLoggedIn) {
            router.push("/join");
        }
    }, [isLoggedIn, router]);

    if (!isLoggedIn) return null; // Avoid hydration mismatch or flash

    return (
        <div className="min-h-screen bg-pavyon-bg text-white flex flex-col p-4 md:p-6 gap-6 h-screen overflow-hidden">
            {/* Top Navbar / User Profile Strip */}
            <header className="flex justify-between items-center glass-panel rounded-full px-6 py-3 shrink-0 relative z-20 gap-4">
                <UserProfileMenu />

                <div className="flex-1 hidden md:flex items-center justify-center">
                    <TopReceivers onUserClick={setSelectedUserProfile} />
                </div>

                <div className="flex items-center gap-6 shrink-0">
                    <NotificationMenu />

                    <div className="flex flex-col items-end">
                        <span className="text-xs text-white/60">Bakiye</span>
                        <span className="font-bold text-neon-pink">₺{credits.toFixed(2)}</span>
                    </div>
                    <button
                        onClick={() => setIsCreditModalOpen(true)}
                        className="text-sm border border-neon-pink rounded-full px-4 py-1.5 hover:bg-neon-pink transition-colors font-bold"
                    >
                        Kredi Yükle
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0 relative z-10">

                {/* Left: Global Chat (Fixed & Large) */}
                <aside className="w-full md:w-96 lg:w-[400px] flex flex-col shrink-0 h-[60vh] md:h-full order-last md:order-first">
                    <GlobalChat />
                </aside>

                {/* Center: Live Radio + Seats */}
                <main className="flex-1 flex flex-col gap-3 shrink min-w-0 h-full">

                    <LiveRadio />

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
