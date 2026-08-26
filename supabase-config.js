-- TEMPLE OF CHAOS: account nickname uniqueness + dedicated candles
-- Run this in Supabase SQL Editor.
--
-- Nicknames are case-insensitive, so "Celestina" and "celestina" cannot both exist.

create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    nickname text not null,
    created_at timestamptz not null default now()
);

create unique index if not exists profiles_nickname_lower_unique
    on public.profiles (lower(trim(nickname)));

alter table public.profiles enable row level security;

do $$
begin
    if not exists (
        select 1 from pg_policies
        where schemaname = 'public'
          and tablename = 'profiles'
          and policyname = 'profiles_select_authenticated'
    ) then
        create policy profiles_select_authenticated
        on public.profiles for select
        to authenticated
        using (true);
    end if;
end $$;

-- Automatically create a profile from the nickname supplied during signup.
create or replace function public.handle_new_temple_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
    requested_nickname text;
begin
    requested_nickname := trim(coalesce(new.raw_user_meta_data ->> 'username', ''));

    if requested_nickname = '' then
        requested_nickname := 'Nameless';
    end if;

    insert into public.profiles (id, nickname)
    values (new.id, requested_nickname);

    return new;
exception
    when unique_violation then
        raise exception 'That name is already taken. Please choose another name.';
end;
$$;

drop trigger if exists on_auth_user_created_temple_profile on auth.users;

create trigger on_auth_user_created_temple_profile
after insert on auth.users
for each row
execute function public.handle_new_temple_profile();


-- Dedicated candles saved to the user's Sanctuary.
create table if not exists public.user_candles (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    dedication_id text not null,
    deity text,
    intention text,
    status text not null default 'active',
    duration text,
    burn_until text not null default 'forever',
    candle_color text,
    flame_color text,
    hidden boolean not null default false,
    created_at timestamptz not null default now()
);

alter table public.user_candles add column if not exists dedication_id text;
alter table public.user_candles add column if not exists deity text;
alter table public.user_candles add column if not exists intention text;
alter table public.user_candles add column if not exists status text default 'active';
alter table public.user_candles add column if not exists duration text;
alter table public.user_candles add column if not exists burn_until text default 'forever';
alter table public.user_candles add column if not exists candle_color text;
alter table public.user_candles add column if not exists flame_color text;
alter table public.user_candles add column if not exists hidden boolean default false;
alter table public.user_candles add column if not exists created_at timestamptz default now();

create unique index if not exists user_candles_dedication_unique
    on public.user_candles(dedication_id);

alter table public.user_candles enable row level security;

do $$
begin
    if not exists (
        select 1 from pg_policies
        where schemaname = 'public'
          and tablename = 'user_candles'
          and policyname = 'users_manage_own_candles'
    ) then
        create policy users_manage_own_candles
        on public.user_candles for all
        to authenticated
        using (auth.uid() = user_id)
        with check (auth.uid() = user_id);
    end if;
end $$;


-- Public, safe nickname check used by the registration form.
-- This does NOT expose the profiles table to anonymous visitors.
create or replace function public.is_nickname_taken(requested_nickname text)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
    select exists (
        select 1
        from public.profiles
        where lower(trim(nickname)) = lower(trim(requested_nickname))
    );
$$;

revoke all on function public.is_nickname_taken(text) from public;
grant execute on function public.is_nickname_taken(text) to anon, authenticated;
