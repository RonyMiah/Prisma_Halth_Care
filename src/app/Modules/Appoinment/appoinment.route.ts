import express from 'express';
import { AppoinmentControllers } from './appoinment.contorller';
import auth from '../../middleWares/auth';
import { userRole, Admin } from '@prisma/client';

const router = express.Router();

router.get(
  '/',
  auth(userRole.ADMIN, userRole.SUPPER_ADMIN),
  AppoinmentControllers.getAllAppointment
);
router.get(
  '/my-appointment',
  auth(userRole.PATIENT),
  AppoinmentControllers.getMyAppointment
);
router.post(
  '/',
  auth(userRole.PATIENT),
  AppoinmentControllers.createAppoinment
);

router.patch('/status/:id',auth(userRole.ADMIN, userRole.DOCTOR), AppoinmentControllers.changeAppoinmentStatus);

export const AppoinmentRoutes = router;
