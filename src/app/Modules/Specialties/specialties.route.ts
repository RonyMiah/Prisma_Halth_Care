import express, { NextFunction, Request, Response } from 'express';
import { SpecialtiesControllers } from './specialties.controller';
import { fileUploader } from '../../../shared/fileUploader';
import { SpecialTiesValidation } from './specialties.validation';

const router = express.Router();

router.post(
  '/',
  fileUploader.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = SpecialTiesValidation.createSpecialties.parse(
      JSON.parse(req.body.data)
    );
    next();
  },
  SpecialtiesControllers.createSpecialties
);

router.get('/', SpecialtiesControllers.getSpecialties);
router.delete('/:id', SpecialtiesControllers.deleteSpecialties);

export const specialtiesRoutes = router;
