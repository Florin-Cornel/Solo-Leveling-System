# Epic Grind / Solo Leveling System v7

## Original Problem Statement
Build a responsive, gamified personal productivity web app (Solo Leveling theme) tracking daily tasks with RPG mechanics. Strict dark mode, Sung Jin-Woo & Igris aesthetic, gamified progress ring, Runes wallet, Mission Log with Ranks (S/A/B/C/D), Trophy Room (Hunter Ranks + Elden Lord), Shadow Extraction multiplier, Penalty Protocol, Status Page (XP, Level 1-100, attributes), Shop/Inventory system. Originally LocalStorage-only; v7 added optional Supabase cloud sync via self-generated "System Access Key" + item effects for shop purchases.

## Tech Stack
- React 19 + Tailwind CSS + craco
- LocalStorage (offline-first cache)
- Supabase JS v2 (`@supabase/supabase-js`) — optional cloud sync, gracefully degrades when env empty
- Shadcn UI + Lucide React icons
- GitHub Pages deploy via `.github/workflows/static.yml` → `cd frontend && npm run build`

## What's Been Implemented

### Core (v1–v5)
- [x] Mission Log + ProgressRing + date navigation + custom checkbox animations
- [x] 5-tier mission ranks (D/C/B/A/S) — colors, glow, icons
- [x] Runes wallet (EldenRune SVG, lifetimeRunes tracking)
- [x] Shadow Extraction 1.5x buff on A/S rank completion (per day)
- [x] RANK UP animation on 100% daily completion
- [x] Penalty Protocol — yesterday <3 missions triggers random penalty quest, -50 Runes, locks tabs
- [x] Trophy Room — Hunter Ranks (E→S), Elden Lord (10k runes), Secret Achievements
- [x] XP & Leveling 1-100 (`floor(level^1.5 * 100)`), Status Page with 5 attributes
- [x] LevelUpAnimation overlay
- [x] Sound FX (Web Audio API only — rune chime per rank, level-up, uncheck, delete)
- [x] GitHub Actions deploy workflow

### v6 Overhaul (Mar 4, 2026)
- [x] Centralized `gameConfig.js` with rank multipliers (1x–5x)
- [x] Unified `ShopAndInventory` (toggle between shop/inventory) replacing separate tabs
- [x] Lucide icons + multiplier badge on `MissionItem`
- [x] Directory consolidation back to `/app/frontend/`

### v7 Final Upgrade (Mar 15, 2026) ✅ 100% TESTED (iter-12)

**A. Supabase Cloud Sync (Optional)**
- [x] `lib/supabaseClient.js` — env-guarded client (`REACT_APP_SUPABASE_URL`, `REACT_APP_SUPABASE_ANON_KEY`). Returns `null` when env empty → graceful offline-only fallback.
- [x] `lib/syncService.js` — `pushToCloud(key)`, `pullFromCloud(key)`, debounced `schedulePush(key, 1500ms)`. Reconstructs all state from LS or DB.
- [x] `hooks/useSync.js` — pull-on-login, debounced auto-push on every state mutation, manual `syncNow()`.
- [x] `components/SystemLogin.jsx` — Shield-themed modal. User types self-generated **System Access Key** (passphrase). Same key on any device = synced progress. Suggests memorable 3-word key like `shadow-monarch-2026`.
- [x] `components/SyncIndicator.jsx` — header pill showing status (Offline / Syncing / Synced / Error).
- [x] `supabase_schema.sql` — 4 tables (`user_stats`, `missions`, `completions`, `inventory`) + indexes + permissive RLS policies.
- [x] `SUPABASE_SETUP.md` — step-by-step user setup guide.

**B. Item Effects System**
- [x] `config/itemEffects.js` — `ITEM_EFFECTS` map for the 3 effect items per user spec.
- [x] **Health Potion** — Use → +1 charge in header (♥ N). When penalty would trigger, charge is auto-consumed, penalty negated, toast "Health Potion negated the penalty!"
- [x] **Mana Crystal** — Use → +1 attribute point granted instantly (visible on Status tab)
- [x] **Monarch's Blessing** — Use → 24h timestamp stored. Header shows `Monarch 2x` badge while active. All XP/Rune gains doubled (stacks with Shadow Extraction).
- [x] Other 7 shop items (Shadow Essence, Dragon's Breath, Tome of Knowledge, Elixir of Strength, Hunter's Eye, Legendary Scroll, Star Fragment) remain as **collectibles** — no Use button rendered (gated by `hasEffect(id)`).

**C. Architectural Cleanup**
- [x] App.js refactored from ~610 → ~410 lines via 5 custom hooks:
  - `hooks/useWallet.js` — totalRunes, lifetimeRunes, addRunes, subtractRunes, animation flag
  - `hooks/useLeveling.js` — totalXP, currentLevel, attributes, availablePoints, addXP w/ level-up detection
  - `hooks/useMissions.js` — missions list, day-scoped completions, lifetime counters, CRUD
  - `hooks/useInventory.js` — purchase, useItem, healthPotion charges, monarch timer
  - `hooks/useSync.js` — cloud pull/push lifecycle
