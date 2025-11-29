"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/context/LanguageContext";

interface Profile {
  name: string;
  phone: string;
  preferred_language: string;
}

interface Props {
  initialProfile: Profile;
}

export default function ProfileCard({ initialProfile }: Props) {
  const router = useRouter();
  const { lang, setLang } = useLanguage();
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "language") setLang(value as "bn" | "en");
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogout = async () => {
    const toastId = toast.loading(lang === "bn" ? "লগআউট হচ্ছে..." : "Logging out...");
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Logout failed");

      localStorage.removeItem("user");
      localStorage.removeItem("farmerProfile");

      toast.success(lang === "bn" ? "সফলভাবে লগআউট হয়েছে" : "Logged out successfully", { id: toastId });

      router.push("/login");
    } catch (err: any) {
      toast.error(err.message || (lang === "bn" ? "লগআউট ব্যর্থ" : "Failed to logout"), { id: toastId });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const toastId = toast.loading(lang === "bn" ? "আপডেট হচ্ছে..." : "Updating...");
    try {
      const res = await fetch("/api/farmer/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: profile.name, 
          phone: profile.phone, 
          language: lang 
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message, { id: toastId });
        setIsEditing(false);
      } else {
        toast.error(data.error, { id: toastId });
      }
    } catch {
      toast.error(lang === "bn" ? "সার্ভারে সমস্যা হয়েছে" : "Server error", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-xl rounded-2xl border border-gray-200 transition-all hover:shadow-2xl">
      <Toaster />
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        {lang === "bn" ? "ব্যক্তিগত তথ্য" : "Profile Information"}
      </h2>

      {/* Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">{lang === "bn" ? "নাম" : "Name"}</label>
        <input
          type="text"
          name="name"
          value={profile.name}
          disabled={!isEditing || saving}
          onChange={handleChange}
          className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
            isEditing ? "border-blue-400 bg-white focus:ring-blue-300" : "border-gray-300 bg-gray-100"
          }`}
        />
      </div>

      {/* Phone */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">{lang === "bn" ? "ফোন" : "Phone"}</label>
        <input
          type="text"
          name="phone"
          value={profile.phone}
          disabled={!isEditing || saving}
          onChange={handleChange}
          className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
            isEditing ? "border-blue-400 bg-white focus:ring-blue-300" : "border-gray-300 bg-gray-100"
          }`}
        />
      </div>

      {/* Language */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">{lang === "bn" ? "ভাষা" : "Language"}</label>
        <select
          name="language"
          value={lang}
          disabled={!isEditing || saving}
          onChange={handleChange}
          className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
            isEditing ? "border-blue-400 bg-white focus:ring-blue-300" : "border-gray-300 bg-gray-100"
          }`}
        >
          <option value="en">English</option>
          <option value="bn">বাংলা</option>
        </select>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-6">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition flex items-center justify-center gap-2"
            >
              {saving ? (lang === "bn" ? "সংরক্ষণ হচ্ছে..." : "Saving...") : lang === "bn" ? "সংরক্ষণ করুন" : "Save"}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              disabled={saving}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-lg transition"
            >
              {lang === "bn" ? "বাতিল" : "Cancel"}
            </button>
          </>
        ) : (
        <>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition"
          >
            {lang === "bn" ? "সম্পাদনা করুন" : "Edit"}
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition"
          >
            {lang === "bn" ? "লগআউট" : "Logout"}
          </button>
        </>
        )}
      </div>
    </div>
  );
}
