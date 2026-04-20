"use client";

import { useEffect, useRef } from "react";

export function BuyMeACoffee() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (container.dataset.bmcLoaded === "true") return;
    container.dataset.bmcLoaded = "true";

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

    document.body.appendChild(script);

    const originalWriteln = document.writeln.bind(document);
    const originalWrite = document.write.bind(document);
    let captured = "";

    document.writeln = (markup: string) => {
      captured += markup + "\n";
    };
    document.write = (markup: string) => {
      captured += markup;
    };

    const restore = () => {
      document.writeln = originalWriteln;
      document.write = originalWrite;
      if (captured) {
        container.innerHTML = captured;
      }
    };

    script.addEventListener("load", restore);
    script.addEventListener("error", restore);
  }, []);

  return <div ref={containerRef} className="flex justify-center" />;
}
