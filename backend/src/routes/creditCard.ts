import express from 'express';
import CreditCard from '../models/CreditCard.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all credit cards
router.get('/', async (req, res) => {
  try {
    const creditCards = await CreditCard.find({ archived: false })
      .sort({ bankName: 1, name: 1 });
    res.json(creditCards);
  } catch (error) {
    console.error('Error fetching credit cards:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create credit card
router.post('/', async (req, res) => {
  try {
    const { name, bankName } = req.body;

    const creditCard = new CreditCard({
      name,
      bankName,
    });

    await creditCard.save();
    res.status(201).json(creditCard);
  } catch (error) {
    console.error('Error creating credit card:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;