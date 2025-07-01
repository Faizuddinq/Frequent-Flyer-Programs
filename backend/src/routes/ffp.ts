import express from 'express';
import FrequentFlyerProgram from '../models/FrequentFlyerProgram.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all programs
router.get('/', async (req, res) => {
  try {
    const programs = await FrequentFlyerProgram.find({ archived: false })
      .sort({ createdAt: -1 });
    res.json(programs);
  } catch (error) {
    console.error('Error fetching programs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create program
router.post('/', async (req, res) => {
  try {
    const { name, assetName, enabled } = req.body;

    const program = new FrequentFlyerProgram({
      name,
      assetName,
      enabled: enabled !== undefined ? enabled : true,
    });

    await program.save();
    res.status(201).json(program);
  } catch (error) {
    console.error('Error creating program:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update program
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const program = await FrequentFlyerProgram.findByIdAndUpdate(
      id,
      { ...updates, modifiedAt: new Date() },
      { new: true }
    );

    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    res.json(program);
  } catch (error) {
    console.error('Error updating program:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Archive program (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const program = await FrequentFlyerProgram.findByIdAndUpdate(
      id,
      { archived: true, modifiedAt: new Date() },
      { new: true }
    );

    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    res.json({ message: 'Program archived successfully' });
  } catch (error) {
    console.error('Error archiving program:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;