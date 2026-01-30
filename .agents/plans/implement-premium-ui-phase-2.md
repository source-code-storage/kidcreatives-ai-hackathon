# Feature: Premium UI/UX Design System - Phase 2 (Medium Priority)

The following plan should be complete, but it's important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils types and models. Import from the right files etc.

## Feature Description

Implement Phase 2 medium-priority design enhancements to elevate KidCreatives AI's visual quality and user engagement. This includes adding glassmorphism effects to phase component cards, redesigning the gallery with a Pinterest-style masonry layout, and implementing delightful micro-interactions (ripple effects, confetti celebrations, particle effects). These enhancements build on Phase 1's foundation to create a truly premium, engaging experience for children.

## User Story

As a child user (7-10 years old)
I want to see beautiful glass-like cards, a dynamic gallery layout, and fun animations when I interact
So that the app feels magical, professional, and exciting to use

As a parent/educator
I want the app to have polished, premium interactions
So that I perceive it as a high-quality educational tool worth the time investment

## Problem Statement

While Phase 1 established the foundation with navigation, gradients, and typography, the individual phase components still use basic white cards without depth or visual interest. The gallery uses a rigid grid layout that doesn't showcase creations dynamically. There are no micro-interactions to provide tactile feedback or celebrate achievements, making the experience feel static rather than alive.

## Solution Statement

Enhance the visual experience with:
1. **Glassmorphism Cards**: Replace solid white cards with frosted glass effects (backdrop-blur, semi-transparent backgrounds) in all phase components
2. **Masonry Gallery**: Implement Pinterest-style layout using react-layout-masonry for dynamic, visually interesting gallery
3. **Micro-Interactions**: Add ripple effects on button clicks, confetti on phase completion, and particle effects for celebrations

## Feature Metadata

**Feature Type**: Enhancement
**Estimated Complexity**: Medium
**Primary Systems Affected**: 
- Phase Components (all 5 phases)
- Gallery Components (GalleryView, GalleryCard)
- UI Components (Button, existing cards)
- Animation System (new micro-interaction utilities)

**Dependencies**: 
- Framer Motion 11.0.3 (already installed)
- canvas-confetti (to be installed)
- react-layout-masonry (to be installed)

---

## CONTEXT REFERENCES

### Relevant Codebase Files IMPORTANT: YOU MUST READ THESE FILES BEFORE IMPLEMENTING!

- `kidcreatives-ai/src/components/phases/HandshakePhase.tsx` (lines 50-213) - Why: Card structure pattern to enhance with glassmorphism
- `kidcreatives-ai/src/components/phases/PromptBuilderPhase.tsx` (lines 120-260) - Why: Question cards and progress indicators to enhance
- `kidcreatives-ai/src/components/phases/GenerationPhase.tsx` (lines 87-253) - Why: Loading and result cards to enhance
- `kidcreatives-ai/src/components/phases/RefinementPhase.tsx` (lines 101-225) - Why: Chat interface cards to enhance
- `kidcreatives-ai/src/components/phases/TrophyPhase.tsx` (lines 326-519) - Why: Trophy display and save cards to enhance
- `kidcreatives-ai/src/components/gallery/GalleryView.tsx` (lines 93-150) - Why: Current grid layout to replace with masonry
- `kidcreatives-ai/src/components/gallery/GalleryCard.tsx` (lines 1-98) - Why: Card component to update for masonry (remove aspect-square)
- `kidcreatives-ai/src/components/ui/button.tsx` (lines 1-52) - Why: Button component to add ripple effect
- `kidcreatives-ai/src/components/ui/HoloCard.tsx` (lines 32-70) - Why: Existing glassmorphism pattern to mirror
- `.kiro/steering/design-system.md` (lines 1-100) - Why: Design system tokens and patterns

### New Files to Create

- `kidcreatives-ai/src/components/ui/RippleButton.tsx` - Button with ripple effect on click
- `kidcreatives-ai/src/components/ui/Confetti.tsx` - Confetti celebration component
- `kidcreatives-ai/src/lib/microInteractions.ts` - Utility functions for micro-interactions
- `kidcreatives-ai/src/hooks/useConfetti.ts` - Hook for confetti animations

### Relevant Documentation YOU SHOULD READ THESE BEFORE IMPLEMENTING!

