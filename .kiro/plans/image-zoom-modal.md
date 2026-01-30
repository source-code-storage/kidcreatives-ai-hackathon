# Image Zoom Modal for Educational Outputs

**Objective**: Add interactive zoom functionality to certificate and prompt card images in EducationalOutputsSection

**Date**: January 31, 2026  
**Estimated Time**: 20 minutes  
**Priority**: Medium  

---

## Overview

Implement a lightbox/modal zoom effect for educational output images:
- **Desktop**: Hover to preview, click to zoom full screen
- **Mobile**: Tap to zoom full screen
- **Close**: Click outside image or press Escape key to close

---

## Tasks

### Task 1: Create ImageZoomModal Component
**File**: `kidcreatives-ai/src/components/ui/ImageZoomModal.tsx` (NEW)

**Purpose**: Reusable modal component for zooming images

**Implementation Details**:
```typescript
// Component structure:
// - Full-screen overlay with backdrop blur
// - Centered image with max dimensions
// - Click outside to close
// - Escape key to close
// - Smooth animations (Framer Motion)

// Props:
interface ImageZoomModalProps {
  src: string
  alt: string
  isOpen: boolean
  onClose: () => void
}

// Features:
// - AnimatePresence for enter/exit animations
// - Backdrop: rgba(0,0,0,0.8) with blur
// - Image: max-w-5xl, max-h-[90vh], object-contain
// - Click backdrop to close
// - ESC key listener
// - Prevent body scroll when open
// - z-index: z-[9999] (above everything)

// Animations:
// - Backdrop: fade in/out
// - Image: scale(0.8) → scale(1) with fade
```

**Acceptance Criteria**:
- ✅ Modal displays full-screen overlay
- ✅ Image scales to fit viewport
- ✅ Click outside closes modal
- ✅ ESC key closes modal
- ✅ Smooth animations
- ✅ Body scroll locked when open

---

### Task 2: Add Zoom State to EducationalOutputsSection
**File**: `kidcreatives-ai/src/components/landing/EducationalOutputsSection.tsx` (MODIFY)

**Changes**:
- Add state for tracking which image is zoomed
- Add click handlers to images
- Import and render ImageZoomModal
- Add cursor-pointer and hover effects to images

**Implementation Details**:
```typescript
// State management:
const [zoomedImage, setZoomedImage] = useState<{
  src: string
  alt: string
} | null>(null)

// Click handlers:
const handleImageClick = (src: string, alt: string) => {
  setZoomedImage({ src, alt })
}

const handleCloseZoom = () => {
  setZoomedImage(null)
}

// Image wrapper styling:
// - cursor-pointer
// - hover:scale-105 transition
// - hover:shadow-2xl
// - Add visual hint (zoom icon overlay on hover)

// Modal rendering:
<ImageZoomModal
  src={zoomedImage?.src || ''}
  alt={zoomedImage?.alt || ''}
  isOpen={!!zoomedImage}
  onClose={handleCloseZoom}
/>
```

**Acceptance Criteria**:
- ✅ Click on certificate opens zoom modal
- ✅ Click on prompt card opens zoom modal
- ✅ Hover shows visual feedback (scale + shadow)
- ✅ Modal closes properly
- ✅ State resets on close

---

### Task 3: Add Zoom Icon Overlay (Optional Enhancement)
**File**: `kidcreatives-ai/src/components/landing/EducationalOutputsSection.tsx` (MODIFY)

**Purpose**: Add visual hint that images are clickable

**Implementation**:
```typescript
// Add overlay on image hover:
// - Absolute positioned div
// - Center: flex items-center justify-center
// - Background: rgba(0,0,0,0.5)
// - Icon: ZoomIn from lucide-react
// - Opacity: 0 → 1 on hover
// - Transition: smooth

// Structure:
<div className="relative group">
  <img ... />
  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 
                  transition-opacity flex items-center justify-center">
    <ZoomIn className="w-12 h-12 text-white" />
  </div>
</div>
```

**Acceptance Criteria**:
- ✅ Zoom icon appears on hover (desktop)
- ✅ Smooth fade in/out transition
- ✅ Icon centered on image
- ✅ Doesn't interfere with click functionality

---

### Task 4: Update UI Component Exports
**File**: `kidcreatives-ai/src/components/ui/index.ts` (MODIFY)

**Changes**:
- Export new ImageZoomModal component

**Implementation**:
```typescript
export { ImageZoomModal } from './ImageZoomModal'
```

**Acceptance Criteria**:
- ✅ Component exports correctly
- ✅ No TypeScript errors

---

## Design Specifications

### Modal Styling
```css
/* Backdrop */
background: rgba(0, 0, 0, 0.9)
backdrop-filter: blur(8px)
z-index: 9999

/* Image Container */
max-width: 90vw
max-height: 90vh
padding: 2rem

/* Image */
object-fit: contain
border-radius: 1rem
box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5)
```

