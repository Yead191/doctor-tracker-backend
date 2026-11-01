import app from '../src/app';
import mongoose from 'mongoose';
import config from '../src/config';
import { seedSuperAdmin } from '../src/DB/seedAdmin';
import { seedSampleData } from '../src/DB/seedData';

// --- MONGODB CONNECTION CACHING FOR VERCEL SERVERLESS ---
let isSeeded = false;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  const uri = process.env.DATABASE_URL || config.database_url;
  if (!uri || uri.includes('127.0.0.1')) {
    console.error(
      'DATABASE_URL warning: No remote MongoDB Atlas URI found in environment variables.'
    );
  }

  await mongoose.connect(uri as string, {
    serverSelectionTimeoutMS: 8000,
  });

  if (!isSeeded) {
    isSeeded = true;
    try {
      await seedSuperAdmin();
      await seedSampleData();
    } catch (err) {
      console.warn('Initial seeding warning in serverless:', err);
    }
  }

  return mongoose.connection;
};

// Middleware to ensure DB connection before handling any API request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error: any) {
    console.error('Database connection error in Serverless Function:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection failed. Please verify DATABASE_URL and MongoDB Atlas Network Access (0.0.0.0/0).',
      error: error?.message || String(error),
    });
  }
});

export default app;
