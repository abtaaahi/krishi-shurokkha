"use client";

import { toBanglaNumber } from "../utils/banglaFormatter";

interface HistoryItem {
  preview: string;
  label: string;
  confidence: number;
  time: string;
}

interface Props {
  history: HistoryItem[];
}

export default function ScanHistory({ history }: Props) {
  if (!history || history.length === 0) {
    return (
      <div className="mt-6 text-gray-600 text-center">
        কোনো পূর্ববর্তী স্ক্যান নেই।
      </div>
    );
  }

  const lastFive = history.slice(0, 5);

  return (
    <div className="mt-8 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-green-700 text-center">
        সর্বশেষ স্ক্যান
      </h2>

      <div className="space-y-4">
        {lastFive.map((h, i) => (
          <div
            key={i}
            className="bg-white/95 border border-green-100 rounded-lg shadow-md p-4 flex gap-4 items-center"
          >
            {h.preview && (
              <img
                src={h.preview}
                alt="scan"
                className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded"
              />
            )}

            <div className="flex-1">
              <p className="font-medium">
                ফলাফল:{" "}
                <span
                  className={
                    h.label.toLowerCase() === "fresh"
                      ? "text-black"
                      
                      : "text-black"
                  }
                >
                  {h.label.toLowerCase() === "fresh"
                    ? "তাজা"
                    : h.label.toLowerCase() === "rotten"
                    ? "পচা"
                    : h.label}
                </span>
              </p>

              <p className="font-medium">
                বিশ্বাসযোগ্যতা: {toBanglaNumber(h.confidence)} শতাংশ
              </p>

              <p className="text-sm text-gray-500">
                তারিখ:{" "}
                {new Date(h.time).toLocaleString("bn-BD", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
