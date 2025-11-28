"use client";

import { useState } from "react";
import { useLanguage } from "@/app/context/LanguageContext";

export default function RegisterForm() {
  const { lang, setLang } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [emailWarning, setEmailWarning] = useState("");
  const [passwordWarning, setPasswordWarning] = useState("");

  const t = {
    en: {
      loginPrompt: "If you already have an account,",
      loginButton: "Login",
      loginInfo: "Sign in to access your dashboard directly.",
      registerTitle: "Create Farmer Account",
      nameLabel: "Name",
      emailLabel: "Email",
      phoneLabel: "Phone Number",
      passwordLabel: "Password",
      languageLabel: "Select Language",
      registerButton: "Register",
      loading: "Processing...",
      nonEnglishError: "Email and password must be in English.",
      emailEnglish: "Email must be in English.",
      passwordEnglish: "Password must be in English.",
      generalError: "Something went wrong. Please try again later.",
    },
    bn: {
      loginPrompt: "আপনার যদি ইতিমধ্যে অ্যাকাউন্ট থাকে,",
      loginButton: "লগইন করুন",
      loginInfo: "লগইন করে আপনি সরাসরি আপনার ড্যাশবোর্ডে যেতে পারবেন।",
      registerTitle: "কৃষক অ্যাকাউন্ট তৈরি করুন",
      nameLabel: "নাম",
      emailLabel: "ইমেইল",
      phoneLabel: "মোবাইল নম্বর",
      passwordLabel: "পাসওয়ার্ড",
      languageLabel: "ভাষা নির্বাচন",
      registerButton: "রেজিস্টার করুন",
      loading: "প্রসেস হচ্ছে...",
      nonEnglishError: "ইমেইল ও পাসওয়ার্ড অবশ্যই ইংরেজিতে লিখতে হবে।",
      emailEnglish: "ইমেইল অবশ্যই ইংরেজিতে লিখতে হবে।",
      passwordEnglish: "পাসওয়ার্ড অবশ্যই ইংরেজিতে লিখতে হবে।",
      generalError: "কিছু ভুল হয়েছে। পরে চেষ্টা করুন।",
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
    const name = form.get("name") as string;
    const email = form.get("email") as string;
    const phone = form.get("phone") as string;
    const password = form.get("password") as string;
    const preferred_language = form.get("preferred_language") as string;

    if (hasNonEnglishChars(email) || hasNonEnglishChars(password)) {
      setMsg(t.nonEnglishError);
      setLoading(false);
      return;
    }

    const payload = { name, email, phone, password, preferred_language };

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setMsg(data.error || t.generalError);
        return;
      }

      e.target.reset();
      setEmailWarning("");
      setPasswordWarning("");
      localStorage.setItem(
        "user",
        JSON.stringify({ email, preferred_language })
      );

      window.location.href = "/farmer/dashboard";
    } catch (error) {
      setLoading(false);
      setMsg(t.generalError);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF8E1] p-4 space-y-6">

      {/* Registration Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 rounded-xl shadow-lg bg-white border-2 border-[#4CAF50]"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-[#3E2723]">
          {t.registerTitle}
        </h1>

        {msg && (
          <p
            className="mb-4 text-center font-medium"
            style={{ color: msg.includes("সফল") ? "#4CAF50" : "#E53935" }}
          >
            {msg}
          </p>
        )}

        {/* Name */}
        <label className="block mb-2 font-medium text-[#3E2723]">{t.nameLabel}</label>
        <input
          name="name"
          className="w-full p-3 rounded mb-4 border"
          required
          style={{ borderColor: "#3E2723" }}
        />

        {/* Email */}
        <label className="block mb-2 font-medium text-[#3E2723]">{t.emailLabel}</label>
        <input
          name="email"
          type="email"
          className="w-full p-3 rounded mb-1 border"
          required
          style={{ borderColor: "#3E2723" }}
          onChange={(e) =>
            setEmailWarning(
              hasNonEnglishChars(e.target.value) ? t.emailEnglish : ""
            )
          }
        />
        {emailWarning && <p className="text-red-600 text-sm mb-2">{emailWarning}</p>}

        {/* Phone */}
        <label className="block mb-2 font-medium text-[#3E2723]">{t.phoneLabel}</label>
        <input
          name="phone"
          className="w-full p-3 rounded mb-4 border"
          required
          style={{ borderColor: "#3E2723" }}
        />

        {/* Password */}
        <label className="block mb-2 font-medium text-[#3E2723]">{t.passwordLabel}</label>
        <input
          name="password"
          type="password"
          className="w-full p-3 rounded mb-1 border"
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
          value={lang} // auto-set current context
          onChange={(e) => setLang(e.target.value as "bn" | "en")} // update context
          className="w-full p-3 rounded mb-6 border"
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
          {loading ? t.loading : t.registerButton}
        </button>
      </form>
      {/* Login Prompt */}
      <div className="max-w-md w-full p-4 rounded-xl bg-green-100 border border-green-400 text-center shadow-md">
        <p className="text-[#1B5E20] font-medium mb-2">{t.loginPrompt}</p>
        <button
          onClick={() => (window.location.href = "/login")}
          className="px-6 py-2 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
        >
          {t.loginButton}
        </button>
        <p className="text-sm text-green-800 mt-2">{t.loginInfo}</p>
      </div>
    </div>
  );
}
