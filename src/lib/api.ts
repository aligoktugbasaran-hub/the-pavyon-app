/**
 * Shared API base URL. Use env var if available, else fallback to current origin for Web.
 * Since this is Capacitor, we'll need to hit a real domain for mobile.
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function fetchWithBase(path: string, options?: RequestInit) {
    const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`API error: ${res.statusText}`);
    return res.json();
}
