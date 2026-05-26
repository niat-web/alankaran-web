import { useState, useEffect, lazy, Suspense } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const HeroCanvas = lazy(() => import("@/components/HeroCanvas"));
const DecorCanvas = lazy(() => import("@/components/DecorCanvas"));

const services = [
  { name: "Wedding Planning", desc: "From vision to reality — every detail orchestrated with precision and care." },
  { name: "Luxury Wedding Decor", desc: "Bespoke environments crafted from the finest materials and floral artistry." },
  { name: "Floral Styling", desc: "Living sculptures of bloom, fragrance, and texture that define a space." },
  { name: "Mandap Design", desc: "Sacred ceremonial spaces elevated into architectural masterpieces." },
  { name: "Engagement Decor", desc: "Intimate celebrations adorned with warmth, softness, and intention." },
  { name: "Reception Styling", desc: "Grand, luminous evenings designed to be felt long after the last dance." },
  { name: "Royal Theme Weddings", desc: "The grandeur of Indian royalty, reimagined for the modern celebration." },
  { name: "Wedding Stage Design", desc: "Statement stages that command presence and frame every photograph." },
  { name: "Bridal Entry Concepts", desc: "Arrivals so breathtaking, every guest will pause in silence." },
  { name: "Custom Event Styling", desc: "Singular creative vision applied to every facet of your celebration." },
];

const themes = [
  { name: "Rajasthani Royal", sub: "Desert gold & palace grandeur" },
  { name: "Mughal Garden", sub: "Symmetry, blooms & marble luxury" },
  { name: "Contemporary Luxe", sub: "Editorial precision meets warmth" },
  { name: "Temple Floristry", sub: "Sacred devotion meets living art" },
  { name: "Nawabi Elegance", sub: "Lucknow courts & chikan refinement" },
];

const stories = [
  { couple: "Priya & Arjun", date: "March 2024", location: "Udaipur, Rajasthan", theme: "Royal Palace" },
  { couple: "Meera & Rohit", date: "January 2024", location: "Goa", theme: "Coastal Elegance" },
  { couple: "Ananya & Vikram", date: "November 2023", location: "Jaipur Palace", theme: "Mughal Garden" },
];

const testimonials = [
  { text: "Alankaran turned our dream into reality. Every detail was beyond what we imagined.", client: "Priya & Arjun", location: "Udaipur" },
  { text: "The mandap design was breathtaking. Our guests are still talking about it months later.", client: "Meera & Rohit", location: "Goa" },
  { text: "From the first consultation to the last petal, the attention to detail was extraordinary.", client: "Ananya & Vikram", location: "Jaipur" },
];

// Luxury image blocks
function WeddingImage({ image, aspectClass = "aspect-[4/5]", label = "" }: { image: string; aspectClass?: string; label?: string }) {
  return (
    <div className={`group ${aspectClass} relative overflow-hidden rounded-2xl border border-gold/15 shadow-sm hover:shadow-xl hover:shadow-gold/10 transition-all duration-700 bg-muted`}>
      <img
        src={image}
        alt={label || "Wedding Decor"}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.6s] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-105"
        loading="lazy"
      />
      {/* Decorative Gold Inset Corner Borders for a super premium Nizami royal feel */}
      <div className="absolute inset-3 border border-gold/10 pointer-events-none rounded-xl z-10 transition-all duration-700 group-hover:border-gold/30 group-hover:inset-4" />

      {/* Subtle overlay */}
      <div className="absolute inset-0 flex items-end p-5 z-20 transition-all duration-700" style={{ background: "linear-gradient(to top, rgba(42,36,33,0.5) 0%, rgba(42,36,33,0.1) 40%, transparent 100%)" }}>
        {label && (
          <div className="transform translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
            <span className="section-label text-white/95 tracking-[0.2em] font-sans font-semibold text-[10px] drop-shadow-sm">{label}</span>
          </div>
        )}
      </div>
    </div>
  );
}

