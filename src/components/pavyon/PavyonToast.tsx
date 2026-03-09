"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";

export function PavyonToast() {
    const { toast } = useUserStore();

    if (!toast.message) return null;

    const getIcon = () => {
        switch (toast.type) {
            case "error": return <AlertCircle className="w-5 h-5 text-red-500" />;
            case "success": return <CheckCircle2 className="w-5 h-5 text-green-500" />;
            default: return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const getColors = () => {
        switch (toast.type) {
            case "error": return "border-red-500/30 bg-red-950/40 text-red-200 shadow-[0_0_20px_rgba(239,68,68,0.2)]";
            case "success": return "border-green-500/30 bg-green-950/40 text-green-200 shadow-[0_0_20px_rgba(34,197,94,0.2)]";
            default: return "border-neon-pink/30 bg-purple-950/40 text-pink-100 shadow-[0_0_20px_rgba(255,0,127,0.2)]";
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[999999] px-6 py-4 rounded-2xl border backdrop-blur-xl flex items-center gap-3 min-w-[300px] max-w-[90vw] ${getColors()}`}
            >
                <div className="shrink-0">{getIcon()}</div>
                <div className="flex-1">
                    <p className="text-sm font-black tracking-tight leading-tight uppercase italic">{toast.message}</p>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
