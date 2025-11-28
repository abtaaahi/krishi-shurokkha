"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/context/LanguageContext";
import SproutIcon from "@/public/icons/sprout.png";
import SignIcon from "@/public/icons/sign.png";
import GardeningIcon from "@/public/icons/gardening.png";
import StickleIcon from "@/public/icons/sickle.png";

export default function SolutionMetaphor() {
  const { lang } = useLanguage();
  const router = useRouter();

  const content = {
    bn: {
      title: "কৃষি সুরক্ষা কিভাবে কাজ করে",
      steps: [
        { icon: SproutIcon, label: "ডেটা সংগ্রহ\n(ছবি / তথ্য)" },
        { icon: SignIcon, label: "সমস্যা শনাক্ত\n(এআই বিশ্লেষণ)" },
        { icon: GardeningIcon, label: "তাৎক্ষণিক পরামর্শ" },
        { icon: StickleIcon, label: "বাঁচানো ফসল\nও আয় বৃদ্ধি" },
      ],
      cta: "এখন রেজিস্টার করুন",
    },
    en: {
      title: "How Krishi Shurokkha Works",
      steps: [
        { icon: SproutIcon, label: "Data Input\n(Photo / Details)" },
        { icon: SignIcon, label: "Issue Detection\n(AI Analysis)" },
        { icon: GardeningIcon, label: "Instant Action Tips" },
        { icon: StickleIcon, label: "Saved Crops\nHigher Income" },
      ],
      cta: "Register Now",
    },
  };

  const t = content[lang];

  return (
    <section className="px-6 py-16 bg-green-50 rounded-2xl mx-4 md:mx-16 mt-12">
      {/* Title */}
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="text-2xl md:text-3xl font-extrabold mb-12 text-center text-green-900"
      >
        {t.title}
      </motion.h2>

      {/* Workflow Path */}
      <div className="relative flex flex-col md:flex-row justify-between items-center md:space-x-6 space-y-10 md:space-y-0">
        {/* Connecting Line (Desktop Only) */}
        <div className="hidden md:block absolute top-12 left-0 right-0 h-1 bg-green-300 mx-10" />

        {t.steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center relative z-10"
          >
            {/* Icon Circle */}
            <div className="w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center mb-3">
              <img src={step.icon.src} alt={`step-${index}`} className="w-12 h-12" />
            </div>

            {/* Step Label */}
            <span className="font-semibold text-gray-800 whitespace-pre-line leading-snug">
              {step.label}
            </span>

            {/* Dot Connector (Mobile) */}
            {index < t.steps.length - 1 && (
              <div className="md:hidden mt-4 w-1 h-10 bg-green-300 rounded-full" />
            )}
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        viewport={{ once: true }}
        className="mt-14 text-center mb-20"
      >
        <button 
          onClick={() => router.push("/register")}
          className="bg-green-600 text-white px-10 py-3 rounded-xl shadow-lg hover:bg-green-700 transition text-lg font-medium"
        >
          {t.cta}
        </button>
      </motion.div>
    </section>
  );
}
