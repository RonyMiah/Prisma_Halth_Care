import express from 'express';
import { PatientControllers } from './patient.controller';

const router = express.Router();

router.get('/', PatientControllers.getAllFromDB);
router.get('/:id', PatientControllers.getByIdFromDB);
router.patch('/:id', PatientControllers.updateIntoDB);
router.delete('/:id', PatientControllers.deleteFromDB);
router.delete('/soft/:id', PatientControllers.softDeleteFromDB);

export const PatientRoutes = router;
