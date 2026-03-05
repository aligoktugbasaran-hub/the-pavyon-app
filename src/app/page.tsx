"use client";

import { motion } from "framer-motion";
import { LogIn, Sparkles, Ghost, Gift } from "lucide-react";
import Link from "next/link";
import { NeonButton } from "@/components/ui/NeonButton";
import { GlassCard } from "@/components/ui/GlassCard";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative pb-20">
      {/* Hero Section */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-neon-pink/10 to-transparent pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10 max-w-3xl flex flex-col items-center mt-20"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 mb-6 rounded-full border border-gold-500/30 flex items-center justify-center p-2 relative"
        >
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-gold-500/20 to-neon-pink/20 blur-md absolute" />
          <Sparkles className="w-10 h-10 text-gold-400 relative z-10" />
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white neon-text-pink leading-tight font-heading">
          The Pavyon'a <br /> Hoş Geldiniz
        </h1>
        <p className="text-lg md:text-xl text-white/70 mb-12 max-w-xl mx-auto font-light leading-relaxed">
          Türkiye'nin ilk ve tek lüks sanal pavyon deneyimi. Gizliliğini koru,
          hediyeler gönder, en popüler sen ol.
        </p>

        <Link href="/join">
          <NeonButton variant="gold" className="text-lg px-8 py-4">
            <LogIn className="w-5 h-5 mr-1" />
            Pavyon'a Gir
          </NeonButton>
        </Link>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 z-10 max-w-5xl w-full"
      >
        <GlassCard className="flex flex-col items-center text-center p-8 group" hoverable>
          <div className="w-16 h-16 rounded-full bg-purple-900/50 border border-purple-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <Ghost className="w-8 h-8 text-neon-pink" />
          </div>
          <h3 className="text-xl font-bold mb-3 font-heading text-white">Tamamen Anonim</h3>
          <p className="text-white/60 text-sm">
            Gerçek kimliğini gizle, istediğin lakabı seç ve dilediğin gibi eğlen.
          </p>
        </GlassCard>

        <GlassCard className="flex flex-col items-center text-center p-8 group" hoverable>
          <div className="w-16 h-16 rounded-full bg-purple-900/50 border border-gold-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <Gift className="w-8 h-8 text-gold-400" />
          </div>
          <h3 className="text-xl font-bold mb-3 font-heading text-white">Sanal Hediyeler</h3>
          <p className="text-white/60 text-sm">
            Şampanyalar patlat, elmaslar gönder ve sahnede (liderlik tablosunda) 1 numara ol.
          </p>
        </GlassCard>

        <GlassCard className="flex flex-col items-center text-center p-8 group" hoverable>
          <div className="w-16 h-16 rounded-full bg-purple-900/50 border border-bordeaux-500/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-3 font-heading text-white">Özel Odalar</h3>
          <p className="text-white/60 text-sm">
            Tıpkı gerçek pavyon koltukları gibi... İster kalabalıkla sohbet et, ister özel odalara geç.
          </p>
        </GlassCard>
      </motion.div>
    </main>
  );
}
