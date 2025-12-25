import { useMenu } from "@/hooks/use-menu";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { MenuSection } from "@/components/MenuSection";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { Loader2 } from "lucide-react";
import type { MenuItem } from "@shared/schema";

export default function Home() {
  const { data: menuItems, isLoading, error } = useMenu();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="font-bold text-secondary text-lg animate-pulse">
          Loading deliciousness...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-destructive font-bold">
        Failed to load menu. Please refresh.
      </div>
    );
  }

  const items = menuItems || [];

  // Group items
  const burgers = items.filter((item) => item.category === "Burgers");
  const wraps = items.filter((item) => item.category === "Wraps");
  const chicken = items.filter((item) => item.category === "Fried Chicken");
  const sauces = items.filter((item) => item.category === "Sauces");
  const drinks = items.filter((item) => item.category === "Drinks");
  const meals = items.filter((item) => item.category === "Meals");

  // Fallback data if DB is empty to show the UI structure
  const dummyBurger: MenuItem = {
    id: 1,
    name: "Classic Beef Nush",
    description: "Juicy beef patty with our signature sauce, lettuce, and cheese.",
    price: 1299,
    category: "Burgers",
    subcategory: "Beef",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
  };
  
  const displayBurgers = burgers.length > 0 ? burgers : [dummyBurger, {...dummyBurger, id: 2, name: "Spicy Chicken Nush", subcategory: "Chicken"}, {...dummyBurger, id: 3, name: "Fish Delight", subcategory: "Fish"}];

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <Hero />
      
      <div className="bg-white rounded-t-[3rem] relative -mt-10 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <MenuSection
          id="burgers"
          title="Burgers"
          items={displayBurgers}
          subcategories={["Beef", "Chicken", "Fish"]}
        />
        
        <MenuSection
          id="wraps"
          title="Wraps"
          items={wraps}
          bgColor="bg-muted/30"
        />
        
        <MenuSection
          id="chicken"
          title="Fried Chicken"
          items={chicken}
        />
        
        <MenuSection
          id="sauces"
          title="Sauces"
          items={sauces}
          bgColor="bg-muted/30"
        />
        
        <MenuSection
          id="drinks"
          title="Drinks"
          items={drinks}
        />
        
        <MenuSection
          id="meals"
          title="Meals"
          items={meals}
          bgColor="bg-primary/5"
        />
        
        <ContactForm />
      </div>
      
      <Footer />
    </div>
  );
}
