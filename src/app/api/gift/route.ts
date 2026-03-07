import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    try {
        const data = await req.json();

        // 1. Create gift record
        await prisma.gift.create({
            data: {
                type: data.giftType,
                creditCost: data.creditCost,
                tlValue: data.tlValue,
                senderId: data.senderId,
                receiverId: data.receiverId,
                createdAt: new Date(),
            }
        });

        // 2. Upsert users
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

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error("Failed to register gift:", e);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
