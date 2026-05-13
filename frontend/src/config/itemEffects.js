// Item Effects — defines which shop items DO something when used from inventory.
// Items not listed here are pure collectibles.
//
// Each effect handler is given the same context object so it can mutate state.
// Signature: ({ allocAttributePoint, setHealthPotionCharges, setMonarchUntil, setNotify }) => void

export const ITEM_EFFECTS = {
  health_potion: {
    label: 'Use Potion',
    description: 'Negates the next missed mission penalty.',
    apply: ({ healthPotionCharges, setHealthPotionCharges, notify }) => {
      setHealthPotionCharges(healthPotionCharges + 1);
      notify('success', 'Health Potion consumed', 'Next penalty will be negated. Stay vigilant, Hunter.');
    },
  },
  mana_crystal: {
    label: 'Use Crystal',
    description: 'Grants +1 attribute point immediately.',
    apply: ({ availablePoints, setAvailablePoints, notify }) => {
      setAvailablePoints(availablePoints + 1);
      notify('success', 'Mana Crystal absorbed', '+1 attribute point granted.');
    },
  },
  monarchs_blessing: {
    label: 'Invoke Blessing',
    description: 'Doubles XP and Rune gains for the next 24 hours.',
    apply: ({ setMonarchUntil, notify }) => {
      const until = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      setMonarchUntil(until);
      notify('success', "Monarch's Blessing invoked", 'XP & Rune gains doubled for 24 hours.');
    },
  },
};

export const hasEffect = (itemId) => Boolean(ITEM_EFFECTS[itemId]);
