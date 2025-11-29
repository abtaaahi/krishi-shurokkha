"use client";

import React, { useState, useRef } from "react";

export default function QnAPage() {
  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [activeSection, setActiveSection] = useState("");
  const [error, setError] = useState("");

  // Refs for each section
  const weatherRef = useRef(null);
  const cropRef = useRef(null);
  const storageRef = useRef(null);
  const harvestRef = useRef(null);
  const riskRef = useRef(null);
  const pestRef = useRef(null);
  const fertiliserRef = useRef(null);
  const irrigationRef = useRef(null);
  const marketRef = useRef(null);
  const seedRef = useRef(null);

  let recognition: any;

  // Speech recognition initialization
  if (typeof window !== "undefined") {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognition.lang = "bn-BD";
      recognition.interimResults = false;

      recognition.onresult = (e: any) => {
        const spoken = e.results[0][0].transcript;
        setUserText(spoken);
        processQuestion(spoken);
        setListening(false);
      };
    }
  }

  // Scroll to section
  const scrollToSection = (ref: any, sectionName: string) => {
    setActiveSection(sectionName);
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  // Accent friendly checking
  const softMatch = (text: string, variants: string[]) => {
    return variants.some((v) => text.includes(v));
  };

  // MAIN QNA LOGIC
  const processQuestion = (text: string) => {
    let reply = "";
    const normalized = text.toLowerCase();

    // WEATHER SECTION
    if (
      softMatch(normalized, [
        "আবহাওয়া",
        "আবহাওয়া",
        "আবহাউয়া",
        "আবহাউन्या",
        "আভাওয়া",
        "আবাওয়া",
        "আবহন",
        "বৃষ্টি",
        "রোদ",
        "গরম"
      ])
    ) {
      reply = "আজ বৃষ্টি হচ্ছে। ধান অবশ্যই ঢেকে রাখুন।";
      setReplyText(reply);
      speakBangla(reply);
      scrollToSection(weatherRef, "weather");
      return;
    }

    // CROP STATUS SECTION
    if (
      softMatch(normalized, [
        "ধানের অবস্থা",
        "ধানের",
        "ফসল",
        "ফসলো",
        "ধানডা",
        "ধান অবস্থা",
        "ফসলের অবস্থা"
      ])
    ) {
      reply = "আপনার ধানের আর্দ্রতা মাঝারি। ধান শুকনো জায়গায় রাখলে ভালো থাকবে।";
      setReplyText(reply);
      speakBangla(reply);
      scrollToSection(cropRef, "crop");
      return;
    }

    // STORAGE SECTION
    if (
      softMatch(normalized, [
        "গুদাম",
        "গুদামঘর",
        "গদাম",
        "গোডাউন",
        "গুদা",
        "সংরক্ষণ"
      ])
    ) {
      reply = "গুদামে বাতাস চলাচল কম। ভেন্ট খুলে বাতাস চলাচল নিশ্চিত করুন।";
      setReplyText(reply);
      speakBangla(reply);
      scrollToSection(storageRef, "storage");
      return;
    }

    // HARVEST
    if (
      softMatch(normalized, [
        "ধান কাটব",
        "কাটব",
        "কবে কাটব",
        "ধান কাটি",
        "ধানকাটা",
        "কাটার সময়"
      ])
    ) {
      reply = "আজ কাটার দরকার নেই। কাল অথবা পরশু ধান কাটাই সবচেয়ে ভালো হবে।";
      setReplyText(reply);
      speakBangla(reply);
      scrollToSection(harvestRef, "harvest");
      return;
    }

    // RISK
    if (softMatch(normalized, ["ঝুঁকি", "রিস্ক", "ঝুকি", "ঝুঁকি কেমন", "বিপদ"])) {
      reply = "বর্তমানে ঝুঁকি মাঝারি। আর্দ্রতা থাকলে ছত্রাক হতে পারে, তাই ধান শুকনো রাখুন।";
      setReplyText(reply);
      speakBangla(reply);
      scrollToSection(riskRef, "risk");
      return;
    }

    // PEST CONTROL
    if (
      softMatch(normalized, [
        "পোকা",
        "পোকামাকড়",
        "কীটপতঙ্গ",
        "পোকার আক্রমণ",
        "কীটনাশক",
        "পোকা দমন"
      ])
    ) {
      reply = "আপনার ধানে মাজরা পোকার আক্রমণ দেখা যাচ্ছে। কার্বোফুরান ৩% জি প্রতি হেক্টরে ১০ কেজি প্রয়োগ করুন।";
      setReplyText(reply);
      speakBangla(reply);
      scrollToSection(pestRef, "pest");
      return;
    }

    // FERTILISER
    if (
      softMatch(normalized, [
        "সার",
        "সার দিব",
        "সার দেব",
        "সারের পরিমাণ",
        "কোন সার",
        "সার প্রয়োগ"
      ])
    ) {
      reply = "এখন ইউরিয়া সার প্রয়োগের সময়। প্রতি হেক্টরে ৫০ কেজি ইউরিয়া এবং ৩০ কেজি পটাশ দিন।";
      setReplyText(reply);
      speakBangla(reply);
      scrollToSection(fertiliserRef, "fertiliser");
      return;
    }

    // IRRIGATION
    if (
      softMatch(normalized, [
        "পানি",
        "সেচ",
        "পানি দিব",
        "পানি দেব",
        "সেচ দিব",
        "সেচ দেব",
        "পানি দেয়া"
      ])
    ) {
      reply = "মাটিতে আর্দ্রতা পর্যাপ্ত আছে। ৩ দিন পর হালকা সেচ দিলেই চলবে। অতিরিক্ত পানি দিবেন না।";
      setReplyText(reply);
      speakBangla(reply);
      scrollToSection(irrigationRef, "irrigation");
      return;
    }

    // MARKET PRICE
    if (
      softMatch(normalized, [
        "দাম",
        "বাজার",
        "বিক্রি",
        "ধানের দাম",
        "চালের দাম",
        "বাজারদর"
      ])
    ) {
      reply = "আজ ধানের বাজার মূল্য প্রতি মণ ১,২৫০ টাকা। আগামী সপ্তাহে দাম বাড়ার সম্ভাবনা আছে।";
      setReplyText(reply);
      speakBangla(reply);
      scrollToSection(marketRef, "market");
      return;
    }

    // SEED QUALITY
    if (
      softMatch(normalized, [
        "বীজ",
        "বীজের মান",
        "বীজ রাখা",
        "বীজ সংরক্ষণ",
        "ভালো বীজ"
      ])
    ) {
      reply = "বীজের মান ভালো আছে। তবে ১৪% এর নিচে আর্দ্রতা রেখে বায়ুরোধী পাত্রে সংরক্ষণ করুন।";
      setReplyText(reply);
      speakBangla(reply);
      scrollToSection(seedRef, "seed");
      return;
    }

    // IF NO MATCH FOUND
    reply = "আপনার কথা ঠিক বুঝতে পারলাম না। দয়া করে আবার চেষ্টা করুন।";
    setReplyText(reply);
    speakBangla(reply);
    setActiveSection("");
  };

  // Speak Bangla
  const speakBangla = (text: string) => {
    if (typeof window !== "undefined") {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "bn-BD";
      speechSynthesis.speak(utter);
    }
  };

  // Start listening
  const startListening = () => {
    if (!recognition) {
      setError("আপনার ব্রাউজার ভয়েস সাপোর্ট করে না!");
      alert("আপনার ব্রাউজার ভয়েস সাপোর্ট করে না!");
      return;
    }
    setListening(true);
    setReplyText("");
    setUserText("");
    setActiveSection("");
    setError("");
    
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
      setError("ভয়েস শোনার সময় সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    };
    
    recognition.start();
  };

  // Handle suggestion click → direct process
  const handleSuggestionClick = (question: string) => {
    setUserText(question);
    processQuestion(question);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-2">
            🎙️ কৃষকের বাংলা ভয়েস প্রশ্নোত্তর
          </h1>
          <p className="text-gray-600 text-sm md:text-base">আপনার প্রশ্ন জিজ্ঞেস করুন এবং তাৎক্ষণিক উত্তর পান</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-xl text-center">
            ⚠️ {error}
          </div>
        )}

        {/* Voice Button */}
        <div className="text-center mb-6">
          <button
            onClick={startListening}
            disabled={listening}
            className={`${
              listening ? "bg-red-600 animate-pulse" : "bg-green-600 hover:bg-green-700"
            } disabled:opacity-50 text-white px-8 md:px-12 py-4 md:py-6 text-xl md:text-2xl rounded-2xl shadow-xl hover:shadow-2xl active:scale-95 transition-all font-bold`}
          >
            {listening ? "🎤 শুনছি..." : "🎤 প্রশ্ন করতে কথা বলুন"}
          </button>
        </div>

        {/* Suggested Questions */}
        <div className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl shadow-lg border-2 border-green-200">
          <div className="text-xl font-bold mb-4 text-gray-800 text-center">
            💡 আপনি এই প্রশ্নগুলো করতে পারেন:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => handleSuggestionClick("আজকের আবহাওয়া কেমন?")}
              className="p-4 bg-white rounded-xl shadow hover:shadow-lg hover:bg-green-50 transition-all text-left font-medium"
            >
              🌦️ আজকের আবহাওয়া কেমন?
            </button>
            <button
              onClick={() => handleSuggestionClick("ধানের অবস্থা কেমন?")}
              className="p-4 bg-white rounded-xl shadow hover:shadow-lg hover:bg-green-50 transition-all text-left font-medium"
            >
              🌾 ধানের অবস্থা কেমন?
            </button>
            <button
              onClick={() => handleSuggestionClick("গুদামের অবস্থা কেমন?")}
              className="p-4 bg-white rounded-xl shadow hover:shadow-lg hover:bg-green-50 transition-all text-left font-medium"
            >
              🏚️ গুদামের অবস্থা কেমন?
            </button>
            <button
              onClick={() => handleSuggestionClick("আমি কবে ধান কাটব?")}
              className="p-4 bg-white rounded-xl shadow hover:shadow-lg hover:bg-green-50 transition-all text-left font-medium"
            >
              ✂️ আমি কবে ধান কাটব?
            </button>
            <button
              onClick={() => handleSuggestionClick("এখন ঝুঁকি কেমন?")}
              className="p-4 bg-white rounded-xl shadow hover:shadow-lg hover:bg-green-50 transition-all text-left font-medium"
            >
              ⚠️ এখন ঝুঁকি কেমন?
            </button>
            <button
              onClick={() => handleSuggestionClick("পোকামাকড়ের আক্রমণ হয়েছে?")}
              className="p-4 bg-white rounded-xl shadow hover:shadow-lg hover:bg-green-50 transition-all text-left font-medium"
            >
              🐛 পোকামাকড়ের আক্রমণ হয়েছে?
            </button>
            <button
              onClick={() => handleSuggestionClick("কোন সার দিব?")}
              className="p-4 bg-white rounded-xl shadow hover:shadow-lg hover:bg-green-50 transition-all text-left font-medium"
            >
              🧪 কোন সার দিব?
            </button>
            <button
              onClick={() => handleSuggestionClick("সেচ দিতে হবে কি?")}
              className="p-4 bg-white rounded-xl shadow hover:shadow-lg hover:bg-green-50 transition-all text-left font-medium"
            >
              💧 সেচ দিতে হবে কি?
            </button>
            <button
              onClick={() => handleSuggestionClick("ধানের দাম কত?")}
              className="p-4 bg-white rounded-xl shadow hover:shadow-lg hover:bg-green-50 transition-all text-left font-medium"
            >
              💰 ধানের দাম কত?
            </button>
            <button
              onClick={() => handleSuggestionClick("বীজের মান কেমন?")}
              className="p-4 bg-white rounded-xl shadow hover:shadow-lg hover:bg-green-50 transition-all text-left font-medium"
            >
              🌱 বীজের মান কেমন?
            </button>
          </div>
        </div>

        {/* SECTIONS */}
        <div className="space-y-6">
          
          {/* Weather Section */}
          <div
            ref={weatherRef}
            className={`p-6 rounded-2xl shadow-lg transition-all duration-500 ${
              activeSection === "weather"
                ? "bg-blue-100 border-4 border-blue-500 scale-105"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">🌦️</span>
              <h2 className="text-2xl font-bold text-gray-800">আজকের আবহাওয়া কেমন?</h2>
            </div>
            
            {activeSection === "weather" && userText && (
              <div className="mt-4 p-4 bg-white rounded-xl border-l-4 border-purple-500">
                <div className="flex items-start gap-2">
                  <span className="text-2xl">🗣️</span>
                  <div>
                    <strong className="text-purple-700 text-lg">আপনি বললেন:</strong>
                    <p className="text-gray-800 text-lg mt-1">{userText}</p>
                  </div>
                </div>
              </div>
            )}
            
            {activeSection === "weather" && replyText && (
              <div className="mt-4 p-4 bg-white rounded-xl border-l-4 border-blue-500">
                <div className="flex items-start gap-2">
                  <span className="text-2xl">🤖</span>
                  <p className="text-gray-800 text-lg">{replyText}</p>
                </div>
              </div>
            )}
          </div>

          {/* Crop Status Section */}
          <div
            ref={cropRef}
            className={`p-6 rounded-2xl shadow-lg transition-all duration-500 ${
              activeSection === "crop"
                ? "bg-green-100 border-4 border-green-500 scale-105"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">🌾</span>
              <h2 className="text-2xl font-bold text-gray-800">ধানের অবস্থা কেমন?</h2>
            </div>
            
            {activeSection === "crop" && userText && (
              <div className="mt-4 p-4 bg-white rounded-xl border-l-4 border-purple-500">
                <div className="flex items-start gap-2">
                  <span className="text-2xl">🗣️</span>
                  <div>
                    <strong className="text-purple-700 text-lg">আপনি বললেন:</strong>
                    <p className="text-gray-800 text-lg mt-1">{userText}</p>
                  </div>
                </div>
              </div>
            )}
            
            {activeSection === "crop" && replyText && (
              <div className="mt-4 p-4 bg-white rounded-xl border-l-4 border-green-500">
                <div className="flex items-start gap-2">
                  <span className="text-2xl">🤖</span>
                  <p className="text-gray-800 text-lg">{replyText}</p>
                </div>
              </div>
            )}
          </div>

          {/* Storage Section */}
          <div
            ref={storageRef}
            className={`p-6 rounded-2xl shadow-lg transition-all duration-500 ${
              activeSection === "storage"
                ? "bg-yellow-100 border-4 border-yellow-500 scale-105"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">🏚️</span>
              <h2 className="text-2xl font-bold text-gray-800">গুদামের অবস্থা কেমন?</h2>
            </div>
            
            {activeSection === "storage" && userText && (
              <div className="mt-4 p-4 bg-white rounded-xl border-l-4 border-purple-500">
                <div className="flex items-start gap-2">
                  <span className="text-2xl">🗣️</span>
                  <div>
                    <strong className="text-purple-700 text-lg">আপনি বললেন:</strong>
                    <p className="text-gray-800 text-lg mt-1">{userText}</p>
                  </div>
                </div>
              </div>
            )}
            
            {activeSection === "storage" && replyText && (
              <div className="mt-4 p-4 bg-white rounded-xl border-l-4 border-yellow-500">
                <div className="flex items-start gap-2">
                  <span className="text-2xl">🤖</span>
                  <p className="text-gray-800 text-lg">{replyText}</p>
                </div>
              </div>
            )}
          </div>

          {/* Harvest Section */}
          <div
            ref={harvestRef}
            className={`p-6 rounded-2xl shadow-lg transition-all duration-500 ${
              activeSection === "harvest"
                ? "bg-orange-100 border-4 border-orange-500 scale-105"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">✂️</span>
              <h2 className="text-2xl font-bold text-gray-800">আমি কবে ধান কাটব?</h2>
            </div>
            
            {activeSection === "harvest" && userText && (
              <div className="mt-4 p-4 bg-white rounded-xl border-l-4 border-purple-500">
                <div className="flex items-start gap-2">
                  <span className="text-2xl">🗣️</span>
                  <div>
                    <strong className="text-purple-700 text-lg">আপনি বললেন:</strong>
                    <p className="text-gray-800 text-lg mt-1">{userText}</p>
                  </div>
                </div>
              </div>
            )}
            
            {activeSection === "harvest" && replyText && (
              <div className="mt-4 p-4 bg-white rounded-xl border-l-4 border-orange-500">
                <div className="flex items-start gap-2">
                  <span className="text-2xl">🤖</span>
                  <p className="text-gray-800 text-lg">{replyText}</p>
                </div>
              </div>
            )}
          </div>

          {/* Risk Section */}
          <div
            ref={riskRef}
            className={`p-6 rounded-2xl shadow-lg transition-all duration-500 ${
              activeSection === "risk"
                ? "bg-red-100 border-4 border-red-500 scale-105"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">⚠️</span>
              <h2 className="text-2xl font-bold text-gray-800">এখন ঝুঁকি কেমন?</h2>
            </div>
            
            {activeSection === "risk" && userText && (
              <div className="mt-4 p-4 bg-white rounded-xl border-l-4 border-purple-500">
                <div className="flex items-start gap-2">
                  <span className="text-2xl">🗣️</span>
                  <div>
                    <strong className="text-purple-700 text-lg">আপনি বললেন:</strong>
                    <p className="text-gray-800 text-lg mt-1">{userText}</p>
                  </div>
                </div>
              </div>
            )}
            
            {activeSection === "risk" && replyText && (
              <div className="mt-4 p-4 bg-white rounded-xl border-l-4 border-red-500">
                <div className="flex items-start gap-2">
                  <span className="text-2xl">🤖</span>
                  <p className="text-gray-800 text-lg">{replyText}</p>
                </div>
              </div>
            )}
          </div>

          {/* Pest Control Section */}
          <div
            ref={pestRef}
            className={`p-6 rounded-2xl shadow-lg transition-all duration-500 ${
              activeSection === "pest"
                ? "bg-purple-100 border-4 border-purple-500 scale-105"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">🐛</span>
              <h2 className="text-2xl font-bold text-gray-800">পোকামাকড়ের আক্রমণ হয়েছে?</h2>
            </div>
            
            {activeSection === "pest" && userText && (
              <div className="mt-4 p-4 bg-white rounded-xl border-l-4 border-purple-500">
                <div className="flex items-start gap-2">
                  <span className="text-2xl">🗣️</span>
                  <div>
                    <strong className="text-purple-700 text-lg">আপনি বললেন:</strong>
                    <p className="text-gray-800 text-lg mt-1">{userText}</p>
                  </div>
                </div>
              </div>
            )}
            
            {activeSection === "pest" && replyText && (
              <div className="mt-4 p-4 bg-white rounded-xl border-l-4 border-purple-500">
                <div className="flex items-start gap-2">
                  <span className="text-2xl">🤖</span>
                  <p className="text-gray-800 text-lg">{replyText}</p>
                </div>
              </div>
            )}
          </div>

          {/* Fertiliser Section */}
          <div
            ref={fertiliserRef}
            className={`p-6 rounded-2xl shadow-lg transition-all duration-500 ${
              activeSection === "fertiliser"
                ? "bg-amber-100 border-4 border-amber-500 scale-105"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">🧪</span>
              <h2 className="text-2xl font-bold text-gray-800">কোন সার দিব?</h2>
            </div>
            
            {activeSection === "fertiliser" && userText && (
              <div className="mt-4 p-4 bg-white rounded-xl border-l-4 border-purple-500">
                <div className="flex items-start gap-2">
                  <span className="text-2xl">🗣️</span>
                  <div>
                    <strong className="text-purple-700 text-lg">আপনি বললেন:</strong>
                    <p className="text-gray-800 text-lg mt-1">{userText}</p>
                  </div>
                </div>
              </div>
            )}
            
            {activeSection === "fertiliser" && replyText && (
              <div className="mt-4 p-4 bg-white rounded-xl border-l-4 border-amber-500">
                <div className="flex items-start gap-2">
                  <span className="text-2xl">🤖</span>
                  <p className="text-gray-800 text-lg">{replyText}</p>
                </div>
              </div>
            )}
          </div>

          {/* Irrigation Section */}
          <div
            ref={irrigationRef}
            className={`p-6 rounded-2xl shadow-lg transition-all duration-500 ${
              activeSection === "irrigation"
                ? "bg-cyan-100 border-4 border-cyan-500 scale-105"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">💧</span>
              <h2 className="text-2xl font-bold text-gray-800">সেচ দিতে হবে কি?</h2>
            </div>
            
            {activeSection === "irrigation" && userText && (
              <div className="mt-4 p-4 bg-white rounded-xl border-l-4 border-purple-500">
                <div className="flex items-start gap-2">
                  <span className="text-2xl">🗣️</span>
                  <div>
                    <strong className="text-purple-700 text-lg">আপনি বললেন:</strong>
                    <p className="text-gray-800 text-lg mt-1">{userText}</p>
                  </div>
                </div>
              </div>
            )}
            
            {activeSection === "irrigation" && replyText && (
              <div className="mt-4 p-4 bg-white rounded-xl border-l-4 border-cyan-500">
                <div className="flex items-start gap-2">
                  <span className="text-2xl">🤖</span>
                  <p className="text-gray-800 text-lg">{replyText}</p>
                </div>
              </div>
            )}
          </div>

          {/* Market Price Section */}
          <div
            ref={marketRef}
            className={`p-6 rounded-2xl shadow-lg transition-all duration-500 ${
              activeSection === "market"
                ? "bg-emerald-100 border-4 border-emerald-500 scale-105"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">💰</span>
              <h2 className="text-2xl font-bold text-gray-800">ধানের দাম কত?</h2>
            </div>
            
            {activeSection === "market" && userText && (
              <div className="mt-4 p-4 bg-white rounded-xl border-l-4 border-purple-500">
                <div className="flex items-start gap-2">
                  <span className="text-2xl">🗣️</span>
                  <div>
                    <strong className="text-purple-700 text-lg">আপনি বললেন:</strong>
                    <p className="text-gray-800 text-lg mt-1">{userText}</p>
                  </div>
                </div>
              </div>
            )}
            
            {activeSection === "market" && replyText && (
              <div className="mt-4 p-4 bg-white rounded-xl border-l-4 border-emerald-500">
                <div className="flex items-start gap-2">
                  <span className="text-2xl">🤖</span>
                  <p className="text-gray-800 text-lg">{replyText}</p>
                </div>
              </div>
            )}
          </div>

          {/* Seed Quality Section */}
          <div
            ref={seedRef}
            className={`p-6 rounded-2xl shadow-lg transition-all duration-500 ${
              activeSection === "seed"
                ? "bg-lime-100 border-4 border-lime-500 scale-105"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">🌱</span>
              <h2 className="text-2xl font-bold text-gray-800">বীজের মান কেমন?</h2>
            </div>
            
            {activeSection === "seed" && userText && (
              <div className="mt-4 p-4 bg-white rounded-xl border-l-4 border-purple-500">
                <div className="flex items-start gap-2">
                  <span className="text-2xl">🗣️</span>
                  <div>
                    <strong className="text-purple-700 text-lg">আপনি বললেন:</strong>
                    <p className="text-gray-800 text-lg mt-1">{userText}</p>
                  </div>
                </div>
              </div>
            )}
            
            {activeSection === "seed" && replyText && (
              <div className="mt-4 p-4 bg-white rounded-xl border-l-4 border-lime-500">
                <div className="flex items-start gap-2">
                  <span className="text-2xl">🤖</span>
                  <p className="text-gray-800 text-lg">{replyText}</p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}