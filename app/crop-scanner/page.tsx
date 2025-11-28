"use client";

import { useState, useEffect } from "react";
import ImageUploader from "../components/ImageUploader";
import ScanHistory from "../components/ScanHistory";
import { toBanglaNumber } from "../utils/banglaFormatter";

interface HistoryItem {
  preview: string;
  label: string;
  confidence: number;
  time: string;
}

export default function CropScannerPage() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // result should stay empty until scan happens
  const [result, setResult] = useState<string>("");
  const [confidence, setConfidence] = useState<string>("");

  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("crop_history");
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  async function handleScan() {
    if (!image) {
      setResult("কোনো ছবি নির্বাচন করা হয়নি।");
      setConfidence("");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", image);

      const res = await fetch("/api/crop/scan", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.error) {
        setResult(data.error);
        setConfidence("");
      } else {
        const label = data.label;
        const conf = Number(data.confidence || 0).toFixed(1);

        setResult(label);
        setConfidence(`${toBanglaNumber(Number(conf))} শতাংশ`);

        const reader = new FileReader();
        reader.onload = () => {
          const newEntry: HistoryItem = {
            preview: reader.result as string,
            label,
            confidence: Number(conf),
            time: new Date().toISOString(),
          };

          const updated = [newEntry, ...history].slice(0, 10);
          setHistory(updated);
          localStorage.setItem("crop_history", JSON.stringify(updated));
        };
        reader.readAsDataURL(image);
      }
    } catch {
      setResult("স্ক্যান করা সম্ভব হয়নি।");
      setConfidence("");
    }

    setLoading(false);
  }

  return (
    <div
      className="min-h-screen p-4 sm:p-6"
      style={{
        background: "linear-gradient(to bottom, #e3f8ff, #e6ffe6)",
      }}
    >
      <h1 className="text-3xl font-bold text-green-800 text-center mb-6 drop-shadow">
        ফসলের স্বাস্থ্য পরীক্ষা
      </h1>

      <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-xl p-6 max-w-md mx-auto border border-green-100">
        
        <ImageUploader
          setImage={(img) => {
            setImage(img);
            setResult("");
            setConfidence("");
          }}
          setPreview={setPreview}
        />

        {preview && (
          <div className="mt-4 flex justify-center">
            <img
              src={preview}
              alt="Uploaded"
              className="w-64 h-64 object-cover rounded-lg shadow-md"
            />
          </div>
        )}

        <button
          onClick={handleScan}
          disabled={loading}
          className="mt-4 w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition disabled:opacity-50"
        >
          {loading ? "স্ক্যান হচ্ছে..." : "স্ক্যান করুন"}
        </button>

        {result && (
          <div className="mt-4 text-center text-lg">
            <p className="font-medium">
              ফলাফল:{" "}
              <span
                className={
                  result.toLowerCase() === "fresh"
                    ? "text-green-700"
                    : "text-red-600"
                }
              >
                {result.toLowerCase() === "fresh" ? "তাজা" : result.toLowerCase() === "rotten" ? "পচা" : result}
              </span>
            </p>

            {confidence && (
              <p className="font-medium">
                নিশ্চয়তার হার:{" "}
                <span className="text-green-700">{confidence}</span>
              </p>
            )}
          </div>
        )}
      </div>

      <ScanHistory history={history} />
    </div>
  );
}
