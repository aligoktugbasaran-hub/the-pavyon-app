import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function GlassCard({
    children,
    className,
    hoverable = false,
}: {
    children: ReactNode;
    className?: string;
    hoverable?: boolean;
}) {
    return (
        <div
            className={cn(
                "glass-panel rounded-2xl p-6 relative overflow-hidden",
                hoverable && "glass-panel-hover cursor-pointer",
                className
            )}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            <div className="relative z-10">{children}</div>
        </div>
    );
}
