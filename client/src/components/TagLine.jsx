import React, { useEffect, useState } from "react";

const taglines = [
  "Trusted by homes, loved by families.❤️",
  "Bringing joy to your doorstep 🏠",
  "Crafted for comfort, delivered with care. ✨",
  "Made with love, for your home 💛",
  "Feel at home, wherever you are ✨",
  "Handpicked comfort for every corner 🌟",
];

export default function TagLine() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % taglines.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative py-16 bg-amber-900 overflow-hidden h-[20vh] flex items-center justify-center">
      {/* Dot Pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="2" fill="#FCD7AD" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pattern)" />
        </svg>
      </div>

      <div className="absolute inset-0 bg-gradient-to-tr from-amber-900 via-[#4B2C10] to-amber-900 opacity-70 z-0" />

      {/* Tagline Text */}
      <div className="relative z-10 text-center">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-semibold text-[#FCD7AD] transition-all duration-500">
          {taglines[index]}
        </h2>
      </div>
    </div>
  );
}
