import React, { useState, useCallback, useMemo, useEffect } from 'react';
import '@/App.css';
import { useLocalStorage } from './hooks/useLocalStorage';
import { getDateKey, addDays, isBeforeOrSame } from './utils/dateUtils';
import { playRuneSound, playUncheckSound, playDeleteSound, playLevelUpSound } from './utils/sounds';
import ProgressRing from './components/ProgressRing';
import RunesWallet from './components/RunesWallet';
import DateNavigator from './components/DateNavigator';
import MissionItem, { XP_REWARDS, RUNE_REWARDS } from './components/MissionItem';
import AddMissionModal from './components/AddMissionModal';
import RewardShop from './components/RewardShop';
import TrophyRoom, { HUNTER_RANKS } from './components/TrophyRoom';
import RankUpAnimation from './components/RankUpAnimation';
import HunterRankUpModal from './components/HunterRankUpModal';
import LevelUpAnimation from './components/LevelUpAnimation';
import PenaltyQuest from './components/PenaltyQuest';
import ShadowInventory from './components/ShadowInventory';
import StatusPage from './components/StatusPage';
import XPBar, { getLevelFromXP } from './components/XPBar';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { Lock, Scroll, ShoppingBag, Trophy, Settings, User } from 'lucide-react';

// Penalty quest options
const PENALTY_QUESTS = ['pushups', 'squats', 'plank', 'burpees'];

// Default attributes
const DEFAULT_ATTRIBUTES = {
  strength: 10,
  agility: 10,
  vitality: 10,
  intelligence: 10,
  perception: 10,
};

