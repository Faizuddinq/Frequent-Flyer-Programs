import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import CreditCard from '../models/CreditCard.js';
import FrequentFlyerProgram from '../models/FrequentFlyerProgram.js';

export const seedDatabase = async () => {
  try {
    // Seed admin user
    const existingUser = await User.findOne({ username: 'admin@gmail.com' });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('admin@pwd', 10);
      const adminUser = new User({
        username: 'admin@gmail.com',
        password: hashedPassword,
      });
      await adminUser.save();
      console.log('Admin user created');
    }

    // Seed credit cards with your specified data format
    const existingCards = await CreditCard.countDocuments();
    if (existingCards === 0) {
      const creditCards = [
        { 
          name: 'Air India Signature', 
          bankName: 'SBI',
          archived: false 
        },
        { 
          name: 'Rewards', 
          bankName: 'AXIS',
          archived: false 
        },
        { 
          name: 'First Preferred credit card', 
          bankName: 'YES',
          archived: false 
        },
        // Additional cards for variety
        { name: 'Sapphire Preferred', bankName: 'Chase', archived: false },
        { name: 'Gold Card', bankName: 'American Express', archived: false },
        { name: 'Venture Rewards', bankName: 'Capital One', archived: false },
        { name: 'Magnus Credit Card', bankName: 'Axis Bank', archived: false },
        { name: 'Platinum Card', bankName: 'American Express', archived: false },
      ];

      await CreditCard.insertMany(creditCards);
      console.log('Credit cards seeded with total data of', creditCards.length);
    }

    // Seed frequent flyer programs with your specified data format
    const existingPrograms = await FrequentFlyerProgram.countDocuments();
    if (existingPrograms === 0) {
      const programs = [
        {
          name: 'Royal Orchid Plus',
          assetName: 'https://res.cloudinary.com/demo/image/upload/v1234567890/programs/royal-orchid-plus.svg',
          enabled: true,
          archived: false
        },
        {
          name: 'KrisFlyer',
          assetName: 'https://res.cloudinary.com/demo/image/upload/v1234567890/programs/krisflyer.svg',
          enabled: true,
          archived: false
        },
        {
          name: 'Asiana Club',
          assetName: 'https://res.cloudinary.com/demo/image/upload/v1234567890/programs/asiana-club.svg',
          enabled: true,
          archived: false
        },
        // Additional programs for variety
        {
          name: 'Air India Flying Returns',
          assetName: 'https://res.cloudinary.com/demo/image/upload/v1234567890/programs/air-india.svg',
          enabled: true,
          archived: false
        },
        {
          name: 'IndiGo 6E Rewards',
          assetName: 'https://res.cloudinary.com/demo/image/upload/v1234567890/programs/indigo.svg',
          enabled: true,
          archived: false
        },
        {
          name: 'Vistara Club Vistara',
          assetName: 'https://res.cloudinary.com/demo/image/upload/v1234567890/programs/vistara.svg',
          enabled: false,
          archived: false
        },
        {
          name: 'SpiceJet SpiceClub',
          assetName: 'https://res.cloudinary.com/demo/image/upload/v1234567890/programs/spicejet.svg',
          enabled: true,
          archived: false
        },
        {
          name: 'Emirates Skywards',
          assetName: 'https://res.cloudinary.com/demo/image/upload/v1234567890/programs/emirates.svg',
          enabled: true,
          archived: false
        }
      ];

      await FrequentFlyerProgram.insertMany(programs);
      console.log('Frequent flyer programs seeded with total data of', programs.length);
    }
  } catch (error) {
    console.error('Seeding error:', error);
  }
};