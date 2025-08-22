/**
 * Cloudflare Worker Integration Service
 * Connects the Next.js app with the R2-Supabase sync worker
 */

interface WorkerResponse<T = any> {
  success?: boolean;
  total?: number;
  data?: T;
  error?: string;
  synced?: any[];
  failed?: any[];
  images?: any[];
}

interface ImageSyncOptions {
  updateExisting?: boolean;
  category?: string;
  limit?: number;
}

class CloudflareImageSyncService {
  private workerUrl: string;
  private apiKey?: string;

  constructor() {
    // Use environment variable for worker URL in production
    this.workerUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL || 
                     'https://kct-r2-supabase-sync.ibrahim-ayad.workers.dev';
    this.apiKey = process.env.CLOUDFLARE_WORKER_API_KEY;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<WorkerResponse<T>> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(this.apiKey && { 'X-API-Key': this.apiKey }),
    };

    try {
      const response = await fetch(`${this.workerUrl}${endpoint}`, {
        ...options,
        headers: { ...headers, ...options?.headers },
      });

      if (!response.ok) {
        throw new Error(`Worker request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Cloudflare Worker request failed:`, error);
      throw error;
    }
  }

  /**
   * List all images in R2 bucket
   */
  async listImages(): Promise<WorkerResponse> {
    return this.request('/list-images');
  }

  /**
   * Bulk import all R2 images to Supabase
   * This is the main function to fix missing images
   */
  async bulkImport(): Promise<WorkerResponse> {
    return this.request('/bulk-import', { method: 'POST' });
  }

  /**
   * Verify and fix broken image URLs in database
   * Addresses the 404 errors from your logs
   */
  async verifyAndFixImages(): Promise<WorkerResponse> {
    return this.request('/verify-images');
  }

  /**
   * Sync specific images to Supabase
   */
  async syncImages(images: any[], options: ImageSyncOptions = {}): Promise<WorkerResponse> {
    return this.request('/sync-to-supabase', {
      method: 'POST',
      body: JSON.stringify({
        images,
        updateExisting: options.updateExisting ?? true,
      }),
    });
  }

  /**
   * Convert images to WebP format for optimization
   */
  async convertToWebP(imagePaths?: string[]): Promise<WorkerResponse> {
    const endpoint = imagePaths ? '/convert-to-webp' : '/batch-convert-webp';
    return this.request(endpoint, {
      method: 'POST',
      ...(imagePaths && { body: JSON.stringify({ imagePaths }) }),
    });
  }

  /**
   * Get bundle URLs for product collections
   */
  async getBundleUrls(webpFormat = true): Promise<WorkerResponse> {
    const endpoint = webpFormat ? '/bundle-urls-webp' : '/bundle-urls';
    return this.request(endpoint);
  }

  /**
   * Find and organize bundle images
   */
  async findBundleImages(): Promise<WorkerResponse> {
    return this.request('/find-bundle-images', { method: 'POST' });
  }

  /**
   * Auto-fix the specific errors from your logs
   * Addresses: product.webp, photo-1521505772811-d7e4ec1b5c7b, category images
   */
  async autoFixImageErrors(): Promise<{
    verification: WorkerResponse;
    bulkImport: WorkerResponse;
    conversion: WorkerResponse;
  }> {
    console.log('🔧 Starting automatic image error fixes...');
    
    // Step 1: Verify and fix existing broken URLs
    console.log('1️⃣ Verifying and fixing broken image URLs...');
    const verification = await this.verifyAndFixImages();
    
    // Step 2: Bulk import any missing images from R2
    console.log('2️⃣ Bulk importing missing images from R2...');
    const bulkImport = await this.bulkImport();
    
    // Step 3: Convert to WebP for optimization
    console.log('3️⃣ Converting images to WebP format...');
    const conversion = await this.convertToWebP();
    
    console.log('✅ Automatic image fixes completed!');
    
    return {
      verification,
      bulkImport,
      conversion,
    };
  }

  /**
   * Get worker status and available endpoints
   */
  async getWorkerStatus(): Promise<WorkerResponse> {
    try {
      return await this.request('/');
    } catch (error) {
      return {
        success: false,
        error: 'Worker not accessible',
      };
    }
  }
}

// Export singleton instance
export const cloudflareImageSync = new CloudflareImageSyncService();

// Export types for use in other files  
export type { WorkerResponse, ImageSyncOptions };