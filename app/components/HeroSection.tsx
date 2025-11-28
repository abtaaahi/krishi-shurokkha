"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useLanguage } from "@/app/context/LanguageContext";
import Lottie from "react-lottie-player";
import plantAnimation from "../../public/animations/plant.json";

export default function HeroSection() {
  const { lang, setLang } = useLanguage();
  const router = useRouter();

  const content = {
    bn: {
      title: "নষ্ট হওয়ার আগেই ফসল বাঁচান",
      subtitle:
        "বাংলাদেশে প্রতি বছর উৎপাদিত ফসলের ৩০% নষ্ট হয়। কৃষি সুরক্ষা আপনাকে আগেভাগে সতর্ক করে, ক্ষতি কমাতে সাহায্য করে।",
      cta: "এখনই শুরু করুন",
      micro: "শুধু ৩ ধাপে ফসল বাঁচান",
      stat: "বাংলাদেশে প্রতিদিন প্রায় ১,২০০ টন ফসল নষ্ট হয়",
      bnBtn: "বাংলা",
      enBtn: "English",
    },
    en: {
      title: "Protect Your Crops Before They Get Damaged",
      subtitle:
        "Every year, 30% of Bangladesh's crops are lost. Krishi Shurokkha alerts you early to reduce losses and save income.",
      cta: "Get Started",
      micro: "Save your crops in just 3 steps",
      stat: "In Bangladesh, about 1,200 tons of crops are lost daily",
      bnBtn: "Bangla",
      enBtn: "English",
    },
  };

  const t = content[lang];

  return (
    <section className="relative bg-gradient-to-b from-green-200 to-green-50 px-6 py-10 md:py-12 flex flex-col items-center text-center overflow-hidden">

      {/* Lottie Plant Animation */}
      <div className="w-full flex justify-center mb-6 relative z-10">
        <Lottie
          loop
          animationData={plantAnimation}
          play
          style={{ width: "250px", height: "250px" }}
        />
      </div>

      {/* Highlight Stat */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-white px-4 py-2 rounded-2xl shadow-lg mb-4 inline-block text-green-900 font-semibold"
      >
        {t.stat}
      </motion.div>

      {/* Title */}
      <motion.h1
        key={t.title}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="text-3xl md:text-5xl font-extrabold text-green-900 leading-tight mb-4"
      >
        {t.title}
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        key={t.subtitle}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="text-gray-800 text-base md:text-lg max-w-xl mb-4"
      >
        {t.subtitle}
      </motion.p>

      {/* Microcopy */}
      {/* <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.7 }}
        className="text-green-900 font-medium text-sm md:text-base mb-6"
      >
        {t.micro}
      </motion.p> */}

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.7 }}
      >
        <button
          onClick={() => router.push("/register")}
          className="bg-green-700 text-white px-10 py-3 rounded-xl shadow-md hover:bg-green-800 transition text-lg font-medium"
        >
          {t.cta}
        </button>
      </motion.div>
    </section>
  );
}
