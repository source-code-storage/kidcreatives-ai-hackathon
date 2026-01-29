import type { PromptStateJSON, PromptVariableEntry } from '@/types/PromptState'

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

  // Validate input
  if (!intentStatement || !intentStatement.trim()) {
    return 'A creative artwork' // Fallback for empty intent
  }

  if (!Array.isArray(variables) || variables.length === 0) {
    return intentStatement // Return intent if no variables
  }

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
