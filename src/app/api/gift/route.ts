import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function POST(req: Request) {
    try {
        const data = await req.json();
        if (!data.senderId || !data.giftType || !data.creditCost) {
            return NextResponse.json({ success: false, error: "Eksik veri" }, { status: 400 });
        }
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const senderValid = uuidRegex.test(data.senderId);
        if (!senderValid) {
            return NextResponse.json({ success: false, error: "Geçersiz gönderen" }, { status: 400 });
        }
        const receiverValid = data.receiverId && uuidRegex.test(data.receiverId);
        const finalReceiverId = receiverValid ? data.receiverId : data.senderId;
        await prisma.gift.create({
            data: {
                type: data.giftType,
                creditCost: data.creditCost,
                tlValue: data.tlValue || 0,
                senderId: data.senderId,
                receiverId: finalReceiverId,
                createdAt: new Date(),
            }
        });
        await prisma.user.update({
            where: { id: data.senderId },
            data: { credits: { decrement: data.creditCost } }
        });
        if (receiverValid && data.receiverId !== data.senderId) {
            await prisma.user.update({
                where: { id: data.receiverId },
                data: { earnings: { increment: data.tlValue || 0 } }
            });
        }
        return NextResponse.json({ success: true });
    } catch (e: any) {
        console.error("Gift API error:", e.message);
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}
