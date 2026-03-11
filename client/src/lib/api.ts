// API configuration
// For production, set either VITE_API_BASE_URL or VITE_API_URL to your Render backend URL.
// For local development, it falls back to the same-origin path behavior used by Vite.
const rawApiBaseUrl =
  import.meta.env.VITE_API_BASE_URL?.trim() ??
  import.meta.env.VITE_API_URL?.trim() ??
  "";

export const API_URL = rawApiBaseUrl.replace(/\/+$/, "");

export function withApiBase(path: string): string {
  if (!API_URL) return path;
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith("/")) return `${API_URL}${path}`;
  return `${API_URL}/${path}`;
}

// WebSocket URL - converts http/https to ws/wss
export const WS_URL = (API_URL || "http://localhost:5000")
  .replace("https://", "wss://")
  .replace("http://", "ws://");

// API endpoints
export const API_ENDPOINTS = {
  menu: withApiBase("/api/menu"),
  orders: withApiBase("/api/orders"),
  orderStatus: (id: number) => withApiBase(`/api/orders/${id}/status`),
  contact: withApiBase("/api/contact"),
  adminLogin: withApiBase("/api/admin/login"),
  adminLogout: withApiBase("/api/admin/logout"),
  adminMe: withApiBase("/api/admin/me"),
  ws: `${WS_URL}/ws`,
} as const;
