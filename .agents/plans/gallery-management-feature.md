# Feature: Gallery Management - Save and Manage Creations

## Feature Description

Gallery Management enables children to save their completed creations (refined image + certificate) to a personal collection stored in browser localStorage. This feature provides a sense of accomplishment, encourages repeat usage, and allows children to revisit their AI art portfolio. The gallery is accessible from any phase via a persistent UI element and displays saved creations as interactive cards with thumbnails, creation dates, and quick stats.

This is a pre-Supabase implementation using localStorage, which will later be migrated to Supabase database storage for persistent, cross-device access.

## User Story

As a child aged 7-10
I want to save my favorite AI creations to a personal gallery
So that I can view my collection, show it to friends/family, and re-download certificates

## Problem Statement

Currently, when children complete Phase 5 and click "Create Another", their previous creation is lost. This creates several issues:
- **No Portfolio**: Children can't build a collection of their work
- **Lost Progress**: Impressive creations disappear after session ends
- **Limited Sharing**: Can't easily revisit and share past work
- **Reduced Engagement**: No incentive to create multiple artworks

Without a gallery, the educational value is limited to single-session learning, missing the opportunity for children to see their progress over time and build pride in their growing portfolio.

## Solution Statement

Implement a gallery management system that:
1. **Saves creations** from Phase 5 Trophy to localStorage
2. **Displays gallery** as a dedicated view accessible from any phase
3. **Shows creation cards** with thumbnails, dates, and stats
4. **Enables deletion** of unwanted creations
5. **Allows re-download** of certificates and images
6. **Persists across sessions** using browser localStorage
7. **Provides quick access** via persistent gallery icon in app header

The gallery uses localStorage for immediate implementation, with a clear data structure that can be easily migrated to Supabase later. Each saved creation includes all necessary data: refined image, original image, prompt state JSON, certificate PDF (as base64), and metadata.

## Feature Metadata

**Feature Type**: New Capability  
**Estimated Complexity**: Medium  
**Primary Systems Affected**: 
- App.tsx (add gallery state and routing)
- TrophyPhase.tsx (add "Save to Gallery" button)
- New GalleryView component
- New localStorage utility (galleryStorage.ts)
- New types (GalleryTypes.ts)

---

## Technical Design

### Data Structure

#### GalleryItem Interface
```typescript
interface GalleryItem {
  id: string // UUID
  createdAt: number // timestamp
  refinedImage: string // base64
  originalImage: string // base64
  promptStateJSON: string // JSON string
  intentStatement: string
  stats: TrophyStats
  certificatePDF: string // base64 PDF data
  thumbnail: string // base64 thumbnail (scaled down version)
}
```

#### localStorage Schema
```typescript
// Key: 'kidcreatives_gallery'
// Value: JSON.stringify(GalleryItem[])
```

### Component Architecture

```
App.tsx (add gallery state)
├── GalleryView (new component)
│   ├── GalleryHeader (title + close button)
│   ├── GalleryGrid (responsive grid of cards)
│   │   └── GalleryCard[] (individual creation cards)
│   │       ├── Thumbnail image
│   │       ├── Creation date
│   │       ├── Quick stats (edit count, variables used)
│   │       ├── View details button
│   │       └── Delete button
│   └── EmptyGalleryState (when no creations saved)
└── GalleryIcon (persistent header button)
```

### File Structure

**New Files:**
- `src/components/gallery/GalleryView.tsx` - Main gallery component
- `src/components/gallery/GalleryCard.tsx` - Individual creation card
- `src/components/gallery/GalleryHeader.tsx` - Gallery header with close
- `src/components/gallery/EmptyGalleryState.tsx` - Empty state UI
- `src/lib/galleryStorage.ts` - localStorage CRUD operations
- `src/lib/thumbnailGenerator.ts` - Generate thumbnails from images
- `src/types/GalleryTypes.ts` - Gallery-related type definitions
- `src/hooks/useGallery.ts` - Gallery state management hook

**Modified Files:**
- `src/App.tsx` - Add gallery view state and routing
- `src/components/phases/TrophyPhase.tsx` - Add "Save to Gallery" button
- `src/types/PhaseTypes.ts` - Add Gallery to Phase enum (optional)

---

## Implementation Tasks

### Task 1: Create Type Definitions
**File**: `src/types/GalleryTypes.ts`

**Subtasks:**
1. Define `GalleryItem` interface with all required fields
2. Define `GalleryStats` interface for quick stats display
3. Export types for use across components

