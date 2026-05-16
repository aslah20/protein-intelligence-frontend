-- Drop the old conflicting policies on published_content
drop policy if exists "published_content_insert_own" on public.published_content;
drop policy if exists "published_content_insert_admin" on public.published_content;

-- Create the correct admin insert policy (uses WITH CHECK instead of USING)
create policy "published_content_insert_admin" on public.published_content 
  for insert with check (
    exists (select 1 from public.admin_users where id = auth.uid())
  );

-- Ensure delete policy exists for admins
create policy if not exists "published_content_delete_admin" on public.published_content 
  for delete using (
    exists (select 1 from public.admin_users where id = auth.uid())
  );
