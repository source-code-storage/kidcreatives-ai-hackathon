import { useCallback, useEffect, useRef } from 'react'
import { triggerConfetti, triggerPhaseCompletionConfetti, triggerTrophyConfetti } from '@/lib/microInteractions'
import type { Options as ConfettiOptions } from 'canvas-confetti'

export function useConfetti() {
  const cleanupRef = useRef<(() => void) | null>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current()
      }
    }
  }, [])

  const celebrate = useCallback((options?: ConfettiOptions) => {
    triggerConfetti(options)
  }, [])

  const celebratePhaseCompletion = useCallback(() => {
    // Clear previous cleanup if exists
    if (cleanupRef.current) {
      cleanupRef.current()
    }
    // Store new cleanup function
    cleanupRef.current = triggerPhaseCompletionConfetti()
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
