import { useState } from "react";
import { X, CreditCard, Smartphone, ArrowRight, ShieldCheck, ArrowLeft } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";

interface CreditModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PACKAGES = [
    { id: 'bronze', name: 'Gümüş', amount: 50, price: 54.99, bonus: 0, color: 'from-slate-400 to-slate-700', icon: '🥈' },
    { id: 'gold', name: 'Altın', amount: 150, price: 129.99, bonus: 20, color: 'from-yellow-400 to-yellow-700', icon: '🥇', popular: true },
    { id: 'diamond', name: 'Elmas', amount: 400, price: 349.99, bonus: 80, color: 'from-cyan-400 to-blue-700', icon: '💎' },
    { id: 'king', name: 'Kral', amount: 1000, price: 799.99, bonus: 250, color: 'from-pink-500 to-red-700', icon: '👑' },
];

const PAYMENT_METHODS = [
    { id: 'store', name: 'Apple / Google Pay', icon: <Smartphone className="w-5 h-5" />, desc: 'Tek tıkla, güvenli ödeme.' },
    { id: 'cc', name: 'Kredi Kartı', icon: <CreditCard className="w-5 h-5" />, desc: 'Taksit imkanı.' },
];

export function CreditModal({ isOpen, onClose }: CreditModalProps) {
    const [selectedPackage, setSelectedPackage] = useState(PACKAGES[1].id);
    const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0].id);
    const showToast = useUserStore(state => state.showToast);

    if (!isOpen) return null;

    const currentPkg = PACKAGES.find(p => p.id === selectedPackage);

    const handleCompletePurchase = () => {
        showToast("Cüzdanın kabardı, buralar artık senin!", "success");
        setTimeout(() => onClose(), 1500);
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-xl p-2 md:p-4 animate-in fade-in duration-300">
            <div className="bg-gradient-to-br from-[#0d0011] to-black border border-white/10 rounded-2xl w-full max-w-[95vw] md:max-w-2xl max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(255,0,127,0.15)] relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-white/50 hover:text-white bg-black/50 hover:bg-white/10 p-2 rounded-full transition-all z-20">
                    <X className="w-5 h-5" />
                </button>

                <div className="p-4 md:p-6">
                    <h2 className="text-xl font-black text-white mb-1">Jeton Mağazası</h2>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-4">Karakterini ve etkileşimini güçlendir</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                        {PACKAGES.map((pkg) => (
                            <div
                                key={pkg.id}
                                onClick={() => setSelectedPackage(pkg.id)}
                                className={`relative cursor-pointer rounded-xl p-3 border transition-all duration-300 flex flex-col items-center justify-center ${selectedPackage === pkg.id ? 'border-neon-pink bg-neon-pink/10 shadow-[0_0_20px_rgba(255,0,127,0.3)] scale-[1.02]' : 'border-white/5 bg-white/5 hover:border-white/10'}`}
                            >
                                {pkg.popular && (
                                    <div className="absolute -top-2 bg-gradient-to-r from-gold-600 to-yellow-400 text-black text-[7px] font-black px-2 py-0.5 rounded-full shadow-lg z-10">AVANTAJLI</div>
                                )}
                                <div className="text-2xl mb-1">{pkg.icon}</div>
                                <div className="font-black text-white text-sm">{pkg.amount + (pkg.bonus || 0)} ₺</div>
                                <div className="text-[8px] text-white/30 font-bold mb-2">BAKİYE</div>
                                <div className={`w-full text-center py-1 rounded-lg text-[10px] font-black bg-gradient-to-r ${pkg.color} text-white`}>
                                    {pkg.price} TL
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-white/10 pt-4 mt-2">
                        <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest mb-3">Ödeme Yöntemi</h3>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            {PAYMENT_METHODS.map((method) => (
                                <div
                                    key={method.id}
                                    onClick={() => setSelectedMethod(method.id)}
                                    className={`flex items-center gap-2 p-2.5 rounded-xl cursor-pointer border transition-all ${selectedMethod === method.id ? 'border-white/30 bg-white/10' : 'border-white/5 hover:bg-white/5'}`}
                                >
                                    <div className={`p-1.5 rounded-lg ${selectedMethod === method.id ? 'bg-neon-pink text-white' : 'bg-white/5 text-white/30'}`}>
                                        {method.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-xs text-white truncate">{method.name}</div>
                                        <div className="text-[9px] text-white/30 truncate">{method.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-3 mb-4">
                        <div className="flex justify-between text-xs text-white/40 font-bold mb-1">
                            <span>Toplam</span>
                            <span>{(currentPkg?.price ?? 0).toFixed(2)} TL</span>
                        </div>
                        <div className="flex justify-between items-end">
                            <div className="text-xl font-black text-white">{(currentPkg?.price ?? 0).toFixed(2)} TL</div>
                            <div className="text-right">
                                <div className="text-[9px] text-gold-400 font-black uppercase">Jeton</div>
                                <div className="text-lg font-black text-gold-400">{(currentPkg?.amount ?? 0) + (currentPkg?.bonus ?? 0)} ₺</div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleCompletePurchase}
                        className="w-full py-3 rounded-xl flex items-center justify-center gap-2 bg-gradient-to-r from-neon-pink to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-black text-sm transition-all shadow-[0_15px_30px_rgba(255,0,127,0.3)] active:scale-95"
                    >
                        ÖDEMEYİ TAMAMLA <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="flex items-start gap-2 mt-3">
                        <ShieldCheck className="w-3 h-3 text-green-500 shrink-0 mt-0.5" />
                        <p className="text-[8px] text-white/30 leading-relaxed">
                            Ödeme Apple/Google sistemleri üzerinden güvenle gerçekleştirilir. Dijital ürünlerde iade yapılmaz.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
