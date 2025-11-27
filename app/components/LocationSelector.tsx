"use client";
import { useState, useEffect } from "react";

export interface Upazila {
  id: string;
  name: string;    // English
  bn_name: string; // Bangla
}

interface Props {
  onSelect: (upazila: Upazila) => void;
  className?: string; // optional className for styling
}

export default function LocationSelector({ onSelect, className }: Props) {
  const [upazilas, setUpazilas] = useState<Upazila[]>([]);
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<Upazila[]>([]);

  useEffect(() => {
    fetch("/data/upazilas.json")
      .then((res) => res.json())
      .then((data) => {
        setUpazilas(data.upazilas);
        setFiltered(data.upazilas);
      })
      .catch((err) => console.error("উপজেলা লোড করতে সমস্যা:", err));
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setFiltered(upazilas);
    } else {
      const lowerQuery = query.toLowerCase();
      setFiltered(
        upazilas.filter(
          (u) =>
            u.bn_name.toLowerCase().startsWith(lowerQuery) ||
            u.bn_name.toLowerCase().includes(lowerQuery)
        )
      );
    }
  }, [query, upazilas]);

  return (
    <div className={`w-full max-w-md mx-auto mt-4 ${className || ""}`}>
      <label className="block mb-2 font-bold text-brown">আপনার উপজেলা নির্বাচন করুন</label>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="উপজেলা লিখুন..."
        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:outline-none transition"
      />
      {filtered.length > 0 && (
        <ul className="border border-gray-300 rounded-lg max-h-60 overflow-y-auto mt-1 shadow-sm">
          {filtered.map((u) => (
            <li
              key={u.id}
              className="p-2 hover:bg-green-100 cursor-pointer transition"
              onClick={() => {
                onSelect(u);
                setQuery(u.bn_name);
              }}
            >
              {u.bn_name}
            </li>
          ))}
        </ul>
      )}
      {filtered.length === 0 && query.length > 1 && (
        <div className="mt-2 text-gray-500 text-sm text-center">কোনো উপজেলা খুঁজে পাওয়া যায়নি</div>
      )}
    </div>
  );
}
