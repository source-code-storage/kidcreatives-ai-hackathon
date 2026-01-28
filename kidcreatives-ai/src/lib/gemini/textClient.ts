import { GoogleGenerativeAI } from '@google/generative-ai'
import type { QuestionGenerationResult, PromptVariable } from '@/types/PromptState'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

if (!API_KEY) {
  throw new Error('VITE_GEMINI_API_KEY is required but not set in environment variables')
}

const genAI = new GoogleGenerativeAI(API_KEY)

function sanitizeInput(input: string): string {
  return input
    .replace(/ignore previous instructions/gi, '')
    .replace(/system:/gi, '')
    .replace(/assistant:/gi, '')
    .replace(/user:/gi, '')
    .trim()
}

export async function generateSocraticQuestion(
  intentStatement: string,
  visionAnalysis: string,
  variable: PromptVariable,
  questionTemplate: string,
  colorCategory: 'subject' | 'variable' | 'context'
): Promise<QuestionGenerationResult> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const sanitizedIntent = sanitizeInput(intentStatement)
    const sanitizedAnalysis = sanitizeInput(visionAnalysis)
    
    const prompt = `You are Sparky, a friendly AI coach for children aged 7-10.

Context:
- The child drew: "${sanitizedIntent}"
- I analyzed their drawing and said: "${sanitizedAnalysis}"

Now I need to ask them about: ${variable}

Base question template: "${questionTemplate}"

Generate a personalized, encouraging question that:
1. References their specific drawing
2. Uses simple, age-appropriate language
3. Makes them excited to answer
4. Keeps the core meaning of the template
5. Is under 100 characters

Return ONLY the question text, nothing else.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const question = response.text().trim()

    return {
      question,
      variable,
      colorCategory
    }
  } catch (error) {
    console.error('Gemini text generation error:', error)
    
    const fallbackQuestion = questionTemplate.replace(/{subject}/g, 'creation')
    return {
      question: fallbackQuestion,
      variable,
      colorCategory
    }
  }
}
