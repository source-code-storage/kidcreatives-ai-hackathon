/**
 * Centralized image path constants
 * Prevents hardcoded paths scattered throughout components
 */

export const IMAGES = {
  landing: {
    originalDrawing: '/Images/original-image-3.jpg',
    aiEnhanced: '/Images/ai-enhanced-image-3.jpg',
    certificate: '/Images/certificate-1.jpg',
    promptCard: '/Images/prompt-card.jpg',
  },
} as const

export type ImagePaths = typeof IMAGES
