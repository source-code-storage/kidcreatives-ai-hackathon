# Feature: Phase 4 - Refinement with Conversational Editing

The following plan should be complete, but it's important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils, types, and models. Import from the right files etc.

## Feature Description

Phase 4: Refinement enables children to iteratively improve their AI-generated artwork through conversational editing. Instead of regenerating the entire image, the system uses Gemini 2.5 Flash Image's native editing capabilities to make localized changes while preserving character consistency and the overall composition. This phase teaches children that AI can understand and execute specific modifications, reinforcing the "glass box" educational philosophy.

## User Story

As a child aged 7-10
I want to tell the AI what changes I'd like to make to my generated artwork
So that I can perfect my creation through conversation without starting over

## Problem Statement

After Phase 3 generates an AI-enhanced image, children often want to make adjustments:
- Add missing elements ("Add a planet in the background")
- Change colors or textures ("Make the robot's eyes glow blue")
- Modify poses or expressions ("Make the cat look happier")
- Remove unwanted elements ("Remove the tree on the left")

Traditional image generation requires starting over with a new prompt, losing the original result. This is frustrating for children and doesn't teach them about iterative refinement. Phase 4 solves this by enabling conversational editing where children can request specific changes and see them applied locally while maintaining consistency.

## Solution Statement

Implement a conversational editing interface that:
1. Displays the current generated image prominently
2. Provides a chat-like interface where Sparky asks "What would you like to change?"
3. Accepts natural language edit requests from the child
4. Uses Gemini 2.5 Flash Image's editing API to apply localized changes
5. Shows before/after comparison with smooth animations
6. Maintains edit history so children can see their refinement journey
7. Allows multiple iterations until the child is satisfied
8. Transitions to Phase 5 (Trophy) when finalized

## Feature Metadata

**Feature Type**: New Capability  
**Estimated Complexity**: High  
**Primary Systems Affected**: 
- Phase components (new RefinementPhase.tsx)
- Gemini API integration (new editImage function)
- State management (App.tsx phase data flow)
- UI components (new EditHistory, ImageComparison)

**Dependencies**: 
- Gemini 2.5 Flash Image API (editing mode)
- Framer Motion (animations)
- Existing phase patterns (HandshakePhase, PromptBuilderPhase, GenerationPhase)

---

## CONTEXT REFERENCES

### Relevant Codebase Files IMPORTANT: YOU MUST READ THESE FILES BEFORE IMPLEMENTING!

- `kidcreatives-ai/src/components/phases/GenerationPhase.tsx` (lines 1-233) - Why: Phase component pattern, side-by-side image display, navigation structure
- `kidcreatives-ai/src/lib/gemini/imageClient.ts` (lines 1-115) - Why: Gemini Image API pattern, error handling, response parsing
- `kidcreatives-ai/src/hooks/useGeminiImage.ts` (lines 1-47) - Why: Custom hook pattern for async image operations
- `kidcreatives-ai/src/components/ui/Sparky.tsx` - Why: AI coach component with reactive states
- `kidcreatives-ai/src/App.tsx` (lines 1-110) - Why: Phase data flow, state management, phase transitions
- `kidcreatives-ai/src/types/PhaseTypes.ts` (lines 1-40) - Why: Phase state interfaces, need to add RefinementState
- `kidcreatives-ai/src/types/GeminiTypes.ts` (lines 1-80) - Why: API type definitions, need to add ImageEditResult

### New Files to Create

- `kidcreatives-ai/src/lib/gemini/editClient.ts` - Gemini image editing API wrapper
- `kidcreatives-ai/src/hooks/useGeminiEdit.ts` - Custom hook for conversational editing
- `kidcreatives-ai/src/components/phases/RefinementPhase.tsx` - Main Phase 4 component
- `kidcreatives-ai/src/components/ui/EditHistory.tsx` - Visual edit history timeline
- `kidcreatives-ai/src/components/ui/ImageComparison.tsx` - Before/after image comparison with slider

### Relevant Documentation YOU SHOULD READ THESE BEFORE IMPLEMENTING!