function App() {
  const [activeTab, setActiveTab] = useState('missions');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [missions, setMissions] = useLocalStorage('epic-grind-missions', []);
  const [completionData, setCompletionData] = useLocalStorage('epic-grind-completions', {});
  const [totalRunes, setTotalRunes] = useLocalStorage('epic-grind-runes', 0);
  const [totalXP, setTotalXP] = useLocalStorage('epic-grind-total-xp', 0);
  const [currentLevel, setCurrentLevel] = useLocalStorage('epic-grind-level', 1);
  const [attributes, setAttributes] = useLocalStorage('epic-grind-attributes', DEFAULT_ATTRIBUTES);
  const [availablePoints, setAvailablePoints] = useLocalStorage('epic-grind-available-points', 0);
  const [lifetimeRunes, setLifetimeRunes] = useLocalStorage('epic-grind-lifetime-runes', 0);
  const [lifetimeMissions, setLifetimeMissions] = useLocalStorage('epic-grind-lifetime-missions', 0);
  const [rewards, setRewards] = useLocalStorage('epic-grind-rewards', []);
  const [shadowInventory, setShadowInventory] = useLocalStorage('epic-grind-shadow-inventory', []);
  const [missionCounts, setMissionCounts] = useLocalStorage('epic-grind-mission-counts', { D: 0, C: 0, B: 0, A: 0, S: 0 });
  const [streakDays, setStreakDays] = useLocalStorage('epic-grind-streak-days', 0);
  
  // Special features state
  const [shadowBuffData, setShadowBuffData] = useLocalStorage('epic-grind-shadow-buff', {});
  const [rankUpShown, setRankUpShown] = useLocalStorage('epic-grind-rankup-shown', {});
  const [hunterRankAchieved, setHunterRankAchieved] = useLocalStorage('epic-grind-hunter-rank-achieved', ['e-rank']);
  const [penaltyData, setPenaltyData] = useLocalStorage('epic-grind-penalty', { active: false });
  
  // UI state
  const [runesAnimating, setRunesAnimating] = useState(false);
  const [justCompletedId, setJustCompletedId] = useState(null);
  const [showRankUp, setShowRankUp] = useState(false);
  const [showHunterRankUp, setShowHunterRankUp] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newHunterRank, setNewHunterRank] = useState(null);
  const [newLevelReached, setNewLevelReached] = useState(1);

  const dateKey = getDateKey(currentDate);
  const today = getDateKey(new Date());

  // Check if shadow buff is active for current day
  const hasShadowBuff = shadowBuffData[dateKey] === true;
  
  // Check if Elden Lord is achieved
  const isEldenLord = lifetimeRunes >= 10000;

  // Get missions for current date (including recurring missions)
  const currentDayMissions = useMemo(() => {
    return missions.filter((mission) => {
      if (mission.isRecurring) {
        return isBeforeOrSame(mission.createdDate, currentDate);
      }
      return mission.dateKey === dateKey;
    });
  }, [missions, dateKey, currentDate]);

  // Get completion status for current day
  const currentDayCompletions = completionData[dateKey] || {};

  // Calculate completed count
  const completedCount = currentDayMissions.filter(
    (m) => currentDayCompletions[m.id]
  ).length;

  // Check for 100% completion and trigger rank up
  const completionPercentage = currentDayMissions.length > 0 
    ? Math.round((completedCount / currentDayMissions.length) * 100) 
    : 0;

  // Check penalty status on mount and date change
  useEffect(() => {
    const checkPenalty = () => {
      const yesterday = getDateKey(addDays(new Date(), -1));
      const yesterdayCompletions = completionData[yesterday] || {};
      const yesterdayMissions = missions.filter((mission) => {
        if (mission.isRecurring) {
          return isBeforeOrSame(mission.createdDate, addDays(new Date(), -1));
        }
        return mission.dateKey === yesterday;
      });
      
      const yesterdayCompletedCount = yesterdayMissions.filter(
        (m) => yesterdayCompletions[m.id]
      ).length;

      if (yesterdayMissions.length > 0 && yesterdayCompletedCount < 3 && !penaltyData.active && !penaltyData.clearedDate) {
        if (penaltyData.lastCheckedDate !== yesterday) {
          const randomQuest = PENALTY_QUESTS[Math.floor(Math.random() * PENALTY_QUESTS.length)];
          setPenaltyData({
            active: true,
            questId: randomQuest,
            triggeredDate: today,
            lastCheckedDate: yesterday,
          });
          setTotalRunes((prev) => Math.max(0, prev - 50));
          toast.error('PENALTY MODE ACTIVATED!', {
            description: 'You failed to complete 3 missions. -50 Runes.',
            duration: 5000,
          });
        }
      }
    };

    if (Object.keys(completionData).length > 0) {
      checkPenalty();
    }
  }, [today]); // eslint-disable-line react-hooks/exhaustive-deps

  // Trigger rank up animation when hitting 100%
  useEffect(() => {
    if (completionPercentage === 100 && currentDayMissions.length > 0 && !rankUpShown[dateKey]) {
      setShowRankUp(true);
      setRankUpShown((prev) => ({ ...prev, [dateKey]: true }));
    }
  }, [completionPercentage, currentDayMissions.length, dateKey, rankUpShown, setRankUpShown]);

  // Navigate to previous day
  const handlePrevDay = useCallback(() => {
    setCurrentDate((prev) => addDays(prev, -1));
  }, []);

  // Navigate to next day
  const handleNextDay = useCallback(() => {
    setCurrentDate((prev) => addDays(prev, 1));
  }, []);

  // Add a new mission
  const handleAddMission = useCallback((missionData) => {
    const newMission = {
      id: `mission-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: missionData.name,
      rank: missionData.rank,
      isRecurring: missionData.isRecurring,
      dateKey: dateKey,
      createdDate: getDateKey(currentDate),
    };

    setMissions((prev) => [...prev, newMission]);
    toast.success('Mission created!', {
      description: `${missionData.rank}-Rank: ${missionData.name}`,
    });
  }, [dateKey, currentDate, setMissions]);

  // Toggle mission completion (Truth Reflection Patch)
  const handleToggleMission = useCallback((missionId) => {
    const mission = missions.find((m) => m.id === missionId);
    if (!mission) return;

    const wasCompleted = currentDayCompletions[missionId];
    
    // Calculate rewards based on current buff state
    let runeValue = RUNE_REWARDS[mission.rank] || 10;
    let xpValue = XP_REWARDS[mission.rank] || 50;

    // Apply shadow buff multiplier (1.5x) if active and this isn't an A/S rank mission
    if (hasShadowBuff && mission.rank !== 'A' && mission.rank !== 'S') {
      runeValue = Math.floor(runeValue * 1.5);
      xpValue = Math.floor(xpValue * 1.5);
    }

    setCompletionData((prev) => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        [missionId]: !wasCompleted,
      },
    }));

    if (!wasCompleted) {
      // --- COMPLETING THE MISSION ---
      const newLifetimeMissions = lifetimeMissions + 1;
      const newTotalXP = totalXP + xpValue;
      const newLevel = getLevelFromXP(newTotalXP);
      
      setTotalRunes((prev) => prev + runeValue);
      setLifetimeRunes((prev) => prev + runeValue);
      setLifetimeMissions(newLifetimeMissions);
      setTotalXP(newTotalXP);
      
      // Check for level up
      if (newLevel > currentLevel) {
        const levelsGained = newLevel - currentLevel;
        const pointsGained = levelsGained * 5;
        setCurrentLevel(newLevel);
        setAvailablePoints((prev) => prev + pointsGained);
        setNewLevelReached(newLevel);
        setShowLevelUp(true);
      }
      
      // Track mission counts by rank
      setMissionCounts((prev) => ({
        ...prev,
        [mission.rank]: (prev[mission.rank] || 0) + 1,
      }));
      
      playRuneSound(mission.rank);
      playLevelUpSound();
      
      setJustCompletedId(missionId);
      setRunesAnimating(true);
      setTimeout(() => {
        setJustCompletedId(null);
        setRunesAnimating(false);
      }, 400);

      // Check for Hunter Rank Up
      const newRank = HUNTER_RANKS.find(r => 
        r.threshold === newLifetimeMissions && !hunterRankAchieved.includes(r.id)
      );
      if (newRank) {
        setTimeout(() => {
          setNewHunterRank(newRank);
          setShowHunterRankUp(true);
          setHunterRankAchieved((prev) => [...prev, newRank.id]);
        }, showLevelUp ? 3500 : 0);
      }

      // Activate Shadow Buff for A/S rank completion
      if ((mission.rank === 'A' || mission.rank === 'S') && !shadowBuffData[dateKey]) {
        setShadowBuffData((prev) => ({ ...prev, [dateKey]: true }));
        toast.success('SHADOW EXTRACTION!', {
          description: '1.5x Rune & XP Multiplier activated for today!',
          duration: 4000,
        });
      }
      
      const buffText = hasShadowBuff && mission.rank !== 'A' && mission.rank !== 'S' ? ' (1.5x Buff!)' : '';
      toast.success(`+${xpValue} XP | +${runeValue} Runes${buffText}`, {
        description: `${mission.rank}-Rank mission completed`,
      });
    } else {
      // --- UNCOMPLETING THE MISSION (THE PENALTY) ---
      const newTotalXP = Math.max(0, totalXP - xpValue);
      const newLevel = getLevelFromXP(newTotalXP); 
      
      setTotalRunes((prev) => Math.max(0, prev - runeValue));
      setLifetimeRunes((prev) => Math.max(0, prev - runeValue));
      setLifetimeMissions((prev) => Math.max(0, prev - 1));
      setTotalXP(newTotalXP);
      setCurrentLevel(newLevel);
      
      setMissionCounts((prev) => ({
        ...prev,
        [mission.rank]: Math.max(0, (prev[mission.rank] || 0) - 1),
      }));

      playUncheckSound();
      toast.info(`-${xpValue} XP | -${runeValue} Runes`, {
        description: 'Mission revoked. Level adjusted.',
      });
    }
  }, [missions, currentDayCompletions, dateKey, hasShadowBuff, shadowBuffData, lifetimeMissions, 
      totalXP, currentLevel, hunterRankAchieved, showLevelUp, setCompletionData, setTotalRunes, 
      setLifetimeRunes, setLifetimeMissions, setTotalXP, setCurrentLevel, setAvailablePoints,
      setShadowBuffData, setHunterRankAchieved, setMissionCounts]);
  // Delete a mission
  const handleDeleteMission = useCallback((missionId) => {
    const mission = missions.find((m) => m.id === missionId);
    if (!mission) return;

    if (currentDayCompletions[missionId]) {
      const runeValue = RUNE_REWARDS[mission.rank] || 10;
      setTotalRunes((prev) => Math.max(0, prev - runeValue));
    }

    setMissions((prev) => prev.filter((m) => m.id !== missionId));
    
    setCompletionData((prev) => {
      const newData = { ...prev };
      Object.keys(newData).forEach((key) => {
        if (newData[key][missionId]) {
          delete newData[key][missionId];
        }
      });
      return newData;
    });

    playDeleteSound();
    toast.error('Mission deleted', {
      description: mission.name,
    });
  }, [missions, currentDayCompletions, setMissions, setCompletionData, setTotalRunes]);

  // Add a new reward
  const handleAddReward = useCallback((rewardData) => {
    const newReward = {
      id: `reward-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: rewardData.name,
      cost: rewardData.cost,
      colorTheme: rewardData.colorTheme,
    };
    setRewards((prev) => [...prev, newReward]);
  }, [setRewards]);

  // Buy a reward
  const handleBuyReward = useCallback((rewardId) => {
    const reward = rewards.find((r) => r.id === rewardId);
    if (!reward || totalRunes < reward.cost) return;

    setTotalRunes((prev) => prev - reward.cost);
    setRunesAnimating(true);
    setTimeout(() => setRunesAnimating(false), 400);
  }, [rewards, totalRunes, setTotalRunes]);

  // Delete a reward
  const handleDeleteReward = useCallback((rewardId) => {
    setRewards((prev) => prev.filter((r) => r.id !== rewardId));
  }, [setRewards]);

  // Shadow Inventory handlers
  const handleAddInventoryItem = useCallback((itemData) => {
    const newItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...itemData,
      unlocked: itemData.condition?.type === 'none',
    };
    setShadowInventory((prev) => [...prev, newItem]);
  }, [setShadowInventory]);

  const handleUpdateInventoryItem = useCallback((itemId, itemData) => {
    setShadowInventory((prev) => 
      prev.map((item) => item.id === itemId ? { ...item, ...itemData } : item)
    );
  }, [setShadowInventory]);

  const handleDeleteInventoryItem = useCallback((itemId) => {
    setShadowInventory((prev) => prev.filter((item) => item.id !== itemId));
  }, [setShadowInventory]);

  // Allocate attribute point
  const handleAllocatePoint = useCallback((attributeId) => {
    if (availablePoints <= 0) return;
    
    setAttributes((prev) => ({
      ...prev,
      [attributeId]: (prev[attributeId] || 10) + 1,
    }));
    setAvailablePoints((prev) => prev - 1);
    
    toast.success(`+1 ${attributeId.charAt(0).toUpperCase() + attributeId.slice(1)}`, {
      description: `${availablePoints - 1} points remaining`,
    });
  }, [availablePoints, setAttributes, setAvailablePoints]);

  // Complete penalty quest
  const handleCompletePenalty = useCallback(() => {
    setPenaltyData({ 
      active: false, 
      clearedDate: today,
      lastCheckedDate: penaltyData.lastCheckedDate 
    });
    setStreakDays((prev) => prev + 1);
    toast.success('Penalty Quest Complete!', {
      description: 'Access restored. Stay disciplined!',
    });
  }, [today, penaltyData.lastCheckedDate, setPenaltyData, setStreakDays]);

  // Handle tab change with penalty lock
  const handleTabChange = useCallback((tabId) => {
    if (penaltyData.active && (tabId === 'shop' || tabId === 'trophies' || tabId === 'inventory' || tabId === 'status')) {
      toast.error('Access Locked!', {
        description: 'Complete the Penalty Quest first.',
      });
      return;
    }
    setActiveTab(tabId);
  }, [penaltyData.active]);

  // Add missions with completion status
  const missionsWithStatus = currentDayMissions.map((mission) => ({
    ...mission,
    completed: !!currentDayCompletions[mission.id],
  }));

  // Determine background class based on penalty mode
  const bgClass = penaltyData.active 
    ? 'min-h-screen bg-gradient-to-b from-red-950/30 to-[#131314] text-white font-body'
    : 'min-h-screen bg-[#131314] text-white font-body';

  return (
   <div className={bgClass}>
    

      {/* Rank Up Animation (100% daily completion) */}
      <RankUpAnimation
        show={showRankUp} 
        onComplete={() => setShowRankUp(false)} 
      />

      {/* Hunter Rank Up Modal */}
      <HunterRankUpModal
        show={showHunterRankUp}
        rankData={newHunterRank}
        onClose={() => {
          setShowHunterRankUp(false);
          setNewHunterRank(null);
        }}
      />

      {/* Level Up Animation */}
      <LevelUpAnimation
        show={showLevelUp}
        newLevel={newLevelReached}
        onComplete={() => setShowLevelUp(false)}
      />

      {/* Anime character backgrounds */}
      <div className="anime-bg-left" />
      <div className="anime-bg-right" />
      
      {/* Noise texture overlay */}
      <div className="noise-overlay" />
      
      {/* Fixed Header */}
      <header className="sticky top-0 z-50 bg-[#131314]/95 backdrop-blur-sm border-b border-zinc-800">
        {/* Top bar with wallet */}
        <div className="flex justify-end px-4 py-3">
          <RunesWallet 
            runes={totalRunes} 
            isAnimating={runesAnimating} 
            hasShadowBuff={hasShadowBuff}
          />
        </div>
        
        {/* Navigation */}
        <nav 
          className="flex items-center justify-center gap-1 sm:gap-2 bg-[#1a1a1b] border-b border-zinc-800 px-2 sm:px-4 py-3 overflow-x-auto"
          data-testid="navigation"
        >
          <button
            onClick={() => handleTabChange('missions')}
            className={`
              flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2.5 rounded-lg font-medium text-sm sm:text-base
              transition-all duration-200 whitespace-nowrap slide-in-up
              ${activeTab === 'missions' 
                ? 'bg-runes/20 text-runes border border-runes/30' 
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }
            `}
            data-testid="nav-tab-missions"
          >
            <Scroll className="w-4 h-4" />
            <span className="hidden sm:inline">Missions</span>
          </button>
          
          <button
            onClick={() => handleTabChange('status')}
            className={`
              flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2.5 rounded-lg font-medium text-sm sm:text-base
              transition-all duration-200 whitespace-nowrap slide-in-up
              ${activeTab === 'status' 
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }
              ${penaltyData.active ? 'opacity-50' : ''}
            `}
            data-testid="nav-tab-status"
          >
            {penaltyData.active && <Lock className="w-3 h-3 text-red-400" />}
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Status</span>
          </button>
          
          <button
            onClick={() => handleTabChange('shop')}
            className={`
              flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2.5 rounded-lg font-medium text-sm sm:text-base
              transition-all duration-200 whitespace-nowrap slide-in-up
              ${activeTab === 'shop' 
                ? 'bg-runes/20 text-runes border border-runes/30' 
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }
              ${penaltyData.active ? 'opacity-50' : ''}
            `}
            data-testid="nav-tab-shop"
          >
            {penaltyData.active && <Lock className="w-3 h-3 text-red-400" />}
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Shop</span>
          </button>
          
          <button
            onClick={() => handleTabChange('trophies')}
            className={`
              flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2.5 rounded-lg font-medium text-sm sm:text-base
              transition-all duration-200 whitespace-nowrap slide-in-up
              ${activeTab === 'trophies' 
                ? 'bg-runes/20 text-runes border border-runes/30' 
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }
              ${penaltyData.active ? 'opacity-50' : ''}
            `}
            data-testid="nav-tab-trophies"
          >
            {penaltyData.active && <Lock className="w-3 h-3 text-red-400" />}
            <Trophy className="w-4 h-4" />
            <span className="hidden sm:inline">Trophies</span>
          </button>
          
          <button
            onClick={() => handleTabChange('inventory')}
            className={`
              flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2.5 rounded-lg font-medium text-sm sm:text-base
              transition-all duration-200 whitespace-nowrap slide-in-up
              ${activeTab === 'inventory' 
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }
              ${penaltyData.active ? 'opacity-50' : ''}
            `}
            data-testid="nav-tab-inventory"
          >
            {penaltyData.active && <Lock className="w-3 h-3 text-red-400" />}
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Inventory</span>
          </button>
        </nav>
      </header>

      {/* Main container with content overlay for clean center */}
      <main className="content-overlay max-w-2xl mx-auto px-4 py-6 relative z-10">
        {/* Penalty Quest Banner */}
        {penaltyData.active && (
          <PenaltyQuest 
            penaltyData={penaltyData} 
            onCompletePenalty={handleCompletePenalty}
          />
        )}

        {/* Mission Log Tab */}
        {activeTab === 'missions' && (
          <div className="space-y-6 slide-in-right">
            {/* XP Bar */}
            <XPBar totalXP={totalXP} level={currentLevel} />
            
            {/* Date Navigator */}
            <DateNavigator
              currentDate={currentDate}
              onPrevDay={handlePrevDay}
              onNextDay={handleNextDay}
            />

            {/* Progress Ring - Hero Section */}
            <section className="flex justify-center mb-6" data-testid="hero-section">
              <ProgressRing
                completed={completedCount}
                total={currentDayMissions.length}
              />
            </section>

            {/* Mission Log */}
            <section className="space-y-4" data-testid="mission-log">
              <h2 className="font-heading text-xl font-bold text-zinc-300 tracking-wide">
                Mission Log
              </h2>
              <div className="flex justify-center mb-6">
  <AddMissionModal onAddMission={handleAddMission} />
</div>
              {missionsWithStatus.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 bg-[#1a1a1b] rounded-xl border border-zinc-800" data-testid="empty-missions">
                  <p className="text-lg mb-2">No missions for this day</p>
                  <p className="text-sm">Click the + button to add your first mission</p>
                </div>
              ) : (
                <div className="space-y-3" data-testid="mission-list">
                  {missionsWithStatus.map((mission) => (
                    <MissionItem
                      key={`${mission.id}-${dateKey}`}
                      mission={mission}
                      onToggle={handleToggleMission}
                      onDelete={handleDeleteMission}
                      isJustCompleted={justCompletedId === mission.id}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Add Mission Button */}

          </div>
        )}

        {/* Status Page Tab */}
        {activeTab === 'status' && (
          <StatusPage
            attributes={attributes}
            availablePoints={availablePoints}
            level={currentLevel}
            onAllocatePoint={handleAllocatePoint}
            totalXP={totalXP}
            lifetimeMissions={lifetimeMissions}
          />
        )}

        {/* Reward Shop Tab */}
        {activeTab === 'shop' && (
          <div className="slide-in-right">
            <RewardShop
              rewards={rewards}
              onAddReward={handleAddReward}
              onBuyReward={handleBuyReward}
              onDeleteReward={handleDeleteReward}
              totalRunes={totalRunes}
            />
          </div>
        )}

        {/* Trophy Room Tab */}
        {activeTab === 'trophies' && (
          <div className="slide-in-right">
            <TrophyRoom
              lifetimeMissions={lifetimeMissions}
              lifetimeRunes={lifetimeRunes}
            />
          </div>
        )}

        {/* Shadow Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="slide-in-right">
            <ShadowInventory
              items={shadowInventory}
              onAddItem={handleAddInventoryItem}
              onUpdateItem={handleUpdateInventoryItem}
              onDeleteItem={handleDeleteInventoryItem}
              streakDays={streakDays}
              missionCounts={missionCounts}
              hunterRankAchieved={hunterRankAchieved}
              isEldenLord={isEldenLord}
            />
          </div>
        )}
      </main>

      {/* Toast notifications */}
      <Toaster 
        position="bottom-center" 
        theme="dark"
        toastOptions={{
          style: {
            background: '#1a1a1b',
            border: '1px solid #27272a',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}

export default App;
