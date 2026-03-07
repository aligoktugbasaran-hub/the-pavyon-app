"use client";

import { motion } from "framer-motion";
import { Scale, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#05000a] text-white p-6 md:p-12 font-sans selection:bg-neon-pink selection:text-white">
            <div className="max-w-4xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-12 group">
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span>Ana Sayfaya Dön</span>
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-8"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gold-400/10 rounded-2xl border border-gold-400/20">
                            <Scale className="w-8 h-8 text-gold-400" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black uppercase tracking-tight">Kullanım Şartları (EULA)</h1>
                            <p className="text-white/40 uppercase text-xs font-bold tracking-widest mt-1">Son Güncelleme: 7 Mart 2026</p>
                        </div>
                    </div>

                    <div className="space-y-8 text-white/70 leading-relaxed text-sm md:text-base">
                        <p className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 font-bold mb-4 italic">
                            Önemli: The Pavyon uygulamasını kullanan her kullanıcı, Apple App Store standartlarındaki bu sözleşmeyi peşinen kabul etmiş sayılır.
                        </p>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">1. Kabul Edilebilir Kullanım</h2>
                            <p>
                                The Pavyon, anonim bir sosyal platformdur. Kullanıcıların birbirlerine saygı çerçevesinde davranmaları zorunludur. Aşağıdaki içeriklerin paylaşımı KESİNLİKLE yasaktır:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Nefret söylemi, ayrımcılık veya zorbalık.</li>
                                <li>Cinsel içerikli paylaşımlar veya çıplaklık (Nudity).</li>
                                <li>Yasa dışı maddelerin veya faaliyetlerin teşviki.</li>
                                <li>Kişisel telefon numarası veya sosyal medya hesaplarının herkese açık alanlarda (Chat) paylaşımı.</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">2. Kullanıcı Tarafından Oluşturulan İçerik (UGC)</h2>
                            <p>
                                Apple App Store politikaları gereği, Kullanıcı Tarafından Oluşturulan İçerik (UGC) barındıran bir platform olarak The Pavyon şunları taahhüt eder:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Obje (Uygunsuz) içeriklere tolerans gösterilmez.</li>
                                <li>Kullanıcılar, diğer kullanıcıları <strong>tek tuşla engelleme ve şikayet etme</strong> hakkına sahiptir.</li>
                                <li>Yönetim, şikayet edilen içerikleri 24 saat içinde inceleyip silme veya kullanıcıyı platformdan uzaklaştırma yetkisine sahiptir.</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">3. Hediye ve Ödeme Sistemi</h2>
                            <p>
                                Uygulama içinde alınan krediler ve gönderilen hediyeler dijital varlıklardır. Kazanılan %20 tutarındaki bakiye her zaman sistemin güvencesi altındadır ve kullanıcı sorumluluğundadır. Dijital ödemeler Apple/Android ödeme sistemleri üzerinden güvenle gerçekleştirilir.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">4. Sorumluluk Reddi</h2>
                            <p>
                                Platform üzerindeki anonim arayüzlerde kullanıcıların kendi paylaştıkları kişisel bilgilerden The Pavyon yönetimi sorumlu değildir. Kullanıcılar, paylaşımlarının tüm yasal sonuçlarından kendileri sorumludur.
                            </p>
                        </section>

                        <section className="space-y-4 border-t border-white/5 pt-8">
                            <p>
                                Sorularınız için bizimle iletişime geçin: <br />
                                <strong>E-posta: support@thepavyon.app</strong>
                            </p>
                        </section>
                    </div>
                </motion.div>

                <footer className="mt-20 pt-8 border-t border-white/5 text-center text-white/20 text-xs">
                    © 2026 The Pavyon Management. Tüm Hakları Saklıdır. Internal ID: APPLE_EULA_V1
                </footer>
            </div>
        </div>
    );
}
