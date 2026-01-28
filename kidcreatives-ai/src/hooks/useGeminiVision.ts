import { useState } from 'react'
import { analyzeImage } from '@/lib/gemini/visionClient'
import type { VisionAnalysisResult } from '@/types/GeminiTypes'

interface UseGeminiVisionReturn {
  analysis: VisionAnalysisResult | null
  isAnalyzing: boolean
  error: string | null
  analyze: (imageBase64: string, intent: string, mimeType?: string) => Promise<void>
  reset: () => void
}

export function useGeminiVision(): UseGeminiVisionReturn {
  const [analysis, setAnalysis] = useState<VisionAnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyze = async (imageBase64: string, intent: string, mimeType?: string) => {
    setIsAnalyzing(true)
    setError(null)
    setAnalysis(null)

    try {
      const result = await analyzeImage(imageBase64, intent, mimeType)
      setAnalysis(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed'
      setError(errorMessage)
      console.error('Vision analysis error:', err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const reset = () => {
    setAnalysis(null)
    setError(null)
    setIsAnalyzing(false)
  }

  return {
    analysis,
    isAnalyzing,
    error,
    analyze,
    reset
  }
}
