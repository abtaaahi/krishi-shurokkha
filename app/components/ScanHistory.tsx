"use client";

import { toBanglaNumber } from "../utils/banglaFormatter";
import { useLanguage } from "@/app/context/LanguageContext";

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
  const { lang } = useLanguage();

  const t = {
    en: {
      noHistory: "No previous scans.",
      latestScans: "Latest Scans",
      resultLabel: "Result:",
      fresh: "Fresh",
      rotten: "Rotten",
      confidenceLabel: "Confidence:",
      dateLabel: "Date:",
    },
    bn: {
      noHistory: "কোনো পূর্ববর্তী স্ক্যান নেই।",
      latestScans: "সর্বশেষ স্ক্যান",
      resultLabel: "ফলাফল:",
      fresh: "তাজা",
      rotten: "পচা",
      confidenceLabel: "নিশ্চয়তার হার:",
      dateLabel: "তারিখ:",
    },
  }[lang];

  if (!history || history.length === 0) {
    return <div className="mt-6 text-gray-600 text-center">{t.noHistory}</div>;
  }

  const lastFive = history.slice(0, 5);

  return (
    <div className="mt-8 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-green-700 text-center">{t.latestScans}</h2>

      <div className="space-y-4">
        {lastFive.map((h, i) => {
          // Translate label only for display
          const labelText =
            h.label.toLowerCase() === "fresh"
              ? t.fresh
              : h.label.toLowerCase() === "rotten"
              ? t.rotten
              : h.label;

          return (
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
                  {t.resultLabel} <span>{labelText}</span>
                </p>

                <p className="font-medium">
                  {t.confidenceLabel} {lang === "bn" ? toBanglaNumber(h.confidence) : h.confidence}%
                </p>

                <p className="text-sm text-gray-500">
                  {t.dateLabel}{" "}
                  {new Date(h.time).toLocaleString(lang === "bn" ? "bn-BD" : "en-US", {
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
          );
        })}
      </div>
    </div>
  );
}
