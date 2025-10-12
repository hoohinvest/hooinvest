'use client';

import { useState } from 'react';

interface FlipCardProps {
  title: string;
  blurb: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function FlipCard({ title, blurb, icon, className = '' }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={`flip-card-container ${className}`}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onFocus={() => setIsFlipped(true)}
      onBlur={() => setIsFlipped(false)}
      tabIndex={0}
      role="button"
      aria-label={`${title}: ${blurb}`}
    >
      <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}>
        {/* FRONT */}
        <div className="flip-card-front panel p-5 flex items-center justify-center gap-3 rounded-2xl h-full">
          {icon && <div aria-hidden="true">{icon}</div>}
          <span className="text-sm md:text-base font-semibold text-[#E8EEF5]">
            {title}
          </span>
        </div>

        {/* BACK */}
        <div className="flip-card-back panel p-5 rounded-2xl h-full flex items-center justify-center">
          <p className="text-xs md:text-sm text-[#A9B4C0] text-center leading-relaxed">
            {blurb}
          </p>
        </div>
      </div>
    </div>
  );
}