- [Framer Motion Gestures](https://motion.dev/docs/gestures)
  - Specific section: whileTap and whileHover
  - Why: Needed for ripple and hover effects

- [canvas-confetti Documentation](https://github.com/catdad/canvas-confetti)
  - Specific section: Basic usage and customization
  - Why: Celebration animations for phase completion

- [react-layout-masonry](https://github.com/bensquire/react-layout-masonry)
  - Specific section: Installation and basic usage
  - Why: Pinterest-style gallery layout

- [CSS backdrop-filter](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter)
  - Specific section: Browser support and usage
  - Why: Glassmorphism effect implementation

### Patterns to Follow

**Glassmorphism Pattern** (from HoloCard.tsx:65-70):
```typescript
<div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
  {/* Content with frosted glass effect */}
</div>
```

**Card Structure Pattern** (from PromptBuilderPhase.tsx:180-200):
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.3 }}
  className="bg-white rounded-lg shadow-lg p-6"
>
  {/* Card content */}
</motion.div>
```

**Animation Stagger Pattern** (from GalleryView.tsx:125-135):
```typescript
<motion.div
  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
  initial="hidden"
  animate="visible"
  variants={{
    visible: { transition: { staggerChildren: 0.1 } }
  }}
>
```

**Hover Effect Pattern** (from GalleryCard.tsx:28-35):
```typescript
<motion.div
  whileHover={{ scale: 1.02 }}
  className="bg-white rounded-lg shadow-lg overflow-hidden"
>
```

**Naming Conventions**:
- Components: PascalCase (RippleButton, Confetti)
- Hooks: camelCase with `use` prefix (useConfetti)
- Utilities: camelCase (triggerConfetti, createRipple)
- CSS classes: Tailwind utilities with semantic colors

---

## IMPLEMENTATION PLAN

### Phase 1: Foundation - Install Dependencies & Create Utilities

Install required libraries and create utility functions for micro-interactions.

**Tasks:**
- Install canvas-confetti and react-layout-masonry
- Create micro-interaction utility functions
- Create confetti hook for reusable celebrations

### Phase 2: Glassmorphism Enhancement

Apply glassmorphism effects to all phase component cards.

**Tasks:**
- Update HandshakePhase cards with glass effect
- Update PromptBuilderPhase question cards with glass effect
- Update GenerationPhase result cards with glass effect
- Update RefinementPhase chat cards with glass effect
- Update TrophyPhase save card with glass effect

### Phase 3: Masonry Gallery Implementation

Replace grid layout with masonry layout for dynamic gallery.

**Tasks:**
- Install and configure react-layout-masonry
- Update GalleryView to use Masonry component
- Update GalleryCard to support variable heights
- Adjust animations for masonry layout

### Phase 4: Micro-Interactions

Add ripple effects, confetti celebrations, and particle effects.

**Tasks:**
- Create RippleButton component with click ripple effect
- Add confetti to phase completion transitions
- Add confetti to trophy phase celebration
- Add particle effects to generation phase
- Enhance button hover effects with magnetic attraction

---

## STEP-BY-STEP TASKS

IMPORTANT: Execute every task in order, top to bottom. Each task is atomic and independently testable.


### Task 1: Install Dependencies
**Objective**: Install canvas-confetti and react-layout-masonry libraries

**Steps**:
1. Navigate to kidcreatives-ai directory
2. Run: `npm install canvas-confetti @types/canvas-confetti react-layout-masonry`
3. Verify installation in package.json

**Validation**:
```bash
cd kidcreatives-ai && npm list canvas-confetti react-layout-masonry
```

**Expected Output**: Both packages listed with version numbers

---

### Task 2: Create Micro-Interaction Utilities
**Objective**: Create utility functions for ripple effects and confetti

**File**: `kidcreatives-ai/src/lib/microInteractions.ts`

**Implementation**:
```typescript
import confetti from 'canvas-confetti'

/**
 * Create ripple effect at click position
 */
export function createRipple(
  event: React.MouseEvent<HTMLElement>,
  color: string = 'rgba(255, 255, 255, 0.6)'
): void {
  const button = event.currentTarget
  const rect = button.getBoundingClientRect()
  const ripple = document.createElement('span')
  
  const size = Math.max(rect.width, rect.height)
  const x = event.clientX - rect.left - size / 2
  const y = event.clientY - rect.top - size / 2
  
  ripple.style.width = ripple.style.height = `${size}px`
  ripple.style.left = `${x}px`
  ripple.style.top = `${y}px`
  ripple.style.background = color
  ripple.className = 'ripple'
  
  button.appendChild(ripple)
  
  setTimeout(() => ripple.remove(), 600)
}

/**
 * Trigger confetti celebration
 */
export function triggerConfetti(options?: confetti.Options): void {
  const defaults: confetti.Options = {
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  }
  
  confetti({ ...defaults, ...options })
}

/**
 * Trigger phase completion confetti
 */
export function triggerPhaseCompletionConfetti(): void {
  const duration = 3000
  const animationEnd = Date.now() + duration
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  const interval: NodeJS.Timeout = setInterval(() => {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      return clearInterval(interval)
    }

    const particleCount = 50 * (timeLeft / duration)
    
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
    })
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
    })
  }, 250)
}