- [Gemini 2.5 Flash Image Conversational Editing](https://www.datacamp.com/tutorial/gemini-2-5-flash-image-guide#conversational-editing)
  - Specific section: "Conversational editing: Edit images with simple, natural language instructions"
  - Why: Shows how to pass existing image + edit prompt to Gemini API
  
- [Gemini Image Editing API Examples](https://www.datacamp.com/tutorial/gemini-image-editing)
  - Specific section: Multi-turn editing with context preservation
  - Why: Demonstrates maintaining character consistency across edits

- [Framer Motion AnimatePresence](https://www.framer.com/motion/animate-presence/)
  - Specific section: Exit animations and layout transitions
  - Why: Needed for smooth before/after image transitions

### Patterns to Follow

**API Client Pattern** (from `imageClient.ts`):
```typescript
export async function generateImage(prompt: string): Promise<ImageGenerationResult> {
  try {
    const sanitizedPrompt = sanitizePrompt(prompt)
    const requestBody = {
      contents: [{
        parts: [{ text: sanitizedPrompt }]
      }]
    }
    const response = await fetch(GEMINI_IMAGE_ENDPOINT, { /* ... */ })
    // Validate response structure
    // Extract image data
    return { imageBytes, mimeType, prompt }
  } catch (error) {
    // Comprehensive error handling
  }
}
```

**Custom Hook Pattern** (from `useGeminiImage.ts`):
```typescript
export function useGeminiImage(): UseGeminiImageReturn {
  const [generatedImage, setGeneratedImage] = useState<ImageGenerationResult | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generate = useCallback(async (prompt: string) => {
    setIsGenerating(true)
    setError(null)
    try {
      const result = await generateImage(prompt)
      setGeneratedImage(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setIsGenerating(false)
    }
  }, [])

  return { generatedImage, isGenerating, error, generate, reset }
}
```

**Phase Component Pattern** (from `GenerationPhase.tsx`):
```typescript
interface GenerationPhaseProps {
  originalImage: string
  imageMimeType: string
  promptStateJSON: string
  onBack: () => void
  onNext: (generatedImageBase64: string) => void
}

export function GenerationPhase({ originalImage, onBack, onNext }: GenerationPhaseProps) {
  const [sparkyMessage, setSparkyMessage] = useState('')
  const { generatedImage, isGenerating, error, generate } = useGeminiImage()

  // Auto-trigger generation on mount
  useEffect(() => { /* ... */ }, [])

  // Update Sparky based on state
  useEffect(() => {
    if (isGenerating) setSparkyMessage("Creating...")
    else if (error) setSparkyMessage("Oops! Let's try again")
    else if (generatedImage) setSparkyMessage("Ta-da! Amazing!")
  }, [isGenerating, error, generatedImage])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <Sparky state={isGenerating ? 'thinking' : error ? 'waiting' : 'success'} message={sparkyMessage} />
      {/* Main content */}
      <div className="flex justify-between">
        <Button onClick={onBack}>Back</Button>
        <Button onClick={handleNext} disabled={!generatedImage}>Next</Button>
      </div>
    </div>
  )
}
```

**Error Handling Pattern**:
```typescript
function sanitizeInput(input: string): string {
  return input
    .replace(/ignore previous instructions/gi, '')
    .replace(/system:/gi, '')
    .replace(/assistant:/gi, '')
    .trim()
}
```

**Naming Conventions**:
- Components: PascalCase (`RefinementPhase`, `EditHistory`)
- Hooks: camelCase with `use` prefix (`useGeminiEdit`)
- API clients: camelCase (`editImage`, `editClient.ts`)
- Types: PascalCase interfaces (`ImageEditResult`, `EditHistoryEntry`)

---

## IMPLEMENTATION PLAN

### Phase 1: Foundation (Types & API Client)

Set up the foundational types and API client for image editing before building UI components.

**Tasks:**
- Define TypeScript interfaces for edit operations
- Create Gemini editing API client
- Implement edit history data structures
- Add validation and sanitization

### Phase 2: Core Editing Hook

Build the custom React hook that manages editing state and API calls.

**Tasks:**
- Create `useGeminiEdit` hook following existing hook patterns
- Implement edit history management
- Add undo/redo functionality (optional for MVP)
- Handle loading and error states

### Phase 3: UI Components

Build reusable UI components for the refinement interface.

**Tasks:**
- Create `EditHistory` component for visual timeline
- Create `ImageComparison` component for before/after display
- Add edit input with character limit
- Implement smooth animations with Framer Motion

### Phase 4: Main Phase Component

Assemble all pieces into the RefinementPhase component.

**Tasks:**
- Create `RefinementPhase.tsx` following phase pattern
- Integrate editing hook and UI components
- Add Sparky conversational guidance
- Implement phase navigation

### Phase 5: App Integration

Connect Phase 4 to the app's phase flow.

**Tasks:**
- Update `App.tsx` phase data management
- Add Phase 4 routing and validation
- Update `PhaseTypes.ts` with RefinementState
- Test full Phase 3 → Phase 4 → Phase 5 flow

### Phase 6: Testing & Polish

Validate functionality and add educational polish.

**Tasks:**
- Test conversational editing with various prompts
- Verify character consistency across edits
- Add loading states and error recovery
- Polish animations and transitions

---

## STEP-BY-STEP TASKS

IMPORTANT: Execute every task in order, top to bottom. Each task is atomic and independently testable.

### Task 1: UPDATE types/GeminiTypes.ts

- **IMPLEMENT**: Add ImageEditResult interface and edit-specific types
- **PATTERN**: Mirror ImageGenerationResult structure from lines 60-70
- **IMPORTS**: None needed (type definitions only)
- **GOTCHA**: Keep consistent with existing ImageGenerationResult structure
- **VALIDATE**: `npm run build` (TypeScript compilation)

```typescript
// Add after ImageGenerationResult interface (around line 70)

/**
 * Result from Gemini image editing operation
 */
export interface ImageEditResult {
  imageBytes: string // base64 encoded PNG
  mimeType: string // 'image/png'
  editPrompt: string // The edit instruction used
  originalImage: string // base64 of image that was edited
}

/**
 * Edit history entry for tracking refinement iterations
 */
export interface EditHistoryEntry {
  id: string // unique identifier
  editPrompt: string // what the child asked for
  resultImage: string // base64 of edited image
  timestamp: number // when edit was made
  sparkyResponse: string // Sparky's comment on the edit
}
```

### Task 2: UPDATE types/PhaseTypes.ts

- **IMPLEMENT**: Add RefinementState interface
- **PATTERN**: Mirror GenerationState structure from lines 35-40
- **IMPORTS**: Import ImageEditResult from './GeminiTypes'
- **GOTCHA**: Include edit history array for tracking iterations
- **VALIDATE**: `npm run build`

```typescript
// Add after GenerationState interface (around line 40)

import type { ImageEditResult, EditHistoryEntry } from './GeminiTypes'

export interface RefinementState {
  currentImage: string | null // base64 of current version
  editHistory: EditHistoryEntry[] // all edits made
  isEditing: boolean // loading state
  error: string | null // error message
  editCount: number // number of refinements made
}
```

### Task 3: CREATE lib/gemini/editClient.ts

- **IMPLEMENT**: Gemini image editing API client
- **PATTERN**: Mirror imageClient.ts structure (lines 1-115)
- **IMPORTS**: `import type { ImageEditResult } from '@/types/GeminiTypes'`
- **GOTCHA**: Gemini editing requires passing BOTH the existing image AND the edit prompt in the same request
- **VALIDATE**: `npm run build && npm run lint`

```typescript
import type { ImageEditResult } from '@/types/GeminiTypes'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

if (!API_KEY) {
  throw new Error('VITE_GEMINI_API_KEY is required but not set in environment variables')
}

const GEMINI_IMAGE_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent'

/**
 * Sanitize edit prompt to prevent injection attacks
 */
function sanitizeEditPrompt(prompt: string): string {
  return prompt
    .replace(/ignore previous instructions/gi, '')
    .replace(/system:/gi, '')
    .replace(/assistant:/gi, '')
    .replace(/user:/gi, '')
    .trim()
}

/**
 * Edit an existing image using Gemini 2.5 Flash Image
 * 
 * @param imageBase64 - Base64 encoded image to edit (without data URL prefix)
 * @param imageMimeType - MIME type of the image (e.g., 'image/png')
 * @param editPrompt - Natural language description of desired changes
 * @returns ImageEditResult with edited image
 */
export async function editImage(
  imageBase64: string,
  imageMimeType: string,
  editPrompt: string
): Promise<ImageEditResult> {
  try {
    const sanitizedPrompt = sanitizeEditPrompt(editPrompt)

    // Gemini editing: pass image + text instruction together
    const requestBody = {
      contents: [{
        parts: [
          {
            inline_data: {
              mime_type: imageMimeType,
              data: imageBase64
            }
          },
          {
            text: sanitizedPrompt
          }
        ]
      }]
    }

    const response = await fetch(GEMINI_IMAGE_ENDPOINT, {
      method: 'POST',
      headers: {
        'x-goog-api-key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      let errorMessage = `Gemini API error (${response.status})`
      try {
        const errorData = await response.json()
        errorMessage += `: ${errorData.error?.message || JSON.stringify(errorData)}`
      } catch {
        const errorText = await response.text()
        errorMessage += `: ${errorText}`
      }
      throw new Error(errorMessage)
    }

    const data = await response.json()

    // Validate response structure
    if (!data.candidates || !Array.isArray(data.candidates) || data.candidates.length === 0) {
      throw new Error('No candidates in API response')
    }

    const candidate = data.candidates[0]
    if (!candidate.content || !candidate.content.parts) {
      throw new Error('Invalid candidate structure in API response')
    }

    // Find the inline image data in parts
    interface ImagePart {
      inlineData?: {
        data: string
        mimeType: string
      }
    }
    
    const imagePart = candidate.content.parts.find((part: ImagePart) => part.inlineData)
    if (!imagePart?.inlineData?.data) {
      throw new Error('No image data in API response')
    }

    return {
      imageBytes: imagePart.inlineData.data,
      mimeType: imagePart.inlineData.mimeType || 'image/png',
      editPrompt: sanitizedPrompt,
      originalImage: imageBase64
    }
  } catch (error) {
    console.error('Gemini Image Edit API error:', error)
    throw new Error(
      error instanceof Error
        ? `Image editing failed: ${error.message}`
        : 'Image editing failed: Unknown error'
    )
  }
}

/**
 * Convert base64 image bytes to data URL for display
 * (Re-exported from imageClient for convenience)
 */
export function imageToDataURL(imageBytes: string, mimeType: string): string {
  return `data:${mimeType};base64,${imageBytes}`
}
```


### Task 4: CREATE hooks/useGeminiEdit.ts

- **IMPLEMENT**: Custom hook for managing edit operations and history
- **PATTERN**: Mirror useGeminiImage.ts structure (lines 1-47)
- **IMPORTS**: `import { useState, useCallback } from 'react'`, `import { editImage } from '@/lib/gemini/editClient'`, `import type { ImageEditResult, EditHistoryEntry } from '@/types/GeminiTypes'`
- **GOTCHA**: Generate unique IDs for history entries using `Date.now() + Math.random()`
- **VALIDATE**: `npm run build && npm run lint`

```typescript
import { useState, useCallback } from 'react'
import { editImage } from '@/lib/gemini/editClient'
import type { ImageEditResult, EditHistoryEntry } from '@/types/GeminiTypes'

interface UseGeminiEditReturn {
  currentImage: string | null // base64 of current version
  editHistory: EditHistoryEntry[]
  isEditing: boolean
  error: string | null
  edit: (imageBase64: string, imageMimeType: string, editPrompt: string, sparkyResponse: string) => Promise<void>
  reset: () => void
  editCount: number
}

export function useGeminiEdit(): UseGeminiEditReturn {
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [editHistory, setEditHistory] = useState<EditHistoryEntry[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const edit = useCallback(async (
    imageBase64: string,
    imageMimeType: string,
    editPrompt: string,
    sparkyResponse: string
  ) => {
    setIsEditing(true)
    setError(null)

    try {
      const result = await editImage(imageBase64, imageMimeType, editPrompt)
      
      // Create history entry
      const historyEntry: EditHistoryEntry = {
        id: `edit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        editPrompt,
        resultImage: result.imageBytes,
        timestamp: Date.now(),
        sparkyResponse
      }

      setCurrentImage(result.imageBytes)
      setEditHistory(prev => [...prev, historyEntry])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Image editing failed'
      setError(errorMessage)
      console.error('Image editing error:', err)
    } finally {
      setIsEditing(false)
    }
  }, [])

  const reset = useCallback(() => {
    setCurrentImage(null)
    setEditHistory([])
    setError(null)
    setIsEditing(false)
  }, [])

  return {
    currentImage,
    editHistory,
    isEditing,
    error,
    edit,
    reset,
    editCount: editHistory.length
  }
}
```

### Task 5: CREATE components/ui/EditHistory.tsx

- **IMPLEMENT**: Visual timeline of edit history with animated entries
- **PATTERN**: Use Framer Motion stagger animations like CodeBlock.tsx
- **IMPORTS**: `import { motion } from 'framer-motion'`, `import type { EditHistoryEntry } from '@/types/GeminiTypes'`
- **GOTCHA**: Show most recent edit at the top, reverse array order
- **VALIDATE**: `npm run build && npm run lint`

```typescript
import { motion } from 'framer-motion'
import type { EditHistoryEntry } from '@/types/GeminiTypes'

