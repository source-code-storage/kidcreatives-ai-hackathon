# Supabase Integration Guide

## Overview

This guide covers integrating Supabase backend services using the Supabase MCP (Model Context Protocol) server. The MCP provides OAuth-authenticated access to Supabase CLI operations directly from Kiro CLI.

---

## MCP Configuration

**Current Setup** (`.kiro/settings/mcp.json`):
```json
{
  "supabase": {
    "url": "https://mcp.supabase.com/mcp"
  }
}
```

**Authentication**: OAuth-based, no local credentials needed. The MCP server handles authentication with your Supabase account.

---

## When to Use Supabase MCP

### ✅ Use Supabase MCP For:

1. **Database Schema Operations**
   - Creating tables
   - Modifying table structures
   - Adding indexes
   - Setting up foreign keys

2. **Migrations**
   - Creating new migrations
   - Applying migrations
   - Rolling back migrations
   - Viewing migration history

3. **Row Level Security (RLS)**
   - Creating RLS policies
   - Modifying policies
   - Testing policy logic
   - Enabling/disabling RLS

4. **Storage Buckets**
   - Creating storage buckets
   - Setting bucket policies
   - Configuring CORS
   - Managing bucket permissions

5. **Authentication Configuration**
   - Setting up auth providers
   - Configuring email templates
   - Managing auth settings
   - Setting up OAuth providers

6. **Edge Functions**
   - Creating edge functions
   - Deploying functions
   - Managing function secrets
   - Viewing function logs

### ❌ Use Supabase Client Library For:

1. **Runtime Data Operations**
   - Inserting records
   - Querying data
   - Updating records
   - Deleting records

2. **Real-time Subscriptions**
   - Listening to database changes
   - Real-time updates in UI

3. **Client-side Authentication**
   - User login/logout
   - Session management
   - Password reset flows

4. **File Uploads**
   - Uploading files to storage
   - Downloading files
   - Generating signed URLs

---

## Gallery Feature Migration Example

### Current State (localStorage)
Gallery items stored in browser localStorage with this structure:
```typescript
interface GalleryItem {
  id: string
  createdAt: number
  refinedImage: string // base64
  originalImage: string // base64
  promptStateJSON: string
  intentStatement: string
  stats: TrophyStats
  certificatePDF: string // base64
  thumbnail: string // base64
}
```

### Migration to Supabase

#### Step 1: Create Database Schema (Use Supabase MCP)

**Prompt for Kiro CLI:**
```
Use Supabase MCP to create a new table called gallery_items with the following schema:
- id: UUID primary key with default uuid_generate_v4()
- user_id: UUID foreign key to auth.users(id)
- created_at: timestamp with default now()
- refined_image_url: text (Supabase Storage URL)
- original_image_url: text (Supabase Storage URL)
- prompt_state_json: jsonb
- intent_statement: text
- stats: jsonb
- certificate_pdf_url: text (Supabase Storage URL)
- thumbnail_url: text (Supabase Storage URL)

Also enable RLS on this table.
```

#### Step 2: Create Storage Buckets (Use Supabase MCP)

**Prompt for Kiro CLI:**
```
Use Supabase MCP to create three storage buckets:
1. gallery-images (for refined and original images)
2. gallery-certificates (for PDF certificates)
3. gallery-thumbnails (for thumbnail images)

Set all buckets to private with RLS policies.
```

#### Step 3: Set Up RLS Policies (Use Supabase MCP)

**Prompt for Kiro CLI:**
```
Use Supabase MCP to create RLS policies for gallery_items table:
1. Users can only select their own gallery items
2. Users can only insert their own gallery items
3. Users can only update their own gallery items
4. Users can only delete their own gallery items

Policy condition: user_id = auth.uid()
```

#### Step 4: Update Application Code (Use Supabase Client)

Replace `galleryStorage.ts` with Supabase client calls:

```typescript
import { supabase } from '@/lib/supabase/client'

export async function saveToGallery(item: Omit<GalleryItem, 'id' | 'createdAt'>) {
  // Upload images to storage
  const refinedImageUrl = await uploadImage(item.refinedImage, 'gallery-images')
  const originalImageUrl = await uploadImage(item.originalImage, 'gallery-images')
  const thumbnailUrl = await uploadImage(item.thumbnail, 'gallery-thumbnails')
  const certificateUrl = await uploadPDF(item.certificatePDF, 'gallery-certificates')

  // Insert record
  const { data, error } = await supabase
    .from('gallery_items')
    .insert({
      refined_image_url: refinedImageUrl,
      original_image_url: originalImageUrl,
      prompt_state_json: JSON.parse(item.promptStateJSON),
      intent_statement: item.intentStatement,
      stats: item.stats,
      certificate_pdf_url: certificateUrl,
      thumbnail_url: thumbnailUrl
    })
    .select()
    .single()

  if (error) throw error
  return data
}
```

---

## Common Supabase MCP Commands

### Database Operations

**Create Table:**
```
Use Supabase MCP to create a table named [table_name] with columns: [column definitions]
```

**Add Column:**
```
Use Supabase MCP to add a column [column_name] of type [type] to table [table_name]
```

**Create Index:**
```
Use Supabase MCP to create an index on [table_name]([column_name])
```

### Migration Operations

**Create Migration:**
```
Use Supabase MCP to create a new migration named [migration_name]
```

**Apply Migrations:**
```
Use Supabase MCP to apply all pending migrations
```

**View Migration Status:**
```
Use Supabase MCP to show the status of all migrations
```

### RLS Operations

**Enable RLS:**
```
Use Supabase MCP to enable RLS on table [table_name]
```

