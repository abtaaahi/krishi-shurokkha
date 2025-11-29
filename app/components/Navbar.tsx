"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/app/context/LanguageContext";

const ALL_MENU_LINKS = [
  { label: { bn: "ড্যাশবোর্ড", en: "Dashboard" }, href: "/farmer/dashboard", auth: true },
  { label: { bn: "প্রোফাইল", en: "Profile" }, href: "/farmer/profile", auth: true },
  { label: { bn: "আবহাওয়া", en: "Weather" }, href: "/weather", auth: null },
  { label: { bn: "ফসলের স্বাস্থ্য পরীক্ষা", en: "Crop Health Scan" }, href: "/crop-scanner", auth: null },
  { label: { bn: "ফসলের ব্যাচ রেজিস্টার", en: "Crop Batch Registration" }, href: "/farmer/crop-batches", auth: null },
  { label: { bn: "ফসল ঝুঁকি পূর্বাভাস", en: "Crop Risk Predict" }, href: "/farmer/crop-risk", auth: null },
  { label: { bn: "কৃষক অ্যাকাউন্ট তৈরি করুন", en: "Create New Account" }, href: "/register", auth: false },
  { label: { bn: "স্থানীয় ঝুঁকি মানচিত্র", en: "Local Risk Map" }, href: "/risk-map", auth: null },
  { label: { bn: "লগইন করুন", en: "Login" }, href: "/login", auth: false },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // null = not yet checked
  const { lang, setLang } = useLanguage();

  // Check localStorage for user after mount
  useEffect(() => {
    // Delay state update to avoid synchronous render setState
    const timer = setTimeout(() => {
      const user = localStorage.getItem("user");
      setIsLoggedIn(!!user);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  if (isLoggedIn === null) return null;

  // Filter menu based on auth
  const MENU_LINKS = ALL_MENU_LINKS.filter(
    (link) => isLoggedIn === null || link.auth === null || link.auth === isLoggedIn
  );

  const menuVariants = {
    hidden: { x: "100%" },
    visible: { x: 0 },
  };

  if (isLoggedIn === null) return null; // prevent hydration mismatch

  return (
    <nav className="bg-green-700 text-white relative z-50">
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link href="/">
              <Image src="/icon0.svg" alt="Logo" width={40} height={40} />
            </Link>
            <span className="font-bold text-lg">কৃষি সুরক্ষা</span>
          </div>

          {/* Desktop language toggle */}
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => setLang("bn")}
              className={`px-3 py-1 rounded ${
                lang === "bn" ? "bg-yellow-400 text-green-900" : "hover:bg-yellow-300"
              }`}
            >
              বাংলা
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1 rounded ${
                lang === "en" ? "bg-yellow-400 text-green-900" : "hover:bg-yellow-300"
              }`}
            >
              EN
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none focus:ring-2 focus:ring-white"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Horizontal line above menu */}
        <div className="hidden md:block border-t border-green-500" />

        {/* Desktop menu */}
        <div className="hidden md:flex flex-wrap gap-4 mt-2 justify-center">
          {MENU_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 rounded hover:bg-green-500 transition"
            >
              {link.label[lang]}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/30 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 w-64 h-full bg-green-600 z-50 shadow-lg flex flex-col p-6 space-y-4"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={menuVariants}
              transition={{ type: "tween", duration: 0.3 }}
            >
              {MENU_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 rounded hover:bg-green-500"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label[lang]}
                </Link>
              ))}

              {/* Mobile language toggle */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setLang("bn")}
                  className={`px-3 py-1 rounded ${
                    lang === "bn" ? "bg-yellow-400 text-green-900" : "hover:bg-yellow-300"
                  }`}
                >
                  বাংলা
                </button>
                <button
                  onClick={() => setLang("en")}
                  className={`px-3 py-1 rounded ${
                    lang === "en" ? "bg-yellow-400 text-green-900" : "hover:bg-yellow-300"
                  }`}
                >
                  EN
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
