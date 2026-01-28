import * as React from 'react'
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { convertImageToBase64, validateImageSize } from '@/lib/gemini/visionClient'

interface ImageUploadProps {
  onImageSelect: (base64: string, mimeType: string) => void
  onImageRemove: () => void
  currentImage: string | null
  disabled?: boolean
}

export function ImageUpload({
  onImageSelect,
  onImageRemove,
  currentImage,
  disabled = false
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  // Track drag enter/leave events to prevent flicker when hovering over child elements
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_dragCounter, setDragCounter] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setDragCounter(prev => {
        const newCount = prev + 1
        setIsDragging(true)
        return newCount
      })
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter(prev => {
      const newCount = prev - 1
      if (newCount === 0) {
        setIsDragging(false)
      }
      return newCount
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter(0)
    setIsDragging(false)

    if (disabled) return

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      await processFile(files[0])
    }
  }

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      await processFile(files[0])
    }
  }

  const processFile = async (file: File) => {
    setError(null)

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg']
    if (!validTypes.includes(file.type)) {
      setError('Please upload a PNG or JPG image')
      return
    }

    // Validate file size
    const isValidSize = await validateImageSize(file)
    if (!isValidSize) {
      setError('Image must be less than 5MB')
      return
    }

    try {
      const base64 = await convertImageToBase64(file)
      onImageSelect(base64, file.type)
    } catch (err) {
      setError('Failed to process image')
      console.error('Image processing error:', err)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        onChange={handleFileInput}
        className="hidden"
        disabled={disabled}
      />

      {!currentImage ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className={cn(
            'border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors',
            isDragging
              ? 'border-subject-blue bg-subject-blue/10'
              : 'border-gray-300 hover:border-subject-blue hover:bg-gray-50',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-medium text-gray-700 mb-2">
            Drop your drawing here
          </p>
          <p className="text-sm text-gray-500">
            or click to browse (PNG, JPG - max 5MB)
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative rounded-lg overflow-hidden border-2 border-subject-blue"
        >
          <img
            src={`data:image/jpeg;base64,${currentImage}`}
            alt="Uploaded drawing"
            className="w-full h-auto max-h-96 object-contain bg-gray-50"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={onImageRemove}
            disabled={disabled}
            className="absolute top-2 right-2 bg-white/90 hover:bg-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </motion.div>
      )}

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 mt-2"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}
