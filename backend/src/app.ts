import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import router from './routes';
import { Morgan } from './shared/morgen';
import rateLimit from 'express-rate-limit';
import ApiError from './errors/ApiError';
import session from 'express-session';
import requestIp from 'request-ip';
import { handleChunkUpload } from './helpers/handleChunkUpload';
import { fileStreamHandler } from './helpers/fileStreamingHelper';
import mongoose from 'mongoose';
import config from './config';
import { seedSuperAdmin } from './DB/seedAdmin';
import { seedSampleData } from './DB/seedData';

const app = express();
app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return (
      req.clientIp ||
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.ip ||
      '127.0.0.1'
    );
  },
  handler: (req, res, next, options) => {
    throw new ApiError(options?.statusCode, `Rate limit exceeded. Try again in ${options.windowMs / 60000} minutes.`);
  },
});

app.use(
  session({
    secret: 'doctor_tracker_session_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(requestIp.mw());
app.use(limiter);

// Morgan logger
app.use(Morgan.successHandler);
app.use(Morgan.errorHandler);

// Body parser & CORS
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File streaming
app.use('/files/:folder/:file', fileStreamHandler);

// Chunk upload
app.post('/api/v1/upload/chunk', handleChunkUpload);

// Ensure DB connection in Serverless environments
let isSeeded = false;
app.use(async (req: Request, res: Response, next: NextFunction) => {
  if (mongoose.connection.readyState >= 1) {
    return next();
  }
  try {
    const dbUrl = process.env.DATABASE_URL || config.database_url;
    if (dbUrl) {
      await mongoose.connect(dbUrl as string, { serverSelectionTimeoutMS: 8000 });
      if (!isSeeded) {
        isSeeded = true;
        seedSuperAdmin().catch(() => {});
        seedSampleData().catch(() => {});
      }
    }
    next();
  } catch (err: any) {
    console.error('Database connection error in Serverless:', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Database connection failed. Please verify DATABASE_URL and MongoDB Atlas Network Access (0.0.0.0/0).',
      error: err?.message || String(err),
    });
  }
});

// API router
app.use('/api/v1', router);

// Live response / Health check
app.get('/', (req: Request, res: Response) => {
  const date = new Date(Date.now());
  if (global.socketServer) {
    global.socketServer.emit('message', 'Doctor Tracker server is active!');
  }
  res.send(`
    <div style="text-align:center; padding: 40px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <h1 style="color: #0284c7;">Doctor Tracker API Server</h1>
      <p style="color: #16a34a; font-weight: bold;">Status: Alive and Running</p>
      <p style="color: #64748b;">Current Time: ${date.toLocaleString()}</p>
    </div>
  `);
});

// Global error handler
app.use(globalErrorHandler);

// Handle not found routes
app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: 'Not found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API DOESN'T EXIST",
      },
    ],
  });
});

export default app;
