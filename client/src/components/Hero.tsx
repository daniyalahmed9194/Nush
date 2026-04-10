import { motion, AnimatePresence } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";
import { useState, useEffect } from "react";

const CAROUSEL_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&q=85",
    alt: "Delicious Burger",
  },
  {
    src: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=1200&q=85",
    alt: "Crispy Fried Chicken",
  },
  {
    src: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=1200&q=85",
    alt: "Fresh Wrap",
  },
  {
    src: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=1200&q=85",
    alt: "Spicy Wings",
  },
];

export function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Carousel Background */}
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={CAROUSEL_IMAGES[currentIndex].src}
          alt={CAROUSEL_IMAGES[currentIndex].alt}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Layered Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-secondary/50 via-transparent to-transparent z-10" />

      {/* Content */}
      <div className="container mx-auto px-6 z-20 relative h-full flex items-center">
        <div className="max-w-xl w-full">
          {/* Pill tag */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-semibold uppercase tracking-[0.18em] px-4 py-2 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              Fast Food Reimagined
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-display font-black text-[2.6rem] sm:text-[3.5rem] md:text-[5.5rem] lg:text-[7rem] leading-[0.9] tracking-tight text-white mb-5"
          >
            HUNGRY?
            <br />
            <span className="text-primary">NUSH IT.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-base md:text-lg text-white/70 mb-10 font-light leading-relaxed max-w-sm"
          >
            Premium burgers, crispy wraps & fire meals — made with passion.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <ScrollLink
              to="burgers"
              smooth={true}
              offset={-100}
              duration={800}
              className="px-8 py-3.5 bg-primary text-secondary rounded-full font-bold text-sm uppercase tracking-widest shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:scale-[1.03] transition-all duration-300 cursor-pointer flex items-center justify-center"
            >
              Order Now
            </ScrollLink>
            <ScrollLink
              to="meals"
              smooth={true}
              offset={-100}
              duration={800}
              className="px-8 py-3.5 border border-white/30 text-white rounded-full font-semibold text-sm uppercase tracking-widest backdrop-blur-sm hover:bg-white/10 hover:border-white/50 transition-all duration-300 cursor-pointer flex items-center justify-center"
            >
              View Menu
            </ScrollLink>
          </motion.div>
        </div>
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-1.5 z-30">
        {CAROUSEL_IMAGES.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              index === currentIndex
                ? "bg-primary w-7"
                : "bg-white/40 w-1.5 hover:bg-white/70"
            }`}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>

      {/* Scroll indicator line */}
      <div className="absolute bottom-8 right-8 flex flex-col items-center gap-2 z-20 opacity-50 hidden md:flex">
        <span className="text-white text-[10px] font-semibold uppercase tracking-[0.2em] rotate-90 origin-center mb-6">
          Scroll
        </span>
        <div className="w-px h-14 bg-gradient-to-b from-white to-transparent" />
      </div>
    </section>
  );
}
