import type { GalleryItem } from '@/types/GalleryTypes'

const STORAGE_KEY = 'kidcreatives_gallery'

/**
 * Generate a simple UUID v4
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/**
 * Save a new item to gallery
 */
export function saveToGallery(item: Omit<GalleryItem, 'id' | 'createdAt'>): void {
  try {
    const items = getGalleryItems()
    const newItem: GalleryItem = {
      ...item,
      id: generateUUID(),
      createdAt: Date.now()
    }
    items.push(newItem)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch (error) {
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      throw new Error('Gallery is full! Delete some creations to save more.')
    }
    console.error('Failed to save to gallery:', error)
    throw new Error('Failed to save creation. Please try again.')
  }
}

/**
 * Get all gallery items
 */
export function getGalleryItems(): GalleryItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return []
    return JSON.parse(data) as GalleryItem[]
  } catch (error) {
    console.error('Failed to load gallery, clearing corrupted data:', error)
    localStorage.removeItem(STORAGE_KEY)
    return []
  }
}

/**
 * Delete an item from gallery by id
 */
export function deleteFromGallery(id: string): void {
  try {
    const items = getGalleryItems()
    const filtered = items.filter(item => item.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  } catch (error) {
    console.error('Failed to delete from gallery:', error)
    throw new Error('Failed to delete creation. Please try again.')
  }
}

/**
 * Clear all gallery items
 */
export function clearGallery(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear gallery:', error)
    throw new Error('Failed to clear gallery. Please try again.')
  }
}
