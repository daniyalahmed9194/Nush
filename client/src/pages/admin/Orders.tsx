import { useState, useMemo } from "react";
import { useOrders, useUpdateOrderStatus } from "@/hooks/use-orders";
import type { OrderWithDetails } from "@shared/schema";
import {
  Search,
  ShoppingBag,
  User,
  MapPin,
  Phone,
  Clock,
  ChevronDown,
  Loader2,
  PackageCheck,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

function fmt(cents: number) {
  return `Rs. ${Math.round(cents / 100).toLocaleString()}`;
}

function formatDate(date: Date) {
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

const STATUS_TABS = ["all", "pending", "confirmed", "preparing", "completed", "cancelled"] as const;
type StatusTab = (typeof STATUS_TABS)[number];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; dot: string }> = {
  pending:   { label: "Pending",   color: "text-amber-700",  bg: "bg-amber-50",   border: "border-amber-200",  dot: "bg-amber-400" },
  confirmed: { label: "Confirmed", color: "text-blue-700",   bg: "bg-blue-50",    border: "border-blue-200",   dot: "bg-blue-400" },
  preparing: { label: "Preparing", color: "text-purple-700", bg: "bg-purple-50",  border: "border-purple-200", dot: "bg-purple-400" },
  completed: { label: "Completed", color: "text-emerald-700",bg: "bg-emerald-50", border: "border-emerald-200",dot: "bg-emerald-400" },
  cancelled: { label: "Cancelled", color: "text-red-700",    bg: "bg-red-50",     border: "border-red-200",    dot: "bg-red-400" },
};

export default function Orders() {
  const { data: orders = [], isLoading } = useOrders();
  const updateStatus = useUpdateOrderStatus();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<StatusTab>("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders.length };
    orders.forEach((o) => { c[o.status] = (c[o.status] || 0) + 1; });
    return c;
  }, [orders]);

  const filtered = useMemo(() => {
    let list = activeTab === "all" ? orders : orders.filter((o) => o.status === activeTab);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.customer.name.toLowerCase().includes(q) ||
          o.customer.phone.includes(q) ||
          String(o.id).includes(q)
      );
    }
    return list;
  }, [orders, activeTab, search]);

  const handleStatusUpdate = async (orderId: number, status: string) => {
    try {
      await updateStatus.mutateAsync({ orderId, status });
      toast({ title: "Status updated", description: `Order #${orderId} → ${status}` });
    } catch {
      toast({ title: "Update failed", variant: "destructive" });
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
    <div className="space-y-5 max-w-6xl mx-auto">

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, order ID…"
            className="w-full bg-white border border-border/50 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary/50 focus:shadow-md focus:shadow-primary/8 transition-all"
          />
        </div>

        {/* Total label */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-border/40 text-sm">
          <ShoppingBag className="w-4 h-4 text-muted-foreground" />
          <span className="font-semibold text-secondary">{filtered.length}</span>
          <span className="text-muted-foreground">orders</span>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
              activeTab === tab
                ? "bg-secondary text-white shadow-md shadow-secondary/20"
                : "bg-white text-muted-foreground border border-border/40 hover:border-secondary/30 hover:text-secondary"
            }`}
          >
            {tab === "all" ? "All" : STATUS_CONFIG[tab]?.label}
            <span
              className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                activeTab === tab ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
              }`}
            >
              {counts[tab] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border/40 py-20 text-center">
          <div className="w-14 h-14 rounded-full bg-muted mx-auto flex items-center justify-center mb-3">
            <ShoppingBag className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="font-semibold text-secondary">No orders found</p>
          <p className="text-sm text-muted-foreground mt-1">
            {search ? "Try a different search term" : "Orders will appear here"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
            const isExpanded = expandedId === order.id;

            return (
              <div
                key={order.id}
                className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isExpanded ? "border-primary/30 shadow-lg shadow-primary/8" : "border-border/40 hover:border-border/70 hover:shadow-md"
                }`}
              >
                {/* Order Header Row — always visible */}
                <div
                  className="flex items-center gap-3 px-5 py-4 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                >
                  {/* Status dot */}
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />

                  {/* Order ID */}
                  <span className="text-xs font-bold text-muted-foreground w-10 flex-shrink-0">
                    #{order.id}
                  </span>

                  {/* Customer */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-secondary truncate">{order.customer.name}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                  </div>

                  {/* Items summary */}
                  <div className="hidden md:block text-sm text-muted-foreground flex-shrink-0">
                    {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                  </div>

                  {/* Total */}
                  <div className="font-display font-bold text-secondary text-base flex-shrink-0">
                    {fmt(order.totalAmount)}
                  </div>

                  {/* Status badge */}
                  <span className={`hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-semibold border flex-shrink-0 ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                    {cfg.label}
                  </span>

                  {/* Expand chevron */}
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform flex-shrink-0 ${isExpanded ? "rotate-180" : ""}`}
                  />
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-border/40 px-5 py-5">
                    <div className="grid md:grid-cols-2 gap-6">

                      {/* Customer info */}
                      <div>
                        <p className="text-xs font-bold text-secondary/50 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                          <User style={{ width: "12px", height: "12px" }} />
                          Customer
                        </p>
                        <div className="space-y-2.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-secondary">
                                {order.customer.name.charAt(0)}
                              </span>
                            </div>
                            <span className="font-semibold text-sm text-secondary">{order.customer.name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground pl-1">
                            <Phone style={{ width: "13px", height: "13px" }} />
                            {order.customer.phone}
                          </div>
                          <div className="flex items-start gap-2 text-sm text-muted-foreground pl-1">
                            <MapPin style={{ width: "13px", height: "13px" }} className="mt-0.5 flex-shrink-0" />
                            <span>{order.customer.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground pl-1">
                            <Clock style={{ width: "13px", height: "13px" }} />
                            {formatDate(order.createdAt)}
                          </div>
                        </div>
                      </div>

                      {/* Order items */}
                      <div>
                        <p className="text-xs font-bold text-secondary/50 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                          <ShoppingBag style={{ width: "12px", height: "12px" }} />
                          Items
                        </p>
                        <div className="bg-muted/40 rounded-xl p-3 space-y-2">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between items-center text-sm py-1.5 border-b border-border/30 last:border-0">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-md bg-secondary/10 text-secondary text-[10px] font-bold flex items-center justify-center">
                                  {item.quantity}
                                </span>
                                <span className="font-medium text-secondary">{item.menuItem.name}</span>
                              </div>
                              <span className="font-semibold text-secondary text-xs">
                                {fmt(item.priceAtTime * item.quantity)}
                              </span>
                            </div>
                          ))}
                          <div className="flex justify-between items-center pt-2">
                            <span className="text-sm font-bold text-secondary">Total</span>
                            <span className="font-display font-black text-base text-secondary">
                              {fmt(order.totalAmount)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-5 pt-4 border-t border-border/40">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-muted-foreground">Status:</span>
                        <Select
                          value={order.status}
                          onValueChange={(v) => handleStatusUpdate(order.id, v)}
                        >
                          <SelectTrigger className="h-8 text-xs w-36 rounded-lg bg-muted border-0">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">⏳ Pending</SelectItem>
                            <SelectItem value="confirmed">✓ Confirmed</SelectItem>
                            <SelectItem value="preparing">👨‍🍳 Preparing</SelectItem>
                            <SelectItem value="completed">✅ Completed</SelectItem>
                            <SelectItem value="cancelled">✕ Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Quick actions */}
                      <div className="flex gap-2 sm:ml-auto flex-wrap">
                        {order.status === "pending" && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, "confirmed")}
                            disabled={updateStatus.isPending}
                            className="px-4 py-1.5 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors disabled:opacity-50"
                          >
                            ✓ Confirm Order
                          </button>
                        )}
                        {order.status === "confirmed" && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, "preparing")}
                            disabled={updateStatus.isPending}
                            className="px-4 py-1.5 rounded-xl text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-colors disabled:opacity-50"
                          >
                            👨‍🍳 Start Preparing
                          </button>
                        )}
                        {(order.status === "pending" || order.status === "confirmed" || order.status === "preparing") && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, "completed")}
                            disabled={updateStatus.isPending}
                            className="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                          >
                            <PackageCheck style={{ width: "13px", height: "13px" }} />
                            Mark Complete
                          </button>
                        )}
                        {order.status !== "cancelled" && order.status !== "completed" && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, "cancelled")}
                            disabled={updateStatus.isPending}
                            className="px-4 py-1.5 rounded-xl text-xs font-bold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
