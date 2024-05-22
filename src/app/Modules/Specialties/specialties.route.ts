import express, { NextFunction, Request, Response } from 'express';
import { SpecialtiesControllers } from './specialties.controller';
import { fileUploader } from '../../../shared/fileUploader';
import { SpecialTiesValidation } from './specialties.validation';
import auth from '../../middleWares/auth';
import { userRole } from '@prisma/client';

const router = express.Router();

router.post(
  '/',
  auth(userRole.ADMIN, userRole.SUPPER_ADMIN),
  fileUploader.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = SpecialTiesValidation.createSpecialties.parse(
      JSON.parse(req.body.data)
    );
    next();
  },
  SpecialtiesControllers.createSpecialties
);

router.get(
  '/',
  auth(userRole.ADMIN, userRole.SUPPER_ADMIN),
  SpecialtiesControllers.getSpecialties
);
router.delete('/:id', SpecialtiesControllers.deleteSpecialties);

export const specialtiesRoutes = router;