- [x] Self-hosted Web Audio fanfare (`playLevelUpFanfare` in `utils/sounds.js`) replaces ALL three Pixabay CDN MP3 references (LevelUpAnimation, RankUpAnimation, HunterRankUpModal) — **0 CDN requests** verified.
- [x] `showShopInventoryView` lifted to App.js root state — eliminates race condition where child useState was reset on re-render cascade after purchases. (Critical bug found in iter-10/11, fixed in iter-12.)

## Tested (Iteration 12 — 100% pass, 7/7)
1. ✅ In-session purchase → toggle-inventory → use-item flow
2. ✅ Monarch 2x multiplier on D-rank (200 XP + 80 Runes vs. 100/40 base)
3. ✅ Mana Crystal +1 attribute point
4. ✅ Health Potion negates penalty (auto-consumed on reload with seeded yesterday)
5. ✅ Audio: 0 Pixabay/MP3 requests
6. ✅ shadow_essence gated (no Use button)
7. ✅ Smoke checks: 4 nav tabs, Offline pill, disabled SystemLogin button when env empty

## File Structure (v7 Active)
```
/app/frontend/
├── package.json (+ @supabase/supabase-js)
├── craco.config.js (visual-edits load wrapped in try/catch)
├── supabase_schema.sql (run in Supabase SQL Editor)
├── SUPABASE_SETUP.md (user setup guide)
├── .env (REACT_APP_SUPABASE_URL/KEY — empty by default, fill in to enable sync)
├── public/
└── src/
    ├── App.js (~410 lines, uses 5 custom hooks)
    ├── index.js, index.css
    ├── lib/
    │   ├── supabaseClient.js (env-guarded)
    │   └── syncService.js (push/pull/debounce)
    ├── hooks/
    │   ├── useLocalStorage.js (+ cloud-pulled event listener)
    │   ├── useWallet.js, useLeveling.js, useMissions.js
    │   ├── useInventory.js, useSync.js
    │   └── use-toast.js
    ├── config/
    │   ├── gameConfig.js (RANK_CONFIG, SHOP_ITEMS, calculateRewards, getLevelFromXP)
    │   └── itemEffects.js (ITEM_EFFECTS map)
    ├── utils/{dateUtils, sounds (with playLevelUpFanfare Web Audio)}
    └── components/
        ├── SystemLogin.jsx (new — passphrase modal)
        ├── SyncIndicator.jsx (new — header status pill)
        ├── ShopAndInventory.jsx (Use buttons for items with effects; toggle lifted to App)
        ├── MissionItem.jsx, AddMissionModal.jsx, ProgressRing, RunesWallet, DateNavigator
        ├── StatusPage, XPBar, EldenRune, GoldenRune
        ├── LevelUpAnimation, RankUpAnimation, HunterRankUpModal (all Web Audio)
        ├── TrophyRoom, PenaltyQuest, Navigation
        └── ui/ (shadcn)
```

## Setup Steps to Enable Cloud Sync
1. Create a free Supabase project at supabase.com
2. Project Settings → API → copy Project URL + anon public key
3. Paste into `/app/frontend/.env`:
   ```
   REACT_APP_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```
4. Restart frontend: `sudo supervisorctl restart frontend`
5. In the app, click the sync pill → enter a System Access Key → click "Enter The System"
6. On any other device, open the same URL and type the SAME key to pull progress

See `frontend/SUPABASE_SETUP.md` for full instructions.

## Roadmap (Backlog)

### P1
- [ ] Item effects for remaining 7 shop items (currently collectibles)
- [ ] Single-shot guard for "Health Potion negated penalty" toast (StrictMode dev double-fire)
- [ ] Split `ShopAndInventory.jsx` (~280 lines) into `<Shop />` and `<Inventory />` for cleaner separation

### P2
- [ ] Daily streak tracker UI on Status Page
- [ ] Sound on/off toggle in a Settings panel
- [ ] PWA install support for mobile home-screen
- [ ] Export / Import progress JSON (offline backup)
- [ ] Supabase Auth migration path (email magic-link) to replace passphrase model when desired

## Credentials
- **No traditional auth** — uses self-generated passphrase ("System Access Key"). See `memory/test_credentials.md`.
- Supabase env intentionally empty in dev — app runs offline. Fill in `.env` to enable cloud sync.

## Known Notes
- The anon Supabase key in `.env` is **safe to ship in the frontend bundle** (no admin rights). RLS policies are intentionally permissive because the access key IS the credential.
- Playwright tests should run within one page session and wait ≥2s after state mutations for React commits.
- `craco.config.js` gracefully degrades if `plugins/visual-edits` is missing.
