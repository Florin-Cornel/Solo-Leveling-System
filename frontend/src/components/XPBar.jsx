import React from 'react';
import { Zap } from 'lucide-react';

// Calculate XP needed for a level: Level^1.5 × 100
export const getXPForLevel = (level) => {
  return Math.floor(Math.pow(level, 1.5) * 100);
};

// Calculate total XP needed to reach a level from level 1
export const getTotalXPForLevel = (level) => {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += getXPForLevel(i);
  }
  return total;
};

// Get current level from total XP
export const getLevelFromXP = (totalXP) => {
  let level = 1;
  let xpNeeded = 0;
  
  while (level < 100) {
    xpNeeded += getXPForLevel(level);
    if (totalXP < xpNeeded) break;
    level++;
  }
  
  return Math.min(level, 100);
};

// Get XP progress within current level
export const getXPProgress = (totalXP) => {
  const currentLevel = getLevelFromXP(totalXP);
  const xpForCurrentLevel = getTotalXPForLevel(currentLevel);
  const xpInCurrentLevel = totalXP - xpForCurrentLevel;
  const xpNeededForNextLevel = getXPForLevel(currentLevel);
  
  return {
    current: xpInCurrentLevel,
    needed: xpNeededForNextLevel,
    percentage: Math.min(100, (xpInCurrentLevel / xpNeededForNextLevel) * 100),
  };
};

const XPBar = ({ totalXP, level, className = '' }) => {
  const progress = getXPProgress(totalXP);
  const isMaxLevel = level >= 100;
  
  return (
    <div 
      className={`bg-[#1a1a1b] rounded-xl p-4 border border-blue-900/30 ${className}`}
      style={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.15)' }}
      data-testid="xp-bar-container"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div 
            className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center"
            style={{ boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)' }}
          >
            <span className="font-heading font-bold text-white text-lg">{level}</span>
          </div>
          <div>
            <span className="text-sm text-blue-300 font-medium">Level</span>
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-zinc-500">
                {isMaxLevel ? 'MAX LEVEL' : `${(progress.needed - progress.current).toLocaleString()} XP to next`}
              </span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <span className="text-lg font-bold text-blue-400" data-testid="xp-display">
            {progress.current.toLocaleString()} / {progress.needed.toLocaleString()}
          </span>
          <span className="text-blue-300 ml-1">XP</span>
        </div>
      </div>
      
      {/* XP Progress Bar */}
      <div className="relative h-4 bg-blue-950/50 rounded-full overflow-hidden border border-blue-800/30">
        {/* Animated background */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.3) 50%, transparent 100%)',
            animation: 'shimmer 2s infinite',
          }}
        />
        
        {/* Progress fill */}
        <div 
          className="h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
          style={{ 
            width: `${progress.percentage}%`,
            background: 'linear-gradient(90deg, #1E40AF 0%, #3B82F6 50%, #60A5FA 100%)',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.8), inset 0 1px 0 rgba(255,255,255,0.3)',
          }}
          data-testid="xp-progress-fill"
        >
          {/* Shine effect */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
              animation: 'xpShine 3s infinite',
            }}
          />
        </div>
        
        {/* Glow effect at the end of progress */}
        <div 
          className="absolute top-0 h-full w-2 rounded-full"
          style={{ 
            left: `calc(${progress.percentage}% - 4px)`,
            background: 'radial-gradient(circle, rgba(96, 165, 250, 1) 0%, transparent 70%)',
            filter: 'blur(2px)',
            opacity: progress.percentage > 5 ? 1 : 0,
          }}
        />
      </div>
    </div>
  );
};

export default XPBar;
