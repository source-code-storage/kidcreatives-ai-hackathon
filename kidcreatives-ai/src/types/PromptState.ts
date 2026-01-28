// Prompt variables that children will define through Socratic Q&A
export enum PromptVariable {
  Subject = 'subject',
  SubjectAction = 'subject-action',
  Texture = 'texture',
  Material = 'material',
  Style = 'style',
  Lighting = 'lighting',
  Background = 'background',
  Era = 'era',
  Mood = 'mood',
  ColorPalette = 'color-palette'
}

// Individual prompt variable with value and metadata
export interface PromptVariableEntry {
  variable: PromptVariable
  question: string
  answer: string
  timestamp: number
  colorCategory: 'subject' | 'variable' | 'context'
}

// Complete prompt state tracking all decisions
export interface PromptStateJSON {
  originalImage: string
  intentStatement: string
  visionAnalysis: string
  variables: PromptVariableEntry[]
  startedAt: number
  completedAt: number | null
  currentQuestionIndex: number
  totalQuestions: number
  synthesizedPrompt: string | null
}

// Question template for Socratic Q&A
export interface SocraticQuestion {
  variable: PromptVariable
  questionTemplate: string
  exampleAnswers: string[]
  colorCategory: 'subject' | 'variable' | 'context'
}

// Response from Gemini text generation
export interface QuestionGenerationResult {
  question: string
  variable: PromptVariable
  colorCategory: 'subject' | 'variable' | 'context'
}