const images = [
  "/images/royal_mandap.webp",
  "/images/coastal_wedding.webp",
  "/images/mughal_garden.webp",
  "/images/floral_stage.webp",
  "/images/bridal_entry.webp",
  "/images/engagement_decor.webp",
  "/images/grand_reception.webp",
  "/images/floral_detail.webp",
];

// Lazy-load all non-hero images; hero uses fetchpriority="high" separately
const LAZY = "lazy" as const;
const EAGER = "eager" as const;

const videos = [
  "https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-kissing-under-a-floral-arch-44167-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-holding-hands-and-walking-in-a-park-44169-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-groom-and-bride-having-a-romantic-moment-44155-large.mp4",
];

export default function Home() {
  const [currentLandingSlide, setCurrentLandingSlide] = useState(0);

  const landingSlides = [
    {
      image: "/images/hero-mandap.webp",
      title: "ALANKARAN",
      subtitle: "Hyderabad's Premier Luxury Wedding Planners & Designers",
      tagline: "✦ BESPOKE NIZAMI ROYALTY & MODERN ROMANCE ✦"
    },
    {
      image: "/images/gallery-royal-1.webp",
      title: "ELEVATED ARTISTRY",
      subtitle: "Immersive Architectural Decor & Floral Styling",
      tagline: "✦ COMPOSING ETERNAL MEMORIES ✦"
    },
    {
      image: "/images/cinematic_floral_wedding.webp",
      title: "GRAND CELEBRATIONS",
      subtitle: "Flawless Execution Rooted in Splendor and Grace",
      tagline: "✦ ESTABLISHED 2011 — HYDERABAD ✦"
    },
    {
      image: "/images/mughal_garden.webp",
      title: "MUGHAL GARDEN LUXURY",
      subtitle: "Symmetry, Blooms & Sacred Temple Floristry",
      tagline: "✦ EVERY DETAIL CREATED WITH DELIBERATE INTENT ✦"
    },
    {
      image: "/images/hero-couple.webp",
      title: "ROYAL LUXURY",
      subtitle: "Nizami Splendor & Modern Romance",
      tagline: "✦ AN ANTHOLOGY OF LOVE STORIES ✦"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentLandingSlide((prev) => (prev + 1) % landingSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [currentLandingSlide, landingSlides.length]);

  const nextLandingSlide = () => {
    setCurrentLandingSlide((prev) => (prev + 1) % landingSlides.length);
  };

  const prevLandingSlide = () => {
    setCurrentLandingSlide((prev) => (prev - 1 + landingSlides.length) % landingSlides.length);
  };

  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [decorMouseX, setDecorMouseX] = useState(0);
  const [decorMouseY, setDecorMouseY] = useState(0);

  const springX = useSpring(0, { stiffness: 60, damping: 20 });
  const springY = useSpring(0, { stiffness: 60, damping: 20 });
  const heroMoveX = useTransform(springX, [-1, 1], [-18, 18]);
  const heroMoveY = useTransform(springY, [-1, 1], [-10, 10]);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMouseX(x);
      setMouseY(y);
      springX.set(x);
      springY.set(y);
    };
    window.addEventListener("mousemove", onMouse);
    return () => window.removeEventListener("mousemove", onMouse);
  }, [springX, springY]);


  return (
    <div className="bg-background text-foreground overflow-x-hidden">
      <SEO
        title="Hyderabad Luxury Wedding Planner & Nizami Floral Design"
        description="Alankaran is Hyderabad's premier luxury wedding planning and management company, creating immersive royal celebrations inspired by Nizami heritage, romance, and modern editorial beauty."
      />
      {/* ─── PREMIUM FULL-SCREEN HERO LANDING SLIDER ─── */}
      <section className="relative h-screen w-full overflow-hidden bg-black select-none">
        {/* Background Auto-changing Slides */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence initial={false}>
            <motion.div
              key={currentLandingSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              {/* Cinematic Scale Zoom Animation */}
              <motion.img
                src={landingSlides[currentLandingSlide].image}
                alt="Alankaran Luxury Weddings"
                initial={{ scale: 1 }}
                animate={{ scale: 1.08 }}
                transition={{ duration: 5, ease: "linear" }}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>
          <Suspense fallback={null}>
            <HeroCanvas mouseX={mouseX} mouseY={mouseY} isMobile={isMobile} />
          </Suspense>
        </div>

        {/* Cinematic Overlays */}
        <div className="absolute inset-0 z-10 bg-black/50" />
        <div
          className="absolute inset-0 z-10"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.65) 100%)",
          }}
        />

        {/* Center-Aligned Luxury Content */}
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-6 lg:px-12">
          {/* Top Label Tagline */}
          <motion.div
            className="flex items-center justify-center gap-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="h-px w-8 bg-white/60" />
            <span className="font-sans font-semibold text-white/85 text-[10px] tracking-[0.4em] uppercase">
              ✦ EST. 2011 - HYDERABAD, INDIA ✦
            </span>
            <div className="h-px w-8 bg-white/60" />
          </motion.div>

          {/* Heading */}
          <motion.h1
            className="text-display text-5xl sm:text-6xl md:text-8xl lg:text-[7.5rem] text-white font-serif uppercase tracking-[0.08em] mb-8 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
            style={{ x: heroMoveX, y: heroMoveY }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            Crafting Timeless
            <br />
            <span className="font-script italic text-gold-gradient normal-case text-[1.2em] -mt-4 block lg:inline-block md:ml-4">
              Luxury
            </span>{" "}
            Weddings
          </motion.h1>

          {/* Description */}
          <motion.p
            className="max-w-2xl mx-auto text-base md:text-lg mb-10 text-white/90 font-light drop-shadow leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            Alankaran is a premier Hyderabad-based luxury wedding planner and management studio, crafting bespoke floral decors, mandaps, and grand royal celebrations rooted in Nizami heritage.
          </motion.p>

          {/* Two CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <Link href="/contact">
              <motion.button
                className="px-8 py-4 bg-gold text-primary-foreground font-sans font-medium tracking-widest text-xs uppercase hover:bg-gold-hover hover:gold-glow transition-all cursor-pointer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                data-testid="btn-plan-celebration"
              >
                Plan Your Wedding
              </motion.button>
            </Link>
            <Link href="/wedding-stories">
              <motion.button
                className="px-8 py-4 border-2 border-white/70 text-white font-sans font-medium tracking-widest text-xs uppercase hover:bg-card-bg hover:text-gold hover:border-gold transition-all cursor-pointer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                data-testid="btn-explore-weddings"
              >
                Explore Stories
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Minimalist Navigation Dots */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
          {landingSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentLandingSlide(idx)}
              className={`h-1.5 transition-all duration-500 rounded-full cursor-pointer ${idx === currentLandingSlide ? "w-8 bg-gold" : "w-2 bg-white/40 hover:bg-white/70"
                }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Manual Left Arrow */}
        <button
          onClick={prevLandingSlide}
          className="absolute left-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-gold hover:bg-gold/15 transition-all duration-300 hover:scale-110 hidden md:flex items-center justify-center backdrop-blur-sm cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Manual Right Arrow */}
        <button
          onClick={nextLandingSlide}
          className="absolute right-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-gold hover:bg-gold/15 transition-all duration-300 hover:scale-110 hidden md:flex items-center justify-center backdrop-blur-sm cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Luxury Scroll Guide Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
          <motion.div
            className="flex flex-col items-center gap-3 cursor-pointer pointer-events-auto group"
            onClick={() => {
              const target = document.getElementById("luxury-showcase");
              if (target) target.scrollIntoView({ behavior: "smooth" });
            }}
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-[9px] font-sans tracking-[0.4em] uppercase text-white/50 group-hover:text-gold transition-colors">Scroll</span>
            <div className="w-[18px] h-8 rounded-full border border-white/20 flex justify-center p-1 bg-black/10 backdrop-blur-[2px] group-hover:border-gold/40 transition-colors">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-gold"
                animate={{
                  y: [0, 12, 0],
                  opacity: [1, 0.4, 1]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.2,
                  ease: "easeInOut"
                }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── LUXURY SHOWCASE ─── */}
      <section id="luxury-showcase" className="py-24 lg:py-32 max-w-screen-xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 items-center relative">
          <div className="col-span-1 space-y-6">
            <WeddingImage image={images[0]} aspectClass="aspect-[4/5]" label="Nizami Mandap" />
            <WeddingImage image={images[4]} aspectClass="aspect-[4/5]" label="Bridal Entry" />
          </div>
          <div className="col-span-1 space-y-6">
            <WeddingImage image={images[1]} aspectClass="aspect-[4/5]" label="Coastal Symphony" />
            <WeddingImage image={images[5]} aspectClass="aspect-[4/5]" label="Engagement Soirée" />
          </div>
          <div className="col-span-2 md:col-span-1 flex flex-col justify-center items-start px-4 md:px-8">
            <p className="section-label mb-4 text-gold">Our Work</p>
            <h2 className="text-display text-5xl lg:text-7xl mb-6 text-foreground">
              Crafted<br />With<br /><em className="not-italic text-gold-gradient">Intention</em>
            </h2>
            <p className="font-sans font-light text-muted-foreground text-sm leading-relaxed mb-8">
              Every arrangement, every fabric drape, every candlelit moment — chosen with deliberate creative intent.
            </p>
            <Link href="/gallery">
              <motion.button
                className="px-8 py-3 bg-gold text-primary-foreground section-label hover:bg-gold-hover hover:gold-glow transition-all"
                whileHover={{ scale: 1.02 }}
                data-testid="btn-view-gallery"
              >
                Explore Gallery
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Gold divider */}
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
        <div className="h-px" style={{ background: "hsl(46 30% 82%)" }} />
      </div>

      {/* ─── ABOUT PREVIEW ─── */}
      <section className="py-24 lg:py-36 max-w-screen-xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="section-label mb-6 text-gold">Our Philosophy</p>
            <h2 className="text-display text-4xl lg:text-6xl mb-8 text-foreground">
              Where Heritage Meets<br />
              <em className="not-italic text-gold-gradient">Modern Romance</em>
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/about">
                <motion.button
                  className="px-8 py-3 bg-gold text-primary-foreground section-label hover:bg-gold-hover hover:gold-glow transition-all"
                  whileHover={{ scale: 1.02 }}
                  data-testid="btn-our-story"
                >
                  Our Story
                </motion.button>
              </Link>
              <Link href="/contact">
                <motion.button
                  className="px-8 py-3 border border-gold text-gold section-label hover:bg-gold/5 transition-all"
                  whileHover={{ scale: 1.02 }}
                >
                  Get in Touch
                </motion.button>
              </Link>
            </div>
          </div>
          <div className="space-y-6">
            {[
              "Every celebration is composed like a work of art.",
              "Florals, textures, rituals, and spaces are designed into one cinematic experience.",
              "From intimate ceremonies to grand royal weddings, every detail is curated with grace.",
              "We don't decorate spaces — we compose experiences.",
            ].map((text, i) => (
              <div key={i}>
                <div className="h-px mb-4" style={{ background: "hsl(46 30% 82%)" }} />
                <p className="text-quote text-lg lg:text-xl text-foreground">
                  &ldquo;{text}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SERVICES ─── */}
      <section className="py-24 lg:py-32 relative bg-luxury-gradient">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="section-label mb-4 text-gold justify-center">What We Do</p>
            <h2 className="text-display text-4xl lg:text-6xl text-foreground">Signature Services</h2>
          </div>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
          >
            {services.map((s, i) => (
              <motion.div
                key={s.name}
                className="service-card bg-card border border-border/40 p-5 cursor-pointer group relative overflow-hidden transition-colors hover:border-gold/60"
                whileHover={{ y: -6, boxShadow: "0 10px 30px rgba(176, 141, 87, 0.15)" }}
                transition={{ duration: 0.3 }}
                data-testid={`card-service-${i}`}
              >
                <div className="text-gold/20 font-serif text-4xl absolute top-2 right-4 group-hover:text-gold/40 transition-colors">
                  0{i + 1}
                </div>
                <div
                  className="w-full aspect-[4/3] mb-4 relative z-10"
                  style={{ backgroundImage: `url(${images[i % images.length]})`, backgroundSize: "cover", backgroundPosition: "center" }}
                />
                <h3 className="font-serif text-lg mb-2 text-foreground">{s.name}</h3>
                <p className="text-body text-[13px]">
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/services">
              <motion.button
                className="px-10 py-4 btn-outline-gold section-label transition-all"
                whileHover={{ scale: 1.02 }}
                data-testid="btn-all-services"
              >
                View All Services
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── INLINE CTA STRIP ─── */}
      <div className="bg-foreground py-5">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-serif text-white text-lg">Ready to begin your wedding journey?</p>
            <p className="font-sans text-white/60 text-xs font-light mt-0.5">Talk to our expert and get a personalised quote today.</p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link href="/contact">
              <motion.button className="px-6 py-3 bg-gold text-primary-foreground section-label hover:bg-gold-hover hover:gold-glow transition-all" whileHover={{ scale: 1.03 }}>
                Talk to an Expert
              </motion.button>
            </Link>
            <Link href="/contact">
              <motion.button className="px-6 py-3 border border-white/30 text-white section-label hover:bg-white/10 transition-all" whileHover={{ scale: 1.03 }}>
                Get a Quote
              </motion.button>
            </Link>
          </div>
        </div>
      </div>

      {/* ─── ROYAL THEMES ─── */}
      <section className="py-24 lg:py-32">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
            <div>
              <p className="section-label mb-4 text-gold">Collections</p>
              <h2 className="text-display text-4xl lg:text-6xl text-foreground">Royal Wedding Themes</h2>
            </div>
            <Link href="/services">
              <motion.button
                className="shrink-0 px-8 py-3 btn-outline-gold section-label transition-all"
                whileHover={{ scale: 1.02 }}
                data-testid="btn-all-themes"
              >
                View All Themes
              </motion.button>
            </Link>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide">
            {themes.map((t, i) => (
              <motion.div
                key={t.name}
                className="flex-none snap-center w-72 md:w-80"
                whileHover={{ scale: 1.02 }}
                data-testid={`card-theme-${i}`}
              >
                <div
                  className="aspect-[3/4] relative overflow-hidden"
                  style={{ backgroundImage: `url(${images[(i + 2) % images.length]})`, backgroundSize: "cover", backgroundPosition: "center" }}
                >
                  <div
                    className="absolute inset-0 flex flex-col justify-end p-6"
                    style={{ background: "linear-gradient(to top, hsl(150 15% 10% / 0.7) 0%, transparent 60%)" }}
                  >
                    <h3 className="font-serif text-2xl text-white mb-1">{t.name}</h3>
                    <p className="font-sans text-xs text-white/70" style={{ fontWeight: 300 }}>{t.sub}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gold divider */}
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
        <div className="h-px" style={{ background: "hsl(46 30% 82%)" }} />
      </div>

      {/* ─── 3D DECOR EXPERIENCE ─── */}
      <section className="py-24 lg:py-36">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="section-label mb-4 text-gold">Immersive Design</p>
              <h2 className="text-display text-4xl lg:text-6xl mb-6 text-foreground">
                Experience the<br />
                <em className="not-italic text-gold-gradient">Extraordinary</em>
              </h2>
              <p className="text-body text-sm mb-8 max-w-md">
                Our design process is tactile, immersive, and deeply considered. Every material is chosen not just to be seen, but to be felt.
              </p>
              <Link href="/services">
                <motion.button
                  className="px-8 py-3 bg-gold text-primary-foreground section-label hover:bg-gold-hover hover:gold-glow transition-all"
                  whileHover={{ scale: 1.02 }}
                  data-testid="btn-discover-services"
                >
                  Discover Our Process
                </motion.button>
              </Link>
            </div>
            {/* Floating image circles */}
            <div className="relative h-96 lg:h-[500px] select-none">
              {/* Large center circle */}
              <motion.div
                className="absolute rounded-full overflow-hidden border-4 border-white shadow-2xl"
                style={{ width: 260, height: 260, top: "50%", left: "50%", x: "-50%", y: "-50%" }}
                animate={{ y: ["-52%", "-48%", "-52%"] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <img src={images[0]} alt="Royal mandap" className="w-full h-full object-cover" />
              </motion.div>

              {/* Top-right medium circle */}
              <motion.div
                className="absolute rounded-full overflow-hidden border-4 border-white shadow-xl"
                style={{ width: 150, height: 150, top: "4%", right: "4%" }}
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              >
                <img src={images[2]} alt="Mughal garden" className="w-full h-full object-cover" />
              </motion.div>

              {/* Bottom-left small circle */}
              <motion.div
                className="absolute rounded-full overflow-hidden border-4 border-white shadow-xl"
                style={{ width: 110, height: 110, bottom: "8%", left: "8%" }}
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
              >
                <img src={images[4]} alt="Bridal entry" className="w-full h-full object-cover" />
              </motion.div>

              {/* Bottom-right small circle */}
              <motion.div
                className="absolute rounded-full overflow-hidden border-4 border-white shadow-lg"
                style={{ width: 90, height: 90, bottom: "14%", right: "10%" }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              >
                <img src={images[5]} alt="Engagement decor" className="w-full h-full object-cover" />
              </motion.div>

              {/* Top-left tiny accent circle */}
              <motion.div
                className="absolute rounded-full overflow-hidden border-2 border-gold/40 shadow-md"
                style={{ width: 68, height: 68, top: "16%", left: "6%" }}
                animate={{ y: [0, 7, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              >
                <img src={images[7]} alt="Floral detail" className="w-full h-full object-cover" />
              </motion.div>

              {/* Decorative gold ring behind main circle */}
              <div
                className="absolute rounded-full border border-gold/20 pointer-events-none"
                style={{ width: 300, height: 300, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── CINEMATIC IMAGE GRID ─── */}
      <section className="py-12 lg:py-20 bg-muted/20">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-10">
            <p className="section-label mb-3 text-gold justify-center">Visual Anthology</p>
            <h2 className="text-display text-3xl lg:text-5xl text-foreground mb-6">Every Frame, a Memory</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-4 gap-4 md:gap-6 h-auto md:h-[800px] lg:h-[950px] xl:h-[1050px] w-full">
            {/* Item 1: Wide landscape (Row 1-2, Col 1-2) */}
            <div className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-2xl group shadow-sm bg-muted aspect-[16/10] md:aspect-auto">
              <img
                src={images[1]}
                alt="Luxury wedding moment"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                <span className="font-sans font-medium text-xs tracking-widest text-white uppercase">Romantic Symphony</span>
              </div>
            </div>

            {/* Item 2: Small landscape (Row 1, Col 3) */}
            <div className="md:col-span-1 md:row-span-1 relative overflow-hidden rounded-2xl group shadow-sm bg-muted aspect-[4/3] md:aspect-auto">
              <img
                src={images[2]}
                alt="Mughal garden wedding"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                <span className="font-sans font-medium text-xs tracking-widest text-white uppercase">Mughal Majesty</span>
              </div>
            </div>

            {/* Item 3: Small landscape (Row 2, Col 3) */}
            <div className="md:col-span-1 md:row-span-1 relative overflow-hidden rounded-2xl group shadow-sm bg-muted aspect-[4/3] md:aspect-auto">
              <img
                src={images[3]}
                alt="Floral stage design"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                <span className="font-sans font-medium text-xs tracking-widest text-white uppercase">Floral Splendor</span>
              </div>
            </div>

            {/* Item 4: Tall portrait (Row 3-4, Col 1) */}
            <div className="md:col-span-1 md:row-span-2 relative overflow-hidden rounded-2xl group shadow-sm bg-muted aspect-[3/4] md:aspect-auto">
              <img
                src="/images/mandap_floral_detail.webp"
                alt="Mandap floral detail"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                <span className="font-sans font-medium text-xs tracking-widest text-white uppercase">Sacred Spaces</span>
              </div>
            </div>

            {/* Item 5: Wide landscape (Row 3-4, Col 2-3) */}
            <div className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-2xl group shadow-sm bg-muted aspect-[16/10] md:aspect-auto">
              <img
                src={images[0]}
                alt="Royal mandap"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                <span className="font-sans font-medium text-xs tracking-widest text-white uppercase">The Grand Palace</span>
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link href="/gallery">
              <motion.button
                className="px-10 py-4 bg-gold text-primary-foreground section-label hover:bg-gold-hover hover:gold-glow transition-all"
                whileHover={{ scale: 1.02 }}
              >
                Browse Full Gallery
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CTA STRIP 2 ─── */}
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-6">
        <div className="bg-card border border-border/60 rounded-xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-serif text-foreground text-lg">Check Date Availability</p>
            <p className="font-sans text-muted-foreground text-xs font-light mt-0.5">Your wedding date may already be in demand — confirm yours now.</p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link href="/contact">
              <motion.button className="px-6 py-3 bg-gold text-primary-foreground section-label hover:bg-gold-hover hover:gold-glow transition-all" whileHover={{ scale: 1.03 }}>
                Check Availability
              </motion.button>
            </Link>
            <Link href="/contact">
              <motion.button className="px-6 py-3 btn-outline-gold section-label transition-all" whileHover={{ scale: 1.03 }}>
                Get Instant Budget
              </motion.button>
            </Link>
          </div>
        </div>
      </div>

      {/* ─── WEDDING STORIES ─── */}
      <section className="py-24 lg:py-32">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="section-label mb-4 text-gold justify-center">Real Weddings</p>
            <h2 className="text-display text-4xl lg:text-6xl text-foreground">Wedding Stories</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stories.map((s, i) => (
              <motion.div
                key={s.couple}
                className="glass-card overflow-hidden group relative aspect-[4/5]"
                whileHover={{ y: -4, boxShadow: "0 0 20px rgba(212, 175, 55, 0.2)" }}
                data-testid={`card-story-${i}`}
              >
                <img src={images[i % images.length]} alt={s.couple} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
                <div className="absolute bottom-0 left-0 w-full p-6 z-20">
                  <p className="section-label mb-2 text-gold/80">{s.date} — {s.location}</p>
                  <h3 className="font-serif text-3xl mb-1 text-white">{s.couple}</h3>
                  <p className="text-body text-sm text-white/70">{s.theme}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/wedding-stories">
              <motion.button
                className="px-10 py-4 btn-outline-gold section-label transition-all"
                whileHover={{ scale: 1.02 }}
                data-testid="btn-all-stories"
              >
                View All Stories
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── VIDEO REELS ─── */}
      <section className="py-24 lg:py-32 bg-muted/20">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="section-label mb-4 text-gold justify-center">Cinematic Stories</p>
            <h2 className="text-display text-4xl lg:text-5xl mb-4 text-foreground">Captured Moments, Eternal Stories</h2>
            <p className="text-body text-sm max-w-xl mx-auto">
              From intimate ceremonies to grand royal celebrations — every frame tells a story.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              "/images/cinematic_floral_wedding.webp",
              "/images/coastal_sunset_wedding.webp",
              "/images/royal_palace_reception.webp",
            ].map((src, i) => (
              <motion.div
                key={i}
                className="relative aspect-[4/5] overflow-hidden cursor-pointer group"
                whileHover={{ scale: 1.02 }}
                data-testid={`card-reel-${i}`}
              >
                <img
                  src={src}
                  alt={`Cinematic wedding moment ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0 transition-opacity duration-700 opacity-0 group-hover:opacity-100"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 40%)" }}
                />
                <div className="absolute inset-0 flex items-end justify-center pb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  <span className="font-sans text-xs uppercase tracking-widest text-white/90">
                    Discover More
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/wedding-stories">
              <motion.button
                className="px-10 py-4 btn-outline-gold section-label transition-all"
                whileHover={{ scale: 1.02 }}
              >
                Read Wedding Stories
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── PLANNING JOURNEY ─── */}
      <section className="py-24 lg:py-32 relative border-y border-gold/20 bg-luxury-gradient">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center mb-20">
            <p className="section-label mb-4 text-gold justify-center">The Experience</p>
            <h2 className="text-display text-4xl lg:text-5xl text-foreground">Your Planning Journey</h2>
          </div>
          <div className="relative">
            {/* Horizontal Line (Desktop) */}
            <div className="hidden md:block absolute top-[2.5rem] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/50 to-transparent -translate-y-1/2" />
            {/* Vertical Line (Mobile) */}
            <div className="md:hidden absolute left-8 top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-gold/50 to-transparent" />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4 relative z-10">
              {[
                { step: "01", title: "Discovery", desc: "Understanding your vision, style, and essential requirements." },
                { step: "02", title: "Vision", desc: "Conceptualizing the design theme and creative direction." },
                { step: "03", title: "Design", desc: "Detailed 3D renders, material selection, and floral planning." },
                { step: "04", title: "Execution", desc: "Flawless production and on-site orchestration." },
                { step: "05", title: "Celebration", desc: "You enjoy every moment while we handle the details." },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  className="flex flex-row md:flex-col items-start md:items-center text-left md:text-center gap-6 md:gap-4 group cursor-pointer"
                >
                  <div className="w-16 h-16 shrink-0 md:w-20 md:h-20 rounded-full bg-background border border-gold/40 flex items-center justify-center font-serif text-xl text-gold group-hover:bg-gold group-hover:text-primary-foreground group-hover:bg-gold-hover group-hover:gold-glow transition-all">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-serif text-xl md:text-2xl mb-2 text-foreground group-hover:text-gold transition-colors">{item.title}</h3>
                    <p className="text-body text-xs px-2">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="text-center mt-16">
            <Link href="/contact">
              <motion.button
                className="px-10 py-4 bg-gold text-primary-foreground section-label hover:bg-gold-hover hover:gold-glow transition-all"
                whileHover={{ scale: 1.02 }}
                data-testid="btn-start-planning"
              >
                Start Planning Your Wedding
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-24 lg:py-32 relative">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center mb-16">
            <p className="section-label mb-4 text-gold justify-center">Words of Love</p>
            <h2 className="text-display text-4xl lg:text-5xl text-foreground">What Our Couples Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                className="glass-card p-8 relative hover:border-gold/50 transition-all hover:shadow-md"
                data-testid={`card-testimonial-${i}`}
              >
                <div className="font-serif text-6xl leading-none mb-4 text-gold/40">&ldquo;</div>
                <div className="flex gap-1 mb-4 text-gold">
                  {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
                </div>
                <p className="text-quote text-base lg:text-lg text-foreground mb-6">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="h-px mb-4 bg-gold/20" />
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full border border-gold flex items-center justify-center text-gold font-serif">
                    {t.client.charAt(0)}
                  </div>
                  <div>
                    <p className="font-serif text-base">{t.client}</p>
                    <p className="section-label mt-1 text-gold/70">{t.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/testimonials">
              <motion.button
                className="px-10 py-4 btn-outline-gold section-label transition-all"
                whileHover={{ scale: 1.02 }}
                data-testid="btn-all-testimonials"
              >
                Read All Testimonials
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section
        className="py-32 lg:py-48 flex flex-col items-center justify-center text-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, hsl(347 41% 21%) 0%, hsl(347 41% 11%) 100%)" }}
      >
        <div className="relative z-10 flex flex-col items-center animate-fade-in">
          <p className="section-label mb-6 justify-center text-gold">
            Begin Your Journey
          </p>
          <h2 className="text-display text-4xl lg:text-7xl mb-6 text-card-bg">
            Begin Your Story<br />With Us
          </h2>
          <p className="mb-10 text-lg max-w-md text-card-bg/75 font-light">
            Every celebration is composed like a work of art.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/contact">
              <motion.button
                className="px-10 py-5 section-label bg-gold text-primary-foreground hover:bg-gold-hover hover:gold-glow transition-all"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                data-testid="btn-cta-book"
              >
                Book Your Consultation
              </motion.button>
            </Link>
            <Link href="/gallery">
              <motion.button
                className="px-10 py-5 section-label border border-white/40 text-white hover:bg-white/10 transition-all"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                View Our Gallery
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
