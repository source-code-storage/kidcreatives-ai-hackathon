import { useState } from 'react'
import type { PromptStateJSON, PromptVariableEntry, PromptVariable } from '@/types/PromptState'

interface UsePromptStateReturn {
  promptState: PromptStateJSON
  addAnswer: (
    variable: PromptVariable,
    question: string,
    answer: string,
    colorCategory: 'subject' | 'variable' | 'context'
  ) => void
  isComplete: boolean
  progress: number
  reset: () => void
}

export function usePromptState(
  originalImage: string,
  intentStatement: string,
  visionAnalysis: string,
  totalQuestions: number
): UsePromptStateReturn {
  const [promptState, setPromptState] = useState<PromptStateJSON>({
    originalImage,
    intentStatement,
    visionAnalysis,
    variables: [],
    startedAt: Date.now(),
    completedAt: null,
    currentQuestionIndex: 0,
    totalQuestions,
    synthesizedPrompt: null
  })

  const addAnswer = (
    variable: PromptVariable,
    question: string,
    answer: string,
    colorCategory: 'subject' | 'variable' | 'context'
  ) => {
    const entry: PromptVariableEntry = {
      variable,
      question,
      answer,
      timestamp: Date.now(),
      colorCategory
    }

    setPromptState(prev => {
      const newVariables = [...prev.variables, entry]
      const newIndex = prev.currentQuestionIndex + 1
      const isComplete = newIndex >= prev.totalQuestions

      return {
        ...prev,
        variables: newVariables,
        currentQuestionIndex: newIndex,
        completedAt: isComplete ? Date.now() : null
      }
    })
  }

  const reset = () => {
    setPromptState({
      originalImage,
      intentStatement,
      visionAnalysis,
      variables: [],
      startedAt: Date.now(),
      completedAt: null,
      currentQuestionIndex: 0,
      totalQuestions,
      synthesizedPrompt: null
    })
  }

  const isComplete = promptState.currentQuestionIndex >= promptState.totalQuestions
  const progress = promptState.totalQuestions > 0
    ? (promptState.currentQuestionIndex / promptState.totalQuestions) * 100
    : 0

  return {
    promptState,
    addAnswer,
    isComplete,
    progress,
    reset
  }
}
