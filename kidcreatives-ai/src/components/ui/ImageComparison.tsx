import { motion, AnimatePresence } from 'framer-motion'
import { useMemo } from 'react'

interface ImageComparisonProps {
  beforeImage: string // base64
  afterImage: string | null // base64
  mimeType: string
  isLoading: boolean
  className?: string
}

export function ImageComparison({
  beforeImage,
  afterImage,
  mimeType,
  isLoading,
  className = ''
}: ImageComparisonProps) {
  const beforeDataURL = useMemo(
    () => `data:${mimeType};base64,${beforeImage}`,
    [beforeImage, mimeType]
  )

  const afterDataURL = useMemo(
    () => afterImage ? `data:${mimeType};base64,${afterImage}` : null,
    [afterImage, mimeType]
  )

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${className}`}>
      {/* Before Image */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Before
        </h3>
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={beforeDataURL}
            alt="Before editing"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* After Image */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          After
        </h3>
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-variable-purple mx-auto mb-4"></div>
                <p className="text-gray-600">Applying your changes...</p>
              </motion.div>
            )}

            {!isLoading && afterDataURL && (
              <motion.img
                key="after"
                src={afterDataURL}
                alt="After editing"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full object-contain"
              />
            )}

            {!isLoading && !afterDataURL && (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-gray-400"
              >
                <p>Your edited version will appear here</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
