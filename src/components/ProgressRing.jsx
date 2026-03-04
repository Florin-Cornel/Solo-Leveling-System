import React, { useMemo } from 'react';

const ProgressRing = ({ completed, total, className = '' }) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  // Ring configuration
  const size = 280;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  // Dynamic glow color based on percentage
  const glowColor = useMemo(() => {
    if (percentage === 100) return '#EAB308'; // Gold for complete
    if (percentage >= 75) return '#A855F7';   // Purple
    if (percentage >= 50) return '#3B82F6';   // Blue
    if (percentage >= 25) return '#10B981';   // Green
    return '#71717A';                          // Gray
  }, [percentage]);
  
  const glowClass = useMemo(() => {
    if (percentage === 100) return 'glow-s';
    if (percentage >= 75) return 'glow-a';
    if (percentage >= 50) return 'glow-b';
    if (percentage >= 25) return 'glow-c';
    return 'glow-d';
  }, [percentage]);

  return (
    <div className={`relative flex items-center justify-center ${className}`} data-testid="progress-ring">
      <svg
        width={size}
        height={size}
        className={`transform -rotate-90 ${percentage > 0 ? `ring-pulse ${glowClass}` : ''}`}
        style={{ '--glow-color': glowColor }}
      >
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#27272A"
          strokeWidth={strokeWidth}
          fill="none"
          strokeOpacity="0.3"
        />
        
        {/* Progress ring with gradient */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={glowColor} />
            <stop offset="100%" stopColor={glowColor} stopOpacity="0.7" />
          </linearGradient>
        </defs>
        
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: 'stroke-dashoffset 1s ease-out, stroke 0.5s ease',
            filter: `drop-shadow(0 0 8px ${glowColor})`
          }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span 
          className="font-heading text-6xl md:text-7xl font-extrabold tracking-tight text-white"
          style={{ 
            textShadow: percentage > 0 ? `0 0 20px ${glowColor}40` : 'none',
            transition: 'text-shadow 0.5s ease'
          }}
          data-testid="progress-percentage"
        >
          {percentage}%
        </span>
        <span 
          className="text-lg md:text-xl text-zinc-400 font-medium mt-2"
          data-testid="progress-fraction"
        >
          {completed}/{total} Missions Completed
        </span>
      </div>
    </div>
  );
};

export default ProgressRing;
