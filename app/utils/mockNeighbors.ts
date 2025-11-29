// app/utils/mockNeighbors.ts

export type RiskLevel = "Low" | "Medium" | "High";

export interface Neighbor {
  id: number;
  position: { lat: number; lng: number };
  risk: RiskLevel;
  cropType: string;
  lastUpdated: Date;
}

const cropsEn = ["Rice", "Wheat", "Maize", "Vegetables", "Fruits"];
const cropsBn = ["ধান", "গম", "ভুট্টা", "সবজি", "ফল"];

/**
 * Generate mock neighbors around a central location
 * @param center The center coordinates (farmer or district)
 * @param count Number of neighbors to generate (default 12)
 * @param lang Language code for localization ('en' | 'bn')
 * @returns Array of Neighbor objects
 */
export function generateMockNeighbors(
  center: { lat: number; lng: number },
  count: number = 12,
  lang: "en" | "bn" = "en"
): Neighbor[] {
  const neighbors: Neighbor[] = [];
  const riskLevels: RiskLevel[] = ["Low", "Medium", "High"];
  const crops = lang === "bn" ? cropsBn : cropsEn;

  for (let i = 0; i < count; i++) {
    // Random offset within ~1 km radius
    const latOffset = (Math.random() - 0.5) * 0.02;
    const lngOffset = (Math.random() - 0.5) * 0.02;

    const neighbor: Neighbor = {
      id: i + 1,
      position: {
        lat: center.lat + latOffset,
        lng: center.lng + lngOffset
      },
      risk: riskLevels[Math.floor(Math.random() * riskLevels.length)],
      cropType: crops[Math.floor(Math.random() * crops.length)],
      lastUpdated: new Date(
        Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000) // last 24h
      )
    };

    neighbors.push(neighbor);
  }

  return neighbors;
}
