import express from 'express';
import { ReviewsControllers } from './review.controller';
import auth from '../../middleWares/auth';
import { userRole } from '@prisma/client';

const router = express.Router();

router.get(
  '/',
  auth(userRole.ADMIN, userRole.SUPPER_ADMIN),
  ReviewsControllers.getAllReview
);
router.post('/', auth(userRole.PATIENT), ReviewsControllers.createReviews);

export const ReviewRoutes = router;
