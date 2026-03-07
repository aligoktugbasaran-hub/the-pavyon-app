"use client";

import { motion } from "framer-motion";
import { ShieldCheck, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
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
                        <div className="p-3 bg-neon-pink/10 rounded-2xl border border-neon-pink/20">
                            <ShieldCheck className="w-8 h-8 text-neon-pink" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black uppercase tracking-tight">Gizlilik Politikası</h1>
                            <p className="text-white/40 uppercase text-xs font-bold tracking-widest mt-1">Son Güncelleme: 7 Mart 2026</p>
                        </div>
                    </div>

                    <div className="space-y-8 text-white/70 leading-relaxed text-sm md:text-base">
                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">1. Genel Bakış</h2>
                            <p>
                                The Pavyon, kullanıcılarının gizliliğine ve anonimiteye son derece önem vermektedir.
                                Bu politika, uygulamamızı kullandığınızda verilerinizin nasıl toplandığını, kullanıldığını ve
                                korunduğunu açıklamaktadır.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">2. Kamera ve Mikrofon Erişimi</h2>
                            <p>
                                Uygulamamız, Apple App Store politikalarına tam uyum sağlayacak şekilde Kamera ve Mikrofon donanımlarınızı aşağıdaki amaçlarla kullanır:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Görüntülü Arama:</strong> Özel odalarda diğer kullanıcılarla yapılan canlı görüntülü görüşmeler için.</li>
                                <li><strong>Profil Fotoğrafı:</strong> Uygulama içinde kendinize bir avatar veya fotoğraf çekip yükleyebilmeniz için.</li>
                                <li><strong>Sesli İletişim:</strong> Görüntülü görüşmeler sırasında ses iletimini sağlamak için.</li>
                            </ul>
                            <p className="bg-white/5 p-4 rounded-xl border border-white/5 italic">
                                Verileriniz ASLA izniniz olmadan kayıt altına alınmaz, sunucularımızda saklanmaz veya üçüncü taraflarla paylaşılmaz.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">3. Anonimite ve Veri Saklama</h2>
                            <p>
                                The Pavyon, gerçek kimliğinizi saklamak üzerine tasarlanmıştır. Yalnızca şu verileri işleriz:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Kullanıcı adı (nickname).</li>
                                <li>Kendi isteğinizle yüklediğiniz fotoğraflar.</li>
                                <li>Bildirimler için gerekli olan temel cihaz kimliği.</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">4. Veri Silme Talebi</h2>
                            <p>
                                Hesabınızı ve ilişkili tüm verilerinizi dilediğiniz zaman silebilirsiniz. Sildiğiniz takdirde; nickname, fotoğraflar, arkadaş listeleri ve sohbet geçmişiniz kalıcı olarak sistemden kaldırılır.
                                Veri silme talebi için <strong>info@thepavyon.app</strong> adresine kullanıcı adınızla beraber yazmanız yeterlidir.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">5. İletişim</h2>
                            <p>
                                Herhangi bir soru veya endişeniz için: <br />
                                <strong>E-posta: info@thepavyon.app</strong>
                            </p>
                        </section>
                    </div>
                </motion.div>

                <footer className="mt-20 pt-8 border-t border-white/5 text-center text-white/20 text-xs">
                    © 2026 The Pavyon Management. Tüm Hakları Saklıdır.
                </footer>
            </div>
        </div>
    );
}
