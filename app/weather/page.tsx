"use client";

import { useState } from "react";

export default function WeatherPage() {
  const [upazila, setUpazila] = useState("");
  const [forecast, setForecast] = useState<any>(null);

  const fetchWeather = async () => {
    // TODO: call your weather API here
    console.log("Fetching weather for", upazila);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-8 py-16 font-sans">
      <h1 className="text-3xl font-bold text-text mb-6">হাইপার-লোকাল আবহাওয়া</h1>

      {/* Upazila selector */}
      <input
        type="text"
        placeholder="আপনার উপজেলা লিখুন"
        className="border border-text px-4 py-2 rounded mb-4 w-full max-w-sm"
        value={upazila}
        onChange={(e) => setUpazila(e.target.value)}
      />

      <button
        className="bg-primary text-white px-6 py-2 rounded hover:bg-green-600 transition-colors"
        onClick={fetchWeather}
      >
        আবহাওয়া দেখুন
      </button>

      {/* Weather forecast display */}
      {forecast && (
        <div className="mt-8 w-full max-w-md p-4 bg-white rounded shadow">
          {/* TODO: Render 5-day forecast */}
          <p>Forecast will appear here...</p>
        </div>
      )}
    </div>
  );
}
