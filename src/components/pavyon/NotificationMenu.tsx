import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Bell, Heart, Gift, UserPlus, Check, X, Wine } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";

export function NotificationMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const notifications = useUserStore(state => state.notifications);
    const blockedUsers = useUserStore(state => state.blockedUsers);
    const removeNotification = useUserStore(state => state.removeNotification);
    const clearNotifications = useUserStore(state => state.clearNotifications);
    const setJoinedTableId = useUserStore(state => state.setJoinedTableId);
    const addFriend = useUserStore(state => state.addFriend);

    // Filter notifications from blocked users
    const filteredNotifications = notifications.filter(n => !blockedUsers.includes(n.user));
    const unreadCount = filteredNotifications.length;

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleOpen = () => {
        setIsOpen(!isOpen);
    };

    const handleAcceptFriend = (id: number, user: string, avatar: string) => {
        addFriend({ id: String(id), name: user, avatar });
        removeNotification(id);
    };

    const handleAcceptLocaInvite = (id: number, tableId?: number) => {
        if (tableId) setJoinedTableId(tableId);
        removeNotification(id);
        setIsOpen(false);
    };

    const panel = isOpen && mounted ? createPortal(
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-[9000]" onClick={() => setIsOpen(false)} />

            {/* Dropdown - Fixed for Mobile (centered with margins) and md:w-80 for desktop near the button */}
            <div
                className="fixed z-[9001] top-16 right-4 left-4 md:left-auto md:right-10 md:w-80 bg-black/95 border border-white/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-neon-pink/10 to-transparent">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <Bell className="w-4 h-4 text-neon-pink" /> Bildirimler
                    </h3>
                    {unreadCount > 0 && (
                        <button
                            onClick={() => clearNotifications()}
                            className="text-[10px] text-white/50 hover:text-white transition-colors"
                        >
                            Tümünü Temizle
                        </button>
                    )}
                </div>

                {/* List */}
                <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 p-2">
                    {filteredNotifications.length === 0 ? (
                        <div className="text-center py-8 text-white/40 text-sm">
                            <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                            Yeni bildiriminiz yok.
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {filteredNotifications.map((notif) => (
                                <div key={notif.id} className="flex items-start gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group">
                                    {/* Avatar */}
                                    <div className="relative shrink-0">
                                        <img src={notif.avatar} alt={notif.user} className="w-10 h-10 rounded-full object-cover border border-white/20" />
                                        <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-black border border-white/20">
                                            {notif.type === 'friend_request' && <UserPlus className="w-3 h-3 text-purple-400" />}
                                            {notif.type === 'gift' && <Gift className="w-3 h-3 text-neon-pink" />}
                                            {notif.type === 'like' && <Heart className="w-3 h-3 text-red-500 fill-red-500" />}
                                            {notif.type === 'loca_invite' && <Wine className="w-3 h-3 text-gold-400" />}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-white/90 leading-tight">
                                            <span className="font-bold text-white">{notif.user}</span>
                                            {notif.type === 'friend_request' && ' sana arkadaşlık isteği gönderdi.'}
                                            {notif.type === 'gift' && ` sana ${notif.giftName} gönderdi!`}
                                            {notif.type === 'like' && ' profilinize beğeni bıraktı.'}
                                            {notif.type === 'loca_invite' && ' seni Locasına davet ediyor!'}
                                        </p>
                                        <span className="text-[10px] text-white/40 mt-1 block">{notif.time}</span>

                                        {notif.type === 'friend_request' && (
                                            <div className="flex gap-2 mt-2">
                                                <button
                                                    onClick={() => handleAcceptFriend(notif.id, notif.user, notif.avatar)}
                                                    className="flex-1 bg-neon-pink/20 hover:bg-neon-pink text-neon-pink hover:text-white text-[10px] font-bold py-1.5 rounded-lg flex items-center justify-center gap-1 border border-neon-pink/30 transition-all"
                                                >
                                                    <Check className="w-3 h-3" /> Kabul Et
                                                </button>
                                                <button
                                                    onClick={() => removeNotification(notif.id)}
                                                    className="flex-1 bg-white/5 hover:bg-white/10 text-white/60 text-[10px] font-bold py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all"
                                                >
                                                    <X className="w-3 h-3" /> Sil
                                                </button>
                                            </div>
                                        )}

                                        {notif.type === 'loca_invite' && (
                                            <div className="flex gap-2 mt-2">
                                                <button
                                                    onClick={() => handleAcceptLocaInvite(notif.id, notif.tableId)}
                                                    className="flex-1 bg-gold-400 text-black hover:bg-yellow-400 text-[10px] font-bold py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all shadow-[0_0_10px_rgba(255,215,0,0.5)]"
                                                >
                                                    <Wine className="w-3 h-3" /> Masaya Geç
                                                </button>
                                                <button
                                                    onClick={() => removeNotification(notif.id)}
                                                    className="w-8 shrink-0 bg-white/5 hover:bg-white/10 text-white/60 text-[10px) font-bold py-1.5 rounded-lg flex items-center justify-center transition-all"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {notif.type !== 'friend_request' && notif.type !== 'loca_invite' && (
                                        <button
                                            onClick={() => removeNotification(notif.id)}
                                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded-md text-white/40 hover:text-white transition-all shrink-0"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>,
        document.body
    ) : null;

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                onClick={handleOpen}
                className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
            >
                <Bell className="w-6 h-6 text-white/80" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-neon-pink rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-[0_0_10px_rgba(255,0,127,0.8)] border border-black animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            {panel}
        </div>
    );
}
