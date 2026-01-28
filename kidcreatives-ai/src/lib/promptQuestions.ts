import type { SocraticQuestion } from '@/types/PromptState'
import { PromptVariable } from '@/types/PromptState'

// Predefined question templates for each prompt variable
export const QUESTION_TEMPLATES: SocraticQuestion[] = [
  {
    variable: PromptVariable.Texture,
    questionTemplate: "How does your {subject} feel if you touch it? Is it smooth, rough, fluffy, or something else?",
    exampleAnswers: ["Fluffy like a cloud", "Smooth and shiny", "Rough like sandpaper", "Soft like a pillow"],
    colorCategory: 'variable'
  },
  {
    variable: PromptVariable.Lighting,
    questionTemplate: "What kind of light is shining on your {subject}? Is it sunny, dark, glowing, or magical?",
    exampleAnswers: ["Bright sunny day", "Dark with moonlight", "Neon lights", "Magical sparkles"],
    colorCategory: 'context'
  },
  {
    variable: PromptVariable.Mood,
    questionTemplate: "What feeling does your {subject} have? Happy, mysterious, exciting, or something else?",
    exampleAnswers: ["Super happy and playful", "Mysterious and curious", "Exciting and adventurous", "Calm and peaceful"],
    colorCategory: 'context'
  },
  {
    variable: PromptVariable.Background,
    questionTemplate: "Where is your {subject}? In space, a forest, a city, or somewhere else?",
    exampleAnswers: ["Floating in space", "Deep in a forest", "Busy city street", "On a mountain top"],
    colorCategory: 'context'
  },
  {
    variable: PromptVariable.Style,
    questionTemplate: "What art style should we use? Cartoon, realistic, pixel art, or something else?",
    exampleAnswers: ["Cartoon like a comic book", "Realistic like a photo", "Pixel art like a video game", "Watercolor painting"],
    colorCategory: 'variable'
  }
]

// Select 3-5 questions based on intent and image analysis
export function selectQuestions(
  _intentStatement: string,
  _visionAnalysis: string,
  count: number = 4
): SocraticQuestion[] {
  return QUESTION_TEMPLATES.slice(0, Math.min(count, QUESTION_TEMPLATES.length))
}

// Replace {subject} placeholder with actual subject from intent
export function personalizeQuestion(
  template: string,
  intentStatement: string
): string {
  // Extract first noun-like word, excluding common articles/prepositions
  const words = intentStatement.toLowerCase().split(' ')
  const stopWords = ['a', 'an', 'the', 'in', 'on', 'at', 'to', 'for', 'of', 'with']
  const subject = words.find(w => w.length > 2 && !stopWords.includes(w)) || 'creation'
  return template.replace(/{subject}/g, subject)
}

// Get color category for a prompt variable (for UI styling)
export function getColorCategory(variable: PromptVariable): 'subject' | 'variable' | 'context' {
  const template = QUESTION_TEMPLATES.find(q => q.variable === variable)
  return template?.colorCategory || 'variable'
}
