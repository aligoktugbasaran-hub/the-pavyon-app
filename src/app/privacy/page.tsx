"use client";
import { motion } from "framer-motion";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-black text-white/80 px-4 py-12 md:px-8">
            <div className="max-w-3xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Gizlilik Politikası</h1>
                    <p className="text-white/40 text-sm mb-10">Son güncelleme: 16 Mart 2026</p>

                    <div className="space-y-8 text-sm leading-relaxed">
                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">1. Genel Bakış</h2>
                            <p>
                                The Pavyon (&quot;Uygulama&quot;), kullanıcılarının gizliliğine saygı duyan bir sosyal etkileşim platformudur.
                                Bu politika, hangi verilerin toplandığını, nasıl kullanıldığını, kimlerle paylaşıldığını ve
                                kullanıcıların haklarını açıklar. Uygulamayı kullanarak bu politikayı kabul etmiş sayılırsınız.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">2. Toplanan Veriler</h2>
                            <p><strong className="text-white">Hesap Bilgileri:</strong> Lakap (nickname), e-posta adresi (opsiyonel), profil fotoğrafı, cinsiyet bilgisi.</p>
                            <p><strong className="text-white">Kullanım Verileri:</strong> Sohbet mesajları, hediye gönderimleri, arkadaşlık istekleri, masa katılım bilgileri.</p>
                            <p><strong className="text-white">Cihaz Bilgileri:</strong> Cihaz türü, işletim sistemi, IP adresi, tarayıcı bilgisi.</p>
                            <p><strong className="text-white">Konum Bilgisi:</strong> Konum bilgisi toplanmaz.</p>
                            <p><strong className="text-white">Kamera ve Mikrofon:</strong> Sadece kullanıcı izni ile profil fotoğrafı çekimi ve görüntörü sohbet için kullanılır.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">3. Verilerin Kullanımı</h2>
                            <p>Toplanan veriler şu amaçlarla kullanılır:</p>
                            <p>Hesap oluşturma ve kimlik doğrulama, uygulama içi iletişim (sohbet, bildirimler),
                            hediye ve kredi sisteminin işletilmesi, liderlik tabloları ve kullanıcı sıralamaları,
                            uygulama performansının iyileştirilmesi ve güvenlik önlemleri.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">4. Veri Paylaşımı</h2>
                            <p>
                                Kişisel verileriniz üçüncü taraflarla satılmaz veya kiralanmaz. Veriler yalnızca şu durumlarda paylaşılabilir:
                                yasal zorunluluklar (mahkeme kararı, resmi talep), hizmet sağlayıcılar (sunucu altyapısı: Railway),
                                ve kullanıcı güvenliğini korumak amacıyla.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">5. Veri Saklama ve Güvenlik</h2>
                            <p>
                                Verileriniz şifrelenmiş bağlantılar (HTTPS/SSL) üzerinden iletilir ve güvenli sunucularda saklanır.
                                Hesabınızı sildiğinizde tüm kişisel verileriniz 30 gün içinde kalıcı olarak silinir.
                                Sohbet mesajları düzenli olarak temizlenir.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">6. Kullanıcı Hakları</h2>
                            <p>Kullanıcılar şu haklara sahiptir:</p>
                            <p>
                                Verilerine erişim talep etme, verilerinin düzeltilmesini isteme,
                                verilerinin silinmesini talep etme (hesap silme),
                                veri işlemeye itiraz etme ve veri taşınabilirliği talep etme.
                            </p>
                            <p>
                                Bu haklarınızı kullanmak için <strong className="text-neon-pink">aligoktugbasaran@gmail.com</strong> adresine
                                kullanıcı adınızla birlikte yazmanız yeterlidir.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">7. Çocukların Gizliliği</h2>
                            <p>
                                The Pavyon, 18 yaşın altındaki bireylere yönelik değildir. 18 yaşından küçük olduğu tespit edilen
                                kullanıcıların hesapları bildirilmeksizin silinebilir. Ebeveynler veya yasal vasiler, çocuklarının
                                bilgilerinin silinmesi için bizimle iletişime geçebilir.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">8. Çerezler ve İzleme</h2>
                            <p>
                                Uygulama, oturum yönetimi için yerel depolama (localStorage) kullanır.
                                Üçüncü taraf izleme araçları veya reklam çerezleri kullanılmaz.
                                Analitik veriler anonim olarak toplanabilir.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">9. Politika Değişiklikleri</h2>
                            <p>
                                Bu gizlilik politikası zaman zaman güncellenebilir. Önemli değişiklikler uygulama içi bildirim
                                veya e-posta yoluyla kullanıcılara duyurulacaktır. Güncel politikayı her zaman bu sayfadan
                                kontrol edebilirsiniz.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">10. İletişim</h2>
                            <p>
                                Gizlilik ile ilgili her türlü soru, talep ve şikayetleriniz için:<br />
                                <strong className="text-white">E-posta:</strong> <span className="text-neon-pink">aligoktugbasaran@gmail.com</span><br />
                                <strong className="text-white">Geliştirici:</strong> Ali Göktug Başaran<br />
                                <strong className="text-white">Uygulama:</strong> The Pavyon
                            </p>
                        </section>
                    </div>
                </motion.div>

                <footer className="mt-20 pt-8 border-t border-white/5 text-center text-white/20 text-xs">
                    &copy; 2026 The Pavyon. Tüm Hakları Saklıdır.
                </footer>
            </div>
        </div>
    );
}
