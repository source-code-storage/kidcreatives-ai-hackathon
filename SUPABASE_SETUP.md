# Supabase Backend Setup Guide

This guide walks you through setting up the Supabase backend for KidCreatives AI.

## Prerequisites

- Supabase project created at: https://rlkvtubxsxfkrwuvvvcn.supabase.co
- Project credentials already added to `.env` file

## Step 1: Apply Database Migrations

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/rlkvtubxsxfkrwuvvvcn
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
5. Click **Run** to execute
6. Repeat for `supabase/migrations/002_rls_policies.sql`

### Option B: Using Supabase MCP (via Kiro CLI)

```bash
# In Kiro CLI, use Supabase MCP to apply migrations
Use Supabase MCP to apply migration file supabase/migrations/001_initial_schema.sql
Use Supabase MCP to apply migration file supabase/migrations/002_rls_policies.sql
```

## Step 2: Create Storage Buckets

1. Go to **Storage** in the Supabase Dashboard
2. Click **New bucket**
3. Create three buckets with these settings:

### Bucket 1: creation-images
- **Name**: `creation-images`
- **Public**: No (Private)
- **File size limit**: 10MB
- **Allowed MIME types**: `image/jpeg`, `image/png`

### Bucket 2: creation-thumbnails
- **Name**: `creation-thumbnails`
- **Public**: No (Private)
- **File size limit**: 500KB
- **Allowed MIME types**: `image/jpeg`, `image/png`

### Bucket 3: creation-certificates
- **Name**: `creation-certificates`
- **Public**: No (Private)
- **File size limit**: 5MB
- **Allowed MIME types**: `application/pdf`

## Step 3: Apply Storage Policies

1. Go to **SQL Editor** in the Supabase Dashboard
2. Create a new query
3. Copy and paste this SQL:

```sql
-- Users can upload to their own folder
CREATE POLICY "Users can upload own files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id IN ('creation-images', 'creation-thumbnails', 'creation-certificates')
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can read their own files
CREATE POLICY "Users can read own files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id IN ('creation-images', 'creation-thumbnails', 'creation-certificates')
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can update their own files
CREATE POLICY "Users can update own files"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id IN ('creation-images', 'creation-thumbnails', 'creation-certificates')
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can delete their own files
CREATE POLICY "Users can delete own files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id IN ('creation-images', 'creation-thumbnails', 'creation-certificates')
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
```

4. Click **Run** to execute

## Step 4: Configure Authentication

1. Go to **Authentication** > **Providers** in the Supabase Dashboard
2. Ensure **Email** provider is enabled
3. (Optional) Enable **Magic Link** for passwordless login
4. Configure email templates if desired

## Step 5: Verify Setup

### Check Tables
1. Go to **Table Editor**
2. Verify these tables exist:
   - `user_profiles`
   - `creations`
   - `creation_stats`

### Check RLS Policies
1. Go to **Authentication** > **Policies**
2. Verify policies exist for all three tables

### Check Storage Buckets
1. Go to **Storage**
2. Verify all three buckets exist
3. Click each bucket and check **Policies** tab

## Step 6: Test the Application

1. Start the development server:
   ```bash
   cd kidcreatives-ai
   npm run dev
   ```

2. Open http://localhost:5173

3. Test authentication:
   - Click "Sign up" to create an account
   - Verify email confirmation (check spam folder)
   - Sign in with your credentials

4. Test creation workflow:
   - Complete all 5 phases
   - Save to gallery
   - Verify creation appears in gallery
   - Try deleting a creation

5. Verify in Supabase Dashboard:
   - Check **Table Editor** > `creations` for your data
   - Check **Storage** > `creation-images` for uploaded files
   - Check **Authentication** > **Users** for your account

## Troubleshooting

### "Missing Supabase environment variables"
- Verify `.env` file has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart dev server after adding variables

### "Failed to save creation"
- Check browser console for detailed error
- Verify storage buckets exist and have correct policies
- Check **Logs** in Supabase Dashboard for server errors

### "Permission denied" errors
- Verify RLS policies are applied correctly
- Check that user is authenticated (not null)
- Verify storage policies use correct bucket names

### "Failed to upload image"
- Check file size limits (10MB for images, 5MB for PDFs)
- Verify MIME types are allowed
- Check storage quota in Supabase Dashboard

## Security Notes

- All buckets are **private** - files only accessible to owners
- RLS policies enforce user-level data isolation
- Storage policies use user ID in path for security
- Never expose service role key in frontend code

## Next Steps

After successful setup:
- Test with multiple user accounts
- Verify data isolation between users
- Monitor storage usage in dashboard
- Set up email templates for better UX

---

**Setup Complete!** Your Supabase backend is now ready for KidCreatives AI.
