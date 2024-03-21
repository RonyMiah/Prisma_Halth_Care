import express from 'express';
import { AdminController } from './admin.controller';

const router = express.Router();

router.get('/', AdminController.getAllDataFromDB);
router.get('/:id', AdminController.getSingleDataFromDB);
router.patch('/:id', AdminController.updateDataFromDB);
router.delete('/:id', AdminController.deleteDataFromDB);
router.delete('/soft/:id', AdminController.softDeleted);

export const AdminRouter = router;
