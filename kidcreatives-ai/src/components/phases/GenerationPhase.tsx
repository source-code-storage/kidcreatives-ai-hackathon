import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sparky } from '@/components/ui/Sparky'
import { useGeminiImage } from '@/hooks/useGeminiImage'
import { synthesizePrompt } from '@/lib/promptSynthesis'
import { imageToDataURL } from '@/lib/gemini/imageClient'
import type { PromptStateJSON } from '@/types/PromptState'

interface GenerationPhaseProps {
  originalImage: string // base64
  imageMimeType: string
  promptStateJSON: string // JSON string from Phase 2
  onBack: () => void
  onNext: (generatedImageBase64: string) => void
}

export function GenerationPhase({
  originalImage,
  imageMimeType,
  promptStateJSON,
  onBack,
  onNext
}: GenerationPhaseProps) {
  const [synthesizedPrompt, setSynthesizedPrompt] = useState<string>('')
  const [sparkyMessage, setSparkyMessage] = useState('')
  const { generatedImage, isGenerating, error, generate, reset } = useGeminiImage()

  // Parse and synthesize prompt on mount
  useEffect(() => {
    try {
      const promptState: PromptStateJSON = JSON.parse(promptStateJSON)
      const prompt = synthesizePrompt(promptState)
      setSynthesizedPrompt(prompt)
      setSparkyMessage("I'm creating your AI-enhanced artwork! This might take a few seconds...")
      
      // Automatically start generation
      generate(prompt)
    } catch (err) {
      console.error('Failed to parse prompt state:', err)
      setSparkyMessage("Oops! Something went wrong with your prompt. Let's try again!")
    }
  }, [promptStateJSON, generate])

  // Update Sparky message based on generation state
  useEffect(() => {
    if (isGenerating) {
      setSparkyMessage("I'm creating your AI-enhanced artwork! This might take a few seconds...")
    } else if (error) {
      setSparkyMessage("Hmm, something went wrong. But don't worry, we can try again!")
    } else if (generatedImage) {
      setSparkyMessage("Ta-da! Look at your amazing creation! See how your answers transformed your sketch?")
    }
  }, [isGenerating, error, generatedImage])

  const handleRetry = () => {
    reset()
    setSparkyMessage("Let's try creating your artwork again!")
    generate(synthesizedPrompt)
  }

  const handleNext = () => {
    if (generatedImage) {
      onNext(generatedImage.imageBytes)
    }
  }

  // Convert original image base64 to data URL (memoized to prevent recreation)
  const originalImageDataURL = useMemo(
    () => `data:${imageMimeType};base64,${originalImage}`,
    [imageMimeType, originalImage]
  )

  const generatedImageDataURL = useMemo(
    () => generatedImage ? imageToDataURL(generatedImage.imageBytes, generatedImage.mimeType) : null,
    [generatedImage]
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Phase 3: The Big Reveal! 🎨
          </h1>
          <p className="text-lg text-gray-600">
            Watch your creative decisions come to life
          </p>
        </motion.div>

        {/* Sparky Coach */}
        <Sparky
          state={isGenerating ? 'thinking' : error ? 'waiting' : 'success'}
          message={sparkyMessage}
          className="mb-8"
        />

        {/* Side-by-Side Image Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Original Sketch */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              Your Original Sketch
            </h2>
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={originalImageDataURL}
                alt="Original sketch"
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>

          {/* Generated Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              AI-Enhanced Version
            </h2>
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
              <AnimatePresence mode="wait">
                {isGenerating && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center"
                  >
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-subject-blue mx-auto mb-4"></div>
                    <p className="text-gray-600">Creating magic...</p>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center p-4"
                  >
                    <p className="text-red-600 mb-4">Generation failed</p>
                    <Button
                      onClick={handleRetry}
                      variant="outline"
                      className="gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Try Again
                    </Button>
                  </motion.div>
                )}

                {generatedImage && generatedImageDataURL && (
                  <motion.img
                    key="generated"
                    src={generatedImageDataURL}
                    alt="AI-generated artwork"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full object-contain"
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Synthesized Prompt Display */}
        {synthesizedPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white rounded-lg shadow-lg p-6 mb-8"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Your AI Prompt (The Instructions You Created):
            </h3>
            <p className="text-gray-700 leading-relaxed font-mono text-sm bg-gray-50 p-4 rounded">
              {synthesizedPrompt}
            </p>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex justify-between items-center"
        >
          <Button
            onClick={onBack}
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Questions
          </Button>

          <Button
            onClick={handleNext}
            disabled={!generatedImage || isGenerating}
            className="gap-2 bg-action-green hover:bg-green-600 text-white"
          >
            Refine My Art
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
