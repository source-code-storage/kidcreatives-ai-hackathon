# Feature: Phase 3 - Image Generation with Gemini Imagen

The following plan should be complete, but its important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils types and models. Import from the right files etc.

## Feature Description

Implement Phase 3 of the KidCreatives AI workflow: Image Generation. This phase takes the completed `Prompt_State_JSON` from Phase 2, synthesizes it into an optimized narrative prompt, generates an AI-enhanced image using Gemini Imagen API, and displays it side-by-side with the original sketch. The phase emphasizes the educational "reveal moment" where children see how their creative decisions transformed into technical instructions that powered the AI generation.

## User Story

As a child user (aged 7-10)
I want to see my sketch transformed into an AI-enhanced image based on my creative decisions
So that I understand how my answers became instructions that created the final artwork

## Problem Statement

After completing the Socratic Q&A in Phase 2, children have a `Prompt_State_JSON` containing their creative decisions (texture, lighting, mood, background, style). However, this structured data needs to be:
1. Synthesized into a coherent narrative prompt that Imagen can understand
2. Sent to Gemini Imagen API with appropriate configuration
3. Displayed alongside the original sketch to show the transformation
4. Handled gracefully with loading states and error recovery

The challenge is creating a seamless "reveal moment" that maintains engagement while processing the API call (3-5 seconds).

## Solution Statement

Create a `GenerationPhase` component that:
1. Parses the `Prompt_State_JSON` to extract all creative decisions
2. Synthesizes a narrative prompt following best practices (subject + action + variables + context)
3. Calls Gemini Imagen 4.0 API with optimized parameters (1K size, 1:1 aspect ratio, single image)
4. Displays loading animation with Sparky in "thinking" state
5. Shows side-by-side comparison: original sketch (left) vs AI-generated image (right)
6. Provides error handling with retry capability
7. Enables phase transition to Phase 4 (Refinement) with "Next" button

## Feature Metadata

**Feature Type**: New Capability
**Estimated Complexity**: Medium
**Primary Systems Affected**: 
- Phase orchestration (App.tsx)
- Gemini API integration (new imageClient.ts)
- Type system (new GeminiTypes for image generation)
- UI components (new GenerationPhase.tsx)

**Dependencies**: 
- @google/generative-ai ^0.21.0 (already installed)
- Framer Motion 11.0.3 (already installed)
- Existing phase patterns (HandshakePhase, PromptBuilderPhase)

---

## CONTEXT REFERENCES

### Relevant Codebase Files IMPORTANT: YOU MUST READ THESE FILES BEFORE IMPLEMENTING!

- `kidcreatives-ai/src/App.tsx` (lines 1-80) - Why: Phase orchestration pattern, PhaseData interface, phase transition handlers
- `kidcreatives-ai/src/types/PhaseTypes.ts` (lines 1-25) - Why: Phase enum definition, need to add GenerationState interface
- `kidcreatives-ai/src/types/PromptState.ts` (lines 1-50) - Why: PromptStateJSON structure for parsing, PromptVariableEntry interface
- `kidcreatives-ai/src/types/GeminiTypes.ts` - Why: Existing Gemini type patterns, need to add image generation types
- `kidcreatives-ai/src/lib/gemini/visionClient.ts` (lines 1-100) - Why: Gemini API client pattern (error handling, sanitization, API key validation)
- `kidcreatives-ai/src/lib/gemini/textClient.ts` (lines 1-70) - Why: Gemini API client pattern for reference
- `kidcreatives-ai/src/hooks/useGeminiVision.ts` (lines 1-50) - Why: Custom hook pattern for async API calls with loading/error states
- `kidcreatives-ai/src/components/phases/PromptBuilderPhase.tsx` (lines 1-100) - Why: Phase component structure, props pattern, Sparky integration
- `kidcreatives-ai/src/components/ui/Sparky.tsx` (lines 1-75) - Why: Sparky component usage (waiting/thinking/success states)
- `kidcreatives-ai/src/components/shared/ImageUpload.tsx` (lines 1-50) - Why: Image display patterns, base64 handling

### New Files to Create

- `kidcreatives-ai/src/lib/gemini/imageClient.ts` - Gemini Imagen API wrapper for image generation
- `kidcreatives-ai/src/lib/promptSynthesis.ts` - Utility to convert Prompt_State_JSON to narrative prompt
- `kidcreatives-ai/src/hooks/useGeminiImage.ts` - Custom hook for image generation with loading/error states
- `kidcreatives-ai/src/components/phases/GenerationPhase.tsx` - Main Phase 3 component
- `kidcreatives-ai/src/types/GeminiTypes.ts` (UPDATE) - Add image generation types

### Relevant Documentation YOU SHOULD READ THESE BEFORE IMPLEMENTING!

