# Epic Grind - Gamified Productivity App v6

## Original Problem Statement
Build a responsive, gamified personal productivity web app (Solo Leveling theme) that tracks daily tasks, visualizes completion progress, and uses RPG mechanics. Strict dark mode, Sung Jin-Woo & Igris characters, gamified progress ring, Runes wallet, Mission Log with Ranks (S/A/B/C/D), Trophy Room (Hunter Ranks + Elden Lord), Shadow Extraction multiplier buff, Penalty Protocol, Status Page (XP, Level 1-100, attributes), Shop/Inventory system. Deploys to GitHub Pages via Actions.

## Tech Stack
- React 19 + Tailwind CSS + craco
- LocalStorage only (no backend / DB)
- Shadcn UI + Lucide React icons
- GitHub Pages compatible (code at `/app/frontend/`, deployed via `.github/workflows/static.yml` → `cd frontend && npm run build`)

## What's Been Implemented

### Core (v1–v5)
- [x] Mission Log with date navigation + ProgressRing + custom checkbox animations
- [x] 5-tier mission ranks (D/C/B/A/S) — colors, glow, icons
- [x] Runes wallet with EldenRune SVG, lifetimeRunes tracking
- [x] Shadow Extraction (1.5x buff active for the day after any A/S rank completion)
- [x] RANK UP animation on 100% daily completion
- [x] Penalty Protocol (yesterday <3 missions → random penalty quest, -50 Runes, locks shop/status/trophies)
- [x] Trophy Room: Hunter Ranks (E→S, threshold-gated), Elden Lord (10k lifetime runes), Secret Achievements
- [x] XP & Leveling 1-100 (formula `floor(level^1.5 * 100)`), Status Page with 5 attributes (Strength/Agility/Vitality/Intelligence/Perception)
- [x] LevelUpAnimation overlay
- [x] Sound FX (rune chime per rank, level-up, uncheck, delete)
- [x] GitHub Actions deploy workflow

### v6 — "Senior Software Engineer Overhaul" (Mar 15, 2026) ✅ COMPLETE
- [x] **Centralized `gameConfig.js`** — RANK_CONFIG with per-rank `multiplier` (1x–5x), `baseXP`, `baseRunes`, color/icon. Single source of truth for rank styling and reward math.
- [x] **`calculateRewards(rank)`** helper — used everywhere (App.js, MissionItem, AddMissionModal) instead of scattered RUNES_VALUES/XP_REWARDS constants.
- [x] **Unified `ShopAndInventory.jsx`** — replaces separate `RewardShop` + `ShadowInventory` tabs. Single Shop tab with toggle-button to switch between Shop and Inventory views. Predefined items from `SHOP_ITEMS` (Health Potion, Mana Crystal, Shadow Essence, Dragon's Breath, Tome of Knowledge, Elixir of Strength, Hunter's Eye, Legendary Scroll, Star Fragment, Monarch's Blessing). Category filter chips.
- [x] **Icon re-hydration** — inventory items stored in LocalStorage by id; icons re-resolved from `SHOP_ITEMS` config at render time (React components can't be serialized).
- [x] **Lucide-React icons** on `MissionItem` with multiplier badge ("Nx Rewards") + XP/Runes preview chips.
- [x] **Mobile-friendly Level-Up animation** — `onTouchEnd` + `onClick` to dismiss anywhere on overlay (still auto-dismisses after 3s).
- [x] **Dynamic styling** via `RANK_CONFIG` (bgColor/borderColor/glowColor from config, not hardcoded).
- [x] **Directory consolidation** — removed duplicate `/app/src/` at root; single source of truth is `/app/frontend/` (where supervisor and CI both expect it).
- [x] **CSS animations** for slide-in, shimmer, particle float, text glow, purple flash, elden rune pulse.

## Tested (iteration_8 — 100% pass)
- App load, navigation tabs (missions/status/shop/trophies — no separate inventory)
- Mission create/toggle with rank-based rewards via `calculateRewards`
- XP earned, Level up triggers animation, +5 attribute points granted
- Status Page attribute allocation
- Unified shop: purchase deducts runes, toggle to inventory view shows item with re-hydrated icon and count
- Trophy Room, Shadow Extraction 1.5x buff, Penalty access-lock toast
- LocalStorage persistence across reload, uncomplete truth-reflection

## File Structure (Active)
```
/app/frontend/
├── package.json
├── craco.config.js  (visual-edits load wrapped in try/catch)
├── public/
├── src/
│   ├── App.js                              (main, ~610 lines)
│   ├── index.js, index.css
│   ├── config/gameConfig.js                (RANK_CONFIG, SHOP_ITEMS, calculateRewards, leveling)
│   ├── hooks/useLocalStorage.js
│   ├── utils/{dateUtils.js, sounds.js}
│   └── components/
│       ├── MissionItem.jsx        (Lucide + multiplier)
│       ├── ShopAndInventory.jsx   (unified)
│       ├── StatusPage.jsx         (attribute allocation)
│       ├── XPBar.jsx, LevelUpAnimation.jsx, EldenRune.jsx
│       ├── TrophyRoom.jsx (Hunter Ranks + Elden Lord + Secret Achievements)
│       ├── ProgressRing, RunesWallet, DateNavigator, AddMissionModal
│       ├── HunterRankUpModal, RankUpAnimation, PenaltyQuest, Navigation
│       ├── GoldenRune.jsx
│       └── ui/  (shadcn)
└── .github/workflows/static.yml
```

## Roadmap (Backlog)

### P1
- [ ] Refactor `App.js` (~610 lines) into custom hooks: `useMissions`, `useLeveling`, `useWallet`, `usePenalty` for maintainability
- [ ] Self-host level-up audio locally (current pixabay CDN returns 403 in some envs — currently caught)

### P2
- [ ] Add more secret achievements (Iron Will, Rune Hoarder, Shadow General — config already in TrophyRoom.jsx, wire up Level check)
- [ ] Item effects when consumed from inventory (e.g., Health Potion = -1 mission penalty, Mana Crystal = +1 attribute point)
- [ ] Daily mission streak tracker on the StatusPage
- [ ] Sound on/off toggle in a Settings panel
- [ ] PWA install support for mobile home-screen
- [ ] Export / Import progress JSON (backup)

## Credentials
N/A — fully client-side, LocalStorage only.

## Known Notes
- App is client-side only. `REACT_APP_BACKEND_URL` is set but the app makes no backend calls.
- Visual-edits plugin folder isn't shipped; craco.config.js gracefully degrades if missing.
- Playwright tests must run within one page session (localStorage clears between independent contexts).
