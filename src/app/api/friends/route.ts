import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) return NextResponse.json({ error: "UserId required" }, { status: 400 });

    const friendships = await (prisma as any).friendship.findMany({
        where: {
            OR: [
                { senderId: userId, status: "ACCEPTED" },
                { receiverId: userId, status: "ACCEPTED" }
            ]
        },
        include: {
            sender: true,
            receiver: true
        }
    });

    const friends = friendships.map((f: any) => {
        const friend = f.senderId === userId ? f.receiver : f.sender;
        return {
            id: friend.id,
            nickname: friend.nickname,
            avatar: friend.avatar || "/avatars/male_avatar_1.png"
        };
    });

    return NextResponse.json(friends);
}

async function resolveUser(idOrNickname: string) {
    let user = await (prisma.user as any).findFirst({
        where: {
            OR: [
                { id: idOrNickname },
                { nickname: idOrNickname }
            ]
        }
    });

    if (!user && idOrNickname.length < 50) { // Probably a nickname
        user = await (prisma.user as any).create({
            data: {
                nickname: idOrNickname,
                avatar: `/avatars/${Math.random() > 0.5 ? 'female' : 'male'}_avatar_${Math.floor(Math.random() * 6) + 1}.png`,
                credits: 100
            }
        });
    }
    return user;
}

export async function POST(req: Request) {
    try {
        const { senderId, receiverId, action } = await req.json();

        const sender = await resolveUser(senderId);
        const receiver = await resolveUser(receiverId);

        if (!sender || !receiver) {
            return NextResponse.json({ error: "Users not found" }, { status: 404 });
        }

        const sid = sender.id;
        const rid = receiver.id;

        if (action === "REQUEST") {
            await (prisma as any).friendship.upsert({
                where: { senderId_receiverId: { senderId: sid, receiverId: rid } },
                update: { status: "PENDING" },
                create: { senderId: sid, receiverId: rid, status: "PENDING" }
            });
            return NextResponse.json({ success: true });
        }

        if (action === "ACCEPT") {
            await (prisma as any).friendship.update({
                where: { senderId_receiverId: { senderId: sid, receiverId: rid } },
                data: { status: "ACCEPTED" }
            });
            return NextResponse.json({ success: true });
        }

        if (action === "REMOVE") {
            await (prisma as any).friendship.deleteMany({
                where: {
                    OR: [
                        { senderId: sid, receiverId: rid },
                        { senderId: rid, receiverId: sid }
                    ]
                }
            });
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}
