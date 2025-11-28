"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowUp } from "react-icons/fi";
import { useLanguage } from "@/app/context/LanguageContext";

interface Forecast {
  temp: number;
  humidity: number;
  rain: number;
}

interface RiskBatch {
  crop_type: string;
  estimated_weight: number;
  harvest_date: string;
  storage_district: string;
  district_name_en?: string;
  district_name_bn?: string;
  etcl: number;
  risk_summary: string;
  forecast: Forecast[];
  summaryBn: string;
  summaryEn: string;
}

export default function CropRiskPage() {
  const { lang } = useLanguage()
  const [batches, setBatches] = useState<RiskBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const router = useRouter();

  // Convert numbers to Bangla
  function toBanglaNumber(num: number) {
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num
      .toString()
      .split("")
      .map((d) => (/\d/.test(d) ? banglaDigits[+d] : d))
      .join("");
  }

  // Fetch data offline-first
  useEffect(() => {
    async function fetchCropRisk() {
      try {
        setLoading(true);

        // 1. Try to load from localStorage first
        const cached = localStorage.getItem("cropRiskBatches");
        if (cached) {
          setBatches(JSON.parse(cached));
        }

        // 2. Then attempt API fetch if online
        if (navigator.onLine) {
          const res = await fetch("/api/farmer/crop-risk");
          const data = await res.json();

          if (!res.ok) {
            if (res.status === 401) router.push("/login");
            else throw new Error(data.error || (lang === "bn" ? "কিছু ভুল হয়েছে।" : "Something went wrong."));
            return;
          }

          setBatches(data.batches || []);
          localStorage.setItem("cropRiskBatches", JSON.stringify(data.batches));
        }
      } catch (err: any) {
        console.error(lang === "bn" ? "ফসল ঝুঁকি লোডিং ত্রুটি:" : "Crop risk loading error:", err.message || err);
      } finally {
        setLoading(false);
      }
    }

    fetchCropRisk();
  }, [router]);

  function getRiskClasses(risk_summary: string) {
    if (risk_summary.includes("উচ্চ ঝুঁকি")) {
      return "bg-red-100 border-l-4 border-red-600 text-red-800";
    } else if (risk_summary.includes("মধ্যম ঝুঁকি")) {
      return "bg-orange-100 border-l-4 border-orange-500 text-orange-800";
    } else if (risk_summary.includes("কম ঝুঁকি")) {
      return "bg-green-100 border-l-4 border-green-600 text-green-800";
    }
    return "bg-gray-100 border-l-4 border-gray-400 text-gray-800"; // fallback
  }

  // Scroll listener for "Go to Top" button
  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > window.innerHeight);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading)
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-4">
        <p className="text-center text-lg font-medium text-green-800 mb-4">
          {lang === "bn" ? "ফসল ঝুঁকি পূর্বাভাস লোড হচ্ছে…" : "Loading crop risk forecast…"}
        </p>

        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-yellow-50 border-l-4 border-green-600 p-4 rounded space-y-2"
          >
            <div className="h-6 w-1/3 bg-yellow-200 rounded"></div>
            <div className="h-4 w-1/2 bg-yellow-200 rounded"></div>
            <div className="h-4 w-full bg-yellow-200 rounded"></div>
            <div className="h-4 w-full bg-yellow-200 rounded"></div>
            <div className="h-24 w-full bg-yellow-200 rounded mt-2"></div>
          </div>
        ))}
      </div>
    );

  if (!batches.length)
    return <p className="text-center mt-10">{lang === "bn" ? "কোনো কার্যকর ফসল ব্যাচ পাওয়া যায়নি।" : "No active crop batches found."}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 relative">
      <h1 className="text-4xl font-bold text-center text-green-800 mb-6">
        {lang === "bn" ? "ফসল ঝুঁকি পূর্বাভাস" : "Crop Risk Forecast"}
      </h1>

      {batches.map((batch, idx) => (
        <div
          key={idx}
          className="bg-yellow-50 border-l-4 border-green-600 p-4 rounded shadow space-y-2"
        >
          <p className="font-semibold text-lg text-gray-800">
            {batch.crop_type} ({lang === "bn" ? toBanglaNumber(batch.estimated_weight) : batch.estimated_weight} {lang === "bn" ? "কেজি" : "kg"})
          </p>
          <p className="text-gray-700">
            {lang === "bn" ? "জেলা" : "District"}: {lang === "bn" ? (batch.district_name_bn || batch.storage_district) : (batch.district_name_en || batch.storage_district)}
          </p>
<div className={`p-3 rounded shadow-md font-semibold ${getRiskClasses(batch.riskCategory)}`}>
  <p>{lang === "bn" ? batch.summaryBn : batch.summaryEn}</p>
</div>


          {batch.forecast && batch.forecast.length > 0 && (
            <table className="w-full text-sm border border-gray-300 mt-2">
              <thead>
                <tr className="bg-green-100">
                  <th className="border px-2 py-1">{lang === "bn" ? "দিন" : "Day"}</th>
                  <th className="border px-2 py-1">{lang === "bn" ? "তাপমাত্রা (°C)" : "Temperature (°C)"}</th>
                  <th className="border px-2 py-1">{lang === "bn" ? "আর্দ্রতা (%)" : "Humidity (%)"}</th>
                  <th className="border px-2 py-1">{lang === "bn" ? "বৃষ্টি (mm)" : "Rain (mm)"}</th>
                </tr>
              </thead>
              <tbody>
                {batch.forecast.map((f, dayIdx) => (
                  <tr key={dayIdx} className="text-center">
                    <td className="border px-2 py-1">{lang === "bn" ? toBanglaNumber(dayIdx + 1) : dayIdx + 1}</td>
                    <td className="border px-2 py-1">{lang === "bn" ? toBanglaNumber(Math.round(f.temp)) : Math.round(f.temp)}°C</td>
                    <td className="border px-2 py-1">{lang === "bn" ? toBanglaNumber(f.humidity) : f.humidity}{lang === "bn" ? " শতাংশ" : "%"}</td>
                    <td className="border px-2 py-1">{lang === "bn" ? toBanglaNumber(f.rain) : f.rain} {lang === "bn" ? "মিমি" : "mm"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}

      {/* Floating Go to Top Button */}
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-all z-50"
        >
          <FiArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
