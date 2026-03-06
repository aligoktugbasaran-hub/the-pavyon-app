import { useState, useEffect, useRef } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { KeyRound, Users, Wine, Lock, UserPlus, X, Send, ArrowLeft, Gift, Video } from "lucide-react";
import { PublicProfileModal } from "@/components/pavyon/PublicProfileModal";
import { GiftModal } from "@/components/pavyon/GiftModal";
import { CreditModal } from "@/components/pavyon/CreditModal";
import { VideoCallModal } from "@/components/pavyon/VideoCallModal";
import { useUserStore } from "@/store/useUserStore";

const ALL_TABLES = [
    { id: 99, name: "Ceren ile Özel", capacity: 2, currentUsers: 1, icon: "🥂", type: "vip" }, // Hidden private room mock
    { id: 11, name: "Kral Locası", capacity: 8, currentUsers: 7, icon: "👑", type: "vip" },
    { id: 12, name: "Sahne Önü", capacity: 8, currentUsers: 6, icon: "💎", type: "vip" },
    { id: 1, name: "Sinema Tutkunları", capacity: 10, currentUsers: 4, icon: "🎬", type: "masa" },
    { id: 2, name: "Arabesk & Damar", capacity: 10, currentUsers: 8, icon: "🎻", type: "masa" },
    { id: 3, name: "Edebiyat Köşesi", capacity: 10, currentUsers: 3, icon: "📚", type: "masa" },
    { id: 14, name: "Köşe Loca", capacity: 6, currentUsers: 1, icon: "🍷", type: "vip" },
    { id: 4, name: "Rock Severler", capacity: 10, currentUsers: 6, icon: "🎸", type: "masa" },
    { id: 5, name: "Kırmızı Güller", capacity: 10, currentUsers: 10, icon: "🌹", type: "masa" },
    { id: 6, name: "Günün Yorgunluğu", capacity: 10, currentUsers: 2, icon: "🥃", type: "masa" },
];

const MOCK_USER_NAMES = ["Ahmet", "Ayşe", "Mehmet", "Fatma", "Ali", "Zeynep", "Can", "Elif", "Burak", "Ceren", "Kaan", "Derya"];

// Chat kuralları için basit fonksiyon
const checkMessageRules = (text: string) => {
    const forbiddenWords = ["küfür1", "küfür2", "reklam.com"];
    return !forbiddenWords.some(word => text.toLowerCase().includes(word));
};

