import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { DashboardController } from './dashboard.controller';

const router = express.Router();

router.get(
  '/analytics',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER),
  DashboardController.getDashboardAnalytics
);

export const DashboardRoutes = router;

