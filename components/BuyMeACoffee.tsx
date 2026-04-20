"use client";

import { useEffect, useRef } from "react";

export function BuyMeACoffee() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (container.dataset.bmcLoaded === "true") return;
    container.dataset.bmcLoaded = "true";

    const html = `<script type="text/javascript" src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js" data-name="bmc-button" data-slug="ruddyide" data-color="#41a4ff" data-emoji="" data-font="Inter" data-text="🦆 Buy me a coffee ☕" data-outline-color="#000000" data-font-color="#000000" data-coffee-color="#FFDD00"></script>`;

    const range = document.createRange();
    range.selectNode(container);
    const fragment = range.createContextualFragment(html);
    container.appendChild(fragment);
  }, []);

  return <div ref={containerRef} className="flex justify-center" />;
}
