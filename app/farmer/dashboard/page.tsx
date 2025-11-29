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
    pestScanSection: {
      title: "Pest Scan",
      desc: "Scan leaf or crop images to detect harmful pests instantly.",
    },
    cropBatchesSection: {
      title: "Crop Batches",
      desc: "Register new crop batches, weight, harvest date, and storage location.",
    },
    cropRiskSection: {
      title: "Crop Risk Forecast",
      desc: "View risk forecasts based on temperature, humidity, and rainfall with daily alerts.",
    },
    localRiskMapSection: {
      title: "Local Risk Map",
      desc: "View real-time local risk zones based on weather and crop conditions.",
    },
    qnaSection: {
      title: "QnA",
      desc: "Ask questions and get answers from the AI assistant.",
    },
    alertSystemSection: {
      title: "Alert System",
      desc: "Receive smart alerts for weather, storage, and crop-specific risks.",
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
    pestScanSection: {
      title: "কীটপতঙ্গ স্ক্যান",
      desc: "পাতা বা ফসলের ছবি স্ক্যান করে ক্ষতিকারক পোকার উপস্থিতি শনাক্ত করুন।",
    },
    cropBatchesSection: {
      title: "ফসলের ব্যাচ",
      desc: "নতুন ফসলের ব্যাচ রেজিস্টার করুন, ওজন, হাভেস্ট তারিখ এবং স্টোরেজ অবস্থান উল্লেখ করুন। আপনার ফসলের ব্যবস্থাপনা সহজ করুন।",
    },
    cropRiskSection: {
      title: "ফসল ঝুঁকি পূর্বাভাস",
      desc: "আপনার ফসলের ঝুঁকি পূর্বাভাস দেখুন। তাপমাত্রা, আর্দ্রতা এবং বৃষ্টিপাত অনুযায়ী সতর্কতা এবং দৈনিক পরামর্শ পান।",
    },
    localRiskMapSection: {
      title: "স্থানীয় ঝুঁকি মানচিত্র",
      desc: "ফসল ও আবহাওয়া ভিত্তিক এলাকাভিত্তিক ঝুঁকি অঞ্চল দেখুন।",
    },
    qnaSection: {
      title: "প্রশ্নোত্তর",
      desc: "প্রশ্ন করুন এবং এআই কৃষি সহকারী থেকে উত্তর পান।",
    },
    alertSystemSection: {
      title: "সতর্কতা সিস্টেম",
      desc: "ফসল, আবহাওয়া ও অন্যান্য ঝুঁকির ভিত্তিতে স্মার্ট সতর্কতা পান।",
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
      color: "from-green-200 to-red-100",
    },
    {
      title: t.weatherSection.title,
      desc: t.weatherSection.desc,
      route: "/weather",
      icon: "/icons/rain.png",
      color: "from-purple-200 to-white-100",
    },
    {
      title: t.cropScanSection.title,
      desc: t.cropScanSection.desc,
      route: "/crop-scanner",
      icon: "/icons/sprout.png",
      color: "from-white-200 to-orange-100",
    },
    {
      title: t.cropBatchesSection.title,
      desc: t.cropBatchesSection.desc,
      route: "/farmer/crop-batches",
      icon: "/icons/wheat.png",
      color: "from-yellow-200 to-blue-100",
    },
    {
      title: t.cropRiskSection.title,
      desc: t.cropRiskSection.desc,
      route: "/farmer/crop-risk",
      icon: "/icons/error.png",
      color: "from-red-200 to-green-100",
    },
    {
      title: t.localRiskMapSection.title,
      desc: t.localRiskMapSection.desc,
      route: "/risk-map",
      icon: "/icons/placeholder.png",
      color: "from-purple-200 to-lavender-100",
    },
    {
      title: t.pestScanSection.title,
      desc: t.pestScanSection.desc,
      route: "/pest",
      icon: "/icons/insect.png",
      color: "from-pruple-100 to-blue-200",
    },
    {
      title: t.qnaSection.title,
      desc: t.qnaSection.desc,
      route: "/qna",
      icon: "/icons/question.png",
      color: "from-green-200 to-red-100",
    },
    {
      title: t.alertSystemSection.title,
      desc: t.alertSystemSection.desc,
      route: "/alert-system",
      icon: "/icons/alert.png",
      color: "from-black-200 to-teal-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-green-700 pt-6">
        {t.dashboardTitle}
      </h1>

      {/* Sections */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {sections.map((section) => (
          <div
            key={section.title}
            onClick={() => router.push(section.route)}
            className={`cursor-pointer p-6 rounded-xl shadow-lg transition-all flex flex-col items-center text-center bg-gradient-to-br ${section.color} hover:shadow-2xl`}
            style={{ minHeight: "260px" }}
          >
            {section.icon && (
              <img
                src={section.icon}
                alt={section.title}
                className="w-20 h-20 mb-4 object-contain"
              />
            )}
            <h2 className="text-xl md:text-2xl font-semibold mb-2">
              {section.title}
            </h2>
            <p className="text-gray-700 text-sm md:text-base break-words">
              {section.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
