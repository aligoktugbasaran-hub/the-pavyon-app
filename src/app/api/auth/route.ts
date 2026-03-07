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
        const existingNickname = await prisma.user.findUnique({
            where: { nickname: nickname.trim() }
        });

        if (existingNickname && existingNickname.email !== email) {
            return NextResponse.json({ error: "Bu lakap zaten alınmış!" }, { status: 400 });
        }

        // 2. Handle Login or Signup via email
        let user;
        if (email) {
            user = await prisma.user.findUnique({
                where: { email }
            });

            if (user) {
                // Update nickname if changed (allowed)
                user = await prisma.user.update({
                    where: { email },
                    data: {
                        nickname: nickname.trim(),
                        photos: avatar ? [avatar] : user.photos
                    }
                });
            } else {
                // Signup
                user = await prisma.user.create({
                    data: {
                        email,
                        nickname: nickname.trim(),
                        photos: avatar ? [avatar] : [],
                        credits: 100
                    }
                });
            }
        } else {
            // Anonymous temporary user (or handle as failed if you require unique nicknames)
            // For now, let's treat nickname as unique identity if no email
            user = await prisma.user.upsert({
                where: { nickname: nickname.trim() },
                update: { photos: avatar ? [avatar] : [] },
                create: {
                    nickname: nickname.trim(),
                    photos: avatar ? [avatar] : [],
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
        const user = await prisma.user.findUnique({ where: { nickname } });
        return NextResponse.json({ isTaken: !!user });
    }

    if (email) {
        const user = await prisma.user.findUnique({ where: { email } });
        return NextResponse.json({ user });
    }

    return NextResponse.json({ error: "Missing params" }, { status: 400 });
}
