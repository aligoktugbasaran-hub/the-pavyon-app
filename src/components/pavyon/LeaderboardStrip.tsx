

const TOP_USERS = [
    { id: 1, name: "Gece Kuşu", avatar: "/avatars/female_avatar_1.png", amount: "₺4,500", rank: 1 },
    { id: 2, name: "Kral", avatar: "/avatars/male_avatar_1.png", amount: "₺3,200", rank: 2 },
    { id: 3, name: "Prens", avatar: "/avatars/male_avatar_5.png", amount: "₺2,100", rank: 3 },
    { id: 4, name: "Cemil", avatar: "/avatars/male_avatar_2.png", amount: "₺1,800", rank: 4 },
    { id: 5, name: "Afet", avatar: "/avatars/female_avatar_3.png", amount: "₺1,500", rank: 5 },
    { id: 6, name: "Suskun", avatar: "/avatars/male_avatar_3.png", amount: "₺1,200", rank: 6 },
    { id: 7, name: "Gül", avatar: "/avatars/female_avatar_4.png", amount: "₺900", rank: 7 },
    { id: 8, name: "Yalnız Kurt", avatar: "/avatars/male_avatar_4.png", amount: "₺850", rank: 8 },
    { id: 9, name: "Ceylan", avatar: "/avatars/female_avatar_5.png", amount: "₺600", rank: 9 },
    { id: 10, name: "Vefasız", avatar: "/avatars/male_avatar_6.png", amount: "₺450", rank: 10 },
];

export function LeaderboardStrip({ onUserClick }: { onUserClick: (user: any) => void }) {
    return (
        <div className="w-full shrink-0 flex gap-2">
            {TOP_USERS.map((user, idx) => (
                <div
                    key={user.id}
                    onClick={() => onUserClick({ id: user.id, name: user.name, avatar: user.avatar, age: 25 + idx })}
                    className="flex-1 flex flex-col items-center justify-center p-2 rounded-xl bg-black/40 border border-white/5 hover:bg-white/10 hover:border-gold-500/50 transition-all cursor-pointer group shadow-lg"
                >
                    <div className="relative mb-1.5 transition-transform duration-200 group-hover:scale-110">
                        <img
                            src={user.avatar}
                            className={`w-12 h-12 rounded-full object-cover border-2 shadow-[0_0_10px_rgba(255,20,147,0.15)] ${idx < 3 ? 'border-gold-400 shadow-[0_0_15px_rgba(255,215,0,0.4)]' : 'border-white/20'}`}
                            alt={user.name}
                        />
                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-black/80 backdrop-blur-md flex items-center justify-center text-[9px] font-black border border-white/20 text-white shadow-md">
                            {idx + 1}
                        </div>
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-center text-white/90 truncate w-full group-hover:text-white">
                        {user.name}
                    </span>
                    <span className="text-[9px] text-neon-pink/80 font-bold mt-0.5 group-hover:text-neon-pink">
                        {user.amount}
                    </span>
                </div>
            ))}

        </div>
    );
}
