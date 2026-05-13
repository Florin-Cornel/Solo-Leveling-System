// Cloud sync layer — System Access Key scoped, LocalStorage cache-first.
// All writes hit localStorage instantly; cloud sync runs in background (debounced).
import { supabase, isSupabaseConfigured } from './supabaseClient';

// All LocalStorage keys consumed by the app — kept in one place for sync.
export const LS_KEYS = {
  missions: 'epic-grind-missions',
  completions: 'epic-grind-completions',
  totalRunes: 'epic-grind-runes',
  totalXP: 'epic-grind-total-xp',
  currentLevel: 'epic-grind-level',
  attributes: 'epic-grind-attributes',
  availablePoints: 'epic-grind-available-points',
  lifetimeRunes: 'epic-grind-lifetime-runes',
  lifetimeMissions: 'epic-grind-lifetime-missions',
  inventory: 'epic-grind-inventory',
  missionCounts: 'epic-grind-mission-counts',
  streakDays: 'epic-grind-streak-days',
  shadowBuff: 'epic-grind-shadow-buff',
  rankupShown: 'epic-grind-rankup-shown',
  hunterRankAchieved: 'epic-grind-hunter-rank-achieved',
  penaltyData: 'epic-grind-penalty',
  monarchUntil: 'epic-grind-monarch-until',
  healthPotionCharges: 'epic-grind-health-potion-charges',
  systemKey: 'epic-grind-system-key',
};

const readLS = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const writeLS = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('LocalStorage write failed:', e);
  }
};

export const getSystemKey = () => readLS(LS_KEYS.systemKey, null);
export const setSystemKey = (key) => writeLS(LS_KEYS.systemKey, key);
export const clearSystemKey = () => localStorage.removeItem(LS_KEYS.systemKey);

// Collect the entire local state into a single payload object for cloud upsert.
export const collectLocalState = () => ({
  total_runes: readLS(LS_KEYS.totalRunes, 0),
  total_xp: readLS(LS_KEYS.totalXP, 0),
  current_level: readLS(LS_KEYS.currentLevel, 1),
  lifetime_runes: readLS(LS_KEYS.lifetimeRunes, 0),
  lifetime_missions: readLS(LS_KEYS.lifetimeMissions, 0),
  attributes: readLS(LS_KEYS.attributes, { strength: 10, agility: 10, vitality: 10, intelligence: 10, perception: 10 }),
  available_points: readLS(LS_KEYS.availablePoints, 0),
  mission_counts: readLS(LS_KEYS.missionCounts, { D: 0, C: 0, B: 0, A: 0, S: 0 }),
  streak_days: readLS(LS_KEYS.streakDays, 0),
  hunter_rank_achieved: readLS(LS_KEYS.hunterRankAchieved, ['e-rank']),
  penalty_data: readLS(LS_KEYS.penaltyData, { active: false }),
  shadow_buff_data: readLS(LS_KEYS.shadowBuff, {}),
  rankup_shown: readLS(LS_KEYS.rankupShown, {}),
  monarch_blessing_until: readLS(LS_KEYS.monarchUntil, null),
  health_potion_charges: readLS(LS_KEYS.healthPotionCharges, 0),
});

const applyStatsToLocal = (row) => {
  if (!row) return;
  writeLS(LS_KEYS.totalRunes, row.total_runes ?? 0);
  writeLS(LS_KEYS.totalXP, row.total_xp ?? 0);
  writeLS(LS_KEYS.currentLevel, row.current_level ?? 1);
  writeLS(LS_KEYS.lifetimeRunes, row.lifetime_runes ?? 0);
  writeLS(LS_KEYS.lifetimeMissions, row.lifetime_missions ?? 0);
  writeLS(LS_KEYS.attributes, row.attributes ?? { strength: 10, agility: 10, vitality: 10, intelligence: 10, perception: 10 });
  writeLS(LS_KEYS.availablePoints, row.available_points ?? 0);
  writeLS(LS_KEYS.missionCounts, row.mission_counts ?? { D: 0, C: 0, B: 0, A: 0, S: 0 });
  writeLS(LS_KEYS.streakDays, row.streak_days ?? 0);
  writeLS(LS_KEYS.hunterRankAchieved, row.hunter_rank_achieved ?? ['e-rank']);
  writeLS(LS_KEYS.penaltyData, row.penalty_data ?? { active: false });
  writeLS(LS_KEYS.shadowBuff, row.shadow_buff_data ?? {});
  writeLS(LS_KEYS.rankupShown, row.rankup_shown ?? {});
  writeLS(LS_KEYS.monarchUntil, row.monarch_blessing_until ?? null);
  writeLS(LS_KEYS.healthPotionCharges, row.health_potion_charges ?? 0);
};

/**
 * Push everything in LocalStorage to Supabase for the given access_key.
 * Uses upsert on user_stats, replace-all on missions/completions/inventory.
 */
