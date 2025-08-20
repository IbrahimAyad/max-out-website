'use client';

import { useState } from 'react';
import { uploadImage, listImages, deleteImage } from '@/lib/cloudflare/r2-client-api';

/**
 * Example component showing how to use R2 without importing AWS SDK
 * This keeps the client bundle small
 */
export function UploadExample() {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<Array<{ key: string; url: string }>>([]);
  const [message, setMessage] = useState('');

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage('Uploading...');

    try {
      // Upload through API route - no AWS SDK needed on client
      const result = await uploadImage(file, 'products', {
        category: 'suits',
        uploadedBy: 'admin',
      });

      setMessage(`Success! Image uploaded: ${result.url}`);
      
      // Refresh list
      await loadImages();
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Upload failed'}`);
    } finally {
      setUploading(false);
    }
  };

  const loadImages = async () => {
    try {
      const imageList = await listImages('products/', 20);
      setImages(imageList);
    } catch (error) {
      console.error('Failed to load images:', error);
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm('Delete this image?')) return;

    try {
      await deleteImage(key);
      setMessage('Image deleted');
      await loadImages();
    } catch (error) {
      setMessage(`Delete failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">R2 Upload (No AWS SDK on Client)</h2>
      
      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-violet-50 file:text-violet-700
            hover:file:bg-violet-100"
        />
      </div>

      {message && (
        <div className={`p-3 rounded mb-4 ${
          message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {message}
        </div>
      )}

      <button
        onClick={loadImages}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Load Images
      </button>

      <div className="grid grid-cols-3 gap-4">
        {images.map((img) => (
          <div key={img.key} className="relative group">
            <img
              src={img.url}
              alt={img.key}
              className="w-full h-48 object-cover rounded"
            />
            <button
              onClick={() => handleDelete(img.key)}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 
                         bg-red-500 text-white p-2 rounded transition-opacity"
            >
              Delete
            </button>
            <p className="text-xs mt-1 truncate">{img.key}</p>
          </div>
        ))}
      </div>
    </div>
  );
}