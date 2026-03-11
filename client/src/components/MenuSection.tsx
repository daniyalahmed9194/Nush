import { useState } from "react";
import { motion } from "framer-motion";
import type { MenuItem } from "@shared/schema";
import { ShoppingBag, Plus } from "lucide-react";
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
    <section id={id} className={`py-20 md:py-32 ${bgColor}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-5xl md:text-6xl font-black text-secondary uppercase tracking-tight">
              {title}
            </h2>
            <div className="h-2 w-24 bg-primary mt-4 rounded-full" />
          </div>

          {subcategories && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveFilter("All")}
                className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${
                  activeFilter === "All"
                    ? "bg-secondary text-white shadow-lg shadow-secondary/25"
                    : "bg-white border border-border text-muted-foreground hover:border-secondary hover:text-secondary"
                }`}
              >
                All
              </button>
              {subcategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setActiveFilter(sub)}
                  className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${
                    activeFilter === sub
                      ? "bg-secondary text-white shadow-lg shadow-secondary/25"
                      : "bg-white border border-border text-muted-foreground hover:border-secondary hover:text-secondary"
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-3xl border-2 border-dashed border-border">
            <p className="text-muted-foreground font-medium text-lg">
              Coming soon to the menu!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
  const [isHovered, setIsHovered] = useState(false);
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group bg-white rounded-3xl p-4 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 border border-transparent hover:border-primary/20 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-muted/20">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full font-bold text-secondary shadow-sm">
          Rs. {(item.price / 100).toFixed(2)}
        </div>
      </div>

      <div className="px-2 pb-2">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-secondary group-hover:text-primary transition-colors">
            {item.name}
          </h3>
        </div>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-6 h-10">
          {item.description}
        </p>

        <button
          onClick={handleAddToCart}
          className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 bg-secondary text-white hover:bg-primary hover:text-secondary hover:shadow-lg active:scale-95"
        >
          <Plus className="w-5 h-5" />
          {isHovered ? "Add to Cart" : "Select"}
        </button>
      </div>
    </motion.div>
  );
}
