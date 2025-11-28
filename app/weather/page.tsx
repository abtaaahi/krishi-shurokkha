"use client";

import { useState, useEffect } from "react";
import LocationSelector, { Upazila } from "../components/LocationSelector";
import useWeather from "../hooks/useWeather";
import WeatherForecast from "../components/WeatherForecast";
import { toBanglaNumber } from "../utils/banglaFormatter";
import Advisory from "../components/Advisory";
import { FiArrowUp } from "react-icons/fi";

export default function WeatherPage() {
  const [selectedUpazila, setSelectedUpazila] = useState<Upazila>();
  const { data, current, forecast, loading, error } = useWeather(selectedUpazila);

  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-100 to-yellow-100 p-4 relative">
      <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-yellow-50 p-8 md:p-12 rounded-3xl shadow-xl text-center max-w-4xl mx-auto mt-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-800 mb-4 drop-shadow-lg">
          আবহাওয়া তথ্য
        </h1>

        <p className="text-gray-800 text-base md:text-lg leading-relaxed md:leading-loose">
          আপনার উপজেলার নাম সঠিকভাবে লিখুন। এখানে আপনি বর্তমান আবহাওয়া জানতে পারবেন এবং সেই অনুযায়ী ফসলের কাজ করতে পারবেন।  
          এছাড়া, আগামী পাঁচ দিনের পূর্বাভাসও দেওয়া আছে, যাতে আপনি সময়মতো কাজের পরিকল্পনা করতে পারেন এবং ফসল সুরক্ষিত থাকে।  
        </p>
      </div>
        {/* Location Selector */}
        <div className="flex justify-center mb-6">
          <LocationSelector
            onSelect={setSelectedUpazila}
            className="w-full sm:w-96 px-4 py-2 rounded-lg shadow-lg border border-gray-300 focus-within:ring-2focus-within:ring-blue-400 focus-within:ring-opacity-50"
          />
        </div>

        {/* Loading & Error */}
        {loading && (
          <div className="mt-4 text-center text-gray-700 animate-pulse">লোড হচ্ছে...</div>
        )}
        {error && (
          <div className="mt-4 text-center text-red-600 font-semibold">{error}</div>
        )}

        {/* Current Weather Card */}
        {selectedUpazila && current && (
          <div className="bg-gradient-to-r from-blue-100 to-yellow-50 p-6 rounded-2xl shadow-xl text-center relative overflow-hidden mb-6">
            <h2 className="text-2xl font-bold text-blue-500 mb-4 drop-shadow">
              {selectedUpazila.bn_name} এর বর্তমান আবহাওয়া
            </h2>

            <div className="flex justify-center items-center gap-8 flex-wrap">
              <div className="flex items-center gap-2">
                <img src="/images/temp-icon.svg" alt="temp" className="w-8 h-8" />
                <span className="text-xl font-bold text-red-600">
                  {toBanglaNumber(current.temp)} ডিগ্রি সেলসিয়াস
                </span>
              </div>
              <div className="flex items-center gap-2">
                <img src="/images/humidity.svg" alt="humidity" className="w-8 h-8" />
                <span className="text-xl font-bold text-blue-500">
                  {toBanglaNumber(current.humidity)} শতাংশ
                </span>
              </div>
              <div className="flex items-center gap-2">
                <img src="/images/rain-icon.svg" alt="rain" className="w-8 h-8" />
                <span className="text-xl font-bold text-green-600">
                  {toBanglaNumber(current.rain)} শতাংশ
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Advisory
                temp={current.temp}
                humidity={current.humidity}
                rain={current.rain}
              />
            </div>
          </div>
        )}

        {/* 5-Day Forecast */}
        {forecast.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-center text-blue-500 mb-4 drop-shadow">
              {selectedUpazila?.bn_name} এর আগামী ৫ দিনের পূর্বাভাস
            </h2>
            <WeatherForecast daily={forecast} />
          </div>
        )}
      </div>

      {/* Floating "Go to Top" Button */}
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
