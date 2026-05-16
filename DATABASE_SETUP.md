# Database Setup Instructions

Follow these steps to set up your Supabase database:

## Step 1: Go to Supabase Dashboard
1. Open your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar

## Step 2: Run the Following SQL Commands

Copy and paste each SQL block below into the SQL Editor and execute them one by one.

### Create Tables

\`\`\`sql
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

-- Create admin_users table
create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
\`\`\`

### Enable Row Level Security (RLS)

\`\`\`sql
alter table public.research_submissions enable row level security;
alter table public.published_content enable row level security;
alter table public.admin_users enable row level security;
\`\`\`

### Create RLS Policies

\`\`\`sql
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

-- Only admins can insert approved content
create policy "published_content_insert_admin" on public.published_content for insert using (
  exists (select 1 from public.admin_users where id = auth.uid())
);

-- Admin users policies
create policy "admin_users_select_own" on public.admin_users for select using (auth.uid() = id);
\`\`\`

### Create Storage Bucket

\`\`\`sql
-- Create a public bucket for research submissions
insert into storage.buckets (id, name, public) values ('research-submissions', 'research-submissions', true);
\`\`\`

### Create Storage Policies

\`\`\`sql
-- Allow authenticated users to upload
create policy "authenticated_upload" on storage.objects for insert with check (
  bucket_id = 'research-submissions' and auth.role() = 'authenticated'
);

-- Allow public read access
create policy "public_read" on storage.objects for select using (bucket_id = 'research-submissions');
\`\`\`

## Step 3: Set Up Google OAuth

1. Go to your Supabase project settings
2. Click on "Authentication" > "Providers"
3. Enable "Google" provider
4. Add your Google OAuth credentials

## Step 4: Create Admin User

1. Go to "Authentication" > "Users" in Supabase dashboard
2. Create a new user with email and password (this will be your admin account)
3. Copy the user's UUID
4. Go to SQL Editor and run:

\`\`\`sql
insert into public.admin_users (id, email) values ('PASTE_USER_UUID_HERE', 'your-admin-email@example.com');
\`\`\`

## Step 5: Enable Storage

Make sure the storage bucket is created:
1. Go to "Storage" in Supabase dashboard
2. Verify that "research-submissions" bucket exists and is public

Done! Your database is now set up and ready to use.