**Acceptance Criteria:**
- All gallery data structures typed
- Compatible with existing TrophyStats type
- Includes thumbnail field for performance

---

### Task 2: Implement localStorage Utility
**File**: `src/lib/galleryStorage.ts`

**Subtasks:**
1. Implement `saveToGallery(item: GalleryItem): void`
   - Generate UUID for item.id
   - Add timestamp to item.createdAt
   - Append to existing gallery array
   - Handle localStorage quota errors
2. Implement `getGalleryItems(): GalleryItem[]`
   - Retrieve from localStorage
   - Parse JSON safely
   - Return empty array if not found
3. Implement `deleteFromGallery(id: string): void`
   - Filter out item by id
   - Update localStorage
4. Implement `clearGallery(): void`
   - Remove all items (for future use)
5. Add error handling for localStorage failures

**Acceptance Criteria:**
- CRUD operations work correctly
- Handles localStorage quota exceeded gracefully
- Returns empty array for missing data
- No crashes on malformed JSON

**Dependencies**: GalleryTypes.ts

---

### Task 3: Implement Thumbnail Generator
**File**: `src/lib/thumbnailGenerator.ts`

**Subtasks:**
1. Implement `generateThumbnail(base64Image: string, maxWidth: number): Promise<string>`
   - Create canvas element
   - Load image from base64
   - Scale down to maxWidth (maintain aspect ratio)
   - Convert back to base64
   - Return thumbnail string
2. Add error handling for invalid images

**Acceptance Criteria:**
- Generates thumbnails at 300px width
- Maintains aspect ratio
- Returns base64 string
- Handles errors gracefully

**Dependencies**: None

---

### Task 4: Create Gallery State Hook
**File**: `src/hooks/useGallery.ts`

**Subtasks:**
1. Create custom hook `useGallery()`
2. Manage gallery items state with useState
3. Implement `loadGallery()` - fetch from localStorage
4. Implement `addToGallery(item: Omit<GalleryItem, 'id' | 'createdAt'>)` - save new item
5. Implement `removeFromGallery(id: string)` - delete item
6. Implement `refreshGallery()` - reload from localStorage
7. Use useEffect to load gallery on mount

**Acceptance Criteria:**
- Hook provides gallery items array
- Hook provides CRUD functions
- State updates trigger re-renders
- Loads gallery on component mount

**Dependencies**: galleryStorage.ts, GalleryTypes.ts

---

### Task 5: Create GalleryCard Component
**File**: `src/components/gallery/GalleryCard.tsx`

**Subtasks:**
1. Create functional component accepting `GalleryItem` prop
2. Display thumbnail image
3. Display creation date (formatted: "Jan 28, 2026")
4. Display quick stats (edit count, variables used)
5. Add "View Details" button (opens modal with full image + stats)
6. Add "Delete" button with confirmation
7. Add hover effects and animations (Framer Motion)
8. Style with Constructivist Pop theme

**Props Interface:**
```typescript
interface GalleryCardProps {
  item: GalleryItem
  onDelete: (id: string) => void
  onViewDetails: (item: GalleryItem) => void
}
```

**Acceptance Criteria:**
- Card displays thumbnail and metadata
- Delete button shows confirmation dialog
- View details opens modal
- Responsive design (mobile, tablet, desktop)
- Smooth animations on hover

**Dependencies**: GalleryTypes.ts, Framer Motion

---

### Task 6: Create EmptyGalleryState Component
**File**: `src/components/gallery/EmptyGalleryState.tsx`

**Subtasks:**
1. Create functional component with no props
2. Display Sparky illustration (waiting state)
3. Display message: "Your gallery is empty! Create your first masterpiece to get started."
4. Add "Create Now" button that closes gallery and returns to Phase 1
5. Style with Constructivist Pop theme

**Acceptance Criteria:**
- Friendly, encouraging message
- Clear call-to-action button
- Sparky illustration visible
- Centered layout

**Dependencies**: Sparky component

---

### Task 7: Create GalleryHeader Component
**File**: `src/components/gallery/GalleryHeader.tsx`

**Subtasks:**
1. Create functional component accepting `onClose` prop
2. Display "My Gallery" title
3. Display creation count (e.g., "5 Creations")
4. Add close button (X icon)
5. Style with Constructivist Pop theme

**Props Interface:**
```typescript
interface GalleryHeaderProps {
  itemCount: number
  onClose: () => void
}
```

