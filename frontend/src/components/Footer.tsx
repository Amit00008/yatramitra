import {
  MapPin,
  Phone,
  Mail,
  Home,
  Search,
  Hotel,
  Car,
  Map,
  BookOpen,
  CircleDot,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Play,
  Apple,
  CreditCard,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-nav text-nav-foreground">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-2 mb-3 group cursor-pointer">
              <MapPin className="h-6 w-6 text-secondary transition-transform duration-300 group-hover:scale-110" />
              <span className="text-lg font-bold">YatraMitra</span>
            </div>
            <p className="text-sm text-nav-foreground/70 mb-4 leading-relaxed">
              Complete tourism platform integrating hotels, transport, destinations, and rewards in one seamless experience.
            </p>
            <div className="space-y-2.5 text-sm text-nav-foreground/80">
              <p className="flex items-center gap-2 group cursor-pointer">
                <MapPin className="h-4 w-4 text-secondary transition-transform duration-200 group-hover:scale-110" /> 
                <span className="transition-colors group-hover:text-secondary">Mumbai, Maharashtra, India</span>
              </p>
              <p className="flex items-center gap-2 group cursor-pointer">
                <Phone className="h-4 w-4 text-secondary transition-transform duration-200 group-hover:scale-110" /> 
                <span className="transition-colors group-hover:text-secondary">+91-9876543210</span>
              </p>
              <p className="flex items-center gap-2 group cursor-pointer">
                <Mail className="h-4 w-4 text-secondary transition-transform duration-200 group-hover:scale-110" /> 
                <span className="transition-colors group-hover:text-secondary">support@yatramitra.com</span>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-bold text-secondary mb-4 underline underline-offset-4 decoration-secondary/50">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { icon: Home, label: "Home" },
                { icon: Search, label: "Unified Search" },
                { icon: Hotel, label: "Hotels" },
                { icon: Car, label: "Ride Sharing" },
                { icon: Car, label: "Car Rentals" },
                { icon: Map, label: "Destinations" },
                { icon: BookOpen, label: "My Bookings" },
              ].map((item) => (
                <li key={item.label}>
                  <a href="#" className="group flex items-center gap-2 text-nav-foreground/80 hover:text-secondary transition-all duration-200 hover:translate-x-1">
                    <item.icon className="h-3.5 w-3.5 text-secondary transition-transform duration-200 group-hover:scale-110" /> {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h3 className="text-base font-bold text-secondary mb-4 underline underline-offset-4 decoration-secondary/50">Our Services</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                "Hotel Booking",
                "Ride Sharing (Car, Bike, Taxi)",
                "Car Rentals",
                "Tourist Packages",
                "Real-time Availability",
                "Direct Booking",
                "Reward System",
              ].map((service) => (
                <li key={service}>
                  <a href="#" className="group flex items-center gap-2 text-nav-foreground/80 hover:text-secondary transition-all duration-200 hover:translate-x-1">
                    <CircleDot className="h-3 w-3 text-secondary/70" /> {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect With Us */}
          <div>
            <h3 className="text-base font-bold text-secondary mb-4 underline underline-offset-4 decoration-secondary/50">Connect With Us</h3>
            <div className="space-y-2 mb-6">
              {[
                { icon: Facebook, label: "Facebook", bg: "bg-[hsl(220,70%,45%)]" },
                { icon: Twitter, label: "Twitter", bg: "bg-[hsl(195,85%,50%)]" },
                { icon: Instagram, label: "Instagram", bg: "bg-gradient-to-r from-[hsl(330,70%,55%)] to-[hsl(45,90%,55%)]" },
                { icon: Linkedin, label: "LinkedIn", bg: "bg-[hsl(210,70%,40%)]" },
                { icon: Youtube, label: "YouTube", bg: "bg-[hsl(0,75%,50%)]" },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  className={`group flex items-center gap-2 ${social.bg} text-nav-foreground rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]`}
                >
                  <social.icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" /> {social.label}
                </a>
              ))}
            </div>

            <h4 className="text-sm font-bold mb-2">Download Our App</h4>
            <div className="space-y-2">
              <a href="#" className="group flex items-center gap-2 bg-nav-foreground/90 text-nav rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">
                <Play className="h-5 w-5" />
                <span>
                  <span className="text-[10px] block leading-none">GET IT ON</span>
                  <span className="font-semibold text-sm">Google Play</span>
                </span>
              </a>
              <a href="#" className="group flex items-center gap-2 bg-nav-foreground/90 text-nav rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">
                <Apple className="h-5 w-5" />
                <span>
                  <span className="text-[10px] block leading-none">Download on the</span>
                  <span className="font-semibold text-sm">App Store</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-nav-foreground/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-nav-foreground/60">
            <div className="flex items-center gap-3">
              <span>We Accept:</span>
              <div className="flex items-center gap-2">
                {["VISA", "MC", "AMEX", "UPI"].map((card) => (
                  <span key={card} className="inline-flex items-center gap-1 rounded border border-nav-foreground/20 px-2 py-0.5 text-[10px] font-bold tracking-wider text-nav-foreground/70">
                    <CreditCard className="h-3 w-3" /> {card}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-center">
              <p>&copy; 2026 YatraMitra. All rights reserved.</p>
              <div className="flex flex-wrap gap-3 justify-center mt-1">
                {["Privacy Policy", "Terms of Service", "Cookie Policy", "Refund Policy", "FAQs"].map((link) => (
                  <a key={link} href="#" className="hover:text-secondary transition-colors duration-200">
                    {link}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
