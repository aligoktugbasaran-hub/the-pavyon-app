import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function POST(req: Request) {
    try {
        const data = await req.json();
        if (!data.senderId || !data.giftType || !data.creditCost) {
            return NextResponse.json({ success: false, error: "Eksik veri" }, { status: 400 });
        }
        // receiverId geçerli bir UUID mi kontrol et
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const validReceiver = data.receiverId && uuidRegex.test(data.receiverId);
        // 1. Create gift record (receiverId opsiyonel)
        await prisma.gift.create({
            data: {
                type: data.giftType,
                creditCost: data.creditCost,
                tlValue: data.tlValue || 0,
                senderId: data.senderId,
                receiverId: validReceiver ? data.receiverId : data.senderId,
                createdAt: new Date(),
            }
        });
        // 2. Kredi düş (sender)
        await prisma.user.update({
            where: { id: data.senderId },
            data: { credits: { decrement: data.creditCost } }
        });
        // 3. Kazanç ekle (sadece gerçek alıcıya)
        if (validReceiver && data.receiverId !== data.senderId) {
            await prisma.user.update({
                where: { id: data.receiverId },
                data: { earnings: { increment: data.tlValue || 0 } }
            });
        }
        return NextResponse.json({ success: true });
    } catch (e: any) {
        console.error("Failed to register gift:", e.message);
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}
