"use client";

import { useState, useEffect } from "react";
import PestResult from "./PestResult";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";
import { useLanguage } from "../context/LanguageContext";
import { FiArrowUp } from "react-icons/fi";

export default function PestIdentifyPage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [result, setResult] = useState<{
    pestName: string;
    risk: string;
    actionPlan: string;
  } | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/login");
    }
  }, [router]);

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

  // Clear previous result when new image is selected
  const handleNewImage = (file: File | null, previewUrl: string) => {
    setImage(file);
    setPreview(previewUrl);
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!image) return;
    setLoading(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(",")[1];

      try {
        const res = await fetch("/api/pest-identify", {
          method: "POST",
          body: JSON.stringify({ imageBase64: base64 }),
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        const text: string = data.result || "";

        // Parse pestName and risk from API text
        const pestMatch = text.match(/১\. পোকা\/রোগের নাম:\s*(.+)/);
        const riskMatch = text.match(/২\. ঝুঁকির মাত্রা:\s*(.+)/);

        const pestName = pestMatch ? pestMatch[1].trim() : "";
        const risk = riskMatch ? riskMatch[1].trim() : "";

        setResult({ pestName, risk, actionPlan: text });
      } catch (err) {
        console.error(err);
        setResult({
          pestName: "",
          risk: "",
          actionPlan:
            lang === "bn"
              ? "কোনো ফলাফল পাওয়া যায়নি। অনুগ্রহ করে পরে চেষ্টা করুন।"
              : "No result found. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    reader.readAsDataURL(image);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-blue-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold text-black text-center mt-6">
        🐞 {lang === "bn" ? "পোকা শনাক্তকরণ" : "Pest Identification"}
      </h1>

      <p className="text-black mt-2 mb-4 text-center">
        {lang === "bn"
          ? "অনুগ্রহ করে JPEG বা PNG ফরম্যাটে ছবি আপলোড করুন"
          : "Please upload an image in JPEG or PNG format"}
      </p>

      <ImageUploader onFileSelect={handleNewImage} />

      {preview && (
        <img
          src={preview}
          alt="preview"
          className="w-full max-w-md rounded-lg mt-4 shadow-lg"
        />
      )}

      <button
        onClick={handleSubmit}
        className="w-full max-w-md bg-green-600 hover:bg-green-700 text-white font-bold p-3 rounded-lg mt-4 shadow-md"
      >
        {loading
          ? lang === "bn"
            ? "বিশ্লেষণ করা হচ্ছে..."
            : "Analyzing..."
          : lang === "bn"
          ? "শনাক্ত করুন"
          : "Identify"}
      </button>

      {result && <PestResult data={result} />}

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
