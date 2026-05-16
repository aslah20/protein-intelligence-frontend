# Complete Authentication & Admin System Implementation Guide

## Overview

This guide covers the complete setup of the real authentication system with Google OAuth for users and email/password auth for admins, along with the submission review workflow.

## System Architecture

### Public Routes
- `/` - Home page
- `/protein-wiki` - Public wiki (view published content)
- `/auth/login` - User Google OAuth login
- `/auth/callback` - OAuth callback handler
- `/analysis` - Protein analysis tool
- `/about`, `/contact` - Info pages

### Protected Routes
- `/protein-wiki` (logged-in view) - Submission form for authenticated users
- `/admin/login` - Admin email/password login
- `/admin/dashboard` - Admin submission review panel (hidden, no public links)

## Database Schema

### Tables Created

#### `research_submissions`
- Stores all user submissions (pending, approved, rejected)
- Links to auth.users via user_id
- Tracks approval status and admin notes

#### `published_content`
- Stores only approved submissions
- Referenced by submission_id for audit trail
- Public read access via RLS policy

#### `admin_users`
- Maps admin user IDs to their emails
- Simple whitelist for admin access control

### Storage Buckets

#### `research-submissions`
- Public bucket for storing uploaded files
- Files are organized in `submissions/` folder
- Public read access, authenticated user upload

## Implementation Steps

### 1. Database Setup

Complete the instructions in `DATABASE_SETUP.md`:
- Create tables with proper foreign keys
- Enable Row Level Security (RLS)
- Create RLS policies for data access control
- Set up storage bucket and policies
- Create your first admin user

### 2. Environment Variables

Your Supabase integration provides:
- `NEXT_PUBLIC_SUPABASE_URL` - Your project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public anon key
- Google OAuth credentials (set in Supabase dashboard)

No additional setup needed!

### 3. File Structure

\`\`\`
app/
├── auth/
│   ├── login/page.tsx          # User Google OAuth login
│   └── callback/route.ts        # OAuth callback handler
├── admin/
│   ├── login/page.tsx           # Admin email/password login
│   └── dashboard/page.tsx       # Admin submission review
├── protein-wiki/page.tsx        # Public + authenticated wiki
└── ...
lib/
├── supabase/
│   ├── client.ts               # Browser Supabase client
│   ├── server.ts               # Server Supabase client
│   └── proxy.ts                # Session proxy for middleware
middleware.ts                    # Auth middleware
DATABASE_SETUP.md               # Database setup guide
IMPLEMENTATION_GUIDE.md         # This file
\`\`\`

## User Flow

### Regular User (Researcher)

1. **Discover Content**
   - Visit `/protein-wiki`
   - Browse published research from community
   - See "Login to Submit" call-to-action

2. **Login with Google**
   - Click "Login" button
   - Redirected to `/auth/login`
   - Click "Continue with Google"
   - Google OAuth popup appears
   - User grants permission
   - Redirected back to `/protein-wiki`

3. **Submit Research**
   - Now logged in, see submission form
   - Select content type (dataset, article, etc.)
   - Enter title and description
   - Upload file
   - Click "Submit for Review"

4. **Await Approval**
   - Submission stored in `research_submissions` table with status='pending'
   - File uploaded to `research-submissions` storage bucket
   - Admin reviews in dashboard
   - User notified (email, optional feature)

5. **See Published Work**
   - After admin approval
   - Submission moved to `published_content` table
   - Appears on `/protein-wiki` for everyone

### Admin Flow

1. **Access Admin Panel**
   - Navigate to `/admin/login`
   - Email/password authentication
   - System checks if user is in `admin_users` table
   - Redirected to `/admin/dashboard`

2. **Review Submissions**
   - See all pending submissions
   - Can filter by status (pending, approved, rejected)
   - Click "View File" to download/preview
   - Read title, description, author info

3. **Approve or Reject**
   - Click "Approve" → Submission moves to published_content
   - Click "Reject" → Modal for rejection reason
   - Reason saved in `rejection_reason` field

4. **Manage Content**
   - View approved and rejected submissions
   - Hidden from public completely

## Security Features

### Row Level Security (RLS)
- Users can only see/edit their own submissions
- Admins can view all submissions
- Published content is public read-only
- No direct data access without proper policies

### Authentication
- Google OAuth for users (industry standard, secure)
- Email/password for admins (separate system)
- Session cookies managed by Supabase middleware
- Protected routes via middleware.ts

### Admin Protection
- Admin panel at `/admin` (no public links)
- Requires both authentication AND admin_users table entry
- Dual-layer protection
- No way to access admin panel from main site navigation

### File Storage
- Files stored in Supabase Storage with authentication
- Public access to published files only
- Prevents direct path guessing

## Testing the System

### Test User Flow
1. Go to home page
2. Click "Protein Wiki"
3. Click "Login" → Login with Google
4. Submit a research paper
5. Submission appears pending in database

### Test Admin Flow
1. Go to `/admin/login`
2. Login with your admin credentials
3. See pending submissions
4. Approve one → appears in `/protein-wiki`
5. Reject one → see rejection reason

## Future Enhancements

- Email notifications to users on approval/rejection
- Submission status tracking page for users
- Admin user management interface
- Advanced content moderation features
- Search and filtering for published content
- Comments and discussion on published content
- User profile pages with submission history

## Troubleshooting

### Users can't login with Google
- Check Google OAuth credentials in Supabase dashboard
- Verify redirect URL: `https://your-domain.vercel.app/auth/callback`

### Admin login not working
- Ensure user exists in `admin_users` table
- Check email/password are correct
- Verify user is authenticated in Supabase

### Files not uploading
- Check `research-submissions` bucket exists and is public
- Verify storage policies allow authenticated uploads
- Check file size limits

### Submissions not appearing in admin dashboard
- Verify RLS policies are correctly created
- Check admin user exists in `admin_users` table
- Confirm user is authenticated before accessing dashboard

## Database Schema Reference

\`\`\`sql
-- Submission
{
  id: uuid,
  user_id: uuid (references auth.users),
  title: string,
  description: string,
  content_type: 'dataset' | 'article' | 'essay' | 'paper' | 'other',
  file_url: string,
  file_name: string,
  author_name: string,
  author_email: string,
  status: 'pending' | 'approved' | 'rejected',
  rejection_reason?: string,
  created_at: timestamp,
  updated_at: timestamp,
  approved_by?: uuid (references auth.users),
  approved_at?: timestamp
}

-- Published Content (approved submissions)
{
  id: uuid,
  submission_id: uuid (unique reference),
  user_id: uuid,
  title: string,
  description: string,
  content_type: string,
  file_url: string,
  file_name: string,
  author_name: string,
  author_email: string,
  published_at: timestamp,
  created_at: timestamp
}

-- Admin Users (whitelist)
{
  id: uuid (references auth.users),
  email: string (unique),
  created_at: timestamp
}
\`\`\`

## Support

If you encounter any issues:
1. Check DATABASE_SETUP.md for database configuration
2. Verify Supabase project settings
3. Check browser console for errors
4. Review Supabase logs in dashboard
