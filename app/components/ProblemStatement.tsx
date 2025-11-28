"use client";

import { useLanguage } from "@/app/context/LanguageContext";
import { motion } from "framer-motion";
import CropIcon from "@/public/icons/wheat.png";
import WiltedLeaf from "@/public/icons/dead.png";
import TractorIcon from "@/public/icons/farmer.png";
import AlertIcon from "@/public/icons/error.png";
import StatsIcon from "@/public/icons/growth.png";

export default function ProblemStatement() {
  const { lang } = useLanguage();

  const content = {
    bn: {
      title: "সমস্যাটা কোথায়?",
      blocks: [
        { icon: CropIcon, text: "আমাদের দেশে কৃষকের সবচেয়ে বড় ক্ষতি হয় তখন, যখন ফসলের রোগ বা নষ্ট হওয়ার লক্ষণ ধরা পড়ে দেরিতে..." },
        { icon: WiltedLeaf, text: "আগেভাগে সতর্কতা পেলে কৃষক সহজেই ফসল বাঁচাতে পারে, কিন্তু এখনই কোনো নির্ভরযোগ্য সহজ ব্যবস্থা নেই।" },
        { icon: TractorIcon, text: "কৃষিকাজে সঠিক প্রযুক্তি ও নজরদারি ছাড়া ক্ষতি কমানো কঠিন।" },
        { icon: AlertIcon, text: "সতর্কবার্তা না থাকায় ফসলের ক্ষতি বৃদ্ধি পায়।" },
        { icon: StatsIcon, text: "বাংলাদেশে প্রতি বছর প্রায় ৩০% ফসল নষ্ট হয়।" },
      ],
    },
    en: {
      title: "What's the Problem?",
      blocks: [
        { icon: CropIcon, text: "Farmers lose the most money when crop disease or spoilage signs are detected too late..." },
        { icon: WiltedLeaf, text: "With early alerts, farmers can save crops easily, but currently there’s no reliable simple system." },
        { icon: TractorIcon, text: "Without proper farming tech and monitoring, reducing losses is difficult." },
        { icon: AlertIcon, text: "Lack of alerts increases crop losses." },
        { icon: StatsIcon, text: "In Bangladesh, about 30% of crops are lost each year." },
      ],
    },
  };

  const t = content[lang];

  return (
    <section className="px-6 py-16 md:py-24 bg-white">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-3xl md:text-4xl font-extrabold text-green-900 mb-10 text-center"
        >
          {t.title}
        </motion.h2>

        <div className="flex flex-col gap-6">
          {t.blocks.map((block, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.2, duration: 0.7 }}
              className="flex items-start gap-4"
            >
              <img src={block.icon.src} alt="icon" className="w-10 h-10 flex-shrink-0" />
              <p className="text-gray-700 text-base md:text-lg leading-relaxed font-bold">
                {block.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
