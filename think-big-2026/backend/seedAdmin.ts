import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from './src/models/User';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/think-big-2026');
    console.log('Connected to MongoDB');

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('vsbeeeclub', salt);

    await User.findOneAndUpdate(
      { username: 'ELECTRICAL-CLUB' },
      { username: 'ELECTRICAL-CLUB', passwordHash, role: 'admin', isFirstLogin: false },
      { upsert: true }
    );
    console.log('Admin user successfully seeded (or updated)!');
    console.log('Username: ELECTRICAL-CLUB');
    console.log('Password: vsbeeeclub');
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed admin:', error);
    process.exit(1);
  }
};

seedAdmin();
