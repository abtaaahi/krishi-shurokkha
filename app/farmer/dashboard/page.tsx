"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FarmerDashboard({ profile, batches }: any) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(profile);

  useEffect(() => {
    setProfileData(profile);
    setLoading(false);
  }, [profile]);

  if (loading) return <p className="text-center mt-10">লোড হচ্ছে...</p>;

  const sections = [
    { title: "প্রোফাইল", desc: "আপনার তথ্য দেখুন ও সম্পাদনা করুন", route: "/farmer/profile" },
    { title: "আবহাওয়া", desc: "আপনার এলাকার বর্তমান আবহাওয়া দেখুন", route: "/weather" },
    { title: "ফসলের স্বাস্থ্য পরীক্ষা", desc: "ফসলের ছবি আপলোড করে স্বাস্থ্য পরীক্ষা করুন", route: "/farmer/crop-health" },
    { title: "ফসলের ব্যাচ", desc: "নতুন ফসলের ব্যাচ রেজিস্টার করুন", route: "/farmer/crop-batches" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10">
      <h1 className="text-3xl font-bold text-center mb-8 text-green-700">
        আমার ড্যাশবোর্ড
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <div
            key={section.title}
            onClick={() => router.push(section.route)}
            className="cursor-pointer p-6 bg-white rounded-lg shadow hover:shadow-lg border border-gray-200 transition-all"
          >
            <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
            <p className="text-gray-600">{section.desc}</p>
          </div>
        ))}
      </div>

      {/* Optional: Quick summary for batches */}
      {batches && batches.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">ফসলের ব্যাচ সারসংক্ষেপ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {batches.map((batch: any) => (
              <div
                key={batch.id}
                className="p-4 bg-white shadow rounded-lg border border-gray-200"
              >
                <p><strong>ফসলের ধরণ:</strong> {batch.crop_type}</p>
                <p><strong>ওজন:</strong> {batch.estimated_weight} কেজি</p>
                <p><strong>হাভেস্ট:</strong> {batch.harvest_date}</p>
                <p><strong>স্টোরেজ:</strong> {batch.storage_division}, {batch.storage_district}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
