// useMissions — mission CRUD + day-scoped completion tracking + lifetime counters.
import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { getDateKey, isBeforeOrSame } from '../utils/dateUtils';

export const useMissions = (currentDate) => {
  const [missions, setMissions] = useLocalStorage('epic-grind-missions', []);
  const [completionData, setCompletionData] = useLocalStorage('epic-grind-completions', {});
  const [lifetimeMissions, setLifetimeMissions] = useLocalStorage('epic-grind-lifetime-missions', 0);
  const [missionCounts, setMissionCounts] = useLocalStorage('epic-grind-mission-counts', { D: 0, C: 0, B: 0, A: 0, S: 0 });

  const dateKey = getDateKey(currentDate);

  // Missions visible on the current date (one-off + recurring within range)
  const currentDayMissions = useMemo(() => {
    return missions.filter((mission) => {
      if (mission.isRecurring) {
        return isBeforeOrSame(mission.createdDate, currentDate);
      }
      return mission.dateKey === dateKey;
    });
  }, [missions, dateKey, currentDate]);

  const currentDayCompletions = completionData[dateKey] || {};

  const addMission = useCallback((missionData) => {
    const newMission = {
      id: `mission-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: missionData.name,
      rank: missionData.rank,
      isRecurring: missionData.isRecurring,
      dateKey,
      createdDate: getDateKey(currentDate),
    };
    setMissions((prev) => [...prev, newMission]);
    return newMission;
  }, [dateKey, currentDate, setMissions]);

  const setCompletion = useCallback((missionId, completed) => {
    setCompletionData((prev) => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        [missionId]: completed,
      },
    }));
  }, [dateKey, setCompletionData]);

  const incrementLifetime = useCallback((rank) => {
    setLifetimeMissions((prev) => prev + 1);
    setMissionCounts((prev) => ({ ...prev, [rank]: (prev[rank] || 0) + 1 }));
  }, [setLifetimeMissions, setMissionCounts]);

  const decrementLifetime = useCallback((rank) => {
    setLifetimeMissions((prev) => Math.max(0, prev - 1));
    setMissionCounts((prev) => ({ ...prev, [rank]: Math.max(0, (prev[rank] || 0) - 1) }));
  }, [setLifetimeMissions, setMissionCounts]);

  const deleteMission = useCallback((missionId) => {
    setMissions((prev) => prev.filter((m) => m.id !== missionId));
    setCompletionData((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        if (next[key] && next[key][missionId]) {
          delete next[key][missionId];
        }
      });
      return next;
    });
  }, [setMissions, setCompletionData]);

  const findMission = useCallback((id) => missions.find((m) => m.id === id), [missions]);

  return {
    missions,
    completionData,
    lifetimeMissions,
    missionCounts,
    dateKey,
    currentDayMissions,
    currentDayCompletions,
    addMission,
    setCompletion,
    incrementLifetime,
    decrementLifetime,
    deleteMission,
    findMission,
  };
};
