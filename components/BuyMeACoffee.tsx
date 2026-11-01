"use client";

export function BuyMeACoffee() {
  return (
    <a
      href="https://www.buymeacoffee.com/ruddyide"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex justify-center"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://img.buymeacoffee.com/button-api/?text=Support&emoji=☕&slug=ruddyide&button_colour=41a5ff&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=FFDD00"
        alt="Support on Buy Me a Coffee"
        className="h-9 w-auto"
      />
    </a>
  );
}
