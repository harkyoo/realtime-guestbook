-- Realtime Guestbook schema for Supabase

create extension if not exists "pgcrypto";

create table if not exists public.guestbook_entries (
  id uuid primary key default gen_random_uuid(),
  nickname text not null check (char_length(nickname) between 1 and 24),
  message text not null check (char_length(message) between 1 and 180),
  media_type text not null check (media_type in ('photo', 'drawing')),
  media_path text not null,
  thumbnail_path text,
  created_at timestamptz not null default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.guestbook_entries(id) on delete cascade,
  nickname text not null check (char_length(nickname) between 1 and 24),
  message text not null check (char_length(message) between 1 and 160),
  created_at timestamptz not null default now()
);

create index if not exists guestbook_entries_created_at_idx on public.guestbook_entries (created_at desc);
create index if not exists comments_entry_id_created_at_idx on public.comments (entry_id, created_at asc);

create or replace view public.entries_with_comment_counts as
select
  e.*,
  count(c.id)::int as comment_count
from public.guestbook_entries e
left join public.comments c on c.entry_id = e.id
group by e.id;

alter table public.guestbook_entries enable row level security;
alter table public.comments enable row level security;

create policy "Anyone can read guestbook entries"
  on public.guestbook_entries for select
  using (true);

create policy "Anyone can create guestbook entries"
  on public.guestbook_entries for insert
  with check (true);

create policy "Anyone can read comments"
  on public.comments for select
  using (true);

create policy "Anyone can create comments"
  on public.comments for insert
  with check (true);

insert into storage.buckets (id, name, public)
values ('guestbook-media', 'guestbook-media', true)
on conflict (id) do update set public = excluded.public;

create policy "Anyone can read guestbook media"
  on storage.objects for select
  using (bucket_id = 'guestbook-media');

create policy "Anyone can upload guestbook media"
  on storage.objects for insert
  with check (bucket_id = 'guestbook-media');

-- In Supabase Dashboard > Database > Replication, enable realtime for:
-- public.guestbook_entries
-- public.comments
