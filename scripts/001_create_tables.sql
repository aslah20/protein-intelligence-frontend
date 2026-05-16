-- Create admin_users table
create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create research_submissions table
create table if not exists public.research_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text not null,
  content_type text not null check (content_type in ('dataset', 'article', 'essay', 'paper', 'other')),
  file_url text,
  file_name text,
  author_name text not null,
  author_email text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  rejection_reason text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  approved_by uuid references auth.users(id),
  approved_at timestamp with time zone
);

-- Create published_content table (approved submissions)
create table if not exists public.published_content (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid unique not null references public.research_submissions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text not null,
  content_type text not null,
  file_url text,
  file_name text,
  author_name text not null,
  author_email text not null,
  published_at timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table public.admin_users enable row level security;
alter table public.research_submissions enable row level security;
alter table public.published_content enable row level security;

-- Admin users policies
create policy "admin_users_select_own" on public.admin_users for select using (auth.uid() = id);
create policy "admin_users_insert_own" on public.admin_users for insert with check (auth.uid() = id);
create policy "admin_users_update_own" on public.admin_users for update using (auth.uid() = id);

-- Research submissions policies
create policy "submissions_select_own" on public.research_submissions for select using (auth.uid() = user_id);
create policy "submissions_insert_own" on public.research_submissions for insert with check (auth.uid() = user_id);
create policy "submissions_update_own" on public.research_submissions for update using (auth.uid() = user_id);
create policy "submissions_delete_own" on public.research_submissions for delete using (auth.uid() = user_id);

-- Admin can view all submissions
create policy "admin_submissions_select" on public.research_submissions for select using (
  exists (select 1 from public.admin_users where id = auth.uid())
);

-- Admin can update submissions (approve/reject)
create policy "admin_submissions_update" on public.research_submissions for update using (
  exists (select 1 from public.admin_users where id = auth.uid())
);

-- Published content policies - anyone can view
create policy "published_content_select_all" on public.published_content for select using (true);

-- Only the author can view their own submissions
create policy "published_content_insert_own" on public.published_content for insert with check (auth.uid() = user_id);

-- Only admins can insert approved content
create policy "published_content_insert_admin" on public.published_content for insert using (
  exists (select 1 from public.admin_users where id = auth.uid())
);
