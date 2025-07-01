import express from 'express';
import { generateUploadSignature, deleteImage, extractPublicIdFromUrl } from '../config/cloudinary.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Generate signature for Cloudinary upload
router.post('/signature', async (req, res) => {
  try {
    const { folder = 'programs' } = req.body;

    const signatureData = generateUploadSignature(folder);

    res.json({
      ...signatureData,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      uploadUrl: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
    });
  } catch (error: any) {
    console.error('Error generating signature:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to generate upload signature' 
    });
  }
});

// Delete uploaded image
router.delete('/image', async (req, res) => {
  try {
    const { url, public_id } = req.body;

    if (!url && !public_id) {
      return res.status(400).json({ 
        message: 'Either url or public_id is required' 
      });
    }

    let imagePublicId = public_id;
    if (!imagePublicId && url) {
      imagePublicId = extractPublicIdFromUrl(url);
    }

    if (!imagePublicId) {
      return res.status(400).json({ 
        message: 'Invalid image URL or public_id' 
      });
    }

    await deleteImage(imagePublicId);

    res.json({ 
      message: 'Image deleted successfully',
      public_id: imagePublicId 
    });
  } catch (error: any) {
    console.error('Error deleting image:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to delete image' 
    });
  }
});

// Get image info
router.get('/image-info/:public_id', async (req, res) => {
  try {
    const { public_id } = req.params;
    
    if (!public_id) {
      return res.status(400).json({ 
        message: 'Public ID is required' 
      });
    }

    const optimizedUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/q_auto,f_auto/${public_id}`;

    res.json({
      public_id,
      url: optimizedUrl,
      exists: true, // In a real implementation, you might want to check if the image exists
    });
  } catch (error: any) {
    console.error('Error getting image info:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to get image info' 
    });
  }
});

export default router;