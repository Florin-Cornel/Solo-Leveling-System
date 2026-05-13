// useInventory — purchased items + item-effect activation.
import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { ITEM_EFFECTS } from '../config/itemEffects';

export const useInventory = () => {
  const [inventory, setInventory] = useLocalStorage('epic-grind-inventory', []);
  const [healthPotionCharges, setHealthPotionCharges] = useLocalStorage('epic-grind-health-potion-charges', 0);
  const [monarchUntil, setMonarchUntil] = useLocalStorage('epic-grind-monarch-until', null);

  const purchase = useCallback((item) => {
    setInventory((prev) => [
      ...prev,
      {
        id: item.id,
        name: item.name,
        purchasedAt: new Date().toISOString(),
      },
    ]);
  }, [setInventory]);

  /**
   * Use one instance of `itemId` from inventory.
   * Applies its effect via ITEM_EFFECTS map and removes it from inventory.
   * Returns true if used, false if no charges / no effect.
   */
  const useItem = useCallback((itemId, levelingApi, notify) => {
    const effect = ITEM_EFFECTS[itemId];
    if (!effect) return false;

    // Find and remove the first matching instance
    let removed = false;
    setInventory((prev) => {
      const idx = prev.findIndex((it) => it.id === itemId);
      if (idx === -1) return prev;
      removed = true;
      return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
    });

    // Defer effect application to next tick so state update happens first
    setTimeout(() => {
      effect.apply({
        healthPotionCharges,
        setHealthPotionCharges,
        availablePoints: levelingApi.availablePoints,
        setAvailablePoints: levelingApi.setAvailablePoints,
        setMonarchUntil,
        notify,
      });
    }, 0);

    return removed;
  }, [setInventory, healthPotionCharges, setHealthPotionCharges, setMonarchUntil]);

  // Returns true if monarch's blessing is currently active.
  const isMonarchActive = useCallback(() => {
    if (!monarchUntil) return false;
    return new Date(monarchUntil).getTime() > Date.now();
  }, [monarchUntil]);

  // Consume one health-potion charge to block a penalty. Returns true if consumed.
  const consumeHealthPotion = useCallback(() => {
    if (healthPotionCharges <= 0) return false;
    setHealthPotionCharges((prev) => Math.max(0, prev - 1));
    return true;
  }, [healthPotionCharges, setHealthPotionCharges]);

  return {
    inventory,
    healthPotionCharges,
    monarchUntil,
    isMonarchActive,
    purchase,
    useItem,
    consumeHealthPotion,
  };
};
