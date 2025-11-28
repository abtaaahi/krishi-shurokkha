"use client";

import { useState } from "react";
import { useLanguage } from "@/app/context/LanguageContext";

export default function LoginForm() {
  const { lang, setLang } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [emailWarning, setEmailWarning] = useState("");
  const [passwordWarning, setPasswordWarning] = useState("");

  const t = {
    en: {
      registerPrompt: "If you don't have an account,",
      registerButton: "Register",
      registerInfo: "Create a new account to track your crops and weather information.",
      loginTitle: "Farmer Login",
      emailLabel: "Email",
      passwordLabel: "Password",
      languageLabel: "Select Language",
      loginButton: "Login",
      loading: "Processing...",
      nonEnglishError: "Email and password must be in English.",
      emailEnglish: "Email must be in English.",
      passwordEnglish: "Password must be in English.",
    },
    bn: {
      registerPrompt: "আপনার যদি অ্যাকাউন্ট না থাকে,",
      registerButton: "রেজিস্টার করুন",
      registerInfo: "নতুন অ্যাকাউন্ট তৈরি করে আপনি ফসল এবং আবহাওয়ার তথ্য ট্র্যাক করতে পারবেন।",
      loginTitle: "কৃষক লগইন",
      emailLabel: "ইমেইল",
      passwordLabel: "পাসওয়ার্ড",
      languageLabel: "ভাষা নির্বাচন",
      loginButton: "লগইন করুন",
      loading: "প্রসেস হচ্ছে...",
      nonEnglishError: "ইমেইল ও পাসওয়ার্ড অবশ্যই ইংরেজিতে লিখতে হবে।",
      emailEnglish: "ইমেইল অবশ্যই ইংরেজিতে লিখতে হবে।",
      passwordEnglish: "পাসওয়ার্ড অবশ্যই ইংরেজিতে লিখতে হবে।",
    },
  }[lang];

  function hasNonEnglishChars(str: string) {
    return /[^\x00-\x7F]/.test(str);
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const form = new FormData(e.target);
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const preferred_language = form.get("preferred_language") as string;

    if (hasNonEnglishChars(email) || hasNonEnglishChars(password)) {
      setMsg(t.nonEnglishError);
      setLoading(false);
      return;
    }

    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, preferred_language }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      e.target.reset();
      setEmailWarning("");
      setPasswordWarning("");
      localStorage.setItem(
        "user",
        JSON.stringify({ email, preferred_language })
      );
      window.location.href = "/farmer/dashboard";
    } else {
      setMsg(data.error);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF8E1] p-4 space-y-6">
      {/* Login Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 rounded-2xl shadow-lg bg-white border-2 border-[#4CAF50]"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-[#3E2723]">{t.loginTitle}</h1>

        {msg && (
          <p
            className="mb-4 text-center font-medium"
            style={{ color: msg.includes("সফল") ? "#4CAF50" : "#E53935" }}
          >
            {msg}
          </p>
        )}

        {/* Email */}
        <label className="block mb-2 font-medium text-[#3E2723]">{t.emailLabel}</label>
        <input
          name="email"
          type="email"
          className="w-full p-3 rounded mb-1 border focus:ring-2 focus:ring-[#4CAF50]"
          required
          style={{ borderColor: "#3E2723" }}
          onChange={(e) =>
            setEmailWarning(
              hasNonEnglishChars(e.target.value) ? t.emailEnglish : ""
            )
          }
        />
        {emailWarning && <p className="text-red-600 text-sm mb-2">{emailWarning}</p>}

        {/* Password */}
        <label className="block mb-2 font-medium text-[#3E2723]">{t.passwordLabel}</label>
        <input
          name="password"
          type="password"
          className="w-full p-3 rounded mb-1 border focus:ring-2 focus:ring-[#4CAF50]"
          required
          style={{ borderColor: "#3E2723" }}
          onChange={(e) =>
            setPasswordWarning(
              hasNonEnglishChars(e.target.value) ? t.passwordEnglish : ""
            )
          }
        />
        {passwordWarning && <p className="text-red-600 text-sm mb-2">{passwordWarning}</p>}

        {/* Language */}
        <label className="block mb-2 font-medium text-[#3E2723]">{t.languageLabel}</label>
        <select
          name="preferred_language"
          value={lang} // <-- auto-set current context
          onChange={(e) => setLang(e.target.value as "bn" | "en")} // <-- update context
          className="w-full p-3 rounded mb-6 border focus:ring-2 focus:ring-[#4CAF50]"
          style={{ borderColor: "#3E2723" }}
        >
          <option value="bn">বাংলা</option>
          <option value="en">English</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 rounded font-semibold bg-[#4CAF50] text-white hover:bg-green-600 transition-colors"
        >
          {loading ? t.loading : t.loginButton}
        </button>
      </form>

      {/* Register Prompt */}
      <div className="max-w-md w-full p-4 rounded-xl bg-green-100 border border-green-400 text-center shadow-md">
        <p className="text-[#1B5E20] font-medium mb-2">{t.registerPrompt}</p>
        <button
          onClick={() => (window.location.href = "/register")}
          className="px-6 py-2 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
        >
          {t.registerButton}
        </button>
        <p className="text-sm text-green-800 mt-2">{t.registerInfo}</p>
      </div>
    </div>
  );
}
