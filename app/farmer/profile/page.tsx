"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProfileCard from "../components/ProfileCard";
import { useLanguage } from "@/app/context/LanguageContext";
import { toast } from "react-hot-toast";

export default function FarmerProfilePage() {
  const router = useRouter();
  const { lang } = useLanguage();

  const [profileData, setProfileData] = useState<any>(null);
  const [batches, setBatches] = useState<any[]>([]);
  const [lossEvents, setLossEvents] = useState<any[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<any[]>([]);
  const [interventions, setInterventions] = useState<any[]>([]);
  const [successByBatch, setSuccessByBatch] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const [batchInputs, setBatchInputs] = useState<{
    [key: string]: {
      interventionType: string;
      interventionScore: number;
      interventionNotes: string;
      lossType: string;
      lossAmount: number;
      lossDescription: string;
    };
  }>({});

  const syncData = async () => {
    try {
      const cached = localStorage.getItem("farmerProfile");
      if (cached) {
        const data = JSON.parse(cached);

        setProfileData(data.profile);
        setBatches(data.batches || []);
        setLossEvents(data.lossEvents || []);
        setEarnedBadges(data.earnedBadges || []);
        setInterventions(data.interventions || []);
        setSuccessByBatch(data.successByBatch || {});
      }

      const res = await fetch("/api/farmer/profile");
      if (!res.ok) throw new Error("API fetch failed");
      const data = await res.json();

      if (!data.error) {
        setProfileData(data.profile);
        setBatches(data.batches || []);
        setLossEvents(data.lossEvents || []);
        setEarnedBadges(data.earnedBadges || []);
        setInterventions(data.interventions || []);

        const successData = data.interventions?.reduce((acc: any, i: any) => {
          if (!acc[i.batch_id]) acc[i.batch_id] = { total: 0, success: 0 };
          acc[i.batch_id].total += 1;
          acc[i.batch_id].success += Number(i.success_score) || 0;
          return acc;
        }, {});
        setSuccessByBatch(successData || {});

        localStorage.setItem(
          "farmerProfile",
          JSON.stringify({
            profile: data.profile,
            batches: data.batches,
            lossEvents: data.lossEvents,
            earnedBadges: data.earnedBadges,
            interventions: data.interventions,
            successByBatch: successData,
          })
        );
      }
    } catch (err) {
      console.warn("Offline or API failed, using cached data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/login");
      return;
    }
    syncData();
  }, [router]);

  const submitBatchUpdate = async (
    batchId: string,
    intervention: { type: string; score: number; notes?: string },
    loss: { type: string; amount?: number; description?: string }
  ) => {
    try {
      const interventionRes = await fetch("/api/farmer/intervention", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batch_id: batchId,
          action_type: intervention.type,
          action_date: new Date().toISOString(),
          success_score: intervention.score,
          notes: intervention.notes || "",
        }),
      });
      const interventionData = await interventionRes.json();
      if (interventionData.error) throw new Error(interventionData.error);

      const lossRes = await fetch("/api/farmer/loss-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batch_id: batchId,
          loss_type: loss.type,
          loss_amount: loss.amount || null,
          description: loss.description || "",
          event_date: new Date().toISOString(),
        }),
      });
      const lossData = await lossRes.json();
      if (lossData.error) throw new Error(lossData.error);

      await fetch(`/api/farmer/batch/${batchId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "updated" }),
      });

      toast.success(
        lang === "bn" ? "সফলভাবে যোগ করা হয়েছে" : "Submitted successfully"
      );
      syncData();

      setBatchInputs((prev) => ({
        ...prev,
        [batchId]: {
          interventionType: "",
          interventionScore: 0,
          interventionNotes: "",
          lossType: "",
          lossAmount: 0,
          lossDescription: "",
        },
      }));
    } catch (err: any) {
      toast.error(err.message || (lang === "bn" ? "যোগ করতে ব্যর্থ" : "Failed to submit batch update"));
    }
  };

  const exportJSON = () => {
    const blob = new Blob(
      [JSON.stringify({ profileData, batches, lossEvents, earnedBadges, interventions }, null, 2)],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "farmer_profile.json";
    a.click();
  };

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

  return (
    <div className="w-full min-h-screen bg-gray-50 px-6 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {lang === "bn" ? "আমার প্রোফাইল" : "My Profile"}
      </h1>

      <div className="w-full max-w-5xl mx-auto">
        {loading ? (
          <p className="text-center">{lang === "bn" ? "লোড হচ্ছে..." : "Loading..."}</p>
        ) : profileData ? (
          <ProfileCard initialProfile={profileData} />
        ) : (
          <p className="text-center text-red-500">{lang === "bn" ? "প্রোফাইল তথ্য পাওয়া যায়নি।" : "Profile data not found."}</p>
        )}

        {/* Batches */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-2">
            {lang === "bn"
              ? "একটিভ অর্ডার আপডেট করুন: ইন্টারভেনশন এবং নাশ হওয়া ঘটনা যোগ করুন"
              : "Update Active Orders: Add Interventions and Loss Events"}
          </h2>

          {batches.filter(batch => batch.status === "active").length === 0 ? (
            <p className="text-center text-gray-500 mt-4">
              {lang === "bn"
                ? "কোনো একটিভ অর্ডার নেই।"
                : "No active orders found."}
            </p>
          ) : (
            <ul className="space-y-6">
              {batches.map((batch) => {
                if (batch.status !== "active") return null;

                const inputState = batchInputs[batch.id] || {
                  interventionType: "",
                  interventionScore: 0,
                  interventionNotes: "",
                  lossType: "",
                  lossAmount: 0,
                  lossDescription: "",
                };

                return (
                  <li key={batch.id} className="p-4 bg-white rounded-lg shadow w-full">
                    <div className="mb-3">
                      <strong>{batch.crop_type}</strong> - {batch.storage_district} -{" "}
                      {lang === "bn" ? "ফসলের তারিখ" : "Harvest Date"}: {batch.harvest_date}
                    </div>

                    {/* Intervention Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                      <input
                        type="text"
                        placeholder={lang === "bn" ? "Intervention Type" : "Action Type"}
                        value={inputState.interventionType}
                        onChange={(e) =>
                          setBatchInputs((prev) => ({
                            ...prev,
                            [batch.id]: { ...inputState, interventionType: e.target.value },
                          }))
                        }
                        className="border p-2 rounded w-full"
                      />
                      <input
                        type="number"
                        placeholder={lang === "bn" ? "Success Score" : "Score"}
                        value={inputState.interventionScore}
                        onChange={(e) =>
                          setBatchInputs((prev) => ({
                            ...prev,
                            [batch.id]: { ...inputState, interventionScore: Number(e.target.value) },
                          }))
                        }
                        className="border p-2 rounded w-full"
                      />
                      <input
                        type="text"
                        placeholder={lang === "bn" ? "Notes" : "Notes"}
                        value={inputState.interventionNotes}
                        onChange={(e) =>
                          setBatchInputs((prev) => ({
                            ...prev,
                            [batch.id]: { ...inputState, interventionNotes: e.target.value },
                          }))
                        }
                        className="border p-2 rounded w-full"
                      />
                    </div>

                    {/* Loss Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                      <input
                        type="text"
                        placeholder={lang === "bn" ? "Loss Type" : "Loss Type"}
                        value={inputState.lossType}
                        onChange={(e) =>
                          setBatchInputs((prev) => ({
                            ...prev,
                            [batch.id]: { ...inputState, lossType: e.target.value },
                          }))
                        }
                        className="border p-2 rounded w-full"
                      />
                      <input
                        type="number"
                        placeholder={lang === "bn" ? "Amount" : "Amount"}
                        value={inputState.lossAmount}
                        onChange={(e) =>
                          setBatchInputs((prev) => ({
                            ...prev,
                            [batch.id]: { ...inputState, lossAmount: Number(e.target.value) },
                          }))
                        }
                        className="border p-2 rounded w-full"
                      />
                      <input
                        type="text"
                        placeholder={lang === "bn" ? "Description" : "Description"}
                        value={inputState.lossDescription}
                        onChange={(e) =>
                          setBatchInputs((prev) => ({
                            ...prev,
                            [batch.id]: { ...inputState, lossDescription: e.target.value },
                          }))
                        }
                        className="border p-2 rounded w-full"
                      />
                    </div>

                    <button
                      onClick={() =>
                        submitBatchUpdate(
                          batch.id,
                          {
                            type: inputState.interventionType,
                            score: inputState.interventionScore,
                            notes: inputState.interventionNotes,
                          },
                          {
                            type: inputState.lossType,
                            amount: inputState.lossAmount,
                            description: inputState.lossDescription,
                          }
                        )
                      }
                      className="bg-blue-500 text-white px-4 py-2 rounded w-full md:w-auto"
                    >
                      {lang === "bn" ? "Submit" : "Submit"}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        
        {/* Interventions */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-2">
            {lang === "bn" ? "ইন্টারভেনশনসমূহ" : "Interventions"}
          </h2>

          {interventions.length ? (
            <ul className="space-y-2">
              {interventions.map((iv) => {
                const batch = batches.find((b) => b.id === iv.batch_id);
                const batchLabel = batch
                  ? `${batch.crop_type}${
                      batch.status === "updated"
                        ? lang === "bn"
                          ? " (আপডেট করা হয়েছে)"
                          : " (Updated)"
                        : ""
                    }`
                  : "Unknown Batch";

                return (
                  <li key={iv.id} className="p-3 bg-white rounded-lg shadow w-full">
                    {/* Batch Name */}
                    <p>
                      <span className="font-medium">{lang === "bn" ? "ব্যাচ:" : "Batch:"}</span>{" "}
                      {batchLabel}
                    </p>

                    {/* Action Type */}
                    <p>
                      <span className="font-medium">{lang === "bn" ? "ধরন:" : "Type:"}</span>{" "}
                      {iv.action_type}
                    </p>

                    {/* Score */}
                    <p>
                      <span className="font-medium">{lang === "bn" ? "সাফল্য স্কোর:" : "Success Score:"}</span>{" "}
                      {iv.success_score}
                    </p>

                    {/* Action Date */}
                    <p>
                      <span className="font-medium">{lang === "bn" ? "তারিখ:" : "Date:"}</span>{" "}
                      {new Date(iv.action_date).toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US")}
                    </p>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>{lang === "bn" ? "কোন ইন্টারভেনশন পাওয়া যায়নি।" : "No interventions found."}</p>
          )}
        </section>

        {/* Loss Events */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-2">{lang === "bn" ? "নাশ হওয়া ঘটনা" : "Loss Events"}</h2>

          {lossEvents.length ? (
            <ul className="space-y-2">
              {lossEvents.map((event) => {
                const batch = batches.find((b) => b.id === event.batch_id);
                const batchLabel = batch
                  ? `${batch.crop_type}${
                      batch.status === "updated"
                        ? lang === "bn"
                          ? " (আপডেট করা হয়েছে)"
                          : " (Updated)"
                        : ""
                    }`
                  : "Unknown Batch";

                return (
                  <li key={event.id} className="p-3 bg-white rounded-lg shadow w-full">
                    {/* Batch Name */}
                    <p>
                      <span className="font-medium">{lang === "bn" ? "ব্যাচ:" : "Batch:"}</span>{" "}
                      {batchLabel}
                    </p>

                    {/* Loss Type */}
                    <p>
                      <span className="font-medium">{lang === "bn" ? "ধরন:" : "Type:"}</span>{" "}
                      {event.loss_type}
                    </p>

                    {/* Loss Amount */}
                    <p>
                      <span className="font-medium">{lang === "bn" ? "পরিমাণ:" : "Amount:"}</span>{" "}
                      {event.loss_amount || "-"}
                    </p>

                    {/* Event Date */}
                    <p>
                      <span className="font-medium">{lang === "bn" ? "তারিখ:" : "Date:"}</span>{" "}
                      {new Date(event.event_date).toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US")}
                    </p>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>{lang === "bn" ? "কোনো নাশ হওয়া ঘটনা নেই।" : "No loss events found."}</p>
          )}
        </section>

        {/* Earned Badges */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-2">{lang === "bn" ? "প্রাপ্ত ব্যাজসমূহ" : "Earned Badges"}</h2>
          {earnedBadges.length ? (
            <div className="flex flex-wrap gap-4">
              {earnedBadges.map((b) => (
                <div
                  key={b.badges.id}
                  className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl shadow-md w-28"
                >
                  <div className="text-3xl mb-2">{b.badges.icon}</div>
                  <div className="text-sm font-medium text-gray-800 text-center">{b.badges.title}</div>
                </div>
              ))}
            </div>
          ) : (
            <p>{lang === "bn" ? "কোনো ব্যাজ পাওয়া যায়নি।" : "No badges found."}</p>
          )}
        </section>

        <div className="mt-10 flex flex-wrap gap-4">
          <button className="bg-blue-500 text-white px-5 py-2 rounded-lg" onClick={exportJSON}>
            {lang === "bn" ? "JSON এক্সপোর্ট করুন" : "Export JSON"}
          </button>
          <button className="bg-green-500 text-white px-5 py-2 rounded-lg" onClick={exportCSV}>
            {lang === "bn" ? "CSV এক্সপোর্ট করুন" : "Export CSV"}
          </button>
        </div>
      </div>
    </div>
  );
}
