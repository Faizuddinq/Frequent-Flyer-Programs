import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  public_id: string;
  secure_url: string;
  url: string;
}

export const generateUploadSignature = (
  folder: string = 'programs'
): { signature: string; timestamp: number; api_key: string; folder: string; public_id: string } => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const public_id = `${folder}/${uuidv4()}`;
    
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder,
        public_id,
      },
      process.env.CLOUDINARY_API_SECRET!
    );

    return {
      signature,
      timestamp,
      api_key: process.env.CLOUDINARY_API_KEY!,
      folder,
      public_id,
    };
  } catch (error) {
    console.error('Error generating upload signature:', error);
    throw new Error('Failed to generate upload signature');
  }
};

export const deleteImage = async (public_id: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(public_id);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error('Failed to delete image');
  }
};

export const extractPublicIdFromUrl = (url: string): string | null => {
  try {
    // Extract public_id from Cloudinary URL
    const matches = url.match(/\/v\d+\/(.+)\.(jpg|jpeg|png|gif|webp)$/i);
    return matches ? matches[1] : null;
  } catch {
    return null;
  }
};

export const getOptimizedUrl = (public_id: string, options: any = {}): string => {
  return cloudinary.url(public_id, {
    quality: 'auto',
    fetch_format: 'auto',
    ...options,
  });
};

export default cloudinary;