import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Notification {
    id: number;
    type: "friend_request" | "gift" | "like" | "loca_invite";
    user: string;
    avatar: string;
    time: string;
    giftName?: string;
    tableId?: number;
}

export interface FriendEntry {
    id: string;
    name: string;
    avatar: string;
}

export interface UserState {
    id: string;
    nickname: string;
    avatarUrl?: string;
    gender?: string;
    credits: number;
    isLoggedIn: boolean;
    joinedTableId: number | null;
    notifications: Notification[];
    friends: FriendEntry[];
    blockedUsers: string[]; // stores user names (or ids)

    login: (nickname: string, avatarUrl?: string, gender?: string) => void;
    logout: () => void;
    addCredits: (amount: number) => void;
    removeCredits: (amount: number) => void;
    setJoinedTableId: (id: number | null) => void;
    addNotification: (notif: Omit<Notification, "id" | "time">) => void;
    removeNotification: (id: number) => void;
    clearNotifications: () => void;

    // Friend & block actions
    addFriend: (friend: FriendEntry) => void;
    removeFriend: (name: string) => void;
    blockUser: (name: string) => void;
    unblockUser: (name: string) => void;
    isBlocked: (name: string) => boolean;
    isFriend: (name: string) => boolean;
}


export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            id: "",
            nickname: "",
            avatarUrl: "",
            gender: "",
            credits: 0,
            isLoggedIn: false,
            joinedTableId: null,
            notifications: [
                { id: 1, type: "friend_request", user: "Ceren", avatar: "/avatars/female_avatar_2.png", time: "5 dk önce" },
            ],
            friends: [],
            blockedUsers: [],

            login: (nickname, avatarUrl, gender) =>
                set({
                    id: Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
                    nickname,
                    avatarUrl,
                    gender,
                    credits: 100,
                    isLoggedIn: true
                }),
            logout: () => set({ id: "", nickname: "", avatarUrl: "", gender: "", credits: 0, isLoggedIn: false, joinedTableId: null, notifications: [], friends: [], blockedUsers: [] }),
            addCredits: (amount) => set((state) => ({ credits: state.credits + amount })),
            removeCredits: (amount) => set((state) => ({ credits: Math.max(0, state.credits - amount) })),
            setJoinedTableId: (id) => set({ joinedTableId: id }),
            addNotification: (notif) => set((state) => ({
                notifications: [{ ...notif, id: Date.now(), time: "Şimdi" }, ...state.notifications]
            })),
            removeNotification: (id) => set((state) => ({
                notifications: state.notifications.filter(n => n.id !== id)
            })),
            clearNotifications: () => set({ notifications: [] }),

            // Friend management
            addFriend: (friend) => set((state) => ({
                friends: state.friends.some(f => f.name === friend.name)
                    ? state.friends
                    : [...state.friends, friend]
            })),
            removeFriend: (name) => set((state) => ({
                friends: state.friends.filter(f => f.name !== name)
            })),

            // Block management
            blockUser: (name) => set((state) => ({
                blockedUsers: state.blockedUsers.includes(name)
                    ? state.blockedUsers
                    : [...state.blockedUsers, name],
                // Also remove from friends if they were a friend
                friends: state.friends.filter(f => f.name !== name),
            })),
            unblockUser: (name) => set((state) => ({
                blockedUsers: state.blockedUsers.filter(u => u !== name)
            })),

            // Selectors
            isBlocked: (name) => get().blockedUsers.includes(name),
            isFriend: (name) => get().friends.some(f => f.name === name),
        }),
        {
            name: "pavyon-user-storage",
        }
    )
);
