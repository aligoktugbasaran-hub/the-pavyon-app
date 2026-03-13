import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const ALLOWED_HOSTS = [
    "yayin.radyoseymen.com.tr",
    "listen.radyoseymen.com.tr",
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
        return new Response("Missing url parameter", { status: 400 });
    }

    try {
        const parsed = new URL(url);
        const isAllowed = ALLOWED_HOSTS.some(host => parsed.hostname === host || parsed.hostname.endsWith("." + host));

        if (!isAllowed) {
            return new Response("Host not allowed", { status: 403 });
        }

        const upstream = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible; PavyonRadio/1.0)",
                "Accept": "*/*",
            },
        });

        if (!upstream.ok && !upstream.body) {
            return new Response("Upstream error", { status: 502 });
        }

        return new Response(upstream.body, {
            status: 200,
            headers: {
                "Content-Type": upstream.headers.get("Content-Type") || "audio/mpeg",
                "Cache-Control": "no-cache, no-store",
                "Access-Control-Allow-Origin": "*",
            },
        });
    } catch (e: any) {
        console.error("Radio proxy error:", e.message);
        return new Response("Proxy error: " + e.message, { status: 500 });
    }
}
