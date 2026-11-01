import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  ip_address: process.env.IP_ADDRESS,
  database_url: process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/doctor-tracker',
  backup_database_url: process.env.BACKUP_DATABASE_URL,
  node_env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS || 12,
  jwt: {
    jwt_secret: process.env.JWT_SECRET || 'doctor_tracker_jwt_secret',
    jwt_expire_in: process.env.JWT_EXPIRE_IN || '30d',
  },
  email: {
    from: process.env.EMAIL_FROM,
    user: process.env.EMAIL_USER,
    port: process.env.EMAIL_PORT,
    host: process.env.EMAIL_HOST,
    pass: process.env.EMAIL_PASS,
  },
  super_admin: {
    email: process.env.SUPER_ADMIN_EMAIL || 'admin@doctortracker.com',
    password: process.env.SUPER_ADMIN_PASSWORD || 'Admin@123456',
  },
};
