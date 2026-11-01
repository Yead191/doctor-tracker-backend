import app from '../src/app';
import mongoose from 'mongoose';
import config from '../src/config';
import { seedSuperAdmin } from '../src/DB/seedAdmin';
import { seedSampleData } from '../src/DB/seedData';
import { Request, Response } from 'express';

let isConnected = false;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(config.database_url as string);
    if (!isConnected) {
      isConnected = true;
      await seedSuperAdmin();
      await seedSampleData();
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export default async function handler(req: Request, res: Response) {
  try {
    await connectDB();
    return app(req, res);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to connect to database',
      error: error?.message || error,
    });
  }
}

