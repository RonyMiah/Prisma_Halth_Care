import express from 'express';
import { PaymentControllers } from './payment.controllers';

const router = express.Router();
router.get('/ipn', PaymentControllers.validatePayment);

router.post('/init-payment/:appoinmentId', PaymentControllers.initPayment);

export const PaymentRouters = router;
