-- TaskFlow database schema (Supabase / PostgreSQL)
-- Run in the Supabase SQL Editor on a fresh project.
-- Order matters: columns references boards, cards references columns.

-- ============ Tables ============

create table boards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  title text not null,
  created_at timestamptz default now()
);

create table columns (
  id uuid primary key default gen_random_uuid(),
  board_id uuid references boards on delete cascade not null,
  title text not null,
  position integer not null
);

create table cards (
  id uuid primary key default gen_random_uuid(),
  column_id uuid references columns on delete cascade not null,
  title text not null,
  description text,
  position integer not null,
  created_at timestamptz default now()
);

-- ============ Row Level Security ============

alter table boards enable row level security;
alter table columns enable row level security;
alter table cards enable row level security;

-- ============ Policies ============

-- Boards: a user can only access boards they own.
create policy "Users manage their own boards"
on boards
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Columns: a user can only access columns on boards they own.
create policy "Users manage columns on their own boards"
on columns
for all
to authenticated
using (
  board_id in (
    select boards.id from boards
    where boards.user_id = auth.uid()
  )
)
with check (
  board_id in (
    select boards.id from boards
    where boards.user_id = auth.uid()
  )
);

-- Cards: a user can only access cards in columns on boards they own.
create policy "Users manage cards on their own boards"
on cards
for all
to authenticated
using (
  column_id in (
    select columns.id from columns
    where columns.board_id in (
      select boards.id from boards
      where boards.user_id = auth.uid()
    )
  )
)
with check (
  column_id in (
    select columns.id from columns
    where columns.board_id in (
      select boards.id from boards
      where boards.user_id = auth.uid()
    )
  )
);