"use client";

import { useState } from "react";
import { X, Gift, Check, AlertTriangle } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { PavyonToast } from "@/components/pavyon/PavyonToast"; // Added PavyonToast import

const GIFTS = [
    { id: "lighter", name: "Çakmak", price: 25, icon: "🔥" },
    { id: "gum", name: "Sakız", price: 50, icon: "🍬" },
    { id: "shot", name: "Tekila Shot", price: 75, icon: "🥃" },
    { id: "flower", name: "Gül Demeti", price: 100, icon: "🌹" },
    { id: "fruit", name: "Meyve Tab.", price: 250, icon: "🍉" },
    { id: "confetti", name: "Konfeti", price: 500, icon: "🎊" },
    { id: "volcano", name: "Volkan", price: 750, icon: "🌋" },
    { id: "champagne", name: "Şampanya", price: 1500, icon: "🍾" },
    { id: "diamond", name: "Elmas", price: 5000, icon: "💎" },
    { id: "crown", name: "Kral Tacı", price: 10000, icon: "👑" },
];

interface GiftModalProps {
    isOpen: boolean;
    onClose: () => void;
    recipientName: string;
    recipientAvatar?: string;
    recipientId?: string;
    onCreditRedirect?: () => void;
}

export function GiftModal({ isOpen, onClose, recipientName, recipientAvatar, recipientId, onCreditRedirect }: GiftModalProps) {
    const [selectedGift, setSelectedGift] = useState<typeof GIFTS[0] | null>(null);
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "insufficient">("idle");

    const { credits, removeCredits } = useUserStore();

    if (!isOpen) return null;

    const handleSend = async () => {
        if (!selectedGift) return;
        if (!recipientId) {
            setStatus("idle");
            useUserStore.getState().showToast("Hediye gönderilemedi: alıcı bulunamadı.", "error");
            return;
        }
        if (credits < selectedGift.price) {
            setStatus("insufficient");
            setTimeout(() => setStatus("idle"), 2500);
            return;
        }
        setStatus("sending");
        try {
            const { id: senderId, nickname, avatarUrl } = useUserStore.getState();
            await fetch("/api/gift", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    giftType: selectedGift.id,
                    creditCost: selectedGift.price,
                    tlValue: selectedGift.price * 0.20,
                    senderId,
                    receiverId: recipientId || senderId,
                    senderNickname: nickname,
                    senderAvatar: avatarUrl,
                    receiverNickname: recipientName,
                    receiverAvatar: recipientAvatar,
                })
            });
            removeCredits(selectedGift.price);
            setStatus("success");
            setTimeout(() => {
                setStatus("idle");
                setSelectedGift(null);
                onClose();
                useUserStore.getState().showToast(`${selectedGift.name} gönderildi! 🎉`, "success");
            }, 1800);
        } catch (e) {
            setStatus("idle");
            useUserStore.getState().showToast("Hediye gönderilemedi, tekrar dene.", "error");
        }
    };

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <PavyonToast /> {/* Render PavyonToast */}
            <div className="relative bg-gradient-to-br from-[#110820] to-black border border-white/10 rounded-3xl w-full max-w-md shadow-[0_0_50px_rgba(255,0,127,0.2)] overflow-hidden">

                {/* Close */}
                <button onClick={onClose} className="absolute top-4 right-4 p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all z-10">
                    <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center gap-4">
                    {recipientAvatar && (
                        <img src={recipientAvatar} alt={recipientName} className="w-14 h-14 rounded-full border-2 border-neon-pink/50 object-cover shadow-[0_0_15px_rgba(255,0,127,0.3)]" />
                    )}
                    <div>
                        <div className="text-xs text-white/40 uppercase tracking-widest">Hediye Gönder</div>
                        <div className="text-xl font-black text-white">{recipientName}</div>
                        <div className="text-xs text-white/50 mt-0.5">Bakiye: <span className="text-neon-pink font-bold">₺{credits.toFixed(0)}</span></div>
                    </div>
                </div>

                {/* Success Animation */}
                {status === "success" && (
                    <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center z-20 animate-in fade-in duration-300">
                        <div className="text-7xl mb-4 animate-bounce">{selectedGift?.icon}</div>
                        <div className="text-2xl font-black text-white mb-2">Gönderildi! 🎉</div>
                        <div className="text-white/60 text-sm">{selectedGift?.name} → {recipientName}</div>
                        <Check className="w-12 h-12 text-green-400 mt-4" />
                    </div>
                )}

                {/* Insufficient Balance Warning */}
                {status === "insufficient" && (
                    <div className="absolute bottom-20 left-4 right-4 bg-red-900/80 border border-red-500/50 rounded-xl p-3 z-20 animate-in slide-in-from-bottom duration-200">
                        <div className="flex items-center gap-3 mb-2">
                            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                            <div>
                                <div className="text-sm font-bold text-white">Yetersiz Bakiye!</div>
                                <div className="text-xs text-white/60">Bu hediye için ₺{selectedGift?.price} gerekiyor.</div>
                            </div>
                        </div>
                        <button
                            onClick={() => { onClose(); onCreditRedirect?.(); }}
                            className="w-full mt-1 py-2 rounded-lg bg-neon-pink text-white text-xs font-bold hover:opacity-90 transition-opacity"
                        >
                            Kredi Yükle →
                        </button>
                    </div>
                )}

                {/* Gift Grid */}
                <div className="p-4 grid grid-cols-4 gap-2 max-h-[40vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                    {GIFTS.map((gift) => (
                        <button
                            key={gift.id}
                            onClick={() => setSelectedGift(gift)}
                            className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border transition-all ${selectedGift?.id === gift.id
                                ? "border-neon-pink bg-neon-pink/10 shadow-[0_0_12px_rgba(255,0,127,0.4)] scale-105"
                                : "border-white/10 bg-white/5 hover:border-white/30"
                                }`}
                        >
                            <span className="text-2xl">{gift.icon}</span>
                            <span className="text-[9px] font-bold text-white/80 text-center leading-tight">{gift.name}</span>
                            <span className="text-[9px] text-yellow-400 font-bold">₺{gift.price}</span>
                        </button>
                    ))}
                </div>

                {/* Send Button */}
                <div className="p-4 border-t border-white/10 bg-black/30">
                    <button
                        onClick={handleSend}
                        disabled={!selectedGift || status === "sending"}
                        className={`w-full py-3.5 rounded-xl font-black text-base flex items-center justify-center gap-2 transition-all ${selectedGift
                            ? "bg-gradient-to-r from-neon-pink to-purple-600 text-white shadow-[0_0_20px_rgba(255,0,127,0.4)] hover:opacity-90"
                            : "bg-white/5 text-white/30 border border-white/10 cursor-not-allowed"
                            }`}
                    >
                        {status === "sending" ? (
                            <span className="animate-pulse">Gönderiliyor...</span>
                        ) : selectedGift ? (
                            <><Gift className="w-5 h-5" /> {selectedGift.name} — Hesaba Yazdır (₺{selectedGift.price})</>
                        ) : (
                            "Bir Hediye Seçin"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
