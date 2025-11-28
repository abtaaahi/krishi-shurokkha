"use client";

import { useState, useEffect } from "react";
import localforage from "localforage";
import toast, { Toaster } from "react-hot-toast";

interface Profile {
  name: string;
  phone: string;
  preferred_language: string;
}

interface Props {
  initialProfile: Profile;
}

export default function ProfileCard({ initialProfile }: Props) {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [language, setLanguage] = useState<string>(initialProfile.preferred_language);
  const [loadingLang, setLoadingLang] = useState(true);

  // ভাষা লোড করা
  useEffect(() => {
    async function loadLanguage() {
      const storedLang = await localforage.getItem<string>("preferredLanguage");
      if (storedLang) setLanguage(storedLang);
      setLoadingLang(false);
    }
    loadLanguage();
  }, []);

  // ভাষা সংরক্ষণ করা
  useEffect(() => {
    if (!loadingLang) {
      localforage.setItem("preferredLanguage", language).catch((err) =>
        console.error("ভাষা সংরক্ষণ করতে সমস্যা:", err)
      );
    }
  }, [language, loadingLang]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const toastId = toast.loading("আপডেট হচ্ছে...");
    try {
      const res = await fetch("/api/farmer/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...profile, language }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message, { id: toastId });
        setIsEditing(false);
      } else {
        toast.error(data.error, { id: toastId });
      }
    } catch (err) {
      toast.error("সার্ভারে সমস্যা হয়েছে", { id: toastId });
    }
  };

  if (loadingLang) return null;

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl max-w-md mx-auto border border-gray-200">
      <Toaster />

      {/* নাম */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">নাম</label>
        <input
          type="text"
          name="name"
          value={profile.name}
          disabled={!isEditing}
          onChange={handleChange}
          className={`w-full px-4 py-2 rounded-md border ${
            isEditing ? "border-blue-400 bg-white" : "border-gray-300 bg-gray-100"
          } focus:outline-none focus:ring-2 focus:ring-blue-300`}
        />
      </div>

      {/* ফোন */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">ফোন</label>
        <input
          type="text"
          name="phone"
          value={profile.phone}
          disabled={!isEditing}
          onChange={handleChange}
          className={`w-full px-4 py-2 rounded-md border ${
            isEditing ? "border-blue-400 bg-white" : "border-gray-300 bg-gray-100"
          } focus:outline-none focus:ring-2 focus:ring-blue-300`}
        />
      </div>

      {/* পছন্দের ভাষা */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">ভাষা</label>
        <select
          name="language"
          value={language}
          disabled={!isEditing}
          onChange={(e) => setLanguage(e.target.value)}
          className={`w-full px-4 py-2 rounded-md border ${
            isEditing ? "border-blue-400 bg-white" : "border-gray-300 bg-gray-100"
          } focus:outline-none focus:ring-2 focus:ring-blue-300`}
        >
          <option value="en">English</option>
          <option value="bn">বাংলা</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-5">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
            >
              সংরক্ষণ করুন
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-lg transition"
            >
              বাতিল
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition"
          >
            সম্পাদনা করুন
          </button>
        )}
      </div>
    </div>
  );
}
