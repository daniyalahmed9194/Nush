import { UtensilsCrossed, Instagram, Twitter, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary text-white py-20 rounded-t-[3rem] mt-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-primary p-2 rounded-xl">
                <UtensilsCrossed className="w-6 h-6 text-secondary" />
              </div>
              <span className="text-2xl font-black tracking-tighter">NUSH</span>
            </div>
            <p className="text-white/60 mb-6">
              Serving the best burgers in town since 2024. Quality ingredients,
              unforgettable taste.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="bg-white/10 p-2 rounded-lg hover:bg-primary hover:text-secondary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="bg-white/10 p-2 rounded-lg hover:bg-primary hover:text-secondary transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="bg-white/10 p-2 rounded-lg hover:bg-primary hover:text-secondary transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3 text-white/60">
              <li className="hover:text-primary cursor-pointer transition-colors">
                Our Story
              </li>
              <li className="hover:text-primary cursor-pointer transition-colors">
                Careers
              </li>
              <li className="hover:text-primary cursor-pointer transition-colors">
                Locations
              </li>
              <li className="hover:text-primary cursor-pointer transition-colors">
                Terms & Conditions
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Opening Hours</h4>
            <ul className="space-y-3 text-white/60">
              <li className="flex justify-between">
                <span>Mon - Fri</span>
                <span className="font-bold text-white">10:00 - 23:00</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span className="font-bold text-white">11:00 - 00:00</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span className="font-bold text-white">11:00 - 23:00</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Newsletter</h4>
            <p className="text-white/60 mb-4">
              Subscribe for offers and updates.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="bg-white/10 border-none rounded-xl px-4 py-2 w-full text-white placeholder:text-white/40 focus:ring-2 focus:ring-primary"
              />
              <button className="bg-primary text-secondary px-4 py-2 rounded-xl font-bold hover:bg-white transition-colors">
                Go
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-white/40 text-sm">
          © 2024 NUSH Fast Food. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
