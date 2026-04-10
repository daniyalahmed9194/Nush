import { useMemo } from "react";
import { useOrders } from "@/hooks/use-orders";
import { useUpdateOrderStatus } from "@/hooks/use-orders";
import { Link } from "wouter";
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  PackageCheck,
  ArrowRight,
  Star,
  Banknote,
  Percent,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

function fmt(cents: number) {
  return `Rs. ${Math.round(cents / 100).toLocaleString()}`;
}

function formatTime(date: Date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  pending:   { label: "Pending",   color: "text-amber-600",  bg: "bg-amber-50",   dot: "bg-amber-400" },
  confirmed: { label: "Confirmed", color: "text-blue-600",   bg: "bg-blue-50",    dot: "bg-blue-400" },
  preparing: { label: "Preparing", color: "text-purple-600", bg: "bg-purple-50",  dot: "bg-purple-400" },
  completed: { label: "Completed", color: "text-emerald-600",bg: "bg-emerald-50", dot: "bg-emerald-400" },
  cancelled: { label: "Cancelled", color: "text-red-600",    bg: "bg-red-50",     dot: "bg-red-400" },
};

export default function Dashboard() {
  const { data: orders = [], isLoading } = useOrders();
  const updateStatus = useUpdateOrderStatus();
  const { toast } = useToast();

  const metrics = useMemo(() => {
    const completed = orders.filter((o) => o.status === "completed");
    const pending   = orders.filter((o) => o.status === "pending");
    const active    = orders.filter((o) => o.status === "confirmed" || o.status === "preparing");

    const totalRevenue   = completed.reduce((s, o) => s + o.totalAmount, 0);
    const completionRate = orders.length ? Math.round((completed.length / orders.length) * 100) : 0;
    const avgOrderValue  = completed.length ? Math.round(totalRevenue / completed.length) : 0;

    // Today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders    = orders.filter((o) => new Date(o.createdAt) >= today);
    const todayRevenue   = todayOrders.filter((o) => o.status === "completed").reduce((s, o) => s + o.totalAmount, 0);

    // Top selling items from all order items
    const itemMap: Record<string, { name: string; qty: number; revenue: number }> = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const key = item.menuItem.name;
        if (!itemMap[key]) itemMap[key] = { name: key, qty: 0, revenue: 0 };
        itemMap[key].qty += item.quantity;
        itemMap[key].revenue += item.priceAtTime * item.quantity;
      });
    });
    const topItems = Object.values(itemMap).sort((a, b) => b.qty - a.qty).slice(0, 5);

    // Status breakdown
    const statusCounts: Record<string, number> = {};
    orders.forEach((o) => { statusCounts[o.status] = (statusCounts[o.status] || 0) + 1; });

    // Recent 5 orders
    const recentOrders = [...orders].slice(0, 5);

    return {
      totalRevenue, completionRate, avgOrderValue,
      totalOrders: orders.length,
      pendingCount: pending.length,
      activeCount: active.length,
      completedCount: completed.length,
      todayOrders: todayOrders.length,
      todayRevenue,
      topItems,
      statusCounts,
      recentOrders,
    };
  }, [orders]);

  const handleQuickStatus = async (orderId: number, status: string) => {
    try {
      await updateStatus.mutateAsync({ orderId, status });
      toast({ title: "Status updated", description: `Order #${orderId} → ${status}` });
    } catch {
      toast({ title: "Failed", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Revenue",
            value: fmt(metrics.totalRevenue),
            sub: `${metrics.completedCount} completed orders`,
            icon: Banknote,
            accent: "text-primary",
            border: "border-t-primary",
          },
          {
            label: "Total Orders",
            value: metrics.totalOrders,
            sub: `${metrics.todayOrders} today`,
            icon: ShoppingBag,
            accent: "text-secondary",
            border: "border-t-secondary",
          },
          {
            label: "Pending",
            value: metrics.pendingCount,
            sub: `${metrics.activeCount} in progress`,
            icon: Clock,
            accent: "text-amber-500",
            border: "border-t-amber-400",
          },
          {
            label: "Completion Rate",
            value: `${metrics.completionRate}%`,
            sub: `Avg Rs. ${Math.round(metrics.avgOrderValue / 100).toLocaleString()} / order`,
            icon: Percent,
            accent: "text-emerald-500",
            border: "border-t-emerald-400",
          },
        ].map(({ label, value, sub, icon: Icon, accent, border }) => (
          <div
            key={label}
            className={`bg-white rounded-2xl p-5 border border-border/40 border-t-2 ${border} hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`}
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
              <div className={`w-8 h-8 rounded-xl bg-muted flex items-center justify-center ${accent}`}>
                <Icon style={{ width: "16px", height: "16px" }} />
              </div>
            </div>
            <p className={`font-display font-black text-2xl md:text-3xl text-secondary`}>{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* ── Row 2: Status Breakdown + Top Items ── */}
      <div className="grid lg:grid-cols-2 gap-5">

        {/* Status Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-border/40">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-bold text-secondary text-base">Order Status</h3>
            <Link href="/admin/orders">
              <span className="text-xs text-primary font-semibold hover:underline cursor-pointer flex items-center gap-1">
                View All <ArrowRight style={{ width: "12px", height: "12px" }} />
              </span>
            </Link>
          </div>
          <div className="space-y-3">
            {Object.entries(STATUS_CONFIG).map(([status, cfg]) => {
              const count = metrics.statusCounts[status] || 0;
              const pct = metrics.totalOrders ? Math.round((count / metrics.totalOrders) * 100) : 0;
              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                      <span className="text-sm font-medium text-secondary">{cfg.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-secondary">{count}</span>
                      <span className="text-xs text-muted-foreground w-8 text-right">{pct}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${cfg.dot} transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Today stats */}
          <div className="mt-5 pt-4 border-t border-border/40 grid grid-cols-2 gap-3">
            <div className="bg-muted/40 rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-1">Today's Orders</p>
              <p className="font-display font-black text-xl text-secondary">{metrics.todayOrders}</p>
            </div>
            <div className="bg-primary/8 rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-1">Today's Revenue</p>
              <p className="font-display font-black text-xl text-secondary">{fmt(metrics.todayRevenue)}</p>
            </div>
          </div>
        </div>

        {/* Top Selling Items */}
        <div className="bg-white rounded-2xl p-6 border border-border/40">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-bold text-secondary text-base">Top Selling Items</h3>
            <Star className="w-4 h-4 text-primary" />
          </div>
          {metrics.topItems.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
              No order data yet
            </div>
          ) : (
            <div className="space-y-3">
              {metrics.topItems.map((item, i) => {
                const maxQty = metrics.topItems[0]?.qty || 1;
                const pct = Math.round((item.qty / maxQty) * 100);
                return (
                  <div key={item.name} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-bold text-muted-foreground">#{i + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-semibold text-secondary truncate">{item.name}</p>
                        <p className="text-xs font-bold text-primary ml-2 flex-shrink-0">{item.qty}x</p>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-5 pt-4 border-t border-border/40 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Total Revenue</p>
              <p className="font-display font-bold text-lg text-secondary">{fmt(metrics.totalRevenue)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Avg Order Value</p>
              <p className="font-display font-bold text-lg text-secondary">{fmt(metrics.avgOrderValue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Recent Orders ── */}
      <div className="bg-white rounded-2xl border border-border/40">
        <div className="flex items-center justify-between p-6 border-b border-border/40">
          <h3 className="font-display font-bold text-secondary text-base">Recent Orders</h3>
          <Link href="/admin/orders">
            <span className="text-xs text-primary font-semibold hover:underline cursor-pointer flex items-center gap-1">
              View All Orders <ArrowRight style={{ width: "12px", height: "12px" }} />
            </span>
          </Link>
        </div>

        {metrics.recentOrders.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-muted mx-auto flex items-center justify-center mb-3">
              <ShoppingBag className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">No orders yet</p>
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {metrics.recentOrders.map((order) => {
              const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              return (
                <div
                  key={order.id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-colors group"
                >
                  {/* Order ID */}
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-secondary">#{order.id}</span>
                  </div>

                  {/* Customer */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-secondary truncate">{order.customer.name}</p>
                    <p className="text-xs text-muted-foreground">{order.customer.phone}</p>
                  </div>

                  {/* Items count */}
                  <div className="hidden sm:block text-center">
                    <p className="text-sm font-bold text-secondary">{order.items.length}</p>
                    <p className="text-xs text-muted-foreground">items</p>
                  </div>

                  {/* Amount */}
                  <div className="text-right hidden md:block">
                    <p className="text-sm font-bold text-secondary">{fmt(order.totalAmount)}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(order.createdAt)} · {formatTime(order.createdAt)}
                    </p>
                  </div>

                  {/* Status badge */}
                  <div className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
                    {cfg.label}
                  </div>

                  {/* Quick action */}
                  {order.status === "pending" && (
                    <button
                      onClick={() => handleQuickStatus(order.id, "confirmed")}
                      className="flex-shrink-0 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                    >
                      Confirm
                    </button>
                  )}
                  {order.status === "confirmed" && (
                    <button
                      onClick={() => handleQuickStatus(order.id, "preparing")}
                      className="flex-shrink-0 text-xs font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 px-3 py-1 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                    >
                      Preparing
                    </button>
                  )}
                  {order.status === "preparing" && (
                    <button
                      onClick={() => handleQuickStatus(order.id, "completed")}
                      className="flex-shrink-0 text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                    >
                      Complete
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
