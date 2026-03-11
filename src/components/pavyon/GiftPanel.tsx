"use client";

import { useState } from "react";
import { Gift, Check, AlertTriangle, Flame } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { fetchWithBase } from "@/lib/api";

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
    { id: "keys", name: "Lüks Araç", price: 50000, icon: "🏎️" },
];

const RECIPIENTS = [
    { value: "all", label: "Herkese (Genel İkram)" },
    { value: "11", label: "Kral Masası" },
    { value: "12", label: "Sahne Önü" },
    { value: "1", label: "Sinema Tutkunları" },
    { value: "2", label: "Arabesk & Damar" },
    { value: "3", label: "Edebiyat Köşesi" },
    { value: "4", label: "Rock Severler" },
    { value: "5", label: "Kırmızı Güller" },
    { value: "6", label: "Günün Yorgunluğu" },
];

export function GiftPanel() {
    const [selectedGiftId, setSelectedGiftId] = useState<string | null>(null);
    const [recipient, setRecipient] = useState("");
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "insufficient">("idle");

    const { id: senderId, nickname: senderName, avatarUrl: senderAvatar, credits, removeCredits } = useUserStore();

    const selectedGift = GIFTS.find(g => g.id === selectedGiftId) || null;
    const canSend = !!selectedGift && !!recipient;

    const handleSend = async () => {
        if (!canSend || !selectedGift) return;

        if (credits < selectedGift.price) {
            setStatus("insufficient");
            setTimeout(() => setStatus("idle"), 3000);
            return;
        }

        setStatus("sending");
        try {
            // Deduct credits locally (Zustand)
            removeCredits(selectedGift.price);

            // Register gift in DB (API Call)
            const targetRecipient = RECIPIENTS.find(r => r.value === recipient);

            await fetchWithBase("/api/gift", {
                method: "POST",
                body: JSON.stringify({
                    senderId: senderId || "anonymous-web",
                    senderNickname: senderName || "Misafir",
                    senderAvatar: senderAvatar || "/avatars/male_avatar_1.png",
                    receiverId: senderId,
                    receiverNickname: targetRecipient?.label || recipient,
                    receiverAvatar: "/avatars/female_avatar_1.png",
                    giftType: selectedGift.name,
                    creditCost: selectedGift.price,
                    tlValue: selectedGift.price * 0.20,
                    targetTable: recipient,
                })
            });

            const earnings = selectedGift.price * 0.20;
            const txId = `TX-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
            console.log(`[SECURE] Payout: ₺${earnings} | ID: ${txId} | To: ${recipient}`);

            setStatus("success");
            useUserStore.getState().showToast(`${selectedGift.name} gönderildi! 🎉`, "success");
            setTimeout(() => {
                setStatus("idle");
                setSelectedGiftId(null);
                setRecipient("");
            }, 2000);
        } catch (err) {
            console.error(err);
            setStatus("idle");
        }
    };

    return (
        <div className="glass-panel rounded-2xl flex flex-col h-full overflow-hidden p-4 relative">
            <div className="border-b border-white/10 pb-3 mb-4 text-center font-bold text-gold-400 font-heading text-lg tracking-wider drop-shadow-md">
                MASAYA İKRAM GÖNDER
            </div>

            {/* Success Overlay */}
            {status === "success" && (
                <div className="absolute inset-0 z-20 bg-black/90 flex flex-col items-center justify-center gap-3 animate-in fade-in rounded-2xl">
                    <div className="text-6xl animate-bounce">{selectedGift?.icon || "🎁"}</div>
                    <div className="text-xl font-black text-white">Gönderildi! 🎉</div>
                    <Check className="w-10 h-10 text-green-400" />
                </div>
            )}

            {/* Gift Grid */}
            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neon-pink/30">
                <div className="grid grid-cols-2 gap-3 mb-4">
                    {GIFTS.map((gift) => (
                        <div
                            key={gift.id}
                            onClick={() => setSelectedGiftId(gift.id)}
                            className={`cursor-pointer bg-black/40 border rounded-xl p-3 flex flex-col items-center transition-all group relative overflow-hidden ${selectedGiftId === gift.id ? 'border-neon-pink scale-105 shadow-[0_0_15px_rgba(255,0,127,0.4)]' : 'border-white/10 hover:bg-white/5 hover:border-white/30'}`}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-tr transition-opacity ${selectedGiftId === gift.id ? 'from-neon-pink/10 via-transparent to-neon-pink/20 opacity-100' : 'from-transparent to-transparent opacity-0 group-hover:opacity-100'}`} />
                            <span className={`text-4xl mb-2 transition-transform drop-shadow-lg z-10 ${selectedGiftId === gift.id ? 'scale-110 drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]' : 'group-hover:scale-110 group-hover:-translate-y-1'}`}>
                                {gift.icon}
                            </span>
                            <span className="text-xs font-bold text-white/90 z-10 text-center uppercase tracking-tight">{gift.name}</span>
                            <span className="text-[11px] text-yellow-400 font-bold z-10 mt-1">₺{gift.price}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-white/10 mt-auto space-y-3 bg-black/20 -mx-4 -mb-4 p-4 rounded-b-2xl">
                {/* Insufficient Balance Warning */}
                {status === "insufficient" && (
                    <div className="flex items-start gap-2 p-3 bg-red-900/60 border border-red-500/40 rounded-xl animate-in fade-in duration-200">
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <div>
                            <div className="text-xs font-bold text-white">Yetersiz Bakiye</div>
                            <div className="text-[10px] text-white/60">Bu hediye için ₺{selectedGift?.price} gerekiyor. Mevcut: ₺{credits}</div>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between text-[10px] text-white/40 mb-1">
                    <span>Bakiye</span>
                    <span className="text-neon-pink font-bold">₺{credits.toFixed(0)}</span>
                </div>

                <select
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full bg-black/60 border border-white/20 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-neon-pink focus:ring-1 focus:ring-neon-pink text-white/90 appearance-none font-medium"
                >
                    <option value="">Kime ikram ediyorsun?</option>
                    {RECIPIENTS.map(r => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                </select>

                <button
                    onClick={handleSend}
                    disabled={!canSend || status === "sending"}
                    className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${canSend
                        ? "bg-gradient-to-r from-neon-pink to-purple-600 text-white shadow-[0_0_15px_rgba(255,0,127,0.3)] hover:opacity-90"
                        : "bg-white/5 text-white/30 border border-white/10 cursor-not-allowed"
                        }`}
                >
                    {status === "sending" ? (
                        <span className="animate-pulse flex items-center gap-2"><Flame className="w-4 h-4" /> Gönderiliyor...</span>
                    ) : canSend ? (
                        <><Gift className="w-4 h-4" /> {selectedGift?.name} — Hesaba Yazdır</>
                    ) : (
                        "Hediye ve Alıcı Seçin"
                    )}
                </button>
            </div>
        </div>
    );
}
