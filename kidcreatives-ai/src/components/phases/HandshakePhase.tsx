import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight } from 'lucide-react'
import { ImageUpload } from '@/components/shared/ImageUpload'
import { Button } from '@/components/ui/button'
import { useGeminiVision } from '@/hooks/useGeminiVision'

const MAX_INTENT_LENGTH = 200

interface HandshakePhaseProps {
  onComplete?: (
    image: string,
    mimeType: string,
    intent: string,
    analysis: string
  ) => void
}

export function HandshakePhase({ onComplete }: HandshakePhaseProps = {}) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [imageMimeType, setImageMimeType] = useState<string>('image/jpeg')
  const [intentStatement, setIntentStatement] = useState('')
  const { analysis, isAnalyzing, error, analyze } = useGeminiVision()

  const handleImageSelect = (base64: string, mimeType: string) => {
    setUploadedImage(base64)
    setImageMimeType(mimeType)
  }

  const handleImageRemove = () => {
    setUploadedImage(null)
    setImageMimeType('image/jpeg')
  }

  const handleIntentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    if (value.length <= MAX_INTENT_LENGTH) {
      setIntentStatement(value)
    }
  }

  const handleAnalyze = async () => {
    if (!uploadedImage || !intentStatement.trim()) return
    await analyze(uploadedImage, intentStatement, imageMimeType)
  }

  const canAnalyze = uploadedImage && intentStatement.trim().length > 0 && !isAnalyzing

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-subject-blue" />
            <h1 className="text-4xl font-bold text-gray-900">
              Let's Meet Your Creation!
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Upload your drawing and tell me what you made
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Image Upload */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Step 1: Upload Your Drawing
            </h2>
            <ImageUpload
              onImageSelect={handleImageSelect}
              onImageRemove={handleImageRemove}
              currentImage={uploadedImage}
              disabled={isAnalyzing}
            />
          </motion.div>

          {/* Right Column - Intent Input */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Step 2: Tell Me About It
            </h2>
            <div className="space-y-4">
              <div>
                <textarea
                  value={intentStatement}
                  onChange={handleIntentChange}
                  placeholder="Example: A robot doing a backflip in space"
                  disabled={isAnalyzing}
                  className={`w-full h-32 p-4 border-2 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-subject-blue transition-colors ${
                    isAnalyzing
                      ? 'bg-gray-100 border-gray-300'
                      : 'bg-white border-gray-300 hover:border-subject-blue'
                  }`}
                />
                <p className="text-sm text-gray-500 mt-2">
                  {intentStatement.length}/{MAX_INTENT_LENGTH} characters
                </p>
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={!canAnalyze}
                variant="subject"
                size="lg"
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="mr-2"
                    >
                      <Sparkles className="w-5 h-5" />
                    </motion.div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    Let's Go!
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Analysis Result */}
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 p-6 bg-white/80 backdrop-blur-md rounded-lg shadow-xl border border-white/20"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-subject-blue rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Sparky says:
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {analysis.description}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Continue Button */}
        {analysis && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 text-center"
          >
            <Button
              onClick={() => {
                if (uploadedImage && intentStatement && analysis.description && onComplete) {
                  onComplete(uploadedImage, imageMimeType, intentStatement, analysis.description)
                }
              }}
              variant="default"
              size="lg"
              className="px-8"
            >
              Continue to Prompt Builder <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        )}

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 p-6 bg-red-50 rounded-lg border-2 border-red-200"
          >
            <p className="text-red-700 font-medium">
              Oops! Something went wrong: {error}
            </p>
            <p className="text-red-600 text-sm mt-2">
              Please try again or upload a different image.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
