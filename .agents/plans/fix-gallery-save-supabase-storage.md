# Fix Gallery Save Issues - Supabase Storage Setup

**Issue**: Gallery save functionality fails with two critical errors:
1. `InvalidCharacterError: Failed to execute 'atob'` - Base64 decoding error
2. `StorageApiError: Bucket not found` - Missing Supabase storage buckets

**Root Causes**:
- Supabase storage buckets not created (manual setup required per SUPABASE_STATUS.md)
- Base64 string validation missing before decoding
- No error handling for malformed base64 strings

**Expected Behavior**:
- User completes 5-phase workflow
- Clicks "Save to Gallery" in Trophy Phase
- Images and PDF upload to Supabase Storage
- Creation saved to database
- Gallery displays saved creation with download capability

---

## Solution Strategy

### Part 1: Create Supabase Storage Buckets (via MCP)
Use Supabase MCP to create the required storage buckets programmatically.

### Part 2: Fix Base64 Validation
Add proper validation and error handling in storage.ts to prevent decoding errors.

### Part 3: Optional Enhancement
Consider auto-saving to gallery after PDF generation (instead of manual click).

---

## Implementation Plan

### Task 1: Create Storage Buckets via Supabase MCP

**Approach**: Use Supabase MCP to create the 3 required storage buckets.

**Buckets Required**:
1. `creation-images` - For refined and original images
2. `creation-thumbnails` - For thumbnail images
3. `creation-certificates` - For PDF certificates

**Bucket Configuration**:
- **Public**: No (private buckets with RLS)
- **File size limit**: 50MB (sufficient for images and PDFs)
- **Allowed MIME types**: 
  - `creation-images`: image/jpeg, image/png, image/webp
  - `creation-thumbnails`: image/jpeg, image/png
  - `creation-certificates`: application/pdf

**MCP Commands to Execute**:

```
Use Supabase MCP to create storage bucket named "creation-images" with the following settings:
- Public: false (private bucket)
- File size limit: 50MB
- Allowed MIME types: image/jpeg, image/png, image/webp
```

```
Use Supabase MCP to create storage bucket named "creation-thumbnails" with the following settings:
- Public: false (private bucket)
- File size limit: 10MB
- Allowed MIME types: image/jpeg, image/png
```

```
Use Supabase MCP to create storage bucket named "creation-certificates" with the following settings:
- Public: false (private bucket)
- File size limit: 10MB
- Allowed MIME types: application/pdf
```

**Storage RLS Policies** (Apply after bucket creation):

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

**Note**: If Supabase MCP cannot create storage buckets, provide clear manual instructions as fallback.

---

### Task 2: Fix Base64 Validation in Storage Service

**File**: `kidcreatives-ai/src/lib/supabase/storage.ts`

**Problem**: The `base64ToFile` function assumes base64 strings always have the `data:` prefix and proper encoding, causing crashes when they don't.

**Current Code** (lines 8-17):
```typescript
function base64ToFile(base64: string, filename: string, mimeType: string): File {
  const arr = base64.split(',')
  const bstr = atob(arr[1])  // ❌ Crashes if arr[1] is undefined or malformed
  
  const blob = new Blob([new Uint8Array(
    Array.from(bstr).map(char => char.charCodeAt(0))
  )], { type: mimeType })
  
  return new File([blob], filename, { type: mimeType })
}
```

