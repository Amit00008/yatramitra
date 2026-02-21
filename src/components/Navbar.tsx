import { MapPin, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navLinks = ["Home", "Hotels", "Ride Sharing", "Car Rentals", "Destinations"];

  return (
    <nav className="bg-nav text-nav-foreground sticky top-0 z-50 backdrop-blur-sm bg-nav/95 shadow-lg shadow-primary/10">
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <MapPin className="h-6 w-6 sm:h-7 sm:w-7 text-secondary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
          <span className="text-lg sm:text-xl font-bold tracking-tight">YatraMitra</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link}
              href="#"
              className="relative text-sm font-medium text-nav-foreground/90 hover:text-secondary transition-colors duration-300 after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-secondary after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="rounded-full border border-secondary bg-secondary px-5 py-1.5 text-sm font-semibold text-secondary-foreground transition-colors duration-200 hover:bg-secondary/90 active:scale-95">
            Login
          </Link>
          <Link to="/signup" className="rounded-full border border-secondary px-5 py-1.5 text-sm font-semibold text-secondary transition-colors duration-200 hover:bg-secondary hover:text-secondary-foreground active:scale-95">
            Sign Up
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-nav-foreground p-1"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-nav-foreground/10 bg-nav">
          <div className="container mx-auto px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link}
                href="#"
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium text-nav-foreground/90 hover:text-secondary transition-colors py-1"
              >
                {link}
              </a>
            ))}
            <div className="flex gap-3 pt-2">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center rounded-full border border-secondary bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground">
                Login
              </Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)} className="flex-1 text-center rounded-full border border-secondary px-4 py-2 text-sm font-semibold text-secondary">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
