"use client";

import LocalRiskMap from "./LocalRiskMap";
import { useLanguage } from "../context/LanguageContext";

const RISK_COLORS = {
  Low: "#4CAF50",
  Medium: "#FFC107",
  High: "#E53935"
};

export default function RiskMapPage() {
  const { lang } = useLanguage();

  const heading = lang === "bn" ? "স্থানীয় ঝুঁকি মানচিত্র" : "Local Risk Map";
  const subheading =
    lang === "bn"
      ? "এই মানচিত্রটি আপনার এলাকার আশেপাশের ফার্মগুলোর সম্ভাব্য ক্ষতি ঝুঁকি দেখায়। নীল পিন আপনার অবস্থান, অন্য রঙিন পিনগুলো আশেপাশের ফার্মের ঝুঁকি নির্দেশ করে। একটি পিনে ট্যাপ করলে ফসলের ধরন, ঝুঁকির মাত্রা এবং সর্বশেষ আপডেট সময় দেখানো হবে। দয়া করে আপনার অবস্থান সক্ষম করুন বা জেলা নির্বাচন করুন।"
      : "This map shows potential risk levels for farms around your area. The blue pin indicates your location, while other colored pins show neighbors' risk levels. Tap a pin to see crop type, risk, and last updated time. Please enable your location or select a district.";

  const legendItems = [
    { label: lang === "bn" ? "নিম্ন ঝুঁকি" : "Low Risk", color: RISK_COLORS.Low },
    { label: lang === "bn" ? "মধ্য ঝুঁকি" : "Medium Risk", color: RISK_COLORS.Medium },
    { label: lang === "bn" ? "উচ্চ ঝুঁকি" : "High Risk", color: RISK_COLORS.High }
  ];

  return (
    <main style={{ padding: "1rem", maxWidth: "700px", margin: "0 auto", fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Heading */}
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          marginBottom: "0.75rem",
          textAlign: "center",
          color: "#3E2723"
        }}
      >
        {heading}
      </h1>

      {/* Subheading */}
      <p
        style={{
          fontSize: "1.1rem",
          marginBottom: "1.5rem",
          textAlign: "center",
          color: "#5D4037",
          lineHeight: 1.6
        }}
      >
        {subheading}
      </p>

      {/* Risk Legend */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          marginBottom: "16px"
        }}
      >
        {legendItems.map(item => (
          <div
            key={item.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor: "#FFF8E1",
              padding: "4px 8px",
              borderRadius: "6px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "16px",
                height: "16px",
                backgroundColor: item.color,
                borderRadius: "50%",
                border: "1px solid #3E2723"
              }}
            />
            <span style={{ fontSize: "0.95rem", color: "#3E2723" }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Map Component */}
      <LocalRiskMap />
    </main>
  );
}
