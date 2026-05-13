// ============================================
// SOLO LEVELING APP - CONFIGURATION FILE
// Edit this file to customize colors, icons, and rewards
// ============================================

import { 
  Skull, Crown, Sword, Shield, Zap, 
  Star, Flame, Gem, Heart, Brain,
  Sparkles, Trophy, Target, Rocket,
  FlaskConical, Scroll, Eye, Ghost
} from 'lucide-react';

// ============================================
// MISSION RANK CONFIGURATION
// Customize colors, icons, and multipliers here
// ============================================
export const RANK_CONFIG = {
  S: {
    name: 'S-Rank',
    label: 'Legendary',
    color: '#FFD700',        // Gold
    bgColor: 'rgba(255, 215, 0, 0.15)',
    borderColor: 'rgba(255, 215, 0, 0.6)',
    glowColor: 'rgba(255, 215, 0, 0.8)',
    icon: Crown,
    multiplier: 5,           // 5x XP and Runes
    baseXP: 100,
    baseRunes: 40,
  },
  A: {
    name: 'A-Rank',
    label: 'Epic',
    color: '#A855F7',        // Purple
    bgColor: 'rgba(168, 85, 247, 0.15)',
    borderColor: 'rgba(168, 85, 247, 0.6)',
    glowColor: 'rgba(168, 85, 247, 0.8)',
    icon: Skull,
    multiplier: 4,           // 4x XP and Runes
    baseXP: 100,
    baseRunes: 40,
  },
  B: {
    name: 'B-Rank',
    label: 'Rare',
    color: '#3B82F6',        // Blue
    bgColor: 'rgba(59, 130, 246, 0.15)',
    borderColor: 'rgba(59, 130, 246, 0.6)',
    glowColor: 'rgba(59, 130, 246, 0.8)',
    icon: Sword,
    multiplier: 3,           // 3x XP and Runes
    baseXP: 100,
    baseRunes: 40,
  },
  C: {
    name: 'C-Rank',
    label: 'Uncommon',
    color: '#22C55E',        // Green
    bgColor: 'rgba(34, 197, 94, 0.15)',
    borderColor: 'rgba(34, 197, 94, 0.6)',
    glowColor: 'rgba(34, 197, 94, 0.8)',
    icon: Shield,
    multiplier: 2,           // 2x XP and Runes
    baseXP: 100,
    baseRunes: 40,
  },
  D: {
    name: 'D-Rank',
    label: 'Common',
    color: '#71717A',        // Gray
    bgColor: 'rgba(113, 113, 122, 0.15)',
    borderColor: 'rgba(113, 113, 122, 0.6)',
    glowColor: 'rgba(113, 113, 122, 0.8)',
    icon: Target,
    multiplier: 1,           // 1x XP and Runes
    baseXP: 100,
    baseRunes: 40,
  },
};

