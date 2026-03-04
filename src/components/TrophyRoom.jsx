import React from 'react';
import { Trophy, Lock, CheckCircle, Crown, Gem, Scroll, Sparkles } from 'lucide-react';

// Hunter Ranks based on Lifetime Missions
const HUNTER_RANKS = [
  { id: 'e-rank', name: 'E-Rank', description: 'Starter Hunter', threshold: 0, color: '#71717A' },
  { id: 'd-rank', name: 'D-Rank', description: '25 Missions Completed', threshold: 25, color: '#22C55E' },
  { id: 'c-rank', name: 'C-Rank', description: '100 Missions Completed', threshold: 100, color: '#3B82F6' },
  { id: 'b-rank', name: 'B-Rank', description: '250 Missions Completed', threshold: 250, color: '#8B5CF6' },
  { id: 'a-rank', name: 'A-Rank', description: '400 Missions Completed', threshold: 400, color: '#F97316' },
  { id: 's-rank', name: 'S-Rank', description: 'Shadow Monarch Status', threshold: 500, color: '#EAB308' },
];

// Special Achievement
const ELDEN_LORD = {
  id: 'elden-lord',
  name: 'Elden Lord',
  description: 'Accumulate 10,000 Lifetime Runes',
  threshold: 10000,
  type: 'runes',
};

