-- Insert admin user into admin_users table
-- This assumes the user with email 'proteinanalysisfyp@gmail.com' exists in auth.users table
-- If the user doesn't exist yet, they will be added to admin_users once they sign up

INSERT INTO admin_users (email, created_at)
VALUES ('proteinanalysisfyp@gmail.com', NOW())
ON CONFLICT DO NOTHING;

-- Add Row Level Security policy for admin_users table
-- Allow admins to view and manage submissions
ALTER TABLE research_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can see all submissions
CREATE POLICY admin_view_all_submissions
ON research_submissions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = auth.uid()
  )
);

-- Policy: Admins can update submissions (for approval/rejection)
CREATE POLICY admin_update_submissions
ON research_submissions
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = auth.uid()
  )
);

-- Users can only view their own submissions
CREATE POLICY users_view_own_submissions
ON research_submissions
FOR SELECT
USING (auth.uid() = user_id);

-- Users can only insert their own submissions
CREATE POLICY users_insert_own_submissions
ON research_submissions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy for published_content table - Anyone can view published content
ALTER TABLE published_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_view_published_content
ON published_content
FOR SELECT
USING (true);

-- Only admins can manage published content (update/delete)
CREATE POLICY admin_manage_published_content
ON published_content
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = auth.uid()
  )
);
