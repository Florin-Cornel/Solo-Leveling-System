# Test Credentials

This app does NOT use traditional authentication (no email/password).

## System Access Key (passphrase-based sync)

Users self-generate a passphrase. For automated testing, use:

- **Test key (offline mode)**: any passphrase works because Supabase env is empty by default → falls back to LocalStorage-only mode.
- **Suggested format**: `shadow-monarch-2026`

## Supabase env vars

The `.env` file currently has empty placeholders:

```
REACT_APP_SUPABASE_URL=
REACT_APP_SUPABASE_ANON_KEY=
```

To test the **online sync path**, paste a real Supabase project URL + anon key (see `frontend/SUPABASE_SETUP.md`) and restart `frontend` supervisor.

Without those, the System Access modal opens fine but shows the "Cloud not configured" warning and the **Enter The System** button is disabled — this is the expected graceful-degradation behavior.

## Test flow (no auth needed)

1. App loads at `REACT_APP_BACKEND_URL`
2. Click the sync pill in the top-left header → opens SystemLogin modal
3. Without Supabase configured → see amber warning, button disabled (verify graceful degradation)
4. All other flows (missions, XP, shop, trophies, item effects) work without any login.
