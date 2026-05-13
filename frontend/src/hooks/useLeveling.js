// useLeveling — XP, level, attributes, available attribute points + level-up trigger.
import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { getLevelFromXP } from '../config/gameConfig';

const DEFAULT_ATTRIBUTES = {
  strength: 10,
  agility: 10,
  vitality: 10,
  intelligence: 10,
  perception: 10,
};

export const useLeveling = () => {
  const [totalXP, setTotalXP] = useLocalStorage('epic-grind-total-xp', 0);
  const [currentLevel, setCurrentLevel] = useLocalStorage('epic-grind-level', 1);
  const [attributes, setAttributes] = useLocalStorage('epic-grind-attributes', DEFAULT_ATTRIBUTES);
  const [availablePoints, setAvailablePoints] = useLocalStorage('epic-grind-available-points', 0);

  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevelReached, setNewLevelReached] = useState(1);

  // Apply XP gain and detect level up. Returns { leveledUp, newLevel }.
  const addXP = useCallback((amount) => {
    const newTotal = totalXP + amount;
    const newLevel = getLevelFromXP(newTotal);
    setTotalXP(newTotal);
    if (newLevel > currentLevel) {
      const levelsGained = newLevel - currentLevel;
      setCurrentLevel(newLevel);
      setAvailablePoints((prevPts) => prevPts + levelsGained * 5);
      setNewLevelReached(newLevel);
      setShowLevelUp(true);
      return { leveledUp: true, newLevel };
    }
    return { leveledUp: false, newLevel };
  }, [totalXP, currentLevel, setTotalXP, setCurrentLevel, setAvailablePoints]);

  // Subtract XP (truth reflection — uncompleting a mission)
  const subtractXP = useCallback((amount) => {
    setTotalXP((prev) => {
      const newTotal = Math.max(0, prev - amount);
      const newLevel = getLevelFromXP(newTotal);
      setCurrentLevel(newLevel);
      return newTotal;
    });
  }, [setTotalXP, setCurrentLevel]);

  const allocatePoint = useCallback((attributeId) => {
    if (availablePoints <= 0) return false;
    setAttributes((prev) => ({
      ...prev,
      [attributeId]: (prev[attributeId] || 10) + 1,
    }));
    setAvailablePoints((prev) => prev - 1);
    return true;
  }, [availablePoints, setAttributes, setAvailablePoints]);

  return {
    totalXP,
    currentLevel,
    attributes,
    availablePoints,
    showLevelUp,
    newLevelReached,
    addXP,
    subtractXP,
    allocatePoint,
    setAvailablePoints,
    closeLevelUp: () => setShowLevelUp(false),
  };
};
