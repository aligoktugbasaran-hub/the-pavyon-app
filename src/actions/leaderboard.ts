"use server";

import { prisma } from "@/lib/db";
import { startOfDay, endOfDay } from "date-fns";

export async function registerGiftAction(data: {
    senderId: string;
    senderNickname: string;
    senderAvatar: string;
    receiverId: string;
    receiverNickname: string;
    receiverAvatar: string;
    giftType: string;
    creditCost: number;
    tlValue: number;
}) {
    try {
        // 1. Check/Create users (if not exists in DB yet, though they should be)
        // Since we are using Zustand for credits for now, we only sync the gift record for leaderboards.
        // In a full DB implementation, we would update user credits here too.

        await prisma.gift.create({
            data: {
                type: data.giftType,
                creditCost: data.creditCost,
                tlValue: data.tlValue,
                senderId: data.senderId,
                receiverId: data.receiverId,
                createdAt: new Date(), // Always record current time for resets
            }
        });

        // Ensure users exist in the DB for the relations to work
        // We'll upsert them using provide data
        await prisma.user.upsert({
            where: { id: data.senderId },
            update: { nickname: data.senderNickname, photos: [data.senderAvatar] },
            create: { id: data.senderId, nickname: data.senderNickname, photos: [data.senderAvatar] }
        });

        await prisma.user.upsert({
            where: { id: data.receiverId },
            update: { nickname: data.receiverNickname, photos: [data.receiverAvatar] },
            create: { id: data.receiverId, nickname: data.receiverNickname, photos: [data.receiverAvatar] }
        });

        return { success: true };
    } catch (e) {
        console.error("Failed to register gift:", e);
        return { success: false };
    }
}

export async function getDailyLeaderboardAction() {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    try {
        // Get top Givers (Bonkörler) - Based on creditCost sum today
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

        // Get top Receivers (Ünlüler/Top 10) - Based on creditCost sum today
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

        // Resolve user details for givers
        const givers = await Promise.all(topGiversRaw.map(async (g: any) => {
            const user = await prisma.user.findUnique({ where: { id: g.senderId } });
            return {
                id: user?.id || g.senderId,
                name: user?.nickname || "Anonim",
                avatar: user?.photos[0] || "/avatars/male_avatar_1.png",
                amount: g._sum.creditCost || 0,
            };
        }));

        // Resolve user details for receivers
        const receivers = await Promise.all(topReceiversRaw.map(async (r: any) => {
            const user = await prisma.user.findUnique({ where: { id: r.receiverId } });
            return {
                id: user?.id || r.receiverId,
                name: user?.nickname || "Anonim",
                avatar: user?.photos[0] || "/avatars/female_avatar_1.png",
                amount: r._sum.creditCost || 0,
                age: 20 + Math.floor(Math.random() * 10), // Mock age for display
            };
        }));

        return { givers, receivers };
    } catch (e) {
        console.error("Failed to fetch leaderboard:", e);
        return { givers: [], receivers: [] };
    }
}
