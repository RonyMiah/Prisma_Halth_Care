import express from 'express';
import { DoctorScheduleControllers } from './doctorSchedule.controller';
import auth from '../../middleWares/auth';
import { userRole } from '@prisma/client';

const router = express.Router();

router.get(
  '/my-schedule',
  auth(userRole.DOCTOR),
  DoctorScheduleControllers.getMySchedule
);
//task done
router.get(
  '/',
  auth(userRole.DOCTOR),
  DoctorScheduleControllers.getAllSchedule
);

router.post(
  '/',
  auth(userRole.DOCTOR),
  DoctorScheduleControllers.createDoctorSchedule
);
router.delete(
  '/:id',
  auth(userRole.DOCTOR),
  DoctorScheduleControllers.deleteFromDB
);

export const DoctorScheduleRoutes = router;
