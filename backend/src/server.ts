import mongoose from 'mongoose';
import app from './app';
import config from './config';
import { errorLogger, logger } from './shared/logger';
import colors from 'colors';
import { socketHelper } from './helpers/socketHelper';
import { Server } from 'socket.io';
import { seedSuperAdmin } from './DB/seedAdmin';
import { seedSampleData } from './DB/seedData';
import { setupCluster } from './config/cluster/node.cluster';
import cluster from 'cluster';

if (cluster.isPrimary) {
  process.on('uncaughtException', (error) => {
    errorLogger.error('Master uncaughtException Detected', error);
    process.exit(1);
  });

  process.on('unhandledRejection', (error) => {
    errorLogger.error('Master unhandledRejection Detected', error);
    process.exit(1);
  });
}

// Main function - runs in worker processes or standalone in dev
export async function main() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.database_url as string);
    logger.info(colors.green('🚀 MongoDB connected successfully'));

    // Seed initial Super Admin
    await seedSuperAdmin();

    // Seed initial sample data for doctors and patients
    await seedSampleData();

    // Start HTTP server
    const port = typeof config.port === 'number' ? config.port : Number(config.port) || 5000;
    const ip = config.ip_address || '0.0.0.0';

    const server = app.listen(port, ip, () => {
      logger.info(
        colors.bold.italic.bgGreen(`♻️ Doctor Tracker Server listening on ${ip}:${port}`)
      );
    });

    // Setup Socket.IO
    const io = new Server(server, {
      pingTimeout: 60000,
      cors: {
        origin: '*',
      },
    });

    socketHelper.socket(io);

    // Store in global for graceful shutdown
    global.httpServer = server;
    global.socketServer = io;

    // Notify master that worker is ready
    if (cluster.worker) {
      process.send?.('ready');
    }

    return server;
  } catch (error) {
    errorLogger.error(colors.red('🤢 Failed to start server:'), error);
    throw error;
  }
}

// Bootstrap function
async function bootstrap() {
  try {
    if (config.node_env === 'production') {
      setupCluster();
    } else {
      logger.info(colors.yellow('⚡ Running in development mode'));
      await main();
    }
  } catch (error) {
    errorLogger.error(colors.red('🤢 Failed to bootstrap application:'), error);
    process.exit(1);
  }
}

// Start application
bootstrap();
