import React from 'react';
import { Trophy, Lock, CheckCircle, Scroll, Gem } from 'lucide-react';

const ACHIEVEMENTS = [
  // Mission-based achievements
  { id: 'genin', name: 'Genin', description: 'Complete 20 Missions', type: 'missions', threshold: 20, color: '#10B981' },
  { id: 'jonin', name: 'Jonin', description: 'Complete 50 Missions', type: 'missions', threshold: 50, color: '#3B82F6' },
  { id: 'hokage', name: 'Hokage', description: 'Complete 100 Missions', type: 'missions', threshold: 100, color: '#A855F7' },
  // Rune-based achievements
  { id: 'e-rank', name: 'E-Rank Hunter', description: 'Earn 500 Total Runes', type: 'runes', threshold: 500, color: '#71717A' },
  { id: 'scavenger', name: 'Rune Scavenger', description: 'Earn 1,000 Total Runes', type: 'runes', threshold: 1000, color: '#10B981' },
  { id: 's-rank', name: 'S-Rank Hunter', description: 'Earn 5,000 Total Runes', type: 'runes', threshold: 5000, color: '#3B82F6' },
  { id: 'elden-lord', name: 'Elden Lord', description: 'Earn 10,000 Total Runes', type: 'runes', threshold: 10000, color: '#EAB308' },
  { id: 'shadow-monarch', name: 'Shadow Monarch', description: 'Earn 25,000 Total Runes', type: 'runes', threshold: 25000, color: '#A855F7' },
];

const TrophyRoom = ({ lifetimeMissions, lifetimeRunes }) => {
  const getProgress = (achievement) => {
    const current = achievement.type === 'missions' ? lifetimeMissions : lifetimeRunes;
    return Math.min(100, (current / achievement.threshold) * 100);
  };

  const isUnlocked = (achievement) => {
    const current = achievement.type === 'missions' ? lifetimeMissions : lifetimeRunes;
    return current >= achievement.threshold;
  };

  const unlockedCount = ACHIEVEMENTS.filter(a => isUnlocked(a)).length;

  return (
    <div className="space-y-6" data-testid="trophy-room">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Trophy className="w-7 h-7 text-yellow-500" />
          <h2 className="font-heading text-2xl font-bold text-white">Trophy Room</h2>
        </div>
        
        <div className="flex items-center gap-4 text-zinc-400">
          <div className="flex items-center gap-2 bg-zinc-800/50 px-4 py-2 rounded-lg">
            <Scroll className="w-5 h-5 text-emerald-500" />
            <span className="font-medium">{lifetimeMissions} Missions</span>
          </div>
          <div className="flex items-center gap-2 bg-zinc-800/50 px-4 py-2 rounded-lg">
            <Gem className="w-5 h-5 text-runes" />
            <span className="font-medium">{lifetimeRunes.toLocaleString()} Runes</span>
          </div>
        </div>
      </div>

      {/* Progress Summary */}
      <div className="bg-[#1a1a1b] rounded-xl p-5 border border-zinc-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-zinc-400 font-medium">Achievement Progress</span>
          <span className="text-white font-bold">{unlockedCount}/{ACHIEVEMENTS.length}</span>
        </div>
        <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 transition-all duration-500"
            style={{ width: `${(unlockedCount / ACHIEVEMENTS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Achievement Grid */}
      <div 
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        data-testid="achievements-grid"
      >
        {ACHIEVEMENTS.map((achievement) => {
          const unlocked = isUnlocked(achievement);
          const progress = getProgress(achievement);
          const current = achievement.type === 'missions' ? lifetimeMissions : lifetimeRunes;
          
          return (
            <div
              key={achievement.id}
              className={`
                relative p-5 rounded-xl border-2 transition-all
                ${unlocked 
                  ? 'border-opacity-100' 
                  : 'border-zinc-700 grayscale opacity-60'
                }
              `}
              style={{ 
                borderColor: unlocked ? achievement.color : undefined,
                backgroundColor: unlocked ? `${achievement.color}15` : '#1a1a1b',
                boxShadow: unlocked ? `0 0 25px ${achievement.color}30` : 'none'
              }}
              data-testid={`achievement-${achievement.id}`}
            >
              {/* Lock/Unlock Icon */}
              <div className="absolute top-4 right-4">
                {unlocked ? (
                  <CheckCircle 
                    className="w-6 h-6" 
                    style={{ color: achievement.color }}
                  />
                ) : (
                  <Lock className="w-6 h-6 text-zinc-600" />
                )}
              </div>

              {/* Badge Content */}
              <div className="pr-8">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                  style={{ 
                    backgroundColor: unlocked ? `${achievement.color}30` : '#27272a',
                  }}
                >
                  <Trophy 
                    className="w-6 h-6"
                    style={{ color: unlocked ? achievement.color : '#52525b' }}
                  />
                </div>
                
                <h3 
                  className="text-lg font-bold mb-1"
                  style={{ color: unlocked ? '#fff' : '#71717a' }}
                >
                  {achievement.name}
                </h3>
                <p className="text-sm text-zinc-500 mb-3">
                  {achievement.description}
                </p>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">Progress</span>
                    <span className={unlocked ? 'text-emerald-400' : 'text-zinc-500'}>
                      {Math.min(current, achievement.threshold).toLocaleString()}/{achievement.threshold.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${progress}%`,
                        backgroundColor: unlocked ? achievement.color : '#52525b'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrophyRoom;
