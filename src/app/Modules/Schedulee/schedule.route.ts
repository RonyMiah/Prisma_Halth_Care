import express from 'express';
import { ScheduleControllers } from './schedule.controller';
import auth from '../../middleWares/auth';
import { userRole } from '@prisma/client';

const router = express.Router();

router.get('/', auth(userRole.DOCTOR), ScheduleControllers.getAllFromDB);
router.post(
  '/',
  auth(userRole.SUPPER_ADMIN, userRole.ADMIN),
  ScheduleControllers.createSchedule
);

//task Done
router.get('/:id', ScheduleControllers.getSingleSchedule);
router.delete('/:id', ScheduleControllers.deleteSchedule);

export const ScheduleRoutes = router;
