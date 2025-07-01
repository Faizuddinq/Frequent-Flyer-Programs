import express from 'express';
import TransferRatio from '../models/TransferRatio.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get ratios for a program
router.get('/:programId', async (req, res) => {
  try {
    const { programId } = req.params;

    const ratios = await TransferRatio.find({ 
      programId, 
      archived: false 
    }).populate('creditCardId', 'name bankName');

    res.json(ratios);
  } catch (error) {
    console.error('Error fetching ratios:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all ratios with populated data
router.get('/', async (req, res) => {
  try {
    const ratios = await TransferRatio.find({ archived: false })
      .populate('programId', 'name assetName enabled')
      .populate('creditCardId', 'name bankName')
      .sort({ createdAt: -1 });

    res.json(ratios);
  } catch (error) {
    console.error('Error fetching all ratios:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create or update ratio
router.post('/', async (req, res) => {
  try {
    const { programId, creditCardId, ratio } = req.body;

    if (!programId || !creditCardId || ratio === undefined) {
      return res.status(400).json({ 
        message: 'programId, creditCardId, and ratio are required' 
      });
    }

    if (ratio < 0) {
      return res.status(400).json({ 
        message: 'Ratio must be a positive number' 
      });
    }

    // Check if ratio already exists
    let transferRatio = await TransferRatio.findOne({
      programId,
      creditCardId,
      archived: false,
    });

    if (transferRatio) {
      // Update existing ratio
      transferRatio.ratio = ratio;
      transferRatio.modifiedAt = new Date();
      await transferRatio.save();
    } else {
      // Create new ratio
      transferRatio = new TransferRatio({
        programId,
        creditCardId,
        ratio,
      });
      await transferRatio.save();
    }

    // Populate the response
    await transferRatio.populate('creditCardId', 'name bankName');
    await transferRatio.populate('programId', 'name assetName');

    res.json(transferRatio);
  } catch (error) {
    console.error('Error saving ratio:', error);
    if (typeof error === 'object' && error !== null && 'code' in error && (error as any).code === 11000) {
      res.status(400).json({ message: 'Ratio already exists for this program-card combination' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

// Update ratio
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { ratio } = req.body;

    if (ratio === undefined) {
      return res.status(400).json({ message: 'Ratio is required' });
    }

    if (ratio < 0) {
      return res.status(400).json({ 
        message: 'Ratio must be a positive number' 
      });
    }

    const transferRatio = await TransferRatio.findByIdAndUpdate(
      id,
      { ratio, modifiedAt: new Date() },
      { new: true }
    ).populate('creditCardId', 'name bankName')
     .populate('programId', 'name assetName');

    if (!transferRatio) {
      return res.status(404).json({ message: 'Ratio not found' });
    }

    res.json(transferRatio);
  } catch (error) {
    console.error('Error updating ratio:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Archive ratio
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const transferRatio = await TransferRatio.findByIdAndUpdate(
      id,
      { archived: true, modifiedAt: new Date() },
      { new: true }
    );

    if (!transferRatio) {
      return res.status(404).json({ message: 'Ratio not found' });
    }

    res.json({ message: 'Ratio archived successfully' });
  } catch (error) {
    console.error('Error archiving ratio:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;