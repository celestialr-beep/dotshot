-- ─── Dotshot Gig Safety Schema ───────────────────────────────────────────────
-- Run this in: Supabase Dashboard → SQL Editor
-- ──────────────────────────────────────────────────────────────────────────

-- Add emergency contact fields to profiles
alter table profiles
  add column if not exists emergency_contact_name text,
  add column if not exists emergency_contact_phone text,
  add column if not exists emergency_contact_email text;

-- ─── Gig Check-ins ──────────────────────────────────────────────────────────
create table if not exists gig_checkins (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  gig_name text not null,
  location_address text not null,
  location_lat numeric,
  location_lng numeric,
  emergency_contact_name text not null,
  emergency_contact_phone text,
  emergency_contact_email text not null,
  checkin_time timestamptz default now() not null,
  expected_checkout_time timestamptz not null,
  actual_checkout_time timestamptz,
  status text default 'checked_in' check (status in ('checked_in', 'checked_out', 'overdue', 'panic')),
  panic_triggered_at timestamptz,
  notes text,
  created_at timestamptz default now()
);

alter table gig_checkins enable row level security;

create policy "Users can manage their own checkins."
  on gig_checkins for all using (auth.uid() = user_id);

-- Auto-mark overdue checkins (runs check, does not send email — that's handled by Edge Function)
create or replace function mark_overdue_checkins()
returns void as $$
begin
  update gig_checkins
  set status = 'overdue'
  where status = 'checked_in'
    and expected_checkout_time < now();
end;
$$ language plpgsql security definer;
