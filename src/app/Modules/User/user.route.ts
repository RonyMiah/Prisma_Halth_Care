import express, { NextFunction, Request, Response } from 'express';
import { userController } from './user.controller';
import { userRole } from '@prisma/client';
import auth from '../../middleWares/auth';
import { fileUploader } from '../../../shared/fileUploader';
import { userValidation } from './user.validation';

const router = express.Router();

router.post(
  '/create-admin',
  auth(userRole.ADMIN, userRole.SUPPER_ADMIN),
  fileUploader.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createAdmin.parse(JSON.parse(req.body.data));
    next();
  },
  userController.createAdmin
);
router.post(
  '/create-doctor',
  auth(userRole.ADMIN, userRole.SUPPER_ADMIN),
  fileUploader.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createDoctor.parse(JSON.parse(req.body.data));
    next();
  },
  userController.createDoctor
);

export const userRouter = router;
