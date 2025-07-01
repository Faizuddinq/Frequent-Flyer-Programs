import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import ffpRoutes from './routes/ffp.js';
import creditCardRoutes from './routes/creditCard.js';
import ratioRoutes from './routes/ratio.js';
import uploadRoutes from './routes/upload.js';
import { seedDatabase } from './utils/seed.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in .env');
  process.exit(1); 
}

mongoose.connect(MONGODB_URI, {
      dbName: 'pneuma-frequent-flyer-program'
    })
  .then(async () => {
    console.log('Connected to MongoDB');
    await seedDatabase();
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ffps', ffpRoutes);
app.use('/api/credit-cards', creditCardRoutes);
app.use('/api/ratios', ratioRoutes);
app.use('/api/upload', uploadRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.send('Welcome to Pneuma Frequent Flyer Program Portal API');
});
// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'FFP Portal API is running' });
});

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: error.message })
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});