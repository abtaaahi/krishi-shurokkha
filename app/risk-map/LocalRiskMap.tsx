"use client";

import { useState, useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { generateMockNeighbors, Neighbor } from "../utils/mockNeighbors";
import { useLanguage } from "../context/LanguageContext";

const DISTRICT_COORDS = {
  chattogram: { lat: 22.3569, lng: 91.7832 },
  dhaka: { lat: 23.8103, lng: 90.4125 },
  rajshahi: { lat: 24.3636, lng: 88.6241 },
  khulna: { lat: 22.8456, lng: 89.5403 },
  barishal: { lat: 22.7010, lng: 90.3535 },
  rangpur: { lat: 25.7439, lng: 89.2752 },
  sylhet: { lat: 24.8949, lng: 91.8687 },
  mymensingh: { lat: 24.7471, lng: 90.4203 }
};

const DISTRICT_NAMES_BN: Record<string, string> = {
  chattogram: "চট্টগ্রাম",
  dhaka: "ঢাকা",
  rajshahi: "রাজশাহী",
  khulna: "খুলনা",
  barishal: "বরিশাল",
  rangpur: "রংপুর",
  sylhet: "সিলেট",
  mymensingh: "ময়মনসিংহ"
};

const riskMap = {
  en: { Low: "Low", Medium: "Medium", High: "High" },
  bn: { Low: "নিম্ন", Medium: "মধ্য", High: "উচ্চ" }
};

const RISK_COLORS = {
  Low: "#4CAF50",       // Green
  Medium: "#FFC107",    // Yellow
  High: "#E53935"       // Red
};

export default function LocalRiskMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const { lang } = useLanguage();

  const [center, setCenter] = useState(DISTRICT_COORDS.dhaka);
  const [needDistrict, setNeedDistrict] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [farmerMarker, setFarmerMarker] = useState<google.maps.Marker | null>(null);
  const [neighborMarkers, setNeighborMarkers] = useState<google.maps.Marker[]>([]);
  const [neighbors, setNeighbors] = useState<Neighbor[]>([]);

  // Load Google Maps
  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLEAPIKEY!,
      version: "weekly"
    });

    loader.load()
      .then(() => setMapsLoaded(true))
      .catch(err => console.error("Google Maps failed to load:", err));
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapsLoaded || !mapRef.current) return;

    const mapInstance = new google.maps.Map(mapRef.current, {
      center,
      zoom: 13,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      gestureHandling: "greedy"
    });

    setMap(mapInstance);
    return () => google.maps.event.clearInstanceListeners(mapInstance);
  }, [mapsLoaded]);

  // Place farmer marker & generate neighbors
  useEffect(() => {
    if (!map || !center) return;

    if (farmerMarker) farmerMarker.setMap(null);

    const marker = new google.maps.Marker({
      position: center,
      map,
      title: lang === "bn" ? "কৃষকের অবস্থান" : "Farmer's Location",
      icon: { url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }
    });
    setFarmerMarker(marker);

    map.setZoom(14);
    map.setCenter(center);

    const localizedNeighbors = generateMockNeighbors(center, 12, lang);
    setNeighbors(localizedNeighbors);
  }, [map, center, lang]);

  // Add neighbor markers with styled, localized pop-ups
  useEffect(() => {
    if (!map) return;

    neighborMarkers.forEach(m => m.setMap(null));

    const newMarkers = neighbors.map(n => {
      const marker = new google.maps.Marker({
        position: n.position,
        map,
        title: n.risk,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: RISK_COLORS[n.risk],
          fillOpacity: 0.8,
          scale: 10,
          strokeColor: "#fff",
          strokeWeight: 2
        }
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding:8px; font-size:14px; line-height:1.5; background:#FFF8E1; border-radius:6px; color:#3E2723;">
            <strong>${lang === "bn" ? "ফসল" : "Crop"}:</strong> ${n.cropType}<br/>
            <strong>${lang === "bn" ? "ঝুঁকি" : "Risk"}:</strong> ${riskMap[lang][n.risk]}<br/>
            <strong>${lang === "bn" ? "শেষ আপডেট" : "Last Updated"}:</strong> ${n.lastUpdated.toLocaleTimeString()}
          </div>
        `
      });

      marker.addListener("click", () => infoWindow.open(map, marker));
      return marker;
    });

    setNeighborMarkers(newMarkers);
  }, [map, neighbors, lang]);

  // Request live location
  const handleLocationRequest = () => {
    navigator.geolocation.getCurrentPosition(
      pos => {
        setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setNeedDistrict(false);
      },
      err => {
        console.error("Geolocation error:", err);
        setNeedDistrict(true);
      },
      { timeout: 10000 }
    );
  };

  const handleDistrictSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const district = e.target.value.toLowerCase();
    if (DISTRICT_COORDS[district]) {
      setCenter(DISTRICT_COORDS[district]);
      setNeedDistrict(false);
    }
  };

  return (
    <div style={{ padding: "16px", maxWidth: "650px", margin: "0 auto", fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "20px" }}>
        <button
          onClick={handleLocationRequest}
          style={{
            padding: "16px",
            backgroundColor: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
          }}
        >
          {lang === "bn" ? "লাইভ অবস্থান চালু করুন" : "Enable Live Location"}
        </button>

        {needDistrict && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
            <label htmlFor="district-select" style={{ fontWeight: 600, fontSize: "16px", color: "#3E2723" }}>
              {lang === "bn" ? "আপনার জেলা নির্বাচন করুন" : "Select Your District"}
            </label>
            <select
              id="district-select"
              onChange={handleDistrictSelect}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #FFC107",
                fontSize: "16px",
                backgroundColor: "#FFF8E1",
                color: "#3E2723",
                cursor: "pointer",
                appearance: "none"
              }}
            >
              <option value="">{lang === "bn" ? "নির্বাচন করুন" : "Choose one"}</option>
              {Object.keys(DISTRICT_COORDS).map(d => (
                <option key={d} value={d}>
                  {lang === "bn" ? DISTRICT_NAMES_BN[d] : d.charAt(0).toUpperCase() + d.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "calc(100vh - 250px)",
          borderRadius: "12px",
          boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
          backgroundColor: "#FFF8E1"
        }}
      />
    </div>
  );
}
