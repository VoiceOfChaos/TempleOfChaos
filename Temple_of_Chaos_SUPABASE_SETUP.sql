-- =====================================================
-- TEMPLE OF CHAOS
-- SUPABASE ACCOUNT SETUP
-- =====================================================


-- =====================================================
-- PROFILES
-- =====================================================

create table if not exists public.profiles (

    id uuid
        primary key
        references auth.users(id)
        on delete cascade,

    username text,

    created_at timestamptz
        not null
        default now()

);


-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

alter table public.profiles
enable row level security;


-- =====================================================
-- USERS CAN READ THEIR OWN PROFILE
-- =====================================================

create policy
"Users can read their own profile"

on public.profiles

for select

to authenticated

using (
    auth.uid() = id
);


-- =====================================================
-- USERS CAN CREATE THEIR OWN PROFILE
-- =====================================================

create policy
"Users can create their own profile"

on public.profiles

for insert

to authenticated

with check (
    auth.uid() = id
);


-- =====================================================
-- USERS CAN UPDATE THEIR OWN PROFILE
-- =====================================================

create policy
"Users can update their own profile"

on public.profiles

for update

to authenticated

using (
    auth.uid() = id
)

with check (
    auth.uid() = id
);


/* =====================================================
   CREATE PROFILE AUTOMATICALLY AFTER REGISTRATION
===================================================== */

create or replace function
public.handle_new_user()

returns trigger

language plpgsql

security definer

set search_path = public

as $$

begin

    insert into public.profiles (
        id,
        username
    )

    values (
        new.id,
        new.raw_user_meta_data->>'username'
    );

    return new;

end;

$$;


drop trigger if exists
on_auth_user_created
on auth.users;


create trigger
on_auth_user_created

after insert on auth.users

for each row

execute procedure
public.handle_new_user();
