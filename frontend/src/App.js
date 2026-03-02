import React, { useState, useCallback, useMemo, useEffect } from 'react';
import '@/App.css';
import { useLocalStorage } from './hooks/useLocalStorage';
import { getDateKey, addDays, isBeforeOrSame } from './utils/dateUtils';
import { playRuneSound, playUncheckSound, playDeleteSound } from './utils/sounds';
import ProgressRing from './components/ProgressRing';
import RunesWallet from './components/RunesWallet';
import DateNavigator from './components/DateNavigator';
import MissionItem from './components/MissionItem';
import AddMissionModal from './components/AddMissionModal';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

// Runes values for each rank
const RUNES_VALUES = {
  D: 10,
  C: 20,
  B: 50,
  A: 100,
  S: 200,
};

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [missions, setMissions] = useLocalStorage('epic-grind-missions', []);
  const [completionData, setCompletionData] = useLocalStorage('epic-grind-completions', {});
  const [totalRunes, setTotalRunes] = useLocalStorage('epic-grind-runes', 0);
  const [runesAnimating, setRunesAnimating] = useState(false);
  const [justCompletedId, setJustCompletedId] = useState(null);

  const dateKey = getDateKey(currentDate);

  // Get missions for current date (including recurring missions)
  const currentDayMissions = useMemo(() => {
    return missions.filter((mission) => {
      // If mission is recurring and created on or before current date
      if (mission.isRecurring) {
        return isBeforeOrSame(mission.createdDate, currentDate);
      }
      // If mission is one-time and created on this specific date
      return mission.dateKey === dateKey;
    });
  }, [missions, dateKey, currentDate]);

  // Get completion status for current day
  const currentDayCompletions = completionData[dateKey] || {};

  // Calculate completed count
  const completedCount = currentDayMissions.filter(
    (m) => currentDayCompletions[m.id]
  ).length;

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

  // Toggle mission completion
  const handleToggleMission = useCallback((missionId) => {
    const mission = missions.find((m) => m.id === missionId);
    if (!mission) return;

    const wasCompleted = currentDayCompletions[missionId];
    const runeValue = RUNES_VALUES[mission.rank] || 10;

    setCompletionData((prev) => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        [missionId]: !wasCompleted,
      },
    }));

    if (!wasCompleted) {
      // Completing the mission
      setTotalRunes((prev) => prev + runeValue);
      playRuneSound(mission.rank);
      setJustCompletedId(missionId);
      setRunesAnimating(true);
      setTimeout(() => {
        setJustCompletedId(null);
        setRunesAnimating(false);
      }, 400);
      
      toast.success(`+${runeValue} Runes earned!`, {
        description: `${mission.rank}-Rank mission completed`,
      });
    } else {
      // Uncompleting the mission
      setTotalRunes((prev) => Math.max(0, prev - runeValue));
      playUncheckSound();
      toast.info(`-${runeValue} Runes`, {
        description: 'Mission marked incomplete',
      });
    }
  }, [missions, currentDayCompletions, dateKey, setCompletionData, setTotalRunes]);

  // Delete a mission
  const handleDeleteMission = useCallback((missionId) => {
    const mission = missions.find((m) => m.id === missionId);
    if (!mission) return;

    // If the mission was completed today, subtract the runes
    if (currentDayCompletions[missionId]) {
      const runeValue = RUNES_VALUES[mission.rank] || 10;
      setTotalRunes((prev) => Math.max(0, prev - runeValue));
    }

    // Remove the mission
    setMissions((prev) => prev.filter((m) => m.id !== missionId));
    
    // Clean up completion data for this mission
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

  // Add missions with completion status
  const missionsWithStatus = currentDayMissions.map((mission) => ({
    ...mission,
    completed: !!currentDayCompletions[mission.id],
  }));

  return (
    <div className="min-h-screen bg-[#050505] text-white font-body">
      {/* Noise texture overlay */}
      <div className="noise-overlay" />
      
      {/* Main container */}
      <div className="max-w-lg mx-auto px-4 py-6 relative z-10">
        {/* Header */}
        <header className="flex flex-col gap-6 mb-8">
          {/* Runes Wallet - Top Right */}
          <div className="flex justify-end">
            <RunesWallet runes={totalRunes} isAnimating={runesAnimating} />
          </div>
          
          {/* Date Navigator - Centered */}
          <DateNavigator
            currentDate={currentDate}
            onPrevDay={handlePrevDay}
            onNextDay={handleNextDay}
          />
        </header>

        {/* Progress Ring - Hero Section */}
        <section className="flex justify-center mb-10" data-testid="hero-section">
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
          
          {missionsWithStatus.length === 0 ? (
            <div className="text-center py-12 text-zinc-500" data-testid="empty-missions">
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
        <AddMissionModal onAddMission={handleAddMission} />
      </div>

      {/* Toast notifications */}
      <Toaster 
        position="bottom-center" 
        theme="dark"
        toastOptions={{
          style: {
            background: '#121212',
            border: '1px solid #27272a',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}

export default App;
