"use client";
import { motion } from "framer-motion";

export default function ChildSafetyPage() {
    return (
        <div className="min-h-screen bg-black text-white/80 px-4 py-12 md:px-8">
            <div className="max-w-3xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Child Safety Standards</h1>
                    <h2 className="text-xl text-white/60 mb-2">Çocuk Güvenliği Standartları</h2>
                    <p className="text-white/40 text-sm mb-10">Last updated: March 2026 | Son güncelleme: Mart 2026</p>

                    <div className="space-y-8 text-sm leading-relaxed">
                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">1. Commitment to Child Safety / Çocuk Güvenliğine Bağlılık</h2>
                            <p>
                                The Pavyon is committed to providing a safe environment and has zero tolerance for child sexual abuse material (CSAM) or any form of child exploitation on our platform. Our application is strictly intended for users aged 18 and above.
                            </p>
                            <p>
                                The Pavyon, güvenli bir ortam sağlamaya kararlıdır ve platformumuzda çocuk cinsel istismarı materyaline (CSAM) veya herhangi bir çocuk istismarı biçimine karşı sıfır tolerans politikası uygulamaktadır. Uygulamamız kesinlikle 18 yaş ve üzeri kullanıcılar içindir.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">2. Age Restriction / Yaş Kısıtlaması</h2>
                            <p>
                                The Pavyon is an 18+ platform. Users under the age of 18 are not permitted to create accounts or use the application. We implement age-gating measures during the registration process. Any account found to belong to a minor will be immediately suspended and reported to relevant authorities.
                            </p>
                            <p>
                                The Pavyon, 18+ bir platformdur. 18 yaşından küçük kullanıcıların hesap oluşturmasına veya uygulamayı kullanmasına izin verilmez. Kayıt sürecinde yaş doğrulama önlemleri uygulanmaktadır. Reşit olmayan bir kullanıcıya ait olduğu tespit edilen hesaplar derhal askıya alınır ve ilgili makamlara bildirilir.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">3. Prevention of CSAM / CSAM Önleme</h2>
                            <p>
                                We actively monitor and moderate content on our platform to prevent the distribution of child sexual abuse material (CSAM). Our measures include automated content filtering, manual review of reported content, immediate removal of any violating material, and reporting to relevant law enforcement authorities including NCMEC (National Center for Missing &amp; Exploited Children).
                            </p>
                            <p>
                                Platformumuzda çocuk cinsel istismarı materyalinin (CSAM) dağıtılmasını önlemek için içerikleri aktif olarak izliyor ve moderasyon uyguluyoruz. Önlemlerimiz arasında otomatik içerik filtreleme, bildirilen içeriklerin manuel incelenmesi, ihlal eden materyallerin derhal kaldırılması ve NCMEC dahil ilgili kolluk kuvvetlerine bildirim yer almaktadır.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">4. Reporting Mechanism / Bildirme Mekanizması</h2>
                            <p>
                                Users can report any content or behavior that may involve child exploitation through the following channels: in-app reporting via user profile blocking feature, or by contacting us directly at <strong className="text-neon-pink">aligoktugbasaran@gmail.com</strong>. All reports are treated with the highest priority and confidentiality. We commit to reviewing all reports within 24 hours.
                            </p>
                            <p>
                                Kullanıcılar, çocuk istismarı içerebilecek herhangi bir içerik veya davranışı şu kanallar aracılığıyla bildirebilir: uygulama içi profil engelleme özelliği veya doğrudan <strong className="text-neon-pink">aligoktugbasaran@gmail.com</strong> adresine e-posta göndererek. Tüm bildiriler en yüksek öncelik ve gizlilikle ele alınır. Tüm bildirimleri 24 saat içinde incelemeyi taahhüt ediyoruz.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">5. Cooperation with Authorities / Yetkililerle İşbirliği</h2>
                            <p>
                                The Pavyon cooperates fully with law enforcement agencies and regulatory bodies in matters related to child safety. We comply with all applicable local, national, and international laws regarding the protection of minors, including but not limited to reporting obligations to NCMEC and relevant Turkish authorities (EGM Siber Suçlarla Mücadele).
                            </p>
                            <p>
                                The Pavyon, çocuk güvenliğiyle ilgili konularda kolluk kuvvetleri ve düzenleyici kurumlarla tam işbirliği yapmaktadır. NCMEC ve ilgili Türk makamlarına (EGM Siber Suçlarla Mücadele) bildirim yükümlülükleri dahil ancak bunlarla sınırlı olmamak üzere, reşit olmayanların korunmasına ilişkin yürürlükteki tüm yerel, ulusal ve uluslararası yasalara uymaktayız.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">6. Content Moderation / İçerik Moderasyonu</h2>
                            <p>
                                Our content moderation practices include profanity and spam filters in chat messages, user blocking and reporting capabilities, regular review of user-generated content, and swift action against accounts that violate our policies. Violations may result in immediate account suspension, permanent ban, and reporting to law enforcement.
                            </p>
                            <p>
                                İçerik moderasyon uygulamalarımız arasında sohbet mesajlarında küfür ve spam filtreleri, kullanıcı engelleme ve bildirme özellikleri, kullanıcı tarafından oluşturulan içeriklerin düzenli incelenmesi ve politikalarımızı ihlal eden hesaplara karşı hızlı aksiyon yer almaktadır. İhlaller, hesabın derhal askıya alınması, kalıcı yasaklama ve kolluk kuvvetlerine bildirim ile sonuçlanabilir.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">7. Contact / İletişim</h2>
                            <p>
                                For any child safety concerns or to report violations:<br />
                                <strong className="text-white">Email:</strong> <span className="text-neon-pink">aligoktugbasaran@gmail.com</span><br />
                                <strong className="text-white">Developer:</strong> Ali Goktug Basaran<br />
                                <strong className="text-white">Application:</strong> The Pavyon<br />
                                <strong className="text-white">Response Time:</strong> Within 24 hours
                            </p>
                        </section>
                    </div>
                </motion.div>

                <footer className="mt-20 pt-8 border-t border-white/5 text-center text-white/20 text-xs">
                    &copy; 2026 The Pavyon. All Rights Reserved.
                </footer>
            </div>
        </div>
    );
}
