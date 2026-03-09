import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    try {
        const { email, password, nickname, avatar } = await req.json();

        if (!nickname) {
            return NextResponse.json({ error: "Nickname is required" }, { status: 400 });
        }

        // 1. Check if nickname is taken
        const existingNickname: any = await (prisma.user as any).findFirst({
            where: { nickname: nickname.trim() }
        });

        if (existingNickname && existingNickname.email !== email) {
            return NextResponse.json({ error: "Bu lakap zaten alınmış!" }, { status: 400 });
        }

        // 2. Handle Login or Signup via email
        let user: any;
        if (email) {
            user = await (prisma.user as any).findFirst({
                where: { email }
            });

            if (user) {
                // Update nickname if changed (allowed)
                user = await (prisma.user as any).update({
                    where: { id: user.id },
                    data: {
                        nickname: nickname.trim(),
                        avatar: avatar || user.avatar
                    }
                });
            } else {
                // Signup
                user = await (prisma.user as any).create({
                    data: {
                        email,
                        nickname: nickname.trim(),
                        avatar: avatar || null,
                        credits: 100
                    }
                });
            }
        } else {
            // Anonymous temporary user
            user = await (prisma.user as any).upsert({
                where: { nickname: nickname.trim() },
                update: { avatar: avatar || null },
                create: {
                    nickname: nickname.trim(),
                    avatar: avatar || null,
                    credits: 100
                }
            });
        }

        return NextResponse.json(user);
    } catch (error: any) {
        console.error("Auth error:", error);
        return NextResponse.json({ error: "İşlem sırasında bir hata oluştu." }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const nickname = searchParams.get("nickname");
    const email = searchParams.get("email");

    if (nickname) {
        const user = await (prisma.user as any).findFirst({ where: { nickname } });
        return NextResponse.json({ isTaken: !!user });
    }

    if (email) {
        const user = await (prisma.user as any).findFirst({ where: { email } });
        return NextResponse.json({ user });
    }

    return NextResponse.json({ error: "Missing params" }, { status: 400 });
}
