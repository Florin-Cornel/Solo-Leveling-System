// useWallet — Runes balance + lifetime tracker + animation flag.
import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

export const useWallet = () => {
  const [totalRunes, setTotalRunes] = useLocalStorage('epic-grind-runes', 0);
  const [lifetimeRunes, setLifetimeRunes] = useLocalStorage('epic-grind-lifetime-runes', 0);
  const [runesAnimating, setRunesAnimating] = useState(false);

  const addRunes = useCallback((amount) => {
    setTotalRunes((prev) => prev + amount);
    setLifetimeRunes((prev) => prev + amount);
    setRunesAnimating(true);
    setTimeout(() => setRunesAnimating(false), 400);
  }, [setTotalRunes, setLifetimeRunes]);

  const subtractRunes = useCallback((amount, { affectLifetime = true } = {}) => {
    setTotalRunes((prev) => Math.max(0, prev - amount));
    if (affectLifetime) setLifetimeRunes((prev) => Math.max(0, prev - amount));
  }, [setTotalRunes, setLifetimeRunes]);

  return {
    totalRunes,
    lifetimeRunes,
    runesAnimating,
    setRunesAnimating,
    addRunes,
    subtractRunes,
    setTotalRunes,
  };
};
