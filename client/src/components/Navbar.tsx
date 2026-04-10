import { Link as ScrollLink } from "react-scroll";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { CartDrawer } from "./CartDrawer";
import { useCart } from "@/contexts/CartContext";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { getTotalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Burgers", to: "burgers" },
    { name: "Wraps", to: "wraps" },
    { name: "Chicken", to: "chicken" },
    { name: "Sauces", to: "sauces" },
    { name: "Drinks", to: "drinks" },
    { name: "Meals", to: "meals" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-lg shadow-black/5 py-3 border-b border-white/20"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-5 flex items-center justify-between">
        {/* Logo */}
        <ScrollLink
          to="hero"
          smooth={true}
          duration={500}
          className="cursor-pointer flex items-center gap-2.5 group"
        >
          <div className="bg-primary px-3 py-1.5 rounded-lg group-hover:scale-105 transition-transform duration-300">
            <span className="font-display font-black text-xl text-secondary tracking-tighter leading-none">
              NUSH
            </span>
          </div>
        </ScrollLink>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-7">
          {navItems.map((item) => (
            <ScrollLink
              key={item.name}
              to={item.to}
              spy={true}
              smooth={true}
              offset={-100}
              duration={500}
              className="relative font-semibold text-foreground/70 hover:text-secondary cursor-pointer transition-colors text-sm uppercase tracking-wider group"
              activeClass="text-secondary"
            >
              {item.name}
              <span className="absolute -bottom-0.5 left-0 h-[2px] w-0 bg-primary rounded-full transition-all duration-300 group-hover:w-full" />
            </ScrollLink>
          ))}
        </div>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          <CartDrawer />
          <ScrollLink
            to="contact"
            smooth={true}
            offset={-50}
            duration={500}
            className="bg-secondary text-white px-5 py-2 rounded-full font-semibold text-sm hover:bg-primary hover:text-secondary transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 cursor-pointer"
          >
            Contact Us
          </ScrollLink>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-3">
          <CartDrawer />
          <button
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
              scrolled ? "bg-muted text-secondary" : "bg-white/20 text-white"
            }`}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-border/30 shadow-2xl shadow-black/10 p-5 flex flex-col gap-1 animate-in slide-in-from-top-3">
          {navItems.map((item) => (
            <ScrollLink
              key={item.name}
              to={item.to}
              smooth={true}
              offset={-100}
              duration={500}
              className="text-base font-semibold py-3 px-4 rounded-xl hover:bg-muted hover:text-secondary text-foreground/70 transition-all cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </ScrollLink>
          ))}
          <div className="mt-2 pt-3 border-t border-border/30">
            <ScrollLink
              to="contact"
              smooth={true}
              offset={-50}
              duration={500}
              className="block bg-primary text-secondary text-center py-3 rounded-full font-bold cursor-pointer hover:shadow-lg hover:shadow-primary/25 transition-all"
              onClick={() => setIsOpen(false)}
            >
              Contact Us
            </ScrollLink>
          </div>
        </div>
      )}
    </nav>
  );
}
