import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface ImageZoomModalProps {
  src: string
  alt: string
  isOpen: boolean
  onClose: () => void
}

export function ImageZoomModal({ src, alt, isOpen, onClose }: ImageZoomModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const [imageError, setImageError] = useState(false)

  // Reset error state when modal opens with new image
  useEffect(() => {
    if (isOpen) {
      setImageError(false)
    }
  }, [isOpen, src])

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Store current focus
      previousFocusRef.current = document.activeElement as HTMLElement
      
      // Focus modal after a brief delay to ensure it's rendered
      setTimeout(() => {
        modalRef.current?.focus()
      }, 100)
      
      return () => {
        // Restore focus on close
        previousFocusRef.current?.focus()
      }
    }
  }, [isOpen])
  // ESC key listener
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  // Body scroll lock with original value preservation
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isOpen])

  // Click backdrop to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={modalRef}
          tabIndex={-1}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleBackdropClick}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Zoomed image view"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Close zoom view"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Zoomed Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="max-w-[90vw] max-h-[90vh] flex items-center justify-center"
          >
            {imageError ? (
              <div className="text-white text-center p-8">
                <p className="text-xl mb-2">Failed to load image</p>
                <p className="text-sm text-white/70">The image could not be displayed</p>
              </div>
            ) : (
              <img
                src={src}
                alt={alt}
                onError={() => setImageError(true)}
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              />
            )}
          </motion.div>

          {/* Click outside hint */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            Click outside or press ESC to close
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