### Animations (Framer Motion)
```typescript
// Backdrop
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
transition={{ duration: 0.2 }}

// Image
initial={{ opacity: 0, scale: 0.8 }}
animate={{ opacity: 1, scale: 1 }}
exit={{ opacity: 0, scale: 0.8 }}
transition={{ duration: 0.3, ease: 'easeOut' }}
```

### Hover Effects (Image Thumbnails)
```css
/* Default */
transition: all 0.3s ease

/* Hover */
transform: scale(1.05)
box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2)
cursor: pointer
```

---

## Interaction Flow

### Desktop Flow
1. User hovers over certificate/prompt card image
2. Image scales slightly (1.05x) with shadow
3. Zoom icon overlay fades in
4. User clicks image
5. Modal opens with full-screen backdrop
6. Image animates from scale(0.8) to scale(1)
7. User clicks outside image or presses ESC
8. Modal closes with reverse animation

### Mobile Flow
1. User taps certificate/prompt card image
2. Modal opens immediately (no hover state)
3. Image displays full-screen
4. User taps outside image
5. Modal closes

---

## Accessibility Considerations

### Keyboard Support
- ESC key closes modal
- Focus trap within modal (optional)
- Focus returns to trigger element on close

### Screen Readers
- Modal has role="dialog"
- aria-modal="true"
- aria-labelledby for image description
- Announce modal open/close states

### Visual
- High contrast backdrop (0.9 opacity)
- Clear close affordance (click outside)
- Smooth animations (respects prefers-reduced-motion)

---

## Testing Checklist

### Functional Testing
- [ ] Click certificate image opens modal
- [ ] Click prompt card image opens modal
- [ ] Click outside modal closes it
- [ ] ESC key closes modal
- [ ] Multiple open/close cycles work
- [ ] Body scroll locked when modal open

### Visual Testing
- [ ] Image scales to fit viewport
- [ ] Image maintains aspect ratio
- [ ] Backdrop is dark enough
- [ ] Animations are smooth
- [ ] Hover effects work on desktop
- [ ] Zoom icon overlay appears correctly

### Responsive Testing
- [ ] Mobile (375px): Tap to zoom works
- [ ] Tablet (768px): Click to zoom works
- [ ] Desktop (1920px): Hover + click works
- [ ] Image fits on all screen sizes

### Accessibility Testing
- [ ] ESC key closes modal
- [ ] Focus management works
- [ ] Screen reader announces modal
- [ ] Keyboard navigation works

---

## File Structure

```
kidcreatives-ai/src/components/
├── ui/
│   ├── ImageZoomModal.tsx              # NEW - Zoom modal component
│   └── index.ts                        # MODIFIED - Export new component
└── landing/
    └── EducationalOutputsSection.tsx   # MODIFIED - Add zoom functionality
```

---

## Implementation Order

1. **Task 1**: Create ImageZoomModal component (10 min)
   - Build modal structure
   - Add animations
   - Implement close handlers
   - Test ESC key and click outside

2. **Task 2**: Add zoom state to EducationalOutputsSection (5 min)
   - Add state management
   - Add click handlers
   - Integrate modal
   - Test open/close flow

3. **Task 3**: Add zoom icon overlay (3 min)
   - Add hover overlay
   - Style zoom icon
   - Test hover effects

4. **Task 4**: Update exports (1 min)
   - Add export statement
   - Verify no errors

5. **Testing**: Interaction and responsive testing (1 min)

---

## Success Criteria

### Functional Requirements
- ✅ Images zoom on click (mobile) or hover+click (desktop)
- ✅ Modal displays full-screen with backdrop
- ✅ Click outside closes modal
- ✅ ESC key closes modal
- ✅ Smooth animations

### Design Requirements
- ✅ Matches existing theme
- ✅ Professional lightbox appearance
- ✅ Clear visual feedback on hover
- ✅ Responsive on all devices

### Technical Requirements
- ✅ No TypeScript errors
- ✅ No console warnings
- ✅ Reusable component
- ✅ Accessible markup

---

## Code Patterns to Follow

### State Management
```typescript
// Use simple local state (no context needed)
const [zoomedImage, setZoomedImage] = useState<ImageData | null>(null)
```

### Event Handlers
```typescript
// Prevent event bubbling
const handleBackdropClick = (e: React.MouseEvent) => {
  if (e.target === e.currentTarget) {
    onClose()
  }
}
```

### Keyboard Listeners
```typescript
// Clean up listeners
useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }
  
  if (isOpen) {
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }
}, [isOpen, onClose])
```

### Body Scroll Lock
```typescript
// Prevent background scroll
useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }
}, [isOpen])
```

---

## Notes

- Keep modal component reusable for future use
- Use Framer Motion for consistent animations
- Ensure mobile tap targets are large enough (44x44px minimum)
- Test on actual mobile devices if possible
- Consider adding loading state for large images (optional)

---

**Status**: Ready for implementation  
**Blocked By**: None  
**Dependencies**: Framer Motion (already installed), lucide-react (already installed)