/**
 * Trigger trophy celebration confetti
 */
export function triggerTrophyConfetti(): void {
  const count = 200
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999
  }

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    })
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  })
  fire(0.2, {
    spread: 60,
  })
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  })
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
  })
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  })
}
```

**Validation**:
```bash
cd kidcreatives-ai && npm run build 2>&1 | grep -i "error"
```

**Expected Output**: No TypeScript errors

---

### Task 3: Create Confetti Hook
**Objective**: Create reusable hook for confetti animations

**File**: `kidcreatives-ai/src/hooks/useConfetti.ts`

**Implementation**:
```typescript
import { useCallback } from 'react'
import { triggerConfetti, triggerPhaseCompletionConfetti, triggerTrophyConfetti } from '@/lib/microInteractions'
import type { Options as ConfettiOptions } from 'canvas-confetti'

export function useConfetti() {
  const celebrate = useCallback((options?: ConfettiOptions) => {
    triggerConfetti(options)
  }, [])

  const celebratePhaseCompletion = useCallback(() => {
    triggerPhaseCompletionConfetti()
  }, [])

  const celebrateTrophy = useCallback(() => {
    triggerTrophyConfetti()
  }, [])

  return {
    celebrate,
    celebratePhaseCompletion,
    celebrateTrophy
  }
}
```

**Validation**:
```bash
cd kidcreatives-ai && npm run build 2>&1 | grep -i "error"
```

**Expected Output**: No TypeScript errors

---

### Task 4: Add Ripple CSS Animation
**Objective**: Add CSS for ripple effect animation

**File**: `kidcreatives-ai/src/index.css`

**Implementation**: Append to end of file:
```css
/* Ripple Effect */
.ripple {
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  animation: ripple-animation 600ms ease-out;
  pointer-events: none;
}

