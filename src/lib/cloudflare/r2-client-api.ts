/**
 * Client-side R2 API wrapper
 * This file is for browser use and doesn't import AWS SDK
 * All R2 operations go through API routes
 */

export interface UploadResult {
  key: string;
  url: string;
  variants?: Record<string, string>;
}

export interface ImageMetadata {
  category?: string;
  occasion?: string;
  colors?: string[];
  tags?: string[];
  [key: string]: any;
}

/**
 * Upload an image to R2 via API route
 */
export async function uploadImage(
  file: File,
  category: string = 'general',
  metadata?: ImageMetadata
): Promise<UploadResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('category', category);
  
  if (metadata) {
    formData.append('metadata', JSON.stringify(metadata));
  }

  const response = await fetch('/api/r2/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Upload failed');
  }

  return response.json();
}

/**
 * Upload style swiper image via API
 */
export async function uploadStyleSwiperImage(
  file: File,
  category: string,
  variantType: string = 'style-swiper'
): Promise<UploadResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('category', category);
  formData.append('variantType', variantType);

  const response = await fetch('/api/style-swiper/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Upload failed');
  }

  return response.json();
}

/**
 * Delete image from R2 via API
 */
export async function deleteImage(key: string): Promise<void> {
  const response = await fetch('/api/r2/delete', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ key }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Delete failed');
  }
}

/**
 * List images from R2 via API
 */
export async function listImages(
  prefix: string = '',
  maxKeys: number = 100
): Promise<Array<{ key: string; url: string; lastModified?: string }>> {
  const params = new URLSearchParams({
    prefix,
    maxKeys: maxKeys.toString(),
  });

  const response = await fetch(`/api/r2/list?${params}`, {
    method: 'GET',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'List failed');
  }

  return response.json();
}

/**
 * Get presigned URL for private access
 */
export async function getPresignedUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  const params = new URLSearchParams({
    key,
    expiresIn: expiresIn.toString(),
  });

  const response = await fetch(`/api/r2/presigned?${params}`, {
    method: 'GET',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get presigned URL');
  }

  const data = await response.json();
  return data.url;
}

/**
 * Upload generated outfit bundle
 */
export async function uploadGeneratedOutfit(
  imageBlob: Blob,
  outfit: {
    occasion: string;
    tieColor: string;
    suitColor: string;
    shirtColor: string;
    tieStyle: string;
    season?: string;
  }
): Promise<string> {
  const formData = new FormData();
  formData.append('image', imageBlob);
  formData.append('outfit', JSON.stringify(outfit));

  const response = await fetch('/api/bundle-generator', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Bundle generation failed');
  }

  const data = await response.json();
  return data.url;
}

/**
 * Batch upload multiple images
 */
export async function batchUploadImages(
  files: File[],
  category: string = 'general',
  onProgress?: (progress: number) => void
): Promise<UploadResult[]> {
  const results: UploadResult[] = [];
  const total = files.length;

  for (let i = 0; i < files.length; i++) {
    try {
      const result = await uploadImage(files[i], category);
      results.push(result);
      
      if (onProgress) {
        onProgress(((i + 1) / total) * 100);
      }
    } catch (error) {
      console.error(`Failed to upload ${files[i].name}:`, error);
      // Continue with other files
    }
  }

  return results;
}

/**
 * Helper to convert base64 to blob
 */
export function base64ToBlob(base64: string, mimeType: string = 'image/png'): Blob {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

/**
 * Helper to generate unique filename
 */
export function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop();
  const baseName = originalName.split('.').slice(0, -1).join('.');
  
  return `${baseName}-${timestamp}-${randomString}.${extension}`;
}