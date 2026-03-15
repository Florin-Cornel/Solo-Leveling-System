import React from 'react';
import { 
  Sword, 
  Zap, 
  Heart, 
  Brain, 
  Eye,
  Plus,
  User,
  TrendingUp
} from 'lucide-react';
import { Button } from './ui/button';

const ATTRIBUTES = [
  { 
    id: 'strength', 
    name: 'Strength', 
    icon: Sword, 
    color: '#EF4444',
    description: 'Physical power and damage',
  },
  { 
    id: 'agility', 
    name: 'Agility', 
    icon: Zap, 
    color: '#22C55E',
    description: 'Speed and reflexes',
  },
  { 
    id: 'vitality', 
    name: 'Vitality', 
    icon: Heart, 
    color: '#EC4899',
    description: 'Health and endurance',
  },
  { 
    id: 'intelligence', 
    name: 'Intelligence', 
    icon: Brain, 
    color: '#3B82F6',
    description: 'Mental capacity and magic',
  },
  { 
    id: 'perception', 
    name: 'Perception', 
    icon: Eye, 
    color: '#A855F7',
    description: 'Awareness and detection',
  },
];

const StatusPage = ({ 
  attributes, 
  availablePoints, 
  level,
  onAllocatePoint,
  totalXP,
  lifetimeMissions,
}) => {
  return (
    <div className="space-y-6 slide-in-right" data-testid="status-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <User className="w-7 h-7 text-purple-400" />
          <h2 className="font-heading text-2xl font-bold text-white">Hunter Status</h2>
        </div>
        
        {/* Available Points Badge */}
        {availablePoints > 0 && (
          <div 
            className="flex items-center gap-2 bg-purple-500/20 border border-purple-500/40 px-4 py-2 rounded-full animate-pulse"
            style={{ boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)' }}
            data-testid="available-points"
          >
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <span className="font-bold text-purple-300">{availablePoints} Points Available</span>
          </div>
        )}
      </div>

      {/* Level & Stats Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#1a1a1b] rounded-xl p-4 border border-zinc-800 text-center">
          <span className="text-zinc-500 text-sm">Level</span>
          <p className="text-3xl font-heading font-bold text-blue-400">{level}</p>
        </div>
        <div className="bg-[#1a1a1b] rounded-xl p-4 border border-zinc-800 text-center">
          <span className="text-zinc-500 text-sm">Total XP</span>
          <p className="text-2xl font-heading font-bold text-green-400">{totalXP.toLocaleString()}</p>
        </div>
        <div className="bg-[#1a1a1b] rounded-xl p-4 border border-zinc-800 text-center">
          <span className="text-zinc-500 text-sm">Missions</span>
          <p className="text-2xl font-heading font-bold text-yellow-400">{lifetimeMissions}</p>
        </div>
      </div>

      {/* Attributes */}
      <div className="space-y-3" data-testid="attributes-list">
        {ATTRIBUTES.map((attr) => {
          const value = attributes[attr.id] || 10;
          const Icon = attr.icon;
          const canAllocate = availablePoints > 0;
          
          return (
            <div
              key={attr.id}
              className="bg-[#1a1a1b] rounded-xl p-4 border border-zinc-800 transition-all hover:border-zinc-700"
              style={{ 
                borderLeftWidth: '4px',
                borderLeftColor: attr.color,
              }}
              data-testid={`attribute-${attr.id}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${attr.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: attr.color }} />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-white">{attr.name}</h3>
                    <p className="text-sm text-zinc-500">{attr.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Value display */}
                  <div 
                    className="w-16 h-16 rounded-xl flex items-center justify-center border-2"
                    style={{ 
                      borderColor: attr.color,
                      backgroundColor: `${attr.color}10`,
                      boxShadow: `0 0 15px ${attr.color}30`,
                    }}
                  >
                    <span 
                      className="text-2xl font-heading font-bold"
                      style={{ color: attr.color }}
                      data-testid={`${attr.id}-value`}
                    >
                      {value}
                    </span>
                  </div>
                  
                  {/* Allocate button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onAllocatePoint(attr.id)}
                    disabled={!canAllocate}
                    className={`
                      w-12 h-12 rounded-xl transition-all
                      ${canAllocate 
                        ? 'bg-purple-500/20 hover:bg-purple-500/40 text-purple-400 hover:scale-110' 
                        : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                      }
                    `}
                    style={canAllocate ? { boxShadow: '0 0 15px rgba(168, 85, 247, 0.3)' } : {}}
                    data-testid={`allocate-${attr.id}`}
                  >
                    <Plus className="w-6 h-6" />
                  </Button>
                </div>
              </div>
              
              {/* Progress bar showing relative stat */}
              <div className="mt-3 h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${Math.min(100, (value / 100) * 100)}%`,
                    backgroundColor: attr.color,
                    boxShadow: `0 0 10px ${attr.color}`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Stats */}
      <div className="bg-[#1a1a1b] rounded-xl p-5 border border-zinc-800">
        <h3 className="text-lg font-bold text-zinc-300 mb-3">Total Power</h3>
        <div className="flex items-center justify-between">
          <span className="text-zinc-500">Combined Attributes</span>
          <span className="text-3xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            {Object.values(attributes).reduce((sum, val) => sum + val, 0)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatusPage;
