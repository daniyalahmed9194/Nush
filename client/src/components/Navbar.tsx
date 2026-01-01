import { Link as ScrollLink } from "react-scroll";
import { useState, useEffect } from "react";
import { Menu, X, UtensilsCrossed } from "lucide-react";
import { CartDrawer } from "./CartDrawer";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <ScrollLink
          to="hero"
          smooth={true}
          duration={500}
          className="cursor-pointer flex items-center gap-2 group"
        >
          <div className="bg-primary p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300">
            <UtensilsCrossed className="w-8 h-8 text-secondary" />
          </div>
          <span className="text-3xl font-black tracking-tighter text-secondary">
            NUSH
          </span>
        </ScrollLink>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <ScrollLink
              key={item.name}
              to={item.to}
              spy={true}
              smooth={true}
              offset={-100}
              duration={500}
              className="font-bold text-foreground/80 hover:text-primary cursor-pointer transition-colors text-sm uppercase tracking-wider"
              activeClass="text-primary"
            >
              {item.name}
            </ScrollLink>
          ))}
          <CartDrawer />
          <ScrollLink
            to="contact"
            smooth={true}
            offset={-50}
            duration={500}
            className="bg-primary text-secondary px-6 py-2 rounded-full font-bold hover:bg-primary/90 hover:-translate-y-0.5 transition-all shadow-lg shadow-primary/20 cursor-pointer"
          >
            Contact Us
          </ScrollLink>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-3">
          <CartDrawer />
          <button
            className="text-secondary"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-border shadow-xl p-4 flex flex-col gap-4 animate-in slide-in-from-top-5">
          {navItems.map((item) => (
            <ScrollLink
              key={item.name}
              to={item.to}
              smooth={true}
              offset={-100}
              duration={500}
              className="text-lg font-bold text-center py-2 hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </ScrollLink>
          ))}
          <ScrollLink
            to="contact"
            smooth={true}
            offset={-50}
            duration={500}
            className="bg-primary text-secondary text-center py-3 rounded-xl font-bold"
            onClick={() => setIsOpen(false)}
          >
            Contact Us
          </ScrollLink>
        </div>
      )}
    </nav>
  );
}