**Create Policy:**
```
Use Supabase MCP to create an RLS policy on [table_name] that allows [operation] when [condition]
```

### Storage Operations

**Create Bucket:**
```
Use Supabase MCP to create a storage bucket named [bucket_name] with [public/private] access
```

**Set Bucket Policy:**
```
Use Supabase MCP to set storage policy for bucket [bucket_name] allowing [operations] when [condition]
```

---

## Best Practices

### 1. Use MCP for Schema, Client for Data

**Good:**
```
# Schema with MCP
Use Supabase MCP to create users table

# Data with Client
const { data } = await supabase.from('users').select('*')
```

**Bad:**
```
# Don't use MCP for data operations
Use Supabase MCP to insert a user record
```

### 2. Always Enable RLS

**Good:**
```
Use Supabase MCP to create table posts and enable RLS with policies for authenticated users
```

**Bad:**
```
Use Supabase MCP to create table posts
# Forgetting to enable RLS is a security risk
```

### 3. Use Migrations for Schema Changes

**Good:**
```
Use Supabase MCP to create a migration that adds email column to users table
```

**Bad:**
```
Use Supabase MCP to directly add email column to users table
# Direct changes aren't version controlled
```

### 4. Test Policies Before Deploying

**Good:**
```
Use Supabase MCP to test RLS policy on posts table with user_id = '123'
```

### 5. Use Storage for Large Files

**Good:**
```typescript
// Upload to storage, store URL in database
const url = await uploadToStorage(file)
await supabase.from('gallery').insert({ image_url: url })
```

**Bad:**
```typescript
// Don't store base64 in database
await supabase.from('gallery').insert({ image_base64: base64 })
```

---

## Migration Checklist

When migrating from localStorage to Supabase:

### Planning Phase
- [ ] Design database schema
- [ ] Plan storage bucket structure
- [ ] Define RLS policies
- [ ] Identify data transformation needs

### Implementation Phase (Use Supabase MCP)
- [ ] Create database tables
- [ ] Set up storage buckets
- [ ] Configure RLS policies
- [ ] Create migrations
- [ ] Test policies

### Code Changes (Use Supabase Client)
- [ ] Replace localStorage calls with Supabase client
- [ ] Add file upload logic
- [ ] Update error handling
- [ ] Add loading states
- [ ] Handle authentication

### Testing Phase
- [ ] Test CRUD operations
- [ ] Verify RLS policies work
- [ ] Test file uploads/downloads
- [ ] Check error handling
- [ ] Test with multiple users

### Migration Phase
- [ ] Create migration script for existing localStorage data
- [ ] Test migration with sample data
- [ ] Backup localStorage data
- [ ] Run migration
- [ ] Verify data integrity

---

## Troubleshooting

### MCP Connection Issues

**Problem:** "Cannot connect to Supabase MCP"
**Solution:** Verify OAuth authentication is active. Re-authenticate if needed.

### Permission Errors

**Problem:** "Permission denied" when creating tables
**Solution:** Ensure you have admin access to the Supabase project.

### RLS Policy Issues

**Problem:** "Row level security policy violation"
**Solution:** Check policy conditions match your auth setup. Test policies with Supabase MCP.

### Storage Upload Failures

**Problem:** "Storage upload failed"
**Solution:** Verify bucket exists and has correct policies. Check file size limits.

---

## Example: Complete Gallery Migration

### 1. Schema Setup (Supabase MCP)
```
Use Supabase MCP to:
1. Create gallery_items table with columns: id (uuid), user_id (uuid), created_at (timestamp), refined_image_url (text), original_image_url (text), prompt_state_json (jsonb), intent_statement (text), stats (jsonb), certificate_pdf_url (text), thumbnail_url (text)
2. Create storage buckets: gallery-images, gallery-certificates, gallery-thumbnails
3. Enable RLS on gallery_items with policies for authenticated users
4. Set storage policies allowing authenticated users to upload/download their own files
```

### 2. Client Implementation
```typescript
// lib/supabase/gallery.ts
import { supabase } from './client'

export async function saveGalleryItem(item: GalleryItemInput) {
  // Upload files
  const [refinedUrl, originalUrl, thumbnailUrl, certUrl] = await Promise.all([
    uploadFile(item.refinedImage, 'gallery-images'),
    uploadFile(item.originalImage, 'gallery-images'),
    uploadFile(item.thumbnail, 'gallery-thumbnails'),
    uploadFile(item.certificatePDF, 'gallery-certificates')
  ])

  // Insert record
  const { data, error } = await supabase
    .from('gallery_items')
    .insert({
      refined_image_url: refinedUrl,
      original_image_url: originalUrl,
      thumbnail_url: thumbnailUrl,
      certificate_pdf_url: certUrl,
      prompt_state_json: JSON.parse(item.promptStateJSON),
      intent_statement: item.intentStatement,
      stats: item.stats
    })
    .select()
    .single()

  if (error) throw error
  return data
}
```

### 3. Update Hook
```typescript
// hooks/useGallery.ts
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

export function useGallery() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGallery()
  }, [])

  async function loadGallery() {
    const { data, error } = await supabase
      .from('gallery_items')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    setItems(data)
    setLoading(false)
  }

  return { items, loading, loadGallery }
}
```

---

## Resources

- **Supabase Docs**: https://supabase.com/docs
- **MCP Documentation**: https://mcp.supabase.com/docs
- **RLS Guide**: https://supabase.com/docs/guides/auth/row-level-security
- **Storage Guide**: https://supabase.com/docs/guides/storage

---

**Last Updated**: January 29, 2026  
**Status**: Ready for Supabase integration using MCP
