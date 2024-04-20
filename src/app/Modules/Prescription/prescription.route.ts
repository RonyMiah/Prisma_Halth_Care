import express from 'express';
import { PrescriptionControllers } from './prescription.controller';
import auth from '../../middleWares/auth';
import { userRole } from '@prisma/client';

const router = express.Router();

router.post('/', auth(userRole.DOCTOR), PrescriptionControllers.insertIntoDB);

router.get(
  '/my-prescription',
  auth(userRole.PATIENT),
  PrescriptionControllers.getAllFromDB
);

export const PrescriptionRoutes = router;
