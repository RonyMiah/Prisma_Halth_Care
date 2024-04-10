import express from 'express';
import { ScheduleControllers } from './schedule.controller';
import auth from '../../middleWares/auth';
import { userRole } from '@prisma/client';

const router = express.Router();

router.post(
  '/',
  auth(userRole.SUPPER_ADMIN, userRole.ADMIN),
  ScheduleControllers.createSchedule
);

export const ScheduleRoutes = router;
