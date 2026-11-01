import path from 'path';
import DailyRotateFile from 'winston-daily-rotate-file';
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const myFormat = printf(
  ({
    level,
    message,
    label,
    timestamp,
  }: {
    level: string;
    message: string;
    label: string;
    timestamp: Date;
  }) => {
    const date = new Date(timestamp);
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return `${date.toDateString()} ${hour}:${minutes}:${seconds} [${label}] ${level}: ${message}`;
  }
);

const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

const loggerTransports: any[] = [new transports.Console()];
const errorTransports: any[] = [new transports.Console()];

if (!isVercel) {
  try {
    loggerTransports.push(
      new DailyRotateFile({
        filename: path.join(
          process.cwd(),
          'winston',
          'success',
          '%DATE%-success.log'
        ),
        datePattern: 'DD-MM-YYYY-HH',
        maxSize: '20m',
        maxFiles: '1d',
      })
    );

    errorTransports.push(
      new DailyRotateFile({
        filename: path.join(
          process.cwd(),
          'winston',
          'error',
          '%DATE%-error.log'
        ),
        datePattern: 'DD-MM-YYYY-HH',
        maxSize: '20m',
        maxFiles: '1d',
      })
    );
  } catch (err) {
    console.warn('Winston DailyRotateFile setup skipped:', err);
  }
}

const logger = createLogger({
  level: 'info',
  format: combine(label({ label: 'SERVER-NAME' }), timestamp(), myFormat),
  transports: loggerTransports,
});

const errorLogger = createLogger({
  level: 'error',
  format: combine(label({ label: 'SERVER-NAME' }), timestamp(), myFormat),
  transports: errorTransports,
});

export { errorLogger, logger };
