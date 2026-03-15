import React from 'react';

const EldenRune = ({ className = '', size = 24 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`elden-rune-pulse ${className}`}
    >
      <defs>
        <linearGradient id="runeGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="50%" stopColor="#FFA500" />
          <stop offset="100%" stopColor="#FFD700" />
        </linearGradient>
        <filter id="runeGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      {/* Outer ring */}
      <circle cx="24" cy="24" r="20" stroke="url(#runeGold)" strokeWidth="2" fill="none" filter="url(#runeGlow)" />
      
      {/* Inner decorative ring */}
      <circle cx="24" cy="24" r="16" stroke="#B8860B" strokeWidth="1" fill="none" opacity="0.7" />
      
      {/* Great Rune symbol - central arc */}
      <path 
        d="M24 8 L24 16 M24 32 L24 40" 
        stroke="url(#runeGold)" 
        strokeWidth="2.5" 
        strokeLinecap="round"
        filter="url(#runeGlow)"
      />
      
      {/* Horizontal arms */}
      <path 
        d="M8 24 L16 24 M32 24 L40 24" 
        stroke="url(#runeGold)" 
        strokeWidth="2.5" 
        strokeLinecap="round"
        filter="url(#runeGlow)"
      />
      
      {/* Diagonal elements */}
      <path 
        d="M12 12 L18 18 M30 30 L36 36 M36 12 L30 18 M18 30 L12 36" 
        stroke="url(#runeGold)" 
        strokeWidth="2" 
        strokeLinecap="round"
        filter="url(#runeGlow)"
      />
      
      {/* Central circle */}
      <circle cx="24" cy="24" r="6" fill="url(#runeGold)" filter="url(#runeGlow)" />
      <circle cx="24" cy="24" r="3" fill="#1a1a1b" />
      
      {/* Inner detail dots */}
      <circle cx="24" cy="14" r="2" fill="url(#runeGold)" />
      <circle cx="24" cy="34" r="2" fill="url(#runeGold)" />
      <circle cx="14" cy="24" r="2" fill="url(#runeGold)" />
      <circle cx="34" cy="24" r="2" fill="url(#runeGold)" />
    </svg>
  );
};

export default EldenRune;
