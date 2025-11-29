"use client";

import { useState, useRef } from "react";

type Props = {
  setImage: (f: File | null) => void;
  setPreview: (p: string) => void;
};

const MAX_SIZE_BYTES = 200 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/bmp"];

export default function ImageUploader({ setImage, setPreview }: Props) {
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleFile(file: File | null) {
    setError("");

    if (!file) {
      setImage(null);
      setPreview("");
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setError("চিত্রটির আকার ২০০MB এর চেয়ে বেশি।");
      setImage(null);
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("শুধুমাত্র JPG, JPEG, PNG, WEBP, BMP অনুমোদিত।");
      setImage(null);
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  return (
    <div className="mb-4">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        ছবি আপলোড করুন (JPG/PNG; সর্বোচ্চ ১০MB)
      </label>

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
          {error || "ফাইল টেনে আনুন বা এখানে ক্লিক করুন"}
        </p>
        <p className="text-sm text-gray-400">JPG, JPEG, PNG, WEBP, BMP</p>

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
