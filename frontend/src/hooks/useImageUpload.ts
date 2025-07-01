import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api';

interface CloudinarySignature {
  signature: string;
  timestamp: number;
  api_key: string;
  folder: string;
  public_id: string;
  cloudName: string;
  uploadUrl: string;
}

interface UseImageUploadReturn {
  uploadImage: (file: File, folder?: string) => Promise<string | null>;
  deleteImage: (url: string) => Promise<boolean>;
  uploading: boolean;
  progress: number;
}

export const useImageUpload = (): UseImageUploadReturn => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadImage = async (file: File, folder: string = 'programs'): Promise<string | null> => {
    if (!file) {
      toast.error('No file selected');
      return null;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Only images are allowed.');
      return null;
    }

    // Validate file size (10MB limit for Cloudinary)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('File size too large. Maximum size is 10MB.');
      return null;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Step 1: Get upload signature from backend
      const signatureResponse = await api.post('/api/upload/signature', { folder });
      const signatureData: CloudinarySignature = signatureResponse.data;

      // Step 2: Prepare form data for Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signatureData.signature);
      formData.append('timestamp', signatureData.timestamp.toString());
      formData.append('api_key', signatureData.api_key);
      formData.append('folder', signatureData.folder);
      formData.append('public_id', signatureData.public_id);

      // Step 3: Upload to Cloudinary (without Authorization header)
      const uploadResponse = await api.post(signatureData.uploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',

        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          }
        },
        
        transformRequest: [function (data, headers) {
          
          delete headers['Authorization'];
          return data;
        }],
      });

      const { secure_url } = uploadResponse.data;
      toast.success('Image uploaded successfully');
      return secure_url;
    } catch (error: any) {
      console.error('Upload error:', error);
      
      // More detailed error logging
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
      
      toast.error(error.response?.data?.error?.message || error.response?.data?.message || 'Failed to upload image');
      return null;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const deleteImage = async (url: string): Promise<boolean> => {
    if (!url) return false;

    try {
      await api.delete('/api/upload/image', {
        data: { url },
      });

      toast.success('Image deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete image');
      return false;
    }
  };

  return {
    uploadImage,
    deleteImage,
    uploading,
    progress,
  };
};