export const pushToCloud = async (accessKey) => {
  if (!isSupabaseConfigured || !accessKey) return { ok: false, reason: 'not-configured' };

  const stats = collectLocalState();
  const missions = readLS(LS_KEYS.missions, []);
  const completions = readLS(LS_KEYS.completions, {});
  const inventory = readLS(LS_KEYS.inventory, []);

  // 1) Upsert user_stats row
  const { error: statsErr } = await supabase
    .from('user_stats')
    .upsert({ access_key: accessKey, ...stats, updated_at: new Date().toISOString() }, { onConflict: 'access_key' });
  if (statsErr) return { ok: false, reason: statsErr.message };

  // 2) Replace missions for this access_key
  await supabase.from('missions').delete().eq('access_key', accessKey);
  if (missions.length > 0) {
    const rows = missions.map((m) => ({
      id: m.id,
      access_key: accessKey,
      name: m.name,
      rank: m.rank,
      is_recurring: !!m.isRecurring,
      date_key: m.dateKey,
      created_date: m.createdDate,
    }));
    const { error } = await supabase.from('missions').insert(rows);
    if (error) return { ok: false, reason: error.message };
  }

  // 3) Replace completions — flatten {dateKey: {missionId: true}} → rows
  await supabase.from('completions').delete().eq('access_key', accessKey);
  const completionRows = [];
  Object.entries(completions).forEach(([dateKey, dayMap]) => {
    Object.entries(dayMap || {}).forEach(([missionId, completed]) => {
      if (completed) completionRows.push({ access_key: accessKey, mission_id: missionId, date_key: dateKey, completed: true });
    });
  });
  if (completionRows.length > 0) {
    const { error } = await supabase.from('completions').insert(completionRows);
    if (error) return { ok: false, reason: error.message };
  }

  // 4) Replace inventory
  await supabase.from('inventory').delete().eq('access_key', accessKey);
  if (inventory.length > 0) {
    const invRows = inventory.map((it, idx) => ({
      access_key: accessKey,
      item_id: it.id,
      item_name: it.name,
      purchased_at: it.purchasedAt || new Date(Date.now() - (inventory.length - idx) * 1000).toISOString(),
    }));
    const { error } = await supabase.from('inventory').insert(invRows);
    if (error) return { ok: false, reason: error.message };
  }

  return { ok: true, syncedAt: new Date().toISOString() };
};

/**
 * Pull from Supabase and overwrite local state. Use when "logging in" with an existing key.
 */
export const pullFromCloud = async (accessKey) => {
  if (!isSupabaseConfigured || !accessKey) return { ok: false, reason: 'not-configured' };

  // Stats
  const { data: statsRow, error: statsErr } = await supabase
    .from('user_stats')
    .select('*')
    .eq('access_key', accessKey)
    .maybeSingle();
  if (statsErr) return { ok: false, reason: statsErr.message };

  // First-time use of this key — no remote data yet. Push our local state up.
  if (!statsRow) {
    return pushToCloud(accessKey);
  }

  applyStatsToLocal(statsRow);

  // Missions
  const { data: missionRows } = await supabase.from('missions').select('*').eq('access_key', accessKey);
  writeLS(
    LS_KEYS.missions,
    (missionRows || []).map((m) => ({
      id: m.id,
      name: m.name,
      rank: m.rank,
      isRecurring: !!m.is_recurring,
      dateKey: m.date_key,
      createdDate: m.created_date,
    }))
  );

  // Completions — rebuild { dateKey: { missionId: true } }
  const { data: compRows } = await supabase.from('completions').select('*').eq('access_key', accessKey);
  const compMap = {};
  (compRows || []).forEach((row) => {
    compMap[row.date_key] = compMap[row.date_key] || {};
    compMap[row.date_key][row.mission_id] = !!row.completed;
  });
  writeLS(LS_KEYS.completions, compMap);

  // Inventory — rebuild minimal shape (icons re-hydrated from SHOP_ITEMS at render time)
  const { data: invRows } = await supabase.from('inventory').select('*').eq('access_key', accessKey);
  writeLS(
    LS_KEYS.inventory,
    (invRows || []).map((it) => ({ id: it.item_id, name: it.item_name, purchasedAt: it.purchased_at }))
  );

  return { ok: true, pulledAt: new Date().toISOString() };
};

// Debounced auto-push — call this on every state change; only fires after `delay` ms of quiet.
let _debounceTimer = null;
export const schedulePush = (accessKey, delay = 1500, onStatus) => {
  if (!isSupabaseConfigured || !accessKey) return;
  if (_debounceTimer) clearTimeout(_debounceTimer);
  _debounceTimer = setTimeout(async () => {
    onStatus?.('syncing');
    const result = await pushToCloud(accessKey);
    onStatus?.(result.ok ? 'synced' : 'error');
  }, delay);
};
