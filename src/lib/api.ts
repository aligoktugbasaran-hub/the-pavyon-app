/**
 * Shared API base URL. Use env var if available.
 * On Web, we use relative paths. On Mobile, we need the full IP.
 */
const getBaseUrl = () => {
    if (typeof window === "undefined") return process.env.NEXT_PUBLIC_API_URL || "";
    
    const isCapacitor = !!(window as any).Capacitor?.isNativePlatform?.() || 
                        window.location.protocol === "capacitor:" ||
                        window.location.protocol === "file:";
    
    if (isCapacitor) {
        return "https://the-pavyon-app-production.up.railway.app";
    }
    
    return "";
};

export const API_BASE_URL = getBaseUrl();

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
            throw new Error(errBody.error || `Bir sorun çıktı: ${res.status}`);
        }

        return res.json();
    } catch (e: any) {
        console.error("❌ FETCH FAILED:", {
            url,
            message: e.message,
            stack: e.stack,
            isNetworkError: e instanceof TypeError
        });

        if (e instanceof TypeError) {
            throw new Error("Sunucuya bağlanılamadı. İnternet bağlantınızı veya sunucu adresini kontrol edin.");
        }
        throw e;
    }
}
