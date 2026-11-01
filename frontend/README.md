# Doctor Tracker — Frontend Web Portal

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-cyan?logo=tailwindcss)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Charts-Recharts-purple)](https://recharts.org/)

Modern, clinical-grade administrative web application for Doctor Tracker. Built with Next.js 16 (App Router), React 19, and Tailwind CSS v4 to provide a responsive, high-performance experience for healthcare administrators.

---

## Features

- **Administrative Dashboard:** Live ecosystem metrics (total practitioners, active patients, capacity ratios), dynamic Recharts data visualizations, and recent admission velocity feeds.
- **Doctor Directory & Details:** Searchable, filterable doctor tables with pagination, specialization tags, and dedicated profile pages (`/doctors/[id]`) with patient roster management.
- **Patient Roster & Clinical Profiles:** Comprehensive patient management (`/patients/[id]`) with real-time condition switches, attending physician linkage, inline clinical notes editor, and contact cards.
- **Instant Server-Side Revalidation:** Leverages Next.js 16 Server Actions and `revalidatePath` to synchronize data across screens without manual browser reloads.
- **Shimmer Skeletons:** Animated pulse skeletons on all route transitions (`loading.tsx`) to eliminate layout shift.
- **Custom Modals:** Branded, accessible `DeleteConfirmModal` replacing browser alerts for high-risk actions.
- **Responsive Architecture:** Pinned desktop sidebar with independent scrollable main content, mobile drawer navigation, and accessible forms.

---

## Tech Stack

- **Framework:** Next.js 16.4 (App Router)
- **Library:** React 19
- **Styling:** Tailwind CSS v4 & PostCSS
- **Visualizations:** Recharts 3.10
- **Icons:** Lucide React
- **Notifications:** Sonner
- **Forms & Validation:** React Hook Form & Zod

---

## Getting Started

### 1. Installation
```bash
npm install
```

### 2. Environment Configuration
Create a `.env.local` file from `.env.example`:
```bash
cp .env.example .env.local
```

**Environment Variables (`.env.example`):**
```env
BASE_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_BASE_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SERVER_URL=http://localhost:5000
```
*(For production, update the URLs to point to your live backend API).*

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## Component Architecture

```
frontend/src/
├── app/
│   ├── (auth)/login/             # Dedicated authentication route
│   └── (dashboard)/              # Protected administrative layout
│       ├── dashboard/            # Analytics dashboard & loading.tsx
│       ├── doctors/              # Doctor directory, loading.tsx & [id]/
│       └── patients/             # Patient directory, loading.tsx & [id]/
├── components/
│   ├── dashboard/                # Metric cards, activity feed, charts
│   ├── doctors/                  # Doctor table, details client, forms
│   ├── patients/                 # Patient table, details client & subcomponents:
│   │   └── details/              # Action bar, hero, stats, contact, notes
│   ├── layout/                   # Pinned sidebar & header navigation
│   └── ui/                       # Reusable buttons, badges, modals, skeletons
├── helpers/next-fetch/           # Server actions & REST API integration
└── types/                        # TypeScript domain interfaces
```