const TrophyRoom = ({ lifetimeMissions, lifetimeRunes }) => {
  // Get current hunter rank
  const getCurrentRank = () => {
    for (let i = HUNTER_RANKS.length - 1; i >= 0; i--) {
      if (lifetimeMissions >= HUNTER_RANKS[i].threshold) {
        return HUNTER_RANKS[i];
      }
    }
    return HUNTER_RANKS[0];
  };

  const currentRank = getCurrentRank();
  const nextRank = HUNTER_RANKS.find(r => r.threshold > lifetimeMissions);
  const isEldenLord = lifetimeRunes >= ELDEN_LORD.threshold;

  const getProgress = (rank) => {
    if (lifetimeMissions >= rank.threshold) return 100;
    const prevRank = HUNTER_RANKS[HUNTER_RANKS.indexOf(rank) - 1];
    const prevThreshold = prevRank ? prevRank.threshold : 0;
    const range = rank.threshold - prevThreshold;
    const progress = lifetimeMissions - prevThreshold;
    return Math.min(100, Math.max(0, (progress / range) * 100));
  };

  const unlockedRanks = HUNTER_RANKS.filter(r => lifetimeMissions >= r.threshold).length;

  return (
    <div className="space-y-6" data-testid="trophy-room">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Trophy className="w-7 h-7 text-yellow-500" />
          <h2 className="font-heading text-2xl font-bold text-white">Trophy Room</h2>
        </div>
        
        {/* Current Rank Badge */}
        <div 
          className="flex items-center gap-2 px-4 py-2 rounded-full border-2"
          style={{ 
            borderColor: currentRank.color,
            backgroundColor: `${currentRank.color}20`,
            boxShadow: `0 0 15px ${currentRank.color}40`
          }}
        >
          <Crown className="w-5 h-5" style={{ color: currentRank.color }} />
          <span className="font-bold" style={{ color: currentRank.color }}>
            {currentRank.name} Hunter
          </span>
        </div>
      </div>

      {/* Progress to Next Rank */}
      {nextRank && (
        <div className="bg-[#1a1a1b] rounded-xl p-5 border border-zinc-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-zinc-400 font-medium">Progress to {nextRank.name}</span>
            <span className="text-white font-bold">
              {lifetimeMissions}/{nextRank.threshold} Missions
            </span>
          </div>
          <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${getProgress(nextRank)}%`,
                backgroundColor: nextRank.color,
                boxShadow: `0 0 10px ${nextRank.color}`
              }}
            />
          </div>
          <p className="text-sm text-zinc-500 mt-2">
            {nextRank.threshold - lifetimeMissions} more missions to rank up!
          </p>
        </div>
      )}

      {/* Hunter Ranks Grid */}
      <div>
        <h3 className="font-heading text-lg font-bold text-zinc-300 mb-4 flex items-center gap-2">
          <Crown className="w-5 h-5 text-yellow-500" />
          Hunter Ranks ({unlockedRanks}/{HUNTER_RANKS.length})
        </h3>
        
        <div 
          className="grid grid-cols-2 sm:grid-cols-3 gap-4"
          data-testid="hunter-ranks-grid"
        >
          {HUNTER_RANKS.map((rank) => {
            const unlocked = lifetimeMissions >= rank.threshold;
            
            return (
              <div
                key={rank.id}
                className={`
                  relative p-4 rounded-xl border-2 transition-all text-center
                  ${unlocked ? '' : 'grayscale opacity-50'}
                `}
                style={{ 
                  borderColor: unlocked ? rank.color : '#3f3f46',
                  backgroundColor: unlocked ? `${rank.color}15` : '#1a1a1b',
                  boxShadow: unlocked ? `0 0 20px ${rank.color}30` : 'none'
                }}
                data-testid={`rank-${rank.id}`}
              >
                {/* Lock/Unlock Icon */}
                <div className="absolute top-2 right-2">
                  {unlocked ? (
                    <CheckCircle className="w-5 h-5" style={{ color: rank.color }} />
                  ) : (
                    <Lock className="w-5 h-5 text-zinc-600" />
                  )}
                </div>

                {/* Badge Icon */}
                <div 
                  className="w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-3"
                  style={{ 
                    backgroundColor: unlocked ? `${rank.color}30` : '#27272a',
                    boxShadow: unlocked ? `0 0 15px ${rank.color}50` : 'none'
                  }}
                >
                  <Crown 
                    className="w-7 h-7"
                    style={{ color: unlocked ? rank.color : '#52525b' }}
                  />
                </div>
                
                <h4 
                  className="text-lg font-bold mb-1"
                  style={{ color: unlocked ? rank.color : '#71717a' }}
                >
                  {rank.name}
                </h4>
                <p className="text-xs text-zinc-500">
                  {rank.threshold === 0 ? 'Starter' : `${rank.threshold} Missions`}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Elden Lord Special Achievement */}
      <div>
        <h3 className="font-heading text-lg font-bold text-zinc-300 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          Secret Achievement
        </h3>
        
        <div
          className={`
            relative p-6 rounded-xl border-2 transition-all
            ${isEldenLord ? '' : 'grayscale opacity-60'}
          `}
          style={{ 
            borderColor: isEldenLord ? '#EAB308' : '#3f3f46',
            background: isEldenLord 
              ? 'linear-gradient(135deg, rgba(234, 179, 8, 0.15) 0%, rgba(0, 0, 0, 0.8) 50%, rgba(234, 179, 8, 0.15) 100%)'
              : '#1a1a1b',
            boxShadow: isEldenLord 
              ? '0 0 40px rgba(234, 179, 8, 0.4), inset 0 0 60px rgba(234, 179, 8, 0.1)' 
              : 'none'
          }}
          data-testid="elden-lord-achievement"
        >
          {/* Animated glow for unlocked state */}
          {isEldenLord && (
            <div 
              className="absolute inset-0 rounded-xl animate-pulse opacity-30"
              style={{ 
                background: 'radial-gradient(circle at center, rgba(234, 179, 8, 0.3) 0%, transparent 70%)'
              }}
            />
          )}

          <div className="relative flex items-center gap-5">
            {/* Elden Lord Badge */}
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center border-4 flex-shrink-0"
              style={{ 
                borderColor: isEldenLord ? '#EAB308' : '#3f3f46',
                background: isEldenLord 
                  ? 'linear-gradient(135deg, #EAB308 0%, #1a1a1b 50%, #EAB308 100%)'
                  : '#27272a',
                boxShadow: isEldenLord 
                  ? '0 0 30px rgba(234, 179, 8, 0.6), 0 0 60px rgba(234, 179, 8, 0.3)' 
                  : 'none'
              }}
            >
              <Crown 
                className="w-10 h-10"
                style={{ 
                  color: isEldenLord ? '#1a1a1b' : '#52525b',
                  filter: isEldenLord ? 'drop-shadow(0 0 5px rgba(0,0,0,0.5))' : 'none'
                }}
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 
                  className="text-2xl font-heading font-bold"
                  style={{ 
                    color: isEldenLord ? '#EAB308' : '#71717a',
                    textShadow: isEldenLord ? '0 0 20px rgba(234, 179, 8, 0.5)' : 'none'
                  }}
                >
                  Elden Lord
                </h4>
                {isEldenLord ? (
                  <CheckCircle className="w-6 h-6 text-yellow-500" />
                ) : (
                  <Lock className="w-6 h-6 text-zinc-600" />
                )}
              </div>
              <p className="text-zinc-400 mb-3">{ELDEN_LORD.description}</p>
              
              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Progress</span>
                  <span className={isEldenLord ? 'text-yellow-400 font-bold' : 'text-zinc-500'}>
                    {Math.min(lifetimeRunes, ELDEN_LORD.threshold).toLocaleString()}/{ELDEN_LORD.threshold.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.min(100, (lifetimeRunes / ELDEN_LORD.threshold) * 100)}%`,
                      background: isEldenLord 
                        ? 'linear-gradient(90deg, #EAB308 0%, #FDE047 50%, #EAB308 100%)'
                        : '#52525b',
                      boxShadow: isEldenLord ? '0 0 10px rgba(234, 179, 8, 0.5)' : 'none'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lifetime Stats Footer */}
      <div 
        className="bg-[#1a1a1b] rounded-xl p-5 border border-zinc-800 mt-8"
        data-testid="lifetime-stats"
      >
        <h3 className="font-heading text-lg font-bold text-zinc-300 mb-4">
          Lifetime Statistics
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-900/50 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Scroll className="w-5 h-5 text-emerald-500" />
              <span className="text-zinc-400 font-medium">Lifetime Missions</span>
            </div>
            <span 
              className="text-3xl font-heading font-bold text-white"
              data-testid="lifetime-missions-count"
            >
              {lifetimeMissions.toLocaleString()}
            </span>
            {nextRank && (
              <p className="text-xs text-zinc-500 mt-1">
                {nextRank.threshold - lifetimeMissions} to {nextRank.name}
              </p>
            )}
          </div>
          
          <div className="bg-zinc-900/50 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Gem className="w-5 h-5 text-runes" />
              <span className="text-zinc-400 font-medium">Lifetime Runes</span>
            </div>
            <span 
              className="text-3xl font-heading font-bold text-white"
              data-testid="lifetime-runes-count"
            >
              {lifetimeRunes.toLocaleString()}
            </span>
            {!isEldenLord && (
              <p className="text-xs text-zinc-500 mt-1">
                {(ELDEN_LORD.threshold - lifetimeRunes).toLocaleString()} to Elden Lord
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { HUNTER_RANKS };
export default TrophyRoom;
