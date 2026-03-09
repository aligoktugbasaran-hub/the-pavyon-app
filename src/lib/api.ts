/**
 * Shared API base URL. Use env var if available.
 * Since this is Capacitor, we'll need to hit a real domain or local IP for mobile.
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function fetchWithBase(path: string, options?: RequestInit) {
    // If we're on a mobile device and no API URL is set, the request will likely fail.
    if (typeof window !== "undefined" && window.location.hostname === "localhost" && !API_BASE_URL && path.startsWith("/api")) {
        console.warn("API_BASE_URL is missing. On mobile, relative /api calls will fail. Set NEXT_PUBLIC_API_URL in .env");
    }

    const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;

    try {
        const res = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...options?.headers,
            }
        });

        if (!res.ok) {
            const errBody = await res.json().catch(() => ({}));
            throw new Error(errBody.error || `Kayıtlı kalmadı: ${res.status}`);
        }
        return res.json();
    } catch (e: any) {
        console.error("Fetch failed for URL:", url, e);
        throw e;
    }
}
