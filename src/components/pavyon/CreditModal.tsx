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
    { id: 'store', name: 'Apple / Google Pay', icon: <Smartphone className="w-5 h-5" />, desc: 'Tek tıkla, güvenli mağaza ödemesi.' },
    { id: 'cc', name: 'Kredi Kartı', icon: <CreditCard className="w-5 h-5" />, desc: 'Tüm banka kartlarına taksit imkanı.' },
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
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-xl p-0 md:p-4 overflow-y-auto animate-in fade-in duration-300">
            {/* Top Fixed Header for Mobile */}
            <div className="md:hidden fixed top-0 inset-x-0 h-16 bg-black/80 backdrop-blur-md border-b border-white/10 z-[250] flex items-center px-6 justify-between">
                <button onClick={onClose} className="flex items-center gap-2 text-white/70 hover:text-white font-bold text-sm">
                    <ArrowLeft className="w-5 h-5" /> GERİ
                </button>
                <div className="text-gold-400 font-black tracking-tighter text-sm uppercase">Bakiye Yükle</div>
            </div>

            <div className="bg-gradient-to-br from-[#0d0011] to-black border-0 md:border md:border-white/10 rounded-none md:rounded-3xl w-full max-w-4xl min-h-screen md:min-h-0 shadow-[0_0_50px_rgba(255,0,127,0.15)] flex flex-col md:flex-row overflow-hidden relative pt-16 md:pt-0">

                <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white bg-black/50 hover:bg-white/10 p-2 rounded-full transition-all z-20 hidden md:block">
                    <X className="w-5 h-5" />
                </button>

                {/* Left Side: Packages */}
                <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col">
                    <div className="mb-8">
                        <h2 className="text-2xl font-black text-white mb-2">Jeton Mağazası</h2>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Karakterini ve etkileşimini güçlendir</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 flex-1">
                        {PACKAGES.map((pkg) => (
                            <div
                                key={pkg.id}
                                onClick={() => setSelectedPackage(pkg.id)}
                                className={`relative cursor-pointer rounded-2xl p-4 border transition-all duration-300 flex flex-col items-center justify-center ${selectedPackage === pkg.id ? 'border-neon-pink bg-neon-pink/10 shadow-[0_0_20px_rgba(255,0,127,0.3)] scale-[1.02]' : 'border-white/5 bg-white/5 hover:border-white/10'}`}
                            >
                                {pkg.popular && (
                                    <div className="absolute -top-2.5 bg-gradient-to-r from-gold-600 to-yellow-400 text-black text-[8px] font-black px-2 py-0.5 rounded-full shadow-lg z-10">AVANTAJLI</div>
                                )}
                                <div className="text-3xl mb-1">{pkg.icon}</div>
                                <div className="font-black text-white text-lg">{pkg.amount + (pkg.bonus || 0)} ₺</div>
                                <div className="text-[9px] text-white/30 font-bold mb-3">BAKİYE</div>
                                <div className={`w-full text-center py-1.5 rounded-lg text-xs font-black bg-gradient-to-r ${pkg.color} text-white`}>
                                    {pkg.price} TL
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/5">
                        <div className="flex items-start gap-2">
                            <ShieldCheck className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                            <p className="text-[9px] text-white/40 leading-relaxed">
                                <span className="text-white/60 font-bold uppercase">Mağaza Güvencesi:</span> Bu işlem Apple/Google ödeme sistemleri üzerinden güvenle gerçekleştirilir. Dijital ürünlerde iade yapılmaz. Jetonlar anında tanımlanır.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Methods & Checkout */}
                <div className="w-full md:w-1/2 p-6 md:p-8 bg-black/40 flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/10">
                    <div>
                        <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-4">Ödeme Yöntemi</h3>
                        <div className="space-y-2">
                            {PAYMENT_METHODS.map((method) => (
                                <div
                                    key={method.id}
                                    onClick={() => setSelectedMethod(method.id)}
                                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all ${selectedMethod === method.id ? 'border-white/30 bg-white/10' : 'border-white/5 hover:bg-white/5'}`}
                                >
                                    <div className={`p-2 rounded-lg ${selectedMethod === method.id ? 'bg-neon-pink text-white shadow-[0_0_10px_rgba(255,0,127,0.3)]' : 'bg-white/5 text-white/30'}`}>
                                        {method.icon}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-sm text-white">{method.name}</div>
                                        <div className="text-[10px] text-white/30">{method.desc}</div>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === method.id ? 'border-neon-pink' : 'border-white/10'}`}>
                                        {selectedMethod === method.id && <div className="w-2.5 h-2.5 rounded-full bg-neon-pink shadow-[0_0_5px_rgba(255,0,127,1)]"></div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8">
                        <div className="mb-6 space-y-2">
                            <div className="flex justify-between text-xs text-white/40 font-bold uppercase tracking-tighter">
                                <span>Ara Toplam</span>
                                <span>{(currentPkg?.price ?? 0).toFixed(2)} TL</span>
                            </div>
                            <div className="flex justify-between text-xs text-green-400 font-bold uppercase tracking-tighter">
                                <span>İşlem Ücreti</span>
                                <span>0.00 TL</span>
                            </div>
                            <div className="pt-2 border-t border-white/10 flex justify-between items-end">
                                <div>
                                    <div className="text-[10px] text-white/40 uppercase font-black">Genel Toplam</div>
                                    <div className="text-3xl font-black text-white">{(currentPkg?.price ?? 0).toFixed(2)} TL</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] text-gold-400 font-black uppercase">Tanımlanacak Jeton</div>
                                    <div className="text-xl font-black text-gold-400">{(currentPkg?.amount ?? 0) + (currentPkg?.bonus ?? 0)} ₺</div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleCompletePurchase}
                            className="w-full group py-4 rounded-2xl flex items-center justify-center gap-3 bg-gradient-to-r from-neon-pink to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-black text-lg transition-all shadow-[0_15px_30px_rgba(255,0,127,0.3)] active:scale-95"
                        >
                            ÖDEMEYİ TAMAMLA <ArrowRight className="w-5 h-5" />
                        </button>

                        <p className="text-[8px] text-white/20 text-center mt-6 uppercase leading-tight">
                            Bu satın alma ile &quot;Hizmet Sözleşmesi&quot; ve &quot;Dijital Ürün İade Koşulları&quot;nı kabul etmiş sayılırsınız. Ödemeler TLS/SSL güvenlik sertifikası ile korunmaktadır.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
