import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ALLOWED_HOSTS = [
    "yayin.radyoseymen.com.tr",
    "shoutcast.radyogrup.com",
    "yayin.damarfm.com",
    "live.radyositesihazir.com",
    "fenomen.listenfenomen.com",
    "playerservices.streamtheworld.com",
    "17733.live.streamtheworld.com",
    "listen.powerapp.com.tr",
    "streams.fluxfm.de",
    "ice2.somafm.com",
    "live.musopen.org",
    "streaming.radio.co",
    "radyo3.okeylisans.com",
    "cast1.taksim.fm",
    "46.20.3.204",
    "37.247.98.8",
];

export async function GET(req: NextRequest) {
    const url = req.nextUrl.searchParams.get("url");

    if (!url) {
        return NextResponse.json({ error: "Missing url" }, { status: 400 });
    }

    let parsed: URL;
    try {
        parsed = new URL(url);
    } catch {
        return NextResponse.json({ error: "Invalid url" }, { status: 400 });
    }

    const isAllowed = ALLOWED_HOSTS.some(
        host => parsed.hostname === host || parsed.hostname.endsWith("." + host)
    );

    if (!isAllowed) {
        return NextResponse.json({ error: "Host not allowed: " + parsed.hostname }, { status: 403 });
    }

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        const upstream = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "*/*",
                "Icy-MetaData": "0",
            },
            signal: controller.signal,
            redirect: "follow",
        });

        clearTimeout(timeout);

        if (!upstream.ok) {
            return NextResponse.json(
                { error: `Upstream ${upstream.status}` },
                { status: 502 }
            );
        }

        const contentType = upstream.headers.get("content-type") || "audio/mpeg";

        const headers = new Headers({
            "Content-Type": contentType,
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Access-Control-Allow-Origin": "*",
            "Transfer-Encoding": "chunked",
        });

        if (upstream.headers.has("icy-name")) {
            headers.set("icy-name", upstream.headers.get("icy-name")!);
        }

        return new Response(upstream.body as any, {
            status: 200,
            headers,
        });
    } catch (e: any) {
        console.error("Radio proxy error:", e.message);
        return NextResponse.json(
            { error: "Proxy failed: " + e.message },
            { status: 500 }
        );
    }
}
