"use client";

import { useState } from "react";

export default function LoginForm() {
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
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const preferred_language = form.get("preferred_language") as string;

    if (hasNonEnglishChars(email) || hasNonEnglishChars(password)) {
      setMsg("ইমেইল ও পাসওয়ার্ড অবশ্যই ইংরেজিতে লিখতে হবে।");
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
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8E1] p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 rounded-2xl shadow-lg bg-white border-2 border-[#4CAF50]"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-[#3E2723]">
          কৃষক লগইন
        </h1>

        {msg && (
          <p
            className="mb-4 text-center font-medium"
            style={{ color: msg.includes("সফল") ? "#4CAF50" : "#E53935" }}
          >
            {msg}
          </p>
        )}

        <label className="block mb-2 font-medium text-[#3E2723]">ইমেইল</label>
        <input
          name="email"
          type="email"
          className="w-full p-3 rounded mb-1 border focus:ring-2 focus:ring-[#4CAF50]"
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

        <label className="block mb-2 font-medium text-[#3E2723]">পাসওয়ার্ড</label>
        <input
          name="password"
          type="password"
          className="w-full p-3 rounded mb-1 border focus:ring-2 focus:ring-[#4CAF50]"
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

        <label className="block mb-2 font-medium text-[#3E2723]">ভাষা নির্বাচন</label>
        <select
          name="preferred_language"
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
          {loading ? "প্রসেস হচ্ছে..." : "লগইন করুন"}
        </button>
      </form>
    </div>
  );
}
