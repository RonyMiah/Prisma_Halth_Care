import express from 'express';
import { AuthControllers } from './auth.controller';
import auth from '../../middleWares/auth';
import { userRole } from '@prisma/client';

const router = express.Router();

router.post('/login', AuthControllers.loginUser);
router.post('/refresh-token', AuthControllers.refreshTokenn);
router.post(
  '/change-password',
  auth(
    userRole.ADMIN,
    userRole.DOCTOR,
    userRole.PATIENT,
    userRole.SUPPER_ADMIN
  ),
  AuthControllers.changePassword
);

router.post('/forgot-password', AuthControllers.forgotPassword);
router.post('/reset-password', AuthControllers.resetPassword);

export const AuthRoutes = router;
