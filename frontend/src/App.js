import React, { useState, useCallback, useEffect } from 'react';
import '@/App.css';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useWallet } from './hooks/useWallet';
import { useLeveling } from './hooks/useLeveling';
import { useMissions } from './hooks/useMissions';
import { useInventory } from './hooks/useInventory';
import { useSync } from './hooks/useSync';
import { getDateKey, addDays, isBeforeOrSame } from './utils/dateUtils';
import { playRuneSound, playUncheckSound, playDeleteSound, playLevelUpSound } from './utils/sounds';
import { calculateRewards } from './config/gameConfig';
import { ITEM_EFFECTS } from './config/itemEffects';
import ProgressRing from './components/ProgressRing';
import RunesWallet from './components/RunesWallet';
import DateNavigator from './components/DateNavigator';
import MissionItem from './components/MissionItem';
import AddMissionModal from './components/AddMissionModal';
import ShopAndInventory from './components/ShopAndInventory';
import TrophyRoom, { HUNTER_RANKS } from './components/TrophyRoom';
import RankUpAnimation from './components/RankUpAnimation';
import HunterRankUpModal from './components/HunterRankUpModal';
import LevelUpAnimation from './components/LevelUpAnimation';
import PenaltyQuest from './components/PenaltyQuest';
import StatusPage from './components/StatusPage';
import XPBar from './components/XPBar';
import SystemLogin from './components/SystemLogin';
import SyncIndicator from './components/SyncIndicator';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { Lock, Scroll, ShoppingBag, Trophy, User, Sparkles } from 'lucide-react';

const PENALTY_QUESTS = ['pushups', 'squats', 'plank', 'burpees'];

const notify = (kind, title, description) => {
  const fn = toast[kind] || toast;
  fn(title, { description });
};

