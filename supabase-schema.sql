-- ─── Dotshot Database Schema ───────────────────────────────────────────────
-- Run this in: Supabase Dashboard → SQL Editor
-- ──────────────────────────────────────────────────────────────────────────

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── Profiles ───────────────────────────────────────────────────────────────
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  full_name text not null,
  avatar_url text,
  bio text,
  role text not null default 'photographer',
  location text,
  city text,
  state text,
  country text default 'US',
  website text,
  instagram text,
  tiktok text,
  subscription_tier text default 'free' check (subscription_tier in ('free', 'pro', 'elite')),
  is_verified boolean default false,
  rating numeric(3,2) default 0,
  review_count int default 0,
  completed_projects int default 0,
  top_collaborators uuid[] default '{}',
  portfolio_images text[] default '{}',
  specialties text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Row Level Security
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select using (true);

create policy "Users can insert their own profile."
  on profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile."
  on profiles for update using (auth.uid() = id);

-- ─── Forum Posts ────────────────────────────────────────────────────────────
create table forum_posts (
  id uuid default uuid_generate_v4() primary key,
  author_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  body text not null,
  tags text[] default '{}',
  category text default 'general' check (category in ('collab_request', 'general', 'showcase', 'advice')),
  location text,
  upvotes int default 0,
  reply_count int default 0,
  is_pinned boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table forum_posts enable row level security;

create policy "Forum posts viewable by everyone." on forum_posts for select using (true);
create policy "Authenticated users can create posts." on forum_posts for insert with check (auth.uid() = author_id);
create policy "Authors can update their posts." on forum_posts for update using (auth.uid() = author_id);
create policy "Authors can delete their posts." on forum_posts for delete using (auth.uid() = author_id);

-- ─── Forum Replies ──────────────────────────────────────────────────────────
create table forum_replies (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references forum_posts(id) on delete cascade not null,
  author_id uuid references profiles(id) on delete cascade not null,
  body text not null,
  upvotes int default 0,
  created_at timestamptz default now()
);

alter table forum_replies enable row level security;
create policy "Replies viewable by everyone." on forum_replies for select using (true);
create policy "Authenticated users can reply." on forum_replies for insert with check (auth.uid() = author_id);

-- ─── Campaigns ──────────────────────────────────────────────────────────────
create table campaigns (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  description text not null,
  location text not null,
  city text not null,
  state text,
  country text default 'US',
  budget_min numeric(10,2) not null,
  budget_max numeric(10,2) not null,
  roles_needed text[] default '{}',
  start_date date not null,
  end_date date,
  status text default 'open' check (status in ('open', 'casting', 'in_progress', 'completed', 'cancelled')),
  is_featured boolean default false,
  application_count int default 0,
  deliverables text[] default '{}',
  requirements text[] default '{}',
  images text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table campaigns enable row level security;
create policy "Campaigns viewable by everyone." on campaigns for select using (true);
create policy "Pro/elite users can create campaigns." on campaigns for insert with check (auth.uid() = client_id);
create policy "Campaign owners can update." on campaigns for update using (auth.uid() = client_id);

-- ─── Campaign Applications ──────────────────────────────────────────────────
create table campaign_applications (
  id uuid default uuid_generate_v4() primary key,
  campaign_id uuid references campaigns(id) on delete cascade not null,
  applicant_id uuid references profiles(id) on delete cascade not null,
  role text not null,
  cover_note text,
  status text default 'pending' check (status in ('pending', 'shortlisted', 'selected', 'rejected')),
  bid_amount numeric(10,2),
  created_at timestamptz default now(),
  unique(campaign_id, applicant_id, role)
);

alter table campaign_applications enable row level security;
create policy "Applicants can see own applications." on campaign_applications for select using (auth.uid() = applicant_id);
create policy "Campaign owners can see all applications." on campaign_applications for select using (
  auth.uid() = (select client_id from campaigns where id = campaign_id)
);
create policy "Authenticated users can apply." on campaign_applications for insert with check (auth.uid() = applicant_id);

-- ─── Messages ───────────────────────────────────────────────────────────────
create table messages (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references profiles(id) on delete cascade not null,
  receiver_id uuid references profiles(id) on delete cascade not null,
  body text not null,
  read boolean default false,
  created_at timestamptz default now()
);

alter table messages enable row level security;
create policy "Users can see their own messages." on messages for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);
create policy "Authenticated users can send messages." on messages for insert
  with check (auth.uid() = sender_id);

-- ─── Reviews ────────────────────────────────────────────────────────────────
create table reviews (
  id uuid default uuid_generate_v4() primary key,
  reviewer_id uuid references profiles(id) on delete cascade not null,
  subject_id uuid references profiles(id) on delete cascade not null,
  campaign_id uuid references campaigns(id) on delete set null,
  rating int not null check (rating between 1 and 5),
  body text,
  created_at timestamptz default now(),
  unique(reviewer_id, subject_id, campaign_id)
);

alter table reviews enable row level security;
create policy "Reviews viewable by everyone." on reviews for select using (true);
create policy "Authenticated users can write reviews." on reviews for insert with check (auth.uid() = reviewer_id);

-- ─── Contracts ──────────────────────────────────────────────────────────────
create table contracts (
  id uuid default uuid_generate_v4() primary key,
  campaign_id uuid references campaigns(id) on delete cascade not null,
  creative_id uuid references profiles(id) on delete cascade not null,
  client_id uuid references profiles(id) on delete cascade not null,
  role text not null,
  payment_amount numeric(10,2) not null,
  signed_at timestamptz,
  status text default 'pending' check (status in ('pending', 'signed', 'completed', 'disputed', 'terminated')),
  terminated_at timestamptz,
  termination_reason text,
  created_at timestamptz default now()
);

alter table contracts enable row level security;
create policy "Contract parties can view their contracts." on contracts for select
  using (auth.uid() = creative_id or auth.uid() = client_id);

-- ─── Network connections ─────────────────────────────────────────────────────
create table connections (
  follower_id uuid references profiles(id) on delete cascade not null,
  following_id uuid references profiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  primary key (follower_id, following_id)
);

alter table connections enable row level security;
create policy "Connections viewable by everyone." on connections for select using (true);
create policy "Authenticated users can connect." on connections for insert with check (auth.uid() = follower_id);
create policy "Users can disconnect." on connections for delete using (auth.uid() = follower_id);

-- ─── Functions ───────────────────────────────────────────────────────────────

-- Auto-create profile on user signup
-- SAFE VERSION: handles duplicate usernames and never blocks auth signup
create or replace function handle_new_user()
returns trigger as $$
declare
  base_username text;
  final_username text;
  user_full_name text;
begin
  -- Build a clean base username from the email prefix
  base_username := regexp_replace(split_part(new.email, '@', 1), '[^a-zA-Z0-9_]', '_', 'g');
  final_username := base_username;
  user_full_name := coalesce(
    nullif(trim(new.raw_user_meta_data->>'full_name'), ''),
    base_username
  );

  -- If that username is already taken, append 4 random chars
  if exists (select 1 from profiles where username = final_username) then
    final_username := base_username || '_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 4);
  end if;

  insert into profiles (id, username, full_name, avatar_url, role)
  values (
    new.id,
    final_username,
    user_full_name,
    new.raw_user_meta_data->>'avatar_url',
    coalesce(nullif(trim(new.raw_user_meta_data->>'role'), ''), 'photographer')
  );

  return new;
exception
  when others then
    -- Never block auth signup — if profile creation fails, auth still succeeds
    return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Update rating when a review is added
create or replace function update_profile_rating()
returns trigger as $$
begin
  update profiles
  set
    rating = (select avg(rating) from reviews where subject_id = new.subject_id),
    review_count = (select count(*) from reviews where subject_id = new.subject_id)
  where id = new.subject_id;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_review_added
  after insert on reviews
  for each row execute procedure update_profile_rating();

-- ─── Bookings / Calendar ─────────────────────────────────────────────────────
create table bookings (
  id uuid default uuid_generate_v4() primary key,
  requester_id uuid references profiles(id) on delete cascade not null,
  host_id uuid references profiles(id) on delete cascade not null,
  campaign_id uuid references campaigns(id) on delete set null,
  -- virtual = Jitsi video call · scout = public location preview · collab = the actual shoot
  type text not null default 'virtual' check (type in ('virtual', 'scout', 'collab')),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  title text not null,
  notes text,
  scheduled_at timestamptz not null,
  duration_minutes int default 30,
  meeting_link text,        -- auto-generated Jitsi URL for virtual, or address for in-person
  location_notes text,      -- for scouts: describe the spot, share public landmark
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table bookings enable row level security;
create policy "Participants can view their bookings." on bookings for select
  using (auth.uid() = requester_id or auth.uid() = host_id);
create policy "Authenticated users can create bookings." on bookings for insert
  with check (auth.uid() = requester_id);
create policy "Participants can update bookings." on bookings for update
  using (auth.uid() = requester_id or auth.uid() = host_id);
create policy "Participants can cancel bookings." on bookings for delete
  using (auth.uid() = requester_id or auth.uid() = host_id);

-- ─── Creative Radar: map visibility columns ──────────────────────────────────
-- Run this ALTER in Supabase SQL Editor if profiles table already exists
alter table profiles
  add column if not exists map_visible boolean default false,
  add column if not exists lat numeric(9, 6),
  add column if not exists lng numeric(9, 6),
  add column if not exists map_updated_at timestamptz;

-- Index for fast map queries (only visible profiles with coords)
create index if not exists profiles_map_visible_idx
  on profiles (map_visible, lat, lng)
  where map_visible = true and lat is not null and lng is not null;

-- ─── Marketplace Listings ────────────────────────────────────────────────────
create table marketplace_listings (
  id uuid default uuid_generate_v4() primary key,
  seller_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  description text not null,
  price numeric(10,2),
  type text not null default 'sell' check (type in ('sell', 'trade', 'free')),
  condition text not null default 'good' check (condition in ('new', 'like_new', 'good', 'fair')),
  category text not null,
  location text,
  images text[] default '{}',
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table marketplace_listings enable row level security;
create policy "Active listings viewable by everyone." on marketplace_listings for select using (is_active = true);
create policy "Sellers can create listings." on marketplace_listings for insert with check (auth.uid() = seller_id);
create policy "Sellers can update their listings." on marketplace_listings for update using (auth.uid() = seller_id);
create policy "Sellers can delete their listings." on marketplace_listings for delete using (auth.uid() = seller_id);
