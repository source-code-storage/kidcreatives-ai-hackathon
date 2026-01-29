import type { ImageGenerationResult } from '@/types/GeminiTypes'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

if (!API_KEY) {
  throw new Error('VITE_GEMINI_API_KEY is required but not set in environment variables')
}

const GEMINI_IMAGE_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent'

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
 * Generate image using Gemini 2.5 Flash Image model
 * 
 * @param prompt - Narrative description of image to generate
 * @returns ImageGenerationResult with base64 encoded PNG
 */
export async function generateImage(
  prompt: string
): Promise<ImageGenerationResult> {
  try {
    const sanitizedPrompt = sanitizePrompt(prompt)

    const requestBody = {
      contents: [{
        parts: [
          { text: sanitizedPrompt }
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

    // Validate response structure with explicit type guards
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
      prompt: sanitizedPrompt
    }
  } catch (error) {
    console.error('Gemini Image API error:', error)
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
