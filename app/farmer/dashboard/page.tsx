"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/context/LanguageContext";

interface Section {
  title: string;
  desc: string;
  route: string;
  icon?: string;
  color?: string;
}

const translations = {
  en: {
    dashboardTitle: "My Dashboard",
    loading: "Loading...",
    profileSection: {
      title: "Profile",
      desc: "View and edit your personal information, crop details, and contact info.",
    },
    weatherSection: {
      title: "Weather",
      desc: "Check current weather, temperature, rainfall, and wind in your area.",
    },
    cropScanSection: {
      title: "Crop Health Check",
      desc: "Upload crop images to detect diseases, pests, or spoilage risks using AI.",
    },
    cropBatchesSection: {
      title: "Crop Batches",
      desc: "Register new crop batches, weight, harvest date, and storage location.",
    },
    cropRiskSection: {
      title: "Crop Risk Forecast",
      desc: "View risk forecasts based on temperature, humidity, and rainfall with daily alerts.",
    },
    batchSummary: "Crop Batch Summary",
    cropType: "Crop Type",
    weight: "Weight",
    harvest: "Harvest",
    storage: "Storage",
  },
  bn: {
    dashboardTitle: "আমার ড্যাশবোর্ড",
    loading: "লোড হচ্ছে...",
    profileSection: {
      title: "প্রোফাইল",
      desc: "আপনার ব্যক্তিগত তথ্য, ফসলের বিবরণ এবং যোগাযোগের তথ্য দেখুন এবং প্রয়োজনে সহজেই সম্পাদনা করুন।",
    },
    weatherSection: {
      title: "আবহাওয়া",
      desc: "আপনার এলাকার বর্তমান আবহাওয়া, তাপমাত্রা, বৃষ্টি ও বাতাসের তথ্য দেখুন। সঠিক সময়ে ফসলের কাজ পরিকল্পনা করুন।",
    },
    cropScanSection: {
      title: "ফসলের স্বাস্থ্য পরীক্ষা",
      desc: "ফসলের ছবি আপলোড করুন। এআই বিশ্লেষণ দ্বারা ফসলের রোগ, পোকামাকড় বা নষ্ট হওয়ার ঝুঁকি শনাক্ত করুন। দ্রুত পদক্ষেপ নিন।",
    },
    cropBatchesSection: {
      title: "ফসলের ব্যাচ",
      desc: "নতুন ফসলের ব্যাচ রেজিস্টার করুন, ওজন, হাভেস্ট তারিখ এবং স্টোরেজ অবস্থান উল্লেখ করুন। আপনার ফসলের ব্যবস্থাপনা সহজ করুন।",
    },
    cropRiskSection: {
      title: "ফসল ঝুঁকি পূর্বাভাস",
      desc: "আপনার ফসলের ঝুঁকি পূর্বাভাস দেখুন। তাপমাত্রা, আর্দ্রতা এবং বৃষ্টিপাত অনুযায়ী সতর্কতা এবং দৈনিক পরামর্শ পান।",
    },
    batchSummary: "ফসলের ব্যাচ সারসংক্ষেপ",
    cropType: "ফসলের ধরণ",
    weight: "ওজন",
    harvest: "হাভেস্ট",
    storage: "স্টোরেজ",
  },
};

export default function FarmerDashboard({ profile, batches }: any) {
  const router = useRouter();
  const { lang } = useLanguage();
  const t = translations[lang];

  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(profile);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!profile && !storedUser) {
      router.push("/login");
      return;
    }
    setProfileData(profile || JSON.parse(storedUser || "{}"));
    setLoading(false);
  }, [profile, router]);

  useEffect(() => {
    setProfileData(profile);
    setLoading(false);
  }, [profile]);

  if (loading) return <p className="text-center mt-10 text-lg">{t.loading}</p>;

  const sections: Section[] = [
    { 
      title: t.profileSection.title, 
      desc: t.profileSection.desc, 
      route: "/farmer/profile", 
      icon: "/icons/farmer.png", 
      color: "from-green-200 to-green-100" 
    },
    { 
      title: t.weatherSection.title, 
      desc: t.weatherSection.desc, 
      route: "/weather", 
      icon: "/icons/rain.png", 
      color: "from-blue-200 to-blue-100" 
    },
    { 
      title: t.cropScanSection.title, 
      desc: t.cropScanSection.desc, 
      route: "/farmer/scan", 
      icon: "/icons/sprout.png", 
      color: "from-orange-200 to-orange-100" 
    },
    { 
      title: t.cropBatchesSection.title, 
      desc: t.cropBatchesSection.desc, 
      route: "/farmer/crop-batches", 
      icon: "/icons/wheat.png", 
      color: "from-yellow-200 to-yellow-100" 
    },
    { 
      title: t.cropRiskSection.title, 
      desc: t.cropRiskSection.desc, 
      route: "/farmer/crop-risk", 
      icon: "/icons/error.png", 
      color: "from-red-200 to-red-100" 
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-green-700 pt-6">
        {t.dashboardTitle}
      </h1>

      {/* Sections */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sections.map((section) => (
          <div
            key={section.title}
            onClick={() => router.push(section.route)}
            className={`cursor-pointer p-6 rounded-xl shadow-lg transition-all flex flex-col items-center text-center bg-gradient-to-br ${section.color} hover:shadow-2xl`}
            style={{ minHeight: "260px" }}
          >
            {section.icon && (
              <img src={section.icon} alt={section.title} className="w-20 h-20 mb-4 object-contain" />
            )}
            <h2 className="text-xl md:text-2xl font-semibold mb-2">{section.title}</h2>
            <p className="text-gray-700 text-sm md:text-base break-words">{section.desc}</p>
          </div>
        ))}
      </div>

      {/* Batch Summary */}
      {batches && batches.length > 0 && (
        <section className="mt-10 w-full px-2 md:px-6">
          <h2 className="text-2xl font-semibold mb-6 text-green-800 text-center md:text-left">
            {t.batchSummary}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {batches.map((batch: any) => (
              <div
                key={batch.id}
                className="p-5 bg-white shadow-lg rounded-xl border border-gray-200 flex flex-col gap-3 hover:shadow-2xl transition-all"
              >
                <div className="flex items-center gap-2">
                  <img src="/icons/crop.png" className="w-6 h-6" alt="Crop" />
                  <span><strong>{t.cropType}:</strong> {batch.crop_type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <img src="/icons/weight.png" className="w-6 h-6" alt="Weight" />
                  <span><strong>{t.weight}:</strong> {batch.estimated_weight} কেজি</span>
                </div>
                <div className="flex items-center gap-2">
                  <img src="/icons/harvest.png" className="w-6 h-6" alt="Harvest" />
                  <span><strong>{t.harvest}:</strong> {batch.harvest_date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <img src="/icons/storage.png" className="w-6 h-6" alt="Storage" />
                  <span><strong>{t.storage}:</strong> {batch.storage_division}, {batch.storage_district}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
