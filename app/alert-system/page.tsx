"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/context/LanguageContext";

interface CropBatch {
  id: string;
  crop_type: string;
  storage_district: string;
}

interface WeatherData {
  temp: number;
  humidity: number;
  condition: string;
}

type RiskLevel = "Low" | "Medium" | "High" | "Critical";

interface BatchItem {
  id: string;
  crop_type: string;
  district: string;
  weather: WeatherData | null;
  loadingAnalysis: boolean;
  risk?: RiskLevel;
  advice?: string;
}

interface AlertPayload {
  id: string;
  crop_type: string;
  district: string;
  weather: WeatherData;
  risk: RiskLevel;
  alert: string;
}

export default function AlertSystem() {
  const router = useRouter();
  const { lang } = useLanguage();
  const [items, setItems] = useState<BatchItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) router.push("/login");
    else loadData();
  }, [router]);

  async function loadData() {
    setLoading(true);
    try {
      const batchRes = await fetch("/api/farmer/crop-batches");
      const batchJson = await batchRes.json();
      let batches: CropBatch[] = batchJson.batches || [];
      // Take last 10 latest
      const limitedBatches = batches.slice(0, 10);

      const mappedItems = await Promise.all(
        limitedBatches.map(async (batch) => {
          const weather = await fetchWeather(batch.storage_district);
          return {
            id: batch.id,
            crop_type: batch.crop_type,
            district: batch.storage_district,
            weather,
            loadingAnalysis: false,
          };
        })
      );

      setItems(mappedItems);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchWeather(district: string): Promise<WeatherData | null> {
    try {
      const res = await fetch(`/api/weather/alert-weather?name=${encodeURIComponent(district)}`);
      const data = await res.json();
      if (!data?.current) return null;
      return {
        temp: data.current.temp,
        humidity: data.current.humidity,
        condition: data.current.condition,
      };
    } catch {
      return null;
    }
  }

  const handleAnalyze = async (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, loadingAnalysis: true } : item))
    );

    const item = items.find((i) => i.id === id);
    if (!item || !item.weather) {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, loadingAnalysis: false } : item))
      );
      return;
    }

    const risk = evaluateRisk(item.crop_type, item.weather);
    const advice = await generateAdvice(
      { id: item.id, crop_type: item.crop_type, storage_district: item.district },
      item.weather,
      risk
    );

    if (risk === "Critical") {
      simulateSMS({
        id: item.id,
        crop_type: item.crop_type,
        district: item.district,
        weather: item.weather,
        risk,
        alert: advice,
      });
    }

    setItems((prev) =>
      prev.map((current) =>
        current.id === id
          ? { ...current, loadingAnalysis: false, risk, advice }
          : current
      )
    );
  };

  function evaluateRisk(crop: string, weather: WeatherData): RiskLevel {
    if (weather.humidity > 85 && weather.condition === "Rain") return "Critical";
    if (weather.humidity > 80) return "High";
    if (weather.temp > 35) return "Medium";
    return "Low";
  }

  function riskCategory(risk: RiskLevel) {
    switch (risk) {
      case "Critical": return lang === "bn" ? "সঙ্কট" : "Critical";
      case "High": return lang === "bn" ? "উচ্চ" : "High";
      case "Medium": return lang === "bn" ? "মধ্যম" : "Medium";
      default: return lang === "bn" ? "নিরাপদ" : "No Risk";
    }
  }

  function riskColor(risk: RiskLevel) {
    switch (risk) {
      case "Critical": return "bg-red-600 text-white";
      case "High": return "bg-orange-500 text-white";
      case "Medium": return "bg-yellow-400 text-black";
      default: return "bg-green-500 text-white";
    }
  }

  async function generateAdvice(batch: CropBatch, weather: WeatherData, risk: RiskLevel): Promise<string> {
    const prompt = lang === "bn"
      ? `
আপনি একজন কৃষি বিশেষজ্ঞ AI।
ফসল: ${batch.crop_type}
জেলা: ${batch.storage_district}
আবহাওয়া:
- তাপমাত্রা: ${weather.temp}°C
- আর্দ্রতা: ${weather.humidity}%
- পরিস্থিতি: ${weather.condition}
ঝুঁকি স্তর: ${risk}
সংক্ষিপ্ত, সরাসরি, কার্যকরী পরামর্শ দিন। Critical হলে এখনই করণীয় লিখুন।`
      : `
You are an AI agriculture expert.
Crop: ${batch.crop_type}
District: ${batch.storage_district}
Weather:
- Temp: ${weather.temp}°C
- Humidity: ${weather.humidity}%
- Condition: ${weather.condition}
Risk level: ${risk}
Provide short, direct, actionable advice. Take immediate action if risk is Critical.`;

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        body: JSON.stringify({ prompt }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      return data.reply || (lang === "bn" ? "পরামর্শ পাওয়া যায়নি।" : "No advice available.");
    } catch {
      return lang === "bn" ? "AI পরামর্শ লোড করা যায়নি।" : "Failed to load AI advice.";
    }
  }

  function simulateSMS(payload: any) {
    console.warn(
      `%c📩 SMS ALERT [${riskCategory(payload.risk)}]: ${payload.alert}`,
      "color:red; font-weight:bold;"
    );
  }

  const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-sm p-6 relative animate-pulse border border-gray-200">
      <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="mt-6 h-10 bg-gray-200 rounded-lg w-full"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
            {lang === "bn" ? "কৃষি সতর্কতা সিস্টেম" : "Agricultural Alert System"}
          </h1>
          <p className="text-lg text-gray-500">
            {lang === "bn"
              ? "রিয়েল-টাইম আবহাওয়া বিশ্লেষণ এবং এআই-চালিত পরামর্শ"
              : "Real-time weather analysis and AI-driven recommendations"}
          </p>
        </header>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => <SkeletonCard key={idx} />)}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
            <p className="text-xl text-gray-400">
              {lang === "bn" ? "কোন তথ্য পাওয়া যায়নি" : "No batches found to analyze."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div
                key={item.id}
                className={`
                  relative bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden group
                  ${item.advice ? 'ring-2 ring-offset-2' : ''}
                  ${item.risk === 'Critical' ? 'ring-red-500' : item.risk === 'High' ? 'ring-orange-500' : item.risk === 'Medium' ? 'ring-yellow-400' : 'ring-green-500'}
                  ${!item.advice ? 'ring-0' : ''}
                `}
              >
                {/* Weather Indicator Gradient Top Bar */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-green-400 to-blue-500" />

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 group-hover:text-green-700 transition-colors">
                        {item.crop_type}
                      </h2>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <span className="inline-block w-4 h-4 bg-gray-100 rounded-full flex items-center justify-center text-xs">📍</span>
                        {item.district}
                      </p>
                    </div>
                    {item.weather && (
                      <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                        {item.weather.temp}°C
                      </div>
                    )}
                  </div>

                  {item.weather ? (
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 uppercase tracking-wider">{lang === "bn" ? "আর্দ্রতা" : "Humidity"}</span>
                        <span className="font-medium">{item.weather.humidity}%</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 uppercase tracking-wider">{lang === "bn" ? "অবস্থা" : "Condition"}</span>
                        <span className="font-medium">{item.weather.condition}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-red-400 italic bg-red-50 p-3 rounded-lg">
                      {lang === "bn" ? "আবহাওয়ার তথ্য অনুপলব্ধ" : "Weather data unavailable"}
                    </p>
                  )}

                  <div className="mt-6">
                    {!item.advice ? (
                      <button
                        onClick={() => handleAnalyze(item.id)}
                        disabled={item.loadingAnalysis || !item.weather}
                        className={`
                          w-full py-2.5 rounded-lg font-semibold text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1
                          ${item.loadingAnalysis ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 active:scale-[0.98]'}
                          ${!item.weather ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                      >
                        {item.loadingAnalysis ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {lang === "bn" ? "বিশ্লেষণ হচ্ছে..." : "Analyzing..."}
                          </span>
                        ) : (
                          <span>{lang === "bn" ? "বিশ্লেষণ করুন" : "Analyze Health & Risk"}</span>
                        )}
                      </button>
                    ) : (
                      <div className="animate-fade-in-up">
                        <div className={`mb-3 flex items-center gap-2 p-2 rounded-lg bg-opacity-10 ${item.risk === 'Critical' ? 'bg-red-500 text-red-700' : 'bg-green-500 text-green-700'}`}>
                          <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${riskColor(item.risk!)}`}>
                            {riskCategory(item.risk!)}
                          </span>
                          <span className="text-xs font-medium">
                            {lang === "bn" ? "শনাক্ত করা হয়েছে" : "Detected"}
                          </span>
                        </div>
                        <div className="prose prose-sm prose-green bg-gray-50 p-4 rounded-xl border border-gray-200">
                          <ReactMarkdown>{item.advice}</ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
