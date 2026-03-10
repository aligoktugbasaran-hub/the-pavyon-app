"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Send, Smile, AlertOctagon, Wifi, WifiOff } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { useSocket } from "@/lib/useSocket";

// Yasaklı kelimeler
const BAD_WORDS = ["küfür1", "küfür2", "argo kelime", "salak", "aptal", "mal"];

// Reklam tespiti
const LINK_REGEX = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9]+\.[a-z]{2,})/i;
const PHONE_REGEX = /(\+90|0)?\s*5\d{2}\s*\d{3}\s*\d{2}\s*\d{2}/;
const AD_WORDS = ["satılık", "reklam", "ucuz fiyat", "hesap sat", "takipçi", "linkte"];

const PAVYON_EMOJIS = ["🔥", "💸", "🥂", "🌹", "💃", "👑", "🚬", "🥃"];

function formatTime(dateStr: string) {
    try {
        return new Date(dateStr).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
    } catch {
        return "";
    }
}

export function GlobalChat({ onProfileClick }: { onProfileClick?: (user: any) => void }) {
    const { nickname, avatarUrl, id: userId, blockedUsers } = useUserStore();

    const { isConnected, messages, onlineUsers, typingUsers, sendMessage, notifyTyping } =
        useSocket({ roomType: "global", enabled: !!userId });

    const [msg, setMsg] = useState("");
    const [lastSentMsg, setLastSentMsg] = useState("");
    const [lastSentTime, setLastSentTime] = useState(0);
    const [banReason, setBanReason] = useState<string | null>(null);
    const [showEmojis, setShowEmojis] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Otomatik kaydırma
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Mesaj geçerlilik kontrolü
    const checkMessageValidity = (text: string): { isValid: boolean; reason?: string; type?: "spam" | "ad" | "swear" } => {
        const lowerText = text.toLowerCase();
        if (LINK_REGEX.test(lowerText) || PHONE_REGEX.test(lowerText) || AD_WORDS.some((w) => lowerText.includes(w))) {
            return { isValid: false, reason: "Reklam veya yönlendirme içerikli mesaj paylaştığınız için mekandan atıldınız.", type: "ad" };
        }
        if (BAD_WORDS.some((w) => lowerText.includes(w))) {
            return { isValid: false, reason: "Görgü kurallarına aykırı dil kullanımı.", type: "swear" };
        }
        if (text === lastSentMsg) {
            return { isValid: false, reason: "Sürekli aynı şeyi yazmayın.", type: "spam" };
        }
        const now = Date.now();
        if (now - lastSentTime < 2000) {
            return { isValid: false, reason: "Mesajlar arasında biraz bekleyin.", type: "spam" };
        }
        return { isValid: true };
    };

    const handleSend = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            if (!msg.trim() || banReason) return;

            const check = checkMessageValidity(msg);
            if (!check.isValid) {
                if (check.reason?.includes("atıldınız")) {
                    setBanReason(check.reason ?? "Banlandınız");
                }
                // Kural ihlali — sessizce reddet (toast yerine kullanıcı bildirimi)
                return;
            }

            sendMessage(msg.trim());
            setLastSentMsg(msg.trim());
            setLastSentTime(Date.now());
            setMsg("");
            setShowEmojis(false);
        },
        [msg, banReason, lastSentMsg, lastSentTime, sendMessage]
    );

    const appendEmoji = (emoji: string) => setMsg((prev) => prev + emoji);

    // Görüntülenecek mesajlar: engellenenlerden gelenleri filtrele
    const visibleMessages = messages.filter((m) => !blockedUsers.includes(m.senderNickname));

    return (
        <div className="glass-panel rounded-2xl flex flex-col h-full overflow-hidden relative">
            {/* Header */}
            <div className="bg-white/5 border-b border-white/10 p-4 font-bold text-white/90 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                    <span>Genel Sohbet</span>
                    {/* Çevrimiçi sayısı */}
                    {onlineUsers.length > 0 && (
                        <span className="text-[10px] bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full font-black">
                            {onlineUsers.length} çevrimiçi
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {/* Bağlantı göstergesi */}
                    {isConnected ? (
                        <Wifi className="w-3.5 h-3.5 text-green-400" aria-label="Bağlı" />
                    ) : (
                        <WifiOff className="w-3.5 h-3.5 text-red-400 animate-pulse" aria-label="Bağlantı yok" />
                    )}
                    <span className="text-xs font-normal text-white/40">Akıcı ve saygılı</span>
                </div>
            </div>

            {/* Mesaj Listesi */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 scrollbar-thin scrollbar-thumb-white/10">
                {/* Hoş geldiniz sistemik mesajı */}
                <span className="text-neon-pink text-xs bg-neon-pink/10 px-4 py-2 rounded-full text-center border border-neon-pink/20 mx-auto max-w-[85%]">
                    Pavyon&apos;a hoş geldiniz! Küfür, reklam ve spam yasaktır.
                </span>

                {visibleMessages.map((m) => {
                    const isMe = m.senderId === userId;
                    return (
                        <div key={m.id} className="flex gap-2.5 text-sm animate-in fade-in slide-in-from-bottom-1 duration-200">
                            <img
                                src={m.senderAvatar || "/avatars/female_avatar_1.png"}
                                alt={m.senderNickname}
                                className="w-8 h-8 object-cover rounded-full bg-black/50 shrink-0 border border-white/10"
                            />
                            <div className="flex flex-col max-w-[80%]">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <button
                                        onClick={() =>
                                            onProfileClick?.({
                                                id: m.senderId,
                                                name: m.senderNickname,
                                                avatar: m.senderAvatar,
                                            })
                                        }
                                        className={`font-bold text-xs hover:underline text-left ${isMe ? "text-green-400" : "text-yellow-500"}`}
                                    >
                                        {isMe ? "Siz" : m.senderNickname}
                                    </button>
                                    <span className="text-[9px] text-white/20">{formatTime(m.createdAt)}</span>
                                </div>
                                <p className="bg-black/40 p-2.5 rounded-2xl rounded-tl-none text-white/90 border border-white/5 leading-relaxed break-words shadow-sm text-[13px]">
                                    {m.content}
                                </p>
                            </div>
                        </div>
                    );
                })}

                {/* Yazıyor göstergesi */}
                {typingUsers.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-white/40 italic animate-pulse px-1">
                        <div className="flex gap-0.5">
                            <span className="w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce [animation-delay:0ms]" />
                            <span className="w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce [animation-delay:150ms]" />
                            <span className="w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce [animation-delay:300ms]" />
                        </div>
                        {typingUsers.length === 1 ? `${typingUsers[0]} yazıyor...` : `${typingUsers.length} kişi yazıyor...`}
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Giriş Alanı */}
            {banReason ? (
                <div className="p-4 bg-red-900/40 border-t border-red-500/30 flex flex-col items-center justify-center gap-2 text-center h-24 shrink-0">
                    <AlertOctagon className="w-6 h-6 text-red-400 mb-1" />
                    <span className="text-sm font-medium text-red-200">{banReason}</span>
                </div>
            ) : (
                <div className="bg-black/40 border-t border-white/10 flex flex-col shrink-0">
                    {/* Emoji seçici */}
                    {showEmojis && (
                        <div className="flex gap-2 p-2 px-4 bg-white/5 overflow-x-auto scrollbar-none animate-in fade-in">
                            {PAVYON_EMOJIS.map((emoji) => (
                                <button
                                    key={emoji}
                                    type="button"
                                    onClick={() => appendEmoji(emoji)}
                                    className="text-xl hover:scale-125 transition-transform p-1"
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    )}

                    <form onSubmit={handleSend} className="p-3 flex gap-2 items-center">
                        <button
                            type="button"
                            onClick={() => setShowEmojis(!showEmojis)}
                            className={`p-2 rounded-full transition-colors shrink-0 ${showEmojis ? "bg-white/20 text-yellow-400" : "text-white/50 hover:text-white/90 hover:bg-white/10"}`}
                        >
                            <Smile className="w-5 h-5" />
                        </button>

                        <input
                            type="text"
                            value={msg}
                            onChange={(e) => {
                                setMsg(e.target.value);
                                if (e.target.value) notifyTyping();
                            }}
                            placeholder={isConnected ? "Ortama seslen..." : "Bağlanıyor..."}
                            maxLength={150}
                            disabled={!isConnected || !!banReason}
                            className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-neon-pink focus:ring-1 focus:ring-neon-pink text-white transition-all shadow-inner disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={!msg.trim() || !isConnected}
                            className="p-2.5 bg-gradient-to-r from-neon-pink to-purple-600 text-white rounded-full hover:shadow-[0_0_15px_rgba(255,0,127,0.5)] transition-all shrink-0 disabled:opacity-50 disabled:hover:shadow-none"
                        >
                            <Send className="w-4 h-4 ml-0.5" />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
