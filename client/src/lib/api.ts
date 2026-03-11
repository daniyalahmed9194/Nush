const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() ?? "";

const normalizedApiBaseUrl = rawApiBaseUrl
  ? rawApiBaseUrl.replace(/\/+$/, "")
  : "";

export function withApiBase(path: string): string {
  if (!normalizedApiBaseUrl) return path;
  if (/^https?:\/\//i.test(path)) return path;
  if (!path.startsWith("/")) return `${normalizedApiBaseUrl}/${path}`;
  return `${normalizedApiBaseUrl}${path}`;
}
