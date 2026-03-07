import { Trophy } from "lucide-react";

const TOP_10 = [
    { id: 1, name: "Ceren", avatar: "/avatars/female_avatar_2.png", giftAmount: "15K", age: 24 },
    { id: 2, name: "Ahmet", avatar: "/avatars/male_avatar_3.png", giftAmount: "12K", age: 27 },
    { id: 3, name: "Ayşe", avatar: "/avatars/female_avatar_4.png", giftAmount: "9.5K", age: 22 },
    { id: 4, name: "Mehmet", avatar: "/avatars/male_avatar_1.png", giftAmount: "8K", age: 30 },
    { id: 5, name: "Elif", avatar: "/avatars/female_avatar_1.png", giftAmount: "7.2K", age: 23 },
    { id: 6, name: "Can", avatar: "/avatars/male_avatar_2.png", giftAmount: "6.5K", age: 25 },
    { id: 7, name: "Zeynep", avatar: "/avatars/female_avatar_3.png", giftAmount: "5K", age: 21 },
    { id: 8, name: "Burak", avatar: "/avatars/male_avatar_4.png", giftAmount: "4.8K", age: 28 },
    { id: 9, name: "Fatma", avatar: "/avatars/female_avatar_5.png", giftAmount: "4K", age: 26 },
    { id: 10, name: "Kaan", avatar: "/avatars/male_avatar_5.png", giftAmount: "3.5K", age: 29 }
];

interface TopReceiversProps {
    users?: Array<{ id: string | number; name: string; avatar: string; age: number; amount?: string | number }>;
    onUserClick?: (user: { id: any; name: string; avatar: string; age: number }) => void;
}

export function TopReceivers({ users = [], onUserClick }: TopReceiversProps) {
    if (users.length === 0) return null; // Or show placeholder

    return (
        <div className="flex items-center justify-center gap-4 bg-black/40 px-6 py-2 rounded-full border border-white/5 mx-4 shrink-0 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-1.5 shrink-0">
                <Trophy className="w-4 h-4 text-gold-400 drop-shadow-[0_0_5px_rgba(255,215,0,0.8)]" />
                <span className="text-[10px] font-bold text-gold-400 uppercase tracking-widest leading-none">Top 10</span>
            </div>

            <div className="flex items-center gap-2 border-l border-white/10 pl-3">
                {users.map((user, index) => (
                    <div
                        key={user.id}
                        className="relative group cursor-pointer flex shrink-0"
                        onClick={() => onUserClick?.({ id: user.id, name: user.name, avatar: user.avatar, age: user.age })}
                    >
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className={`w-12 h-12 rounded-full border-2 border-white/20 object-cover transition-transform hover:scale-110 ${index < 3 ? 'border-gold-400 shadow-[0_0_15px_rgba(255,215,0,0.5)]' : 'hover:border-neon-pink'}`}
                        />
                        {/* Number Badge */}
                        <div className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-black border-2 border-black/80 shadow-md ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-300' : index === 2 ? 'bg-amber-700' : 'bg-white/80 text-black/80'}`}>
                            {index + 1}
                        </div>

                        {/* Hover Tooltip */}
                        <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-black/95 text-white text-xs font-bold px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-[9999] pointer-events-none border border-white/10 flex flex-col items-center shadow-xl">
                            <span>{user.name}</span>
                            <span className="text-neon-pink text-[10px] mt-0.5">{user.amount || '0'} Hediye</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
