"use client";

import { useState, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";

type Props = {
  onFileSelect: (file: File | null, previewUrl: string) => void;
};

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/bmp"];

export default function ImageUploader({ onFileSelect }: Props) {
  const { lang } = useLanguage();
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleFile(file: File | null) {
    setError("");

    if (!file) {
      onFileSelect(null, "");
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setError(
        lang === "bn"
          ? "চিত্রটির আকার ১০MB এর চেয়ে বেশি।"
          : "File size exceeds 10MB."
      );
      onFileSelect(null, "");
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError(
        lang === "bn"
          ? "শুধুমাত্র JPG, JPEG, PNG, WEBP, BMP অনুমোদিত।"
          : "Only JPG, JPEG, PNG, WEBP, BMP are allowed."
      );
      onFileSelect(null, "");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    onFileSelect(file, previewUrl);
  }

  return (
    <div className="mb-4 w-full max-w-md">
      <div
        className={`border-2 rounded-xl border-dashed p-6 text-center cursor-pointer bg-white shadow-sm transition ${
          dragActive ? "border-green-500 bg-green-50" : "border-gray-300"
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFile(e.dataTransfer.files[0]);
        }}
      >
        <p className={`text-gray-700 ${error ? "text-red-600" : ""}`}>
          {error ||
            (lang === "bn"
              ? "ফাইল টেনে আনুন বা এখানে ক্লিক করুন"
              : "Drag & drop a file or click here")}
        </p>
        <p className="text-sm text-gray-400">
          {lang === "bn"
            ? "JPEG / PNG (সর্বোচ্চ ১০MB)"
            : "JPEG / PNG (Max 10MB)"}
        </p>

        <input
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.bmp,image/*"
          onChange={(e) => handleFile(e.target.files?.[0] || null)}
          ref={inputRef}
          className="hidden"
        />
      </div>
    </div>
  );
}
