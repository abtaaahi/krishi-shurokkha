"use client";

import { useState, useEffect } from "react";
import ProfileCard from "../components/ProfileCard";

export default function FarmerProfilePage() {
  const [profileData, setProfileData] = useState<any>(null);
  const [batches, setBatches] = useState<any[]>([]);
  const [lossEvents, setLossEvents] = useState<any[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<any[]>([]);
  const [successByBatch, setSuccessByBatch] = useState<any>({});
  const [loading, setLoading] = useState(true);

  // Fetch profile + batches + loss events + badges
  const fetchProfile = async () => {
    setLoading(true);
    try {
      // Try LocalStorage first
      const cached = localStorage.getItem("farmerProfile");
      if (cached) {
        const data = JSON.parse(cached);
        setProfileData(data.profile);
        setBatches(data.batches);
        setLossEvents(data.lossEvents);
        setEarnedBadges(data.earnedBadges);
        setSuccessByBatch(data.successByBatch);
      }

      // Fetch from API
      const res = await fetch("/api/farmer/profile");
      const data = await res.json();
      if (!data.error) {
        setProfileData(data.profile);
        setBatches(data.batches);
        setLossEvents(data.lossEvents);
        setEarnedBadges(data.earnedBadges);

        // Compute success rate per batch
        const successData = data.interventions?.reduce((acc: any, i: any) => {
          if (!acc[i.batch_id]) acc[i.batch_id] = { total: 0, success: 0 };
          acc[i.batch_id].total += 1;
          acc[i.batch_id].success += Number(i.success_score) || 0;
          return acc;
        }, {});
        setSuccessByBatch(successData);

        // Save offline
        localStorage.setItem(
          "farmerProfile",
          JSON.stringify({
            profile: data.profile,
            batches: data.batches,
            lossEvents: data.lossEvents,
            earnedBadges: data.earnedBadges,
            successByBatch: successData,
          })
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Export JSON
  const exportJSON = () => {
    const blob = new Blob(
      [JSON.stringify({ profileData, batches, lossEvents, earnedBadges }, null, 2)],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "farmer_profile.json";
    a.click();
  };

  // Export CSV (batches)
  const exportCSV = () => {
    const csvRows = ["Batch ID,Crop Type,Status,Harvest Date,Success Rate"];
    batches.forEach((b) => {
      const batchData = successByBatch[b.id];
      const batchRate =
        batchData && batchData.total > 0
          ? Math.round(batchData.success / batchData.total)
          : 0;
      csvRows.push(`${b.id},${b.crop_type},${b.status},${b.harvest_date},${batchRate}`);
    });
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "batches.csv";
    a.click();
  };

  if (loading) return <p className="text-center mt-10">লোড হচ্ছে...</p>;
  if (!profileData) return <p className="text-center mt-10">প্রোফাইল তথ্য পাওয়া যায়নি।</p>;

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-center">আমার প্রোফাইল</h1>

      {/* Editable profile card */}
      <ProfileCard initialProfile={profileData} />

      {/* Intervention success rate */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">প্রতিটি ব্যাচে Intervention সফলতার হার</h2>
        <ul>
          {batches.map((batch) => {
            const batchData = successByBatch[batch.id];
            const batchRate =
              batchData && batchData.total > 0
                ? Math.round(batchData.success / batchData.total)
                : 0;
            return (
              <li key={batch.id} className="mb-1">
                {batch.crop_type} ({batch.status}) - ফসলের তারিখ: {batch.harvest_date} - সফলতার হার: {batchRate}%
              </li>
            );
          })}
        </ul>
      </div>

      {/* Loss events */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">নাশ হওয়া ঘটনা</h2>
        <ul>
          {lossEvents.map((event) => (
            <li key={event.id}>
              {event.loss_type} - {event.loss_amount || "-"} - {event.event_date}
            </li>
          ))}
        </ul>
      </div>

      {/* Badges */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">প্রাপ্ত ব্যাজসমূহ</h2>
        <div className="flex gap-4 flex-wrap">
          {earnedBadges.map((b) => (
            <div key={b.badges.id} className="text-center">
              <p className="text-sm">{b.badges.icon}</p>
              <p className="text-sm">{b.badges.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Export buttons */}
      <div className="mt-6 flex gap-4 flex-wrap">
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={exportJSON}>
          JSON এক্সপোর্ট করুন
        </button>
        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={exportCSV}>
          CSV এক্সপোর্ট করুন
        </button>
      </div>
    </div>
  );
}
