import express, { NextFunction, Request, Response } from 'express';
import { userController } from './user.controller';
import { userRole } from '@prisma/client';
import auth from '../../middleWares/auth';
import { fileUploader } from '../../../shared/fileUploader';
import { userValidation } from './user.validation';
import validateRequest from '../../middleWares/validateRequest';

const router = express.Router();

router.get(
  '/',
  auth(userRole.ADMIN, userRole.SUPPER_ADMIN),
  userController.getAllDataFromDB
);
router.get(
  '/me',
  auth(
    userRole.ADMIN,
    userRole.DOCTOR,
    userRole.PATIENT,
    userRole.SUPPER_ADMIN
  ),
  userController.getMe
);

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
router.patch(
  '/update-my-profile',
  auth(
    userRole.ADMIN,
    userRole.SUPPER_ADMIN,
    userRole.DOCTOR,
    userRole.PATIENT
  ),
  fileUploader.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  userController.updateProfile
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

router.post(
  '/create-patient',
  fileUploader.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createPatient.parse(JSON.parse(req.body.data));
    next();
  },
  userController.createPatient
);

router.patch(
  '/:id/status',
  auth(userRole.ADMIN, userRole.SUPPER_ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    validateRequest(userValidation.updateProfileValidation);
    next();
  },
  userController.changeProfileStatus
);

export const userRouter = router;
