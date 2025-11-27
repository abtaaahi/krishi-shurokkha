"use client";

import { useState, useEffect } from "react";
import { Upazila } from "../components/LocationSelector";

interface ForecastItem {
  date: number;
  temp: number;
  humidity: number;
  rain: number;
}

interface WeatherResponse {
  source: string;
  location: string;
  current: {
    temp: number;
    humidity: number;
    rain: number;
  };
  forecast: ForecastItem[];
}

export default function useWeather(selectedUpazila?: Upazila) {
  const [data, setData] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedUpazila) return;

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/weather?upazila=${selectedUpazila.name}`);
        const json = await res.json();
        if (!res.ok) setError(json.error || "সার্ভার ত্রুটি");
        else setData(json);
      } catch (err: any) {
        setError(err.message);
      }
      setLoading(false);
    };

    fetchWeather();
  }, [selectedUpazila]);

  return {
    data,
    loading,
    error,
    current: data?.current,
    forecast: data?.forecast || [],
    location: data?.location,
    source: data?.source,
  };
}
