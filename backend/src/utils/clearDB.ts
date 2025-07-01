import mongoose from "mongoose";
import dotenv from 'dotenv';
import User from "../models/User";
import CreditCard from "../models/CreditCard";
import FrequentFlyerProgram from "../models/FrequentFlyerProgram";

dotenv.config();
// Cleanup function

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ Error: MONGODB_URI is not defined in .env');
  process.exit(1); 
}
const clearDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: 'pneuma-frequent-flyer-program',
    });

    console.log('🔗 Connected to MongoDB');

    // Delete admin user only
    const userResult = await User.deleteOne({ username: 'admin@gmail.com' });
    if (userResult.deletedCount) {
      console.log('🗑️ Admin user deleted');
    } else {
      console.log('ℹ️ Admin user not found');
    }

    // Delete all credit cards
    const ccResult = await CreditCard.deleteMany({});
    console.log(`🧾 Credit cards deleted: ${ccResult.deletedCount}`);

    // Delete all frequent flyer programs
    const ffpResult = await FrequentFlyerProgram.deleteMany({});
    console.log(`✈️ Frequent flyer programs deleted: ${ffpResult.deletedCount}`);

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error while clearing the database:', error);
    process.exit(1);
  }
};

// Execute the cleanup
clearDatabase();