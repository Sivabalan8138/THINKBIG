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

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', process.env.FRONTEND_URL || ''],
  credentials: true
}));
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

// Health Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    database: 'connected',
    time: new Date().toISOString()
  });
});

const requiredEnvVars = [
  'PORT', 'MONGO_URI', 'JWT_SECRET', 'EMAIL_USER', 'EMAIL_PASS',
  'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'
];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.warn(`Missing Environment Variable:\n${envVar}`);
  }
});

const startServer = async () => {
  try {
    await connectDB();
    await seedAdmin();
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log('Server Started');
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Railway Port: ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
