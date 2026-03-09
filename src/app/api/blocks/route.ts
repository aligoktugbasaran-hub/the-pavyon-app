import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) return NextResponse.json({ error: "UserId required" }, { status: 400 });

    const blocks = await (prisma as any).block.findMany({
        where: { blockerId: userId },
        include: { blocked: true }
    });

    const blocked = blocks.map((b: any) => b.blocked.nickname);

    return NextResponse.json(blocked);
}

async function resolveUser(idOrNickname: string) {
    let user = await prisma.user.findFirst({
        where: {
            OR: [
                { id: idOrNickname },
                { nickname: idOrNickname }
            ]
        }
    });

    if (!user && idOrNickname.length < 50) {
        user = await prisma.user.create({
            data: {
                nickname: idOrNickname,
                avatar: `/avatars/male_avatar_1.png`,
                credits: 100
            }
        });
    }
    return user;
}

export async function POST(req: Request) {
    try {
        const { blockerId, blockedId } = await req.json();

        const blocker = await resolveUser(blockerId);
        const blocked = await resolveUser(blockedId);

        if (!blocker || !blocked) return NextResponse.json({ error: "Users not found" }, { status: 404 });

        const bid = blocker.id;
        const targetId = blocked.id;

        // 1. Create block
        await (prisma as any).block.upsert({
            where: { blockerId_blockedId: { blockerId: bid, blockedId: targetId } },
            update: {},
            create: { blockerId: bid, blockedId: targetId }
        });

        // 2. Remove friendship if exists
        await (prisma as any).friendship.deleteMany({
            where: {
                OR: [
                    { senderId: bid, receiverId: targetId },
                    { senderId: targetId, receiverId: bid }
                ]
            }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Block error", error);
        return NextResponse.json({ error: "Failed" }, { status: 400 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { blockerId, blockedId } = await req.json();

        const blocker = await resolveUser(blockerId);
        const blocked = await resolveUser(blockedId);

        if (!blocker || !blocked) return NextResponse.json({ error: "Users not found" }, { status: 404 });

        await (prisma as any).block.delete({
            where: { blockerId_blockedId: { blockerId: blocker.id, blockedId: blocked.id } }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Unblock error", error);
        return NextResponse.json({ error: "Failed" }, { status: 400 });
    }
}
