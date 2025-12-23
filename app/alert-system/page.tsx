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

interface AlertPayload {
  id: string;
  crop_type: string;
  district: string;
  weather: WeatherData;
  risk: "Low" | "Medium" | "High" | "Critical";
  alert: string;
}

export default function AlertSystem() {
  const router = useRouter();
  const { lang } = useLanguage();
  const [alerts, setAlerts] = useState<AlertPayload[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) router.push("/login");
    else loadAlerts();
  }, [router]);

  async function loadAlerts() {
    setLoading(true);
    try {
      const batchRes = await fetch("/api/farmer/crop-batches");
      const batchJson = await batchRes.json();
      const batches: CropBatch[] = batchJson.batches || [];
      const limitedBatches = batches.slice(0, 3);

      const finalAlerts: AlertPayload[] = [];

      for (const batch of limitedBatches) {
        const weather = await fetchWeather(batch.storage_district);
        if (!weather) continue;

        const risk = evaluateRisk(batch.crop_type, weather);
        const alertText = await generateAdvice(batch, weather, risk);

        const payload: AlertPayload = {
          id: batch.id,
          crop_type: batch.crop_type,
          district: batch.storage_district,
          weather,
          risk,
          alert: alertText,
        };

        if (risk === "Critical") simulateSMS(payload);

        finalAlerts.push(payload);
      }

      setAlerts(finalAlerts);
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

  function evaluateRisk(crop: string, weather: WeatherData): AlertPayload["risk"] {
    if (weather.humidity > 85 && weather.condition === "Rain") return "Critical";
    if (weather.humidity > 80) return "High";
    if (weather.temp > 35) return "Medium";
    return "Low";
  }

  function riskCategory(risk: AlertPayload["risk"]) {
    switch (risk) {
      case "Critical": return lang === "bn" ? "সঙ্কট" : "Critical";
      case "High": return lang === "bn" ? "উচ্চ" : "High";
      case "Medium": return lang === "bn" ? "মধ্যম" : "Medium";
      default: return lang === "bn" ? "নিরাপদ" : "No Risk";
    }
  }

  function riskColor(risk: AlertPayload["risk"]) {
    switch (risk) {
      case "Critical": return "bg-red-600 text-white";
      case "High": return "bg-orange-500 text-white";
      case "Medium": return "bg-yellow-400 text-black";
      default: return "bg-green-500 text-white";
    }
  }

  async function generateAdvice(batch: CropBatch, weather: WeatherData, risk: AlertPayload["risk"]): Promise<string> {
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

  function simulateSMS(payload: AlertPayload) {
    console.warn(
      `%c📩 SMS ALERT [${riskCategory(payload.risk)}]: ${payload.alert}`,
      "color:red; font-weight:bold;"
    );
  }

  const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-md p-5 relative animate-pulse border-l-8 border-gray-300">
      <div className="absolute top-0 left-0 h-full w-2 rounded-l-xl bg-gray-300" />
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-2/3 mb-1"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-1"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6 mb-1"></div>
      <div className="h-4 bg-gray-300 rounded w-full mt-3"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-800">
        🌾 {lang === "bn" ? "কৃষি সতর্কতা সিস্টেম" : "Agriculture Alert System"}
      </h1>

      {loading && (
        <div>
          <p className="text-center text-gray-600 mb-4 font-medium">
            {lang === "bn" ? "লোড হচ্ছে..." : "Loading..."}
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, idx) => <SkeletonCard key={idx} />)}
          </div>
        </div>
      )}

      {!loading && alerts.length === 0 && (
        <p className="text-center text-gray-600">
          {lang === "bn" ? "কোনও ব্যাচ পাওয়া যায়নি।" : "No batches found."}
        </p>
      )}

      {!loading && alerts.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {alerts.map((a) => (
            <div key={a.id} className="bg-white rounded-xl shadow-md p-5 relative border-l-8 border-gray-300">
              <div className={`absolute top-0 left-0 h-full w-2 rounded-l-xl ${riskColor(a.risk)}`} />
              <h2 className="text-xl font-semibold mb-2">{a.crop_type}</h2>
              <p className="mb-1"><strong>{lang === "bn" ? "জেলা" : "District"}:</strong> {a.district}</p>
              <p className="mb-1">🌡️ <strong>{lang === "bn" ? "তাপমাত্রা" : "Temp"}:</strong> {a.weather.temp}°C</p>
              <p className="mb-1">💧 <strong>{lang === "bn" ? "আর্দ্রতা" : "Humidity"}:</strong> {a.weather.humidity}%</p>
              <p className="mb-1">☀️ <strong>{lang === "bn" ? "আবহাওয়া" : "Condition"}:</strong> {a.weather.condition}</p>
              <p className={`mt-2 font-bold px-2 py-1 rounded ${riskColor(a.risk)}`}>
                {lang === "bn" ? "ঝুঁকি" : "Risk"}: {riskCategory(a.risk)}
              </p>
              <div className="mt-3 p-3 bg-gray-100 rounded shadow-sm text-gray-800">
                <ReactMarkdown>{`🔔 ${a.alert}`}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
