import express from 'express';
import { MetaControllers } from './meta.controller';
import auth from '../../middleWares/auth';
import { userRole } from '@prisma/client';

const router = express.Router();

router.get(
  '/',
  auth(
    userRole.ADMIN,
    userRole.DOCTOR,
    userRole.PATIENT,
    userRole.SUPPER_ADMIN
  ),
  MetaControllers.fetchDatabaseMetadata
);

export const MetaRoutes = router;
