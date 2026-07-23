import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import User from './models/User';
import bcrypt from 'bcrypt';
import authRoutes from './routes/authRoutes';
import teamRoutes from './routes/teamRoutes';
import evaluationRoutes from './routes/evaluationRoutes';
import certificateRoutes from './routes/certificateRoutes';
import settingsRoutes from './routes/settingsRoutes';
import activityRoutes from './routes/activityRoutes';
import attendanceRoutes from './routes/attendanceRoutes';
import reportRoutes from './routes/reportRoutes';
import path from 'path';

dotenv.config();

const app = express();

// Connect to Database
const seedAdmin = async () => {
  try {
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount === 0) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('vsbeeeclub', salt);
      await User.create({
        username: 'ELECTRICAL-CLUB',
        passwordHash,
        role: 'admin',
        isFirstLogin: true,
      });
      console.log('Default Admin seeded successfully: ELECTRICAL-CLUB');
    }
  } catch (error) {
    console.error('Failed to seed admin:', error);
  }
};

connectDB().then(() => {
  seedAdmin();
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/reports', reportRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('THINK BIG 2026 API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
