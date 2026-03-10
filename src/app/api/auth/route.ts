import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// Session süresi: mail varsa 30 gün, yoksa 24 saat
const SESSION_DURATION_EMAIL = 30 * 24 * 60 * 60 * 1000;
const SESSION_DURATION_ANON = 24 * 60 * 60 * 1000;

export async function POST(req: Request) {
    try {
        const { email, nickname, avatar } = await req.json();

        if (!nickname) {
            return NextResponse.json({ error: "Lakap zorunludur." }, { status: 400 });
        }

        const trimmedNickname = nickname.trim();

        // 1. Lakap anlık olarak alınmış mı? (başka bir kullanıcıya ait)
        const existingNickname = await prisma.user.findFirst({
            where: { nickname: trimmedNickname }
        });

        if (existingNickname) {
            // Eğer mail ile kayıtlıysa ve aynı mail değilse → kesinlikle alınamaz
            if (existingNickname.email && existingNickname.email !== email) {
                return NextResponse.json({ error: "Bu lakap zaten alınmış!" }, { status: 400 });
            }
            // Eğer mailsiz kayıtlıysa → aktif session var mı kontrol et
            if (!existingNickname.email) {
                const activeSession = await prisma.session.findFirst({
                    where: {
                        userId: existingNickname.id,
                        expiresAt: { gt: new Date() }
                    }
                });
                if (activeSession) {
                    return NextResponse.json({ error: "Bu lakap şu an kullanımda!" }, { status: 400 });
                }
            }
        }

        let user: any;

        if (email) {
            // Mail ile giriş/kayıt
            user = await prisma.user.findFirst({ where: { email } });

            if (user) {
                // Mevcut kullanıcı — lakap değiştirmek istiyorsa kontrol et
                if (user.nickname !== trimmedNickname) {
                    const nickConflict = await prisma.user.findFirst({
                        where: { nickname: trimmedNickname, NOT: { id: user.id } }
                    });
                    if (nickConflict) {
                        return NextResponse.json({ error: "Bu lakap zaten alınmış!" }, { status: 400 });
                    }
                }
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        nickname: trimmedNickname,
                        avatar: avatar || user.avatar,
                        isOnline: true,
                        lastSeenAt: new Date()
                    }
                });
            } else {
                // Yeni kayıt
                user = await prisma.user.create({
                    data: {
                        email,
                        nickname: trimmedNickname,
                        avatar: avatar || null,
                        credits: 100,
                        isOnline: true
                    }
                });
            }
        } else {
            // Anonim kullanıcı
            if (existingNickname && !existingNickname.email) {
                // Eskiyi güncelle
                user = await prisma.user.update({
                    where: { id: existingNickname.id },
                    data: { avatar: avatar || null, isOnline: true, lastSeenAt: new Date() }
                });
            } else {
                user = await prisma.user.create({
                    data: {
                        nickname: trimmedNickname,
                        avatar: avatar || null,
                        credits: 100,
                        isOnline: true
                    }
                });
            }
        }

        // Session oluştur
        const duration = email ? SESSION_DURATION_EMAIL : SESSION_DURATION_ANON;
        const session = await prisma.session.create({
            data: {
                userId: user.id,
                nickname: trimmedNickname,
                expiresAt: new Date(Date.now() + duration)
            }
        });

        return NextResponse.json({ ...user, sessionToken: session.token });

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
        const user = await prisma.user.findFirst({ where: { nickname } });
        if (!user) return NextResponse.json({ isTaken: false });

        // Mail ile kayıtlıysa her zaman alınmış
        if (user.email) return NextResponse.json({ isTaken: true });

        // Mailsiz ise aktif session var mı?
        const activeSession = await prisma.session.findFirst({
            where: {
                userId: user.id,
                expiresAt: { gt: new Date() }
            }
        });
        return NextResponse.json({ isTaken: !!activeSession });
    }

    if (email) {
        const user = await prisma.user.findFirst({ where: { email } });
        return NextResponse.json({ user });
    }

    return NextResponse.json({ error: "Missing params" }, { status: 400 });
}

export async function DELETE(req: Request) {
    // Çıkış yapınca session sil ve isOnline kapat
    try {
        const { sessionToken } = await req.json();
        if (!sessionToken) return NextResponse.json({ ok: true });

        const session = await prisma.session.findUnique({ where: { token: sessionToken } });
        if (session) {
            await prisma.user.update({
                where: { id: session.userId },
                data: { isOnline: false, lastSeenAt: new Date() }
            });
            await prisma.session.delete({ where: { token: sessionToken } });
        }
        return NextResponse.json({ ok: true });
    } catch (e) {
        return NextResponse.json({ ok: true });
    }
}
