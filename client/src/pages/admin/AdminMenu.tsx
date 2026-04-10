import { useState, useMemo } from "react";
import { useMenu } from "@/hooks/use-menu";
import { Search, UtensilsCrossed, Loader2 } from "lucide-react";

const CATEGORIES = ["All", "Burgers", "Wraps", "Fried Chicken", "Sauces", "Drinks", "Meals"];

const CATEGORY_COLORS: Record<string, string> = {
  Burgers:       "bg-amber-50 text-amber-700 border-amber-200",
  Wraps:         "bg-green-50 text-green-700 border-green-200",
  "Fried Chicken": "bg-orange-50 text-orange-700 border-orange-200",
  Sauces:        "bg-red-50 text-red-700 border-red-200",
  Drinks:        "bg-blue-50 text-blue-700 border-blue-200",
  Meals:         "bg-purple-50 text-purple-700 border-purple-200",
};

export default function AdminMenu() {
  const { data: items = [], isLoading } = useMenu();
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = activeCategory === "All" ? items : items.filter((i) => i.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (i) => i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [items, activeCategory, search]);

  const categoryCounts = useMemo(() => {
    const c: Record<string, number> = { All: items.length };
    items.forEach((i) => { c[i.category] = (c[i.category] || 0) + 1; });
    return c;
  }, [items]);

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
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search menu items…"
            className="w-full bg-white border border-border/50 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary/50 focus:shadow-md focus:shadow-primary/8 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-border/40 text-sm">
          <UtensilsCrossed className="w-4 h-4 text-muted-foreground" />
          <span className="font-semibold text-secondary">{filtered.length}</span>
          <span className="text-muted-foreground">items</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORIES.filter((c) => categoryCounts[c] !== undefined || c === "All").map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
              activeCategory === cat
                ? "bg-secondary text-white shadow-md shadow-secondary/20"
                : "bg-white text-muted-foreground border border-border/40 hover:border-secondary/30 hover:text-secondary"
            }`}
          >
            {cat}
            <span
              className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                activeCategory === cat ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
              }`}
            >
              {categoryCounts[cat] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border/40 py-20 text-center">
          <div className="w-14 h-14 rounded-full bg-muted mx-auto flex items-center justify-center mb-3">
            <UtensilsCrossed className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="font-semibold text-secondary">No items found</p>
          <p className="text-sm text-muted-foreground mt-1">Try a different category or search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden border border-border/40 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/8 hover:-translate-y-0.5 transition-all duration-300 group"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-muted/20">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500"
                />
                {/* Price pill */}
                <div className="absolute bottom-2.5 right-2.5 bg-primary text-secondary text-xs font-black px-2.5 py-1 rounded-full shadow-md">
                  Rs. {Math.round(item.price / 100).toLocaleString()}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3 className="font-display font-bold text-sm text-secondary leading-tight">
                    {item.name}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
                  {item.description}
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                      CATEGORY_COLORS[item.category] || "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {item.subcategory || item.category}
                  </span>
                  <span className="text-xs font-bold text-secondary">
                    #{item.id}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
