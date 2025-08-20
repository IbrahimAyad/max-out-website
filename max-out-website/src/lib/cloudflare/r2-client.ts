import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize R2 client
const R2_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || 'ea644c4a47a499ad4721449cbac587f4';
const R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = 'style-swipe';

// R2 public URL base - Use environment variable if available
const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://pub-140b3d87a1b64af6a3193ba8aa685e26.r2.dev';

// Check if credentials are properly configured (32 chars for key ID, 64 for secret)
const isR2Configured = R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && 
  R2_ACCESS_KEY_ID.length === 32 && 
  R2_SECRET_ACCESS_KEY.length === 64;

export const r2Client = isR2Configured ? new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
}) : null;

// Image variant configurations for StyleSwiper
export const IMAGE_VARIANTS = {
  thumbnail: { width: 200, height: 200, quality: 80 },
  card: { width: 400, height: 500, quality: 85 },
  swiper: { width: 600, height: 800, quality: 90 },
  full: { width: 1200, height: 1600, quality: 95 },
} as const;

export type ImageVariant = keyof typeof IMAGE_VARIANTS;

export async function uploadToR2(
  buffer: ArrayBuffer,
  key: string,
  contentType: string = 'image/png'
): Promise<string> {
  if (!r2Client) {

    throw new Error('R2 credentials not properly configured');
  }

  try {
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: Buffer.from(buffer),
      ContentType: contentType,
    });

    await r2Client.send(command);

    // Return the public URL
    return `${R2_PUBLIC_URL}/${key}`;
  } catch (error) {

    throw error;
  }
}

export async function uploadGeneratedOutfit(
  imageBuffer: ArrayBuffer,
  outfit: {
    occasion: string;
    tieColor: string;
    suitColor: string;
    shirtColor: string;
    tieStyle: string;
    season?: string;
  }
): Promise<string> {
  // Create a structured filename
  const timestamp = Date.now();
  const seasonPrefix = outfit.season ? `${outfit.season}-` : '';
  const filename = `${outfit.occasion}/${seasonPrefix}${outfit.tieColor}-${outfit.suitColor}-${outfit.tieStyle}-${timestamp}.png`;

  return uploadToR2(imageBuffer, filename);
}

// Generate presigned URL for private access
export async function getPresignedUrl(
  key: string,
  expiresIn: number = 3600 // 1 hour default
): Promise<string> {
  if (!r2Client) {
    throw new Error('R2 credentials not properly configured');
  }

  try {
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });

    const url = await getSignedUrl(r2Client, command, { expiresIn });
    return url;
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw new Error('Failed to generate presigned URL');
  }
}

// Delete image from R2
export async function deleteFromR2(key: string): Promise<void> {
  if (!r2Client) {
    throw new Error('R2 credentials not properly configured');
  }

  try {
    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });

    await r2Client.send(command);
  } catch (error) {
    console.error('Error deleting from R2:', error);
    throw new Error('Failed to delete image');
  }
}

// List images in a folder
export async function listImagesFromR2(
  prefix: string,
  maxKeys: number = 100
): Promise<Array<{ key: string; url: string; lastModified?: Date }>> {
  if (!r2Client) {
    throw new Error('R2 credentials not properly configured');
  }

  try {
    const command = new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
      Prefix: prefix,
      MaxKeys: maxKeys,
    });

    const response = await r2Client.send(command);
    
    if (!response.Contents) {
      return [];
    }

    return response.Contents.map(item => ({
      key: item.Key!,
      url: `${R2_PUBLIC_URL}/${item.Key}`,
      lastModified: item.LastModified,
    }));
  } catch (error) {
    console.error('Error listing images from R2:', error);
    throw new Error('Failed to list images');
  }
}

// Helper function to generate unique file names
export function generateFileName(originalName: string, variant?: ImageVariant): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop();
  const baseName = originalName.split('.').slice(0, -1).join('.');
  
  if (variant) {
    return `${baseName}-${variant}-${timestamp}-${randomString}.${extension}`;
  }
  
  return `${baseName}-${timestamp}-${randomString}.${extension}`;
}

// Upload style swiper images with categorization
export async function uploadStyleSwiperImage(
  file: File,
  category: string,
  metadata?: Record<string, string>
): Promise<{ key: string; url: string }> {
  if (!r2Client) {
    throw new Error('R2 credentials not properly configured');
  }

  const fileName = generateFileName(file.name, 'swiper');
  const key = `style-swiper/${category}/${fileName}`;
  
  const buffer = await file.arrayBuffer();
  const url = await uploadToR2(buffer, key, file.type);
  
  return { key, url };
}

// Get all style swiper images by category
export async function getStyleSwiperImages(category: string = 'all') {
  const prefix = category === 'all' ? 'style-swiper/' : `style-swiper/${category}/`;
  const images = await listImagesFromR2(prefix);
  
  return images.map(img => ({
    ...img,
    category: img.key.split('/')[1], // Extract category from path
  }));
}