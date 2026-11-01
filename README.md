# Doctor Tracker

## Description
Doctor Tracker is a secure, high-performance administrative web application designed for healthcare facilities to effortlessly manage doctors, their assigned patients, and operational healthcare data. Built with a robust full-stack architecture, it provides role-based authentication, doctor-patient record management, date-wise filtering, and an interactive analytics dashboard featuring real-time data aggregation and visualizations.

---

## System Architecture
The application follows a modern decoupled full-stack architecture:

```
[ Frontend: Next.js (App Router / React) ]
                   │
                   │ REST API / JSON / FormData
                   ▼
[ Backend: Node.js / Express (TypeScript) ]
         ├── JWT Auth & Role Middleware
         ├── File Upload Handler (Multer)
         ├── QueryBuilder & Aggregation Services
         └── Global Error Handling
                   │
                   │ Mongoose ODM
                   ▼
        [ Database: MongoDB ]
  (Indexed Collections: Users, Doctors, Patients)
```

---

## Setup Guide

### Prerequisites
- Node.js (v18.x or later)
- MongoDB Server running locally or MongoDB Atlas connection URI
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/Yead191/doctor-tracker.git
cd doctor-tracker
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Configure your environment variables by creating `.env` from `.env.example`:
```bash
cp .env.example .env
```

**Environment Variables (`.env.example`):**
```env
# Basic Configuration
NODE_ENV=development
DATABASE_URL=mongodb://127.0.0.1:27017/doctor-tracker
IP_ADDRESS=0.0.0.0
PORT=5000
PROJECT_NAME="Doctor Tracker Backend"

# Bcrypt & Security
BCRYPT_SALT_ROUNDS=12

# JWT Authentication
JWT_SECRET=doctor_tracker_super_secure_jwt_secret_key_2026
JWT_EXPIRE_IN=30d

# Initial Super Admin Credentials
SUPER_ADMIN_EMAIL=admin@doctortracker.com
SUPER_ADMIN_PASSWORD=Admin@123456
```

Start the backend development server:
```bash
npm run dev
```
*The server will start on `http://localhost:5000` and automatically seed the initial Super Admin account and sample doctors & patients for instant visualization.*

---

## Technical Decisions

### 1. Standalone Express & Node.js Architecture with Decoupled Next.js Client
- **Decision:** Separate Express.js server for API processing and MongoDB communication from the Next.js frontend client application.
- **Rationale:** Ensures clean separation of concerns, independent scalability, and adherence to RESTful design standards. This isolation enables granular performance tuning for heavy MongoDB aggregation pipelines without blocking frontend server-side rendering or edge caching.

### 2. Custom Mongoose QueryBuilder with MongoDB Compound Indexing
- **Decision:** Built a reusable `QueryBuilder` class and optimized MongoDB indexes (`{ doctor: 1, createdAt: -1 }`, text indexes, and single-field indexes).
- **Rationale:** Prevents N+1 query problems and redundant code across endpoints, standardizing pagination, searching, sorting, and date-range filtering. Compound indexes guarantee sub-millisecond lookups for patient lists under specific doctors.

---

## Repository Structure
```
doctor-tracker/
├── backend/               # Standalone Node.js & Express REST API
│   ├── src/
│   │   ├── app/
│   │   │   ├── builder/   # QueryBuilder & AggregateQueryBuilder
│   │   │   ├── middlewares/# Auth, Upload, Validation, Global Error
│   │   │   └── modules/   # Auth, User, Doctor, Patient, Dashboard
│   │   ├── config/        # Environment configurations
│   │   ├── DB/            # Seed initial admin & sample analytics data
│   │   ├── routes/        # Central API routing
│   │   └── server.ts      # Server bootstrap & socket initialization
│   └── package.json
└── README.md
```
