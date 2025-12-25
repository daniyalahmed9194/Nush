import { motion, AnimatePresence } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";
import { ArrowDown } from "lucide-react";
import { useState, useEffect } from "react";

const CAROUSEL_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
    alt: "Delicious Burger",
  },
  {
    src: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=800&q=80",
    alt: "Crispy Fried Chicken",
  },
  {
    src: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&q=80",
    alt: "Fresh Wrap",
  },
  {
    src: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800&q=80",
    alt: "Spicy Wings",
  },
];

export function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Full-Screen Carousel Background */}
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={CAROUSEL_IMAGES[currentIndex].src}
          alt={CAROUSEL_IMAGES[currentIndex].alt}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Dark Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent z-10" />

      {/* Content Overlay */}
      <div className="container mx-auto px-4 z-20 relative h-full flex items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-lg text-white"
        >
          <span className="inline-block bg-primary/80 text-secondary px-4 py-2 rounded-full font-bold text-sm mb-6 uppercase tracking-wider">
            Fast Food Reimagined
          </span>
          <h1 className="text-6xl md:text-8xl font-black leading-[0.9] mb-6">
            HUNGRY? <br />
            <span className="text-primary">NUSH IT!</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-10 font-medium">
            Premium burgers, crispy wraps, and mouth-watering meals made with
            passion.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <ScrollLink
              to="burgers"
              smooth={true}
              offset={-100}
              duration={800}
              className="px-8 py-4 bg-primary text-secondary rounded-2xl font-black text-lg shadow-xl shadow-primary/30 hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              Order Now
            </ScrollLink>
            <ScrollLink
              to="meals"
              smooth={true}
              offset={-100}
              duration={800}
              className="px-8 py-4 bg-white/20 backdrop-blur-md border-2 border-white text-white rounded-2xl font-bold text-lg hover:bg-white/30 transition-all cursor-pointer"
            >
              View Menu
            </ScrollLink>
          </div>
        </motion.div>
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {CAROUSEL_IMAGES.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex ? "bg-primary w-8" : "bg-white/50 hover:bg-white"
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.95 }}
            data-testid={`carousel-indicator-${index}`}
          />
        ))}
      </div>

      {/* Scroll Down Arrow */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce z-20">
        <ScrollLink to="burgers" smooth={true} offset={-100} duration={800}>
          <ArrowDown className="text-white/70 hover:text-primary cursor-pointer w-8 h-8" />
        </ScrollLink>
      </div>
    </section>
  );
}
