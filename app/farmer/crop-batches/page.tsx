"use client";

import { useState } from "react";

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
  const [cropType, setCropType] = useState("Paddy");
  const [weight, setWeight] = useState("");
  const [harvestDate, setHarvestDate] = useState("");
  const [division, setDivision] = useState(divisions[0]);
  const [district, setDistrict] = useState(districts[divisions[0]][0]);
  const [storageType, setStorageType] = useState(storageTypes[0].value);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState<"success" | "error">("error");
  const [loading, setLoading] = useState(false);

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
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow-md w-full max-w-lg">
      <h2 className="text-xl font-bold mb-4">নতুন ফসলের ব্যাচ রেজিস্টার করুন</h2>

      {msg && (
        <div className={`mb-4 p-3 border-2 rounded shadow ${
          msgType === "success"
            ? "border-green-600 bg-green-50 text-green-700"
            : "border-red-600 bg-red-50 text-red-700"
        }`}>
          {msg}
        </div>
      )}

      <label>ফসলের ধরণ</label>
      <select value={cropType} onChange={(e) => setCropType(e.target.value)} className="w-full p-2 mb-4 border rounded">
        <option value="Paddy">ধান (Paddy)</option>
        <option value="Rice">চাল (Rice)</option>
      </select>

      <label>অনুমানিত ওজন (কেজি)</label>
      <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full p-2 mb-4 border rounded" required />

      <label>ফসলের তারিখ</label>
      <input type="date" value={harvestDate} onChange={(e) => setHarvestDate(e.target.value)} className="w-full p-2 mb-4 border rounded" required />

      <label>স্টোরেজ বিভাগ</label>
      <select value={division} onChange={handleDivisionChange} className="w-full p-2 mb-4 border rounded">
        {divisions.map((d) => <option key={d} value={d}>{d}</option>)}
      </select>

      <label>স্টোরেজ জেলা</label>
      <select value={district} onChange={(e) => setDistrict(e.target.value)} className="w-full p-2 mb-4 border rounded">
        {districts[division].map((d) => <option key={d} value={d}>{d}</option>)}
      </select>

      <label>স্টোরেজ ধরণ</label>
      <select value={storageType} onChange={(e) => setStorageType(e.target.value)} className="w-full p-2 mb-4 border rounded">
        {storageTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
      </select>

      <button type="submit" disabled={loading} className="w-full p-3 bg-green-600 text-white rounded">
        {loading ? "প্রসেস হচ্ছে..." : "ব্যাচ রেজিস্টার করুন"}
      </button>
    </form>
  );
}