**Fixed Code**:
```typescript
function base64ToFile(base64: string, filename: string, mimeType: string): File {
  try {
    // Validate base64 string format
    if (!base64 || typeof base64 !== 'string') {
      throw new Error('Invalid base64 string: empty or not a string')
    }

    // Handle both data URL format and raw base64
    let base64Data: string
    if (base64.startsWith('data:')) {
      // Extract base64 data from data URL (data:image/png;base64,...)
      const parts = base64.split(',')
      if (parts.length !== 2) {
        throw new Error('Invalid data URL format')
      }
      base64Data = parts[1]
    } else {
      // Assume raw base64 string
      base64Data = base64
    }

    // Validate base64 data is not empty
    if (!base64Data || base64Data.trim().length === 0) {
      throw new Error('Base64 data is empty')
    }

    // Decode base64 with error handling
    let bstr: string
    try {
      bstr = atob(base64Data)
    } catch (decodeError) {
      throw new Error(`Failed to decode base64: ${decodeError instanceof Error ? decodeError.message : 'Invalid encoding'}`)
    }

    // Convert to Uint8Array
    const uint8Array = new Uint8Array(bstr.length)
    for (let i = 0; i < bstr.length; i++) {
      uint8Array[i] = bstr.charCodeAt(i)
    }

    // Create blob and file
    const blob = new Blob([uint8Array], { type: mimeType })
    return new File([blob], filename, { type: mimeType })
  } catch (error) {
    console.error('base64ToFile error:', error)
    throw new Error(`Failed to convert base64 to file: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
