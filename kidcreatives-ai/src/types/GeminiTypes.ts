// Define interfaces for Gemini Vision API requests and responses
export interface GeminiVisionRequest {
  model: string
  contents: GeminiContent[]
}

export interface GeminiContent {
  parts: GeminiPart[]
}

export interface GeminiPart {
  text?: string
  inline_data?: {
    mime_type: string
    data: string // base64 encoded image
  }
}

export interface GeminiVisionResponse {
  candidates: GeminiCandidate[]
  usageMetadata?: {
    promptTokenCount: number
    candidatesTokenCount: number
    totalTokenCount: number
  }
}

export interface GeminiCandidate {
  content: {
    parts: Array<{ text: string }>
  }
  finishReason: string
  index: number
}

export interface VisionAnalysisResult {
  description: string
  confidence: string
  suggestions?: string[]
}
