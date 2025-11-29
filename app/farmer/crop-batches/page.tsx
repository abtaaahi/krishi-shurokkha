"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const divisions = [
  "ঢাকা", "চট্টগ্রাম", "খুলনা", "বরিশাল", "সিলেট", "রাজশাহী", "রংপুর", "ময়মনসিংহ"
];

const districts: Record<string, string[]> = {
  "ঢাকা": ["ঢাকা", "গাজীপুর", "নারায়ণগঞ্জ", "কিশোরগঞ্জ", "মুন্সিগঞ্জ", "মানিকগঞ্জ", "নরসিংদী", "টাঙ্গাইল", "মাদারীপুর", "রাজবাড়ী", "শরিয়তপুর", "ফরিদপুর"],
  "চট্টগ্রাম": ["চট্টগ্রাম", "কক্সবাজার", "কুমিল্লা", "ফেনী", "রাঙ্গামাটি", "ব্রাহ্মণবাড়িয়া", "খাগড়াছড়ি", "বান্দরবান", "লক্ষ্মীপুর", "নোয়াখালী", "চাঁদপুর"],
  "খুলনা": ["খুলনা", "যশোর", "মাগুরা", "সাতক্ষীরা", "কুষ্টিয়া", "বাগেরহাট", "চুয়াডাঙ্গা", "মেহেরপুর"],
  "বরিশাল": ["বরিশাল", "পটুয়াখালী", "ভোলা", "ঝালকাঠি", "পিরোজপুর", "বরগুনা"],
  "সিলেট": ["সিলেট", "মৌলভীবাজার", "হবিগঞ্জ", "সুনামগঞ্জ"],
  "রাজশাহী": ["রাজশাহী", "বগুড়া", "নওগাঁ", "চাঁপাইনবাবগঞ্জ", "সিরাজগঞ্জ", "পাবনা", "সুন্দরগঞ্জ", "জয়পুরহাট"],
  "রংপুর": ["রংপুর", "দিনাজপুর", "গাইবান্ধা", "কুড়িগ্রাম", "লালমনিরহাট", "নীলফামারী", "ঠাকুরগাঁও", "পঞ্চগড়", "রাজারহাট", "হালুয়াঘাট"],
  "ময়মনসিংহ": ["ময়মনসিংহ", "নেত্রকোনা", "জামালপুর", "শেরপুর", "ফরিদপুর", "গোবিন্দগঞ্জ", "ডিমলা", "নওগাঁ"]
};

const storageTypes = [
  { value: "Jute Bag Stack", label: "ঝুট ব্যাগ স্ট্যাক" },
  { value: "Silo", label: "সিলো" },
  { value: "Open Area", label: "খোলা এলাকা" },
];

export default function CropBatchForm() {
  const router = useRouter();

  const [cropType, setCropType] = useState("Paddy");
  const [weight, setWeight] = useState("");
  const [harvestDate, setHarvestDate] = useState("");
  const [division, setDivision] = useState(divisions[0]);
  const [district, setDistrict] = useState(districts[divisions[0]][0]);
  const [storageType, setStorageType] = useState(storageTypes[0].value);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState<"success" | "error">("error");
  const [loading, setLoading] = useState(false);

    useEffect(() => {
      // Check if user is logged in
      const user = localStorage.getItem("user");
      if (!user) {
        router.push("/login");
      }
    }, [router]);

  function handleDivisionChange(e: any) {
    const div = e.target.value;
    setDivision(div);
    setDistrict(districts[div][0]);
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    if (!weight || Number(weight) <= 0) {
      setMsg("অনুমানিত ওজন অবশ্যই 0 এর চেয়ে বেশি হতে হবে।");
      setMsgType("error");
      setLoading(false);
      return;
    }

    if (!harvestDate || new Date(harvestDate) > new Date()) {
      setMsg("ফসলের তারিখ ভবিষ্যতের হতে পারে না।");
      setMsgType("error");
      setLoading(false);
      return;
    }

    const payload = {
      crop_type: cropType,
      estimated_weight: Number(weight),
      harvest_date: harvestDate,
      storage_division: division,
      storage_district: district,
      storage_type: storageType,
    };

    try {
      const res = await fetch("/api/farmer/crop-batches", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setMsg("ফসলের ব্যাচ সফলভাবে রেজিস্টার হয়েছে!");
        setMsgType("success");
        setWeight("");
        setHarvestDate("");
      } else {
        setMsg(`ফসলের ব্যাচ রেজিস্টার করতে ব্যর্থ হয়েছে। বিস্তারিত: ${data.error || "অনুগ্রহ করে আবার চেষ্টা করুন।"}`);
        setMsgType("error");
      }
    } catch (err: any) {
      setLoading(false);
      setMsg(`ফসলের ব্যাচ রেজিস্টার করতে ব্যর্থ হয়েছে। বিস্তারিত: ${err.message}`);
      setMsgType("error");
    }
  }

return (
  <form
    onSubmit={handleSubmit}
    className="w-full max-w-lg mx-auto bg-white rounded-xl shadow-lg p-5 sm:p-6 space-y-4 text-[15px]"
  >
    {/* Title */}
    <h2 className="text-2xl font-bold text-center text-green-700">
      ফসলের ব্যাচ রেজিস্ট্রেশন
    </h2>
    <p className="text-center text-gray-600 text-sm">
      নিচের তথ্যগুলো সঠিকভাবে পূরণ করুন
    </p>

    {/* Alert Message */}
    {msg && (
      <div
        className={`p-3 rounded-lg border ${
          msgType === "success"
            ? "bg-green-50 border-green-600 text-green-700"
            : "bg-red-50 border-red-600 text-red-700"
        }`}
      >
        {msg}
      </div>
    )}

    {/* Section: Crop Details */}
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-300 space-y-3">
      <h3 className="font-semibold text-gray-800 border-b border-gray-300 pb-1">
        ফসলের তথ্য
      </h3>

      <div>
        <label className="block mb-1 font-medium">ফসলের ধরণ</label>
        <select
          value={cropType}
          onChange={(e) => setCropType(e.target.value)}
          className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
        >
          <option value="Paddy">ধান (Paddy)</option>
          <option value="Rice">চাল (Rice)</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">অনুমানিত ওজন (কেজি)</label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
          placeholder="যেমন: ৫০"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">ফসল কাটার তারিখ</label>
        <input
          type="date"
          value={harvestDate}
          onChange={(e) => setHarvestDate(e.target.value)}
          className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
        />
      </div>
    </div>

    {/* Section: Storage Details */}
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-300 space-y-3">
      <h3 className="font-semibold text-gray-800 border-b border-gray-300 pb-1">
        স্টোরেজ তথ্য
      </h3>

      <div>
        <label className="block mb-1 font-medium">বিভাগ</label>
        <select
          value={division}
          onChange={handleDivisionChange}
          className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
        >
          {divisions.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">জেলা</label>
        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
        >
          {districts[division].map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">স্টোরেজ ধরণ</label>
        <select
          value={storageType}
          onChange={(e) => setStorageType(e.target.value)}
          className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
        >
          {storageTypes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>
    </div>

    {/* Submit Button */}
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-green-600 text-white py-3 rounded-lg text-lg font-semibold shadow-md active:scale-95 transition"
    >
      {loading ? "প্রসেস হচ্ছে..." : "ব্যাচ রেজিস্টার করুন"}
    </button>
  </form>
);
}
