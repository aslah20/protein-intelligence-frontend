-- Drop the conflicting RLS policies for published_content inserts
DROP POLICY IF EXISTS "published_content_insert_own" ON public.published_content;

-- Keep only the admin insert policy (allow anyone to select, only admins to insert)
-- The existing "published_content_insert_admin" policy handles inserts correctly
-- And "published_content_select_all" handles selects

-- Verify the policies are correct:
-- - published_content_select_all: anyone can read
-- - published_content_insert_admin: only admins can insert

-- If policies don't exist, create them:
CREATE POLICY IF NOT EXISTS "published_content_select_all" ON public.published_content 
FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "published_content_insert_admin" ON public.published_content 
FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

CREATE POLICY IF NOT EXISTS "published_content_delete_admin" ON public.published_content 
FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);
