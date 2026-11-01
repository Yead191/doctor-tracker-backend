import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { DoctorRoutes } from '../app/modules/doctor/doctor.route';
import { PatientRoutes } from '../app/modules/patient/patient.route';
import { DashboardRoutes } from '../app/modules/dashboard/dashboard.route';

const router = express.Router();

const apiRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/doctors',
    route: DoctorRoutes,
  },
  {
    path: '/patients',
    route: PatientRoutes,
  },
  {
    path: '/dashboard',
    route: DashboardRoutes,
  },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