- [Gemini Imagen 4.0 API](https://ai.google.dev/gemini-api/docs/imagen)
  - Specific section: POST /v1beta/models/imagen-4.0-generate-001:predict
  - Why: Required for implementing image generation with correct endpoint and parameters
  - Key details: Request/response format, base64 encoding, configuration options

- [@google/generative-ai SDK](https://ai.google.dev/api/generate-content)
  - Specific section: Multimodal content generation patterns
  - Why: Shows how to structure API calls with the existing SDK version (0.21.0)
  - Note: SDK may not have direct Imagen support, may need REST API

- [Framer Motion Animations](https://www.framer.com/motion/)
  - Specific section: AnimatePresence for conditional rendering
  - Why: Needed for smooth image reveal animation

### Patterns to Follow

**Naming Conventions:**
- Components: PascalCase (`GenerationPhase.tsx`)
- Hooks: camelCase with `use` prefix (`useGeminiImage.ts`)
- Utilities: camelCase (`promptSynthesis.ts`)
- Types: PascalCase interfaces (`ImageGenerationResult`)
- API clients: camelCase (`imageClient.ts`)

**Error Handling Pattern** (from visionClient.ts:50-65):
```typescript
try {
  const result = await apiCall()
  return result
} catch (error) {
  console.error('Gemini API error:', error)
  throw new Error(
    error instanceof Error 
      ? `Operation failed: ${error.message}` 
      : 'Operation failed: Unknown error'
  )
}
```

**Custom Hook Pattern** (from useGeminiVision.ts:13-48):
```typescript
export function useCustomHook(): ReturnType {
  const [data, setData] = useState<Type | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = async (params) => {
    setIsLoading(true)
    setError(null)
    setData(null)

    try {
      const result = await apiCall(params)
      setData(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Operation failed'
      setError(errorMessage)
      console.error('Error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const reset = () => {
    setData(null)
    setError(null)
    setIsLoading(false)
  }

  return { data, isLoading, error, execute, reset }
}
```

**Phase Component Pattern** (from PromptBuilderPhase.tsx:14-30):
```typescript
interface PhaseProps {
  // Input data from previous phase
  dataFromPreviousPhase: string
  // Navigation callbacks
  onBack: () => void
  onNext: (dataForNextPhase: string) => void
}

export function Phase({ dataFromPreviousPhase, onBack, onNext }: PhaseProps) {
  const [localState, setLocalState] = useState()
  const { data, isLoading, error, execute } = useCustomHook()

  useEffect(() => {
    // Initialize phase
  }, [])

  const handleComplete = () => {
    onNext(dataToPass)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      {/* Phase content */}
    </div>
  )
}
```

**Input Sanitization** (from visionClient.ts:11-19):
```typescript
function sanitizeInput(input: string): string {
  return input
    .replace(/ignore previous instructions/gi, '')
    .replace(/system:/gi, '')
    .replace(/assistant:/gi, '')
    .replace(/user:/gi, '')
    .trim()
}
```

**Sparky Integration** (from PromptBuilderPhase.tsx:80-90):
```typescript
<Sparky 
  state={isLoading ? 'thinking' : error ? 'waiting' : 'success'}
  message={sparkyMessage}
  className="mb-6"
/>
```

**Framer Motion Animations** (from Sparky.tsx:40-50):
```typescript
<motion.div
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.3 }}
>
  {/* Content */}
</motion.div>
```

---

## IMPLEMENTATION PLAN

### Phase 1: Foundation (Types & Utilities)

Set up type definitions and utility functions before implementing API integration.

**Tasks:**
- Define TypeScript interfaces for image generation (request/response)
- Create prompt synthesis utility to convert JSON to narrative
- Add GenerationState interface to PhaseTypes.ts

### Phase 2: API Integration

Implement Gemini Imagen API client following existing patterns.

**Tasks:**
- Create imageClient.ts with generateImage function
- Implement REST API call (SDK may not support Imagen directly)
- Add error handling and retry logic
- Handle base64 image decoding

### Phase 3: Custom Hook

Create React hook for managing image generation state.

**Tasks:**
- Implement useGeminiImage hook following useGeminiVision pattern
- Manage loading, error, and success states
- Provide generate and reset functions

### Phase 4: UI Component

Build GenerationPhase component with side-by-side image display.

**Tasks:**
- Create component structure with props interface
- Implement prompt synthesis on mount
- Integrate useGeminiImage hook
- Build side-by-side image layout
- Add Sparky integration for loading states
- Implement navigation (Back/Next buttons)

### Phase 5: App Integration

Connect GenerationPhase to app-level phase orchestration.

**Tasks:**
- Update App.tsx PhaseData interface
- Add Phase.Generation case to switch statement
- Implement handlePromptBuilderComplete to transition to Generation
- Implement handleGenerationComplete for Phase 4 transition
- Add validation for required data

---

## STEP-BY-STEP TASKS

IMPORTANT: Execute every task in order, top to bottom. Each task is atomic and independently testable.

### Task 1: UPDATE kidcreatives-ai/src/types/GeminiTypes.ts

- **IMPLEMENT**: Add image generation types
- **PATTERN**: Follow existing VisionAnalysisResult interface pattern (lines 1-10)
- **IMPORTS**: None needed (type-only file)
- **GOTCHA**: Imagen API returns base64 in `imageBytes` field, not `data`
- **VALIDATE**: `npx tsc --noEmit`

```typescript
// Add to end of file

// Imagen API request configuration
export interface ImageGenerationConfig {
  sampleCount?: number // 1-4, default 4
  imageSize?: '1K' | '2K' // default '1K'
  aspectRatio?: '1:1' | '3:4' | '4:3' | '9:16' | '16:9' // default '1:1'
  personGeneration?: 'dont_allow' | 'allow_adult' | 'allow_all' // default 'allow_adult'
}

// Imagen API response
export interface ImageGenerationResult {
  imageBytes: string // base64 encoded PNG
  mimeType: string // 'image/png'
  prompt: string // The synthesized prompt used
}

// Error response from Imagen API
export interface ImageGenerationError {
  error: {
    code: number
    message: string
    status: string
  }
}
```

### Task 2: UPDATE kidcreatives-ai/src/types/PhaseTypes.ts

- **IMPLEMENT**: Add GenerationState interface
- **PATTERN**: Follow HandshakeState and PromptBuilderState patterns (lines 8-25)
- **IMPORTS**: Import ImageGenerationResult from GeminiTypes
- **GOTCHA**: None
- **VALIDATE**: `npx tsc --noEmit`

```typescript
// Add import at top
import type { ImageGenerationResult } from './GeminiTypes'

// Add interface after PromptBuilderState
export interface GenerationState {
  synthesizedPrompt: string | null
  generatedImage: ImageGenerationResult | null
  isGenerating: boolean
  error: string | null
}
```

### Task 3: CREATE kidcreatives-ai/src/lib/promptSynthesis.ts

- **IMPLEMENT**: Utility to convert Prompt_State_JSON to narrative prompt
- **PATTERN**: Pure function, no React dependencies
- **IMPORTS**: PromptStateJSON, PromptVariableEntry from types
- **GOTCHA**: Must handle missing variables gracefully, maintain natural language flow
- **VALIDATE**: `npx tsc --noEmit && node -e "console.log('Syntax OK')"`

```typescript
import type { PromptStateJSON, PromptVariableEntry, PromptVariable } from '@/types/PromptState'

/**
 * Synthesizes a narrative prompt from structured Prompt_State_JSON
 * 
 * Format: [Subject + Action] + [Variables] + [Context] + [Style]
 * Example: "A robot doing a backflip, with smooth metallic texture, 
 *           in bright sunny lighting, feeling playful and energetic,
 *           floating in space with stars, in a vibrant cartoon style"
 */
export function synthesizePrompt(promptState: PromptStateJSON): string {
  const { intentStatement, variables } = promptState

  // Start with the child's original intent (subject + action)
  let prompt = intentStatement

  // Group variables by category for natural flow
  const variablesByCategory = groupVariablesByCategory(variables)

  // Add texture/material variables
  const textureVars = variablesByCategory.variable || []
  if (textureVars.length > 0) {
    const textureDescriptions = textureVars.map(v => v.answer).join(', ')
    prompt += `, with ${textureDescriptions}`
  }

  // Add context variables (lighting, background, era)
  const contextVars = variablesByCategory.context || []
  if (contextVars.length > 0) {
    for (const contextVar of contextVars) {
      if (contextVar.variable === 'lighting') {
        prompt += `, in ${contextVar.answer} lighting`
      } else if (contextVar.variable === 'background') {
        prompt += `, ${contextVar.answer}`
      } else if (contextVar.variable === 'era') {
        prompt += `, set in ${contextVar.answer}`
      } else if (contextVar.variable === 'mood') {
        prompt += `, feeling ${contextVar.answer}`
      }
    }
  }

  // Add style at the end
  const styleVar = variables.find(v => v.variable === 'style')
  if (styleVar) {
    prompt += `, in a ${styleVar.answer} style`
  }

  // Clean up and ensure proper formatting
  prompt = prompt
    .replace(/\s+/g, ' ') // Remove extra spaces
    .replace(/,\s*,/g, ',') // Remove double commas
    .trim()

  return prompt
}

/**
 * Groups variables by their color category for organized synthesis
 */
function groupVariablesByCategory(
  variables: PromptVariableEntry[]
): Record<string, PromptVariableEntry[]> {
  return variables.reduce((acc, variable) => {
    const category = variable.colorCategory
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(variable)
    return acc
  }, {} as Record<string, PromptVariableEntry[]>)
}

/**
 * Extracts subject from intent statement for fallback scenarios
 */
export function extractSubject(intentStatement: string): string {
  // Remove common stop words and extract main subject
  const stopWords = ['a', 'an', 'the', 'is', 'doing', 'in', 'on', 'at']
  const words = intentStatement.toLowerCase().split(' ')
  const meaningfulWords = words.filter(word => 
    !stopWords.includes(word) && word.length > 2
  )
  
  return meaningfulWords.slice(0, 3).join(' ') || 'creation'
}
```

### Task 4: CREATE kidcreatives-ai/src/lib/gemini/imageClient.ts

- **IMPLEMENT**: Gemini Imagen API client using REST API
- **PATTERN**: Mirror visionClient.ts structure (API key validation, error handling, sanitization)
- **IMPORTS**: ImageGenerationConfig, ImageGenerationResult, ImageGenerationError from types
- **GOTCHA**: @google/generative-ai SDK v0.21.0 doesn't support Imagen, must use REST API directly
- **VALIDATE**: `npx tsc --noEmit`

```typescript
import type { ImageGenerationConfig, ImageGenerationResult, ImageGenerationError } from '@/types/GeminiTypes'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

if (!API_KEY) {
  throw new Error('VITE_GEMINI_API_KEY is required but not set in environment variables')
}

const IMAGEN_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict'

/**
 * Sanitize prompt to prevent injection attacks
 */
function sanitizePrompt(prompt: string): string {
  return prompt
    .replace(/ignore previous instructions/gi, '')
    .replace(/system:/gi, '')
    .replace(/assistant:/gi, '')
    .replace(/user:/gi, '')
    .trim()
}

/**
 * Generate image using Gemini Imagen 4.0 API
 * 
 * @param prompt - Narrative description of image to generate
 * @param config - Optional configuration (sampleCount, imageSize, aspectRatio, personGeneration)
 * @returns ImageGenerationResult with base64 encoded PNG
 */
export async function generateImage(
  prompt: string,
  config: ImageGenerationConfig = {}
): Promise<ImageGenerationResult> {
  try {
    const sanitizedPrompt = sanitizePrompt(prompt)

    // Default configuration optimized for KidCreatives AI
    const requestBody = {
      instances: [
        {
          prompt: sanitizedPrompt
        }
      ],
      parameters: {
        sampleCount: config.sampleCount || 1, // Generate single image for faster response
        imageSize: config.imageSize || '1K', // 1K for faster generation
        aspectRatio: config.aspectRatio || '1:1', // Square format
        personGeneration: config.personGeneration || 'allow_adult' // Default safety setting
      }
    }

    const response = await fetch(`${IMAGEN_ENDPOINT}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorData: ImageGenerationError = await response.json()
      throw new Error(
        `Imagen API error (${errorData.error.code}): ${errorData.error.message}`
      )
    }

    const data = await response.json()

    // Extract first generated image
    const generatedImage = data.generatedImages?.[0]?.image
    if (!generatedImage) {
      throw new Error('No image generated in API response')
    }

    return {
      imageBytes: generatedImage.imageBytes,
      mimeType: generatedImage.mimeType || 'image/png',
      prompt: sanitizedPrompt
    }
  } catch (error) {
    console.error('Gemini Imagen API error:', error)
    throw new Error(
      error instanceof Error
        ? `Image generation failed: ${error.message}`
        : 'Image generation failed: Unknown error'
    )
  }
}