// ============================================
// SHOP ITEMS CONFIGURATION
// Add, remove, or modify shop items here
// ============================================
export const SHOP_ITEMS = [
  {
    id: 'health_potion',
    name: 'Health Potion',
    description: 'Restores vitality and focus',
    cost: 100,
    icon: Heart,
    color: '#EC4899',
    bgColor: 'rgba(236, 72, 153, 0.15)',
    category: 'consumable',
  },
  {
    id: 'mana_crystal',
    name: 'Mana Crystal',
    description: 'Enhances magical abilities',
    cost: 150,
    icon: Gem,
    color: '#3B82F6',
    bgColor: 'rgba(59, 130, 246, 0.15)',
    category: 'consumable',
  },
  {
    id: 'shadow_essence',
    name: 'Shadow Essence',
    description: 'Extract from defeated shadows',
    cost: 250,
    icon: Ghost,
    color: '#A855F7',
    bgColor: 'rgba(168, 85, 247, 0.15)',
    category: 'material',
  },
  {
    id: 'dragons_breath',
    name: "Dragon's Breath",
    description: 'Powerful fire element',
    cost: 500,
    icon: Flame,
    color: '#F97316',
    bgColor: 'rgba(249, 115, 22, 0.15)',
    category: 'material',
  },
  {
    id: 'intelligence_tome',
    name: 'Tome of Knowledge',
    description: 'Ancient wisdom contained within',
    cost: 400,
    icon: Brain,
    color: '#06B6D4',
    bgColor: 'rgba(6, 182, 212, 0.15)',
    category: 'equipment',
  },
  {
    id: 'elixir_of_strength',
    name: 'Elixir of Strength',
    description: 'Permanently increases power',
    cost: 750,
    icon: FlaskConical,
    color: '#EF4444',
    bgColor: 'rgba(239, 68, 68, 0.15)',
    category: 'consumable',
  },
  {
    id: 'hunters_eye',
    name: "Hunter's Eye",
    description: 'See through any illusion',
    cost: 600,
    icon: Eye,
    color: '#22D3EE',
    bgColor: 'rgba(34, 211, 238, 0.15)',
    category: 'equipment',
  },
  {
    id: 'legendary_scroll',
    name: 'Legendary Scroll',
    description: 'Contains forbidden techniques',
    cost: 1000,
    icon: Scroll,
    color: '#FFD700',
    bgColor: 'rgba(255, 215, 0, 0.15)',
    category: 'rare',
  },
  {
    id: 'star_fragment',
    name: 'Star Fragment',
    description: 'Fallen from the heavens',
    cost: 1500,
    icon: Star,
    color: '#FBBF24',
    bgColor: 'rgba(251, 191, 36, 0.15)',
    category: 'rare',
  },
  {
    id: 'monarchs_blessing',
    name: "Monarch's Blessing",
    description: 'Power of the Shadow Monarch',
    cost: 2500,
    icon: Crown,
    color: '#A855F7',
    bgColor: 'rgba(168, 85, 247, 0.15)',
    category: 'legendary',
  },
];

// ============================================
// SHOP CATEGORIES
// ============================================
export const SHOP_CATEGORIES = {
  all: { label: 'All Items', color: '#FFFFFF' },
  consumable: { label: 'Consumables', color: '#EC4899' },
  material: { label: 'Materials', color: '#F97316' },
  equipment: { label: 'Equipment', color: '#3B82F6' },
  rare: { label: 'Rare', color: '#FFD700' },
  legendary: { label: 'Legendary', color: '#A855F7' },
};

// ============================================
// ATTRIBUTE CONFIGURATION
// ============================================
export const ATTRIBUTE_CONFIG = {
  strength: {
    name: 'Strength',
    icon: Sword,
    color: '#EF4444',
    description: 'Physical power and damage',
  },
  agility: {
    name: 'Agility',
    icon: Zap,
    color: '#22C55E',
    description: 'Speed and reflexes',
  },
  vitality: {
    name: 'Vitality',
    icon: Heart,
    color: '#EC4899',
    description: 'Health and endurance',
  },
  intelligence: {
    name: 'Intelligence',
    icon: Brain,
    color: '#3B82F6',
    description: 'Mental capacity and magic',
  },
  perception: {
    name: 'Perception',
    icon: Eye,
    color: '#A855F7',
    description: 'Awareness and detection',
  },
};

// ============================================
// XP CALCULATION HELPERS
// ============================================
export const calculateRewards = (rank) => {
  const config = RANK_CONFIG[rank] || RANK_CONFIG.D;
  return {
    xp: config.baseXP * config.multiplier,
    runes: config.baseRunes * config.multiplier,
  };
};

export const getXPForLevel = (level) => {
  return Math.floor(Math.pow(level, 1.5) * 100);
};

export const getTotalXPForLevel = (level) => {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += getXPForLevel(i);
  }
  return total;
};

export const getLevelFromXP = (totalXP) => {
  let level = 1;
  let xpNeeded = 0;
  
  while (level < 100) {
    xpNeeded += getXPForLevel(level);
    if (totalXP < xpNeeded) break;
    level++;
  }
  
  return Math.min(level, 100);
};

export const getXPProgress = (totalXP) => {
  const currentLevel = getLevelFromXP(totalXP);
  const xpForCurrentLevel = getTotalXPForLevel(currentLevel);
  const xpInCurrentLevel = totalXP - xpForCurrentLevel;
  const xpNeededForNextLevel = getXPForLevel(currentLevel);
  
  return {
    current: xpInCurrentLevel,
    needed: xpNeededForNextLevel,
    percentage: Math.min(100, (xpInCurrentLevel / xpNeededForNextLevel) * 100),
  };
};
