import React, { useState } from 'react';
import { Trash2, Check } from 'lucide-react';
import { Button } from './ui/button';
import { RANK_CONFIG, calculateRewards } from '../config/gameConfig';
import EldenRune from './EldenRune';

const MissionItem = ({ mission, onToggle, onDelete, isJustCompleted = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const rankConfig = RANK_CONFIG[mission.rank] || RANK_CONFIG.D;
  const RankIcon = rankConfig.icon;
  const rewards = calculateRewards(mission.rank);
  
  return (
    <div
      className={`
        rounded-xl p-4 border-l-4
        flex items-center justify-between gap-4
        group transition-all duration-300
        hover:scale-[1.01]
        ${mission.completed ? 'opacity-60' : ''}
        ${isJustCompleted ? 'check-pop' : ''}
      `}
      style={{
        backgroundColor: rankConfig.bgColor,
        borderLeftColor: rankConfig.color,
        boxShadow: isHovered ? `0 0 20px ${rankConfig.glowColor}` : 'none',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`mission-item-${mission.id}`}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* Custom Checkbox */}
        <button
          onClick={() => onToggle(mission.id)}
          className={`
            w-8 h-8 rounded-lg border-2 flex items-center justify-center
            transition-all duration-200 flex-shrink-0
          `}
          style={{
            borderColor: mission.completed ? rankConfig.color : '#52525b',
            backgroundColor: mission.completed ? rankConfig.color : 'transparent',
          }}
          data-testid={`mission-checkbox-${mission.id}`}
          aria-label={mission.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {mission.completed && (
            <Check className="w-5 h-5 text-white" strokeWidth={3} />
          )}
        </button>
        
        {/* Mission content */}
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span 
              className={`
                text-lg font-medium
                transition-all duration-300
                ${mission.completed ? 'line-through text-zinc-500' : 'text-white'}
              `}
              data-testid={`mission-name-${mission.id}`}
            >
              {mission.name}
            </span>
          </div>
          
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {/* Rank Badge */}
            <div 
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
              style={{ 
                backgroundColor: `${rankConfig.color}20`,
                border: `1px solid ${rankConfig.borderColor}`,
              }}
            >
              <RankIcon className="w-4 h-4" style={{ color: rankConfig.color }} />
              <span 
                className="text-sm font-bold"
                style={{ color: rankConfig.color }}
              >
                {rankConfig.name}
              </span>
            </div>
            
            {/* Multiplier Badge */}
            <span 
              className="text-xs px-2 py-0.5 rounded"
              style={{ 
                backgroundColor: `${rankConfig.color}20`,
                color: rankConfig.color,
              }}
            >
              {rankConfig.multiplier}x Rewards
            </span>

            {/* Rewards Display */}
            <div className="flex items-center gap-3 ml-auto">
              <div className="flex items-center gap-1 text-blue-400 bg-blue-500/10 px-2 py-1 rounded-lg border border-blue-500/30">
                <span className="text-xs font-bold">+{rewards.xp} XP</span>
              </div>
              <div className="flex items-center gap-1 text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded-lg border border-yellow-500/30">
                <EldenRune size={14} />
                <span className="text-xs font-bold">+{rewards.runes}</span>
              </div>
            </div>
            
            {mission.isRecurring && (
              <span className="text-xs text-zinc-600 px-2 py-0.5 bg-zinc-800 rounded">
                Daily
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Delete button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(mission.id)}
        className="h-10 w-10 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 flex-shrink-0"
        data-testid={`mission-delete-${mission.id}`}
        aria-label="Delete mission"
      >
        <Trash2 className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default MissionItem;
