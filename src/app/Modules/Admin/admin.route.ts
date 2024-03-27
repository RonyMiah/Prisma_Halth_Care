import { AdminValidationSchemas } from './admin.validation';
import express, { NextFunction, Request, Response } from 'express';
import { AdminController } from './admin.controller';
import validateRequest from '../../middleWares/validateRequest';
import auth from '../../middleWares/auth';
import { userRole } from '@prisma/client';

const router = express.Router();

router.get(
  '/',
  auth(userRole.ADMIN, userRole.SUPPER_ADMIN),
  AdminController.getAllDataFromDB
);
router.get(
  '/:id',
  auth(userRole.ADMIN, userRole.SUPPER_ADMIN),
  AdminController.getSingleDataFromDB
);
router.patch(
  '/:id',
  auth(userRole.ADMIN, userRole.SUPPER_ADMIN),
  validateRequest(AdminValidationSchemas.updateValidation),
  AdminController.updateDataFromDB
);
router.delete(
  '/:id',
  auth(userRole.ADMIN, userRole.SUPPER_ADMIN),
  AdminController.deleteDataFromDB
);
router.delete(
  '/soft/:id',
  auth(userRole.ADMIN, userRole.SUPPER_ADMIN),
  AdminController.softDeleted
);

export const AdminRouter = router;
