// API Configuration
// For production: Set VITE_API_URL in .env.production to your Railway/Render backend URL
// For development: Uses localhost:5000
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// WebSocket URL - converts http/https to ws/wss
export const WS_URL = API_URL.replace('https://', 'wss://').replace('http://', 'ws://');

// API endpoints
export const API_ENDPOINTS = {
  // Menu
  menu: `${API_URL}/api/menu`,
  
  // Orders
  orders: `${API_URL}/api/orders`,
  orderStatus: (id: number) => `${API_URL}/api/orders/${id}/status`,
  
  // Contact
  contact: `${API_URL}/api/contact`,
  
  // Admin
  adminLogin: `${API_URL}/api/admin/login`,
  adminLogout: `${API_URL}/api/admin/logout`,
  adminMe: `${API_URL}/api/admin/me`,
  
  // WebSocket
  ws: `${WS_URL}/ws`,
} as const;
