-- TEMPLE OF CHAOS — PERSONAL SANCTUARY DATABASE
-- Run this entire file once in Supabase SQL Editor.

create table if not exists public.user_prayers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text not null,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_devotions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text not null,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_deities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  relationship text,
  description text,
  symbolism text,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.saved_writings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  writing_type text not null,
  title text not null,
  content text,
  source_url text,
  created_at timestamptz not null default now(),
  unique(user_id, writing_type, title, source_url)
);

-- Optional account candle records. The current visual altar candles can still
-- work locally; this table gives us a permanent account record when we connect
-- the candle system to it.
create table if not exists public.user_candles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  deity text,
  intention text,
  color text,
  duration_seconds integer not null default 3600,
  started_at timestamptz not null default now(),
  extinguished_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists user_prayers_user_id_idx on public.user_prayers(user_id);
create index if not exists user_devotions_user_id_idx on public.user_devotions(user_id);
create index if not exists user_deities_user_id_idx on public.user_deities(user_id);
create index if not exists saved_writings_user_id_idx on public.saved_writings(user_id);
create index if not exists user_candles_user_id_idx on public.user_candles(user_id);

-- RLS
alter table public.user_prayers enable row level security;
alter table public.user_devotions enable row level security;
alter table public.user_deities enable row level security;
alter table public.saved_writings enable row level security;
alter table public.user_candles enable row level security;

-- Remove/recreate policies so this script can safely be run again.
drop policy if exists "prayers_owner_all" on public.user_prayers;
drop policy if exists "public_prayers_read" on public.user_prayers;
drop policy if exists "devotions_owner_all" on public.user_devotions;
drop policy if exists "public_devotions_read" on public.user_devotions;
drop policy if exists "deities_owner_all" on public.user_deities;
drop policy if exists "public_deities_read" on public.user_deities;
drop policy if exists "saved_writings_owner_all" on public.saved_writings;
drop policy if exists "candles_owner_all" on public.user_candles;

create policy "prayers_owner_all"
on public.user_prayers
for all to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "public_prayers_read"
on public.user_prayers
for select to anon, authenticated
using (is_public = true);

create policy "devotions_owner_all"
on public.user_devotions
for all to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "public_devotions_read"
on public.user_devotions
for select to anon, authenticated
using (is_public = true);

create policy "deities_owner_all"
on public.user_deities
for all to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "public_deities_read"
on public.user_deities
for select to anon, authenticated
using (is_public = true);

create policy "saved_writings_owner_all"
on public.saved_writings
for all to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "candles_owner_all"
on public.user_candles
for all to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Helpful view of public material is not required; the frontend can query the
-- three public tables directly with RLS.