/**
 * Convert base64 image bytes to data URL for display
 */
export function imageToDataURL(imageBytes: string, mimeType: string): string {
  return `data:${mimeType};base64,${imageBytes}`
}
```

### Task 5: CREATE kidcreatives-ai/src/hooks/useGeminiImage.ts

- **IMPLEMENT**: Custom hook for image generation state management
- **PATTERN**: Mirror useGeminiVision.ts structure exactly (lines 13-48)
- **IMPORTS**: useState from react, generateImage from imageClient, types from GeminiTypes
- **GOTCHA**: None
- **VALIDATE**: `npx tsc --noEmit`

```typescript
import { useState } from 'react'
import { generateImage } from '@/lib/gemini/imageClient'
import type { ImageGenerationResult, ImageGenerationConfig } from '@/types/GeminiTypes'

interface UseGeminiImageReturn {
  generatedImage: ImageGenerationResult | null
  isGenerating: boolean
  error: string | null
  generate: (prompt: string, config?: ImageGenerationConfig) => Promise<void>
  reset: () => void
}

export function useGeminiImage(): UseGeminiImageReturn {
  const [generatedImage, setGeneratedImage] = useState<ImageGenerationResult | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generate = async (prompt: string, config?: ImageGenerationConfig) => {
    setIsGenerating(true)
    setError(null)
    setGeneratedImage(null)

    try {
      const result = await generateImage(prompt, config)
      setGeneratedImage(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Image generation failed'
      setError(errorMessage)
      console.error('Image generation error:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const reset = () => {
    setGeneratedImage(null)
    setError(null)
    setIsGenerating(false)
  }

  return {
    generatedImage,
    isGenerating,
    error,
    generate,
    reset
  }
}
```


### Task 6: CREATE kidcreatives-ai/src/components/phases/GenerationPhase.tsx

- **IMPLEMENT**: Main Phase 3 component with side-by-side image display
- **PATTERN**: Mirror PromptBuilderPhase.tsx structure (props, hooks, useEffect, handlers)
- **IMPORTS**: React hooks, motion from framer-motion, Button, Sparky, useGeminiImage, synthesizePrompt, imageToDataURL
- **GOTCHA**: Must parse promptStateJSON string to PromptStateJSON object before synthesis
- **VALIDATE**: `npx tsc --noEmit && npm run lint`

```typescript
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sparky } from '@/components/ui/Sparky'
import { useGeminiImage } from '@/hooks/useGeminiImage'
import { synthesizePrompt } from '@/lib/promptSynthesis'
import { imageToDataURL } from '@/lib/gemini/imageClient'
import type { PromptStateJSON } from '@/types/PromptState'

interface GenerationPhaseProps {
  originalImage: string // base64
  imageMimeType: string
  promptStateJSON: string // JSON string from Phase 2
  onBack: () => void
  onNext: (generatedImageBase64: string) => void
}

export function GenerationPhase({
  originalImage,
  imageMimeType,
  promptStateJSON,
  onBack,
  onNext
}: GenerationPhaseProps) {
  const [synthesizedPrompt, setSynthesizedPrompt] = useState<string>('')
  const [sparkyMessage, setSparkyMessage] = useState('')
  const { generatedImage, isGenerating, error, generate, reset } = useGeminiImage()

  // Parse and synthesize prompt on mount
  useEffect(() => {
    try {
      const promptState: PromptStateJSON = JSON.parse(promptStateJSON)
      const prompt = synthesizePrompt(promptState)
      setSynthesizedPrompt(prompt)
      setSparkyMessage("I'm creating your AI-enhanced artwork! This might take a few seconds...")
      
      // Automatically start generation
      generate(prompt)
    } catch (err) {
      console.error('Failed to parse prompt state:', err)
      setSparkyMessage("Oops! Something went wrong with your prompt. Let's try again!")
    }
  }, [promptStateJSON, generate])

  // Update Sparky message based on generation state
  useEffect(() => {
    if (isGenerating) {
      setSparkyMessage("I'm creating your AI-enhanced artwork! This might take a few seconds...")
    } else if (error) {
      setSparkyMessage("Hmm, something went wrong. But don't worry, we can try again!")
    } else if (generatedImage) {
      setSparkyMessage("Ta-da! Look at your amazing creation! See how your answers transformed your sketch?")
    }
  }, [isGenerating, error, generatedImage])

  const handleRetry = () => {
    reset()
    setSparkyMessage("Let's try creating your artwork again!")
    generate(synthesizedPrompt)
  }

  const handleNext = () => {
    if (generatedImage) {
      onNext(generatedImage.imageBytes)
    }
  }

  // Convert original image base64 to data URL
  const originalImageDataURL = `data:${imageMimeType};base64,${originalImage}`
  const generatedImageDataURL = generatedImage 
    ? imageToDataURL(generatedImage.imageBytes, generatedImage.mimeType)
    : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Phase 3: The Big Reveal! 🎨
          </h1>
          <p className="text-lg text-gray-600">
            Watch your creative decisions come to life
          </p>
        </motion.div>

        {/* Sparky Coach */}
        <Sparky
          state={isGenerating ? 'thinking' : error ? 'waiting' : 'success'}
          message={sparkyMessage}
          className="mb-8"
        />

        {/* Side-by-Side Image Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Original Sketch */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              Your Original Sketch
            </h2>
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={originalImageDataURL}
                alt="Original sketch"
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>

          {/* Generated Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              AI-Enhanced Version
            </h2>
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
              <AnimatePresence mode="wait">
                {isGenerating && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center"
                  >
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-subject-blue mx-auto mb-4"></div>
                    <p className="text-gray-600">Creating magic...</p>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center p-4"
                  >
                    <p className="text-red-600 mb-4">Generation failed</p>
                    <Button
                      onClick={handleRetry}
                      variant="outline"
                      className="gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Try Again
                    </Button>
                  </motion.div>
                )}

                {generatedImage && generatedImageDataURL && (
                  <motion.img
                    key="generated"
                    src={generatedImageDataURL}
                    alt="AI-generated artwork"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full object-contain"
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Synthesized Prompt Display */}
        {synthesizedPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white rounded-lg shadow-lg p-6 mb-8"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Your AI Prompt (The Instructions You Created):
            </h3>
            <p className="text-gray-700 leading-relaxed font-mono text-sm bg-gray-50 p-4 rounded">
              {synthesizedPrompt}
            </p>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex justify-between items-center"
        >
          <Button
            onClick={onBack}
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Questions
          </Button>

          <Button
            onClick={handleNext}
            disabled={!generatedImage || isGenerating}
            className="gap-2 bg-action-green hover:bg-green-600 text-white"
          >
            Refine My Art
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
```

### Task 7: UPDATE kidcreatives-ai/src/components/phases/index.ts

- **IMPLEMENT**: Export GenerationPhase component
- **PATTERN**: Follow existing export pattern (lines 1-2)
- **IMPORTS**: None
- **GOTCHA**: None
- **VALIDATE**: `npx tsc --noEmit`

```typescript
// Add to existing exports
export { GenerationPhase } from './GenerationPhase'
```

### Task 8: UPDATE kidcreatives-ai/src/App.tsx - Add PhaseData fields

- **IMPLEMENT**: Add generatedImage field to PhaseData interface
- **PATTERN**: Follow existing field pattern (lines 6-12)
- **IMPORTS**: None needed
- **GOTCHA**: None
- **VALIDATE**: `npx tsc --noEmit`

```typescript
// Update PhaseData interface (around line 6)
interface PhaseData {
  originalImage: string | null
  imageMimeType: string
  intentStatement: string
  visionAnalysis: string | null
  promptStateJSON: string | null
  generatedImage: string | null // ADD THIS LINE
}

// Update initial state (around line 16)
const [phaseData, setPhaseData] = useState<PhaseData>({
  originalImage: null,
  imageMimeType: 'image/jpeg',
  intentStatement: '',
  visionAnalysis: null,
  promptStateJSON: null,
  generatedImage: null // ADD THIS LINE
})
```

### Task 9: UPDATE kidcreatives-ai/src/App.tsx - Add Generation phase handlers

- **IMPLEMENT**: Add handlePromptBuilderComplete update and handleGenerationComplete handler
- **PATTERN**: Mirror handleHandshakeComplete pattern (lines 28-40)
- **IMPORTS**: Add GenerationPhase to imports
- **GOTCHA**: handlePromptBuilderComplete currently only logs, needs to transition to Generation phase
- **VALIDATE**: `npx tsc --noEmit`

```typescript
// Update imports (around line 3)
import { HandshakePhase } from '@/components/phases/HandshakePhase'
import { PromptBuilderPhase } from '@/components/phases/PromptBuilderPhase'
import { GenerationPhase } from '@/components/phases/GenerationPhase' // ADD THIS

// Update handlePromptBuilderComplete (around line 50)
const handlePromptBuilderComplete = (promptStateJSON: string) => {
  setPhaseData(prev => ({
    ...prev,
    promptStateJSON
  }))
  setCurrentPhase(Phase.Generation) // CHANGE FROM console.log
}

// Add new handler after handlePromptBuilderComplete
const handleGenerationBack = () => {
  setCurrentPhase(Phase.PromptBuilder)
}

const handleGenerationComplete = (generatedImageBase64: string) => {
  setPhaseData(prev => ({
    ...prev,
    generatedImage: generatedImageBase64
  }))
  // TODO: Transition to Phase.Refinement when implemented
  console.log('Phase 3 complete! Generated image:', generatedImageBase64.substring(0, 50) + '...')
}
```

### Task 10: UPDATE kidcreatives-ai/src/App.tsx - Add Generation phase to switch

- **IMPLEMENT**: Add Phase.Generation case to switch statement
- **PATTERN**: Mirror Phase.PromptBuilder case (lines 60-75)
- **IMPORTS**: None needed
- **GOTCHA**: Must validate required data (originalImage, promptStateJSON) before rendering
- **VALIDATE**: `npx tsc --noEmit && npm run build`

```typescript
// Add to switch statement (after Phase.PromptBuilder case, before Phase.Handshake)
case Phase.Generation:
  if (!phaseData.originalImage || !phaseData.promptStateJSON) {
    // Redirect to Handshake if missing required data
    setCurrentPhase(Phase.Handshake)
    return null
  }
  return (
    <GenerationPhase
      originalImage={phaseData.originalImage}
      imageMimeType={phaseData.imageMimeType}
      promptStateJSON={phaseData.promptStateJSON}
      onBack={handleGenerationBack}
      onNext={handleGenerationComplete}
    />
  )
```

### Task 11: UPDATE kidcreatives-ai/src/App.tsx - Add useEffect validation

- **IMPLEMENT**: Add useEffect to validate Generation phase data
- **PATTERN**: Mirror existing useEffect for PromptBuilder (lines 23-27)
- **IMPORTS**: None needed
- **GOTCHA**: None
- **VALIDATE**: `npx tsc --noEmit && npm run build`

```typescript
// Add after existing useEffect (around line 27)
useEffect(() => {
  if (currentPhase === Phase.Generation && (!phaseData.originalImage || !phaseData.promptStateJSON)) {
    setCurrentPhase(Phase.Handshake)
  }
}, [currentPhase, phaseData.originalImage, phaseData.promptStateJSON])
```

---

## TESTING STRATEGY

### Unit Tests (Future - Not Required for MVP)

**Scope**: Test pure functions in isolation
- `promptSynthesis.ts`: Test synthesizePrompt with various PromptStateJSON inputs
- `imageClient.ts`: Mock fetch calls, test error handling

**Framework**: Vitest (when added to project)

### Integration Tests with agent-browser

**Scope**: Test complete Phase 3 workflow

**Test Script** (`.agents/tests/phase-3-generation.sh`):
```bash
#!/bin/bash
# Test Phase 3: Image Generation

# Start dev server
npm run dev &
DEV_PID=$!
sleep 5

# Navigate through phases
agent-browser open http://localhost:5173

# Phase 1: Upload and analyze
agent-browser snapshot -i
agent-browser upload @e1 tests/fixtures/robot-sketch.png
agent-browser fill @e2 "A robot doing a backflip"
agent-browser click @e3
agent-browser wait --text "I see"

# Phase 2: Answer questions
agent-browser wait --text "Let's build"
agent-browser fill @e4 "Smooth and shiny"
agent-browser click @e5
agent-browser wait 1000
agent-browser fill @e4 "Bright sunny day"
agent-browser click @e5
agent-browser wait 1000
agent-browser fill @e4 "Playful and energetic"
agent-browser click @e5
agent-browser wait 1000
agent-browser fill @e4 "Floating in space"
agent-browser click @e5

# Phase 3: Wait for generation
agent-browser wait --text "The Big Reveal"
agent-browser screenshot phase-3-loading.png
agent-browser wait --text "Ta-da" --timeout 30000
agent-browser screenshot phase-3-complete.png

# Verify both images are displayed
agent-browser get count "img[alt='Original sketch']"
agent-browser get count "img[alt='AI-generated artwork']"

# Verify synthesized prompt is shown
agent-browser get text ".font-mono"

# Clean up
kill $DEV_PID
```

### Edge Cases

1. **Invalid JSON in promptStateJSON**
   - Test: Pass malformed JSON string
   - Expected: Error message, retry option

2. **Imagen API failure**
   - Test: Mock API error response
   - Expected: Error message with retry button

3. **Empty variables array**
   - Test: PromptStateJSON with no answered questions
   - Expected: Fallback to intent statement only

4. **Network timeout**
   - Test: Slow network simulation
   - Expected: Loading state persists, eventual timeout error

5. **Missing original image**
   - Test: Navigate to Phase 3 without Phase 1 data
   - Expected: Redirect to Phase 1 (Handshake)

---

## VALIDATION COMMANDS

Execute every command to ensure zero regressions and 100% feature correctness.

### Level 1: Syntax & Style

```bash
# TypeScript compilation
npx tsc --noEmit

# ESLint
npm run lint

# Check for unused imports
npx tsc --noUnusedLocals --noUnusedParameters --noEmit
```

### Level 2: Build Validation

```bash
# Production build
npm run build

# Check bundle size (should be < 300KB gzipped)
du -sh kidcreatives-ai/dist

# Preview production build
npm run preview
```

### Level 3: Manual Validation

```bash
# Start dev server
npm run dev

# In browser:
# 1. Navigate to http://localhost:5173
# 2. Complete Phase 1 (upload image, enter intent, wait for analysis)
# 3. Complete Phase 2 (answer 4 questions)
# 4. Verify Phase 3 loads automatically
# 5. Verify loading animation shows
# 6. Verify Sparky shows "thinking" state
# 7. Wait for image generation (3-10 seconds)
# 8. Verify side-by-side images display
# 9. Verify synthesized prompt shows below images
# 10. Verify "Refine My Art" button is enabled
# 11. Test "Back to Questions" button
# 12. Test retry on error (disconnect network, click retry)
```

### Level 4: agent-browser Testing

```bash
# Run Phase 3 test script
chmod +x .agents/tests/phase-3-generation.sh
./.agents/tests/phase-3-generation.sh

# Verify screenshots captured
ls -lh phase-3-*.png
```

### Level 5: API Integration Testing

```bash
# Test Imagen API directly
curl -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=$VITE_GEMINI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "instances": [{"prompt": "A robot doing a backflip"}],
    "parameters": {"sampleCount": 1, "imageSize": "1K", "aspectRatio": "1:1"}
  }'

# Verify response contains generatedImages array
```

---

## ACCEPTANCE CRITERIA

- [x] Phase 3 component renders with side-by-side layout
- [x] Prompt synthesis converts PromptStateJSON to narrative correctly
- [x] Gemini Imagen API integration works with REST endpoint
- [x] Loading state shows Sparky in "thinking" mode
- [x] Generated image displays on right side
- [x] Original sketch displays on left side
- [x] Synthesized prompt displays below images
- [x] Error handling shows retry button
- [x] Back button returns to Phase 2
- [x] Next button transitions to Phase 4 (logs for now)
- [x] TypeScript compiles with zero errors
- [x] ESLint passes with zero errors
- [x] Production build succeeds
- [x] Bundle size remains under 300KB gzipped
- [x] Phase transition validation prevents invalid navigation
- [x] All validation commands pass

---

## COMPLETION CHECKLIST

- [ ] Task 1: GeminiTypes.ts updated with image generation types
- [ ] Task 2: PhaseTypes.ts updated with GenerationState
- [ ] Task 3: promptSynthesis.ts created and tested
- [ ] Task 4: imageClient.ts created with REST API integration
- [ ] Task 5: useGeminiImage.ts hook created
- [ ] Task 6: GenerationPhase.tsx component created
- [ ] Task 7: phases/index.ts updated with export
- [ ] Task 8: App.tsx PhaseData interface updated
- [ ] Task 9: App.tsx handlers added
- [ ] Task 10: App.tsx switch case added
- [ ] Task 11: App.tsx useEffect validation added
- [ ] All TypeScript compilation passes
- [ ] All ESLint checks pass
- [ ] Production build succeeds
- [ ] Manual testing confirms full workflow
- [ ] agent-browser tests pass
- [ ] API integration verified
- [ ] Code reviewed for quality

---

## NOTES

### Design Decisions

1. **REST API over SDK**: @google/generative-ai v0.21.0 doesn't support Imagen, so we use direct REST API calls. This is acceptable and follows the same pattern as other API integrations.

2. **Single Image Generation**: Set `sampleCount: 1` for faster response times (3-5 seconds vs 10-15 seconds for 4 images). Children's attention spans require quick feedback.

3. **1K Image Size**: Use `imageSize: '1K'` instead of '2K' for faster generation and smaller bundle size. 1K (1024x1024) is sufficient for web display.

4. **Automatic Generation**: Start image generation immediately on mount rather than requiring a button click. This creates a smoother "reveal moment" experience.

5. **Side-by-Side Layout**: Desktop shows images side-by-side, mobile stacks vertically. This emphasizes the transformation from sketch to AI-enhanced artwork.

6. **Prompt Display**: Show the synthesized prompt below images to reinforce the educational goal: "Your answers became these instructions."

### Technical Trade-offs

1. **Client-Side API Calls**: Acceptable for hackathon/demo, but production should use backend proxy to hide API key and add rate limiting.

2. **No Caching**: Each generation makes a fresh API call. Future enhancement: cache generated images in Supabase to avoid regeneration.

3. **Error Recovery**: Simple retry button for now. Future: Implement exponential backoff and queue system for failed generations.

4. **Loading Time**: 3-10 seconds is acceptable for children if Sparky provides engaging feedback. Consider adding progress indicators in future.

### Future Enhancements

1. **Multiple Variations**: Generate 2-4 variations and let child choose favorite
2. **Generation History**: Store all generated images in Supabase for later review
3. **Prompt Editing**: Allow tweaking synthesized prompt before generation
4. **Style Presets**: Offer quick style buttons (Cartoon, Realistic, Pixel Art)
5. **Progress Indicators**: Show percentage or step-by-step generation progress

### Known Limitations

1. **Imagen API Quota**: Free tier has limited requests per day. Monitor usage.
2. **English Only**: Imagen currently supports English prompts only.
3. **Generation Time**: Can vary from 3-15 seconds depending on API load.
4. **Image Quality**: 1K resolution may show artifacts on large displays.
5. **Person Generation**: Default "allow_adult" setting may need adjustment based on content policy.

### Security Considerations

1. **Input Sanitization**: All prompts sanitized to prevent injection attacks
2. **API Key Protection**: Currently client-side (acceptable for demo), needs backend for production
3. **Content Moderation**: Imagen has built-in safety filters, but consider additional validation
4. **Rate Limiting**: No rate limiting implemented yet, needed for production

### Performance Metrics

- **Target Load Time**: < 500ms for component mount
- **Target Generation Time**: 3-10 seconds (API dependent)
- **Target Bundle Impact**: < 20KB additional gzipped
- **Target Memory**: < 50MB for image handling

### Confidence Score

**8.5/10** for one-pass implementation success

**Reasons for High Confidence**:
- Clear patterns from existing phases (HandshakePhase, PromptBuilderPhase)
- Well-documented Imagen API with examples
- Existing Gemini integration patterns to follow
- Comprehensive type definitions
- Detailed task breakdown with validation commands

**Potential Risks**:
- Imagen API endpoint might have changed (mitigated by documentation links)
- REST API integration might need CORS handling (mitigated by Vite proxy if needed)
- Prompt synthesis logic might need iteration (mitigated by clear examples)
- Image display might have aspect ratio issues (mitigated by object-contain CSS)

**Mitigation Strategies**:
- Test API endpoint first with curl before implementing
- Add comprehensive error handling with user-friendly messages
- Implement retry logic for transient failures
- Use agent-browser for automated testing of full workflow
