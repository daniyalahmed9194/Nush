import { useCart } from "@/contexts/CartContext";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import CheckoutForm from "./CheckoutForm";

export function CartDrawer() {
  const { items, updateQuantity, removeItem, getTotalItems, getTotalPrice } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const formatPrice = (cents: number) => `Rs. ${(cents / 100).toFixed(0)}`;

  const handleCheckout = () => {
    setIsOpen(false);
    setTimeout(() => setShowCheckout(true), 300);
  };

  return (
    <>
      {showCheckout && createPortal(
        <CheckoutForm
          onBack={() => setShowCheckout(false)}
          onSuccess={() => setShowCheckout(false)}
        />,
        document.body
      )}
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="relative flex items-center gap-2 bg-muted hover:bg-secondary hover:text-white text-secondary pl-3.5 pr-2.5 py-2 rounded-full text-sm font-semibold transition-all duration-300 group">
          <ShoppingCart className="w-4 h-4" />
          {getTotalItems() > 0 ? (
            <>
              <span className="hidden sm:inline">Cart</span>
              <span className="bg-primary text-secondary text-xs font-black w-5 h-5 rounded-full flex items-center justify-center group-hover:bg-white/20 group-hover:text-white transition-colors">
                {getTotalItems()}
              </span>
            </>
          ) : (
            <span className="hidden sm:inline">Cart</span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col gap-0 border-l border-border/50">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border/50">
          <div>
            <h2 className="font-display font-bold text-xl text-secondary">Your Order</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {getTotalItems()} {getTotalItems() === 1 ? "item" : "items"} selected
            </p>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-20 gap-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <ShoppingCart className="w-7 h-7 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-secondary">Nothing here yet</p>
                <p className="text-sm text-muted-foreground mt-1">Add items from the menu to get started</p>
              </div>
            </div>
          ) : (
            <div className="space-y-1 py-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 rounded-2xl hover:bg-muted/50 transition-colors group/item"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-secondary truncate">{item.name}</p>
                    <p className="text-primary font-bold text-sm mt-0.5">{formatPrice(item.price)}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      {/* Quantity pill */}
                      <div className="flex items-center gap-1 bg-muted rounded-full p-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm hover:bg-primary hover:text-secondary transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-bold text-secondary">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm hover:bg-primary hover:text-secondary transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      {/* Delete */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto w-6 h-6 rounded-full opacity-0 group-hover/item:opacity-100 flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-5 border-t border-border/50 bg-gradient-to-t from-background to-transparent">
            <div className="flex justify-between items-baseline mb-4">
              <span className="text-muted-foreground text-sm font-medium">Total</span>
              <span className="font-display font-black text-2xl text-secondary">
                {formatPrice(getTotalPrice())}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-secondary text-white font-bold py-3.5 rounded-2xl hover:bg-primary hover:text-secondary transition-all duration-300 hover:shadow-xl hover:shadow-primary/25 text-sm uppercase tracking-wider"
            >
              Checkout →
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
    </>
  );
}