**Acceptance Criteria:**
- Header displays title and count
- Close button works correctly
- Responsive design

**Dependencies**: Lucide React (X icon)

---

### Task 8: Create GalleryView Component
**File**: `src/components/gallery/GalleryView.tsx`

**Subtasks:**
1. Create functional component accepting `onClose` prop
2. Use `useGallery()` hook for state management
3. Render GalleryHeader with item count
4. Render EmptyGalleryState if no items
5. Render responsive grid of GalleryCard components
6. Implement modal for viewing full details
   - Show full refined image
   - Show all trophy stats
   - Show "Download Certificate" button
   - Show "Download Image" button
7. Handle delete confirmation dialog
8. Add loading state while fetching gallery
9. Add error state for localStorage failures
10. Style with Constructivist Pop theme

**Props Interface:**
```typescript
interface GalleryViewProps {
  onClose: () => void
}
```

**Acceptance Criteria:**
- Gallery loads items from localStorage
- Grid is responsive (1 col mobile, 2 col tablet, 3 col desktop)
- Modal shows full creation details
- Delete confirmation prevents accidental deletion
- Smooth animations (Framer Motion)

**Dependencies**: useGallery, GalleryCard, GalleryHeader, EmptyGalleryState

---

### Task 9: Add Gallery Icon to App Header
**File**: `src/App.tsx`

**Subtasks:**
1. Add state for gallery visibility: `const [showGallery, setShowGallery] = useState(false)`
2. Create persistent header component (if not exists)
3. Add gallery icon button (Gallery or Image icon from Lucide)
4. Position icon in top-right corner (fixed position)
5. Add badge showing creation count
6. Toggle gallery view on click
7. Style with Constructivist Pop theme

**Acceptance Criteria:**
- Icon visible on all phases
- Badge shows correct count
- Clicking opens gallery
- Icon has hover effect

**Dependencies**: Lucide React (Gallery icon)

---

### Task 10: Integrate Gallery into App.tsx
**File**: `src/App.tsx`

**Subtasks:**
1. Import GalleryView component
2. Add gallery visibility state (already added in Task 9)
3. Conditionally render GalleryView when `showGallery === true`
4. Pass `onClose` handler to GalleryView
5. Ensure gallery overlays current phase (z-index)
6. Add fade-in animation for gallery

**Acceptance Criteria:**
- Gallery opens/closes smoothly
- Gallery overlays phase components
- Closing gallery returns to current phase
- No state loss when opening/closing gallery

**Dependencies**: GalleryView component

---

### Task 11: Add "Save to Gallery" to TrophyPhase
**File**: `src/components/phases/TrophyPhase.tsx`

**Subtasks:**
1. Import `useGallery` hook
2. Import `generateThumbnail` utility
3. Add "Save to Gallery" button below "Download Certificate"
4. Implement save handler:
   - Generate thumbnail from refined image
   - Create GalleryItem object with all required data
   - Call `addToGallery(item)`
   - Show success message (Sparky says "Saved to your gallery!")
   - Disable button after saving (prevent duplicates)
5. Add loading state while saving
6. Handle save errors gracefully

**Acceptance Criteria:**
- Button saves creation to gallery
- Thumbnail generated correctly
- Success message displayed
- Button disabled after save
- No duplicate saves

**Dependencies**: useGallery, generateThumbnail, GalleryTypes

---

### Task 12: Add Download Functionality to Gallery
**File**: `src/components/gallery/GalleryView.tsx` (modal section)

**Subtasks:**
1. Implement `downloadImage(base64: string, filename: string)` utility
   - Create anchor element
   - Set href to base64 data URL
   - Set download attribute to filename
   - Trigger click
   - Clean up
2. Implement `downloadPDF(base64PDF: string, filename: string)` utility
   - Similar to downloadImage but for PDF
3. Add "Download Image" button in modal
4. Add "Download Certificate" button in modal
5. Generate filenames with creation date (e.g., "kidcreatives-robot-2026-01-28.png")

**Acceptance Criteria:**
- Image downloads as PNG
- Certificate downloads as PDF
- Filenames include creation date
- Downloads work on all browsers

**Dependencies**: None

---

### Task 13: Add Responsive Grid Layout
**File**: `src/components/gallery/GalleryView.tsx`

**Subtasks:**
1. Use Tailwind grid classes for responsive layout
2. Mobile: 1 column (grid-cols-1)
3. Tablet: 2 columns (md:grid-cols-2)
4. Desktop: 3 columns (lg:grid-cols-3)
5. Add gap between cards (gap-6)
6. Add padding to container (p-6)
7. Make gallery scrollable (overflow-y-auto)

