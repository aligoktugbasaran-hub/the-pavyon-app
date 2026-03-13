/**
 * useSocket — Pavyon Socket.io istemci hook'u
 *
 * Kullanım:
 *   const { sendMessage, messages, onlineUsers, isConnected } = useSocket({ roomType: "global" });
 *   const { sendMessage, messages, onlineUsers, isConnected } = useSocket({ roomType: "table", tableId: 3 });
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useUserStore } from "@/store/useUserStore";

export interface SocketMessage {
    id: string;
    content: string;
    senderId: string;
    senderNickname: string;
    senderAvatar: string;
    roomType: string;
    tableId: number | null;
    createdAt: string;
}

export interface RoomUser {
    socketId: string;
    userId: string;
    nickname: string;
    avatar: string;
}

interface UseSocketOptions {
    roomType: "global" | "table";
    tableId?: number | null;
    enabled?: boolean; // Bağlantı aktif mi? (false = hook devre dışı)
}

// Singleton socket — tüm hook instanceları aynı soketi paylaşır
let globalSocket: Socket | null = null;

function getSocket(): Socket | null {
    if (typeof window === "undefined") return null;

    const isCapacitor = !!(window as any).Capacitor?.isNativePlatform?.() ||
        window.location.protocol === "capacitor:" ||
        window.location.protocol === "file:";

    const baseUrl = isCapacitor
        ? "https://the-pavyon-app-production.up.railway.app"
        : "";

    // Mobilde NEXT_PUBLIC_API_URL tanımlı değilse WebSocket'i devre dışı bırak
    if (isCapacitor && !baseUrl) {
        console.warn("[useSocket] Mobil ortamda NEXT_PUBLIC_API_URL tanımlı değil, WebSocket devre dışı.");
        return null;
    }

    if (!globalSocket || !globalSocket.connected) {
        globalSocket = io(baseUrl, {
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 2000,
            transports: ["websocket", "polling"],
        });
    }
    return globalSocket;
}

export function useSocket({ roomType, tableId = null, enabled = true }: UseSocketOptions) {
    const { id: userId, nickname, avatarUrl } = useUserStore();
    const socketRef = useRef<Socket | null>(null);

    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState<SocketMessage[]>([]);
    const [onlineUsers, setOnlineUsers] = useState<RoomUser[]>([]);
    const [typingUsers, setTypingUsers] = useState<string[]>([]);

    const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!enabled || !userId) {
            setIsConnected(false);
            return;
        }

        const socket = getSocket();
        if (!socket) {
            setIsConnected(false);
            return;
        }
        socketRef.current = socket;

        // ── Bağlantı olayları ──
        const onConnect = () => {
            setIsConnected(true);
            // Kullanıcı kimliğini gönder
            socket.emit("user:join", { userId, nickname, avatar: avatarUrl });
            // Odaya gir
            socket.emit("room:join", { roomType, tableId });
        };

        const onDisconnect = () => {
            setIsConnected(false);
        };

        // ── Mesajlar ──
        const onHistory = (history: SocketMessage[]) => {
            setMessages(history);
        };

        const onNewMessage = (msg: SocketMessage) => {
            setMessages((prev) => {
                // Aynı id varsa eklemiyoruz (double prevention)
                if (prev.some((m) => m.id === msg.id)) return prev;
                const updated = [...prev, msg];
                // 200'den fazla mesaj varsa en eski 100'ü sil
                if (updated.length > 200) {
                    return updated.slice(-100);
                }
                return updated;
            });
        };

        // ── Oda kullanıcıları ──
        const onRoomUsers = (users: RoomUser[]) => {
            setOnlineUsers(users);
        };

        // ── Yazıyor göstergesi ──
        const onTypingUpdate = ({ nickname: nick, isTyping }: { nickname: string; isTyping: boolean }) => {
            setTypingUsers((prev) =>
                isTyping
                    ? prev.includes(nick) ? prev : [...prev, nick]
                    : prev.filter((n) => n !== nick)
            );
        };

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("room:history", onHistory);
        socket.on("message:new", onNewMessage);
        socket.on("room:users", onRoomUsers);
        socket.on("typing:update", onTypingUpdate);

        // Zaten bağlıysa hemen join et
        if (socket.connected) {
            onConnect();
        }

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("room:history", onHistory);
            socket.off("message:new", onNewMessage);
            socket.off("room:users", onRoomUsers);
            socket.off("typing:update", onTypingUpdate);

            // Odadan çık (component unmount olduğunda)
            socket.emit("room:leave");
            setMessages([]);
            setOnlineUsers([]);
            setTypingUsers([]);
        };
    }, [enabled, userId, roomType, tableId]);

    // ── MESAJ GÖNDER ──
    const sendMessage = useCallback(
        (content: string) => {
            if (!socketRef.current || !content.trim()) return;
            socketRef.current.emit("message:send", { content, roomType, tableId });
            socketRef.current.emit("typing:stop", { roomType, tableId });
        },
        [roomType, tableId]
    );

    const notifyTyping = useCallback(() => {
        if (!socketRef.current) return;
        socketRef.current.emit("typing:start", { roomType, tableId });
        if (typingTimer.current) clearTimeout(typingTimer.current);
        typingTimer.current = setTimeout(() => {
            socketRef.current?.emit("typing:stop", { roomType, tableId });
        }, 2000);
    }, [roomType, tableId]);

    return { isConnected, messages, onlineUsers, typingUsers, sendMessage, notifyTyping };
}
