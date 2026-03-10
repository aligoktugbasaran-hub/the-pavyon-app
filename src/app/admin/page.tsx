"use client";

import React, { useState, useEffect } from "react";
import {
    Users,
    Gift,
    TrendingUp,
    ShieldCheck,
    Search,
    Plus,
    Minus,
    Ban,
    Check,
    LayoutDashboard,
    Settings,
    Bell,
    LogOut,
    Lock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { useUserStore } from "@/store/useUserStore";
import { PavyonToast } from "@/components/pavyon/PavyonToast";

// Mock data for Admin simulation
const INITIAL_USERS = [
    { id: 1, name: "Baron", credits: 50000, status: "active", joined: "2024-03-01", totalSent: 12500 },
    { id: 2, name: "Selin", credits: 1200, status: "active", joined: "2024-03-02", totalEarned: 2500 },
    { id: 3, name: "Reis", credits: 35000, status: "active", joined: "2024-03-01", totalSent: 8000 },
    { id: 4, name: "Buse", credits: 450, status: "active", joined: "2024-03-03", totalEarned: 1200 },
    { id: 5, name: "Ceren", credits: 8900, status: "active", joined: "2024-03-01", totalEarned: 4500 },
];

const INITIAL_GIFTS = [
    { id: 1, sender: "Baron", receiver: "Selin", gift: "Kral Tacı", price: 10000, earnings: 2000, time: "10 dk önce" },
    { id: 2, sender: "Reis", receiver: "Buse", gift: "Elmas", price: 5000, earnings: 1000, time: "25 dk önce" },
    { id: 3, sender: "Dayı", receiver: "Ceren", gift: "Şampanya", price: 1500, earnings: 300, time: "1 saat önce" },
];

export default function AdminDashboard() {
    const [isAuthed, setIsAuthed] = useState(false);
    const [password, setPassword] = useState("");
    const [activeTab, setActiveTab] = useState("dashboard");
    const [users, setUsers] = useState(INITIAL_USERS);
    const [gifts, setGifts] = useState(INITIAL_GIFTS);
    const [searchTerm, setSearchTerm] = useState("");

    // Simple Admin Auth Verification
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === "pavyon2024") { // Hardcoded for prototype
            setIsAuthed(true);
        } else {
            useUserStore.getState().showToast("Yanlış Şifre!", "error");
        }
    };

    if (!isAuthed) {
        return (
            <div className="min-h-screen bg-[#05000a] flex items-center justify-center p-4">
                <div className="fixed inset-0 pavyon-grid opacity-10 pointer-events-none" />
                <PavyonToast />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md"
                >
                    <GlassCard className="p-8 border-neon-pink/30 shadow-[0_0_50px_rgba(255,0,127,0.15)]">
                        <div className="flex flex-col items-center gap-4 mb-8">
                            <div className="w-16 h-16 bg-neon-pink/10 rounded-full flex items-center justify-center border border-neon-pink/30">
                                <Lock className="w-8 h-8 text-neon-pink" />
                            </div>
                            <div className="text-center">
                                <h1 className="text-2xl font-black text-white uppercase tracking-widest">Panel Girişi</h1>
                                <p className="text-xs text-white/40 mt-1 uppercase font-bold tracking-tighter">Yetkisiz Erişim Yasaktır</p>
                            </div>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Yönetici Şifresi"
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 text-center text-white focus:outline-none focus:border-neon-pink/50 transition-all font-bold tracking-[0.3em]"
                                autoFocus
                            />
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-neon-pink to-purple-600 text-white font-black py-4 rounded-xl shadow-[0_0_20px_rgba(255,0,127,0.4)] hover:opacity-90 active:scale-95 transition-all text-xs uppercase tracking-widest"
                            >
                                Güvenli Giriş
                            </button>
                        </form>
                    </GlassCard>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#05000a] text-white font-sans flex flex-col md:flex-row h-screen overflow-hidden">
            <div className="fixed inset-0 pavyon-grid opacity-5 pointer-events-none z-0" />

            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-black/60 border-b md:border-b-0 md:border-r border-white/10 flex flex-col z-20 shrink-0 backdrop-blur-xl">
                <div className="p-6 flex items-center gap-3 border-b border-white/10">
                    <img src="/logo.png" className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]" alt="Admin Logo" />
                    <span className="font-heading font-black text-lg text-gold-400 tracking-tighter">PAVYON <span className="text-white/40 text-[10px] tracking-widest ml-1">ADMIN</span></span>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto mt-4">
                    {[
                        { id: "dashboard", icon: LayoutDashboard, label: "Özet" },
                        { id: "users", icon: Users, label: "Kullanıcılar" },
                        { id: "gifts", icon: Gift, label: "Hediye Kayıtları" },
                        { id: "moderation", icon: ShieldCheck, label: "Denetleme" },
                        { id: "settings", icon: Settings, label: "Sistem Ayarları" },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === item.id ? 'bg-neon-pink text-white shadow-[0_0_15px_rgba(255,0,127,0.3)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                        >
                            <item.icon className="w-4 h-4" /> {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={() => setIsAuthed(false)}
                        className="w-full flex items-center justify-center gap-2 py-3 text-red-500/60 hover:text-red-500 text-xs font-bold uppercase transition-colors"
                    >
                        <LogOut className="w-4 h-4" /> Çıkış Yap
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative z-10 p-4 md:p-8 scrollbar-thin scrollbar-thumb-white/10">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                            {activeTab === "dashboard" && "Sistem Özeti"}
                            {activeTab === "users" && "Kullanıcı Yönetimi"}
                            {activeTab === "gifts" && "Hediye & Kazanç Takibi"}
                            {activeTab === "moderation" && "Güvenlik & Moderasyon"}
                            {activeTab === "settings" && "Sistem Yapılandırması"}
                        </h2>
                        <p className="text-sm text-white/40 font-medium">Uygulamanın genel işleyişini ve kazanç akışını buradan yönetin.</p>
                    </div>
                    <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10">
                        <div className="w-10 h-10 rounded-full bg-neon-pink/20 flex items-center justify-center text-neon-pink font-bold border border-neon-pink/30">A</div>
                        <div className="text-xs">
                            <div className="font-bold text-white">Yönetici (Ali)</div>
                            <div className="text-white/40">Çevrimiçi</div>
                        </div>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {activeTab === "dashboard" && (
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                    { label: "Toplam Kullanıcı", value: "12,482", icon: Users, color: "text-blue-400" },
                                    { label: "Aktif Masalar", value: "42", icon: LayoutDashboard, color: "text-green-400" },
                                    { label: "Hediye Hacmi", value: "₺445,210", icon: Gift, color: "text-gold-400" },
                                    { label: "Dağıtılan Kazanç", value: "₺89,042", icon: TrendingUp, color: "text-neon-pink" },
                                ].map((stat, i) => (
                                    <GlassCard key={i} className="p-6 border-white/5 hover:border-white/20 transition-all flex items-center gap-4">
                                        <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${stat.color}`}>
                                            <stat.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">{stat.label}</p>
                                            <p className="text-xl font-black text-white">{stat.value}</p>
                                        </div>
                                    </GlassCard>
                                ))}
                            </div>

                            {/* Weekly Growth Chart Mock */}
                            <GlassCard className="p-8 h-64 border-white/5 flex flex-col justify-end gap-2 group">
                                <h3 className="text-xs font-black text-white/40 uppercase tracking-widest mb-4">Haftalık Bakiye Akışı</h3>
                                <div className="flex items-end justify-between h-40 gap-2">
                                    {[60, 45, 80, 55, 90, 70, 100].map((h, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group-hover:scale-110 transition-transform">
                                            <div
                                                className={`w-full rounded-t-lg bg-gradient-to-t from-purple-900 to-neon-pink/80 group-hover:from-neon-pink transition-all duration-1000`}
                                                style={{ height: `${h}%` }}
                                            />
                                            <span className="text-[10px] text-white/30 font-bold uppercase">{['Pt', 'Sa', 'Çr', 'Pr', 'Cu', 'Ct', 'Pz'][i]}</span>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}

                    {activeTab === "users" && (
                        <motion.div
                            key="users"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
                                <Search className="w-5 h-5 text-white/20" />
                                <input
                                    type="text"
                                    placeholder="Kullanıcı adı veya ID ile ara..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="flex-1 bg-transparent border-none text-white text-sm focus:outline-none placeholder:text-white/20"
                                />
                            </div>

                            <div className="overflow-x-auto rounded-2xl border border-white/5 bg-black/40 backdrop-blur-md">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white/5 text-[10px] uppercase font-black text-white/40 tracking-widest border-b border-white/10">
                                            <th className="px-6 py-4">Kullanıcı</th>
                                            <th className="px-6 py-4">Durum</th>
                                            <th className="px-6 py-4">Bakiye</th>
                                            <th className="px-6 py-4">Katılım</th>
                                            <th className="px-6 py-4 text-right">İşlemler</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-sm">
                                        {users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase())).map((user) => (
                                            <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-neon-pink/20 border border-neon-pink/40 flex items-center justify-center font-bold text-neon-pink">
                                                            {user.name[0]}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-white group-hover:text-gold-400 transition-colors">{user.name}</div>
                                                            <div className="text-[10px] text-white/30 tracking-tight">ID: #00{user.id}42</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${user.status === 'active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-bold text-gold-400">₺{user.credits.toLocaleString()}</td>
                                                <td className="px-6 py-4 text-white/40">{user.joined}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button title="Kredi Ekle" className="p-2 bg-green-500/10 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors border border-green-500/20">
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                        <button title="Kredi Çıkar" className="p-2 bg-orange-500/10 hover:bg-orange-500/30 text-orange-400 rounded-lg transition-colors border border-orange-500/20">
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <button title="Engelle" className="p-2 bg-red-500/10 hover:bg-red-500/30 text-red-500 rounded-lg transition-colors border border-red-500/20">
                                                            <Ban className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "gifts" && (
                        <motion.div
                            key="gifts"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Recent Logs */}
                                <div className="lg:col-span-2 space-y-4">
                                    <h3 className="text-xs font-black text-white/40 uppercase tracking-widest pl-2">Canlı Kazanç Takibi</h3>
                                    <div className="rounded-2xl border border-white/5 bg-black/40 backdrop-blur-md overflow-hidden">
                                        <div className="divide-y divide-white/5">
                                            {gifts.map((log) => (
                                                <div key={log.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors group">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-gold-500/10 rounded-2xl flex items-center justify-center text-2xl border border-gold-500/20 group-hover:scale-110 transition-transform">
                                                            {log.gift === 'Kral Tacı' ? '👑' : log.gift === 'Elmas' ? '💎' : '🍾'}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-black text-white">
                                                                <span className="text-gold-400">{log.sender}</span> → <span className="text-neon-pink">{log.receiver}</span>
                                                            </div>
                                                            <div className="text-[10px] text-white/30 uppercase font-black tracking-widest mt-1">HEDİYE: {log.gift}</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-sm font-black text-white">₺{log.price.toLocaleString()}</div>
                                                        <div className="text-[10px] font-bold text-neon-pink uppercase">+{log.earnings} KAZANÇ (20%)</div>
                                                        <div className="text-[9px] text-white/20 mt-1">{log.time}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Summary Card */}
                                <div className="space-y-6">
                                    <GlassCard className="p-6 border-neon-pink/30 shadow-[0_0_30px_rgba(255,0,127,0.1)]">
                                        <h3 className="text-xs font-black text-neon-pink uppercase tracking-widest mb-4">Kazanç Politikası</h3>
                                        <p className="text-sm text-white/60 leading-relaxed mb-6">Her hediye gönderiminde alıcı tarafa sistem tarafından sabit <span className="text-white font-black">%20</span> kazanç kredisi tanımlanır. Bu işlem otomatik olarak güvenlik protokolleri ile onaylanmaktadır.</p>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-white/40">Sistem Kesintisi</span>
                                                <span className="font-bold">80%</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-white/40">Kullanıcı Kazancı</span>
                                                <span className="font-bold text-neon-pink">20%</span>
                                            </div>
                                            <div className="w-full h-1 bg-white/5 rounded-full mt-4">
                                                <div className="w-[20%] h-full bg-neon-pink rounded-full shadow-[0_0_10px_rgba(255,0,127,0.8)]" />
                                            </div>
                                        </div>
                                    </GlassCard>

                                    <GlassCard className="p-6 border-white/5">
                                        <h3 className="text-xs font-black text-white/40 uppercase tracking-widest mb-4">En Çok Kazananlar</h3>
                                        <div className="space-y-4">
                                            {[
                                                { name: "Ceren", amount: "₺18,400", meta: "72 Hediye" },
                                                { name: "Selin", amount: "₺12,900", meta: "45 Hediye" },
                                                { name: "Buse", amount: "₺8,200", meta: "31 Hediye" }
                                            ].map((top, idx) => (
                                                <div key={idx} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="text-lg font-black text-white/20">#{idx + 1}</div>
                                                        <div className="text-sm font-bold text-white">{top.name}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-sm font-black text-gold-400">{top.amount}</div>
                                                        <div className="text-[10px] text-white/40">{top.meta}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </GlassCard>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "moderation" && (
                        <motion.div
                            key="moderation"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <GlassCard className="p-6 border-red-500/20">
                                    <h3 className="text-xs font-black text-red-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Bell className="w-4 h-4" /> Son Raporlar
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-red-950/20 border border-red-500/20 rounded-xl flex flex-col gap-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-bold text-white">Hakan99</span>
                                                <span className="text-[10px] text-white/40 font-bold">2 dk önce</span>
                                            </div>
                                            <p className="text-xs text-white/60">"Spam mesaj gönderimi ve kurallara aykırı dil kullanımı."</p>
                                            <div className="flex gap-2 mt-2">
                                                <button className="px-3 py-1.5 bg-red-600 text-white text-[10px] font-bold rounded-lg uppercase">Banla</button>
                                                <button className="px-3 py-1.5 bg-white/5 text-white/40 text-[10px] font-bold rounded-lg hover:bg-white/10 transition-colors uppercase">Yoksay</button>
                                            </div>
                                        </div>
                                    </div>
                                </GlassCard>

                                <GlassCard className="p-6 border-white/5">
                                    <h3 className="text-xs font-black text-white/40 uppercase tracking-widest mb-4">Sistem Güvenlik Durumu</h3>
                                    <div className="space-y-4">
                                        {[
                                            { label: "SSL Sertifikası", status: "Aktif", type: "success" },
                                            { label: "Veritabanı Güvenliği", status: "Yüksek", type: "success" },
                                            { label: "Anti-Spam Filtresi", status: "Aktif", type: "success" },
                                            { label: "IP Engelleme", status: "0 Engel", type: "idle" },
                                        ].map((s, i) => (
                                            <div key={i} className="flex justify-between items-center border-b border-white/5 pb-3">
                                                <span className="text-xs text-white/60 font-medium">{s.label}</span>
                                                <div className="flex items-center gap-2">
                                                    {s.type === 'success' && <Check className="w-3.5 h-3.5 text-green-400" />}
                                                    <span className={`text-[10px] font-black uppercase ${s.type === 'success' ? 'text-green-400' : 'text-white/40'}`}>{s.status}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </GlassCard>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "settings" && (
                        <motion.div
                            key="settings"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-2xl space-y-8"
                        >
                            <div className="space-y-6">
                                <h3 className="text-sm font-black text-white uppercase tracking-widest px-2">Genel Ayarlar</h3>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer group">
                                        <div>
                                            <div className="text-sm font-bold text-white mb-1 group-hover:text-gold-400 transition-colors">Sistem Bakım Modu</div>
                                            <div className="text-xs text-white/40">Uygulamayı tüm kullanıcılar için geçici olarak kapatır.</div>
                                        </div>
                                        <div className="w-12 h-6 bg-white/10 rounded-full relative p-1 transition-colors">
                                            <div className="w-4 h-4 bg-white/40 rounded-full" />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer group">
                                        <div>
                                            <div className="text-sm font-bold text-white mb-1 group-hover:text-neon-pink transition-colors">Hediye Kazanç Oranı</div>
                                            <div className="text-xs text-white/40">Alıcı tarafına gidecek bakiye yüzdesi.</div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-black text-white">20%</span>
                                            <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 text-white/60">
                                                <Settings className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer group">
                                        <div>
                                            <div className="text-sm font-bold text-white mb-1">Global Sohbeti Kapat</div>
                                            <div className="text-xs text-white/40">Genel sohbet akışını anında durdurur.</div>
                                        </div>
                                        <div className="w-12 h-6 bg-red-600 rounded-full relative p-1 flex justify-end transition-colors shadow-[0_0_15px_rgba(220,38,38,0.4)]">
                                            <div className="w-4 h-4 bg-white rounded-full shadow-lg" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-gold-400/5 border border-gold-400/20 rounded-2xl">
                                <h4 className="text-xs font-black text-gold-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4" /> Önemli Hatırlatma
                                </h4>
                                <p className="text-xs text-gold-400/60 leading-relaxed">Sistem ayarlarında yapılan değişiklikler tüm istemciler (Android & iOS) için anında geçerli olur. Lütfen kritik değişiklikler yapmadan önce sistemi yedeklediğinizden emin olun.</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
