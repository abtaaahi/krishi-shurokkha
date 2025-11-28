"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function RouteChangeListener({ onChange }: { onChange: () => void }) {
  const pathname = usePathname();

  useEffect(() => {
    onChange(); // Trigger loading animation
  }, [pathname]);

  return null;
}
