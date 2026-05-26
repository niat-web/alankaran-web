import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";
import { Suspense, lazy, useState, useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import LenisProvider from "@/components/LenisProvider";
import WhatsAppButton from "@/components/WhatsAppButton";
import { BookingProvider } from "@/context/BookingContext";
import NotFound from "@/pages/not-found";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);
  return null;
}

const Home = lazy(() => import("@/pages/Home"));
const About = lazy(() => import("@/pages/About"));
const Services = lazy(() => import("@/pages/Services"));
const DestinationWeddings = lazy(() => import("@/pages/DestinationWeddings"));

const WeddingStories = lazy(() => import("@/pages/WeddingStories"));
const Gallery = lazy(() => import("@/pages/Gallery"));
const Testimonials = lazy(() => import("@/pages/Testimonials"));
const Contact = lazy(() => import("@/pages/Contact"));

const queryClient = new QueryClient();

function PageLoader() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-background"
    >
      <div className="text-center">
        <p
          className="font-serif text-3xl tracking-[0.15em] text-gold-gradient"
        >
          ALANKARAN
        </p>
        <div
          className="h-px w-16 mx-auto mt-4 bg-gold animate-pulse"
        />
      </div>
    </div>
  );
}

function Router() {
  return (
    <AnimatePresence mode="wait">
      <Switch>
        <Route path="/" component={() => (
          <Suspense fallback={<PageLoader />}><Home /></Suspense>
        )} />
        <Route path="/about" component={() => (
          <Suspense fallback={<PageLoader />}><About /></Suspense>
        )} />
        <Route path="/services" component={() => (
          <Suspense fallback={<PageLoader />}><Services /></Suspense>
        )} />
        <Route path="/destinations" component={() => (
          <Suspense fallback={<PageLoader />}><DestinationWeddings /></Suspense>
        )} />
        <Route path="/wedding-stories" component={() => (
          <Suspense fallback={<PageLoader />}><WeddingStories /></Suspense>
        )} />
        <Route path="/gallery" component={() => (
          <Suspense fallback={<PageLoader />}><Gallery /></Suspense>
        )} />
        <Route path="/testimonials" component={() => (
          <Suspense fallback={<PageLoader />}><Testimonials /></Suspense>
        )} />
        <Route path="/contact" component={() => (
          <Suspense fallback={<PageLoader />}><Contact /></Suspense>
        )} />
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  // Defer WhatsApp button until after first user interaction (scroll/touch).
  // This removes the continuous Framer Motion pulse animation from the main thread
  // during the critical Lighthouse measurement window, reducing Total Blocking Time.
  const [showWhatsApp, setShowWhatsApp] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const activate = () => {
      setShowWhatsApp(true);
      window.removeEventListener("scroll", activate);
      window.removeEventListener("touchstart", activate);
      clearTimeout(timer);
    };
    // Show on first scroll or touch
    window.addEventListener("scroll", activate, { once: true, passive: true });
    window.addEventListener("touchstart", activate, { once: true, passive: true });
    // Fallback: show after 4s even with no interaction (e.g. desktop no-scroll)
    timer = setTimeout(activate, 4000);
    return () => {
      window.removeEventListener("scroll", activate);
      window.removeEventListener("touchstart", activate);
      clearTimeout(timer);
    };
  }, []);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <LenisProvider>
            <BookingProvider>
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                <ScrollToTop />
                <Navbar />
                <Router />
                {showWhatsApp && <WhatsAppButton />}
              </WouterRouter>
            </BookingProvider>
          </LenisProvider>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
