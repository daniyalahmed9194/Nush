import { useState, useEffect, useCallback } from "react";
import { useLocation, Link } from "wouter";
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Download,
} from "lucide-react";
import { API_ENDPOINTS } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Orders",    icon: ShoppingBag,     href: "/admin/orders" },
  { label: "Menu",      icon: UtensilsCrossed,  href: "/admin/menu" },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen]     = useState(false);
  const [notification, setNotification]   = useState(false);
  const [newOrderCount, setNewOrderCount] = useState(0);
  const [adminName, setAdminName]         = useState("");
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // ── Admin name ──
  useEffect(() => {
    const adminUser = localStorage.getItem("admin_user");
    if (adminUser) {
      try {
        const user = JSON.parse(adminUser);
        setAdminName(user.name || user.username || "Admin");
      } catch {}
    }
  }, []);

  // ── Notification permission ──
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      // Ask after a short delay so it doesn't feel intrusive on first load
      const t = setTimeout(() => {
        Notification.requestPermission();
      }, 3000);
      return () => clearTimeout(t);
    }
  }, []);

  // ── PWA install prompt ──
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstallBanner(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") {
      setShowInstallBanner(false);
      setInstallPrompt(null);
    }
  };

  // ── WebSocket — new order notifications ──
  useEffect(() => {
    const ws = new WebSocket(API_ENDPOINTS.ws);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "NEW_ORDER") {
          const customerName = data.data.customer.name;
          const total = `Rs. ${Math.round(data.data.totalAmount / 100).toLocaleString()}`;

          setNotification(true);
          setNewOrderCount((c) => c + 1);

          // In-app toast
          toast({
            title: "New Order Received!",
            description: `Order from ${customerName} — ${total}`,
          });

          // System notification (works when app is minimized)
          if ("Notification" in window && Notification.permission === "granted") {
            const n = new Notification("🔔 New Order — NUSH Admin", {
              body: `${customerName} placed an order for ${total}`,
              icon: "/pwa-icon.svg",
              badge: "/pwa-icon.svg",
              tag: `order-${data.data.id}`,  // prevents duplicate notifications
              requireInteraction: true,       // stays until dismissed
            });
            // Clicking notification focuses app and opens Orders page
            n.onclick = () => {
              window.focus();
              setLocation("/admin/orders");
              n.close();
            };
          }

          // Beep audio
          const audio = new Audio(
            "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZRQ0PQKX"
          );
          audio.play().catch(() => {});

          queryClient.invalidateQueries({ queryKey: ["orders"] });
          setTimeout(() => setNotification(false), 4000);
        }
      } catch {}
    };

    return () => ws.close();
  }, [toast, queryClient, setLocation]);

  // ── Logout ──
  const handleLogout = useCallback(async () => {
    const token = localStorage.getItem("admin_token");
    try {
      await fetch(API_ENDPOINTS.adminLogout, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {}
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    setLocation("/admin/login");
  }, [setLocation]);

  const isActive = (href: string) =>
    href === "/admin" ? location === "/admin" : location.startsWith(href);

  return (
    <div className="min-h-screen bg-[#f7f8fc] flex">

      {/* ── Sidebar ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-secondary z-40 flex flex-col transition-transform duration-300 ease-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo */}
        <div className="px-5 py-6 border-b border-white/8">
          <div className="flex items-center justify-between">
            <Link href="/admin">
              <div className="flex items-center gap-2.5 cursor-pointer group">
                <div className="bg-primary px-3 py-1.5 rounded-lg group-hover:scale-105 transition-transform">
                  <span className="font-display font-black text-lg text-secondary tracking-tighter leading-none">
                    NUSH
                  </span>
                </div>
                <span className="text-white/50 text-xs font-semibold uppercase tracking-widest">
                  Admin
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-white/40 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
          <p className="text-white/25 text-[10px] font-bold uppercase tracking-[0.2em] px-3 mb-3">
            Navigation
          </p>
          {NAV_ITEMS.map(({ label, icon: Icon, href }) => (
            <Link key={href} href={href}>
              <div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200
                  ${isActive(href)
                    ? "bg-primary/15 text-primary"
                    : "text-white/50 hover:bg-white/6 hover:text-white/90"
                  }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon style={{ width: "18px", height: "18px" }} className="flex-shrink-0" />
                <span className="font-semibold text-sm">{label}</span>
                {isActive(href) && (
                  <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-60" />
                )}
              </div>
            </Link>
          ))}
        </nav>

        {/* Admin info + logout */}
        <div className="px-3 py-4 border-t border-white/8">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl mb-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold text-sm">
                {adminName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">{adminName}</p>
              <p className="text-white/35 text-xs">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 text-sm font-semibold"
          >
            <LogOut style={{ width: "16px", height: "16px" }} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">

        {/* Install banner */}
        {showInstallBanner && (
          <div className="bg-primary px-5 py-2.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Download className="w-4 h-4 text-secondary flex-shrink-0" />
              <p className="text-secondary text-xs font-semibold">
                Install NUSH Admin as an app for faster access & notifications
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleInstall}
                className="bg-secondary text-white text-xs font-bold px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity"
              >
                Install
              </button>
              <button
                onClick={() => setShowInstallBanner(false)}
                className="text-secondary/60 hover:text-secondary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Sticky top bar */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-xl border-b border-border/40 px-5 py-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                className="md:hidden w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-secondary"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="font-display font-bold text-lg text-secondary leading-tight">
                  {NAV_ITEMS.find((n) => isActive(n.href))?.label ?? "Admin"}
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Notification bell */}
              <button
                className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                  notification
                    ? "bg-red-50 text-red-500"
                    : "bg-muted text-muted-foreground hover:text-secondary"
                }`}
                onClick={() => {
                  setNotification(false);
                  setNewOrderCount(0);
                  setLocation("/admin/orders");
                }}
              >
                <Bell style={{ width: "18px", height: "18px" }} />
                {newOrderCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white font-bold flex items-center justify-center">
                    {newOrderCount > 9 ? "9+" : newOrderCount}
                  </span>
                )}
                {notification && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping opacity-75" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 md:p-7">{children}</main>
      </div>
    </div>
  );
}
