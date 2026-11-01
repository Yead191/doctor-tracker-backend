# Doctor Tracker — Backend API Server

[![Express.js](https://img.shields.io/badge/Express.js-4.19-green?logo=express)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%208-emerald?logo=mongodb)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT%20%2B%20Bcrypt-orange)](https://jwt.io/)

Dedicated, high-performance RESTful API server for the Doctor Tracker healthcare administrative management portal.

---

## Features

- **Authentication & Authorization:** Secure JWT-based authentication with bcrypt password hashing and role-based access control (`SUPER_ADMIN`, `ADMIN`, `USER`).
- **Doctor Management:** Full CRUD operations for medical practitioners, specialization tracking, and patient roster assignments.
- **Patient Management:** Comprehensive patient lifecycle records, medical condition tracking, attending doctor linkage, and clinical notes.
- **Data Analytics & Aggregation:** High-performance MongoDB aggregation pipelines for instant dashboard statistics, condition distributions, and admission timelines.
- **QueryBuilder Engine:** Standardized multi-field searching, sorting, pagination, and date-range filtering with compound indexing.
- **File Handling:** Multipart form-data handling via Multer with file streaming.
- **Security & Reliability:** IP-based rate limiting, input validation via Zod schemas, Winston structured logging, and centralized error handling.
- **Vercel Serverless Ready:** Pre-configured with `vercel.json` and `api/index.ts` for deployment on Vercel or traditional persistent Node.js servers (Docker / Render / Railway).

---

## Tech Stack

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js 4.19
- **Language:** TypeScript 5.5
- **Database:** MongoDB via Mongoose 8
- **Validation:** Zod schemas
- **Logging:** Winston & Morgan
- **Security:** Cors, Bcrypt, Express Rate Limit, JWT

---

## Getting Started

### 1. Installation
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

**Environment Variables:**
```env
# Basic Configuration
NODE_ENV=development
DATABASE_URL=mongodb+srv://<username>:<password>@cluster0.pjwkg.mongodb.net/doctorTrackerDB?retryWrites=true&w=majority
IP_ADDRESS=0.0.0.0
PORT=5000
PROJECT_NAME="Doctor Tracker Backend"

# Security & Encryption
BCRYPT_SALT_ROUNDS=12
JWT_SECRET=doctor_tracker_super_secure_jwt_secret_key_2026
JWT_EXPIRE_IN=30d

# Initial Super Admin Credentials
SUPER_ADMIN_EMAIL=admin@doctortracker.com
SUPER_ADMIN_PASSWORD=Admin@123456
```

### 3. Run Development Server
```bash
npm run dev
```
*The server will start on `http://localhost:5000`. On first start, it automatically connects to MongoDB, seeds the initial super admin account, and inserts sample doctor & patient records.*

### 4. Build for Production
```bash
npm run build
npm start
```

---

## REST API Endpoints Overview

All routes are prefixed with `/api/v1`:

| Module | Method | Endpoint | Description |
|---|---|---|---|
| **Auth** | `POST` | `/api/v1/auth/login` | Super admin and staff login |
| **Auth** | `POST` | `/api/v1/auth/refresh-token` | Renew expired JWT token |
| **Doctors** | `GET` | `/api/v1/doctors` | Paginated doctors list with filters |
| **Doctors** | `GET` | `/api/v1/doctors/:id` | Doctor profile with assigned patients |
| **Doctors** | `POST` | `/api/v1/doctors` | Create doctor (with optional photo) |
| **Doctors** | `PATCH` | `/api/v1/doctors/:id` | Update doctor details |
| **Doctors** | `DELETE` | `/api/v1/doctors/:id` | Remove doctor record |
| **Doctors** | `POST` | `/api/v1/doctors/:id/assign-patient` | Assign patient to doctor |
| **Doctors** | `DELETE` | `/api/v1/doctors/:id/remove-patient/:patientId` | Unassign patient from doctor |
| **Patients** | `GET` | `/api/v1/patients` | Paginated patient roster with filters |
| **Patients** | `GET` | `/api/v1/patients/:id` | Patient details and clinical notes |
| **Patients** | `POST` | `/api/v1/patients` | Register new patient |
| **Patients** | `PATCH` | `/api/v1/patients/:id` | Update patient records & condition |
| **Patients** | `DELETE` | `/api/v1/patients/:id` | Delete patient record |
| **Dashboard**| `GET` | `/api/v1/dashboard/stats` | Aggregated metrics for charts |

---

## Serverless Deployment on Vercel

The backend includes native Vercel serverless support:
1. `vercel.json` configures the routing to `@vercel/node`.
2. `api/index.ts` handles serverless database connection caching and request dispatching.
3. In MongoDB Atlas, ensure **Network Access** allows `0.0.0.0/0`.
4. On Vercel, set the **Root Directory** to `backend`, supply your environment variables, and deploy.