**Acceptance Criteria:**
- Grid adapts to screen size
- Cards have consistent spacing
- Gallery scrolls when content overflows
- Responsive on mobile, tablet, desktop

**Dependencies**: TailwindCSS

---

### Task 14: Add Animations to Gallery
**File**: `src/components/gallery/GalleryView.tsx` and `GalleryCard.tsx`

**Subtasks:**
1. Add fade-in animation for gallery view (Framer Motion)
2. Add stagger animation for gallery cards
3. Add hover scale effect on cards
4. Add slide-in animation for modal
5. Add fade-out animation on delete

**Acceptance Criteria:**
- Gallery fades in smoothly
- Cards animate in with stagger effect
- Hover effects are smooth
- Modal slides in from bottom
- Delete animation is smooth

**Dependencies**: Framer Motion

---

### Task 15: Add Error Handling and Edge Cases
**Files**: All gallery-related files

**Subtasks:**
1. Handle localStorage quota exceeded
   - Show error message: "Gallery is full! Delete some creations to save more."
   - Provide "Manage Gallery" button
2. Handle malformed localStorage data
   - Clear corrupted data
   - Show error message
   - Log error to console
3. Handle missing thumbnail generation
   - Use placeholder image
   - Log error
4. Handle delete failures
   - Show error message
   - Retry option
5. Add loading states for all async operations

**Acceptance Criteria:**
- All error cases handled gracefully
- User-friendly error messages
- No app crashes
- Errors logged to console

**Dependencies**: All gallery components

---

### Task 16: Add Gallery Tests (Optional)
**Files**: `src/components/gallery/__tests__/`

**Subtasks:**
1. Test galleryStorage CRUD operations
2. Test thumbnail generation
3. Test GalleryCard rendering
4. Test GalleryView with empty state
5. Test GalleryView with items
6. Test delete confirmation
7. Test download functionality

**Acceptance Criteria:**
- All CRUD operations tested
- Component rendering tested
- User interactions tested
- Edge cases covered

**Dependencies**: Vitest, React Testing Library (future)

---

## Testing Strategy

### Manual Testing Checklist

**Save Functionality:**
- [ ] Complete Phase 5 and click "Save to Gallery"
- [ ] Verify success message appears
- [ ] Verify button disables after save
- [ ] Verify creation appears in gallery

**Gallery View:**
- [ ] Open gallery from any phase
- [ ] Verify all saved creations display
- [ ] Verify thumbnails load correctly
- [ ] Verify creation dates are formatted correctly
- [ ] Verify quick stats are accurate

**Gallery Card:**
- [ ] Click "View Details" on a card
- [ ] Verify modal opens with full image
- [ ] Verify all stats display correctly
- [ ] Click "Download Image" and verify download
- [ ] Click "Download Certificate" and verify download

**Delete Functionality:**
- [ ] Click delete button on a card
- [ ] Verify confirmation dialog appears
- [ ] Cancel deletion and verify card remains
- [ ] Confirm deletion and verify card disappears
- [ ] Verify localStorage updated

**Empty State:**
- [ ] Delete all creations
- [ ] Verify empty state displays
- [ ] Click "Create Now" and verify returns to Phase 1

**Responsive Design:**
- [ ] Test on mobile (1 column)
- [ ] Test on tablet (2 columns)
- [ ] Test on desktop (3 columns)
- [ ] Verify all interactions work on touch devices

**Edge Cases:**
- [ ] Save 10+ creations and verify performance
- [ ] Test with very long intent statements
- [ ] Test with corrupted localStorage data
- [ ] Test localStorage quota exceeded

### agent-browser Test Script

```bash
# Test save to gallery
agent-browser open http://localhost:5173
# Complete Phase 1-5 workflow
agent-browser snapshot -i
agent-browser click @save-to-gallery-button
agent-browser wait --text "Saved to your gallery"

# Test gallery view
agent-browser click @gallery-icon
agent-browser wait --text "My Gallery"
agent-browser snapshot -i
agent-browser screenshot gallery-view.png

# Test view details
agent-browser click @view-details-button
agent-browser wait --text "Download Certificate"
agent-browser screenshot gallery-modal.png

# Test delete
agent-browser click @delete-button
agent-browser wait --text "Are you sure"
agent-browser click @confirm-delete
agent-browser wait 1000
agent-browser snapshot -i
```

