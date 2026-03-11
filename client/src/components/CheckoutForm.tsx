import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCart } from "@/contexts/CartContext";
import { useCreateOrder } from "@/hooks/use-orders";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import type { CreateOrderRequest } from "@shared/schema";

const checkoutSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(
    /^(\+92|0)?3[0-9]{9}$/,
    "Invalid Pakistan phone number. Format: 03XXXXXXXXX or +923XXXXXXXXX"
  ),
  location: z.string().min(5, "Please provide a detailed location"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

export default function CheckoutForm({ onBack, onSuccess }: CheckoutFormProps) {
  const { items, getTotalPrice, clearCart } = useCart();
  const createOrder = useCreateOrder();
  const { toast } = useToast();
  const [orderPlaced, setOrderPlaced] = useState(false);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      phone: "",
      location: "",
    },
  });

  const formatPrice = (cents: number) => {
    return `Rs. ${(cents / 100).toFixed(2)}`;
  };

  const onSubmit = async (data: CheckoutFormData) => {
    const orderData: CreateOrderRequest = {
      customer: {
        name: data.name,
        phone: data.phone,
        location: data.location,
      },
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
      
      toast({
        title: "Order Placed Successfully!",
        description: "We'll contact you soon to confirm your order.",
      });

      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Order Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (orderPlaced) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4 animate-in fade-in zoom-in">
          <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto" />
          <h2 className="text-2xl font-bold">Order Placed Successfully!</h2>
          <p className="text-muted-foreground">
            We'll contact you soon to confirm your order.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
      <div className="max-w-2xl mx-auto p-6">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cart
        </Button>

        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        <div className="space-y-6">
          {/* Order Summary */}
          <div className="border rounded-lg p-4 space-y-3">
            <h2 className="font-semibold text-lg">Order Summary</h2>
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="border-t pt-3 flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>{formatPrice(getTotalPrice())}</span>
            </div>
          </div>

          {/* Customer Details Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="03XXXXXXXXX or +923XXXXXXXXX" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Pakistan mobile number format
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Location *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your complete delivery address"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Please provide house/flat number, street, area, and city
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                size="lg"
                className="w-full bg-primary text-secondary rounded-2xl font-black text-lg shadow-xl shadow-primary/30 hover:shadow-2xl hover:-translate-y-1 transition-all"
                disabled={createOrder.isPending}
              >
                {createOrder.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  "Confirm Order"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