export function SeatLayout() {
    const [activeMessage, setActiveMessage] = useState<{ tableId: number, seatIndex: number, text: string } | null>(null);
    const [isLocalarimOpen, setIsLocalarimOpen] = useState(false);

    // Global Store
    const joinedTableId = useUserStore(state => state.joinedTableId);
    const setJoinedTableId = useUserStore(state => state.setJoinedTableId);
    const blockedUsers = useUserStore(state => state.blockedUsers);

    const [hoveredUser, setHoveredUser] = useState<{ tableId: number, seatIndex: number } | null>(null);

    // Public profile modal state
    const [selectedUserProfile, setSelectedUserProfile] = useState<{ id: number, name: string, avatar: string, age: number } | null>(null);

    // Gift modal state
    const [giftTarget, setGiftTarget] = useState<{ name: string, avatar: string } | null>(null);
    const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
    const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
    const [videoCallTarget, setVideoCallTarget] = useState<{ name: string; avatar: string } | null>(null);

    // Focused Table Chat State
    const [tableMessages, setTableMessages] = useState<{ id: number, sender: string, text: string, time: string, isMe: boolean, avatar: string, seatIndex: number }[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Active table object
    const activeTable = joinedTableId ? ALL_TABLES.find(t => t.id === joinedTableId) : null;

    // Scroll chat to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [tableMessages]);

    // Populate mock messages when joining a table
    useEffect(() => {
        if (activeTable) {
            setTableMessages([
                { id: 1, sender: "Sistem", text: `${activeTable.name} masasına katıldınız.Sohbet kurallarına uyunuz.`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isMe: false, avatar: "", seatIndex: -1 },
                { id: 2, sender: MOCK_USER_NAMES[0], text: "Hoş geldiniz!", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isMe: false, avatar: "/avatars/female_avatar_1.png", seatIndex: 0 }
            ]);
        }
    }, [activeTable]);

    // Mock random chat bubble popping up
    useEffect(() => {
        const interval = setInterval(() => {
            if (ALL_TABLES.length === 0) return;
            const randomTable = ALL_TABLES[Math.floor(Math.random() * ALL_TABLES.length)];
            const usersCount = joinedTableId === randomTable.id ? randomTable.currentUsers + 1 : randomTable.currentUsers;

            if (usersCount > 0) {
                const randomSeat = Math.floor(Math.random() * usersCount);
                // Don't auto-send messages from the user's seat
                if (joinedTableId === randomTable.id && randomSeat === randomTable.currentUsers) return;

                const mockMessages = randomTable.type === "vip"
                    ? ["Şampanya benden!", "Şerefe 🎉", "Kalite burada", "Loca harika"]
                    : ["Merhaba kızlar", "Nasılsınız?", "Hangi film?", "Müzik harika", "Şerefe! 🥂"];

                const chosenMessage = mockMessages[Math.floor(Math.random() * mockMessages.length)];

                setActiveMessage({
                    tableId: randomTable.id,
                    seatIndex: randomSeat,
                    text: chosenMessage
                });

                // If this is the active table, also add to chat panel
                if (joinedTableId === randomTable.id) {
                    const mockName = MOCK_USER_NAMES[(randomTable.id + randomSeat) % MOCK_USER_NAMES.length];

                    // Don't show messages from blocked users
                    if (blockedUsers.includes(mockName)) return;

                    const avatarUrl = `/avatars/${randomSeat % 2 === 0 ? 'female' : 'male'}_avatar_${(randomSeat % 6) + 1}.png`;
                    setTableMessages(prev => [...prev, {
                        id: Date.now(),
                        sender: mockName,
                        text: chosenMessage,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        isMe: false,
                        avatar: avatarUrl,
                        seatIndex: randomSeat
                    }]);
                }

                setTimeout(() => setActiveMessage(null), 3500);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [joinedTableId]);

    // Helper to calculate circular/semicircular positions
    const getSeatPosition = (index: number, total: number, isVip: boolean, scale = 1, isFocused = false) => {
        if (isFocused) {
            const angleSpan = Math.PI;
            const startAngle = 0;
            const angle = total === 1 ? Math.PI / 2 : startAngle + (index / (total - 1)) * angleSpan;

            // Use vmin for responsive sizing on mobile
            const radiusX = isVip ? 130 : 100;
            const radiusY = isVip ? 70 : 60;
            const yOffset = 15;

            return {
                left: `calc(50% + ${Math.cos(angle) * radiusX}px - 18px)`, // 18px is approx half of w-9 (36px)
                top: `calc(50% + ${Math.sin(angle) * radiusY + yOffset}px - 18px)`,
            };
        } else {
            const radiusX = (isVip ? 60 : 45) * scale;
            const radiusY = (isVip ? 35 : 45) * scale;
            const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
            return {
                left: `calc(50% + ${Math.cos(angle) * radiusX}px - 14px)`, // 14px is approx half of w-7 (28px)
                top: `calc(50% + ${Math.sin(angle) * radiusY}px - 14px)`,
            };
        }
    };

    const handleJoinTable = (tableId: number, currentUsers: number, capacity: number) => {
        if (currentUsers >= capacity) {
            alert("Bu masa tamamen dolu!");
            return;
        }
        setJoinedTableId(tableId);
    };

    const handleLeaveTable = () => {
        setJoinedTableId(null);
        setTableMessages([]);
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeTable) return;

        if (!checkMessageRules(newMessage)) {
            alert("Mesajınız kurallara aykırı kelimeler içeriyor.");
            return;
        }

        const mySeatIndex = activeTable.currentUsers;

        // Add to chat history
        setTableMessages(prev => [...prev, {
            id: Date.now(),
            sender: "Siz",
            text: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: true,
            avatar: "/avatars/male_avatar_1.png", // Mock current user avatar
            seatIndex: mySeatIndex
        }]);

        // Pop up bubble over my avatar
        setActiveMessage({
            tableId: activeTable.id,
            seatIndex: mySeatIndex,
            text: newMessage
        });
        setTimeout(() => setActiveMessage(null), 3000);

        setNewMessage("");
    };

    // --- FOCUSED TABLE VIEW (MASAYA OTURUNCA AÇILAN EKRAN) ---
    if (activeTable) {
        const isVip = activeTable.type === "vip";
        const totalUsers = activeTable.currentUsers + 1;

        return (
            <div className="absolute inset-0 flex flex-col md:flex-row bg-[#080010] overflow-hidden animate-in fade-in duration-500 rounded-2xl z-50">
                {/* Fixed Exit Button for Mobile — Hapsolmayı engellemek için */}
                <button
                    onClick={handleLeaveTable}
                    className="absolute top-4 left-4 z-[100] md:hidden bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 p-2 rounded-full text-red-500 transition-all backdrop-blur-md"
                    title="Masadan Kalk"
                >
                    <ArrowLeft className="w-5 h-5 shadow-lg" />
                </button>
                {/* Background effects for focused view */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,127,0.1),transparent_70%)] opacity-30 pointer-events-none" />

                <div className="flex-1 flex flex-col items-center justify-center relative p-3 md:p-8 min-h-[35vh] md:min-h-0 pt-16 md:pt-8 bg-center bg-no-repeat bg-contain" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(255,0,127,0.1) 0%, transparent 70%)' }}>
                    <div className="relative w-full max-w-[280px] md:max-w-sm aspect-square flex items-center justify-center scale-95 md:scale-110 lg:scale-125">
                        {/* Kırmızı Hilal Şeklinde Koltuk (Sofa) */}
                        <div
                            className="absolute rounded-full border-red-900 shadow-[inset_0_10px_30px_rgba(80,0,0,0.9),0_15px_40px_rgba(220,38,38,0.2)] z-0 flex items-center justify-center before:absolute before:inset-0 before:rounded-full before:border-[2px] before:border-red-500/30 before:border-t-transparent after:absolute after:inset-1 after:rounded-full after:border-[1px] after:border-white/5 after:border-t-transparent"
                            style={{
                                width: isVip ? '260px' : '200px',
                                height: isVip ? '160px' : '140px',
                                borderWidth: isVip ? '35px' : '30px',
                                borderTopColor: 'transparent',
                                transform: 'translateY(10px)'
                            }}
                        >
                        </div>

                        {/* Fiziksel Masa Büyütülmüş  */}
                        <div className={`${isVip ? 'w-36 h-24 rounded-3xl' : 'w-20 h-20 rounded-full'} border-[2px] flex flex-col items-center justify-center shadow-[0_0_40px_rgba(0,0,0,1)] z-10 ${isVip ? 'bg-black border-gold-500/50' : 'bg-black border-neon-pink/50'} `}>
                            <span className="text-2xl drop-shadow-lg opacity-95">{activeTable.icon}</span>
                            <span className={`text-[7px] font-black mt-1 uppercase tracking-tighter text-center mx-1 ${isVip ? 'text-gold-400' : 'text-neon-pink'} leading-none`}>{activeTable.name} MS.</span>
                        </div>

                        {/* Oturan Avatarlar */}
                        {Array.from({ length: activeTable.capacity }).map((_, i) => {
                            const isMySeat = i === activeTable.currentUsers;
                            const isOccupied = i < activeTable.currentUsers || isMySeat;
                            const pos = getSeatPosition(i, activeTable.capacity, isVip, 1, true);
                            const hasMessage = activeMessage?.tableId === activeTable.id && activeMessage?.seatIndex === i;
                            const isHovered = hoveredUser?.tableId === activeTable.id && hoveredUser?.seatIndex === i;

                            const mockName = MOCK_USER_NAMES[(activeTable.id + i) % MOCK_USER_NAMES.length];
                            const mockAge = 20 + ((activeTable.id * i) % 15);
                            const avatarUrl = isMySeat ? '/avatars/male_avatar_1.png' : `/avatars/${i % 2 === 0 ? 'female' : 'male'}_avatar_${(i % 6) + 1}.png`;

                            return (
                                <div
                                    key={i}
                                    onMouseEnter={() => isOccupied && !isMySeat && setHoveredUser({ tableId: activeTable.id, seatIndex: i })}
                                    onMouseLeave={() => setHoveredUser(null)}
                                    onClick={() => {
                                        if (isOccupied && !isMySeat) {
                                            setSelectedUserProfile({ id: i, name: mockName, avatar: avatarUrl, age: mockAge });
                                            setHoveredUser(null);
                                        }
                                    }}
                                    className={`absolute w-9 h-9 md:w-10 md:h-10 rounded-full border-[3px] transition-all cursor-${isOccupied && !isMySeat ? 'pointer' : 'default'} ${isOccupied ? `bg-cover bg-center shadow-2xl z-20 ${isMySeat ? 'border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.6)]' : (isVip ? 'neon-border-gold shadow-[0_0_10px_rgba(255,215,0,0.3)]' : 'neon-border-pink shadow-[0_0_10px_rgba(255,0,127,0.3)]')}` : 'border-white/5 bg-white/5 opacity-20 border-dashed z-0'} `}
                                    style={{
                                        left: pos.left,
                                        top: pos.top,
                                        backgroundImage: isOccupied ? `url('${avatarUrl}')` : 'none',
                                        zIndex: isHovered ? 40 : (isMySeat ? 30 : 20)
                                    }}
                                >
                                    {/* Profil Kartı (Hover) */}
                                    {isHovered && (
                                        <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-black/95 border border-white/20 rounded-xl p-3 shadow-[0_20px_50px_rgba(0,0,0,1)] w-48 animate-in zoom-in-95 duration-200 backdrop-blur-xl flex flex-col items-center gap-2 pointer-events-auto">
                                            <img src={avatarUrl} className="w-16 h-16 rounded-full border-2 border-neon-pink object-cover" />
                                            <div className="text-center">
                                                <div className="font-bold text-white text-sm flex items-center justify-center gap-1">
                                                    {mockName}, {mockAge}
                                                </div>
                                                <div className="text-[10px] text-white/50">Masadan birisi...</div>
                                            </div>
                                            <div className="flex flex-col gap-2 w-full mt-2">
                                                <button className="w-full bg-gradient-to-r from-neon-pink to-purple-600 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity whitespace-nowrap">
                                                    <Gift className="w-3.5 h-3.5" /> Hediye Gönder
                                                </button>
                                                <button className="w-full bg-white/10 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-white/20 transition-colors whitespace-nowrap">
                                                    <UserPlus className="w-3.5 h-3.5" /> Arkadaş Ekle
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Konuşan Kişinin Baloncuğu */}
                                    {isOccupied && hasMessage && !isHovered && (
                                        <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white text-black text-[12px] font-bold px-3 py-1.5 rounded-xl rounded-bl-none shadow-[0_0_20px_rgba(255,255,255,0.8)] whitespace-nowrap z-50 animate-bounce">
                                            {activeMessage.text}
                                            <div className="absolute -bottom-2 left-0 w-4 h-4 bg-white transform rotate-45 -z-10"></div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Sağ Taraf: Masaya Özel Kurallı Chat */}
                <div className="w-full h-1/2 md:h-full md:w-80 lg:w-96 border-t md:border-t-0 md:border-l border-white/10 flex flex-col bg-black/40 overflow-hidden shrink-0 z-10 mt-2 md:mt-4 lg:mt-6 rounded-tr-2xl">
                    <div className="p-4 border-b border-white/10 bg-black/60 shadow-md flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-white flex items-center gap-2">
                                {isVip ? <Wine className="w-4 h-4 text-gold-400" /> : <Users className="w-4 h-4 text-neon-pink" />}
                                Masa Sohbeti
                            </h3>
                            <p className="text-[10px] text-white/50 mt-0.5">Genel ahlak kuralları geçerlidir.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Video Call Button — sadece özel/VIP lokalarda göster */}
                            {isVip && (
                                <button
                                    onClick={() => {
                                        // Pick the first non-me occupant as demo target
                                        const otherIndex = 0;
                                        const otherName = MOCK_USER_NAMES[(activeTable.id + otherIndex) % MOCK_USER_NAMES.length];
                                        const otherAvatar = `/avatars/female_avatar_${(otherIndex % 6) + 1}.png`;
                                        setVideoCallTarget({ name: otherName, avatar: otherAvatar });
                                        setIsVideoCallOpen(true);
                                    }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-neon-pink/10 hover:bg-neon-pink/20 border border-neon-pink/30 rounded-full text-neon-pink text-xs font-bold transition-all hover:shadow-[0_0_10px_rgba(255,0,127,0.3)]"
                                >
                                    <Video className="w-3.5 h-3.5" /> Görüntülü
                                </button>
                            )}
                            <span className="text-xs bg-white/10 px-2 py-1 rounded-full text-white/80 font-bold">{totalUsers} Kişi</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 min-h-0">
                        {tableMessages.filter(m => !blockedUsers.includes(m.sender)).map((msg) => (
                            <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} text-sm`}>
                                {!msg.isMe && msg.avatar && (
                                    <img src={msg.avatar} alt={msg.sender} className="w-6 h-6 rounded-full mr-2 mt-1 border border-white/20 object-cover" />
                                )}
                                <div className={`flex flex-col max-w-[80%] ${msg.isMe ? 'items-end' : 'items-start'}`}>
                                    {!msg.isMe && msg.avatar && <span className="text-[10px] text-white/40 font-bold mb-0.5 ml-1">{msg.sender}</span>}
                                    <div className={`px-3 py-2 rounded-2xl text-[13px] ${msg.sender === "Sistem"
                                        ? 'bg-red-900/40 text-red-300 text-xs w-full text-center border border-red-500/20'
                                        : msg.isMe
                                            ? 'bg-gradient-to-r from-neon-pink to-purple-600 text-white rounded-tr-none shadow-[0_0_10px_rgba(255,0,127,0.3)]'
                                            : 'bg-white/10 text-white/95 rounded-tl-none border border-white/5'
                                        }`}>
                                        {msg.text}
                                    </div>
                                    <span className="text-[9px] text-white/30 font-medium mt-1 mx-1">{msg.time}</span>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-black/60 shrink-0">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Masaya yaz..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-neon-pink/50 transition-colors"
                            />
                            <button
                                type="submit"
                                disabled={!newMessage.trim()}
                                className="p-2 bg-neon-pink text-white rounded-xl hover:bg-neon-pink/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </form>

                    {/* Masadan Kalk Butonu (Chat Altı) */}
                    <div className="p-3 border-t border-white/10 bg-black/80 flex justify-center shrink-0">
                        <button
                            onClick={handleLeaveTable}
                            className="w-3/4 py-2 flex items-center justify-center gap-2 bg-gradient-to-r from-red-900 to-red-700 hover:from-red-800 hover:to-red-600 border border-red-500/50 rounded-lg text-white/90 hover:text-white text-xs font-bold transition-all shadow-[0_0_10px_rgba(220,38,38,0.2)] hover:shadow-[0_0_15px_rgba(220,38,38,0.4)]"
                        >
                            <ArrowLeft className="w-4 h-4" /> Masadan Kalk
                        </button>
                    </div>
                </div>

                {/* Public Profile View Modal - Focused View */}
                <PublicProfileModal
                    isOpen={!!selectedUserProfile}
                    onClose={() => setSelectedUserProfile(null)}
                    user={selectedUserProfile}
                />
            </div>
        );
    }

    // --- MAIN MEKAN VIEW (GENEL GÖRÜNÜM) ---
    return (
        <div className="w-full h-full flex flex-col relative overflow-hidden bg-transparent">

            {/* Üst Bar: Kişisel Özel Loca Durumu */}
            <div className={`shrink-0 w-full p-4 border-b transition-colors duration-500 bg-black/60 border-white/5 relative z-40`}>
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border bg-gradient-to-br from-red-900/50 to-black border-red-500/50 text-red-500 shadow-[0_0_15px_rgba(255,0,0,0.3)]`}>
                            <Wine className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className={`font-bold text-sm text-red-400`}>Özel Localarım</h3>
                            <p className="text-xs text-white/40">
                                Sadece karşılıklı onay ile açtığınız kapalı odalar.
                            </p>
                        </div>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setIsLocalarimOpen(!isLocalarimOpen)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${isLocalarimOpen ? 'bg-black border border-red-500/50 text-red-400 hover:bg-red-900/20' : 'bg-gradient-to-r from-gold-600 to-yellow-500 text-black hover:scale-105 shadow-[0_0_10px_rgba(255,215,0,0.3)]'}`}
                        >
                            <KeyRound className="w-3 h-3" /> Localarım (1)
                        </button>

                        {/* Dropdown for Localarım */}
                        {isLocalarimOpen && (
                            <div className="absolute top-12 right-0 w-72 bg-black/95 border border-red-500/30 rounded-xl shadow-[0_10px_30px_rgba(255,0,0,0.2)] backdrop-blur-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="p-3 border-b border-white/10 flex items-center justify-between bg-red-900/20">
                                    <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Onaylanmış Localar</span>
                                </div>
                                <div className="flex flex-col">
                                    {/* Mock Private Loca 1 */}
                                    <div className="p-3 hover:bg-white/5 transition-colors flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <img src="/avatars/female_avatar_2.png" className="w-8 h-8 rounded-full border border-white/20" alt="Ceren" />
                                                <div className="absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full border border-black shadow-[0_0_5px_rgba(34,197,94,0.8)]"></div>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-white group-hover:text-gold-400 transition-colors">Ceren ile Loca</span>
                                                <span className="text-[10px] text-green-400">Aktif Sohbet</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                // 99 is a mock ID for a private room
                                                setJoinedTableId(99);
                                                setIsLocalarimOpen(false);
                                            }}
                                            className="px-3 py-1.5 bg-white/10 group-hover:bg-gold-500 group-hover:text-black text-white text-xs font-bold rounded-lg transition-colors"
                                        >
                                            Git
                                        </button>
                                    </div>
                                </div>
                                <div className="p-2 border-t border-white/10 bg-black/50">
                                    <button className="w-full py-1.5 border border-dashed border-white/20 text-white/50 hover:text-white hover:border-white/50 text-[10px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1">
                                        <Users className="w-3 h-3" /> Yeni Loca Aç
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Ana Masalar Alanı */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 p-4 lg:p-8">
                <div className="text-center mb-10 shrink-0">
                    <h3 className="font-heading text-3xl font-bold text-gold-400 drop-shadow-[0_0_10px_rgba(255,215,0,0.5)] uppercase tracking-wider">Mekan Düzeni</h3>
                    <p className="text-sm text-white/60 mt-2">Dilediğin masaya veya genel locaya geç otur, profilleri incele, sohbete katıl.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-2 gap-y-2 lg:gap-y-4 w-full max-w-5xl mx-auto pb-10">
                    {ALL_TABLES.filter(t => t.id !== 99).map((table) => {
                        const isVip = table.type === "vip";
                        // In the main view, joinedTableId is null, so we just show currentUsers
                        const displayUsers = table.currentUsers;

                        return (
                            <div key={table.id} className="relative group flex flex-col items-center justify-center w-full aspect-square max-h-40 mt-2">

                                {/* Masa İsmi ve Oturma Butonu */}
                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-30">
                                    <div className="bg-black/90 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold text-white border border-white/10 whitespace-nowrap shadow-[0_0_20px_rgba(255,215,0,0.2)]">
                                        {table.name} <span className={isVip ? "text-gold-400" : "text-neon-pink"}>({displayUsers}/{table.capacity})</span>
                                    </div>
                                    <button
                                        onClick={() => handleJoinTable(table.id, table.currentUsers, table.capacity)}
                                        className={`px - 3 py - 1 rounded - full text - xs font - bold transition - transform hover: scale - 105 ${table.currentUsers >= table.capacity ? 'bg-gray-600 text-white cursor-not-allowed' : 'bg-neon-pink text-white'} `}
                                        disabled={table.currentUsers >= table.capacity}
                                    >
                                        Masaya Otur
                                    </button>
                                </div>

                                {/* Fiziksel Masa / Loca Çizimi */}
                                <div className={`${isVip ? 'w-32 h-20 rounded-3xl' : 'w-20 h-20 rounded-full'} border-[2px] flex flex-col items-center justify-center shadow-[0_0_20px_rgba(0,0,0,1)] z-10 transition-all ${displayUsers >= (table.capacity ?? 10) ? 'bg-red-900/30 border-red-500/30' : (isVip ? 'bg-black border-gold-500/30 group-hover:border-gold-500/80' : 'bg-black border-neon-pink/30 group-hover:border-neon-pink/80')} `}>
                                    <span className="text-2xl drop-shadow-lg opacity-90 group-hover:scale-110 transition-transform">{table.icon}</span>
                                    <span className={`text-[8px] font-black mt-0.5 uppercase tracking-tighter text-center leading-tight mx-2 ${isVip ? 'text-gold-400' : 'text-neon-pink'} `}>{table.name}</span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleJoinTable(table.id, table.currentUsers, table.capacity); }}
                                        className="mt-1 px-3 py-0.5 bg-white/10 hover:bg-white/20 rounded-full text-[7px] font-black uppercase text-white border border-white/20"
                                    >
                                        OTUR
                                    </button>
                                </div>

                                {/* Oturan Avatarlar ve Sandalyeler */}
                                {Array.from({ length: table.capacity }).map((_, i) => {
                                    const isOccupied = i < table.currentUsers;
                                    const pos = getSeatPosition(i, table.capacity, isVip);
                                    const hasMessage = activeMessage?.tableId === table.id && activeMessage?.seatIndex === i;
                                    const isHovered = hoveredUser?.tableId === table.id && hoveredUser?.seatIndex === i;

                                    // Mock User Details
                                    const mockName = MOCK_USER_NAMES[(table.id + i) % MOCK_USER_NAMES.length];
                                    const mockAge = 20 + ((table.id * i) % 15);
                                    const avatarUrl = `/avatars/${i % 2 === 0 ? 'female' : 'male'}_avatar_${(i % 6) + 1}.png`;

                                    return (
                                        <div
                                            key={i}
                                            onMouseEnter={() => isOccupied && setHoveredUser({ tableId: table.id, seatIndex: i })}
                                            onMouseLeave={() => setHoveredUser(null)}
                                            onClick={() => {
                                                if (isOccupied) {
                                                    setSelectedUserProfile({ id: i, name: mockName, avatar: avatarUrl, age: mockAge });
                                                    setHoveredUser(null);
                                                }
                                            }}
                                            className={`absolute w-7 h-7 rounded-full border-2 transition-all cursor-${isOccupied ? 'pointer' : 'default'} ${isOccupied ? `bg-cover bg-center shadow-lg z-20 ${isVip ? 'border-gold-400 shadow-[0_0_8px_rgba(255,215,0,0.3)] hover:scale-125' : 'border-neon-pink shadow-[0_0_8px_rgba(255,0,127,0.3)] hover:scale-125'}` : 'border-white/5 bg-white/5 opacity-10 border-dashed z-0'} `}
                                            style={{
                                                left: pos.left,
                                                top: pos.top,
                                                backgroundImage: isOccupied ? `url('${avatarUrl}')` : 'none',
                                                zIndex: isHovered ? 40 : 20
                                            }}
                                        >
                                            {/* Profil Popover */}
                                            {isHovered && (
                                                <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-black/95 border border-white/20 rounded-xl p-3 shadow-[0_10px_30px_rgba(0,0,0,0.9)] w-48 animate-in zoom-in-95 duration-200 backdrop-blur-xl flex flex-col items-center gap-2 pointer-events-auto">
                                                    <img src={avatarUrl} className="w-16 h-16 rounded-full border-2 border-neon-pink object-cover" />
                                                    <div className="text-center">
                                                        <div className="font-bold text-white text-sm flex items-center justify-center gap-1">
                                                            {mockName}, {mockAge}
                                                            {i % 3 === 0 && <span className="w-2 h-2 rounded-full bg-green-500 inline-block shadow-[0_0_5px_rgba(34,197,94,1)]"></span>}
                                                        </div>
                                                        <div className="text-[10px] text-white/50">"Müzik ve sinema tutkunu..."</div>
                                                    </div>
                                                    <div className="flex flex-col gap-2 w-full mt-2">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setGiftTarget({ name: mockName, avatar: avatarUrl }); setHoveredUser(null); }}
                                                            className="w-full bg-gradient-to-r from-neon-pink to-purple-600 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity whitespace-nowrap"
                                                        >
                                                            <Gift className="w-3.5 h-3.5" /> Hediye Gönder
                                                        </button>
                                                        <button className="w-full bg-white/10 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-white/20 transition-colors whitespace-nowrap">
                                                            <UserPlus className="w-3.5 h-3.5" /> Arkadaş Ekle
                                                        </button>
                                                    </div>
                                                    {/* Triangle pointer */}
                                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-black/95 border-t border-l border-white/20 transform rotate-45"></div>
                                                </div>
                                            )}

                                            {/* Chat Bubble */}
                                            {isOccupied && hasMessage && !isHovered && (
                                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded-lg rounded-bl-none shadow-[0_0_15px_rgba(255,255,255,0.8)] whitespace-nowrap z-50 animate-in zoom-in duration-200">
                                                    {activeMessage.text}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Alt Menü silindi */}

            {/* Public Profile View Modal */}
            <PublicProfileModal
                isOpen={!!selectedUserProfile}
                onClose={() => setSelectedUserProfile(null)}
                user={selectedUserProfile}
            />

            {/* Direct Gift Modal (from seat hover) */}
            {giftTarget && (
                <GiftModal
                    isOpen={!!giftTarget}
                    onClose={() => setGiftTarget(null)}
                    recipientName={giftTarget.name}
                    recipientAvatar={giftTarget.avatar}
                    onCreditRedirect={() => { setGiftTarget(null); setIsCreditModalOpen(true); }}
                />
            )}

            {/* Credit Modal (opened from gift insufficient balance) */}
            <CreditModal
                isOpen={isCreditModalOpen}
                onClose={() => setIsCreditModalOpen(false)}
            />

            {/* Video Call Modal — özel loca görüntülü görüşme */}
            <VideoCallModal
                isOpen={isVideoCallOpen}
                onClose={() => { setIsVideoCallOpen(false); setVideoCallTarget(null); }}
                remoteUser={videoCallTarget}
                role="caller"
            />
        </div>
    );
}
