// ─── API client with graceful degradation ────────────────────────────────
// Talks to the NETHEX backend when reachable; otherwise the app falls back to
// bundled mock data so the UI is always runnable (see DECISIONS.md).

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080';

export interface ApiResult<T> {
  data: T | null;
  online: boolean;
  error?: string;
}

let onlineCache: boolean | null = null;

export async function pingApi(timeoutMs = 1200): Promise<boolean> {
  if (onlineCache !== null) return onlineCache;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    const res = await fetch(`${API_URL}/health`, { signal: ctrl.signal });
    clearTimeout(t);
    onlineCache = res.ok;
  } catch {
    onlineCache = false;
  }
  return onlineCache;
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<ApiResult<T>> {
  try {
    const token = localStorage.getItem('nethex.token');
    const res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init?.headers || {}),
      },
    });
    if (!res.ok) return { data: null, online: true, error: `HTTP ${res.status}` };
    return { data: (await res.json()) as T, online: true };
  } catch (e) {
    return { data: null, online: false, error: (e as Error).message };
  }
}

/** Build the WebSocket URL for a lab terminal PTY session. */
export function terminalWsUrl(sessionId: string): string {
  const token = localStorage.getItem('nethex.token') || '';
  return `${WS_URL}/ws/terminal?session=${encodeURIComponent(
    sessionId,
  )}&token=${encodeURIComponent(token)}`;
}

export const apiConfig = { API_URL, WS_URL };
