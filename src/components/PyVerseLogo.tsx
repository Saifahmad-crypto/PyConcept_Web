import React from 'react';

interface PyVerseLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  theme?: 'light' | 'dark';
}

export const PyVerseLogo: React.FC<PyVerseLogoProps> = ({
  size = 'md',
  showWordmark = true,
  theme = 'light',
}) => {
  const iconDim = size === 'lg' ? 'h-10 w-10' : size === 'sm' ? 'h-7 w-7' : 'h-8 w-8';
  const textSize =
    size === 'lg' ? 'text-xl sm:text-2xl' : size === 'sm' ? 'text-base' : 'text-lg';

  const isDark = theme === 'dark';

  return (
    <span className="inline-flex items-center gap-2.5 select-none whitespace-nowrap shrink-0">
      {/* Geometric PyVerse emblem — high-contrast red, black, and off-white */}
      <svg
        viewBox="0 0 64 64"
        className={`${iconDim} shrink-0`}
        aria-hidden="true"
        fill="none"
      >
        <rect
          x="4"
          y="4"
          width="56"
          height="56"
          rx="14"
          className={isDark ? 'fill-[#190909] stroke-[#3A1D1D]' : 'fill-[#100303] stroke-[#100303] dark:fill-[#190909] dark:stroke-[#3A1D1D]'}
          strokeWidth="2"
        />
        {/* Kinetic orbital frame */}
        <path
          d="M16 48 L16 18 C16 14, 19 12, 23 12 L38 12 C45.5 12, 50 17, 50 24.5 C50 32, 45.5 37, 38 37 L26 37"
          stroke="#FBF5F9"
          strokeWidth="5"
          strokeLinecap="square"
        />
        {/* Signal red logic vector */}
        <path
          d="M26 50 L26 24 L37 24 C40 24, 42 25.8, 42 28.5 C42 31.2, 40 33, 37 33 L26 33"
          stroke="#E10906"
          strokeWidth="4.5"
          strokeLinecap="square"
        />
        <rect x="40" y="42" width="10" height="8" rx="1.5" fill="#E10906" />
      </svg>

      {showWordmark && (
        <span className={`font-display font-extrabold tracking-tight ${textSize}`}>
          <span className={isDark ? 'text-[#FBF5F9]' : 'text-[#100303] dark:text-[#FBF5F9]'}>Py</span>
          <span className="text-[#E10906]">Verse</span>
        </span>
      )}
    </span>
  );
};
