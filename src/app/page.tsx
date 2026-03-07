"use client";

import { motion } from "framer-motion";
import { LogIn, Sparkles, Ghost, Gift } from "lucide-react";
import Link from "next/link";
import { NeonButton } from "@/components/ui/NeonButton";
import { GlassCard } from "@/components/ui/GlassCard";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden bg-[#05000a]" style={{ background: '#05000a' }}>
      {/* Premium Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-pink/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 pavyon-grid opacity-10 pointer-events-none" />

      {/* Hero Section - Centered for App Feel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center z-10 max-w-xl flex flex-col items-center"
      >
        {/* Logo Container - Large & Pulsing */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            filter: ["drop-shadow(0 0 10px rgba(255,215,0,0.2))", "drop-shadow(0 0 20px rgba(255,215,0,0.4))", "drop-shadow(0 0 10px rgba(255,215,0,0.2))"]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="w-40 h-40 md:w-48 md:h-48 mb-8 rounded-full border-[3px] border-gold-500/30 flex items-center justify-center p-2 relative bg-black/40 backdrop-blur-sm shadow-[0_0_40px_rgba(0,0,0,0.5)]"
          style={{ width: '160px', height: '160px' }}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-gold-500/10 to-transparent blur-md -z-10" />
          <img
            src="/logo.png"
            alt="The Pavyon Logo"
            className="w-32 h-32 object-contain relative z-10"
            style={{ width: '85%', height: '85%' }}
            onError={(e) => {
              e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
            }}
          />
        </motion.div>

        <h1
          className="text-4xl md:text-6xl font-black mb-4 text-white tracking-tighter leading-tight font-heading"
          style={{
            color: 'white',
            textShadow: '0 0 15px #ff007f, 0 0 30px rgba(255,0,127,0.5)',
            fontSize: 'clamp(2rem, 10vw, 3.5rem)'
          }}
        >
          THE PAVYON
        </h1>

        <p className="text-base md:text-lg text-white/50 mb-10 max-w-sm mx-auto font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Türkiye'nin lüks ve anonim sanal pavyonu. <br className="hidden md:block" />
          Eğlenceye hazır mısın?
        </p>

        <Link href="/join" className="w-full max-w-xs">
          <button
            className="w-full bg-gradient-to-r from-neon-pink to-purple-600 hover:from-neon-pink/90 hover:to-purple-500 text-white font-black text-xl py-5 rounded-2xl shadow-[0_0_30px_rgba(255,0,127,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest flex items-center justify-center gap-3 border border-white/10"
            style={{
              background: 'linear-gradient(to right, #ff007f, #7e22ce)',
              boxShadow: '0 0 25px rgba(255,0,127,0.4)'
            }}
          >
            <LogIn className="w-6 h-6" />
            HEMEN GİR
          </button>
        </Link>
      </motion.div>

      {/* App Quick Features - Horizontal on Desktop, Compact on Mobile */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="flex flex-wrap justify-center gap-4 mt-16 z-10 w-full max-w-2xl px-4"
      >
        <div className="flex-1 min-w-[120px] bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center text-center backdrop-blur-md">
          <Ghost className="w-6 h-6 text-neon-pink mb-2" />
          <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Anonim</span>
        </div>

        <div className="flex-1 min-w-[120px] bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center text-center backdrop-blur-md">
          <Gift className="w-6 h-6 text-gold-400 mb-2" />
          <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Hediye</span>
        </div>

        <div className="flex-1 min-w-[120px] bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center text-center backdrop-blur-md">
          <Sparkles className="w-6 h-6 text-cyan-400 mb-2" />
          <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Eğlence</span>
        </div>
      </motion.div>
    </main>
  );
}
