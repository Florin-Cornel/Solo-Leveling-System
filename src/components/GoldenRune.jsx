import React from 'react';

const GoldenRune = ({ className = '', size = 24 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ filter: 'drop-shadow(0 0 4px #FFD700)' }}
    >
      <path 
        d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" 
        fill="#FFD700" 
        stroke="#B8860B" 
        strokeWidth="1.5" 
        strokeLinejoin="round"
      />
      <path 
        d="M12 5V15M9 7L15 13M15 7L9 13" 
        stroke="#FFF" 
        strokeWidth="0.5" 
        opacity="0.6"
      />
    </svg>
  );
};

export default GoldenRune;
