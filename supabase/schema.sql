-- TaskFlow database schema (Supabase / PostgreSQL)
-- Run in the Supabase SQL Editor on a fresh project.
-- Order matters: columns references boards, cards references columns,
-- subtasks and card_labels reference cards, card_labels references labels.

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
  priority text check (priority in ('low', 'medium', 'high')),
  position integer not null,
  created_at timestamptz default now()
);

create table subtasks (
  id uuid primary key default gen_random_uuid(),
  card_id uuid references cards on delete cascade not null,
  title text not null,
  is_done boolean not null default false,
  position integer not null,
  created_at timestamptz default now()
);

create table labels (
  id uuid primary key default gen_random_uuid(),
  board_id uuid references boards on delete cascade not null,
  name text not null,
  color text not null
    check (color in ('gray', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink')),
  created_at timestamptz default now()
);

create table card_labels (
  card_id uuid references cards on delete cascade not null,
  label_id uuid references labels on delete cascade not null,
  primary key (card_id, label_id)
);

create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) between 3 and 254),
  message text not null check (char_length(message) between 1 and 2000),
  created_at timestamptz default now()
);

-- ============ Row Level Security ============

alter table boards enable row level security;
alter table columns enable row level security;
alter table cards enable row level security;
alter table subtasks enable row level security;
alter table labels enable row level security;
alter table card_labels enable row level security;
alter table contact_messages enable row level security;

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

-- Subtasks: a user can only access subtasks on cards they own
-- (subtask -> card -> column -> board -> user).
create policy "Users manage subtasks on their own cards"
on subtasks
for all
to authenticated
using (
  card_id in (
    select cards.id from cards
    where cards.column_id in (
      select columns.id from columns
      where columns.board_id in (
        select boards.id from boards
        where boards.user_id = auth.uid()
      )
    )
  )
)
with check (
  card_id in (
    select cards.id from cards
    where cards.column_id in (
      select columns.id from columns
      where columns.board_id in (
        select boards.id from boards
        where boards.user_id = auth.uid()
      )
    )
  )
);

-- Labels: a user can only access labels on boards they own.
create policy "Users manage labels on their own boards"
on labels
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

-- Card labels: a card and a label can only be linked when both belong to
-- the same board, and that board is owned by the current user.
create policy "Users manage card labels on their own boards"
on card_labels
for all
to authenticated
using (
  exists (
    select 1
    from cards c
    join columns col on col.id = c.column_id
    join labels l on l.board_id = col.board_id
    join boards b on b.id = col.board_id
    where c.id = card_labels.card_id
      and l.id = card_labels.label_id
      and b.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from cards c
    join columns col on col.id = c.column_id
    join labels l on l.board_id = col.board_id
    join boards b on b.id = col.board_id
    where c.id = card_labels.card_id
      and l.id = card_labels.label_id
      and b.user_id = auth.uid()
  )
);

-- Contact messages: anyone may send one, but there is deliberately no
-- select policy, so nobody can read them through the public API.
-- Read them in the Supabase dashboard (Table Editor).
create policy "Anyone can send a contact message"
on contact_messages
for insert
to anon, authenticated
with check (true);

-- ============ Functions ============

-- Moves a card to a column and index, renumbering the affected columns so
-- positions stay 0..n. Runs as the caller (security invoker), so the row
-- level security policies above still apply.
create or replace function move_card(
  p_card_id uuid,
  p_target_column_id uuid,
  p_target_index integer
)
returns void
language plpgsql
security invoker
as $$
declare
  v_source_column_id uuid;
  v_index integer;
begin
  select column_id into v_source_column_id
  from cards
  where id = p_card_id;

  if v_source_column_id is null then
    raise exception 'Card not found';
  end if;

  -- Clamp the requested index to the valid range for the target column.
  select least(greatest(p_target_index, 0), count(*))
  into v_index
  from cards
  where column_id = p_target_column_id
    and id <> p_card_id;

  -- Move the card (row level security rejects a column the user doesn't own).
  update cards
  set column_id = p_target_column_id
  where id = p_card_id;

  -- Renumber the target column with the card at v_index.
  update cards c
  set position = n.new_pos
  from (
    select id, rn + case when rn >= v_index then 1 else 0 end as new_pos
    from (
      select id, row_number() over (order by position, created_at) - 1 as rn
      from cards
      where column_id = p_target_column_id and id <> p_card_id
    ) others
    union all
    select p_card_id, v_index
  ) n
  where c.id = n.id;

  -- Close the gap in the source column.
  if v_source_column_id <> p_target_column_id then
    update cards c
    set position = r.new_pos
    from (
      select id, row_number() over (order by position, created_at) - 1 as new_pos
      from cards
      where column_id = v_source_column_id
    ) r
    where c.id = r.id;
  end if;
end;
$$;