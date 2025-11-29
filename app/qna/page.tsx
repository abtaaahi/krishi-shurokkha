"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiArrowUp } from "react-icons/fi";
import { useLanguage } from "../context/LanguageContext";

export default function QnAPage() {
  const router = useRouter();
  const { lang } = useLanguage();

  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [error, setError] = useState("");
  const [showTopBtn, setShowTopBtn] = useState(false);

  const recognitionRef = useRef<any>(null);

  // Login check
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) router.push("/login");
  }, [router]);

  // Show scroll-to-top button
  useEffect(() => {
    const handleScroll = () => setShowTopBtn(window.scrollY > window.innerHeight);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // Speech recognition setup
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.lang = lang === "bn" ? "bn-BD" : "en-US";
        recognitionRef.current.interimResults = false;

        recognitionRef.current.onresult = (e: any) => {
          const spoken = e.results[0][0].transcript;
          setUserText(spoken);
          setListening(false);
          handleUserQuestion(spoken);
        };

        recognitionRef.current.onerror = () => {
          setListening(false);
          setError(
            lang === "bn"
              ? "ভয়েস শোনার সময় সমস্যা হয়েছে। আবার চেষ্টা করুন।"
              : "There was an issue with voice input. Try again."
          );
        };
      }
    }
  }, [lang]);

  const startListening = () => {
    if (!recognitionRef.current) {
      setError(
        lang === "bn"
          ? "আপনার ব্রাউজার ভয়েস সাপোর্ট করে না!"
          : "Your browser does not support voice input!"
      );
      return;
    }
    setListening(true);
    setReplyText("");
    setError("");
    recognitionRef.current.start();
  };

  // Send prompt to backend
  const handleUserQuestion = async (text: string) => {
    if (!text) return;

    setReplyText(lang === "bn" ? "উত্তর অপেক্ষা করুন..." : "Please wait...");

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text, lang }),
      });

      const raw = await response.text();
      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        data = { reply: raw };
      }

      setReplyText(data.reply);
    } catch {
      setReplyText(
        lang === "bn" ? "দুঃখিত, সার্ভারে সমস্যা হয়েছে।" : "Sorry, server error."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-4 md:p-6 flex flex-col items-center">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-2">
          {lang === "bn" ? "🎙️ কৃষকের বাংলা ভয়েস প্রশ্নোত্তর" : "🎙️ Farmer Voice Q&A"}
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          {lang === "bn"
            ? "আপনার প্রশ্ন জিজ্ঞেস করুন এবং তাৎক্ষণিক উত্তর পান"
            : "Ask your question and get instant answers"}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-xl text-center">
          ⚠️ {error}
        </div>
      )}

      {/* Voice Button */}
      <button
        onClick={startListening}
        disabled={listening}
        className={`${
          listening ? "bg-red-600 animate-pulse" : "bg-green-600 hover:bg-green-700"
        } disabled:opacity-50 text-white px-8 md:px-12 py-4 md:py-6 text-xl md:text-2xl rounded-2xl shadow-xl transition-all font-bold mb-6`}
      >
        {listening
          ? lang === "bn"
            ? "🎤 শুনছি..."
            : "🎤 Listening..."
          : lang === "bn"
          ? "🎤 প্রশ্ন করতে কথা বলুন"
          : "🎤 Speak to ask"}
      </button>

      {/* Text Input */}
      <div className="w-full max-w-md mx-auto mb-6 relative">
        <textarea
          value={userText}
          onChange={(e) => setUserText(e.target.value)}
          placeholder={lang === "bn" ? "আপনার প্রশ্ন লিখুন..." : "Type your question..."}
          rows={1}
          className="w-full border border-gray-300 rounded-2xl px-4 py-3 pr-20 text-gray-800 text-base focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all placeholder-gray-400 resize-none overflow-auto"
        />
        <button
          onClick={() => handleUserQuestion(userText)}
          className="absolute right-2 top-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full font-semibold shadow-md transition-colors"
        >
          {lang === "bn" ? "পাঠান" : "Send"}
        </button>
      </div>

      {/* Reply */}
      {replyText && (
        <div className="w-full max-w-xl bg-white p-6 rounded-xl shadow-lg border-2 border-green-200">
          <div className="prose prose-sm sm:prose lg:prose-lg text-gray-800">
            {replyText.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>
      )}

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
