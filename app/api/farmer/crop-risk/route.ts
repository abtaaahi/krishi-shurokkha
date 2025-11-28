import { NextResponse } from "next/server";
import { createServer } from "@/lib/supabase-server";
import districts from "@/public/data/districts.json";

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY!;

// Get lat/lon
async function getLatLon(name: string) {
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(name)},BD&limit=1&appid=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  if (!data || data.length === 0) return null;
  return { lat: data[0].lat, lon: data[0].lon };
}

// Get 5-day forecast (3-hour intervals)
async function getForecast(lat: number, lon: number) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  return data;
}

// New ETCL calculation based on full 5-day forecast
function calculateETCL(forecast: { temp: number; humidity: number; rain: number }[]) {
  let etcl = 72; // start with maximum safe ETCL
  let alerts: string[] = [];

  forecast.forEach((f, idx) => {
    if (f.temp > 30 && f.humidity > 80) {
      etcl -= 8; // severe conditions reduce ETCL faster
      alerts.push(`Day ${idx + 1}: High temperature (${f.temp}°C) and humidity (${f.humidity}%)`);
    } else if (f.temp > 30 && f.humidity > 70) {
      etcl -= 6; // moderate risk
      alerts.push(`Day ${idx + 1}: Moderate high temp (${f.temp}°C) and humidity (${f.humidity}%)`);
    }

    if (f.rain > 0) {
      etcl -= 4; // rain reduces ETCL
      alerts.push(`Day ${idx + 1}: Rain expected (${f.rain} mm)`);
    }
  });

  // Ensure ETCL doesn't go below a minimum threshold
  if (etcl < 24) etcl = 24;

  // Determine risk category
  let riskCategoryBn = "";
  let riskCategoryEn = "";
  let adviceBn = "";
  let adviceEn = "";

  if (etcl <= 48) {
    riskCategoryBn = "উচ্চ ঝুঁকি"; 
    riskCategoryEn = "High Risk";
    adviceBn = "উচ্চ আর্দ্রতা ও তাপমাত্রা। ফসল দ্রুত পরিদর্শন করুন ও প্রয়োজনে হাওয়া চলাচল নিশ্চিত করুন।";
    adviceEn = "High humidity and temperature. Inspect crops frequently and ensure proper aeration.";
  } else if (etcl <= 60) {
    riskCategoryBn = "মধ্যম ঝুঁকি"; 
    riskCategoryEn = "Medium Risk";
    adviceBn = "আংশিক ঝুঁকি। নিয়মিত ফসল পর্যবেক্ষণ চালিয়ে যান।";
    adviceEn = "Moderate risk. Maintain regular crop monitoring.";
  } else {
    riskCategoryBn = "কম ঝুঁকি"; 
    riskCategoryEn = "Low Risk";
    adviceBn = "আবহাওয়া স্থিতিশীল। নিয়মিত ফসল পর্যবেক্ষণ চালিয়ে যান।";
    adviceEn = "Weather conditions are stable. Maintain routine crop monitoring.";
  }

  // const summary = `${riskCategoryBn} (${riskCategoryEn}) ETCL: ${etcl} ঘণ্টা.\n${adviceBn}\n${adviceEn}${
  //   alerts.length ? "\nForecast alerts: " + alerts.join("; ") : ""
  // }`;

  const summaryBn = `${riskCategoryBn} ETCL: ${etcl} ঘণ্টা.\n${adviceBn}`;
  const summaryEn = `${riskCategoryEn} ETCL: ${etcl} Hour.\n${adviceEn}`;

  return { etcl, riskCategory: riskCategoryBn, summaryBn, summaryEn };
}

export async function GET(req: Request) {
  try {
    const supabase = await createServer();
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) return NextResponse.json({ error: "লগইন করুন" }, { status: 401 });

    const { data: batches } = await supabase
      .from("crop_batches")
      .select("*")
      .eq("farmer_id", user.id)
      .eq("status", "active");

    if (!batches || batches.length === 0)
      return NextResponse.json({ batches: [], message: "কোনো কার্যকর ফসল ব্যাচ নেই।" });

    const summaries = await Promise.all(
      batches.map(async (batch) => {
        const district = districts.districts.find(
          (d: any) =>
            d.bn_name === batch.storage_district ||
            d.name.toLowerCase() === batch.storage_district.toLowerCase()
        );

        let forecastData = null;
        if (district) {
          const coords = await getLatLon(district.name);
          if (coords) forecastData = await getForecast(coords.lat, coords.lon);
        }

        // Prepare 5-day forecast
        let forecast: { temp: number; humidity: number; rain: number }[] = [];
        if (forecastData?.list) {
          forecast = Array.from({ length: 5 }).map((_, i) => {
            const item = forecastData.list[i * 8]; // approx daily
            return {
              temp: item.main.temp,
              humidity: item.main.humidity,
              rain: item.rain?.["3h"] || 0,
            };
          });
        } else {
          forecast = Array.from({ length: 5 }).map(() => ({
            temp: 32,
            humidity: 75,
            rain: 0,
          }));
        }

        // Calculate ETCL and actionable summary
        const { etcl, riskCategory, summaryBn, summaryEn } = calculateETCL(forecast);

        return {
          crop_type: batch.crop_type,
          estimated_weight: batch.estimated_weight,
          harvest_date: batch.harvest_date,
          storage_district: batch.storage_district,
          district_name_en: district?.name || batch.storage_district,
          district_name_bn: district?.bn_name || batch.storage_district,
          etcl,
          riskCategory,
          forecast,
          summaryBn,
          summaryEn,
        };
      })
    );

    return NextResponse.json({ batches: summaries });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "কৃষক ফসল ঝুঁকি আনতে ব্যর্থ হয়েছে।" }, { status: 500 });
  }
}
