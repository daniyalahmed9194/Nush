import { useState } from "react";
import { motion } from "framer-motion";
import type { MenuItem } from "@shared/schema";
import { Plus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

interface MenuSectionProps {
  id: string;
  title: string;
  items: MenuItem[];
  subcategories?: string[];
  bgColor?: string;
}

export function MenuSection({
  id,
  title,
  items,
  subcategories,
  bgColor = "bg-white",
}: MenuSectionProps) {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const filteredItems =
    activeFilter === "All"
      ? items
      : items.filter((item) => item.subcategory === activeFilter);

  return (
    <section id={id} className={`py-24 md:py-32 ${bgColor}`}>
      <div className="container mx-auto px-5">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <span className="text-primary font-semibold text-xs uppercase tracking-[0.2em] mb-2 block">
              — Our Menu
            </span>
            <h2 className="font-display font-black text-5xl md:text-6xl text-secondary leading-none tracking-tight">
              {title}
            </h2>
          </div>

          {subcategories && (
            <div className="flex flex-wrap gap-2">
              {["All", ...subcategories].map((sub) => (
                <button
                  key={sub}
                  onClick={() => setActiveFilter(sub)}
                  className={`px-5 py-2 rounded-full font-semibold text-xs uppercase tracking-wider transition-all duration-200 ${
                    activeFilter === sub
                      ? "bg-secondary text-white shadow-lg shadow-secondary/20"
                      : "bg-muted text-muted-foreground hover:bg-secondary/10 hover:text-secondary"
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-16 rounded-3xl border-2 border-dashed border-border">
            <p className="text-muted-foreground font-medium">
              Coming soon to the menu!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {filteredItems.map((item, index) => (
              <MenuCard key={item.id} item={item} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function MenuCard({ item, index }: { item: MenuItem; index: number }) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem(item);
    toast({
      title: "Added to cart!",
      description: `${item.name} has been added to your cart.`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: "easeOut" }}
      className="group bg-white rounded-[1.75rem] overflow-hidden border border-black/5 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/8 hover:-translate-y-1.5 transition-all duration-500 cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-[3/2] overflow-hidden bg-muted/20">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-[1.07] transition-transform duration-700 ease-out"
        />

        {/* Price badge — bottom left */}
        <div className="absolute bottom-3 left-3 bg-primary text-secondary font-black text-xs px-3 py-1.5 rounded-full shadow-lg">
          Rs. {(item.price / 100).toFixed(0)}
        </div>

        {/* Hover overlay with CTA */}
        <div className="absolute inset-0 bg-secondary/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={handleAddToCart}
            className="bg-primary text-secondary font-bold px-6 py-2.5 rounded-full text-sm translate-y-3 group-hover:translate-y-0 transition-transform duration-300 shadow-xl flex items-center gap-1.5 hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display font-bold text-lg text-secondary leading-tight mb-1">
          {item.name}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}
