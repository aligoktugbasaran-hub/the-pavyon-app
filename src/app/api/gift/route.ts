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

        // 2. Kredi düş (sender)
        await prisma.user.update({
            where: { id: data.senderId },
            data: { credits: { decrement: data.creditCost } }
        });

        // 3. Kazanç ekle (receiver)
        await prisma.user.update({
            where: { id: data.receiverId },
            data: { earnings: { increment: data.tlValue } }
        });

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error("Failed to register gift:", e);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
