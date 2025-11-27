import { NextResponse } from "next/server";
import upazilas from "@/public/data/upazilas.json";
import districts from "@/public/data/districts.json";

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY!;

// Get latitude and longitude from name (Bangla/English)
async function getLatLon(name: string) {
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
    name
  )},BD&limit=1&appid=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  if (!data || data.length === 0) return null;
  return { lat: data[0].lat, lon: data[0].lon };
}

// Get weather using lat/lon
async function getWeatherByCoords(lat: number, lon: number) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  return data;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const upazilaName = searchParams.get("upazila");

    if (!upazilaName)
      return NextResponse.json({ error: "উপজেলা প্রয়োজন" }, { status: 400 });

    const upazila = upazilas.upazilas.find(
      (u: any) => u.name.toLowerCase() === upazilaName.toLowerCase()
    );
    if (!upazila)
      return NextResponse.json({ error: "উপজেলা পাওয়া যায়নি" }, { status: 404 });

    let weather = null;
    let source = "upazila";

    // Try fetching weather by upazila
    const upazilaCoords = await getLatLon(upazila.name);
    if (upazilaCoords) {
      weather = await getWeatherByCoords(upazilaCoords.lat, upazilaCoords.lon);
    }

    // Fallback to district if upazila weather not available
    if (!weather) {
      const district = districts.districts.find((d: any) => d.id === upazila.district_id);
      if (!district)
        return NextResponse.json({ error: "জেলা পাওয়া যায়নি" }, { status: 404 });

      const districtCoords = await getLatLon(district.name);
      if (districtCoords) {
        weather = await getWeatherByCoords(districtCoords.lat, districtCoords.lon);
        source = "district";
      }
    }

    if (!weather)
      return NextResponse.json({ error: "আবহাওয়ার তথ্য নেই" }, { status: 500 });

    // Prepare current weather
    const current = {
      temp: weather.main.temp,
      humidity: weather.main.humidity,
      rain: weather.rain?.["1h"] || 0,
    };

    // Simple 5-day forecast simulation 
    const forecast = Array.from({ length: 5 }).map((_, i) => ({
      date: Math.floor(Date.now() / 1000) + i * 86400, // next 5 days
      temp: current.temp - Math.random() * 3 + 1,
      humidity: current.humidity,
      rain: current.rain,
    }));

    return NextResponse.json({
      source,
      location: upazila.bn_name,
      current,
      forecast,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "আবহাওয়া আনতে ব্যর্থ হয়েছে" },
      { status: 500 }
    );
  }
}
