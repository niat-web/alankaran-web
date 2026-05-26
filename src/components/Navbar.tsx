import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import Logo from "@/components/Logo";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Luxury Services", href: "/services" },
  { label: "Destinations", href: "/destinations" },
  { label: "Wedding Stories", href: "/wedding-stories" },
  { label: "Gallery", href: "/gallery" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Contact", href: "/contact" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();
  const { openBookingModal } = useBooking();

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <nav
        aria-label="Main Navigation"
        className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/30"
        style={{ boxShadow: "0 10px 30px rgba(43, 36, 32, 0.03)" }}
      >
        <div className="w-full px-6 lg:px-10 xl:px-14 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <motion.div
              className="cursor-pointer"
              whileHover={{ opacity: 0.85 }}
              data-testid="logo"
            >
              <Logo size={36} showText={true} />
            </motion.div>
          </Link>

          {/* Desktop Nav - Right aligned */}
          <div className="hidden lg:flex items-center justify-end gap-3.5 xl:gap-5 whitespace-nowrap ml-auto">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <motion.span
                  className={`group relative cursor-pointer transition-colors duration-300 pb-1 text-[9px] xl:text-[9.5px] tracking-[0.06em] xl:tracking-[0.1em] uppercase font-semibold ${location === link.href
                      ? "text-gold font-bold"
                      : "text-foreground/75 hover:text-foreground"
                    }`}
                  whileHover={{ y: -0.5 }}
                  data-testid={`nav-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {link.label}
                  <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-gold origin-left transition-transform duration-300 ${location === link.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
                </motion.span>
              </Link>
            ))}

            {/* Book button */}
            <motion.button
              onClick={openBookingModal}
              className="ml-2 px-4.5 py-1.5 bg-gold text-background text-[9px] xl:text-[9.5px] tracking-[0.1em] uppercase font-bold rounded-full hover:bg-[#9B7744] transition-all border border-gold/20 shadow-sm"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              data-testid="btn-nav-book"
            >
              Book
            </motion.button>
          </div>

          {/* Hamburger (mobile only) */}
          <motion.button
            className="lg:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
            whileTap={{ scale: 0.92 }}
            data-testid="btn-hamburger"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>
      </nav>

      {/* Mobile Full-Screen Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col justify-center items-center bg-background/98"
            initial={{ opacity: 0, clipPath: "circle(0% at top right)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at top right)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at top right)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex flex-col items-center gap-8">
              <div className="mb-4">
                <Logo size={48} showText={true} />
              </div>
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.05 * i + 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link href={link.href}>
                    <span
                      className="font-serif text-3xl text-foreground/90 hover:text-gold transition-colors cursor-pointer"
                      data-testid={`mobile-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {link.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.55, duration: 0.5 }}
              >
                <div className="flex flex-col gap-4 mt-4">
                  <Link href="/contact">
                    <button
                      className="w-full px-8 py-3.5 border border-gold text-gold section-label rounded-full hover:bg-[#9B7744] hover:text-background transition-all"
                      data-testid="mobile-btn-consultation"
                    >
                      Book Consultation
                    </button>
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Thin gold divider */}
            <div className="absolute bottom-10 w-16 h-px bg-gold opacity-40" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