@keyframes ripple-animation {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

/* Ensure buttons have relative positioning for ripple */
button {
  position: relative;
  overflow: hidden;
}
```

**Validation**:
```bash
cd kidcreatives-ai && npm run dev
# Visually check that dev server starts without CSS errors
```

**Expected Output**: Dev server starts successfully

---

### Task 5: Update HandshakePhase with Glassmorphism
**Objective**: Replace white cards with glass effect in HandshakePhase

**File**: `kidcreatives-ai/src/components/phases/HandshakePhase.tsx`

**Changes**:
1. Find all instances of `bg-white rounded-lg shadow-lg p-6`
2. Replace with `bg-white/80 backdrop-blur-md rounded-lg shadow-xl border border-white/20 p-6`
3. Update image container: `bg-gray-100` → `bg-white/50 backdrop-blur-sm`

**Specific Line Changes**:
- Line ~120: Image upload card
- Line ~160: Intent input card
- Line ~190: Sparky response card

**Validation**:
```bash
cd kidcreatives-ai && npm run build 2>&1 | grep -i "error"
```

**Expected Output**: No TypeScript errors

---

### Task 6: Update PromptBuilderPhase with Glassmorphism
**Objective**: Replace white cards with glass effect in PromptBuilderPhase

**File**: `kidcreatives-ai/src/components/phases/PromptBuilderPhase.tsx`

**Changes**:
1. Find question card: `bg-white rounded-lg shadow-lg p-6`
2. Replace with `bg-white/80 backdrop-blur-md rounded-lg shadow-xl border border-white/20 p-6`
3. Update code block containers if present

**Specific Line Changes**:
- Line ~180: Question card container
- Line ~220: Answer input card

**Validation**:
```bash
cd kidcreatives-ai && npm run build 2>&1 | grep -i "error"
```

**Expected Output**: No TypeScript errors

---

### Task 7: Update GenerationPhase with Glassmorphism
**Objective**: Replace white cards with glass effect in GenerationPhase

**File**: `kidcreatives-ai/src/components/phases/GenerationPhase.tsx`

**Changes**:
1. Find loading card: `bg-white rounded-lg shadow-lg p-8`
2. Replace with `bg-white/80 backdrop-blur-md rounded-lg shadow-xl border border-white/20 p-8`
3. Update result display cards

**Specific Line Changes**:
- Line ~150: Loading state card
- Line ~200: Result display cards

**Validation**:
```bash
cd kidcreatives-ai && npm run build 2>&1 | grep -i "error"
```

**Expected Output**: No TypeScript errors

---

### Task 8: Update RefinementPhase with Glassmorphism
**Objective**: Replace white cards with glass effect in RefinementPhase

**File**: `kidcreatives-ai/src/components/phases/RefinementPhase.tsx`

**Changes**:
1. Find chat message cards: `bg-white rounded-lg p-4`
2. Replace with `bg-white/80 backdrop-blur-md rounded-lg border border-white/20 p-4`
3. Update input container

**Specific Line Changes**:
- Line ~150: Chat message containers
- Line ~200: Input card

**Validation**:
```bash
cd kidcreatives-ai && npm run build 2>&1 | grep -i "error"
```

**Expected Output**: No TypeScript errors

---

### Task 9: Update TrophyPhase with Glassmorphism
**Objective**: Replace white cards with glass effect in TrophyPhase

**File**: `kidcreatives-ai/src/components/phases/TrophyPhase.tsx`

**Changes**:
1. Find save options card: `bg-white rounded-lg shadow-lg p-6`
2. Replace with `bg-white/80 backdrop-blur-md rounded-lg shadow-xl border border-white/20 p-6`

**Specific Line Changes**:
- Line ~450: Save options card

**Validation**:
```bash
cd kidcreatives-ai && npm run build 2>&1 | grep -i "error"
```

**Expected Output**: No TypeScript errors

---

### Task 10: Install and Configure react-layout-masonry
**Objective**: Set up masonry layout library

**Steps**:
1. Verify installation from Task 1
2. Read react-layout-masonry documentation
3. Plan integration with Framer Motion

**Validation**:
```bash
cd kidcreatives-ai && npm list react-layout-masonry
```

**Expected Output**: Package listed with version number

---

### Task 11: Update GalleryView with Masonry Layout
**Objective**: Replace CSS Grid with Masonry layout

**File**: `kidcreatives-ai/src/components/gallery/GalleryView.tsx`

**Changes**:
1. Import Masonry from react-layout-masonry
2. Replace grid div with Masonry component
3. Maintain Framer Motion animations
4. Configure responsive breakpoints

**Implementation**:
```typescript
import Masonry from 'react-layout-masonry'

// Replace grid div (around line 125) with:
<Masonry
  columns={{ 640: 1, 768: 2, 1024: 3 }}
  gap={24}
  className="w-full"
>
  {items.map((item, index) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <GalleryCard
        item={item}
        onDelete={handleDelete}
        onViewDetails={handleViewDetails}
      />
    </motion.div>
  ))}
</Masonry>
```

**Validation**:
```bash
cd kidcreatives-ai && npm run build 2>&1 | grep -i "error"
```

**Expected Output**: No TypeScript errors

---

### Task 12: Update GalleryCard for Variable Heights
**Objective**: Remove fixed aspect ratio to allow masonry layout

**File**: `kidcreatives-ai/src/components/gallery/GalleryCard.tsx`

**Changes**:
1. Find thumbnail container: `aspect-square`
2. Replace with `min-h-[200px]` to allow variable heights
3. Maintain object-cover for images

**Specific Line Changes**:
- Line ~40: Thumbnail container div

**Implementation**:
```typescript
// Change from:
<div className="relative aspect-square bg-system-grey/10">

// To:
<div className="relative min-h-[200px] bg-system-grey/10">
```

**Validation**:
```bash
cd kidcreatives-ai && npm run build 2>&1 | grep -i "error"
```

**Expected Output**: No TypeScript errors

---

### Task 13: Create RippleButton Component
**Objective**: Create button component with ripple effect

**File**: `kidcreatives-ai/src/components/ui/RippleButton.tsx`

**Implementation**:
```typescript
import { motion } from 'framer-motion'
import { createRipple } from '@/lib/microInteractions'
import { cn } from '@/lib/utils'

interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'gradient-blue' | 'gradient-green'
  rippleColor?: string
}

