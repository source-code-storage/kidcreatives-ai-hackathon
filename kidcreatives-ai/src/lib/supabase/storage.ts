import { supabase } from './client'

/**
 * Convert base64 string to File object
 * Uses Blob API for better memory efficiency with large files
 */
function base64ToFile(base64: string, filename: string, mimeType: string): File {
  const arr = base64.split(',')
  const bstr = atob(arr[1])
  
  // Use Blob API for better memory management
  const blob = new Blob([new Uint8Array(
    Array.from(bstr).map(char => char.charCodeAt(0))
  )], { type: mimeType })
  
  return new File([blob], filename, { type: mimeType })
}

/**
 * Upload image to Supabase Storage
 */
export async function uploadImage(
  fileOrBase64: File | string,
  bucket: 'creation-images' | 'creation-thumbnails',
  path: string
): Promise<string> {
  try {
    let file: File

    if (typeof fileOrBase64 === 'string') {
      // Convert base64 to File
      const mimeType = fileOrBase64.match(/data:([^;]+);/)?.[1] || 'image/jpeg'
      const extension = mimeType.split('/')[1]
      file = base64ToFile(fileOrBase64, `image.${extension}`, mimeType)
    } else {
      file = fileOrBase64
    }

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (error) throw error

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return publicUrl
  } catch (error) {
    console.error('Upload image error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    // Check for common storage errors
    if (errorMessage.includes('Bucket not found') || errorMessage.includes('bucket_id')) {
      throw new Error('Storage not configured. Please create storage buckets in Supabase Dashboard. See SUPABASE_STATUS.md for instructions.')
    }
    
    throw new Error(`Failed to upload image: ${errorMessage}`)
  }
}

/**
 * Upload PDF to Supabase Storage
 */
export async function uploadPDF(
  pdfBase64: string,
  path: string
): Promise<string> {
  try {
    const file = base64ToFile(pdfBase64, 'certificate.pdf', 'application/pdf')

    const { data, error } = await supabase.storage
      .from('creation-certificates')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (error) throw error

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('creation-certificates')
      .getPublicUrl(data.path)

    return publicUrl
  } catch (error) {
    console.error('Upload PDF error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    // Check for common storage errors
    if (errorMessage.includes('Bucket not found') || errorMessage.includes('bucket_id')) {
      throw new Error('Storage not configured. Please create storage buckets in Supabase Dashboard. See SUPABASE_STATUS.md for instructions.')
    }
    
    throw new Error(`Failed to upload PDF: ${errorMessage}`)
  }
}

/**
 * Delete file from Supabase Storage
 */
export async function deleteFile(
  bucket: 'creation-images' | 'creation-thumbnails' | 'creation-certificates',
  path: string
): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) throw error
  } catch (error) {
    console.error('Delete file error:', error)
    throw new Error(`Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Get signed URL for private file access
 */
export async function getSignedUrl(
  bucket: 'creation-images' | 'creation-thumbnails' | 'creation-certificates',
  path: string,
  expiresIn: number = 3600
): Promise<string> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn)

    if (error) throw error
    if (!data?.signedUrl) throw new Error('No signed URL returned')

    return data.signedUrl
  } catch (error) {
    console.error('Get signed URL error:', error)
    throw new Error(`Failed to get signed URL: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
