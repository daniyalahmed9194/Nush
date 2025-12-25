import { motion } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";
import { ArrowDown } from "lucide-react";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-gradient-to-b from-secondary/5 to-background"
    >
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 z-10 grid md:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center md:text-left"
        >
          <span className="inline-block bg-primary/20 text-secondary px-4 py-2 rounded-full font-bold text-sm mb-6 uppercase tracking-wider">
            Fast Food Reimagined
          </span>
          <h1 className="text-6xl md:text-8xl font-black text-secondary leading-[0.9] mb-6">
            HUNGRY? <br />
            <span className="text-primary text-shadow-lg">NUSH IT!</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-lg mx-auto md:mx-0 font-medium">
            Premium burgers, crispy wraps, and mouth-watering meals made with
            passion.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
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
              className="px-8 py-4 bg-white border-2 border-secondary/10 text-secondary rounded-2xl font-bold text-lg hover:bg-secondary/5 hover:border-secondary transition-all cursor-pointer"
            >
              View Menu
            </ScrollLink>
          </div>
        </motion.div>

        {/* Hero Image Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <motion.div
            animate={{ y: [-20, 20, -20] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative z-10"
          >
            {/* Using a placeholder for the hero burger image - replace with real asset */}
            {/* Unsplash: Delicious gourmet burger with flying ingredients */}
            <img
              src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80"
              alt="Delicious Burger"
              className="w-full h-auto drop-shadow-2xl transform rotate-3 hover:rotate-6 transition-transform duration-500 rounded-3xl"
            />
          </motion.div>

          {/* Floating Elements */}
          <motion.div
            animate={{ y: [10, -10, 10], rotate: [0, 10, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            className="absolute -top-10 -right-10 w-24 h-24 bg-white p-2 rounded-2xl shadow-xl z-20 hidden md:block"
          >
            {/* Unsplash: French fries */}
            <img
              src="https://images.unsplash.com/photo-1630384060421-a4323ceca5f6?w=200&q=80"
              alt="Fries"
              className="w-full h-full object-cover rounded-xl"
            />
          </motion.div>

          <motion.div
            animate={{ y: [-15, 15, -15], rotate: [0, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
            className="absolute -bottom-5 -left-5 w-32 h-32 bg-white p-2 rounded-2xl shadow-xl z-20 hidden md:block"
          >
            {/* Unsplash: Refreshing drink */}
            <img
              src="https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=200&q=80"
              alt="Drink"
              className="w-full h-full object-cover rounded-xl"
            />
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <ScrollLink to="burgers" smooth={true} offset={-100} duration={800}>
          <ArrowDown className="text-secondary/50 hover:text-primary cursor-pointer w-8 h-8" />
        </ScrollLink>
      </div>
    </section>
  );
}
