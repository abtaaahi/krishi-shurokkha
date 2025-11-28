"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

import { LanguageProvider } from "./context/LanguageContext";
import RouteChangeListener from "./RouteChangeListener";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  const handleRouteChange = () => {
    setLoading(true);
  };

  useEffect(() => {
    if (!loading) return;
    const timeout = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(timeout);
  }, [loading]);

  return (
    <>
      {/* Listen for route changes */}
      <RouteChangeListener onChange={handleRouteChange} />

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-300 border-t-gray-800" />
        </div>
      )}

      <LanguageProvider>
        {/* Navbar */}
        <Navbar />

        {/* Page content with animation */}
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="min-h-[calc(100vh-128px)]" // ensures footer sticks to bottom
          >
            {children}
          </motion.main>
        </AnimatePresence>

        {/* Footer */}
        <Footer />
      </LanguageProvider>
    </>
  );
}
