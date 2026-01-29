import { useState, useCallback } from 'react'
import { editImage } from '@/lib/gemini/editClient'
import type { EditHistoryEntry } from '@/types/GeminiTypes'

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
