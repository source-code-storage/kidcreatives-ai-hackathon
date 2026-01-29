# Supabase Storage Bucket Setup

This file documents the storage buckets that need to be created in Supabase Dashboard.

## Buckets to Create

### 1. creation-images
- **Name**: `creation-images`
- **Public**: No (Private)
- **File size limit**: 10MB
- **Allowed MIME types**: `image/jpeg`, `image/png`

### 2. creation-thumbnails
- **Name**: `creation-thumbnails`
- **Public**: No (Private)
- **File size limit**: 500KB
- **Allowed MIME types**: `image/jpeg`, `image/png`

### 3. creation-certificates
- **Name**: `creation-certificates`
- **Public**: No (Private)
- **File size limit**: 5MB
- **Allowed MIME types**: `application/pdf`

## Storage Policies

After creating buckets, apply these policies via SQL Editor:

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

## Manual Setup Steps

1. Go to Supabase Dashboard: https://rlkvtubxsxfkrwuvvvcn.supabase.co
2. Navigate to Storage section
3. Create each bucket with the settings above
4. Go to SQL Editor
5. Run the storage policies SQL above
