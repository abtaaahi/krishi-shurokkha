import { NextResponse } from "next/server";

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY!;

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

async function getWeather(lat: number, lon: number) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) return null;

  return await res.json();
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const districtName = searchParams.get("name");

    if (!districtName)
      return NextResponse.json({ error: "জেলার নাম প্রয়োজন" }, { status: 400 });

    const coords = await getLatLon(districtName);
    if (!coords)
      return NextResponse.json({ error: "জেলার অবস্থান পাওয়া যায়নি" }, { status: 500 });

    const weather = await getWeather(coords.lat, coords.lon);
    if (!weather)
      return NextResponse.json({ error: "আবহাওয়া তথ্য পাওয়া যায়নি" }, { status: 500 });

    const current = {
      temp: weather.main.temp,
      humidity: weather.main.humidity,
      condition: weather.weather[0].main,
      rain: weather.rain?.["1h"] || 0,
    };

    return NextResponse.json({
      district: districtName,
      current,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "সার্ভার ত্রুটি" }, { status: 500 });
  }
}
