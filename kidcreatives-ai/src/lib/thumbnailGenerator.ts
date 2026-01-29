/**
 * Generate a thumbnail from a base64 image
 * @param base64Image - Base64 encoded image string (with or without data URL prefix)
 * @param maxWidth - Maximum width for thumbnail (default: 300px)
 * @param maxHeight - Maximum height for thumbnail (default: 300px)
 * @returns Promise resolving to base64 thumbnail string
 */
export async function generateThumbnail(
  base64Image: string,
  maxWidth: number = 300,
  maxHeight: number = 300
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    
    const cleanup = () => {
      img.onload = null
      img.onerror = null
      img.src = ''
    }
    
    img.onload = () => {
      try {
        // Calculate scaled dimensions with both width and height constraints
        const aspectRatio = img.height / img.width
        let thumbnailWidth = Math.min(img.width, maxWidth)
        let thumbnailHeight = thumbnailWidth * aspectRatio
        
        // If height exceeds max, recalculate based on height
        if (thumbnailHeight > maxHeight) {
          thumbnailHeight = maxHeight
          thumbnailWidth = thumbnailHeight / aspectRatio
        }

        // Create canvas
        const canvas = document.createElement('canvas')
        canvas.width = thumbnailWidth
        canvas.height = thumbnailHeight

        // Draw scaled image
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          cleanup()
          reject(new Error('Failed to get canvas context'))
          return
        }

        ctx.drawImage(img, 0, 0, thumbnailWidth, thumbnailHeight)

        // Convert to base64
        const thumbnail = canvas.toDataURL('image/jpeg', 0.7)
        resolve(thumbnail)
      } catch (error) {
        console.error('Error generating thumbnail:', error)
        reject(error)
      } finally {
        cleanup()
      }
    }

    img.onerror = () => {
      cleanup()
      reject(new Error('Failed to load image for thumbnail generation'))
    }

    // Handle both data URL and raw base64
    if (base64Image.startsWith('data:')) {
      img.src = base64Image
    } else {
      img.src = `data:image/png;base64,${base64Image}`
    }
  })
}