export function RippleButton({
  children,
  variant = 'primary',
  rippleColor,
  className,
  onClick,
  ...props
}: RippleButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(e, rippleColor)
    onClick?.(e)
  }

  const variantClasses = {
    primary: 'bg-subject-blue hover:bg-subject-blue-600 text-white',
    secondary: 'bg-white hover:bg-gray-50 text-subject-blue border-2 border-subject-blue',
    'gradient-blue': 'bg-gradient-to-r from-subject-blue to-subject-blue-600 text-white shadow-blue',
    'gradient-green': 'bg-gradient-to-r from-action-green to-action-green-600 text-white shadow-green'
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className={cn(
        'relative overflow-hidden px-6 py-3 rounded-lg font-semibold transition-all duration-300',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  )
}
```

**Validation**:
```bash
cd kidcreatives-ai && npm run build 2>&1 | grep -i "error"
```

**Expected Output**: No TypeScript errors

---

### Task 14: Export RippleButton from UI Index
**Objective**: Make RippleButton available for import

**File**: `kidcreatives-ai/src/components/ui/index.ts`

**Changes**: Add export line:
```typescript
export { RippleButton } from './RippleButton'
```

**Validation**:
```bash
cd kidcreatives-ai && npm run build 2>&1 | grep -i "error"
```

**Expected Output**: No TypeScript errors

---

### Task 15: Add Confetti to PromptBuilderPhase Completion
**Objective**: Trigger confetti when all questions answered

**File**: `kidcreatives-ai/src/components/phases/PromptBuilderPhase.tsx`

**Changes**:
1. Import useConfetti hook
2. Call celebratePhaseCompletion when handleNext is called

**Implementation**:
```typescript
import { useConfetti } from '@/hooks/useConfetti'

// Inside component:
const { celebratePhaseCompletion } = useConfetti()

const handleNext = () => {
  celebratePhaseCompletion()
  onNext(JSON.stringify(promptState))
}
```

**Validation**:
```bash
cd kidcreatives-ai && npm run build 2>&1 | grep -i "error"
```

**Expected Output**: No TypeScript errors

---

### Task 16: Add Confetti to TrophyPhase
**Objective**: Trigger trophy confetti on phase load

**File**: `kidcreatives-ai/src/components/phases/TrophyPhase.tsx`

**Changes**:
1. Import useConfetti hook
2. Call celebrateTrophy in useEffect on mount

**Implementation**:
```typescript
import { useConfetti } from '@/hooks/useConfetti'

// Inside component:
const { celebrateTrophy } = useConfetti()

useEffect(() => {
  celebrateTrophy()
}, [celebrateTrophy])
```

**Validation**:
```bash
cd kidcreatives-ai && npm run build 2>&1 | grep -i "error"
```

**Expected Output**: No TypeScript errors

---

### Task 17: Replace Buttons with RippleButton in HandshakePhase
**Objective**: Add ripple effect to action buttons

**File**: `kidcreatives-ai/src/components/phases/HandshakePhase.tsx`

**Changes**:
1. Import RippleButton
2. Replace Button with RippleButton for "Analyze" button

**Implementation**:
```typescript
import { RippleButton } from '@/components/ui'

// Replace Button with:
<RippleButton
  variant="gradient-blue"
  onClick={handleAnalyze}
  disabled={!image || !intentStatement.trim() || isAnalyzing}
>
  {isAnalyzing ? 'Analyzing...' : 'Analyze My Drawing'}
</RippleButton>
```

**Validation**:
```bash
cd kidcreatives-ai && npm run build 2>&1 | grep -i "error"
```

**Expected Output**: No TypeScript errors

---

### Task 18: Replace Buttons with RippleButton in PromptBuilderPhase
**Objective**: Add ripple effect to submit and next buttons

**File**: `kidcreatives-ai/src/components/phases/PromptBuilderPhase.tsx`

**Changes**:
1. Import RippleButton
2. Replace Button with RippleButton for submit and next buttons

**Validation**:
```bash
cd kidcreatives-ai && npm run build 2>&1 | grep -i "error"
```

**Expected Output**: No TypeScript errors

---

### Task 19: Replace Buttons with RippleButton in TrophyPhase
**Objective**: Add ripple effect to save and download buttons

**File**: `kidcreatives-ai/src/components/phases/TrophyPhase.tsx`

**Changes**:
1. Import RippleButton
2. Replace Button with RippleButton for all action buttons

**Validation**:
```bash
cd kidcreatives-ai && npm run build 2>&1 | grep -i "error"
```

**Expected Output**: No TypeScript errors

---

### Task 20: Add Reduced Motion Support for Confetti
**Objective**: Respect user's reduced motion preferences

**File**: `kidcreatives-ai/src/lib/microInteractions.ts`

**Changes**: Update confetti functions to check prefers-reduced-motion:
```typescript
function shouldReduceMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function triggerConfetti(options?: confetti.Options): void {
  if (shouldReduceMotion()) return
  
  const defaults: confetti.Options = {
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  }
  
  confetti({ ...defaults, ...options })
}

// Apply same check to other confetti functions
```

**Validation**:
```bash
cd kidcreatives-ai && npm run build 2>&1 | grep -i "error"
```

**Expected Output**: No TypeScript errors

---

## VALIDATION COMMANDS

Run these commands after completing all tasks:

### Build Validation
```bash
cd kidcreatives-ai && npm run build
```
**Expected**: Clean build with no errors

### Lint Validation
```bash
cd kidcreatives-ai && npm run lint
```
**Expected**: No linting errors

### Dev Server Test
```bash
cd kidcreatives-ai && npm run dev
```
**Expected**: Server starts on http://localhost:5173

### Visual Testing Checklist
1. **Glassmorphism**: All phase cards have frosted glass effect
2. **Masonry Gallery**: Gallery items display in Pinterest-style layout
3. **Ripple Effects**: Buttons show ripple animation on click
4. **Confetti**: Confetti appears on phase completion and trophy display
5. **Reduced Motion**: Animations respect prefers-reduced-motion setting

### Bundle Size Check
```bash
cd kidcreatives-ai && npm run build && du -sh dist
```
**Expected**: Total bundle < 500KB gzipped (target from design system)

---

## ACCEPTANCE CRITERIA

### Glassmorphism Cards
- [ ] All 5 phase components use glass effect cards
- [ ] Cards have backdrop-blur-md and semi-transparent backgrounds
- [ ] Text remains readable on glass cards (contrast check)
- [ ] Glass effect works on all background variants

### Masonry Gallery
- [ ] Gallery uses react-layout-masonry instead of CSS Grid
- [ ] Items display in staggered, dynamic layout
- [ ] Responsive breakpoints work (1 col mobile, 2 tablet, 3 desktop)
- [ ] Framer Motion animations still work with masonry
- [ ] No layout shift or jank during load

### Micro-Interactions
- [ ] Buttons show ripple effect on click
- [ ] Ripple originates from click position
- [ ] Confetti triggers on PromptBuilder completion
- [ ] Trophy confetti triggers on TrophyPhase load
- [ ] All animations respect prefers-reduced-motion
- [ ] No performance degradation (60fps maintained)

### Code Quality
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] All new components follow naming conventions
- [ ] Utilities are properly typed
- [ ] Hooks follow React best practices

### Performance
- [ ] Bundle size stays under 500KB gzipped
- [ ] No memory leaks from confetti animations
- [ ] Smooth 60fps animations
- [ ] Fast initial load time (<2s)

---

## NOTES

### Implementation Order Rationale
1. **Foundation First**: Install dependencies and create utilities before using them
2. **Glassmorphism Next**: Visual enhancement that doesn't break existing functionality
3. **Masonry After**: Layout change that requires glassmorphism to look good
4. **Micro-Interactions Last**: Delightful additions that enhance completed features

### Potential Challenges
1. **Glassmorphism Browser Support**: backdrop-filter not supported in older browsers
   - **Solution**: Provide fallback with solid background
2. **Masonry Layout Shift**: Items may shift during image load
   - **Solution**: Use min-height on cards to reserve space
3. **Confetti Performance**: Too many particles can cause lag
   - **Solution**: Limit particle count and duration
4. **Ripple Cleanup**: Ripple elements may accumulate in DOM
   - **Solution**: Remove ripple elements after animation completes

### Testing Strategy
1. **Visual Testing**: Use agent-browser to capture screenshots before/after
2. **Performance Testing**: Monitor FPS during animations
3. **Accessibility Testing**: Test with reduced motion enabled
4. **Cross-Browser Testing**: Test in Chrome, Firefox, Safari

### Rollback Plan
If issues arise:
1. **Glassmorphism**: Revert to solid white backgrounds
2. **Masonry**: Revert to CSS Grid layout
3. **Confetti**: Remove confetti calls, keep hook for future use
4. **Ripple**: Use standard Button component

---

**Plan Created**: January 29, 2026  
**Estimated Time**: 3-4 hours  
**Complexity**: Medium  
**Risk Level**: Low (all changes are additive, no breaking changes)
