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

/**
 * Extracts key elements from vision analysis for soul preservation
 */
function extractElements(visionAnalysis: string): string[] {
  const commonObjects = [
    'robot', 'cat', 'dog', 'monster', 'person', 'child', 'character',
    'house', 'building', 'car', 'vehicle', 'tree', 'plant',
    'sun', 'moon', 'star', 'cloud', 'rainbow',
    'flower', 'mountain', 'ocean', 'water', 'sky',
    'animal', 'creature', 'bird', 'fish'
  ]
  
  const found = commonObjects.filter(obj => 
    visionAnalysis.toLowerCase().includes(obj)
  )
  
  return found.length > 0 ? found : ['the drawing elements']
}

/**
 * Gets variable value by type
 */
function getVariable(variables: PromptVariableEntry[], type: string): string {
  const variable = variables.find(v => v.variable === type)
  return variable?.answer || ''
}

/**
 * Synthesizes creative transformation prompt for aggressive style application
 * Preserves soul (characters, layout, intent) while transforming style completely
 * 
 * @param promptState - The complete prompt state from Phase 2
 * @returns Full creative transformation prompt
 */
export function synthesizeCreativePrompt(promptState: PromptStateJSON): string {
  const { intentStatement, visionAnalysis, variables } = promptState
  
  // Extract elements from vision analysis
  const elements = extractElements(visionAnalysis || '')
  
  // Get variable values
  const style = getVariable(variables, 'style')
  const texture = getVariable(variables, 'texture')
  const lighting = getVariable(variables, 'lighting')
  const mood = getVariable(variables, 'mood')
  const background = getVariable(variables, 'background')
  
  // Fallback if no style specified
  const artStyle = style || 'professional artwork'
  
  const prompt = `You are a professional artist transforming a child's drawing into a ${artStyle} masterpiece.

PRESERVE (Soul - Keep These):
- Characters: ${elements.join(', ')}
- Intent: ${intentStatement}
- Composition: Same spatial layout as reference image
- Emotional tone: ${mood || 'playful and creative'}

TRANSFORM AGGRESSIVELY (Apply Fully):
- Art Style: ${artStyle} - APPLY THIS STYLE COMPLETELY, not subtle hints
- Quality: Professional ${artStyle} rendering with polished details
${texture ? `- Textures: ${texture} - add rich, detailed textures` : ''}
${lighting ? `- Lighting: ${lighting} - dramatic, cinematic lighting` : ''}
${mood ? `- Atmosphere: ${mood} feeling` : ''}
${background ? `- Environment: ${background}` : ''}
- Depth: Add perspective, layers, and dimensionality

CREATIVE ENHANCEMENTS:
- Transform sketch lines into ${artStyle} artwork
- Add expressions, details, and personality to characters
${background ? `- Enhance environment with ${background} elements` : ''}
${lighting ? `- Apply ${lighting} to create mood and depth` : ''}
${texture ? `- Make textures feel ${texture}` : ''}
- Elevate quality to professional ${artStyle} standards

Reference Image: Use as composition guide (what elements, where they are)
NOT as pixel template (don't copy the sketch style)

Create a stunning ${artStyle} transformation that makes the child say "WOW!"`

  if (import.meta.env.DEV) {
    console.log('🎨 Creative Transformation Prompt:', prompt)
  }
  
  return prompt
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use synthesizeCreativePrompt instead
 */
export function synthesizeEnhancementPrompt(
  promptState: PromptStateJSON
): { originalIntent: string; styleInstructions: string } {
  const fullPrompt = synthesizeCreativePrompt(promptState)
  return {
    originalIntent: promptState.intentStatement || 'A creative artwork',
    styleInstructions: fullPrompt
  }
}
