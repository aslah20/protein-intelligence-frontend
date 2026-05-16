-- Drop conflicting RLS policies for published_content inserts
DROP POLICY IF EXISTS "published_content_insert_own" ON public.published_content;
DROP POLICY IF EXISTS "published_content_insert_admin" ON public.published_content;

-- Create new unified insert policy that allows both authors and admins
-- Authors can insert their own published content
-- Admins can insert resources directly
CREATE POLICY "published_content_insert_allowed" ON public.published_content 
FOR INSERT 
WITH CHECK (
  -- Allow if current user is the author (from approved submissions)
  auth.uid() = user_id
  OR
  -- Allow if current user is an admin (for direct resource uploads)
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

-- Ensure anyone can read published content
CREATE POLICY "published_content_select_public" ON public.published_content 
FOR SELECT 
USING (true);

-- Only authors and admins can delete
CREATE POLICY "published_content_delete_allowed" ON public.published_content 
FOR DELETE 
USING (
  auth.uid() = user_id
  OR
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);
