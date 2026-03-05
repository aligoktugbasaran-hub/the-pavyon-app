import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: "pink" | "gold" | "ghost";
    fullWidth?: boolean;
}

export function NeonButton({
    children,
    className,
    variant = "pink",
    fullWidth = false,
    ...props
}: NeonButtonProps) {
    return (
        <button
            className={cn(
                "relative inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-full transition-all duration-300",
                fullWidth && "w-full",
                variant === "pink" && "bg-neon-pink hover:bg-[#d6006a] neon-glow-pink text-white",
                variant === "gold" && "bg-gold-500 hover:bg-gold-400 text-pavyon-bg neon-glow-gold",
                variant === "ghost" && "bg-transparent border border-white/20 hover:bg-white/10 text-white",
                "active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
