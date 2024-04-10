import express from 'express';
import { DoctorScheduleControllers } from './doctorSchedule.controller';
import auth from '../../middleWares/auth';
import { userRole } from '@prisma/client';

const router = express.Router();

router.get('/', auth(userRole.DOCTOR), DoctorScheduleControllers.getAllFromDB);

router.post(
  '/',
  auth(userRole.DOCTOR),
  DoctorScheduleControllers.createDoctorSchedule
);

export const DoctorScheduleRoutes = router;
