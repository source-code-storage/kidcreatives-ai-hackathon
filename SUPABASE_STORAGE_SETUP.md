# Supabase Storage Buckets - Manual Setup Instructions

**Date**: January 29, 2026  
**Project**: rlkvtubxsxfkrwuvvvcn  
**Status**: ⏳ **ACTION REQUIRED** - Storage buckets must be created manually

---

## Why Manual Setup is Required

Supabase MCP does not support creating storage buckets programmatically. The buckets must be created through the Supabase Dashboard.

---

## Step-by-Step Instructions

### 1. Navigate to Storage Section

Go to: https://supabase.com/dashboard/project/rlkvtubxsxfkrwuvvvcn/storage/buckets

### 2. Create Bucket 1: creation-images

1. Click **"New bucket"** button
2. Enter bucket name: `creation-images`
3. Set **Public bucket**: **OFF** (keep it private)
4. Click **"Create bucket"**

### 3. Create Bucket 2: creation-thumbnails

1. Click **"New bucket"** button
2. Enter bucket name: `creation-thumbnails`
3. Set **Public bucket**: **OFF** (keep it private)
4. Click **"Create bucket"**

### 4. Create Bucket 3: creation-certificates

1. Click **"New bucket"** button
2. Enter bucket name: `creation-certificates`
3. Set **Public bucket**: **OFF** (keep it private)
4. Click **"Create bucket"**

### 5. Apply Storage RLS Policies

1. Go to SQL Editor: https://supabase.com/dashboard/project/rlkvtubxsxfkrwuvvvcn/sql/new

2. Copy and paste this SQL:

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

3. Click **"Run"** to execute the SQL

---

## Verification

### Check Buckets Created

1. Go to Storage: https://supabase.com/dashboard/project/rlkvtubxsxfkrwuvvvcn/storage/buckets
2. Verify you see 3 buckets:
   - ✅ `creation-images` (Private)
   - ✅ `creation-thumbnails` (Private)
   - ✅ `creation-certificates` (Private)

### Check RLS Policies Applied

1. Go to SQL Editor: https://supabase.com/dashboard/project/rlkvtubxsxfkrwuvvvcn/sql/new
2. Run this query:

```sql
SELECT schemaname, tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';
```

3. Verify you see 4 policies:
   - ✅ Users can upload own files (INSERT)
   - ✅ Users can read own files (SELECT)
   - ✅ Users can update own files (UPDATE)
   - ✅ Users can delete own files (DELETE)

---

## Test the Setup

After creating buckets and applying policies:

1. Start the dev server:
   ```bash
   cd kidcreatives-ai
   npm run dev
   ```

2. Complete the 5-phase workflow:
   - Phase 1: Upload image + intent
   - Phase 2: Answer 4 questions
   - Phase 3: Generate image
   - Phase 4: Skip or refine
   - Phase 5: Click "Save to Gallery"

3. Verify success:
   - ✅ No console errors
   - ✅ Success message: "🎉 Saved to your gallery!"
   - ✅ Creation appears in gallery view
   - ✅ Files visible in Supabase Storage dashboard

---

## Troubleshooting

### Error: "Bucket not found"
- **Cause**: Buckets not created yet
- **Solution**: Follow steps 1-4 above to create buckets

### Error: "Permission denied"
- **Cause**: RLS policies not applied
- **Solution**: Follow step 5 above to apply policies

### Error: "Invalid base64"
- **Cause**: Image data corrupted or malformed
- **Solution**: Try regenerating the artwork in Phase 3

### Files not appearing in Storage
- **Cause**: RLS policies blocking access
- **Solution**: Verify policies applied correctly (see Verification section)

---

## What Happens After Setup

Once buckets are created and policies applied:

1. **Gallery Save Works**: Users can save creations to their gallery
2. **Files Upload**: Images and PDFs upload to Supabase Storage
3. **Database Records**: Creation records saved to `creations` table
4. **Gallery Display**: Saved creations appear in gallery view
5. **Download Works**: Users can re-download PDFs from gallery

---

## Summary

**Required Actions**:
- [ ] Create 3 storage buckets (creation-images, creation-thumbnails, creation-certificates)
- [ ] Apply 4 RLS policies for storage.objects
- [ ] Verify buckets and policies in dashboard
- [ ] Test gallery save functionality

**Time Required**: ~5 minutes

**Status After Completion**: ✅ Gallery save functionality fully operational

---

**Last Updated**: January 29, 2026 20:40  
**Next Step**: Create buckets in Supabase Dashboard, then test gallery save