interface EditHistoryProps {
  history: EditHistoryEntry[]
  className?: string
}

export function EditHistory({ history, className = '' }: EditHistoryProps) {
  if (history.length === 0) {
    return null
  }

  // Show most recent first
  const reversedHistory = [...history].reverse()

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Your Refinement Journey ({history.length} {history.length === 1 ? 'edit' : 'edits'})
      </h3>
      
      <div className="space-y-2">
        {reversedHistory.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-variable-purple"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-variable-purple text-white rounded-full flex items-center justify-center font-bold">
                {history.length - index}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  "{entry.editPrompt}"
                </p>
                <p className="text-xs text-gray-600 italic">
                  {entry.sparkyResponse}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
```

### Task 6: CREATE components/ui/ImageComparison.tsx

- **IMPLEMENT**: Before/after image comparison with smooth transitions
- **PATTERN**: Use AnimatePresence from Framer Motion like GenerationPhase.tsx (lines 140-180)
- **IMPORTS**: `import { motion, AnimatePresence } from 'framer-motion'`, `import { useMemo } from 'react'`
- **GOTCHA**: Convert base64 to data URLs for img src
- **VALIDATE**: `npm run build && npm run lint`

```typescript
import { motion, AnimatePresence } from 'framer-motion'
import { useMemo } from 'react'

interface ImageComparisonProps {
  beforeImage: string // base64
  afterImage: string | null // base64
  mimeType: string
  isLoading: boolean
  className?: string
}

export function ImageComparison({
  beforeImage,
  afterImage,
  mimeType,
  isLoading,
  className = ''
}: ImageComparisonProps) {
  const beforeDataURL = useMemo(
    () => `data:${mimeType};base64,${beforeImage}`,
    [beforeImage, mimeType]
  )

  const afterDataURL = useMemo(
    () => afterImage ? `data:${mimeType};base64,${afterImage}` : null,
    [afterImage, mimeType]
  )

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${className}`}>
      {/* Before Image */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Before
        </h3>
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={beforeDataURL}
            alt="Before editing"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* After Image */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          After
        </h3>
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-variable-purple mx-auto mb-4"></div>
                <p className="text-gray-600">Applying your changes...</p>
              </motion.div>
            )}

            {!isLoading && afterDataURL && (
              <motion.img
                key="after"
                src={afterDataURL}
                alt="After editing"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full object-contain"
              />
            )}

            {!isLoading && !afterDataURL && (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-gray-400"
              >
                <p>Your edited version will appear here</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
```

### Task 7: UPDATE components/ui/index.ts

- **IMPLEMENT**: Export new UI components
- **PATTERN**: Add to existing exports
- **IMPORTS**: None (barrel export file)
- **GOTCHA**: Maintain alphabetical order
- **VALIDATE**: `npm run build`

```typescript
// Add these exports to existing file
export { EditHistory } from './EditHistory'
export { ImageComparison } from './ImageComparison'
```

### Task 8: CREATE components/phases/RefinementPhase.tsx

- **IMPLEMENT**: Main Phase 4 component with conversational editing interface
- **PATTERN**: Mirror GenerationPhase.tsx structure (lines 1-233)
- **IMPORTS**: All necessary React, Framer Motion, UI components, and hooks
- **GOTCHA**: Initialize with generatedImage from Phase 3, track current version separately
- **VALIDATE**: `npm run build && npm run lint`

```typescript
import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sparky } from '@/components/ui/Sparky'
import { EditHistory } from '@/components/ui/EditHistory'
import { ImageComparison } from '@/components/ui/ImageComparison'
import { useGeminiEdit } from '@/hooks/useGeminiEdit'

const MAX_EDIT_LENGTH = 150

interface RefinementPhaseProps {
  generatedImage: string // base64 from Phase 3
  imageMimeType: string
  originalImage: string // base64 of original sketch
  onBack: () => void
  onNext: (finalImageBase64: string) => void
}

export function RefinementPhase({
  generatedImage,
  imageMimeType,
  originalImage,
  onBack,
  onNext
}: RefinementPhaseProps) {
  const [editPrompt, setEditPrompt] = useState('')
  const [sparkyMessage, setSparkyMessage] = useState('')
  const [beforeImage, setBeforeImage] = useState(generatedImage)
  
  const { currentImage, editHistory, isEditing, error, edit, editCount } = useGeminiEdit()

  // Initialize Sparky message
  useEffect(() => {
    setSparkyMessage(
      "Your artwork looks amazing! Want to make any changes? Tell me what you'd like to adjust!"
    )
  }, [])

  // Update Sparky message based on editing state
  useEffect(() => {
    if (isEditing) {
      setSparkyMessage("I'm making those changes for you! Just a moment...")
    } else if (error) {
      setSparkyMessage("Hmm, that didn't work. Can you try describing the change differently?")
    } else if (editCount > 0) {
      const encouragement = [
        "Great change! Want to adjust anything else?",
        "Looking better! Any other tweaks?",
        "Nice! What else would you like to change?",
        "Perfect! Ready to finalize, or want more changes?"
      ]
      setSparkyMessage(encouragement[Math.min(editCount - 1, encouragement.length - 1)])
    }
  }, [isEditing, error, editCount])

  const handleEditPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    if (value.length <= MAX_EDIT_LENGTH) {
      setEditPrompt(value)
    }
  }

  const handleSubmitEdit = async () => {
    if (!editPrompt.trim() || isEditing) return

    // Use current image if exists, otherwise use generated image
    const imageToEdit = currentImage || generatedImage
    
    // Generate Sparky response for history
    const sparkyResponses = [
      "Great idea! Let me adjust that.",
      "I can do that! Watch this.",
      "Perfect! Making that change now.",
      "Nice thinking! Here we go."
    ]
    const sparkyResponse = sparkyResponses[Math.floor(Math.random() * sparkyResponses.length)]

    // Update before image for comparison
    setBeforeImage(imageToEdit)

    await edit(imageToEdit, imageMimeType, editPrompt, sparkyResponse)
    setEditPrompt('') // Clear input after submission
  }

  const handleFinalize = () => {
    // Use current edited image if exists, otherwise use original generated image
    const finalImage = currentImage || generatedImage
    onNext(finalImage)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmitEdit()
    }
  }

  const canSubmitEdit = editPrompt.trim().length > 0 && !isEditing

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-variable-purple" />
            <h1 className="text-4xl font-bold text-gray-800">
              Phase 4: Perfect Your Creation! ✨
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Tell me what changes you'd like to make
          </p>
        </motion.div>

        {/* Sparky Coach */}
        <Sparky
          state={isEditing ? 'thinking' : error ? 'waiting' : 'success'}
          message={sparkyMessage}
          className="mb-8"
        />

        {/* Before/After Comparison */}
        <ImageComparison
          beforeImage={beforeImage}
          afterImage={currentImage}
          mimeType={imageMimeType}
          isLoading={isEditing}
          className="mb-8"
        />

        {/* Edit Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-8"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            What would you like to change?
          </h3>
          
          <div className="space-y-4">
            <div>
              <textarea
                value={editPrompt}
                onChange={handleEditPromptChange}
                onKeyPress={handleKeyPress}
                placeholder="Example: Make the robot's eyes glow blue, or Add a planet in the background"
                className="w-full h-24 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-variable-purple focus:outline-none resize-none text-gray-800"
                disabled={isEditing}
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-gray-500">
                  {editPrompt.length}/{MAX_EDIT_LENGTH} characters
                </p>
                <Button
                  onClick={handleSubmitEdit}
                  disabled={!canSubmitEdit}
                  className="gap-2 bg-variable-purple hover:bg-purple-600 text-white"
                >
                  Apply Change
                  <Sparkles className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-50 border border-red-200 rounded-lg p-4"
              >
                <p className="text-red-600 text-sm">{error}</p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Edit History */}
        {editHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-lg shadow-lg p-6 mb-8"
          >
            <EditHistory history={editHistory} />
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex justify-between items-center"
        >
          <Button
            onClick={onBack}
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Generation
          </Button>

          <Button
            onClick={handleFinalize}
            disabled={isEditing}
            className="gap-2 bg-action-green hover:bg-green-600 text-white"
          >
            Finalize & Get Trophy
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
```


### Task 9: UPDATE components/phases/index.ts

- **IMPLEMENT**: Export RefinementPhase component
- **PATTERN**: Add to existing exports
- **IMPORTS**: None (barrel export file)
- **GOTCHA**: Maintain consistent export style
- **VALIDATE**: `npm run build`

```typescript
// Add this export to existing file
export { RefinementPhase } from './RefinementPhase'
```

### Task 10: UPDATE App.tsx - Add Phase 4 data to PhaseData interface

- **IMPLEMENT**: Add refinedImage field to PhaseData
- **PATTERN**: Follow existing phaseData structure (lines 7-15)
- **IMPORTS**: Import RefinementPhase component
- **GOTCHA**: Initialize as null, will be populated after Phase 4
- **VALIDATE**: `npm run build`

```typescript
// Update PhaseData interface (around line 7)
interface PhaseData {
  originalImage: string | null
  imageMimeType: string
  intentStatement: string
  visionAnalysis: string | null
  promptStateJSON: string | null
  generatedImage: string | null
  refinedImage: string | null // ADD THIS LINE
}

// Update initial state (around line 18)
const [phaseData, setPhaseData] = useState<PhaseData>({
  originalImage: null,
  imageMimeType: 'image/jpeg',
  intentStatement: '',
  visionAnalysis: null,
  promptStateJSON: null,
  generatedImage: null,
  refinedImage: null // ADD THIS LINE
})
```

### Task 11: UPDATE App.tsx - Add Phase 4 validation useEffect

- **IMPLEMENT**: Add useEffect to redirect if Phase 4 is missing required data
- **PATTERN**: Mirror Phase 3 validation useEffect (lines 36-40)
- **IMPORTS**: None (already imported)
- **GOTCHA**: Check for generatedImage, not refinedImage
- **VALIDATE**: `npm run build`

```typescript
// Add after Phase 3 validation useEffect (around line 40)
// Redirect to Handshake if Phase 4 is missing required data
useEffect(() => {
  if (currentPhase === Phase.Refinement && (!phaseData.originalImage || !phaseData.generatedImage)) {
    setCurrentPhase(Phase.Handshake)
  }
}, [currentPhase, phaseData.originalImage, phaseData.generatedImage])
```

### Task 12: UPDATE App.tsx - Add Phase 4 handlers

- **IMPLEMENT**: Add handleGenerationComplete and handleRefinementBack/Complete handlers
- **PATTERN**: Mirror existing phase handlers (lines 42-70)
- **IMPORTS**: None (already imported)
- **GOTCHA**: GenerationPhase onNext should transition to Refinement, not log to console
- **VALIDATE**: `npm run build`

```typescript
// Update handleGenerationComplete (around line 65)
const handleGenerationComplete = (generatedImageBase64: string) => {
  setPhaseData(prev => ({
    ...prev,
    generatedImage: generatedImageBase64
  }))
  setCurrentPhase(Phase.Refinement) // CHANGE THIS LINE
}

// Add new handlers after handleGenerationComplete
const handleRefinementBack = () => {
  setCurrentPhase(Phase.Generation)
}

const handleRefinementComplete = (refinedImageBase64: string) => {
  setPhaseData(prev => ({
    ...prev,
    refinedImage: refinedImageBase64
  }))
  setCurrentPhase(Phase.Trophy)
}
```

### Task 13: UPDATE App.tsx - Add Phase 4 routing in switch statement

- **IMPLEMENT**: Add Refinement case to phase switch statement
- **PATTERN**: Mirror Generation case structure (lines 72-90)
- **IMPORTS**: Import RefinementPhase at top of file
- **GOTCHA**: Add case BEFORE PromptBuilder case to maintain phase order
- **VALIDATE**: `npm run build && npm run lint`

```typescript
// Add import at top of file (around line 3)
import { RefinementPhase } from '@/components/phases/RefinementPhase'

// Add case in switch statement (after Generation case, around line 90)
switch (currentPhase) {
  case Phase.Refinement:
    if (!phaseData.originalImage || !phaseData.generatedImage) {
      return null // Will redirect via useEffect
    }
    return (
      <RefinementPhase
        generatedImage={phaseData.generatedImage}
        imageMimeType={phaseData.imageMimeType}
        originalImage={phaseData.originalImage}
        onBack={handleRefinementBack}
        onNext={handleRefinementComplete}
      />
    )

  case Phase.Generation:
    // ... existing Generation case
```

### Task 14: REMOVE debug console.log from GenerationPhase

- **IMPLEMENT**: Remove development console.log from handleGenerationComplete
- **PATTERN**: Clean up development code
- **IMPORTS**: None
- **GOTCHA**: This was a TODO comment, now implemented
- **VALIDATE**: `npm run build && npm run lint`

```typescript
// In App.tsx, remove these lines from handleGenerationComplete (around line 68-70)
// DELETE THESE LINES:
// TODO: Transition to Phase.Refinement when implemented
if (import.meta.env.DEV) {
  console.log('Phase 3 complete! Generated image:', generatedImageBase64.substring(0, 50) + '...')
}
```

---

## TESTING STRATEGY

### Unit Tests (Future - Not Required for MVP)

Phase 4 testing will follow the same patterns as Phases 1-3 once the testing infrastructure is fully established with agent-browser.

**Scope:**
- `editClient.ts`: API request/response handling, error cases
- `useGeminiEdit.ts`: State management, history tracking
- `EditHistory.tsx`: Rendering with different history lengths
- `ImageComparison.tsx`: Loading states, image transitions

### Integration Tests (Manual with agent-browser)

**Test Scenarios:**

1. **Basic Edit Flow**
   ```bash
   agent-browser open http://localhost:5173
   # Complete Phases 1-3 first
   agent-browser snapshot -i
   agent-browser fill @edit-input "Make the robot's eyes glow blue"
   agent-browser click @apply-button
   agent-browser wait --text "Great idea"
   agent-browser screenshot phase4-edit-applied.png
   ```

2. **Multiple Edits**
   ```bash
   # After first edit
   agent-browser fill @edit-input "Add a planet in the background"
   agent-browser click @apply-button
   agent-browser wait --text "Looking better"
   agent-browser get count ".edit-history-entry" # Should be 2
   ```

3. **Error Handling**
   ```bash
   # Test with empty input
   agent-browser fill @edit-input ""
   agent-browser is enabled @apply-button # Should be false
   
   # Test with very long input
   agent-browser fill @edit-input "a".repeat(200)
   agent-browser get value @edit-input # Should be truncated to 150
   ```

4. **Phase Navigation**
   ```bash
   agent-browser click @back-button
   agent-browser wait --text "Phase 3" # Should go back to Generation
   
   agent-browser click @next-button
   agent-browser wait --text "Phase 4" # Should return to Refinement
   
   agent-browser click @finalize-button
   agent-browser wait --text "Phase 5" # Should go to Trophy (when implemented)
   ```

### Edge Cases

1. **No Edits Made**: User clicks "Finalize" without making any edits
   - Expected: Should pass generatedImage unchanged to Phase 5
   
2. **API Failure**: Gemini API returns error
   - Expected: Show error message, allow retry, don't lose current image

3. **Rapid Submissions**: User clicks "Apply Change" multiple times quickly
   - Expected: Button disabled during editing, queue not needed (one at a time)

4. **Character Limit**: User types beyond 150 characters
   - Expected: Input stops accepting characters, counter shows 150/150

5. **Empty Edit History**: First time in Phase 4
   - Expected: EditHistory component doesn't render, no errors

---

## VALIDATION COMMANDS

Execute every command to ensure zero regressions and 100% feature correctness.

### Level 1: Syntax & Style

```bash
# TypeScript compilation
npm run build

# ESLint checks
npm run lint

# Type checking only (faster during development)
npx tsc --noEmit
```

### Level 2: Development Server

```bash
# Start dev server
npm run dev

# Verify Phase 4 accessible after Phase 3
# Manual: Complete Phases 1-3, verify Phase 4 loads
```

### Level 3: Component Rendering

```bash
# Check for console errors
# Open browser console, complete workflow, verify no errors

# Verify all UI elements present
agent-browser open http://localhost:5173
# Complete Phases 1-3
agent-browser snapshot -i
# Verify: edit input, apply button, before/after images, Sparky, navigation buttons
```

### Level 4: Functional Testing

```bash
# Test edit submission
agent-browser fill @edit-input "Make the background darker"
agent-browser click @apply-button
agent-browser wait --text "Great idea"

# Test edit history
agent-browser get count ".edit-history-entry"
# Should match number of edits made

# Test character limit
agent-browser fill @edit-input "a".repeat(200)
agent-browser get value @edit-input
# Should be max 150 characters

# Test navigation
agent-browser click @back-button
agent-browser wait --text "Phase 3"
```

### Level 5: API Integration

```bash
# Verify Gemini API calls
# Check Network tab in browser DevTools
# Should see POST to generativelanguage.googleapis.com
# Request should include both image data and edit prompt

# Test error handling
# Temporarily break API key in .env
# Verify error message displays correctly
# Restore API key
```

---

## ACCEPTANCE CRITERIA

- [ ] RefinementPhase component renders after Phase 3 completion
- [ ] Edit input accepts natural language prompts up to 150 characters
- [ ] "Apply Change" button submits edit to Gemini API
- [ ] Before/after image comparison displays correctly
- [ ] Loading state shows during API call
- [ ] Edited image appears in "After" panel with smooth animation
- [ ] Edit history tracks all refinements with timestamps
- [ ] Sparky provides encouraging feedback after each edit
- [ ] Multiple edits can be made sequentially
- [ ] Character consistency maintained across edits
- [ ] Error states display user-friendly messages
- [ ] "Back" button returns to Phase 3 (Generation)
- [ ] "Finalize" button transitions to Phase 5 (Trophy) with final image
- [ ] Phase 4 validates required data (redirects if missing)
- [ ] All TypeScript compilation passes
- [ ] All ESLint checks pass
- [ ] No console errors during normal operation
- [ ] Responsive design works on mobile and desktop

---

## COMPLETION CHECKLIST

- [ ] All 14 tasks completed in order
- [ ] Each task validation passed immediately
- [ ] TypeScript compilation successful (npm run build)
- [ ] ESLint checks passed (npm run lint)
- [ ] Development server runs without errors
- [ ] Phase 3 → Phase 4 transition works
- [ ] Edit submission and API integration functional
- [ ] Before/after comparison displays correctly
- [ ] Edit history tracks refinements
- [ ] Phase 4 → Phase 5 transition works (when Phase 5 implemented)
- [ ] Manual testing confirms feature works end-to-end
- [ ] No regressions in Phases 1-3
- [ ] Code follows project conventions
- [ ] All acceptance criteria met

---

## NOTES

### Design Decisions

1. **Conversational Editing Over Inpainting UI**
   - Rationale: Natural language is more intuitive for 7-10 year olds than selecting regions
   - Trade-off: Less precise control, but better educational experience
   - Aligns with "glass box" philosophy: children learn AI understands language

2. **Sequential Edits (Not Parallel)**
   - Rationale: One edit at a time prevents confusion and maintains clear cause-effect
   - Trade-off: Slower for power users, but better for learning
   - Matches Phase 2 Q&A pattern

3. **Edit History Timeline**
   - Rationale: Shows refinement journey, reinforces iterative improvement concept
   - Educational value: Children see their decision-making process
   - Sparky responses make it conversational, not just a log

4. **Before/After Comparison (Not Slider)**
   - Rationale: Side-by-side is clearer for children than interactive slider
   - Trade-off: Less interactive, but easier to understand
   - Consistent with Phase 3 side-by-side pattern

5. **No Undo/Redo for MVP**
   - Rationale: Adds complexity, not essential for hackathon demo
   - Future enhancement: Could add "Go back to version X" from history
   - Current workaround: Make new edit to reverse changes

### Technical Considerations

1. **Gemini 2.5 Flash Image Editing**
   - Uses same endpoint as generation: `gemini-2.5-flash-image:generateContent`
   - Editing mode triggered by passing image + text together in request
   - Character consistency maintained automatically by model
   - No explicit "inpainting mask" needed - model infers from text

2. **State Management**
   - `currentImage` tracks latest version (starts as generatedImage)
   - `beforeImage` updates before each edit for comparison
   - `editHistory` maintains full refinement timeline
   - App.tsx stores final `refinedImage` for Phase 5

3. **Performance**
   - Each edit is a full API call (~3-5 seconds)
   - No optimistic updates (wait for API response)
   - Images stored as base64 in memory (acceptable for hackathon)
   - Production would use Supabase Storage for persistence

4. **Error Recovery**
   - Failed edits don't lose current image
   - User can retry with different prompt
   - Sparky provides guidance on rephrasing
   - No automatic retry (intentional - teaches prompt refinement)

### Known Limitations

1. **No Multi-Region Editing**
   - Can't select specific areas to edit
   - Relies on Gemini understanding text description
   - Workaround: Be specific in edit prompts ("the robot's left arm")

2. **No Edit Branching**
   - Linear history only, can't branch from earlier version
   - Workaround: Make new edit to reverse changes
   - Future: Could add "Restore version X" feature

3. **Character Limit (150 chars)**
   - Prevents overly complex edit requests
   - Age-appropriate for 7-10 year olds
   - Encourages concise, clear instructions

4. **No Batch Edits**
   - One change at a time
   - Educational benefit: Clear cause-effect relationship
   - Trade-off: Slower for multiple changes

### Integration with Phase 5 (Trophy)

Phase 4 passes `refinedImage` (or `generatedImage` if no edits) to Phase 5:
- Trophy phase will display final artwork
- Edit history could be included in PDF certificate
- Shows "refinement journey" as part of learning proof

### Future Enhancements (Post-Hackathon)

1. **Visual Edit History**
   - Show thumbnail of each version in timeline
   - Click to preview that version
   - "Restore this version" button

2. **Suggested Edits**
   - Sparky suggests common improvements
   - "Want to try: Add more details? Change the lighting?"
   - Educational: Teaches what's possible

3. **Comparison Slider**
   - Interactive before/after slider
   - More engaging for older children
   - Optional alongside side-by-side view

4. **Edit Templates**
   - Pre-written edit prompts for common changes
   - "Make it brighter", "Add a background", "Change colors"
   - Helps children learn effective prompts

5. **Undo/Redo**
   - Navigate through edit history
   - Restore previous versions
   - Branch from any point in history

---

## CONFIDENCE SCORE

**8.5/10** for one-pass implementation success

**Strengths:**
- Clear API pattern from existing imageClient.ts
- Well-established phase component structure
- Comprehensive type definitions
- Detailed task breakdown with code examples

**Risks:**
- Gemini editing API behavior with character consistency (mitigated by research)
- Before/after image state management complexity (mitigated by clear state flow)
- Edit history rendering performance with many edits (unlikely in MVP, max ~5-10 edits)

**Mitigation:**
- Test with real Gemini API early (Task 3)
- Validate state flow with console logs during development
- Start with simple edit prompts, add complexity gradually

---

**Plan Created**: January 29, 2026  
**Estimated Implementation Time**: 2-3 hours  
**Phase Complexity**: High (API integration + conversational UI + state management)  
**Educational Value**: Very High (teaches iterative refinement and AI understanding)
