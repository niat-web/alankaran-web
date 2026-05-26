import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const categories = ["All", "Mandap", "Floral", "Reception", "Bridal Entry", "Royal Themes", "Stage Decor"];

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

const galleryItems = [
  { id: 1, cat: "Mandap", image: images[0], label: "Royal Mandap, Udaipur" },
  { id: 2, cat: "Floral", image: images[3], label: "Garden Floristry, Jaipur" },
  { id: 3, cat: "Reception", image: images[6], label: "Grand Reception, Mumbai" },
  { id: 4, cat: "Bridal Entry", image: images[4], label: "Floral Tunnel, Goa" },
  { id: 5, cat: "Royal Themes", image: images[2], label: "Rajputana Theme, Jodhpur" },
  { id: 6, cat: "Stage Decor", image: images[5], label: "Baroque Stage, Delhi" },
  { id: 7, cat: "Mandap", image: images[0], label: "Mughal Mandap, Agra" },
  { id: 8, cat: "Floral", image: images[7], label: "Rose Canopy, Lucknow" },
  { id: 9, cat: "Reception", image: images[6], label: "Crystal Reception, Hyderabad" },
  { id: 10, cat: "Bridal Entry", image: images[4], label: "Smoke & Light Entry, Chennai" },
  { id: 11, cat: "Royal Themes", image: images[2], label: "Mughal Garden, Jaisalmer" },
  { id: 12, cat: "Stage Decor", image: images[5], label: "Ivory Stage, Pune" },
  { id: 13, cat: "Mandap", image: images[1], label: "Floral Arch Mandap, Goa" },
  { id: 14, cat: "Floral", image: images[3], label: "Jasmine Wall, Udaipur" },
];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = activeCategory === "All"
    ? galleryItems
    : galleryItems.filter((g) => g.cat === activeCategory);

  const openLightbox = (idx: number) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () => setLightboxIndex((i) => (i !== null ? (i - 1 + filtered.length) % filtered.length : null));
  const nextImage = () => setLightboxIndex((i) => (i !== null ? (i + 1) % filtered.length : null));

  return (
    <div className="bg-background text-foreground">
      <SEO
        title="Portfolio & Gallery"
        description="A visual anthology of Alankaran's luxury wedding design, featuring mandaps, floral styling, reception decor, and bridal entries."
      />
      {/* Hero */}
      <section className="relative h-[55vh] flex items-end pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0" style={{ backgroundImage: `url(${images[3]})`, backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.85) saturate(1.0)" }} />
        <div className="absolute inset-0 z-10" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.4) 100%)" }} />
        <div className="relative max-w-screen-xl mx-auto px-6 lg:px-12 z-20">
          <motion.p className="section-label mb-4 text-gold" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Portfolio</motion.p>
          <motion.h1 className="text-display text-5xl lg:text-8xl text-white" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 1 }}>
            A Visual <em className="not-italic text-gold-gradient">Anthology</em>
          </motion.h1>
        </div>
      </section>

      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-12">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 border section-label transition-colors hover:border-gold/60 ${activeCategory === cat ? "border-gold bg-gold text-background" : "border-gold/20 text-muted-foreground hover:text-gold"}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              data-testid={`filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Masonry Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            className="columns-2 md:columns-3 lg:columns-4 gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {filtered.map((item, idx) => (
              <motion.div
                key={item.id}
                className="break-inside-avoid mb-3 cursor-pointer overflow-hidden group"
                style={{ backgroundImage: `url(${item.image})`, backgroundSize: "cover", backgroundPosition: "center", aspectRatio: idx % 3 === 0 ? "3/4" : idx % 3 === 1 ? "1/1" : "4/5" }}
                onClick={() => openLightbox(idx)}
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.5 }}
                data-testid={`gallery-item-${item.id}`}
              >
                <div className="w-full h-full relative border border-transparent group-hover:border-gold/50 transition-colors duration-500">
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4 bg-gradient-to-t from-black via-black/50 to-transparent"
                  >
                    <p className="text-body text-[11px] text-gold">{item.label}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(5, 5, 5, 0.98)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <div className="relative max-w-4xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
              <motion.div
                className="aspect-[4/3] w-full"
                style={{ backgroundImage: `url(${filtered[lightboxIndex]?.image})`, backgroundSize: "cover", backgroundPosition: "center" }}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
              />
              <p className="text-body text-xs text-white/70 mt-3 text-center">
                {filtered[lightboxIndex]?.label}
              </p>
              {/* Controls */}
              <button className="absolute top-4 right-4 text-white/80 hover:text-white" onClick={closeLightbox} data-testid="btn-lightbox-close">
                <X size={22} />
              </button>
              <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white" onClick={prevImage} data-testid="btn-lightbox-prev">
                <ChevronLeft size={28} />
              </button>
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white" onClick={nextImage} data-testid="btn-lightbox-next">
                <ChevronRight size={28} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
