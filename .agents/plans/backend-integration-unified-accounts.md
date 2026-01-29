# Backend Integration Plan - Unified Account System

**Feature**: Backend Integration with Supabase  
**Account Model**: Single unified account (no parent/child separation)  
**Created**: January 29, 2026 17:52  
**Confidence**: 8/10 for one-pass success  

---

## Overview

Migrate from localStorage-only storage to Supabase backend with:
- **Authentication**: Email/password with magic links
- **Database**: PostgreSQL for user data, creations, and metadata
- **Storage**: Cloud storage for images and PDFs
- **Real-time**: Optional subscriptions for future features

**Key Decision**: Unified account model simplifies UX for children while maintaining COPPA compliance through parental email verification.

---

## Architecture Changes

### Current State (localStorage)
```
Browser localStorage
├── Gallery items (images as base64)
├── Certificates (PDFs as base64)
└── No authentication
```

### Target State (Supabase)
```
Supabase Backend
├── Auth: Email/password + magic links
├── Database: user_profiles, creations, creation_stats
├── Storage: images/, certificates/, thumbnails/
└── RLS: Row-level security per user
```

---

## Database Schema

### Tables

#### 1. `user_profiles` (extends auth.users)
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  age_range TEXT CHECK (age_range IN ('7-8', '9-10', '11+')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 2. `creations`
```sql
CREATE TABLE creations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Images (Storage URLs)
  refined_image_url TEXT NOT NULL,
  original_image_url TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  
  -- Metadata
  intent_statement TEXT NOT NULL,
  prompt_state_json JSONB NOT NULL,
  
  -- Certificate
  certificate_pdf_url TEXT NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Indexes
  CONSTRAINT creations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

CREATE INDEX idx_creations_user_id ON creations(user_id);
CREATE INDEX idx_creations_created_at ON creations(created_at DESC);
```

#### 3. `creation_stats` (denormalized for performance)
```sql
CREATE TABLE creation_stats (
  creation_id UUID PRIMARY KEY REFERENCES creations(id) ON DELETE CASCADE,
  edit_count INTEGER DEFAULT 0,
  variables_used INTEGER DEFAULT 0,
  time_spent_seconds INTEGER DEFAULT 0,
  phase_completed_at JSONB DEFAULT '{}'::jsonb
);
```

---

## Storage Buckets

### Bucket Configuration

#### 1. `creation-images` (Private)
- **Purpose**: Original and refined images
- **Max Size**: 10MB per file
- **Allowed Types**: image/jpeg, image/png
- **Path Structure**: `{user_id}/{creation_id}/original.jpg`, `{user_id}/{creation_id}/refined.jpg`

#### 2. `creation-thumbnails` (Private)
- **Purpose**: Scaled-down previews for gallery
- **Max Size**: 500KB per file
- **Allowed Types**: image/jpeg, image/png
- **Path Structure**: `{user_id}/{creation_id}/thumb.jpg`

#### 3. `creation-certificates` (Private)
- **Purpose**: PDF certificates
- **Max Size**: 5MB per file
- **Allowed Types**: application/pdf
- **Path Structure**: `{user_id}/{creation_id}/certificate.pdf`

---

## Row Level Security (RLS) Policies

### `user_profiles` Policies
```sql
-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile (on signup)
CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
```

### `creations` Policies
```sql
-- Users can view their own creations
CREATE POLICY "Users can view own creations"
  ON creations FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own creations
CREATE POLICY "Users can insert own creations"
  ON creations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own creations
CREATE POLICY "Users can update own creations"
  ON creations FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own creations
CREATE POLICY "Users can delete own creations"
  ON creations FOR DELETE
  USING (auth.uid() = user_id);
```

### `creation_stats` Policies
```sql
-- Users can view stats for their own creations
CREATE POLICY "Users can view own creation stats"
  ON creation_stats FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM creations
      WHERE creations.id = creation_stats.creation_id
      AND creations.user_id = auth.uid()
    )
  );

-- Similar policies for INSERT, UPDATE, DELETE
```

### Storage Policies
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

-- Users can delete their own files
CREATE POLICY "Users can delete own files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id IN ('creation-images', 'creation-thumbnails', 'creation-certificates')
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
```

---

## Implementation Tasks

### Phase 1: Supabase Setup (Use Supabase MCP)

#### Task 1: Create Database Schema
**Command**: Use Supabase MCP to create migration
```bash
# Create migration file
supabase migration new initial_schema

# Add tables: user_profiles, creations, creation_stats
# Add indexes and foreign keys
# Enable RLS on all tables
```

**Validation**:
```bash
supabase db push
supabase db status
```

**Files**: `supabase/migrations/001_initial_schema.sql`

---

#### Task 2: Create Storage Buckets
**Command**: Use Supabase MCP to create buckets
```bash
# Create buckets: creation-images, creation-thumbnails, creation-certificates
# Set all to private
# Configure max file sizes
```

**Validation**:
```bash
supabase storage list
```

**Files**: None (Supabase configuration)

---

#### Task 3: Configure RLS Policies
**Command**: Use Supabase MCP to create policies
```bash
# Add policies for user_profiles
# Add policies for creations
# Add policies for creation_stats
# Add storage policies
```

**Validation**:
```bash
# Test with authenticated user
# Verify users can only access own data
```

**Files**: `supabase/migrations/002_rls_policies.sql`

---

### Phase 2: Authentication Implementation

#### Task 4: Create Auth Context
**Purpose**: Manage authentication state globally

**Files**: `src/contexts/AuthContext.tsx`

```typescript
interface AuthContextType {
  user: User | null
  session: Session | null
  signUp: (email: string, password: string, displayName: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithMagicLink: (email: string) => Promise<void>
  signOut: () => Promise<void>
  loading: boolean
  error: string | null
}
```

**Validation**:
```bash
npm run build
npm run lint
```

---

#### Task 5: Create Auth UI Components
**Purpose**: Login, signup, and profile forms

**Files**:
- `src/components/auth/LoginForm.tsx`
- `src/components/auth/SignupForm.tsx`
- `src/components/auth/AuthModal.tsx`

**Features**:
- Email/password login
- Magic link option
- Display name input (signup)
- Age range selection (optional)
- Error handling
- Loading states

**Validation**:
```bash
npm run build
# Manual test: Open auth modal, try signup/login
```

---

#### Task 6: Create Supabase Client
**Purpose**: Initialize Supabase with environment variables

**Files**: `src/lib/supabase/client.ts`

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**Validation**:
```bash
# Add to .env
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key

npm run build
```

---

#### Task 7: Integrate Auth into App
**Purpose**: Wrap app with AuthContext, show auth modal if not logged in

**Files**: `src/App.tsx`, `src/main.tsx`

**Changes**:
- Wrap app in `<AuthProvider>`
- Show auth modal if `!user`
- Show gallery icon only if authenticated
- Pass `user.id` to gallery components

**Validation**:
```bash
npm run dev
# Test: Should show auth modal on load
# Test: Login should dismiss modal
```

---

### Phase 3: Storage Integration

#### Task 8: Create Storage Service
**Purpose**: Upload/download files to Supabase Storage

**Files**: `src/lib/supabase/storage.ts`

```typescript
export async function uploadImage(
  file: File | string, // File object or base64
  bucket: 'creation-images' | 'creation-thumbnails',
  path: string
): Promise<string> // Returns public URL

export async function uploadPDF(
  pdfBase64: string,
  path: string
): Promise<string> // Returns public URL

export async function deleteFile(
  bucket: string,
  path: string
): Promise<void>

export async function getSignedUrl(
  bucket: string,
  path: string,
  expiresIn: number = 3600
): Promise<string>
```

**Validation**:
```bash
npm run build
# Unit test: Upload test image, verify URL returned
```

---

#### Task 9: Update Gallery Storage to Use Supabase
**Purpose**: Replace localStorage with Supabase database + storage

**Files**: `src/lib/supabase/galleryService.ts` (new), `src/hooks/useGallery.ts` (modify)

**New Service**:
```typescript
export async function saveCreation(
  userId: string,
  creation: {
    refinedImage: string // base64
    originalImage: string // base64
    thumbnail: string // base64
    certificatePDF: string // base64
    intentStatement: string
    promptStateJSON: string
    stats: TrophyStats
  }
): Promise<void>

export async function getCreations(userId: string): Promise<GalleryItem[]>

export async function deleteCreation(
  userId: string,
  creationId: string
): Promise<void>
```

**Hook Changes**:
- Replace `galleryStorage.ts` calls with `galleryService.ts`
- Add loading states for async operations
- Add error handling for network failures

**Validation**:
```bash
npm run build
# Test: Save creation, verify in Supabase dashboard
# Test: Load gallery, verify items appear
# Test: Delete creation, verify removed from DB
```

---

#### Task 10: Update TrophyPhase to Use Supabase
**Purpose**: Save to Supabase instead of localStorage

**Files**: `src/components/phases/TrophyPhase.tsx`

**Changes**:
- Import `saveCreation` from `galleryService`
- Get `user.id` from AuthContext
- Show loading state during save
- Handle errors (show toast/alert)

**Validation**:
```bash
npm run dev
# Test: Complete workflow, save to gallery
# Test: Check Supabase dashboard for new creation
```

---

### Phase 4: Migration & Cleanup

#### Task 11: Create localStorage Migration Tool
**Purpose**: Migrate existing localStorage data to Supabase

**Files**: `src/lib/migration/migrateLocalStorage.ts`

```typescript
export async function migrateLocalStorageToSupabase(
  userId: string
): Promise<{ success: number; failed: number }>
```

**Features**:
- Read all items from localStorage
- Upload each to Supabase
- Show progress indicator
- Clear localStorage after successful migration
- Handle failures gracefully

**Validation**:
```bash
# Test: Create items in localStorage
# Test: Run migration, verify in Supabase
# Test: localStorage cleared after migration
```

---

#### Task 12: Add Migration UI
**Purpose**: Prompt users to migrate on first login

**Files**: `src/components/migration/MigrationModal.tsx`

**Features**:
- Detect localStorage items on login
- Show modal with migration option
- Progress bar during migration
- Success/error messages
- "Skip" option (keeps localStorage)

**Validation**:
```bash
npm run dev
# Test: Login with localStorage data
# Test: Migration modal appears
# Test: Migration completes successfully
```

---

#### Task 13: Remove localStorage Fallback
**Purpose**: Clean up old localStorage code

**Files**: 
- Delete `src/lib/galleryStorage.ts`
- Update `src/hooks/useGallery.ts` to only use Supabase
- Remove localStorage references from components

**Validation**:
```bash
npm run build
npm run lint
# Test: Gallery works without localStorage
```

---

### Phase 5: Error Handling & UX

#### Task 14: Add Offline Detection
**Purpose**: Handle network failures gracefully

**Files**: `src/hooks/useOnlineStatus.ts`, `src/components/shared/OfflineBanner.tsx`

**Features**:
- Detect online/offline status
- Show banner when offline
- Queue operations for retry
- Disable save buttons when offline

**Validation**:
```bash
# Test: Disconnect network, verify banner appears
# Test: Try to save, verify error message
```

---

#### Task 15: Add Loading States
**Purpose**: Show feedback during async operations

**Files**: Update all components using Supabase

**Changes**:
- Add loading spinners for auth operations
- Add loading states for gallery operations
- Add skeleton loaders for gallery grid
- Disable buttons during operations

**Validation**:
```bash
# Test: All async operations show loading state
# Test: Buttons disabled during operations
```

---

#### Task 16: Add Error Boundaries
**Purpose**: Catch and handle Supabase errors

**Files**: `src/components/errors/SupabaseErrorBoundary.tsx`

**Features**:
- Catch auth errors (expired session, invalid token)
- Catch storage errors (quota exceeded, network failure)
- Catch database errors (constraint violations)
- Show user-friendly error messages
- Provide retry/logout options

**Validation**:
```bash
# Test: Simulate network error, verify error boundary
# Test: Simulate auth error, verify logout option
```

---

### Phase 6: Testing & Documentation

#### Task 17: Update Environment Variables
**Purpose**: Document all required Supabase variables

**Files**: `.env.example`, `README.md`

**Variables**:
```bash
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Gemini (existing)
VITE_GEMINI_API_KEY=your-gemini-key
```

**Validation**:
```bash
# Verify .env.example is up to date
# Verify README has setup instructions
```

---

#### Task 18: Update Documentation
**Purpose**: Document backend integration

**Files**: `README.md`, `DEVLOG.md`, `.kiro/steering/supabase-integration.md`

**Sections**:
- Supabase setup instructions
- Database schema documentation
- Storage bucket configuration
- RLS policy explanations
- Migration guide

**Validation**:
```bash
# Review documentation for completeness
# Verify setup instructions work
```

---

#### Task 19: Create Manual Test Checklist
**Purpose**: Comprehensive testing guide

**Files**: `.agents/tests/backend-integration-test-checklist.md`

**Test Cases**:
- [ ] Signup with email/password
- [ ] Login with email/password
- [ ] Magic link login
- [ ] Save creation to Supabase
- [ ] Load gallery from Supabase
- [ ] Delete creation from Supabase
- [ ] Migrate localStorage data
- [ ] Offline error handling
- [ ] Session expiration handling
- [ ] Storage quota exceeded handling

**Validation**:
```bash
# Run through all test cases manually
# Document any failures
```

---

#### Task 20: Update DEVLOG
**Purpose**: Document backend integration session

**Files**: `DEVLOG.md`

**Sections**:
- Session overview
- Decisions made (unified account model)
- Challenges encountered
- Time tracking
- Files created/modified
- Validation results

**Validation**:
```bash
# Verify DEVLOG is up to date
# Verify time tracking is accurate
```

---

## Risk Assessment

### High Risk
- **RLS Policy Bugs**: Users accessing other users' data
  - **Mitigation**: Thorough testing with multiple accounts
  - **Validation**: Use Supabase dashboard to verify policies

### Medium Risk
- **Migration Data Loss**: localStorage data lost during migration
  - **Mitigation**: Keep localStorage as backup until confirmed successful
  - **Validation**: Test migration with sample data first

- **Storage Quota**: Large images exceeding storage limits
  - **Mitigation**: Compress images before upload, set max file sizes
  - **Validation**: Test with large files, verify error handling

### Low Risk
- **Session Expiration**: Users logged out unexpectedly
  - **Mitigation**: Implement token refresh, show clear error messages
  - **Validation**: Test with expired tokens

---

## Success Criteria

### Functional Requirements
- ✅ Users can sign up with email/password
- ✅ Users can log in with email/password or magic link
- ✅ Users can save creations to Supabase
- ✅ Users can view their gallery from Supabase
- ✅ Users can delete creations from Supabase
- ✅ Users can migrate localStorage data to Supabase
- ✅ RLS policies prevent unauthorized access

### Non-Functional Requirements
- ✅ Gallery loads in < 2 seconds
- ✅ Image uploads complete in < 5 seconds
- ✅ No data loss during migration
- ✅ Graceful offline handling
- ✅ Clear error messages for all failures

### Code Quality
- ✅ TypeScript compilation passes
- ✅ ESLint passes with no warnings
- ✅ Production build successful
- ✅ All manual tests pass

---

## Time Estimate

**Total**: 4-5 hours

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| Phase 1: Supabase Setup | 1-3 | 30 min |
| Phase 2: Authentication | 4-7 | 60 min |
| Phase 3: Storage Integration | 8-10 | 90 min |
| Phase 4: Migration & Cleanup | 11-13 | 30 min |
| Phase 5: Error Handling & UX | 14-16 | 45 min |
| Phase 6: Testing & Documentation | 17-20 | 45 min |

---

## Dependencies

### External Services
- Supabase project created and configured
- Supabase URL and anon key available
- Storage buckets enabled in Supabase project

### Environment
- Node.js v20+ (already installed)
- Supabase CLI (for migrations)
- Kiro CLI with Supabase MCP (already configured)

### Code
- All 5 phases complete (✅ already done)
- Gallery feature complete (✅ already done)
- TypeScript strict mode (✅ already configured)

---

## Rollback Plan

If backend integration fails:

1. **Keep localStorage Code**: Don't delete `galleryStorage.ts` until fully tested
2. **Feature Flag**: Add `VITE_USE_SUPABASE=true/false` to toggle backend
3. **Fallback Logic**: If Supabase fails, fall back to localStorage
4. **Data Export**: Provide export function to download all data as JSON

---

## Post-Implementation

### Monitoring
- Track auth success/failure rates
- Monitor storage usage
- Track API error rates
- Monitor gallery load times

### Future Enhancements
- Real-time gallery updates (Supabase subscriptions)
- Shared galleries (public creations)
- Social features (likes, comments)
- Analytics dashboard for parents

---

**Plan Created**: January 29, 2026 17:52  
**Estimated Completion**: 4-5 hours  
**Confidence**: 8/10 for one-pass success  
**Next Step**: Run `@execute` with this plan file
