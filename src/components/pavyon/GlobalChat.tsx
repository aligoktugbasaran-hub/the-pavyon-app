import React, { useState, useEffect, useRef } from "react";
import { Send, Smile, AlertOctagon } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";

// Yasaklı kelimeler (Örnek)
const BAD_WORDS = ["küfür1", "küfür2", "argo kelime", "salak", "aptal", "mal"];

// Reklam tespiti için basit Regex'ler
const LINK_REGEX = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9]+\.[a-z]{2,})/i;
const PHONE_REGEX = /(\+90|0)?\s*5\d{2}\s*\d{3}\s*\d{2}\s*\d{2}/;
const AD_WORDS = ["satılık", "reklam", "ucuz fiyat", "hesap sat", "takipçi", "linkte"];

const PAVYON_EMOJIS = ["🔥", "💸", "🥂", "🌹", "💃", "👑", "🚬", "🥃"];

export function GlobalChat() {
    const { nickname, avatarUrl, id: userId, blockedUsers } = useUserStore();
    const [msg, setMsg] = useState("");
    type ChatMessage = { id: number; sender: string; content: string; isSystem?: boolean; avatar?: string };
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: 1, sender: "Sistem", isSystem: true, content: "Pavyon'a hoş geldiniz! Lütfen küfür, reklam ve spam yapmayınız. Kurallara uymayanlar kapıya konulur." }
    ]);

    // Filtered messages for display
    const visibleMessages = messages.filter(m => !blockedUsers.includes(m.sender));

    // Anti-spam & Ban State
    const [lastSentMsg, setLastSentMsg] = useState("");
    const [lastSentTime, setLastSentTime] = useState(0);
    const [banReason, setBanReason] = useState<string | null>(null);
    const [showEmojis, setShowEmojis] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Otomatik kaydırma
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const checkMessageValidity = (text: string): { isValid: boolean, reason?: string, type?: "spam" | "ad" | "swear" } => {
        const lowerText = text.toLowerCase();

        // 1. Reklam Kontrolü (Link, Telefon, Yasaklı Reklam Kelimeleri)
        if (LINK_REGEX.test(lowerText) || PHONE_REGEX.test(lowerText) || AD_WORDS.some(word => lowerText.includes(word))) {
            return { isValid: false, reason: "Reklam veya yönlendirme içerikli mesaj paylaştığınız için mekandan atıldınız.", type: "ad" };
        }

        // 2. Küfür / Kötü Söz Kontrolü
        if (BAD_WORDS.some(word => lowerText.includes(word))) {
            return { isValid: false, reason: "Görgü kurallarına aykırı dil kullanımı.", type: "swear" };
        }

        // 3. Spam Kontrolü (Aynı mesajın tekrarı)
        if (text === lastSentMsg) {
            return { isValid: false, reason: "Sürekli aynı şeyi yazdığınız için mekandan atıldınız.", type: "spam" };
        }

        // 4. Hız Sınırı (Cooldown - 2 saniye)
        const now = Date.now();
        if (now - lastSentTime < 2000) {
            return { isValid: false, reason: "Chat akışını bozmamak için mesajlar arası biraz bekleyin.", type: "spam" };
        }

        return { isValid: true };
    };

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!msg.trim() || banReason) return;

        const check = checkMessageValidity(msg);

        if (!check.isValid) {
            if (check.type === "ad" || check.type === "spam") {
                // Reklam veya kalıcı spam yapanı tamamen engelliyoruz (Local simülasyon)
                if (check.reason?.includes("atıldınız")) {
                    setBanReason(check.reason);
                } else {
                    // Sadece uyarı mesajı ekle
                    setMessages(prev => [...prev, { id: Date.now(), sender: "Sistem", isSystem: true, content: `Uyarı: ${check.reason}` }]);
                }
            } else if (check.type === "swear") {
                setMessages(prev => [...prev, { id: Date.now(), sender: "Sistem", isSystem: true, content: `Uyarı: ${check.reason}` }]);
            }
            return; // Mesajı gönderme
        }

        // Başarılı gönderim
        setLastSentMsg(msg);
        setLastSentTime(Date.now());
        setMessages(prev => [...prev, { id: Date.now(), sender: nickname || "Anonim", avatar: avatarUrl || "", content: msg }]);
        setMsg("");
        setShowEmojis(false);
    };

    const appendEmoji = (emoji: string) => {
        setMsg(prev => prev + emoji);
    };

    return (
        <div className="glass-panel rounded-2xl flex flex-col h-full overflow-hidden relative">
            <div className="bg-white/5 border-b border-white/10 p-4 font-bold text-white/90 flex justify-between items-center">
                <span>Genel Sohbet</span>
                <span className="text-xs font-normal text-white/40">Akıcı ve saygılı</span>
            </div>

            {/* Chat Listesi */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-white/10">
                {visibleMessages.map((m) => (
                    <div key={m.id} className={`flex gap-3 text-sm ${m.isSystem ? 'justify-center my-2' : ''} animate-in fade-in slide-in-from-bottom-2`}>
                        {m.isSystem ? (
                            <span className="text-neon-pink text-xs bg-neon-pink/10 px-4 py-2 rounded-full text-center border border-neon-pink/20 max-w-[85%]">
                                {m.content}
                            </span>
                        ) : (
                            <>
                                <img src={m.avatar} alt={m.sender} className="w-8 h-8 object-cover rounded-full bg-black/50 shrink-0 border border-white/10" />
                                <div className="flex flex-col max-w-[80%]">
                                    <span className="font-bold text-yellow-500 text-xs mb-1">{m.sender}</span>
                                    <p className="bg-black/40 p-3 rounded-2xl rounded-tl-none text-white/90 border border-white/5 leading-relaxed break-words shadow-sm">
                                        {m.content}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Ban Ekranı veya Mesaj Alanı */}
            {banReason ? (
                <div className="p-4 bg-red-900/40 border-t border-red-500/30 flex flex-col items-center justify-center gap-2 text-center h-24">
                    <AlertOctagon className="w-6 h-6 text-red-400 mb-1" />
                    <span className="text-sm font-medium text-red-200">{banReason}</span>
                </div>
            ) : (
                <div className="bg-black/40 border-t border-white/10 flex flex-col">
                    {/* Emoji Seçici Panel (Açıkken) */}
                    {showEmojis && (
                        <div className="flex gap-2 p-2 px-4 bg-white/5 overflow-x-auto scrollbar-none animate-in fade-in">
                            {PAVYON_EMOJIS.map(emoji => (
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
                            className={`p-2 rounded-full transition-colors shrink-0 ${showEmojis ? 'bg-white/20 text-yellow-400' : 'text-white/50 hover:text-white/90 hover:bg-white/10'}`}
                        >
                            <Smile className="w-5 h-5" />
                        </button>

                        <input
                            type="text"
                            value={msg}
                            onChange={(e) => setMsg(e.target.value)}
                            placeholder="Ortama seslen..."
                            maxLength={150} // Aşırı uzun mesajları engelle
                            className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-neon-pink focus:ring-1 focus:ring-neon-pink text-white transition-all shadow-inner"
                        />
                        <button
                            type="submit"
                            disabled={!msg.trim()}
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
