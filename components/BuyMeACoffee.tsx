"use client";

import { useEffect, useRef } from "react";

export function BuyMeACoffee() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (containerRef.current.querySelector("script")) return;

    const script = document.createElement("script");
    script.src = "https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js";
    script.setAttribute("data-name", "bmc-button");
    script.setAttribute("data-slug", "ruddyide");
    script.setAttribute("data-color", "#41a4ff");
    script.setAttribute("data-emoji", "");
    script.setAttribute("data-font", "Inter");
    script.setAttribute("data-text", "🦆 Buy me a coffee ☕");
    script.setAttribute("data-outline-color", "#000000");
    script.setAttribute("data-font-color", "#000000");
    script.setAttribute("data-coffee-color", "#FFDD00");
    script.async = true;

    containerRef.current.appendChild(script);
  }, []);

  return <div ref={containerRef} className="flex justify-center" />;
}
