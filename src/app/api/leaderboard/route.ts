import { prisma } from "@/lib/db";
import { startOfDay, endOfDay } from "date-fns";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    try {
        // Get top Givers (Bonkörler)
        const topGiversRaw = await prisma.gift.groupBy({
            by: ['senderId'],
            where: {
                createdAt: {
                    gte: todayStart,
                    lte: todayEnd,
                }
            },
            _sum: {
                creditCost: true,
            },
            orderBy: {
                _sum: {
                    creditCost: 'desc',
                }
            },
            take: 3,
        });

        // Get top Receivers (Ünlüler)
        const topReceiversRaw = await prisma.gift.groupBy({
            by: ['receiverId'],
            where: {
                createdAt: {
                    gte: todayStart,
                    lte: todayEnd,
                }
            },
            _sum: {
                creditCost: true,
            },
            orderBy: {
                _sum: {
                    creditCost: 'desc',
                }
            },
            take: 10,
        });

        const givers = await Promise.all(topGiversRaw.map(async (g: any) => {
            const user = await prisma.user.findUnique({ where: { id: g.senderId } });
            return {
                id: user?.id || g.senderId,
                name: user?.nickname || "Anonim",
                avatar: user?.photos[0] || "/avatars/male_avatar_1.png",
                amount: g._sum.creditCost || 0,
            };
        }));

        const receivers = await Promise.all(topReceiversRaw.map(async (r: any) => {
            const user = await prisma.user.findUnique({ where: { id: r.receiverId } });
            return {
                id: user?.id || r.receiverId,
                name: user?.nickname || "Anonim",
                avatar: user?.photos[0] || "/avatars/female_avatar_1.png",
                amount: r._sum.creditCost || 0,
                age: 20 + Math.floor(Math.random() * 10),
            };
        }));

        return NextResponse.json({ givers, receivers });
    } catch (e) {
        console.error("Failed to fetch leaderboard:", e);
        return NextResponse.json({ givers: [], receivers: [] }, { status: 500 });
    }
}
