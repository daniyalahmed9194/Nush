import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCart } from "@/contexts/CartContext";
import { useCreateOrder } from "@/hooks/use-orders";
import { ArrowLeft, Loader2, CheckCircle2, MapPin, Phone, User, ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { CreateOrderRequest } from "@shared/schema";

const checkoutSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(
    /^(\+92|0)?3[0-9]{9}$/,
    "Invalid Pakistan number — use 03XXXXXXXXX or +923XXXXXXXXX"
  ),
  location: z.string().min(5, "Please provide a detailed delivery address"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

const fmt = (cents: number) => `Rs. ${Math.round(cents / 100).toLocaleString()}`;

export default function CheckoutForm({ onBack, onSuccess }: CheckoutFormProps) {
  const { items, getTotalPrice, clearCart } = useCart();
  const createOrder = useCreateOrder();
  const { toast } = useToast();
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Lock body scroll while checkout is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { name: "", phone: "", location: "" },
  });

  const onSubmit = async (data: CheckoutFormData) => {
    const orderData: CreateOrderRequest = {
      customer: { name: data.name, phone: data.phone, location: data.location },
      items: items.map((item) => ({
        menuItemId: item.id,
        quantity: item.quantity,
        priceAtTime: item.price,
      })),
      totalAmount: getTotalPrice(),
    };

    try {
      await createOrder.mutateAsync(orderData);
      setOrderPlaced(true);
      clearCart();
      toast({ title: "Order Placed!", description: "We'll contact you soon to confirm." });
      setTimeout(() => onSuccess(), 2500);
    } catch (error: any) {
      toast({
        title: "Order Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Success screen
  if (orderPlaced) {
    return (
      <div className="fixed inset-0 bg-background z-[100] flex items-center justify-center p-6">
        <div className="text-center space-y-5 animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          </div>
          <div>
            <h2 className="font-display font-black text-2xl text-secondary mb-2">Order Placed!</h2>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
              We'll contact you shortly to confirm your order and delivery time.
            </p>
          </div>
          <div className="flex justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    // Outer: solid backdrop — never scrolls
    <div className="fixed inset-0 z-[100] bg-[#f7f8fc]">
      {/* Inner: scrollable content */}
      <div className="h-full overflow-y-auto overscroll-contain">
        <div className="max-w-2xl mx-auto px-5 py-6 min-h-full">

          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={onBack}
              className="w-9 h-9 rounded-xl bg-white border border-border/50 flex items-center justify-center text-secondary hover:bg-muted transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="font-display font-black text-xl text-secondary">Checkout</h1>
              <p className="text-xs text-muted-foreground">
                {items.length} item{items.length !== 1 ? "s" : ""} in your order
              </p>
            </div>
          </div>

          <div className="space-y-5">

            {/* Order Summary */}
            <div className="bg-white rounded-2xl border border-border/40 overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-border/40">
                <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                <h2 className="font-display font-bold text-secondary text-sm">Order Summary</h2>
              </div>
              <div className="px-5 py-4 space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-muted text-secondary text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                        {item.quantity}
                      </span>
                      <span className="font-medium text-secondary">{item.name}</span>
                    </div>
                    <span className="font-semibold text-secondary">{fmt(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center px-5 py-4 bg-muted/30 border-t border-border/40">
                <span className="font-semibold text-secondary text-sm">Total</span>
                <span className="font-display font-black text-xl text-secondary">{fmt(getTotalPrice())}</span>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="bg-white rounded-2xl border border-border/40 overflow-hidden">
              <div className="px-5 py-4 border-b border-border/40">
                <h2 className="font-display font-bold text-secondary text-sm">Delivery Details</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Where should we deliver?</p>
              </div>

              <form onSubmit={form.handleSubmit(onSubmit)} className="px-5 py-5 space-y-4">

                {/* Name */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-secondary/70 uppercase tracking-wider">
                    <User style={{ width: "11px", height: "11px" }} />
                    Full Name
                  </label>
                  <input
                    {...form.register("name")}
                    placeholder="John Doe"
                    className="w-full bg-muted/50 border border-transparent rounded-xl px-4 py-3 text-sm text-secondary placeholder:text-muted-foreground/50 outline-none transition-all duration-200 focus:bg-white focus:border-primary/50 focus:shadow-lg focus:shadow-primary/8"
                  />
                  {form.formState.errors.name && (
                    <p className="text-destructive text-xs font-semibold">{form.formState.errors.name.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-secondary/70 uppercase tracking-wider">
                    <Phone style={{ width: "11px", height: "11px" }} />
                    Phone Number
                  </label>
                  <input
                    {...form.register("phone")}
                    placeholder="03XXXXXXXXX"
                    className="w-full bg-muted/50 border border-transparent rounded-xl px-4 py-3 text-sm text-secondary placeholder:text-muted-foreground/50 outline-none transition-all duration-200 focus:bg-white focus:border-primary/50 focus:shadow-lg focus:shadow-primary/8"
                  />
                  {form.formState.errors.phone && (
                    <p className="text-destructive text-xs font-semibold">{form.formState.errors.phone.message}</p>
                  )}
                </div>

                {/* Location */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-secondary/70 uppercase tracking-wider">
                    <MapPin style={{ width: "11px", height: "11px" }} />
                    Delivery Address
                  </label>
                  <textarea
                    {...form.register("location")}
                    rows={3}
                    placeholder="House/flat number, street, area, city…"
                    className="w-full bg-muted/50 border border-transparent rounded-xl px-4 py-3 text-sm text-secondary placeholder:text-muted-foreground/50 outline-none transition-all duration-200 focus:bg-white focus:border-primary/50 focus:shadow-lg focus:shadow-primary/8 resize-none"
                  />
                  {form.formState.errors.location && (
                    <p className="text-destructive text-xs font-semibold">{form.formState.errors.location.message}</p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={createOrder.isPending}
                  className="w-full py-3.5 bg-primary text-secondary font-bold text-sm uppercase tracking-widest rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                >
                  {createOrder.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Placing Order…
                    </>
                  ) : (
                    `Confirm Order · ${fmt(getTotalPrice())}`
                  )}
                </button>

              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