---

## Success Metrics

### Functional Requirements
- ✅ Creations save to localStorage successfully
- ✅ Gallery displays all saved creations
- ✅ Thumbnails generate and display correctly
- ✅ Delete functionality works with confirmation
- ✅ Download functionality works for images and PDFs
- ✅ Gallery accessible from all phases
- ✅ Empty state displays when no creations

### Performance Requirements
- Gallery loads in < 500ms with 10 creations
- Thumbnail generation completes in < 200ms per image
- No UI lag when scrolling gallery with 20+ items

### UX Requirements
- Gallery icon visible and intuitive
- Creation cards are visually appealing
- Animations are smooth (60fps)
- Responsive design works on all devices
- Error messages are child-friendly

---

## Future Enhancements (Post-Supabase)

1. **Cloud Sync**: Migrate from localStorage to Supabase database
2. **Cross-Device Access**: Access gallery from any device
3. **Sharing**: Share creations with friends via unique links
4. **Collections**: Organize creations into themed collections
5. **Search/Filter**: Search by intent statement or creation date
6. **Export All**: Download entire gallery as ZIP file
7. **Gallery Analytics**: Track most popular creations

---

## Migration Path to Supabase

When implementing Supabase integration:

1. **Database Schema**:
   ```sql
   CREATE TABLE gallery_items (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID REFERENCES auth.users(id),
     created_at TIMESTAMP DEFAULT NOW(),
     refined_image_url TEXT, -- Supabase Storage URL
     original_image_url TEXT,
     prompt_state_json JSONB,
     intent_statement TEXT,
     stats JSONB,
     certificate_pdf_url TEXT,
     thumbnail_url TEXT
   );
   ```

2. **Storage Buckets**:
   - `gallery-images` - Refined and original images
   - `gallery-certificates` - PDF certificates
   - `gallery-thumbnails` - Thumbnail images

3. **Migration Script**:
   - Read all items from localStorage
   - Upload images/PDFs to Supabase Storage
   - Insert records into database
   - Clear localStorage after successful migration

4. **Code Changes**:
   - Replace `galleryStorage.ts` with Supabase client calls
   - Update `useGallery` hook to use Supabase queries
   - Add authentication checks
   - Add loading states for network requests

---

## Dependencies

**External Libraries:**
- None (uses existing dependencies)

**Internal Dependencies:**
- TrophyPhase component (for save button)
- TrophyStats type (for stats display)
- Framer Motion (for animations)
- Lucide React (for icons)
- TailwindCSS (for styling)

**Browser APIs:**
- localStorage (for data persistence)
- Canvas API (for thumbnail generation)
- Blob/URL APIs (for downloads)

---

## Risk Assessment

### Technical Risks
- **localStorage Quota**: Browser limits (5-10MB) may be exceeded with many high-res images
  - **Mitigation**: Compress thumbnails aggressively, warn users at 80% capacity
- **Browser Compatibility**: localStorage may be disabled in private browsing
  - **Mitigation**: Detect and show warning message
- **Data Loss**: localStorage can be cleared by user or browser
  - **Mitigation**: Add export/import functionality, encourage Supabase migration

### UX Risks
- **Overwhelming Gallery**: Too many creations may be hard to navigate
  - **Mitigation**: Add pagination or infinite scroll in future
- **Slow Thumbnail Generation**: Large images may take time to process
  - **Mitigation**: Show loading spinner, process in background

### Timeline Risks
- **Scope Creep**: Gallery features may expand beyond MVP
  - **Mitigation**: Focus on core CRUD operations first, defer enhancements

---

## Estimated Timeline

- **Task 1-3**: 1 hour (Types, storage, thumbnail)
- **Task 4**: 30 minutes (Hook)
- **Task 5-7**: 2 hours (Card, empty state, header)
- **Task 8**: 2 hours (Main gallery view)
- **Task 9-10**: 1 hour (App integration)
- **Task 11**: 1 hour (Trophy save button)
- **Task 12-14**: 1.5 hours (Downloads, grid, animations)
- **Task 15**: 1 hour (Error handling)
- **Task 16**: 2 hours (Testing - optional)

**Total Estimated Time**: 10-12 hours

---

## Conclusion

This gallery management feature provides immediate value by allowing children to build a portfolio of their AI creations. The localStorage implementation is quick to develop and provides a solid foundation for future Supabase migration. The feature enhances user engagement, encourages repeat usage, and adds a sense of accomplishment to the educational experience.
