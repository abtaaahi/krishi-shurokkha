interface PestResultProps {
  data: {
    pestName: string;
    risk: string;
    actionPlan: string;
  };
}

export default function PestResult({ data }: PestResultProps) {
  console.log("Raw risk from API:", data.risk);

  // Extract first risk keyword
  let riskLevel = "নিম্ন"; // default
  if (data.risk.includes("উচ্চ")) riskLevel = "উচ্চ";
  else if (data.risk.includes("মাঝারি")) riskLevel = "মাঝারি";

  console.log("Extracted riskLevel:", riskLevel);

  // Determine color
  let riskColor =
    riskLevel === "উচ্চ"
      ? "text-red-600"
      : riskLevel === "মাঝারি"
      ? "text-yellow-600"
      : "text-green-600";

  return (
    <div className="w-full max-w-md mt-8 p-6 bg-white rounded-xl shadow-lg flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-green-700">🐞 ফলাফল</h2>

      <p>
        <strong>🆔 শনাক্তকরণ:</strong> {data.pestName || "পোকা/রোগ"}
      </p>

      <p>
        <strong>⚠ ঝুঁকি মাত্রা:</strong>{" "}
        <span className={`font-bold ${riskColor}`}>{riskLevel}</span>
      </p>

      <h3 className="font-bold mt-2">🛠 চিকিৎসা পরিকল্পনা</h3>
      <p className="whitespace-pre-line">{data.actionPlan}</p>
    </div>
  );
}
