import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, UserPlus, UserMinus, Gift, Image as ImageIcon, Wine, Check, ShieldBan, ShieldCheck } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { GiftModal } from "@/components/pavyon/GiftModal";

export interface PublicProfileProps {
    isOpen: boolean;
    onClose: () => void;
    user: {
        id: number | string;
        name: string;
        avatar: string;
        age?: number;
        bio?: string;
        interests?: string[];
        photos?: string[];
    } | null;
}

export function PublicProfileModal({ isOpen, onClose, user }: PublicProfileProps) {
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const [inviteSent, setInviteSent] = useState(false);
    const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<"unfriend" | "block" | null>(null);
    const [requestSent, setRequestSent] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const { id: userId, nickname, avatarUrl, credits, id: meId, setFriends, setBlockedUsers, showToast, addNotification, joinedTableId, addFriend, removeFriend, blockUser, unblockUser, isFriend, isBlocked } = useUserStore();
    const me = { id: userId };

    useEffect(() => { setMounted(true); }, []);

    if (!isOpen || !user || !mounted) return null;

    const bio = user.bio || "Hayatı yaşamayı severim. Pavyon gecelerinde görüşürüz.";
    const interests = user.interests || ["Müzik", "Sinema", "Eğlence", "Sohbet"];
    const photos = user.photos || [user.avatar, "/avatars/male_avatar_2.png", "/avatars/female_avatar_3.png"];

    const blocked = isBlocked(user.name);
    const friend = isFriend(user.name);



    const handleConfirm = async () => {
        if (!user.id) return;

        try {
            if (confirmAction === "block") {
                await fetch("/api/blocks", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ blockerId: me.id, blockedId: user.id })
                });
                blockUser(user.name);
            } else if (confirmAction === "unfriend") {
                await fetch("/api/friends", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ senderId: me.id, receiverId: user.id, action: "REMOVE" })
                });
                removeFriend(user.name);
            }
        } catch (e) {
            console.error("Action failed", e);
        }
        setConfirmAction(null);
        onClose();
    };

    const handleFriendRequest = async () => {
        if (!user.id || isSending || requestSent) return;
        setIsSending(true);
        try {
            const res = await fetch("/api/friends", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ senderId: me.id, receiverId: String(user.id), action: "REQUEST" })
            });
            const data = await res.json();
            if (!res.ok) {
                showToast(data.error || "İstek gönderilemedi.", "error");
                setIsSending(false);
                return;
            }
            setRequestSent(true);
            showToast(`${user.name} adlı kişiye arkadaşlık isteği gönderildi!`, "success");
        } catch (e) {
            showToast("İstek gönderilemedi, bir sorun oluştu.", "error");
        }
        setIsSending(false);
    };

    const handleUnblock = async () => {
        if (!user.id) return;
        try {
            await fetch("/api/blocks", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ blockerId: me.id, blockedId: user.id })
            });
            unblockUser(user.name);
        } catch (e) {
            console.error("Unblock failed", e);
        }
    };

    const profileModal = createPortal(
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />

            <div className="relative w-full max-w-md bg-[#0d0714] border border-white/20 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.9)] overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

                {/* Header - Smaller for Mobile */}
                <div className="h-24 md:h-32 bg-gradient-to-br from-neon-pink/40 via-purple-900/40 to-black relative shrink-0">
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors backdrop-blur-md z-10">
                        <X className="w-5 h-5" />
                    </button>
                    <div className="absolute -bottom-10 left-6 md:-bottom-12">
                        <img src={user.avatar} alt={user.name} className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-[#0d0714] object-cover shadow-[0_0_20px_rgba(255,0,127,0.4)]" />
                    </div>
                </div>

                {/* Profile Info - Fixed Scrolling for Mobile */}
                <div className="pt-10 md:pt-14 px-4 md:px-6 pb-6 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                {user.name} <span className="text-white/50 text-lg font-normal">, {user.age || 24}</span>
                            </h2>
                            <p className="text-xs text-gold-400 font-bold tracking-widest uppercase mt-1">
                                {blocked ? "🚫 Engellendi" : friend ? "✅ Arkadaş" : "Sürekli Müşteri"}
                            </p>
                        </div>
                    </div>

                    {!blocked && (
                        <div className="space-y-6 mt-6">
                            <div>
                                <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Hakkında</h3>
                                <p className="text-sm text-white/90 bg-white/5 p-4 rounded-xl border border-white/5 leading-relaxed">&quot;{bio}&quot;</p>
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">İlgi Alanları</h3>
                                <div className="flex flex-wrap gap-2">
                                    {interests.map((interest, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-white/10 text-white/80 text-xs rounded-full border border-white/10">{interest}</span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4" /> Fotoğraflar
                                </h3>
                                <div className="grid grid-cols-3 gap-2">
                                    {photos.map((photo, idx) => (
                                        <div key={idx} className="aspect-square rounded-xl overflow-hidden cursor-pointer border border-white/10 hover:border-neon-pink transition-colors group" onClick={() => setSelectedPhoto(photo)}>
                                            <img src={photo} alt={`${user.name} foto ${idx + 1}`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 duration-500 transition-all" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {blocked && (
                        <div className="mt-8 text-center text-white/40 text-sm">
                            Bu kullanıcıyı engellediniz. İçerikleri görüntülenemiyor.
                        </div>
                    )}
                </div>

                {/* Bottom Actions */}
                <div className="p-4 bg-black/50 border-t border-white/10 shrink-0 backdrop-blur-md space-y-3">
                    {/* Confirm Dialog */}
                    {confirmAction && (
                        <div className="p-3 bg-red-900/40 border border-red-500/30 rounded-xl flex flex-col gap-2 animate-in fade-in">
                            <p className="text-sm text-white font-bold text-center">
                                {confirmAction === "block"
                                    ? `${user.name} adlı kullanıcıyı engellemek istediğinize emin misiniz?`
                                    : `${user.name} adlı kullanıcıyı arkadaşlıktan çıkarmak istediğinize emin misiniz?`}
                            </p>
                            <div className="flex gap-2">
                                <button onClick={handleConfirm} className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg transition-all">
                                    {confirmAction === "block" ? "Evet, Engelle" : "Evet, Çıkar"}
                                </button>
                                <button onClick={() => setConfirmAction(null)} className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-all">
                                    Vazgeç
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-3 gap-2">
                        {/* Hediye Gönder */}
                        <button
                            onClick={() => {
                                if (blocked) return;
                                setIsGiftModalOpen(true);
                            }}
                            disabled={blocked}
                            className={`col-span-1 font-bold py-3 text-[10px] md:text-sm rounded-xl flex items-center justify-center gap-1 transition-all ${blocked ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-gradient-to-r from-neon-pink to-purple-600 text-white shadow-[0_0_15px_rgba(255,0,127,0.3)] hover:opacity-90'}`}
                        >
                            <Gift className="w-4 h-4" /> <span className="hidden md:inline">Hediye</span> Gönder
                        </button>

                        {/* Arkadaş Ekle / Çıkar / Engeli Kaldır */}
                        {blocked ? (
                            <button onClick={handleUnblock} className="col-span-1 bg-white/10 hover:bg-white/20 text-green-400 font-bold py-3 text-[10px] md:text-sm rounded-xl flex items-center justify-center gap-1 transition-all border border-green-500/20">
                                <ShieldCheck className="w-4 h-4" /> Engeli Kaldır
                            </button>
                        ) : friend ? (
                            <button onClick={() => setConfirmAction("unfriend")} className="col-span-1 bg-white/10 hover:bg-red-900/30 text-white/80 hover:text-red-400 font-bold py-3 text-[10px] md:text-sm rounded-xl flex items-center justify-center gap-1 transition-all border border-white/5">
                                <UserMinus className="w-4 h-4" /> <span className="hidden md:inline">Arkadaşlıktan</span> Çıkar
                            </button>
                        ) : requestSent ? (
                            <button disabled className="col-span-1 bg-white/10 text-green-400 font-bold py-3 text-[10px] md:text-sm rounded-xl flex items-center justify-center gap-1 border border-green-500/20 cursor-not-allowed">
                                <Check className="w-4 h-4" /> İstek Gönderildi
                            </button>
                        ) : (
                            <button
                                onClick={handleFriendRequest}
                                disabled={isSending}
                                className={`col-span-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 text-[10px] md:text-sm rounded-xl flex items-center justify-center gap-1 transition-all border border-white/5 ${isSending ? 'opacity-50 cursor-wait' : ''}`}
                            >
                                <UserPlus className="w-4 h-4" /> {isSending ? 'Gönderiliyor...' : 'Arkadaş Ekle'}
                            </button>
                        )}

                        {/* Davet / Engelle */}
                        {blocked ? (
                            <button disabled className="col-span-1 bg-white/5 text-white/30 font-bold py-3 text-[10px] md:text-sm rounded-xl flex items-center justify-center gap-1 cursor-not-allowed border border-white/5">
                                <ShieldBan className="w-4 h-4" /> Engellendi
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    if (inviteSent) return;
                                    setInviteSent(true);
                                    addNotification({ type: "loca_invite", user: user.name, avatar: user.avatar, userId: String(user.id) });
                                    setTimeout(() => { onClose(); setInviteSent(false); }, 1500);
                                }}
                                className={`col-span-1 font-bold py-3 text-[10px] md:text-sm rounded-xl flex items-center justify-center gap-1 transition-all ${inviteSent ? 'bg-green-600 text-white' : 'bg-gold-500 hover:bg-yellow-400 text-black shadow-[0_0_15px_rgba(255,215,0,0.4)]'}`}
                            >
                                {inviteSent ? <Check className="w-4 h-4" /> : <Wine className="w-4 h-4" />}
                                {inviteSent ? "Gönderildi" : "Masaya Davet"}
                            </button>
                        )}
                    </div>

                    {/* Block button (always visible, small) */}
                    {!blocked && (
                        <button onClick={() => setConfirmAction("block")} className="w-full py-2 text-[10px] text-red-500/60 hover:text-red-400 transition-colors flex items-center justify-center gap-1">
                            <ShieldBan className="w-3 h-3" /> Bu kullanıcıyı engelle
                        </button>
                    )}
                </div>
            </div>

            {/* Photo viewer */}
            {selectedPhoto && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-200" onClick={() => setSelectedPhoto(null)}>
                    <button className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors" onClick={() => setSelectedPhoto(null)}>
                        <X className="w-6 h-6" />
                    </button>
                    <img src={selectedPhoto} alt="Büyük format" className="max-w-[90vw] max-h-[90vh] rounded-2xl object-contain shadow-[0_0_50px_rgba(255,0,127,0.2)] animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()} />
                </div>
            )}
        </div>,
        document.body
    );

    return (
        <>
            {profileModal}
            {isGiftModalOpen && user && createPortal(
                <GiftModal
                    isOpen={isGiftModalOpen}
                    onClose={() => setIsGiftModalOpen(false)}
                    recipientName={user.name}
                    recipientAvatar={user.avatar}
                    recipientId={String(user.id)}
                />,
                document.body
            )}
        </>
    );
}
