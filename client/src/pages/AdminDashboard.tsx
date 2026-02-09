import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useOrders, useUpdateOrderStatus } from "@/hooks/use-orders";
import type { OrderWithDetails } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, Loader2, ShoppingBag, User, MapPin, Phone, Clock, LogOut, TrendingUp, PackageCheck, UtensilsCrossed } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_ENDPOINTS } from "@/lib/api";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { data: orders, isLoading, refetch } = useOrders();
  const updateStatus = useUpdateOrderStatus();
  const { toast } = useToast();
  const [notification, setNotification] = useState(false);
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    const adminUser = localStorage.getItem("admin_user");
    if (adminUser) {
      const user = JSON.parse(adminUser);
      setAdminName(user.name);
    }
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("admin_token");
    
    try {
      await fetch(API_ENDPOINTS.adminLogout, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
    
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    setLocation("/admin/login");
  };

  // WebSocket connection for real-time orders
  useEffect(() => {
    const ws = new WebSocket(API_ENDPOINTS.ws);

    ws.onopen = () => {
      console.log("Connected to order notifications");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "NEW_ORDER") {
        setNotification(true);
        toast({
          title: "🔔 New Order Received!",
          description: `Order from ${data.data.customer.name}`,
        });

        // Play notification sound
        const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZRQ0PQKX");
        audio.play().catch(() => {});

        // Refresh orders list immediately
        refetch();

        setTimeout(() => setNotification(false), 3000);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => ws.close();
  }, [toast]);

  const formatPrice = (cents: number) => {
    return `Rs. ${(cents / 100).toFixed(2)}`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-amber-500 hover:bg-amber-600",
      confirmed: "bg-blue-500 hover:bg-blue-600",
      preparing: "bg-purple-500 hover:bg-purple-600",
      completed: "bg-emerald-500 hover:bg-emerald-600",
      cancelled: "bg-red-500 hover:bg-red-600",
    };
    return colors[status] || "bg-gray-500";
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      pending: "⏳",
      confirmed: "✓",
      preparing: "👨‍🍳",
      completed: "✓",
      cancelled: "✕",
    };
    return icons[status] || "•";
  };

  const handleStatusUpdate = async (orderId: number, status: string) => {
    try {
      await updateStatus.mutateAsync({ orderId, status });
      toast({
        title: "Status Updated",
        description: `Order status changed to ${status}`,
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Could not update order status",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Professional Header */}
      <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-primary to-secondary p-2.5 rounded-xl shadow-md">
                <UtensilsCrossed className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                  NUSH Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  {adminName && `Welcome back, ${adminName}`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`relative ${notification ? "animate-pulse" : ""}`}
                >
                  <Bell className={`h-5 w-5 ${notification ? "text-red-500" : "text-muted-foreground"}`} />
                  {notification && (
                    <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full animate-ping" />
                  )}
                </Button>
              </div>
              <Separator orientation="vertical" className="h-8" />
              <Button
                variant="outline"
                onClick={handleLogout}
                className="gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-l-slate-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Orders
                </CardTitle>
                <ShoppingBag className="h-4 w-4 text-slate-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-700">{orders?.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-amber-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending Orders
                </CardTitle>
                <Clock className="h-4 w-4 text-amber-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">
                {orders?.filter((o) => o.status === "pending").length || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Needs attention</p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  In Progress
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {orders?.filter((o) => o.status === "preparing" || o.status === "confirmed").length || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Being prepared</p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-emerald-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Completed
                </CardTitle>
                <PackageCheck className="h-4 w-4 text-emerald-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">
                {orders?.filter((o) => o.status === "completed").length || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Successfully delivered</p>
            </CardContent>
          </Card>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800">Recent Orders</h2>
            <Badge variant="outline" className="text-sm">
              {orders?.length || 0} total
            </Badge>
          </div>
          
          {orders && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-l-4" style={{
                  borderLeftColor: order.status === "pending" ? "#f59e0b" : 
                                  order.status === "confirmed" ? "#3b82f6" : 
                                  order.status === "preparing" ? "#a855f7" : 
                                  order.status === "completed" ? "#10b981" : "#ef4444"
                }}>
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-white pb-4">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-lg shadow-sm border">
                          <ShoppingBag className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-bold text-slate-800">
                            Order #{order.id}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            {formatDate(order.createdAt)}
                          </div>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(order.status)} text-white px-3 py-1 text-sm font-semibold`}>
                        {getStatusIcon(order.status)} {order.status.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Customer Info */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                          <User className="h-4 w-4 text-primary" />
                          Customer Information
                        </div>
                        <div className="space-y-3 pl-6 border-l-2 border-slate-200">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Name</p>
                            <p className="font-semibold text-slate-800">{order.customer.name}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Phone</p>
                            <p className="font-mono text-sm text-slate-700 flex items-center gap-2">
                              <Phone className="h-3.5 w-3.5" />
                              {order.customer.phone}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Delivery Address</p>
                            <p className="text-sm text-slate-700 flex items-start gap-2">
                              <MapPin className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                              <span>{order.customer.location}</span>
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                          <ShoppingBag className="h-4 w-4 text-primary" />
                          Order Details
                        </div>
                        <div className="space-y-2 bg-slate-50 rounded-lg p-4">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between items-center text-sm py-2 border-b border-slate-200 last:border-0">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="font-mono text-xs">
                                  {item.quantity}x
                                </Badge>
                                <span className="font-medium text-slate-700">{item.menuItem.name}</span>
                              </div>
                              <span className="font-semibold text-slate-800">
                                {formatPrice(item.priceAtTime * item.quantity)}
                              </span>
                            </div>
                          ))}
                          <Separator className="my-3" />
                          <div className="flex justify-between items-center pt-2">
                            <span className="font-bold text-slate-800">Total Amount:</span>
                            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                              {formatPrice(order.totalAmount)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 pt-6 border-t bg-slate-50 -mx-6 px-6 -mb-6 pb-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">
                            Update Status:
                          </label>
                          <Select
                            value={order.status}
                            onValueChange={(value) => handleStatusUpdate(order.id, value)}
                          >
                            <SelectTrigger className="w-[180px] bg-white border-slate-300">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">⏳ Pending</SelectItem>
                              <SelectItem value="confirmed">✓ Confirmed</SelectItem>
                              <SelectItem value="preparing">👨‍🍳 Preparing</SelectItem>
                              <SelectItem value="completed">✓ Completed</SelectItem>
                              <SelectItem value="cancelled">✕ Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {/* Quick Action Buttons */}
                        <div className="flex gap-2 flex-wrap">
                          {order.status === "pending" && (
                            <Button
                              onClick={() => handleStatusUpdate(order.id, "confirmed")}
                              variant="outline"
                              className="border-blue-300 text-blue-700 hover:bg-blue-50"
                              disabled={updateStatus.isPending}
                            >
                              ✓ Confirm
                            </Button>
                          )}
                          {order.status !== "completed" && order.status !== "cancelled" && (
                            <Button
                              onClick={() => handleStatusUpdate(order.id, "completed")}
                              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-md"
                              disabled={updateStatus.isPending}
                            >
                              <PackageCheck className="h-4 w-4 mr-2" />
                              Mark as Done
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-2 border-dashed">
              <CardContent className="py-16 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-slate-100 p-4 rounded-full">
                    <ShoppingBag className="h-12 w-12 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-700 mb-1">No orders yet</h3>
                    <p className="text-muted-foreground">Orders will appear here when customers place them</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