function App() {
  // ---- Cloud sync ----
  const sync = useSync();
  const [showSystemLogin, setShowSystemLogin] = useState(false);

  // ---- Domain state via custom hooks ----
  const [activeTab, setActiveTab] = useState('missions');
  const [currentDate, setCurrentDate] = useState(new Date());
  // Lifted from ShopAndInventory so toggle survives child re-render cascades.
  const [showShopInventoryView, setShowShopInventoryView] = useState(false);

  const wallet = useWallet();
  const leveling = useLeveling();
  const inventory = useInventory();
  const missionApi = useMissions(currentDate);

  // ---- Day-tracking & special state ----
  const [shadowBuffData, setShadowBuffData] = useLocalStorage('epic-grind-shadow-buff', {});
  const [rankUpShown, setRankUpShown] = useLocalStorage('epic-grind-rankup-shown', {});
  const [hunterRankAchieved, setHunterRankAchieved] = useLocalStorage('epic-grind-hunter-rank-achieved', ['e-rank']);
  const [penaltyData, setPenaltyData] = useLocalStorage('epic-grind-penalty', { active: false });
  const [streakDays, setStreakDays] = useLocalStorage('epic-grind-streak-days', 0);

  // ---- Transient UI state ----
  const [justCompletedId, setJustCompletedId] = useState(null);
  const [showRankUp, setShowRankUp] = useState(false);
  const [showHunterRankUp, setShowHunterRankUp] = useState(false);
  const [newHunterRank, setNewHunterRank] = useState(null);

  const dateKey = missionApi.dateKey;
  const today = getDateKey(new Date());
  const hasShadowBuff = shadowBuffData[dateKey] === true;
  const monarchActive = inventory.isMonarchActive();

  // Computed metrics
  const completedCount = missionApi.currentDayMissions.filter(
    (m) => missionApi.currentDayCompletions[m.id]
  ).length;
  const completionPercentage = missionApi.currentDayMissions.length > 0
    ? Math.round((completedCount / missionApi.currentDayMissions.length) * 100)
    : 0;

  // ---- Auto-sync to cloud whenever any state changes ----
  useEffect(() => {
    if (sync.isCloudLinked) {
      sync.triggerSync();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    wallet.totalRunes, wallet.lifetimeRunes,
    leveling.totalXP, leveling.currentLevel, leveling.attributes, leveling.availablePoints,
    missionApi.missions, missionApi.completionData, missionApi.lifetimeMissions, missionApi.missionCounts,
    inventory.inventory, inventory.healthPotionCharges, inventory.monarchUntil,
    shadowBuffData, hunterRankAchieved, penaltyData, streakDays,
  ]);

  // ---- Penalty check on date change (auto-consumes Health Potion if available) ----
  useEffect(() => {
    if (Object.keys(missionApi.completionData).length === 0) return;

    const yesterday = getDateKey(addDays(new Date(), -1));
    const yesterdayCompletions = missionApi.completionData[yesterday] || {};
    const yesterdayMissions = missionApi.missions.filter((m) => {
      if (m.isRecurring) return isBeforeOrSame(m.createdDate, addDays(new Date(), -1));
      return m.dateKey === yesterday;
    });
    const yesterdayCompletedCount = yesterdayMissions.filter(
      (m) => yesterdayCompletions[m.id]
    ).length;

    if (
      yesterdayMissions.length > 0 &&
      yesterdayCompletedCount < 3 &&
      !penaltyData.active &&
      !penaltyData.clearedDate &&
      penaltyData.lastCheckedDate !== yesterday
    ) {
      // Try to consume a Health Potion before activating penalty
      if (inventory.consumeHealthPotion()) {
        setPenaltyData({
          active: false,
          clearedDate: today,
          lastCheckedDate: yesterday,
        });
        toast.success('Health Potion negated the penalty!', {
          description: 'You felt a warmth heal the wound. Stay disciplined.',
          duration: 5000,
        });
        return;
      }

      const randomQuest = PENALTY_QUESTS[Math.floor(Math.random() * PENALTY_QUESTS.length)];
      setPenaltyData({
        active: true,
        questId: randomQuest,
        triggeredDate: today,
        lastCheckedDate: yesterday,
      });
      wallet.subtractRunes(50, { affectLifetime: false });
      toast.error('PENALTY MODE ACTIVATED!', {
        description: 'You failed to complete 3 missions. -50 Runes.',
        duration: 5000,
      });
    }
  }, [today]); // eslint-disable-line react-hooks/exhaustive-deps

  // Rank up animation when hitting 100%
  useEffect(() => {
    if (completionPercentage === 100 && missionApi.currentDayMissions.length > 0 && !rankUpShown[dateKey]) {
      setShowRankUp(true);
      setRankUpShown((prev) => ({ ...prev, [dateKey]: true }));
    }
  }, [completionPercentage, missionApi.currentDayMissions.length, dateKey, rankUpShown, setRankUpShown]);

  const handlePrevDay = useCallback(() => setCurrentDate((prev) => addDays(prev, -1)), []);
  const handleNextDay = useCallback(() => setCurrentDate((prev) => addDays(prev, 1)), []);

  // ---- Add a new mission ----
  const handleAddMission = useCallback((missionData) => {
    missionApi.addMission(missionData);
    toast.success('Mission created!', { description: `${missionData.rank}-Rank: ${missionData.name}` });
  }, [missionApi]);

  // ---- Toggle mission completion ----
  const handleToggleMission = useCallback((missionId) => {
    const mission = missionApi.findMission(missionId);
    if (!mission) return;
    const wasCompleted = missionApi.currentDayCompletions[missionId];

    const base = calculateRewards(mission.rank);
    let runeValue = base.runes;
    let xpValue = base.xp;

    // Stacking multipliers: Shadow Extraction (1.5x for non-A/S) and Monarch's Blessing (2x always)
    if (hasShadowBuff && mission.rank !== 'A' && mission.rank !== 'S') {
      runeValue = Math.floor(runeValue * 1.5);
      xpValue = Math.floor(xpValue * 1.5);
    }
    if (monarchActive) {
      runeValue = Math.floor(runeValue * 2);
      xpValue = Math.floor(xpValue * 2);
    }

    missionApi.setCompletion(missionId, !wasCompleted);

    if (!wasCompleted) {
      // --- COMPLETING ---
      wallet.addRunes(runeValue);
      leveling.addXP(xpValue);
      missionApi.incrementLifetime(mission.rank);
      playRuneSound(mission.rank);
      playLevelUpSound();

      setJustCompletedId(missionId);
      setTimeout(() => setJustCompletedId(null), 400);

      // Hunter Rank up?
      const newLifetime = missionApi.lifetimeMissions + 1;
      const newRank = HUNTER_RANKS.find(
        (r) => r.threshold === newLifetime && !hunterRankAchieved.includes(r.id)
      );
      if (newRank) {
        setTimeout(() => {
          setNewHunterRank(newRank);
          setShowHunterRankUp(true);
          setHunterRankAchieved((prev) => [...prev, newRank.id]);
        }, leveling.showLevelUp ? 3500 : 0);
      }

      // Activate Shadow Buff for A/S rank
      if ((mission.rank === 'A' || mission.rank === 'S') && !shadowBuffData[dateKey]) {
        setShadowBuffData((prev) => ({ ...prev, [dateKey]: true }));
        toast.success('SHADOW EXTRACTION!', {
          description: '1.5x Rune & XP Multiplier activated for today!',
          duration: 4000,
        });
      }

      const buffParts = [];
      if (monarchActive) buffParts.push('2x Monarch');
      if (hasShadowBuff && mission.rank !== 'A' && mission.rank !== 'S') buffParts.push('1.5x Shadow');
      const buffText = buffParts.length ? ` (${buffParts.join(' + ')})` : '';
      toast.success(`+${xpValue} XP | +${runeValue} Runes${buffText}`, {
        description: `${mission.rank}-Rank mission completed`,
      });
    } else {
      // --- UNCOMPLETING (truth reflection) ---
      wallet.subtractRunes(runeValue);
      leveling.subtractXP(xpValue);
      missionApi.decrementLifetime(mission.rank);
      playUncheckSound();
      toast.info(`-${xpValue} XP | -${runeValue} Runes`, {
        description: 'Mission revoked. Level adjusted.',
      });
    }
  }, [missionApi, hasShadowBuff, monarchActive, shadowBuffData, dateKey,
      hunterRankAchieved, leveling, wallet, setHunterRankAchieved, setShadowBuffData]);

  // ---- Delete mission ----
  const handleDeleteMission = useCallback((missionId) => {
    const mission = missionApi.findMission(missionId);
    if (!mission) return;
    if (missionApi.currentDayCompletions[missionId]) {
      wallet.subtractRunes(calculateRewards(mission.rank).runes);
    }
    missionApi.deleteMission(missionId);
    playDeleteSound();
    toast.error('Mission deleted', { description: mission.name });
  }, [missionApi, wallet]);

  // ---- Purchase / use item ----
  const handlePurchase = useCallback((item) => {
    if (wallet.totalRunes < item.cost) return;
    wallet.subtractRunes(item.cost, { affectLifetime: false });
    inventory.purchase(item);
  }, [wallet, inventory]);

  const handleUseItem = useCallback((itemId) => {
    const used = inventory.useItem(itemId, {
      availablePoints: leveling.availablePoints,
      setAvailablePoints: leveling.setAvailablePoints,
    }, notify);
    if (!used) {
      toast.error('No item to use', { description: 'Inventory is empty.' });
    }
  }, [inventory, leveling]);

  // ---- Attribute allocation ----
  const handleAllocatePoint = useCallback((attributeId) => {
    if (leveling.allocatePoint(attributeId)) {
      toast.success(`+1 ${attributeId.charAt(0).toUpperCase() + attributeId.slice(1)}`, {
        description: `${leveling.availablePoints - 1} points remaining`,
      });
    }
  }, [leveling]);

  // ---- Penalty completion ----
  const handleCompletePenalty = useCallback(() => {
    setPenaltyData({ active: false, clearedDate: today, lastCheckedDate: penaltyData.lastCheckedDate });
    setStreakDays((prev) => prev + 1);
    toast.success('Penalty Quest Complete!', { description: 'Access restored. Stay disciplined!' });
  }, [today, penaltyData.lastCheckedDate, setPenaltyData, setStreakDays]);

  // ---- Tab change w/ penalty lock ----
  const handleTabChange = useCallback((tabId) => {
    if (penaltyData.active && (tabId === 'shop' || tabId === 'trophies' || tabId === 'status')) {
      toast.error('Access Locked!', { description: 'Complete the Penalty Quest first.' });
      return;
    }
    setActiveTab(tabId);
  }, [penaltyData.active]);

  // ---- Render ----
  const missionsWithStatus = missionApi.currentDayMissions.map((m) => ({
    ...m,
    completed: !!missionApi.currentDayCompletions[m.id],
  }));

  const bgClass = penaltyData.active
    ? 'min-h-screen bg-gradient-to-b from-red-950/30 to-[#131314] text-white font-body'
    : 'min-h-screen bg-[#131314] text-white font-body';

  return (
    <div className={bgClass}>
      <RankUpAnimation show={showRankUp} onComplete={() => setShowRankUp(false)} />
      <HunterRankUpModal
        show={showHunterRankUp}
        rankData={newHunterRank}
        onClose={() => {
          setShowHunterRankUp(false);
          setNewHunterRank(null);
        }}
      />
      <LevelUpAnimation
        show={leveling.showLevelUp}
        newLevel={leveling.newLevelReached}
        onComplete={leveling.closeLevelUp}
      />
      {showSystemLogin && <SystemLogin sync={sync} onClose={() => setShowSystemLogin(false)} />}

      <div className="anime-bg-left" />
      <div className="anime-bg-right" />
      <div className="noise-overlay" />

      {/* Fixed Header */}
      <header className="sticky top-0 z-50 bg-[#131314]/95 backdrop-blur-sm border-b border-zinc-800">
        <div className="flex justify-between items-center px-4 py-3 gap-2">
          <div className="flex items-center gap-2">
            <SyncIndicator sync={sync} onOpen={() => setShowSystemLogin(true)} />
            {monarchActive && (
              <div
                className="flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-medium animate-pulse"
                style={{
                  backgroundColor: 'rgba(168, 85, 247, 0.15)',
                  borderColor: 'rgba(168, 85, 247, 0.6)',
                  color: '#E879F9',
                }}
                data-testid="monarch-blessing-active"
              >
                <Sparkles className="w-3 h-3" />
                <span className="hidden sm:inline">Monarch 2x</span>
                <span className="sm:hidden">2x</span>
              </div>
            )}
            {inventory.healthPotionCharges > 0 && (
              <div
                className="flex items-center gap-1 px-2 py-1 rounded-full border text-xs"
                style={{
                  backgroundColor: 'rgba(236, 72, 153, 0.15)',
                  borderColor: 'rgba(236, 72, 153, 0.6)',
                  color: '#F472B6',
                }}
                data-testid="health-potion-charges"
                title={`${inventory.healthPotionCharges} Health Potion charge(s) ready`}
              >
                ♥ {inventory.healthPotionCharges}
              </div>
            )}
          </div>
          <RunesWallet
            runes={wallet.totalRunes}
            isAnimating={wallet.runesAnimating}
            hasShadowBuff={hasShadowBuff}
          />
        </div>

        <nav
          className="flex items-center justify-center gap-1 sm:gap-2 bg-[#1a1a1b] border-b border-zinc-800 px-2 sm:px-4 py-3 overflow-x-auto"
          data-testid="navigation"
        >
          {[
            { id: 'missions', label: 'Missions', Icon: Scroll, accent: 'runes' },
            { id: 'status',   label: 'Status',   Icon: User,        accent: 'purple' },
            { id: 'shop',     label: 'Shop',     Icon: ShoppingBag, accent: 'runes' },
            { id: 'trophies', label: 'Trophies', Icon: Trophy,      accent: 'runes' },
          ].map(({ id, label, Icon, accent }) => {
            const active = activeTab === id;
            const accentClass = accent === 'purple'
              ? (active ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : '')
              : (active ? 'bg-runes/20 text-runes border border-runes/30' : '');
            const locked = penaltyData.active && id !== 'missions';
            return (
              <button
                key={id}
                onClick={() => handleTabChange(id)}
                className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2.5 rounded-lg font-medium text-sm sm:text-base transition-all duration-200 whitespace-nowrap slide-in-up
                  ${accentClass}
                  ${!active ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : ''}
                  ${locked ? 'opacity-50' : ''}
                `}
                data-testid={`nav-tab-${id}`}
              >
                {locked && <Lock className="w-3 h-3 text-red-400" />}
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            );
          })}
        </nav>
      </header>

      <main className="content-overlay max-w-2xl mx-auto px-4 py-6 relative z-10">
        {penaltyData.active && (
          <PenaltyQuest penaltyData={penaltyData} onCompletePenalty={handleCompletePenalty} />
        )}

        {activeTab === 'missions' && (
          <div className="space-y-6 slide-in-right">
            <XPBar totalXP={leveling.totalXP} level={leveling.currentLevel} />
            <DateNavigator currentDate={currentDate} onPrevDay={handlePrevDay} onNextDay={handleNextDay} />
            <section className="flex justify-center mb-6" data-testid="hero-section">
              <ProgressRing completed={completedCount} total={missionApi.currentDayMissions.length} />
            </section>
            <section className="space-y-4" data-testid="mission-log">
              <h2 className="font-heading text-xl font-bold text-zinc-300 tracking-wide">Mission Log</h2>
              <div className="flex justify-center mb-6">
                <AddMissionModal onAddMission={handleAddMission} />
              </div>
              {missionsWithStatus.length === 0 ? (
                <div
                  className="text-center py-12 text-zinc-500 bg-[#1a1a1b] rounded-xl border border-zinc-800"
                  data-testid="empty-missions"
                >
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
          </div>
        )}

        {activeTab === 'status' && (
          <StatusPage
            attributes={leveling.attributes}
            availablePoints={leveling.availablePoints}
            level={leveling.currentLevel}
            onAllocatePoint={handleAllocatePoint}
            totalXP={leveling.totalXP}
            lifetimeMissions={missionApi.lifetimeMissions}
          />
        )}

        {activeTab === 'shop' && (
          <ShopAndInventory
            totalRunes={wallet.totalRunes}
            inventory={inventory.inventory}
            onPurchase={handlePurchase}
            onUseItem={handleUseItem}
            showInventory={showShopInventoryView}
            setShowInventory={setShowShopInventoryView}
          />
        )}

        {activeTab === 'trophies' && (
          <div className="slide-in-right">
            <TrophyRoom lifetimeMissions={missionApi.lifetimeMissions} lifetimeRunes={wallet.lifetimeRunes} />
          </div>
        )}
      </main>

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
