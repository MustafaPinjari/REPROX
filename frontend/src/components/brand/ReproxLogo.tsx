import React from 'react';

interface ReproxLogoProps {
  className?: string;
  showTagline?: boolean;
  light?: boolean;
}

export const ReproxLogo: React.FC<ReproxLogoProps> = ({
  className = '',
  showTagline = true,
  light = false,
}) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Stylized Gradient R Emblem */}
      <div className="relative w-8 h-8 shrink-0 flex items-center justify-center">
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs"
        >
          <defs>
            <linearGradient id="reproxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD2A0" />
              <stop offset="35%" stopColor="#EFB6C8" />
              <stop offset="70%" stopColor="#8174A0" />
              <stop offset="100%" stopColor="#A888B5" />
            </linearGradient>
          </defs>
          {/* Ribbon R path */}
          <path
            d="M8 6C8 4.89543 8.89543 4 10 4H20C24.4183 4 28 7.58172 28 12C28 15.6542 25.5492 18.7351 22.1818 19.6749L28.2 29.5C28.75 30.4 28.1 31.5 27 31.5H22C21.3 31.5 20.65 31.1 20.3 30.5L15 21H13V29.5C13 30.6046 12.1046 31.5 11 31.5H10C8.89543 31.5 8 30.6046 8 29.5V6Z"
            fill="url(#reproxGrad)"
          />
          <path
            d="M13 9V16H19.5C21.433 16 23 14.433 23 12.5C23 10.567 21.433 9 19.5 9H13Z"
            fill={light ? '#0C3428' : '#FAF7F2'}
          />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <span
          className={`font-black text-lg tracking-tight leading-none font-sans ${
            light ? 'text-white' : 'text-slate-950'
          }`}
        >
          REPROX
        </span>
        {showTagline && (
          <span
            className={`text-[10px] tracking-tight font-medium mt-0.5 leading-none ${
              light ? 'text-emerald-200/80' : 'text-slate-500'
            }`}
          >
            Voice to Repro. Tests that prove.
          </span>
        )}
      </div>
    </div>
  );
};
