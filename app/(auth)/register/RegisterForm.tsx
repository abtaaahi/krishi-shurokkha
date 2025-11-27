"use client";

import { useState } from "react";

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [emailWarning, setEmailWarning] = useState("");
  const [passwordWarning, setPasswordWarning] = useState("");

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
      setMsg("ইমেইল ও পাসওয়ার্ড অবশ্যই ইংরেজিতে লিখতে হবে।");
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
        setMsg(data.error);
        return;
      }

      // Success
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
      setMsg("কিছু ভুল হয়েছে। পরে চেষ্টা করুন।");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8E1] p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 rounded-xl shadow-lg bg-white border-2 border-[#4CAF50]"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-[#3E2723]">
          কৃষক অ্যাকাউন্ট তৈরি করুন
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
        <label className="block mb-2 font-medium text-[#3E2723]">নাম</label>
        <input
          name="name"
          className="w-full p-3 rounded mb-4 border"
          required
          style={{ borderColor: "#3E2723" }}
        />

        {/* Email */}
        <label className="block mb-2 font-medium text-[#3E2723]">ইমেইল</label>
        <input
          name="email"
          type="email"
          className="w-full p-3 rounded mb-1 border"
          required
          style={{ borderColor: "#3E2723" }}
          onChange={(e) =>
            setEmailWarning(
              hasNonEnglishChars(e.target.value)
                ? "ইমেইল অবশ্যই ইংরেজিতে লিখতে হবে।"
                : ""
            )
          }
        />
        {emailWarning && (
          <p className="text-red-600 text-sm mb-2">{emailWarning}</p>
        )}

        {/* Phone */}
        <label className="block mb-2 font-medium text-[#3E2723]">
          মোবাইল নম্বর
        </label>
        <input
          name="phone"
          className="w-full p-3 rounded mb-4 border"
          required
          style={{ borderColor: "#3E2723" }}
        />

        {/* Password */}
        <label className="block mb-2 font-medium text-[#3E2723]">পাসওয়ার্ড</label>
        <input
          name="password"
          type="password"
          className="w-full p-3 rounded mb-1 border"
          required
          style={{ borderColor: "#3E2723" }}
          onChange={(e) =>
            setPasswordWarning(
              hasNonEnglishChars(e.target.value)
                ? "পাসওয়ার্ড অবশ্যই ইংরেজিতে লিখতে হবে।"
                : ""
            )
          }
        />
        {passwordWarning && (
          <p className="text-red-600 text-sm mb-2">{passwordWarning}</p>
        )}

        {/* Language */}
        <label className="block mb-2 font-medium text-[#3E2723]">
          ভাষা নির্বাচন
        </label>
        <select
          name="preferred_language"
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
          {loading ? "প্রসেস হচ্ছে..." : "রেজিস্টার করুন"}
        </button>
      </form>
    </div>
  );
}
