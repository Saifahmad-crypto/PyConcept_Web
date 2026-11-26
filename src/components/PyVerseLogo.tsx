import React from 'react';

interface PyVerseLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
}

export const PyVerseLogo: React.FC<PyVerseLogoProps> = ({
  size = 'md',
  showWordmark = true,
}) => {
  const iconDim = size === 'lg' ? 'h-10 w-10' : size === 'sm' ? 'h-7 w-7' : 'h-8 w-8';
  const textSize =
    size === 'lg' ? 'text-xl sm:text-2xl' : size === 'sm' ? 'text-base' : 'text-lg';

  return (
    <span className="inline-flex items-center gap-2.5 select-none whitespace-nowrap shrink-0">
      {/* Crisp vector recreation of the PyVerse flowing P emblem */}
      <svg
        viewBox="0 0 64 64"
        className={`${iconDim} shrink-0`}
        aria-hidden="true"
        fill="none"
      >
        <defs>
          <linearGradient id="pyverse-sky" x1="8" y1="56" x2="48" y2="8" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0EA5E9" />
            <stop offset="55%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient id="pyverse-violet" x1="22" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="60%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
        </defs>
        {/* Left flowing Sky-to-Violet arch */}
        <path
          d="M10 54 C18 46, 17 20, 31 12 C39 7.5, 49 11, 52 19 C43 13.5, 31 16, 25 26 C21 33, 21 46, 16 54 Z"
          fill="url(#pyverse-sky)"
        />
        {/* Inner loop of P */}
        <path
          d="M27 54 L27 25 C27 17, 34 12, 42 13.5 C50 15, 55 21.5, 54 29.5 C53 37.5, 46 42, 37 42 L34 42 L34 35.5 L37.5 35.5 C43 35.5, 47 32.5, 47.5 28 C48 23.5, 44.5 19.5, 39.5 19.5 C35 19.5, 33 22.5, 33 27 L33 54 Z"
          fill="url(#pyverse-violet)"
        />
        {/* Inner ribbon highlight */}
        <path
          d="M36 22 C41 21, 45 24, 45 28 C45 31.5, 41.5 33.5, 36.5 33.5 C39 30.5, 40 26, 36 22 Z"
          fill="#38BDF8"
          opacity="0.85"
        />
        {/* Lower angled accent tail */}
        <path
          d="M34 45 L53 55 L53 41 L47.5 41 L47.5 47.5 L34 42 Z"
          fill="url(#pyverse-violet)"
        />
      </svg>

      {showWordmark && (
        <span className={`font-display font-extrabold tracking-tight ${textSize}`}>
          <span className="text-[#7C3AED]">Py</span>
          <span className="bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] bg-clip-text text-transparent">
            Verse
          </span>
        </span>
      )}
    </span>
  );
};