```

**Changes**:
1. ✅ Validate base64 string is not empty or null
2. ✅ Handle both data URL format (`data:image/png;base64,...`) and raw base64
3. ✅ Wrap `atob()` in try-catch to handle decoding errors
4. ✅ Provide clear error messages for debugging
5. ✅ Use more efficient Uint8Array construction

---

### Task 3: Improve Error Messages in Upload Functions

**File**: `kidcreatives-ai/src/lib/supabase/storage.ts`

**Update `uploadImage` function** (lines 23-60):

Add better error context:

```typescript
export async function uploadImage(
  fileOrBase64: File | string,
  bucket: 'creation-images' | 'creation-thumbnails',
  path: string
): Promise<string> {
  try {
    let file: File

    if (typeof fileOrBase64 === 'string') {
      // Convert base64 to File with validation
      const mimeType = fileOrBase64.match(/data:([^;]+);/)?.[1] || 'image/jpeg'
      const extension = mimeType.split('/')[1]
      
      // Add context to error messages
      try {
        file = base64ToFile(fileOrBase64, `image.${extension}`, mimeType)
      } catch (conversionError) {
        throw new Error(`Base64 conversion failed for ${bucket}/${path}: ${conversionError instanceof Error ? conversionError.message : 'Unknown error'}`)
      }
    } else {
      file = fileOrBase64
    }

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (error) {
      // Add bucket context to error
      throw new Error(`Storage upload failed for ${bucket}/${path}: ${error.message}`)
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return publicUrl
  } catch (error) {
    console.error('Upload image error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    // Check for common storage errors with helpful messages
    if (errorMessage.includes('Bucket not found') || errorMessage.includes('bucket_id')) {
      throw new Error(`Storage bucket "${bucket}" not found. Please create storage buckets in Supabase Dashboard. See SUPABASE_STATUS.md for instructions.`)
    }
    
    if (errorMessage.includes('Base64 conversion failed')) {
      throw new Error(`Invalid image data: ${errorMessage}`)
    }
    
    throw new Error(`Failed to upload image to ${bucket}: ${errorMessage}`)
  }
}
```

**Update `uploadPDF` function** similarly (lines 65-100).

---

### Task 4: Add Validation to TrophyPhase Save Function

**File**: `kidcreatives-ai/src/components/phases/TrophyPhase.tsx`

**Update `handleSaveToGallery`** (lines 168-230):

Add validation before attempting save:

```typescript
const handleSaveToGallery = async () => {
  if (!stats) {
    setSaveError('Unable to save: missing stats data')
    return
  }

  // Validate required data before attempting save
  if (!refinedImage || !originalImage) {
    setSaveError('Unable to save: missing image data')
    setSparkyMessage("Oops! Some images are missing. Try generating your artwork again.")
    return
  }

  if (!promptStateJSON) {
    setSaveError('Unable to save: missing prompt data')
    setSparkyMessage("Oops! Prompt data is missing. Try going back to Phase 2.")
    return
  }

  setIsSavingToGallery(true)
  setSaveError(null)

  try {
    // Validate base64 format before processing
    if (!refinedImage.startsWith('data:') && !refinedImage.startsWith('http')) {
      throw new Error('Invalid refined image format')
    }
    if (!originalImage.startsWith('data:') && !originalImage.startsWith('http')) {
      throw new Error('Invalid original image format')
    }

    // Generate thumbnail
    const thumbnail = await generateThumbnail(refinedImage, 300)

    // Generate PDF if not already generated
    let pdfBase64 = generatedPDFBase64
    if (!pdfBase64) {
      const promptState: PromptStateJSON = JSON.parse(promptStateJSON)
      const synthesizedPrompt = promptState.synthesizedPrompt || intentStatement

      const pdfBlob = await generateCertificatePDF({
        childName: childName || 'Young Creator',
        creationDate: new Date(),
        finalImage: refinedImage,
        originalImage,
        synthesizedPrompt,
        stats
      })

      // Convert blob to base64
      const reader = new FileReader()
      pdfBase64 = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(pdfBlob)
      })
      setGeneratedPDFBase64(pdfBase64)
    }

    // Validate PDF base64
    if (!pdfBase64 || !pdfBase64.startsWith('data:application/pdf')) {
      throw new Error('Invalid PDF format')
    }

    // Save to gallery
    await addToGallery({
      refinedImage,
      originalImage,
      promptStateJSON,
      intentStatement,
      stats,
      certificatePDF: pdfBase64,
      thumbnail
    })

    setSavedToGallery(true)
    setSparkyMessage(
      "🎉 Saved to your gallery! You can view it anytime by clicking the gallery icon."
    )
  } catch (error) {
    console.error('Save to gallery error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to save to gallery'
    
    // Provide user-friendly error messages
    if (errorMessage.includes('Bucket not found')) {
      setSaveError('Storage not configured. Please contact support.')
      setSparkyMessage("Oops! The storage system isn't set up yet. You can still download your certificate!")
    } else if (errorMessage.includes('Base64') || errorMessage.includes('Invalid')) {
      setSaveError('Invalid image data. Try regenerating your artwork.')
      setSparkyMessage("Oops! Something went wrong with the image. Try creating a new artwork!")
    } else {
      setSaveError(errorMessage)
      setSparkyMessage("Oops! Couldn't save to gallery. But you can still download your certificate!")
    }
  } finally {
    setIsSavingToGallery(false)
  }
}
```

---

### Task 5: Update SUPABASE_STATUS.md

**File**: `SUPABASE_STATUS.md`

Update the status to reflect bucket creation via MCP:

```markdown
## ✅ Completed via Supabase MCP

### Storage Buckets
- ✅ `creation-images` - Created with 50MB limit, private
- ✅ `creation-thumbnails` - Created with 10MB limit, private
- ✅ `creation-certificates` - Created with 10MB limit, private
- ✅ Storage RLS policies applied (4 policies)

**Total**: 3 storage buckets + 4 RLS policies
```

---

## Testing Plan

### 1. Verify Storage Buckets Created

**Via Supabase Dashboard**:
1. Go to: https://supabase.com/dashboard/project/rlkvtubxsxfkrwuvvvcn/storage/buckets
2. Verify 3 buckets exist:
   - `creation-images`
   - `creation-thumbnails`
   - `creation-certificates`
3. Check each bucket is private (not public)

**Via SQL**:
```sql
SELECT name, public FROM storage.buckets;
```

Expected output:
```
name                    | public
-----------------------|--------
creation-images        | false
creation-thumbnails    | false
creation-certificates  | false
```

### 2. Test Base64 Validation

**Unit Test Cases** (manual testing):

```typescript
// Test 1: Valid data URL
const validDataURL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
// Should succeed

// Test 2: Raw base64 (no data: prefix)
const rawBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
// Should succeed

// Test 3: Invalid base64
const invalidBase64 = "not-valid-base64!!!"
// Should throw clear error

// Test 4: Empty string
const emptyBase64 = ""
// Should throw clear error

// Test 5: Malformed data URL
const malformedDataURL = "data:image/png;base64"
// Should throw clear error
```

### 3. Test Complete Workflow

**End-to-End Test**:

1. **Start dev server**:
   ```bash
   cd kidcreatives-ai
   npm run dev
   ```

2. **Complete workflow**:
   - Phase 1: Upload image + intent statement
   - Phase 2: Answer 4 questions
   - Phase 3: Generate image
   - Phase 4: Skip refinement or make 1 edit
   - Phase 5: Click "Save to Gallery"

3. **Verify save success**:
   - Check for success message: "🎉 Saved to your gallery!"
   - No console errors
   - Gallery icon shows saved creation

4. **Verify in Supabase Dashboard**:
   - Go to Storage: Check files uploaded to buckets
   - Go to Table Editor: Check `creations` table has new row
   - Go to Table Editor: Check `creation_stats` table has new row

5. **Test gallery view**:
   - Click gallery icon
   - Verify creation appears with thumbnail
   - Click creation to view details
   - Download PDF certificate
   - Delete creation (test delete functionality)

### 4. Test Error Handling

**Error Scenarios**:

1. **Missing buckets** (before creation):
   - Should show: "Storage bucket not found. Please create storage buckets..."
   
2. **Invalid base64**:
   - Should show: "Invalid image data. Try regenerating your artwork."

3. **Network error**:
   - Should show: "Failed to save to gallery" with retry option

### Validation Checklist

- [ ] 3 storage buckets created in Supabase
- [ ] Storage RLS policies applied (4 policies)
- [ ] Base64 validation prevents crashes
- [ ] Clear error messages for all failure cases
- [ ] Complete workflow saves to gallery successfully
- [ ] Files appear in Supabase Storage
- [ ] Database records created correctly
- [ ] Gallery displays saved creations
- [ ] PDF download works from gallery
- [ ] Delete functionality works
- [ ] No console errors during save
- [ ] TypeScript compilation passes
- [ ] Build succeeds

---

## Rollback Plan

If issues occur:

1. **Storage bucket creation fails**:
   - Fallback to manual creation via dashboard
   - Use instructions in SUPABASE_STATUS.md

2. **Base64 validation too strict**:
   - Adjust validation logic to be more permissive
   - Add logging to identify edge cases

3. **Upload failures persist**:
   - Check Supabase project status
   - Verify API keys are correct
   - Check network connectivity
   - Review Supabase logs for errors

---

## Success Criteria

✅ Storage buckets created and configured  
✅ Base64 validation prevents crashes  
✅ Clear error messages for all failure cases  
✅ Complete workflow saves to gallery  
✅ Gallery displays saved creations  
✅ PDF download works  
✅ No console errors  
✅ TypeScript compilation passes  

---

## Time Estimate

- **Supabase MCP bucket creation**: 5 minutes
- **Base64 validation fix**: 10 minutes
- **Error handling improvements**: 10 minutes
- **Testing**: 15 minutes
- **Total**: ~40 minutes

---

## Files to Modify

1. `kidcreatives-ai/src/lib/supabase/storage.ts` - Fix base64 validation
2. `kidcreatives-ai/src/components/phases/TrophyPhase.tsx` - Add validation
3. `SUPABASE_STATUS.md` - Update status

---

## Dependencies

- Supabase MCP access (for bucket creation)
- Supabase project: rlkvtubxsxfkrwuvvvcn
- Active internet connection
- Valid Supabase API keys in .env

---

## Notes

- **Priority**: Critical (blocks core feature)
- **Risk**: Medium (involves external service configuration)
- **Impact**: High (enables gallery functionality)
- **Supabase MCP**: If bucket creation via MCP fails, provide manual instructions
- **Base64 validation**: Essential for preventing crashes
- **Error messages**: Must be user-friendly for children

---

**Status**: Ready for implementation  
**Blocked by**: Supabase storage bucket creation  
**Next Step**: Use Supabase MCP to create buckets, then implement code fixes
