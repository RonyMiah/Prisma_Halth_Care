import express from 'express';
import auth from '../../middleWares/auth';
import { DoctorController } from './doctor.controller';
import { userRole } from '@prisma/client';
import validateRequest from '../../middleWares/validateRequest';
import { DoctorValidation } from './doctor.validation';

const router = express.Router();

router.get('/', DoctorController.getAllDataFromDB);
router.get('/:id', DoctorController.getSingleDataFromDB);
router.patch(
  '/:id',
  auth(userRole.SUPPER_ADMIN, userRole.ADMIN, userRole.DOCTOR),
  validateRequest(DoctorValidation.update),
  DoctorController.updateDataFromDB
);

router.delete(
  '/:id', 
  auth(userRole.ADMIN, userRole.SUPPER_ADMIN),
  DoctorController.deleteDataFromDB
);

router.delete(
  '/soft/:id',
  auth(userRole.ADMIN, userRole.SUPPER_ADMIN),
  DoctorController.softDeleted
);

export const doctorRoutes = router;
