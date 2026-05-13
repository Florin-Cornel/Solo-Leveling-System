-- ============================================================
-- SOLO LEVELING SYSTEM — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================
-- Auth pattern: NO Supabase Auth. Each user types a self-generated
-- "System Access Key" (passphrase). All rows are scoped by access_key.
-- RLS is enabled with permissive anon policies because the access_key
-- itself is the credential (knowing it = owning the data).
-- For higher security later, switch to Supabase Auth + auth.uid().
-- ============================================================

-- ---------- TABLES ----------

create table if not exists public.user_stats (
  access_key            text primary key,
  total_runes           integer       default 0,
  total_xp              integer       default 0,
  current_level         integer       default 1,
  lifetime_runes        integer       default 0,
  lifetime_missions     integer       default 0,
  attributes            jsonb         default '{"strength":10,"agility":10,"vitality":10,"intelligence":10,"perception":10}'::jsonb,
  available_points      integer       default 0,
  mission_counts        jsonb         default '{"D":0,"C":0,"B":0,"A":0,"S":0}'::jsonb,
  streak_days           integer       default 0,
  hunter_rank_achieved  jsonb         default '["e-rank"]'::jsonb,
  penalty_data          jsonb         default '{"active":false}'::jsonb,
  shadow_buff_data      jsonb         default '{}'::jsonb,
  rankup_shown          jsonb         default '{}'::jsonb,
  monarch_blessing_until timestamptz,
  health_potion_charges integer       default 0,
  updated_at            timestamptz   default now()
);

create table if not exists public.missions (
  id            text primary key,
  access_key    text not null,
  name          text not null,
  rank          text not null check (rank in ('D','C','B','A','S')),
  is_recurring  boolean default false,
  date_key      text not null,
  created_date  text not null,
  created_at    timestamptz default now()
);

create table if not exists public.completions (
  access_key    text not null,
  mission_id    text not null,
  date_key      text not null,
  completed     boolean default true,
  created_at    timestamptz default now(),
  primary key (access_key, mission_id, date_key)
);

create table if not exists public.inventory (
  id            uuid primary key default gen_random_uuid(),
  access_key    text not null,
  item_id       text not null,
  item_name     text not null,
  purchased_at  timestamptz default now()
);

-- ---------- INDEXES (scoped lookups) ----------

create index if not exists idx_missions_access_key   on public.missions(access_key);
create index if not exists idx_completions_access    on public.completions(access_key);
create index if not exists idx_completions_date      on public.completions(date_key);
create index if not exists idx_inventory_access      on public.inventory(access_key);

-- ---------- RLS ----------
-- The access_key column itself is the credential. Anon role is allowed
-- to do everything; the client always filters by access_key.

alter table public.user_stats  enable row level security;
alter table public.missions    enable row level security;
alter table public.completions enable row level security;
alter table public.inventory   enable row level security;

-- Permissive anon policies (recreate idempotently)
drop policy if exists "anon all user_stats"   on public.user_stats;
drop policy if exists "anon all missions"     on public.missions;
drop policy if exists "anon all completions"  on public.completions;
drop policy if exists "anon all inventory"    on public.inventory;

create policy "anon all user_stats"   on public.user_stats   for all to anon using (true) with check (true);
create policy "anon all missions"     on public.missions     for all to anon using (true) with check (true);
create policy "anon all completions"  on public.completions  for all to anon using (true) with check (true);
create policy "anon all inventory"    on public.inventory    for all to anon using (true) with check (true);

-- ---------- updated_at trigger on user_stats ----------

create or replace function public.touch_updated_at() returns trigger as $$
begin
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_user_stats_updated_at on public.user_stats;
create trigger trg_user_stats_updated_at
  before update on public.user_stats
  for each row execute function public.touch_updated_at();
