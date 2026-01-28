import { useState, useEffect } from 'react'
import { HandshakePhase } from '@/components/phases/HandshakePhase'
import { PromptBuilderPhase } from '@/components/phases/PromptBuilderPhase'
import { Phase } from '@/types/PhaseTypes'

interface PhaseData {
  originalImage: string | null
  imageMimeType: string
  intentStatement: string
  visionAnalysis: string | null
  promptStateJSON: string | null
}

function App() {
  const [currentPhase, setCurrentPhase] = useState<Phase>(Phase.Handshake)
  const [phaseData, setPhaseData] = useState<PhaseData>({
    originalImage: null,
    imageMimeType: 'image/jpeg',
    intentStatement: '',
    visionAnalysis: null,
    promptStateJSON: null
  })

  // Redirect to Handshake if Phase 2 is missing required data
  useEffect(() => {
    if (currentPhase === Phase.PromptBuilder && (!phaseData.originalImage || !phaseData.visionAnalysis)) {
      setCurrentPhase(Phase.Handshake)
    }
  }, [currentPhase, phaseData.originalImage, phaseData.visionAnalysis])

  const handleHandshakeComplete = (
    image: string,
    mimeType: string,
    intent: string,
    analysis: string
  ) => {
    setPhaseData(prev => ({
      ...prev,
      originalImage: image,
      imageMimeType: mimeType,
      intentStatement: intent,
      visionAnalysis: analysis
    }))
    setCurrentPhase(Phase.PromptBuilder)
  }

  const handlePromptBuilderBack = () => {
    setCurrentPhase(Phase.Handshake)
  }

  const handlePromptBuilderComplete = (promptStateJSON: string) => {
    setPhaseData(prev => ({
      ...prev,
      promptStateJSON
    }))
    console.log('Phase 2 complete! Prompt State:', promptStateJSON)
  }

  switch (currentPhase) {
    case Phase.PromptBuilder:
      if (!phaseData.originalImage || !phaseData.visionAnalysis) {
        return null // Will redirect via useEffect
      }
      return (
        <PromptBuilderPhase
          originalImage={phaseData.originalImage}
          intentStatement={phaseData.intentStatement}
          visionAnalysis={phaseData.visionAnalysis}
          onBack={handlePromptBuilderBack}
          onNext={handlePromptBuilderComplete}
        />
      )
    
    case Phase.Handshake:
    default:
      return <HandshakePhase onComplete={handleHandshakeComplete} />
  }
}

export default App
