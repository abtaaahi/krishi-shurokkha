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
      images: [
        { topic: "ফসলের রোগ", url: "https://i0.wp.com/geopard.tech/wp-content/uploads/2021/12/Crop-Diseases_-Types-Causes-and-Symptoms-3-min-1.jpg?resize=810%2C439&ssl=1", caption: "ফসলের রোগ" },
        { topic: "মরিচে পাতা", url: "https://treenewal.com/wp-content/uploads/2022/06/wilting_leaves-scaled-1.jpg", caption: "মরিচে পাতা" },
        { topic: "কৃষি প্রযুক্তি", url: "https://cacm.acm.org/wp-content/uploads/2024/07/071624.RSS_.Scalable-Technological-S.jpg", caption: "কৃষি প্রযুক্তি" },
        { topic: "আবহাওয়া সতর্কতা", url: "https://avaada.com/wp-content/uploads/a2.jpg", caption: "আবহাওয়া সতর্কতা" },
        { topic: "ফসলের ফলন তথ্য", url: "https://i0.wp.com/geopard.tech/wp-content/uploads/2022/06/63.3-min.jpg?resize=810%2C439&ssl=1", caption: "ফসলের ফলন তথ্য" },
        { topic: "পোকামাকড় সংক্রমণ", url: "https://www.protectedcultivation.com/uploads/blogs/83.jpg", caption: "পোকামাকড় সংক্রমণ" },
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
      images: [
        { topic: "Crop Disease", url: "https://i0.wp.com/geopard.tech/wp-content/uploads/2021/12/Crop-Diseases_-Types-Causes-and-Symptoms-3-min-1.jpg?resize=810%2C439&ssl=1", caption: "Crop Disease" },
        { topic: "Wilted Leaves", url: "https://treenewal.com/wp-content/uploads/2022/06/wilting_leaves-scaled-1.jpg", caption: "Wilted Leaves" },
        { topic: "Farming Technology", url: "https://cacm.acm.org/wp-content/uploads/2024/07/071624.RSS_.Scalable-Technological-S.jpg", caption: "Farming Technology" },
        { topic: "Weather Alerts", url: "https://avaada.com/wp-content/uploads/a2.jpg", caption: "Weather Alerts" },
        { topic: "Crop Yield Stats", url: "https://i0.wp.com/geopard.tech/wp-content/uploads/2022/06/63.3-min.jpg?resize=810%2C439&ssl=1", caption: "Crop Yield Stats" },
        { topic: "Pest Infestation", url: "https://www.protectedcultivation.com/uploads/blogs/83.jpg", caption: "Pest Infestation" },
      ],
    },
  };

  const t = content[lang];

  return (
    <section className="px-6 py-16 md:py-24 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-3xl md:text-4xl font-extrabold text-green-900 mb-10 text-center"
        >
          {t.title}
        </motion.h2>

        {/* Icon + text blocks */}
        <div className="flex flex-col gap-6 mb-16">
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

        {/* Image grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {t.images.map((img, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="overflow-hidden rounded-lg shadow-lg cursor-pointer bg-green-50"
            >
              <div className="h-48 w-full bg-gray-200">
                <img
                  src={img.url || "/placeholder.png"}
                  alt={img.topic}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 bg-green-50">
                <p className="text-center text-green-900 font-bold">
                  {img.caption}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
