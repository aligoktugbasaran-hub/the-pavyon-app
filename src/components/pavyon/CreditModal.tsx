import { useState } from "react";
import { X, CreditCard, Smartphone, Building2, Wallet, Flame, ArrowRight, ShieldCheck } from "lucide-react";

interface CreditModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PACKAGES = [
    { id: 'bronze', name: 'Bronz', amount: 100, price: 100, bonus: 0, color: 'from-orange-700 to-amber-900', icon: '🥉' },
    { id: 'silver', name: 'Gümüş', amount: 500, price: 500, bonus: 50, color: 'from-slate-400 to-gray-600', icon: '🥈' },
    { id: 'gold', name: 'Altın', amount: 1000, price: 1000, bonus: 150, color: 'from-yellow-400 to-yellow-700', icon: '🥇', popular: true },
    { id: 'diamond', name: 'Elmas', amount: 5000, price: 5000, bonus: 1000, color: 'from-cyan-400 to-blue-700', icon: '💎' },
    { id: 'king', name: 'Pavyon King', amount: 50000, price: 50000, bonus: 15000, color: 'from-pink-500 to-red-700', icon: '👑' },
];

const PAYMENT_METHODS = [
    { id: 'cc', name: 'Kredi / Banka Kartı', icon: <CreditCard className="w-5 h-5" />, desc: 'Anında yükleme, 3D Secure güvencesi.' },
    { id: 'papara', name: 'Papara / İNİNAL', icon: <Smartphone className="w-5 h-5" />, desc: 'Cüzdan ile hızlı dijital ödeme.' },
    { id: 'mobile', name: 'Mobil Ödeme', icon: <Smartphone className="w-5 h-5" />, desc: 'Turkcell, Vodafone, Türk Telekom.' },
    { id: 'eft', name: 'Havale / EFT', icon: <Building2 className="w-5 h-5" />, desc: 'Banka hesabına transfer (10dk onay).' },
    { id: 'crypto', name: 'Kripto Yükleme', icon: <Wallet className="w-5 h-5" />, desc: 'USDT, TRX, BTC ile anonim yükleme.' },
];

export function CreditModal({ isOpen, onClose }: CreditModalProps) {
    const [selectedPackage, setSelectedPackage] = useState(PACKAGES[2].id);
    const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0].id);

    if (!isOpen) return null;

    const currentPkg = PACKAGES.find(p => p.id === selectedPackage);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-gradient-to-br from-black to-zinc-900 border border-white/10 rounded-3xl w-full max-w-4xl shadow-[0_0_50px_rgba(255,0,127,0.15)] flex flex-col md:flex-row overflow-hidden relative">

                {/* Kapat Butonu */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/50 hover:text-white bg-black/50 hover:bg-white/10 p-2 rounded-full transition-all z-20"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Sol Taraf - Paket Seçimi */}
                <div className="w-full md:w-1/2 p-8 border-b md:border-b-0 md:border-r border-white/10">
                    <div className="mb-6">
                        <h2 className="text-2xl font-black font-heading tracking-wider mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
                            KREDİ YÜKLE
                        </h2>
                        <p className="text-sm text-white/50">Gösterişe devam etmek için pavyon hesabına bakiye yükle.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {PACKAGES.map((pkg) => (
                            <div
                                key={pkg.id}
                                onClick={() => setSelectedPackage(pkg.id)}
                                className={`relative cursor-pointer rounded-2xl p-4 border transition-all duration-300 ${selectedPackage === pkg.id ? 'border-neon-pink bg-neon-pink/10 shadow-[0_0_20px_rgba(255,0,127,0.3)]' : 'border-white/5 bg-white/5 hover:border-white/20'}`}
                            >
                                {pkg.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-red-600 to-neon-pink text-[9px] font-bold px-3 py-1 rounded-full shadow-lg whitespace-nowrap flex items-center gap-1">
                                        <Flame className="w-3 h-3" /> EN ÇOK TERCİH EDİLEN
                                    </div>
                                )}
                                <div className="text-3xl mb-2 text-center">{pkg.icon}</div>
                                <div className="text-center font-bold text-white text-lg">{pkg.amount} ₺</div>
                                {pkg.bonus > 0 ? (
                                    <div className="text-center text-[10px] text-green-400 font-bold mt-1">+{pkg.bonus} ₺ BONUS</div>
                                ) : (
                                    <div className="text-center text-[10px] text-white/30 font-bold mt-1">Standart</div>
                                )}
                                <div className={`text-center mt-3 py-1 rounded-lg text-xs font-bold bg-gradient-to-r ${pkg.color} bg-opacity-20`}>
                                    {pkg.price} TL
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sağ Taraf - Ödeme Yöntemi ve Onay */}
                <div className="w-full md:w-1/2 p-8 bg-black/40 flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-white/90">Ödeme Yöntemi Seçin</h3>
                        <div className="space-y-3">
                            {PAYMENT_METHODS.map((method) => (
                                <div
                                    key={method.id}
                                    onClick={() => setSelectedMethod(method.id)}
                                    className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer border transition-all ${selectedMethod === method.id ? 'border-white bg-white/10' : 'border-white/5 hover:bg-white/5'}`}
                                >
                                    <div className={`p-2 rounded-lg ${selectedMethod === method.id ? 'bg-neon-pink text-white' : 'bg-white/5 text-white/60'}`}>
                                        {method.icon}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-sm text-white">{method.name}</div>
                                        <div className="text-[10px] text-white/40">{method.desc}</div>
                                    </div>
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedMethod === method.id ? 'border-neon-pink' : 'border-white/20'}`}>
                                        {selectedMethod === method.id && <div className="w-2 h-2 rounded-full bg-neon-pink"></div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8">
                        <div className="flex justify-between items-center mb-4 p-4 bg-white/5 rounded-xl border border-white/10">
                            <div>
                                <div className="text-white/50 text-xs">Toplam Ödenecek Tutar</div>
                                <div className="text-2xl font-black text-white">{currentPkg?.price} TL</div>
                                <div className="text-green-400 text-xs font-bold">Hesaba Geçecek: {currentPkg!.amount + currentPkg!.bonus} ₺</div>
                            </div>
                            <ShieldCheck className="w-10 h-10 text-green-500/50" />
                        </div>
                        <button className="w-full group py-4 rounded-xl flex items-center justify-center gap-3 bg-gradient-to-r from-neon-pink to-purple-600 hover:from-neon-pink/80 hover:to-purple-500 text-white font-bold text-lg transition-all shadow-[0_0_20px_rgba(255,0,127,0.4)]">
                            DEVAM ET <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
