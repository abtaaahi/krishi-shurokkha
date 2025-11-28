import { toBanglaNumber } from "../utils/banglaFormatter";
import Advisory from "./Advisory";

interface Props {
  day: {
    date: number;
    temp: number;
    humidity: number;
    rain: number;
  };
}

export default function WeatherCard({ day }: Props) {
  const date = new Date(day.date * 1000).toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const temp = parseFloat(day.temp.toFixed(1));
  const humidity = day.humidity;
  const rain = Math.round(day.rain);

  return (
    
    <div className="bg-white p-4 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 duration-300">
      <div className="text-lg font-bold mb-2 text-blue-700">{date}</div>

      <div className="flex items-center gap-2 mt-2">
        <img src="/images/temp-icon.svg" alt="temp" className="w-6 h-6" />
        <span className="font-semibold text-red-600">
          তাপমাত্রা: {toBanglaNumber(temp)} ডিগ্রি সেলসিয়াস
        </span>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <img src="/images/humidity.svg" alt="humidity" className="w-6 h-6" />
        <span className="font-semibold text-blue-500">
          আর্দ্রতা: {toBanglaNumber(humidity)} শতাংশ
        </span>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <img src="/images/rain-icon.svg" alt="rain" className="w-6 h-6" />
        <span className="font-semibold text-green-600">
          বৃষ্টির সম্ভাবনা: {toBanglaNumber(rain)} শতাংশ
        </span>
      </div>

      <div className="mt-3 w-full">
        <Advisory temp={temp} humidity={humidity} rain={rain} />
      </div>
    </div>
  );
}
