"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiArrowUp } from "react-icons/fi";
import { useLanguage } from "../context/LanguageContext";
import ReactMarkdown from "react-markdown";

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

    // Construct a strict prompt based on language
    const restrictedPrompt = lang === "bn"
      ? `আপনি একজন কৃষি বিশেষজ্ঞ। আপনি শুধুমাত্র কৃষি, আবহাওয়া, ফসলের স্বাস্থ্য, ফসলের বিবরণ এবং কৃষিকাজ সম্পর্কিত প্রশ্নের উত্তর দেবেন। যদি প্রশ্নটি এই বিষয়গুলোর বাইরে হয়, তবে বিনয়ের সাথে বলুন যে আপনি শুধুমাত্র কৃষি সম্পর্কিত বিষয়ে সাহায্য করতে পারেন।
      
      প্রশ্ন: ${text}`
      : `You are an agriculture expert. You strictly only answer questions related to farming, agriculture, weather, crop health, and crop details. If the question is not related to these topics, politely decline and state that you can only assist with agriculture-related queries.
      
      Question: ${text}`;

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: restrictedPrompt }),
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
        className={`${listening ? "bg-red-600 animate-pulse" : "bg-green-600 hover:bg-green-700"
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

      {/* Text Input Area */}
      <div className="w-full max-w-3xl mx-auto mb-8 relative bg-white rounded-3xl shadow-lg border border-gray-100 p-2 focus-within:ring-2 focus-within:ring-green-400 focus-within:border-green-400 transition-all duration-300">
        <textarea
          value={userText}
          onChange={(e) => setUserText(e.target.value)}
          placeholder={lang === "bn" ? "আপনার কৃষি বিষয়ক বিস্তারিত প্রশ্ন এখানে লিখুন..." : "Type your detailed agriculture question here..."}
          className="w-full min-h-[120px] max-h-[300px] bg-transparent border-none outline-none focus:outline-none focus:ring-0 p-4 text-gray-700 text-lg placeholder-gray-400 resize-y rounded-xl"
          style={{ scrollbarWidth: "thin" }}
        />

        <div className="flex justify-between items-center px-2 pb-2 mt-2">
          <span className="text-xs text-gray-400 ml-2">
            {userText.length} {lang === "bn" ? "অক্ষর" : "chars"}
          </span>
          <button
            onClick={() => handleUserQuestion(userText)}
            disabled={!userText.trim() || replyText.includes("wait") || replyText.includes("অপেক্ষা")}
            className={`
                px-8 py-2.5 rounded-xl font-bold text-white shadow-md transition-all 
                ${!userText.trim() ? "bg-gray-300 cursor-not-allowed" : "bg-gradient-to-r from-green-600 to-green-500 hover:scale-105 active:scale-95"}
              `}
          >
            {lang === "bn" ? "পাঠান 🚀" : "Send 🚀"}
          </button>
        </div>
      </div>

      {/* Reply Section */}
      {replyText && (
        <div className="w-full max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-green-100 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-3">
            <div className="bg-green-100 p-2 rounded-full">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-lg font-bold text-green-800">
              {lang === "bn" ? "কৃষি বিশেষজ্ঞের উত্তর:" : "Expert Answer:"}
            </h3>
          </div>
          <div className="prose prose-lg text-gray-700 leading-relaxed max-w-none">
            <ReactMarkdown>{replyText}</ReactMarkdown>
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
