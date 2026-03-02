import React, { useState } from 'react';
import { Trash2, Check } from 'lucide-react';
import { Button } from '../components/ui/button';

const RANK_STYLES = {
  D: {
    border: 'border-l-rank-d',
    bg: 'bg-zinc-500/10',
    glow: '0 0 10px rgba(113, 113, 122, 0.3)',
    text: 'text-rank-d',
    checkBg: 'bg-rank-d',
  },
  C: {
    border: 'border-l-rank-c',
    bg: 'bg-emerald-500/10',
    glow: '0 0 15px rgba(16, 185, 129, 0.4)',
    text: 'text-rank-c',
    checkBg: 'bg-rank-c',
  },
  B: {
    border: 'border-l-rank-b',
    bg: 'bg-blue-500/10',
    glow: '0 0 20px rgba(59, 130, 246, 0.5)',
    text: 'text-rank-b',
    checkBg: 'bg-rank-b',
  },
  A: {
    border: 'border-l-rank-a',
    bg: 'bg-purple-500/10',
    glow: '0 0 25px rgba(168, 85, 247, 0.6)',
    text: 'text-rank-a',
    checkBg: 'bg-rank-a',
  },
  S: {
    border: 'border-l-rank-s',
    bg: 'bg-yellow-500/15',
    glow: '0 0 30px rgba(234, 179, 8, 0.8)',
    text: 'text-rank-s',
    checkBg: 'bg-rank-s',
  },
};

const RANK_LABELS = {
  D: 'Routine',
  C: 'Normal',
  B: 'Hard',
  A: 'Very Hard',
  S: 'Epic',
};

const MissionItem = ({ mission, onToggle, onDelete, isJustCompleted = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const style = RANK_STYLES[mission.rank] || RANK_STYLES.D;
  
  return (
    <div
      className={`
        ${style.bg} ${style.border}
        border-l-4 rounded-r-lg p-4
        flex items-center justify-between gap-4
        group transition-all duration-300
        hover:bg-zinc-800/50
        ${mission.completed ? 'opacity-70' : ''}
        ${isJustCompleted ? 'check-pop' : ''}
      `}
      style={{
        boxShadow: isHovered ? style.glow : 'none',
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
            w-7 h-7 rounded-md border-2 flex items-center justify-center
            transition-all duration-200 flex-shrink-0
            ${mission.completed 
              ? `${style.checkBg} border-transparent` 
              : `border-zinc-600 hover:border-zinc-400 bg-transparent`
            }
          `}
          data-testid={`mission-checkbox-${mission.id}`}
          aria-label={mission.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {mission.completed && (
            <Check className="w-4 h-4 text-white" strokeWidth={3} />
          )}
        </button>
        
        {/* Mission content */}
        <div className="flex flex-col min-w-0 flex-1">
          <div className="relative">
            <span 
              className={`
                text-lg font-medium text-white
                transition-all duration-300
                ${mission.completed ? 'text-zinc-500' : ''}
              `}
              data-testid={`mission-name-${mission.id}`}
            >
              {mission.name}
            </span>
            {mission.completed && (
              <div 
                className="absolute top-1/2 left-0 h-0.5 bg-zinc-500 strike-line"
                style={{ width: '100%' }}
              />
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-sm font-semibold ${style.text}`}>
              {mission.rank}-Rank
            </span>
            <span className="text-xs text-zinc-500">
              ({RANK_LABELS[mission.rank]})
            </span>
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
        className="h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
        data-testid={`mission-delete-${mission.id}`}
        aria-label="Delete mission"
      >
        <Trash2 className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default MissionItem;
