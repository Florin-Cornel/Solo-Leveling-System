import React from 'react';
import { Ghost, AlertTriangle, Dumbbell, Lock } from 'lucide-react';
import { Button } from './ui/button';

const PENALTY_QUESTS = [
  { id: 'pushups', name: '50 Pushups', icon: Dumbbell },
  { id: 'squats', name: '30 Squats', icon: Dumbbell },
  { id: 'plank', name: '2 Minute Plank', icon: Dumbbell },
  { id: 'burpees', name: '20 Burpees', icon: Dumbbell },
];

const PenaltyQuest = ({ penaltyData, onCompletePenalty }) => {
  if (!penaltyData?.active) return null;

  const quest = PENALTY_QUESTS.find(q => q.id === penaltyData.questId) || PENALTY_QUESTS[0];
  const QuestIcon = quest.icon;

  return (
    <div 
      className="bg-red-950/80 border-2 border-red-600 rounded-xl p-5 mb-6 shadow-lg"
      style={{ boxShadow: '0 0 30px rgba(220, 38, 38, 0.4)' }}
      data-testid="penalty-quest"
    >
      <div className="flex items-start gap-4">
        {/* Warning icon */}
        <div className="p-3 bg-red-900/50 rounded-lg">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Ghost className="w-5 h-5 text-red-400" />
            <h3 className="font-heading text-xl font-bold text-red-300">
              PENALTY MODE ACTIVE
            </h3>
          </div>
          
          <p className="text-red-200/80 text-sm mb-3">
            You failed to complete at least 3 missions yesterday. Complete this penalty quest to restore access.
          </p>
          
          <div className="flex items-center justify-between bg-red-900/40 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <QuestIcon className="w-6 h-6 text-red-300" />
              <span className="text-lg font-bold text-white">{quest.name}</span>
            </div>
            
            <Button
              onClick={onCompletePenalty}
              className="bg-red-600 hover:bg-red-500 text-white font-bold"
              data-testid="complete-penalty-btn"
            >
              Mark Complete
            </Button>
          </div>
          
          <div className="flex items-center gap-2 mt-3 text-red-400 text-sm">
            <Lock className="w-4 h-4" />
            <span>Reward Shop & Trophy Room locked until penalty is cleared</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PenaltyQuest;
