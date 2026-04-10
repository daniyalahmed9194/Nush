import { UtensilsCrossed, Instagram, Twitter, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary text-white py-20 rounded-t-[2.5rem] mt-16">
      <div className="container mx-auto px-5">
        <div className="grid md:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-1">
            <div className="mb-5">
              <div className="inline-flex items-center gap-2 bg-primary px-3 py-1.5 rounded-lg mb-5">
                <span className="font-display font-black text-xl text-secondary tracking-tighter leading-none">
                  NUSH
                </span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">
                Fast. Fresh. Fueled by fire.
              </p>
              <p className="text-white/40 text-xs mt-2 leading-relaxed">
                Serving the best burgers in town since 2024.
              </p>
            </div>
            <div className="flex gap-2.5">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:border-primary hover:text-primary hover:bg-primary/10 transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-base mb-5 text-white">Quick Links</h4>
            <ul className="space-y-2.5">
              {["Our Story", "Careers", "Locations", "Terms & Conditions"].map((link) => (
                <li key={link}>
                  <a className="text-white/50 text-sm hover:text-primary transition-colors cursor-pointer">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="font-display font-bold text-base mb-5 text-white">Opening Hours</h4>
            <ul className="space-y-2.5">
              {[
                { day: "Mon – Fri", hours: "10:00 – 23:00" },
                { day: "Saturday", hours: "11:00 – 00:00" },
                { day: "Sunday", hours: "11:00 – 23:00" },
              ].map(({ day, hours }) => (
                <li key={day} className="flex justify-between items-center gap-4">
                  <span className="text-white/50 text-sm">{day}</span>
                  <span className="font-semibold text-white text-sm tabular-nums">{hours}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display font-bold text-base mb-5 text-white">Newsletter</h4>
            <p className="text-white/50 text-sm mb-4 leading-relaxed">
              Subscribe for exclusive offers and updates.
            </p>
            <div className="flex bg-white/10 rounded-full p-1 border border-white/10 focus-within:border-primary/50 transition-colors">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-transparent px-3 text-sm text-white placeholder:text-white/30 outline-none min-w-0"
              />
              <button className="bg-primary text-secondary text-xs font-bold px-4 py-2 rounded-full hover:bg-white hover:text-secondary transition-colors flex-shrink-0">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/8 pt-7 flex flex-col sm:flex-row justify-between items-center gap-2 text-white/30 text-xs">
          <span>© 2024 NUSH Fast Food. All rights reserved.</span>
          <span className="flex items-center gap-1">
            Made with <span className="text-primary">♥</span> in Pakistan
          </span>
        </div>
      </div>
    </footer>
  );
}
