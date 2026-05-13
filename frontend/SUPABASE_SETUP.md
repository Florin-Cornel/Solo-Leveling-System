# Solo Leveling System — Supabase Cloud Setup

The app works **fully offline** out of the box (LocalStorage). To enable cross-device sync between PC ↔ Mobile, follow these steps:

## 1. Create a Supabase project (free tier)

1. Go to <https://supabase.com> → Sign in → **New project**
2. Pick any name, generate a strong DB password (you won't need it for this client-only app)
3. Choose the region closest to you
4. Wait ~2 minutes for provisioning

## 2. Get your API credentials

In the Supabase dashboard:

1. **Project Settings** (gear icon, bottom-left) → **API**
2. Copy two values:
   - **Project URL** → `REACT_APP_SUPABASE_URL`
   - **Project API keys → `anon` `public`** → `REACT_APP_SUPABASE_ANON_KEY`

## 3. Run the schema

1. In the Supabase dashboard → **SQL Editor** → **New query**
2. Paste the entire contents of [`supabase_schema.sql`](./supabase_schema.sql)
3. Click **Run**

You should see "Success. No rows returned." — that means the four tables (`user_stats`, `missions`, `completions`, `inventory`) were created with RLS policies.

## 4. Paste credentials into the app

Edit `/app/frontend/.env`:

```
REACT_APP_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOi...
```

Then restart the dev server:

```bash
sudo supervisorctl restart frontend
```

## 5. Log in with a System Access Key

1. Click the **sync indicator pill** in the top-left of the app header (the "Local" / "Offline" badge)
2. Type any memorable passphrase, e.g. `shadow-monarch-igris-2026`
3. Click **Enter The System** — your local progress is uploaded
4. On another device, install the app (or open the same URL) and type **the same passphrase** to pull your progress down

## Security notes

- The anon public key is **safe to ship in the frontend bundle** — it has no admin rights.
- RLS policies are permissive (anyone can read/write `access_key` rows), so the passphrase IS your credential. **Treat it like a password.** Anyone who knows your key can read/edit your data.
- For higher security, you can later switch to Supabase Auth (email magic-link) and tighten RLS to `auth.uid()`. The schema is forward-compatible.

## What gets synced

All app state:

- Mission list + completion history
- XP, level, attribute allocations, available points
- Runes balance + lifetime runes
- Inventory (purchases) + Health Potion charges + Monarch's Blessing timer
- Shadow Extraction buff per day, Hunter Ranks achieved, Penalty state, streak days

## Offline behavior

- Without Supabase configured (empty env), the app behaves identically to v6 — pure LocalStorage.
- With Supabase configured but no key entered, the app is local-only until you log in.
- With a key entered, writes go to LocalStorage instantly (zero latency) and a debounced push to Supabase runs 1.5s after the last change.
- The **Sync Now** button forces an immediate push.

## Troubleshooting

| Symptom | Fix |
|---|---|
| Sync pill stays "Local" after restart | Check `frontend/.env` keys are set + restart `frontend` supervisor |
| "Sync Error" in modal | Open Supabase Dashboard → Logs → Postgres Logs to see the exact error. Usually means RLS is blocking — re-run `supabase_schema.sql`. |
| Data didn't pull on another device | Make sure you typed the **exact same** access key. Keys are case-sensitive. |
| Want a fresh start | Open the modal → **Disconnect** → enter a brand-new key. The old key's data stays in Supabase untouched. |
