-- Make submission_id nullable to allow admin-uploaded resources
alter table public.published_content 
  drop constraint if exists published_content_submission_id_fkey;

alter table public.published_content
  alter column submission_id drop not null;

-- Re-add the foreign key as optional
alter table public.published_content
  add constraint published_content_submission_id_fkey 
  foreign key (submission_id) references public.research_submissions(id) on delete cascade;

-- Remove the unique constraint if it exists so resources without submission_id can be inserted
alter table public.published_content
  drop constraint if exists published_content_submission_id_key;
